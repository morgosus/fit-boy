import document from "document";

import clock from "clock";

import * as Console from "./console";
import * as memory from "./memory";

clock.granularity = "seconds";

/*--- Misc ---*/
function zeroPad(i) {
  if (i < 10) {
      i = "0" + i;
  }
  return i;
}

/*--- Clock ---*/

let hour = 0;

export function getHour() {
  return hour;
}

let previousDay = 8;

const clockLabel = document.getElementById("t");
let cursorStop = false;

export function importCursorSettings(newValue) {
  cursorStop = newValue;
}

export function init() {
  clock.ontick = (evt) => {
    let today = evt.date;
    hour = today.getHours();
    let hours =  zeroPad(hour);
    let mins = zeroPad(today.getMinutes());
    let secs = zeroPad(today.getSeconds());
  
    clockLabel.text = `${hours}:${mins}`;
  
    if(previousDay !== today.getDay())
      updateDate(today, previousDay);
    
    if(!cursorStop)
      Console.tick();
  }
}

function updateClock() {
  
}

function updateDate(today, previousDayNumber) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let dayNumber = today.getDay();
  let dayOfWeek = dayNames[dayNumber];
  let dayOfMonth = zeroPad(today.getDate());
  let month = zeroPad(today.getMonth()+1);
  let year = today.getFullYear();

  let date = `${dayOfWeek}   ${year}-${month}-${dayOfMonth}`;
  
  document.getElementById("d").text = date;
    
  previousDay = dayNumber;

  date, year, day, days, months, dayNumber = null;
}