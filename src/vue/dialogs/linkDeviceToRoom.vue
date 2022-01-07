<!--
Copyright 2021 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)"
             class="pcvue_link_dialog_content">
    <md-dialog-title class="_dialogTitle">Link floor(s) to devices
    </md-dialog-title>

    <md-dialog-content class="_dialogContent">

      <link-component v-if="state === PAGES.selection"
                      :contexts="contexts"
                      :networks="networks"
                      :devices="devices"
                      :contextSelected="contextSelected"
                      :networkSelected="networkSelected"
                      :deviceSelected="deviceSelected"
                      @selectContext="selectContext"
                      @selectNetwork="selectNetwork"
                      @selectDevices="selectDevices"></link-component>

      <div v-else-if="state === PAGES.functions"
           class="configContainer">
        <config-component class="subContent"
                          :title="'Rooms'"
                          :attributeConfig="attributes.rooms">
        </config-component>

        <config-component class="subContent"
                          :title="'Devices'"
                          :attributeConfig="attributes.endpoints">
        </config-component>

      </div>

      <div class="states"
           v-else-if="state === PAGES.loading">
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </div>

      <div class="states icon"
           v-else>
        <md-icon class="md-size-5x">{{icon}}</md-icon>
      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 :disabled="disabledPreviousButton"
                 @click="goToPrevious">Previous</md-button>

      <md-button class="md-primary"
                 :disabled="disabledNextButton"
                 @click="goToNext">Next</md-button>

      <md-button class="md-primary"
                 :disabled="disabledLinkButton"
                 @click="linkNodes">Link</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import * as utilities from "../../utils/utils";
import { linkDevicesToRoom } from "../../utils/linkDeviceToRoomUtils";
import { attributeFunction, endpointFunction } from "../../utils/function";

import linkComponent from "../components/linkComponent.vue";
import ConfigComponent from "../components/configComponent.vue";

export default {
  name: "linkParkDeviceToRoom",
  components: {
    "link-component": linkComponent,
    "config-component": ConfigComponent,
  },
  props: ["onFinised"],
  data() {
    this.geographicStartId;
    this.geographicContextId;

    this.PAGES = {
      selection: 0,
      loading: 1,
      success: 2,
      error: 3,
      functions: 4,
    };

    return {
      showDialog: true,
      state: this.PAGES.selection,
      contexts: [],
      networks: [],
      devices: [],
      contextSelected: undefined,
      networkSelected: undefined,
      deviceSelected: undefined,
      attributes: {
        rooms: {
          attributeName: "name",
          useFunction: false,
          functions: {
            code: attributeFunction(),
          },
        },
        endpoints: {
          attributeName: "name",
          useFunction: false,
          functions: {
            code: endpointFunction(),
          },
        },
      },
      // functions: {
      //   code: defaultFunction(),
      //   // floorsFunction: { code: "" },
      //   // devicesFuncion: { code: "" },
      // },
    };
  },
  mounted() {},
  methods: {
    async opened({ selectedNode, context, graph }) {
      this.state = this.PAGES.loading;
      // this.selectedNodeId =  = selectedNode.id.get();
      this.geographicStartId = selectedNode.id.get();
      this.geographicContextId = context.id.get();

      utilities
        .getNetworkStructure()
        .then((contexts) => {
          this.contexts = contexts;
          this.state = this.PAGES.selection;
        })
        .catch((err) => {
          console.error(err);
          this.state = this.PAGES.error;
        });
    },

    linkNodes() {
      this.state = this.PAGES.loading;
      const devices = this.getDevices();

      linkDevicesToRoom(
        this.geographicContextId,
        this.geographicStartId,
        devices,
        this.attributes
      )
        .then(() => {
          this.state = this.PAGES.success;
        })
        .catch((err) => {
          console.error(err);
          this.state = this.PAGES.error;
        });
    },

    getDevices() {
      if (!this.deviceSelected) return this.devices;

      return this.devices.filter((el) => el.id === this.deviceSelected);
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised({ confirm: closeResult });
      }
    },

    removed(option) {
      this.showDialog = false;
    },

    goToPrevious() {
      if (this.state === this.PAGES.functions) {
        this.state = this.PAGES.selection;
      }
    },

    goToNext() {
      if (this.state === this.PAGES.selection) {
        this.state = this.PAGES.functions;
      }
    },

    /**Selection */
    selectContext(id) {
      this.contextSelected = this.contextSelected === id ? undefined : id;
    },

    selectNetwork(id) {
      this.networkSelected = this.networkSelected === id ? undefined : id;
    },

    selectDevices(id) {
      this.deviceSelected = this.deviceSelected === id ? undefined : id;
    },

    /* Update */
    updateNetworks() {
      this.networks = [];
      this.devices = [];
      if (this.contextSelected) {
        let val = this.contexts.find((el) => el.id === this.contextSelected);
        if (val) this.networks = val.networks;
      }
    },

    updateDevices() {
      this.devices = [];
      if (this.networkSelected) {
        let val = this.networks.find((el) => el.id === this.networkSelected);
        if (val) this.devices = val.devices;
      }
    },
  },
  watch: {
    async contextSelected() {
      await this.updateNetworks();
      this.networkSelected = undefined;
    },

    async networkSelected() {
      this.updateDevices();
      this.deviceSelected = undefined;
    },
  },
  computed: {
    icon() {
      return this.state == this.PAGES.success ? "file_download_done" : "error";
    },

    disabledLinkButton() {
      return (
        this.state != this.PAGES.functions ||
        !this.networkSelected ||
        this.attributes.rooms.attributeName.length === 0 ||
        this.attributes.endpoints.attributeName.length === 0
      );
    },

    disabledNextButton() {
      return this.state != this.PAGES.selection || !this.networkSelected;
    },

    disabledPreviousButton() {
      return this.state != this.PAGES.functions;
    },
  },
};
</script>

<style scoped>
.pcvue_link_dialog_content {
  width: 60%;
  height: 80%;
}

.pcvue_link_dialog_content ._dialogTitle {
  text-align: center;
}

.pcvue_link_dialog_content ._dialogContent {
  width: 100%;
  height: 100%;
}

.pcvue_link_dialog_content ._dialogContent .states {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.configContainer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}

.configContainer .subContent {
  width: 49%;
  height: 100%;
  border: 1px solid white;
  border-radius: 7%;
  padding: 15px;
}

/* .pcvue_link_dialog_content ._dialogContent .states .icon {
  width: 100%;
  text-align: center;
} */
</style>