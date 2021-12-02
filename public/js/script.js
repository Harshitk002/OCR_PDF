//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("label"),
input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
// button.onclick = ()=>{
//   input.click(); //if user click on the button then the input also clicked
// }
input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});
//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});
//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});
//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  showFile(); //calling function
});
function showFile(){
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/pdf"]; //adding some valid extensions in array
//   if(validExtensions.includes(fileType)){ 
	  //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        // UNCOMMENT THIS BELOW LINE. I GOT AN ERROR WHILE UPLOADING THIS POST SO I COMMENTED IT
      // let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
	dropArea.classList.remove("active");
	  dragText.textContent = "File Uploaded";
    }
    fileReader.readAsDataURL(file);
//   }else{
//     alert("This is not an Image File!");
//     dropArea.classList.remove("active");
//     dragText.textContent = "Drag & Drop to Upload File";
//   }
}

//Importing all the packages
const express=require("express");
const upload=require('express-fileupload');
const fs=require('fs');
const {PythonShell}=require('python-shell')

//An object for python shell
let options={
	scriptPath:""
};

const app=express();
app.use(upload());

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
		
			s.forEach(function(str){
				text+=str
			})
		}
		fs.writeFile('output/file.txt',text,err=>{
			if(err)console.log(err);
			return;
		});	
	})
	res.send("Saved in output folder");
	//res.download('output/file.txt')
});


app.get("/download",function(req,res){
	let file = "output/file.txt";
	res.download(file);
});




app.listen(process.env.PORT || 3000,function(){
	console.log("The server is listening on port 3000");
});