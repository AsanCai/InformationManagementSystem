var changePassword = function (router, model, session) {
	router.route("/changePassword")
		.get(function (req, res) {
			if(req.session.user){
				res.render("changePassword");
			} else if(req.session.admin){
				res.render("adminChangePassword");
			} else {
				res.redirect('/login');
			}
			
		})
		.post(function (req, res) {
			var User = model.user;
			var user = req.session.user || req.session.admin;
			User.findOne({where: {user_id: user.user_id}})
				.then(data=>{
					if(data.user_pass == req.body.pwd){
						User.update({user_pass: req.body.npwd}, {where:{user_id: user.user_id}})
							.then(data=>{
								res.sendStatus(200);
							})
							.catch(err=>{
								res.sendStatus(500);
								console.log(err);
							});
					} else {
						res.sendStatus(500);
					}
				})
		});

};

module.exports = changePassword;