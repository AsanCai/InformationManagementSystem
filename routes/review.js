var review = function (router, model, session) {

	var url = require('url');
	var query = require('querystring');

	router.route("/review")
		.get(function (req, res) {
			session.admin(req, res);
			//对url进行解析，判断要进行的数据处理操作
			var string = url.parse(req.url).query;
        	var object = query.parse(string);

        	var user_id = object.user_id;
        	var data = {};
        	data.user_id = user_id;
        	data.qualification = [];
        	data.reviewExprience = [];
        	data.workExprience = [];
        	data.avoidCompany = [];

        	var 
        		userStatus = model.userStatus,
        		basicMessage = model.basicMessage,
        		card = model.card,
        		job = model.job,
        		college = model.college,
        		reviewArea = model.reviewArea,
        		qualification = model.qualification,
        		reviewExprience = model.reviewExprience,
        		workExprience = model.workExprience,
        		avoidCompany = model.avoidCompany;
        	
            userStatus.findOne({where: {user_id: user_id}})
        		.then(pro=>{
        			data.status = pro.status;
        			return basicMessage.findOne({where: {user_id: user_id}});
        		})
        		.then(pro=>{
        			data.name = pro.name;
        			data.picture = pro.picture;
        			data.sexuality = pro.sexuality;
        			data.birthDay = pro.birthDay;
        			data.phoneNumber = pro.phoneNumber;
        			data.email = pro.email;
        			data.politicalStatus = pro.politicalStatus;
        			data.academicQual = pro.academicQual;
        			data.academicDegree = pro.academicDegree;
        			data.address = pro.address;
        			data.postCode = pro.postCode;
        			data.telPhoneNum = pro.telPhoneNum;
        			data.speciality = pro.speciality;
        			data.performance = pro.performance;
        			data.others = pro.others;
        			return card.findOne({where: {user_id: user_id}});
        		})
        		.then(pro=>{
        			data.cardNumber = pro.cardNumber;
        			data.authority = pro.authority;
        			data.cardType = pro.cardType;
        			return job.findOne({where: {user_id: user_id}});
        		})
        		.then(pro=>{
        			data.titleID = pro.titleID;
        			data.title = pro.title;
        			data.company = pro.company;
        			data.post = pro.post;
        			data.workTime = pro.workTime;
        			data.retire = pro.retire;
        			data.partTime = pro.partTime;
        			return college.findOne({where: {user_id: user_id}});
        		})
        		.then(pro=>{
        			data.university = pro.university;
        			data.major = pro.major;
        			return reviewArea.findAll({where: {user_id: user_id}});
        		})
        		.then(pro=>{
                    data.reviewArea = '';
        			pro.forEach( function(element) {
        				data.reviewArea += (element.dataValues.reviewArea + ' ');
        			});
        			return qualification.findAll({where: {user_id: user_id}});
        		})
        		.then(pro=>{
        			if(pro){
        				pro.forEach( function(element) {
                            //避免一个数组里面有多个null元素
                            if(element){
                                var temp = {};
                                temp.id = element.dataValues.qualification_id;
                                temp.name = element.dataValues.qualification_name;
                                data.qualification.push(temp);
                            }
	        			});
        			}
        			return reviewExprience.findAll({where: {user_id: user_id}});
        		})
        		.then(pro=>{
        			if(pro){
        				pro.forEach( function(element) {
                            if(element){
                                var temp = {};
                                temp.time = element.dataValues.reviewExprience_time;
                                temp.name = element.dataValues.reviewExprience_name;
                                temp.desc = element.dataValues.reviewExprience_desc;
                                temp.type = element.dataValues.reviewExprience_type;
                                data.reviewExprience.push(temp);
                            }
	        			});
        			}
        			return workExprience.findAll({where: {user_id: user_id}});
        		})
        		.then(pro=>{
        			if(pro){
        				pro.forEach( function(element) {
                            if(element){
                                var temp = {};
                                temp.endTime = element.dataValues.workExprience_endTime;
                                temp.startTime = element.dataValues.workExprience_startTime;
                                temp.company = element.dataValues.workExprience_company;
                                temp.post = element.dataValues.workExprience_post;
                                temp.person = element.dataValues.workExprience_person;
                                data.workExprience.push(temp);
                            }
	        			});
        			}
        			return avoidCompany.findAll({where: {user_id: user_id}});
        		})
        		.then(pro=>{
        			if(pro){
        				pro.forEach( function(element) {
                            if(element){
                                var temp = {};
                                temp.name = element.dataValues.avoidCompany_name;
                                temp.is = element.dataValues.avoidCompany_is;
                                data.avoidCompany.push(temp);
                            }
	        			});
        			}

        			res.render("review", {data: data});

        		})
		})
		.post(function (req, res) {
            var object = req.body;

            var 
                certificate = model.certificate,
                userStatus = model.userStatus,
                reason = model.reason;

            switch (object.action) {
                case 'pass':
                    userStatus.update({
                        status: '可用'
                    }, {where: {user_id: object.user_id}})
                        .catch(err=>{
                            console.log(err);
                        });

                    reason.findOne({where: {user_id: object.user_id}})
                        .then(pro=>{
                            if(pro){
                                reason.update({hasRead: 'no', reason: ''}, 
                                    {where:{user_id:object.user_id}})
                                    .catch(err=>{
                                        console.log(err);
                                    });
                            } else {
                                reason.create({
                                    user_id:object.user_id,
                                    hasRead: 'no', 
                                    reason: ''
                                })
                                    .catch(err=>{
                                        console.log(err);
                                    });
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                        });

                    certificate.findOne({where: {user_id: object.user_id}})
                        .then(pro=>{
                            if(pro){
                                certificate.update({
                                    qual_id: object.qual_id, 
                                    validTime: object.validTime,
                                }, {where: {user_id: object.user_id}})
                                    .catch(err=>{
                                        console.log(err);
                                    });
                            } else {
                                certificate.create({
                                    user_id: object.user_id,
                                    qual_id: object.qual_id, 
                                    validTime: object.validTime
                                })
                                    .catch(err=>{
                                        console.log(err);
                                    });
                            } 
                        })

                    res.sendStatus(200);
                    break;
                case 'reject':
                    //更新状态
                    userStatus.update({
                        status: '已驳回'
                    }, {where: {user_id: object.user_id}})
                        .catch(err=>{
                            console.log(err);
                        });

                    reason.findOne({where: {user_id: object.user_id}})
                        .then(pro=>{
                            if(pro){
                                reason.update({hasRead: 'no', reason: object.rejectReason}, 
                                    {where:{user_id:object.user_id}})
                                    .catch(err=>{
                                        console.log(err);
                                    });
                            } else {
                                reason.create({
                                    user_id:object.user_id,
                                    hasRead: 'no', 
                                    reason: object.rejectReason
                                })
                                    .catch(err=>{
                                        console.log(err);
                                    });
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                        });
                    res.sendStatus(200);
                    break;
                case 'stop':
                    userStatus.update({
                        status: '不可用'
                    }, {where: {user_id: object.user_id}});

                    reason.findOne({where: {user_id: object.user_id}})
                        .then(pro=>{
                            if(pro){
                                reason.update({hasRead: 'no', reason: object.stopReason}, 
                                    {where:{user_id:object.user_id}})
                                    .catch(err=>{
                                        console.log(err);
                                    });
                            } else {
                                reason.create({
                                    user_id:object.user_id,
                                    hasRead: 'no', 
                                    reason: object.stopReason
                                })
                                    .catch(err=>{
                                        console.log(err);
                                    });
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    res.sendStatus(200);
                    break;
            }			

		});

};

module.exports = review;