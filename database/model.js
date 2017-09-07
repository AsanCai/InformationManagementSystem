var config = require('./config');
var Sequelize = require('sequelize');

//创建sequelize对象
var sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

var model = {};

model.reason = sequelize.define('reason', {
	user_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	reason: Sequelize.STRING(500),
	hasRead: Sequelize.ENUM('yes', 'no')
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});

model.user = sequelize.define('user', {
	user_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	user_name: Sequelize.STRING(20),
	user_pass: Sequelize.STRING(20),
	user_type: Sequelize.ENUM('专家', '管理员')
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});


model.userStatus = sequelize.define('userStatus', {
	user_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	status: Sequelize.ENUM('不可用', '填写中', '审核中', '可用', '已驳回')
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});

model.certificate = sequelize.define('certificate', {
	user_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	qual_id: Sequelize.STRING(20),
	validTime: Sequelize.STRING(10)
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});

model.basicMessage = sequelize.define('basicMessage', {
	user_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	picture: Sequelize.STRING(100),
	name: Sequelize.STRING(20),
	sexuality: Sequelize.ENUM("男", "女"),
	birthDay: Sequelize.STRING(20),
	phoneNumber: Sequelize.STRING(13),
	email: Sequelize.STRING(50),
	politicalStatus: Sequelize.ENUM('党员', '共青团员', '普通公民', '民主党派人士'),
	academicQual: Sequelize.ENUM('专科', '本科', '硕士研究生', '博士研究生'),
	academicDegree: Sequelize.ENUM('学士', '硕士', '博士'),
	address: Sequelize.STRING(40),
	postCode: Sequelize.STRING(10),
	telPhoneNum: Sequelize.STRING(20),
	speciality: Sequelize.STRING(300),
	performance: Sequelize.STRING(300),
	others: Sequelize.STRING(300)
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});


model.card = sequelize.define('card', {
	user_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	cardNumber: Sequelize.STRING(40),
	authority: Sequelize.STRING(30),
	cardType: Sequelize.ENUM('护照', '身份证')
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});


model.job = sequelize.define('job', {
	user_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	titleID: {
		type: Sequelize.STRING(20),
		primaryKey: true
	},
	title: Sequelize.STRING(20),
	company: Sequelize.STRING(30),
	post: Sequelize.STRING(20),
	workTime: Sequelize.ENUM('1年', '2年', '3年', '4年', '5年', '5年以上'),
	retire: Sequelize.ENUM('是', '否'),
	partTime: Sequelize.ENUM('是', '否')
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});


model.college = sequelize.define('college', {
	university_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	user_id: Sequelize.INTEGER,
	university: Sequelize.STRING(20),
	major: Sequelize.STRING(20)
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});


model.reviewArea = sequelize.define('reviewArea', {
	reviewArea_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	user_id: Sequelize.INTEGER,
	reviewArea: Sequelize.ENUM('幼儿园教育评估','小学教育评估','中学教育评估','中职教育评估','高职教育评估','高校教育评估')
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});


model.qualification = sequelize.define('qualification', {
	qualification_id: {
		type: Sequelize.STRING(20),
		primaryKey: true
	},
	user_id: Sequelize.INTEGER,
	qualification_name: Sequelize.STRING(20)
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});

model.reviewExprience = sequelize.define('reviewExprience', {
	reviewExprience_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	user_id: Sequelize.INTEGER,
	reviewExprience_time: Sequelize.STRING(10),
	reviewExprience_name: Sequelize.STRING(20),
	reviewExprience_desc: Sequelize.STRING(50),
	reviewExprience_type: Sequelize.ENUM('评估', '评审')
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});



model.workExprience = sequelize.define('workExprience', {
	workExprience_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	user_id: Sequelize.INTEGER,
	workExprience_startTime: Sequelize.STRING(10),
	workExprience_endTime: Sequelize.STRING(10),
	workExprience_company: Sequelize.STRING(30),
	workExprience_post: Sequelize.STRING(30),
	workExprience_person: Sequelize.STRING(20)
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});



model.avoidCompany = sequelize.define('avoidCompany', {
	avoidCompany_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	user_id: Sequelize.INTEGER,
	avoidCompany_name: Sequelize.STRING(30),
	avoidCompany_is: Sequelize.ENUM('是', '否')
},
	{
		//让表名和模型名相同
		'freezeTableName': true,
		// 是否需要增加createdAt、updatedAt、deletedAt字段
		'timestamps': false
	});

module.exports = model;