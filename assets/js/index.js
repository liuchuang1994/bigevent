    // 先调用函数
    getuserInfo()
     var layer = layui.layer;
    // 将发送ajax封装成一个函数
    function getuserInfo() {
    //发送Ajax获取用户的基本信息
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //  Authorization:localStorage.getItem('token')
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
            //  获取失败
                return layer.msg(res.message);
            }
            // 对nickname 和 username 进行优先级判断
            let name = res.data.nickname || res.data.username;
            // console.log(name);
            $('.welcome').text('欢迎' + name)

            // 对头像进行优先级判断
            if (res.data.user_pic) {
            //  显示图片头像
                 $('.layui-nav-img').show()
                 $('.layui-nav-img').attr('src',res.data.user_pic)
            //  隐藏文字头像
                $('.textAvatar').hide()
            } else {
            //  显示文字头像 将name的第一个字母作为头像，且大写
                $('.textAvatar').show().text(name[0].toUpperCase())
            //  隐藏图片头像
                $('.layui-nav-img').hide()
            }
        },
        complete: function (res) {
            // console.log(res);
            let data = res.responseJSON;
            // console.log(data);
            // 校验
            if (data.message !== '获取用户基本信息成功！' && data.status !== 0) {
              // 返回登录页面
              location.href = '/home/login.html'
              // 清除token
              localStorage.removeItem('token')
            }
        }
    })  
    }

// 实现退出功能
$('#logout').click(function () {
    // 弹出询问框
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
     // 返回登录页面
    location.href = '/home/login.html'
    // 清除token
    localStorage.removeItem('token')
  
     layer.close(index);
   });
   
})
