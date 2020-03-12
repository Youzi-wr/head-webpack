// -------------------------------------------------------------- 
var io = require('socket.io-client');
var http = require('./http');
var notifications = require('./noticeUpdate');

require('./emotion.css');
require('./bell.css');

var CONTEXTPATH = 'https://192.168.12.166';

var bellTmpl = "<div id=\"commonBell\">\n    <span class=\"coheadBell_icon\">\n        <svg t=\"1583127866009\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n            p-id=\"3232\" width=\"22\" height=\"22\">\n            <path\n                d=\"M515.842205 1024h-7.558626A161.347592 161.347592 0 0 1 348.874096 882.90565a27.521151 27.521151 0 0 1 54.557775-6.783383A106.596006 106.596006 0 0 0 508.283579 969.054604h7.558626a106.596006 106.596006 0 0 0 105.336235-92.932337 27.521151 27.521151 0 0 1 54.557774 6.783383 161.347592 161.347592 0 0 1-159.894009 141.09435z m412.817261-188.965648h-833.38696A27.521151 27.521151 0 0 1 67.848261 806.25343a288.584461 288.584461 0 0 1 103.688843-209.121983V392.854736a290.716381 290.716381 0 0 1 209.606511-277.92486 131.985237 131.985237 0 0 1 261.644743 0A290.716381 290.716381 0 0 1 852.78249 392.854736v204.373616a288.099934 288.099934 0 0 1 103.301221 209.121984 27.32734 27.32734 0 0 1-7.558626 20.156336 27.618056 27.618056 0 0 1-19.865619 8.52768zM125.991537 779.895145h772.433425a234.123592 234.123592 0 0 0-89.831362-147.780827A27.521151 27.521151 0 0 1 797.546378 610.5044V392.854736A235.770985 235.770985 0 0 0 610.518839 163.479512a27.32734 27.32734 0 0 1-21.803728-26.842813v-5.039084a77.039841 77.039841 0 0 0-153.982777 0v5.039084a27.424245 27.424245 0 0 1-21.803728 26.842813 235.770985 235.770985 0 0 0-186.446106 229.375224V610.5044a27.714962 27.714962 0 0 1-10.853412 21.900635A234.317403 234.317403 0 0 0 125.991537 779.895145z\"\n                p-id=\"3233\" fill=\"#3DB5F6\"></path>\n        </svg>\n        <svg t=\"1583219113776\" class=\"common-hide\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n            p-id=\"2068\" width=\"28\" height=\"28\">\n            <path\n                d=\"M483.18976 317.55264c0 123.30496 99.95776 223.2576 223.2576 223.2576s223.25248-99.95264 223.25248-223.2576-99.94752-223.2576-223.25248-223.2576-223.2576 99.95264-223.2576 223.2576zM400.36864 929.70496c39.60832 0 72.01792-32.4096 72.01792-72.0128H328.35072c0 39.6032 32.4096 72.0128 72.01792 72.0128z\"\n                fill=\"#F39C2D\" p-id=\"2069\"></path>\n            <path\n                d=\"M457.984 317.55264c0-9.28256 0.55296-18.432 1.55648-27.45344-1.7152-0.45568-3.42016-0.93696-5.15584-1.3568v-25.20576c0-28.81024-25.20576-54.016-54.016-54.016-28.81024 0-54.01088 25.20576-54.01088 54.016v25.20576c-104.42752 25.20576-180.04992 118.83008-180.04992 226.85696v198.05184l-72.01792 72.01792v36.00896h612.16256v-36.00896l-72.01792-72.01792v-158.35136C532.52096 524.288 457.984 429.35296 457.984 317.55264z\"\n                fill=\"#F39C2D\" p-id=\"2070\"></path>\n        </svg>\n    </span>\n    <ul id=\"coheadBell_popup\" class=\"co-dropdown\">\n        <div class=\"co-count\">dsds</div>\n    </ul>\n</div>";
// http.get('/html').then(res => {
//     debugger;
//     bellTmpl = res;
// });

window.CommonBell = function (opt) {
    return new CommonBell(opt);
}

var CommonBell = function (options) {
    this.id = options.id;
    this.access_token = options.access_token;
    this.context_path = options.context_path || CONTEXTPATH;
    this._socket = null;

    this.render();
    this.checkLogin();
}

CommonBell.prototype = {
    render: function () {
        var self = this,
            parent = _$(this.id);  //判断置顶
        parent.innerHTML = bellTmpl;

        setTimeout(function () {
            self.addEvent();
        }, 100)
    },
    addEvent: function () {
        var self = this;
        this.querySelector('#commonBell .coheadBell_icon').addEventListener('click', function (event) {
            _toggle(this.nextElementSibling, "common-show");
        })
    },
    checkLogin: function () {
        var self = this;
        http.get(self.context_path + '/uz-accountmgr/api/account/login', self.access_token).then(function (res) {
            if (res.success) {
                self.creatSocketIO(res.data);
            } else {
                // loign error
            }
        });
    },
    creatSocketIO: function (user) {
        var self = this;

        this._socket = io();

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
        http.get(self.context_path + '/sns/api/notification/load/recent', self.access_token).then(function (res) {
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