//用于分页
function loadpage(PageCount, PageSize) {
    //记录总数
    var myPageCount = PageCount || parseInt($("#PageCount").val());
    //页面大小
    var myPageSize = PageSize || parseInt($("#PageSize").val());
    //求出最大页码
    var countindex = myPageCount % myPageSize > 0 ? (myPageCount / myPageSize) + 1 : (myPageCount / myPageSize);
    

    $('#pagination').jqPaginator({
        totalPages: countindex,
        visiblePages: 7,
        // 动态改变当前页码
        // currentPage: parseInt($("#CurPage").val()),
        first: '<li class="first"><a href="javascript:;">首页</a></li>',
        prev: '<li class="prev"><a href="javascript:;"><i class="arrow arrow2"></i>上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页<i class="arrow arrow3"></i></a></li>',
        last: '<li class="last"><a href="javascript:;">末页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if (type == "change") {
                //动态改变当前页码
                $('#pagination').jqPaginator('option', {currentPage: num});
                var data = {"page": num};
                $.ajax({
                    url: '/message',
                    type: 'post',
                    data: data,
                    success: function(data, status){
                        list(data);
                    }
                })
            }
        }
    });
};

//局部渲染信息列表
function list(data){
    var userList = data.userList;
    $('#list').empty();
    userList.forEach( function(element) {
        $('#list').append(`<tr>
                                <td>${element.user_id}</td>
                                <td>${element.name}</td>
                                <td>${element.company}</td>
                                <td>${element.phoneNumber}</td>
                                <td>注册</td>
                                <td>${element.status}</td>
                                <td>
                                    <a href="review?user_id=${element.user_id}" class="tablelink">显示评审项目</a>
                                </td>
                           </tr>`)
    });

    $('#messageTips').empty();
    $('#messageTips').append(`共<i class="blue">${data.total}</i>条记录，当前显示第&nbsp;
                                <i class="blue">${data.curPage}&nbsp;</i>页`);
};

$(document).ready(function () {
    //初始化分页框
    loadpage();

    $('#searchBtn').click(function(){
        var reviewArea = $('#reviewArea').val();
        console.log(reviewArea)
        var status = $('#status').val();
        console.log(status)

        var data = {"reviewArea":reviewArea, "status":status};
        
        //查询条件为空，刷新界面即可
        if(!reviewArea && !status){
            location.reload(true);
        }
        //查询条件不为空，向服务器请求数据 
        else {
            $.ajax({
                url: '/message',
                type: 'POST',
                data: data,
                success: function(data, status){
                    console.log('success');
                    console.log(data);
                    //重新初始化分页框
                    if(data.total == 0){
                        loadpage(1, data.limit);
                    } else{
                        loadpage(data.total, data.limit);
                    }
                    
                    list(data);             
                }
            });
        }
    });
});