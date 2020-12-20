$(function () {
  let layer = layui.layer
  let form = layui.form

   // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
    let params = new URLSearchParams(location.search)
    let artId = params.get('id')
    // console.log(artId);
     // 文章的发布状态
    let state = ''
   
   // 获取文章类别
   $.ajax({
    url: '/my/article/cates',
    success: function (res) {
    // console.log(res);
    if (res.status !== 0) {
      layer.msg('获取文章列表失败')
    }
     res.data.forEach(item => {
       // 创建标签，添加到 select中
      $(`<option value="${item.Id}">${item.name}</option>`).appendTo($('#cateSelect'))
     });  
    // 重新渲染
      form.render()
      getArticle()
  }
})
   
  // 根据 Id 获取文章详情
  var $image = $('#image')
  var options;
  function getArticle() {
    $.get('/my/article/' + artId, function (res) {
      // console.log(res);
      // 获取数据失败
      if (res.status !== 0) {
        return layer.msg('获取文章失败！')
      }
      // 获取数据成功
      let art = res.data 
      // 为 form 表单赋初始值
      form.val('editArticle', {
        Id: art.Id,
        title: art.title,
        cate_id: art.cate_id,
        content: art.content,
      })
       // 初始化富文本编辑器
      initEditor()

      $image.attr('src', 'http://ajax.frontend.itheima.net' + art.cover_img)

      // 裁剪选项
      options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview',
      }
      // 初始化裁剪区域
      $image.cropper(options)
    })
  }
     //  获取封面
  $("#chooseCover").click(function () {
    $("#file").click();
  });

  // 更换裁切图片
  
  $('#file').change(function () {
    // 拿到用户选择的文件 
    let file = this.files[0]
    console.log(file);
    // 根据选择的文件，创建一个对应的 URL 地址
    let newImgURL = URL.createObjectURL(file)

    $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper(options)        // 重新初始化裁剪区域
  })


// 发表文章
  // 获取状态的值
    $('#publish').click(function () {
      state = '发布'
    })
    $('#draft').click(function () {
      state = '存为草稿'
    })
  
  
  // 给表单注册submit事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();

    // 获取表单数据
    let fd = new FormData(this)   //可以获取标题，类别 ，内容

    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
     
        // 得到文件对象后，进行后续的操作
        // 将封面和状态追加到fd 中
        fd.append("cover_img", blob);
        fd.append("state", state);
        fd.append('Id',artId)

        // 发送Ajax发表文章
        $.ajax({
          url: '/my/article/edit',
          type: 'POST',
          data: fd,
          contentType: false,
          processData: false,
          success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
              return layer.msg(res.message)
            }

            // 成功
            // 跳转到文章列表页面
            location.href = '/article/article.html'
          },
        });
      });
  });
})