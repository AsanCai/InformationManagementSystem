//当用户填写完信息之后，提交申请的路径

var submit = function (router, model) {
	var path = require('path');
	var fs = require('fs');
	var multer = require('multer');
	var dirPath = require('../path');

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
	//当用户点击提交的时候
	router.route("/submit")
		.post(upload.single('picture'),function (req, res) {


			var user = req.session.user;

			var data = req.body;
			// data.picture = 'images/' + req.file.filename;

			//用于暂时保存信息的的json文件路径
			var filePath = dirPath + '/json/' + user.user_id + '.json';

			//上传了新图片
			if(req.file){
				data.picture = 'images/' + req.file.filename;
			}
			//没有上传新图片 
			else {
				data.picture = data.img;
			};

			console.log(data)
			var str = JSON.stringify(data);
			console.log(str);
			//更新json文件
			fs.writeFileSync(filePath, str);

			//对数据库的操作
			var 
				cercertificate = model.certificate,
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


			userStatus.findOne({where:{user_id: user.user_id}})
				.then(pro=>{
					if(pro){
						userStatus.update({status: '审核中'}, {where:{user_id: user.user_id}});
					} else {
						userStatus.create({
							user_id: user.user_id, 
							status: '审核中'
						});
					}

					return basicMessage.findOne({where:{user_id: user.user_id}})
				})
				.then(pro=>{
					if(pro){
						basicMessage.destroy({where:{user_id: user.user_id}});
					} 

					basicMessage.create({
						user_id: user.user_id,
						picture: data.picture,
						name: data.uname,
						sexuality: data.sexuality,
						birthDay: data.birthDay,
						phoneNumber: data.phoneNumber,
						email: data.email,
						politicalStatus: data.politicalStatus,
						academicQual: data.academicQual,
						academicDegree: data.academicDegree,
						address: data.address,
						postCode: data.postCode,
						telPhoneNum: data.telPhoneNum,
						speciality: data.speciality,
						performance: data.performance,
						others: data.others
					})
						.catch(err=>{
							res.sendStatus(500);
							console.log(err);
						});

					return card.findOne({where:{user_id: user.user_id}})
				})
				.then(pro=>{
					if(pro){
						card.destroy({where:{user_id: user.user_id}});
					} 

					card.create({
						user_id: user.user_id,
						cardNumber: data.cardNumber,
						authority: data.authority,
						cardType: data.cardType
					})

					return job.findOne({where:{user_id: user.user_id}});
				})
				.then(pro=>{
					if(pro){
						job.destroy({where:{user_id: user.user_id}});
					} 

					job.create({
						user_id: user.user_id,
						titleID: data.titleID,
						title: data.title,
						company: data.company,
						post: data.post,
						workTime: data.workTime,
						retire: data.retire,
						partTime: data.partTime
					})

					return college.findOne({where:{user_id: user.user_id}});
				})
				.then(pro=>{
					if(pro){
						college.destroy({where:{user_id: user.user_id}});
					} 

					college.create({
						user_id: user.user_id,
						university_id: null,
						university: data.university,
						major: data.major
					})
					
					return reviewArea.findAll({where:{user_id: user.user_id}})
				})
				.then(pro=>{
					if(pro){
						reviewArea.destroy({where:{user_id: user.user_id}});
					} 

					if(data.reviewArea instanceof Array){
						return Promise.all(
							data.reviewArea.map( function(element) {
								return reviewArea.create({
									user_id: user.user_id,
									reviewArea_id: null,
									reviewArea: element
								});
							})
						);	
					} else {

						return reviewArea.create({
							user_id: user.user_id,
							reviewArea_id: null,
							reviewArea: data.reviewArea
						});
					}
				})
				.then(pro=>{
					return qualification.findAll({where:{user_id: user.user_id}})
				})
				.then(pro=>{
					if(pro){
						qualification.destroy({where:{user_id: user.user_id}});
					} 

					if(data.qualification){
						if(data.qualification instanceof Array){
							return Promise.all(
								data.qualification.map( function(element) {
									return qualification.create({
										user_id: user.user_id,
										qualification_id: null,
										qualification_id: data[`qualification[${element}].id`],
										qualification_name: data[`qualification[${element}].name`]
									});
								})
							)
						} else {
							return qualification.create({
								user_id: user.user_id,
								qualification_id: null,
								qualification_id: data[`qualification[${data.qualification}].id`],
								qualification_name: data[`qualification[${data.qualification}].name`]
							});
						}
					}
				})
				.then(pro=>{
					return reviewExprience.findAll({where:{user_id: user.user_id}});
				})
				.then(pro=>{
					if(pro){
						reviewExprience.destroy({where:{user_id: user.user_id}});
					} 

					if(data.reviewExprience){
						if(data.reviewExprience instanceof Array){
							return Promise.all(
								data.reviewExprience.map( function(element) {
									return reviewExprience.create({
										user_id: user.user_id,
										reviewExprience_id: null,
										reviewExprience_time: data[`reviewExprience[${element}].time`],
										reviewExprience_name: data[`reviewExprience[${element}].name`],
										reviewExprience_desc: data[`reviewExprience[${element}].desc`],
										reviewExprience_type: data[`reviewExprience[${element}].type`]
									});
								})
							)
						} else {
							return reviewExprience.create({
								user_id: user.user_id,
								reviewExprience_id: null,
								reviewExprience_time: data[`reviewExprience[${data.reviewExprience}].time`],
								reviewExprience_name: data[`reviewExprience[${data.reviewExprience}].name`],
								reviewExprience_desc: data[`reviewExprience[${data.reviewExprience}].desc`],
								reviewExprience_type: data[`reviewExprience[${data.reviewExprience}].type`]
							});
						}
					}
				})
				.then(pro=>{
					return workExprience.findAll({where:{user_id: user.user_id}});
				})
				.then(pro=>{
					if(pro){
						workExprience.destroy({where:{user_id: user.user_id}});
					} 

					if(data.workExprience){
						if(data.workExprience instanceof Array){
							return Promise.all(
								data.workExprience.map( function(element) {
									return workExprience.create({
										user_id: user.user_id,
										workExprience_id: null,
										workExprience_startTime: data[`workExprience[${element}].startTime`],
										workExprience_endTime: data[`workExprience[${element}].endTime`],
										workExprience_company: data[`workExprience[${element}].company`],
										workExprience_post: data[`workExprience[${element}].post`],
										workExprience_person: data[`workExprience[${element}].person`]
									});
								})
							)
						} else {
							return workExprience.create({
								user_id: user.user_id,
								workExprience_id: null,
								workExprience_startTime: data[`workExprience[${data.workExprience}].startTime`],
								workExprience_endTime: data[`workExprience[${data.workExprience}].endTime`],
								workExprience_company: data[`workExprience[${data.workExprience}].company`],
								workExprience_post: data[`workExprience[${data.workExprience}].post`],
								workExprience_person: data[`workExprience[${data.workExprience}].person`]
							});
						}
					}
				})
				.then(pro=>{
					return avoidCompany.findAll({where:{user_id: user.user_id}});
				})
				.then(pro=>{
					if(pro){
						avoidCompany.destroy({where:{user_id: user.user_id}});
					} 

					if(data.avoidCompany){
						if(data.avoidCompany instanceof Array){
							return Promise.all(
								data.avoidCompany.map( function(element) {
									return avoidCompany.create({
										user_id: user.user_id,
										avoidCompany_id: null,
										avoidCompany_name: data[`avoidCompany[${element}].name`],
										avoidCompany_is: data[`avoidCompany[${element}].is`]
									});
								})
							)
						} else {
							return avoidCompany.create({
								user_id: user.user_id,
								avoidCompany_id: null,
								avoidCompany_name: data[`avoidCompany[${data.avoidCompany}].name`],
								avoidCompany_is: data[`avoidCompany[${data.avoidCompany}].is`]
							});
						}
					}
				})
				.then(function(pro){
					//数据库操作全部执行完再返回已经插入成功
					res.sendStatus(200);
				})
				.catch(err=>{
					res.sendStatus(500);
					console.log(err);
				});
		});

};

module.exports = submit;