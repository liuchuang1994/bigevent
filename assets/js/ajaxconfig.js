
 $.ajaxPrefilter(function (options) {
     options.url = "http://ajax.frontend.itheima.net" + options.url;
     
     options.headers = {
         Authorization:localStorage.getItem('token')
        }
 })
    
    