#!/bin/bash
#
# Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
#

NUM_ARGS=0
CORDOVA_ANDROID_HOME=""
KAAZING_GW_HOME=""
PROJECT_HOME=""

echoUsageAndExit() {
    echo "Usage: `basename $0`" \
         "-c <CORDOVA_ANDROID_HOME>" \
         "-k <GATEWAY_HOME>" \
         "-o <PROJECT_DIRECTORY>" 1>&2; exit 1
}


if [ $# -eq $NUM_ARGS ]
then
    echoUsageAndExit
fi

# Parse command-line options and setup the internal variables.
while getopts c:k:o:n:p: OPTION
do
    case ${OPTION} in
        (c) CORDOVA_ANDROID_HOME=${OPTARG}
        ;;
        (k) KAAZING_GW_HOME=${OPTARG}
        ;;
        (o) PROJECT_HOME=${OPTARG}
        ;;
        (*) echoUsageAndExit
        ;;
    esac
done

# Validate all the command-line parameters.
if [ -z ${CORDOVA_ANDROID_HOME} ]
then
    echo "Please specify the location of Apache Cordova's" \
         "android directory using the -c option." 1>&2; echoUsageAndExit
elif [ ! -d ${CORDOVA_ANDROID_HOME} ]
then
    echo "Invalid location of Apache Cordova's android directory" \
         "specified." 1>&2; exit 1
fi

if [ -z ${KAAZING_GW_HOME} ]
then
    echo "Please specify the location of Kaazing WebSocket Gateway" \
         "using the -k option." 1>&2; echoUsageAndExit
elif [ ! -d ${KAAZING_GW_HOME} ]
then
    echo "Invalid location of Kaazing WebSocket Gateway" \
         "specified." 1>&2; exit 1
fi

if [ -z ${PROJECT_HOME} ]
then
    echo "Please specify the location of the project's home" \
         "directory using the -o option." 1>&2; echoUsageAndExit
fi

# If ${PROJECT_HOME} directory does not exist, then the developer
# should be instructed to create the project in Eclipse so that
# ${PROJECT_HOME} directory is created.
if [ ! -d ${PROJECT_HOME} ]
then
    echo "Please create an Android project using Eclipse before running" \
         "this script." 1>2; exit 1
fi

WWW_DIRECTORY=${PROJECT_HOME}/assets/www

# Make necessary folders for Apache Cordova under the project's home.
if [ ! -d ${PROJECT_HOME}/libs ]
then
    mkdir ${PROJECT_HOME}/libs
fi
if [ ! -d ${WWW_DIRECTORY} ]
then
    mkdir ${WWW_DIRECTORY}
fi

# Copy Apache Cordova libraries(Java and Javascript) into the project's
# home directory in the right location.
cp -r ${CORDOVA_ANDROID_HOME}/xml ${PROJECT_HOME}/res
cp ${CORDOVA_ANDROID_HOME}/cordova-2.0.0.jar ${PROJECT_HOME}/libs
cp ${CORDOVA_ANDROID_HOME}/cordova-2.0.0.js ${WWW_DIRECTORY}

# Copy javascript, html, and other resources from Kaazing WebSocket
# Gateway's javascript demo folder.
cp -r ${KAAZING_GW_HOME}/demo/cordova/www/* ${WWW_DIRECTORY}

exit 0
