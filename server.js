var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var moment = require('moment');
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

fs.readFile('test.json', 'utf8', function (err, data) {
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

var alpha = 'abcdefghijklmnopqrstuvwxyz';

var Survey = mongoose.model('Survey', surveySchema);
var Answer = mongoose.model('Answer', answerSchema);

var newSurvey;

app.get('/', function(req, res) {
    res.send('Welcome to Survey');
});

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


app.get('/reset', function(req, res){
  curQuestion = 0;
  submitSurvey();
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
    tomorrow = moment(today).add(1, 'days');

  Survey.find({
        surveyVersion: 'timestamp',

      timedate: {
        $gte: today.toDate(),
        $lt: tomorrow.toDate()
      }
  }).
  exec(process);
  res.end();
});

var process= function (err, results){
  if (err) return handleError(err);
  // createCSV(results);
  var info = []; 
  for (var i = 0; i< results.length; i++){
      var newLine = [];
      for ( var j = 0; j< results[i].answers.length; j++){
          newLine.push({
            id: results[i].answers[i].id,
            answers: results[i].answers[i].answers
          });
      }
      info.push(newLine);
  }
  
  console.log(results)
  console.log(info);
}


//clear the days/weels surveys
app.get('/clear', function ( req, res){
  Survey.remove({}, function(err) { 
     console.log('collection removed') 
  });
  res.end();
});


//check question has been logged already

// getJson(/:questions, function(data)){
//   data.response, data.survey
// }



// should answers be remembered if you navigate back to a question

// this should probably use pos
// time out for survey to submit itself as imcomplete
// timeout, back to beginning, "NEW SURVEY" button, "submit" button, skipped questions
// real way to do it should be
// app.post('/answer')




