var moment = require('moment');
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

moment().format();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Database Connected")
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

 var process= function (err, results){
  if (err) return handleError(err);
  console.log(convertArrayOfObjectsToCSV(results));
}

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
var today = moment().startOf('day').local(),
    lastWeek = moment(today).subtract(100,'day');   ///CHANGE THIS TO HOW MANY DAYS BACK YOU WANT TO LOG
    tomorrow = moment(today).add(1, 'days');

Survey.find({
   surveyVersion: 'timestamp',
 timedate: {
   $gte: lastWeek.toDate(),
   $lt: tomorrow.toDate()
 }
}).
exec(process);



