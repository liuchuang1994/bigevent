$(function () {
    let layer = layui.layer;
    let form = layui.form;
//   发送Ajax请求
    getArtList();
    function getArtList() {
     $.ajax({
        url: '/my/article/cates',
         success: function (res) {
            // 校验
             if (res.status !== 0) {
            // 获取失败
                 return layer.msg('获取文章分类列表失败！')
             }
            // console.log(res);
            let htmlstr = template('trtpl', res)
            // 将数据结构添加到页面中
            $('#tb').html(htmlstr)     
        }
    })
    }
   

    //点击添加类别
    let index;
    $('#addBtn').on('click', function () {
        
        // 弹出添加类别框
        index = layer.open({
            type: 1,
            title:'添加文章分类',
            content: $('#addArTpl').html(),
            area: ['500px', '300px']
            // area: '500px'
        });
    })

    // 给表单添加submit事件
    // 通过事件委托注册
    $('body').on('submit', '#addForm', function (e) {
        //阻止表单的默认事件
        e.preventDefault()
        //获取表单数据
        let data = $(this).serialize()
        // 发送Ajax请求
        $.ajax({
            url: '/my/article/addcates',
            type: 'POST',
            data,
            success: function (res) {
                if (res.status !== 0) {
                  return layer.msg('新增文章分类失败！' + res.message)
                 }
            // 关闭弹出层
                layer.close(index);
            // 添加到页面中
                getArtList();
            }
        })
    })

    // 编辑功能
    // 点击编辑按钮，弹出编辑框
    let editIndex;
    $('#tb').on('click', '.editBtn', function () {
      // 弹出添加类别框
        editIndex = layer.open({
            type: 1,
            title:'编辑文章分类',
            content: $('#editArTpl').html(),
            // area: ['500px', '300px']
            area: '500px'
        });

         // 根据自定义属性data-id 获取对应的id值
        let id = $(this).attr('data-id')

        // 发送Ajax请求，获取数据
        $.ajax({
            url: '/my/article/cates/' +id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                 return layer.msg('获取文章分类数据失败！' + res.message)
                }
                //将数据添加到页面中
                form.val("editForm", res.data)
            }
        })
         
     // 给弹出的修改表单添加submit事件
     $('body').on('submit', '#editForm', function (e) {
        //阻止表单的默认事件
         e.preventDefault()
         //获取表单数据
         let data = $(this).serialize()
        //  console.log(data);
        // 发送Ajax请求
         $.ajax({
             url: '/my/article/updatecate',
             type: 'POST',
             data,
             success: function (res) {
            //  console.log(res);
                 if (res.status !== 0) {
                  return layer.msg('更新分类信息失败！' + res.message)
                 }
                  // 关闭弹出层
                layer.close(editIndex);
               // 添加到页面中
                getArtList();
                
             }
         })
        
        
    })
    })


    // 删除功能
    $('#tb').on('click', '.delBtn', function () {
         // 根据自定义属性data-id 获取对应的id值
        let id = $(this).attr('data-id')
         // 弹出确认框
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
        //点击确定后的操作
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    // 重新获取数据
                    getArtList();
                    // 关闭弹出层
                    layer.close(index);
                }
            })
       
       });
    })

   

})