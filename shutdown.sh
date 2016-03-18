#!/bin/sh
echo "*********** Killing mongod ... ***********"
ps -ef | grep mongod | grep -v grep | awk '{print $2}' | xargs kill
echo "Have a nice day"