//Importing all the packages
const express=require("express");
const upload=require('express-fileupload');
const fs=require('fs');
const {PythonShell}=require('python-shell')
const path = require('path');

//An object for python shell
let options={
	scriptPath:""
};


const app=express();
app.use(upload());
app.use('/resources', express.static(path.join(__dirname, './output')));

//static files
app.use(express.static(__dirname+'/public'))
app.use('/css',express.static(__dirname+"public/css"))
app.use('/js',express.static(__dirname+"public/js"))

//set views
app.set('views','./views')
app.set('view engine','ejs')

//string that will write in the file
var text=""

//routes
app.get("/",function(req,res){
	res.render('index');
});

app.post("/",function(req,res){
	if(req.files){
		var file=req.files.pdf;
		file.name="uploaded_file.pdf";
		var filename=file.name;
		file.mv('./uploads/'+filename,function(err){
			if(err){
				console.log(err);			
			}else{
				console.log("File Successfully Saved to uploads folder");
			}
		});
	}
	PythonShell.run('hello.py',options,(err,response)=>{
		if(err)console.log(err);
		if(response){
			let s=response
			var writeStream = fs.createWriteStream("./output/dynamic_file.txt");
			s.forEach(function(str){
				text+=str
				text+=('\n')
			})
		}
		writeStream.write(text)	
	})
	res.send('File is generated. Click <a href="/resources/dynamic_file.txt"> here </a> to see the file. Save/download the file using ctrl+s')

});


app.listen(process.env.PORT || 3000,function(){
	console.log("The server is listening on port 3000");
});