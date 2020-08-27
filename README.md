# 19-Breeze

一些自己样式的component提供Vue使用。

> commonjs、es modules、amd引入。

``` 
import Vue from 'vue'
import BreezeComponent from "./BreezeComponent"

Vue.use(BreezeComponent)
```

> 没有上传npm，所以直接引入dist下的js文件即可。

### Checkbox

![chekboxt.png](https://i.loli.net/2020/08/27/vPBSAxVhkb2peXH.jpg)

* v-model:checkbox绑定值。
* disabled: 是否禁用。
* trueValue: 选中时v-model值，默认true。
* falseValue: 为选中时v-model值，默认false。
* indeterminate: 是否不确定，仅仅控制样式。
* id:checkbox唯一id。
* on-change: 状态改变事件。

``` 
<breeze-checkbox 
    v-model="chock"
    @on-change="handleChange">
    选择框
</breeze-checkbox>
```

### Tree

![Tree](https://i.loli.net/2020/08/27/8u1bXwCaq72KnQR.jpg)

* TreeDs

    1. code:标签唯一code。

    2. pcode:标签对应父节点code，顶级节点pcode未空。

    3. name:标签名称。

    4. description:标签描述。

> 初始化Tree数据

* checkedData

> 默认选中数据

``` 
<breeze-tree :treeDs="data" :checkedData="defaultChecked" / >
...
defaultChecked: [
        {
          code: "01",
          name: "人口属性",
          pcode: "",
        },
        {
          code: "0102004",
          name: "31-40岁",
          pcode: "0102",
          description: 15828,
        },
],
data: [] // mock文件夹->tree.js文件
```
