# 19-Breeze

一些自己样式的component提供Vue使用。

目前更新

* checkbox

* Tree

> commonjs、es modules、amd引入。

### ES module，vue中引入。

``` 
import Vue from 'vue'
import BreezeComponent from "./BreezeComponent"

Vue.use(BreezeComponent)
```

> 没有上传npm，所以直接引入dist下的js文件即可。

### Checkbox

![chekboxt.png](https://i.loli.net/2020/08/27/vPBSAxVhkb2peXH.jpg)

##### Prop

| prop |  description | type |
|-----|:-----:|-----:|
| v-model |   checkbox绑定值  | Boolean |
| disabled |   是否禁用  | Boolean |
| trueValue |   绑定值为true时向外触发的值，默认true  | Any |
| falseValue |   绑定值为false时向外触发的值，默认false  | Any |
| indeterminate |   是否不确定样式，仅控制样式  | Boolean |
| id |   需要唯一  | any |
| on-change |   绑定值改变事件  | 参数:value |

##### use

``` 
<breeze-checkbox 
    v-model="chock"
    @on-change="handleChange">
    选择框
</breeze-checkbox>
```

### Tree

![Tree.png](https://i.loli.net/2020/08/27/8u1bXwCaq72KnQR.jpg)

| prop |  description | type |
|-----|:-----:|-----:|
| TreeDs |   节点数据  | Array |
| checkedData |   默认选中数据  | Array |

* TreeDs

    1. code:标签唯一code。

    2. pcode:标签对应父节点code，顶级节点pcode必须为空字符串。

    3. name:标签名称。

    4. description:标签描述。

> 初始化Tree数据

* checkedData

> 默认选中数据

#### use

``` 
<breeze-tree :treeDs="data" :checkedData="defaultChecked" / >

```
