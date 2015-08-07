#!/bin/bash
#
# Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
#

NUM_ARGS=0
CORDOVA_IOS_HOME=""
KAAZING_GW_HOME=""
PROJECT_HOME=""
PROJECT_NAME=""
PROJECT_PACKAGE_NAME=""

echoUsageAndExit() {
    echo "Usage: `basename $0`" \
         "-c <CORDOVA_IOS_HOME>" \
         "-k <GATEWAY_HOME>" \
         "-o <PROJECT_DIRECTORY>" \
         "-n <PROJECT_NAME>" \
         "-p <PACKAGE_NAME>" 1>&2; exit 1
}


if [ $# -eq $NUM_ARGS ]
then
    echoUsageAndExit
fi

# Parse command-line options and setup the internal variables.
while getopts c:k:o:n:p: OPTION
do
    case ${OPTION} in
        (c) CORDOVA_IOS_HOME=${OPTARG}
        ;;
        (k) KAAZING_GW_HOME=${OPTARG}
        ;;
        (o) PROJECT_HOME=${OPTARG}
        ;;
        (n) PROJECT_NAME=${OPTARG}
        ;;
        (p) PROJECT_PACKAGE_NAME=${OPTARG}
        ;;
        (*) echoUsageAndExit
        ;;
    esac
done

# Validate all the command-line parameters.
if [ -z ${CORDOVA_IOS_HOME} ]
then
    echo "Please specify the location of Apache Cordova's" \
         "iOS directory using the -c option." 1>&2; echoUsageAndExit
elif [ ! -d ${CORDOVA_IOS_HOME} ]
then
    echo "Invalid location of Apache Cordova's iOS directory" \
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

if [ -z ${PROJECT_NAME} ]
then
    echo "Please specify the name of the project using the" \
         "-n option." 1>&2; echoUsageAndExit
fi

if [ -z ${PROJECT_PACKAGE_NAME} ]
then
    echo "Please specify the project's package name using the" \
         "-p option." 1>&2; echoUsageAndExit
fi

# If ${PROJECT_HOME} directory exists, then move it to a .org
# so that we don't accidently lose the contents of the existing
# directory.
if [ -d ${PROJECT_HOME} ]
then
    echo "${PROJECT_HOME} already exists. Please move it to save the work."
    exit 1
fi

# Invoke Apache Cordova script to create the project directory
# structure.
${CORDOVA_IOS_HOME}/bin/create ${PROJECT_HOME} \
                               ${PROJECT_PACKAGE_NAME} \
                               ${PROJECT_NAME}

# Copy javascript, html, and other resources from Kaazing WebSocket
# Gateway's top-level demo/cordova/ios folder.
cp -r ${KAAZING_GW_HOME}/demo/cordova/www/* ${PROJECT_HOME}/www/

exit 0
