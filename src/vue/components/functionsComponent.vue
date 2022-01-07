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
  <div class="_container">
    <div class="subcontent">
      <!-- <div class="title">Function</div> -->
      <div class="content">
        <div class="div_code">
          <div class="text_editor">
            <spinal-code-mirror class="editorContainer"
                                :codeObj="functions">
            </spinal-code-mirror>
          </div>
        </div>

      </div>
    </div>

    <!-- Devices -->
    <!-- <div class="subcontent">
      <div class="title">Devices</div>
      <div class="content">
        <div class="div_code">
          <div class="text_editor">
            <spinal-code-mirror class="editorContainer"
                                :codeObj="functions.devicesFuncion">
            </spinal-code-mirror>
          </div>

        </div>

      </div>
    </div> -->
  </div>
</template>

<script>
import SpinalCodeMirror from "./SpinalCodeMirror.vue";

export default {
  name: "functionsComponent",
  components: { "spinal-code-mirror": SpinalCodeMirror },
  props: {
    functions: {
      type: Object,
      require: true,
    },
  },
  methods: {},
};
</script>

<style scoped >
._container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

._container .subcontent {
  width: 100%;
  height: 100%;
  /* border: 1px solid #ffffff; */
  border-radius: 5%;
}

._container .subcontent .title {
  width: 100%;
  height: 50px;
  /* border-bottom: 1px solid white; */
  display: flex;
  justify-content: center;
  align-items: center;
}

._container .subcontent .content {
  height: calc(100% - 50px);
  padding: 0 7px;
}
/* ._container .subcontent .content .div_select {
  width: 100%;
  height: 50px;
} */
._container .subcontent .content .div_code {
  width: 100%;
  height: 100%;
  /* height: calc(100% - 60px); */
}
/* ._container .subcontent .content .div_code .checkbox_div {
  width: 100%;
  height: 50px;
} */
._container .subcontent .content .div_code .text_editor {
  width: 100%;
  height: 100%;
  /* height: calc(100% - 50px); */
}
</style>

<style>
._container
  .subcontent
  .content
  .div_code
  .text_editor
  .CodeMirror.cm-s-monokai.CodeMirror-wrap {
  width: 100%;
  height: 98%;
}
</style>
</style>