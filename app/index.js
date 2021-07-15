//TODO: Add 'No user' on unequipping the watch (not on body)
//TODO: Refactor / Separate
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


const Console = document.getElementById("console");

// Get a handle on the <text> element
const background = document.getElementById("background");

const clockLabel = document.getElementById("clock");
const dateLabel = document.getElementById("date");

const vaultBoy = document.getElementById("vault-boy");

const dweller = document.getElementById("dweller");

const lvl = document.getElementById("lvl");

const hrmData = document.getElementById("heart");

const bars = document.getElementsByClassName("v");

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Update the clock every minute
clock.granularity = "seconds";

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

  let day = dayNames[today.getDay()];
  let year = today.getFullYear();

  let date = day + " " + year + "-" + months + "-" + days;

  dateLabel.text = date;

  console.log("JS memory: " + memory.js.used + "/" + memory.js.total + ", peak: " + memory.js.peak + ", pressure: " + memory.js.pressure);
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

/*--- Sensors ---*/

const sensors = [];

//TODO: bodyPresence.present
const hrm = new HeartRateSensor({ frequency: 1 });
hrm.addEventListener("reading", () => {
  hrmData.text = hrm.heartRate ? hrm.heartRate : 0;
});
sensors.push(hrm);

hrm.start();

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

  steps.text = today.adjusted.steps;
  minutes.text = today.adjusted.activeZoneMinutes.total;
  burn.text = today.adjusted.calories;
  distance.text = (today.adjusted.distance/1000).toFixed(2);
  elevation.text = today.adjusted.elevationGain;

  rhr.text = "HP " + user.restingHeartRate;
  wt.text = user.weight + " KG";
  console.log("Stats updated.");
} updateStats();

/*--- Display ---*/
display.addEventListener("change", () => {
  // Probably better to run these things once when the screen turns on than every second...
  if(display.on) {
    console.log("Display on.");
    wake();
  } else {
    console.log("Display off.");
    sleep();
  }
});

function wake() {
  turnOn(sensors);
  updateStats();
}

function sleep() {
  turnOff(sensors);
}

function turnOn(callback) {
  callback.map(sensor => sensor.start());
}

function turnOff(callback) {
  callback.map(sensor => sensor.stop());
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