import {
  SpinalContextApp,
  spinalContextMenuService,
} from "spinal-env-viewer-context-menu-service";

import geographicService from "spinal-env-viewer-context-geographic-service";

const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

const SIDEBAR = "GraphManagerSideBar";

class LinkParkDevicesToRoom extends SpinalContextApp {
  constructor() {
    super(
      "Link rooms to park Devices",
      "This button allows to Link Devices to rooms",
      {
        icon: "cast_connected",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF",
      }
    );
  }

  isShown(option) {
    const constants = geographicService.constants;
    const type = option.selectedNode.type.get();
    const types = [
      constants.CONTEXT_TYPE,
      constants.BUILDING_TYPE,
      constants.FLOOR_TYPE,
      constants.ROOM_TYPE,
    ];

    return Promise.resolve(types.indexOf(type));
  }

  action(option) {
    // const nodeId = option.selectedNode.id.get();
    // const contextId = option.context.id.get();

    spinalPanelManagerService.openPanel("linkParkDeviceToRoomDialog", option);
  }
}

export const linkParkDevicesToRoom = new LinkParkDevicesToRoom();
spinalContextMenuService.registerApp(SIDEBAR, linkParkDevicesToRoom, [3]);
export default linkParkDevicesToRoom;
