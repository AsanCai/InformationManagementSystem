var userIndex = function (router, model, session) {
	router.route("/userIndex")
		.get(function (req, res) {
			session.user(req, res);
			res.render("userIndex");
		})
		.post(function(req, res){
			var 
				certificate = model.certificate,
				reason = model.reason,
				userStatus = model.userStatus;

			var user = req.session.user;
			var data = {};

			console.log('req.body');
			console.log(req.body);

			if(req.body.hasKnew){
				reason.update({
					hasRead: 'yes'
				}, {where: {user_id: user.user_id}})
					.then(pro=>{
						res.sendStatus(200);
					})
					.catch(err=>{
						console.log(err);
					})
			} else {
				userStatus.findOne({where: {user_id: user.user_id}})
					.then(pro=>{
						switch (pro.status) {
							case '可用':
								data.result = '通过';

							    certificate.findOne({where: {user_id: user.user_id}})
							    	.then(obj=>{
									    data.qual_id = obj.qual_id;
									    data.validTime = obj.validTime;
									    return reason.findOne({where: {user_id: user.user_id}});
							    	})
							    	.then(rea=>{
							    		data.reason = rea.reason;
									    data.hasRead = rea.hasRead;
									    console.log('1')
									    console.log(data);
									    res.send(data);
							    	})
							    	.catch(err=>{
							    		console.log(err);
							    	});
								break;
							case '不可用':
								data.result = '被终止资格';
								reason.findOne({where: {user_id: user.user_id}})
									.then(rea=>{
										data.reason = rea.reason;
										data.hasRead = rea.hasRead;
										console.log('2')
									    console.log(data);
										res.send(data);
									})
									.catch(err=>{
										console.log(err);
									});
								break;
							case '已驳回':
								data.result = '已驳回';
								reason.findOne({where: {user_id: user.user_id}})
									.then(rea=>{
										data.reason = rea.reason;
										data.hasRead = rea.hasRead;
										console.log('3')
									    console.log(data);
										res.send(data);
									})
									.catch(err=>{
										console.log(err);
									});
								break;
							default:
								res.send(data);
								break;
						}

					})
			}
		})
};

module.exports = userIndex;