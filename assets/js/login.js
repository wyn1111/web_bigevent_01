$(function(){
    // 1. 点击注册，显示注册隐藏登录
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 2. 点击登录，显示登录隐藏注册
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义校验规则
    var form = layui.form
    form.verify({
        // 密码规则
        pwd:[
            /^[\S]{6,12}$/,
            "密码必须6到12位，且不能出现空格"
        ],
        // 校验两次密码是否一致
        repwd:function(value){
            // 获取注册表单中的密码值
            var pwd = $('.reg-box [name=password]').val().trim()
            if(pwd !== value){
                return '两次密码输入不一致'
            }

        }
    })


    // 注册
    var layer = layui.layer
    $('#form_reg').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:{
                username:$('.reg-box [name=username]').val(),
                password:$('.reg-box [name=password]').val()
            },
            success:function(res){
                if(res.status !=0){
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                // 跳转到登录
                $('#link_login').click()
                // 重置注册表单
                $('#form_reg')[0].reset()
            }
        })
    })


    // 登录
    $('#form_login').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，登录成功')
                localStorage.setItem('token',res.token)
                location.href = '/index.html'
                
            }
        })
    })

})