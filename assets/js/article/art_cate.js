$(function () {
    // 1. 初始化文章分类列表
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 显示添加区域
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layui.layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式为表达绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 弹出提示，刷新列表，关闭弹窗
                layer.msg(res.message)
                initArtCateList()
                layui.layer.close(indexAdd);
            }
        })
    })


    // 通过代理的形式为编辑按钮绑定点击事件
    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layui.layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        })
        //  获取自定义属性
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 赋值
                form.val('form-edit', res.data)
            }
        })
    })

    // 更新修改后的数据
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 弹出提示，刷新列表，关闭弹窗
                layer.msg(res.message)
                initArtCateList()
                layui.layer.close(indexEdit);
            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否确认删除
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    // 弹出提示，刷新列表，关闭弹窗
                    layer.msg(res.message)
                    initArtCateList()
                    layer.close(index);
                }

            })

            
        });

    })
})
