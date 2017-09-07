var test = function (router, model) {
	router.route("/test")
		.get(function (req, res) {
			res.render("show");
		});
};

module.exports = test;