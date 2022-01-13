import document from "document";

import * as messaging from "messaging";

import * as stats from "./simple/stats";
import * as sensors from "./simple/sensors";
import * as clock from "./simple/clock";
import * as misc from "./simple/misc";

import {FitFont} from "./fitfont";

import { locale } from "user-settings";

const dweller = new FitFont({ id:'o', font:'Monofonto_16', halign: 'middle' });

/*--- Settings ---*/
messaging.peerSocket.onmessage = evt => {
  if (evt.data.key === "color" && evt.data.newValue)
    document.getElementById("b").style.fill = JSON.parse(evt.data.newValue);
  else if (evt.data.key === "bgop" && evt.data.newValue)
    document.getElementById("bg").style.opacity = JSON.parse(evt.data.newValue/100);
  else if (evt.data.key === "name" && evt.data.newValue) {
    dweller.text = JSON.parse(evt.data.newValue).name;
  }
  else if (evt.data.key === "gender") {
    console.log("Presence: " + sensors.presenceStatus());

    if(JSON.parse(evt.data.newValue) === true) {
      sensors.setGender("girl");

      if(sensors.presenceStatus()) {
        document.getElementById("v").href = "i/girl.png"
      } else {
        document.getElementById("v").href = "i/girl-absent.png"
      }
    } else {
      sensors.setGender("boy");

      if(sensors.presenceStatus()) {
        document.getElementById("v").href = "i/boy.png"
      } else {
        document.getElementById("v").href = "i/boy-absent.png"
      }
    }
  }
  else if (evt.data.key === "cursor")
    clock.importCursorSettings(JSON.parse(evt.data.newValue));
};

clock.init();

sensors.init();

stats.update();
