<template>
  <div class="m_19_upload_wapper">
    <input class="m_19_upload" id="upload" type="file" :multiple="multiple" />
    <div class="m_19_upload_button" for="upload">{{content}}</div>
  </div>
</template>

<script>
export default {
  name: "19upload",
  props: {
    multiple: Boolean,
    // image/gif, image/jpeg
    accept: String,
    content: {
      type: String,
      default: "上传图片",
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.m_19_upload_wapper {
  display: inline-block;
}
.m_19_upload {
  display: none;
}
.m_19_upload_button {
  background: red;
}
</style>