$(function () {
  let layer = layui.layer
  let form = layui.form

  
  // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)
  

  // 初始化富文本编辑器
   initEditor()
  
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
  }
})
  
// 发表文章
  
  // 获取状态的值
  let state;
    $('#publish').click(function () {
      state = '发布'
    })

    $('#draft').click(function () {
      state = '存为草稿'
    })
  
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
    .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
      // 将封面和状态追加到fd 中
      fd.append("cover_img", blob);
      fd.append("state", state);

      // fd.forEach(function (v, k) {
      // console.log(v,k);
      // });

      // 发送Ajax发表文章
      $.ajax({
        url: '/my/article/add',
        type: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success: function (res) {
          console.log(res);
          if (res.status !== 0) {
           return layer.msg('发布文章失败！')
          }

          // 成功
          // 跳转到文章列表页面
          location.href = '/article/article.html'

        }
      
      })

   })

    
  })
  
  
})