$(function () {
    // 定义美化时间过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var h = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var s = padZero(dt.getSeconds())

        return y + '-' + m + '-' + s + ' ' + h + ':' + mm + ':' + s
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 1. 定义一个查询参数对象 将来查询数据使用
    var q = {
        pagenum: 1,      // 页码值
        pagesize: 2,    // 每页显示多少条数据
        cate_id: '',    // 文章分类的 Id
        state: ''      // 文章的状态，可选值有：已发布、草稿
    }


    // 2. 获取文章列表数据
    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页渲染
                renderPage(res.total)
            }
        })
    }


    // 3. 初始化分类
    initCate()
    var form = layui.form
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                // 下拉菜单数据不同步 需要调用form.render()重新渲染UI结构 
                form.render()
            }
        })
    }


    // 4. 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()

    })


    // 5. 渲染分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // console.log(total);
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' ,       // 注意，这里的 test1 是 ID，不用加 # 号
            count: total,           // 数据总数，从服务端得到
            limit:q.pagesize,      // 每页几条数据
            curr:q.pagenum  ,      // 当前页
            layout:['count','limit','prev', 'page', 'next','skip'],
            limits:[2,3,5,10],

            // 分页切换时 调用jump回调函数
            // laypage.render 执行时 调用
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
               q.pagenum = obj.curr   // 最新的页码值
               q.pagesize = obj.limit   // 最新的条目数
                
                //首次不执行
                if(!first){
                  initTable()

                }
              }
        });
    }


    // 6. 删除
    $('tbody').on('click','.btn-delete',function(){
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status !==0){
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message)
                    // 删除之后 判断当前页面还有几条数据 没有数据时 让页码减一
                    // if(len === 1){
                    //     // 页码值最小为1
                    //     q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    // }
                    if(len === 1 && q.pagenum > 1){
                        q.pagenum--
                    }
                    initTable()
                    layer.close(index);
                }
            })
            
          });
    })

})