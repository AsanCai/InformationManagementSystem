//用户向后台获取数据，局部刷新用户审核结果提示框

$(document).ready(function(){
	$.ajax({
		url: '/userIndex',
		type: 'post',
		success: function(data, status){
			console.log(data);
			//当用户在审核中，不进行提示
			if(data.result){
				if(data.reason){
					$('#tips').append(`<ul class="dropdown-menu" >
						                    <li class="dropdown-menu-header text-center">
												<strong>审核结果: &nbsp;&nbsp;${data.result}</strong>
						       				</li>
						       				<li class="m_2">
						                        <p>原因：${data.reason}</p>
						                    </li>
						                    <li class="text-center"> 
						                        <button class="btn btn-primary" onclick="hasKnew()">我知道了</button>
						                    </li>
						                </ul>`);

					   
					if(data.hasRead == 'no'){
						$('#tipNum').after('<span class="badge" id="tips">1</span>');
					}
				}
				//没有reason，审核通过 
				else {
					$('#tips').append(`<ul class="dropdown-menu" >
						                    <li class="dropdown-menu-header text-center">
												<strong>审核结果: &nbsp;&nbsp;&nbsp;通过</strong>
						       				</li>
						       				<li class="m_2">
						                        <p>你提交的审核申请已通过管理员审核。</p>
						                        <p>你的专家证书编号为：${data.qual_id}</p>
						                        <p>证书有效日期至：${data.validTime}</p>
						                    </li>
						                    <li class="text-center">
						                        <button class="btn btn-primary" onclick="hasKnew()">我知道了</button>
						                    </li>
						                </ul>`);

					   
					if(data.hasRead == 'no'){
						$('#tipNum').after('<span class="badge" id="tips">1</span>');
					}
				}
			}
		},
		dataType: 'json'
	});
});


var hasKnew =  function(){
	console.log('click');
	var data = {"hasKnew": 'yes'};
	$.ajax({
		url: '/userIndex',
		type: 'post',
		data: data,
		success: function(data, status){
			location.href = '/edit';
		}
	})
};