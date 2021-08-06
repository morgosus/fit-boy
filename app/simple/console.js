import document from "document";

import { gettext } from "i18n";

import * as sensors from "./sensors";
import * as clock from "./clock";
import {FitFont} from "../fitfont";

import { locale } from "user-settings";

//import { memory } from "system";

if(locale.language === 'ru-ru')
  const c = new FitFont({id:'c', font:'Oswald_16'});
else
  const c = new FitFont({id:'c', font:'Monofonto_16'});


let i = 0;

function say(what) {
    c.text = ` > ${what} ▮`;
}

let z = 0;

export function tick() {
  let text = c.text;

  if(i === 0) {
    c.text =  text.replace("▮", "​"); //U+200b
    i = 1;
  } else {
    c.text = text.replace("​", "▮");
    i = 0;
  }
  
  //console.log(`JS memory: ${memory.js.used} / ${memory.js.total}, peak: ${memory.js.peak}.`);
}

export function announce() {
  if(sensors.presenceStatus()) {
    greet();
  } else {
    if (sensors.chargingStatus()) {
      return say(gettext("charging"));
    }
    say(gettext("user_not_detected"));
  }
  
  if(sensors.chargingStatus()) {
      return say(gettext("charging"));
  } else {
    if (sensors.presenceStatus()) {
      return 
    }
    
  }
}

function greet() {
  const hour = clock.getHour();
  
  if(hour >= 5 && hour < 12)
    say(gettext("morning"));
  else if (hour >= 12 && hour < 17) //afternoon
    say(gettext("afternoon"));
  else if (hour >= 17 && hour < 22) //evening
    say(gettext("evening"));
  else //night
    say(gettext("night"));
}