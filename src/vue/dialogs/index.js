import Vue from "vue";

const {
  SpinalMountExtention,
} = require("spinal-env-viewer-panel-manager-service");

import LinkParkDeviceToRoom from "./linkDeviceToRoom.vue";

const dialogs = [
  {
    name: "linkParkDeviceToRoomDialog",
    vueMountComponent: Vue.extend(LinkParkDeviceToRoom),
    parentContainer: document.body,
  },
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}
