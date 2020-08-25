import TestComponent from "./component/index.vue"

function install(Vue, options) {
    Vue.component(TestComponent.name, TestComponent)
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
}


// 整体引入
export default {
    install
}

const test = {
    install(Vue, options) {
        Vue.component(TestComponent.name, TestComponent)
    }
}

// 单个导出
export {
    test
}