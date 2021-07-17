import document from "document";

import { HeartRateSensor } from "heart-rate"; //bpm
import { BodyPresenceSensor } from "body-presence"; //onWrist
import { battery } from "power";
import { display } from "display"; //turned off/on

import * as Console from "./console";
import * as stats from "./stats";

import {FitFont} from "../fitfont";

const sensors = new Array(0);
const bodyPresence = new BodyPresenceSensor();
const hrm = new HeartRateSensor({ frequency: 1 });

const hrmData = new FitFont({id:'h', font:'Monofonto_16'});
const bars = document.getElementsByClassName("v");

export function init() {
  initHrm();
  initBp();
}

function initHrm() {
  
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate ? hrm.heartRate : "--";
  });
  sensors.push(hrm);

  hrm.start();
}

function hideBars(present) {
  let i = bars.length;
  
  if(present) {
    do {
      bars[i-1].style.opacity = 1;
    } while (--i);
    return;
  }
  do {
    bars[i-1].style.opacity = 0;
  } while (--i);
}

function initBp() {
  bodyPresence.addEventListener("reading", () => {
    let i;

    hideBars(bodyPresence.present);
    
    Console.announce();
  });

  bodyPresence.start();

  sensors.push(bodyPresence);
}

export function chargingStatus() {
  return battery.charging;
}

export function presenceStatus() {
  return bodyPresence.present;
}


function on() {
  if(bodyPresence.present)
    sensors.map(sensor => sensor.start());
  else
    bodyPresence.start();
}

function off() {
  sensors.map(sensor => sensor.stop());
}

export function wake() {
  on();
  stats.update();
}

export function sleep() {
  off();
}

/*--- Battery ---*/
battery.addEventListener("change", () => {
  Console.announce();
});

/*--- Display ---*/
display.addEventListener("change", () => {
  if(display.on) {
    wake();
  } else {
    sleep();
  }
});