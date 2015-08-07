/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

var browser=null;
if(typeof (ActiveXObject)!="undefined"){
if(navigator.userAgent.indexOf("MSIE 10")!=-1){
browser="chrome";
}else{
browser="ie";
}
}else{
if(navigator.userAgent.indexOf("Trident/7")!=-1&&navigator.userAgent.indexOf("rv:11")!=-1){
browser="chrome";
}else{
if(Object.prototype.toString.call(window.opera)=="[object Opera]"){
browser="opera";
}else{
if(navigator.vendor.indexOf("Apple")!=-1){
browser="safari";
if(navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("iPhone")!=-1){
browser.ios=true;
}
}else{
if(navigator.vendor.indexOf("Google")!=-1){
if((navigator.userAgent.indexOf("Android")!=-1)&&(navigator.userAgent.indexOf("Chrome")==-1)){
browser="android";
}else{
browser="chrome";
}
}else{
if(navigator.product=="Gecko"&&window.find&&!navigator.savePreferences){
browser="firefox";
}else{
throw new Error("couldn't detect browser");
}
}
}
}
}
}
switch(browser){
case "ie":
(function(){
if(document.createEvent===undefined){
var _1=function(){
};
_1.prototype.initEvent=function(_2,_3,_4){
this.type=_2;
this.bubbles=_3;
this.cancelable=_4;
};
document.createEvent=function(_5){
if(_5!="Events"){
throw new Error("Unsupported event name: "+_5);
}
return new _1();
};
}
document._w_3_c_d_o_m_e_v_e_n_t_s_createElement=document.createElement;
document.createElement=function(_6){
var _7=this._w_3_c_d_o_m_e_v_e_n_t_s_createElement(_6);
if(_7.addEventListener===undefined){
var _8={};
_7.addEventListener=function(_9,_a,_b){
_7.attachEvent("on"+_9,_a);
return addEventListener(_8,_9,_a,_b);
};
_7.removeEventListener=function(_c,_d,_e){
return removeEventListener(_8,_c,_d,_e);
};
_7.dispatchEvent=function(_f){
return dispatchEvent(_8,_f);
};
}
return _7;
};
if(window.addEventListener===undefined){
var _10=document.createElement("div");
var _11=(typeof (postMessage)==="undefined");
window.addEventListener=function(_12,_13,_14){
if(_11&&_12=="message"){
_10.addEventListener(_12,_13,_14);
}else{
window.attachEvent("on"+_12,_13);
}
};
window.removeEventListener=function(_15,_16,_17){
if(_11&&_15=="message"){
_10.removeEventListener(_15,_16,_17);
}else{
window.detachEvent("on"+_15,_16);
}
};
window.dispatchEvent=function(_18){
if(_11&&_18.type=="message"){
_10.dispatchEvent(_18);
}else{
window.fireEvent("on"+_18.type,_18);
}
};
}
function addEventListener(_19,_1a,_1b,_1c){
if(_1c){
throw new Error("Not implemented");
}
var _1d=_19[_1a]||{};
_19[_1a]=_1d;
_1d[_1b]=_1b;
};
function removeEventListener(_1e,_1f,_20,_21){
if(_21){
throw new Error("Not implemented");
}
var _22=_1e[_1f]||{};
delete _22[_20];
};
function dispatchEvent(_23,_24){
var _25=_24.type;
var _26=_23[_25]||{};
for(var key in _26){
if(_26.hasOwnProperty(key)&&typeof (_26[key])=="function"){
try{
_26[key](_24);
}
catch(e){
}
}
}
};
})();
break;
case "chrome":
case "android":
case "safari":
if(typeof (window.postMessage)==="undefined"&&typeof (window.dispatchEvent)==="undefined"&&typeof (document.dispatchEvent)==="function"){
window.dispatchEvent=function(_28){
document.dispatchEvent(_28);
};
var addEventListener0=window.addEventListener;
window.addEventListener=function(_29,_2a,_2b){
if(_29==="message"){
document.addEventListener(_29,_2a,_2b);
}else{
addEventListener0.call(window,_29,_2a,_2b);
}
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_2c,_2d,_2e){
if(_2c==="message"){
document.removeEventListener(_2c,_2d,_2e);
}else{
removeEventListener0.call(window,_2c,_2d,_2e);
}
};
}
break;
case "opera":
var addEventListener0=window.addEventListener;
window.addEventListener=function(_2f,_30,_31){
var _32=_30;
if(_2f==="message"){
_32=function(_33){
if(_33.origin===undefined&&_33.uri!==undefined){
var uri=new URI(_33.uri);
delete uri.path;
delete uri.query;
delete uri.fragment;
_33.origin=uri.toString();
}
return _30(_33);
};
_30._$=_32;
}
addEventListener0.call(window,_2f,_32,_31);
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_35,_36,_37){
var _38=_36;
if(_35==="message"){
_38=_36._$;
}
removeEventListener0.call(window,_35,_38,_37);
};
break;
}
function URI(str){
str=str||"";
var _3a=0;
var _3b=str.indexOf("://");
if(_3b!=-1){
this.scheme=str.slice(0,_3b);
_3a=_3b+3;
var _3c=str.indexOf("/",_3a);
if(_3c==-1){
_3c=str.length;
str+="/";
}
var _3d=str.slice(_3a,_3c);
this.authority=_3d;
_3a=_3c;
this.host=_3d;
var _3e=_3d.indexOf(":");
if(_3e!=-1){
this.host=_3d.slice(0,_3e);
this.port=parseInt(_3d.slice(_3e+1),10);
if(isNaN(this.port)){
throw new Error("Invalid URI syntax");
}
}
}
var _3f=str.indexOf("?",_3a);
if(_3f!=-1){
this.path=str.slice(_3a,_3f);
_3a=_3f+1;
}
var _40=str.indexOf("#",_3a);
if(_40!=-1){
if(_3f!=-1){
this.query=str.slice(_3a,_40);
}else{
this.path=str.slice(_3a,_40);
}
_3a=_40+1;
this.fragment=str.slice(_3a);
}else{
if(_3f!=-1){
this.query=str.slice(_3a);
}else{
this.path=str.slice(_3a);
}
}
};
(function(){
var _41=URI.prototype;
_41.toString=function(){
var sb=[];
var _43=this.scheme;
if(_43!==undefined){
sb.push(_43);
sb.push("://");
sb.push(this.host);
var _44=this.port;
if(_44!==undefined){
sb.push(":");
sb.push(_44.toString());
}
}
if(this.path!==undefined){
sb.push(this.path);
}
if(this.query!==undefined){
sb.push("?");
sb.push(this.query);
}
if(this.fragment!==undefined){
sb.push("#");
sb.push(this.fragment);
}
return sb.join("");
};
var _45={"http":80,"ws":80,"https":443,"wss":443};
URI.replaceProtocol=function(_46,_47){
var _48=_46.indexOf("://");
if(_48>0){
return _47+_46.substr(_48);
}else{
return "";
}
};
})();
(function(){
Base64={};
Base64.encode=function(_49){
var _4a=[];
var _4b;
var _4c;
var _4d;
while(_49.length){
switch(_49.length){
case 1:
_4b=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)]);
_4a.push("=");
_4a.push("=");
break;
case 2:
_4b=_49.shift();
_4c=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)|((_4c>>4)&15)]);
_4a.push(_4e[(_4c<<2)&60]);
_4a.push("=");
break;
default:
_4b=_49.shift();
_4c=_49.shift();
_4d=_49.shift();
_4a.push(_4e[(_4b>>2)&63]);
_4a.push(_4e[((_4b<<4)&48)|((_4c>>4)&15)]);
_4a.push(_4e[((_4c<<2)&60)|((_4d>>6)&3)]);
_4a.push(_4e[_4d&63]);
break;
}
}
return _4a.join("");
};
Base64.decode=function(_4f){
if(_4f.length===0){
return [];
}
if(_4f.length%4!==0){
throw new Error("Invalid base64 string (must be quads)");
}
var _50=[];
for(var i=0;i<_4f.length;i+=4){
var _52=_4f.charAt(i);
var _53=_4f.charAt(i+1);
var _54=_4f.charAt(i+2);
var _55=_4f.charAt(i+3);
var _56=_57[_52];
var _58=_57[_53];
var _59=_57[_54];
var _5a=_57[_55];
_50.push(((_56<<2)&252)|((_58>>4)&3));
if(_54!="="){
_50.push(((_58<<4)&240)|((_59>>2)&15));
if(_55!="="){
_50.push(((_59<<6)&192)|(_5a&63));
}
}
}
return _50;
};
var _4e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
var _57={"=":0};
for(var i=0;i<_4e.length;i++){
_57[_4e[i]]=i;
}
if(typeof (window.btoa)==="undefined"){
window.btoa=function(s){
var _5d=s.split("");
for(var i=0;i<_5d.length;i++){
_5d[i]=(_5d[i]).charCodeAt();
}
return Base64.encode(_5d);
};
window.atob=function(_5f){
var _60=Base64.decode(_5f);
for(var i=0;i<_60.length;i++){
_60[i]=String.fromCharCode(_60[i]);
}
return _60.join("");
};
}
})();
var postMessage0=(function(){
var _62=new URI((browser=="ie")?document.URL:location.href);
var _63={"http":80,"https":443};
if(_62.port==null){
_62.port=_63[_62.scheme];
_62.authority=_62.host+":"+_62.port;
}
var _64=_62.scheme+"://"+_62.authority;
var _65="/.kr";
if(typeof (postMessage)!=="undefined"){
return function(_66,_67,_68){
if(typeof (_67)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_68==="null"){
_68="*";
}
switch(browser){
case "ie":
case "opera":
case "firefox":
setTimeout(function(){
_66.postMessage(_67,_68);
},0);
break;
default:
_66.postMessage(_67,_68);
break;
}
};
}else{
function MessagePipe(_69){
this.sourceToken=toPaddedHex(Math.floor(Math.random()*(Math.pow(2,32)-1)),8);
this.iframe=_69;
this.bridged=false;
this.lastWrite=0;
this.lastRead=0;
this.lastReadIndex=2;
this.lastSyn=0;
this.lastAck=0;
this.queue=[];
this.escapedFragments=[];
};
var _6a=MessagePipe.prototype;
_6a.attach=function(_6b,_6c,_6d,_6e,_6f,_70){
this.target=_6b;
this.targetOrigin=_6c;
this.targetToken=_6d;
this.reader=_6e;
this.writer=_6f;
this.writerURL=_70;
try{
this._lastHash=_6e.location.hash;
this.poll=pollLocationHash;
}
catch(permissionDenied){
this._lastDocumentURL=_6e.document.URL;
this.poll=pollDocumentURL;
}
if(_6b==parent){
dequeue(this,true);
}
};
_6a.detach=function(){
this.poll=function(){
};
delete this.target;
delete this.targetOrigin;
delete this.reader;
delete this.lastFragment;
delete this.writer;
delete this.writerURL;
};
_6a.poll=function(){
};
function pollLocationHash(){
var _71=this.reader.location.hash;
if(this._lastHash!=_71){
process(this,_71.substring(1));
this._lastHash=_71;
}
};
function pollDocumentURL(){
var _72=this.reader.document.URL;
if(this._lastDocumentURL!=_72){
var _73=_72.indexOf("#");
if(_73!=-1){
process(this,_72.substring(_73+1));
this._lastDocumentURL=_72;
}
}
};
_6a.post=function(_74,_75,_76){
bridgeIfNecessary(this,_74);
var _77=1000;
var _78=escape(_75);
var _79=[];
while(_78.length>_77){
var _7a=_78.substring(0,_77);
_78=_78.substring(_77);
_79.push(_7a);
}
_79.push(_78);
this.queue.push([_76,_79]);
if(this.writer!=null&&this.lastAck>=this.lastSyn){
dequeue(this,false);
}
};
function bridgeIfNecessary(_7b,_7c){
if(_7b.lastWrite<1&&!_7b.bridged){
if(_7c.parent==window){
var src=_7b.iframe.src;
var _7e=src.split("#");
var _7f=null;
var _80=document.getElementsByTagName("meta");
for(var i=0;i<_80.length;i++){
if(_80[i].name=="kaazing:resources"){
alert("kaazing:resources is no longer supported. Please refer to the Administrator's Guide section entitled \"Configuring a Web Server to Integrate with Kaazing Gateway\"");
}
}
var _82=_64;
var _83=_82.toString()+_65+"?.kr=xsp&.kv=10.05";
if(_7f){
var _84=new URI(_82.toString());
var _7e=_7f.split(":");
_84.host=_7e.shift();
if(_7e.length){
_84.port=_7e.shift();
}
_83=_84.toString()+_65+"?.kr=xsp&.kv=10.05";
}
for(var i=0;i<_80.length;i++){
if(_80[i].name=="kaazing:postMessageBridgeURL"){
var _85=_80[i].content;
var _86=new URI(_85);
var _87=new URI(location.toString());
if(!_86.authority){
_86.host=_87.host;
_86.port=_87.port;
_86.scheme=_87.scheme;
if(_85.indexOf("/")!=0){
var _88=_87.path.split("/");
_88.pop();
_88.push(_85);
_86.path=_88.join("/");
}
}
postMessage0.BridgeURL=_86.toString();
}
}
if(postMessage0.BridgeURL){
_83=postMessage0.BridgeURL;
}
var _89=["I",_82,_7b.sourceToken,escape(_83)];
if(_7e.length>1){
var _8a=_7e[1];
_89.push(escape(_8a));
}
_7e[1]=_89.join("!");
setTimeout(function(){
_7c.location.replace(_7e.join("#"));
},200);
_7b.bridged=true;
}
}
};
function flush(_8b,_8c){
var _8d=_8b.writerURL+"#"+_8c;
_8b.writer.location.replace(_8d);
};
function fromHex(_8e){
return parseInt(_8e,16);
};
function toPaddedHex(_8f,_90){
var hex=_8f.toString(16);
var _92=[];
_90-=hex.length;
while(_90-->0){
_92.push("0");
}
_92.push(hex);
return _92.join("");
};
function dequeue(_93,_94){
var _95=_93.queue;
var _96=_93.lastRead;
if((_95.length>0||_94)&&_93.lastSyn>_93.lastAck){
var _97=_93.lastFrames;
var _98=_93.lastReadIndex;
if(fromHex(_97[_98])!=_96){
_97[_98]=toPaddedHex(_96,8);
flush(_93,_97.join(""));
}
}else{
if(_95.length>0){
var _99=_95.shift();
var _9a=_99[0];
if(_9a=="*"||_9a==_93.targetOrigin){
_93.lastWrite++;
var _9b=_99[1];
var _9c=_9b.shift();
var _9d=3;
var _97=[_93.targetToken,toPaddedHex(_93.lastWrite,8),toPaddedHex(_96,8),"F",toPaddedHex(_9c.length,4),_9c];
var _98=2;
if(_9b.length>0){
_97[_9d]="f";
_93.queue.unshift(_99);
}
if(_93.resendAck){
var _9e=[_93.targetToken,toPaddedHex(_93.lastWrite-1,8),toPaddedHex(_96,8),"a"];
_97=_9e.concat(_97);
_98+=_9e.length;
}
flush(_93,_97.join(""));
_93.lastFrames=_97;
_93.lastReadIndex=_98;
_93.lastSyn=_93.lastWrite;
_93.resendAck=false;
}
}else{
if(_94){
_93.lastWrite++;
var _97=[_93.targetToken,toPaddedHex(_93.lastWrite,8),toPaddedHex(_96,8),"a"];
var _98=2;
if(_93.resendAck){
var _9e=[_93.targetToken,toPaddedHex(_93.lastWrite-1,8),toPaddedHex(_96,8),"a"];
_97=_9e.concat(_97);
_98+=_9e.length;
}
flush(_93,_97.join(""));
_93.lastFrames=_97;
_93.lastReadIndex=_98;
_93.resendAck=true;
}
}
}
};
function process(_9f,_a0){
var _a1=_a0.substring(0,8);
var _a2=fromHex(_a0.substring(8,16));
var _a3=fromHex(_a0.substring(16,24));
var _a4=_a0.charAt(24);
if(_a1!=_9f.sourceToken){
throw new Error("postMessage emulation tampering detected");
}
var _a5=_9f.lastRead;
var _a6=_a5+1;
if(_a2==_a6){
_9f.lastRead=_a6;
}
if(_a2==_a6||_a2==_a5){
_9f.lastAck=_a3;
}
if(_a2==_a6||(_a2==_a5&&_a4=="a")){
switch(_a4){
case "f":
var _a7=_a0.substr(29,fromHex(_a0.substring(25,29)));
_9f.escapedFragments.push(_a7);
dequeue(_9f,true);
break;
case "F":
var _a8=_a0.substr(29,fromHex(_a0.substring(25,29)));
if(_9f.escapedFragments!==undefined){
_9f.escapedFragments.push(_a8);
_a8=_9f.escapedFragments.join("");
_9f.escapedFragments=[];
}
var _a9=unescape(_a8);
dispatch(_a9,_9f.target,_9f.targetOrigin);
dequeue(_9f,true);
break;
case "a":
if(_a0.length>25){
process(_9f,_a0.substring(25));
}else{
dequeue(_9f,false);
}
break;
default:
throw new Error("unknown postMessage emulation payload type: "+_a4);
}
}
};
function dispatch(_aa,_ab,_ac){
var _ad=document.createEvent("Events");
_ad.initEvent("message",false,true);
_ad.data=_aa;
_ad.origin=_ac;
_ad.source=_ab;
dispatchEvent(_ad);
};
var _ae={};
var _af=[];
function pollReaders(){
for(var i=0,len=_af.length;i<len;i++){
var _b2=_af[i];
_b2.poll();
}
setTimeout(pollReaders,20);
};
function findMessagePipe(_b3){
if(_b3==parent){
return _ae["parent"];
}else{
if(_b3.parent==window){
var _b4=document.getElementsByTagName("iframe");
for(var i=0;i<_b4.length;i++){
var _b6=_b4[i];
if(_b3==_b6.contentWindow){
return supplyIFrameMessagePipe(_b6);
}
}
}else{
throw new Error("Generic peer postMessage not yet implemented");
}
}
};
function supplyIFrameMessagePipe(_b7){
var _b8=_b7._name;
if(_b8===undefined){
_b8="iframe$"+String(Math.random()).substring(2);
_b7._name=_b8;
}
var _b9=_ae[_b8];
if(_b9===undefined){
_b9=new MessagePipe(_b7);
_ae[_b8]=_b9;
}
return _b9;
};
function postMessage0(_ba,_bb,_bc){
if(typeof (_bb)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_ba==window){
if(_bc=="*"||_bc==_64){
dispatch(_bb,window,_64);
}
}else{
var _bd=findMessagePipe(_ba);
_bd.post(_ba,_bb,_bc);
}
};
postMessage0.attach=function(_be,_bf,_c0,_c1,_c2,_c3){
var _c4=findMessagePipe(_be);
_c4.attach(_be,_bf,_c0,_c1,_c2,_c3);
_af.push(_c4);
};
var _c5=function(_c6){
var _c7=new URI((browser=="ie")?document.URL:location.href);
var _c8;
var _c9={"http":80,"https":443};
if(_c7.port==null){
_c7.port=_c9[_c7.scheme];
_c7.authority=_c7.host+":"+_c7.port;
}
var _ca=unescape(_c7.fragment||"");
if(_ca.length>0){
var _cb=_ca.split(",");
var _cc=_cb.shift();
var _cd=_cb.shift();
var _ce=_cb.shift();
var _cf=_c7.scheme+"://"+document.domain+":"+_c7.port;
var _d0=_c7.scheme+"://"+_c7.authority;
var _d1=_cc+"/.kr?.kr=xsc&.kv=10.05";
var _d2=document.location.toString().split("#")[0];
var _d3=_d1+"#"+escape([_cf,_cd,escape(_d2)].join(","));
if(typeof (ActiveXObject)!="undefined"){
_c8=new ActiveXObject("htmlfile");
_c8.open();
try{
_c8.parentWindow.opener=window;
}
catch(domainError){
if(_c6){
_c8.domain=_c6;
}
_c8.parentWindow.opener=window;
}
_c8.write("<html>");
_c8.write("<body>");
if(_c6){
_c8.write("<script>CollectGarbage();document.domain='"+_c6+"';</"+"script>");
}
_c8.write("<iframe src=\""+_d1+"\"></iframe>");
_c8.write("</body>");
_c8.write("</html>");
_c8.close();
var _d4=_c8.body.lastChild;
var _d5=_c8.parentWindow;
var _d6=parent;
var _d7=_d6.parent.postMessage0;
if(typeof (_d7)!="undefined"){
_d4.onload=function(){
var _d8=_d4.contentWindow;
_d8.location.replace(_d3);
_d7.attach(_d6,_cc,_ce,_d5,_d8,_d1);
};
}
}else{
var _d4=document.createElement("iframe");
_d4.src=_d3;
document.body.appendChild(_d4);
var _d5=window;
var _d9=_d4.contentWindow;
var _d6=parent;
var _d7=_d6.parent.postMessage0;
if(typeof (_d7)!="undefined"){
_d7.attach(_d6,_cc,_ce,_d5,_d9,_d1);
}
}
}
window.onunload=function(){
try{
var _da=window.parent.parent.postMessage0;
if(typeof (_da)!="undefined"){
_da.detach(_d6);
}
}
catch(permissionDenied){
}
if(typeof (_c8)!=="undefined"){
_c8.parentWindow.opener=null;
_c8.open();
_c8.close();
_c8=null;
CollectGarbage();
}
};
};
postMessage0.__init__=function(_db,_dc){
var _dd=_c5.toString();
_db.URI=URI;
_db.browser=browser;
if(!_dc){
_dc="";
}
_db.setTimeout("("+_dd+")('"+_dc+"')",0);
};
postMessage0.bridgeURL=false;
postMessage0.detach=function(_de){
var _df=findMessagePipe(_de);
for(var i=0;i<_af.length;i++){
if(_af[i]==_df){
_af.splice(i,1);
}
}
_df.detach();
};
if(window!=top){
_ae["parent"]=new MessagePipe();
function initializeAsTargetIfNecessary(){
var _e1=new URI((browser=="ie")?document.URL:location.href);
var _e2=_e1.fragment||"";
if(document.body!=null&&_e2.length>0&&_e2.charAt(0)=="I"){
var _e3=unescape(_e2);
var _e4=_e3.split("!");
if(_e4.shift()=="I"){
var _e5=_e4.shift();
var _e6=_e4.shift();
var _e7=unescape(_e4.shift());
var _e8=_64;
if(_e5==_e8){
try{
parent.location.hash;
}
catch(permissionDenied){
document.domain=document.domain;
}
}
var _e9=_e4.shift()||"";
switch(browser){
case "firefox":
location.replace([location.href.split("#")[0],_e9].join("#"));
break;
default:
location.hash=_e9;
break;
}
var _ea=findMessagePipe(parent);
_ea.targetToken=_e6;
var _eb=_ea.sourceToken;
var _ec=_e7+"#"+escape([_e8,_e6,_eb].join(","));
var _ed;
_ed=document.createElement("iframe");
_ed.src=_ec;
_ed.style.position="absolute";
_ed.style.left="-10px";
_ed.style.top="10px";
_ed.style.visibility="hidden";
_ed.style.width="0px";
_ed.style.height="0px";
document.body.appendChild(_ed);
return;
}
}
setTimeout(initializeAsTargetIfNecessary,20);
};
initializeAsTargetIfNecessary();
}
var _ee=document.getElementsByTagName("meta");
for(var i=0;i<_ee.length;i++){
if(_ee[i].name==="kaazing:postMessage"){
if("immediate"==_ee[i].content){
var _f0=function(){
var _f1=document.getElementsByTagName("iframe");
for(var i=0;i<_f1.length;i++){
var _f3=_f1[i];
if(_f3.style["KaaPostMessage"]=="immediate"){
_f3.style["KaaPostMessage"]="none";
var _f4=supplyIFrameMessagePipe(_f3);
bridgeIfNecessary(_f4,_f3.contentWindow);
}
}
setTimeout(_f0,20);
};
setTimeout(_f0,20);
}
break;
}
}
for(var i=0;i<_ee.length;i++){
if(_ee[i].name==="kaazing:postMessagePrefix"){
var _f5=_ee[i].content;
if(_f5!=null&&_f5.length>0){
if(_f5.charAt(0)!="/"){
_f5="/"+_f5;
}
_65=_f5;
}
}
}
setTimeout(pollReaders,20);
return postMessage0;
}
})();
var XDRHttpDirect=(function(){
var id=0;
function XDRHttpDirect(_f7){
this.outer=_f7;
};
var _f8=XDRHttpDirect.prototype;
_f8.open=function(_f9,_fa){
var _fb=this;
var xhr=this.outer;
xhr.responseText="";
var _fd=2;
var _fe=0;
var _ff=0;
this._method=_f9;
this._location=_fa;
if(_fa.indexOf("?")==-1){
_fa+="?.kac=ex&.kct=application/x-message-http";
}else{
_fa+="&.kac=ex&.kct=application/x-message-http";
}
this.location=_fa;
var xdr=this.xdr=new XDomainRequest();
var _101=function(e){
try{
var _103=xdr.responseText;
if(_fd<=2){
var _104=_103.indexOf("\r\n\r\n");
if(_104==-1){
return;
}
var _105=_103.indexOf("\r\n");
var _106=_103.substring(0,_105);
var _107=_106.match(/HTTP\/1\.\d\s(\d+)\s([^\r\n]+)/);
xhr.status=parseInt(_107[1]);
xhr.statusText=_107[2];
var _108=_105+2;
_ff=_104+4;
var _109=_103.substring(_108,_104).split("\r\n");
xhr._responseHeaders={};
for(var i=0;i<_109.length;i++){
var _10b=_109[i].split(":");
xhr._responseHeaders[_10b[0].replace(/^\s+|\s+$/g,"")]=_10b[1].replace(/^\s+|\s+$/g,"");
}
_fe=_ff;
_fd=xhr.readyState=3;
if(typeof (_fb.onreadystatechange)=="function"){
_fb.onreadystatechange(xhr);
}
}
var _10c=xdr.responseText.length;
if(_10c>_fe){
xhr.responseText=_103.slice(_ff);
_fe=_10c;
if(typeof (_fb.onprogress)=="function"){
_fb.onprogress(xhr);
}
}else{
}
}
catch(e1){
_fb.onload(xhr);
}
};
xdr.onprogress=_101;
xdr.onerror=function(e){
xhr.readyState=0;
if(typeof (xhr.onerror)=="function"){
xhr.onerror(xhr);
}
};
xdr.onload=function(e){
if(_fd<=3){
_101(e);
}
reayState=xhr.readyState=4;
if(typeof (xhr.onreadystatechange)=="function"){
xhr.onreadystatechange(xhr);
}
if(typeof (xhr.onload)=="function"){
xhr.onload(xhr);
}
};
xdr.open("POST",_fa);
};
_f8.send=function(_10f){
var _110=this._method+" "+this.location.substring(this.location.indexOf("/",9),this.location.indexOf("&.kct"))+" HTTP/1.1\r\n";
for(var i=0;i<this.outer._requestHeaders.length;i++){
_110+=this.outer._requestHeaders[i][0]+": "+this.outer._requestHeaders[i][1]+"\r\n";
}
var _112=_10f||"";
if(_112.length>0||this._method.toUpperCase()==="POST"){
var len=0;
for(var i=0;i<_112.length;i++){
len++;
if(_112.charCodeAt(i)>=128){
len++;
}
}
_110+="Content-Length: "+len+"\r\n";
}
_110+="\r\n";
_110+=_112;
this.xdr.send(_110);
};
_f8.abort=function(){
this.xdr.abort();
};
return XDRHttpDirect;
})();
var XMLHttpBridge=(function(){
var _114=new URI((browser=="ie")?document.URL:location.href);
var _115={"http":80,"https":443};
if(_114.port==null){
_114.port=_115[_114.scheme];
_114.authority=_114.host+":"+_114.port;
}
var _116={};
var _117={};
var _118=0;
function XMLHttpBridge(_119){
this.outer=_119;
};
var _11a=XMLHttpBridge.prototype;
_11a.open=function(_11b,_11c){
var id=register(this);
var pipe=supplyPipe(this,_11c);
pipe.attach(id);
this._pipe=pipe;
this._method=_11b;
this._location=_11c;
this.outer.readyState=1;
this.outer.status=0;
this.outer.statusText="";
this.outer.responseText="";
var _11f=this;
setTimeout(function(){
_11f.outer.readyState=1;
onreadystatechange(_11f);
},0);
};
_11a.send=function(_120){
doSend(this,_120);
};
_11a.abort=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
};
function onreadystatechange(_122){
if(typeof (_122.onreadystatechange)!=="undefined"){
_122.onreadystatechange(_122.outer);
}
switch(_122.outer.readyState){
case 3:
if(typeof (_122.onprogress)!=="undefined"){
_122.onprogress(_122.outer);
}
break;
case 4:
if(_122.outer.status<100||_122.outer.status>=500){
if(typeof (_122.onerror)!=="undefined"){
_122.onerror(_122.outer);
}
}else{
if(typeof (_122.onprogress)!=="undefined"){
_122.onprogress(_122.outer);
}
if(typeof (_122.onload)!=="undefined"){
_122.onload(_122.outer);
}
}
break;
}
};
function fromHex(_123){
return parseInt(_123,16);
};
function toPaddedHex(_124,_125){
var hex=_124.toString(16);
var _127=[];
_125-=hex.length;
while(_125-->0){
_127.push("0");
}
_127.push(hex);
return _127.join("");
};
function register(_128){
var id=toPaddedHex(_118++,8);
_117[id]=_128;
_128._id=id;
return id;
};
function doSend(_12a,_12b){
if(typeof (_12b)!=="string"){
_12b="";
}
var _12c=_12a._method.substring(0,10);
var _12d=_12a._location;
var _12e=_12a.outer._requestHeaders;
var _12f=toPaddedHex(_12a.outer.timeout,4);
var _130=(_12a.outer.onprogress!==undefined)?"t":"f";
var _131=["s",_12a._id,_12c.length,_12c,toPaddedHex(_12d.length,4),_12d,toPaddedHex(_12e.length,4)];
for(var i=0;i<_12e.length;i++){
var _133=_12e[i];
_131.push(toPaddedHex(_133[0].length,4));
_131.push(_133[0]);
_131.push(toPaddedHex(_133[1].length,4));
_131.push(_133[1]);
}
_131.push(toPaddedHex(_12b.length,8),_12b,toPaddedHex(_12f,4),_130);
_12a._pipe.post(_131.join(""));
};
function supplyPipe(_134,_135){
var uri=new URI(_135);
var _137=(uri.scheme!=null&&uri.authority!=null);
var _138=_137?uri.scheme:_114.scheme;
var _139=_137?uri.authority:_114.authority;
if(_139!=null&&uri.port==null){
_139=uri.host+":"+_115[_138];
}
var _13a=_138+"://"+_139;
var pipe=_116[_13a];
if(pipe!==undefined){
if(!("iframe" in pipe&&"contentWindow" in pipe.iframe&&typeof pipe.iframe.contentWindow=="object")){
pipe=_116[_13a]=undefined;
}
}
if(pipe===undefined){
var _13c=document.createElement("iframe");
_13c.style.position="absolute";
_13c.style.left="-10px";
_13c.style.top="10px";
_13c.style.visibility="hidden";
_13c.style.width="0px";
_13c.style.height="0px";
var _13d=new URI(_13a);
_13d.query=".kr=xs";
_13d.path="/";
_13c.src=_13d.toString();
function post(_13e){
this.buffer.push(_13e);
};
function attach(id){
var _140=this.attached[id];
if(_140===undefined){
_140={};
this.attached[id]=_140;
}
if(_140.timerID!==undefined){
clearTimeout(_140.timerID);
delete _140.timerID;
}
};
function detach(id){
var _142=this.attached[id];
if(_142!==undefined&&_142.timerID===undefined){
var _143=this;
_142.timerID=setTimeout(function(){
delete _143.attached[id];
var xhr=_117[id];
if(xhr._pipe==pipe){
delete _117[id];
delete xhr._id;
delete xhr._pipe;
}
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},0);
}
};
pipe={"targetOrigin":_13a,"iframe":_13c,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_116[_13a]=pipe;
function sendInitWhenReady(){
var _145=_13c.contentWindow;
if(!_145){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_145,"I",_13a);
}
};
pipe.handshakeID=setTimeout(function(){
_116[_13a]=undefined;
pipe.post=function(_146){
_134.readyState=4;
_134.status=0;
onreadystatechange(_134);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_13c);
if(typeof (postMessage)==="undefined"){
sendInitWhenReady();
}
}
return pipe;
};
function onmessage(_147){
var _148=_147.origin;
var _149={"http":":80","https":":443"};
var _14a=_148.split(":");
if(_14a.length===2){
_148+=_149[_14a[0]];
}
var pipe=_116[_148];
if(pipe!==undefined&&pipe.iframe!==undefined&&_147.source==pipe.iframe.contentWindow){
if(_147.data=="I"){
clearTimeout(pipe.handshakeID);
var _14c;
while((_14c=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_14c,pipe.targetOrigin);
}
pipe.post=function(_14d){
postMessage0(pipe.iframe.contentWindow,_14d,pipe.targetOrigin);
};
}else{
var _14c=_147.data;
if(_14c.length>=9){
var _14e=0;
var type=_14c.substring(_14e,_14e+=1);
var id=_14c.substring(_14e,_14e+=8);
var _151=_117[id];
if(_151!==undefined){
switch(type){
case "r":
var _152={};
var _153=fromHex(_14c.substring(_14e,_14e+=2));
for(var i=0;i<_153;i++){
var _155=fromHex(_14c.substring(_14e,_14e+=4));
var _156=_14c.substring(_14e,_14e+=_155);
var _157=fromHex(_14c.substring(_14e,_14e+=4));
var _158=_14c.substring(_14e,_14e+=_157);
_152[_156]=_158;
}
var _159=fromHex(_14c.substring(_14e,_14e+=4));
var _15a=fromHex(_14c.substring(_14e,_14e+=2));
var _15b=_14c.substring(_14e,_14e+=_15a);
switch(_159){
case 301:
case 302:
case 307:
var _15c=_152["Location"];
var _15d=_147.origin;
if(typeof (_151.outer.onredirectallowed)==="function"){
if(!_151.outer.onredirectallowed(_15d,_15c)){
return;
}
}
var id=register(_151);
var pipe=supplyPipe(_151,_15c);
pipe.attach(id);
_151._pipe=pipe;
_151._method="GET";
_151._location=_15c;
_151._redirect=true;
break;
case 403:
_151.outer.status=_159;
onreadystatechange(_151);
break;
default:
_151.outer._responseHeaders=_152;
_151.outer.status=_159;
_151.outer.statusText=_15b;
break;
}
break;
case "p":
var _15e=parseInt(_14c.substring(_14e,_14e+=1));
if(_151._id===id){
_151.outer.readyState=_15e;
var _15f=fromHex(_14c.substring(_14e,_14e+=8));
var _160=_14c.substring(_14e,_14e+=_15f);
if(_160.length>0){
_151.outer.responseText+=_160;
}
onreadystatechange(_151);
}else{
if(_151._redirect){
_151._redirect=false;
doSend(_151,"");
}
}
if(_15e==4){
pipe.detach(id);
}
break;
case "e":
if(_151._id===id){
_151.outer.status=0;
_151.outer.statusText="";
_151.outer.readyState=4;
onreadystatechange(_151);
}
pipe.detach(id);
break;
case "t":
if(_151._id===id){
_151.outer.status=0;
_151.outer.statusText="";
_151.outer.readyState=4;
if(typeof (_151.ontimeout)!=="undefined"){
_151.ontimeout();
}
}
pipe.detach(id);
break;
}
}
}
}
}else{
}
};
window.addEventListener("message",onmessage,false);
return XMLHttpBridge;
})();
var XMLHttpRequest0=(function(){
var _161=new URI((browser=="ie")?document.URL:location.href);
var _162={"http":80,"https":443};
if(_161.port==null){
_161.port=_162[_161.scheme];
_161.authority=_161.host+":"+_161.port;
}
function onreadystatechange(_163){
if(typeof (_163.onreadystatechange)!=="undefined"){
_163.onreadystatechange();
}
};
function onprogress(_164){
if(typeof (_164.onprogress)!=="undefined"){
_164.onprogress();
}
};
function onerror(_165){
if(typeof (_165.onerror)!=="undefined"){
_165.onerror();
}
};
function onload(_166){
if(typeof (_166.onload)!=="undefined"){
_166.onload();
}
};
function XMLHttpRequest0(){
this._requestHeaders=[];
this.responseHeaders={};
this.withCredentials=false;
};
var _167=XMLHttpRequest0.prototype;
_167.readyState=0;
_167.responseText="";
_167.status=0;
_167.statusText="";
_167.timeout=0;
_167.onreadystatechange;
_167.onerror;
_167.onload;
_167.onprogress;
_167.onredirectallowed;
_167.open=function(_168,_169,_16a){
if(!_16a){
throw new Error("Asynchronous is required for cross-origin XMLHttpRequest emulation");
}
switch(this.readyState){
case 0:
case 4:
break;
default:
throw new Error("Invalid ready state");
}
var _16b=this;
this._method=_168;
this._location=_169;
this.readyState=1;
this.status=0;
this.statusText="";
this.responseText="";
var xhr;
var _16d=new URI(_169);
if(_16d.port==null){
_16d.port=_162[_16d.scheme];
_16d.authority=_16d.host+":"+_16d.port;
}
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&_16d.scheme==_161.scheme&&!this.withCredentials){
xhr=new XDRHttpDirect(this);
}else{
if(_16d.scheme==_161.scheme&&_16d.authority==_161.authority){
try{
xhr=new XMLHttpBridge(this);
}
catch(e){
xhr=new XMLHttpBridge(this);
}
}else{
xhr=new XMLHttpBridge(this);
}
}
xhr.onload=onload;
xhr.onprogress=onprogress;
xhr.onreadystatechange=onreadystatechange;
xhr.onerror=onerror;
xhr.open(_168,_169);
this.xhr=xhr;
setTimeout(function(){
if(_16b.readyState>1){
return;
}
if(_16b.readyState<1){
_16b.readyState=1;
}
onreadystatechange(_16b);
},0);
};
_167.setRequestHeader=function(_16e,_16f){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
this._requestHeaders.push([_16e,_16f]);
};
_167.send=function(_170){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
var _171=this;
setTimeout(function(){
if(_171.readyState>2){
return;
}
if(_171.readyState<2){
_171.readyState=2;
}
onreadystatechange(_171);
},0);
this.xhr.send(_170);
};
_167.abort=function(){
this.xhr.abort();
};
_167.getResponseHeader=function(_172){
if(this.status==0){
throw new Error("Invalid ready state");
}
var _173=this._responseHeaders;
return _173[_172];
};
_167.getAllResponseHeaders=function(){
if(this.status==0){
throw new Error("Invalid ready state");
}
return this._responseHeaders;
};
return XMLHttpRequest0;
})();
ByteOrder=function(){
};
(function(){
var _174=ByteOrder.prototype;
_174.toString=function(){
throw new Error("Abstract");
};
var _175=function(v){
return (v&255);
};
var _177=function(_178){
return (_178&128)?(_178|-256):_178;
};
var _179=function(v){
return [((v>>8)&255),(v&255)];
};
var _17b=function(_17c,_17d){
return (_177(_17c)<<8)|(_17d&255);
};
var _17e=function(_17f,_180){
return ((_17f&255)<<8)|(_180&255);
};
var _181=function(_182,_183,_184){
return ((_182&255)<<16)|((_183&255)<<8)|(_184&255);
};
var _185=function(v){
return [((v>>16)&255),((v>>8)&255),(v&255)];
};
var _187=function(_188,_189,_18a){
return ((_188&255)<<16)|((_189&255)<<8)|(_18a&255);
};
var _18b=function(v){
return [((v>>24)&255),((v>>16)&255),((v>>8)&255),(v&255)];
};
var _18d=function(_18e,_18f,_190,_191){
return (_177(_18e)<<24)|((_18f&255)<<16)|((_190&255)<<8)|(_191&255);
};
var _192=function(_193,_194,_195,_196){
var _197=_17e(_193,_194);
var _198=_17e(_195,_196);
return (_197*65536+_198);
};
ByteOrder.BIG_ENDIAN=(function(){
var _199=function(){
};
_199.prototype=new ByteOrder();
var _19a=_199.prototype;
_19a._toUnsignedByte=_175;
_19a._toByte=_177;
_19a._fromShort=_179;
_19a._toShort=_17b;
_19a._toUnsignedShort=_17e;
_19a._toUnsignedMediumInt=_181;
_19a._fromMediumInt=_185;
_19a._toMediumInt=_187;
_19a._fromInt=_18b;
_19a._toInt=_18d;
_19a._toUnsignedInt=_192;
_19a.toString=function(){
return "<ByteOrder.BIG_ENDIAN>";
};
return new _199();
})();
ByteOrder.LITTLE_ENDIAN=(function(){
var _19b=function(){
};
_19b.prototype=new ByteOrder();
var _19c=_19b.prototype;
_19c._toByte=_177;
_19c._toUnsignedByte=_175;
_19c._fromShort=function(v){
return _179(v).reverse();
};
_19c._toShort=function(_19e,_19f){
return _17b(_19f,_19e);
};
_19c._toUnsignedShort=function(_1a0,_1a1){
return _17e(_1a1,_1a0);
};
_19c._toUnsignedMediumInt=function(_1a2,_1a3,_1a4){
return _181(_1a4,_1a3,_1a2);
};
_19c._fromMediumInt=function(v){
return _185(v).reverse();
};
_19c._toMediumInt=function(_1a6,_1a7,_1a8,_1a9,_1aa,_1ab){
return _187(_1ab,_1aa,_1a9,_1a8,_1a7,_1a6);
};
_19c._fromInt=function(v){
return _18b(v).reverse();
};
_19c._toInt=function(_1ad,_1ae,_1af,_1b0){
return _18d(_1b0,_1af,_1ae,_1ad);
};
_19c._toUnsignedInt=function(_1b1,_1b2,_1b3,_1b4){
return _192(_1b4,_1b3,_1b2,_1b1);
};
_19c.toString=function(){
return "<ByteOrder.LITTLE_ENDIAN>";
};
return new _19b();
})();
})();
function ByteBuffer(_1b5){
this.array=_1b5||[];
this._mark=-1;
this.limit=this.capacity=this.array.length;
this.order=ByteOrder.BIG_ENDIAN;
};
(function(){
ByteBuffer.allocate=function(_1b6){
var buf=new ByteBuffer();
buf.capacity=_1b6;
buf.limit=_1b6;
return buf;
};
ByteBuffer.wrap=function(_1b8){
return new ByteBuffer(_1b8);
};
var _1b9=ByteBuffer.prototype;
_1b9.autoExpand=true;
_1b9.capacity=0;
_1b9.position=0;
_1b9.limit=0;
_1b9.order=ByteOrder.BIG_ENDIAN;
_1b9.array=[];
_1b9.mark=function(){
this._mark=this.position;
return this;
};
_1b9.reset=function(){
var m=this._mark;
if(m<0){
throw new Error("Invalid mark");
}
this.position=m;
return this;
};
_1b9.compact=function(){
this.array.splice(0,this.position);
this.limit-=this.position;
this.position=0;
return this;
};
_1b9.duplicate=function(){
var buf=new ByteBuffer(this.array);
buf.position=this.position;
buf.limit=this.limit;
buf.capacity=this.capacity;
return buf;
};
_1b9.fill=function(size){
_autoExpand(this,size);
while(size-->0){
this.put(0);
}
return this;
};
_1b9.fillWith=function(b,size){
_autoExpand(this,size);
while(size-->0){
this.put(b);
}
return this;
};
_1b9.indexOf=function(b){
var _1c0=this.limit;
var _1c1=this.array;
for(var i=this.position;i<_1c0;i++){
if(_1c1[i]==b){
return i;
}
}
return -1;
};
_1b9.put=function(v){
_autoExpand(this,1);
this.array[this.position++]=v&255;
return this;
};
_1b9.putAt=function(_1c4,v){
_checkForWriteAt(this,_1c4,1);
this.array[_1c4]=v&255;
return this;
};
_1b9.putUnsigned=function(v){
_autoExpand(this,1);
this.array[this.position++]=v&255;
return this;
};
_1b9.putUnsignedAt=function(_1c7,v){
_checkForWriteAt(this,_1c7,1);
this.array[_1c7]=v&255;
return this;
};
_1b9.putShort=function(v){
_autoExpand(this,2);
_putBytesInternal(this,this.position,this.order._fromShort(v));
this.position+=2;
return this;
};
_1b9.putShortAt=function(_1ca,v){
_checkForWriteAt(this,_1ca,2);
_putBytesInternal(this,_1ca,this.order._fromShort(v));
return this;
};
_1b9.putUnsignedShort=function(v){
_autoExpand(this,2);
_putBytesInternal(this,this.position,this.order._fromShort(v&65535));
this.position+=2;
return this;
};
_1b9.putUnsignedShortAt=function(_1cd,v){
_checkForWriteAt(this,_1cd,2);
_putBytesInternal(this,_1cd,this.order._fromShort(v&65535));
return this;
};
_1b9.putMediumInt=function(v){
_autoExpand(this,3);
this.putMediumIntAt(this.position,v);
this.position+=3;
return this;
};
_1b9.putMediumIntAt=function(_1d0,v){
this.putBytesAt(_1d0,this.order._fromMediumInt(v));
return this;
};
_1b9.putInt=function(v){
_autoExpand(this,4);
_putBytesInternal(this,this.position,this.order._fromInt(v));
this.position+=4;
return this;
};
_1b9.putIntAt=function(_1d3,v){
_checkForWriteAt(this,_1d3,4);
_putBytesInternal(this,_1d3,this.order._fromInt(v));
return this;
};
_1b9.putUnsignedInt=function(v){
_autoExpand(this,4);
this.putUnsignedIntAt(this.position,v&4294967295);
this.position+=4;
return this;
};
_1b9.putUnsignedIntAt=function(_1d6,v){
_checkForWriteAt(this,_1d6,4);
this.putIntAt(_1d6,v&4294967295);
return this;
};
_1b9.putString=function(v,cs){
cs.encode(v,this);
return this;
};
_1b9.putPrefixedString=function(_1da,v,cs){
if(typeof (cs)==="undefined"||typeof (cs.encode)==="undefined"){
throw new Error("ByteBuffer.putPrefixedString: character set parameter missing");
}
if(_1da===0){
return this;
}
_autoExpand(this,_1da);
var len=v.length;
switch(_1da){
case 1:
this.put(len);
break;
case 2:
this.putShort(len);
break;
case 4:
this.putInt(len);
break;
}
cs.encode(v,this);
return this;
};
function _putBytesInternal(_1de,_1df,v){
var _1e1=_1de.array;
for(var i=0;i<v.length;i++){
_1e1[i+_1df]=v[i]&255;
}
};
_1b9.putBytes=function(v){
_autoExpand(this,v.length);
_putBytesInternal(this,this.position,v);
this.position+=v.length;
return this;
};
_1b9.putBytesAt=function(_1e4,v){
_checkForWriteAt(this,_1e4,v.length);
_putBytesInternal(this,_1e4,v);
return this;
};
_1b9.putByteArray=function(v){
_autoExpand(this,v.byteLength);
var u=new Uint8Array(v);
for(var i=0;i<u.byteLength;i++){
this.putAt(this.position+i,u[i]&255);
}
this.position+=v.byteLength;
return this;
};
_1b9.putBuffer=function(v){
var len=v.remaining();
_autoExpand(this,len);
var _1eb=v.array;
var _1ec=v.position;
var _1ed=this.position;
for(var i=0;i<len;i++){
this.array[i+_1ed]=_1eb[i+_1ec];
}
this.position+=len;
return this;
};
_1b9.putBufferAt=function(_1ef,v){
var len=v.remaining();
_autoExpand(this,len);
var _1f2=v.array;
var _1f3=v.position;
var _1f4=this.position;
for(var i=0;i<len;i++){
this.array[i+_1f4]=_1f2[i+_1f3];
}
return this;
};
_1b9.get=function(){
_checkForRead(this,1);
return this.order._toByte(this.array[this.position++]);
};
_1b9.getAt=function(_1f6){
_checkForReadAt(this,_1f6,1);
return this.order._toByte(this.array[_1f6]);
};
_1b9.getUnsigned=function(){
_checkForRead(this,1);
var val=this.order._toUnsignedByte(this.array[this.position++]);
return val;
};
_1b9.getUnsignedAt=function(_1f8){
_checkForReadAt(this,_1f8,1);
return this.order._toUnsignedByte(this.array[_1f8]);
};
_1b9.getBytes=function(size){
_checkForRead(this,size);
var _1fa=new Array();
for(var i=0;i<size;i++){
_1fa.push(this.order._toByte(this.array[i+this.position]));
}
this.position+=size;
return _1fa;
};
_1b9.getBytesAt=function(_1fc,size){
_checkForReadAt(this,_1fc,size);
var _1fe=new Array();
var _1ff=this.array;
for(var i=0;i<size;i++){
_1fe.push(_1ff[i+_1fc]);
}
return _1fe;
};
_1b9.getBlob=function(size){
var _202=this.array.slice(this.position,size);
this.position+=size;
return BlobUtils.fromNumberArray(_202);
};
_1b9.getBlobAt=function(_203,size){
var _205=this.getBytesAt(_203,size);
return BlobUtils.fromNumberArray(_205);
};
_1b9.getArrayBuffer=function(size){
var u=new Uint8Array(size);
u.set(this.array.slice(this.position,size));
this.position+=size;
return u.buffer;
};
_1b9.getShort=function(){
_checkForRead(this,2);
var val=this.getShortAt(this.position);
this.position+=2;
return val;
};
_1b9.getShortAt=function(_209){
_checkForReadAt(this,_209,2);
var _20a=this.array;
return this.order._toShort(_20a[_209++],_20a[_209++]);
};
_1b9.getUnsignedShort=function(){
_checkForRead(this,2);
var val=this.getUnsignedShortAt(this.position);
this.position+=2;
return val;
};
_1b9.getUnsignedShortAt=function(_20c){
_checkForReadAt(this,_20c,2);
var _20d=this.array;
return this.order._toUnsignedShort(_20d[_20c++],_20d[_20c++]);
};
_1b9.getUnsignedMediumInt=function(){
var _20e=this.array;
return this.order._toUnsignedMediumInt(_20e[this.position++],_20e[this.position++],_20e[this.position++]);
};
_1b9.getMediumInt=function(){
var val=this.getMediumIntAt(this.position);
this.position+=3;
return val;
};
_1b9.getMediumIntAt=function(i){
var _211=this.array;
return this.order._toMediumInt(_211[i++],_211[i++],_211[i++]);
};
_1b9.getInt=function(){
_checkForRead(this,4);
var val=this.getIntAt(this.position);
this.position+=4;
return val;
};
_1b9.getIntAt=function(_213){
_checkForReadAt(this,_213,4);
var _214=this.array;
return this.order._toInt(_214[_213++],_214[_213++],_214[_213++],_214[_213++]);
};
_1b9.getUnsignedInt=function(){
_checkForRead(this,4);
var val=this.getUnsignedIntAt(this.position);
this.position+=4;
return val;
};
_1b9.getUnsignedIntAt=function(_216){
_checkForReadAt(this,_216,4);
var _217=this.array;
return this.order._toUnsignedInt(_217[_216++],_217[_216++],_217[_216++],_217[_216++]);
return val;
};
_1b9.getPrefixedString=function(_218,cs){
var len=0;
switch(_218||2){
case 1:
len=this.getUnsigned();
break;
case 2:
len=this.getUnsignedShort();
break;
case 4:
len=this.getInt();
break;
}
if(len===0){
return "";
}
var _21b=this.limit;
try{
this.limit=this.position+len;
return cs.decode(this);
}
finally{
this.limit=_21b;
}
};
_1b9.getString=function(cs){
try{
return cs.decode(this);
}
finally{
this.position=this.limit;
}
};
_1b9.slice=function(){
return new ByteBuffer(this.array.slice(this.position,this.limit));
};
_1b9.flip=function(){
this.limit=this.position;
this.position=0;
this._mark=-1;
return this;
};
_1b9.rewind=function(){
this.position=0;
this._mark=-1;
return this;
};
_1b9.clear=function(){
this.position=0;
this.limit=this.capacity;
this._mark=-1;
return this;
};
_1b9.remaining=function(){
return (this.limit-this.position);
};
_1b9.hasRemaining=function(){
return (this.limit>this.position);
};
_1b9.skip=function(size){
this.position+=size;
return this;
};
_1b9.getHexDump=function(){
var _21e=this.array;
var pos=this.position;
var _220=this.limit;
if(pos==_220){
return "empty";
}
var _221=[];
for(var i=pos;i<_220;i++){
var hex=(_21e[i]||0).toString(16);
if(hex.length==1){
hex="0"+hex;
}
_221.push(hex);
}
return _221.join(" ");
};
_1b9.toString=_1b9.getHexDump;
_1b9.expand=function(_224){
return this.expandAt(this.position,_224);
};
_1b9.expandAt=function(i,_226){
var end=i+_226;
if(end>this.capacity){
this.capacity=end;
}
if(end>this.limit){
this.limit=end;
}
return this;
};
function _autoExpand(_228,_229){
if(_228.autoExpand){
_228.expand(_229);
}
return _228;
};
function _checkForRead(_22a,_22b){
var end=_22a.position+_22b;
if(end>_22a.limit){
throw new Error("Buffer underflow");
}
return _22a;
};
function _checkForReadAt(_22d,_22e,_22f){
var end=_22e+_22f;
if(_22e<0||end>_22d.limit){
throw new Error("Index out of bounds");
}
return _22d;
};
function _checkForWriteAt(_231,_232,_233){
var end=_232+_233;
if(_232<0||end>_231.limit){
throw new Error("Index out of bounds");
}
return _231;
};
})();
function Charset(){
};
(function(){
var _235=Charset.prototype;
_235.decode=function(buf){
};
_235.encode=function(str,buf){
};
Charset.UTF8=(function(){
function UTF8(){
};
UTF8.prototype=new Charset();
var _239=UTF8.prototype;
_239.decode=function(buf){
var _23b=buf.remaining();
var _23c=_23b<10000;
var _23d=[];
var _23e=buf.array;
var _23f=buf.position;
var _240=_23f+_23b;
var _241,_242,_243,_244;
for(var i=_23f;i<_240;i++){
_241=(_23e[i]&255);
var _246=charByteCount(_241);
var _247=_240-i;
if(_247<_246){
break;
}
var _248=null;
switch(_246){
case 1:
_248=_241;
break;
case 2:
i++;
_242=(_23e[i]&255);
_248=((_241&31)<<6)|(_242&63);
break;
case 3:
i++;
_242=(_23e[i]&255);
i++;
_243=(_23e[i]&255);
_248=((_241&15)<<12)|((_242&63)<<6)|(_243&63);
break;
case 4:
i++;
_242=(_23e[i]&255);
i++;
_243=(_23e[i]&255);
i++;
_244=(_23e[i]&255);
_248=((_241&7)<<18)|((_242&63)<<12)|((_243&63)<<6)|(_244&63);
break;
}
if(_23c){
_23d.push(_248);
}else{
_23d.push(String.fromCharCode(_248));
}
}
if(_23c){
return String.fromCharCode.apply(null,_23d);
}else{
return _23d.join("");
}
};
_239.encode=function(str,buf){
var _24b=buf.position;
var mark=_24b;
var _24d=buf.array;
for(var i=0;i<str.length;i++){
var _24f=str.charCodeAt(i);
if(_24f<128){
_24d[_24b++]=_24f;
}else{
if(_24f<2048){
_24d[_24b++]=(_24f>>6)|192;
_24d[_24b++]=(_24f&63)|128;
}else{
if(_24f<65536){
_24d[_24b++]=(_24f>>12)|224;
_24d[_24b++]=((_24f>>6)&63)|128;
_24d[_24b++]=(_24f&63)|128;
}else{
if(_24f<1114112){
_24d[_24b++]=(_24f>>18)|240;
_24d[_24b++]=((_24f>>12)&63)|128;
_24d[_24b++]=((_24f>>6)&63)|128;
_24d[_24b++]=(_24f&63)|128;
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
buf.position=_24b;
buf.expandAt(_24b,_24b-mark);
};
_239.encodeAsByteArray=function(str){
var _251=new Array();
for(var i=0;i<str.length;i++){
var _253=str.charCodeAt(i);
if(_253<128){
_251.push(_253);
}else{
if(_253<2048){
_251.push((_253>>6)|192);
_251.push((_253&63)|128);
}else{
if(_253<65536){
_251.push((_253>>12)|224);
_251.push(((_253>>6)&63)|128);
_251.push((_253&63)|128);
}else{
if(_253<1114112){
_251.push((_253>>18)|240);
_251.push(((_253>>12)&63)|128);
_251.push(((_253>>6)&63)|128);
_251.push((_253&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return _251;
};
_239.encodeByteArray=function(_254){
var _255=_254.length;
var _256=[];
for(var i=0;i<_255;i++){
var _258=_254[i];
if(_258<128){
_256.push(_258);
}else{
if(_258<2048){
_256.push((_258>>6)|192);
_256.push((_258&63)|128);
}else{
if(_258<65536){
_256.push((_258>>12)|224);
_256.push(((_258>>6)&63)|128);
_256.push((_258&63)|128);
}else{
if(_258<1114112){
_256.push((_258>>18)|240);
_256.push(((_258>>12)&63)|128);
_256.push(((_258>>6)&63)|128);
_256.push((_258&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return String.fromCharCode.apply(null,_256);
};
_239.encodeArrayBuffer=function(_259){
var buf=new Uint8Array(_259);
var _25b=buf.length;
var _25c=[];
for(var i=0;i<_25b;i++){
var _25e=buf[i];
if(_25e<128){
_25c.push(_25e);
}else{
if(_25e<2048){
_25c.push((_25e>>6)|192);
_25c.push((_25e&63)|128);
}else{
if(_25e<65536){
_25c.push((_25e>>12)|224);
_25c.push(((_25e>>6)&63)|128);
_25c.push((_25e&63)|128);
}else{
if(_25e<1114112){
_25c.push((_25e>>18)|240);
_25c.push(((_25e>>12)&63)|128);
_25c.push(((_25e>>6)&63)|128);
_25c.push((_25e&63)|128);
}else{
throw new Error("Invalid UTF-8 string");
}
}
}
}
}
return String.fromCharCode.apply(null,_25c);
};
_239.toByteArray=function(str){
var _260=[];
var _261,_262,_263,_264;
var _265=str.length;
for(var i=0;i<_265;i++){
_261=(str.charCodeAt(i)&255);
var _267=charByteCount(_261);
var _268=null;
if(_267+i>_265){
break;
}
switch(_267){
case 1:
_268=_261;
break;
case 2:
i++;
_262=(str.charCodeAt(i)&255);
_268=((_261&31)<<6)|(_262&63);
break;
case 3:
i++;
_262=(str.charCodeAt(i)&255);
i++;
_263=(str.charCodeAt(i)&255);
_268=((_261&15)<<12)|((_262&63)<<6)|(_263&63);
break;
case 4:
i++;
_262=(str.charCodeAt(i)&255);
i++;
_263=(str.charCodeAt(i)&255);
i++;
_264=(str.charCodeAt(i)&255);
_268=((_261&7)<<18)|((_262&63)<<12)|((_263&63)<<6)|(_264&63);
break;
}
_260.push(_268&255);
}
return _260;
};
function charByteCount(b){
if((b&128)===0){
return 1;
}
if((b&32)===0){
return 2;
}
if((b&16)===0){
return 3;
}
if((b&8)===0){
return 4;
}
throw new Error("Invalid UTF-8 bytes");
};
return new UTF8();
})();
})();
(function(){
var _26a="WebSocket";
var _26b=function(name){
this._name=name;
this._level=_26b.Level.INFO;
};
(function(){
_26b.Level={OFF:8,SEVERE:7,WARNING:6,INFO:5,CONFIG:4,FINE:3,FINER:2,FINEST:1,ALL:0};
var _26d;
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:logging"){
_26d=tags[i].content;
break;
}
}
_26b._logConf={};
if(_26d){
var _270=_26d.split(",");
for(var i=0;i<_270.length;i++){
var _271=_270[i].split("=");
_26b._logConf[_271[0]]=_271[1];
}
}
var _272={};
_26b.getLogger=function(name){
var _274=_272[name];
if(_274===undefined){
_274=new _26b(name);
_272[name]=_274;
}
return _274;
};
var _275=_26b.prototype;
_275.setLevel=function(_276){
if(_276&&_276>=_26b.Level.ALL&&_276<=_26b.Level.OFF){
this._level=_276;
}
};
_275.isLoggable=function(_277){
for(var _278 in _26b._logConf){
if(_26b._logConf.hasOwnProperty(_278)){
if(this._name.match(_278)){
var _279=_26b._logConf[_278];
if(_279){
return (_26b.Level[_279]<=_277);
}
}
}
}
return (this._level<=_277);
};
var noop=function(){
};
var _27b={};
_27b[_26b.Level.OFF]=noop;
_27b[_26b.Level.SEVERE]=(window.console)?(console.error||console.log||noop):noop;
_27b[_26b.Level.WARNING]=(window.console)?(console.warn||console.log||noop):noop;
_27b[_26b.Level.INFO]=(window.console)?(console.info||console.log||noop):noop;
_27b[_26b.Level.CONFIG]=(window.console)?(console.info||console.log||noop):noop;
_27b[_26b.Level.FINE]=(window.console)?(console.debug||console.log||noop):noop;
_27b[_26b.Level.FINER]=(window.console)?(console.debug||console.log||noop):noop;
_27b[_26b.Level.FINEST]=(window.console)?(console.debug||console.log||noop):noop;
_27b[_26b.Level.ALL]=(window.console)?(console.log||noop):noop;
_275.config=function(_27c,_27d){
this.log(_26b.Level.CONFIG,_27c,_27d);
};
_275.entering=function(_27e,name,_280){
if(this.isLoggable(_26b.Level.FINER)){
if(browser=="chrome"||browser=="safari"){
_27e=console;
}
var _281=_27b[_26b.Level.FINER];
if(_280){
if(typeof (_281)=="object"){
_281("ENTRY "+name,_280);
}else{
_281.call(_27e,"ENTRY "+name,_280);
}
}else{
if(typeof (_281)=="object"){
_281("ENTRY "+name);
}else{
_281.call(_27e,"ENTRY "+name);
}
}
}
};
_275.exiting=function(_282,name,_284){
if(this.isLoggable(_26b.Level.FINER)){
var _285=_27b[_26b.Level.FINER];
if(browser=="chrome"||browser=="safari"){
_282=console;
}
if(_284){
if(typeof (_285)=="object"){
_285("RETURN "+name,_284);
}else{
_285.call(_282,"RETURN "+name,_284);
}
}else{
if(typeof (_285)=="object"){
_285("RETURN "+name);
}else{
_285.call(_282,"RETURN "+name);
}
}
}
};
_275.fine=function(_286,_287){
this.log(_26b.Level.FINE,_286,_287);
};
_275.finer=function(_288,_289){
this.log(_26b.Level.FINER,_288,_289);
};
_275.finest=function(_28a,_28b){
this.log(_26b.Level.FINEST,_28a,_28b);
};
_275.info=function(_28c,_28d){
this.log(_26b.Level.INFO,_28c,_28d);
};
_275.log=function(_28e,_28f,_290){
if(this.isLoggable(_28e)){
var _291=_27b[_28e];
if(browser=="chrome"||browser=="safari"){
_28f=console;
}
if(typeof (_291)=="object"){
_291(_290);
}else{
_291.call(_28f,_290);
}
}
};
_275.severe=function(_292,_293){
this.log(_26b.Level.SEVERE,_292,_293);
};
_275.warning=function(_294,_295){
this.log(_26b.Level.WARNING,_294,_295);
};
})();
var _296=function(key){
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name===key){
var v=tags[i].content;
return v;
}
}
};
var _29b=function(_29c){
var _29d=[];
for(var i=0;i<_29c.length;i++){
_29d.push(_29c[i]);
}
return _29d;
};
var _29f=function(_2a0,_2a1){
var _2a2=[];
for(var i=0;i<_2a0.length;i++){
var elt=_2a0[i];
if(_2a1(elt)){
_2a2.push(_2a0[i]);
}
}
return _2a2;
};
var _2a5=function(_2a6,_2a7){
for(var i=0;i<_2a6.length;i++){
if(_2a6[i]==_2a7){
return i;
}
}
return -1;
};
var _2a9=function(s){
var a=[];
for(var i=0;i<s.length;i++){
a.push(s.charCodeAt(i)&255);
}
var buf=new ByteBuffer(a);
var v=_2af(buf,Charset.UTF8);
return v;
};
var _2b0=function(_2b1){
var buf=new Uint8Array(_2b1);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
var buf=new ByteBuffer(a);
var s=_2af(buf,Charset.UTF8);
return s;
};
var _2b6=function(_2b7){
var buf=new Uint8Array(_2b7);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
return new ByteBuffer(a);
};
var _2bb=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _2bd="\n";
var _2be=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(n);
switch(chr){
case _2bb:
a.push(_2bb);
a.push(_2bb);
break;
case NULL:
a.push(_2bb);
a.push("0");
break;
case _2bd:
a.push(_2bb);
a.push("n");
break;
default:
a.push(chr);
}
}
var v=a.join("");
return v;
};
var _2c4=function(buf,_2c6){
if(_2c6){
return _2be(buf);
}else{
var _2c7=buf.array;
var _2c8=(buf.position==0&&buf.limit==_2c7.length)?_2c7:buf.getBytes(buf.remaining());
var _2c9=!(XMLHttpRequest.prototype.sendAsBinary);
for(var i=_2c8.length-1;i>=0;i--){
var _2cb=_2c8[i];
if(_2cb==0&&_2c9){
_2c8[i]=256;
}else{
if(_2cb<0){
_2c8[i]=_2cb&255;
}
}
}
var _2cc=0;
var _2cd=[];
do{
var _2ce=Math.min(_2c8.length-_2cc,10000);
partOfBytes=_2c8.slice(_2cc,_2cc+_2ce);
_2cc+=_2ce;
_2cd.push(String.fromCharCode.apply(null,partOfBytes));
}while(_2cc<_2c8.length);
var _2cf=_2cd.join("");
if(_2c8===_2c7){
for(var i=_2c8.length-1;i>=0;i--){
var _2cb=_2c8[i];
if(_2cb==256){
_2c8[i]=0;
}
}
}
return _2cf;
}
};
var _2af=function(buf,cs){
var _2d2=buf.position;
var _2d3=buf.limit;
var _2d4=buf.array;
while(_2d2<_2d3){
_2d2++;
}
try{
buf.limit=_2d2;
return cs.decode(buf);
}
finally{
if(_2d2!=_2d3){
buf.limit=_2d3;
buf.position=_2d2+1;
}
}
};
var _2d5=window.WebSocket;
var _2d6=(function(){
var _2d7=function(){
this.parent;
this._listener;
this.code=1005;
this.reason="";
};
var _2d8=(browser=="safari"&&typeof (_2d5.CLOSING)=="undefined");
var _2d9=(browser=="android");
var _2da=_2d7.prototype;
_2da.connect=function(_2db,_2dc){
if((typeof (_2d5)==="undefined")||_2d9){
doError(this);
return;
}
if(_2db.indexOf("javascript:")==0){
_2db=_2db.substr("javascript:".length);
}
var _2dd=_2db.indexOf("?");
if(_2dd!=-1){
if(!/[\?&]\.kl=Y/.test(_2db.substring(_2dd))){
_2db+="&.kl=Y";
}
}else{
_2db+="?.kl=Y";
}
this._sendQueue=[];
try{
if(_2dc){
this._requestedProtocol=_2dc;
this._delegate=new _2d5(_2db,_2dc);
}else{
this._delegate=new _2d5(_2db);
}
this._delegate.binaryType="arraybuffer";
}
catch(e){
doError(this);
return;
}
bindHandlers(this);
};
_2da.onerror=function(){
};
_2da.onmessage=function(){
};
_2da.onopen=function(){
};
_2da.onclose=function(){
};
_2da.close=function(code,_2df){
if(code){
if(_2d8){
doCloseDraft76Compat(this,code,_2df);
}else{
this._delegate.close(code,_2df);
}
}else{
this._delegate.close();
}
};
function doCloseDraft76Compat(_2e0,code,_2e2){
_2e0.code=code|1005;
_2e0.reason=_2e2|"";
_2e0._delegate.close();
};
_2da.send=function(_2e3){
doSend(this,_2e3);
return;
};
_2da.setListener=function(_2e4){
this._listener=_2e4;
};
_2da.setIdleTimeout=function(_2e5){
this.lastMessageTimestamp=new Date().getTime();
this.idleTimeout=_2e5;
startIdleTimer(this,_2e5);
return;
};
function doSend(_2e6,_2e7){
if(typeof (_2e7)=="string"){
_2e6._delegate.send(_2e7);
}else{
if(_2e7.byteLength||_2e7.size){
_2e6._delegate.send(_2e7);
}else{
if(_2e7.constructor==ByteBuffer){
_2e6._delegate.send(_2e7.getArrayBuffer(_2e7.remaining()));
}else{
throw new Error("Cannot call send() with that type");
}
}
}
};
function doError(_2e8,e){
setTimeout(function(){
_2e8._listener.connectionFailed(_2e8.parent);
},0);
};
function encodeMessageData(_2ea,e){
var buf;
if(typeof e.data.byteLength!=="undefined"){
buf=_2b6(e.data);
}else{
buf=ByteBuffer.allocate(e.data.length);
if(_2ea.parent._isBinary&&_2ea.parent._balanced>1){
for(var i=0;i<e.data.length;i++){
buf.put(e.data.charCodeAt(i));
}
}else{
buf.putString(e.data,Charset.UTF8);
}
buf.flip();
}
return buf;
};
function messageHandler(_2ee,e){
_2ee.lastMessageTimestamp=new Date().getTime();
if(typeof (e.data)==="string"){
_2ee._listener.textMessageReceived(_2ee.parent,e.data);
}else{
_2ee._listener.binaryMessageReceived(_2ee.parent,e.data);
}
};
function closeHandler(_2f0,e){
unbindHandlers(_2f0);
if(_2d8){
_2f0._listener.connectionClosed(_2f0.parent,true,_2f0.code,_2f0.reason);
}else{
_2f0._listener.connectionClosed(_2f0.parent,e.wasClean,e.code,e.reason);
}
};
function errorHandler(_2f2,e){
_2f2._listener.connectionError(_2f2.parent,e);
};
function openHandler(_2f4,e){
if(_2d8){
_2f4._delegate.protocol=_2f4._requestedProtocol;
}
_2f4._listener.connectionOpened(_2f4.parent,_2f4._delegate.protocol);
};
function bindHandlers(_2f6){
var _2f7=_2f6._delegate;
_2f7.onopen=function(e){
openHandler(_2f6,e);
};
_2f7.onmessage=function(e){
messageHandler(_2f6,e);
};
_2f7.onclose=function(e){
closeHandler(_2f6,e);
};
_2f7.onerror=function(e){
errorHandler(_2f6,e);
};
_2f6.readyState=function(){
return _2f7.readyState;
};
};
function unbindHandlers(_2fc){
var _2fd=_2fc._delegate;
_2fd.onmessage=undefined;
_2fd.onclose=undefined;
_2fd.onopen=undefined;
_2fd.onerror=undefined;
_2fc.readyState=WebSocket.CLOSED;
};
function startIdleTimer(_2fe,_2ff){
stopIdleTimer(_2fe);
_2fe.idleTimer=setTimeout(function(){
idleTimerHandler(_2fe);
},_2ff);
};
function idleTimerHandler(_300){
var _301=new Date().getTime();
var _302=_301-_300.lastMessageTimestamp;
var _303=_300.idleTimeout;
if(_302>_303){
try{
var _304=_300._delegate;
if(_304){
unbindHandlers(_300);
_304.close();
}
}
finally{
_300._listener.connectionClosed(_300.parent,false,1006,"");
}
}else{
startIdleTimer(_300,_303-_302);
}
};
function stopIdleTimer(_305){
if(_305.idleTimer!=null){
clearTimeout(_305.idleTimer);
_305.IdleTimer=null;
}
};
return _2d7;
})();
var _306=(function(){
var _307=function(){
this.parent;
this._listener;
};
var _308=_307.prototype;
_308.connect=function(_309,_30a){
this.URL=_309;
try{
_30b(this,_309,_30a);
}
catch(e){
doError(this,e);
}
this.constructor=_307;
};
_308.setListener=function(_30c){
this._listener=_30c;
};
_307._flashBridge={};
_307._flashBridge.readyWaitQueue=[];
_307._flashBridge.failWaitQueue=[];
_307._flashBridge.flashHasLoaded=false;
_307._flashBridge.flashHasFailed=false;
_308.URL="";
_308.readyState=0;
_308.bufferedAmount=0;
_308.connectionOpened=function(_30d,_30e){
var _30e=_30e.split("\n");
for(var i=0;i<_30e.length;i++){
var _310=_30e[i].split(":");
_30d.responseHeaders[_310[0]]=_310[1];
}
this._listener.connectionOpened(_30d,"");
};
_308.connectionClosed=function(_311,_312,code,_314){
this._listener.connectionClosed(_311,_312,code,_314);
};
_308.connectionFailed=function(_315){
this._listener.connectionFailed(_315);
};
_308.binaryMessageReceived=function(_316,data){
this._listener.binaryMessageReceived(_316,data);
};
_308.textMessageReceived=function(_318,s){
this._listener.textMessageReceived(_318,s);
};
_308.redirected=function(_31a,_31b){
this._listener.redirected(_31a,_31b);
};
_308.authenticationRequested=function(_31c,_31d,_31e){
this._listener.authenticationRequested(_31c,_31d,_31e);
};
_308.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_307._flashBridge.sendText(this._instanceId,data);
}else{
if(data.constructor==ByteBuffer){
var _320;
var a=[];
while(data.remaining()){
a.push(String.fromCharCode(data.get()));
}
var _320=a.join("");
_307._flashBridge.sendByteString(this._instanceId,_320);
}else{
if(data.byteLength){
var _320;
var a=[];
var _322=new DataView(data);
for(var i=0;i<data.byteLength;i++){
a.push(String.fromCharCode(_322.getUint8(i)));
}
var _320=a.join("");
_307._flashBridge.sendByteString(this._instanceId,_320);
}else{
if(data.size){
var _324=this;
var cb=function(_326){
_307._flashBridge.sendByteString(_324._instanceId,_326);
};
BlobUtils.asBinaryString(cb,data);
return;
}else{
throw new Error("Invalid type");
}
}
}
}
_327(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_308.close=function(code,_329){
switch(this.readyState){
case 0:
case 1:
_307._flashBridge.disconnect(this._instanceId,code,_329);
break;
}
};
_308.disconnect=_308.close;
var _327=function(_32a){
_32a.bufferedAmount=_307._flashBridge.getBufferedAmount(_32a._instanceId);
if(_32a.bufferedAmount!=0){
setTimeout(function(){
_327(_32a);
},1000);
}
};
var _30b=function(_32b,_32c,_32d){
var _32e=function(key,_330){
_330[key]=_32b;
_32b._instanceId=key;
};
var _331=function(){
doError(_32b);
};
var _332=[];
if(_32b.parent.requestHeaders&&_32b.parent.requestHeaders.length>0){
for(var i=0;i<_32b.parent.requestHeaders.length;i++){
_332.push(_32b.parent.requestHeaders[i].label+":"+_32b.parent.requestHeaders[i].value);
}
}
_307._flashBridge.registerWebSocketEmulated(_32c,_332.join("\n"),_32e,_331);
};
function doError(_334,e){
setTimeout(function(){
_334._listener.connectionFailed(_334.parent);
},0);
};
return _307;
})();
var _336=(function(){
var _337=function(){
this.parent;
this._listener;
};
var _338=_337.prototype;
_338.connect=function(_339,_33a){
this.URL=_339;
try{
_33b(this,_339,_33a);
}
catch(e){
doError(this,e);
}
this.constructor=_337;
};
_338.setListener=function(_33c){
this._listener=_33c;
};
_306._flashBridge={};
_306._flashBridge.readyWaitQueue=[];
_306._flashBridge.failWaitQueue=[];
_306._flashBridge.flashHasLoaded=false;
_306._flashBridge.flashHasFailed=false;
_338.URL="";
_338.readyState=0;
_338.bufferedAmount=0;
_338.connectionOpened=function(_33d,_33e){
var _33e=_33e.split("\n");
for(var i=0;i<_33e.length;i++){
var _340=_33e[i].split(":");
_33d.responseHeaders[_340[0]]=_340[1];
}
this._listener.connectionOpened(_33d,"");
};
_338.connectionClosed=function(_341,_342,code,_344){
this._listener.connectionClosed(_341,_342,code,_344);
};
_338.connectionFailed=function(_345){
this._listener.connectionFailed(_345);
};
_338.binaryMessageReceived=function(_346,data){
this._listener.binaryMessageReceived(_346,data);
};
_338.textMessageReceived=function(_348,s){
this._listener.textMessageReceived(_348,s);
};
_338.redirected=function(_34a,_34b){
this._listener.redirected(_34a,_34b);
};
_338.authenticationRequested=function(_34c,_34d,_34e){
this._listener.authenticationRequested(_34c,_34d,_34e);
};
_338.send=function(data){
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
throw new Error("data is null");
}
if(typeof (data)=="string"){
_306._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _350;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _350=a.join("");
_306._flashBridge.sendByteString(this._instanceId,_350);
return;
}else{
throw new Error("Invalid type");
}
}
_353(this);
return true;
break;
case 2:
return false;
break;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_338.close=function(code,_355){
switch(this.readyState){
case 1:
case 2:
_306._flashBridge.disconnect(this._instanceId,code,_355);
break;
}
};
_338.disconnect=_338.close;
var _353=function(_356){
_356.bufferedAmount=_306._flashBridge.getBufferedAmount(_356._instanceId);
if(_356.bufferedAmount!=0){
setTimeout(function(){
_353(_356);
},1000);
}
};
var _33b=function(_357,_358,_359){
var _35a=function(key,_35c){
_35c[key]=_357;
_357._instanceId=key;
};
var _35d=function(){
doError(_357);
};
var _35e=[];
if(_357.parent.requestHeaders&&_357.parent.requestHeaders.length>0){
for(var i=0;i<_357.parent.requestHeaders.length;i++){
_35e.push(_357.parent.requestHeaders[i].label+":"+_357.parent.requestHeaders[i].value);
}
}
_306._flashBridge.registerWebSocketRtmp(_358,_35e.join("\n"),_35a,_35d);
};
function doError(_360,e){
setTimeout(function(){
_360._listener.connectionFailed(_360.parent);
},0);
};
return _337;
})();
(function(){
var _362={};
_306._flashBridge.registerWebSocketEmulated=function(_363,_364,_365,_366){
var _367=function(){
var key=_306._flashBridge.doRegisterWebSocketEmulated(_363,_364);
_365(key,_362);
};
if(_306._flashBridge.flashHasLoaded){
if(_306._flashBridge.flashHasFailed){
_366();
}else{
_367();
}
}else{
this.readyWaitQueue.push(_367);
this.failWaitQueue.push(_366);
}
};
_306._flashBridge.doRegisterWebSocketEmulated=function(_369,_36a){
var key=_306._flashBridge.elt.registerWebSocketEmulated(_369,_36a);
return key;
};
_306._flashBridge.registerWebSocketRtmp=function(_36c,_36d,_36e,_36f){
var _370=function(){
var key=_306._flashBridge.doRegisterWebSocketRtmp(_36c,_36d);
_36e(key,_362);
};
if(_306._flashBridge.flashHasLoaded){
if(_306._flashBridge.flashHasFailed){
_36f();
}else{
_370();
}
}else{
this.readyWaitQueue.push(_370);
this.failWaitQueue.push(_36f);
}
};
_306._flashBridge.doRegisterWebSocketRtmp=function(_372,_373){
var key=_306._flashBridge.elt.registerWebSocketRtmp(_372,_373);
return key;
};
_306._flashBridge.onready=function(){
var _375=_306._flashBridge.readyWaitQueue;
for(var i=0;i<_375.length;i++){
var _377=_375[i];
_377();
}
};
_306._flashBridge.onfail=function(){
var _378=_306._flashBridge.failWaitQueue;
for(var i=0;i<_378.length;i++){
var _37a=_378[i];
_37a();
}
};
_306._flashBridge.connectionOpened=function(key,_37c){
_362[key].readyState=1;
_362[key].connectionOpened(_362[key].parent,_37c);
_37d();
};
_306._flashBridge.connectionClosed=function(key,_37f,code,_381){
_362[key].readyState=2;
_362[key].connectionClosed(_362[key].parent,_37f,code,_381);
};
_306._flashBridge.connectionFailed=function(key){
_362[key].connectionFailed(_362[key].parent);
};
_306._flashBridge.binaryMessageReceived=function(key,data){
var _385=_362[key];
if(_385.readyState==1){
var buf=ByteBuffer.allocate(data.length);
for(var i=0;i<data.length;i++){
buf.put(data[i]);
}
buf.flip();
_385.binaryMessageReceived(_385.parent,buf);
}
};
_306._flashBridge.textMessageReceived=function(key,data){
var _38a=_362[key];
if(_38a.readyState==1){
_38a.textMessageReceived(_38a.parent,unescape(data));
}
};
_306._flashBridge.redirected=function(key,_38c){
var _38d=_362[key];
_38d.redirected(_38d.parent,_38c);
};
_306._flashBridge.authenticationRequested=function(key,_38f,_390){
var _391=_362[key];
_391.authenticationRequested(_391.parent,_38f,_390);
};
var _37d=function(){
if(browser==="firefox"){
var e=document.createElement("iframe");
e.style.display="none";
document.body.appendChild(e);
document.body.removeChild(e);
}
};
_306._flashBridge.sendText=function(key,_394){
this.elt.processTextMessage(key,escape(_394));
setTimeout(_37d,200);
};
_306._flashBridge.sendByteString=function(key,_396){
this.elt.processBinaryMessage(key,escape(_396));
setTimeout(_37d,200);
};
_306._flashBridge.disconnect=function(key,code,_399){
this.elt.processClose(key,code,_399);
};
_306._flashBridge.getBufferedAmount=function(key){
var v=this.elt.getBufferedAmount(key);
return v;
};
})();
(function(){
var _39c=function(_39d){
var self=this;
var _39f=3000;
var ID="Loader";
var ie=false;
var _3a2=-1;
self.elt=null;
var _3a3=function(){
var exp=new RegExp(".*"+_39d+".*.js$");
var _3a5=document.getElementsByTagName("script");
for(var i=0;i<_3a5.length;i++){
if(_3a5[i].src){
var name=(_3a5[i].src).match(exp);
if(name){
name=name.pop();
var _3a8=name.split("/");
_3a8.pop();
if(_3a8.length>0){
return _3a8.join("/")+"/";
}else{
return "";
}
}
}
}
};
var _3a9=_3a3();
var _3aa=_3a9+"Loader.swf";
self.loader=function(){
var _3ab="flash";
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:upgrade"){
_3ab=tags[i].content;
}
}
if(_3ab!="flash"||!_3ae([9,0,115])){
_3af();
}else{
_3a2=setTimeout(_3af,_39f);
_3b0();
}
};
self.clearFlashTimer=function(){
clearTimeout(_3a2);
_3a2="cleared";
setTimeout(function(){
_3b1(self.elt.handshake(_39d));
},0);
};
var _3b1=function(_3b2){
if(_3b2){
_306._flashBridge.flashHasLoaded=true;
_306._flashBridge.elt=self.elt;
_306._flashBridge.onready();
}else{
_3af();
}
window.___Loader=undefined;
};
var _3af=function(){
_306._flashBridge.flashHasLoaded=true;
_306._flashBridge.flashHasFailed=true;
_306._flashBridge.onfail();
};
var _3b3=function(){
var _3b4=null;
if(typeof (ActiveXObject)!="undefined"){
try{
ie=true;
var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
var _3b6=swf.GetVariable("$version");
var _3b7=_3b6.split(" ")[1].split(",");
_3b4=[];
for(var i=0;i<_3b7.length;i++){
_3b4[i]=parseInt(_3b7[i]);
}
}
catch(e){
ie=false;
}
}
if(typeof navigator.plugins!="undefined"){
if(typeof navigator.plugins["Shockwave Flash"]!="undefined"){
var _3b6=navigator.plugins["Shockwave Flash"].description;
_3b6=_3b6.replace(/\s*r/g,".");
var _3b7=_3b6.split(" ")[2].split(".");
_3b4=[];
for(var i=0;i<_3b7.length;i++){
_3b4[i]=parseInt(_3b7[i]);
}
}
}
var _3b9=navigator.userAgent;
if(_3b4!==null&&_3b4[0]===10&&_3b4[1]===0&&_3b9.indexOf("Windows NT 6.0")!==-1){
_3b4=null;
}
if(_3b9.indexOf("MSIE 6.0")==-1&&_3b9.indexOf("MSIE 7.0")==-1){
if(_3b9.indexOf("MSIE 8.0")>0||_3b9.indexOf("MSIE 9.0")>0){
if(typeof (XDomainRequest)!=="undefined"){
_3b4=null;
}
}else{
_3b4=null;
}
}
return _3b4;
};
var _3ae=function(_3ba){
var _3bb=_3b3();
if(_3bb==null){
return false;
}
for(var i=0;i<Math.max(_3bb.length,_3ba.length);i++){
var _3bd=_3bb[i]-_3ba[i];
if(_3bd!=0){
return (_3bd>0)?true:false;
}
}
return true;
};
var _3b0=function(){
if(ie){
var elt=document.createElement("div");
document.body.appendChild(elt);
elt.outerHTML="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" height=\"0\" width=\"0\" id=\""+ID+"\"><param name=\"movie\" value=\""+_3aa+"\"></param></object>";
self.elt=document.getElementById(ID);
}else{
var elt=document.createElement("object");
elt.setAttribute("type","application/x-shockwave-flash");
elt.setAttribute("width",0);
elt.setAttribute("height",0);
elt.setAttribute("id",ID);
elt.setAttribute("data",_3aa);
document.body.appendChild(elt);
self.elt=elt;
}
};
self.attachToOnload=function(_3bf){
if(window.addEventListener){
window.addEventListener("load",_3bf,true);
}else{
if(window.attachEvent){
window.attachEvent("onload",_3bf);
}else{
onload=_3bf;
}
}
};
if(document.readyState==="complete"){
self.loader();
}else{
self.attachToOnload(self.loader);
}
};
var _3c0=(function(){
var _3c1=function(_3c2){
this.HOST=new _3c1(0);
this.USERINFO=new _3c1(1);
this.PORT=new _3c1(2);
this.PATH=new _3c1(3);
this.ordinal=_3c2;
};
return _3c1;
})();
var _3c3=(function(){
var _3c4=function(){
};
_3c4.getRealm=function(_3c5){
var _3c6=_3c5.authenticationParameters;
if(_3c6==null){
return null;
}
var _3c7=/realm=(\"(.*)\")/i;
var _3c8=_3c7.exec(_3c6);
return (_3c8!=null&&_3c8.length>=3)?_3c8[2]:null;
};
return _3c4;
})();
function Dictionary(){
this.Keys=new Array();
};
var _3c9=(function(){
var _3ca=function(_3cb){
this.weakKeys=_3cb;
this.elements=[];
this.dictionary=new Dictionary();
};
var _3cc=_3ca.prototype;
_3cc.getlength=function(){
return this.elements.length;
};
_3cc.getItemAt=function(_3cd){
return this.dictionary[this.elements[_3cd]];
};
_3cc.get=function(key){
var _3cf=this.dictionary[key];
if(_3cf==undefined){
_3cf=null;
}
return _3cf;
};
_3cc.remove=function(key){
for(var i=0;i<this.elements.length;i++){
var _3d2=(this.weakKeys&&(this.elements[i]==key));
var _3d3=(!this.weakKeys&&(this.elements[i]===key));
if(_3d2||_3d3){
this.elements.remove(i);
this.dictionary[this.elements[i]]=undefined;
break;
}
}
};
_3cc.put=function(key,_3d5){
this.remove(key);
this.elements.push(key);
this.dictionary[key]=_3d5;
};
_3cc.isEmpty=function(){
return this.length==0;
};
_3cc.containsKey=function(key){
for(var i=0;i<this.elements.length;i++){
var _3d8=(this.weakKeys&&(this.elements[i]==key));
var _3d9=(!this.weakKeys&&(this.elements[i]===key));
if(_3d8||_3d9){
return true;
}
}
return false;
};
_3cc.keySet=function(){
return this.elements;
};
_3cc.getvalues=function(){
var _3da=[];
for(var i=0;i<this.elements.length;i++){
_3da.push(this.dictionary[this.elements[i]]);
}
return _3da;
};
return _3ca;
})();
var Node=(function(){
var Node=function(){
this.name="";
this.kind="";
this.values=[];
this.children=new _3c9();
};
var _3de=Node.prototype;
_3de.getWildcardChar=function(){
return "*";
};
_3de.addChild=function(name,kind){
if(name==null||name.length==0){
throw new ArgumentError("A node may not have a null name.");
}
var _3e1=Node.createNode(name,this,kind);
this.children.put(name,_3e1);
return _3e1;
};
_3de.hasChild=function(name,kind){
return null!=this.getChild(name)&&kind==this.getChild(name).kind;
};
_3de.getChild=function(name){
return this.children.get(name);
};
_3de.getDistanceFromRoot=function(){
var _3e5=0;
var _3e6=this;
while(!_3e6.isRootNode()){
_3e5++;
_3e6=_3e6.parent;
}
return _3e5;
};
_3de.appendValues=function(){
if(this.isRootNode()){
throw new ArgumentError("Cannot set a values on the root node.");
}
if(this.values!=null){
for(var k=0;k<arguments.length;k++){
var _3e8=arguments[k];
this.values.push(_3e8);
}
}
};
_3de.removeValue=function(_3e9){
if(this.isRootNode()){
return;
}
for(var i=0;i<this.values.length;i++){
if(this.values[i]==_3e9){
this.values.splice(i,1);
}
}
};
_3de.getValues=function(){
return this.values;
};
_3de.hasValues=function(){
return this.values!=null&&this.values.length>0;
};
_3de.isRootNode=function(){
return this.parent==null;
};
_3de.hasChildren=function(){
return this.children!=null&&this.children.getlength()>0;
};
_3de.isWildcard=function(){
return this.name!=null&&this.name==this.getWildcardChar();
};
_3de.hasWildcardChild=function(){
return this.hasChildren()&&this.children.containsKey(this.getWildcardChar());
};
_3de.getFullyQualifiedName=function(){
var b=new String();
var name=[];
var _3ed=this;
while(!_3ed.isRootNode()){
name.push(_3ed.name);
_3ed=_3ed.parent;
}
name=name.reverse();
for(var k=0;k<name.length;k++){
b+=name[k];
b+=".";
}
if(b.length>=1&&b.charAt(b.length-1)=="."){
b=b.slice(0,b.length-1);
}
return b.toString();
};
_3de.getChildrenAsList=function(){
return this.children.getvalues();
};
_3de.findBestMatchingNode=function(_3ef,_3f0){
var _3f1=this.findAllMatchingNodes(_3ef,_3f0);
var _3f2=null;
var _3f3=0;
for(var i=0;i<_3f1.length;i++){
var node=_3f1[i];
if(node.getDistanceFromRoot()>_3f3){
_3f3=node.getDistanceFromRoot();
_3f2=node;
}
}
return _3f2;
};
_3de.findAllMatchingNodes=function(_3f6,_3f7){
var _3f8=[];
var _3f9=this.getChildrenAsList();
for(var i=0;i<_3f9.length;i++){
var node=_3f9[i];
var _3fc=node.matches(_3f6,_3f7);
if(_3fc<0){
continue;
}
if(_3fc>=_3f6.length){
do{
if(node.hasValues()){
_3f8.push(node);
}
if(node.hasWildcardChild()){
var _3fd=node.getChild(this.getWildcardChar());
if(_3fd.kind!=this.kind){
node=null;
}else{
node=_3fd;
}
}else{
node=null;
}
}while(node!=null);
}else{
var _3fe=node.findAllMatchingNodes(_3f6,_3fc);
for(var j=0;j<_3fe.length;j++){
_3f8.push(_3fe[j]);
}
}
}
return _3f8;
};
_3de.matches=function(_400,_401){
if(_401<0||_401>=_400.length){
return -1;
}
if(this.matchesToken(_400[_401])){
return _401+1;
}
if(!this.isWildcard()){
return -1;
}else{
if(this.kind!=_400[_401].kind){
return -1;
}
do{
_401++;
}while(_401<_400.length&&this.kind==_400[_401].kind);
return _401;
}
};
_3de.matchesToken=function(_402){
return this.name==_402.name&&this.kind==_402.kind;
};
Node.createNode=function(name,_404,kind){
var node=new Node();
node.name=name;
node.parent=_404;
node.kind=kind;
return node;
};
return Node;
})();
var _407=(function(){
var _408=function(name,kind){
this.kind=kind;
this.name=name;
};
return _408;
})();
window.Oid=(function(){
var Oid=function(data){
this.rep=data;
};
var _40d=Oid.prototype;
_40d.asArray=function(){
return this.rep;
};
_40d.asString=function(){
var s="";
for(var i=0;i<this.rep.length;i++){
s+=(this.rep[i].toString());
s+=".";
}
if(s.length>0&&s.charAt(s.length-1)=="."){
s=s.slice(0,s.length-1);
}
return s;
};
Oid.create=function(data){
return new Oid(data.split("."));
};
return Oid;
})();
var _411=(function(){
var _412=function(){
};
_412.create=function(_413,_414,_415){
var _416=_413+":"+_414;
var _417=[];
for(var i=0;i<_416.length;++i){
_417.push(_416.charCodeAt(i));
}
var _419="Basic "+Base64.encode(_417);
return new ChallengeResponse(_419,_415);
};
return _412;
})();
function InternalDefaultChallengeHandler(){
this.canHandle=function(_41a){
return false;
};
this.handle=function(_41b,_41c){
_41c(null);
};
};
window.PasswordAuthentication=(function(){
function PasswordAuthentication(_41d,_41e){
this.username=_41d;
this.password=_41e;
};
PasswordAuthentication.prototype.clear=function(){
this.username=null;
this.password=null;
};
return PasswordAuthentication;
})();
window.ChallengeRequest=(function(){
var _41f=function(_420,_421){
if(_420==null){
throw new Error("location is not defined.");
}
if(_421==null){
return;
}
var _422="Application ";
if(_421.indexOf(_422)==0){
_421=_421.substring(_422.length);
}
this.location=_420;
this.authenticationParameters=null;
var _423=_421.indexOf(" ");
if(_423==-1){
this.authenticationScheme=_421;
}else{
this.authenticationScheme=_421.substring(0,_423);
if(_421.length>_423+1){
this.authenticationParameters=_421.substring(_423+1);
}
}
};
return _41f;
})();
window.ChallengeResponse=(function(){
var _424=function(_425,_426){
this.credentials=_425;
this.nextChallengeHandler=_426;
};
var _427=_424.prototype;
_427.clearCredentials=function(){
if(this.credentials!=null){
this.credentials=null;
}
};
return _424;
})();
window.BasicChallengeHandler=(function(){
var _428=function(){
this.loginHandler=undefined;
this.loginHandlersByRealm={};
};
var _429=_428.prototype;
_429.setRealmLoginHandler=function(_42a,_42b){
if(_42a==null){
throw new ArgumentError("null realm");
}
if(_42b==null){
throw new ArgumentError("null loginHandler");
}
this.loginHandlersByRealm[_42a]=_42b;
return this;
};
_429.canHandle=function(_42c){
return _42c!=null&&"Basic"==_42c.authenticationScheme;
};
_429.handle=function(_42d,_42e){
if(_42d.location!=null){
var _42f=this.loginHandler;
var _430=_3c3.getRealm(_42d);
if(_430!=null&&this.loginHandlersByRealm[_430]!=null){
_42f=this.loginHandlersByRealm[_430];
}
var _431=this;
if(_42f!=null){
_42f(function(_432){
if(_432!=null&&_432.username!=null){
_42e(_411.create(_432.username,_432.password,_431));
}else{
_42e(null);
}
});
return;
}
}
_42e(null);
};
_429.loginHandler=function(_433){
_433(null);
};
return _428;
})();
window.DispatchChallengeHandler=(function(){
var _434=function(){
this.rootNode=new Node();
var _435="^(.*)://(.*)";
this.SCHEME_URI_PATTERN=new RegExp(_435);
};
function delChallengeHandlerAtLocation(_436,_437,_438){
var _439=tokenize(_437);
var _43a=_436;
for(var i=0;i<_439.length;i++){
var _43c=_439[i];
if(!_43a.hasChild(_43c.name,_43c.kind)){
return;
}else{
_43a=_43a.getChild(_43c.name);
}
}
_43a.removeValue(_438);
};
function addChallengeHandlerAtLocation(_43d,_43e,_43f){
var _440=tokenize(_43e);
var _441=_43d;
for(var i=0;i<_440.length;i++){
var _443=_440[i];
if(!_441.hasChild(_443.name,_443.kind)){
_441=_441.addChild(_443.name,_443.kind);
}else{
_441=_441.getChild(_443.name);
}
}
_441.appendValues(_43f);
};
function lookupByLocation(_444,_445){
var _446=new Array();
if(_445!=null){
var _447=findBestMatchingNode(_444,_445);
if(_447!=null){
return _447.values;
}
}
return _446;
};
function lookupByRequest(_448,_449){
var _44a=null;
var _44b=_449.location;
if(_44b!=null){
var _44c=findBestMatchingNode(_448,_44b);
if(_44c!=null){
var _44d=_44c.getValues();
if(_44d!=null){
for(var i=0;i<_44d.length;i++){
var _44f=_44d[i];
if(_44f.canHandle(_449)){
_44a=_44f;
break;
}
}
}
}
}
return _44a;
};
function findBestMatchingNode(_450,_451){
var _452=tokenize(_451);
var _453=0;
return _450.findBestMatchingNode(_452,_453);
};
function tokenize(uri){
var _455=new Array();
if(uri==null||uri.length==0){
return _455;
}
var _456=new RegExp("^(([^:/?#]+):(//))?([^/?#]*)?([^?#]*)(\\?([^#]*))?(#(.*))?");
var _457=_456.exec(uri);
if(_457==null){
return _455;
}
var _458=_457[2]||"http";
var _459=_457[4];
var path=_457[5];
var _45b=null;
var _45c=null;
var _45d=null;
var _45e=null;
if(_459!=null){
var host=_459;
var _460=host.indexOf("@");
if(_460>=0){
_45c=host.substring(0,_460);
host=host.substring(_460+1);
var _461=_45c.indexOf(":");
if(_461>=0){
_45d=_45c.substring(0,_461);
_45e=_45c.substring(_461+1);
}
}
var _462=host.indexOf(":");
if(_462>=0){
_45b=host.substring(_462+1);
host=host.substring(0,_462);
}
}else{
throw new ArgumentError("Hostname is required.");
}
var _463=host.split(/\./);
_463.reverse();
for(var k=0;k<_463.length;k++){
_455.push(new _407(_463[k],_3c0.HOST));
}
if(_45b!=null){
_455.push(new _407(_45b,_3c0.PORT));
}else{
if(getDefaultPort(_458)>0){
_455.push(new _407(getDefaultPort(_458).toString(),_3c0.PORT));
}
}
if(_45c!=null){
if(_45d!=null){
_455.push(new _407(_45d,_3c0.USERINFO));
}
if(_45e!=null){
_455.push(new _407(_45e,_3c0.USERINFO));
}
if(_45d==null&&_45e==null){
_455.push(new _407(_45c,_3c0.USERINFO));
}
}
if(isNotBlank(path)){
if(path.charAt(0)=="/"){
path=path.substring(1);
}
if(isNotBlank(path)){
var _465=path.split("/");
for(var p=0;p<_465.length;p++){
var _467=_465[p];
_455.push(new _407(_467,_3c0.PATH));
}
}
}
return _455;
};
function getDefaultPort(_468){
if(defaultPortsByScheme[_468.toLowerCase()]!=null){
return defaultPortsByScheme[_468];
}else{
return -1;
}
};
function defaultPortsByScheme(){
http=80;
ws=80;
wss=443;
https=443;
};
function isNotBlank(s){
return s!=null&&s.length>0;
};
var _46a=_434.prototype;
_46a.clear=function(){
this.rootNode=new Node();
};
_46a.canHandle=function(_46b){
return lookupByRequest(this.rootNode,_46b)!=null;
};
_46a.handle=function(_46c,_46d){
var _46e=lookupByRequest(this.rootNode,_46c);
if(_46e==null){
return null;
}
return _46e.handle(_46c,_46d);
};
_46a.register=function(_46f,_470){
if(_46f==null||_46f.length==0){
throw new Error("Must specify a location to handle challenges upon.");
}
if(_470==null){
throw new Error("Must specify a handler to handle challenges.");
}
addChallengeHandlerAtLocation(this.rootNode,_46f,_470);
return this;
};
_46a.unregister=function(_471,_472){
if(_471==null||_471.length==0){
throw new Error("Must specify a location to un-register challenge handlers upon.");
}
if(_472==null){
throw new Error("Must specify a handler to un-register.");
}
delChallengeHandlerAtLocation(this.rootNode,_471,_472);
return this;
};
return _434;
})();
window.NegotiableChallengeHandler=(function(){
var _473=function(){
this.candidateChallengeHandlers=new Array();
};
var _474=function(_475){
var oids=new Array();
for(var i=0;i<_475.length;i++){
oids.push(Oid.create(_475[i]).asArray());
}
var _478=GssUtils.sizeOfSpnegoInitialContextTokenWithOids(null,oids);
var _479=ByteBuffer.allocate(_478);
_479.skip(_478);
GssUtils.encodeSpnegoInitialContextTokenWithOids(null,oids,_479);
return ByteArrayUtils.arrayToByteArray(Base64Util.encodeBuffer(_479));
};
var _47a=_473.prototype;
_47a.register=function(_47b){
if(_47b==null){
throw new Error("handler is null");
}
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
if(_47b===this.candidateChallengeHandlers[i]){
return this;
}
}
this.candidateChallengeHandlers.push(_47b);
return this;
};
_47a.canHandle=function(_47d){
return _47d!=null&&_47d.authenticationScheme=="Negotiate"&&_47d.authenticationParameters==null;
};
_47a.handle=function(_47e,_47f){
if(_47e==null){
throw Error(new ArgumentError("challengeRequest is null"));
}
var _480=new _3c9();
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
var _482=this.candidateChallengeHandlers[i];
if(_482.canHandle(_47e)){
try{
var _483=_482.getSupportedOids();
for(var j=0;j<_483.length;j++){
var oid=new Oid(_483[j]).asString();
if(!_480.containsKey(oid)){
_480.put(oid,_482);
}
}
}
catch(e){
}
}
}
if(_480.isEmpty()){
_47f(null);
return;
}
};
return _473;
})();
window.NegotiableChallengeHandler=(function(){
var _486=function(){
this.loginHandler=undefined;
};
_486.prototype.getSupportedOids=function(){
return new Array();
};
return _486;
})();
window.NegotiableChallengeHandler=(function(){
var _487=function(){
this.loginHandler=undefined;
};
_487.prototype.getSupportedOids=function(){
return new Array();
};
return _487;
})();
var _488={};
(function(){
var _489={8364:128,129:129,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,141:141,381:142,143:143,144:144,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,157:157,382:158,376:159};
var _48a={128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376};
_488.toCharCode=function(n){
if(n<128||(n>159&&n<256)){
return n;
}else{
var _48c=_48a[n];
if(typeof (_48c)=="undefined"){
throw new Error("Windows1252.toCharCode could not find: "+n);
}
return _48c;
}
};
_488.fromCharCode=function(code){
if(code<256){
return code;
}else{
var _48e=_489[code];
if(typeof (_48e)=="undefined"){
throw new Error("Windows1252.fromCharCode could not find: "+code);
}
return _48e;
}
};
var _48f=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _491="\n";
var _492=function(s){
var a=[];
for(var i=0;i<s.length;i++){
var code=_488.fromCharCode(s.charCodeAt(i));
if(code==127){
i++;
if(i==s.length){
a.hasRemainder=true;
break;
}
var _497=_488.fromCharCode(s.charCodeAt(i));
switch(_497){
case 127:
a.push(127);
break;
case 48:
a.push(0);
break;
case 110:
a.push(10);
break;
case 114:
a.push(13);
break;
default:
throw new Error("Escaping format error");
}
}else{
a.push(code);
}
}
return a;
};
var _498=function(buf){
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(_488.toCharCode(n));
switch(chr){
case _48f:
a.push(_48f);
a.push(_48f);
break;
case NULL:
a.push(_48f);
a.push("0");
break;
case _491:
a.push(_48f);
a.push("n");
break;
default:
a.push(chr);
}
}
return a.join("");
};
_488.toArray=function(s,_49e){
if(_49e){
return _492(s);
}else{
var a=[];
for(var i=0;i<s.length;i++){
a.push(_488.fromCharCode(s.charCodeAt(i)));
}
return a;
}
};
_488.toByteString=function(buf,_4a2){
if(_4a2){
return _498(buf);
}else{
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
a.push(String.fromCharCode(_488.toCharCode(n)));
}
return a.join("");
}
};
})();
function CloseEvent(_4a5,_4a6,_4a7,_4a8){
this.reason=_4a8;
this.code=_4a7;
this.wasClean=_4a6;
this.type="close";
this.bubbles=true;
this.cancelable=true;
this.target=_4a5;
};
function MessageEvent(_4a9,_4aa,_4ab){
return {target:_4a9,data:_4aa,origin:_4ab,bubbles:true,cancelable:true,type:"message",lastEventId:""};
};
(function(){
if(typeof (Blob)!=="undefined"){
try{
var temp=new Blob(["Blob"]);
return;
}
catch(e){
}
}
var _4ad=function(_4ae,_4af){
var _4b0=_4af||{};
if(window.WebKitBlobBuilder){
var _4b1=new window.WebKitBlobBuilder();
for(var i=0;i<_4ae.length;i++){
var part=_4ae[i];
if(_4b0.endings){
_4b1.append(part,_4b0.endings);
}else{
_4b1.append(part);
}
}
var blob;
if(_4b0.type){
blob=_4b1.getBlob(type);
}else{
blob=_4b1.getBlob();
}
blob.slice=blob.webkitSlice||blob.slice;
return blob;
}else{
if(window.MozBlobBuilder){
var _4b1=new window.MozBlobBuilder();
for(var i=0;i<_4ae.length;i++){
var part=_4ae[i];
if(_4b0.endings){
_4b1.append(part,_4b0.endings);
}else{
_4b1.append(part);
}
}
var blob;
if(_4b0.type){
blob=_4b1.getBlob(type);
}else{
blob=_4b1.getBlob();
}
blob.slice=blob.mozSlice||blob.slice;
return blob;
}else{
var _4b5=[];
for(var i=0;i<_4ae.length;i++){
var part=_4ae[i];
if(typeof part==="string"){
var b=BlobUtils.fromString(part,_4b0.endings);
_4b5.push(b);
}else{
if(part.byteLength){
var _4b7=new Uint8Array(part);
for(var i=0;i<part.byteLength;i++){
_4b5.push(_4b7[i]);
}
}else{
if(part.length){
_4b5.push(part);
}else{
if(part._array){
_4b5.push(part._array);
}else{
throw new Error("invalid type in Blob constructor");
}
}
}
}
}
var blob=concatMemoryBlobs(_4b5);
blob.type=_4b0.type;
return blob;
}
}
};
function MemoryBlob(_4b8,_4b9){
return {_array:_4b8,size:_4b8.length,type:_4b9||"",slice:function(_4ba,end,_4bc){
var a=this._array.slice(_4ba,end);
return MemoryBlob(a,_4bc);
},toString:function(){
return "MemoryBlob: "+_4b8.toString();
}};
};
function concatMemoryBlobs(_4be){
var a=Array.prototype.concat.apply([],_4be);
return new MemoryBlob(a);
};
window.Blob=_4ad;
})();
(function(_4c0){
_4c0.BlobUtils={};
BlobUtils.asString=function asString(blob,_4c2,end){
if(blob._array){
}else{
if(FileReader){
var _4c4=new FileReader();
_4c4.readAsText(blob);
_4c4.onload=function(){
cb(_4c4.result);
};
_4c4.onerror=function(e){
console.log(e,_4c4);
};
}
}
};
BlobUtils.asNumberArray=(function(){
var _4c6=[];
var _4c7=function(){
if(_4c6.length>0){
try{
var _4c8=_4c6.shift();
_4c8.cb(_4c8.blob._array);
}
finally{
if(_4c6.length>0){
setTimeout(function(){
_4c7();
},0);
}
}
}
};
var _4c9=function(cb,blob){
if(blob._array){
_4c6.push({cb:cb,blob:blob});
if(_4c6.length==1){
setTimeout(function(){
_4c7();
},0);
}
}else{
if(FileReader){
var _4cc=new FileReader();
_4cc.readAsArrayBuffer(blob);
_4cc.onload=function(){
var _4cd=new DataView(_4cc.result);
var a=[];
for(var i=0;i<_4cc.result.byteLength;i++){
a.push(_4cd.getUint8(i));
}
cb(a);
};
}else{
throw new Error("Cannot convert Blob to binary string");
}
}
};
return _4c9;
})();
BlobUtils.asBinaryString=function asBinaryString(cb,blob){
if(blob._array){
var _4d2=blob._array;
var a=[];
for(var i=0;i<_4d2.length;i++){
a.push(String.fromCharCode(_4d2[i]));
}
setTimeout(function(){
cb(a.join(""));
},0);
}else{
if(FileReader){
var _4d5=new FileReader();
if(_4d5.readAsBinaryString){
_4d5.readAsBinaryString(blob);
_4d5.onload=function(){
cb(_4d5.result);
};
}else{
_4d5.readAsArrayBuffer(blob);
_4d5.onload=function(){
var _4d6=new DataView(_4d5.result);
var a=[];
for(var i=0;i<_4d5.result.byteLength;i++){
a.push(String.fromCharCode(_4d6.getUint8(i)));
}
cb(a.join(""));
};
}
}else{
throw new Error("Cannot convert Blob to binary string");
}
}
};
BlobUtils.fromBinaryString=function fromByteString(s){
var _4da=[];
for(var i=0;i<s.length;i++){
_4da.push(s.charCodeAt(i));
}
return BlobUtils.fromNumberArray(_4da);
};
BlobUtils.fromNumberArray=function fromNumberArray(a){
if(typeof (Uint8Array)!=="undefined"){
return new Blob([new Uint8Array(a)]);
}else{
return new Blob([a]);
}
};
BlobUtils.fromString=function fromString(s,_4de){
if(_4de&&_4de==="native"){
if(navigator.userAgent.indexOf("Windows")!=-1){
s=s.replace("\r\n","\n","g").replace("\n","\r\n","g");
}
}
var buf=new ByteBuffer();
Charset.UTF8.encode(s,buf);
var a=buf.array;
return BlobUtils.fromNumberArray(a);
};
})(window);
var _4e1=function(){
this._queue=[];
this._count=0;
this.completion;
};
_4e1.prototype.enqueue=function(cb){
var _4e3=this;
var _4e4={};
_4e4.cb=cb;
_4e4.id=this._count++;
this._queue.push(_4e4);
var func=function(){
_4e3.processQueue(_4e4.id,cb,arguments);
};
return func;
};
_4e1.prototype.processQueue=function(id,cb,args){
for(var i=0;i<this._queue.length;i++){
if(this._queue[i].id==id){
this._queue[i].args=args;
break;
}
}
while(this._queue.length&&this._queue[0].args!==undefined){
var _4ea=this._queue.shift();
_4ea.cb.apply(null,_4ea.args);
}
};
var _4eb=(function(){
var _4ec=function(_4ed,_4ee){
this.label=_4ed;
this.value=_4ee;
};
return _4ec;
})();
var _4ef=(function(){
var _4f0=function(_4f1){
var uri=new URI(_4f1);
if(isValidScheme(uri.scheme)){
this._uri=uri;
}else{
throw new Error("HttpURI - invalid scheme: "+_4f1);
}
};
function isValidScheme(_4f3){
return "http"==_4f3||"https"==_4f3;
};
var _4f4=_4f0.prototype;
_4f4.getURI=function(){
return this._uri;
};
_4f4.duplicate=function(uri){
try{
return new _4f0(uri);
}
catch(e){
throw e;
}
return null;
};
_4f4.isSecure=function(){
return ("https"==this._uri.scheme);
};
_4f4.toString=function(){
return this._uri.toString();
};
_4f0.replaceScheme=function(_4f6,_4f7){
var uri=URI.replaceProtocol(_4f6,_4f7);
return new _4f0(uri);
};
return _4f0;
})();
var _4f9=(function(){
var _4fa=function(_4fb){
var uri=new URI(_4fb);
if(isValidScheme(uri.scheme)){
this._uri=uri;
if(uri.port==undefined){
this._uri=new URI(_4fa.addDefaultPort(_4fb));
}
}else{
throw new Error("WSURI - invalid scheme: "+_4fb);
}
};
function isValidScheme(_4fd){
return "ws"==_4fd||"wss"==_4fd;
};
function duplicate(uri){
try{
return new _4fa(uri);
}
catch(e){
throw e;
}
return null;
};
var _4ff=_4fa.prototype;
_4ff.getAuthority=function(){
return this._uri.authority;
};
_4ff.isSecure=function(){
return "wss"==this._uri.scheme;
};
_4ff.getHttpEquivalentScheme=function(){
return this.isSecure()?"https":"http";
};
_4ff.toString=function(){
return this._uri.toString();
};
var _500=80;
var _501=443;
_4fa.setDefaultPort=function(uri){
if(uri.port==0){
if(uri.scheme=="ws"){
uri.port=_500;
}else{
if(uri.scheme=="wss"){
uri.port=_501;
}else{
if(uri.scheme=="http"){
uri.port=80;
}else{
if(uri.schemel=="https"){
uri.port=443;
}else{
throw new Error("Unknown protocol: "+uri.scheme);
}
}
}
}
uri.authority=uri.host+":"+uri.port;
}
};
_4fa.addDefaultPort=function(_503){
var uri=new URI(_503);
if(uri.port==undefined){
_4fa.setDefaultPort(uri);
}
return uri.toString();
};
_4fa.replaceScheme=function(_505,_506){
var uri=URI.replaceProtocol(_505,_506);
return new _4fa(uri);
};
return _4fa;
})();
var _508=(function(){
var _509={};
_509["ws"]="ws";
_509["wss"]="wss";
_509["javascript:wse"]="ws";
_509["javascript:wse+ssl"]="wss";
_509["javascript:ws"]="ws";
_509["javascript:wss"]="wss";
_509["flash:wsr"]="ws";
_509["flash:wsr+ssl"]="wss";
_509["flash:wse"]="ws";
_509["flash:wse+ssl"]="wss";
var _50a=function(_50b){
var _50c=getProtocol(_50b);
if(isValidScheme(_50c)){
this._uri=new URI(URI.replaceProtocol(_50b,_509[_50c]));
this._compositeScheme=_50c;
this._location=_50b;
}else{
throw new SyntaxError("WSCompositeURI - invalid composite scheme: "+getProtocol(_50b));
}
};
function getProtocol(_50d){
var indx=_50d.indexOf("://");
if(indx>0){
return _50d.substr(0,indx);
}else{
return "";
}
};
function isValidScheme(_50f){
return _509[_50f]!=null;
};
function duplicate(uri){
try{
return new _50a(uri);
}
catch(e){
throw e;
}
return null;
};
var _511=_50a.prototype;
_511.isSecure=function(){
var _512=this._uri.scheme;
return "wss"==_509[_512];
};
_511.getWSEquivalent=function(){
try{
var _513=_509[this._compositeScheme];
return _4f9.replaceScheme(this._location,_513);
}
catch(e){
throw e;
}
return null;
};
_511.getPlatformPrefix=function(){
if(this._compositeScheme.indexOf("javascript:")===0){
return "javascript";
}else{
if(this._compositeScheme.indexOf("flash:")===0){
return "flash";
}else{
return "";
}
}
};
_511.toString=function(){
return this._location;
};
return _50a;
})();
var _514=(function(){
var _515=function(_516,_517,_518){
if(arguments.length<3){
var s="ResumableTimer: Please specify the required parameters 'callback', 'delay', and 'updateDelayWhenPaused'.";
throw Error(s);
}
if((typeof (_516)=="undefined")||(_516==null)){
var s="ResumableTimer: Please specify required parameter 'callback'.";
throw Error(s);
}else{
if(typeof (_516)!="function"){
var s="ResumableTimer: Required parameter 'callback' must be a function.";
throw Error(s);
}
}
if(typeof (_517)=="undefined"){
var s="ResumableTimer: Please specify required parameter 'delay' of type integer.";
throw Error(s);
}else{
if((typeof (_517)!="number")||(_517<=0)){
var s="ResumableTimer: Required parameter 'delay' should be a positive integer.";
throw Error(s);
}
}
if(typeof (_518)=="undefined"){
var s="ResumableTimer: Please specify required boolean parameter 'updateDelayWhenPaused'.";
throw Error(s);
}else{
if(typeof (_518)!="boolean"){
var s="ResumableTimer: Required parameter 'updateDelayWhenPaused' is a boolean.";
throw Error(s);
}
}
this._delay=_517;
this._updateDelayWhenPaused=_518;
this._callback=_516;
this._timeoutId=-1;
this._startTime=-1;
};
var _51a=_515.prototype;
_51a.cancel=function(){
if(this._timeoutId!=-1){
window.clearTimeout(this._timeoutId);
this._timeoutId=-1;
}
this._delay=-1;
this._callback=null;
};
_51a.pause=function(){
if(this._timeoutId==-1){
return;
}
window.clearTimeout(this._timeoutId);
var _51b=new Date().getTime();
var _51c=_51b-this._startTime;
this._timeoutId=-1;
if(this._updateDelayWhenPaused){
this._delay=this._delay-_51c;
}
};
_51a.resume=function(){
if(this._timeoutId!=-1){
return;
}
if(this._callback==null){
var s="Timer cannot be resumed as it has been canceled.";
throw new Error(s);
}
this.start();
};
_51a.start=function(){
if(this._delay<0){
var s="Timer delay cannot be negative";
}
this._timeoutId=window.setTimeout(this._callback,this._delay);
this._startTime=new Date().getTime();
};
return _515;
})();
var _51f=(function(){
var _520=function(){
this._parent=null;
this._challengeResponse=new ChallengeResponse(null,null);
};
_520.prototype.toString=function(){
return "[Channel]";
};
return _520;
})();
var _521=(function(){
var _522=function(_523,_524,_525){
_51f.apply(this,arguments);
this._location=_523;
this._protocol=_524;
this._extensions=[];
this._controlFrames={};
this._controlFramesBinary={};
this._escapeSequences={};
this._handshakePayload="";
this._isEscape=false;
this._bufferedAmount=0;
};
var _526=_522.prototype=new _51f();
_526.getBufferedAmount=function(){
return this._bufferedAmount;
};
_526.toString=function(){
return "[WebSocketChannel "+_location+" "+_protocol!=null?_protocol:"-"+"]";
};
return _522;
})();
var _527=(function(){
var _528=function(){
this._nextHandler;
this._listener;
};
var _529=_528.prototype;
_529.processConnect=function(_52a,_52b,_52c){
this._nextHandler.processConnect(_52a,_52b,_52c);
};
_529.processAuthorize=function(_52d,_52e){
this._nextHandler.processAuthorize(_52d,_52e);
};
_529.processTextMessage=function(_52f,text){
this._nextHandler.processTextMessage(_52f,text);
};
_529.processBinaryMessage=function(_531,_532){
this._nextHandler.processBinaryMessage(_531,_532);
};
_529.processClose=function(_533,code,_535){
this._nextHandler.processClose(_533,code,_535);
};
_529.setIdleTimeout=function(_536,_537){
this._nextHandler.setIdleTimeout(_536,_537);
};
_529.setListener=function(_538){
this._listener=_538;
};
_529.setNextHandler=function(_539){
this._nextHandler=_539;
};
return _528;
})();
var _53a=function(_53b){
this.connectionOpened=function(_53c,_53d){
_53b._listener.connectionOpened(_53c,_53d);
};
this.textMessageReceived=function(_53e,s){
_53b._listener.textMessageReceived(_53e,s);
};
this.binaryMessageReceived=function(_540,obj){
_53b._listener.binaryMessageReceived(_540,obj);
};
this.connectionClosed=function(_542,_543,code,_545){
_53b._listener.connectionClosed(_542,_543,code,_545);
};
this.connectionError=function(_546,e){
_53b._listener.connectionError(_546,e);
};
this.connectionFailed=function(_548){
_53b._listener.connectionFailed(_548);
};
this.authenticationRequested=function(_549,_54a,_54b){
_53b._listener.authenticationRequested(_549,_54a,_54b);
};
this.redirected=function(_54c,_54d){
_53b._listener.redirected(_54c,_54d);
};
this.onBufferedAmountChange=function(_54e,n){
_53b._listener.onBufferedAmountChange(_54e,n);
};
};
var _550=(function(){
var _551=function(){
var _552="";
var _553="";
};
_551.KAAZING_EXTENDED_HANDSHAKE="x-kaazing-handshake";
_551.KAAZING_SEC_EXTENSION_REVALIDATE="x-kaazing-http-revalidate";
_551.HEADER_SEC_EXTENSIONS="X-WebSocket-Extensions";
_551.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT="x-kaazing-idle-timeout";
_551.KAAZING_SEC_EXTENSION_PING_PONG="x-kaazing-ping-pong";
return _551;
})();
var _554=(function(){
var _555=function(_556,_557){
_521.apply(this,arguments);
this.requestHeaders=[];
this.responseHeaders={};
this.readyState=WebSocket.CONNECTING;
this.authenticationReceived=false;
this.wasCleanClose=false;
this.closeCode=1006;
this.closeReason="";
this.preventFallback=false;
};
return _555;
})();
var _558=(function(){
var _559=function(){
};
var _55a=_559.prototype;
_55a.createChannel=function(_55b,_55c,_55d){
var _55e=new _554(_55b,_55c,_55d);
return _55e;
};
return _559;
})();
var _55f=(function(){
var _560=function(){
};
var _561=_560.prototype;
_561.createChannel=function(_562,_563){
var _564=new _554(_562,_563);
return _564;
};
return _560;
})();
var _565=(function(){
var _566=function(_567,_568){
this._location=_567.getWSEquivalent();
this._protocol=_568;
this._webSocket;
this._compositeScheme=_567._compositeScheme;
this._connectionStrategies=[];
this._selectedChannel;
this.readyState=0;
this._closing=false;
this._negotiatedExtensions={};
this._compositeScheme=_567._compositeScheme;
};
var _569=_566.prototype=new _521();
_569.getReadyState=function(){
return this.readyState;
};
_569.getWebSocket=function(){
return this._webSocket;
};
_569.getCompositeScheme=function(){
return this._compositeScheme;
};
_569.getNextStrategy=function(){
if(this._connectionStrategies.length<=0){
return null;
}else{
return this._connectionStrategies.shift();
}
};
_569.getRedirectPolicy=function(){
return this.getWebSocket().getRedirectPolicy();
};
return _566;
})();
var _56a=(function(){
var _56b=function(){
};
var _56c=function(_56d,_56e){
var _56f=0;
for(var i=_56e;i<_56e+4;i++){
_56f=(_56f<<8)+_56d.getAt(i);
}
return _56f;
};
var _571=function(_572){
if(_572.byteLength>3){
var _573=new DataView(_572);
return _573.getInt32(0);
}
return 0;
};
var _574=function(_575){
var _576=0;
for(var i=0;i<4;i++){
_576=(_576<<8)+_575.charCodeAt(i);
}
return _576;
};
var ping=[9,0];
var pong=[10,0];
var _57a={};
var _57b=function(_57c){
if(typeof _57a.escape==="undefined"){
var _57d=[];
var i=4;
do{
_57d[--i]=_57c&(255);
_57c=_57c>>8;
}while(i);
_57a.escape=String.fromCharCode.apply(null,_57d.concat(pong));
}
return _57a.escape;
};
var _57f=function(_580,_581,_582,_583){
if(_550.KAAZING_SEC_EXTENSION_REVALIDATE==_581._controlFrames[_583]){
var url=_582.substr(5);
if(_581._redirectUri!=null){
if(typeof (_581._redirectUri)=="string"){
var _585=new URI(_581._redirectUri);
url=_585.scheme+"://"+_585.authority+url;
}else{
url=_581._redirectUri.getHttpEquivalentScheme()+"://"+_581._redirectUri.getAuthority()+url;
}
}else{
url=_581._location.getHttpEquivalentScheme()+"://"+_581._location.getAuthority()+url;
}
_580._listener.authenticationRequested(_581,url,_550.KAAZING_SEC_EXTENSION_REVALIDATE);
}else{
if(_550.KAAZING_SEC_EXTENSION_PING_PONG==_581._controlFrames[_583]){
if(_582.charCodeAt(4)==ping[0]){
var pong=_57b(_583);
_580._nextHandler.processTextMessage(_581,pong);
}
}
}
};
var _587=_56b.prototype=new _527();
_587.handleConnectionOpened=function(_588,_589){
var _58a=_588.responseHeaders;
if(_58a[_550.HEADER_SEC_EXTENSIONS]!=null){
var _58b=_58a[_550.HEADER_SEC_EXTENSIONS];
if(_58b!=null&&_58b.length>0){
var _58c=_58b.split(",");
for(var j=0;j<_58c.length;j++){
var tmp=_58c[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _590=new WebSocketExtension(ext);
_590.enabled=true;
_590.negotiated=true;
if(tmp.length>1){
var _591=tmp[1].replace(/^\s+|\s+$/g,"");
if(_591.length==8){
try{
var _592=parseInt(_591,16);
_588._controlFrames[_592]=ext;
if(_550.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_588._controlFramesBinary[_592]=ext;
}
_590.escape=_591;
}
catch(e){
}
}
}
_588.parent._negotiatedExtensions[ext]=_590;
}
}
}
this._listener.connectionOpened(_588,_589);
};
_587.handleTextMessageReceived=function(_593,_594){
if(_593._isEscape){
_593._isEscape=false;
this._listener.textMessageReceived(_593,_594);
return;
}
if(_594==null||_594.length<4){
this._listener.textMessageReceived(_593,_594);
return;
}
var _595=_574(_594);
if(_593._controlFrames[_595]!=null){
if(_594.length==4){
_593._isEscape=true;
return;
}else{
_57f(this,_593,_594,_595);
}
}else{
this._listener.textMessageReceived(_593,_594);
}
};
_587.handleMessageReceived=function(_596,_597){
if(_596._isEscape){
_596._isEscape=false;
this._listener.binaryMessageReceived(_596,_597);
return;
}
if(typeof (_597.byteLength)!="undefined"){
var _598=_571(_597);
if(_596._controlFramesBinary[_598]!=null){
if(_597.byteLength==4){
_596._isEscape=true;
return;
}else{
_57f(this,_596,String.fromCharCode.apply(null,new Uint8Array(_597,0)),_598);
}
}else{
this._listener.binaryMessageReceived(_596,_597);
}
}else{
if(_597.constructor==ByteBuffer){
if(_597==null||_597.limit<4){
this._listener.binaryMessageReceived(_596,_597);
return;
}
var _598=_56c(_597,_597.position);
if(_596._controlFramesBinary[_598]!=null){
if(_597.limit==4){
_596._isEscape=true;
return;
}else{
_57f(this,_596,_597.getString(Charset.UTF8),_598);
}
}else{
this._listener.binaryMessageReceived(_596,_597);
}
}
}
};
_587.processTextMessage=function(_599,_59a){
if(_59a.length>=4){
var _59b=_574(_59a);
if(_599._escapeSequences[_59b]!=null){
var _59c=_59a.slice(0,4);
this._nextHandler.processTextMessage(_599,_59c);
}
}
this._nextHandler.processTextMessage(_599,_59a);
};
_587.setNextHandler=function(_59d){
var _59e=this;
this._nextHandler=_59d;
var _59f=new _53a(this);
_59f.connectionOpened=function(_5a0,_5a1){
_59e.handleConnectionOpened(_5a0,_5a1);
};
_59f.textMessageReceived=function(_5a2,buf){
_59e.handleTextMessageReceived(_5a2,buf);
};
_59f.binaryMessageReceived=function(_5a4,buf){
_59e.handleMessageReceived(_5a4,buf);
};
_59d.setListener(_59f);
};
_587.setListener=function(_5a6){
this._listener=_5a6;
};
return _56b;
})();
var _5a7=(function(){
var _5a8=function(_5a9){
this.channel=_5a9;
};
var _5aa=function(_5ab){
var _5ac=_5ab.parent;
if(_5ac){
return (_5ac.readyState>=2);
}
return false;
};
var _5ad=_5a8.prototype;
_5ad.connect=function(_5ae){
if(_5aa(this.channel)){
return;
}
var _5af=this;
var _5b0=new XMLHttpRequest0();
_5b0.withCredentials=true;
_5b0.open("GET",_5ae+"&.krn="+Math.random(),true);
if(_5af.channel._challengeResponse!=null&&_5af.channel._challengeResponse.credentials!=null){
_5b0.setRequestHeader("Authorization",_5af.channel._challengeResponse.credentials);
this.clearAuthenticationData(_5af.channel);
}
_5b0.onreadystatechange=function(){
switch(_5b0.readyState){
case 2:
if(_5b0.status==403){
_5b0.abort();
}
break;
case 4:
if(_5b0.status==401){
_5af.handle401(_5af.channel,_5ae,_5b0.getResponseHeader("WWW-Authenticate"));
return;
}
break;
}
};
_5b0.send(null);
};
_5ad.clearAuthenticationData=function(_5b1){
if(_5b1._challengeResponse!=null){
_5b1._challengeResponse.clearCredentials();
}
};
_5ad.handle401=function(_5b2,_5b3,_5b4){
if(_5aa(_5b2)){
return;
}
var _5b5=this;
var _5b6=_5b3;
if(_5b6.indexOf("/;a/")>0){
_5b6=_5b6.substring(0,_5b6.indexOf("/;a/"));
}else{
if(_5b6.indexOf("/;ae/")>0){
_5b6=_5b6.substring(0,_5b6.indexOf("/;ae/"));
}else{
if(_5b6.indexOf("/;ar/")>0){
_5b6=_5b6.substring(0,_5b6.indexOf("/;ar/"));
}
}
}
var _5b7=new ChallengeRequest(_5b6,_5b4);
var _5b8;
if(this.channel._challengeResponse.nextChallengeHandler!=null){
_5b8=this.channel._challengeResponse.nextChallengeHandler;
}else{
_5b8=_5b2.challengeHandler;
}
if(_5b8!=null&&_5b8.canHandle(_5b7)){
_5b8.handle(_5b7,function(_5b9){
try{
if(_5b9!=null&&_5b9.credentials!=null){
_5b5.channel._challengeResponse=_5b9;
_5b5.connect(_5b3);
}
}
catch(e){
}
});
}
};
return _5a8;
})();
var _5ba=(function(){
var _5bb=function(){
};
var _5bc=_5bb.prototype=new _527();
_5bc.processConnect=function(_5bd,uri,_5bf){
if(_5bd.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
if(_5bd._delegate==null){
var _5c0=new _2d6();
_5c0.parent=_5bd;
_5bd._delegate=_5c0;
_5c1(_5c0,this);
}
_5bd._delegate.connect(uri.toString(),_5bf);
};
_5bc.processTextMessage=function(_5c2,text){
if(_5c2._delegate.readyState()==WebSocket.OPEN){
_5c2._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_5bc.processBinaryMessage=function(_5c4,obj){
if(_5c4._delegate.readyState()==WebSocket.OPEN){
_5c4._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_5bc.processClose=function(_5c6,code,_5c8){
try{
_5c6._delegate.close(code,_5c8);
}
catch(e){
}
};
_5bc.setIdleTimeout=function(_5c9,_5ca){
try{
_5c9._delegate.setIdleTimeout(_5ca);
}
catch(e){
}
};
var _5c1=function(_5cb,_5cc){
var _5cd=new _53a(_5cc);
_5cb.setListener(_5cd);
};
return _5bb;
})();
var _5ce=(function(){
var _5cf=function(){
};
var _5d0=function(_5d1,_5d2,_5d3){
_5d2._redirecting=true;
_5d2._redirectUri=_5d3;
_5d1._nextHandler.processClose(_5d2);
};
var _5d4=_5cf.prototype=new _527();
_5d4.processConnect=function(_5d5,uri,_5d7){
_5d5._balanced=0;
this._nextHandler.processConnect(_5d5,uri,_5d7);
};
_5d4.handleConnectionClosed=function(_5d8,_5d9,code,_5db){
if(_5d8._redirecting==true){
_5d8._redirecting=false;
var _5dc=_5d8._redirectUri;
var _5dd=_5d8._location;
var _5de=_5d8.parent;
var _5df=_5de.getRedirectPolicy();
if(_5df instanceof HttpRedirectPolicy){
if(!_5df.isRedirectionAllowed(_5dd.toString(),_5dc.toString())){
_5d8.preventFallback=true;
var s=_5df.toString()+": Cannot redirect from "+_5dd.toString()+" to "+_5dc.toString();
this._listener.connectionClosed(_5d8,false,1006,s);
return;
}
}
_5d8._redirected=true;
_5d8.handshakePayload="";
var _5e1=[_550.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_5d8._protocol.length;i++){
_5e1.push(_5d8._protocol[i]);
}
this.processConnect(_5d8,_5d8._redirectUri,_5e1);
}else{
this._listener.connectionClosed(_5d8,_5d9,code,_5db);
}
};
_5d4.handleMessageReceived=function(_5e3,obj){
if(_5e3._balanced>1){
this._listener.binaryMessageReceived(_5e3,obj);
return;
}
var _5e5=_2b0(obj);
if(_5e5.charCodeAt(0)==61695){
if(_5e5.match("N$")){
_5e3._balanced++;
if(_5e3._balanced==1){
this._listener.connectionOpened(_5e3,_550.KAAZING_EXTENDED_HANDSHAKE);
}else{
this._listener.connectionOpened(_5e3,_5e3._acceptedProtocol||"");
}
}else{
if(_5e5.indexOf("R")==1){
var _5e6=new _4f9(_5e5.substring(2));
_5d0(this,_5e3,_5e6);
}else{
}
}
return;
}else{
this._listener.binaryMessageReceived(_5e3,obj);
}
};
_5d4.setNextHandler=function(_5e7){
this._nextHandler=_5e7;
var _5e8=new _53a(this);
var _5e9=this;
_5e8.connectionOpened=function(_5ea,_5eb){
if(_550.KAAZING_EXTENDED_HANDSHAKE!=_5eb){
_5ea._balanced=2;
_5e9._listener.connectionOpened(_5ea,_5eb);
}
};
_5e8.textMessageReceived=function(_5ec,_5ed){
if(_5ec._balanced>1){
_5e9._listener.textMessageReceived(_5ec,_5ed);
return;
}
if(_5ed.charCodeAt(0)==61695){
if(_5ed.match("N$")){
_5ec._balanced++;
if(_5ec._balanced==1){
_5e9._listener.connectionOpened(_5ec,_550.KAAZING_EXTENDED_HANDSHAKE);
}else{
_5e9._listener.connectionOpened(_5ec,"");
}
}else{
if(_5ed.indexOf("R")==1){
var _5ee=new _4f9(_5ed.substring(2));
_5d0(_5e9,_5ec,_5ee);
}else{
}
}
return;
}else{
_5e9._listener.textMessageReceived(_5ec,_5ed);
}
};
_5e8.binaryMessageReceived=function(_5ef,obj){
_5e9.handleMessageReceived(_5ef,obj);
};
_5e8.connectionClosed=function(_5f1,_5f2,code,_5f4){
_5e9.handleConnectionClosed(_5f1,_5f2,code,_5f4);
};
_5e7.setListener(_5e8);
};
_5d4.setListener=function(_5f5){
this._listener=_5f5;
};
return _5cf;
})();
var _5f6=(function(){
var _5f7="Sec-WebSocket-Protocol";
var _5f8="Sec-WebSocket-Extensions";
var _5f9="Authorization";
var _5fa="WWW-Authenticate";
var _5fb="Set-Cookie";
var _5fc="GET";
var _5fd="HTTP/1.1";
var _5fe=":";
var _5ff=" ";
var _600="\r\n";
var _601=function(){
};
var _602=function(_603,_604){
var _605=new XMLHttpRequest0();
var path=_603._location.getHttpEquivalentScheme()+"://"+_603._location.getAuthority()+(_603._location._uri.path||"");
path=path.replace(/[\/]?$/,"/;api/set-cookies");
_605.open("POST",path,true);
_605.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_605.send(_604);
};
var _607=function(_608,_609,_60a){
var _60b=[];
var _60c=[];
_60b.push("WebSocket-Protocol");
_60c.push("");
_60b.push(_5f7);
_60c.push(_609._protocol.join(","));
var _60d=[_550.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT,_550.KAAZING_SEC_EXTENSION_PING_PONG];
var ext=_609._extensions;
if(ext.length>0){
_60d.push(ext);
}
_60b.push(_5f8);
_60c.push(_60d.join(","));
_60b.push(_5f9);
_60c.push(_60a);
var _60f=_610(_609._location,_60b,_60c);
_608._nextHandler.processTextMessage(_609,_60f);
};
var _610=function(_611,_612,_613){
var _614=[];
_614.push(_5fc);
_614.push(_5ff);
var path=[];
if(_611._uri.path!=undefined){
path.push(_611._uri.path);
}
if(_611._uri.query!=undefined){
path.push("?");
path.push(_611._uri.query);
}
_614.push(path.join(""));
_614.push(_5ff);
_614.push(_5fd);
_614.push(_600);
for(var i=0;i<_612.length;i++){
var _617=_612[i];
var _618=_613[i];
if(_617!=null&&_618!=null){
_614.push(_617);
_614.push(_5fe);
_614.push(_5ff);
_614.push(_618);
_614.push(_600);
}
}
_614.push(_600);
var _619=_614.join("");
return _619;
};
var _61a=function(_61b,_61c,s){
if(s.length>0){
_61c.handshakePayload+=s;
return;
}
var _61e=_61c.handshakePayload.split("\n");
_61c.handshakePayload="";
var _61f="";
for(var i=_61e.length-1;i>=0;i--){
if(_61e[i].indexOf("HTTP/1.1")==0){
var temp=_61e[i].split(" ");
_61f=temp[1];
break;
}
}
if("101"==_61f){
var _622=[];
var _623="";
for(var i=0;i<_61e.length;i++){
var line=_61e[i];
if(line!=null&&line.indexOf(_5f8)==0){
_622.push(line.substring(_5f8.length+2));
}else{
if(line!=null&&line.indexOf(_5f7)==0){
_623=line.substring(_5f7.length+2);
}else{
if(line!=null&&line.indexOf(_5fb)==0){
_602(_61c,line.substring(_5fb.length+2));
}
}
}
}
_61c._acceptedProtocol=_623;
if(_622.length>0){
var _625=[];
var _626=_622.join(", ").split(", ");
for(var j=0;j<_626.length;j++){
var tmp=_626[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _62a=new WebSocketExtension(ext);
if(_550.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT===ext){
var _62b=tmp[1].match(/\d+/)[0];
if(_62b>0){
_61b._nextHandler.setIdleTimeout(_61c,_62b);
}
continue;
}else{
if(_550.KAAZING_SEC_EXTENSION_PING_PONG===ext){
try{
var _62c=tmp[1].replace(/^\s+|\s+$/g,"");
var _62d=parseInt(_62c,16);
_61c._controlFrames[_62d]=ext;
_61c._escapeSequences[_62d]=ext;
continue;
}
catch(e){
throw new Error("failed to parse escape key for x-kaazing-ping-pong extension");
}
}else{
if(tmp.length>1){
var _62c=tmp[1].replace(/^\s+|\s+$/g,"");
if(_62c.length==8){
try{
var _62d=parseInt(_62c,16);
_61c._controlFrames[_62d]=ext;
if(_550.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_61c._controlFramesBinary[_62d]=ext;
}
_62a.escape=_62c;
}
catch(e){
}
}
}
}
}
_62a.enabled=true;
_62a.negotiated=true;
_625.push(_626[j]);
}
if(_625.length>0){
_61c.parent._negotiatedExtensions[ext]=_625.join(",");
}
}
return;
}else{
if("401"==_61f){
_61c.handshakestatus=2;
var _62e="";
for(var i=0;i<_61e.length;i++){
if(_61e[i].indexOf(_5fa)==0){
_62e=_61e[i].substring(_5fa.length+2);
break;
}
}
_61b._listener.authenticationRequested(_61c,_61c._location.toString(),_62e);
}else{
_61b._listener.connectionFailed(_61c);
}
}
};
var _62f=function(_630,_631){
try{
_631.handshakestatus=3;
_630._nextHandler.processClose(_631);
}
finally{
_630._listener.connectionFailed(_631);
}
};
var _632=_601.prototype=new _527();
_632.processConnect=function(_633,uri,_635){
_633.handshakePayload="";
var _636=[_550.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_635.length;i++){
_636.push(_635[i]);
}
this._nextHandler.processConnect(_633,uri,_636);
if((typeof (_633.parent.connectTimer)=="undefined")||(_633.parent.connectTimer==null)){
_633.handshakestatus=0;
var _638=this;
setTimeout(function(){
if(_633.handshakestatus==0){
_62f(_638,_633);
}
},5000);
}
};
_632.processAuthorize=function(_639,_63a){
_607(this,_639,_63a);
};
_632.handleConnectionOpened=function(_63b,_63c){
if(_550.KAAZING_EXTENDED_HANDSHAKE==_63c){
_607(this,_63b,null);
_63b.handshakestatus=1;
if((typeof (_63b.parent.connectTimer)=="undefined")||(_63b.parent.connectTimer==null)){
var _63d=this;
setTimeout(function(){
if(_63b.handshakestatus<2){
_62f(_63d,_63b);
}
},5000);
}
}else{
_63b.handshakestatus=2;
this._listener.connectionOpened(_63b,_63c);
}
};
_632.handleMessageReceived=function(_63e,_63f){
if(_63e.readyState==WebSocket.OPEN){
_63e._isEscape=false;
this._listener.textMessageReceived(_63e,_63f);
}else{
_61a(this,_63e,_63f);
}
};
_632.handleBinaryMessageReceived=function(_640,_641){
if(_640.readyState==WebSocket.OPEN){
_640._isEscape=false;
this._listener.binaryMessageReceived(_640,_641);
}else{
_61a(this,_640,String.fromCharCode.apply(null,new Uint8Array(_641)));
}
};
_632.setNextHandler=function(_642){
this._nextHandler=_642;
var _643=this;
var _644=new _53a(this);
_644.connectionOpened=function(_645,_646){
_643.handleConnectionOpened(_645,_646);
};
_644.textMessageReceived=function(_647,buf){
_643.handleMessageReceived(_647,buf);
};
_644.binaryMessageReceived=function(_649,buf){
_643.handleBinaryMessageReceived(_649,buf);
};
_644.connectionClosed=function(_64b,_64c,code,_64e){
if(_64b.handshakestatus<3){
_64b.handshakestatus=3;
}
_643._listener.connectionClosed(_64b,_64c,code,_64e);
};
_644.connectionFailed=function(_64f){
if(_64f.handshakestatus<3){
_64f.handshakestatus=3;
}
_643._listener.connectionFailed(_64f);
};
_642.setListener(_644);
};
_632.setListener=function(_650){
this._listener=_650;
};
return _601;
})();
var _651=(function(){
var _652=function(){
};
var _653=_652.prototype=new _527();
_653.handleClearAuthenticationData=function(_654){
if(_654._challengeResponse!=null){
_654._challengeResponse.clearCredentials();
}
};
_653.handleRemoveAuthenticationData=function(_655){
this.handleClearAuthenticationData(_655);
_655._challengeResponse=new ChallengeResponse(null,null);
};
_653.doError=function(_656){
this._nextHandler.processClose(_656);
this.handleClearAuthenticationData(_656);
this._listener.connectionFailed(_656);
};
_653.handle401=function(_657,_658,_659){
var _65a=this;
var _65b=_657._location;
var _65c=null;
if(typeof (_657.parent.connectTimer)!="undefined"){
_65c=_657.parent.connectTimer;
if(_65c!=null){
_65c.pause();
}
}
if(_657.redirectUri!=null){
_65b=_657._redirectUri;
}
if(_550.KAAZING_SEC_EXTENSION_REVALIDATE==_659){
var ch=new _554(_65b,_657._protocol,_657._isBinary);
ch.challengeHandler=_657.parent.challengeHandler;
ch.parent=_657.parent;
var _65e=new _5a7(ch);
_65e.connect(_658);
}else{
var _65f=new ChallengeRequest(_65b.toString(),_659);
var _660;
if(_657._challengeResponse.nextChallengeHandler!=null){
_660=_657._challengeResponse.nextChallengeHandler;
}else{
_660=_657.parent.challengeHandler;
}
if(_660!=null&&_660.canHandle(_65f)){
_660.handle(_65f,function(_661){
try{
if(_661==null||_661.credentials==null){
_65a.doError(_657);
}else{
if(_65c!=null){
_65c.resume();
}
_657._challengeResponse=_661;
_65a._nextHandler.processAuthorize(_657,_661.credentials);
}
}
catch(e){
_65a.doError(_657);
}
});
}else{
this.doError(_657);
}
}
};
_653.handleAuthenticate=function(_662,_663,_664){
_662.authenticationReceived=true;
this.handle401(_662,_663,_664);
};
_653.setNextHandler=function(_665){
this._nextHandler=_665;
var _666=this;
var _667=new _53a(this);
_667.authenticationRequested=function(_668,_669,_66a){
_666.handleAuthenticate(_668,_669,_66a);
};
_665.setListener(_667);
};
_653.setListener=function(_66b){
this._listener=_66b;
};
return _652;
})();
var _66c=(function(){
var _66d=function(){
};
var _66e=_66d.prototype=new _527();
_66e.processConnect=function(_66f,uri,_671){
this._nextHandler.processConnect(_66f,uri,_671);
};
_66e.processBinaryMessage=function(_672,data){
if(data.constructor==ByteBuffer){
var _674=data.array.slice(data.position,data.limit);
this._nextHandler.processTextMessage(_672,Charset.UTF8.encodeByteArray(_674));
}else{
if(data.byteLength){
this._nextHandler.processTextMessage(_672,Charset.UTF8.encodeArrayBuffer(data));
}else{
if(data.size){
var _675=this;
var cb=function(_677){
_675._nextHandler.processBinaryMessage(_672,Charset.UTF8.encodeByteArray(_677));
};
BlobUtils.asNumberArray(cb,data);
}else{
throw new Error("Invalid type for send");
}
}
}
};
_66e.setNextHandler=function(_678){
this._nextHandler=_678;
var _679=this;
var _67a=new _53a(this);
_67a.textMessageReceived=function(_67b,text){
_679._listener.binaryMessageReceived(_67b,ByteBuffer.wrap(Charset.UTF8.toByteArray(text)));
};
_67a.binaryMessageReceived=function(_67d,buf){
throw new Error("draft76 won't receive binary frame");
};
_678.setListener(_67a);
};
_66e.setListener=function(_67f){
this._listener=_67f;
};
return _66d;
})();
var _680=(function(){
var _681=function(){
var _682=new _651();
return _682;
};
var _683=function(){
var _684=new _5f6();
return _684;
};
var _685=function(){
var _686=new _56a();
return _686;
};
var _687=function(){
var _688=new _5ce();
return _688;
};
var _689=function(){
var _68a=new _5ba();
return _68a;
};
var _68b=function(){
var _68c=new _66c();
return _68c;
};
var _68d=(browser=="safari"&&typeof (WebSocket.CLOSING)=="undefined");
var _68e=_681();
var _68f=_683();
var _690=_685();
var _691=_687();
var _692=_689();
var _693=_68b();
var _694=function(){
if(_68d){
this.setNextHandler(_693);
_693.setNextHandler(_68e);
}else{
this.setNextHandler(_68e);
}
_68e.setNextHandler(_68f);
_68f.setNextHandler(_690);
_690.setNextHandler(_691);
_691.setNextHandler(_692);
};
var _695=function(_696,_697){
};
var _698=_694.prototype=new _527();
_698.setNextHandler=function(_699){
this._nextHandler=_699;
var _69a=new _53a(this);
_699.setListener(_69a);
};
_698.setListener=function(_69b){
this._listener=_69b;
};
return _694;
})();
var _69c=(function(){
var _69d=512*1024;
var _69e=1;
var _69f=function(_6a0,_6a1){
this.sequence=_6a1;
this.retry=3000;
if(_6a0.indexOf("/;e/dtem/")>0){
this.requiresEscaping=true;
}
var _6a2=new URI(_6a0);
var _6a3={"http":80,"https":443};
if(_6a2.port==undefined){
_6a2.port=_6a3[_6a2.scheme];
_6a2.authority=_6a2.host+":"+_6a2.port;
}
this.origin=_6a2.scheme+"://"+_6a2.authority;
this.location=_6a0;
this.activeXhr=null;
this.reconnectTimer=null;
this.idleTimer=null;
this.idleTimeout=null;
this.lastMessageTimestamp=null;
this.buf=new ByteBuffer();
var _6a4=this;
setTimeout(function(){
connect(_6a4,true);
_6a4.activeXhr=_6a4.mostRecentXhr;
startProxyDetectionTimer(_6a4,_6a4.mostRecentXhr);
},0);
};
var _6a5=_69f.prototype;
var _6a6=0;
var _6a7=255;
var _6a8=1;
var _6a9=128;
var _6aa=129;
var _6ab=127;
var _6ac=137;
var _6ad=3000;
_6a5.readyState=0;
function connect(_6ae,_6af){
if(_6ae.reconnectTimer!==null){
_6ae.reconnectTimer=null;
}
stopIdleTimer(_6ae);
var _6b0=new URI(_6ae.location);
var _6b1=[];
var _6b2=_6ae.sequence++;
_6b1.push(".ksn="+_6b2);
switch(browser){
case "ie":
_6b1.push(".kns=1");
_6b1.push(".kf=200&.kp=2048");
break;
case "safari":
_6b1.push(".kp=256");
break;
case "firefox":
_6b1.push(".kp=1025");
break;
case "android":
_6b1.push(".kp=4096");
_6b1.push(".kbp=4096");
break;
}
if(browser=="android"||browser.ios){
_6b1.push(".kkt=20");
}
_6b1.push(".kc=text/plain;charset=windows-1252");
_6b1.push(".kb=4096");
_6b1.push(".kid="+String(Math.random()).substring(2));
if(_6b1.length>0){
if(_6b0.query===undefined){
_6b0.query=_6b1.join("&");
}else{
_6b0.query+="&"+_6b1.join("&");
}
}
var xhr=new XMLHttpRequest0();
xhr.id=_69e++;
xhr.position=0;
xhr.opened=false;
xhr.reconnect=false;
xhr.requestClosing=false;
xhr.onreadystatechange=function(){
if(xhr.readyState==3){
if(_6ae.idleTimer==null){
var _6b4=xhr.getResponseHeader("X-Idle-Timeout");
if(_6b4){
var _6b5=parseInt(_6b4);
if(_6b5>0){
_6b5=_6b5*1000;
_6ae.idleTimeout=_6b5;
_6ae.lastMessageTimestamp=new Date().getTime();
startIdleTimer(_6ae,_6b5);
}
}
}
}
};
xhr.onprogress=function(){
if(xhr==_6ae.activeXhr&&_6ae.readyState!=2){
_process(_6ae);
}
};
xhr.onload=function(){
if(xhr==_6ae.activeXhr&&_6ae.readyState!=2){
_process(_6ae);
xhr.onerror=function(){
};
xhr.ontimeout=function(){
};
xhr.onreadystatechange=function(){
};
if(!xhr.reconnect){
doError(_6ae);
}else{
if(xhr.requestClosing){
doClose(_6ae);
}else{
if(_6ae.activeXhr==_6ae.mostRecentXhr){
connect(_6ae);
_6ae.activeXhr=_6ae.mostRecentXhr;
startProxyDetectionTimer(_6ae,_6ae.activeXhr);
}else{
var _6b6=_6ae.mostRecentXhr;
_6ae.activeXhr=_6b6;
switch(_6b6.readyState){
case 1:
case 2:
startProxyDetectionTimer(_6ae,_6b6);
break;
case 3:
_process(_6ae);
break;
case 4:
_6ae.activeXhr.onload();
break;
default:
}
}
}
}
}
};
xhr.ontimeout=function(){
doError(_6ae);
};
xhr.onerror=function(){
doError(_6ae);
};
xhr.open("GET",_6b0.toString(),true);
xhr.send("");
_6ae.mostRecentXhr=xhr;
};
function startProxyDetectionTimer(_6b7,xhr){
if(_6b7.location.indexOf(".ki=p")==-1){
setTimeout(function(){
if(xhr&&xhr.readyState<3&&_6b7.readyState<2){
if(_6b7.location.indexOf("?")==-1){
_6b7.location+="?.ki=p";
}else{
_6b7.location+="&.ki=p";
}
connect(_6b7,false);
}
},_6ad);
}
};
_6a5.disconnect=function(){
if(this.readyState!==2){
_disconnect(this);
}
};
function _disconnect(_6b9){
if(_6b9.reconnectTimer!==null){
clearTimeout(_6b9.reconnectTimer);
_6b9.reconnectTimer=null;
}
stopIdleTimer(_6b9);
if(_6b9.mostRecentXhr!==null){
_6b9.mostRecentXhr.onprogress=function(){
};
_6b9.mostRecentXhr.onload=function(){
};
_6b9.mostRecentXhr.onerror=function(){
};
_6b9.mostRecentXhr.abort();
}
if(_6b9.activeXhr!=_6b9.mostRecentXhr&&_6b9.activeXhr!==null){
_6b9.activeXhr.onprogress=function(){
};
_6b9.activeXhr.onload=function(){
};
_6b9.activeXhr.onerror=function(){
};
_6b9.activeXhr.abort();
}
_6b9.lineQueue=[];
_6b9.lastEventId=null;
_6b9.location=null;
_6b9.readyState=2;
};
function _process(_6ba){
_6ba.lastMessageTimestamp=new Date().getTime();
var xhr=_6ba.activeXhr;
var _6bc=xhr.responseText;
if(_6bc.length>=_69d){
if(_6ba.activeXhr==_6ba.mostRecentXhr){
connect(_6ba,false);
}
}
var _6bd=_6bc.slice(xhr.position);
xhr.position=_6bc.length;
var buf=_6ba.buf;
var _6bf=_488.toArray(_6bd,_6ba.requiresEscaping);
if(_6bf.hasRemainder){
xhr.position--;
}
buf.position=buf.limit;
buf.putBytes(_6bf);
buf.position=0;
buf.mark();
parse:
while(true){
if(!buf.hasRemaining()){
break;
}
var type=buf.getUnsigned();
switch(type&128){
case _6a6:
var _6c1=buf.indexOf(_6a7);
if(_6c1==-1){
break parse;
}
var _6c2=buf.array.slice(buf.position,_6c1);
var data=new ByteBuffer(_6c2);
var _6c4=_6c1-buf.position;
buf.skip(_6c4+1);
buf.mark();
if(type==_6a8){
handleCommandFrame(_6ba,data);
}else{
dispatchText(_6ba,data.getString(Charset.UTF8));
}
break;
case _6a9:
case _6aa:
var _6c5=0;
var _6c6=false;
while(buf.hasRemaining()){
var b=buf.getUnsigned();
_6c5=_6c5<<7;
_6c5|=(b&127);
if((b&128)!=128){
_6c6=true;
break;
}
}
if(!_6c6){
break parse;
}
if(buf.remaining()<_6c5){
break parse;
}
var _6c8=buf.array.slice(buf.position,buf.position+_6c5);
var _6c9=new ByteBuffer(_6c8);
buf.skip(_6c5);
buf.mark();
if(type==_6a9){
dispatchBytes(_6ba,_6c9);
}else{
if(type==_6ac){
dispatchPingReceived(_6ba);
}else{
dispatchText(_6ba,_6c9.getString(Charset.UTF8));
}
}
break;
default:
throw new Error("Emulation protocol error. Unknown frame type: "+type);
}
}
buf.reset();
buf.compact();
};
function handleCommandFrame(_6ca,data){
while(data.remaining()){
var _6cc=String.fromCharCode(data.getUnsigned());
switch(_6cc){
case "0":
break;
case "1":
_6ca.activeXhr.reconnect=true;
break;
case "2":
_6ca.activeXhr.requestClosing=true;
break;
default:
throw new Error("Protocol decode error. Unknown command: "+_6cc);
}
}
};
function dispatchBytes(_6cd,buf){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6cd.lastEventId;
e.data=buf;
e.decoder=_2a9;
e.origin=_6cd.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6cd.onmessage)==="function"){
_6cd.onmessage(e);
}
};
function dispatchText(_6d0,data){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6d0.lastEventId;
e.text=data;
e.origin=_6d0.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6d0.onmessage)==="function"){
_6d0.onmessage(e);
}
};
function dispatchPingReceived(_6d3){
if(typeof (_6d3.onping)==="function"){
_6d3.onping();
}
};
function doClose(_6d4){
doError(_6d4);
};
function doError(_6d5){
if(_6d5.readyState!=2){
_6d5.disconnect();
fireError(_6d5);
}
};
function fireError(_6d6){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_6d6.onerror)==="function"){
_6d6.onerror(e);
}
};
function startIdleTimer(_6d8,_6d9){
stopIdleTimer(_6d8);
_6d8.idleTimer=setTimeout(function(){
idleTimerHandler(_6d8);
},_6d9);
};
function idleTimerHandler(_6da){
var _6db=new Date().getTime();
var _6dc=_6db-_6da.lastMessageTimestamp;
var _6dd=_6da.idleTimeout;
if(_6dc>_6dd){
doError(_6da);
}else{
startIdleTimer(_6da,_6dd-_6dc);
}
};
function stopIdleTimer(_6de){
if(_6de.idleTimer!=null){
clearTimeout(_6de.idleTimer);
_6de.IdleTimer=null;
}
};
return _69f;
})();
var _6df=(function(){
var _6e0=function(){
this.parent;
this._listener;
this.closeCode=1005;
this.closeReason="";
this.sequence=0;
};
var _6e1=_6e0.prototype;
_6e1.connect=function(_6e2,_6e3){
this.URL=_6e2.replace("ws","http");
this.protocol=_6e3;
this._prepareQueue=new _4e1();
this._sendQueue=[];
_6e4(this);
};
_6e1.readyState=0;
_6e1.bufferedAmount=0;
_6e1.URL="";
_6e1.onopen=function(){
};
_6e1.onerror=function(){
};
_6e1.onmessage=function(_6e5){
};
_6e1.onclose=function(){
};
var _6e6=128;
var _6e7=129;
var _6e8=0;
var _6e9=255;
var _6ea=1;
var _6eb=138;
var _6ec=[_6ea,48,49,_6e9];
var _6ed=[_6ea,48,50,_6e9];
var _6ee=function(buf,_6f0){
var _6f1=0;
var _6f2=0;
do{
_6f2<<=8;
_6f2|=(_6f0&127);
_6f0>>=7;
_6f1++;
}while(_6f0>0);
do{
var _6f3=_6f2&255;
_6f2>>=8;
if(_6f1!=1){
_6f3|=128;
}
buf.put(_6f3);
}while(--_6f1>0);
};
_6e1.send=function(data){
var _6f5=this;
switch(this.readyState){
case 0:
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
throw new Error("data is null");
}
var buf=new ByteBuffer();
if(typeof data=="string"){
var _6f7=new ByteBuffer();
_6f7.putString(data,Charset.UTF8);
buf.put(_6e7);
_6ee(buf,_6f7.position);
buf.putBytes(_6f7.array);
}else{
if(data.constructor==ByteBuffer){
buf.put(_6e6);
_6ee(buf,data.remaining());
buf.putBuffer(data);
}else{
if(data.byteLength){
buf.put(_6e6);
_6ee(buf,data.byteLength);
buf.putByteArray(data);
}else{
if(data.size){
var cb=this._prepareQueue.enqueue(function(_6f9){
var b=new ByteBuffer();
b.put(_6e6);
_6ee(b,_6f9.length);
b.putBytes(_6f9);
b.flip();
doSend(_6f5,b);
});
BlobUtils.asNumberArray(cb,data);
return true;
}else{
throw new Error("Invalid type for send");
}
}
}
}
buf.flip();
this._prepareQueue.enqueue(function(_6fb){
doSend(_6f5,buf);
})();
return true;
case 2:
return false;
default:
throw new Error("INVALID_STATE_ERR");
}
};
_6e1.close=function(code,_6fd){
switch(this.readyState){
case 0:
_6fe(this);
break;
case 1:
if(code!=null&&code!=0){
this.closeCode=code;
this.closeReason=_6fd;
}
doSend(this,new ByteBuffer(_6ed));
break;
}
};
_6e1.setListener=function(_6ff){
this._listener=_6ff;
};
function openUpstream(_700){
if(_700.readyState!=1){
return;
}
if(_700.idleTimer){
clearTimeout(_700.idleTimer);
}
var xdr=new XMLHttpRequest0();
xdr.onreadystatechange=function(){
if(xdr.readyState==4){
switch(xdr.status){
case 200:
setTimeout(function(){
doFlush(_700);
},0);
break;
}
}
};
xdr.onload=function(){
openUpstream(_700);
};
xdr.open("POST",_700._upstream+"&.krn="+Math.random(),true);
_700.upstreamXHR=xdr;
_700.idleTimer=setTimeout(function(){
if(_700.upstreamXHR!=null){
_700.upstreamXHR.abort();
}
openUpstream(_700);
},30000);
};
function doSend(_702,buf){
_702.bufferedAmount+=buf.remaining();
_702._sendQueue.push(buf);
_704(_702);
if(!_702._writeSuspended){
doFlush(_702);
}
};
function doFlush(_705){
var _706=_705._sendQueue;
var _707=_706.length;
_705._writeSuspended=(_707>0);
if(_707>0){
var _708=_705.sequence++;
if(_705.useXDR){
var out=new ByteBuffer();
while(_706.length){
out.putBuffer(_706.shift());
}
out.putBytes(_6ec);
out.flip();
_705.upstreamXHR.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_705.upstreamXHR.setRequestHeader("X-Sequence-No",_708.toString());
_705.upstreamXHR.send(_2c4(out,_705.requiresEscaping));
}else{
var xhr=new XMLHttpRequest0();
xhr.open("POST",_705._upstream+"&.krn="+Math.random(),true);
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
switch(xhr.status){
case 200:
setTimeout(function(){
doFlush(_705);
},0);
break;
default:
_6fe(_705);
break;
}
}
};
var out=new ByteBuffer();
while(_706.length){
out.putBuffer(_706.shift());
}
out.putBytes(_6ec);
out.flip();
xhr.setRequestHeader("X-Sequence-No",_708.toString());
if(browser=="firefox"){
if(xhr.sendAsBinary){
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.sendAsBinary(_2c4(out));
}else{
xhr.send(_2c4(out));
}
}else{
xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
xhr.send(_2c4(out,_705.requiresEscaping));
}
}
}
_705.bufferedAmount=0;
_704(_705);
};
var _6e4=function(_70b){
var url=new URI(_70b.URL);
url.scheme=url.scheme.replace("ws","http");
locationURI=new URI((browser=="ie")?document.URL:location.href);
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&url.scheme===locationURI.scheme){
_70b.useXDR=true;
}
switch(browser){
case "opera":
_70b.requiresEscaping=true;
break;
case "ie":
if(!_70b.useXDR){
_70b.requiresEscaping=true;
}else{
if((typeof (Object.defineProperties)==="undefined")&&(navigator.userAgent.indexOf("MSIE 8")>0)){
_70b.requiresEscaping=true;
}else{
_70b.requiresEscaping=false;
}
}
break;
default:
_70b.requiresEscaping=false;
break;
}
var _70d=_70b.requiresEscaping?"/;e/ctem":"/;e/ctm";
url.path=url.path.replace(/[\/]?$/,_70d);
var _70e=url.toString();
var _70f=_70e.indexOf("?");
if(_70f==-1){
_70e+="?";
}else{
_70e+="&";
}
_70e+=".kn="+String(Math.random()).substring(2);
var _710=new XMLHttpRequest0();
var _711=false;
_710.withCredentials=true;
_710.open("GET",_70e,true);
_710.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_710.setRequestHeader("X-WebSocket-Version","wseb-1.0");
_710.setRequestHeader("X-Accept-Commands","ping");
var _712=_70b.sequence++;
_710.setRequestHeader("X-Sequence-No",_712.toString());
if(_70b.protocol.length){
var _713=_70b.protocol.join(",");
_710.setRequestHeader("X-WebSocket-Protocol",_713);
}
for(var i=0;i<_70b.parent.requestHeaders.length;i++){
var _715=_70b.parent.requestHeaders[i];
_710.setRequestHeader(_715.label,_715.value);
}
_710.onredirectallowed=function(_716,_717){
var _718=_70b.parent.parent;
var _719=_718.getRedirectPolicy();
if((typeof (_719)!="undefined")&&(_719!=null)){
if(!_719.isRedirectionAllowed(_716,_717)){
_710.statusText=_719.toString()+": Cannot redirect from "+_716+" to "+_717;
_70b.closeCode=1006;
_70b.closeReason=_710.statusText;
_70b.parent.closeCode=_70b.closeCode;
_70b.parent.closeReason=_70b.closeReason;
_70b.parent.preventFallback=true;
doError(_70b);
return false;
}
}
return true;
};
_710.onreadystatechange=function(){
switch(_710.readyState){
case 2:
if(_710.status==403){
doError(_70b);
}else{
var _71a=_70b.parent.parent._webSocket.connectTimeout;
if(_71a==0){
_71a=5000;
}
timer=setTimeout(function(){
if(!_711){
doError(_70b);
}
},_71a);
}
break;
case 3:
break;
case 4:
_711=true;
if(_710.status==401){
_70b._listener.authenticationRequested(_70b.parent,_710._location,_710.getResponseHeader("WWW-Authenticate"));
return;
}
if(_70b.readyState<1){
if(_710.status==201){
var _71b=_710.responseText.split("\n");
var _71c=_71b[0];
var _71d=_71b[1];
var _71e=new URI(_710.xhr._location);
var _71f=new URI(_71c);
var _720=new URI(_71d);
if(_71e.host.toLowerCase()!=_71f.host.toLowerCase()){
throw new Error("Hostname in original URI does not match with the hostname in the upstream URI.");
}
if(_71e.host.toLowerCase()!=_720.host.toLowerCase()){
throw new Error("Hostname in original URI does not match with the hostname in the downstream URI.");
}
_70b._upstream=_71e.scheme+"://"+_71e.authority+_71f.path;
_70b._downstream=new _69c(_71d,_70b.sequence);
var _721=_71d.substring(0,_71d.indexOf("/;e/"));
if(_721!=_70b.parent._location.toString().replace("ws","http")){
_70b.parent._redirectUri=_721;
}
_722(_70b,_70b._downstream);
_70b.parent.responseHeaders=_710.getAllResponseHeaders();
_723(_70b);
}else{
doError(_70b);
}
}
break;
}
};
_710.send(null);
};
var _723=function(_724){
_724.readyState=1;
var _725=_724.parent;
_725._acceptedProtocol=_725.responseHeaders["X-WebSocket-Protocol"]||"";
if(_724.useXDR){
this.upstreamXHR=null;
openUpstream(_724);
}
_724._listener.connectionOpened(_724.parent,_725._acceptedProtocol);
};
function doError(_726){
if(_726.readyState<2){
_726.readyState=2;
if(_726.idleTimer){
clearTimeout(_726.idleTimer);
}
if(_726.upstreamXHR!=null){
_726.upstreamXHR.abort();
}
if(_726.onerror!=null){
_726._listener.connectionFailed(_726.parent);
}
}
};
var _6fe=function(_727,_728,code,_72a){
switch(_727.readyState){
case 2:
break;
case 0:
case 1:
_727.readyState=WebSocket.CLOSED;
if(_727.idleTimer){
clearTimeout(_727.idleTimer);
}
if(_727.upstreamXHR!=null){
_727.upstreamXHR.abort();
}
if(typeof _728==="undefined"){
_727._listener.connectionClosed(_727.parent,true,1005,"");
}else{
_727._listener.connectionClosed(_727.parent,_728,code,_72a);
}
break;
default:
}
};
var _704=function(_72b){
};
var _72c=function(_72d,_72e){
if(_72e.text){
_72d._listener.textMessageReceived(_72d.parent,_72e.text);
}else{
if(_72e.data){
_72d._listener.binaryMessageReceived(_72d.parent,_72e.data);
}
}
};
var _72f=function(_730){
var _731=ByteBuffer.allocate(2);
_731.put(_6eb);
_731.put(0);
_731.flip();
doSend(_730,_731);
};
var _722=function(_732,_733){
_733.onmessage=function(_734){
switch(_734.type){
case "message":
if(_732.readyState==1){
_72c(_732,_734);
}
break;
}
};
_733.onping=function(){
if(_732.readyState==1){
_72f(_732);
}
};
_733.onerror=function(){
try{
_733.disconnect();
}
finally{
_6fe(_732,true,_732.closeCode,_732.closeReason);
}
};
_733.onclose=function(_735){
try{
_733.disconnect();
}
finally{
_6fe(_732,true,this.closeCode,this.closeReason);
}
};
};
return _6e0;
})();
var _736=(function(){
var _737=function(){
};
var _738=_737.prototype=new _527();
_738.processConnect=function(_739,uri,_73b){
if(_739.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
var _73c=!!window.MockWseTransport?new MockWseTransport():new _6df();
_73c.parent=_739;
_739._delegate=_73c;
_73d(_73c,this);
_73c.connect(uri.toString(),_73b);
};
_738.processTextMessage=function(_73e,text){
if(_73e.readyState==WebSocket.OPEN){
_73e._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_738.processBinaryMessage=function(_740,obj){
if(_740.readyState==WebSocket.OPEN){
_740._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_738.processClose=function(_742,code,_744){
try{
_742._delegate.close(code,_744);
}
catch(e){
listener.connectionClosed(_742);
}
};
var _73d=function(_745,_746){
var _747=new _53a(_746);
_745.setListener(_747);
};
return _737;
})();
var _748=(function(){
var _749=function(){
};
var _74a=_749.prototype=new _527();
_74a.handleClearAuthenticationData=function(_74b){
if(_74b._challengeResponse!=null){
_74b._challengeResponse.clearCredentials();
}
};
_74a.handleRemoveAuthenticationData=function(_74c){
this.handleClearAuthenticationData(_74c);
_74c._challengeResponse=new ChallengeResponse(null,null);
};
_74a.handle401=function(_74d,_74e,_74f){
var _750=this;
var _751=null;
if(typeof (_74d.parent.connectTimer)!="undefined"){
_751=_74d.parent.connectTimer;
if(_751!=null){
_751.pause();
}
}
if(_550.KAAZING_SEC_EXTENSION_REVALIDATE==_74f){
var _752=new _5a7(_74d);
_74d.challengeHandler=_74d.parent.challengeHandler;
_752.connect(_74e);
}else{
var _753=_74e;
if(_753.indexOf("/;e/")>0){
_753=_753.substring(0,_753.indexOf("/;e/"));
}
var _754=new _4f9(_753.replace("http","ws"));
var _755=new ChallengeRequest(_753,_74f);
var _756;
if(_74d._challengeResponse.nextChallengeHandler!=null){
_756=_74d._challengeResponse.nextChallengeHandler;
}else{
_756=_74d.parent.challengeHandler;
}
if(_756!=null&&_756.canHandle(_755)){
_756.handle(_755,function(_757){
try{
if(_757==null||_757.credentials==null){
_750.handleClearAuthenticationData(_74d);
_750._listener.connectionFailed(_74d);
}else{
if(_751!=null){
_751.resume();
}
_74d._challengeResponse=_757;
_750.processConnect(_74d,_754,_74d._protocol);
}
}
catch(e){
_750.handleClearAuthenticationData(_74d);
_750._listener.connectionFailed(_74d);
}
});
}else{
this.handleClearAuthenticationData(_74d);
this._listener.connectionFailed(_74d);
}
}
};
_74a.processConnect=function(_758,_759,_75a){
if(_758._challengeResponse!=null&&_758._challengeResponse.credentials!=null){
var _75b=_758._challengeResponse.credentials.toString();
for(var i=_758.requestHeaders.length-1;i>=0;i--){
if(_758.requestHeaders[i].label==="Authorization"){
_758.requestHeaders.splice(i,1);
}
}
var _75d=new _4eb("Authorization",_75b);
for(var i=_758.requestHeaders.length-1;i>=0;i--){
if(_758.requestHeaders[i].label==="Authorization"){
_758.requestHeaders.splice(i,1);
}
}
_758.requestHeaders.push(_75d);
this.handleClearAuthenticationData(_758);
}
this._nextHandler.processConnect(_758,_759,_75a);
};
_74a.handleAuthenticate=function(_75e,_75f,_760){
_75e.authenticationReceived=true;
this.handle401(_75e,_75f,_760);
};
_74a.setNextHandler=function(_761){
this._nextHandler=_761;
var _762=new _53a(this);
var _763=this;
_762.authenticationRequested=function(_764,_765,_766){
_763.handleAuthenticate(_764,_765,_766);
};
_761.setListener(_762);
};
_74a.setListener=function(_767){
this._listener=_767;
};
return _749;
})();
var _768=(function(){
var _769=new _748();
var _76a=new _56a();
var _76b=new _736();
var _76c=function(){
this.setNextHandler(_769);
_769.setNextHandler(_76a);
_76a.setNextHandler(_76b);
};
var _76d=_76c.prototype=new _527();
_76d.processConnect=function(_76e,_76f,_770){
var _771=[];
for(var i=0;i<_770.length;i++){
_771.push(_770[i]);
}
var _773=_76e._extensions;
if(_773.length>0){
_76e.requestHeaders.push(new _4eb(_550.HEADER_SEC_EXTENSIONS,_773.join(";")));
}
this._nextHandler.processConnect(_76e,_76f,_771);
};
_76d.setNextHandler=function(_774){
this._nextHandler=_774;
var _775=this;
var _776=new _53a(this);
_776.commandMessageReceived=function(_777,_778){
if(_778=="CloseCommandMessage"&&_777.readyState==1){
}
_775._listener.commandMessageReceived(_777,_778);
};
_774.setListener(_776);
};
_76d.setListener=function(_779){
this._listener=_779;
};
return _76c;
})();
var _77a=(function(){
var _77b=function(){
};
var _77c=_77b.prototype=new _527();
_77c.processConnect=function(_77d,uri,_77f){
if(_77d.readyState==2){
throw new Error("WebSocket is already closed");
}
var _780=new _306();
_780.parent=_77d;
_77d._delegate=_780;
_781(_780,this);
_780.connect(uri.toString(),_77f);
};
_77c.processTextMessage=function(_782,text){
if(_782.readyState==1){
_782._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_77c.processBinaryMessage=function(_784,_785){
if(_784.readyState==1){
_784._delegate.send(_785);
}else{
throw new Error("WebSocket is already closed");
}
};
_77c.processClose=function(_786,code,_788){
_786._delegate.close(code,_788);
};
var _781=function(_789,_78a){
var _78b=new _53a(_78a);
_789.setListener(_78b);
_78b.redirected=function(_78c,_78d){
_78c._redirectUri=_78d;
};
};
return _77b;
})();
var _78e=(function(){
var _78f=function(){
var _790=new _748();
return _790;
};
var _791=function(){
var _792=new _56a();
return _792;
};
var _793=function(){
var _794=new _77a();
return _794;
};
var _795=_78f();
var _796=_791();
var _797=_793();
var _798=function(){
this.setNextHandler(_795);
_795.setNextHandler(_796);
_796.setNextHandler(_797);
};
var _799=_798.prototype=new _527();
_799.processConnect=function(_79a,_79b,_79c){
var _79d=[_550.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_79c.length;i++){
_79d.push(_79c[i]);
}
var _79f=_79a._extensions;
if(_79f.length>0){
_79a.requestHeaders.push(new _4eb(_550.HEADER_SEC_EXTENSIONS,_79f.join(";")));
}
this._nextHandler.processConnect(_79a,_79b,_79d);
};
_799.setNextHandler=function(_7a0){
this._nextHandler=_7a0;
var _7a1=new _53a(this);
_7a0.setListener(_7a1);
};
_799.setListener=function(_7a2){
this._listener=_7a2;
};
return _798;
})();
var _7a3=(function(){
var _7a4;
var _7a5=function(){
_7a4=this;
};
var _7a6=_7a5.prototype=new _527();
_7a6.processConnect=function(_7a7,uri,_7a9){
if(_7a7.readyState==2){
throw new Error("WebSocket is already closed");
}
var _7aa=new _336();
_7aa.parent=_7a7;
_7a7._delegate=_7aa;
_7ab(_7aa,this);
_7aa.connect(uri.toString(),_7a9);
};
_7a6.processTextMessage=function(_7ac,text){
if(_7ac.readyState==1){
_7ac._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_7a6.processBinaryMessage=function(_7ae,_7af){
if(_7ae.readyState==1){
_7ae._delegate.send(_7af);
}else{
throw new Error("WebSocket is already closed");
}
};
_7a6.processClose=function(_7b0,code,_7b2){
_7b0._delegate.close(code,_7b2);
};
var _7ab=function(_7b3,_7b4){
var _7b5=new _53a(_7b4);
_7b5.redirected=function(_7b6,_7b7){
_7b6._redirectUri=_7b7;
};
_7b3.setListener(_7b5);
};
return _7a5;
})();
var _7b8=(function(){
var _7b9=function(){
var _7ba=new _748();
return _7ba;
};
var _7bb=function(){
var _7bc=new _56a();
return _7bc;
};
var _7bd=function(){
var _7be=new _7a3();
return _7be;
};
var _7bf=_7b9();
var _7c0=_7bb();
var _7c1=_7bd();
var _7c2=function(){
this.setNextHandler(_7bf);
_7bf.setNextHandler(_7c0);
_7c0.setNextHandler(_7c1);
};
var _7c3=function(_7c4,_7c5){
};
var _7c6=_7c2.prototype=new _527();
_7c6.setNextHandler=function(_7c7){
this._nextHandler=_7c7;
var _7c8=new _53a(this);
_7c7.setListener(_7c8);
};
_7c6.setListener=function(_7c9){
this._listener=_7c9;
};
return _7c2;
})();
var _7ca=(function(){
var _7cb=function(){
};
var _7cc=_7cb.prototype=new _527();
_7cc.processConnect=function(_7cd,uri,_7cf){
if(_7cd.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
this._nextHandler.processConnect(_7cd,uri,_7cf);
};
_7cc.handleConnectionOpened=function(_7d0,_7d1){
var _7d2=_7d0;
if(_7d2.readyState==WebSocket.CONNECTING){
_7d2.readyState=WebSocket.OPEN;
this._listener.connectionOpened(_7d0,_7d1);
}
};
_7cc.handleMessageReceived=function(_7d3,_7d4){
if(_7d3.readyState!=WebSocket.OPEN){
return;
}
this._listener.textMessageReceived(_7d3,_7d4);
};
_7cc.handleBinaryMessageReceived=function(_7d5,_7d6){
if(_7d5.readyState!=WebSocket.OPEN){
return;
}
this._listener.binaryMessageReceived(_7d5,_7d6);
};
_7cc.handleConnectionClosed=function(_7d7,_7d8,code,_7da){
var _7db=_7d7;
if(_7db.readyState!=WebSocket.CLOSED){
_7db.readyState=WebSocket.CLOSED;
this._listener.connectionClosed(_7d7,_7d8,code,_7da);
}
};
_7cc.handleConnectionFailed=function(_7dc){
if(_7dc.readyState!=WebSocket.CLOSED){
_7dc.readyState=WebSocket.CLOSED;
this._listener.connectionFailed(_7dc);
}
};
_7cc.handleConnectionError=function(_7dd,e){
this._listener.connectionError(_7dd,e);
};
_7cc.setNextHandler=function(_7df){
this._nextHandler=_7df;
var _7e0={};
var _7e1=this;
_7e0.connectionOpened=function(_7e2,_7e3){
_7e1.handleConnectionOpened(_7e2,_7e3);
};
_7e0.redirected=function(_7e4,_7e5){
throw new Error("invalid event received");
};
_7e0.authenticationRequested=function(_7e6,_7e7,_7e8){
throw new Error("invalid event received");
};
_7e0.textMessageReceived=function(_7e9,buf){
_7e1.handleMessageReceived(_7e9,buf);
};
_7e0.binaryMessageReceived=function(_7eb,buf){
_7e1.handleBinaryMessageReceived(_7eb,buf);
};
_7e0.connectionClosed=function(_7ed,_7ee,code,_7f0){
_7e1.handleConnectionClosed(_7ed,_7ee,code,_7f0);
};
_7e0.connectionFailed=function(_7f1){
_7e1.handleConnectionFailed(_7f1);
};
_7e0.connectionError=function(_7f2,e){
_7e1.handleConnectionError(_7f2,e);
};
_7df.setListener(_7e0);
};
_7cc.setListener=function(_7f4){
this._listener=_7f4;
};
return _7cb;
})();
var _7f5=(function(){
var _7f6=function(_7f7,_7f8,_7f9){
this._nativeEquivalent=_7f7;
this._handler=_7f8;
this._channelFactory=_7f9;
};
return _7f6;
})();
var _7fa=(function(){
var _7fb="javascript:ws";
var _7fc="javascript:wss";
var _7fd="javascript:wse";
var _7fe="javascript:wse+ssl";
var _7ff="flash:wse";
var _800="flash:wse+ssl";
var _801="flash:wsr";
var _802="flash:wsr+ssl";
var _803={};
var _804={};
var _805=new _55f();
var _806=new _558();
var _807=true;
var _808={};
if(Object.defineProperty){
try{
Object.defineProperty(_808,"prop",{get:function(){
return true;
}});
_807=false;
}
catch(e){
}
}
var _809=function(){
this._handlerListener=createListener(this);
this._nativeHandler=createNativeHandler(this);
this._emulatedHandler=createEmulatedHandler(this);
this._emulatedFlashHandler=createFlashEmulatedHandler(this);
this._rtmpFlashHandler=createFlashRtmpHandler(this);
pickStrategies();
_803[_7fb]=new _7f5("ws",this._nativeHandler,_805);
_803[_7fc]=new _7f5("wss",this._nativeHandler,_805);
_803[_7fd]=new _7f5("ws",this._emulatedHandler,_806);
_803[_7fe]=new _7f5("wss",this._emulatedHandler,_806);
_803[_7ff]=new _7f5("ws",this._emulatedFlashHandler,_806);
_803[_800]=new _7f5("wss",this._emulatedFlashHandler,_806);
_803[_801]=new _7f5("ws",this._rtmpFlashHandler,_806);
_803[_802]=new _7f5("wss",this._rtmpFlashHandler,_806);
};
function isIE6orIE7(){
if(browser!="ie"){
return false;
}
var _80a=navigator.appVersion;
return (_80a.indexOf("MSIE 6.0")>=0||_80a.indexOf("MSIE 7.0")>=0);
};
function isXdrDisabledonIE8IE9(){
if(browser!="ie"){
return false;
}
var _80b=navigator.appVersion;
return ((_80b.indexOf("MSIE 8.0")>=0||_80b.indexOf("MSIE 9.0")>=0)&&typeof (XDomainRequest)==="undefined");
};
function pickStrategies(){
if(isIE6orIE7()||isXdrDisabledonIE8IE9()){
_804["ws"]=new Array(_7fb,_7ff,_7fd);
_804["wss"]=new Array(_7fc,_800,_7fe);
}else{
_804["ws"]=new Array(_7fb,_7fd);
_804["wss"]=new Array(_7fc,_7fe);
}
};
function createListener(_80c){
var _80d={};
_80d.connectionOpened=function(_80e,_80f){
_80c.handleConnectionOpened(_80e,_80f);
};
_80d.binaryMessageReceived=function(_810,buf){
_80c.handleMessageReceived(_810,buf);
};
_80d.textMessageReceived=function(_812,text){
var _814=_812.parent;
_814._webSocketChannelListener.handleMessage(_814._webSocket,text);
};
_80d.connectionClosed=function(_815,_816,code,_818){
_80c.handleConnectionClosed(_815,_816,code,_818);
};
_80d.connectionFailed=function(_819){
_80c.handleConnectionFailed(_819);
};
_80d.connectionError=function(_81a,e){
_80c.handleConnectionError(_81a,e);
};
_80d.authenticationRequested=function(_81c,_81d,_81e){
};
_80d.redirected=function(_81f,_820){
};
_80d.onBufferedAmountChange=function(_821,n){
_80c.handleBufferedAmountChange(_821,n);
};
return _80d;
};
function createNativeHandler(_823){
var _824=new _7ca();
var _825=new _680();
_824.setListener(_823._handlerListener);
_824.setNextHandler(_825);
return _824;
};
function createEmulatedHandler(_826){
var _827=new _7ca();
var _828=new _768();
_827.setListener(_826._handlerListener);
_827.setNextHandler(_828);
return _827;
};
function createFlashEmulatedHandler(_829){
var _82a=new _7ca();
var _82b=new _78e();
_82a.setListener(_829._handlerListener);
_82a.setNextHandler(_82b);
return _82a;
};
function createFlashRtmpHandler(_82c){
var _82d=new _7ca();
var _82e=new _7b8();
_82d.setListener(_82c._handlerListener);
_82d.setNextHandler(_82e);
return _82d;
};
var _82f=function(_830,_831){
var _832=_803[_831];
var _833=_832._channelFactory;
var _834=_830._location;
var _835=_833.createChannel(_834,_830._protocol);
_830._selectedChannel=_835;
_835.parent=_830;
_835._extensions=_830._extensions;
_835._handler=_832._handler;
_835._handler.processConnect(_830._selectedChannel,_834,_830._protocol);
};
var _836=_809.prototype;
_836.fallbackNext=function(_837){
var _838=_837.getNextStrategy();
if(_838==null){
this.doClose(_837,false,1006,"");
}else{
_82f(_837,_838);
}
};
_836.doOpen=function(_839,_83a){
if(_839._lastErrorEvent!==undefined){
delete _839._lastErrorEvent;
}
if(_839.readyState===WebSocket.CONNECTING){
_839.readyState=WebSocket.OPEN;
if(_807){
_839._webSocket.readyState=WebSocket.OPEN;
}
_839._webSocketChannelListener.handleOpen(_839._webSocket,_83a);
}
};
_836.doClose=function(_83b,_83c,code,_83e){
if(_83b._lastErrorEvent!==undefined){
_83b._webSocketChannelListener.handleError(_83b._webSocket,_83b._lastErrorEvent);
delete _83b._lastErrorEvent;
}
if(_83b.readyState===WebSocket.CONNECTING||_83b.readyState===WebSocket.OPEN||_83b.readyState===WebSocket.CLOSING){
_83b.readyState=WebSocket.CLOSED;
if(_807){
_83b._webSocket.readyState=WebSocket.CLOSED;
}
_83b._webSocketChannelListener.handleClose(_83b._webSocket,_83c,code,_83e);
}
};
_836.doBufferedAmountChange=function(_83f,n){
_83f._webSocketChannelListener.handleBufferdAmountChange(_83f._webSocket,n);
};
_836.processConnect=function(_841,_842,_843){
var _844=_841;
if(_844.readyState===WebSocket.OPEN){
throw new Error("Attempt to reconnect an existing open WebSocket to a different location");
}
var _845=_844._compositeScheme;
if(_845!="ws"&&_845!="wss"){
var _846=_803[_845];
if(_846==null){
throw new Error("Invalid connection scheme: "+_845);
}
_844._connectionStrategies.push(_845);
}else{
var _847=_804[_845];
if(_847!=null){
for(var i=0;i<_847.length;i++){
_844._connectionStrategies.push(_847[i]);
}
}else{
throw new Error("Invalid connection scheme: "+_845);
}
}
this.fallbackNext(_844);
};
_836.processTextMessage=function(_849,_84a){
var _84b=_849;
if(_84b.readyState!=WebSocket.OPEN){
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _84c=_84b._selectedChannel;
_84c._handler.processTextMessage(_84c,_84a);
};
_836.processBinaryMessage=function(_84d,_84e){
var _84f=_84d;
if(_84f.readyState!=WebSocket.OPEN){
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _850=_84f._selectedChannel;
_850._handler.processBinaryMessage(_850,_84e);
};
_836.processClose=function(_851,code,_853){
var _854=_851;
if(_851.readyState===WebSocket.CONNECTING||_851.readyState===WebSocket.OPEN){
_851.readyState=WebSocket.CLOSING;
if(_807){
_851._webSocket.readyState=WebSocket.CLOSING;
}
}
var _855=_854._selectedChannel;
_855._handler.processClose(_855,code,_853);
};
_836.setListener=function(_856){
this._listener=_856;
};
_836.handleConnectionOpened=function(_857,_858){
var _859=_857.parent;
this.doOpen(_859,_858);
};
_836.handleMessageReceived=function(_85a,obj){
var _85c=_85a.parent;
switch(_85c.readyState){
case WebSocket.OPEN:
if(_85c._webSocket.binaryType==="blob"&&obj.constructor==ByteBuffer){
obj=obj.getBlob(obj.remaining());
}else{
if(_85c._webSocket.binaryType==="arraybuffer"&&obj.constructor==ByteBuffer){
obj=obj.getArrayBuffer(obj.remaining());
}else{
if(_85c._webSocket.binaryType==="blob"&&obj.byteLength){
obj=new Blob([new Uint8Array(obj)]);
}else{
if(_85c._webSocket.binaryType==="bytebuffer"&&obj.byteLength){
var u=new Uint8Array(obj);
var _85e=[];
for(var i=0;i<u.byteLength;i++){
_85e.push(u[i]);
}
obj=new ByteBuffer(_85e);
}else{
if(_85c._webSocket.binaryType==="bytebuffer"&&obj.size){
var cb=function(_861){
var b=new ByteBuffer();
b.putBytes(_861);
b.flip();
_85c._webSocketChannelListener.handleMessage(_85c._webSocket,b);
};
BlobUtils.asNumberArray(cb,data);
return;
}
}
}
}
}
_85c._webSocketChannelListener.handleMessage(_85c._webSocket,obj);
break;
case WebSocket.CONNECTING:
case WebSocket.CLOSING:
case WebSocket.CLOSED:
break;
default:
throw new Error("Socket has invalid readyState: "+$this.readyState);
}
};
_836.handleConnectionClosed=function(_863,_864,code,_866){
var _867=_863.parent;
if(_867.readyState===WebSocket.CONNECTING&&!_863.authenticationReceived&&!_863.preventFallback){
this.fallbackNext(_867);
}else{
this.doClose(_867,_864,code,_866);
}
};
_836.handleConnectionFailed=function(_868){
var _869=_868.parent;
var _86a=1006;
var _86b="";
if(_868.closeReason.length>0){
_86a=_868.closeCode;
_86b=_868.closeReason;
}
if(_869.readyState===WebSocket.CONNECTING&&!_868.authenticationReceived&&!_868.preventFallback){
this.fallbackNext(_869);
}else{
this.doClose(_869,false,_86a,_86b);
}
};
_836.handleConnectionError=function(_86c,e){
_86c.parent._lastErrorEvent=e;
};
return _809;
})();
(function(){
window.HttpRedirectPolicy=function(name){
if(arguments.length<1){
var s="HttpRedirectPolicy: Please specify the policy name.";
throw Error(s);
}
if(typeof (name)=="undefined"){
var s="HttpRedirectPolicy: Please specify required 'name' parameter.";
throw Error(s);
}else{
if(typeof (name)!="string"){
var s="HttpRedirectPolicy: Required parameter 'name' is a string.";
throw Error(s);
}
}
this.name=name;
};
var _870=HttpRedirectPolicy.prototype;
_870.toString=function(){
return "HttpRedirectPolicy."+this.name;
};
_870.isRedirectionAllowed=function(_871,_872){
if(arguments.length<2){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify both the 'originalLoc' and the 'redirectLoc' parameters.";
throw Error(s);
}
if(typeof (_871)=="undefined"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify required 'originalLoc' parameter.";
throw Error(s);
}else{
if(typeof (_871)!="string"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Required parameter 'originalLoc' is a string.";
throw Error(s);
}
}
if(typeof (_872)=="undefined"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify required 'redirectLoc' parameter.";
throw Error(s);
}else{
if(typeof (_872)!="string"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Required parameter 'redirectLoc' is a string.";
throw Error(s);
}
}
var _874=false;
var _875=new URI(_871.toLowerCase().replace("http","ws"));
var _876=new URI(_872.toLowerCase().replace("http","ws"));
switch(this.name){
case "ALWAYS":
_874=true;
break;
case "NEVER":
_874=false;
break;
case "PEER_DOMAIN":
_874=isPeerDomain(_875,_876);
break;
case "SAME_DOMAIN":
_874=isSameDomain(_875,_876);
break;
case "SAME_ORIGIN":
_874=isSameOrigin(_875,_876);
break;
case "SUB_DOMAIN":
_874=isSubDomain(_875,_876);
break;
default:
var s="HttpRedirectPolicy.isRedirectionAllowed(): Invalid policy: "+this.name;
throw new Error(s);
}
return _874;
};
function isPeerDomain(_877,_878){
if(isSameDomain(_877,_878)){
return true;
}
var _879=_877.scheme.toLowerCase();
var _87a=_878.scheme.toLowerCase();
if(_87a.indexOf(_879)==-1){
return false;
}
var _87b=_877.host;
var _87c=_878.host;
var _87d=getBaseDomain(_87b);
var _87e=getBaseDomain(_87c);
if(_87c.indexOf(_87d,(_87c.length-_87d.length))==-1){
return false;
}
if(_87b.indexOf(_87e,(_87b.length-_87e.length))==-1){
return false;
}
return true;
};
function isSameDomain(_87f,_880){
if(isSameOrigin(_87f,_880)){
return true;
}
var _881=_87f.scheme.toLowerCase();
var _882=_880.scheme.toLowerCase();
if(_882.indexOf(_881)==-1){
return false;
}
var _883=_87f.host.toLowerCase();
var _884=_880.host.toLowerCase();
if(_883==_884){
return true;
}
return false;
};
function isSameOrigin(_885,_886){
var _887=_885.scheme.toLowerCase();
var _888=_886.scheme.toLowerCase();
var _889=_885.authority.toLowerCase();
var _88a=_886.authority.toLowerCase();
if((_887==_888)&&(_889==_88a)){
return true;
}
return false;
};
function isSubDomain(_88b,_88c){
if(isSameDomain(_88b,_88c)){
return true;
}
var _88d=_88b.scheme.toLowerCase();
var _88e=_88c.scheme.toLowerCase();
if(_88e.indexOf(_88d)==-1){
return false;
}
var _88f=_88b.host.toLowerCase();
var _890=_88c.host.toLowerCase();
if(_890.length<_88f.length){
return false;
}
var s="."+_88f;
if(_890.indexOf(s,(_890.length-s.length))==-1){
return false;
}
return true;
};
function getBaseDomain(host){
var _893=host.split(".");
var len=_893.length;
if(len<=2){
return host;
}
var _895="";
for(var i=1;i<len;i++){
_895+="."+_893[i];
}
return _895;
};
HttpRedirectPolicy.ALWAYS=new HttpRedirectPolicy("ALWAYS");
HttpRedirectPolicy.NEVER=new HttpRedirectPolicy("NEVER");
HttpRedirectPolicy.PEER_DOMAIN=new HttpRedirectPolicy("PEER_DOMAIN");
HttpRedirectPolicy.SAME_DOMAIN=new HttpRedirectPolicy("SAME_DOMAIN");
HttpRedirectPolicy.SAME_ORIGIN=new HttpRedirectPolicy("SAME_ORIGIN");
HttpRedirectPolicy.SUB_DOMAIN=new HttpRedirectPolicy("SUB_DOMAIN");
return HttpRedirectPolicy;
})();
(function(){
var _897=new _7fa();
window.WebSocket=(function(){
var _898={};
var _899=function(url,_89b,_89c,_89d,_89e,_89f){
this.url=url;
this.protocol=_89b;
this.extensions=_89c||[];
this.connectTimeout=0;
this._challengeHandler=_89d;
this._redirectPolicy=HttpRedirectPolicy.ALWAYS;
if(typeof (_89e)!="undefined"){
_8a0(_89e);
this.connectTimeout=_89e;
}
if(typeof (_89f)!="undefined"){
_8a1(_89f);
this._redirectPolicy=_89f;
}
this._queue=[];
this._origin="";
this._eventListeners={};
setProperties(this);
_8a2(this,this.url,this.protocol,this.extensions,this._challengeHandler,this.connectTimeout);
};
var _8a3=function(s){
if(s.length==0){
return false;
}
var _8a5="()<>@,;:\\<>/[]?={}\t \n";
for(var i=0;i<s.length;i++){
var c=s.substr(i,1);
if(_8a5.indexOf(c)!=-1){
return false;
}
var code=s.charCodeAt(i);
if(code<33||code>126){
return false;
}
}
return true;
};
var _8a9=function(_8aa){
if(typeof (_8aa)==="undefined"){
return true;
}else{
if(typeof (_8aa)==="string"){
return _8a3(_8aa);
}else{
for(var i=0;i<_8aa.length;i++){
if(!_8a3(_8aa[i])){
return false;
}
}
return true;
}
}
};
var _8a2=function(_8ac,_8ad,_8ae,_8af,_8b0,_8b1){
if(!_8a9(_8ae)){
throw new Error("SyntaxError: invalid protocol: "+_8ae);
}
var uri=new _508(_8ad);
if(!uri.isSecure()&&document.location.protocol==="https:"){
throw new Error("SecurityException: non-secure connection attempted from secure origin");
}
var _8b3=[];
if(typeof (_8ae)!="undefined"){
if(typeof _8ae=="string"&&_8ae.length){
_8b3=[_8ae];
}else{
if(_8ae.length){
_8b3=_8ae;
}
}
}
_8ac._channel=new _565(uri,_8b3);
_8ac._channel._webSocket=_8ac;
_8ac._channel._webSocketChannelListener=_898;
_8ac._channel._extensions=_8af;
if(typeof (_8b0)!="undefined"){
_8ac._channel.challengeHandler=_8b0;
}
if((typeof (_8b1)!="undefined")&&(_8b1>0)){
var _8b4=_8ac._channel;
var _8b5=new _514(function(){
if(_8b4.readyState==_899.CONNECTING){
_897.doClose(_8b4,false,1006,"Connection timeout");
_897.processClose(_8b4,0,"Connection timeout");
_8b4.connectTimer=null;
}
},_8b1,false);
_8ac._channel.connectTimer=_8b5;
_8b5.start();
}
_897.processConnect(_8ac._channel,uri.getWSEquivalent());
};
function setProperties(_8b6){
_8b6.onmessage=null;
_8b6.onopen=null;
_8b6.onclose=null;
_8b6.onerror=null;
if(Object.defineProperty){
try{
Object.defineProperty(_8b6,"readyState",{get:function(){
if(_8b6._channel){
return _8b6._channel.readyState;
}else{
return _899.CLOSED;
}
},set:function(){
throw new Error("Cannot set read only property readyState");
}});
var _8b7="blob";
Object.defineProperty(_8b6,"binaryType",{enumerable:true,configurable:true,get:function(){
return _8b7;
},set:function(val){
if(val==="blob"||val==="arraybuffer"||val==="bytebuffer"){
_8b7=val;
}else{
throw new SyntaxError("Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'");
}
}});
Object.defineProperty(_8b6,"bufferedAmount",{get:function(){
return _8b6._channel.getBufferedAmount();
},set:function(){
throw new Error("Cannot set read only property bufferedAmount");
}});
}
catch(ex){
_8b6.readyState=_899.CONNECTING;
_8b6.binaryType="blob";
_8b6.bufferedAmount=0;
}
}else{
_8b6.readyState=_899.CONNECTING;
_8b6.binaryType="blob";
_8b6.bufferedAmount=0;
}
};
var _8b9=_899.prototype;
_8b9.send=function(data){
switch(this.readyState){
case 0:
throw new Error("Attempt to send message on unopened or closed WebSocket");
case 1:
if(typeof (data)==="string"){
_897.processTextMessage(this._channel,data);
}else{
_897.processBinaryMessage(this._channel,data);
}
break;
case 2:
case 3:
break;
default:
throw new Error("Illegal state error");
}
};
_8b9.close=function(code,_8bc){
if(typeof code!="undefined"){
if(code!=1000&&(code<3000||code>4999)){
var _8bd=new Error("code must equal to 1000 or in range 3000 to 4999");
_8bd.name="InvalidAccessError";
throw _8bd;
}
}
if(typeof _8bc!="undefined"&&_8bc.length>0){
var buf=new ByteBuffer();
buf.putString(_8bc,Charset.UTF8);
buf.flip();
if(buf.remaining()>123){
throw new SyntaxError("SyntaxError: reason is longer than 123 bytes");
}
}
switch(this.readyState){
case 0:
case 1:
_897.processClose(this._channel,code,_8bc);
break;
case 2:
case 3:
break;
default:
throw new Error("Illegal state error");
}
};
_8b9.getChallengeHandler=function(){
return this._challengeHandler||null;
};
_8b9.setChallengeHandler=function(_8bf){
if(typeof (_8bf)=="undefined"){
var s="WebSocket.setChallengeHandler(): Parameter 'challengeHandler' is required";
throw new Error(s);
}
this._challengeHandler=_8bf;
this._channel.challengeHandler=_8bf;
};
_8b9.getRedirectPolicy=function(){
return this._redirectPolicy;
};
_8b9.setRedirectPolicy=function(_8c1){
_8a1(_8c1);
this._redirectPolicy=_8c1;
};
var _8a0=function(_8c2){
if(typeof (_8c2)=="undefined"){
var s="WebSocket.setConnectTimeout(): int parameter 'connectTimeout' is required";
throw new Error(s);
}
if(typeof (_8c2)!="number"){
var s="WebSocket.setConnectTimeout(): connectTimeout should be an integer";
throw new Error(s);
}
if(_8c2<0){
var s="WebSocket.setConnectTimeout(): Connect timeout cannot be negative";
throw new Error(s);
}
return;
};
var _8a1=function(_8c4){
if(typeof (_8c4)=="undefined"){
var s="WebSocket.validateHttpRedirectPolicy(): Parameter 'redirectPolicy' is required";
throw new Error(s);
}
if(!(_8c4 instanceof HttpRedirectPolicy)){
var s="WebSocket.validateHttpRedirectPolicy(): Parameter 'redirectPolicy' must be of type HttpRedirectPolicy";
throw new Error(s);
}
};
var _8c6=function(_8c7,data){
var _8c9=new MessageEvent(_8c7,data,_8c7._origin);
_8c7.dispatchEvent(_8c9);
};
var _8ca=function(_8cb){
var _8cc=new Date().getTime();
var _8cd=_8cc+50;
while(_8cb._queue.length>0){
if(new Date().getTime()>_8cd){
setTimeout(function(){
_8ca(_8cb);
},0);
return;
}
var buf=_8cb._queue.shift();
var ok=false;
try{
if(_8cb.readyState==_899.OPEN){
_8c6(_8cb,buf);
ok=true;
}else{
_8cb._queue=[];
return;
}
}
finally{
if(!ok){
if(_8cb._queue.length==0){
_8cb._delivering=false;
}else{
setTimeout(function(){
_8ca(_8cb);
},0);
}
}
}
}
_8cb._delivering=false;
};
var _8d0=function(_8d1,_8d2,code,_8d4){
delete _8d1._channel;
setTimeout(function(){
var _8d5=new CloseEvent(_8d1,_8d2,code,_8d4);
_8d1.dispatchEvent(_8d5);
},0);
};
_898.handleOpen=function(_8d6,_8d7){
_8d6.protocol=_8d7;
var _8d8={type:"open",bubbles:true,cancelable:true,target:_8d6};
_8d6.dispatchEvent(_8d8);
};
_898.handleMessage=function(_8d9,obj){
if(!Object.defineProperty&&!(typeof (obj)==="string")){
var _8db=_8d9.binaryType;
if(!(_8db==="blob"||_8db==="arraybuffer"||_8db==="bytebuffer")){
var _8dc={type:"error",bubbles:true,cancelable:true,target:_8d9,message:"Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'"};
_8d9.dispatchEvent(_8dc);
return;
}
}
_8d9._queue.push(obj);
if(!_8d9._delivering){
_8d9._delivering=true;
_8ca(_8d9);
}
};
_898.handleClose=function(_8dd,_8de,code,_8e0){
_8d0(_8dd,_8de,code,_8e0);
};
_898.handleError=function(_8e1,_8e2){
setTimeout(function(){
_8e1.dispatchEvent(_8e2);
},0);
};
_898.handleBufferdAmountChange=function(_8e3,n){
_8e3.bufferedAmount=n;
};
_8b9.addEventListener=function(type,_8e6,_8e7){
this._eventListeners[type]=this._eventListeners[type]||[];
this._eventListeners[type].push(_8e6);
};
_8b9.removeEventListener=function(type,_8e9,_8ea){
var _8eb=this._eventListeners[type];
if(_8eb){
for(var i=0;i<_8eb.length;i++){
if(_8eb[i]==_8e9){
_8eb.splice(i,1);
return;
}
}
}
};
_8b9.dispatchEvent=function(e){
var type=e.type;
if(!type){
throw new Error("Cannot dispatch invalid event "+e);
}
try{
var _8ef=this["on"+type];
if(typeof _8ef==="function"){
_8ef(e);
}
}
catch(e){
}
var _8f0=this._eventListeners[type];
if(_8f0){
for(var i=0;i<_8f0.length;i++){
try{
_8f0[i](e);
}
catch(e2){
}
}
}
};
_899.CONNECTING=_8b9.CONNECTING=0;
_899.OPEN=_8b9.OPEN=1;
_899.CLOSING=_8b9.CLOSING=2;
_899.CLOSED=_8b9.CLOSED=3;
return _899;
})();
window.WebSocket.__impls__={};
window.WebSocket.__impls__["flash:wse"]=_306;
}());
(function(){
window.WebSocketExtension=(function(){
var _8f2=function(name){
this.name=name;
this.parameters={};
this.enabled=false;
this.negotiated=false;
};
var _8f4=_8f2.prototype;
_8f4.getParameter=function(_8f5){
return this.parameters[_8f5];
};
_8f4.setParameter=function(_8f6,_8f7){
this.parameters[_8f6]=_8f7;
};
_8f4.getParameters=function(){
var arr=[];
for(var name in this.parameters){
if(this.parameters.hasOwnProperty(name)){
arr.push(name);
}
}
return arr;
};
_8f4.parse=function(str){
var arr=str.split(";");
if(arr[0]!=this.name){
throw new Error("Error: name not match");
}
this.parameters={};
for(var i=1;i<arr.length;i++){
var _8fd=arr[i].indexOf("=");
this.parameters[arr[i].subString(0,_8fd)]=arr[i].substring(_8fd+1);
}
};
_8f4.toString=function(){
var arr=[this.name];
for(var p in this.parameters){
if(this.parameters.hasOwnProperty(p)){
arr.push(p.name+"="+this.parameters[p]);
}
}
return arr.join(";");
};
return _8f2;
})();
})();
(function(){
window.WebSocketRevalidateExtension=(function(){
var _900=function(){
};
var _901=_900.prototype=new WebSocketExtension(_550.KAAZING_SEC_EXTENSION_REVALIDATE);
return _900;
})();
})();
(function(){
window.WebSocketFactory=(function(){
var _902=function(){
this.extensions={};
var _903=new WebSocketRevalidateExtension();
this.extensions[_903.name]=_903;
this.redirectPolicy=HttpRedirectPolicy.ALWAYS;
};
var _904=_902.prototype;
_904.getExtension=function(name){
return this.extensions[name];
};
_904.setExtension=function(_906){
this.extensions[_906.name]=_906;
};
_904.setChallengeHandler=function(_907){
if(typeof (_907)=="undefined"){
var s="WebSocketFactory.setChallengeHandler(): Parameter 'challengeHandler' is required";
throw new Error(s);
}
this.challengeHandler=_907;
var _909=this.extensions[_550.KAAZING_SEC_EXTENSION_REVALIDATE];
_909.enabled=(_907!=null);
};
_904.getChallengeHandler=function(){
return this.challengeHandler||null;
};
_904.createWebSocket=function(url,_90b){
var ext=[];
for(var key in this.extensions){
if(this.extensions.hasOwnProperty(key)&&this.extensions[key].enabled){
ext.push(this.extensions[key].toString());
}
}
var _90e=this.getChallengeHandler();
var _90f=this.getDefaultConnectTimeout();
var _910=this.getDefaultRedirectPolicy();
var ws=new WebSocket(url,_90b,ext,_90e,_90f,_910);
return ws;
};
_904.setDefaultConnectTimeout=function(_912){
if(typeof (_912)=="undefined"){
var s="WebSocketFactory.setDefaultConnectTimeout(): int parameter 'connectTimeout' is required";
throw new Error(s);
}
if(typeof (_912)!="number"){
var s="WebSocketFactory.setDefaultConnectTimeout(): connectTimeout should be an integer";
throw new Error(s);
}
if(_912<0){
var s="WebSocketFactory.setDefaultConnectTimeout(): Connect timeout cannot be negative";
throw new Error(s);
}
this.connectTimeout=_912;
};
_904.getDefaultConnectTimeout=function(){
return this.connectTimeout||0;
};
_904.setDefaultRedirectPolicy=function(_914){
if(typeof (_914)=="undefined"){
var s="WebSocketFactory.setDefaultRedirectPolicy(): int parameter 'redirectPolicy' is required";
throw new Error(s);
}
if(!(_914 instanceof HttpRedirectPolicy)){
var s="WebSocketFactory.setDefaultRedirectPolicy(): redirectPolicy should be an instance of HttpRedirectPolicy";
throw new Error(s);
}
this.redirectPolicy=_914;
};
_904.getDefaultRedirectPolicy=function(){
return this.redirectPolicy;
};
return _902;
})();
})();
window.___Loader=new _39c(_26a);
})();
})();
