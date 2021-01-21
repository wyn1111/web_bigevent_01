$(function () {
    var form = layui.form

    //  设置表单信息
    function initForm() {
        var id = location.search.split('=')[1];
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 渲染到form表单中
                form.val('form-edit', res.data)
                // 赋值
                tinyMCE.activeEditor.setContent(res.data.content)
                // 图片
                if (!res.data.cover_img) {
                    return layui.layer.msg("用户未曾上传头像！")
                }
                var newImgURL = baseURL + res.data.cover_img;
                // 裁剪图片
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })
    }

    initCate()
    // 1. 初始化分类
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
                form.render()
                initForm()
            }

        })
    }

    // 2. 初始化富文本编辑器
    initEditor()

    //3.1  初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)



    // 4. 修改封面
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })


    // 5. 监听coverFile的change事件 获取用户选的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取文件列表
        var file = e.target.files[0]
        // 判断用户是否选择图片
        if (file === undefined) {
            return
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 6. 修改文章状态
    var art_state = '已发布';
    // $('#btnSave1').click(function(){
    //     art_state = '已发布'
    // })
    $('#btnSave2').click(function () {
        art_state = '草稿'
    })


    // 7. 为表单绑定提交事件
    $('#form-edit').on('submit', function (e) {
        e.preventDefault()
        // 创建 FormData 对象
        var fd = new FormData(this)
        // 添加状态
        fd.append('state', art_state)
        // 将封面裁剪过后的图片 输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)

                // console.log(...fd);
            })

    })


    // 发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                // 跳转
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                }, 1500)
            }
        })
    }

})