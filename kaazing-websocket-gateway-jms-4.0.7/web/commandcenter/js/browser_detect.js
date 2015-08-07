/**
 * Copyright (c) 2007-2014, Kaazing Corporation. All rights reserved.
 */

"use strict";
var BrowserDetect={init:function(){
this.browser=this.searchString(this.dataBrowser)||"An unknown browser";
this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";
this.OS=this.searchString(this.dataOS)||"an unknown OS";
this.mobile=(navigator.userAgent.toLowerCase().indexOf("mobile")>=0);
},searchString:function(_1){
for(var i=0;i<_1.length;i++){
var _3=_1[i].string;
var _4=_1[i].prop;
this.versionSearchString=_1[i].versionSearch||_1[i].identity;
if(_3){
if(_3.indexOf(_1[i].subString)!=-1){
return _1[i].identity;
}
}else{
if(_4){
return _1[i].identity;
}
}
}
},searchVersion:function(_5){
var _6=_5.indexOf(this.versionSearchString);
if(_6==-1){
return;
}
return parseFloat(_5.substring(_6+this.versionSearchString.length+1));
},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"CriOS",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{string:navigator.vendor,subString:"Google",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Trident/",identity:"Explorer",versionSearch:"rv"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"Android",identity:"Android"},{string:navigator.platform,subString:"iPad",identity:"iPad"},{string:navigator.platform,subString:"iPhone",identity:"iPhone"},{string:navigator.platform,subString:"iPod",identity:"iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};
BrowserDetect.init();
function checkBrowserVersion(){
var _7={Explorer:{Windows:"9"},Chrome:{Windows:"26",Mac:"26",Linux:"26",Android:"26",iPad:"26"},Firefox:{Windows:"22",Mac:"22",Android:"15",Linux:"22"},Safari:{Mac:"6",Linux:"22"}};
var _8={OS:BrowserDetect.OS,browser:BrowserDetect.browser,version:BrowserDetect.version,supported:false,minSupported:-1};
var _9=_7[_8.browser];
if(_9){
var _a=_9[_8.OS];
if(_a){
_8.minSupported=_a;
_a=_a.split(".");
var _b=(""+_8.version).split(".");
var _c=Math.min(_a.length,_b.length);
var _d,_e;
for(var j=0;j<_c;j++){
_d=_b[j];
_e=_a[j];
if(!isNaN(parseFloat(_d))&&isFinite(_d)){
_d=parseInt(_d);
_e=parseInt(_e);
}
if(_d<_e){
break;
}else{
if(_d>_e){
_8.supported=true;
break;
}else{
if(j==_c-1){
if(_a.length<=_b.length){
_8.supported=true;
break;
}
}
}
}
}
}
}
return _8;
};
var browserInfo=checkBrowserVersion();
if(!browserInfo.supported){
window.location="unsupported_browser.html?browser="+browserInfo.browser+"&os="+browserInfo.OS+"&version="+browserInfo.version+"&min="+browserInfo.minSupported;
}
