var express = require('express');
var bodyParser = require('body-parser')
var app = express();

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
fs.readFile('test.json', 'utf8', function (err, data) {
  if (err) throw err;
  questions = JSON.parse(data);
  console.log(questions);
});


// ======================================================
// ===============SET UP DATABASE SCHEMES================
// ======================================================


var Schema = mongoose.Schema;

var answers={
  id : {type: String},                  
  answers : [{ type: String}],
};                      

var surveySchema = Schema({
   answers: [{ id : {type: String}, answers : [{ type: String}]}],                       
   timedate: { type: Date, default: Date.now },
   surveyVersion: {type:String}
});


// ======================================================
// ====================SET UP ROUTES=====================
// ======================================================

var alpha = 'abcdefghijklmnopqrstuvwxyz';

var Survey = mongoose.model('Survey', surveySchema);
var newSurvey;

app.get('/', function(req, res) {
    res.send('Welcome to Survey');
});

// ======================================================
// =====================NEW SURVEY=======================
// ======================================================

app.get('/newSurvey', function(req, res) { 
  newSurvey = new Survey();
  console.log("New Survey at : " + newSurvey.timedate );
  res.end("New Survery :" + newSurvey.timedate + " Logged");
});

// ======================================================
// =====================QUESTIONS========================
// ======================================================

app.get('/:question', function(req, res){
  if (req.params.question == "1")  newSurvey.surveyVersion = questions.version;
  console.log(JSON.stringify(questions.questions[req.params.question]));
  var response =  JSON.stringify(questions.questions[req.params.question].question) + '\n';
  for ( var i = 0 ; i<questions.questions[req.params.question].answers.length; i++){
     response+= " " + alpha.charAt(i) + ": "+  JSON.stringify(questions.questions[req.params.question].answers[i]) + '\n';
  }
  //console.log(response);
  res.send(JSON.stringify(questions.questions[req.params.question]));

  res.end();

})


//check question has been logged already

// getJson(/:questions, function(data)){
//   data.response, data.survey
// }

// ======================================================
// =====================ANSWERS==========================
// ======================================================
//answers are formatted like this for now: http://localhost:3000/answer/1?a1=1&a2=3

app.get('/answer/:question', function(req, res){
  // console.log(JSON.stringify(questions.questions[req.params.question]));
  // console.log(Object.keys(req.query));
  // console.log(req.query);
  var newAnswer = {
     id : req.params.question,
     answers : []
  }
  for (var key in req.query){
      newAnswer.answers.push(req.query[key]);
  }
  
  newSurvey.answers.push(newAnswer);
  console.log(newSurvey);
  console.log(newSurvey.answers);
  res.send(JSON.stringify(newSurvey.answers));
  res.end();
})

// ======================================================
// =====================POST SURVEY======================
// ======================================================




// should answers be remembered if you navigate back to a question

// this should probably use pos
// time out for survey to submit itself as imcomplete
// timeout, back to beginning, "NEW SURVEY" button, "submit" button, skipped questions
// real way to do it should be
// app.post('/answer')




