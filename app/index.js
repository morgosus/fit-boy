//TODO: Add 'No user' on unequipping the watch (not on body)
//TODO: Refactor / Separate
import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

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
const clockLabel = document.getElementById("clock");
const dateLabel = document.getElementById("date");

const vaultBoy = document.getElementById("vault-boy");

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

// Update the <text> element every tick with the current time
clock.ontick = (evt) => { //Todo: add sensors to ticking? is that even needed?
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  clockLabel.text = `${hours}:${mins}`;


  //TODO: Does this need to be within a tick? It only needs to update once a day at midnight...
  let months = util.zeroPad(today.getMonth()+1);
  let days = util.zeroPad(today.getDate());

  let date = today.getFullYear() + "-" + months + "-" + days + " [" + today.getDay()+"/7]";
  dateLabel.text = date;

  //TODO: Same as above
  //geolocation.getCurrentPosition(function(position) {
  //  latitude.text = "Lat. " + position.coords.latitude
  //  longitude.text = "Long. " + position.coords.longitude
  //  heading.text = "Heading: " + position.coords.heading + "°"
  //})


  /*--- Battery charging ---*/
  lvl.width = battery.chargeLevel*1.54;
}

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

  rhr.text = "HP " + user.restingHeartRate;
  wt.text = "KG " + user.weight;
}



/*--- Is the watch on a creature? ---*/

const bodyPresence = new BodyPresenceSensor();
bodyPresence.addEventListener("reading", () => {
  let i;

  if(bodyPresence.present) {
    Console.text = ""
    for (i = 0; i < bars.length; i++) {
      bars[i].style.opacity = 1;
    }
  } else {
    Console.text = "> USER NOT DETECTED"
    for (i = 0; i < bars.length; i++) {
      bars[i].style.opacity = 0;
    }
  }

});
sensors.push(bodyPresence);
bodyPresence.start();

/*--- Stop ---*/
display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});

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