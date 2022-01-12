import document from "document";

import { me as appbit } from "appbit"; //part of using today
import { today } from "user-activity"; //steps, elevation, goals, ...
import { user } from "user-profile"; //resting heart rate, gender, age, bmr, stride, weight, height, ...
import { goals } from "user-activity";
import { units } from "user-settings";

import { primaryGoal } from "user-activity";

import { battery } from "power";
//also heartRateZone: Returns: "out-of-range" or "fat-burn" or "cardio" or "peak" or "below-custom" or "custom" or "above-custom"

import {FitFont} from "../fitfont";

const steps = new FitFont({id:'s', font:'Monofonto_16'});
const minutes = new FitFont({id:'z', font:'Monofonto_16'});
const burn = new FitFont({id:'n', font:'Monofonto_16'});
const distance = new FitFont({id:'m', font:'Monofonto_16'});
const elevation = new FitFont({id:'e', font:'Monofonto_16'});
const rhr = new FitFont({id:'r', font:'Monofonto_16', halign: 'end'});
const wt = new FitFont({id:'w', font:'Monofonto_16'});
const lvl = document.getElementById('l');

const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const b4 = document.getElementById("b4");
const b5 = document.getElementById("b5");

export function update() {


  steps.text = today.adjusted.steps;
  minutes.text = today.adjusted.activeZoneMinutes.total;
  burn.text = today.adjusted.calories;

  if(units.distance === "metric") { // "metric" kilometers
    distance.text = (today.adjusted.distance/1000).toFixed(2) + " km";
  } else { // "us" miles
    distance.text = (today.adjusted.distance/1609).toFixed(2) + " km";
  }

  elevation.text = today.adjusted.elevationGain;

  rhr.text = `HP ${user.restingHeartRate}`;

  if(units.bodyWeight === "metric") { // "metric" kilograms
    wt.text = `${user.weight} KG`;
  } else if(units.bodyWeight === "us") { // "us" pounds
    wt.text = `${user.weight*2.205} LBS`;
  } else { //"stone" stones
    wt.text = `${user.weight/6.35} ST`;
  }

  batteryShow();
  
  levelShow();
}

function levelShow() {
  let goalProgress;
  
  if(primaryGoal === "activeZoneMinutes") {
    goalProgress = today.adjusted["activeZoneMinutes"].total / goals["activeZoneMinutes"].total;
  } else {
    goalProgress = today.adjusted[primaryGoal] / goals[primaryGoal];
  }
  
  if(goalProgress > 1)
    goalProgress = 1;
  
  lvl.width = goalProgress*154;
}

function batteryShow() {
  let charge = battery.chargeLevel;
  let mod = (charge % 20)*0.8;
  let rmd = 14 - mod;
  
  if(mod == 0 && charge != 0) {
    mod = 14;
    rmd = 0;
  }
  
  if(charge <= 20) { /* Charge under 20 */
    b1.style.opacity = 1;
    b2.style.opacity = 0;
    b3.style.opacity = 0;
    b4.style.opacity = 0;
    b5.style.opacity = 0;
    
    b1.height = mod;
    
    b1.y = 1 + rmd; 
  }
  else if(charge <= 40) {
    b1.style.opacity = 1;
    b2.style.opacity = 1;
    b3.style.opacity = 0;
    b4.style.opacity = 0;
    b5.style.opacity = 0;
    
    b1.height = 14;
    b2.height = mod;
    
    b1.y = 1; 
    b2.y = 1 + rmd; 
  }
  else if(charge <= 60) {
    b1.style.opacity = 1;
    b2.style.opacity = 1;
    b3.style.opacity = 1;
    b4.style.opacity = 0;
    b5.style.opacity = 0;
    
    b1.height = 14;
    b2.height = 14;
    b3.height = 1 + mod;
    
    b1.y = 1; 
    b2.y = 1; 
    b3.y = 1 + rmd; 
  }
  else if(charge <= 80) {
    b1.style.opacity = 1;
    b2.style.opacity = 1;
    b3.style.opacity = 1;
    b4.style.opacity = 1;
    b5.style.opacity = 0;
    
    b1.height = 14;
    b2.height = 14;
    b3.height = 14;
    b4.height = 1 + mod;
    
    b1.y = 1; 
    b2.y = 1; 
    b3.y = 1; 
    b4.y = 1 + rmd; 
  }
  else { /* Charge between 80 and 100 */
    b1.style.opacity = 1;
    b2.style.opacity = 1;
    b3.style.opacity = 1;
    b4.style.opacity = 1;
    b5.style.opacity = 1;
    
    b1.height = 14;
    b2.height = 14;
    b3.height = 14;
    b4.height = 14;
    b5.height = 1 + mod;
    
    b1.y = 1; 
    b2.y = 1; 
    b3.y = 1; 
    b4.y = 1; 
    b5.y = 1 + rmd; 
  }
  
  return;
}