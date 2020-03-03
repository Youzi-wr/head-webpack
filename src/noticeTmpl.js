module.exports = {
    "notifications": {
        "types": {
            "INVITE_JOIN_EDITING_SESSION": "{{nickName}} 邀你参与编辑文件: {{fileName}}",
            "InviteJoinEditing": "{{from}} 邀你参与编辑文件: <span class='action'>{{target}}</span>",
            "ReInviteJoinEditing": "{{from}} 邀你参与编辑文件: <span class='action'>{{target}}</span>",
            "InviteJoinUsingApp": "{{from}} 邀你一起使用应用程序",
            "ReInviteJoinUsingApp": "{{from}} 邀你一起使用应用程序",
            "InviteJoinIM": "{{from}} 邀你开始聊天",
            "EmergencyMessage": "关于<span class='action'>{{from}}</span>的紧急通知",
            "AtUserInComment": "{{from}}<span class='action'>@了你:</span>{{referenceWords}}",
            "AtGroupInComment": "{{from}}<span class='action'>@了你所在的群 {{target}}:</span>{{referenceWords}}",
            "UserRemovedFromPost": "你已经被移出<span class='action'>{{from}}</span>的讨论",
            "UserBannedInGroup": "你在项目<span class='action'>{{from}}</span>中被禁言",
            "UserExitGroup": "{{from}} 用户已经退出了项目<span class='action'>{{target}}</span>",
            "NewTaskAssigned": "{{from}} 分配给你的任务:<span class='action'>{{target}}</span>",
            "TaskCompleted": "{{from}} 完成了任务:<span class='action'>{{target}}</span>",
            "UndoTaskComplete": "{{from}} 将任务:<span class='action'>{{target}}</span> 标记为未完成",
            "FileSharing": "{{from}} 共享了文件给你:<span class='action'>{{target}}</span>",
            "NewPostReceived": "{{from}} 发送了新消息给你:<span class='action'>{{target}}</span>",
            "NewCommentArrived": "{{from}}:<span class='action'>{{target}}</span>",
            "TaskPostponed": "{{from}} 变更了任务截止日期<span class='action'>{{target}}</span>",
            "TaskImportanceChanged": "{{from}} 变更了任务的重要等级:<span class='action'>{{target}}</span>",
            "TaskContentChanged": "{{from}} 修改了任务:<span class='action'>{{target}}</span>",
            "TaskApproaching": "<span class='action'>{{target}}</span>任务明天将期",
            "InviteJoinGroup": "你已被邀加入项目<span class='action'>{{target}}</span>",
            "MeetingApproaching": "<span class='action'>{{target}}</span>会议{{minute}}分钟后开始",
            "MeetingChanged": "<span class='action'>{{from}}</span>将<span class='action'>{{target}}</span>会议发生变更",
            "MeetingCanceled": "<span class='action'>{{from}}</span>将<span class='action'>{{target}}</span>会议取消",
            "MeetingAccepted": "<span class='action'>{{from}}</span>接受了<span class='action'>{{target}}</span>会议",
            "MeetingDeclined": "<span class='action'>{{from}}</span>拒绝了<span class='action'>{{target}}</span>会议",
            "JoinTenantApproved": "您已成功加入<span class='action'>{{target}}</span>企业",
            "JoinTenantRejected": "您加入<span class='action'>{{target}}</span>企业的请求被管理员拒绝",
            "RemoveFromGroup": "您已被管理员从项目<span class='action'>{{target}}</span>中移除",
            "ChangeRoleOfMember": "您在项目<span class='action'>{{target}}</span>中的角色已被变更为{{'notifications.role.'+changeToRole | translate}}"
        },
        "desktop": "你收到一条新消息",
        "role": {
            "GUEST": "游客",
            "ADMIN": "管理员",
            "MEMBER": "成员"
        }
    }
}