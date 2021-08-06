import document from "document";

import { gettext } from "i18n";

import clock from "clock";

import * as Console from "./console";
import {FitFont} from "../fitfont";

import { preferences } from "user-settings";

import { locale } from "user-settings";

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
const timeIndicator = new FitFont({id:'ti', font:'Monofonto_16'});

let cursorStop = false;

export function importCursorSettings(newValue) {
  cursorStop = newValue;
}


export function init() {
  clock.ontick = (evt) => {
    let today = evt.date;
    hour = today.getHours();
    
    let hours;
    let mins;
    
    if(preferences.clockDisplay === "12h") {
      hours = hour % 12 || 12;
      hours = zeroPad(hours);
      mins = zeroPad(today.getMinutes());
      timeIndicator.text = ( hour >= 12 ) ? 'PM' : 'AM';
      timeIndicator.style.display = "inline";
    } else {
      hours = zeroPad(hour);
      mins = zeroPad(today.getMinutes());
      timeIndicator.style.display = "none";
    }
    
    let secs = zeroPad(today.getSeconds());
  
    clockLbl.text = `${hours}:${mins}`;
    
    
    if(previousDay !== today.getDay())
      updateDate(today, previousDay);
    
    if(!cursorStop)
      Console.tick();
  }
}

function updateDate(today, previousDayNumber) {
  const dayNames = [gettext("su"), gettext("mo"), gettext("tu"), gettext("we"), gettext("th"), gettext("fr"), gettext("sa")];
  
  if(locale.language === 'ru-ru')
    const dateLbl = new FitFont({id:'d', font:'Oswald_16'});
  else
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