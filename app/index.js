//TODO: Add 'No user' on unequipping the watch (not on body)
//TODO: Refactor / Separate
import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

import * as messaging from "messaging"; //settings

import { display } from "display"; //turned off/on
import { HeartRateSensor } from "heart-rate"; //bpm
import { BodyPresenceSensor } from "body-presence"; //onWrist

import { me as appbit } from "appbit"; //part of using today
import { today } from "user-activity"; //steps, elevation, goals, ...
import { user } from "user-profile"; //resting heart rate, gender, age, bmr, stride, weight, height, ...
  //also heartRateZone: Returns: "out-of-range" or "fat-burn" or "cardio" or "peak" or "below-custom" or "custom" or "above-custom"

//GPS
//import { geolocation } from "geolocation";

//Battery
import { battery } from "power";

// Update the clock every minute
clock.granularity = "minutes";

const Console = document.getElementById("console");

// Get a handle on the <text> element
const background = document.getElementById("background");

const clockLabel = document.getElementById("clock");
const dateLabel = document.getElementById("date");

const vaultBoy = document.getElementById("vault-boy");

const dweller = document.getElementById("dweller");

//const latitude = document.getElementById("latitude");
//const longitude = document.getElementById("longitude");
//const heading = document.getElementById("heading");

const lvl = document.getElementById("lvl");

const steps = document.getElementById("steps");
const minutes = document.getElementById("minutes");
const burn = document.getElementById("burn");
const distance = document.getElementById("distance");
const elevation = document.getElementById("elevation");
const rhr = document.getElementById("resting");
const wt = document.getElementById("weight");

const bars = document.getElementsByClassName("v");

let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Update the <text> element every tick with the current time
clock.ontick = (evt) => { //Todo: add sensors to ticking? is that even needed?
  let today = evt.date;
  let hours = today.getHours();
  
  hours = util.zeroPad(hours);
  
  let mins = util.zeroPad(today.getMinutes());
  clockLabel.text = `${hours}:${mins}`;
  
  
  //TODO: Does this need to be within a tick? It only needs to update once a day at midnight...
  let months = util.zeroPad(today.getMonth()+1);
  let days = util.zeroPad(today.getDate());
  
  let date = today.getFullYear() + "-" + months + "-" + days + " " + dayNames[today.getDay()];
  dateLabel.text = date;  
  
  /*--- Battery charging ---*/
  lvl.width = battery.chargeLevel*1.54;
}

/*--- Settings ---*/

// Message is received
messaging.peerSocket.onmessage = evt => {
  //console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    background.style.fill = color;
  } else if (evt.data.key === "name" && evt.data.newValue) {
    let name = JSON.parse(evt.data.newValue);
    dweller.text = name.name;
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  //console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  //console.log("App Socket Closed");
};

/*--- Sensors ---*/

const sensors = [];

if (appbit.permissions.granted("access_heart_rate")) {
  const hrmData = document.getElementById("heart");

  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate ? hrm.heartRate : 0;
  });
  sensors.push(hrm);
  hrm.start();
}

//Todo: Condition this with onWrist
if (appbit.permissions.granted("access_activity")) {
  /*--- Today ---*/  
  steps.text = today.adjusted.steps;
  minutes.text = today.adjusted.activeZoneMinutes.total;
  burn.text = today.adjusted.calories;
  distance.text = (today.adjusted.distance/1000).toFixed(2);
  elevation.text = today.adjusted.elevationGain;
  
  rhr.text = "HP " + user.restingHeartRate;
  wt.text = user.weight + " KG";
}



/*--- Is the watch on a creature? ---*/

const bodyPresence = new BodyPresenceSensor();
bodyPresence.addEventListener("reading", () => {
  let i;
  
  if(bodyPresence.present) {
    for (i = 0; i < bars.length; i++) {
      bars[i].style.opacity = 1;
    }
    
    if(battery.charging) {
      Console.text = "> CHARGING ..."
    } else {
      Console.text = ""
    }
  } else {
    for (i = 0; i < bars.length; i++) {
      bars[i].style.opacity = 0;
    }
    
    if(battery.charging) {
      Console.text = "> CHARGING ..."
    } else {
      Console.text = "> USER NOT DETECTED"
    }
  }

});
sensors.push(bodyPresence);
bodyPresence.start();

/*--- Display ---*/
display.addEventListener("change", () => {
  // Probably better to run these things once when the screen turns on than every second...
  if(display.on) {
    wake();
  } else {
    sleep();
  }
});

function wake() {
  console.log("Display is on.");
  sensors.map(sensor => sensor.start()); //sensors
  updateStats();
}

function updateStats() {
  
}

function sleep() {
  console.log("Display is off.");  
  sensors.map(sensor => sensor.stop()); //sensors
}

battery.addEventListener("change", () => {
  // Battery changes
  
  lvl.width = battery.chargeLevel*1.54;
  
  if(battery.charging) {
    Console.text = "> CHARGING ...";
  } else if(!bodyPresence.present) {
    Console.text = "> USER NOT DETECTED";
  } else {
    Console.text = "";
  }
});