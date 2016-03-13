var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var moment = require('moment');
var crontab = require('node-crontab');

moment().format();

app.use(bodyParser());

if (!module.parent) {
  app.listen(4000);
  console.log('Express started on port 4000');
}

// ======================================================
// ===============SET UP LOCAL DATABASE==================
// ======================================================

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Database Connected")
});

// ======================================================
// ==============IMPORT JSON SURVEY OBJECT===============
// ======================================================
var fs = require('fs');
var questions;
var responses = [];

fs.readFile('questions.json', 'utf8', function (err, data) {
  if (err) throw err;
  questions = JSON.parse(data);

  for ( var i = 0; i < questions.questions.length; i++){
    responses.push({
        question: questions.questions[i],
        responses: [],
        length: questions.questions.length
    });
  }
  console.log(questions);
});


// ======================================================
// ===============SET UP DATABASE SCHEMES================
// ======================================================


var Schema = mongoose.Schema;

var answerSchema= Schema({
  id : {type: String},                  
  answers : [{ type: String}]
});                      

var surveySchema = Schema({
   answers: [answerSchema],                       
   timedate: { type: Date, default: Date.now },
   surveyVersion: {type:String}
});


// ======================================================
// ====================SET UP ROUTES=====================
// ======================================================

var Survey = mongoose.model('Survey', surveySchema);
var Answer = mongoose.model('Answer', answerSchema);

var newSurvey;
app.use(express.static('HTML/interface/'));
app.use(express.static('HTML/'));

var html_dir = 'HTML/interface/';


app.get('/', function(req, res) {
    res.sendfile(html_dir + 'welcome.html');
});

app.get('/survey', function(req,res){
    res.sendfile(html_dir + 'button.html');  
})

app.get('/HTML/:fileName',function(req,res){
  var filename = req.params.fileName;
  res.sendfile(filename, {root: './HTML'})
} )
app.get('/HTML/interface/:fileName',function(req,res){
  var filename = req.params.fileName;
  res.sendfile(filename, {root: './HTML/interface'})
} )
// ======================================================
// =====================NEW SURVEY=======================
// ======================================================

var curQuestion = 0; 


//newSurvey sends question : 0

app.get('/new', function(req, res) { 
  newSurvey = new Survey();
  newSurvey.surveyVersion = questions.version;
  console.log("New Survey at : " + newSurvey.timedate + " version: " + newSurvey.surveyVersion);
  res.end(JSON.stringify(responses[curQuestion]));
});

// ======================================================
// =====================QUESTIONS========================
// ======================================================

//answers are formatted like this for now: http://localhost:3000/next?a1=a&a2=c

app.get('/next', function(req, res){

  if (Object.keys(req.query).length>0){
      var newAnswer = {
        id : curQuestion,
        answers : []
      }
      for (var key in req.query){
         newAnswer.answers.push(req.query[key]);
      }
      if (responses[curQuestion]){
        responses[curQuestion].responses = newAnswer.answers;
        console.log("last question: ");
        console.log(responses[curQuestion]);
      }
  }
  curQuestion++;
  res.end(JSON.stringify(responses[curQuestion]));

})

app.get('/back', function(req, res){
  curQuestion-- ;
  console.log(responses[curQuestion]);
  //var response =  JSON.stringify(responses[curQuestion].question) + '\n';
  res.end(JSON.stringify(responses[curQuestion]));

})

app.get('/review', function(req, res){
  // curQuestion-- ;
  // console.log(responses[curQuestion]);
  //var response =  JSON.stringify(responses[curQuestion].question) + '\n';
  res.end(JSON.stringify(responses));

})


app.get('/reset', function(req, res){
  curQuestion = 0;
  submitSurvey();
  for (var i = 0; i<responses.length; i++){
    responses[i].responses = [];
  }
  res.end(JSON.stringify(newSurvey));

})

var submitSurvey = function(){
  for ( var i = 0 ; i<responses.length; i++){
      var mAnswer = new Answer();
      mAnswer.id = responses[i].question.id;
      mAnswer.answers = responses[i].responses
      console.log(mAnswer);
      newSurvey.answers[i] = mAnswer;
  }
  newSurvey.save(function (err) {
      if (err){
          console.log('Error on save!');
      }else{
          console.log(newSurvey);
          console.log("Survey saved!");
      }
    });
}

// find all surveys in date range
app.get('/find', function(req, res){
var today = moment().startOf('day').local(),
    lastWeek = moment(today).subtract(-7,'data');
    tomorrow = moment(today).add(1, 'days');

  Survey.find({
        surveyVersion: 'timestamp',

      timedate: {
        $gte: lastWeek.toDate(),
        $lt: tomorrow.toDate()
      }
  }).
  exec(process);
  res.end();
});


var process= function (err, results){
  if (err) return handleError(err);
  console.log(convertArrayOfObjectsToCSV(results));
}


//clear the days/weels surveys
app.get('/clear', function ( req, res){
  Survey.remove({}, function(err) { 
     console.log('collection removed') 
  });
  res.end();
});



function convertArrayOfObjectsToCSV(data) {  
    var result, columnDelimiter, lineDelimiter, data;

    columnDelimiter  = ',';
    lineDelimiter    =  '\n';
    // set up initial csv column keys
    var keys = "surveyVersion,timestamp" ;
    var allAnswers = questions.questions;
    for( var i = 0; i<allAnswers.length; i++){
        for( var j = 0; j < allAnswers[i].answers.length; j++){
            var key = 'q';
            var qNum = i+1;
            var aNum = j+1;
            key += qNum.toString() + 'a' + aNum.toString();
            keys += columnDelimiter + key;
        }
    }

    result = '';
    result += keys
    result += lineDelimiter;

    // add response data
    for ( var i = 0; i< data.length; i++){  
        result += data[i].surveyVersion + columnDelimiter;
        result += data[i].timedate + columnDelimiter;
        var answers = data[i].answers;
        for (var j = 0; j<answers.length; j++){
            if (answers[j].answers.length == 0){
                  var n = 0;
                  allAnswers[j].answers.forEach(function(a){
                      result +=  '' + columnDelimiter;
                      n++;
                  });
            }else {
               for (var x = 0; x< answers[j].answers.length; x++){
                  if (answers[j].answers[x] == 1){
                    var key = 'q';
                    var qNum = j+1;
                    var aNum = x+1;
                    key += qNum.toString() + 'a' + aNum.toString();
                    result+= key + columnDelimiter;
                  }else if(answers[j].answers[x] == 0) {
                    result+= columnDelimiter;
                  }else{
                    result+=answers[j].answers[x] + columnDelimiter;
                  }
                }
            }
        }
        result += lineDelimiter
    }
    var today = moment().startOf('day').local().format('MM-DD-YYYY');
    var name = "dbLogs/"+today + ".csv";
    fs.writeFile(name, result, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
    }); 


    // Survey.remove({}, function(err) { 
    //   console.log('collection removed') 
    // });
    return result;


}

var cronJob = '45 18 * * 1';            //minutes hours months weeks days

crontab.scheduleJob(cronJob, function(){

  var today = moment().startOf('day').local(),
    lastWeek = moment(today).subtract(-7,'data');
    tomorrow = moment(today).add(1, 'days');

  Survey.find({
        surveyVersion: 'timestamp',

      timedate: {
        $gte: lastWeek.toDate(),
        $lt: tomorrow.toDate()
      }
  }).
  exec(process);

  // var today = moment().startOf('day').local(),  
  // lastWeek = moment(today).subtract(-7,'data');

  // Survey.find({
  //       surveyVersion: 'timestamp',

  //     timedate: {
  //       $gte: lastWeek.toDate(),
  //       $lt: today.toDate()
  //     }
  // }).
  // exec(process);

});