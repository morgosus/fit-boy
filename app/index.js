import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

import { display } from "display"; //turned off/on
import { HeartRateSensor } from "heart-rate"; //bpm
import { BodyPresenceSensor } from "body-presence"; //onWrist

import { me as appbit } from "appbit"; //part of using today
import { today } from "user-activity"; //steps, elevation, goals, ...

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const clockLabel = document.getElementById("clock");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
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
}

/*--- Sensors ---*/

const sensors = [];

const hrmData = document.getElementById("heart");

if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate ? hrm.heartRate + " bpm" : 0;
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmData.style.display = "{ ... }";
}


/*--- Stop ---*/
display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});