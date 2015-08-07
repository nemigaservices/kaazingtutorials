/**
 * Copyright (c) 2007-2014, Kaazing Corporation. All rights reserved.
 */

window.onerror=function(_1,_2,_3){
alert("Error message: "+_1+"\nURL: "+_2+"\nLine Number: "+_3);
return false;
};
var CP=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
if(CP&&CP.lineTo){
CP.dashedLine=function(x,y,x2,y2,_8){
if(!_8){
_8=[10,5];
}
if(_9==0){
_9=0.001;
}
var _a=_8.length;
this.moveTo(x,y);
var dx=(x2-x),dy=(y2-y);
var _d=dy/dx;
var _e=Math.sqrt(dx*dx+dy*dy);
var _f=0,_10=true;
while(_e>=0.1){
var _9=_8[_f++%_a];
if(_9>_e){
_9=_e;
}
var _11=Math.sqrt(_9*_9/(1+_d*_d));
if(dx<0){
_11=-_11;
}
x+=_11;
y+=_d*_11;
this[_10?"lineTo":"moveTo"](x,y);
_e-=_9;
_10=!_10;
}
};
}
var BYTES_IN_KIB=1024;
var BYTES_IN_MIB=1048576;
var BYTES_IN_GIB=1073741824;
if(!String.prototype.format){
String.prototype.format=function(){
var _12=arguments;
return this.replace(/{(\d+)}/g,function(_13,_14){
return typeof _12[_14]!="undefined"?_12[_14]:_13;
});
};
}
if(!String.prototype.startsWith){
String.prototype.startsWith=function(str){
return (this.indexOf(str,0)===0);
};
}
if(!String.prototype.endsWith){
String.prototype.endsWith=function(str){
return (this.lastIndexOf(str)===(this.length-str.length));
};
}
String.prototype.isDigits=function(){
return (/\D/.test(this)===false);
};
if(!String.prototype.trim){
String.prototype.trim=function(){
return this.replace(/^\s+|\s+$/g,"");
};
}
if(!String.prototype.ltrim){
String.prototype.ltrim=function(){
return this.replace(/^\s+/g,"");
};
}
if(!String.prototype.rtrim){
String.prototype.rtrim=function(){
return this.replace(/\s+$/g,"");
};
}
function fixupMouse(_17){
_17=_17||window.event;
var e={event:_17,target:_17.target?_17.target:_17.srcElement,which:_17.which?_17.which:_17.button===1?1:_17.button===2?3:_17.button===4?2:1,x:_17.x?_17.x:_17.clientX,y:_17.y?_17.y:_17.clientY};
return e;
};
function cvtBytes(_19,_1a,_1b){
if(_1a==="B"){
return _19+" B";
}else{
if(_1a==="KB"){
return (_19/1024).toFixed(_1b)+" KB";
}else{
if(_1a==="MB"){
return (_19/1048576).toFixed(_1b)+" MB";
}else{
if(_1a==="GB"){
return (_19/1073741824).toFixed(_1b)+" GB";
}else{
return _19+" (?)";
}
}
}
}
};
function bytesDisplayFn(_1c){
return cvtBytes(_1c,"MB",2);
};
function statusDisplayFn(_1d){
var _1e=["Unknown","Running","Stopped","Stop Requested","Restart Requested","Start Requested"];
if(_1d<1||_1d>5){
_1d=0;
}
return _1e[_1d];
};
function loggedInSessionDataDisplayFn(val){
return "[Coming later...]";
};
function ticksToDays(_20){
var _21=_20%100;
var _22=Math.floor((_20-_21)/100);
var _23=Math.floor(_22/86400);
_22=_22-(_23*86400);
var _24=Math.floor(_22/3600);
_22=_22-(_24*3600);
var _25=Math.floor(_22/60);
_22=_22-(_25*60);
var val=(_23===0?"00":""+_23)+":";
if(_24<10){
val+="0";
}
val+=_24;
val+=":";
if(_25<10){
val+="0";
}
val+=_25;
val+=":";
if(_22<10){
val+="0";
}
val+=_22;
val+=".";
if(_21<10){
val+="0";
}
val+=_21;
return val;
};
function encodeOID(_27){
if(_27.charAt(0)==="."){
_27=_27.substring(1);
}
var _28=_27.split(".");
var _29=[];
var val=parseInt(_28[0],10);
var _2b=parseInt(_28[1],10);
_29.push((40*val)+_2b);
var _2c=_29.length;
for(var i=2;i<_28.length;i++){
val=parseInt(_28[i],10);
if(val===0){
_29.push(0);
continue;
}
var _2e=[];
while(val>0){
_2e.push(val&127);
val=val>>>7;
}
for(var j=_2e.length-1;j>=0;j--){
if(j>0){
_29.push(_2e[j]|128);
}else{
_29.push(_2e[j]);
}
}
}
return _29;
};
function encodeOIDList(_30){
var _31=_30.length;
var _32=[];
for(var i=0;i<_31;i++){
_32.push(encodeOID(_30[i]));
}
return _32;
};
function invokeLater(fn,_35,_36){
if(!_35){
_35=0;
}
var t;
if(_36&&_36>0){
t=window.setInterval(fn,_36);
}else{
t=window.setTimeout(fn,_35);
}
return t;
};
function viewport(){
var e=window,a="inner";
if(!("innerWidth" in window)){
a="client";
e=document.documentElement||document.body;
}
return {width:e[a+"Width"],height:e[a+"Height"]};
};
function replaceTextValue(_3a,val){
var _3c=(val===undefined||val===null?"":val);
Y.one(_3a).set("text",_3c);
};
function addZero(val){
if(val<10){
return "0"+val;
}else{
return val;
}
};
function typeOf(_3e){
var s=typeof _3e;
if(s==="object"){
if(_3e){
if(Object.prototype.toString.call(_3e)==="[object Array]"){
s="array";
}
}else{
s="null";
}
}
return s;
};
function isEmptyObject(o){
var i,v;
if(typeOf(o)==="object"){
for(i in o){
v=o[i];
if(v!==undefined&&typeOf(v)!=="function"){
return false;
}
}
}
return true;
};
function isEmptyValue(_43){
return (_43===undefined||_43===null||_43===""||(typeOf(_43)==="array"&&_43.length===0)||(typeOf(_43)==="object"&&isEmptyObject(_43)));
};
function isEmpty(_44){
return (_44===undefined||_44===null||_44==="");
};
function formatDateTime(_45){
return addZero(_45.getMonth()+1)+"/"+addZero(_45.getDate())+"/"+addZero(_45.getYear()-100)+" "+addZero(_45.getHours())+":"+addZero(_45.getMinutes())+":"+addZero(_45.getSeconds());
};
function removeAllChildren(_46){
var obj=Y.one(_46);
if(obj){
obj.get("childNodes").remove();
}
};
function isEmpty(val){
return (val===undefined||val===null||val.length===0);
};
function compareNumbers(n1,n2,_4b,_4c){
if((n1===null||n1===undefined)&&_4c!==undefined){
n1=_4c;
}
if((n2===null||n2===undefined)&&_4c!==undefined){
n2=_4c;
}
return (_4b?n2-n1:n1-n2);
};
function compareStrings(s1,s2){
if(isEmpty(s1)){
return isEmpty(s2)?0:1;
}else{
if(isEmpty(s2)){
return -1;
}else{
if(s1<s2){
return -1;
}else{
return s1===s2?0:1;
}
}
}
};
function formatUptime(_4f){
var _50=Math.floor(_4f/(1000*60*60*24));
var _51=(_4f-(1000*60*60*24*_50));
var _52=Math.floor(_51/(1000*60*60));
_51=_51-(1000*60*60*_52);
var _53=Math.floor(_51/(1000*60));
_51=_51-(1000*60*_53);
var _54=Math.floor(_51/1000);
var _55="";
if(_4f<10000){
_55=(_4f/1000).toFixed(3);
}else{
if(_50>0){
_55=_55+_50+":";
}
if(_55.length>0){
_55=_55+addZero(_52)+":";
}else{
if(_52>0){
_55=_55+_52+":";
}
}
if(_55.length>0){
_55=_55+addZero(_53)+":";
}else{
if(_53>0){
_55=_55+_53+":";
}
}
if(_55.length>0){
_55=_55+addZero(_54);
}else{
if(_54>0){
_55=_55+_54;
}
}
}
return _55;
};
function dumpEventTargets(obj){
if(!obj){
return;
}
return;
var _57=obj.getTargets();
if(obj.name===undefined){
CC.console.debug("For "+obj.constructor.name+", no targets");
}else{
if(!_57||_57.length===0){
CC.console.debug("For "+obj.name+", 0 targets");
}else{
CC.console.debug("For "+obj.name+", "+_57.length+" targets");
_57.forEach(function(_58){
CC.console.debug("  "+(_58.name===undefined?_58.constructor.name:_58.name));
});
dumpEventTargets(_57[0]);
}
}
};
function dumpNotificationData(_59){
CC.console.debug("#### Notification data:");
for(var k in _59){
if(_59.hasOwnProperty(k)){
CC.console.debug("Key: "+k+", Value: "+_59[k]);
}
}
};
function dumpAttr(obj,_5c,_5d){
if(_5d===null||_5d===undefined){
_5d=0;
}
dumpValue(_5c,obj.get(_5c),_5d);
};
function dumpValue(_5e,_5f,_60){
var _61=typeOf(_5f);
if(_61==="object"){
dumpObject(_5e,_5f,_60);
}else{
if(_61==="array"){
dumpArray(_5e,_5f,_60);
}else{
dumpScalar(_5e,_5f,_60);
}
}
};
function dumpObject(_62,obj,_64){
CC.console.debug(genSpaces(_64)+_62+":");
if(obj){
for(var _65 in obj){
if(obj.hasOwnProperty(_65)){
var _66=obj[_65];
dumpValue(_65,_66,_64+2);
}
}
}else{
CC.console.debug(genSpaces(_64+2)+"NULL");
}
};
function dumpArray(_67,arr,_69){
CC.console.debug(genSpaces(_69)+_67+":");
if(arr){
CC.console.debug(genSpaces(_69+2)+"[");
for(var i=0;i<arr.length;i++){
dumpValue(i+": ",arr[i],_69+4);
}
CC.console.debug(genSpaces(_69+2)+"]");
}else{
CC.console.debug("    NULL");
}
};
function dumpScalar(_6b,_6c,_6d){
CC.console.debug(genSpaces(_6d)+_6b+": "+_6c);
};
function genSpaces(_6e){
var _6f="";
for(var i=0;i<_6e;i++){
_6f+=" ";
}
return _6f;
};
function getSortedKeys(obj){
var _72=[];
for(var _73 in obj){
if(obj.hasOwnProperty(_73)){
_72.push(_73);
}
}
_72.sort();
return _72;
};
function parseJSON(val){
if(val===null||val===undefined){
val===null;
}else{
if(val===""||val==="{}"){
val={};
}else{
val=JSON.parse(val);
}
}
return val;
};
function equalModelNumbers(s1,s2){
if(s1===undefined){
return (s2===undefined);
}else{
if(s1===null){
return (s2===null);
}else{
var _77=(s1===s2);
return _77;
}
}
};
function equalModelStrings(s1,s2){
if(s1===undefined){
return (s2===undefined);
}else{
if(s1===null){
return (s2===null);
}else{
if(s1.length===0){
return (s2.length===0);
}else{
var _7a=(s1===s2);
return _7a;
}
}
}
};
function equalModelArrays(a1,a2){
if(a1===undefined){
return (a2===undefined);
}else{
if(a1===null){
return (a2===null);
}else{
var _7d=equalArrays(a1,a2);
return _7d;
}
}
};
function equalModelObjects(o1,o2){
if(o1===undefined){
return (o2===undefined);
}else{
if(o1===null){
return (o2===null);
}else{
var _80=equalObjects(o1,o2);
return _80;
}
}
};
function equalObjects(o1,o2){
if(!o2){
return false;
}
var p;
for(p in o1){
if(typeof (o2[p])==="undefined"){
return false;
}
}
for(p in o1){
if(o1[p]){
switch(typeof (o1[p])){
case "object":
if(!equalObjects(o1[p],o2[p])){
return false;
}
break;
case "function":
if(typeof (o2[p])==="undefined"||(p!="equals"&&o1[p].toString()!=o2[p].toString())){
return false;
}
break;
default:
if(o1[p]!=o2[p]){
return false;
}
}
}else{
if(o2[p]){
return false;
}
}
}
for(p in o2){
if(typeof (o1[p])==="undefined"){
return false;
}
}
return true;
};
function equalArrays(a1,a2){
if(typeOf(a1)!=="array"){
return false;
}
if(typeOf(a2)!=="array"){
return false;
}
if(a1.length!=a2.length){
return false;
}
for(var i=0;i<a2.length;i++){
var _87=a1[i];
var _88=a2[i];
if(typeOf(_87)==="array"){
if(typeOf(_88)!=="array"){
return false;
}else{
if(!equalArrays(_87,_88)){
return false;
}
}
}else{
if(typeOf(_87)==="object"){
if(typeOf(_88)!=="object"){
return false;
}else{
if(!equalObjects(_87,_88)){
return false;
}
}
}else{
if(a1[i]!==a2[i]){
return false;
}
}
}
}
return true;
};
function findFirst(arr,_8a){
var _8b=arr.length;
for(var i=0;i<_8b;i++){
if(_8a(arr[i])){
return arr[i];
}
}
return null;
};
function calculateElementOuterHeight(_8d){
var _8e=0;
var _8f=0;
var _90=["height","border-top-width","border-bottom-width","padding-top","padding-bottom","margin-top","margin-bottom"];
for(var i=0;i<_90.length;i++){
_8f=parseInt(YAHOO.util.Dom.getStyle(el,_90[i]),10);
if(isNaN(_8f)){
_8f=parseInt(YAHOO.util.Dom.getComputedStyle(el,_90[i]),10);
}
if(!isNaN(_8f)){
_8e+=_8f;
}
}
return isNaN(_8e)?0:_8e;
};
function isNumeric(n){
return !isNaN(parseFloat(n))&&isFinite(n);
};
function arrayRemove(arr,elt){
var _95=arr.indexOf(elt);
if(_95>=0){
arr.splice(_95,1);
}
return null;
};
function arrayMax(_96){
return Math.max.apply(Math,_96);
};
function arrayMin(_97){
return Math.min.apply(Math,_97);
};
function formatNumber(num){
return (num===undefined||num===null?"":num);
};
function formatNumberToLocale(num){
if(num===undefined||num===null||num===""){
return "";
}
if(typeOf(num)==="string"){
num=parseFloat(num);
}
var val=num.toLocaleString();
return val;
};
function formatFloat(num,_9c){
if(num===undefined||num===null){
return "";
}else{
if(_9c!==undefined){
return parseFloat(num).toFixed(_9c);
}else{
return num;
}
}
};
function numberUnits(val){
val=Math.abs(val);
if(val<1000){
return "";
}else{
if(val<Math.pow(10,6)){
return "thousands";
}else{
if(val<Math.pow(10,9)){
return "millions";
}else{
if(val<Math.pow(10,12)){
return "billions";
}else{
if(val<Math.pow(10,15)){
return "trillions";
}else{
return "gazillions";
}
}
}
}
}
};
function numberRateUnits(val){
var val=numberUnits(val);
return (val==""?"#/second":val+"/second");
};
function byteUnits(val){
val=Math.abs(val);
if(val<Math.pow(2,10)){
return "";
}else{
if(val<Math.pow(2,20)){
return "KiB";
}else{
if(val<Math.pow(2,30)){
return "MiB";
}else{
if(val<Math.pow(2,40)){
return "GiB";
}else{
if(val<Math.pow(2,50)){
return "TiB";
}else{
if(val<Math.pow(2,60)){
return "PiB";
}
}
}
}
}
}
};
function byteRateUnits(val){
var val=byteUnits(val);
return (val==""?"B/second":val+"/second");
};
function memorySizeString(_a1,_a2){
if(_a1===null||_a1===undefined){
return "";
}
if(!_a2){
if(_a1<BYTES_IN_KIB){
_a2="B";
}else{
if(_a1<BYTES_IN_MIB){
_a2="KiB";
}else{
if(_a1<BYTES_IN_GIB){
_a2="MiB";
}else{
_a2="GiB";
}
}
}
}
var _a3;
switch(_a2){
case "KiB":
_a3=_a1/BYTES_IN_KIB;
break;
case "MiB":
_a3=_a1/BYTES_IN_MIB;
break;
case "GiB":
_a3=_a1/BYTES_IN_GIB;
break;
default:
_a2="B";
_a3=_a1;
}
if(_a2!=="B"){
_a3=_a3.toFixed(2);
}
return ""+_a3+" "+_a2;
};
function memoryThroughputString(_a4,_a5){
return memorySizeString(_a4,_a5)+"/s";
};
function createTABLE(_a6,_a7){
return createNode(_a6,"TABLE",_a7);
};
function createTHEAD(_a8,_a9){
return createNode(_a8,"THEAD",_a9);
};
function createTR(_aa,_ab){
return createNode(_aa,"TR",_ab);
};
function createTD(_ac,_ad){
return createNode(_ac,"TD",_ad);
};
function createTH(_ae,_af){
return createNode(_ae,"TH",_af);
};
function createDIV(_b0,_b1){
return createNode(_b0,"DIV",_b1);
};
function createH(_b2,_b3){
return createNode(_b2,"H"+_b3);
};
function createSELECT(_b4,_b5){
return createNode(_b4,"SELECT",_b5);
};
function createOPTION(_b6,_b7,_b8,_b9){
var _ba=createNode(_b6,"OPTION",_b7);
if(_b8!==undefined&&_b8!==null){
_ba.setHTML(Y.Escape.html(_b8));
}
if(_b9!==undefined&&_b9!==null){
_ba.set("value",_b9);
}
return _ba;
};
function createLINK(_bb,_bc,_bd){
var _be=createNode(_bb,"A",_bd);
if(_bc){
_be.set("href",_bc);
}
return _be;
};
function createIMG(_bf,_c0,_c1){
var img=createNode(_bf,"IMG",_c1);
if(_c0){
img.set("src",_c0);
}
return img;
};
function createSPAN(_c3,_c4,_c5){
var _c6=createNode(_c3,"SPAN",_c5);
if(_c4){
_c6.set("text",_c4);
}
return _c6;
};
function createLI(_c7,_c8){
return createNode(_c7,"LI",_c8);
};
function createUL(_c9,_ca){
return createNode(_c9,"UL",_ca);
};
function createINPUT(_cb,_cc,_cd){
var _ce=createNode(_cb,"INPUT",_cd);
if(_cc){
_ce.set("type",_cc);
}
return _ce;
};
function createBUTTON(_cf,_d0,_d1){
var _d2=createNode(_cf,"BUTTON",_d1);
if(_d0){
_d2.setHTML(_d0);
}
return _d2;
};
function createLABEL(_d3,_d4,_d5){
var _d6=createNode(_d3,"LABEL",_d5);
if(_d4!==undefined&&_d4!==null){
_d6.setHTML(Y.Escape.html(_d4));
}
return _d6;
};
function createCANVAS(_d7,_d8){
return createNode(_d7,"CANVAS",_d8);
};
function createNode(_d9,_da,_db){
var _dc=_d9.create("<"+_da+">");
if(_db){
_dc.addClass(_db);
}
_d9.append(_dc);
return _dc;
};
function sameDate(d1,d2){
return (d1.toDateString()==d2.toDateString());
};
function roundToSeconds(_df){
return Math.round(_df/1000);
};
function formatCommandCenterDate(_e0){
var _e1=""+_e0.getDate()+" "+CC.Constants.MONTHS[_e0.getMonth()].substring(0,3)+" "+_e0.getFullYear()+" "+addZero(_e0.getHours())+":"+addZero(_e0.getMinutes())+":"+addZero(_e0.getSeconds())+" "+"GMT";
var _e2=_e0.getTimezoneOffset();
if(_e2==0){
_e1+="+0000";
}else{
_e1+=(_e2>0?"-":"+");
_e2=Math.abs(_e2);
_e1+=addZero(Math.floor(_e2/60));
_e1+=addZero(_e2%60);
}
return _e1;
};
function totalSummaryFn(_e3,_e4,_e5){
var _e6=0,val,i,j;
if(_e3){
for(var key in _e3){
if(_e3.hasOwnProperty(key)){
var _eb=_e3[key];
if(_eb.length>0){
for(j=_eb.length-1;j>=0;j--){
if(_eb[j][0]<_e5){
break;
}
}
if(j>=0){
val=_eb[j][1]/_e4;
_e6+=val;
}
}
}
}
}
return "<div class=\"summaryLabel\">Total: </div>"+"<div class=\"summaryValue\">"+_e6+"<div>";
};
function minMaxAverageSummaryFn(_ec,_ed,_ee){
var _ef=true;
var _f0=0;
var min=0;
var max=0;
var avg=0;
var _f4=0;
if(_ec){
for(var key in _ec){
if(_ec.hasOwnProperty(key)){
_f4++;
var _f6=_ec[key];
if(_f6.length>0){
for(j=_f6.length-1;j>=0;j--){
if(_f6[j][0]<_ee){
break;
}
}
if(j>=0){
val=_f6[j][1]/_ed;
if(_ef){
min=val;
max=val;
_ef=false;
}else{
min=Math.min(min,val);
max=Math.max(max,val);
}
_f0+=val;
}
}
}
}
if(_f4>0){
avg=_f0/_f4;
}
}
return "<div class=\"summaryLabel\">Min: </div>"+"<div class=\"summaryValue\">"+min.toFixed(2)+"</div>"+"<div class=\"summaryLabel\">&nbsp;&nbsp;&nbsp;&nbsp;Max: </div>"+"<div class=\"summaryValue\">"+max.toFixed(2)+"</div>"+"<div class=\"summaryLabel\">&nbsp;&nbsp;&nbsp;&nbsp;Average: </div>"+"<div class=\"summaryValue\">"+avg.toFixed(2)+"</div>";
};
function minMaxAverageMultipleSummaryFn(_f7,_f8,_f9){
var _fa=true;
var _fb=0;
var min=0;
var max=0;
var avg=0;
var _ff=0;
if(_f7){
for(var key in _f7){
if(_f7.hasOwnProperty(key)){
_ff++;
var _101=_f7[key];
if(_101.length>0){
var _102=0;
for(var i=0;i<_101.length;i++){
valArray=_101[i];
if(valArray.length>0){
for(j=valArray.length-1;j>=0;j--){
if(valArray[j][0]<_f9){
break;
}
}
if(j>=0){
val=valArray[j][1]/_f8;
if(_fa){
min=val;
max=val;
_fa=false;
}else{
min=Math.min(min,val);
max=Math.max(max,val);
}
_102+=val;
}
}
}
avg+=(_102/_101.length);
}
}
}
if(_ff>0){
avg=avg/_ff;
}
}
return "<div class=\"summaryLabel\">Min: </div>"+"<div class=\"summaryValue\">"+min.toFixed(2)+"</div>"+"<div class=\"summaryLabel\">&nbsp;&nbsp;&nbsp;&nbsp;Max: </div>"+"<div class=\"summaryValue\">"+max.toFixed(2)+"</div>"+"<div class=\"summaryLabel\">&nbsp;&nbsp;&nbsp;&nbsp;Average: </div>"+"<div class=\"summaryValue\">"+avg.toFixed(2)+"</div>";
};
function insertChartValue(_104,_105,_106){
var _107=false;
var i=_104.length-1;
while(!_107&&i>=0){
var _109=_104[i][0];
if(_105>_109){
_104.splice(i+1,0,[_105,_106]);
_107=true;
}else{
if(_105==_109){
_107=true;
}else{
i--;
}
}
}
if(!_107){
_104.splice(0,0,[_105,_106]);
}
};
function toggleCheckbox(cb){
if(cb.readOnly){
cb.checked=cb.readOnly=false;
}else{
if(!cb.checked){
cb.readOnly=cb.indeterminate=true;
}
}
};
function checkboxState(cb){
if(cb.indeterminate){
return -1;
}else{
return (cb.checked?1:0);
}
};
function setCheckboxState(cb,_10d){
cb.checked=(_10d==1);
cb.indeterminate=cb.readOnly=(_10d==-1);
};
function computeDisplayVersionInfo(_10e){
if(_10e){
var _10f=_10e.productBuild;
var _110=_10f.indexOf(".");
_110=_10f.indexOf(".",_110+1);
_110=_10f.indexOf(".",_110+1);
return [_10e.productTitle,_10f.substring(0,_110),_10f.substring(_110+1)];
}else{
return null;
}
};
function scaleX(_111,_112,_113){
return (_111-_112[0])/(_112[1]-_112[0])*(_113[1]-_113[0]);
};
function invertX(_114,_115,_116){
return (_114-_116[0])/(_116[1]-_116[0])*(_115[1]-_115[0]);
};
function scaleY(_117,_118,_119,_11a){
return (_117/_119-_118[0])/(_118[1]-_118[0])*(_11a[1]-_11a[0]);
};
function invertY(_11b,_11c,_11d){
return (_11b-_11d[0])/(_11d[1]-_11d[0])*(_11c[1]-_11c[0]);
};
function maxDataItemValue(_11e){
if(!_11e||_11e.length==0){
return null;
}
var _11f=_11e[0][1];
for(var i=1;i<_11e.length;i++){
var item=_11e[i];
if(item[1]>_11f){
_11f=item[1];
}
}
return _11f;
};
function formatTableTime(o,_123){
var time=o.record.get(_123);
if(!time){
return "";
}
var d=new Date(time);
var now=new Date();
return (sameDate(d,now)?d.toLocaleTimeString():(d.toLocaleDateString()+"<BR>"+d.toLocaleTimeString()));
};
function centerPanel(_127){
var _128=Y.DOM.viewportRegion();
var _129=_127.get("contentBox");
_127.show();
var _12a=parseInt(_129.getStyle("width"));
var _12b=parseInt(_129.getStyle("height"));
_127.set("xy",[_128.left+(_128.width/2)-(_12a/2),_128.top+(_128.height/2)-(_12b/2)]);
};
function cvtUndefOrNull(_12c,_12d){
return (_12c===undefined||_12c===null?_12d:_12c);
};
function checkForTouch(){
if(!touchSupported()){
document.documentElement.className+=" no-touch";
}
};
function touchSupported(){
return (("ontouchstart" in window)||(window.DocumentTouch&&document instanceof DocumentTouch)?true:false);
};
function loadScript(url,_12f){
var _130=document.createElement("script");
_130.type="text/javascript";
if(_130.readyState){
_130.onreadystatechange=function(){
if(_130.readyState==="loaded"||_130.readyState==="complete"){
_130.onreadystatechange=null;
_12f();
}
};
}else{
_130.onload=function(){
_12f();
};
}
_130.src=url;
document.getElementsByTagName("head")[0].appendChild(_130);
};
"use strict";
var CC={};
var Y=null;
CC.PRODUCT_NAME="Kaazing Command Center";
CC.COMPANY_WEBSITE_URL="http://www.kaazing.com";
CC.HEADER_LOGO_IMAGE_URL="../images/header-logo.png";
CC.FOOTER_LOGO_IMAGE_URL="../images/footer-logo.png";
CC.LOGIN_LOGO_IMAGE_URL="../images/about-logo.png";
CC.ABOUT_LOGO_IMAGE_URL="../images/about-logo.png";
CC.COPYRIGHT_NOTICE="Copyright &copy; 2013-2014 Kaazing Corp. All rights reserved.";
CC.dummyConsole={assert:function(){
},log:function(){
},debug:function(){
},info:function(){
},warn:function(){
},error:function(){
},dir:function(){
}};
CC.fullConsole={assert:(window.console&&console.assert?function(msg){
console.assert(msg);
}:function(){
}),dir:(window.console&&console.dir?function(msg){
console.dir(msg);
}:function(){
}),log:(window.console&&console.log?function(msg){
console.log(msg);
}:function(){
}),debug:(window.console&&console.debug?function(msg){
console.debug(msg);
}:this.log),info:(window.console&&console.info?function(msg){
console.info(msg);
}:this.log),warn:(window.console&&console.warn?function(msg){
console.warn(msg);
}:this.log),error:(window.console&&console.error?function(msg){
console.error(msg);
}:this.log)};
CC.console=CC.dummyConsole;
CC.enableConsoleOutput=function(_138){
CC.console=(_138?CC.fullConsole:CC.dummyConsole);
};
CC.enableConsoleOutput(false);
CC.brand=function(_139){
function copyProp(_13a,_13b){
if(_139.hasOwnProperty(_13a)){
CC[_13b]=_139[_13a];
}
};
if(_139){
copyProp("productName","PRODUCT_NAME");
copyProp("companyWebsiteUrl","COMPANY_WEBSITE_URL");
copyProp("headerLogoImageUrl","HEADER_LOGO_IMAGE_URL");
copyProp("footerLogoImageUrl","FOOTER_LOGO_IMAGE_URL");
copyProp("loginLogoImageUrl","LOGIN_LOGO_IMAGE_URL");
copyProp("aboutLogoImageUrl","ABOUT_LOGO_IMAGE_URL");
copyProp("copyrightNotice","COPYRIGHT_NOTICE");
}
};
"use strict";
CC.Constants={MONTHS:["January","February","March","April","May","June","July","August","September","October","November","December"],SERVICE_DISPLAY_INFO:{balancer:{cssServiceType:"websocket-service",image:"../images/service-balancer.png"},directory:{cssServiceType:"directory-service",image:"../images/service-directory.png"},broadcast:{cssServiceType:"websocket-service",image:"../images/service-broadcast.png"},echo:{cssServiceType:"websocket-service",image:"../images/service-echo.png"},"http.proxy":{cssServiceType:"proxy-service",image:"../images/service-http-proxy.png"},"kerberos.proxy":{cssServiceType:"proxy-service",image:"../images/service-kerberos-proxy.png"},"jms":{cssServiceType:"websocket-service",image:"../images/service-stomp-jms.png"},"jms.proxy":{cssServiceType:"websocket-service",image:"../images/service-stomp-interceptor.png"},keyring:{cssServiceType:"websocket-service",image:"../images/service-keyring.png"},proxy:{cssServiceType:"proxy-service",image:"../images/service-proxy.png"},session:{cssServiceType:"directory-service",image:"../images/service-session.png"},"management.jmx":{cssServiceType:"management-service",image:"../images/service-management-jmx.png"},"management.snmp":{cssServiceType:"management-service",image:"../images/service-management-snmp.png"}},PROTOCOL_DISPLAY_INFO:{apns:{forwardIcon:"../images/arrow_purple_right.png",reverseIcon:"../images/arrow_purple_left.png",borderColor:"#9900CC",innerColor:"#9D49BF",label:"APNS"},"apns+feedback":{forwardIcon:"../images/arrow_purple_right.png",reverseIcon:"../images/arrow_purple_left.png",borderColor:"#9900CC",innerColor:"#9D49BF",label:"APNS w/feedback"},"apns+notify":{forwardIcon:"../images/arrow_purple_right.png",reverseIcon:"../images/arrow_purple_left.png",borderColor:"#9900CC",innerColor:"#9D49BF",label:"APNS w/notify"},http:{forwardIcon:"../images/arrow_blue_right.png",reverseIcon:"../images/arrow_blue_left.png",borderColor:"#396F87",innerColor:"#2590BA",label:"HTTP"},https:{forwardIcon:"../images/arrow_blue_right.png",reverseIcon:"../images/arrow_blue_left.png",borderColor:"#396F87",innerColor:"#2590BA",label:"Secure HTTP"},httpx:{forwardIcon:"../images/arrow_blue_right.png",reverseIcon:"../images/arrow_blue_left.png",borderColor:"#396F87",innerColor:"#2590BA",label:"HTTP"},httpxe:{forwardIcon:"../images/arrow_blue_right.png",reverseIcon:"../images/arrow_blue_left.png",borderColor:"#396F87",innerColor:"#2590BA",label:"HTTP"},"httpxe+ssl":{forwardIcon:"../images/arrow_blue_right.png",reverseIcon:"../images/arrow_blue_left.png",borderColor:"#396F87",innerColor:"#2590BA",label:"Secure HTTP"},"httpx+ssl":{forwardIcon:"../images/arrow_blue_right.png",reverseIcon:"../images/arrow_blue_left.png",borderColor:"#396F87",innerColor:"#2590BA",label:"Secure HTTP"},mcp:{forwardIcon:"../images/arrow_black_right.png",reverseIcon:"../images/arrow_black_left.png",borderColor:"#000000",innerColor:"#444444",label:"MCP"},mdp:{forwardIcon:"../images/arrow_black_right.png",reverseIcon:"../images/arrow_black_left.png",borderColor:"#000000",innerColor:"#444444",label:"MDP"},pipe:{forwardIcon:"../images/arrow_purple_right.png",reverseIcon:"../images/arrow_purple_left.png",borderColor:"#9900CC",innerColor:"#9D49BF",label:"PIPE"},proxy:{forwardIcon:"../images/arrow_purple_right.png",reverseIcon:"../images/arrow_purple_left.png",borderColor:"#9900CC",innerColor:"#9D49BF",label:"PROXY"},socks:{forwardIcon:"../images/arrow_purple_right.png",reverseIcon:"../images/arrow_purple_left.png",borderColor:"#9900CC",innerColor:"#9D49BF",label:"SOCKS"},"socks+ssl":{forwardIcon:"../images/arrow_purple_right.png",reverseIcon:"../images/arrow_purple_left.png",borderColor:"#9900CC",innerColor:"#9D49BF",label:"Secure SOCKS"},sse:{forwardIcon:"../images/arrow_red_right.png",reverseIcon:"../images/arrow_red_left.png",borderColor:"#771C0C",innerColor:"#CC4834",label:"SSE"},"sse+ssl":{forwardIcon:"../images/arrow_red_right.png",reverseIcon:"../images/arrow_red_left.png",borderColor:"#771C0C",innerColor:"#CC4834",label:"Secure SSE"},ssl:{forwardIcon:"../images/arrow_purple_right.png",reverseIcon:"../images/arrow_purple_left.png",borderColor:"#9900CC",innerColor:"#9D49BF",label:"SSL"},tcp:{forwardIcon:"../images/arrow_black_right.png",reverseIcon:"../images/arrow_black_left.png",borderColor:"#9900CC",innerColor:"#444444",label:"TCP"},udp:{forwardIcon:"../images/arrow_black_right.png",reverseIcon:"../images/arrow_black_left.png",borderColor:"#6E9932",innerColor:"#444444",label:"UDP"},ws:{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#E46D0A",label:"WS"},"ws-draft-75":{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#E46D0A",label:"WS (draft-75)"},"ws-draft-75+ssl":{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"Secure WS (draft-75)"},wse:{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"WS (emulated)"},"wse+ssl":{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"Secure WS (emulated)"},wsn:{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"WS"},"wsn+ssl":{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"Secure WS"},wsr:{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"RTMP (Flash)"},"wsr+ssl":{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"Secure RTMP (Flash)"},wss:{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"Secure WS"},wsx:{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"WS"},"wsx+ssl":{forwardIcon:"../images/arrow_orange_right.png",reverseIcon:"../images/arrow_orange_left.png",borderColor:"#E5761A",innerColor:"#46D0A",label:"Secure WS"}},TLS_SSL_IMAGES:{"https":"../images/lock.png","httpxe+ssl":"../images/lock.png","httpx+ssl":"../images/lock.png","socks+ssl":"../images/lock.png","sse+ssl":"../images/lock.png","ws-draft-75+ssl":"../images/lock.png","wse+ssl":"../images/lock.png","wsn+ssl":"../images/lock.png","wsr+ssl":"../images/lock.png","wss":"../images/lock.png","wsx+ssl":"../images/lock.png"},WARNING_IMAGE:"../images/warning.png",CONSTANT_TIME:-1,NotificationType:{MEMBERSHIP_CHANGE:"membershipChange",CONNECTION_LIMIT_CHANGE:"connectionLimitChange",GATEWAY_SUMMARY:"gatewaySummary",SERVICE_SUMMARY:"serviceSummary",SESSION_SUMMARY:"sessionSummary",SYSTEM_SUMMARY:"systemSummary",CPU_LIST_SUMMARY:"cpuListSummary",NIC_LIST_SUMMARY:"nicListSummary",JVM_SUMMARY:"jvmSummary",MANAGEMENT_SERVICE_CHANGE:"managementServiceChange",BALANCER_MAP_CHANGE:"balancerMapChange",SESSION_OPEN:"sessionOpen",SESSION_CLOSE:"sessionClose",TOTAL_SESSION_COUNT:"totalSessionCount",CURRENT_SESSION_COUNT:"currentSessionCount"},LineStyle:{SOLID:0,DASHED:1}};
"use strict";
function setupYUIPatches(){
YUI.add("dt-refresh-row-patch",function(Y){
"use strict";
function DataTableRefreshRowPatch(){
};
DataTableRefreshRowPatch.prototype={initializer:function(){
this.onceAfter("render",function(){
this.body.refreshRow=function(row,_13e,_13f){
var key,cell,len=_13f.length,i;
for(i=0;i<len;i++){
key=_13f[i];
cell=row.one("."+this.getClassName("col",key));
if(cell){
this.refreshCell(cell,_13e);
}
}
return this;
};
});
}};
Y.DataTable.RefreshRowPatch=DataTableRefreshRowPatch;
},"0.1",{requires:["datatable"]});
};
"use strict";
function SNMP(){
this._challengeHandler=null;
this._initialized=false;
this._openListener=null;
this._openListenerCallbackData=null;
this._exceptionListener=null;
this._exceptionListenerCallbackData=null;
this._closeListener=null;
this._closeListenerCallbackData=null;
this._location=null;
this._socket=null;
this._buffer=null;
this._notifAck=null;
this._callbackMap=new Object();
this._webSocketFactory=null;
this._bytesRead=0;
this._fragmentsRead=0;
};
(function(){
var _144=SNMP.prototype;
_144.onopen=function(){
if(this._openListener!==undefined){
this._openListener(this._openListenerCallbackData);
}
};
_144.onmessage=function(_145,body){
};
_144.onreceipt=function(_147){
};
_144.onerror=function(_148,body){
CC.console.error("SNMP: onerror!");
if(this._exceptionListener!==undefined){
this._exceptionListener(this._exceptionListenerCallbackData);
}
};
_144.onclose=function(){
CC.console.error("SNMP: onclose!");
if(this._closeListener!==undefined){
this._closeListener(this._closeListenerCallbackData);
}
};
_144.oncloseNotif=function(){
};
_144.oncloseNotifAck=function(){
};
_144.setChallengeHandler=function(_14a){
this._challengeHandler=_14a;
};
_144.getLocation=function(){
return this._location;
};
_144.getChallengeHandler=function(){
return this._challengeHandler;
};
_144.connect=function(_14b){
var _14c=this;
_initialize(_14c);
if(this._socket===null||this._socket.readyState===WebSocket.CLOSED){
if(!this._webSocketFactory){
this._webSocketFactory=new WebSocketFactory();
this._webSocketFactory.setChallengeHandler(this._challengeHandler);
}
var _14d=this._webSocketFactory.createWebSocket(_14b);
_14d.binaryType="bytebuffer";
_14d.onopen=function(){
_14c.onopen();
};
_14d.onmessage=function(evt){
_readFragment(_14c,evt);
};
_14d.onclose=function(evt){
_14c.onclose();
};
_14c._socket=_14d;
_14c._buffer=new ByteBuffer();
_14c._location=_14b;
}
};
_144.isOpen=function(){
return (this._socket!==null&&this._socket.readyState===WebSocket.OPEN);
};
_144.disconnect=function(){
if(this.isOpen()){
this._socket.close();
}
};
_144.setOpenListener=function(_150,_151){
this._openListener=_150;
this._openListenerCallbackData=_151;
};
_144.setExceptionListener=function(_152,_153){
this._exceptionListener=_152;
this._exceptionListenerCallbackData=_153;
};
_144.setCloseListener=function(_154,_155){
this._closeListener=_154;
this._closeListenerCallbackData=_155;
};
_144.startNotifListener=function(_156){
var _157=this;
this._callbackMap[0]=_156;
_157.subscribeToNotifications(_157);
};
_144.makeGetRequest=function(_158,_159){
if(this._socket===null){
CC.console.warn("SNMP makeGetRequest() on connection ["+this._location+"] with no _socket defined.");
throw new Error("SNMP makeGetRequest() on connection ["+this._location+"] with no _socket defined.");
}
if(this._socket.readyState!==WebSocket.OPEN){
CC.console.warn("SNMP makeGetRequest() on connection ["+this._location+"] that is not OPEN (1), it is "+this._socket.readyState+".");
throw new Error("SNMP makeGetRequest() on connection ["+this._location+"] that is not OPEN (1), it is "+this._socket.readyState+".");
}
var _15a=new Array();
_writeInteger(_15a,1);
_writeOctetString(_15a,"public");
var _15b=new Array();
var _15c=_getRequestId();
_writeInteger(_15b,_15c);
_writeInteger(_15b,0);
_writeInteger(_15b,0);
var _15d=_159.length;
var _15e=[];
for(var i=0;i<_15d;i++){
var _160=[];
_writeOID(_160,_159[i],_161,null);
_writeSequence(_160);
_pushArrayData(_15e,_160);
}
_writeSequence(_15e);
_pushArrayData(_15b,_15e);
_15a.push(_162);
_pushEncodedLength(_15a,_15b.length);
_pushArrayData(_15a,_15b);
var _163=new ByteBuffer();
_163.put(_164);
_writeMiscData(_163,_writeEncodedLength(_15a.length));
_writeMiscData(_163,_15a);
_163.flip();
this._callbackMap[_15c]=_158;
this._socket.send(_163);
};
_144.makeGetSubtreeRequest=function(_165,_166){
if(!(this.isOpen())){
CC.console.warn("SNMP makeGetSubtreeRequest() on connection ["+this._location+"] that is not OPEN.");
throw new Error("SNMP makeGetSubtreeRequest() on connection ["+this._location+"] that is not OPEN.");
}
var _167=new Array();
_writeInteger(_167,1);
_writeOctetString(_167,"public");
var _168=new Array();
var _169=_getRequestId();
_writeInteger(_168,_169);
_writeInteger(_168,0);
_writeInteger(_168,0);
var _16a=_166.length;
var _16b=[];
for(var i=0;i<_16a;i++){
var _16d=[];
_writeOID(_16d,_166[i],_161,null);
_writeSequence(_16d);
_pushArrayData(_16b,_16d);
}
_writeSequence(_16b);
_pushArrayData(_168,_16b);
_167.push(_16e);
_pushEncodedLength(_167,_168.length);
_pushArrayData(_167,_168);
var _16f=new ByteBuffer();
_16f.put(_164);
_writeMiscData(_16f,_writeEncodedLength(_167.length));
_writeMiscData(_16f,_167);
_16f.flip();
this._callbackMap[_169]=_165;
this._socket.send(_16f);
};
_144.makeGetBulkRequest=function(_170,_171,_172,_173){
if(!(this.isOpen())){
CC.console.warn("SNMP makeGetBulkRequest() on connection ["+this._location+"] that is not OPEN.");
throw new Error("SNMP makeGetBulkRequest() on connection ["+this._location+"] that is not OPEN.");
}
var _174=new Array();
if(_173===undefined||_173<0){
_173=0;
}
_writeInteger(_174,1);
_writeOctetString(_174,"public");
var _175=new Array();
var _176=_getRequestId();
_writeInteger(_175,_176);
_writeInteger(_175,_173);
_writeInteger(_175,_172);
var _177=_171.length;
var _178=[];
for(var i=0;i<_177;i++){
var _17a=[];
_writeOID(_17a,_171[i],_161,null);
_writeSequence(_17a);
_pushArrayData(_178,_17a);
}
_writeSequence(_178);
_pushArrayData(_175,_178);
_174.push(_17b);
_pushEncodedLength(_174,_175.length);
_pushArrayData(_174,_175);
var _17c=new ByteBuffer();
_17c.put(_164);
_writeMiscData(_17c,_writeEncodedLength(_174.length));
_writeMiscData(_17c,_174);
_17c.flip();
this._callbackMap[_176]=_170;
this._socket.send(_17c);
};
_144.makeResponse=function(_17d,obj,_17f){
if(!(this.isOpen())){
CC.console.warn("SNMP makeResponse() on connection ["+this._location+"] that is not OPEN.");
throw new Error("SNMP makeResponse() on connection ["+this._location+"] that is not OPEN.");
}
var _180=new Array();
_writeInteger(_180,1);
_writeOctetString(_180,"public");
var _181=new Array();
var _182=obj.requestId;
_writeInteger(_181,_182);
_writeInteger(_181,0);
_writeInteger(_181,0);
var _183=_17f.getBytes(_17f.limit);
_pushArrayData(_181,_183);
_180.push(_184);
_pushEncodedLength(_180,_181.length);
_pushArrayData(_180,_181);
var _185=new ByteBuffer();
_185.put(_164);
_writeMiscData(_185,_writeEncodedLength(_180.length));
_writeMiscData(_185,_180);
_185.flip();
var blob=_getBlobAt(_185,0,_185.limit);
_17d._notifAck.send(blob);
};
_144.makeSetRequest=function(_187,oid,_189,_18a){
if(!(this.isOpen())){
CC.console.warn("SNMP makeSetRequest() on connection ["+this._location+"] that is not OPEN.");
throw new Error("SNMP makeSetRequest() on connection ["+this._location+"] that is not OPEN.");
}
var _18b=new Array();
_writeInteger(_18b,1);
_writeOctetString(_18b,"public");
var _18c=new Array();
var _18d=_getRequestId();
_writeInteger(_18c,_18d);
_writeInteger(_18c,0);
_writeInteger(_18c,0);
var _18e=new Array();
_writeOID(_18e,oid,_189,_18a);
_writeSequence(_18e);
_writeSequence(_18e);
_pushArrayData(_18c,_18e);
_18b.push(_18f);
_pushEncodedLength(_18b,_18c.length);
_pushArrayData(_18b,_18c);
var _190=new ByteBuffer();
_190.put(_164);
_writeMiscData(_190,_writeEncodedLength(_18b.length));
_writeMiscData(_190,_18b);
_190.flip();
this._callbackMap[_18d]=_187;
this._socket.send(_190);
};
_144.subscribeToNotifications=function(_191){
if(!(this.isOpen())){
CC.console.warn("SNMP subscribeToNotifications() on connection ["+this._location+"] that is not OPEN.");
throw new Error("SNMP subscribeToNotifications() on connection ["+this._location+"] that is not OPEN.");
}
var _192=new Array();
_writeInteger(_192,1);
_writeOctetString(_192,"public");
_192.push(_193);
_pushEncodedLength(_192,0);
var _194=new ByteBuffer();
_194.put(_164);
_writeMiscData(_194,_writeEncodedLength(_192.length));
_writeMiscData(_194,_192);
_194.flip();
this._socket.send(_194);
};
function _initialize(_195){
if(!(_195._initialized&&_195._initialized===true)){
_195._initialized=true;
_196[_197]=_readInteger;
_196[_198]=_readOctetString;
_196[_161]=_readNull;
_196[_199]=_readOID;
_196[_164]=_readSequence;
_196[_19a]=_readTimeticks;
_196[_19b]=_readCounter64;
_196[_19c]=_readNull;
_196[_19d]=_readNull;
_196[_19e]=_readNull;
}
};
function validator(obj){
};
function _readFragment(_1a0,evt){
if(evt){
var _1a2=evt.data;
if(_1a2){
_1a0._fragmentsRead++;
if(_1a2.type!==undefined){
_1a0._bytesRead+=evt.data.length;
BlobUtils.asNumberArray(function(_1a3){
_readFragmentImpl(_1a0,_1a3);
},evt.data);
}else{
_1a0._bytesRead+=_1a2.limit;
_processFragment(_1a0,_1a2);
}
}
}
};
function _readFragmentImpl(_1a4,_1a5){
var _1a6=new ByteBuffer();
_writeMiscData(_1a6,_1a5);
_1a6.flip();
_processFragment(_1a4,_1a6);
};
function _processFragment(_1a7,_1a8){
outer:
while(_1a8.hasRemaining()){
_1a8.mark();
try{
_processMessage(_1a7,_1a8);
}
catch(e){
alert("Caught exception in _readFragment loop: ["+e+"]");
CC.console.error("Caught exception in _readFragment loop: ["+e+"]");
}
}
_1a8.compact();
_1a8.clear();
};
function _writeFrame(_1a9,body){
var _1ab=new ByteBuffer();
if(body){
for(var i=0;i<body.length;i++){
_1ab.put(body[i]);
}
}
_1ab.flip();
this._socket.send(_1ab);
};
function _writeMiscData(_1ad,data){
if(data){
for(var i=0;i<data.length;i++){
_1ad.put(data[i]);
}
}
};
function _processMessage(_1b0,_1b1){
var obj,_1b3,_1b4,uns,_1b6,_1b7,_1b8;
try{
uns=_1b1.getUnsigned();
_1b3=_196[uns](_1b1);
uns=_1b1.getUnsigned();
_1b4=_196[uns](_1b1);
uns=_1b1.getUnsigned();
_1b6=_196[uns](_1b1);
_1b7=_1b1.getUnsigned();
_1b8=0;
if(_1b7===_184){
obj=_processResponse(_1b1,_1b6);
_1b8=obj.requestId;
}else{
if((_1b7===_1b9)||(_1b7===_1ba)){
obj=_processNotification(_1b1,_1b7,_1b6);
}
}
if(_1b8!==undefined){
var _1bb=_1b0._callbackMap[_1b8];
if(_1bb!==undefined){
_1bb(obj);
if(_1b8!==0){
delete _1b0._callbackMap[_1b8];
}
}
}
}
catch(e){
alert("Caught exception in _processMessage: ["+e+"]");
CC.console.error("Caught exception in _processMessage: ["+e+"]");
}
};
function _processResponse(_1bc,_1bd){
var obj=new Object();
var _1bf=_getLength(_1bc.getUnsigned(),_1bc);
var _1c0=_196[_1bc.getUnsigned()](_1bc);
var _1c1=_196[_1bc.getUnsigned()](_1bc);
var _1c2=_196[_1bc.getUnsigned()](_1bc);
var _1c3=_196[_1bc.getUnsigned()](_1bc);
if(_1c3>0){
obj.values=new Object();
while(_1bc.hasRemaining()){
var _1c4=_1bc.getUnsigned();
var _1c5=_196[_1c4](_1bc);
var oid=_196[_1bc.getUnsigned()](_1bc);
var _1c7=_1bc.getUnsigned();
var _1c8=_196[_1c7](_1bc);
obj.values[oid]=_1c8;
}
}
obj.requestId=_1c0;
obj.community=_1bd;
obj.errorCode=_1c1;
return obj;
};
function _processNotification(_1c9,_1ca,_1cb){
var obj=new Object();
var _1cd=false;
if(_1ca===_1b9){
_1cd=true;
obj.type="inform";
}else{
if(_1ca===_1ba){
obj.type="trapV2";
}else{
obj.type="unknown "+_1ca;
return obj;
}
}
var _1ce=_getLength(_1c9.getUnsigned(),_1c9);
var _1cf=_196[_1c9.getUnsigned()](_1c9);
var _1d0=_196[_1c9.getUnsigned()](_1c9);
var _1d1=_196[_1c9.getUnsigned()](_1c9);
var _1d2=_1c9.slice();
var _1d3=_196[_1c9.getUnsigned()](_1c9);
if(_1d3>0){
obj.values=new Object();
while(_1c9.hasRemaining()){
var _1d4=_196[_1c9.getUnsigned()](_1c9);
var oid=_196[_1c9.getUnsigned()](_1c9);
var _1d6=_1c9.getUnsigned();
var _1d7=_196[_1d6](_1c9);
obj.values[oid]=_1d7;
}
}
obj.community=_1cb;
obj.errorCode=_1d0;
obj.requestId=_1cf;
if(_1cd===true){
_makeResponse(this,obj,_1d2);
}
return obj;
};
function _readInteger(_1d8){
var len=_1d8.getUnsigned();
var _1da=0;
for(var i=0;i<len;i++){
_1da=(_1da*256)+_1d8.getUnsigned();
}
return _1da;
};
function _readTimeticks(_1dc){
var len=_1dc.getUnsigned();
var _1de=0;
for(var i=0;i<len;i++){
_1de=(_1de*256)+_1dc.getUnsigned();
}
return _1de;
};
function _writeInteger(arr,_1e1){
var _1e2=new Array();
for(var i=3;i>=0;i--){
var _1e4=i*8;
var _1e5=255<<_1e4;
var _1e6=_1e1&_1e5;
var _1e7=_1e6>>_1e4;
if((_1e7!=0)||(_1e2.length>0)){
_1e2.push(_1e7);
}
}
arr.push(_197);
var _1e8=_1e2.length;
if(_1e8===0){
arr.push(1);
arr.push(0);
}else{
arr.push(_1e8);
for(var i=0;i<_1e8;i++){
arr.push(_1e2[i]);
}
}
return arr;
};
function _readOctetString(_1e9){
var len=_getLength(_1e9.getUnsigned(),_1e9);
var _1eb=new String();
for(var i=0;i<len;i++){
_1eb=_1eb.concat(String.fromCharCode(_1e9.getUnsigned()));
}
return _1eb.toString();
};
function _writeOctetString(arr,_1ee){
arr.push(_198);
_pushEncodedLength(arr,_1ee.length);
for(var i=0;i<_1ee.length;i++){
arr.push(_1ee.charCodeAt(i));
}
return arr;
};
function _readNull(_1f0){
var len=_1f0.get();
for(var i=0;i<len;i++){
_1f0.get();
}
return null;
};
function _readOID(_1f3){
var _1f4=new Array();
var len=_1f3.getUnsigned()-1;
if(len>=0){
var _1f6=_1f3.getUnsigned();
var y=_1f6%40;
var x=(_1f6-y)/40;
_1f4.push(x);
_1f4.push(y);
var _1f9=0;
for(var i=0;i<len;i++){
var _1fb=_1f3.getUnsigned();
_1f9=_1f9+(_1fb&127);
if((_1fb&128)!=0){
_1f9=_1f9*128;
}else{
_1f4.push(_1f9);
_1f9=0;
}
}
}
return _1f4.join(".");
};
function _writeOID(arr,oid,_1fe,_1ff){
arr.push(_199);
arr.push(oid.length);
_pushArrayData(arr,oid);
switch(_1fe){
case _161:
arr.push(_161);
arr.push(0);
break;
case _197:
_writeInteger(arr,_1ff);
break;
case _198:
_writeOctetString(arr,_1ff);
break;
case _199:
_writeOID(arr,_1ff,_161,null);
break;
case _19b:
_writeCounter64(arr,_1ff);
break;
}
return arr;
};
function _readCounter64(_200){
var len=_200.getUnsigned();
var _202=0;
for(var i=0;i<len;i++){
_202=_202*256;
_202=_202+_200.getUnsigned();
}
return _202;
};
function _writeCounter64(arr,_205){
var _206=new Array();
for(var i=7;i>=0;i--){
var _208=i*8;
var _209=255<<_208;
var _20a=_205&_209;
var _20b=_20a>>_208;
if((_20b!=0)||(_206.length>0)){
_206.push(_20b);
}
}
arr.push(_19b);
if(_206.length===0){
arr.push(1);
arr.push(0);
}else{
arr.push(_206.length);
for(var i=0;i<_206.length;i++){
arr.push(_206[i]);
}
}
return arr;
};
function _readSequence(_20c){
var len=_getLength(_20c.getUnsigned(),_20c);
return len;
};
function _writeSequence(arr){
var _20f=_writeEncodedLength(arr.length);
for(var i=_20f.length-1;i>=0;i--){
arr.unshift(_20f[i]);
}
arr.unshift(_164);
return arr;
};
function _getRequestId(){
return _211++;
};
function _getLength(len,_213){
if((len&128)!=0){
var _214=len&127;
var _215=0;
for(var i=0;i<_214;i++){
_215=_215*256;
_215=_215+_213.getUnsigned();
}
len=_215;
}
return len;
};
function _pushEncodedLength(arr,_218){
if(_218>=128){
var _219=_218;
var _21a=new Array();
while(_219!=0){
_21a.push(_219&255);
_219=_219>>8;
}
arr.push(128|_21a.length);
for(var i=_21a.length-1;i>=0;i--){
arr.push(_21a[i]);
}
}else{
arr.push(_218);
}
return arr;
};
function _writeEncodedLength(_21c){
return _pushEncodedLength(new Array(),_21c);
};
function _pushArrayData(arr1,arr2){
var len2=arr2.length;
if(len2>0){
for(var i=0;i<len2;i++){
arr1.push(arr2[i]);
}
}
return arr1;
};
function _getBlobAt(_221,_222,size){
var _224=_221.getBytesAt(_222,size);
return BlobUtils.fromNumberArray(_224);
};
var _162=160;
var _225=161;
var _184=162;
var _18f=163;
var _226=164;
var _17b=165;
var _1b9=166;
var _1ba=167;
var _193=170;
var _16e=171;
var _197=2;
var _198=4;
var _161=5;
var _199=6;
var _164=48;
var _227=64;
var _228=65;
var _229=66;
var _19a=67;
var _22a=68;
var _22b=69;
var _19b=70;
var _22c=71;
var _19c=128;
var _19d=129;
var _19e=130;
var _211=1;
var _196=new Object();
})();
"use strict";
var MngtOIDs=(function(){
var _22d="1.3.6.1.2.1.1";
var _22e="1.3.6.1.4.1.29197";
var _22f=_22e+".1";
var _230=_22f+".1";
var _231=_22f+".2";
var _232=_22f+".3";
var _233=_22f+".4";
var _234=_22f+".5";
var _235=_22f+".6";
var _236=_22f+".7";
var _237=_232+".5";
var _238=_237+".1";
var _239=_233+".1";
var _23a=_234+".1";
var _23b=_22e+".2";
var _23c=_23b+".1";
var _23d=_22e+".3";
var _23e=_23d+".1";
var _23f=_22e+".4";
var _240=_23f+".1";
var _241=_22e+".5";
var _242=_22e+".6";
var _243=_242+".1";
var _244=_22e+".7";
var _245=_244+".1";
var _246="1.3.6.1.4.1.42.2.145.3.163.1";
var _247=_246+".1";
var _248=_247+".1";
var _249=_247+".2";
var _24a=_247+".3";
var _24b={NOTIFICATION_TYPE_OID:"1.3.6.1.6.3.1.1.4.1.0",SYSTEM_ROOT_OID:_22d,GATEWAY_CFG_OID:_22f,CLUSTER_CFG_OID:_230,CLUSTER_CFG_NAME_OID:_230+".1.0",CLUSTER_CFG_ACCEPTS_OID:_230+".2.0",CLUSTER_CFG_CONNECTS_OID:_230+".3.0",CLUSTER_CFG_CONNECT_OPTIONS_OID:_230+".4.0",NETWORK_CFG_OID:_231,NETWORK_CFG_ADDRESS_MAPPINGS_OID:_231+".1.0",SECURITY_CFG_OID:_232,SECURITY_CFG_KEYSTORE_TYPE_OID:_232+".1.0",SECURITY_CFG_KEYSTORE_CERT_INFO_OID:_232+".2.0",SECURITY_CFG_TRUSTSTORE_TYPE_OID:_232+".3.0",SECURITY_CFG_TRUSTSTORE_CERT_INFO_OID:_232+".4.0",REALM_CFG_OID:_237,REALM_CFG_ENTRY_OID:_238,REALM_CFG_NAME_OID:_238+".1",REALM_CFG_DESCRIPTION_OID:_238+".2",REALM_CFG_USER_PRINCIPAL_CLASSES_OID:_238+".3",REALM_CFG_HTTP_CHALLENGE_SCHEME_OID:_238+".4",REALM_CFG_HTTP_HEADERS_OID:_238+".5",REALM_CFG_HTTP_QUERY_PARAMS_OID:_238+".6",REALM_CFG_HTTP_COOKIE_NAMES_OID:_238+".7",REALM_CFG_AUTHORIZATION_MODE_OID:_238+".8",REALM_CFG_AUTHORIZATION_TIMEOUT_OID:_238+".9",REALM_CFG_SESSION_TIMEOUT_OID:_238+".10",REALM_CFG_LOGIN_MODULES_OID:_238+".11",SERVICE_CFG_OID:_233,SERVICE_CFG_ENTRY_OID:_239,SERVICE_CFG_TYPE_OID:_239+".1",SERVICE_CFG_NAME_OID:_239+".2",SERVICE_CFG_DESCRIPTION_OID:_239+".3",SERVICE_CFG_ACCEPTS_OID:_239+".4",SERVICE_CFG_ACCEPT_OPTIONS_OID:_239+".5",SERVICE_CFG_BALANCES_OID:_239+".6",SERVICE_CFG_CONNECTS_OID:_239+".7",SERVICE_CFG_CONNECT_OPTIONS_OID:_239+".8",SERVICE_CFG_NOTIFYS_OID:_239+".9",SERVICE_CFG_NOTIFY_OPTIONS_OID:_239+".10",SERVICE_CFG_CROSS_SITE_CONSTRAINTS_OID:_239+".11",SERVICE_CFG_PROPERTIES_OID:_239+".12",SERVICE_CFG_REQUIRED_ROLES_OID:_239+".13",SERVICE_CFG_REALM_OID:_239+".14",SERVICE_CFG_MIME_MAPPINGS_OID:_239+".15",LICENSE_CFG_OID:_234,LICENSE_CFG_ENTRY_OID:_23a,LICENSE_CFG_NAME_OID:_23a+".1",LICENSE_CFG_COMPANY_OID:_23a+".2",LICENSE_CFG_EMAIL_OID:_23a+".3",LICENSE_CFG_ISSUE_DATE_OID:_23a+".4",LICENSE_CFG_PRODUCT_NAME_OID:_23a+".5",LICENSE_CFG_PRODUCT_VERSION_OID:_23a+".6",LICENSE_CFG_LICENSE_TYPE_OID:_23a+".7",LICENSE_CFG_NODE_LIMIT_OID:_23a+".8",LICENSE_CFG_NOT_VALID_BEFORE_DATE_OID:_23a+".9",LICENSE_CFG_NOT_VALID_AFTER_DATE_OID:_23a+".10",LICENSE_CFG_CONN_SOFT_LIMIT_OID:_23a+".11",LICENSE_CFG_CONN_HARD_LIMIT_OID:_23a+".12",LICENSE_CFG_ALLOWED_SERVICES_OID:_234+".2.0",SERVICE_DFLTS_CFG_OID:_235,SERVICE_DFLTS_CFG_ACCEPT_OPTIONS_OID:_235+".1.0",SERVICE_DFLTS_CFG_MIME_MAPPINGS_OID:_235+".2.0",GATEWAY_VERSION_INFO_OID:_236,GATEWAY_VERSION_INFO_PRODUCT_TITLE_OID:_236+".1.0",GATEWAY_VERSION_INFO_PRODUCT_BUILD_OID:_236+".2.0",GATEWAY_VERSION_INFO_PRODUCT_EDITION_OID:_236+".3.0",GATEWAY_OID:_23b,GATEWAY_ENTRY_OID:_23c,GATEWAY_INDEX_OID:_23c+".1",GATEWAY_ID_OID:_23c+".2",GATEWAY_TOTAL_CURRENT_SESSIONS_OID:_23c+".3",GATEWAY_TOTAL_BYTES_RECEIVED_OID:_23c+".4",GATEWAY_TOTAL_BYTES_SENT_OID:_23c+".5",GATEWAY_UPTIME_OID:_23c+".6",GATEWAY_START_TIME_OID:_23c+".7",GATEWAY_INSTANCE_KEY_OID:_23c+".8",GATEWAY_SUMMARY_DATA_OID:_23c+".9",GATEWAY_CLUSTER_MEMBERS_OID:_23c+".10",GATEWAY_BALANCER_MAP_OID:_23c+".11",GATEWAY_MNGT_SERVICE_MAP_OID:_23c+".12",GATEWAY_CLUSTER_CONN_SOFT_LIMIT_OID:_23c+".13",GATEWAY_CLUSTER_CONN_HARD_LIMIT_OID:_23c+".14",GATEWAY_SUMMARY_DATA_FIELDS_OID:_23b+".2.0",GATEWAY_SUMMARY_DATA_INTERVAL_OID:_23b+".3.0",GATEWAY_SUMMARY_DATA_NOTIF_OID:_23b+".4",GATEWAY_MEMBERSHIP_NOTIF_OID:_23b+".5",GATEWAY_MEMBERSHIP_EVENT_TYPE_OID:_23b+".6.0",GATEWAY_MNGT_SVC_NOTIF_OID:_23b+".8",GATEWAY_MNGT_SVC_EVENT_TYPE_OID:_23b+".9.0",GATEWAY_MNGT_SVC_EVENT_ACCEPT_URIS_OID:_23b+".10.0",GATEWAY_BALANCER_MAP_NOTIF_OID:_23b+".11",GATEWAY_BALANCER_MAP_EVENT_TYPE_OID:_23b+".12.0",GATEWAY_BALANCER_MAP_EVENT_BALANCER_URI_OID:_23b+".13.0",GATEWAY_BALANCER_MAP_EVENT_BALANCEE_URIS_OID:_23b+".14.0",GATEWAY_CONN_LIMIT_CHANGE_NOTIF_OID:_23b+".15",SERVICE_OID:_23d,SERVICE_ENTRY_OID:_23e,SERVICE_INDEX_OID:_23e+".1",SERVICE_STATE_OID:_23e+".2",SERVICE_SERVICE_CONNECTED_OID:_23e+".3",SERVICE_TOTAL_BYTES_RCVD_CT_OID:_23e+".4",SERVICE_TOTAL_BYTES_SENT_CT_OID:_23e+".5",SERVICE_CURR_SESSION_CT_OID:_23e+".6",SERVICE_CURR_NATIVE_SESSION_CT_OID:_23e+".7",SERVICE_CURR_EMULATED_SESSION_CT_OID:_23e+".8",SERVICE_TOTAL_SESSION_CT_OID:_23e+".9",SERVICE_TOTAL_NATIVE_SESSION_CT_OID:_23e+".10",SERVICE_TOTAL_EMULATED_SESSION_CT_OID:_23e+".11",SERVICE_TOTAL_EXCEPTION_CT_OID:_23e+".12",SERVICE_LATEST_EXCEPTION_OID:_23e+".13",SERVICE_LATEST_EXCEPTION_TIME_OID:_23e+".14",SERVICE_LAST_SUCCESS_CONNECT_TS_OID:_23e+".15",SERVICE_LAST_FAILED_CONNECT_TS_OID:_23e+".16",SERVICE_LAST_HB_PING_RESULT_OID:_23e+".17",SERVICE_LAST_HB_PING_TS_OID:_23e+".18",SERVICE_HB_PING_CT_OID:_23e+".19",SERVICE_HB_PING_SUCCESS_CT_OID:_23e+".20",SERVICE_HB_PING_FAILURE_CT_OID:_23e+".21",SERVICE_HB_RUNNING_OID:_23e+".22",SERVICE_ENABLE_NOTIFS_OID:_23e+".23",SERVICE_LOGGED_IN_SESSIONS_OID:_23e+".24",SERVICE_SUMMARY_DATA_OID:_23e+".25",SERVICE_SUMMARY_DATA_FIELDS_OID:_23d+".2.0",SERVICE_SUMMARY_DATA_INTERVAL_OID:_23d+".3.0",SERVICE_SUMMARY_DATA_NOTIF_OID:_23d+".4",SERVICE_SESSION_OPEN_NOTIF_OID:_23d+".5",SERVICE_SESSION_CLOSE_NOTIF_OID:_23d+".6",SESSION_OID:_23f,SESSION_ENTRY_OID:_240,SESSION_INDEX_OID:_240+".1",SESSION_ID_OID:_240+".2",SESSION_READ_BYTES_CT_OID:_240+".3",SESSION_READ_BYTES_THPT_OID:_240+".4",SESSION_WRITTEN_BYTES_CT_OID:_240+".5",SESSION_WRITTEN_BYTES_THPT_OID:_240+".6",SESSION_SESSION_OPEN_OID:_240+".7",SESSION_ENABLE_NOTIFS_OID:_240+".8",SESSION_START_TIME_OID:_240+".9",SESSION_REMOTE_ADDRESS_OID:_240+".10",SESSION_PRINCIPALS_OID:_240+".11",SESSION_SESSION_TYPE_NAME_OID:_240+".12",SESSION_SESSION_DIRECTION_OID:_240+".13",SESSION_SUMMARY_DATA_OID:_240+".14",SESSION_SUMMARY_DATA_FIELDS_OID:_23f+".2.0",SESSION_SUMMARY_DATA_INTERVAL_OID:_23f+".3.0",SESSION_SUMMARY_DATA_NOTIF_OID:_23f+".4",SESSION_MESSAGE_RCVD_NOTIF_OID:_23f+".5",SESSION_MESSAGE_SENT_NOTIF_OID:_23f+".6",SYSTEM_OID:_241,SYSTEM_OS_NAME_OID:_241+".1.0",SYSTEM_UPTIME_SECONDS_OID:_241+".2.0",SYSTEM_TOTAL_FREE_MEMORY_OID:_241+".3.0",SYSTEM_TOTAL_USED_MEMORY_OID:_241+".4.0",SYSTEM_TOTAL_MEMORY_OID:_241+".5.0",SYSTEM_TOTAL_FREE_SWAP_OID:_241+".6.0",SYSTEM_TOTAL_USED_SWAP_OID:_241+".7.0",SYSTEM_TOTAL_SWAP_OID:_241+".8.0",SYSTEM_CPU_PERCENTAGE_OID:_241+".9.0",SYSTEM_SUMMARY_DATA_FIELDS_OID:_241+".30.0",SYSTEM_SUMMARY_DATA_OID:_241+".31.0",SYSTEM_SUMMARY_DATA_INTERVAL_OID:_241+".32.0",SYSTEM_SUMMARY_DATA_NOTIF_OID:_241+".33",SYSTEM_SUMMARY_DATA_GATHER_INTERVAL_OID:_241+".34.0",CPU_OID:_242,CPU_ENTRY_OID:_243,CPU_LIST_NUM_CPUS_OID:_242+".2.0",CPU_LIST_SUMMARY_DATA_FIELDS_OID:_242+".3.0",CPU_LIST_SUMMARY_DATA_OID:_242+".4.0",CPU_LIST_SUMMARY_DATA_INTERVAL_OID:_242+".5.0",CPU_LIST_SUMMARY_DATA_NOTIF_OID:_242+".6",CPU_LIST_SUMMARY_DATA_GATHER_INTERVAL_OID:_242+".7.0",CPU_INDEX_OID:_243+".1",CPU_ID_OID:_243+".2",CPU_COMBINED_OID:_243+".3",CPU_IDLE_OID:_243+".4",CPU_IRQ_OID:_243+".5",CPU_NICE_OID:_243+".6",CPU_SOFT_IRQ_OID:_243+".7",CPU_STOLEN_OID:_243+".8",CPU_SYS_OID:_243+".9",CPU_USER_OID:_243+".10",CPU_WAIT_OID:_243+".11",CPU_SUMMARY_DATA_OID:_243+".12",NIC_OID:_244,NIC_ENTRY_OID:_245,NIC_LIST_NET_INTERFACE_NAMES_OID:_244+".2.0",NIC_LIST_SUMMARY_DATA_FIELDS_OID:_244+".3.0",NIC_LIST_SUMMARY_DATA_OID:_244+".4.0",NIC_LIST_SUMMARY_DATA_INTERVAL_OID:_244+".5.0",NIC_LIST_SUMMARY_DATA_NOTIF_OID:_244+".6",NIC_LIST_SUMMARY_DATA_GATHER_INTERVAL_OID:_244+".7.0",NIC_INDEX_OID:_245+".1",NIC_ID_OID:_245+".2",NIC_NAME_OID:_245+".3",NIC_RX_BYTES_OID:_245+".4",NIC_RX_BYTES_PER_SECOND_OID:_245+".5",NIC_RX_DROPPED_OID:_245+".6",NIC_RX_ERRORS_OID:_245+".7",NIC_TX_BYTES_OID:_245+".8",NIC_TX_BYTES_PER_SECOND_OID:_245+".9",NIC_TX_DROPPED_OID:_245+".10",NIC_TX_ERRORS_OID:_245+".11",NIC_SUMMARY_DATA_OID:_245+".12",JVM_MNGT_MIB_OID:_246,JVM_MNGT_MIB_OBJECTS_OID:_247,JVM_CLASS_LOADING_OID:_248,JVM_CLS_LOADED_OID:_248+".1.0",JVM_TOTAL_CLS_LOADED_OID:_248+".2.0",JVM_TOTAL_CLS_UNLOADED_OID:_248+".3.0",JVM_MEM_OID:_249,JVM_MEM_GC_CALL_OID:_249+".3.0",JVM_MEM_HEAP_INIT_SIZE_OID:_249+".10.0",JVM_MEM_HEAP_USED_OID:_249+".11.0",JVM_MEM_HEAP_COMMITTED_OID:_249+".12.0",JVM_MEM_HEAP_MAX_SIZE_OID:_249+".13.0",JVM_MEM_NON_HEAP_INIT_SIZE_OID:_249+".20.0",JVM_MEM_NON_HEAP_USED_OID:_249+".21.0",JVM_MEM_NON_HEAP_COMMITTED_OID:_249+".22.0",JVM_MEM_NON_HEAP_MAX_SIZE_OID:_249+".23.0",JVM_THREADING_OID:_24a,JVM_THREADING_LIVE_THREADS_OID:_24a+".1.0",JVM_THREADING_PEAK_THREADS_OID:_24a+".3.0",JVM_THREADING_TOTAL_THREADS_OID:_24a+".4.0",JVM_SUMMARY_DATA_FIELDS_OID:_241+".40.0",JVM_SUMMARY_DATA_OID:_241+".41.0",JVM_SUMMARY_DATA_INTERVAL_OID:_241+".42.0",JVM_SUMMARY_DATA_NOTIF_OID:_241+".43",JVM_SUMMARY_DATA_GATHER_INTERVAL_OID:_241+".44.0"};
return _24b;
})();
"use strict";
function MngtAPI(impl){
this._impl=impl;
};
(function(){
var _24d=MngtAPI.prototype;
_24d.setChallengeHandler=function(_24e){
this._impl.setChallengeHandler(_24e);
};
_24d.getChallengeHandler=function(){
return this._impl.getChallengeHandler();
};
_24d.connect=function(_24f){
this._impl.connect(_24f);
};
_24d.isOpen=function(){
return this._impl.isOpen();
};
_24d.disconnect=function(){
this._impl.disconnect();
};
_24d.setOpenListener=function(_250,_251){
this._impl.setOpenListener(_250,_251);
};
_24d.setExceptionListener=function(_252,_253){
this._impl.setExceptionListener(_252,_253);
};
_24d.setCloseListener=function(_254,_255){
this._impl.setCloseListener(_254,_255);
};
_24d.setProperty=function(_256,oid,_258,_259){
this._impl.setProperty(_256,oid,_258,_259);
};
_24d.getClusterState=function(_25a){
return this._impl.getClusterState(_25a);
};
_24d.getGatewayConfiguration=function(_25b){
return this._impl.getGatewayConfiguration(_25b);
};
_24d.getGateway=function(_25c){
return this._impl.getGateway(_25c);
};
_24d.getServices=function(_25d){
return this._impl.getServices(_25d);
};
_24d.getService=function(_25e,_25f){
return this._impl.getService(_25e,_25f);
};
_24d.setServiceNotifications=function(_260,_261,_262){
return this._impl.setServiceNotifications(_260,_261,_262);
};
_24d.getGatewaySessions=function(_263){
return this._impl.getGatewaySessions(_263);
};
_24d.getSessions=function(_264,_265){
return this._impl.getSessions(_264,_265);
};
_24d.getSession=function(_266,_267,_268){
return this._impl.getSession(_266,_267,_268);
};
_24d.closeSession=function(_269,_26a,_26b){
return this._impl.closeSession(_269,_26a,_26b);
};
_24d.startNotifications=function(_26c){
this._impl.startNotifications(_26c);
};
_24d.getJVMStats=function(_26d){
return this._impl.getJVMStats(_26d);
};
_24d.getSystemStats=function(_26e){
return this._impl.getSystemStats(_26e);
};
_24d.getCpuListStats=function(_26f){
return this._impl.getCpuListStats(_26f);
};
_24d.getNicListStats=function(_270){
return this._impl.getNicListStats(_270);
};
_24d.getSummaryDataDefinitions=function(_271){
return this._impl.getSummaryDataDefinitions(_271);
};
_24d.ping=function(_272){
return this._impl.ping(_272);
};
})();
"use strict";
function MngtAPI_SNMP(){
this._snmp=new SNMP();
};
(function(){
var _273=MngtAPI_SNMP.prototype;
var _274=1;
_273.CONNECTION_SOFT_LIMIT=0;
_273.CONNECTION_HARD_LIMIT=1;
_273.VERSION_INFO_FIELD_MAP={};
_273.VERSION_INFO_FIELD_MAP[MngtOIDs.GATEWAY_VERSION_INFO_PRODUCT_TITLE_OID]="productTitle";
_273.VERSION_INFO_FIELD_MAP[MngtOIDs.GATEWAY_VERSION_INFO_PRODUCT_BUILD_OID]="productBuild";
_273.VERSION_INFO_FIELD_MAP[MngtOIDs.GATEWAY_VERSION_INFO_PRODUCT_EDITION_OID]="productEdition";
_273.CLUSTER_CFG_FIELD_MAP={};
_273.CLUSTER_CFG_FIELD_MAP[MngtOIDs.CLUSTER_CFG_NAME_OID]="name";
_273.CLUSTER_CFG_FIELD_MAP[MngtOIDs.CLUSTER_CFG_ACCEPTS_OID]="accepts";
_273.CLUSTER_CFG_FIELD_MAP[MngtOIDs.CLUSTER_CFG_CONNECTS_OID]="connects";
_273.CLUSTER_CFG_FIELD_MAP[MngtOIDs.CLUSTER_CFG_CONNECT_OPTIONS_OID]="connectOptions";
_273.NETWORK_CFG_FIELD_MAP={};
_273.NETWORK_CFG_FIELD_MAP[MngtOIDs.NETWORK_CFG_ADDRESS_MAPPINGS_OID]="addressMappings";
_273.SECURITY_CFG_FIELD_MAP={};
_273.SECURITY_CFG_FIELD_MAP[MngtOIDs.SECURITY_CFG_KEYSTORE_TYPE_OID]="keystoreType";
_273.SECURITY_CFG_FIELD_MAP[MngtOIDs.SECURITY_CFG_KEYSTORE_CERT_INFO_OID]="keystoreCertificateInfo";
_273.SECURITY_CFG_FIELD_MAP[MngtOIDs.SECURITY_CFG_TRUSTSTORE_TYPE_OID]="truststoreType";
_273.SECURITY_CFG_FIELD_MAP[MngtOIDs.SECURITY_CFG_TRUSTSTORE_CERT_INFO_OID]="truststoreCertificateInfo";
_273.REALM_CFG_FIELD_MAP={};
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_NAME_OID]="name";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_DESCRIPTION_OID]="description";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_USER_PRINCIPAL_CLASSES_OID]="userPrincipalClasses";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_HTTP_CHALLENGE_SCHEME_OID]="httpChallengeScheme";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_HTTP_HEADERS_OID]="httpHeaders";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_HTTP_QUERY_PARAMS_OID]="httpQueryParams";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_HTTP_COOKIE_NAMES_OID]="httpCookieNames";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_AUTHORIZATION_MODE_OID]="authorizationMode";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_AUTHORIZATION_TIMEOUT_OID]="authorizationTimeout";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_SESSION_TIMEOUT_OID]="sessionTimeout";
_273.REALM_CFG_FIELD_MAP[MngtOIDs.REALM_CFG_LOGIN_MODULES_OID]="loginModules";
_273.SERVICE_CFG_FIELD_MAP={};
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_TYPE_OID]="type";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_NAME_OID]="name";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_DESCRIPTION_OID]="description";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_ACCEPTS_OID]="accepts";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_ACCEPT_OPTIONS_OID]="acceptOptions";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_BALANCES_OID]="balances";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_CONNECTS_OID]="connects";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_CONNECT_OPTIONS_OID]="connectOptions";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_NOTIFYS_OID]="notifys";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_NOTIFY_OPTIONS_OID]="notifyOptions";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_CROSS_SITE_CONSTRAINTS_OID]="crossSiteConstraints";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_PROPERTIES_OID]="properties";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_REQUIRED_ROLES_OID]="requiredRoles";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_REALM_OID]="realm";
_273.SERVICE_CFG_FIELD_MAP[MngtOIDs.SERVICE_CFG_MIME_MAPPINGS_OID]="mimeMappings";
_273.LICENSE_CFG_FIELD_MAP={};
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_NAME_OID]="name";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_COMPANY_OID]="company";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_EMAIL_OID]="email";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_ISSUE_DATE_OID]="issueDate";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_PRODUCT_NAME_OID]="productName";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_PRODUCT_VERSION_OID]="productVersion";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_LICENSE_TYPE_OID]="licenseType";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_NODE_LIMIT_OID]="nodeLimit";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_NOT_VALID_BEFORE_DATE_OID]="notValidBeforeDate";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_NOT_VALID_AFTER_DATE_OID]="notValidAfterDate";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_CONN_SOFT_LIMIT_OID]="connectionSoftLimit";
_273.LICENSE_CFG_FIELD_MAP[MngtOIDs.LICENSE_CFG_CONN_HARD_LIMIT_OID]="connectionHardLimit";
_273.LICENSE_CFG_OVERALL_MAP={};
_273.LICENSE_CFG_OVERALL_MAP[MngtOIDs.LICENSE_CFG_ALLOWED_SERVICES_OID]="allowedServices";
_273.SERVICE_DFLTS_CFG_FIELD_MAP={};
_273.SERVICE_DFLTS_CFG_FIELD_MAP[MngtOIDs.SERVICE_DFLTS_CFG_ACCEPT_OPTIONS_OID]="acceptOptions";
_273.SERVICE_DFLTS_CFG_FIELD_MAP[MngtOIDs.SERVICE_DFLTS_CFG_MIME_MAPPINGS_OID]="mimeMappings";
_273.setGatewayConfigAttribute=function(_275,oid,val){
if(oid==="readTime"){
_275.readTime=val;
return;
}
var _278=this.VERSION_INFO_FIELD_MAP[oid];
if(_278!==undefined){
if(_278!==""){
var _279=_275.versionInfo;
if(!_279){
_279={};
_275.versionInfo=_279;
}
_279[_278]=val;
}
return;
}
var _278=this.CLUSTER_CFG_FIELD_MAP[oid];
if(_278!==undefined){
if(_278!==""){
var _27a=_275.clusterConfig;
if(!_27a){
_27a={};
_275.clusterConfig=_27a;
}
_27a[_278]=val;
}
return;
}
_278=this.NETWORK_CFG_FIELD_MAP[oid];
if(_278!==undefined){
if(_278!==""){
var _27b=_275.networkConfig;
if(!_27b){
_27b={};
_275.networkConfig=_27b;
}
_27b[_278]=val;
}
return;
}
_278=this.SECURITY_CFG_FIELD_MAP[oid];
if(_278!==undefined){
if(_278!==""){
var _27c=_275.securityConfig;
if(!_27c){
_27c={};
_275.securityConfig=_27c;
}
_27c[_278]=val;
}
return;
}
if(oid.startsWith(MngtOIDs.REALM_CFG_ENTRY_OID+".")){
for(var _27d in this.REALM_CFG_FIELD_MAP){
if(oid.startsWith(_27d+".")){
_278=this.REALM_CFG_FIELD_MAP[_27d];
if(_278!==undefined&&_278!==""){
var _27e=oid.lastIndexOf(".");
var _27f=parseInt(oid.substring(_27e+1),10);
var _27c=_275.securityConfig;
if(!_27c){
_27c={};
_275.securityConfig=_27c;
}
var _280=_27c.realmConfigs;
if(!_280){
_280=[];
_27c.realmConfigs=_280;
}
var _281=_280[_27f-1];
if(!_281){
_281={};
_280[_27f-1]=_281;
}
_281[_278]=val;
return;
}
}
}
alert("Gateway realm config unknown attribute OID '"+oid+"'");
return;
}
if(oid.startsWith(MngtOIDs.SERVICE_CFG_ENTRY_OID+".")){
for(var _27d in this.SERVICE_CFG_FIELD_MAP){
if(oid.startsWith(_27d+".")){
_278=this.SERVICE_CFG_FIELD_MAP[_27d];
if(_278!==undefined&&_278!==""){
var _27e=oid.lastIndexOf(".");
var _27f=parseInt(oid.substring(_27e+1),10);
var _282=_275.serviceConfigs;
if(!_282){
_282=[];
_275.serviceConfigs=_282;
}
var _283=_282[_27f-1];
if(!_283){
_283={};
_283.serviceId=_27f;
_282[_27f-1]=_283;
}
_283[_278]=val;
return;
}
}
}
alert("Gateway service config unknown attribute OID '"+oid+"'");
return;
}
if(oid.startsWith(MngtOIDs.LICENSE_CFG_OID+".")){
if(oid.startsWith(MngtOIDs.LICENSE_CFG_ENTRY_OID+".")){
for(var _27d in this.LICENSE_CFG_FIELD_MAP){
if(oid.startsWith(_27d+".")){
_278=this.LICENSE_CFG_FIELD_MAP[_27d];
if(_278!==undefined&&_278!==""){
var _27e=oid.lastIndexOf(".");
var _27f=parseInt(oid.substring(_27e+1),10);
var _284=_275.licensesConfig;
if(!_284){
_284={};
_275.licensesConfig=_284;
}
var _285=_284.licenses;
if(!_285){
_285=[];
_284.licenses=_285;
}
var _286=_285[_27f-1];
if(!_286){
_286={};
_285[_27f-1]=_286;
}
_286[_278]=val;
return;
}
}
}
}else{
_278=this.LICENSE_CFG_OVERALL_MAP[oid];
if(_278!==undefined){
if(_278!==""){
var _284=_275.licensesConfig;
if(!_284){
_284={};
_275.licensesConfig=_284;
}
_284[_278]=val;
}
return;
}
}
alert("Gateway license config unknown attribute OID '"+oid+"'");
return;
}
_278=this.SERVICE_DFLTS_CFG_FIELD_MAP[oid];
if(_278!==undefined){
if(_278!==""){
var _287=_275.serviceDefaultsConfig;
if(!_287){
_287={};
_275.serviceDefaultsConfig=_287;
}
_287[_278]=val;
}
return;
}
alert("Gateway Config completely unknown attribute OID '"+oid+"'");
};
_273.GATEWAY_FIELD_MAP={};
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_INDEX_OID]="gatewayId";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_ID_OID]="hostAndPID";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_TOTAL_CURRENT_SESSIONS_OID]="totalCurrentSessions";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_TOTAL_BYTES_RECEIVED_OID]="totalBytesReceived";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_TOTAL_BYTES_SENT_OID]="totalBytesSent";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_UPTIME_OID]="upTime";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_START_TIME_OID]="startTime";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_INSTANCE_KEY_OID]="instanceKey";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_SUMMARY_DATA_OID]="summaryData";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_CLUSTER_MEMBERS_OID]="clusterMembers";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_BALANCER_MAP_OID]="balancerMap";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_MNGT_SERVICE_MAP_OID]="mngtServiceMap";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_CLUSTER_CONN_SOFT_LIMIT_OID]="clusterConnectionSoftLimit";
_273.GATEWAY_FIELD_MAP[MngtOIDs.GATEWAY_CLUSTER_CONN_HARD_LIMIT_OID]="clusterConnectionHardLimit";
_273.GATEWAY_FIELD_MAP["readTime"]="readTime";
_273.setGatewayAttribute=function(_288,_289,val){
var _28b=this.GATEWAY_FIELD_MAP[_289];
if(_28b===undefined){
alert("gateway unknown attribute OID '"+_289+"'");
}else{
if(_28b!==""){
_288[_28b]=val;
}
}
};
_273.SERVICE_OIDS=[MngtOIDs.SERVICE_INDEX_OID,MngtOIDs.SERVICE_STATE_OID,MngtOIDs.SERVICE_SERVICE_CONNECTED_OID,MngtOIDs.SERVICE_TOTAL_BYTES_RCVD_CT_OID,MngtOIDs.SERVICE_TOTAL_BYTES_SENT_CT_OID,MngtOIDs.SERVICE_CURR_SESSION_CT_OID,MngtOIDs.SERVICE_CURR_NATIVE_SESSION_CT_OID,MngtOIDs.SERVICE_CURR_EMULATED_SESSION_CT_OID,MngtOIDs.SERVICE_TOTAL_SESSION_CT_OID,MngtOIDs.SERVICE_TOTAL_NATIVE_SESSION_CT_OID,MngtOIDs.SERVICE_TOTAL_EMULATED_SESSION_CT_OID,MngtOIDs.SERVICE_TOTAL_EXCEPTION_CT_OID,MngtOIDs.SERVICE_LATEST_EXCEPTION_OID,MngtOIDs.SERVICE_LATEST_EXCEPTION_TIME_OID,MngtOIDs.SERVICE_LAST_SUCCESS_CONNECT_TS_OID,MngtOIDs.SERVICE_LAST_FAILED_CONNECT_TS_OID,MngtOIDs.SERVICE_LAST_HB_PING_RESULT_OID,MngtOIDs.SERVICE_LAST_HB_PING_TS_OID,MngtOIDs.SERVICE_HB_PING_CT_OID,MngtOIDs.SERVICE_HB_PING_SUCCESS_CT_OID,MngtOIDs.SERVICE_HB_PING_FAILURE_CT_OID,MngtOIDs.SERVICE_HB_RUNNING_OID,MngtOIDs.SERVICE_ENABLE_NOTIFS_OID,MngtOIDs.SERVICE_LOGGED_IN_SESSIONS_OID,MngtOIDs.SERVICE_SUMMARY_DATA_OID];
_273.SERVICE_FIELD_MAP={};
_273.SERVICE_FIELD_MAP[MngtOIDs.GATEWAY_INDEX_OID]="gatewayId";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_INDEX_OID]="serviceId";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_STATE_OID]="state";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_SERVICE_CONNECTED_OID]="serviceConnected";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_TOTAL_BYTES_RCVD_CT_OID]="totalBytesReceived";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_TOTAL_BYTES_SENT_CT_OID]="totalBytesSent";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_CURR_SESSION_CT_OID]="totalCurrentSessions";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_CURR_NATIVE_SESSION_CT_OID]="totalCurrentNativeSessions";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_CURR_EMULATED_SESSION_CT_OID]="totalCurrentEmulatedSessions";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_TOTAL_SESSION_CT_OID]="totalCumulativeSessions";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_TOTAL_NATIVE_SESSION_CT_OID]="totalCumulativeNativeSessions";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_TOTAL_EMULATED_SESSION_CT_OID]="totalCumulativeEmulatedSessions";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_TOTAL_EXCEPTION_CT_OID]="totalExceptionCount";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_LATEST_EXCEPTION_OID]="latestException";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_LATEST_EXCEPTION_TIME_OID]="latestExceptionTime";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_LAST_SUCCESS_CONNECT_TS_OID]="lastSuccessfulConnectTime";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_LAST_FAILED_CONNECT_TS_OID]="lastFailedConnectTime";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_LAST_HB_PING_RESULT_OID]="lastHeartbeatPingResult";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_LAST_HB_PING_TS_OID]="lastHeartbeatPingTimestamp";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_HB_PING_CT_OID]="heartbeatPingCount";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_HB_PING_SUCCESS_CT_OID]="heartbeatPingSuccesses";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_HB_PING_FAILURE_CT_OID]="heartbeatPingFailures";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_HB_RUNNING_OID]="heartbeatRunning";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_ENABLE_NOTIFS_OID]="enableNotifications";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_LOGGED_IN_SESSIONS_OID]="loggedInSessions";
_273.SERVICE_FIELD_MAP[MngtOIDs.SERVICE_SUMMARY_DATA_OID]="summaryData";
_273.SERVICE_FIELD_MAP["readTime"]="readTime";
_273.setServiceAttribute=function(_28c,_28d,val){
var _28f=this.SERVICE_FIELD_MAP[_28d];
if(_28f===undefined){
alert("service unknown attribute OID '"+_28d+"'");
}else{
if(_28f!==""){
_28c[_28f]=val;
}
}
};
_273.SESSION_OIDS=[MngtOIDs.SESSION_INDEX_OID,MngtOIDs.SESSION_ID_OID,MngtOIDs.SESSION_READ_BYTES_CT_OID,MngtOIDs.SESSION_READ_BYTES_THPT_OID,MngtOIDs.SESSION_WRITTEN_BYTES_CT_OID,MngtOIDs.SESSION_WRITTEN_BYTES_THPT_OID,MngtOIDs.SESSION_SESSION_OPEN_OID,MngtOIDs.SESSION_ENABLE_NOTIFS_OID,MngtOIDs.SESSION_START_TIME_OID,MngtOIDs.SESSION_REMOTE_ADDRESS_OID,MngtOIDs.SESSION_PRINCIPALS_OID,MngtOIDs.SESSION_SESSION_TYPE_NAME_OID,MngtOIDs.SESSION_SESSION_DIRECTION_OID];
_273.SESSION_FIELD_MAP={};
_273.SESSION_FIELD_MAP[MngtOIDs.GATEWAY_INDEX_OID]="gatewayId";
_273.SESSION_FIELD_MAP[MngtOIDs.SERVICE_INDEX_OID]="serviceId";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_INDEX_OID]="sessionId";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_ID_OID]="";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_READ_BYTES_CT_OID]="readBytes";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_READ_BYTES_THPT_OID]="readBytesThroughput";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_WRITTEN_BYTES_CT_OID]="writtenBytes";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_WRITTEN_BYTES_THPT_OID]="writtenBytesThroughput";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_SESSION_OPEN_OID]="sessionOpen";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_ENABLE_NOTIFS_OID]="enableNotifications";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_START_TIME_OID]="startTime";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_REMOTE_ADDRESS_OID]="remoteAddress";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_PRINCIPALS_OID]="principals";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_SESSION_TYPE_NAME_OID]="sessionTypeName";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_SESSION_DIRECTION_OID]="sessionDirection";
_273.SESSION_FIELD_MAP[MngtOIDs.SESSION_SUMMARY_DATA_OID]="summaryData";
_273.SESSION_FIELD_MAP["readTime"]="readTime";
_273.setSessionAttribute=function(_290,_291,val){
var _293=this.SESSION_FIELD_MAP[_291];
if(_293===undefined){
alert("session unknown attribute OID '"+_291+"'");
}else{
if(_293!==""){
_290[_293]=val;
}
}
};
_273.SYSTEM_OIDS=[MngtOIDs.SYSTEM_OS_NAME_OID,MngtOIDs.SYSTEM_SUMMARY_DATA_OID];
_273.SYSTEM_FIELD_MAP={};
_273.SYSTEM_FIELD_MAP[MngtOIDs.SYSTEM_OS_NAME_OID]="osName";
_273.SYSTEM_FIELD_MAP[MngtOIDs.SYSTEM_SUMMARY_DATA_OID]="summaryData";
_273.SYSTEM_FIELD_MAP["readTime"]="readTime";
_273.setSystemAttribute=function(_294,_295,val){
var _297=this.SYSTEM_FIELD_MAP[_295];
if(_297===undefined){
alert("System unknown attribute OID '"+_295+"'");
}else{
if(_297!==""){
_294[_297]=val;
}
}
};
_273.CPU_LIST_OIDS=[MngtOIDs.CPU_LIST_NUM_CPUS_OID,MngtOIDs.CPU_LIST_SUMMARY_DATA_OID];
_273.CPU_LIST_FIELD_MAP={};
_273.CPU_LIST_FIELD_MAP[MngtOIDs.CPU_LIST_NUM_CPUS_OID]="numCpus";
_273.CPU_LIST_FIELD_MAP[MngtOIDs.CPU_LIST_SUMMARY_DATA_OID]="summaryData";
_273.CPU_LIST_FIELD_MAP["readTime"]="readTime";
_273.setCpuListAttribute=function(_298,_299,val){
var _29b=this.CPU_LIST_FIELD_MAP[_299];
if(_29b===undefined){
alert("CPUList unknown attribute OID '"+_299+"'");
}else{
if(_29b!==""){
_298[_29b]=val;
}
}
};
_273.NIC_LIST_OIDS=[MngtOIDs.NIC_LIST_NET_INTERFACE_NAMES_OID,MngtOIDs.NIC_LIST_SUMMARY_DATA_OID];
_273.NIC_LIST_FIELD_MAP={};
_273.NIC_LIST_FIELD_MAP[MngtOIDs.NIC_LIST_NET_INTERFACE_NAMES_OID]="netInterfaceNames";
_273.NIC_LIST_FIELD_MAP[MngtOIDs.NIC_LIST_SUMMARY_DATA_OID]="summaryData";
_273.NIC_LIST_FIELD_MAP["readTime"]="readTime";
_273.setNicListAttribute=function(_29c,_29d,val){
var _29f=this.NIC_LIST_FIELD_MAP[_29d];
if(_29f===undefined){
alert("NICList unknown attribute OID '"+_29d+"'");
}else{
if(_29f!==""){
_29c[_29f]=val;
}
}
};
_273.JVM_OIDS=[MngtOIDs.JVM_SUMMARY_DATA_OID];
_273.JVM_FIELD_MAP={};
_273.JVM_FIELD_MAP[MngtOIDs.JVM_SUMMARY_DATA_OID]="summaryData";
_273.JVM_FIELD_MAP["readTime"]="readTime";
_273.setJVMAttribute=function(_2a0,_2a1,val){
var _2a3=this.JVM_FIELD_MAP[_2a1];
if(_2a3===undefined){
alert("JVM unknown attribute OID '"+_2a1+"'");
}else{
if(_2a3!==""){
_2a0[_2a3]=val;
}
}
};
_273.setChallengeHandler=function(_2a4){
this._snmp.setChallengeHandler(_2a4);
};
_273.getChallengeHandler=function(){
return this._snmp.getChallengeHandler();
};
_273.connect=function(_2a5){
this._snmp.connect(_2a5);
};
_273.isOpen=function(){
return this._snmp.isOpen();
};
_273.disconnect=function(){
this._snmp.disconnect();
};
_273.setOpenListener=function(_2a6,_2a7){
this._snmp.setOpenListener(_2a6,_2a7);
};
_273.setExceptionListener=function(_2a8,_2a9){
this._snmp.setExceptionListener(_2a8,_2a9);
};
_273.setCloseListener=function(_2aa,_2ab){
this._snmp.setCloseListener(_2aa,_2ab);
};
_273.getClusterState=function(_2ac){
var _2ad=this;
var _2ae=[MngtOIDs.GATEWAY_ID_OID+"."+_274,MngtOIDs.GATEWAY_UPTIME_OID+"."+_274,MngtOIDs.GATEWAY_START_TIME_OID+"."+_274,MngtOIDs.GATEWAY_INSTANCE_KEY_OID+"."+_274,MngtOIDs.GATEWAY_CLUSTER_MEMBERS_OID+"."+_274,MngtOIDs.GATEWAY_BALANCER_MAP_OID+"."+_274,MngtOIDs.GATEWAY_MNGT_SERVICE_MAP_OID+"."+_274,MngtOIDs.GATEWAY_CLUSTER_CONN_SOFT_LIMIT_OID+"."+_274,MngtOIDs.GATEWAY_CLUSTER_CONN_HARD_LIMIT_OID+"."+_274,MngtOIDs.CLUSTER_CFG_NAME_OID];
var fn=function(){
_2ad._snmp.makeGetRequest(function(_2b0){
_2ad.getClusterState2(_2b0,_2ac);
},encodeOIDList(_2ae));
};
var t=invokeLater(fn,0);
return t;
};
_273.getClusterState2=function(_2b2,_2b3){
var _2b4=this;
if((_2b2!==null)&&(_2b2.values!==undefined)){
var _2b5={};
this.setGatewayAttribute(_2b5,"readTime",(new Date()).getTime());
var _2b6=_2b2.values;
for(var oid in _2b6){
if(oid!==undefined){
if(oid==MngtOIDs.CLUSTER_CFG_NAME_OID){
_2b5.clusterName=_2b6[oid];
}else{
var _2b8=oid;
var _2b9=_2b8.lastIndexOf(".");
_2b8=_2b8.substring(0,_2b9);
this.setGatewayAttribute(_2b5,_2b8,_2b6[oid]);
}
}
}
this.parseJSONField(_2b5,"mngtServiceMap",false);
this.parseJSONField(_2b5,"clusterMembers",false);
this.parseJSONField(_2b5,"balancerMap",false);
this.fixBalancerMap(_2b5);
this.setGatewayAttribute(_2b5,MngtOIDs.GATEWAY_INDEX_OID,_274);
_2b3(_2b5);
}
};
_273.getGatewayConfiguration=function(_2ba){
var _2bb=this;
var fn=function(){
_2bb._snmp.makeGetSubtreeRequest(function(_2bd){
_2bb.getGatewayConfiguration2(_2bd,_2ba);
},[encodeOID(MngtOIDs.GATEWAY_CFG_OID)]);
};
var t=invokeLater(fn,0);
return t;
};
_273.getGatewayConfiguration2=function(_2bf,_2c0){
var _2c1=this;
var _2c2=(new Date()).getTime();
var _2c3={};
var _2c4=_2bf.values;
for(var oid in _2c4){
var val=_2c4[oid];
_2c1.setGatewayConfigAttribute(_2c3,oid,val);
}
_2c1.setGatewayConfigAttribute(_2c3,"readTime",_2c2);
var _2c7=_2c3.clusterConfig;
if(!_2c7.accepts&&!_2c7.connects){
delete _2c3.clusterConfig;
}
var _2c8=_2c3.licensesConfig;
if(_2c8){
var _2c9=_2c8.allowedServices;
if(_2c9){
_2c9=_2c9.split(",");
_2c9.forEach(function(val,_2cb,arr){
arr[_2cb]=val.trim();
});
_2c9.sort();
_2c8.allowedServices=_2c9;
}
}
var _2cd=_2c3.networkConfig;
if(!_2cd.addressMappings){
delete _2c3.networkConfig;
}else{
_2cd.addressMappings=parseJSON(_2cd.addressMappings);
}
var _2ce=_2c3.securityConfig;
if(_2ce){
_2ce.keystoreCertificateInfo=parseJSON(_2ce.keystoreCertificateInfo);
_2ce.truststoreCertificateInfo=parseJSON(_2ce.truststoreCertificateInfo);
var _2cf=_2ce.truststoreCertificateInfo;
if(_2cf){
for(var i=0;i<_2cf.length;i++){
var cert=_2cf[i];
if(cert.issuer===cert.subject){
cert.issuer=cert.subject;
}
}
}
if(_2ce.realmConfigs){
for(var i=0;i<_2ce.realmConfigs.length;i++){
var _2d2=_2ce.realmConfigs[i];
_2d2.userPrincipalClasses=parseJSON(_2d2.userPrincipalClasses);
_2d2.httpCookieNames=parseJSON(_2d2.httpCookieNames);
_2d2.httpHeaders=parseJSON(_2d2.httpHeaders);
_2d2.httpQueryParams=parseJSON(_2d2.httpQueryParams);
_2d2.loginModules=parseJSON(_2d2.loginModules);
}
}
}
var _2d3=_2c3.serviceConfigs;
if(_2d3){
for(var i=0;i<_2d3.length;i++){
var _2d4=_2d3[i];
_2d4.accepts=parseJSON(_2d4.accepts);
if(_2d4.accepts){
_2d4.accepts.sort();
}
_2d4.acceptOptions=parseJSON(_2d4.acceptOptions);
_2d4.balances=parseJSON(_2d4.balances);
_2d4.connects=parseJSON(_2d4.connects);
if(_2d4.connects){
_2d4.connects.sort();
}
_2d4.connectOptions=parseJSON(_2d4.connectOptions);
_2d4.crossSiteConstraints=parseJSON(_2d4.crossSiteConstraints);
_2d4.notifys=parseJSON(_2d4.notifys);
if(_2d4.notifys){
_2d4.notifys.sort();
}
_2d4.notifyOptions=parseJSON(_2d4.notifyOptions);
_2d4.properties=parseJSON(_2d4.properties);
_2d4.requiredRoles=parseJSON(_2d4.requiredRoles);
_2d4.mimeMappings=parseJSON(_2d4.mimeMappings);
}
}
var _2d5=_2c3.serviceDefaultsConfig;
if(_2d5){
_2d5.acceptOptions=parseJSON(_2d5.acceptOptions);
_2d5.mimeMappings=parseJSON(_2d5.mimeMappings);
}
_2c0(_2c3);
};
_273.getGateway=function(_2d6,_2d7){
var _2d8=this;
var _2d9=[MngtOIDs.GATEWAY_ID_OID+"."+_274,MngtOIDs.GATEWAY_UPTIME_OID+"."+_274,MngtOIDs.GATEWAY_START_TIME_OID+"."+_274,MngtOIDs.GATEWAY_INSTANCE_KEY_OID+"."+_274,MngtOIDs.GATEWAY_SUMMARY_DATA_OID+"."+_274,MngtOIDs.GATEWAY_CLUSTER_MEMBERS_OID+"."+_274,MngtOIDs.GATEWAY_BALANCER_MAP_OID+"."+_274,MngtOIDs.GATEWAY_MNGT_SERVICE_MAP_OID+"."+_274,MngtOIDs.GATEWAY_CLUSTER_CONN_SOFT_LIMIT_OID+"."+_274,MngtOIDs.GATEWAY_CLUSTER_CONN_HARD_LIMIT_OID+"."+_274];
var fn=function(){
_2d8._snmp.makeGetRequest(function(_2db){
_2d8.getGateway2(_2db,_2d6,_2d7);
},encodeOIDList(_2d9));
};
var t=invokeLater(fn,0);
return t;
};
_273.getGateway2=function(_2dd,_2de,_2df){
var _2e0=this;
if((_2dd!==null)&&(_2dd.values!==undefined)){
var _2e1={};
this.setGatewayAttribute(_2e1,"readTime",(new Date()).getTime());
var _2e2=_2dd.values;
for(var oid in _2e2){
if(oid!==undefined){
var _2e4=oid;
var _2e5=_2e4.lastIndexOf(".");
_2e4=_2e4.substring(0,_2e5);
this.setGatewayAttribute(_2e1,_2e4,_2e2[oid]);
}
}
this.parseJSONField(_2e1,"summaryData",false);
this.parseJSONField(_2e1,"mngtServiceMap",false);
this.parseJSONField(_2e1,"clusterMembers",false);
this.parseJSONField(_2e1,"balancerMap",false);
this.fixBalancerMap(_2e1);
this.setGatewayAttribute(_2e1,MngtOIDs.GATEWAY_INDEX_OID,_274);
_2de(_2e1,_2df);
}
};
_273.fixBalancerMap=function(obj){
var _2e7=obj.balancerMap;
if(_2e7){
for(var _2e8 in _2e7){
if(_2e7.hasOwnProperty(_2e8)){
var _2e9=_2e7[_2e8];
if(_2e9){
_2e9.sort();
for(var i=_2e9.length-1;i>=1;i--){
if(_2e9[i]===_2e9[i-1]){
_2e9.splice(i,1);
}
}
}
}
}
}
};
_273.getServices=function(_2eb){
var _2ec=this;
var fn=function(){
_2ec._snmp.makeGetSubtreeRequest(function(_2ee){
_2ec.getServices2(_2ee,_2eb);
},[encodeOID(MngtOIDs.SERVICE_INDEX_OID+"."+_274),encodeOID(MngtOIDs.SERVICE_SUMMARY_DATA_OID+"."+_274)]);
};
var t=invokeLater(fn,0);
return t;
};
_273.getServices2=function(_2f0,_2f1){
var _2f2=this;
var _2f3=(new Date()).getTime();
var _2f4={};
var _2f5=_2f0.values;
var i;
var _2f7=MngtOIDs.SERVICE_ENTRY_OID;
var _2f8=_2f7.length;
var _2f9=MngtOIDs.SERVICE_INDEX_OID;
for(var oid in _2f5){
var val=_2f5[oid];
var _2fc=oid;
var _2fd=_2fc.lastIndexOf(".");
var _2fe=parseInt(_2fc.substring(_2fd+1),10);
_2fc=_2fc.substring(0,_2fd);
_2fd=_2fc.lastIndexOf(".");
var _2ff=_2fc.substring(0,_2fd);
var _300=_2f4[_2fe];
if(_300===undefined){
_300={};
_2f2.setServiceAttribute(_300,MngtOIDs.GATEWAY_INDEX_OID,_274);
_2f2.setServiceAttribute(_300,MngtOIDs.SERVICE_INDEX_OID,_2fe);
_2f2.setServiceAttribute(_300,"readTime",_2f3);
_2f4[_2fe]=_300;
}
_2f2.setServiceAttribute(_300,_2ff,val);
}
var _301=[];
for(var s in _2f4){
_300=_2f4[s];
_2f2.parseJSONField(_300,"summaryData",false);
_301.push(_300);
}
_301.sort(function(s1,s2){
return s1["serviceId"]-s2["serviceId"];
});
_2f1(_301);
};
_273.getService=function(_305,_306){
var _307=this;
var _308=function(_309){
if((_309!==null)&&(_309.values!==undefined)){
var _30a={};
_307.setServiceAttribute(_30a,"readTime",(new Date()).getTime());
_307.setServiceAttribute(_30a,MngtOIDs.GATEWAY_INDEX_OID,_274);
var _30b=_309.values;
for(var oid in _30b){
if(oid!==undefined){
var val=_30b[oid];
var _30e=oid.substring(0,oid.lastIndexOf("."));
_30e=columnOid.substring(0,_30e.lastIndexOf("."));
_307.setServiceAttribute(_30a,_30e,val);
}
}
_306(_30a);
}
};
var _30f=_307.SERVICE_OIDS;
var _310=_30f.length;
var _311=[];
for(var i=0;i<_310;i++){
_311.push(_30f[i]+"."+_274+"."+_305);
}
var fn=function(){
_307._snmp.makeGetRequest(_308,encodeOIDList(_311));
};
var t=invokeLater(fn,0);
return t;
};
_273.setServiceNotifications=function(_315,_316,_317){
var _318=this;
var fn=function(){
_318._snmp.makeSetRequest(_317,encodeOID(MngtOIDs.SERVICE_ENABLE_NOTIFS_OID+"."+_274+"."+_315),2,_316);
};
var t=invokeLater(fn,0);
return t;
};
_273.getGatewaySessions=function(_31b){
var _31c=this;
var fn=function(){
_31c._snmp.makeGetSubtreeRequest(function(_31e){
_31c.getGatewaySessions2(_31e,_31b);
},[encodeOID(MngtOIDs.SESSION_INDEX_OID+"."+_274),encodeOID(MngtOIDs.SESSION_ID_OID+"."+_274),encodeOID(MngtOIDs.SESSION_SESSION_OPEN_OID+"."+_274),encodeOID(MngtOIDs.SESSION_ENABLE_NOTIFS_OID+"."+_274),encodeOID(MngtOIDs.SESSION_START_TIME_OID+"."+_274),encodeOID(MngtOIDs.SESSION_REMOTE_ADDRESS_OID+"."+_274),encodeOID(MngtOIDs.SESSION_PRINCIPALS_OID+"."+_274),encodeOID(MngtOIDs.SESSION_SESSION_TYPE_NAME_OID+"."+_274),encodeOID(MngtOIDs.SESSION_SESSION_DIRECTION_OID+"."+_274),encodeOID(MngtOIDs.SESSION_SUMMARY_DATA_OID+"."+_274)]);
};
var t=invokeLater(fn,0);
return t;
};
_273.getGatewaySessions2=function(_320,_321){
var _322=this;
var _323=(new Date()).getTime();
var _324={};
var _325=[];
var _326=_320.values;
var _327=_326[MngtOIDs.SESSION_INDEX_OID+"."+_274];
if(_327!==null){
var i;
for(var oid in _326){
var val=_326[oid];
var _32b=oid.lastIndexOf(".");
var _32c=parseInt(oid.substring(_32b+1),10);
oid=oid.substring(0,_32b);
_32b=oid.lastIndexOf(".");
var _32d=parseInt(oid.substring(_32b+1),10);
oid=oid.substring(0,_32b);
_32b=oid.lastIndexOf(".");
var _32e=oid.substring(0,_32b);
var _32f=_324[_32c];
if(_32f===undefined){
_32f={};
_322.setSessionAttribute(_32f,MngtOIDs.GATEWAY_INDEX_OID,_274);
_322.setSessionAttribute(_32f,MngtOIDs.SERVICE_INDEX_OID,_32d);
_322.setSessionAttribute(_32f,MngtOIDs.SESSION_INDEX_OID,_32c);
_322.setSessionAttribute(_32f,"readTime",_323);
_324[_32c]=_32f;
}
_322.setSessionAttribute(_32f,_32e,val);
}
for(var s in _324){
_32f=_324[s];
_322.parseJSONField(_32f,"summaryData",false);
_325.push(_32f);
}
_325.sort(function(s1,s2){
if(s1["serviceId"]!==s2["serviceId"]){
return s1["serviceId"]-s2["serviceId"];
}else{
return s1["sessionId"]-s2["sessionId"];
}
});
}
_321(_325);
};
_273.getSessions=function(_333,_334){
var _335=this;
var fn=function(){
_335._snmp.makeGetSubtreeRequest(function(_337){
_335.getSessions2(_337,_333,_334);
},[encodeOID(MngtOIDs.SESSION_INDEX_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_ID_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_SESSION_OPEN_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_ENABLE_NOTIFS_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_START_TIME_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_REMOTE_ADDRESS_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_PRINCIPALS_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_SESSION_TYPE_NAME_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_SESSION_DIRECTION_OID+"."+_274+"."+_333),encodeOID(MngtOIDs.SESSION_SUMMARY_DATA_OID+"."+_274+"."+_333)]);
};
var t=invokeLater(fn,0);
return t;
};
_273.getSessions2=function(_339,_33a,_33b){
var _33c=this;
var _33d=(new Date()).getTime();
var _33e={};
var _33f=[];
var _340=_339.values;
var _341=_340[MngtOIDs.SESSION_INDEX_OID+"."+_274+"."+_33a];
if(_341!==null){
var i;
for(var oid in _340){
var val=_340[oid];
var _345=oid.lastIndexOf(".");
var _346=parseInt(oid.substring(_345+1),10);
oid=oid.substring(0,_345);
_345=oid.lastIndexOf(".");
oid=oid.substring(0,_345);
_345=oid.lastIndexOf(".");
var _347=oid.substring(0,_345);
var _348=_33e[_346];
if(_348===undefined){
_348={};
_33c.setSessionAttribute(_348,MngtOIDs.GATEWAY_INDEX_OID,_274);
_33c.setSessionAttribute(_348,MngtOIDs.SERVICE_INDEX_OID,_33a);
_33c.setSessionAttribute(_348,MngtOIDs.SESSION_INDEX_OID,_346);
_33c.setSessionAttribute(_348,"readTime",_33d);
_33e[_346]=_348;
}
_33c.setSessionAttribute(_348,_347,val);
}
for(var s in _33e){
_348=_33e[s];
_33c.parseJSONField(_348,"summaryData",true);
_33f.push(_348);
}
_33f.sort(function(s1,s2){
return s1["sessionId"]-s2["sessionId"];
});
}
_33b(_33f);
};
_273.getSession=function(_34c,_34d,_34e){
var _34f=this;
var _350=function(_351){
if((_351!==null)&&(_351.values!==undefined)){
var _352={};
_34f.setSessionAttribute(_352,MngtOIDs.GATEWAY_INDEX_OID,_274);
_34f.setSessionAttribute(_352,MngtOIDs.SERVICE_INDEX_OID,_34c);
_34f.setSessionAttribute(_352,MngtOIDs.SESSION_INDEX_OID,_34d);
_34f.setSessionAttribute(_352,"readTime",(new Date()).getTime());
var _353=_351.values;
for(var oid in _353){
if(oid!==undefined){
var val=_353[oid];
var _356=oid.lastIndexOf(".");
_356=oid.lastIndexOf(".",_356-1);
_356=oid.lastIndexOf(".",_356-1);
var _357=oid.substring(0,_356);
_34f.setSessionAttribute(_352,_357,val);
}
}
_34e(_352);
}
};
var _358=_34f.SESSION_OIDS;
var _359=_358.length;
var _35a=[];
for(var i=0;i<_359;i++){
_35a.push(_358[i]+"."+_274+"."+_34c+"."+_34d);
}
var fn=function(){
_34f._snmp.makeGetRequest(_350,encodeOIDList(_35a));
};
var t=invokeLater(fn,0);
return t;
};
_273.closeSession=function(_35e,_35f,_360){
var _361=this;
var fn=function(){
_361._snmp.makeSetRequest(_360,encodeOID(MngtOIDs.SESSION_SESSION_OPEN_OID+"."+_274+"."+_35e+"."+_35f),2,0);
};
var t=invokeLater(fn,0);
return t;
};
_273.getSystemStats=function(_364){
var _365=this;
var oids=[encodeOID(MngtOIDs.SYSTEM_OS_NAME_OID),encodeOID(MngtOIDs.SYSTEM_SUMMARY_DATA_OID)];
var fn=function(){
_365._snmp.makeGetRequest(function(_368){
_365.getSystemStats2(_368,_364);
},oids);
};
var t=invokeLater(fn,0);
return t;
};
_273.getSystemStats2=function(_36a,_36b){
var _36c=this;
var _36d=(new Date()).getTime();
if((_36a!==null)&&(_36a.values!==undefined)){
var _36e=_36a.values;
var _36f={};
_36f.gatewayId=_274;
for(var oid in _36e){
var val=_36e[oid];
_36c.setSystemAttribute(_36f,oid,val);
}
_36c.setSystemAttribute(_36f,"readTime",_36d);
_36c.parseJSONField(_36f,"summaryData",false);
_36b(_36f);
}
};
_273.getCpuListStats=function(_372){
var _373=this;
var oids=[encodeOID(MngtOIDs.CPU_LIST_NUM_CPUS_OID),encodeOID(MngtOIDs.CPU_LIST_SUMMARY_DATA_OID)];
var fn=function(){
_373._snmp.makeGetRequest(function(_376){
_373.getCpuListStats2(_376,_372);
},oids);
};
var t=invokeLater(fn,0);
return t;
};
_273.getCpuListStats2=function(_378,_379){
var _37a=this;
var _37b=(new Date()).getTime();
if((_378!==null)&&(_378.values!==undefined)){
var _37c=_378.values;
var _37d={};
_37d.gatewayId=_274;
for(var oid in _37c){
var val=_37c[oid];
_37a.setCpuListAttribute(_37d,oid,val);
}
_37a.setCpuListAttribute(_37d,"readTime",_37b);
_37a.parseJSONField(_37d,"summaryData",false);
_379(_37d);
}
};
_273.getNicListStats=function(_380){
var _381=this;
var oids=[encodeOID(MngtOIDs.NIC_LIST_NET_INTERFACE_NAMES_OID),encodeOID(MngtOIDs.NIC_LIST_SUMMARY_DATA_OID)];
var fn=function(){
_381._snmp.makeGetRequest(function(_384){
_381.getNicListStats2(_384,_380);
},oids);
};
var t=invokeLater(fn,0);
return t;
};
_273.getNicListStats2=function(_386,_387){
var _388=this;
var _389=(new Date()).getTime();
if((_386!==null)&&(_386.values!==undefined)){
var _38a=_386.values;
var _38b={};
_38b.gatewayId=_274;
for(var oid in _38a){
var val=_38a[oid];
_388.setNicListAttribute(_38b,oid,val);
}
_388.setNicListAttribute(_38b,"readTime",_389);
_388.parseJSONField(_38b,"netInterfaceNames",false);
_388.parseJSONField(_38b,"summaryData",false);
_387(_38b);
}
};
_273.startNotifications=function(_38e){
var _38f=this;
this._snmp.startNotifListener(function(_390){
_38f.notificationCallback(_390,_38e);
});
};
_273.notificationCallback=function(_391,_392){
var _393=_391.values;
var _394=_393[MngtOIDs.NOTIFICATION_TYPE_OID];
var _395={};
_395.readTime=(new Date()).getTime();
if(_394===MngtOIDs.GATEWAY_MEMBERSHIP_NOTIF_OID){
this.processMembershipNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.GATEWAY_MNGT_SVC_NOTIF_OID){
this.processManagementServiceNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.GATEWAY_BALANCER_MAP_NOTIF_OID){
this.processBalancerMapNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.GATEWAY_SUMMARY_DATA_NOTIF_OID){
this.processSummaryNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.SERVICE_SUMMARY_DATA_NOTIF_OID){
this.processSummaryNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.SESSION_SUMMARY_DATA_NOTIF_OID){
this.processSummaryNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.SYSTEM_SUMMARY_DATA_NOTIF_OID){
this.processSummaryNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.CPU_LIST_SUMMARY_DATA_NOTIF_OID){
this.processSummaryNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.NIC_LIST_SUMMARY_DATA_NOTIF_OID){
this.processSummaryNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.JVM_SUMMARY_DATA_NOTIF_OID){
this.processSummaryNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.SERVICE_SESSION_OPEN_NOTIF_OID){
this.processSessionOpenNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.SERVICE_SESSION_CLOSE_NOTIF_OID){
this.processSessionCloseNotification(_394,_393,_395);
}else{
if(_394===MngtOIDs.GATEWAY_CONN_LIMIT_CHANGE_NOTIF_OID){
this.processConnLimitChangeNotification(_394,_393,_395);
}else{
CC.console.error("### Ignoring notification event:"+"\n   Unknown notification type OID ["+_394+"]"+"\n   Notification data = ["+_391.toString()+"]");
return;
}
}
}
}
}
}
}
}
}
}
}
}
}
_392(_395);
};
_273.processMembershipNotification=function(_396,_397,_398){
_398.type=CC.Constants.NotificationType.MEMBERSHIP_CHANGE;
_398.eventType=_397[MngtOIDs.GATEWAY_MEMBERSHIP_EVENT_TYPE_OID];
var oid=this.findFullKey(_397,MngtOIDs.GATEWAY_INSTANCE_KEY_OID);
_398.instanceKey=_397[oid];
};
_273.processManagementServiceNotification=function(_39a,_39b,_39c){
_39c.type=CC.Constants.NotificationType.MANAGEMENT_SERVICE_CHANGE;
_39c.eventType=_39b[MngtOIDs.GATEWAY_MNGT_SVC_EVENT_TYPE_OID];
_39c.accepts=_39b[MngtOIDs.GATEWAY_MNGT_SVC_EVENT_ACCEPT_URIS_OID];
if(_39c.accepts){
_39c.accepts=_39c.accepts.split("\n");
}else{
_39c.accepts=null;
}
var oid=this.findFullKey(_39b,MngtOIDs.GATEWAY_INSTANCE_KEY_OID);
_39c.instanceKey=_39b[oid];
};
_273.processBalancerMapNotification=function(_39e,_39f,_3a0){
_3a0.type=CC.Constants.NotificationType.BALANCER_MAP_CHANGE;
_3a0.eventType=_39f[MngtOIDs.GATEWAY_BALANCER_MAP_EVENT_TYPE_OID];
_3a0.balancerURI=_39f[MngtOIDs.GATEWAY_BALANCER_MAP_EVENT_BALANCER_URI_OID];
_3a0.balanceeURIs=_39f[MngtOIDs.GATEWAY_BALANCER_MAP_EVENT_BALANCEE_URIS_OID];
};
_273.processConnLimitChangeNotification=function(_3a1,_3a2,_3a3){
_3a3.type=CC.Constants.NotificationType.CONNECTION_LIMIT_CHANGE;
var oid=this.findFullKey(_3a2,MngtOIDs.GATEWAY_CLUSTER_CONN_SOFT_LIMIT_OID);
if(oid){
_3a3.eventType=0;
}else{
oid=this.findFullKey(_3a2,MngtOIDs.GATEWAY_CLUSTER_CONN_HARD_LIMIT_OID);
_3a3.eventType=1;
}
_3a3.value=_3a2[oid];
};
_273.processSummaryNotification=function(_3a5,_3a6,_3a7){
var oid,_3a9,_3aa;
var _3ab,_3ac;
if(_3a5===MngtOIDs.GATEWAY_SUMMARY_DATA_NOTIF_OID){
_3a7.type=CC.Constants.NotificationType.GATEWAY_SUMMARY;
oid=this.findFullKey(_3a6,MngtOIDs.GATEWAY_SUMMARY_DATA_OID);
_3a9=oid.substring(MngtOIDs.GATEWAY_SUMMARY_DATA_OID.length+1);
}else{
if(_3a5===MngtOIDs.SERVICE_SUMMARY_DATA_NOTIF_OID){
_3a7.type=CC.Constants.NotificationType.SERVICE_SUMMARY;
oid=this.findFullKey(_3a6,MngtOIDs.SERVICE_SUMMARY_DATA_OID);
_3a9=oid.substring(MngtOIDs.SERVICE_SUMMARY_DATA_OID.length+1);
}else{
if(_3a5===MngtOIDs.SESSION_SUMMARY_DATA_NOTIF_OID){
_3a7.type=CC.Constants.NotificationType.SESSION_SUMMARY;
oid=this.findFullKey(_3a6,MngtOIDs.SESSION_SUMMARY_DATA_OID);
_3a9=oid.substring(MngtOIDs.SESSION_SUMMARY_DATA_OID.length+1);
}else{
if(_3a5===MngtOIDs.SYSTEM_SUMMARY_DATA_NOTIF_OID){
_3a7.type=CC.Constants.NotificationType.SYSTEM_SUMMARY;
oid=this.findFullKey(_3a6,MngtOIDs.SYSTEM_SUMMARY_DATA_OID);
_3a9=oid.substring(MngtOIDs.SYSTEM_SUMMARY_DATA_OID.length+1);
}else{
if(_3a5===MngtOIDs.CPU_LIST_SUMMARY_DATA_NOTIF_OID){
_3a7.type=CC.Constants.NotificationType.CPU_LIST_SUMMARY;
oid=this.findFullKey(_3a6,MngtOIDs.CPU_LIST_SUMMARY_DATA_OID);
_3a9=oid.substring(MngtOIDs.CPU_LIST_SUMMARY_DATA_OID.length+1);
}else{
if(_3a5===MngtOIDs.NIC_LIST_SUMMARY_DATA_NOTIF_OID){
_3a7.type=CC.Constants.NotificationType.NIC_LIST_SUMMARY;
oid=this.findFullKey(_3a6,MngtOIDs.NIC_LIST_SUMMARY_DATA_OID);
_3a9=oid.substring(MngtOIDs.NIC_LIST_SUMMARY_DATA_OID.length+1);
}else{
if(_3a5===MngtOIDs.JVM_SUMMARY_DATA_NOTIF_OID){
_3a7.type=CC.Constants.NotificationType.JVM_SUMMARY;
oid=this.findFullKey(_3a6,MngtOIDs.JVM_SUMMARY_DATA_OID);
_3a9=oid.substring(MngtOIDs.JVM_SUMMARY_DATA_OID.length+1);
}
}
}
}
}
}
}
_3aa=_3a9.split(".");
if(_3aa.length>1){
_3ab=parseInt(_3aa[1],10);
}
if(_3aa.length>2){
_3ac=parseInt(_3aa[2],10);
}
_3a7.gatewayId=_274;
_3a7.serviceId=_3ab;
_3a7.sessionId=_3ac;
_3a7.value=parseJSON(_3a6[oid]);
};
_273.processSessionOpenNotification=function(_3ad,_3ae,_3af){
var _3b0=this;
_3af.type=CC.Constants.NotificationType.SESSION_OPEN;
var _3b1=_3ae[MngtOIDs.SERVICE_SESSION_OPEN_NOTIF_OID];
var _3b2=parseJSON(_3b1);
for(var fld in _3b2){
if(_3b2.hasOwnProperty(fld)){
_3af[fld]=_3b2[fld];
}
}
if(_3af.hasOwnProperty("createTime")){
_3af.startTime=_3af.createTime;
delete _3af.createTime;
}
_3af.serviceId=parseInt(_3af.serviceId,10);
_3af.sessionId=parseInt(_3af.sessionId,10);
var oid=this.findFullKey(_3ae,MngtOIDs.SERVICE_CURR_SESSION_CT_OID);
_3af.currSessionCount=_3ae[oid];
oid=this.findFullKey(_3ae,MngtOIDs.SERVICE_TOTAL_SESSION_CT_OID);
_3af.totalSessionCount=_3ae[oid];
};
_273.processSessionCloseNotification=function(_3b5,_3b6,_3b7){
_3b7.type=CC.Constants.NotificationType.SESSION_CLOSE;
var oid=this.findFullKey(_3b6,MngtOIDs.SERVICE_CURR_SESSION_CT_OID);
_3b7.currSessionCount=_3b6[oid];
oid=this.findFullKey(_3b6,MngtOIDs.SESSION_SESSION_OPEN_OID);
_3b7.sessionOpen=_3b6[oid];
var _3b9=oid.lastIndexOf(".");
_3b7.sessionId=parseInt(oid.substring(_3b9+1),10);
var _3ba=oid.lastIndexOf(".",_3b9-1);
_3b7.serviceId=parseInt(oid.substring(_3ba+1,_3b9),10);
};
_273.findFullKey=function(_3bb,_3bc){
var len=_3bc.length;
for(var key in _3bb){
if(key.startsWith(_3bc)&&key.charAt(len)=="."){
return key;
}
}
return null;
};
_273.hasKey=function(_3bf,key){
return _3bf.hasOwnProperty(key);
};
_273.getJVMStats=function(_3c1){
var _3c2=this;
var oids=[encodeOID(MngtOIDs.JVM_SUMMARY_DATA_OID)];
var fn=function(){
_3c2._snmp.makeGetRequest(function(_3c5){
_3c2.getJVMStats2(_3c5,_3c1);
},oids);
};
var t=invokeLater(fn,0);
return t;
};
_273.getJVMStats2=function(_3c7,_3c8){
var _3c9=this;
var _3ca=(new Date()).getTime();
if((_3c7!==null)&&(_3c7.values!==undefined)){
var _3cb=_3c7.values;
var _3cc={};
_3cc.gatewayId=_274;
for(var oid in _3cb){
var val=_3cb[oid];
_3c9.setJVMAttribute(_3cc,oid,val);
}
_3c9.setJVMAttribute(_3cc,"readTime",_3ca);
_3c9.parseJSONField(_3cc,"summaryData",false);
_3c8(_3cc);
}
};
_273.getSummaryDataDefinitions=function(_3cf){
var _3d0=this;
var oids=[encodeOID(MngtOIDs.GATEWAY_SUMMARY_DATA_FIELDS_OID),encodeOID(MngtOIDs.GATEWAY_SUMMARY_DATA_INTERVAL_OID),encodeOID(MngtOIDs.SERVICE_SUMMARY_DATA_FIELDS_OID),encodeOID(MngtOIDs.SERVICE_SUMMARY_DATA_INTERVAL_OID),encodeOID(MngtOIDs.SESSION_SUMMARY_DATA_FIELDS_OID),encodeOID(MngtOIDs.SESSION_SUMMARY_DATA_INTERVAL_OID),encodeOID(MngtOIDs.SYSTEM_SUMMARY_DATA_FIELDS_OID),encodeOID(MngtOIDs.SYSTEM_SUMMARY_DATA_INTERVAL_OID),encodeOID(MngtOIDs.SYSTEM_SUMMARY_DATA_GATHER_INTERVAL_OID),encodeOID(MngtOIDs.CPU_LIST_SUMMARY_DATA_FIELDS_OID),encodeOID(MngtOIDs.CPU_LIST_SUMMARY_DATA_INTERVAL_OID),encodeOID(MngtOIDs.CPU_LIST_SUMMARY_DATA_GATHER_INTERVAL_OID),encodeOID(MngtOIDs.NIC_LIST_SUMMARY_DATA_FIELDS_OID),encodeOID(MngtOIDs.NIC_LIST_SUMMARY_DATA_INTERVAL_OID),encodeOID(MngtOIDs.NIC_LIST_SUMMARY_DATA_GATHER_INTERVAL_OID),encodeOID(MngtOIDs.JVM_SUMMARY_DATA_FIELDS_OID),encodeOID(MngtOIDs.JVM_SUMMARY_DATA_INTERVAL_OID),encodeOID(MngtOIDs.JVM_SUMMARY_DATA_GATHER_INTERVAL_OID)];
var fn=function(){
_3d0._snmp.makeGetRequest(function(_3d3){
_3d0.getSummaryDataDefinitions2(_3d3,_3cf);
},oids);
};
var t=invokeLater(fn,0);
return t;
};
_273.getSummaryDataDefinitions2=function(_3d5,_3d6){
var _3d7=this;
var _3d8=(new Date()).getTime();
if((_3d5!==null)&&(_3d5.values!==undefined)){
var _3d9=_3d5.values;
var _3da={};
_3da.gatewayId=_274;
_3da.gateway={fields:null,notificationInterval:null,gatherInterval:null};
_3da.service={fields:null,notificationInterval:null,gatherInterval:null};
_3da.session={fields:null,notificationInterval:null,gatherInterval:null};
_3da.system={fields:null,notificationInterval:null,gatherInterval:null};
_3da.cpuList={fields:null,notificationInterval:null,gatherInterval:null};
_3da.nicList={fields:null,notificationInterval:null,gatherInterval:null};
_3da.jvm={fields:null,notificationInterval:null,gatherInterval:null};
for(var oid in _3d9){
var val=_3d9[oid];
if(val){
val=JSON.parse(val);
}
if(oid==MngtOIDs.GATEWAY_SUMMARY_DATA_FIELDS_OID){
val.push("readTime");
_3da.gateway.fields=val;
}else{
if(oid==MngtOIDs.GATEWAY_SUMMARY_DATA_INTERVAL_OID){
_3da.gateway.notificationInterval=val;
}else{
if(oid==MngtOIDs.SERVICE_SUMMARY_DATA_FIELDS_OID){
val.push("readTime");
_3da.service.fields=val;
}else{
if(oid==MngtOIDs.SERVICE_SUMMARY_DATA_INTERVAL_OID){
_3da.service.notificationInterval=val;
}else{
if(oid==MngtOIDs.SESSION_SUMMARY_DATA_FIELDS_OID){
val.push("readTime");
_3da.session.fields=val;
}else{
if(oid==MngtOIDs.SESSION_SUMMARY_DATA_INTERVAL_OID){
_3da.session.notificationInterval=val;
}else{
if(oid==MngtOIDs.SYSTEM_SUMMARY_DATA_FIELDS_OID){
val.push("readTime");
_3da.system.fields=val;
}else{
if(oid==MngtOIDs.SYSTEM_SUMMARY_DATA_INTERVAL_OID){
_3da.system.notificationInterval=val;
}else{
if(oid==MngtOIDs.SYSTEM_SUMMARY_DATA_GATHER_INTERVAL_OID){
_3da.system.gatherInterval=val;
}else{
if(oid==MngtOIDs.CPU_LIST_SUMMARY_DATA_FIELDS_OID){
val.push("readTime");
_3da.cpuList.fields=val;
}else{
if(oid==MngtOIDs.CPU_LIST_SUMMARY_DATA_INTERVAL_OID){
_3da.cpuList.notificationInterval=val;
}else{
if(oid==MngtOIDs.CPU_LIST_SUMMARY_DATA_GATHER_INTERVAL_OID){
_3da.cpuList.gatherInterval=val;
}else{
if(oid==MngtOIDs.NIC_LIST_SUMMARY_DATA_FIELDS_OID){
val.push("readTime");
_3da.nicList.fields=val;
}else{
if(oid==MngtOIDs.NIC_LIST_SUMMARY_DATA_INTERVAL_OID){
_3da.nicList.notificationInterval=val;
}else{
if(oid==MngtOIDs.NIC_LIST_SUMMARY_DATA_GATHER_INTERVAL_OID){
_3da.nicList.gatherInterval=val;
}else{
if(oid==MngtOIDs.JVM_SUMMARY_DATA_FIELDS_OID){
val.push("readTime");
_3da.jvm.fields=val;
}else{
if(oid==MngtOIDs.JVM_SUMMARY_DATA_INTERVAL_OID){
_3da.jvm.notificationInterval=val;
}else{
if(oid==MngtOIDs.JVM_SUMMARY_DATA_GATHER_INTERVAL_OID){
_3da.jvm.gatherInterval=val;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
_3da.readTime=_3d8;
_3d6(_3da);
}
};
_273.parseJSONField=function(obj,_3de,_3df){
var _3e0=obj[_3de];
delete obj[_3de];
if(_3e0&&_3e0.length>0){
_3e0=parseJSON(_3e0);
if(_3df){
if(_3e0){
for(var fld in _3e0){
if(_3e0.hasOwnProperty(fld)){
obj[fld]=_3e0[fld];
}
}
}
}else{
obj[_3de]=_3e0;
}
}
};
_273.setProperty=function(_3e2,oid,_3e4,_3e5){
this._snmp.makeSetRequest(_3e2,oid,_3e4,_3e5);
};
_273.ping=function(_3e6){
var _3e7=this;
var fn=function(){
_3e7._snmp.makeGetRequest(_3e6,encodeOID(MngtOIDs.GATEWAY_INDEX_OID+"."+_274));
};
var t=invokeLater(fn,0);
return t;
};
})();
"use strict";
function start(_3ea){
document.getElementById("offscreenData").style.visibility="visible";
var _3eb="/commandcenter";
setupYUIPatches();
YUI({filter:"min",base:_3eb+"/yui/",combine:false,useBrowserConsole:true,debug:false,lang:"en-US",groups:{gallery:{combine:false,base:_3eb+"/yui-gallery/",patterns:{"gallery-":{},"lang/gallery-":{},"gallerycss-":{type:"css"}}},},modules:{},onFailure:function(err){
alert("There was an error. Failed to load the "+PRODUCT_NAME+" application:\n"+err.msg);
}}).use("app","node","selector-css3","intl","transition","dt-refresh-row-patch","datatable","datatable-sort","datatable-scroll","panel","tabview","scrollview","stylesheet","gallery-widget-inherit-css","gallery-datatable-selection","dd","dd-drag","dd-plugin","gallery-contextmenu-view","event","event-custom","event-outside","router","widget","cluster-realm-config-view","cluster-service-config-view","command-center","config-gateways-view","config-licenses-view","config-overview-view","config-security-keystore-view","config-security-realms-view","config-security-truststore-view","config-service-defaults-view","config-services-view","cpu-all-perc-chart","cpu-avg-perc-chart","current-sessions-chart","dashboard-chart","dashboard-view","gateway-config-view","gateway-realm-config-view","gateway-service-config-view","jvm-heap-chart","kaazing-view","list-model","login-processor","monitor-gateways-view","monitor-services-view","monitor-sessions-view","nic-read-thpt-combined-chart","nic-read-thpt-indiv-chart","nic-rw-thpt-combined-chart","nic-write-thpt-combined-chart","nic-write-thpt-indiv-chart",function(Y){
continueStart(Y,_3ea);
});
};
function continueStart(Y,_3ef){
Y.Base.mix(Y.DataTable,[Y.DataTable.RefreshRowPatch]);
window.Y=Y;
Y.Node.ATTRS.outerHeight={getter:function(){
var _3f0=this.get("offsetHeight");
return _3f0+parseFloat(this.getComputedStyle("marginTop"))+parseFloat(this.getComputedStyle("marginBottom"));
}};
Y.Node.ATTRS.outerWidth={getter:function(){
var _3f1=this.get("offsetWidth");
return _3f1+parseFloat(this.getComputedStyle("marginLeft"))+parseFloat(this.getComputedStyle("marginRight"));
}};
new Y.CommandCenter({challengeHandlerCreatorFn:_3ef,viewContainer:"#viewContainer",transitions:false,views:{dashboardView:{type:"DashboardView",preserve:true},configOverviewView:{type:"ConfigOverviewView",preserve:true},configServicesView:{type:"ConfigServicesView",preserve:true},configServiceDefaultsView:{type:"ConfigServiceDefaultsView",preserve:true},configLicensesView:{type:"ConfigLicensesView",preserve:true},configSecurityRealmsView:{type:"ConfigSecurityRealmsView",preserve:true},configSecurityKeystoreView:{type:"ConfigSecurityKeystoreView",preserve:true},configSecurityTruststoreView:{type:"ConfigSecurityTruststoreView",preserve:true},monitorGatewaysView:{type:"MonitorGatewaysView",preserve:true},monitorServicesView:{type:"MonitorServicesView",preserve:true},monitorSessionsView:{type:"MonitorSessionsView",preserve:true}},serverRouting:false});
};
"use strict";
function CommandCenterChallengeHandler(_3f2,_3f3){
this.connectionUrl=_3f3;
this.loginPanel=_3f2;
this.username=null;
this.password=null;
this.challengeCallback=null;
this.challengeCredentials=null;
this.loginState=null;
this.connected=false;
};
(function(){
var _3f4=1;
var _3f5=2;
var _3f6=3;
var _3f7=4;
var _3f8=CommandCenterChallengeHandler.prototype;
_3f8.defaultChallengeCredentials=null;
_3f8.canHandle=function(_3f9){
return (_3f9!=null&&_3f9.authenticationScheme==="Basic"&&_3f9.location.endsWith("/snmp"));
};
_3f8.handle=function(_3fa,_3fb){
if(_3fa.location===null){
_3fb(null);
return;
}
this.challengeCallback=_3fb;
var _3fc=false;
if(this.loginState===null){
if(this.challengeCredentials||this.defaultChallengeCredentials){
if(this.connected){
this.loginState=_3f5;
}else{
this.loginState=_3f4;
}
this.challengeCallback(this.makeChallengeResponse());
return;
}
}else{
if(this.loginState===_3f5){
this.challengeCallback(this.makeChallengeResponse());
return;
}else{
if(this.loginState===_3f4){
this.challengeCredentials=null;
}else{
if(this.loginState===_3f7){
this.challengeCallback(null);
return;
}else{
_3fc=true;
}
}
}
}
this.loginState=_3f6;
this.gatherCredentialsFn(_3fc);
};
_3f8.gatherCredentialsFn=function(_3fd){
var _3fe=this;
this.loginPanel.display(this.connectionUrl,false,_3fd,this.username,this.password,function(_3ff,_400,_401,_402){
_3fe.gatherCredentialsCallback(_3ff,_400,_401,_402);
});
};
_3f8.gatherCredentialsCallback=function(_403,_404,_405,_406){
if(_406||_404==null){
this.loginState=_3f7;
this.challengeCredentials=null;
this.username=null;
this.password=null;
this.challengeCallback(null);
return;
}
this.username=_404;
this.password=_405;
this.challengeCredentials=this.encodeCredentials(_404,_405);
this.challengeCallback(this.makeChallengeResponse());
};
_3f8.onOpen=function(_407){
if(!CommandCenterChallengeHandler.prototype.defaultChallengeCredentials){
CommandCenterChallengeHandler.prototype.defaultChallengeCredentials=this.challengeCredentials;
}
this.loginState=null;
this.username=null;
this.password=null;
this.connected=true;
};
_3f8.encodeCredentials=function(_408,_409){
var str=_408+":"+_409;
var _40b=[];
for(var i=0;i<str.length;++i){
_40b.push(str.charCodeAt(i));
}
return Base64.encode(_40b);
};
_3f8.makeChallengeResponse=function(){
var _40d=(this.challengeCredentials||this.defaultChallengeCredentials);
return new ChallengeResponse("Basic "+_40d,null);
};
_3f8.onClose=function(_40e){
this.connected=false;
};
_3f8.isCancelled=function(){
return (this.loginState===4);
};
})();
function Filter(){
};
(function(){
var _40f=Filter.prototype;
_40f.findFilters=function(_410){
return null;
};
_40f.match=function(obj){
return true;
};
_40f.toString=function(){
return "";
};
})();
function AndFilter(){
this.subFilters=[];
};
(function(){
AndFilter.prototype=new Filter();
var _412=AndFilter.prototype;
_412.findFilters=function(_413){
var _414=[];
for(var i=0;i<this.subFilters.length;i++){
var _416=this.subFilters[i];
if(_416.attribute===_413){
_414.push(_416);
}
}
return (_414.length>0?_414:null);
};
_412.addFilter=function(_417){
this.subFilters.push(_417);
};
_412.addFilters=function(_418){
if(_418){
this.subFilters=this.subFilters.concat(_418);
}
};
_412.deleteFilter=function(_419){
var _41a=this.subFilters;
var _41b=_41a.indexOf(_419);
if(_41b>=0){
_41a.splice(_41b,1);
}
};
_412.insertFilter=function(_41c,_41d){
var _41e=this.subFilters;
_41e.splice(_41d,0,_41c);
};
_412.getSubFilters=function(){
return this.subFilters;
};
_412.match=function(obj){
var _420=this.subFilters;
for(var i=0;i<_420.length;i++){
var _422=_420[i];
if(!_422.match(obj)){
return false;
}
}
return true;
};
_412.toString=function(){
var _423=this.subFilters;
var _424="";
for(var i=0;i<_423.length;i++){
var _426=_423[i];
if(i>0){
_424=_424+" and ";
}
_424=_424+"("+_426.toString()+")";
}
return _424;
};
})();
function OrFilter(){
this.subFilters=[];
};
(function(){
OrFilter.prototype=new Filter();
var _427=OrFilter.prototype;
_427.findFilters=function(_428){
var _429=[];
for(var i=0;i<this.subFilters.length;i++){
var _42b=this.subFilters[i];
if(_42b.attribute===_428){
_429.push(_42b);
}
}
return (_429.length>0?_429:null);
};
_427.addFilter=function(_42c){
this.subFilters.push(_42c);
};
_427.addFilters=function(_42d){
if(_42d){
this.subFilters=this.subFilters.concat(_42d);
}
};
_427.deleteFilter=function(_42e){
var _42f=this.subFilters;
var _430=_42f.indexOf(_42e);
if(_430>=0){
_42f.splice(_430,1);
}
};
_427.insertFilter=function(_431,_432){
var _433=this.subFilters;
_433.splice(_432,0,_431);
};
_427.getSubFilters=function(){
return this.subFilters;
};
_427.match=function(obj){
var _435=this.subFilters;
for(var i=0;i<_435.length;i++){
var _437=_435[i];
if(_437.match(obj)){
return true;
}
}
return false;
};
_427.toString=function(){
var _438=this.subFilters;
var _439="";
for(var i=0;i<_438.length;i++){
var _43b=_438[i];
if(i>0){
_439=_439+" or ";
}
_439=_439+"("+_43b.toString()+")";
}
return _439;
};
})();
function NumericFilter(_43c,_43d,_43e){
this.attribute=_43c;
this.operator=_43d;
this.value=_43e;
};
(function(){
NumericFilter.prototype=new Filter();
var _43f=NumericFilter.prototype;
_43f.match=function(obj){
var _441=obj.get(this.attribute);
switch(this.operator){
case "LT":
return (_441<this.value);
case "LEQ":
return (_441<=this.value);
case "EQ":
return (_441===this.value);
case "NEQ":
return (_441!=this.value);
case "GEQ":
return (_441>=this.value);
case "GT":
return (_441>this.value);
case "SET":
return (_441!==undefined&&_441!==null);
case "UNSET":
return (_441===undefined||_441===null);
default:
return false;
}
};
_43f.toString=function(){
var _442=this.attribute+" "+this.operToString();
if(this.operator!=="SET"&&this.operator!=="UNSET"){
_442=_442+" "+this.value;
}
return _442;
};
_43f.operToString=function(){
switch(this.operator){
case "LT":
return "<";
case "LEQ":
return "<=";
case "EQ":
return "==";
case "NEQ":
return "!=";
case "GEQ":
return ">=";
case "GT":
return ">";
case "SET":
return "is set";
case "UNSET":
return "is not set";
default:
return "";
}
};
})();
function AlphaFilter(_443,_444,_445){
this.attribute=_443;
this.operator=_444;
this.value=_445;
};
(function(){
AlphaFilter.prototype=new Filter();
var _446=AlphaFilter.prototype;
_446.match=function(obj){
var _448=obj.get(this.attribute);
if(_448){
_448=_448.toString();
}else{
_448="";
}
switch(this.operator){
case "LT":
return (_448<this.value);
case "LEQ":
return (_448<=this.value);
case "EQ":
return (_448===this.value);
case "NEQ":
return (_448!=this.value);
case "GEQ":
return (_448>=this.value);
case "GT":
return (_448>this.value);
case "CONTAIN":
return (_448.indexOf(this.value,0)>=0);
case "NOT_CONTAIN":
return (_448.indexOf(this.value,0)<0);
case "START":
return (_448.startsWith(this.value));
case "END":
return (_448.endsWith(this.value));
case "SET":
return (_448!==undefined&&_448!==null);
case "UNSET":
return (_448===undefined||_448===null);
default:
return false;
}
};
_446.toString=function(){
var _449=this.attribute+" "+this.operToString();
if(this.operator!=="SET"&&this.operator!=="UNSET"){
_449=_449+" '"+this.value+"'";
}
return _449;
};
_446.operToString=function(){
switch(this.operator){
case "LT":
return "<";
case "LEQ":
return "<=";
case "EQ":
return "==";
case "NEQ":
return "!=";
case "GEQ":
return ">=";
case "GT":
return ">";
case "CONTAIN":
return "contains";
case "NOT_CONTAIN":
return "does not contain";
case "START":
return "starts with";
case "END":
return "ends with";
case "SET":
return "is set";
case "UNSET":
return "is not set";
default:
return "";
}
};
})();
function ValueFilter(_44a,_44b,_44c){
this.attribute=_44a;
this.operator=_44b;
this.value=_44c;
};
(function(){
ValueFilter.prototype=new Filter();
var _44d=ValueFilter.prototype;
_44d.match=function(obj){
var _44f=obj.get(this.attribute);
switch(this.operator){
case "EQ":
return (_44f===this.value);
case "NEQ":
return (_44f!=this.value);
case "SET":
return (_44f!==undefined&&_44f!==null);
case "UNSET":
return (_44f===undefined||_44f===null);
default:
return false;
}
};
_44d.toString=function(){
var _450=this.attribute+" "+this.operToString();
if(this.operator!=="SET"&&this.operator!=="UNSET"){
_450=_450+" '"+this.value+"'";
}
return _450;
};
_44d.operToString=function(){
switch(this.operator){
case "EQ":
return "==";
case "NEQ":
return "!=";
case "SET":
return "is set";
case "UNSET":
return "is not set";
default:
return "";
}
};
})();
"use strict";
var menuTimeout=500;
var menuCloseTimer=0;
var menuOpenSubmenu=0;
function mopen(_451){
mcancelclosetime();
if(menuOpenSubmenu){
menuOpenSubmenu.style.visibility="hidden";
}
menuOpenSubmenu=_451;
menuOpenSubmenu.style.visibility="visible";
};
function mclose(){
if(menuOpenSubmenu){
menuOpenSubmenu.style.visibility="hidden";
}
};
function mclosetime(){
menuCloseTimer=window.setTimeout(function(){
mclose();
},menuTimeout);
};
function mcancelclosetime(){
if(menuCloseTimer){
window.clearTimeout(menuCloseTimer);
menuCloseTimer=null;
}
};
function foo(){
return false;
};
function MenuItem(_452,_453){
this.parent=null;
this.label=_452;
this.children=null;
this.icon=null;
this.clickFn=(_453?_453:null);
this.submenu=null;
this.link=null;
};
(function(){
var _454=MenuItem.prototype;
_454.addItem=function(_455,_456){
var _457=new MenuItem(_455,_456);
_457.parent=this;
if(this.children){
this.children.push(_457);
}else{
this.children=[_457];
}
return _457;
};
_454.isRoot=function(){
return (this.parent===null);
};
_454.isLeaf=function(){
return (this.children===null);
};
_454.renderMenu=function(_458){
this.renderItem(_458,0);
};
_454.renderItem=function(_459,_45a){
var _45b=this;
var link;
var li;
var ul;
if(!this.isRoot()){
li=document.createElement("li");
_459.appendChild(li);
_459=li;
link=document.createElement("a");
_459.appendChild(link);
link.appendChild(document.createTextNode(this.label));
link.href="#";
if(!this.isLeaf()){
if(!touchSupported()){
link.onmouseover=function(ev){
mopen(_45b.submenu);
};
link.onmouseout=function(ev){
mclosetime();
};
}else{
link.onclick=function(ev){
mopen(_45b.submenu);
ev.stopPropagation();
ev.preventDefault();
};
}
}else{
if(_45b.clickFn){
link.onclick=function(ev){
mclose(_45b.parent);
_45b.clickFn(ev);
ev.stopPropagation();
ev.preventDefault();
};
}
return;
}
if(_45b.isLeaf()){
return;
}
}
this.submenu=document.createElement("ul");
_459.appendChild(this.submenu);
if(this.isRoot()){
this.submenu.id="mainmenu";
this.label="Root menu";
}else{
this.submenu.onmouseover=function(ev){
mcancelclosetime();
};
this.submenu.onmouseout=function(ev){
mclosetime();
};
}
for(var i=0;i<this.children.length;i++){
this.children[i].renderItem(this.submenu,_45a+1);
}
};
document.onclick=function(){
mclose();
};
})();
function defineMenu(Y,app){
var menu=new MenuItem();
var _469=menu.addItem("dashboard",function(ev){
app.save("/dashboard");
});
var _46b=menu.addItem("configuration");
_46b.addItem("overview",function(ev){
app.save("/config/overview");
});
_46b.addItem("services",function(ev){
app.save("/config/services");
});
_46b.addItem("security - realms",function(ev){
app.save("/config/security/realms");
});
_46b.addItem("security - keystores",function(ev){
app.save("/config/security/keystore");
});
_46b.addItem("security - truststores",function(ev){
app.save("/config/security/truststore");
});
_46b.addItem("service defaults",function(ev){
app.save("/config/service_defaults");
});
_46b.addItem("licenses",function(ev){
app.save("/config/licenses");
});
var _473=menu.addItem("monitoring");
_473.addItem("gateways",function(ev){
app.save("/monitor/gateways");
});
_473.addItem("services",function(ev){
app.save("/monitor/services");
});
_473.addItem("sessions",function(ev){
app.save("/monitor/sessions");
});
var _477=menu.addItem("about",function(ev){
app.handleAbout();
});
if(window.TEST_ENABLED){
var _479=menu.addItem("test");
_479.addItem("Browser Information",function(ev){
var _47b=checkBrowserVersion();
alert("browser.userAgent = ["+navigator.userAgent+"]"+"\nbrowser.platform = ["+navigator.platform+"]"+"\nbrowser.vendor = ["+navigator.vendor+"]"+"\nbrowserInfo.OS = "+_47b.OS+"\nbrowser = "+_47b.browser+"\nbrowser version = "+_47b.version);
});
}
return menu;
};
YUI.add("command-center",function(Y){
"use strict";
var Lang=Y.Lang,NAME="commandCenter";
Y.CommandCenter=Y.Base.create(NAME,Y.App,[Y.EventTarget],{resources:null,clusterModel:null,loginPanel:null,menu:null,chartMetadata:{},DEFAULT_CHART_LIST:["cpuAvgPercChart","currentSessionsChart","jvmHeapChart","nicRWThptCombinedChart"],monitorFilterPanel:null,aboutPanel:null,initializer:function(){
var _47f=this;
var fn=function(ev){
var w=Y.one("window");
var _483=w.get("winHeight");
var _484=w.get("docHeight");
if(_484<_483){
Y.one("body").setStyle("height",_483+"px");
}
};
fn();
Y.one("window").on("resize",fn);
window.onbeforeunload=function(ev){
_47f.handleBeforeUnload(ev);
},this.loginPanel=new Y.LoginPanel();
this.monitorFilterPanel=new Y.MonitorFilterPanel();
this.aboutPanel=new Y.AboutPanel({app:_47f});
this.menu=defineMenu(Y,_47f);
this.menu.renderMenu(Y.one("#mainMenuWrapper").getDOMNode());
this.setupRoutes();
var _486=this.get("challengeHandlerCreatorFn");
var _487=new Y.LoginProcessor({loginPanel:this.loginPanel,app:this});
this.clusterModel=new Y.ClusterModel({loginProcessor:_487});
this.clusterModel.addTarget(_47f);
window.document.title=CC.PRODUCT_NAME;
this.doBranding();
Y.one("#headerLogo").on("click",function(ev){
_47f.handleVisitCompany();
},this);
Y.one("#logoutLink").on("click",function(ev){
_47f.handleLogout();
},this);
if(this._setupCallback){
this._setupCallback();
delete this._setupCallback;
}
this.on("activeViewChange",this.activeViewChange,this);
this.on("*:versionInfoChange",this.versionInfoChange,this);
var _48a=window.location.hash;
if(!_48a||_48a==="#"){
this.save("/dashboard");
}else{
if(_48a.startsWith("#")){
_48a=_48a.substring(1);
}
var _48b=_47f.match(_48a);
if(_48b.length>0){
_47f.dispatch();
}else{
_47f.save("/");
}
}
this.setupStandardCharts();
var _48c=window.location.host+"/snmp";
if(window.location.protocol=="https:"){
_48c="wss://"+_48c;
}else{
_48c="ws://"+_48c;
}
this.clusterModel.start(_48c);
},doBranding:function(){
Y.one("#headerLogoImage").setAttribute("src",CC.HEADER_LOGO_IMAGE_URL);
Y.one("#footerLogoImage").setAttribute("src",CC.FOOTER_LOGO_IMAGE_URL);
Y.one("#loginLogoImage").setAttribute("src",CC.LOGIN_LOGO_IMAGE_URL);
Y.one("#aboutLogoImage").setAttribute("src",CC.ABOUT_LOGO_IMAGE_URL);
Y.all(".copyrightNotice span").setHTML(CC.COPYRIGHT_NOTICE);
},versionInfoChange:function(ev){
var _48e=Y.one(".productTitle");
var _48f=computeDisplayVersionInfo(ev.newVal);
if(_48f){
_48e.set("text",_48f[0]+" "+_48f[1]);
}else{
_48e.set("text","");
}
},setupRoutes:function(){
var _490=this;
_490.route("/","handleDashboardView");
_490.route("/dashboard","handleDashboardView");
_490.route("/config/overview","handleConfigOverview");
_490.route("/config/licenses","handleConfigLicenses");
_490.route("/config/service_defaults","handleConfigServiceDefaults");
_490.route("/config/services","handleConfigServices");
_490.route("/config/security/realms","handleConfigSecurityRealms");
_490.route("/config/security/keystore","handleConfigSecurityKeystore");
_490.route("/config/security/truststore","handleConfigSecurityTruststore");
_490.route("/monitor/gateways","handleMonitorGateways");
_490.route("/monitor/services","handleMonitorServices");
_490.route("/monitor/sessions","handleMonitorSessions");
},handleDashboardView:function(_491,_492,next){
this.startShowView("dashboardView",{model:this.clusterModel,toolbar:this.getToolBar(),app:this},null);
},handleConfigOverview:function(_494,_495,next){
this.startShowView("configOverviewView",{model:this.clusterModel,toolbar:this.getToolBar(),app:this},null);
},handleConfigLicenses:function(_497,_498,next){
this.startShowView("configLicensesView",{model:this.clusterModel,toolbar:this.getToolBar(),app:this},null);
},handleConfigServiceDefaults:function(_49a,_49b,next){
this.startShowView("configServiceDefaultsView",{model:this.clusterModel,toolbar:this.getToolBar(),app:this},null);
},handleConfigServices:function(_49d,_49e,next){
var _4a0=_49d.query;
var _4a1=(_4a0&&_4a0.connectionUrl);
var _4a2=(_4a0&&_4a0.serviceId);
var _4a3=null;
if(!isEmpty(_4a1)&&isNumeric(_4a2)){
_4a2=parseInt(_4a2);
var _4a4=this.findGatewayModelByConnectionUrl(_4a1);
if(_4a4){
_4a3=_4a4.get("gatewayConfig").getServiceConfig(_4a2);
}
}
var _4a5={model:this.clusterModel,toolbar:this.getToolBar(),app:this};
if(_4a3!==null){
_4a5.selectedServiceConfig=_4a3;
}
this.startShowView("configServicesView",_4a5,{update:true,render:true});
},handleConfigSecurityRealms:function(_4a6,_4a7,next){
var _4a9=_4a6.query;
var _4aa=(_4a9&&_4a9.connectionUrl);
var _4ab=(_4a9&&_4a9.realm);
var _4ac=null;
if(!isEmpty(_4aa)&&_4ab&&_4ab.length>0){
var _4ad=this.findGatewayModelByConnectionUrl(_4aa);
if(_4ad){
_4ac=_4ad.get("gatewayConfig").getRealmConfig(_4ab);
}
}
var _4ae={model:this.clusterModel,toolbar:this.getToolBar(),app:this};
if(_4ac!==null){
_4ae.selectedRealmConfig=_4ac;
}
this.startShowView("configSecurityRealmsView",_4ae,{update:true,render:true});
},handleConfigSecurityKeystore:function(_4af,_4b0,next){
this.startShowView("configSecurityKeystoreView",{model:this.clusterModel,toolbar:this.getToolBar(),app:this},null);
},handleConfigSecurityTruststore:function(_4b2,_4b3,next){
this.startShowView("configSecurityTruststoreView",{model:this.clusterModel,toolbar:this.getToolBar(),app:this},null);
},handleMonitorGateways:function(_4b5,_4b6,next){
this.startShowView("monitorGatewaysView",{model:this.clusterModel,toolbar:this.getToolBar(),filterPanel:this.monitorFilterPanel,app:this},null);
},handleMonitorServices:function(_4b8,_4b9,next){
this.startShowView("monitorServicesView",{model:this.clusterModel,toolbar:this.getToolBar(),filterPanel:this.monitorFilterPanel,app:this},null);
},handleMonitorSessions:function(_4bb,_4bc,next){
this.startShowView("monitorSessionsView",{model:this.clusterModel,toolbar:this.getToolBar(),filterPanel:this.monitorFilterPanel,app:this},null);
},handleAbout:function(_4be,_4bf,next){
var _4c1=this;
invokeLater(function(){
var _4c2=_4c1.aboutPanel;
_4c2.display();
});
},handleVisitCompany:function(){
window.open(CC.COMPANY_WEBSITE_URL);
},handleLogout:function(){
if(confirm("Are you sure you want to log out of the "+CC.PRODUCT_NAME+"?")){
if(this.clusterModel){
this.clusterModel.logout();
window.location=window.location.protocol+"//"+window.location.host+window.location.pathname;
}
}
},handleBeforeUnload:function(ev){
if(this.clusterModel){
this.clusterModel.logout();
}
},hasLoggedIn:function(){
return this.clusterModel.get("loggedIn");
},isCluster:function(){
return this.clusterModel.get("isCluster");
},activeViewChange:function(ev){
CC.console.debug("##### ACTIVE VIEW CHANGE!");
CC.console.debug("PREV VAL: "+(ev.prevVal?ev.prevVal.name:"null"));
CC.console.debug("NEW VAL: "+(ev.newVal?ev.newVal.name:"null"));
},isActiveView:function(view){
return this.get("activeView")===view;
},findGatewayModelByConnectionUrl:function(_4c6){
var _4c7=this.clusterModel.getSortedGateways();
if(!_4c7){
return null;
}
for(var i=0;i<_4c7.length;i++){
var _4c9=_4c7[i];
if(_4c9.get("connectionUrl")==_4c6){
return _4c9;
}
}
return null;
},startShowView:function(view,_4cb,_4cc){
var _4cd=this.get("activeView");
if(_4cd&&_4cd.hideViewCallback){
_4cd.hideViewCallback();
}
this.showView(view,_4cb,_4cc,this.showViewCallback);
},showViewCallback:function(view){
var _4cf=view.get("title");
Y.one("#viewTitle").setHTML("<span>"+(_4cf?_4cf:"")+"</span>");
removeAllChildren("#viewToolBar");
Y.one("#viewContainer").set("scrollTop",0);
if(view.showViewCallback){
view.showViewCallback();
}
},setViewTitle:function(_4d0){
var _4d1=Y.one("#viewTitle");
_4d1.setHTML(_4d0);
},getToolBar:function(){
return Y.one("#viewToolBar");
},putChart:function(_4d2,_4d3,_4d4){
this.chartMetadata[_4d2]=[_4d3,_4d4];
},getChart:function(_4d5){
var _4d6=this.chartMetadata[_4d5];
return (_4d6?_4d6:null);
},getCharts:function(){
return this.chartMetadata;
},setupStandardCharts:function(){
this.putChart("currentSessionsChart","Current Sessions",Y.CurrentSessionsChart);
this.putChart("cpuAllPercChart","CPU % (all CPUs/cores)",Y.CpuAllPercChart);
this.putChart("cpuAvgPercChart","CPU % (average)",Y.CpuAvgPercChart);
this.putChart("jvmHeapChart","JVM Heap",Y.JvmHeapChart);
this.putChart("nicReadThptCombinedChart","Read Throughput Combined",Y.NicReadThptCombinedChart);
this.putChart("nicReadThptIndivChart","Read Throughput/Interface Card",Y.NicReadThptIndivChart);
this.putChart("nicRWThptCombinedChart","Total Read/Write Throughput",Y.NicRWThptCombinedChart);
this.putChart("nicWriteThptCombinedChart","Write Throughput Combined",Y.NicWriteThptCombinedChart);
this.putChart("nicWriteThptIndivChart","Write Throughput/Interface Card",Y.NicWriteThptIndivChart);
}},{ATTRS:{challengeHandlerCreatorFn:{value:null},root:{value:""},html5:{value:false}}});
},"0.99",{requires:["app","login-panel","monitor-filter-panel","about-panel","map-model","cluster-model"],skinnable:false});
YUI.add("login-processor",function(Y){
"use strict";
var Lang=Y.Lang,NAME="loginProcessor";
Y.LoginProcessor=Y.Base.create(NAME,Y.Model,[],{initializer:function(){
},requestLoginLock:function(_4da,_4db,_4dc){
var _4dd=this;
var _4de=this.get("loginLock");
if(_4de){
if(_4de.gatewayModel!==_4da){
var _4df=this.get("loginLockQueue");
for(var i=0;i<_4df.length;i++){
if(_4df[i].gatewayModel===_4da){
return;
}
}
_4df.push({gatewayModel:_4da,callback:_4db,canChangeUrl:_4dc});
}
}else{
this.set("loginLock",{gatewayModel:_4da,callback:_4db,canChangeUrl:_4dc});
invokeLater(function(){
_4dd.processLogin(false,null,null);
},0);
}
},hasLoginLock:function(_4e1){
var _4e2=this.get("loginLock");
return (_4e2!==null&&_4e2.gatewayModel===_4e1);
},clearLoginLock:function(_4e3){
var _4e4=this.get("loginLockQueue");
if(this.hasLoginLock(_4e3)){
if(_4e4.length==0){
this.set("loginLock",null);
}else{
var _4e5=_4e4.shift();
this.set("loginLock",_4e5);
invokeLater(function(){
$this.processLogin(false,null,null);
},0);
}
}else{
for(var i=0;i<_4e4.length;i++){
if(_4e4[i].gatewayModel===_4e3){
_4e4.splice(index,1);
}
}
}
},clearAllLoginLockRequests:function(){
this.set("loginLockQueue",[]);
this.set("loginLock",null);
},processLogin:function(_4e7,_4e8,_4e9){
var _4ea=this;
var _4eb=this.get("loginLock");
var _4ec=_4eb.gatewayModel.get("connectionUrl");
this.get("loginPanel").display(_4ec,_4eb.canChangeUrl,_4e7,_4e8,_4e9,function(_4ed,_4ee,_4ef,_4f0){
_4ea.gatherCredentialsCallback(_4ed,_4ee,_4ef,_4f0);
});
},gatherCredentialsCallback:function(_4f1,_4f2,_4f3,_4f4){
var _4f5=this;
var _4f6=this.get("loginLock");
if(_4f4||isEmpty(!_4f2)||isEmpty(_4f1)){
invokeLater(function(){
_4f5.clearLoginLock(_4f6.gatewayModel);
},0);
return;
}
_4f6.callback(_4f1,_4f2,_4f3);
},},{ATTRS:{app:{value:null},loginPanel:{value:null},loginLock:{value:null},loginLockQueue:{value:[]}}});
},"0.99",{requires:["model","cluster-model","gateway-model"]});
