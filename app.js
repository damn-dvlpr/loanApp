var express=require("express");
var app=express();
var days =require("days360");
var bodyParser=require("body-parser");
const fmt = require('indian-number-format');
var methodOverride=require("method-override");
var mongoose=require("mongoose");
const fs=require("file-system");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/views'));
app.use(methodOverride('_method'));
app.use(function(req,res,next){
    var date=Date(Date.now()).toString();
    console.log(date);
    // if(req.originalUrl=="/shop"&&req.method=="POST"){
    //     console.log(res.body.returnedData);
    // }
    fs.appendFile(__dirname + '/log/logs.txt',
    date + ` ${req.method} ${req.originalUrl} \n`
    , function(err) {
        if(!err){
            next();
        }
        else{ 
		res.send(err);
		console.log(err);
		next();
	}
    });
});

mongoose.connect("mongodb://localhost:27017/shop");

//MONGOOSE SCHEMA

var passbookInformationSchema=new mongoose.Schema({                                      
    description:String,
    amountDeposit:Number,
    date:{type:Date, default:Date.now()}
});
var PassbookInformation=mongoose.model("PassbookInformation",passbookInformationSchema);
var girviSchema=new mongoose.Schema({                                      
    name: String,
    address:String,
    phone:Number,
    item:String,
    date:Date,
    metal:String,
    weightGold:Number,
    weightSilver:{type:Number, default:0},
    amount:Number,
    rate:Number,
    isDelivered:{type:Boolean , default:false},
    deliveryDate:{type:Date, default:new Date("01-01-1500")},
    additionalInfo:String,
    passbookInformation:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"PassbookInformation"
        }
    ]
});

var Girvi=mongoose.model("Girvi",girviSchema);
// Girvi.create({name:"ram kishan", item:"locket"}, function(err,res){
//     console.log(res);
// });
//ROUTES

app.get("/",function(req,res){
    res.redirect("/shop");
});

app.get("/shop",function(req,res){
    Girvi.find({}).sort({date:-1}).exec(function(err,returnedData){
        if(err){
            console.log(err);
        }else{
            res.render(__dirname + "/views/shop.ejs",{ girvi:returnedData});
        }
    });
});

app.get("/shop/new",function(req,res){
    res.render(__dirname + "/views/new.ejs");
});

app.get("/shop/:id",function(req,res){
    Girvi.findById(req.params.id).populate("passbookInformation").exec(function(err,foundData){
        if(err){
            console.log(err);
        }else{
            var months=(Math.floor((days(new Date(foundData.date), new Date()))/30)+ " Months");
            var day=(days(new Date(foundData.date), new Date())% 30+ " Days");
            var totaldays=days(new Date(foundData.date), new Date());
            var simpleInterest=fmt.format(Math.ceil((foundData.rate/3000)*foundData.amount*totaldays));
            var amount=fmt.format(foundData.amount);
            // var testd=days(new Date(foundData.date), new Date('2018-11-03'));     ////////////////////////
            // console.log((foundData.rate/3000)*foundData.amount*testd);            ////////////////////////
            res.render(__dirname + "/views/show.ejs",{girvi:foundData, months:months, days:day, simpleInterest:simpleInterest, amount:amount});
        }
    });
});

app.get("/shop/:id/passbook/new",function(req,res){
    res.render(__dirname + "/views/passbookForm.ejs",{id:req.params.id});
});

app.get("/search",function(req,res){
    res.render(__dirname + "/views/search.ejs");
});

app.post("/search",function(req,res){
   Girvi.find({name:
        {
            $regex: new RegExp(req.body.name, "ig")
        }
   },function(err,returnedData){
      if(err){
          console.log(err);
      }else{
        res.render(__dirname + "/views/results.ejs", {girvi:returnedData});
      }
   }).sort({date:1}); 
});


app.post("/shop",function(req,res){
    var name=req.body.name;
    var address=req.body.address;
    var phone=req.body.phone;
    var item=req.body.item;
    var date=req.body.date;
    var weightGold=req.body.weightGold;
    var weightSilver=req.body.weightSilver;
    var amount=req.body.amount;
    var rate=req.body.rate;
    var metal=req.body.metal;
    var additionalInfo=req.body.additionalInfo;
    // console.log(req.body.metal);
    // console.log(typeof(metal));
    var girvi={name:name,item:item,address:address,phone:phone,date:date,weightGold:weightGold,weightSilver:weightSilver,rate:rate,metal:metal,amount:amount,additionalInfo:additionalInfo};
    Girvi.create(girvi,function(err,returnedData){
      if(err){
          console.log(err);
      }else{
          req.body.returnedData=returnedData;
          console.log(returnedData);
          console.log("New Girvi Created");
          res.redirect("/shop");
      }
    });
});

app.post("/shop/:id/passbook/",function(req,res){
    Girvi.findById(req.params.id,function(err,foundGirvi){
        if(err){
            console.log(err)
        }else{
            PassbookInformation.create(req.body.passbookInformation,function(err, returnedInfo){
                if(err){
                    console.log(err);
                }else{
                    foundGirvi.passbookInformation.push(returnedInfo);
                    foundGirvi.save();
                    console.log(foundGirvi);
                    res.redirect("/shop/" + req.params.id);
                }
            })
        }
    })
});
app.post("/shop/:id/delivered",function(req,res){
    Girvi.findByIdAndUpdate(req.params.id,{isDelivered:true, deliveryDate:Date.now()},(err,returnedData)=>{
        if(err){
            console.log(err);
        }else{
            console.log(returnedData, "Girvi marked Delivered!");
            res.redirect("/shop/" + req.params.id);
        }
    });
});

app.delete("/shop/:id",function(req,res){
    Girvi.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/shop");
        }
    });
});


app.listen(3000, function(){
    console.log("Server has started!!");
});
