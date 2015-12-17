# Survey Kiosk

This is a web app built for the American Museum of Natural History that serves survey questions. Built with p5.js, node, and mongodb.

#### Requirements:

* OSX
* homebrew
* node.js
* mongoDB local install

## Installation

If you don't have monogoDB or NodeJS installed, you'll need to do that first. Before you do that, though, I recommend you install [homebrew](http://brew.sh/).

####Install mongoDB via homebrew:

`brew update`

`brew install mongod`

#### Install nodeJS

`brew update`

`brew install nodejs`

#### Clone this repository into your Documents folder

`git clone https://github.com/davidptracy/amnhSepaKiosk`

#### Install all node dependencies

`npm install`

*installs express, body-parser, mongoose, node-crontab, moment*

#### Optional: Deploy Launch Agents

Copy files in the `launchAgents` folder to `/Users/*currentUser*/Library/LaunchAgents` 

*Note: the paths in the launchAgents must match the director*

#### Create MongoDB data directory and set permissions

`mkdir -p /data/db` *Note: create this directory where you want the app to live, ie Documents/USER/amnhSepaKiosk/data/db*

`chmod rw /data`

##Running the App

You can run the app without launch agents by doing the following via Terminal:

`mongod --dbpath data` *Note: data should be where you specified it above*

`node server`

In your browser, open localhost:4000 *(or whatever you changed the port to in server.js)*

## Changing Questions

The questions can be changed by modifying ***questions.json*** which has the following structure

`{  
   "version":"timestamp",
   "questions":[  
      {  
         "id":"1",
         "type":"multiple",
         "question":"Which of the following are considered microbes?",
         "answers":[  
            "mite",
            "E. coli",
            "Ebola",
            "fruit fly",
            "cockroach"
         ],
         "image": [
            "images/01/00_mite.jpg", 
            "images/01/01_Ecoli.jpg", 
            "images/01/02_Ebola.jpg", 
            "images/01/03_Fruitfly.jpg", 
            "images/01/04_Cockroach.jpg"
         ]
      },
      {  
         "id":"2",
         "type":"1",
         "question":"What percentage of the total number of cells in your body are microbes?",
         "answers":[  
            "None",
            "up to 25%",
            "a majority, more than 51%",
            "All of them, 100%"
         ],
         "image": []
      }   ] 
}`

Here is a description of the JSON properties of the questions Array:

- **"id"**: this is question number, which marks what order the question occurs
- **"type"**: this sets the type of question, for instance, if type is 2, then the user can select up to 2 answers. If the type is "multiple", the user can select as many answers as they wish
- **question**: this is the actual question text that is displayed at the top of the screen
- **answers**: an array that holds all possible answers. Up to six answers can be provided
- **image**: an array that holds relative path links to image files, if they answer has an associated image. The size of this array must match the size of the answers array

##Accessing Answers

By default the app is set to save a dump of the database to a CSV file on Sundays at 6:45p. These CSV files will be saved to a directory called *dbLogs* outside of the application directory. 

These files can then be loaded into a spreadsheet app of your choice for analysis. 