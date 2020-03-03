// -------------------------------------------------------------- 
var io = require('socket.io-client');
var http = require('./axios.js');
var transferNotice = require('./noticeUpdate');

var CONTEXTPATH = 'https://192.168.12.106';

var bellTmpl = '';
http.get('/html').then(res => {
    bellTmpl = res;
});

window.CommonBell = function (opt) {
    return new CommonBell(opt);
}

var CommonBell = function (id) {
    this.id = id;
    this._socket = null;

    this.render();
    this.creatSocketIO();
}

CommonBell.prototype = {
    render: function () {
        var parent = document.getElementById(this.id);  //判断置顶
        var bell = document.createElement('div');
        bell.setAttribute('id', 'commonBell');
        bell.innerHTML = bellTmpl;
        parent.appendChild(bell);

        this.addEvent();
    },
    addEvent: function () {
        var eleBell = document.getElementById(this.id); //为动态添加的元素添加事件
        var eleBellPopup = document.getElementById('coheadBell_popup');
        eleBell.addEventListener('click', function () {
            var classList = eleBellPopup.classList;
            if (classList.contains("common-show")) {
                classList.remove('common-show')
            } else {
                classList.add("common-show")
            }
        })
    },
    creatSocketIO: function () {
        var self = this;
        this._socket = io(CONTEXTPATH);

        this._socket.on('notification', function (data) {
            if (!data) return;
            data = JSON.parse(data);

            self.refreshNotificationList();
        });

        this.connect(); //TODO: checkLogin
        self.refreshNotificationList(); //test
    },
    refreshNotificationList: function () {
        // http.get(CONTEXTPATH + '/sns/api/notification/load/recent').then(function (res) {
        //     debugger
        // })
        var data = { "success": true, "errorCode": 0, "message": null, "data": { "count": 20, "notifications": [{ "notificationId": 3608858177570816, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608858177325056", "content": { "referenceWords": "@wr1 [e]13[/e]", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582020964580, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }, { "notificationId": 3608846880425984, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608846880196608", "content": { "referenceWords": "@wr1 [e]97[/e]", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582020275057, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }, { "notificationId": 3608658124883968, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608658124654592", "content": { "referenceWords": "", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582008754333, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }, { "notificationId": 3608657241835520, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608657241622528", "content": { "referenceWords": "", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582008700436, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }, { "notificationId": 3608656343697408, "receiverId": 3587208977745920, "type": "AtUserInComment", "returnUrl": "/app/user/post/inbox/3587214861568000/false#l3608656343435264", "content": { "referenceWords": "", "from": "wr2", "target": "__ChatRoom_OtherUserName:wr2,wr1" }, "appendTime": 1582008645618, "avatarUrl": "/user_statics/3587209361229824/Default.PNG", "fromUserId": null, "toUserId": null, "message": null, "params": null, "read": false }] } };
        var html = document.createElement('div'); // is a node
        html.innerHTML = transferNotice(data);
        document.getElementById('coheadBell_popup').appendChild(html);
    },
    connect: function () {
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
    },
    disconnect: function () {
        var user = {
            id: 3587208977745920,
            registerName: 'wr1'
        };
        if (user) {
            this._socket.emit("user_exit");
        }
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