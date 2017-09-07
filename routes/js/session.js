// 用于验证是否需要重新登录
var session = {};

session.user = function(req, res){
	if(!req.session.user){
		res.status(401).render('log.html', { msg: "请先登录", status: 401 }, function (error, string) {
			req.session.msg = string;
			res.redirect('/login');
		});
	}
}


session.admin = function(req, res){
	if(!req.session.admin){
		res.status(401).render('log.html', { msg: "请先登录", status: 401 }, function (error, string) {
			req.session.msg = string;
			res.redirect('/login');
		});
	}
}
module.exports = session;