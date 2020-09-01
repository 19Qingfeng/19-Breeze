<!-- alert.vue -->
<template>
  <div class="alert">
    <div class="alert-main" v-for="item in notices" :key="item.name">
      <div class="alert-content" :class="formatterType(item.type)">
        {{ item.content }}
        <i
          v-if="item.close"
          class="close iconfont icon-guanbi"
          @click="remove(item.name)"
        />
      </div>
    </div>
  </div>
</template>
<script>
let seed = 0;

function getUuid() {
  return "alert_" + seed++;
}

export default {
  data() {
    return {
      notices: [],
    };
  },
  methods: {
    formatterType(type) {
      const mapList = {
        info: "info",
        success: "success",
        error: "error",
      };
      return mapList[type];
    },
    add(notice) {
      const name = getUuid();

      let _notice = Object.assign(
        {
          // 增加唯一id字段
          name: name,
        },
        notice
      );

      this.notices.push(_notice);

      // 定时移除，单位：秒
      const duration = notice.duration;
      setTimeout(() => {
        this.remove(name);
      }, duration * 1000);
    },
    remove(name) {
      console.log(name, "name");
      const notices = this.notices;
      for (let i = 0; i < notices.length; i++) {
        if (notices[i].name === name) {
          this.notices.splice(i, 1);
          break;
        }
      }
    },
  },
};
</script>
<style scoped>
.alert {
  position: fixed;
  width: 100%;
  top: 16px;
  left: 0;
  text-align: center;
  pointer-events: none;
}
.alert-content {
  display: inline-block;
  padding: 8px 16px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 6px rgba(156, 83, 83, 0.2);
  margin-bottom: 8px;
}

.close {
  font-size: 12px;
  margin-left: 5px;
  cursor: pointer;
  pointer-events: auto;
}

.info {
  color: #409eff;
  background-color: #ecf5ff;
}
.error {
  background-color: #fef0f0;
  color: #f56c6c;
}
.success {
  color: #67c23a;
  background-color: #e1f3d8;
}
</style>