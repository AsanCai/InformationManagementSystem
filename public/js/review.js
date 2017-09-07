//用于获取管理员输入的审核结果信息

$(document).ready(function(){
	$('#validTime')
        .datepicker({
            format: 'mm/dd/yyyy'
        });

	console.log('ready')
	$('#pass').click(function(){

		$('#table1').removeClass('hide');
		$('#table2').addClass('hide');
		$('#table3').addClass('hide');
	});
	$('#submitBtn1').click(function(){
		var 
			user_id = $('#user_id').val(),
			qual_id = $('#qual_id').val(),
			validTime = $('#validTime').val();

		var data = {"action": "pass", "user_id": user_id, "qual_id": qual_id, "validTime": validTime};


		$.ajax({
			url: '/review',
			type: 'post',
			data: data,
			success: function(data, status){
				if(status == 'success'){
					alert('提交成功');
					location.href = '/message';
				}
			}
		});
	});
	$('#cancelBtn1').click(function(){
		$('#form1')[0].reset();
	})

	$('#reject').click(function(){
		$('#table2').removeClass('hide');
		$('#table1').addClass('hide');
		$('#table3').addClass('hide');
	})
	$('#submitBtn2').click(function(){
		var 
			user_id = $('#user_id').val(),
			rejectReason = $('#rejectReason').val();
		var data = {"action": "reject", "user_id": user_id, "rejectReason": rejectReason};

		$.ajax({
			url: '/review',
			type: 'post',
			data: data,
			success: function(data, status){
				if(status == 'success'){
					alert('提交成功');
					location.href = '/message';
				}
			}
		});
	})
	$('#cancelBtn2').click(function(){
		$('#form2')[0].reset();
	})


	$('#stop').click(function(){
		$('#table3').removeClass('hide');
		$('#table1').addClass('hide');
		$('#table2').addClass('hide');
	})
	$('#submitBtn3').click(function(){
		var 
			user_id = $('#user_id').val(),
			stopReason = $('#stopReason').val();
		var data = {"action": "stop", "user_id": user_id, "stopReason": stopReason};

		$.ajax({
			url: '/review',
			type: 'post',
			data: data,
			success: function(data, status){
				if(status == 'success'){
					alert('提交成功');
					location.href = '/message';
				}
			}
		});
	})
	$('#cancelBtn3').click(function(){
		$('#form3')[0].reset();
	})

});