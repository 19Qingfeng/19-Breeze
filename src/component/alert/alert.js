// alert.js 全局alert单例
import Notification from './notification.js';

let messageInstance;

function getMessageInstance() {
    messageInstance = messageInstance || Notification.newInstance();
    return messageInstance;
}

function notice({
    duration = 1.5,
    content = '',
    type = 'info',
    close = false
}) {
    let instance = getMessageInstance();

    instance.add({
        content,
        type,
        close,
        duration
    });
}

export default {
    info(options) {
        return notice(options);
    }
}