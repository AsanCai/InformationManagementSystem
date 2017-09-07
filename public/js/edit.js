/****************************用于操作表单会用到的一些全局变量*******************************/
    // 用于获取动态添加的信息
    var 
        Qualification = [],
        ReviewExprience = [],
        WorkExprience = [],
        AvoidCompany = [];

    // 在数组原型添加方法，便于操作
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };


    //定义两个验证函数
    var notEmptyValidator = function(mess){
        return {
            validators: {
                notEmpty: {
                    message: mess
                }
            }
        }
    };

    var timeValidators = {
            validators: {
                notEmpty: {
                    message: '请选择一个日期'
                },
                date: {
                    format: 'MM/DD/YYYY',
                    message: '日期格式非法'
                }
            }
        },
        qualIndex = 0,
        avoidCompanyIndex = 0,
        reviewExprienceIndex = 0
        workExprienceIndex = 0;


    var fileList;
/****************************用于操作表单会用到的一些全局变量*******************************/

    

/******************************用于为表单设置默认值*******************************/

    // 用于渲染edit页面的初始值
    var setDefaultData;


    var getDefaultData = function(){
        //请求data数据
        $.ajax({
          url: '/edit?default=true',
          type: 'GET',
          success: function(data, status){
                        // console.log(data);
                        // console.log(typeof data);
                        setDefaultData(data);
                    },
          dataType: "json"
        });
    }
/******************************用于为表单设置默认值*******************************/




/******************************用于设置检验方式*******************************/
$(document).ready(function() {
    /**************************************这一部分用于上传图片**********************************/
    var idFile;
    var delParent;
    var cloneDiv = $(".file").parent().clone();
    var max = 1;
    var defaults = {
        fileType         : ["jpg","png","bmp","jpeg"],   // 上传文件的类型
        fileSize         : 1024 * 1024 * 10                  // 上传文件的大小 10M
    };

    //选择的图片发生改变的函数
    var fileChange = function(){
         //获取当前节点的id值，也就是file     
        idFile = $(this).attr("id");

        var file = document.getElementById(idFile);

        //返回class为.z_photo的父类标签
        //存放图片的父亲元素
        var imgContainer = $(this).parents(".z_photo");

        //获取的图片文件
        //也就是每次点击上传文件文本框之后选择的图片
        //files对象是只读的
        fileList = file.files;

        
        //文本框的直接父亲元素
        var input = $(this).parent();

        var imgArr = [];
        //遍历得到的图片文件
        var numUp = imgContainer.find(".up-section").length;


        var totalNum = numUp + fileList.length;  //总的数量
        if(fileList.length > max || totalNum > max ){
            //一次选择上传超过max个 或者是已经上传和这次上传的到的总数也不可以超过max个
            alert(`上传图片数目不可以超过${max}个，请重新选择`);  
        }
        else if(numUp < max){
            //判断上传的文件是否符合要求
            fileList = validateUp(fileList);

            for(var i = 0;i<fileList.length;i++){
                //获取上传图片的url，实现预览
                //使用HTML5的File API,获取file在电脑上的url，实现预览
                var imgUrl;
                if (window.createObjectURL!=undefined) { // basic
                    imgUrl = window.createObjectURL(fileList[i]);
                } else if (window.URL!=undefined) { // mozilla(firefox)
                    imgUrl = window.URL.createObjectURL(fileList[i]);
                } else if (window.webkitURL!=undefined) { // webkit or chrome
                    imgUrl = window.webkitURL.createObjectURL(fileList[i]);
                }
                imgArr.push(imgUrl);

                //创建一个secton标签，并返回相应的Jquery对象
                var $section = $("<section class='up-section fl loading'>");
                    //prepend是在被选元素的开头(里面)插入指定的内容
                    imgContainer.prepend($section);

                var $span = $("<span class='up-span'>");
                    //在section后面(仍在内部)插入span
                    $span.appendTo($section);
                
                var $img0 = $("<img class='close-upimg'>").on("click",function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        $(".works-mask").show();
                        delParent = $(this).parent();
                    });   
                    $img0.attr("src","/images/used/delete.png").appendTo($section);

                var $img = $("<img class='up-img up-opcity'>");
                    $img.attr("src",imgArr[i]);
                    $img.appendTo($section);
                

                var $input = $("<input id='taglocation' name='taglocation' value='' type='hidden'>");
                    $input.appendTo($section);
                var $input2 = $("<input id='tags' name='tags' value='' type='hidden'/>");
                    $input2.appendTo($section);
           }
        }
        setTimeout(function(){
             $(".up-section").removeClass("loading");
             $(".up-img").removeClass("up-opcity");
         },450);
         numUp = imgContainer.find(".up-section").length;
        if(numUp >= max){
            //隐藏显示图片的按钮
            $(this).parent().hide();
        }
    } 

    /*点击图片的文本框*/
    $(".file").change(fileChange);
    
   
    $(".z_photo").delegate(".close-upimg","click",function(){
          $(".works-mask").show();
          delParent = $(this).parent();
    });
        
    $(".wsdel-ok").click(function(){
        $(".works-mask").hide();
        var numUp = delParent.siblings().length;
        console.log(numUp);

        if(numUp <= max){
            //显示添加图片的框
            delParent.parent().find(".z_file").show();
        }

        //清除之前选择的文件，否则无法删除之后上传同一文件
        delParent.remove();
        

        //清除掉原来的input框，重新复制一个新的、value为空的input框
        var file = $(".file");
        file.after(file.clone().val(""));
        file.remove();
        //需要为重新复制的input框重新绑定change事件
        $(".file").change(fileChange);

        $('#form').bootstrapValidator('removeField', $('#pictureInput'));
        $('#form').bootstrapValidator('addField', 
                    'pictureInput', notEmptyValidator('请选择你要上传的图片'));
    });
    
    $(".wsdel-no").click(function(){
        $(".works-mask").hide();
    });
    

    function validateUp(files){
        var arrFiles = [];//替换的文件数组
        for(var i = 0, file; file = files[i]; i++){
            //获取文件上传的后缀名
            var newStr = file.name.split("").reverse().join("");
            if(newStr.split(".")[0] != null){
                    var type = newStr.split(".")[0].split("").reverse().join("");

                    if(jQuery.inArray(type, defaults.fileType) > -1){
                        // 类型符合，可以上传
                        if (file.size >= defaults.fileSize) {
                            alert(file.size);
                            alert('您这个"'+ file.name +'"文件大小过大');    
                        } else {
                            // 在这里需要判断当前所有文件中
                            arrFiles.push(file);    
                        }
                    }else{
                        alert('您这个"'+ file.name +'"上传类型不符合');   
                    }
                }else{
                    alert('您这个"'+ file.name +'"没有类型, 无法识别');    
                }
        }
        return arrFiles;
    }
/**************************************这一部分用于上传图片**********************************/
    
    //获取表单元素的函数
    var getData = function(Qualification, ReviewExprience, WorkExprience, AvoidCompany, fileList){
        var formData = new FormData();

        var data = {
            uname : $('#uname').val(),
            sexuality : $('#sexuality').val(),
            birthDay : $('#birthDay').val(),
            phoneNumber : $('#phoneNumber').val(),
            email : $('#email').val(),
            cardType : $('#cardType').val(),
            cardNumber : $('#cardNumber').val(),
            authority : $('#authority').val(),
            politicalStatus : $('#politicalStatus').val(),
            academicQual : $('#academicQual').val(),
            academicDegree : $('#academicDegree').val(),
            title : $('#title').val(),
            titleID : $('#titleID').val(),
            post : $('#post').val(),
            workTime : $('#workTime').val(),
            retire : $('#retire').val(),
            partTime : $('#partTime').val(),
            company : $('#company').val(),
            address : $('#address').val(),
            postCode : $('#postCode').val(),
            telPhoneNum : $('#telPhoneNum').val(),
            university : $('#university').val(),
            major : $('#major').val(),
            speciality : $('#speciality').val(),
            performance : $('#performance').val(),
            others : $('#others').val()
        };
        
        jQuery.each(data, function(i, val){
            formData.append(i, val);
        });

        //评审领域，数组
        var reviewArea = $('#reviewArea').val(); 
        if(reviewArea){
            if(reviewArea instanceof Array){
                reviewArea.forEach(function(element) {
                    formData.append('reviewArea', element);
                });
            } else {
                formData.append('reviewArea', reviewArea);
            }
        }


        //带有'[]'符号的，需要用name属性来获取
        Qualification.forEach( function(element) {
            formData.append('qualification', element);
            formData.append(`qualification[${element}].name`, 
                $(`input[name="qualification[${element}].name"]`).val());
            formData.append(`qualification[${element}].id`, 
                $(`input[name="qualification[${element}].id"]`).val());
        });
        ReviewExprience.forEach( function(element) {
            formData.append('reviewExprience', element);
            formData.append(`reviewExprience[${element}].time`, 
                $(`input[name="reviewExprience[${element}].time"]`).val());
            formData.append(`reviewExprience[${element}].name`, 
                $(`input[name="reviewExprience[${element}].name"]`).val());
            formData.append(`reviewExprience[${element}].desc`, 
                $(`input[name="reviewExprience[${element}].desc"]`).val());
            formData.append(`reviewExprience[${element}].type`, 
                $(`select[name="reviewExprience[${element}].type"]`).val());
        });
        WorkExprience.forEach( function(element) {
            formData.append('workExprience', element);
            formData.append(`workExprience[${element}].startTime`, 
                $(`input[name="workExprience[${element}].startTime"]`).val());
            formData.append(`workExprience[${element}].endTime`, 
                $(`input[name="workExprience[${element}].endTime"]`).val());
            formData.append(`workExprience[${element}].company`, 
                $(`input[name="workExprience[${element}].company"]`).val());
            formData.append(`workExprience[${element}].post`, 
                $(`input[name="workExprience[${element}].post"]`).val());
            formData.append(`workExprience[${element}].person`, 
                $(`input[name="workExprience[${element}].person"]`).val());

        });
        AvoidCompany.forEach( function(element) {
            formData.append('avoidCompany', element);
            formData.append(`avoidCompany[${element}].name`, 
                $(`input[name="avoidCompany[${element}].name"]`).val());
            formData.append(`avoidCompany[${element}].is`, 
                $(`select[name="avoidCompany[${element}].is"]`).val());

        });
        
        //上传图片
        if(fileList){
            //如果用户选择了图片，那就上传图片
            formData.append('picture', fileList[0]);
        } else {
            //如果用户没选择，就使用当前默认图片
            // console.log('img:' + $('#add-img').attr('src'));
            formData.append('img', $('#add-img').attr('src'));
        }


        return formData;
    }

    //表单提交按钮
    $('#submitBtn').click(function(){
        
        var imgSrc = $('#add-img').attr('src');
        if(imgSrc !== '/images/used/background.png') {
            //如果已经有图片了，就移除对照片的校验
            $('#form').bootstrapValidator('removeField', $('#pictureInput'));
        }
        
        var bootstrapValidator = $("#form").data('bootstrapValidator');  
        bootstrapValidator.validate();  
        if (bootstrapValidator.isValid()) {
            $('#shubmitModal').modal();
        }
        
    });

    //确认提交按钮
    $('#shubmitConfirmBtn').click(function(){
        var submitData = getData(Qualification, 
                ReviewExprience, WorkExprience, AvoidCompany, fileList);

        $.ajax({
            url: "/submit",
            type: "POST",
            data: submitData,
            processData: false, 
            contentType: false,
            success: function(data, status){
                location.href = '/edit';
            }
        });
    })

    //保存表单的函数
    $('#saveBtn').click(function(){
        // console.log('save');
        var saveData = getData(Qualification, 
            ReviewExprience, WorkExprience, AvoidCompany, fileList);

        $.ajax({
            url: "/edit",
            type: "POST",
            data: saveData,
            processData: false, 
            contentType: false,
            success: function(){
                location.href = '/edit';
            }
        });
    });


    $('#resetBtn').click(function(){
        $('#resetModal').modal();
    });

    $('#resetConfirmBtn').click(function(){
        location.reload(true);
    })

    //因为在设置默认值的时候涉及到日期选择器、多选框等组件，所以声明为全局变量，但要在ready里面定义
    setDefaultData = function(data){
        var parent = $('#form');

        jQuery.each(data, function(i, val){
            var elem = parent.find(`[name="${i}"]`);
            if( elem ) {
                elem.val(val);
            }
        });

        //设置默认图片
        if(data.picture){
            // console.log('picture:' + data.picture);
            parent.find('[name="add-img"]').attr('src', data.picture);
        };

        //设置默认评审领域
        if(data.reviewArea) {
            $('#reviewArea').selectpicker('val', data.reviewArea);
        }

        //设置资格证书的默认值
        if(data.qualification) {
            if(data.qualification instanceof Array){
                data.qualification.forEach( function(element) {
                    qualIndex++;
                    Qualification.push(qualIndex);

                    var $template = $('#qualTemplate');

                    var $clone = $template
                                    .clone()
                                    .removeClass('hide')
                                    .removeAttr('id')
                                    .attr('qualIndex', qualIndex)
                                    .insertBefore($template);

                    $clone
                        .find('[name="qualName"]')
                            .attr('name', 'qualification[' + qualIndex + '].name')
                            .val(data[`qualification[${element}].name`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="qualID"]')
                            .attr('name', 'qualification[' + qualIndex + '].id')
                            .val(data[`qualification[${element}].id`])
                            .removeAttr('disabled')
                            .end();

                    $('#form')
                        .bootstrapValidator('addField', 
                            'qualification[' + qualIndex + '].name', notEmptyValidator('请填写资格证书名'))
                        .bootstrapValidator('addField', 
                            'qualification[' + qualIndex + '].id', notEmptyValidator('请填写资格证书编号'));
                });
            } else {
                qualIndex++;
                Qualification.push(qualIndex);

                var $template = $('#qualTemplate');

                var $clone = $template
                                .clone()
                                .removeClass('hide')
                                .removeAttr('id')
                                .attr('qualIndex', qualIndex)
                                .insertBefore($template);

                $clone
                    .find('[name="qualName"]')
                        .attr('name', 'qualification[' + qualIndex + '].name')
                        .val(data[`qualification[${data.qualification}].name`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="qualID"]')
                        .attr('name', 'qualification[' + qualIndex + '].id')
                        .val(data[`qualification[${data.qualification}].id`])
                        .removeAttr('disabled')
                        .end();

                $('#form')
                    .bootstrapValidator('addField', 
                        'qualification[' + qualIndex + '].name', notEmptyValidator('请填写资格证书名'))
                    .bootstrapValidator('addField', 
                        'qualification[' + qualIndex + '].id', notEmptyValidator('请填写资格证书编号'));
            }
        }

        //设置评审经历的默认值
        if(data.reviewExprience){
            if(data.reviewExprience instanceof Array) {
                data.reviewExprience.forEach(function(element){
                    
                    reviewExprienceIndex++;

                    ReviewExprience.push(reviewExprienceIndex);

                    var $template = $('#reviewTemplate');

                    var $clone = $template
                                    .clone()
                                    .removeClass('hide')
                                    .removeAttr('id')
                                    .attr('reviewExprienceIndex', reviewExprienceIndex)
                                    .insertBefore($template);


                    // 为复制的行里面的元素进行设置              
                    $clone
                        .find('[name="reviewTime"]')
                            .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].time')
                            .val(data[`reviewExprience[${element}].time`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="reviewName"]')
                            .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].name')
                            .val(data[`reviewExprience[${element}].name`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="reviewDesc"]')
                            .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].desc')
                            .val(data[`reviewExprience[${element}].desc`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="reviewType"]')
                            .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].type')
                            .val(data[`reviewExprience[${element}].type`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="templateDiv"]')
                            .attr('id', 'reviewExprience' + reviewExprienceIndex)
                            .removeAttr('disabled')
                            .end();

                    // 动态添加日历选择器
                    var id = '#reviewExprience' + reviewExprienceIndex;
                    var parentEle = $(id).parent().parent().parent().parent();
                    $(id)
                        .datepicker({
                            format: 'mm/dd/yyyy'
                        })
                        .on('changeDate', function(e) {
                            // 当第一个评审领域日期选择器发生改变时重新验证
                            $('#form').bootstrapValidator('revalidateField', 
                                'reviewExprience[' + parentEle.attr('reviewExprienceIndex') + '].time');
                        });

                    $('#form')
                        .bootstrapValidator('addField', 
                            'reviewExprience[' + reviewExprienceIndex + '].time', timeValidators)
                        .bootstrapValidator('addField', 
                            'reviewExprience[' + reviewExprienceIndex + '].name', 
                                notEmptyValidator('请填写任务名称'))
                        .bootstrapValidator('addField', 
                            'reviewExprience[' + reviewExprienceIndex + '].desc', 
                                notEmptyValidator('请填写任务描述'))
                        .bootstrapValidator('addField', 
                            'reviewExprience[' + reviewExprienceIndex + '].type', 
                                notEmptyValidator('请选择任务类型'));
                });
            } else {
                reviewExprienceIndex++;

                ReviewExprience.push(reviewExprienceIndex);

                var $template = $('#reviewTemplate');

                var $clone = $template
                                .clone()
                                .removeClass('hide')
                                .removeAttr('id')
                                .attr('reviewExprienceIndex', reviewExprienceIndex)
                                .insertBefore($template);


                // 为复制的行里面的元素进行设置              
                $clone
                    .find('[name="reviewTime"]')
                        .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].time')
                        .val(data[`reviewExprience[${data.reviewExprience}].time`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="reviewName"]')
                        .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].name')
                        .val(data[`reviewExprience[${data.reviewExprience}].name`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="reviewDesc"]')
                        .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].desc')
                        .val(data[`reviewExprience[${data.reviewExprience}].desc`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="reviewType"]')
                        .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].type')
                        .val(data[`reviewExprience[${data.reviewExprience}].type`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="templateDiv"]')
                        .attr('id', 'reviewExprience' + reviewExprienceIndex)
                        .removeAttr('disabled')
                        .end();

                // 动态添加日历选择器
                var id = '#reviewExprience' + reviewExprienceIndex;
                var parentEle = $(id).parent().parent().parent().parent();
                $(id)
                    .datepicker({
                        format: 'mm/dd/yyyy'
                    })
                    .on('changeDate', function(e) {
                        // 当第一个评审领域日期选择器发生改变时重新验证
                        $('#form').bootstrapValidator('revalidateField', 
                            'reviewExprience[' + parentEle.attr('reviewExprienceIndex') + '].time');
                    });

                $('#form')
                    .bootstrapValidator('addField', 
                        'reviewExprience[' + reviewExprienceIndex + '].time', timeValidators)
                    .bootstrapValidator('addField', 
                        'reviewExprience[' + reviewExprienceIndex + '].name', 
                            notEmptyValidator('请填写任务名称'))
                    .bootstrapValidator('addField', 
                        'reviewExprience[' + reviewExprienceIndex + '].desc', 
                            notEmptyValidator('请填写任务描述'))
                    .bootstrapValidator('addField', 
                        'reviewExprience[' + reviewExprienceIndex + '].type', 
                            notEmptyValidator('请选择任务类型'));
            }
        } 

        //设置工作经历的默认值
        if(data.workExprience) {
            if(data.workExprience instanceof Array) {
                data.workExprience.forEach( function(element) {
                    workExprienceIndex++;

                    WorkExprience.push(workExprienceIndex);

                    var $template = $('#workTemplate');

                    var $clone = $template
                                    .clone()
                                    .removeClass('hide')
                                    .removeAttr('id')
                                    .attr('workExprienceIndex', workExprienceIndex)
                                    .insertBefore($template);


                    // 为复制的行里面的元素进行设置              
                    $clone
                        .find('[name="startTime"]')
                            .attr('name', 'workExprience[' + workExprienceIndex + '].startTime')
                            .val(data[`workExprience[${element}].startTime`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="endTime"]')
                            .attr('name', 'workExprience[' + workExprienceIndex + '].endTime')
                            .val(data[`workExprience[${element}].endTime`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="usedCompany"]')
                            .attr('name', 'workExprience[' + workExprienceIndex + '].company')
                            .val(data[`workExprience[${element}].company`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="post"]')
                            .attr('name', 'workExprience[' + workExprienceIndex + '].post')
                            .val(data[`workExprience[${element}].post`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="person"]')
                            .attr('name', 'workExprience[' + workExprienceIndex + '].person')
                            .val(data[`workExprience[${element}].person`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="workStartDiv"]')
                            .attr('id', 'workStartTime' + workExprienceIndex)
                            .removeAttr('disabled')
                            .end()
                        .find('[name="workEndDiv"]')
                            .attr('id', 'workEndTime' + workExprienceIndex)
                            .removeAttr('disabled')
                            .end();

                    // 动态添加日历选择器
                    var start = '#workStartTime' + workExprienceIndex;
                    var end = '#workEndTime' + workExprienceIndex;
                    var index = $(start).parent().parent().parent().parent()
                        .attr('workExprienceIndex');

                    $(start)
                        .datepicker({
                            format: 'mm/dd/yyyy'
                        })
                        .on('changeDate', function(e) {
                            // 当第一个评审领域日期选择器发生改变时重新验证
                            $('#form').bootstrapValidator('revalidateField', 
                                'workExprience[' + index + '].startTime');
                        });
                    $(end)
                        .datepicker({
                            format: 'mm/dd/yyyy'
                        })
                        .on('changeDate', function(e) {
                            // 当第一个评审领域日期选择器发生改变时重新验证
                            $('#form').bootstrapValidator('revalidateField', 
                                'workExprience[' + index + '].endTime');
                        });


                    $('#form')
                        .bootstrapValidator('addField', 
                            'workExprience[' + workExprienceIndex + '].startTime', timeValidators)
                        .bootstrapValidator('addField', 
                            'workExprience[' + workExprienceIndex + '].endTime', timeValidators)
                        .bootstrapValidator('addField', 
                            'workExprience[' + workExprienceIndex + '].company', 
                                notEmptyValidator('请填写工作单位'))
                        .bootstrapValidator('addField', 
                            'workExprience[' + workExprienceIndex + '].post', 
                                notEmptyValidator('请填写职务'))
                        .bootstrapValidator('addField', 
                            'workExprience[' + workExprienceIndex + '].person', 
                                notEmptyValidator('请填写证明人姓名'));
                    
                });
            } else {
                workExprienceIndex++;

                WorkExprience.push(workExprienceIndex);

                var $template = $('#workTemplate');

                var $clone = $template
                                .clone()
                                .removeClass('hide')
                                .removeAttr('id')
                                .attr('workExprienceIndex', workExprienceIndex)
                                .insertBefore($template);


                // 为复制的行里面的元素进行设置              
                $clone
                    .find('[name="startTime"]')
                        .attr('name', 'workExprience[' + workExprienceIndex + '].startTime')
                        .val(data[`workExprience[${data.workExprience}].startTime`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="endTime"]')
                        .attr('name', 'workExprience[' + workExprienceIndex + '].endTime')
                        .val(data[`workExprience[${data.workExprience}].endTime`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="usedCompany"]')
                        .attr('name', 'workExprience[' + workExprienceIndex + '].company')
                        .val(data[`workExprience[${data.workExprience}].company`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="post"]')
                        .attr('name', 'workExprience[' + workExprienceIndex + '].post')
                        .val(data[`workExprience[${data.workExprience}].post`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="person"]')
                        .attr('name', 'workExprience[' + workExprienceIndex + '].person')
                        .val(data[`workExprience[${data.workExprience}].person`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="workStartDiv"]')
                        .attr('id', 'workStartTime' + workExprienceIndex)
                        .removeAttr('disabled')
                        .end()
                    .find('[name="workEndDiv"]')
                        .attr('id', 'workEndTime' + workExprienceIndex)
                        .removeAttr('disabled')
                        .end();

                // 动态添加日历选择器
                var start = '#workStartTime' + workExprienceIndex;
                var end = '#workEndTime' + workExprienceIndex;
                var index = $(start).parent().parent().parent().parent()
                    .attr('workExprienceIndex');

                $(start)
                    .datepicker({
                        format: 'mm/dd/yyyy'
                    })
                    .on('changeDate', function(e) {
                        // 当第一个评审领域日期选择器发生改变时重新验证
                        $('#form').bootstrapValidator('revalidateField', 
                            'workExprience[' + index + '].startTime');
                    });
                $(end)
                    .datepicker({
                        format: 'mm/dd/yyyy'
                    })
                    .on('changeDate', function(e) {
                        // 当第一个评审领域日期选择器发生改变时重新验证
                        $('#form').bootstrapValidator('revalidateField', 
                            'workExprience[' + index + '].endTime');
                    });


                $('#form')
                    .bootstrapValidator('addField', 
                        'workExprience[' + workExprienceIndex + '].startTime', timeValidators)
                    .bootstrapValidator('addField', 
                        'workExprience[' + workExprienceIndex + '].endTime', timeValidators)
                    .bootstrapValidator('addField', 
                        'workExprience[' + workExprienceIndex + '].company', 
                            notEmptyValidator('请填写工作单位'))
                    .bootstrapValidator('addField', 
                        'workExprience[' + workExprienceIndex + '].post', 
                            notEmptyValidator('请填写职务'))
                    .bootstrapValidator('addField', 
                        'workExprience[' + workExprienceIndex + '].person', 
                            notEmptyValidator('请填写证明人姓名'));
                }
        }

        //设置回避单位的默认值
        if(data.avoidCompany) {
            if(data.avoidCompany instanceof Array) {
                data.avoidCompany.forEach( function(element) {
                    avoidCompanyIndex++;
                    AvoidCompany.push(avoidCompanyIndex)

                    var $template = $('#avoidTemplate');

                    var $clone = $template
                                    .clone()
                                    .removeClass('hide')
                                    .removeAttr('id')
                                    .attr('avoidCompanyIndex', avoidCompanyIndex)
                                    .insertBefore($template);


                    // 为复制的行里面的元素进行设置              
                    $clone
                        .find('[name="avoidName"]')
                            .attr('name', 'avoidCompany[' + avoidCompanyIndex + '].name')
                            .val(data[`avoidCompany[${element}].name`])
                            .removeAttr('disabled')
                            .end()
                        .find('[name="avoidIs"]')
                            .attr('name', 'avoidCompany[' + avoidCompanyIndex + '].is')
                            .val(data[`avoidCompany[${element}].is`])
                            .removeAttr('disabled')
                            .end();

                    $('#form')
                        .bootstrapValidator('addField', 
                            'avoidCompany[' + avoidCompanyIndex + '].name', notEmptyValidator('请填写回避单位名'))
                        .bootstrapValidator('addField', 
                            'avoidCompany[' + avoidCompanyIndex + '].is', notEmptyValidator('请选择单位类型'));
                });
            } else {
                avoidCompanyIndex++;
                AvoidCompany.push(avoidCompanyIndex)

                var $template = $('#avoidTemplate');

                var $clone = $template
                                .clone()
                                .removeClass('hide')
                                .removeAttr('id')
                                .attr('avoidCompanyIndex', avoidCompanyIndex)
                                .insertBefore($template);


                // 为复制的行里面的元素进行设置              
                $clone
                    .find('[name="avoidName"]')
                        .attr('name', 'avoidCompany[' + avoidCompanyIndex + '].name')
                        .val(data[`avoidCompany[${data.avoidCompany}].name`])
                        .removeAttr('disabled')
                        .end()
                    .find('[name="avoidIs"]')
                        .attr('name', 'avoidCompany[' + avoidCompanyIndex + '].is')
                        .val(data[`avoidCompany[${data.avoidCompany}].is`])
                        .removeAttr('disabled')
                        .end();

                $('#form')
                    .bootstrapValidator('addField', 
                        'avoidCompany[' + avoidCompanyIndex + '].name', notEmptyValidator('请填写回避单位名'))
                    .bootstrapValidator('addField', 
                        'avoidCompany[' + avoidCompanyIndex + '].is', notEmptyValidator('请选择单位类型'));
            }
        }
    };



    // id里面不能包含'[]'，否则会无法正常使用日历选择器
    $('#reviewExprience0')
        .datepicker({
            format: 'mm/dd/yyyy'
        })
        .on('changeDate', function(e) {
            // 当第一个评审领域日期选择器发生改变时重新验证
            $('#form').bootstrapValidator('revalidateField', 'reviewExprience[0].time');
        });

    $('#workStartTime0')
        .datepicker({
            format: 'mm/dd/yyyy'
        })
        .on('changeDate', function(e) {
            // 当第一个评审领域日期选择器发生改变时重新验证
            $('#form').bootstrapValidator('revalidateField', 'workExprience[0].startTime');
        });

    $('#workEndTime0')
        .datepicker({
            format: 'mm/dd/yyyy'
        })
        .on('changeDate', function(e) {
            // 当第一个评审领域日期选择器发生改变时重新验证
            $('#form').bootstrapValidator('revalidateField', 'workExprience[0].endTime');
        });


    $('#datePicker')
        .datepicker({
            format: 'mm/dd/yyyy'
        })
        .on('changeDate', function(e) {
            // 当生日日期选择器发生改变时重新验证
            $('#form').bootstrapValidator('revalidateField', 'birthDay');
        })
        .end();    



    $('#form')
        .find('[name="reviewArea"]')
            .selectpicker()
            .change(function(e) {
                // revalidate the color when it is changed
                $('#bootstrapSelectForm').bootstrapValidator('revalidateField', 'reviewArea');
            })
            .end()
        .bootstrapValidator({
            //只对禁用的区域不进行验证
            //为了让多选框能正常进行工作，bootstrap必须要能对隐藏的区域进行验证
            //因此对于哪些隐藏的区域，要设置diabled属性，设置为可见时再取消
            excluded : ":disabled",
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                pictureInput:{
                    validators:{
                        notEmpty:{
                            message: '请选择你要上传的图片'
                        }
                    }
                },
                uname:{
                   validators:{
                        notEmpty:{
                            message: '请填写你的姓名'
                        }
                    }
                },
                sexuality:{
                    validators: {
                        notEmpty: {
                            message: '请选择你的性别'
                        }
                    }
                },
                birthDay:{
                    validators: {
                        notEmpty: {
                            message: '请选择你的出生日期'
                        },
                        date: {
                            format: 'MM/DD/YYYY',
                            message: '日期格式非法'
                        }
                    }
                },
                phoneNumber:{
                    validators:{
                        notEmpty: {
                            message: '请输入你的手机号码'
                        },
                        regexp: {
                            regexp: /^1[3|4|5|7|8][0-9]{9}$/,
                            message: '请输入正确的手机号码'
                        }
                    }
                },
                email:{
                    validators: {
                        notEmpty: {
                            message: '请输入你的邮箱'
                        },
                        emailAddress: {
                            message: '请输入正确的邮件地址'
                        }
                    }
                },
                cardType: {
                    validators: {
                        notEmpty: {
                            message: '请选择证件类型'
                        }
                    }
                },
                
                cardNumber: {
                    validators: {
                        callback: {
                            //自定义检验规则，需要返回一个对象
                            callback: function(value, validator) {
                                // 表单输入的值
                                var value = $('#cardNumber').val();
                                var reg;
                                //options为<validatorOptions>对象，直接.获取需要的值

                                var type = $('#cardType').val();

                                switch (type) {
                                    case '身份证':
                                        if(value){
                                            reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                                            if(reg.test(value)){
                                                return true;
                                            } else {
                                                return {
                                                    valid: false,       // or true
                                                    message: '请输入正确的身份证号码'
                                                };
                                            }
                                        } else {
                                            return {
                                                valid: false,       // or true
                                                message: '请输入你的身份证号码'
                                            };
                                        }
                                        break;
                                    case '护照':
                                        if(value){
                                            reg = /^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/;
                                            if(reg.test(value)){
                                                return true;
                                            } else {
                                                return {
                                                    valid: false,       // or true
                                                    message: '请输入正确的护照号码'
                                                };
                                            }
                                        } else {
                                            return {
                                                valid: false,       // or true
                                                message: '请输入你的护照号码'
                                            };
                                        }
                                        break;
                                    default:
                                        return {
                                            valid: false,       // or true
                                            message: '请先选择证件类型'
                                        };
                                        break;
                                }

                            }

                        }   
                    }                 
                },
                authority: {
                    validators: {
                        notEmpty: {
                            message: '请输入证件颁发机构'
                        }
                    }
                },
                politicalStatus: {
                    validators: {
                        notEmpty: {
                            message: '请选择你的政治面貌'
                        }
                    }
                },
                academicQual: {
                    validators: {
                        notEmpty: {
                            message: '请选择你的最高学历'
                        }
                    }
                },
                academicDegree: {
                    validators: {
                        notEmpty: {
                            message: '请选择你的最高学位'
                        }
                    }
                },
                title: {
                    validators: {
                        notEmpty: {
                            message: '请填写你的职称'
                        }
                    }
                },
                titleID: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的证书编号'
                        }
                    }
                },
                post: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的职务'
                        }
                    }
                },
                workTime: {
                    validators: {
                        notEmpty: {
                            message: '请选择你的从业时长'
                        }
                    }
                },
                retire: {
                    validators: {
                        notEmpty: {
                            message: '请选择你是否退休'
                        }
                    }
                },
                partTime: {
                    validators: {
                        notEmpty: {
                            message: '请选择你是否兼职'
                        }
                    }
                },
                company: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的工作单位'
                        }
                    }
                },
                address: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的通讯地址'
                        }
                    }
                },
                postCode: {
                    validators: {
                        notEmpty: {
                            message: '请输入通讯地址的邮政编码'
                        },
                        regexp: {
                            regexp: /^[1-9][0-9]{5}$/,
                            message: '请输入正确的邮政编码'
                        }
                    }
                },
                telPhoneNum: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的家庭电话'
                        }
                    }
                },
                university: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的毕业院校'
                        }
                    }
                },
                major: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的专业'
                        }
                    }
                },
                reviewArea: {
                    validators: {
                        notEmpty: {
                            message: '请至少选择一个评审领域'
                        },
                        callback: {
                            message: '请选择一到两个评审领域',
                            callback: function(value, validator) {
                                //Get the selected options 
                                var options = validator.getFieldElements('reviewArea').val();
                                
                                //这里如果没有设置正确的返回值，那么就会默认表单验证不通过
                                if(options){
                                    return (options.length ==1 || options.length == 2);
                                } else {
                                    return false;
                                };
                            }
                        }
                    }
                },
                speciality: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的业务专长'
                        }
                    }
                },
                performance: {
                    validators: {
                        notEmpty: {
                            message: '请输入你的工作业绩'
                        }
                    }
                },
                others: {
                    validators: {
                        notEmpty: {
                            message: '请输入其他说明'
                        }
                    }
                }
                
            }
        })
        .on('click', '.addQualification', function(){
            qualIndex++;

            Qualification.push(qualIndex);

            var $template = $('#qualTemplate');

            var $clone = $template
                            .clone()
                            .removeClass('hide')
                            .removeAttr('id')
                            .attr('qualIndex', qualIndex)
                            .insertBefore($template);

            $clone
                .find('[name="qualName"]')
                    .attr('name', 'qualification[' + qualIndex + '].name')
                    .removeAttr('disabled')
                    .end()
                .find('[name="qualID"]')
                    .attr('name', 'qualification[' + qualIndex + '].id')
                    .removeAttr('disabled')
                    .end();

            $('#form')
                .bootstrapValidator('addField', 
                    'qualification[' + qualIndex + '].name', notEmptyValidator('请填写资格证书名'))
                .bootstrapValidator('addField', 
                    'qualification[' + qualIndex + '].id', notEmptyValidator('请填写资格证书编号'));
        })
        .on('click', '.removeQualification', function(){
            var
                $row = $(this).parent().parent().parent().parent(),
                index = $row.attr('qualIndex');


            // removeEle(Qualification, index);
            Qualification.remove(index);

            // Remove fields
            $('#form')
                .bootstrapValidator('removeField', 
                    $row.find('[name="qualification[' + index + '].name"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="qualification[' + index + '].id"]'))

            // Remove element containing the fields
            $row.remove();
        })
        .on('click', '.addReviewExprience', function(){
            reviewExprienceIndex++;

            ReviewExprience.push(reviewExprienceIndex);

            var $template = $('#reviewTemplate');

            var $clone = $template
                            .clone()
                            .removeClass('hide')
                            .removeAttr('id')
                            .attr('reviewExprienceIndex', reviewExprienceIndex)
                            .insertBefore($template);


            // 为复制的行里面的元素进行设置              
            $clone
                .find('[name="reviewTime"]')
                    .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].time')
                    .removeAttr('disabled')
                    .end()
                .find('[name="reviewName"]')
                    .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].name')
                    .removeAttr('disabled')
                    .end()
                .find('[name="reviewDesc"]')
                    .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].desc')
                    .removeAttr('disabled')
                    .end()
                .find('[name="reviewType"]')
                    .attr('name', 'reviewExprience[' + reviewExprienceIndex + '].type')
                    .removeAttr('disabled')
                    .end()
                .find('[name="templateDiv"]')
                    .attr('id', 'reviewExprience' + reviewExprienceIndex)
                    .removeAttr('disabled')
                    .end();

            // 动态添加日历选择器
            var id = '#reviewExprience' + reviewExprienceIndex;
            var parentEle = $(id).parent().parent().parent().parent();
            $(id)
                .datepicker({
                    format: 'mm/dd/yyyy'
                })
                .on('changeDate', function(e) {
                    // 当第一个评审领域日期选择器发生改变时重新验证
                    $('#form').bootstrapValidator('revalidateField', 
                        'reviewExprience[' + parentEle.attr('reviewExprienceIndex') + '].time');
                });

            $('#form')
                .bootstrapValidator('addField', 
                    'reviewExprience[' + reviewExprienceIndex + '].time', timeValidators)
                .bootstrapValidator('addField', 
                    'reviewExprience[' + reviewExprienceIndex + '].name', 
                        notEmptyValidator('请填写任务名称'))
                .bootstrapValidator('addField', 
                    'reviewExprience[' + reviewExprienceIndex + '].desc', 
                        notEmptyValidator('请填写任务描述'))
                .bootstrapValidator('addField', 
                    'reviewExprience[' + reviewExprienceIndex + '].type', 
                        notEmptyValidator('请选择任务类型'));
        })
        .on('click', '.removeReviewExprience', function(){
            var
                $row = $(this).parent().parent().parent().parent(),
                index = $row.attr('reviewExprienceIndex');

            // removeEle(ReviewExprience, index);
            ReviewExprience.remove(index);

            // Remove fields
            $('#form')
                .bootstrapValidator('removeField', 
                    $row.find('[name="reviewExprience[' + index + '].time"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="reviewExprience[' + index + '].name"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="reviewExprience[' + index + '].desc"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="reviewExprience[' + index + '].type"]'))

            // Remove element containing the fields
            $row.remove();
        })
        .on('click', '.addWorkExprience', function(){
            workExprienceIndex++;

            WorkExprience.push(workExprienceIndex);

            var $template = $('#workTemplate');

            var $clone = $template
                            .clone()
                            .removeClass('hide')
                            .removeAttr('id')
                            .attr('workExprienceIndex', workExprienceIndex)
                            .insertBefore($template);


            // 为复制的行里面的元素进行设置              
            $clone
                .find('[name="startTime"]')
                    .attr('name', 'workExprience[' + workExprienceIndex + '].startTime')
                    .removeAttr('disabled')
                    .end()
                .find('[name="endTime"]')
                    .attr('name', 'workExprience[' + workExprienceIndex + '].endTime')
                    .removeAttr('disabled')
                    .end()
                .find('[name="usedCompany"]')
                    .attr('name', 'workExprience[' + workExprienceIndex + '].company')
                    .removeAttr('disabled')
                    .end()
                .find('[name="post"]')
                    .attr('name', 'workExprience[' + workExprienceIndex + '].post')
                    .removeAttr('disabled')
                    .end()
                .find('[name="person"]')
                    .attr('name', 'workExprience[' + workExprienceIndex + '].person')
                    .removeAttr('disabled')
                    .end()
                .find('[name="workStartDiv"]')
                    .attr('id', 'workStartTime' + workExprienceIndex)
                    .removeAttr('disabled')
                    .end()
                .find('[name="workEndDiv"]')
                    .attr('id', 'workEndTime' + workExprienceIndex)
                    .removeAttr('disabled')
                    .end();

            // 动态添加日历选择器
            var start = '#workStartTime' + workExprienceIndex;
            var end = '#workEndTime' + workExprienceIndex;
            var index = $(start).parent().parent().parent().parent()
                .attr('workExprienceIndex');

            $(start)
                .datepicker({
                    format: 'mm/dd/yyyy'
                })
                .on('changeDate', function(e) {
                    // 当第一个评审领域日期选择器发生改变时重新验证
                    $('#form').bootstrapValidator('revalidateField', 
                        'workExprience[' + index + '].startTime');
                });
            $(end)
                .datepicker({
                    format: 'mm/dd/yyyy'
                })
                .on('changeDate', function(e) {
                    // 当第一个评审领域日期选择器发生改变时重新验证
                    $('#form').bootstrapValidator('revalidateField', 
                        'workExprience[' + index + '].endTime');
                });


            $('#form')
                .bootstrapValidator('addField', 
                    'workExprience[' + workExprienceIndex + '].startTime', timeValidators)
                .bootstrapValidator('addField', 
                    'workExprience[' + workExprienceIndex + '].endTime', timeValidators)
                .bootstrapValidator('addField', 
                    'workExprience[' + workExprienceIndex + '].company', 
                        notEmptyValidator('请填写工作单位'))
                .bootstrapValidator('addField', 
                    'workExprience[' + workExprienceIndex + '].post', 
                        notEmptyValidator('请填写职务'))
                .bootstrapValidator('addField', 
                    'workExprience[' + workExprienceIndex + '].person', 
                        notEmptyValidator('请填写证明人姓名'));
        })
        .on('click', '.removeWorkExprience', function(){
            var
                $row = $(this).parent().parent().parent().parent(),
                index = $row.attr('workExprience');

            // removeEle(WorkExprience, index);
            WorkExprience.remove(index);


            // Remove fields
            $('#form')
                .bootstrapValidator('removeField', 
                    $row.find('[name="workExprience[' + index + '].startTime"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="workExprience[' + index + '].endTime"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="workExprience[' + index + '].company"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="workExprience[' + index + '].post"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="workExprience[' + index + '].person"]'))

            // Remove element containing the fields
            $row.remove();
        })
        .on('click', '.addAvoidCompany', function(){
            avoidCompanyIndex++;
            AvoidCompany.push(avoidCompanyIndex)

            var $template = $('#avoidTemplate');

            var $clone = $template
                            .clone()
                            .removeClass('hide')
                            .removeAttr('id')
                            .attr('avoidCompanyIndex', avoidCompanyIndex)
                            .insertBefore($template);


            // 为复制的行里面的元素进行设置              
            $clone
                .find('[name="avoidName"]')
                    .attr('name', 'avoidCompany[' + avoidCompanyIndex + '].name')
                    .removeAttr('disabled')
                    .end()
                .find('[name="avoidIs"]')
                    .attr('name', 'avoidCompany[' + avoidCompanyIndex + '].is')
                    .removeAttr('disabled')
                    .end();

            $('#form')
                .bootstrapValidator('addField', 
                    'avoidCompany[' + avoidCompanyIndex + '].name', notEmptyValidator('请填写回避单位名'))
                .bootstrapValidator('addField', 
                    'avoidCompany[' + avoidCompanyIndex + '].is', notEmptyValidator('请选择单位类型'));
        })
        .on('click', '.removeAvoidCompany', function(){
            var
                $row = $(this).parent().parent().parent().parent(),
                index = $row.attr('avoidCompanyIndex');

            AvoidCompany.remove(index);
            // removeEle(AvoidCompany, index);

            // Remove fields
            $('#form')
                .bootstrapValidator('removeField', 
                    $row.find('[name="avoidCompanyIndex[' + index + '].name"]'))
                .bootstrapValidator('removeField', 
                    $row.find('[name="avoidCompanyIndex[' + index + '].is"]'));

            // Remove element containing the fields
            $row.remove();
        });
});

/******************************用于设置检验方式*******************************/