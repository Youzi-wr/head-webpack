// -------------------------------------------------------------- 
var io = require('socket.io-client');
var http = require('./http');
var notifications = require('./noticeUpdate');

require('./emotion.css');
require('./bell.css');

var CONTEXTPATH = 'https://192.168.12.105';

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
    this.checkLogin();
}

CommonBell.prototype = {
    render: function () {
        var parent = _$(this.id);  //判断置顶
        var bell = document.createElement('div');
        bell.setAttribute('id', 'commonBell');
        bell.innerHTML = bellTmpl;
        parent.appendChild(bell);

        this.addEvent();
    },
    addEvent: function () {
        var self = this;
        this.querySelector('#commonBell .coheadBell_icon').addEventListener('click', function (event) {
            _toggle(this.nextElementSibling, "common-show");
        })
    },
    checkLogin: function () {
        var self = this;
        http.get(CONTEXTPATH + '/uz-accountmgr/api/account/login').then(function (res) {
            if (res.success) {
                self.creatSocketIO(res.data);
            } else {
                // loign error
            }
        });
    },
    creatSocketIO: function (user) {
        var self = this;

        this._socket = io(CONTEXTPATH);

        this._socket.on('notification', function (data) {
            if (!data) return;
            data = JSON.parse(data);

            // console.log(data);

            self.updateIcon();
            self.refreshNotificationList();
            self.soundAlert(data);
        });

        this.connect(user);
        this.refreshNotificationList();
    },
    updateIcon: function () {
        var coheadBell_svg = this.querySelector('#commonBell .coheadBell_icon .common-hide');
        var sibling = _sibling(coheadBell_svg);
        _removeClass(coheadBell_svg, "common-hide");
        _addClass(sibling, "common-hide");
    },
    refreshNotificationList: function () {
        var self = this;
        http.get(CONTEXTPATH + '/sns/api/notification/load/recent').then(function (res) {
            if (!res.success) return '';
            self.querySelector('#coheadBell_popup').innerHTML = notifications.popup(res.data);
        });
    },
    soundAlert: function (data) {
        notifications.alert(data);
    },
    connect: function (user) {
        if (user) {
            this._socket.emit("user_enter", {
                id: user.id,
                registerName: user.registerName
            });
        }
    },
    disconnect: function (user) {
        if (user) {
            this._socket.emit("user_exit");
        }
    },
    querySelector(cl) {
        return _$$(`#${this.id} ${cl}`);
    }
}

function _addClass(dom, className) {
    dom.classList.add(className);
}

function _removeClass(dom, className) {
    dom.classList.remove(className);
}

function _toggle(dom, className) {
    var classList = dom.classList;
    if (classList.contains(className)) {
        classList.remove(className);
    } else {
        classList.add(className);
    }
}

function _sibling(dom) {
    return dom.nextElementSibling || dom.previousElementSibling;
}

function _$(id) {
    return document.getElementById(id);
}

function _$$(className) {
    return document.querySelector(className);
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