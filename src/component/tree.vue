<template>
  <div class="box">
    <div class="tree">
      <div class="column" v-for="(list,i) in forList" :key="i">
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
          <i-checkbox
            class="checkbox"
            :id="item.code"
            :indeterminate="item.isIndeterminate"
            @on-change="onChangeCheckBox(item,i)"
            v-model="item.checked"
          ></i-checkbox>

          <span class="checkbox-text" :class="{active:item.indeterminate||item.checked}">
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
import ICheckbox from "./checkbox.vue";
export default {
  name: "BreezeTree",
  components: {
    ICheckbox,
  },
  props: {
    treeDs: {
      type: Array,
    },
    checkedData: {
      type: Array,
    },
  },
  data() {
    return {
      treeData: [], // 一层过滤
      rawTreeData: [], //原始数据 （暂时么用）
      treeDepth: 0, // tree 深度
      activeData: {}, // 注意是对象！！ 因为要用到他的属性值而非索引 需要从1开始
    };
  },
  created() {
    this.initTreeData();
    this.initDefaultChecked();
    this.treeDepth = this.getTreeDepth(this.treeData);
    this.setActiveData();
  },
  computed: {
    forList() {
      let keys = Object.keys(this.activeData);
      keys = keys.sort((a, b) => a - b);
      let arr = [this.treeData];
      for (const key of keys) {
        if (key != this.treeDepth - 1) {
          if (this.activeData[key].hasOwnProperty("children")) {
            arr.push(this.activeData[key]["children"]);
          } else {
            arr.push([]);
          }
        }
      }
      //   this.sortTree(arr);
      return arr;
    },
  },
  methods: {
    // 获得Tree的深度
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
    addCustomProp(arr) {
      for (let item of arr) {
        item.isIndeterminate = false;
        item.checked = false;
      }
    },
    // 后代节点的勾选
    childrenChecked(obj) {
      if (!this.isLeaf(obj)) {
        let checked = obj.checked;
        let isIndeterminate = obj.isIndeterminate;
        let children = obj.children;
        let disabled = obj.disabled;
        for (let item of children) {
          item.checked = checked;
          item.isIndeterminate = isIndeterminate;
          this.childrenChecked(item);
        }
      } else {
        return;
      }
    },
    // 根据节点code获取节点路径
    makePath(code, _tree) {
      let done = false;
      let path = [];
      let tree = _tree || this.treeData;

      function traverse(tree, code) {
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (!done) {
            if (i > 0) {
              path.pop();
            }
            path.push(node);
            if (node.code == code) {
              done = true;
              return;
            } else {
              let children = node.children;
              if (children && children.length) {
                traverse(children, code);
              }
            }
          }
        }
        if (!done) {
          path.pop();
        }
        return;
      }

      traverse(tree, code);
      return path;
    },
    // 第一级为0 第二级为1....
    getLevelByCode(code) {
      let path = this.makePath(code);
      return path.length - 1;
    },
    // 根据code获取父节点
    getFatherByCode(code) {
      let path = this.makePath(code);
      if (path.length > 1) {
        return path[path.length - 2];
      }
    },
    // 祖先的勾选
    ancestorChecked(obj) {
      let code = obj.code;
      if (obj && !!obj.code) {
        // 当前行
        let column = this.getLevelByCode(code);
        console.log(column, "column");

        // 父亲行
        let fatherColumn = column - 1;
        let father = this.getFatherByCode(code);
        console.log(father, "father");
        if (fatherColumn > -1 && father && father.hasOwnProperty("children")) {
          // 所有儿子
          let currenColumntList = father.children;
          // 儿子长度
          let len = currenColumntList.length;
          let checkedLen = 0;
          let indeterminateLen = 0;
          let disabledLen = 0;
          // 儿子是否所有选中
          for (const item of currenColumntList) {
            if (item.checked) {
              checkedLen = checkedLen + 1;
            }
            if (item.isIndeterminate) {
              indeterminateLen = indeterminateLen + 1;
            }
            if (item.disabled) {
              disabledLen = disabledLen + 1;
            }
          }

          let checked = false;
          let disabled = false;
          let isIndeterminate = false;
          if (indeterminateLen > 0) {
            isIndeterminate = true;
            checked = false;
          } else {
            isIndeterminate = false;
            if (checkedLen == len) {
              checked = true;
            } else if (checkedLen == 0) {
              checked = false;
            } else {
              isIndeterminate = true;
            }
          }
          //   //禁用的话不可选
          //   if (disabledLen == len) {
          //     disabled = true;
          //     checked = false;
          //   }
          father.checked = checked;
          //   father.disabled = disabled;
          father.isIndeterminate = isIndeterminate;
          let grandfather = this.getFatherByCode(father.code);
          // console.log('grandfather',grandfather)
          if (grandfather) {
            this.ancestorChecked(grandfather.children[0]);
          }
        }
      }
    },
    //每一列的选中标签的class
    setActiveClass(obj, column) {
      // console.log('column',column)
      let activeObj = this.activeData[column];
      if (activeObj.code == obj.code) {
        return { active: true };
      }
    },
    // 每一列中每个节点横条的click事件
    onClickListItem(obj, column) {
      // let tem_obj = {};
      // tem_obj["active" + column] = obj;
      this.$set(this.activeData, column, obj);

      for (let i = column + 1; i < this.treeDepth - 1; i++) {
        this.$set(this.activeData, i, {});
        // tem_obj["active" + column] = {};
      }
      // this.activeData = tem_obj
    },
    // CheckBox的change事件
    onChangeCheckBox(obj, column) {
      if (obj.checked) {
        obj.isIndeterminate = false;
        //选中处理
        // if (this.isChildHasDisabled(obj)) {
        //   this.comfirmCheck(obj);
        // } else {
        this.baseChangeCheck(obj);
        // }
      } else {
        this.baseChangeCheck(obj);
      }
    },
    // 基础的选中处理事件
    baseChangeCheck(node) {
      this.childrenChecked(node);
      this.ancestorChecked(node);
      /* 步骤 */
      //   if (this.checkedLeaf) {
      //     this.clearLabelList();
      //   this.iteratCheckedTree();
      //   }
    },
    formatTree(pcode, list) {
      // 性能快一点
      let result = [];
      if (!Array.isArray(list)) {
        return result;
      }
      list.forEach((item) => {
        delete item.children;
      });
      let map = {};
      list.forEach((item) => {
        map[item.code] = item;
      });
      list.forEach((item) => {
        let parent = map[item.pcode];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
          if (!item.children) item.children = [];
        } else {
          // 顶级别节点 pcode="" map是找不到的
          result.push(item);
        }
      });
      return result;
      // 取消递归 性能太差
      // let arr = [];
      // for (let i of list) {
      //   let code = i.code;
      //   if (i.pcode == pcode) {
      //     i.children = this.formatTree(code, list);
      //     arr.push(i);
      //   }
      // }
      // return arr;
    },
    initTreeData() {
      // let data = _.cloneDeep(this.treeDs);
      let data = this.treeDs;
      this.addCustomProp(data);
      this.treeData = this.formatTree("", data);
    },
    initDefaultChecked() {
      for (const obj of this.checkedData) {
        let node = this.getNodeBycode(obj.code);
        if (!node) return;
        node.checked = true;
        this.childrenChecked(node);
        this.ancestorChecked(node);
      }
    },
    getNodeBycode(code, _arr) {
      let arr = _arr || this.treeData;
      for (let item of arr) {
        if (item.code == code) {
          return item;
        } else {
          if (!this.isLeaf(item)) {
            let tem = this.getNodeBycode(code, item.children);
            if (tem) {
              return tem;
            }
          }
        }
      }
    },
    isLeaf({ children }) {
      return children.length == 0;
    },
    setActiveData() {
      for (let i = 0; i < this.treeDepth; i++) {
        this.$set(this.activeData, i, {});
      }
    },
  },
};
</script>

<style scoped>
.box {
  flex: 1;
  height: 100%;
  display: flex;
}
.left {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.tree {
  flex: 1;
  display: flex;
  min-height: 0;
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
.item > .checkbox {
  position: relative;
  top: 2px;
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
.checkbox-text-name {
  display: inline-block;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 12px;
}
.checkbox-text.active {
  color: #409eff;
}
.crowd-num {
  float: right;
  margin-right: 6px;
  font-size: 12px;
}
.crowd-num.active {
  color: #409eff;
}
.caret-right {
  float: right;
  line-height: 40px;
  margin-right: 8px;
}
</style>
