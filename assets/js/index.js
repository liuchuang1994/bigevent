$(function () {
    // 先调用函数
    getuserInfo()
    // 将发送ajax封装成一个函数
    function getuserInfo() {
    //发送Ajax获取用户的基本信息
    $.ajax({
        url: '/my/userinfo',
        headers: {
         Authorization:localStorage.getItem('token')
        },
        success: function (res) {
            console.log(res);
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
        }
    })  
    }


})