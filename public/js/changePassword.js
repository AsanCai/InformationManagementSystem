//用于获取用户修改密码时输入的数据
$(document).ready(function() {
    $('#sure').click(function(){

        var pwd = $("#password").val();
        var npwd = $('#new_password').val();
        var re_npwd = $("re_new_password").val();

        var data = {"pwd": pwd, "npwd": npwd, "re_npwd": re_npwd};
        $.ajax({
            url: '/changePassword',
            type: 'post',
            data: data,
            success: function(data, status) {
                console.log(status);
                if(status == 'success') {
                    location.href = '/changePassword';
                }
            },
            error: function(data, status) {
                if(status == 'error') {
                    alert('密码错误');
                }
            }
        });
    });

    $('#cancel').click(function(){
        location.href = 'changePassword';
    });

    $('#defaultForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            pwd:{
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
            npwd:{
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
            re_npwd: {
                message: '密码无效',
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    identical: {//相同
                        field: 'npwd',
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


    
