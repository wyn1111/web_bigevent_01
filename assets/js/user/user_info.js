$(function () {
    // 1. 昵称校验规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1 ~ 6位之间！"
            }
        }
    })
    initUserInfo()

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用form.val()赋值
                form.val('formUserInfo', res.data)
            }

        })
    }


    // 重置表单的数据
    $('#btnReset').on('click',function(e){
        // 阻止默认重置
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        e.preventDefault()

        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data: $(this).serialize() ,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法 重新渲染用户信息

                //window.parent 获取iframe的父页面
                window.parent.getUserInfo()
            }
        })
    })
})

