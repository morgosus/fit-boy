import document from "document";

import * as messaging from "messaging";

import * as stats from "./simple/stats";
import * as sensors from "./simple/sensors";
import * as clock from "./simple/clock";
import * as misc from "./simple/misc";

/*--- Settings ---*/
messaging.peerSocket.onmessage = evt => {
  if (evt.data.key === "color" && evt.data.newValue)
    document.getElementById("b").style.fill = JSON.parse(evt.data.newValue);
  else if (evt.data.key === "name" && evt.data.newValue)
    document.getElementById("o").text = JSON.parse(evt.data.newValue).name;
  else if (evt.data.key === "cursor")
    clock.importCursorSettings(JSON.parse(evt.data.newValue));
};

clock.init();

sensors.init();

stats.update();