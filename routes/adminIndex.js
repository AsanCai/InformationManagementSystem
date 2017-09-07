var adminIndex = function (router, model, session) {
	router.route("/adminIndex")
		.get(function (req, res) {
			session.admin(req, res);

			res.render("adminIndex");
		})
		.post(function(req, res){
			var userStatus = model.userStatus;
			var data={};
			userStatus.findAll({where: {status: '审核中'}})
				.then(pro=>{
					data.number = pro.length;
					res.send(data);
				});
		});
};

module.exports = adminIndex;