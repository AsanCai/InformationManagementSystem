//用于局部刷新提示当前待审核人数的数字

$(document).ready(function(){
	$.ajax({
		url: '/adminIndex',
		type: 'post',
		success: function(data, status){
			$('#tipNum').after(`<span class="badge" id="tips">${data.number}</span>`);
		},
		dataType: 'json'
	});
});
