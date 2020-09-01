import Checkbox from "./component/checkbox.vue"
import Tree from "./component/tree.vue"
import Message from "./component/alert/alert.js"

function install(Vue, options) {
    Vue.component(Checkbox.name, Checkbox)
    Vue.component(Tree.name, Tree)

    Vue.myGlobalMethod = function () {
        // 逻辑...
    }

    // 2. 添加全局资源
    Vue.directive('test', {
        bind(el, binding, vnode, oldVnode) {
            console.log("test")
        }
    })

    // 3. 注入组件选项
    Vue.mixin({
        created: function () {
            // 逻辑...
        }
    })

    // 4. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {
        // 逻辑...
    }
    Vue.prototype.$message = function (methodOptions) {
        Message.info(methodOptions)
    }
}




const BreezeCheckbox = {
    install(Vue, options) {
        Vue.component(Checkbox.name, Checkbox)
    }
}

const BreezeTree = {
    install(Vue, options) {
        Vue.component(Tree.name, Tree)
    }
}

// 单个导出
export {
    BreezeCheckbox,
    BreezeTree
}

// 整体导出
export default {
    install
}