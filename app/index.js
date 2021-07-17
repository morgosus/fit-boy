//TODO: Add 'No user' on unequipping the watch (not on body)
//TODO: Refactor / Separate

//TODO: Battery efficiency - do some stuff only if there's enough battery left, reorganize when it reaches ... 20?

import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "./simple/utils";

import * as messaging from "messaging"; //settings

//Battery
import { memory } from "system";

import * as Console from "./simple/console";
import * as stats from "./simple/stats";
import * as sensors from "./simple/sensors";

const clockLabel = document.getElementById("t");
const dateLabel = document.getElementById("d");


/*--- Clock ---*/

const cursorStop = false;

let hours = 12;

// Update the clock every minute
clock.granularity = "seconds";

let previousDay = 8;
// Update the <text> element every tick with the current time
clock.ontick = (evt) => { //Todo: add sensors to ticking? is that even needed?
  let today = evt.date;
  
  hours =  util.zeroPad(today.getHours());
  
  Console.passHour(hours);
  
  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());
  
  clockLabel.text = `${hours}:${mins}`;

  let dayNumber = 9;
  dayNumber = today.getDay();
  
  if(previousDay !== dayNumber) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    dayNumber = today.getDay();
    
    //it only really needs to happen once a day at midnight and during startup...
    console.log("Date udated.")
    let months = util.zeroPad(today.getMonth()+1);
  
    let days = util.zeroPad(today.getDate());
    let day = dayNames[dayNumber];
    let year = today.getFullYear();

    let date = `${day}   ${year}-${months}-${days}`;
  
    dateLabel.text = date;
    
    previousDay = dayNumber;
    
    let date, year, day, days, months, dayNumber, dayNames = null;
  }

  if(!cursorStop)
    Console.tick();

  console.log(`JS memory: ${memory.js.used} / ${memory.js.total}, peak: ${memory.js.peak}.`);
}

/*--- Settings ---*/
const background = document.getElementById("b");
const dweller = document.getElementById("o");

messaging.peerSocket.onmessage = evt => {
  if (evt.data.key === "color" && evt.data.newValue)
    background.style.fill = JSON.parse(evt.data.newValue);
  else if (evt.data.key === "name" && evt.data.newValue)
    dweller.text = JSON.parse(evt.data.newValue).name;
  else if (evt.data.key === "cursor")
    cursorStop = JSON.parse(evt.data.newValue);
};

/*--- Sensors ---*/
sensors.init();

/*--- Stats ---*/
stats.update();


