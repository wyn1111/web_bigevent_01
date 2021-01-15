// 开发环境
var baseURL = 'http://api-breakingnews-web.itheima.net'
// 在发送$.get() $.post() $.ajax() 之前会调用
$.ajaxPrefilter(function(options){
    // 获取到ajax多有的参数信息
    options.url = baseURL + options.url

})