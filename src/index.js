var headTemplate = `
    <div id="commonHead" class="common-head">
        <div class="co-main">
            <div class="co-left">{{logo}}</div>
            <div class="co-right">
                <div class="co-tools co-notification">
                    <span>通知</span>
                    <ul id="coNoticeBox" class="co-dropdown">
                        <div class="co-count">dsds</div>
                    </ul>
                </div>
                <span class="co-tools co-avator">头像</span>
            </div>
        </div>
    </div>`;

var headStyle = `
    body,div {
        margin: 0;
        padding: 0;
        font-size: 14px;
    }
    .common-hide {
        display: none;
    }
    .common-ell {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .common-head {
        height: 30px;
        background-color: #fff;
    }
    .common-head .co-main {
        display: table;
        margin: 0 auto;
        padding: 0 15px;
        width: 1200px;
        height: 100%;
        background-color: #ddd;
    }
    .common-head .co-right,
    .common-head .co-left {
        display: table-cell;
        vertical-align: middle;
    }
    .common-head .co-right {
        text-align: right;
    }
    .common-head .co-right .co-tools {
        display: inline-block;
        margin: 0 8px;
    }
    .common-head .co-notification {
        position: relative;
    }
    .common-head .co-notification:hover .co-dropdown {
        display: block;
    }
    .common-head .co-dropdown {
        /* display: none; */
        position: absolute;
        right: -10px;
        top: 20px;
        min-width: 160px;
        margin: 10px 0;
        padding: 0;
        min-height: 50px;
        box-shadow: 2px 2px 8px #ddd;
        z-index: 99;
    }
    .common-head .co-dropdown:after {
        content: " ";
        position: absolute;
        top: -14px;
        right: 18px;
        border: 7px solid transparent;
        border-bottom: 7px solid #f6f6f6;
    }
    .common-head .co-dropdown .co-count {
        padding: 10px;
        width: 100%;
        text-align: center;
        color: #56BDF1;
        border-bottom: 1px solid #ececec;
        box-sizing: border-box;
    }
    .common-head .co-dropdown li {
        display: table;
        padding: 5px;
        width: 100%;
        box-sizing: border-box;
        list-style: none;
        color: #666;
    }
    .common-head .co-dropdown li img {
        width: 40px;
    }
    .common-head .co-dropdown img.co-cell {
        width: 40px;
        height: 40px;
    }
    .common-head .co-dropdown .co-cell {
        display: table-cell;
        vertical-align: top;
        padding: 0 3px;
    }
    .common-head .co-dropdown .co-cell-left {
        text-align: left;
        max-width: 300px;
    }
    .common-head .co-dropdown .co-cell-left .action {
        color: #56BDF1;
    }`;

document.ready = function (callback) {
    ///兼容FF,Google
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function () {
            document.removeEventListener('DOMContentLoaded', arguments.callee, false);
            callback();
        }, false)
    }
    //兼容IE
    else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState == "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                callback();
            }
        })
    }
    else if (document.lastChild == document.body) {
        callback();
    }
}

// document.ready(function () {
//     var coHeader = new CommonHeader();
//     // setTimeout(function () {
//     //     coHeader.showHead(true);
//     // }, 5000)
// })

// -------------------------------------------------------------- 
var io = require('socket.io-client');
var http = require('./axios.js');
var transferNotice = require('./noticeUpdate');


// var STATICPATH = 'http://localhost:3005';
var CONTEXTPATH = 'https://192.168.12.106';
var defaultConfig = {
    logo: '谐桐',
    show: true,
    parent: ''
};

// 单例
// var CommonHeader = (function () {
//     var instance
//     return function (config) {
//         if (!instance) {
//             instance = new CreateHeader(config)
//         }

//         return instance
//     }
// })()
// window.CommonHeader = CommonHeader;

var CreateHeader = window.CommonHeader = function (config) {
    this.config = Object.assign({}, defaultConfig, isObj(config));
    this.render();
}

var fn = CreateHeader.prototype;

fn.render = function () {
    this.creatStyle();
    this.creatHead();

    this._socket = null;
    // this.loadSocket();
    this.creatSocketIO();
}

fn.creatStyle = function () {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.getElementById('commonHeadStyle');
    if (!style) {
        if (document.createStyleSheet) {
            style = document.createStyleSheet();
            style.cssText = headStyle;
        } else {
            style = document.createElement('style');
            style.setAttribute('id', 'commonHeadStyle');
            if (style.styleSheet) {
                style.styleSheet.cssText = headStyle;
            } else {
                style.innerHTML = headStyle;
            }
            head.appendChild(style);
        }
    }
}

fn.creatHead = function () {
    var header = document.getElementById('commonHead');
    var parent = this.config.parent ? document.getElementById(this.config.parent) : document.body;
    if (!header) {
        header = document.createElement('div');
        header.setAttribute('id', 'commonHead');
        if (!this.config.show) {
            header.setAttribute('class', 'common-hide');
        }
        header.innerHTML = regx(headTemplate, this.config);
        prependChild(header, parent);
    }
}

fn.showHead = function (isShow) {
    var header = document.getElementById('commonHead');
    if (isShow) {
        header.removeAttribute('class')
    } else {
        header.setAttribute('class', 'common-hide');
    }
}

fn.setLogo = function (logo) {
    document.getElementById('coLogo').innerHTML = logo;
}

// fn.loadSocket = function () {
//     var head = document.getElementsByTagName('head')[0],
//         script = document.createElement('script');
//     var self = this;

//     script.src = STATICPATH + '/socket.io';
//     script.type = 'text/javascript';
//     head.appendChild(script);
//     script.onload = script.onreadystatechange = function () {
//         if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
//             script.onload = script.onreadystatechange = null;
//             self.creatSocketIO();
//         }
//     };
// }

fn.creatSocketIO = function () {
    var self = this;
    this._socket = io(CONTEXTPATH);

    this._socket.on('notification', function (data) {
        if (!data) return;
        data = JSON.parse(data);

        self.refreshNotificationList();
    });

    this.connect(); //TODO: checkLogin

    self.refreshNotificationList(); //test
}

fn.refreshNotificationList = function () {
    // http.get(CONTEXTPATH + '/sns/api/notification/load/recent').then(function (res) {
    //     debugger
    // })
    var data = { "success": true, "errorCode": 0, "message": null, "data": { "count": 20, "notifications": [{ "notificationId": 3608858177570816, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608858177325056", "content": { "referenceWords": "@wr1 [e]13[/e]", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582020964580, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }, { "notificationId": 3608846880425984, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608846880196608", "content": { "referenceWords": "@wr1 [e]97[/e]", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582020275057, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }, { "notificationId": 3608658124883968, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608658124654592", "content": { "referenceWords": "", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582008754333, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }, { "notificationId": 3608657241835520, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608657241622528", "content": { "referenceWords": "", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582008700436, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }, { "notificationId": 3608656343697408, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608656343435264", "content": { "referenceWords": "", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582008645618, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }] } };
    var html = document.createElement('div'); // is a node
    html.innerHTML = transferNotice(data);
    document.getElementById('coNoticeBox').appendChild(html);
}

fn.connect = function () {
    var user = {
        id: 3587208977745920,
        registerName: 'wr1'
    };
    if (user) {
        this._socket.emit("user_enter", {
            id: user.id,
            registerName: user.registerName
        });
    }
}

fn.disconnect = function () {
    var user = {
        id: 3587208977745920,
        registerName: 'wr1'
    };
    if (user) {
        this._socket.emit("user_exit");
    }
}

function prependChild(o, s) {
    if (s.hasChildNodes()) {
        s.insertBefore(o, s.firstChild);
    } else {
        s.appendChild(o);
    }
}

function regx(template, context) {
    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key.trim()]);
}

function isObj(data) {
    if (typeof data == 'object') {
        return data;
    } else {
        return {};
    }
}