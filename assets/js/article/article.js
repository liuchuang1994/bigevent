$(function () {
    let form = layui.form;
    let layer = layui.layer;
    var laypage = layui.laypage;

    let query = {
        pagenum: 1,  //页码值,m默认为1
        pagesize: 2,  	//每页显示多少条数据 ，默认为2
        cate_id:'',     //文章分类id ，默认为所有分类
        state: '',       //	文章的状态，可选值有：已发布、草稿  默认为所有状态
    }
  // 获取文章列表
    getArtList()
    function getArtList() {
    // 发送Ajax请求
        $.ajax({
            url: '/my/article/list',
            data: query,
            success: function (res) {
              // console.log(res);
              if (res.status !== 0) {
               return  layer.msg('获取文章列表失败')
              }
                // 使用 template函数将模板和数据结合
                let htmlstr = template('addFormTpl', res)
                // 将结构显示在页面中
              $('#tb').html(htmlstr)  
              // 调用分页函数渲染
               getPage(res.total)
            }
            
        })
  }
   
    
    // 时间格式补0函数
    let addZero = (n) => (n < 10 ? '0' + n : n);
   // 使用过滤器美化事件格式
    template.defaults.imports.filterTime = function (time) {
        let date = new Date(time);
        let y = addZero(date.getFullYear());
        let m = addZero(date.getMonth() + 1);
        let d = addZero(date.getDate());
        let h = addZero(date.getHours());
        let mm = addZero(date.getMinutes());
        let s = addZero(date.getSeconds());

        return `${y}-${m}-${d} ${h}:${mm}:${s}`
    }

    // 获取分类列表
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
          if (res.status !== 0) {
               return  layer.msg('获取文章分类列表失败')
              }
            // console.log(res);
            // 遍历获取的数据，添加到页面中
            res.data.forEach(item => {
                 $(`<option value="${item.Id}">${item.name}</option>`).appendTo($('#cateSelect'))
            });
          // 重新渲染
           form.render(); 
      }
        
    })

     // 分页
    // getPage()
    function getPage(total) {
      laypage.render({
        elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
        count: total,//数据总数，从服务端得到
        limit: query.pagesize,  //当前页
        limits: [2, 3, 5, 10, 20],   //每页显示的条数
        curr: query.pagenum, // 起始页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        jump: function(obj, first){
         //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数
            query.pagesize = obj.limit;
            query.pagenum = obj.curr;
           //首次不执行
           if(!first){
              getArtList()
          }
       }
    });
  }
   
   
    // 筛选功能
    // 给form表单注册submit事件
    // 利用query的值获取状态和类型
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认行为
    e.preventDefault();
    // 获取下拉列表的状态
    query.cate_id = $('#cateSelect').val();
    query.state = $('#stateSelect').val();

    // 重新获取文章列表
      
    getArtList()
  }) 


  //  删除功能
  $('#tb').on('click', '.delBtn', function () {
    // 通过自定义属性获取对应的id
    let id = $(this).attr('data-id')
    // console.log(id);
    // 弹出确认框
     layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      // 点击确认后的事件
      // 发送Ajax删除数据
      //  判断当前页是否只剩下一条数据  如果是，删除后显示的页面为当前页面的上一页（通过删除按钮的数量进行判断）
      //  并且当pagenum 页码值为 1 时，就不需要-1，只需要将页码=1
            
       if ($(".delBtn").length === 1) {
       // if成立，说明页面中还有一个删除按钮，但是经过ajax的删除操作，页面中就没有了当前这页的数据（加载上一页的数据）
         if (query.pagenum === 1) {
            query.pagenum = 1;
           } else {
            query.pagenum = query.pagenum - 1;
           }
         }

       $.ajax({
         url: '/my/article/delete/' + id,
         success: function (res) {
          // console.log(res);
          // 判断
           if (res.status !== 0) {
            return layer.msg('删除失败！')
           }
          //  成功
          //  重新获取文章列表
           getArtList()
          //  关闭弹出层
            layer.close(index);
         }
       })
     });
  })


  // 编辑文章
  $('#tb').on('click','.editBtn', function () { 
    location.href = '/article/art_rev.html?id=' +  $(this).attr('data-id') 
  })


})