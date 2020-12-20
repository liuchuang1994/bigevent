

// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')

// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 点击确定模拟上传文件
$('#chooseBtn').click(function () {
  $('#file').click()
})

// 实现选择文件
// 给文件域注册change事件
$('#file').on('change', function () {
    // console.log('文件改变了');
   // 1. 获取到我们选择的图片 ==> 通过文件域DOM对象的files的属性
    let file = this.files[0];
    // console.log(file);

    // 2、根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(file)
    
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域

})


let layer = layui.layer
// 点击确定按钮 上传裁剪后的图片
$('#sureBtn').click(function () {
    // 将裁剪后的图片，输出为 base64 格式的字符串
 let  dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // console.log(dataURL);

    // 发送Ajax 更换头像
    $.ajax({
        url: '/my/update/avatar',
        type: 'POST',
        data: {
          avatar:dataURL
        },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
            //   更新头像失败
                return  layer.msg('更新头像失败！' + res.message)
            }
            // 更新头像成功
            layer.msg('更新头像成功！')
            // 更换头像
            window.parent.getuserInfo()
        }
    })
})
