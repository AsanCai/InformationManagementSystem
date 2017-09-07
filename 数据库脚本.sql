create database test;
use test;

create table user(
	user_id int auto_increment,
	user_name varchar(20),
	user_pass varchar(20),
	user_type enum('专家', '管理员'),
	primary key (user_id)
);

insert into user values(null, 'adminer', '123456', '管理员');

create table reason(
	user_id int,
	reason varchar(500),
	hasRead enum('yes', 'no'),
	primary key(user_id),
	foreign key (user_id) references user(user_id)
);

create table certificate(
	user_id int,
	qual_id varchar(20),
	validTime varchar(10),
	primary key(user_id),
	foreign key (user_id) references user(user_id)
);

create table userStatus(
	user_id int,
	status enum('不可用', '填写中', '审核中', '可用', '已驳回'),
	primary key(user_id),
	foreign key (user_id) references user(user_id)
);

create table basicMessage(
	user_id int,
	picture varchar(100),
	name varchar(20),
	sexuality enum('男', '女'),
	birthDay varchar(20),
	phoneNumber varchar(13),
	email varchar(50),
	politicalStatus enum('党员', '共青团员', '普通公民', '民主党派人士'),
	academicQual enum('专科', '本科', '硕士研究生', '博士研究生'),
	academicDegree enum('学士', '硕士', '博士'),
	address varchar(40),
	postCode varchar(10),
	telPhoneNum varchar(20),
	speciality varchar(300),
	performance varchar(300),
	others varchar(300),
	primary key(user_id),
	foreign key (user_id) references user(user_id)
);

create table card(
	user_id int,
	cardType enum('身份证', '护照'),
	cardNumber varchar(40),
	authority varchar(30),
	primary key(user_id),
	foreign key (user_id) references user(user_id)
);

create table job(
	user_id int,
	titleID varchar(20),
	title varchar(20),
	post varchar(20),
	workTime enum('1年', '2年', '3年', '4年', '5年', '5年以上'),
	retire enum('是', '否'),
	partTime enum('是', '否'),
	company varchar(30),
	
	primary key(titleID, user_id),
	foreign key (user_id) references user(user_id)
);

create table college(
	university_id int auto_increment,
	major varchar(20),
	university varchar(20),
	user_id int,
	primary key(university_id),
	foreign key (user_id) references user(user_id)
);

create table reviewArea(
	reviewArea_id int auto_increment,
	user_id int,
	reviewArea enum('幼儿园教育评估','小学教育评估','中学教育评估','中职教育评估','高职教育评估','高校教育评估'),
	primary key(reviewArea_id),
	foreign key (user_id) references user(user_id)
);

create table qualification(
	qualification_id varchar(20),
	qualification_name varchar(20),
	user_id int,
	primary key(qualification_id),
	foreign key (user_id) references user(user_id)
);

create table reviewExprience(
	reviewExprience_id int auto_increment,
	reviewExprience_time varchar(10),
	reviewExprience_name varchar(20),
	reviewExprience_desc varchar(50),
	reviewExprience_type enum('评估', '评审'),
	user_id int,
	primary key(reviewExprience_id),
	foreign key (user_id) references user(user_id)
);

create table workExprience(
	workExprience_id int auto_increment,
	workExprience_startTime varchar(10),
	workExprience_endTime varchar(10),
	workExprience_company varchar(30),
	workExprience_post varchar(30),
	workExprience_person varchar(20),
	user_id int,
	primary key(workExprience_id),
	foreign key (user_id) references user(user_id)
);


create table avoidCompany(
	avoidCompany_id int auto_increment,
	avoidCompany_name varchar(30),
	avoidCompany_is enum('是', '否'),
	user_id int,
	primary key(avoidCompany_id),
	foreign key (user_id) references user(user_id)
);
