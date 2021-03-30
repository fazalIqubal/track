import { message } from 'antd';

export const Toast = (type, notificationMessage) => {
    var notification;
    switch (type) {
        case "success":
            notification = message.success(notificationMessage);
            break;
        case "error":
            notification = message.error(notificationMessage);
            break;
        case "success":
            notification = message.warning(notificationMessage);;
            break;
        case "info":
            notification = message.info(notificationMessage);
            break;
    }
    return notification;
}