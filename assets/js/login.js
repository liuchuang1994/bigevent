$(function () {
    // 点击切换登录和注册页面
    $('#toRegister').on('click', function(){
        $('.login').hide()
        $('.register').show()
    })
    $('#tologin').on('click', function(){
        $('.login').show()
        $('.register').hide()
    })

   
    var form = layui.form;
     var layer = layui.layer;
    // 表单校验功能
    form.verify({
  //我们既支持上述函数式的方式，也支持下述数组的形式
  //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'] ,
    // 让确认密码和密码一致
        repass: function (value, item) {
            //value：表单的值、item：表单的DOM对象
            if( value !== $('.layuiIpt').val()  ){
                return  '两次密码不一致，请重新输入';
              }
        }
    });      
    
    $.ajaxPrefilter(function (options) {
     options.url = "http://ajax.frontend.itheima.net" + options.url;
    })

   // 注册功能
    // 给form表单注册submit事件
    $('#registerForm').on('submit', function (e) {
    //  阻止表单的默认行为
        e.preventDefault();
        // 获取表单数据
        let data = $(this).serialize();
        // 发送Ajax
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data,
            success: function (res) {
            //  console.log(res);
                // 注册失败
                if (res.status !== 0) {
                 return  layer.msg(res.message);
                }
                // 注册成功
                layer.msg('注册成功');
                // 清空表单
                $('#registerForm')[0].reset()
                // 跳转到登录页面  触发 '去登录'按钮的click事件
                $('#tologin').click() 
            }
        
        })
    })
    $(document).on('keyup', function (e) {
        if (e.keyCode === 13) {
         $('#registerForm').click()
        }
    })


    // 登录功能
// 给form表单注册submit事件
    $('#loginForm').on('submit', function (e) {
    //  阻止表单的默认行为
        e.preventDefault();
        // 获取表单数据
        let data = $(this).serialize();
        // 发送Ajax
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data,
            success: function (res) {
            //  登录失败
                if (res.status !== 0) {
                 return  layer.msg(res.message);
                }
                // 登录成功
                layer.msg('登录成功', {
                    time: 2000  //2秒关闭（如果不配置，默认是3秒）
                  }, function(){
                    location.href = "/home/index.html"
                  });  
            }
            
        })
    })
     $(document).on('keyup', function (e) {
        if (e.keyCode === 13) {
         $('#loginForm').click()
        }
    })


})