#!/bin/sh
sleep 10
echo "*********** AMNH SEPA Kiosk Startup Script ***********"
echo "Starting Database ... "
cd /Users/sepakiosk/Documents/sepaKioskApp/
/usr/local/Cellar/mongodb/3.0.7/bin/mongod --fork --logpath mongoLogs/mongoLog.log --dbpath data
# mongod --fork --logpath /Users/sepakiosk/Documents/sepaKioskApp/mongoLogs/mongod.log --dbpath /Users/sepakiosk/Documents/sepaKioskApp/data
echo "Waiting 5 seconds ..."
sleep 5
echo "Starting Launch Agent for Google Chrome"
launchctl load /Users/sepakiosk/Documents/sepaKioskApp/launchAgents/com.amnh.chromeLauncher.plist
echo "Starting Node.js server ... "
# launchctl load /Users/sepakiosk/Documents/sepaKioskApp/launchAgents/com.amnh.nodeLaunch.plist
cd /Users/sepakiosk/Documents/sepaKioskApp/
/usr/local/bin/node server.js
# echo "Waiting 5 seconds ..."
# sleep 5
# echo "Starting Launch Agent for Google Chrome"
# launchctl load /Users/sepakiosk/Documents/sepaKioskApp/launchAgents/com.amnh.chromeLauncher.plist