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
  <div class="selections">
    <div class="section">
      <link-template :title="'Contexts'"
                     :data="contexts"
                     :itemSelected="contextSelected"
                     @select="selectContext"></link-template>
    </div>

    <div class="section">
      <link-template :title="'Networks'"
                     :data="networks"
                     :itemSelected="networkSelected"
                     @select="selectNetwork"></link-template>
    </div>

    <div class="section">
      <link-template :title="'Devices'"
                     :data="devices"
                     :itemSelected="deviceSelected"
                     @select="selectDevices"></link-template>
    </div>
  </div>
</template>

<script>
import LinkTemplate from "./linkTemplate.vue";

export default {
  name: "linkComponent",
  components: {
    "link-template": LinkTemplate,
  },
  props: {
    contexts: {
      type: Array,
      required: true,
    },
    networks: {
      type: Array,
      required: true,
    },
    devices: {
      type: Array,
      required: true,
    },
    contextSelected: {
      type: String | undefined,
      required: true,
    },
    networkSelected: {
      type: String | undefined,
      required: true,
    },
    deviceSelected: {
      type: String | undefined,
      required: true,
    },
  },
  methods: {
    selectContext(id) {
      this.$emit("selectContext", id);
    },
    selectNetwork(id) {
      this.$emit("selectNetwork", id);
    },
    selectDevices(id) {
      this.$emit("selectDevices", id);
    },
  },
};
</script>

<style scoped>
.selections {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.selections .section {
  width: 33%;
  height: 99%;
  border: 1px solid white;
  border-radius: 30px;
  padding: 10px;
}
</style>