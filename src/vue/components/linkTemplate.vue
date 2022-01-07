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
  <div class="subContent">
    <div class="title">
      <div>{{title}}</div>
    </div>

    <md-content class="container md-scrollbar">
      <md-list>
        <md-list-item class="list-item"
                      v-for="(item,index) in data"
                      :key="index"
                      @click="selectItem(item.id)"
                      :class="{'selected' : item.id === itemSelected}"
                      v-tooltip="item.name">

          <span class="md-list-item-text">{{item.name}}</span>

        </md-list-item>
      </md-list>
    </md-content>

  </div>
</template>

<script>
export default {
  name: "linkToGroupTemplate",
  props: ["data", "title", "itemSelected", "disableBtn"],
  methods: {
    createEvent() {
      this.$emit("create");
    },
    selectItem(id) {
      this.$emit("select", id);
    },
  },
};
</script>

<style scoped>
.subContent {
  width: 100%;
  height: 100%;
}

.subContent .title {
  width: 100%;
  height: 10%;
  /* text-align: center; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0 15px;
  border-bottom: 1px dashed grey;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.subContent .container {
  width: 100%;
  height: 90%;
  padding: 0px !important;
  /* border: 1px solid red; */
  overflow: hidden;
  overflow-y: auto;
}

.subContent .container .list-item {
  border-bottom: 1px solid grey;
}
.subContent .container .list-item .md-list-item-text {
  width: 100%;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.subContent .container .list-item.selected {
  background-color: #448aff;
}
</style>