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
const barsNeg = document.getElementsByClassName("v-");
const boy = document.getElementById("v");

let gender = "boy";

const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const t3 = document.getElementById("t3");
const t4 = document.getElementById("t4");
const t5 = document.getElementById("t5");

const dt = document.getElementById('d');

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
  let j = barsNeg.length;
  
  if(present) {
    boy.href = "i/"+gender+".png";

    do {
      bars[i-1].style.opacity = 1;
    } while (--i);
    boy.href = "i/"+gender+".png";
    
    do {
      barsNeg[j-1].style.opacity = 0;
    } while (--j);
    
    dt.x = 0;
    dt.y = 26;
    
    t1.y = 0;
    t2.y = 0;
    t3.style.display = "inline";
    t4.y = 0;
    t5.y = 0;
  
    t1.x = 0;
    t2.x = 0;
    t4.x = 0;
    t5.x = 0;
    
    return;
  }
  boy.href="i/"+gender+"-absent.png";
  
  do {
    bars[i-1].style.opacity = 0;
  } while (--i);
  
  do {
    barsNeg[j-1].style.opacity = 1;
  } while (--j);
    
  dt.x = 98;
  dt.y = 129;
  
  t1.y = 23;
  t2.y = 23;
  t3.style.display = "none";
  t4.y = 93;
  t5.y = 93;
  
  t1.x = 36;
  t2.x = 36;
  t4.x = -33;
  t5.x = -33;
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

export function setGender(newValue) {
  gender = newValue;
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