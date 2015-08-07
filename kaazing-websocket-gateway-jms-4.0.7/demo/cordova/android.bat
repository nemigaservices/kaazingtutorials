@REM
@REM Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
@REM

@echo off

if "%OS%" == "Windows_NT" SETLOCAL EnableDelayedExpansion
rem ---------------------------------------------------------------------------
rem Windows start script for Kaazing Gateway
rem ---------------------------------------------------------------------------

set BASENAME=%0
set CORDOVA_ANDROID_HOME=
set KAAZING_GW_HOME=
set PROJECT_HOME=

:loop
if not "%1"=="" (
    if "%1"=="-c" (
        set CORDOVA_ANDROID_HOME=%2
        shift
    )
    if "%1"=="-k" (
        set KAAZING_GW_HOME=%2
        shift
    )
    if "%1"=="-o" (
        set PROJECT_HOME=%2
        shift
    )
    shift
    goto :loop
)


if "%CORDOVA_ANDROID_HOME%" == "" (
    @echo "Please specify the location of Apache Cordova's android directory using the -c option."
    exit /b 1
)

if "%KAAZING_GW_HOME%" == "" (
    @echo "Please specify the location of Kaazing WebSocket Gateway using the -k option."
    exit /b 1
)

if "%PROJECT_HOME%" == "" (
    @echo "Please specify the location of the project's home directory using the -o option."
    exit /b 1
)

if not exist %PROJECT_HOME% (
    @echo "Please create an Android project using Eclipse before running this script."
    exit /b 1
)

set WWW_DIRECTORY=%PROJECT_HOME%\assets\www\

@rem Make necessary folders for Apache Cordova under the project's home.
if not exist %PROJECT_HOME%\libs (
    md %PROJECT_HOME}%\libs
)

if not exist %WWW_DIRECTORY% (
    md %WWW_DIRECTORY%
)

if not exist %PROJECT_HOME%\res\xml (
    md %PROJECT_HOME}%\res\xml
)

@rem Copy Apache Cordova libraries(Java and Javascript) into the project's
@rem home directory in the right location.
xcopy /s %CORDOVA_ANDROID_HOME%\xml\* %PROJECT_HOME%\res\xml\
xcopy %CORDOVA_ANDROID_HOME%\cordova-2.0.0.jar %PROJECT_HOME%\libs\
xcopy %CORDOVA_ANDROID_HOME%\cordova-2.0.0.js %WWW_DIRECTORY%

@rem Copy javascript, html, and other resources from Kaazing WebSocket
@rem Gateway's javascript demo folder.
xcopy /s %KAAZING_GW_HOME%\demo\cordova\www\* %WWW_DIRECTORY%

exit /b 0

