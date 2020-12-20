$(function () {
    let form = layui.form
    let layer = layui.layer
// 发送ajax
    getUser()
    function getUser() {
     $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res);
            //给表单赋值
         form.val("form",res.data );
        }
    })
  }

    // 重置功能
    $('[type=reset]').click(function (e) {
      // 阻止表单的默认行为
        e.preventDefault()
        // 返回初始值
        getUser()
    })



   // 给表单注册submit事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认行为
        e.preventDefault()
        // 获取表单的值
        let data = $(this).serialize()
        // 发送Ajax
        $.ajax({
            url: '/my/userinfo',
            type: 'POST',
            data,
            success: function (res) {
                if (res.status !== 0) {
                //  修改失败
                    return  layer.msg('修改用户信息失败')
                }
                 
                // 修改成功
                 layer.msg('修改用户信息成功')
                // 将修改的信息提交到index主页面
                // 通过window.parent
                 window.parent.getuserInfo();
               
            },
        })
     
    })
})