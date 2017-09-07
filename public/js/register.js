//用于获取用户注册时输入的信息

$(document).ready(function() {

    $("#login").click(function(){
       location.href="login";
    });

    $("#register").click(function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var usertype = '专家';

        var bootstrapValidator = $("#form").data('bootstrapValidator');  
        bootstrapValidator.validate();  
        if (bootstrapValidator.isValid()) {
            var data = {"uname": username, "upwd": password, "utype": usertype};
            $.ajax({
                url: '/register',
                    type: 'post',
                    data: data,
                    success: function(data, status) {
                        $('#tipModalLabel').text('注册成功');
                        $('#reason').text('恭喜你注册成功，正在跳转登录界面，请稍后....');
                        $('#tipModal').modal();
                        $('#tipFooter').addClass('hide');
                        setTimeout(function(){
                            location.href = '/login';
                        }, 2000);
                    },
                    error: function(data, status) {
                        $('#tipModalLabel').text('注册失败');
                        $('#reason').text('系统未知错误，请你重新注册');
                        $('#tipModal').modal();
                    }
            });
        }
    });

    $('#closeBtn').click(function(){
        location.href = '/login';
    });


    $('#form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            uname:{
                message: '无效用户名',

                //设置remote验证的阈值，超过五个字符才开始验证
                threshold:5,

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
                    },
                    //开启实时ajax验证 
                    //向服务发送当前input name值
                    //服务器返回一个json数据，{"valid":true}表示验证通过，{"valid":false}表示验证失败
                    remote: {
                        url: '/userValidation',//验证地址
                        message: '用户已存在',//提示消息
                        delay :  2000,//每输入一个字符，就发ajax请求，服务器压力还是太大，设置2秒发送一次ajax（默认输入一个字符，提交一次，服务器压力太大）
                        type: 'POST',//请求方式
                        //自定义提交数据，默认值提交当前input value
                        // data: function(validator) {
                        //     return {
                        //         password: $('[name="passwordNameAttributeInYourForm"]').val(),
                        //         whatever: $('[name="whateverNameAttributeInYourForm"]').val()
                        //     };
                        // }
                        
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