// notification.js
import Alert from './alert.vue';
import Vue from 'vue';
// $mount  Vue.extend
Alert.newInstance = properties => {
    const props = properties || {};

    const Instance = new Vue({
        data: props,
        render(h) {
            return h(Alert, {
                props: props
            });
        }
    });
    // 渲染未挂载 然后$el获得对应DOM
    const component = Instance.$mount();

    // 如果mount()没有提供 elementOrSelector 参数，
    // 模板将被渲染为文档之外的的元素，
    // 并且你必须使用原生 DOM API 把它插入文档中。
    // 通过component.$el获得已被渲染的元素（文档之外）。
    // 原生DOM API appendChild进行插入。
    document.body.appendChild(component.$el);

    const alert = Instance.$children[0];

    return {
        add(noticeProps) {
            alert.add(noticeProps);
        },
        remove(name) {
            alert.remove(name);
        }
    }
};


export default Alert;