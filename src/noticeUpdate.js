var constant = require('./noticeTmpl');
var notification = require('./alert');

var CONTEXTPATH = 'https://192.168.12.105';

function htmlDecode(str) {
    str = str.replace(/&#(x)?([^&]{1,5});?/g, function ($, $1, $2) {
        return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
    });

    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/&#39;/g, "\'");
    str = str.replace(/&quot;/g, "\"");

    return str;
}

function emotionDecode(input) {
    var result = (htmlDecode(input.toString() || "")).replace(/(\[.*?])/ig, function ($0) {
        return $0;
    }).replace(/\[e](.*?)\[\/e]/ig, function ($0, $1) {
        return '<span class="single emotion emotion_emoji_' + $1 + '"></span>';
    });
    return result;
}

function regx(template, context) {
    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => context[key.trim()]);
}

function cleanHtmlTags(str) {
    return str.replace(/<.*?>/ig, '');
}

var windowFocusHandler = function () {
    setTimeout(function () {
        window.sessionStorage.setItem("xt_focus_win_state", "focus");
    }, 100);
};

var windowBlurHandler = function () {
    window.sessionStorage.setItem("xt_focus_win_state", "blur");
};

var destroyHandler = function () {
    window.removeEventListener('focus', windowFocusHandler);
    window.removeEventListener('blur', windowBlurHandler);
};

window.addEventListener('focus', windowFocusHandler);
window.addEventListener('blur', windowBlurHandler);

var noticeTemplate = `
    <li>
        <img class="co-cell" src="${CONTEXTPATH}{{avatarUrl}}" alt="">
        <div class="co-cell co-cell-left">
            <div class="common-ell">{{content}}</div>
            <div>{{appendTime}}</div>
        </div>
    </li>`;

function Notifications() { }

Notifications.prototype = {
    popup: function (data) {
        var list = data.notifications;
        var decodeList = '';
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var context = item.params || item.content;
            var template = constant.notifications.types[item.type];

            var _data = {
                content: emotionDecode(regx(template, context)),
                appendTime: item.appendTime,
                avatarUrl: item.avatarUrl
            }

            decodeList += regx(noticeTemplate, _data);
        }
        return decodeList;
    },
    alert: function (data) {
        var note;
        if (data.isEditing) {
            note = notification('在线编辑', {
                focusWindowOnClick: true,
                delay: 6000,
                dir: 'auto',
                lang: 'en',
                icon: 'xietong_logo_single.png',
                tag: 'xt-tag',
                body: '邀请您来在线编辑文件'
            });

            // for xt desktop client
            if (typeof window.cefQuery !== 'undefined') {
                var prefix = 'DekstopNotification:';
                window.cefQuery({ request: prefix });
            }
        } else if (data.isJoinConference) {
            note = notification('视频会议', {
                focusWindowOnClick: true,
                delay: 6000,
                dir: 'auto',
                lang: 'en',
                icon: 'xietong_logo_single.png',
                tag: 'xt-tag',
                body: '邀请您参加视频会议'
            });

            // for xt desktop client
            if (typeof window.cefQuery !== 'undefined') {
                window.cefQuery({ request: 'DekstopNotification:' });
            }
        } else {
            // 2) display desktop notification if window is inactived
            var winState = window.sessionStorage.getItem("xt_focus_win_state");

            if (winState === "blur") {
                var type = data.notification.type;
                var content = data.notification.content;

                if (typeof content.target === 'string' && /\{.*?}/.test(content.target) === false) {
                    content.target = cleanHtmlTags(
                        htmlDecode(content.target)
                    );

                    if (typeof content.referenceWords === 'string') {
                        content.referenceWords = cleanHtmlTags(
                            htmlDecode(content.referenceWords)
                        );
                    }

                    if (typeof content.minute === 'string' || typeof content.minute === 'number') {
                        content.minute = cleanHtmlTags(
                            htmlDecode("" + content.minute)
                        );
                    }

                    // commonService.getMessageByKey("notifications.types." + type, content).then(function (msgContent) {
                    //     commonService.getMessageByKey("notifications.desktop").then(function (msgTitle) {
                    var msgContent = regx(constant.notifications.types[type], content);
                    var msgTitle = constant.notifications.desktop;
                    var msgBody = msgContent.replace(/<.*?>/ig, "");

                    var note = notification(msgTitle, {
                        // focusWindowOnClick: true,
                        delay: 6000,
                        dir: 'auto',
                        lang: 'en',
                        icon: './xietong_logo_single.png',
                        // tag: 'xt-tag',  //??!!
                        body: msgBody,
                        data: data.notification
                    });

                    note.on('click', function (event) {
                        var data = event.target.data;
                        var url = data.returnUrl;
                        // var toOwner = data.content.toOwner ? data.content.toOwner.substring(1) : $rootScope.user.id;

                        // if (data.type === "FileSharing") {
                        //     url = '/app/group/' + toOwner + '/filebox/share//';
                        //     window.location.replace(url);
                        // } else 

                        if (url) {
                            if (url.indexOf('/members') > -1) {
                                url = '/app/user/contact/group/' + url.split('/')[3];
                            }
                            window.location.replace(url);
                        } else {
                            window.focus();
                        }
                    });

                    // for xt desktop client
                    if (typeof window.cefQuery !== 'undefined') {
                        var prefix = 'DekstopNotification:';
                        window.cefQuery({ request: prefix + msgBody });
                    }
                    //     });
                    // });
                }
            }
        }
    }
}

var notifications = new Notifications();

module.exports = notifications;