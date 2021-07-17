import document from "document";

import clock from "clock";

import * as Console from "./console";
import * as memory from "./memory";
import {FitFont} from "../fitfont";

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

const clockLbl = new FitFont({id:'t', font:'Monofonto_45'});

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
  
    clockLbl.text = `${hours}:${mins}`;
  
    if(previousDay !== today.getDay())
      updateDate(today, previousDay);
    
    if(!cursorStop)
      Console.tick();
  }
}

function updateDate(today, previousDayNumber) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const dateLbl = new FitFont({id:'d', font:'Monofonto_16'});

  let dayNumber = today.getDay();
  let dayOfWeek = dayNames[dayNumber];
  let dayOfMonth = zeroPad(today.getDate());
  let month = zeroPad(today.getMonth()+1);
  let year = today.getFullYear();

  dateLbl.text = `${dayOfWeek} ${year}-${month}-${dayOfMonth}`;
    
  previousDay = dayNumber;

  dayNumber, dayOfWeek, dayOfMonth, month, year = null;
}