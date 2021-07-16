//TODO: Add 'No user' on unequipping the watch (not on body)
//TODO: Refactor / Separate

//TODO: Battery efficiency - do some stuff only if there's enough battery left, reorganize when it reaches ... 20?

import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "./simple/utils";

import * as messaging from "messaging"; //settings

import { display } from "display"; //turned off/on
import { HeartRateSensor } from "heart-rate"; //bpm
import { BodyPresenceSensor } from "body-presence"; //onWrist

import { me as appbit } from "appbit"; //part of using today
import { today } from "user-activity"; //steps, elevation, goals, ...
import { user } from "user-profile"; //resting heart rate, gender, age, bmr, stride, weight, height, ...
//also heartRateZone: Returns: "out-of-range" or "fat-burn" or "cardio" or "peak" or "below-custom" or "custom" or "above-custom"

//Battery
import { battery } from "power";
import { memory } from "system";



// Get a handle on the <text> element
const background = document.getElementById("background");

const clockLabel = document.getElementById("clock");
const dateLabel = document.getElementById("date");

const vaultBoy = document.getElementById("vault-boy");

const dweller = document.getElementById("dweller");


const bars = document.getElementsByClassName("v");

const Console = document.getElementById("console");
const cursorStop = false;

let hours = 12;

function print(text) {
  if(text) {
    Console.text = ` > ${text} ▮`;
    return;
  } 

  if(hours >= 5 && hours < 12)
    print("GOOD MORNING");
  else if (hours >= 12 && hours < 17) //afternoon
    print("GOOD AFTERNOON");
  else if (hours >= 17 && hours < 19) //evening
    print("GOOD EVENING");
  else //night
    print("GOOD NIGHT");
}

function tickConsole(second) {
  //Keep text
  let text = Console.text;

  //Switch between a bar and a zero width space (U+200b)
  if(second % 2 == 0)
    Console.text =  text.replace("▮", "​");
  else
    Console.text = text.replace("​", "▮");
}

// Update the clock every minute
clock.granularity = "seconds";

let previousDay = 8;
// Update the <text> element every tick with the current time
clock.ontick = (evt) => { //Todo: add sensors to ticking? is that even needed?
  let today = evt.date;
  
  hours =  util.zeroPad(today.getHours());
  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());
  
  clockLabel.text = `${hours}:${mins}`;

  let dayNumber = 9;
  dayNumber = today.getDay();
  
  if(previousDay !== dayNumber) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    dayNumber = today.getDay();
    
    //it only really needs to happen once a day at midnight and during startup...
    console.log("Date udated.")
    let months = util.zeroPad(today.getMonth()+1);
  
    let days = util.zeroPad(today.getDate());
    let day = dayNames[dayNumber];
    let year = today.getFullYear();

    let date = `${day}   ${year}-${months}-${days}`;
  
    dateLabel.text = date;
    
    previousDay = dayNumber;
    
    let date, year, day, days, months, dayNumber, dayNames = null;
  }

  if(!cursorStop)
    tickConsole(secs);

  console.log(`JS memory: ${memory.js.used} / ${memory.js.total}, peak: ${memory.js.peak}.`);
}

/*--- Settings ---*/

// Message is received
messaging.peerSocket.onmessage = evt => {
  if (evt.data.key === "color" && evt.data.newValue)
    background.style.fill = JSON.parse(evt.data.newValue);
  else if (evt.data.key === "name" && evt.data.newValue)
    dweller.text = JSON.parse(evt.data.newValue).name;
  else if (evt.data.key === "cursor")
    cursorStop = JSON.parse(evt.data.newValue);
};

/*--- Sensors ---*/

const sensors = new Array(2);

const hrmData = document.getElementById("heart");
const hrm = new HeartRateSensor({ frequency: 1 });

function hrmInit() {
//TODO: bodyPresence.present

hrm.addEventListener("reading", () => {
  hrmData.text = hrm.heartRate ? hrm.heartRate : "--";
});
sensors.push(hrm);

hrm.start();
} hrmInit();

/*--- Is the watch on a creature? ---*/

const bodyPresence = new BodyPresenceSensor();

bodyPresence.addEventListener("reading", () => {
  let i;

  if(bodyPresence.present) {   
    for (i = 0; i < bars.length; i++) {
      bars[i].style.opacity = 1;
    }

    if(battery.charging)
      print("CHARGING");
    else
      print();
    
  } else { 
    hrmData.text = "--";
    
    
    for (i = 0; i < bars.length; i++) {
      bars[i].style.opacity = 0;
    }

    if(battery.charging)
      print("CHARGING");
    else
      print("USER NOT DETECTED");
  }

});

sensors.push(bodyPresence);
bodyPresence.start();

//Todo: Condition this with onWrist
  /*--- Today ---*/
 function updateStats() {
  const steps = document.getElementById("steps");
  const minutes = document.getElementById("minutes");
  const burn = document.getElementById("burn");
  const distance = document.getElementById("distance");
  const elevation = document.getElementById("elevation");
  const rhr = document.getElementById("resting");
  const wt = document.getElementById("weight");
   
  const lvl = document.getElementById("lvl");
  
  steps.text = today.adjusted.steps;
  minutes.text = today.adjusted.activeZoneMinutes.total;
  burn.text = today.adjusted.calories;
  distance.text = today.adjusted.distance + "m";
  elevation.text = today.adjusted.elevationGain;

  rhr.text = "HP " + user.restingHeartRate;
  wt.text = user.weight + " KG";
   
  lvl.width = battery.chargeLevel*1.54;
  
   console.log("Stats updated.");
} updateStats();


function wakeWatch() {
  turnSensorsOn();
  updateStats();
}

function sleepWatch() {
  turnSensorsOff()
}

function turnSensorsOn() {
  if(bodyPresence.present)
    sensors.map(sensor => sensor.start());
  else
    bodyPresence.start();
}

function turnSensorsOff() {
  sensors.map(sensor => sensor.stop());
}

/*--- Display ---*/
display.addEventListener("change", () => {
  // Probably better to run these things once when the screen turns on than every second...
  if(display.on) {
    console.log("Display on.");
    wakeWatch();
  } else {
    console.log("Display off.");
    sleepWatch();
  }
});

//TODO: DRY - CONSOLE
battery.addEventListener("change", () => {
  // Battery changes
  if(battery.charging)
      print("CHARGING");
  else if(!bodyPresence.present)
      print("USER NOT DETECTED");
  else
    print();
});