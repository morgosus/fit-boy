import document from "document";

import * as sensors from "./sensors";
import * as clock from "./clock";


const c = document.getElementById("c");

let i = 0;

function say(what) {
    c.text = ` > ${what} ▮`;
}

export function tick() {
  let text = c.text;

  if(i === 0) {
    c.text =  text.replace("▮", "​"); //U+200b
    i = 1;
  }
  else {
    c.text = text.replace("​", "▮");
    i = 0;
  }
}

export function announce() {
  if(sensors.presenceStatus()) {
    greet();
  } else {
    if (sensors.chargingStatus()) {
      return say("CHARGING");
    }
    say("USER NOT DETECTED");
  }
  
  if(sensors.chargingStatus()) {
      return say("CHARGING");
  } else {
    if (sensors.presenceStatus()) {
      return 
    }
    
  }
}

function greet() {
  const hour = clock.getHour();
  
  if(hour >= 5 && hour < 12)
    say("GOOD MORNING");
  else if (hour >= 12 && hour < 17) //afternoon
    say("GOOD AFTERNOON");
  else if (hour >= 17 && hour < 22) //evening
    say("GOOD EVENING");
  else //night
    say("GOOD NIGHT");
}