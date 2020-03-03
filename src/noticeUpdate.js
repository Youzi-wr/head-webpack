var constant = require('./noticeTmpl.js');

var CONTEXTPATH = 'https://192.168.12.106';

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

function loadStyle(url) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
}
loadStyle('main.css');

var noticeTemplate = `
    <li>
        <img class="co-cell" src="${CONTEXTPATH}{{avatarUrl}}" alt="">
        <div class="co-cell co-cell-left">
            <div class="common-ell">{{content}}</div>
            <div>{{appendTime}}</div>
        </div>
    </li>`;

var transferNotice = function (obj) {
    if (!obj.success) return '';

    var data = obj.data;
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
}

module.exports = transferNotice;