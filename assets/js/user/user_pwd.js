$(function(){
    var form  = layui.form
    // 定义密码规则
    form.verify({
        // 所有密码
        pwd:[/^[\S]{6,12}$/,"密码必须6到12位，且不能出现空格"],
        // 新密码与旧密码不能一致
        samePwd: function(value){
            if(value === $('[name=oldPwd]').val()){
                return "原密码和旧密码不能相同"
            }
        },
        // 确认新密码 必须与新密码一致
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return "两次新密码输入不一致"
            }
        }
    })

    // 修改密码
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                // 重置表单
                $('.layui-form')[0].reset()
                
            }
        })
    })
})