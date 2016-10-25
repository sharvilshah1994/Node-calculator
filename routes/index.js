var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/history',function(req,res){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/calculator';
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log("unable to connect for showing history");
    }
    else{
      console.log("Connection established for showing history");
      var collection = db.collection('transactions');
      collection.find({}).toArray(function(err,result){
        if(err){
          res.send(err);
        }
        else if(result.length){
          res.render('transactionlist',{
            "transactionlist": result
          });
        }
        else{
          res.send('No data to display');
        }
        db.close();
      });
    }
  });

});

router.get('/calculator', function(req,res){
  res.render('calculator',{title: 'Calculator'});
});

router.post('/getanswer', function(req,res){
  var first_num = req.body.fnum;
  var operator = req.body.op;
  var second_num = req.body.snum;
  var MongoClient = mongodb.MongoClient;
  var input_form = first_num + operator + second_num;
  var url = 'mongodb://localhost:27017/calculator';
  var ans;
  if(operator == '+'){
    ans = parseInt(first_num) + parseInt(second_num);
  }
  else if(operator == '-'){
    ans = parseInt(first_num) - parseInt(second_num);
  }
  else if(operator == '*'){
    ans = parseInt(first_num) * parseInt(second_num);
  }
  else if(operator == '/'){
    ans = parseInt(first_num) / parseInt(second_num);
  }
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log("unable to connect");
    }
    else{
      var collection = db.collection('transactions');
      var input_db = {input: input_form, answer: ans}
      collection.insert([input_db], function(err, result){
        if(err){
          console.log(err);
        }
        else{
          res.send(result);
        }
      });
    }

  });
});
module.exports = router;
