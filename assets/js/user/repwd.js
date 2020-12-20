$(function () {
    let form = layui.form;
    let layer = layui.layer;
 
    // 自定义校验规则
    form.verify({
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
          
        // 新旧密码不能相同
        oldPass: function (value) {
            // 获取原密码的值
            // 校验
            if (value === $('#oldPwd').val()) {
                return ('新旧密码不能相同！')
            }
        },
        // 两次新密码必须相同
        newPass: function (value) {
            // 获取新密码的值
            //   校验
            if ($('#newPwd').val() !== value) {
                return ('两次输入密码不一致！')
            }
        },
         
    });
    

    // 给表单注册submit事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认行为
        e.preventDefault();
        // 获取表单数据
        let data = $(this).serialize();
        // 发送Ajax
        $.ajax({
            url: '/my/updatepwd',
            type: 'POST',
            data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    //  修改密码失败
                    return layer.msg('修改密码失败' + res.message)
                }
                // 修改密码成功
                layer.msg('修改密码成功');
                // 清空表单
                // $("form")[0].reset();
                console.log($('.layui-form')[0]);

            },
        });
    
    });

});