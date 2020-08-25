<template>
    <div class="box">
        <div class="tree">
            <div
                class="column"
                v-for="(list,i) in forList"
                :key="i"
            >
                <!-- {{eachList(i)}} -->
                <!-- 先别看他 -->
                <div
                    v-for="item in list"
                    class="item"
                    :class="setActiveClass(item,i)"
                    @click="onClickListItem(item,i)"
                    :key="item.code"
                >
                    <!-- 这里的外层循环非常精髓  -->
                    <!-- 点击div会传入外层forList外层循环的i和内层的item -->
                    <!-- i代表点击的当前列 -->
                    <!-- item代表点击当前列的哪一个 -->
                    <!-- 这个时候同一级别的i仅会存在一个 -->
                    <!-- 自己实现checkbox -->
                    <el-checkbox
                        :indeterminate="item.indeterminate"
                        @change="onChangeCheckBox(item,i)"
                        v-model="item.checked"
                    ></el-checkbox>
                    <span
                        class="checkbox-text"
                        :class="{active:item.indeterminate||item.checked}"
                    >
                        {{item.name}}
                        <span v-if="item.children.length">({{item.children.length}})</span>
                    </span>
                    <span
                        v-if="item.count"
                        class="crowd-num"
                        :class="{active:item.indeterminate||item.checked}"
                    >
                        <span>{{item.count}}</span>万
                    </span>
                    <!-- css实现箭头 -->
                    <i
                        @click.self="onClickListItem(item,i)"
                        v-if="item.children.length"
                        class="el-icon-caret-right caret-right"
                    ></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
// import config from '../config.js'
export default {
  data() {
    return {
      treeData: [], //处理后的多维数组
      treeDepth: 0, //tree 深度
      activeData: {}, //注意是对象！！ 因为要用到他的属性值而非索引 需要从1开始
      rawData: [], //原始
    };
  },
  created() {
    this.initData();
  },
  computed: {
    forList() {
      let keys = Object.keys(this.activeData);
      keys = keys.sort((a, b) => a - b);
      //先为arr添加一层  -- 首级别
      let arr = [this.treeData];
      //之后在进行遍历 为arr添加后边的
      for (const key of keys) {
        if (key != this.treeDepth - 1) {
          if (this.activeData[key].hasOwnProperty("children")) {
            arr.push(this.activeData[key]["children"]);
          } else {
            arr.push([]);
          }
        }
      }

      return arr;
    },
  },
  methods: {
    hasChildren(obj) {
      return obj.children === 0 ? true : false;
    },
    initData() {
      axios
        .get(
          `https://www.easy-mock.com/mock/5c555d62b4757d1cc48f136e/label/devLabel`
        )
        .then((res) => {
          let data = res.data.label.data;
          this.addProps(data);
          this.rawData = data;
          this.treeData = this.formatTree("", data);
          this.treeDepth = this.getTreeDepth(this.treeData);
          this.setActiveData();
        });
    },
    onChangeCheckBox(item, i) {
      /* if (!this.hasChildren(item)) {
        this.checkedChildren(item);
      }
      this.checkedParent(item) */
      if (item.checked) {
        item.indeterminate = false;
      }
      this.checkedChildren(item);
      this.checkedParent(item);
    },
    checkedParent(item) {
      //拿到父node
      let parent = this.rawData.filter((i) => {
        return i.code === item.pcode;
      })[0];
      if (parent) {
        let children = parent.children;
        //选中的长度
        let checkedLen = 0;
        //不定状态
        let indeterminateLen = 0;
        for (let childrenNode of parent.children) {
          if (childrenNode.checked) {
            checkedLen++;
          }
          if (childrenNode.indeterminate) {
            indeterminateLen++;
          }
        }
        if (indeterminateLen > 0) {
          parent.indeterminate = true;
          parent.checked = false;
        } else {
          if (checkedLen == parent.children.length) {
            parent.indeterminate = false;
            parent.checked = true;
          } else if (checkedLen == 0) {
            parent.indeterminate = false;
            parent.checked = false;
          } else {
            parent.indeterminate = true;
            parent.checked = false;
          }
        }
        //勾选父节点确定了 在确定父节点的父节点状态 递归
        this.checkedParent(parent);
      } else {
        return;
      }
    },
    checkedChildren(item) {
      //如果  存在子类 选中父类 子类全选中(子类check属性全为true)   取消 子类全取消(子类check属性全为false)
      if (!this.hasChildren(item)) {
        //存在子类
        let children = item.children;
        let checked = item.checked;
        for (let i of children) {
          i.checked = checked;
          i.indeterminate = false;
          this.checkedChildren(i);
        }
      } else {
        return;
      }
    },
    onClickListItem(obj, column) {
      //点击父类 仅展示(渲染)该子类  其他都变为空 不进行选中
      //第一项是必定渲染的 所以activeData从1开始 < this.treeDepth - 1 也就是只有长度-2个
      this.$set(this.activeData, column, obj);
      // console.log(this.activeData,'activeData')
      for (let i = column + 1; i < this.treeDepth - 1; i++) {
        this.$set(this.activeData, i, {});
      }
    },
    setActiveClass(obj, column) {
      //确定当前行点击的状态
      //每一行都应该有一个选中的
      let activeObj = this.activeData[column];
      //activeObj 当前行选中的 (每一个展现的行都应该有一个选中行)
      if (activeObj.code == obj.code) {
        return { active: true };
      }
    },
    setActiveData() {
      for (let i = 0; i < this.treeDepth; i++) {
        this.$set(this.activeData, i, {});
      }
    },
    getTreeDepth(treeData) {
      let max = 0;
      function each(data, floor) {
        data.forEach((node) => {
          if (floor > max) {
            max = floor;
          }
          if (node.children && node.children.length > 0) {
            each(node.children, floor + 1);
          }
        });
      }
      each(treeData, 1);
      return max;
    },
    addProps(data) {
      for (let node of data) {
        node.checked = false;
        node.indeterminate = false;
      }
    },
    deterLevel(node, data, level = 0) {
      if (!node.pcode) {
        return level;
      } else {
        const arr = data.filter((parent) => {
          return parent.code === node.pcode;
        });
        return this.deterLevel(arr[0], data, ++level);
      }
    },
    formatTree(pcode, list) {
      //格式化
      let arr = [];
      for (let i of list) {
        let code = i.code;
        if (i.pcode == pcode) {
          i.children = this.formatTree(code, list);
          arr.push(i);
        }
      }
      return arr;
    },
  },
};
</script>

<style scoped>
.box {
  height: 100%;
  display: flex;
}
.checked-list {
  overflow-y: auto;
  flex: 1;
}
.checked-num {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}
.tree {
  flex: 1;
  display: flex;
}
.column {
  flex: 1;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
}
.item {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 40px;
  line-height: 40px;
}
.item:hover {
  background-color: #f5f7fa;
}
.item.active {
  background-color: rgba(64, 158, 255, 0.1);
}
.checkbox-text {
  font-size: 12px;
}
.checkbox-text.active {
  color: #409eff;
}
.crowd-num {
  float: right;
  margin-right: 6px;
  font-size: 12px;
}
.crowd-num .active {
  color: #409eff;
}
.caret-right {
  float: right;
  line-height: 40px;
  margin-right: 8px;
}
</style>
