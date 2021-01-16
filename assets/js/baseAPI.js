// 开发环境
var baseURL = 'http://api-breakingnews-web.itheima.net'
// 在发送$.get() $.post() $.ajax() 之前会调用
$.ajaxPrefilter(function(options){
    // 获取到ajax多有的参数信息
    // 1. 根路径
    options.url = baseURL + options.url

    // 2. 给有权限的路径添加头信息
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    

    // 3. 登录拦截（不登录，不允许访问其他页面）
    options.complete = function(res){
        console.log(res);
        var obj = res.responseJSON;
        if(obj.status !== 0 && obj.message === "身份认证失败！"){
             // 清空本地token
             localStorage.removeItem('token')
             // 页面跳转
             location.href = '/login.html'
        }
    }



})