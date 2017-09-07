var edit = function (router, model, session) {
	var path = require('path');
	var fs = require('fs');
	var multer = require('multer');
	var dirPath = require('../path');
	var url = require('url');
	var query = require('querystring');

	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			//设置的文件夹不存在时，会自动创建
			cb(null, dirPath + '/images')
		},
		filename: function (req, file, cb) {
			//获取文件后缀名
			var fileFormat = (file.originalname).split(".");
			cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
		}
	});
	var upload = multer({ storage: storage });

	router.route("/edit")
		.get(function (req, res) {
			//验证用户是否过期
			session.user(req, res);
			var user = req.session.user;
			var userStatus = model.userStatus;


			//对数据库进行操作
    		var 
    			certificate = model.certificate,
				basicMessage = model.basicMessage,
				card = model.card,
				job = model.job,
				college = model.college,
				reviewArea = model.reviewArea,
				qualification = model.qualification,
				reviewExprience = model.reviewExprience,
				workExprience = model.workExprience,
				avoidCompany = model.avoidCompany,
				userStatus = model.userStatus;

			var filePath = dirPath + '/json/' + user.user_id + '.json';
			var data = {};
			//判断文件是否存在
			fs.access(filePath, function(err){
			    if(!err) {
			    	console.log('文件存在');
			    	var str = fs.readFileSync(filePath);
					data = JSON.parse(str);

			    } else {
			    	console.log('文件不存在');
			    }

			    //对url进行解析，判断要进行的数据处理操作
				var string = url.parse(req.url).query;
	        	var object = query.parse(string);

	        	console.log(data);
	        	console.log('object');
	        	console.log(object)

	        	//进入修改页面，这里edit?default=true是edit向服务器请求数据的url
	        	//第一次编辑直接进入编辑页面
				//如果之前编辑过就先进入表格展示页面
	        	if(object.default) {
	        		userStatus.findOne({where:{user_id: user.user_id}})
						.then(pro=>{
							if(pro){
								data.status = pro.status || '';
							} else {
								data.status = '';
							}
							return certificate.findOne({where:{user_id: user.user_id}});
						})
						.then(pro=>{
							if(pro){
								data.qual_id = pro.qual_id||'';
								data.validTime = pro.validTime||'';
							} else {
								data.qual_id = '';
								data.validTime = '';
							}
							res.send(data);
						})
	        	}
	        	//用户点击编辑按钮
	        	else if(object.edit) {
	        		res.render('edit', {data: data});
	        	}
	        	//此功能暂时取消
	        	//用户点击提交按钮 
	    //     	else if(object.submit) {
	    //   			//对数据库进行操作
	    //     	}
	        	//用户直接进入edit页面 
	        	else{
	        		userStatus.findOne({where:{user_id: user.user_id}})
						.then(pro=>{
							if(pro){
								data.status = pro.status || '';
							} else {
								data.status = '';
							}
							return certificate.findOne({where:{user_id: user.user_id}});
						})
						.then(pro=>{	
							if(pro){
								data.qual_id = pro.qual_id||'';
								data.validTime = pro.validTime||'';
							} else {
								data.qual_id = '';
								data.validTime = '';
							}

							if(data.status){
								//如果之前编辑过就先进入表格展示页面
								res.render('show', {data: data});
							} else {
								//第一次编辑直接进入编辑页面
								res.render("edit",{data:null});
							}
						})
	        	}
			})
			
			
		})
		//当用户点击保存的时候
		.post(upload.single('picture'), function (req, res) {

			console.log(req.file);
			console.log(req.body);
			
			var user = req.session.user;

			var filePath = dirPath + '/json/' + user.user_id + '.json';

			var data = req.body;
			var str;

			if(req.file){
				data.picture = 'images/' + req.file.filename;
				str = JSON.stringify(data);
				console.log(str);
				//更新json文件
				fs.writeFileSync(filePath, str);
			} else {
				//fs.access里面的function是一个回调函数
				fs.access(filePath, function(err){
					if(!err){
						var temp = JSON.parse(fs.readFileSync(filePath));
						data.picture = temp.picture;
					} else {
						data.picture = data.img;
					}

					str = JSON.stringify(data);
					console.log(str);
					//更新json文件
					fs.writeFileSync(filePath, str);
				})
			}
			

			var userStatus = model.userStatus;
			userStatus.findOne({where:{user_id: user.user_id}})
				.then(pro=>{
					if(pro){
						userStatus.update({status: '填写中'}, {where:{user_id: user.user_id}});
					} else {
						userStatus.create({
							user_id: user.user_id, 
							status: '填写中'
						});
					}
				});

			res.sendStatus(200);
		});

};

module.exports = edit;