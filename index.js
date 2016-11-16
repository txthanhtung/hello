var express = require('express');
var app = express();
app.listen(3000, function(){
	console.log('connect successful');
});
app.set('view engine','ejs');
app.set('views','./views')
app.use(express.static('public'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var multer = require('multer');
// giup giao tiep xu ly mongodb vs nodejs nhanh gon hon
//nhu la 1 driver
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cookies');
//create schema de map collection in mongodb xac dinh quy dinh moi doc trong collection
var dbMongo = mongoose.connection;
dbMongo.on('err', console.error.bind(console,'connect err'));
dbMongo.once('open', function(){
	console.log('mongodb connect');
});


var Schema = new mongoose.Schema({
	type: String,
	banh: [{
		name: String,
		image: String,
		mota: String,
	}]
});
var product = mongoose.model('products', Schema);//goi bien product khi lam viec vs csdl
//upload chi ra noi luu tru file ma ta upload
var storage = multer.diskStorage({
	destination : function(req,file,cb){
		cb(null,'./public/upload');
	},
	filename : function(req,file,cb){
		cb(false, file.originalname)
	}
});
var upload = multer({
	storage: storage,
}).single('file')

app.post('/product_types',urlencodedParser, function(req, res){
	upload(req,res,function(err){
		if(err){
			console.log(err);
			res.send('error');
		} else 
		{
			var sp = {"name": req.body.ten,"image":req.file.originalname,"mota": req.body.mota};
			product.findOneAndUpdate({type: req.body.loai}, {$push: {banh: sp}}, function(err, result){
				console.log(result);
			});
		}
	})
});

app.get('/',function(req, res){
	res.render('form');
});

app.get('/cakes', function(req, res){
	var mang = [];
	product.find({type:"cakes"}, function(err, result){
		result.forEach(function(sp){
			mang = sp.banh;
		});
		console.log(mang);
		res.render('sp',{
			mang
		});
	});
});

app.get('/cupcakes', function(req, res){
	var mang = [];
	product.find({type:"cupcakes"}, function(err, result){
		result.forEach(function(sp){
			mang = sp.banh;
		});
		console.log(mang);
		res.render('sp',{
			mang
		});
	});
});

app.get('/macarons', function(req, res){
var mang = [];
	product.find({type:"macarons"}, function(err, result){
		result.forEach(function(sp){
			mang = sp.banh;
		});
		console.log(mang);
		res.render('sp',{
			mang
		});
	});
});

app.get('/cookies', function(req, res){
	var mang = [];
	product.find({type:"cookies"}, function(err, result){
		result.forEach(function(sp){
			mang = sp.banh;
		});
		console.log(mang);
		res.render('sp',{
			mang
		});
	});
});

app.get('/product_types', function(req, res){
	res.render('types');
});	