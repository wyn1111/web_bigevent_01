$(function(){
    // 调用函数 获取用户基本信息
    getUserInfo()


    // 退出登录功能
    $('#btnLogout').on('click',function(){
        // 弹窗
        layer.confirm('是否确认退出登录?', {icon: 3, title:'提示'}, function(index){
            // 清空本地token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html'
            // 关闭询问框
            layui.layer.close(index);
        });
    })


})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // 设置请求头
        // headers:{
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success:function (res) {
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败')
            }
            // 渲染用户信息和头像
            renderAvatar(res.data)
        },
        complete:function(res){

        }
    })
}


// 渲染用户信息和头像
function renderAvatar(user) {
    // 1. 获取用户名称
    var name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 3. 按需渲染用户的头像
    if(user.user_pic !== null){
        // 有图片头像 渲染图片头像
        $('.layui-nav-img').show().attr('src',user.user_pic)
        $('.text-avatar').hide()
    }else{
        // 没有图片头像 渲染文字头像 第一个首字母大写
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.text-avatar').show().html(text)
    }
}