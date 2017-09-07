var login = function (router, model) {
	router.route("/login")
		.get(function (req, res) {
			req.session.user = null;
			req.session.admin = null;
			res.render("login");
		})
		.post(function (req, res) {
			var user = model.user;

			console.log(req.body);
			var uname = req.body.uname;
			var utype = req.body.utype;

			user.findOne({ where: { user_name: uname } })
				.then(p => {
					if (p) {
						if(p.user_type != utype){
							res.send({"type": "用户不存在,请检查用户类型"});
						} else {
							if (req.body.upwd != p.user_pass) {
								res.send({"type": "密码错误"});
							} else {
								if(p.user_type == '专家'){
									req.session.user = p;
								} 
								if(p.user_type == '管理员') {
									req.session.admin = p;
								}
								res.send({"type": "登录成功"});
							}
						}
					} else {
						res.send({"type": "用户不存在"});
					}
				})
				.catch(error => {
					res.sendStatus(500);
					console.log(error);
				});

		});

};

module.exports = login;