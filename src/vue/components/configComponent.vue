<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
  <div class="div_container">
    <div class="title">{{title}}</div>

    <div class="md-layout-item">
      <md-field>
        <md-select v-model="attributeConfig.attributeName"
                   name="attributeConfig"
                   id="attributeConfig"
                   placeholder="">
          <md-option v-for="attr in attributes"
                     :key="attr"
                     :value="attr">{{attr}}</md-option>
        </md-select>
      </md-field>
    </div>

    <div class="checkbox">
      <md-checkbox v-model="attributeConfig.useFunction"
                   class="md-primary">Use function</md-checkbox>
    </div>

    <functions-component class="functions"
                         v-if="attributeConfig.useFunction"
                         :functions="attributeConfig.functions">
    </functions-component>
  </div>

</template>

<script>
import FunctionsComponent from "./functionsComponent.vue";

export default {
  name: "configComponent",
  props: ["attributeConfig", "title"],
  components: {
    "functions-component": FunctionsComponent,
  },
  data() {
    this.attributes = ["name", "id"];
    return {};
  },
};
</script>

<style scoped>
.div_container {
  width: 100%;
  height: 100%;
}

.div_container .title {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div_container .categoryName {
}

.div_container .checkbox {
  width: 100%;
  height: 50px;
}

.div_container .functions {
  width: 100%;
  height: calc(100% - 100px);
}
</style>