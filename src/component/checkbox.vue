<template>
  <label :for="id" class="label">
    <span>
      <slot />
    </span>
    <input
      v-show="false"
      :id="id"
      class="checkbox"
      ref="checkbox"
      type="checkbox"
      :disabled="disabled"
      v-model="currentValue"
      @change="change"
    />
    <span class="title">
      <i
        :class="`${currentValue ? 
         'icon-checkbox'  : 
        indeterminate ? 'icon-indeterminatecheckbox' :  'icon-checkboxoutlineblank'
      } iconfont breeze_checkbox`"
      />
    </span>
  </label>
</template>

<script>
export default {
  name: "BreezeCheckbox",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number, Boolean],
      default: false,
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true,
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false,
    },
    indeterminate: {
      type: Boolean,
    },
    id: {
      type: Number | String,
    },
  },
  data() {
    return {
      currentValue: this.value,
    };
  },
  watch: {
    // 同步修改currentValue，外部代码改变值内部更新
    value(n) {
      if (n !== this.trueValue && n !== this.falseValue) {
        throw "Value should be trueValue or falseValue.";
      } else {
        this.updateModel();
      }
    },
    indeterminate: {
      immediate: true,
      handler(n) {
        this.$nextTick(() => {
          const input = this.$refs?.checkbox;
          if (this.value === this.falseValue && this.indeterminate) {
            input.indeterminate = true;
          } else {
            input.indeterminate = false;
          }
        });
      },
    },
  },
  methods: {
    updateModel() {
      this.currentValue = this.value === this.trueValue;
    },
    // 向外触发改变外部值
    change(event) {
      if (this.disabled) {
        return false;
      }
      // 当前选中状态
      const checked = event.target.checked;
      // 内部改变选中 改变内部属性
      this.currentValue = checked;
      // 向外触发
      const value = checked ? this.trueValue : this.falseValue;
      this.$emit("input", value); // v-model使用
      this.$emit("on-change", value); // 正常触值使用
    },
  },
};
</script>

<style>
.label {
  display: inline-flex;
  flex-direction: row-reverse;
  height: 16px;
  line-height: 16px;
}
.checkbox ~ .title {
  color: #000;
}
input[type="checkbox"]:checked + .title {
  border: none;
  display: inline-block;
  color: #409eff;
  /* background-color: #409eff; */
}

.icon-indeterminatecheckbox {
  color: #409eff;
}
</style>