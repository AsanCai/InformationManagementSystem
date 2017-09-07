var userValidation = function (router, model) {
	router.route("/userValidation")
		.post(function (req, res) {
			var user = model.user;

			console.log(req.body);
			var uname = req.body.uname;

			user.findOne({ where: { user_name: uname } })
				.then(p => {
					if (p) {
						req.session.error = "用户已存在,不可用";
						res.send({"valid":false});
					} else {
						req.session.error = "用户可用";
						res.send({"valid":true});
					}
				})
				.catch(error => {
					res.send(500);
					console.log(error);
				});

		});

};

module.exports = userValidation;