var message = function (router, model, session) {
	//用于保存从数据库中得到的数据
	var data = {};

	//设置每页显示的记录数
    var limit = 2;

	var url = require('url');
	var query = require('querystring');

	router.route("/message")
		.get(function (req, res) {
			session.admin(req, res);


			//进入页面的时候，先进行一次数据库操作，渲染页面
			var 
				userStatus = model.userStatus,
				user = model.user,
				basicMessage = model.basicMessage,
				job = model.job;

			//用于获取数据库数据
			var tStatus, tMess;
			
			//对url进行解析，判断要进行的数据处理操作
			var string = url.parse(req.url).query;
        	var object = query.parse(string);
        	
			data.userList = [];
			data.totalUserList = [];
			data.total = 0;

			user.findAll({where: {user_type: '专家'}})
				.then(users=>{
					return Promise.all(
						users.map(function(user) {
							return userStatus.findOne({where: {
													user_id: user.user_id, 
													status: ['不可用', '审核中', '可用', '已驳回']
												}});
						})
					);
				})
				.then(function(status){
					tStatus = status;
			 		return Promise.all(
			 			status.map(function(element) {
							if(element){
								return basicMessage.findOne({where: {
										user_id : element.dataValues.user_id
									}})
								
							}	
						})
					);
				})
				.then(mess=>{
					tMess = mess;
					return Promise.all(
						mess.map(function(element){
							if(element) {
								return job.findOne({where: {user_id: element.dataValues.user_id}});
							}
						})
					);
				})
				.then(job=>{
					tStatus.forEach( function(statu) {
						var temp = {};
						if(statu){
							temp.status = statu.dataValues.status;
							temp.user_id = statu.dataValues.user_id;
							tMess.forEach( function(mess) {
								if(mess && mess.dataValues.user_id == statu.dataValues.user_id){
									temp.name = mess.dataValues.name;
									temp.phoneNumber = mess.dataValues.phoneNumber;
								}
							});
							job.forEach( function(element) {
								if(element && element.dataValues.user_id == statu.dataValues.user_id){
									temp.company = element.dataValues.company;
								}
							});

							data.total++;
							data.totalUserList.push(temp);

						}
					});
					

					data.userList = data.totalUserList.slice(0, limit);
					data.curPage = 1;
					data.limit = limit;
					res.render('message', {data: data});
				});
		})
		.post(function(req, res) {
			//数据库操作
			var 
				userStatus = model.userStatus,
				user = model.user,
				basicMessage = model.basicMessage,
				job = model.job,
				reviewArea = model.reviewArea;


			var object = req.body;

			//如果是点击查询按钮，重新查询数据
			if(!object.page){

				// if(!object.reviewArea && !object.status){
				// 	res.sendStatus(500);
				// }

				//用于获取数据库数据
				var tStatus, tMess, tJob;

				data.userList = [];
				data.totalUserList = [];
				data.total = 0;


				var statusVal = req.body.status || ['不可用', '审核中', '可用', '已驳回'];
				user.findAll({where: {user_type: '专家'}})
					.then(users=>{
						return Promise.all(
							users.map(function(user) {
								return userStatus.findOne({where: {
														user_id: user.user_id, 
														status: statusVal
													}});
							})
						);
					})
					.then(function(status){
						tStatus = status;
				 		return Promise.all(
				 			status.map(function(element) {
								if(element){
									return basicMessage.findOne({where: {
											user_id : element.dataValues.user_id
										}})
									
								}	
							})
						);
					})
					.then(mess=>{
						tMess = mess;
						return Promise.all(
							mess.map(function(element){
								if(element) {
									return job.findOne({where: {user_id: element.dataValues.user_id}});
								}
							})
						);
					})
					.then(job=>{
						tJob = job;
						if(!req.body.reviewArea){
							tStatus.forEach( function(statu) {
								var temp = {};
								if(statu){
									temp.status = statu.dataValues.status;
									temp.user_id = statu.dataValues.user_id;
									tMess.forEach( function(mess) {
										if(mess && mess.dataValues.user_id == statu.dataValues.user_id){
											temp.name = mess.dataValues.name;
											temp.phoneNumber = mess.dataValues.phoneNumber;
										}
									});
									tJob.forEach( function(element) {
										if(element && element.dataValues.user_id == statu.dataValues.user_id){
											temp.company = element.dataValues.company;
										}
									});


									//没有的话直接加入
									data.total++;
									data.totalUserList.push(temp);
								}
							});
							return null;
						} else {
							return Promise.all(
								job.map(function(element){
									if(element) {
										return reviewArea.findOne({where: {
													user_id: element.user_id, 
													reviewArea: req.body.reviewArea
												}});
									}
								})
							);
						}
					})
					.then(pro=>{
						if(pro){
							pro.forEach( function(review) {

								if(review){
									var temp = {};
									temp.user_id = review.dataValues.user_id;
									tStatus.forEach( function(statu) {
										if(statu && statu.dataValues.user_id == review.dataValues.user_id){
											temp.status = statu.dataValues.status;
										}
									});

									tMess.forEach( function(mess) {
										if(mess && mess.dataValues.user_id == review.dataValues.user_id){
											temp.name = mess.dataValues.name;
											temp.phoneNumber = mess.dataValues.phoneNumber;
										}
									});

									tJob.forEach( function(job) {
										if(job && job.dataValues.user_id == review.dataValues.user_id){
											temp.company = job.dataValues.company;
										}
									});

									data.total++;
									data.totalUserList.push(temp);
								}
							});
						}
						
						data.userList = data.totalUserList.slice(0, limit);
						data.curPage = 1;
						data.limit = limit;
						res.send(data);
					})
			} 
			//点击的是页码，不重新查询数据
			else{
				var curPage = parseInt(object.page);
				data.curPage = curPage;
				data.userList = data.totalUserList.slice((curPage - 1) * limit, curPage * limit);
				data.limit = limit;
				res.send(data);
			}
		});
			

};

module.exports = message;