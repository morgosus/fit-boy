import document from "document";

import { me as appbit } from "appbit"; //part of using today
import { today } from "user-activity"; //steps, elevation, goals, ...
import { user } from "user-profile"; //resting heart rate, gender, age, bmr, stride, weight, height, ...

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

export function update() {
  steps.text = today.adjusted.steps;
  minutes.text = today.adjusted.activeZoneMinutes.total;
  burn.text = today.adjusted.calories;
  distance.text = (today.adjusted.distance/1000).toFixed(2);
  elevation.text = today.adjusted.elevationGain;

  rhr.text = "HP " + user.restingHeartRate;
  wt.text = user.weight + " KG";
   
  lvl.width = battery.chargeLevel*1.54;
}