//用于获取用户登录界面输入的数据

$(document).ready(function() {
    $('#login').click(function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var usertype = $("#usertype option:selected").val();
        console.log(usertype);
        var data = {"uname": username, "upwd": password, "utype": usertype};

        var bootstrapValidator = $("#defaultForm").data('bootstrapValidator');  
        bootstrapValidator.validate();  
        if(bootstrapValidator.isValid()){
            $.ajax({
                url: '/login',
                type: 'post',
                data: data,
                success: function(data, status) {
                    switch (data.type) {
                        case '密码错误':
                            $('#reason').text('你输入的密码有误，请检查你的密码并重新登录')
                            $('#tipModal').modal();
                            break;
                        case '用户不存在,请检查用户类型':
                            $('#reason').text('用户不存在,可能是用户类型有误，请检查你选择的用户类型并重新登录')
                            $('#tipModal').modal();
                            break;
                        case '用户不存在':
                            $('#reason').text('用户不存在,可能是用户名输入有误,请检查你输入的用户名是否正确并重新登录')
                            $('#tipModal').modal();
                            break;
                        case '登录成功':
                            if(usertype == '管理员'){
                                location.href = '/adminIndex';
                            } 
                            if(usertype == '专家') {
                                location.href = '/userIndex';
                            }
                            break;
                    }
                    
                },
                error: function(data, status) {
                    $('#reason').text('系统未知错误，请你重新登录')
                    $('#tipModal').modal();
                }
            });
        }
    });

    $('#closeBtn').click(function(){
        location.href = '/login';
    });

    $('#defaultForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            utype:{
                validators:{
                    notEmpty: {
                        message: '请选择用户类型'
                    }
                }
            },
            uname:{
                message: '无效用户名',

                validators:{
                    notEmpty:{
                        message: '用户名不能为空'
                    },
                    stringLength:{
                        min:5,
                        max:20,
                        message: '用户名长度必须在5到20之间'
                    },
                    regexp:{
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名由数字、字母、下划线和.组成'
                    }
                }
            },
            upass:{
                message:'密码无效',
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 20,
                        message: '密码长度必须在6到20之间'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码只能包含数字、字母、下划线和.'
                     }
                 }
            },
            re_upass: {
                message: '密码无效',
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    identical: {//相同
                        field: 'upass',
                        message: '两次密码不一致'
                    },
                    regexp: {//匹配规则
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码只能包含数字、字母、下划线和.'
                    }
                }
            }
        }
    });



});


    
