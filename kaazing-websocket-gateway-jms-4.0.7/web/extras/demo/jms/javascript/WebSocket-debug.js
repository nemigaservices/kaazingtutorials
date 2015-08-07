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
var ULOG=_26b.getLogger("com.kaazing.gateway.client.loader.Utils");
var _297=function(key){
ULOG.entering(this,"Utils.getMetaValue",key);
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name===key){
var v=tags[i].content;
ULOG.exiting(this,"Utils.getMetaValue",v);
return v;
}
}
ULOG.exiting(this,"Utils.getMetaValue");
};
var _29c=function(_29d){
ULOG.entering(this,"Utils.arrayCopy",_29d);
var _29e=[];
for(var i=0;i<_29d.length;i++){
_29e.push(_29d[i]);
}
return _29e;
};
var _2a0=function(_2a1,_2a2){
ULOG.entering(this,"Utils.arrayFilter",{"array":_2a1,"callback":_2a2});
var _2a3=[];
for(var i=0;i<_2a1.length;i++){
var elt=_2a1[i];
if(_2a2(elt)){
_2a3.push(_2a1[i]);
}
}
return _2a3;
};
var _2a6=function(_2a7,_2a8){
ULOG.entering(this,"Utils.indexOf",{"array":_2a7,"searchElement":_2a8});
for(var i=0;i<_2a7.length;i++){
if(_2a7[i]==_2a8){
ULOG.exiting(this,"Utils.indexOf",i);
return i;
}
}
ULOG.exiting(this,"Utils.indexOf",-1);
return -1;
};
var _2aa=function(s){
ULOG.entering(this,"Utils.decodeByteString",s);
var a=[];
for(var i=0;i<s.length;i++){
a.push(s.charCodeAt(i)&255);
}
var buf=new ByteBuffer(a);
var v=_2b0(buf,Charset.UTF8);
ULOG.exiting(this,"Utils.decodeByteString",v);
return v;
};
var _2b1=function(_2b2){
ULOG.entering(this,"Utils.decodeArrayBuffer",_2b2);
var buf=new Uint8Array(_2b2);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
var buf=new ByteBuffer(a);
var s=_2b0(buf,Charset.UTF8);
ULOG.exiting(this,"Utils.decodeArrayBuffer",s);
return s;
};
var _2b7=function(_2b8){
ULOG.entering(this,"Utils.decodeArrayBuffer2ByteBuffer");
var buf=new Uint8Array(_2b8);
var a=[];
for(var i=0;i<buf.length;i++){
a.push(buf[i]);
}
ULOG.exiting(this,"Utils.decodeArrayBuffer2ByteBuffer");
return new ByteBuffer(a);
};
var _2bc=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _2be="\n";
var _2bf=function(buf){
ULOG.entering(this,"Utils.encodeEscapedByte",buf);
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(n);
switch(chr){
case _2bc:
a.push(_2bc);
a.push(_2bc);
break;
case NULL:
a.push(_2bc);
a.push("0");
break;
case _2be:
a.push(_2bc);
a.push("n");
break;
default:
a.push(chr);
}
}
var v=a.join("");
ULOG.exiting(this,"Utils.encodeEscapedBytes",v);
return v;
};
var _2c5=function(buf,_2c7){
ULOG.entering(this,"Utils.encodeByteString",{"buf":buf,"requiresEscaping":_2c7});
if(_2c7){
return _2bf(buf);
}else{
var _2c8=buf.array;
var _2c9=(buf.position==0&&buf.limit==_2c8.length)?_2c8:buf.getBytes(buf.remaining());
var _2ca=!(XMLHttpRequest.prototype.sendAsBinary);
for(var i=_2c9.length-1;i>=0;i--){
var _2cc=_2c9[i];
if(_2cc==0&&_2ca){
_2c9[i]=256;
}else{
if(_2cc<0){
_2c9[i]=_2cc&255;
}
}
}
var _2cd=0;
var _2ce=[];
do{
var _2cf=Math.min(_2c9.length-_2cd,10000);
partOfBytes=_2c9.slice(_2cd,_2cd+_2cf);
_2cd+=_2cf;
_2ce.push(String.fromCharCode.apply(null,partOfBytes));
}while(_2cd<_2c9.length);
var _2d0=_2ce.join("");
if(_2c9===_2c8){
for(var i=_2c9.length-1;i>=0;i--){
var _2cc=_2c9[i];
if(_2cc==256){
_2c9[i]=0;
}
}
}
ULOG.exiting(this,"Utils.encodeByteString",_2d0);
return _2d0;
}
};
var _2b0=function(buf,cs){
var _2d3=buf.position;
var _2d4=buf.limit;
var _2d5=buf.array;
while(_2d3<_2d4){
_2d3++;
}
try{
buf.limit=_2d3;
return cs.decode(buf);
}
finally{
if(_2d3!=_2d4){
buf.limit=_2d4;
buf.position=_2d3+1;
}
}
};
var _2d6=window.WebSocket;
var _2d7=(function(){
var _2d8=_26b.getLogger("WebSocketNativeProxy");
var _2d9=function(){
this.parent;
this._listener;
this.code=1005;
this.reason="";
};
var _2da=(browser=="safari"&&typeof (_2d6.CLOSING)=="undefined");
var _2db=(browser=="android");
var _2dc=_2d9.prototype;
_2dc.connect=function(_2dd,_2de){
_2d8.entering(this,"WebSocketNativeProxy.<init>",{"location":_2dd,"protocol":_2de});
if((typeof (_2d6)==="undefined")||_2db){
doError(this);
return;
}
if(_2dd.indexOf("javascript:")==0){
_2dd=_2dd.substr("javascript:".length);
}
var _2df=_2dd.indexOf("?");
if(_2df!=-1){
if(!/[\?&]\.kl=Y/.test(_2dd.substring(_2df))){
_2dd+="&.kl=Y";
}
}else{
_2dd+="?.kl=Y";
}
this._sendQueue=[];
try{
if(_2de){
this._requestedProtocol=_2de;
this._delegate=new _2d6(_2dd,_2de);
}else{
this._delegate=new _2d6(_2dd);
}
this._delegate.binaryType="arraybuffer";
}
catch(e){
_2d8.severe(this,"WebSocketNativeProxy.<init> "+e);
doError(this);
return;
}
bindHandlers(this);
};
_2dc.onerror=function(){
};
_2dc.onmessage=function(){
};
_2dc.onopen=function(){
};
_2dc.onclose=function(){
};
_2dc.close=function(code,_2e1){
_2d8.entering(this,"WebSocketNativeProxy.close");
if(code){
if(_2da){
doCloseDraft76Compat(this,code,_2e1);
}else{
this._delegate.close(code,_2e1);
}
}else{
this._delegate.close();
}
};
function doCloseDraft76Compat(_2e2,code,_2e4){
_2e2.code=code|1005;
_2e2.reason=_2e4|"";
_2e2._delegate.close();
};
_2dc.send=function(_2e5){
_2d8.entering(this,"WebSocketNativeProxy.send",_2e5);
doSend(this,_2e5);
return;
};
_2dc.setListener=function(_2e6){
this._listener=_2e6;
};
_2dc.setIdleTimeout=function(_2e7){
_2d8.entering(this,"WebSocketNativeProxy.setIdleTimeout",_2e7);
this.lastMessageTimestamp=new Date().getTime();
this.idleTimeout=_2e7;
startIdleTimer(this,_2e7);
return;
};
function doSend(_2e8,_2e9){
_2d8.entering(this,"WebSocketNativeProxy.doSend",_2e9);
if(typeof (_2e9)=="string"){
_2e8._delegate.send(_2e9);
}else{
if(_2e9.byteLength||_2e9.size){
_2e8._delegate.send(_2e9);
}else{
if(_2e9.constructor==ByteBuffer){
_2e8._delegate.send(_2e9.getArrayBuffer(_2e9.remaining()));
}else{
_2d8.severe(this,"WebSocketNativeProxy.doSend called with unkown type "+typeof (_2e9));
throw new Error("Cannot call send() with that type");
}
}
}
};
function doError(_2ea,e){
_2d8.entering(this,"WebSocketNativeProxy.doError",e);
setTimeout(function(){
_2ea._listener.connectionFailed(_2ea.parent);
},0);
};
function encodeMessageData(_2ec,e){
var buf;
if(typeof e.data.byteLength!=="undefined"){
buf=_2b7(e.data);
}else{
buf=ByteBuffer.allocate(e.data.length);
if(_2ec.parent._isBinary&&_2ec.parent._balanced>1){
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
function messageHandler(_2f0,e){
_2d8.entering(this,"WebSocketNativeProxy.messageHandler",e);
_2f0.lastMessageTimestamp=new Date().getTime();
if(typeof (e.data)==="string"){
_2f0._listener.textMessageReceived(_2f0.parent,e.data);
}else{
_2f0._listener.binaryMessageReceived(_2f0.parent,e.data);
}
};
function closeHandler(_2f2,e){
_2d8.entering(this,"WebSocketNativeProxy.closeHandler",e);
unbindHandlers(_2f2);
if(_2da){
_2f2._listener.connectionClosed(_2f2.parent,true,_2f2.code,_2f2.reason);
}else{
_2f2._listener.connectionClosed(_2f2.parent,e.wasClean,e.code,e.reason);
}
};
function errorHandler(_2f4,e){
_2d8.entering(this,"WebSocketNativeProxy.errorHandler",e);
_2f4._listener.connectionError(_2f4.parent,e);
};
function openHandler(_2f6,e){
_2d8.entering(this,"WebSocketNativeProxy.openHandler",e);
if(_2da){
_2f6._delegate.protocol=_2f6._requestedProtocol;
}
_2f6._listener.connectionOpened(_2f6.parent,_2f6._delegate.protocol);
};
function bindHandlers(_2f8){
_2d8.entering(this,"WebSocketNativeProxy.bindHandlers");
var _2f9=_2f8._delegate;
_2f9.onopen=function(e){
openHandler(_2f8,e);
};
_2f9.onmessage=function(e){
messageHandler(_2f8,e);
};
_2f9.onclose=function(e){
closeHandler(_2f8,e);
};
_2f9.onerror=function(e){
errorHandler(_2f8,e);
};
_2f8.readyState=function(){
return _2f9.readyState;
};
};
function unbindHandlers(_2fe){
_2d8.entering(this,"WebSocketNativeProxy.unbindHandlers");
var _2ff=_2fe._delegate;
_2ff.onmessage=undefined;
_2ff.onclose=undefined;
_2ff.onopen=undefined;
_2ff.onerror=undefined;
_2fe.readyState=WebSocket.CLOSED;
};
function startIdleTimer(_300,_301){
stopIdleTimer(_300);
_300.idleTimer=setTimeout(function(){
idleTimerHandler(_300);
},_301);
};
function idleTimerHandler(_302){
var _303=new Date().getTime();
var _304=_303-_302.lastMessageTimestamp;
var _305=_302.idleTimeout;
if(_304>_305){
try{
var _306=_302._delegate;
if(_306){
unbindHandlers(_302);
_306.close();
}
}
finally{
_302._listener.connectionClosed(_302.parent,false,1006,"");
}
}else{
startIdleTimer(_302,_305-_304);
}
};
function stopIdleTimer(_307){
if(_307.idleTimer!=null){
clearTimeout(_307.idleTimer);
_307.IdleTimer=null;
}
};
return _2d9;
})();
var _308=(function(){
var _309=_26b.getLogger("WebSocketEmulatedFlashProxy");
var _30a=function(){
this.parent;
this._listener;
};
var _30b=_30a.prototype;
_30b.connect=function(_30c,_30d){
_309.entering(this,"WebSocketEmulatedFlashProxy.<init>",_30c);
this.URL=_30c;
try{
_30e(this,_30c,_30d);
}
catch(e){
_309.severe(this,"WebSocketEmulatedFlashProxy.<init> "+e);
doError(this,e);
}
this.constructor=_30a;
_309.exiting(this,"WebSocketEmulatedFlashProxy.<init>");
};
_30b.setListener=function(_30f){
this._listener=_30f;
};
_30a._flashBridge={};
_30a._flashBridge.readyWaitQueue=[];
_30a._flashBridge.failWaitQueue=[];
_30a._flashBridge.flashHasLoaded=false;
_30a._flashBridge.flashHasFailed=false;
_30b.URL="";
_30b.readyState=0;
_30b.bufferedAmount=0;
_30b.connectionOpened=function(_310,_311){
var _311=_311.split("\n");
for(var i=0;i<_311.length;i++){
var _313=_311[i].split(":");
_310.responseHeaders[_313[0]]=_313[1];
}
this._listener.connectionOpened(_310,"");
};
_30b.connectionClosed=function(_314,_315,code,_317){
this._listener.connectionClosed(_314,_315,code,_317);
};
_30b.connectionFailed=function(_318){
this._listener.connectionFailed(_318);
};
_30b.binaryMessageReceived=function(_319,data){
this._listener.binaryMessageReceived(_319,data);
};
_30b.textMessageReceived=function(_31b,s){
this._listener.textMessageReceived(_31b,s);
};
_30b.redirected=function(_31d,_31e){
this._listener.redirected(_31d,_31e);
};
_30b.authenticationRequested=function(_31f,_320,_321){
this._listener.authenticationRequested(_31f,_320,_321);
};
_30b.send=function(data){
_309.entering(this,"WebSocketEmulatedFlashProxy.send",data);
switch(this.readyState){
case 0:
_309.severe(this,"WebSocketEmulatedFlashProxy.send: readyState is 0");
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
_309.severe(this,"WebSocketEmulatedFlashProxy.send: Data is null");
throw new Error("data is null");
}
if(typeof (data)=="string"){
_30a._flashBridge.sendText(this._instanceId,data);
}else{
if(data.constructor==ByteBuffer){
var _323;
var a=[];
while(data.remaining()){
a.push(String.fromCharCode(data.get()));
}
var _323=a.join("");
_30a._flashBridge.sendByteString(this._instanceId,_323);
}else{
if(data.byteLength){
var _323;
var a=[];
var _325=new DataView(data);
for(var i=0;i<data.byteLength;i++){
a.push(String.fromCharCode(_325.getUint8(i)));
}
var _323=a.join("");
_30a._flashBridge.sendByteString(this._instanceId,_323);
}else{
if(data.size){
var _327=this;
var cb=function(_329){
_30a._flashBridge.sendByteString(_327._instanceId,_329);
};
BlobUtils.asBinaryString(cb,data);
return;
}else{
_309.severe(this,"WebSocketEmulatedFlashProxy.send: Data is on invalid type "+typeof (data));
throw new Error("Invalid type");
}
}
}
}
_32a(this);
return true;
break;
case 2:
return false;
break;
default:
_309.severe(this,"WebSocketEmulatedFlashProxy.send: Invalid readyState "+this.readyState);
throw new Error("INVALID_STATE_ERR");
}
};
_30b.close=function(code,_32c){
_309.entering(this,"WebSocketEmulatedFlashProxy.close");
switch(this.readyState){
case 0:
case 1:
_30a._flashBridge.disconnect(this._instanceId,code,_32c);
break;
}
};
_30b.disconnect=_30b.close;
var _32a=function(_32d){
_309.entering(this,"WebSocketEmulatedFlashProxy.updateBufferedAmount");
_32d.bufferedAmount=_30a._flashBridge.getBufferedAmount(_32d._instanceId);
if(_32d.bufferedAmount!=0){
setTimeout(function(){
_32a(_32d);
},1000);
}
};
var _30e=function(_32e,_32f,_330){
_309.entering(this,"WebSocketEmulatedFlashProxy.registerWebSocket",_32f);
var _331=function(key,_333){
_333[key]=_32e;
_32e._instanceId=key;
};
var _334=function(){
doError(_32e);
};
var _335=[];
if(_32e.parent.requestHeaders&&_32e.parent.requestHeaders.length>0){
for(var i=0;i<_32e.parent.requestHeaders.length;i++){
_335.push(_32e.parent.requestHeaders[i].label+":"+_32e.parent.requestHeaders[i].value);
}
}
_30a._flashBridge.registerWebSocketEmulated(_32f,_335.join("\n"),_331,_334);
};
function doError(_337,e){
_309.entering(this,"WebSocketEmulatedFlashProxy.doError",e);
setTimeout(function(){
_337._listener.connectionFailed(_337.parent);
},0);
};
return _30a;
})();
var _339=(function(){
var _33a=_26b.getLogger("WebSocketRtmpFlashProxy");
var _33b=function(){
this.parent;
this._listener;
};
var _33c=_33b.prototype;
_33c.connect=function(_33d,_33e){
_33a.entering(this,"WebSocketRtmpFlashProxy.<init>",_33d);
this.URL=_33d;
try{
_33f(this,_33d,_33e);
}
catch(e){
_33a.severe(this,"WebSocketRtmpFlashProxy.<init> "+e);
doError(this,e);
}
this.constructor=_33b;
_33a.exiting(this,"WebSocketRtmpFlashProxy.<init>");
};
_33c.setListener=function(_340){
this._listener=_340;
};
_308._flashBridge={};
_308._flashBridge.readyWaitQueue=[];
_308._flashBridge.failWaitQueue=[];
_308._flashBridge.flashHasLoaded=false;
_308._flashBridge.flashHasFailed=false;
_33c.URL="";
_33c.readyState=0;
_33c.bufferedAmount=0;
_33c.connectionOpened=function(_341,_342){
var _342=_342.split("\n");
for(var i=0;i<_342.length;i++){
var _344=_342[i].split(":");
_341.responseHeaders[_344[0]]=_344[1];
}
this._listener.connectionOpened(_341,"");
};
_33c.connectionClosed=function(_345,_346,code,_348){
this._listener.connectionClosed(_345,_346,code,_348);
};
_33c.connectionFailed=function(_349){
this._listener.connectionFailed(_349);
};
_33c.binaryMessageReceived=function(_34a,data){
this._listener.binaryMessageReceived(_34a,data);
};
_33c.textMessageReceived=function(_34c,s){
this._listener.textMessageReceived(_34c,s);
};
_33c.redirected=function(_34e,_34f){
this._listener.redirected(_34e,_34f);
};
_33c.authenticationRequested=function(_350,_351,_352){
this._listener.authenticationRequested(_350,_351,_352);
};
_33c.send=function(data){
_33a.entering(this,"WebSocketRtmpFlashProxy.send",data);
switch(this.readyState){
case 0:
_33a.severe(this,"WebSocketRtmpFlashProxy.send: readyState is 0");
throw new Error("INVALID_STATE_ERR");
break;
case 1:
if(data===null){
_33a.severe(this,"WebSocketRtmpFlashProxy.send: Data is null");
throw new Error("data is null");
}
if(typeof (data)=="string"){
_308._flashBridge.sendText(this._instanceId,data);
}else{
if(typeof (data.array)=="object"){
var _354;
var a=[];
var b;
while(data.remaining()){
b=data.get();
a.push(String.fromCharCode(b));
}
var _354=a.join("");
_308._flashBridge.sendByteString(this._instanceId,_354);
return;
}else{
_33a.severe(this,"WebSocketRtmpFlashProxy.send: Data is on invalid type "+typeof (data));
throw new Error("Invalid type");
}
}
_357(this);
return true;
break;
case 2:
return false;
break;
default:
_33a.severe(this,"WebSocketRtmpFlashProxy.send: Invalid readyState "+this.readyState);
throw new Error("INVALID_STATE_ERR");
}
};
_33c.close=function(code,_359){
_33a.entering(this,"WebSocketRtmpFlashProxy.close");
switch(this.readyState){
case 1:
case 2:
_308._flashBridge.disconnect(this._instanceId,code,_359);
break;
}
};
_33c.disconnect=_33c.close;
var _357=function(_35a){
_33a.entering(this,"WebSocketRtmpFlashProxy.updateBufferedAmount");
_35a.bufferedAmount=_308._flashBridge.getBufferedAmount(_35a._instanceId);
if(_35a.bufferedAmount!=0){
setTimeout(function(){
_357(_35a);
},1000);
}
};
var _33f=function(_35b,_35c,_35d){
_33a.entering(this,"WebSocketRtmpFlashProxy.registerWebSocket",_35c);
var _35e=function(key,_360){
_360[key]=_35b;
_35b._instanceId=key;
};
var _361=function(){
doError(_35b);
};
var _362=[];
if(_35b.parent.requestHeaders&&_35b.parent.requestHeaders.length>0){
for(var i=0;i<_35b.parent.requestHeaders.length;i++){
_362.push(_35b.parent.requestHeaders[i].label+":"+_35b.parent.requestHeaders[i].value);
}
}
_308._flashBridge.registerWebSocketRtmp(_35c,_362.join("\n"),_35e,_361);
};
function doError(_364,e){
_33a.entering(this,"WebSocketRtmpFlashProxy.doError",e);
setTimeout(function(){
_364._listener.connectionFailed(_364.parent);
},0);
};
return _33b;
})();
(function(){
var _366=_26b.getLogger("com.kaazing.gateway.client.loader.FlashBridge");
var _367={};
_308._flashBridge.registerWebSocketEmulated=function(_368,_369,_36a,_36b){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated",{"location":_368,"callback":_36a,"errback":_36b});
var _36c=function(){
var key=_308._flashBridge.doRegisterWebSocketEmulated(_368,_369);
_36a(key,_367);
};
if(_308._flashBridge.flashHasLoaded){
if(_308._flashBridge.flashHasFailed){
_36b();
}else{
_36c();
}
}else{
this.readyWaitQueue.push(_36c);
this.failWaitQueue.push(_36b);
}
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated");
};
_308._flashBridge.doRegisterWebSocketEmulated=function(_36e,_36f){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketEmulated",{"location":_36e,"headers":_36f});
var key=_308._flashBridge.elt.registerWebSocketEmulated(_36e,_36f);
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketEmulated",key);
return key;
};
_308._flashBridge.registerWebSocketRtmp=function(_371,_372,_373,_374){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketRtmp",{"location":_371,"callback":_373,"errback":_374});
var _375=function(){
var key=_308._flashBridge.doRegisterWebSocketRtmp(_371,_372);
_373(key,_367);
};
if(_308._flashBridge.flashHasLoaded){
if(_308._flashBridge.flashHasFailed){
_374();
}else{
_375();
}
}else{
this.readyWaitQueue.push(_375);
this.failWaitQueue.push(_374);
}
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.registerWebSocketEmulated");
};
_308._flashBridge.doRegisterWebSocketRtmp=function(_377,_378){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketRtmp",{"location":_377,"protocol":_378});
var key=_308._flashBridge.elt.registerWebSocketRtmp(_377,_378);
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.doRegisterWebSocketRtmp",key);
return key;
};
_308._flashBridge.onready=function(){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.onready");
var _37a=_308._flashBridge.readyWaitQueue;
for(var i=0;i<_37a.length;i++){
var _37c=_37a[i];
_37c();
}
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.onready");
};
_308._flashBridge.onfail=function(){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.onfail");
var _37d=_308._flashBridge.failWaitQueue;
for(var i=0;i<_37d.length;i++){
var _37f=_37d[i];
_37f();
}
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.onfail");
};
_308._flashBridge.connectionOpened=function(key,_381){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionOpened",key);
_367[key].readyState=1;
_367[key].connectionOpened(_367[key].parent,_381);
_382();
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionOpened");
};
_308._flashBridge.connectionClosed=function(key,_384,code,_386){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionClosed",key);
_367[key].readyState=2;
_367[key].connectionClosed(_367[key].parent,_384,code,_386);
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionClosed");
};
_308._flashBridge.connectionFailed=function(key){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionFailed",key);
_367[key].connectionFailed(_367[key].parent);
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.connectionFailed");
};
_308._flashBridge.binaryMessageReceived=function(key,data){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.binaryMessageReceived",{"key":key,"data":data});
var _38a=_367[key];
if(_38a.readyState==1){
var buf=ByteBuffer.allocate(data.length);
for(var i=0;i<data.length;i++){
buf.put(data[i]);
}
buf.flip();
_38a.binaryMessageReceived(_38a.parent,buf);
}
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.binaryMessageReceived");
};
_308._flashBridge.textMessageReceived=function(key,data){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.textMessageReceived",{"key":key,"data":data});
var _38f=_367[key];
if(_38f.readyState==1){
_38f.textMessageReceived(_38f.parent,unescape(data));
}
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.textMessageReceived");
};
_308._flashBridge.redirected=function(key,_391){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.redirected",{"key":key,"data":_391});
var _392=_367[key];
_392.redirected(_392.parent,_391);
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.redirected");
};
_308._flashBridge.authenticationRequested=function(key,_394,_395){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.authenticationRequested",{"key":key,"data":_394});
var _396=_367[key];
_396.authenticationRequested(_396.parent,_394,_395);
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.authenticationRequested");
};
var _382=function(){
_366.entering(this,"WebSocketEmulatedFlashProxy.killLoadingBar");
if(browser==="firefox"){
var e=document.createElement("iframe");
e.style.display="none";
document.body.appendChild(e);
document.body.removeChild(e);
}
};
_308._flashBridge.sendText=function(key,_399){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.sendText",{"key":key,"message":_399});
this.elt.processTextMessage(key,escape(_399));
setTimeout(_382,200);
};
_308._flashBridge.sendByteString=function(key,_39b){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.sendByteString",{"key":key,"message":_39b});
this.elt.processBinaryMessage(key,escape(_39b));
setTimeout(_382,200);
};
_308._flashBridge.disconnect=function(key,code,_39e){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.disconnect",key);
this.elt.processClose(key,code,_39e);
};
_308._flashBridge.getBufferedAmount=function(key){
_366.entering(this,"WebSocketEmulatedFlashProxy._flashBridge.getBufferedAmount",key);
var v=this.elt.getBufferedAmount(key);
_366.exiting(this,"WebSocketEmulatedFlashProxy._flashBridge.getBufferedAmount",v);
return v;
};
})();
(function(){
var _3a1=function(_3a2){
var self=this;
var _3a4=3000;
var ID="Loader";
var ie=false;
var _3a7=-1;
self.elt=null;
var _3a8=function(){
var exp=new RegExp(".*"+_3a2+".*.js$");
var _3aa=document.getElementsByTagName("script");
for(var i=0;i<_3aa.length;i++){
if(_3aa[i].src){
var name=(_3aa[i].src).match(exp);
if(name){
name=name.pop();
var _3ad=name.split("/");
_3ad.pop();
if(_3ad.length>0){
return _3ad.join("/")+"/";
}else{
return "";
}
}
}
}
};
var _3ae=_3a8();
var _3af=_3ae+"Loader.swf";
self.loader=function(){
var _3b0="flash";
var tags=document.getElementsByTagName("meta");
for(var i=0;i<tags.length;i++){
if(tags[i].name==="kaazing:upgrade"){
_3b0=tags[i].content;
}
}
if(_3b0!="flash"||!_3b3([9,0,115])){
_3b4();
}else{
_3a7=setTimeout(_3b4,_3a4);
_3b5();
}
};
self.clearFlashTimer=function(){
clearTimeout(_3a7);
_3a7="cleared";
setTimeout(function(){
_3b6(self.elt.handshake(_3a2));
},0);
};
var _3b6=function(_3b7){
if(_3b7){
_308._flashBridge.flashHasLoaded=true;
_308._flashBridge.elt=self.elt;
_308._flashBridge.onready();
}else{
_3b4();
}
window.___Loader=undefined;
};
var _3b4=function(){
_308._flashBridge.flashHasLoaded=true;
_308._flashBridge.flashHasFailed=true;
_308._flashBridge.onfail();
};
var _3b8=function(){
var _3b9=null;
if(typeof (ActiveXObject)!="undefined"){
try{
ie=true;
var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
var _3bb=swf.GetVariable("$version");
var _3bc=_3bb.split(" ")[1].split(",");
_3b9=[];
for(var i=0;i<_3bc.length;i++){
_3b9[i]=parseInt(_3bc[i]);
}
}
catch(e){
ie=false;
}
}
if(typeof navigator.plugins!="undefined"){
if(typeof navigator.plugins["Shockwave Flash"]!="undefined"){
var _3bb=navigator.plugins["Shockwave Flash"].description;
_3bb=_3bb.replace(/\s*r/g,".");
var _3bc=_3bb.split(" ")[2].split(".");
_3b9=[];
for(var i=0;i<_3bc.length;i++){
_3b9[i]=parseInt(_3bc[i]);
}
}
}
var _3be=navigator.userAgent;
if(_3b9!==null&&_3b9[0]===10&&_3b9[1]===0&&_3be.indexOf("Windows NT 6.0")!==-1){
_3b9=null;
}
if(_3be.indexOf("MSIE 6.0")==-1&&_3be.indexOf("MSIE 7.0")==-1){
if(_3be.indexOf("MSIE 8.0")>0||_3be.indexOf("MSIE 9.0")>0){
if(typeof (XDomainRequest)!=="undefined"){
_3b9=null;
}
}else{
_3b9=null;
}
}
return _3b9;
};
var _3b3=function(_3bf){
var _3c0=_3b8();
if(_3c0==null){
return false;
}
for(var i=0;i<Math.max(_3c0.length,_3bf.length);i++){
var _3c2=_3c0[i]-_3bf[i];
if(_3c2!=0){
return (_3c2>0)?true:false;
}
}
return true;
};
var _3b5=function(){
if(ie){
var elt=document.createElement("div");
document.body.appendChild(elt);
elt.outerHTML="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" height=\"0\" width=\"0\" id=\""+ID+"\"><param name=\"movie\" value=\""+_3af+"\"></param></object>";
self.elt=document.getElementById(ID);
}else{
var elt=document.createElement("object");
elt.setAttribute("type","application/x-shockwave-flash");
elt.setAttribute("width",0);
elt.setAttribute("height",0);
elt.setAttribute("id",ID);
elt.setAttribute("data",_3af);
document.body.appendChild(elt);
self.elt=elt;
}
};
self.attachToOnload=function(_3c4){
if(window.addEventListener){
window.addEventListener("load",_3c4,true);
}else{
if(window.attachEvent){
window.attachEvent("onload",_3c4);
}else{
onload=_3c4;
}
}
};
if(document.readyState==="complete"){
self.loader();
}else{
self.attachToOnload(self.loader);
}
};
var _3c5=(function(){
var _3c6=function(_3c7){
this.HOST=new _3c6(0);
this.USERINFO=new _3c6(1);
this.PORT=new _3c6(2);
this.PATH=new _3c6(3);
this.ordinal=_3c7;
};
return _3c6;
})();
var _3c8=(function(){
var _3c9=function(){
};
_3c9.getRealm=function(_3ca){
var _3cb=_3ca.authenticationParameters;
if(_3cb==null){
return null;
}
var _3cc=/realm=(\"(.*)\")/i;
var _3cd=_3cc.exec(_3cb);
return (_3cd!=null&&_3cd.length>=3)?_3cd[2]:null;
};
return _3c9;
})();
function Dictionary(){
this.Keys=new Array();
};
var _3ce=(function(){
var _3cf=function(_3d0){
this.weakKeys=_3d0;
this.elements=[];
this.dictionary=new Dictionary();
};
var _3d1=_3cf.prototype;
_3d1.getlength=function(){
return this.elements.length;
};
_3d1.getItemAt=function(_3d2){
return this.dictionary[this.elements[_3d2]];
};
_3d1.get=function(key){
var _3d4=this.dictionary[key];
if(_3d4==undefined){
_3d4=null;
}
return _3d4;
};
_3d1.remove=function(key){
for(var i=0;i<this.elements.length;i++){
var _3d7=(this.weakKeys&&(this.elements[i]==key));
var _3d8=(!this.weakKeys&&(this.elements[i]===key));
if(_3d7||_3d8){
this.elements.remove(i);
this.dictionary[this.elements[i]]=undefined;
break;
}
}
};
_3d1.put=function(key,_3da){
this.remove(key);
this.elements.push(key);
this.dictionary[key]=_3da;
};
_3d1.isEmpty=function(){
return this.length==0;
};
_3d1.containsKey=function(key){
for(var i=0;i<this.elements.length;i++){
var _3dd=(this.weakKeys&&(this.elements[i]==key));
var _3de=(!this.weakKeys&&(this.elements[i]===key));
if(_3dd||_3de){
return true;
}
}
return false;
};
_3d1.keySet=function(){
return this.elements;
};
_3d1.getvalues=function(){
var _3df=[];
for(var i=0;i<this.elements.length;i++){
_3df.push(this.dictionary[this.elements[i]]);
}
return _3df;
};
return _3cf;
})();
var Node=(function(){
var Node=function(){
this.name="";
this.kind="";
this.values=[];
this.children=new _3ce();
};
var _3e3=Node.prototype;
_3e3.getWildcardChar=function(){
return "*";
};
_3e3.addChild=function(name,kind){
if(name==null||name.length==0){
throw new ArgumentError("A node may not have a null name.");
}
var _3e6=Node.createNode(name,this,kind);
this.children.put(name,_3e6);
return _3e6;
};
_3e3.hasChild=function(name,kind){
return null!=this.getChild(name)&&kind==this.getChild(name).kind;
};
_3e3.getChild=function(name){
return this.children.get(name);
};
_3e3.getDistanceFromRoot=function(){
var _3ea=0;
var _3eb=this;
while(!_3eb.isRootNode()){
_3ea++;
_3eb=_3eb.parent;
}
return _3ea;
};
_3e3.appendValues=function(){
if(this.isRootNode()){
throw new ArgumentError("Cannot set a values on the root node.");
}
if(this.values!=null){
for(var k=0;k<arguments.length;k++){
var _3ed=arguments[k];
this.values.push(_3ed);
}
}
};
_3e3.removeValue=function(_3ee){
if(this.isRootNode()){
return;
}
for(var i=0;i<this.values.length;i++){
if(this.values[i]==_3ee){
this.values.splice(i,1);
}
}
};
_3e3.getValues=function(){
return this.values;
};
_3e3.hasValues=function(){
return this.values!=null&&this.values.length>0;
};
_3e3.isRootNode=function(){
return this.parent==null;
};
_3e3.hasChildren=function(){
return this.children!=null&&this.children.getlength()>0;
};
_3e3.isWildcard=function(){
return this.name!=null&&this.name==this.getWildcardChar();
};
_3e3.hasWildcardChild=function(){
return this.hasChildren()&&this.children.containsKey(this.getWildcardChar());
};
_3e3.getFullyQualifiedName=function(){
var b=new String();
var name=[];
var _3f2=this;
while(!_3f2.isRootNode()){
name.push(_3f2.name);
_3f2=_3f2.parent;
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
_3e3.getChildrenAsList=function(){
return this.children.getvalues();
};
_3e3.findBestMatchingNode=function(_3f4,_3f5){
var _3f6=this.findAllMatchingNodes(_3f4,_3f5);
var _3f7=null;
var _3f8=0;
for(var i=0;i<_3f6.length;i++){
var node=_3f6[i];
if(node.getDistanceFromRoot()>_3f8){
_3f8=node.getDistanceFromRoot();
_3f7=node;
}
}
return _3f7;
};
_3e3.findAllMatchingNodes=function(_3fb,_3fc){
var _3fd=[];
var _3fe=this.getChildrenAsList();
for(var i=0;i<_3fe.length;i++){
var node=_3fe[i];
var _401=node.matches(_3fb,_3fc);
if(_401<0){
continue;
}
if(_401>=_3fb.length){
do{
if(node.hasValues()){
_3fd.push(node);
}
if(node.hasWildcardChild()){
var _402=node.getChild(this.getWildcardChar());
if(_402.kind!=this.kind){
node=null;
}else{
node=_402;
}
}else{
node=null;
}
}while(node!=null);
}else{
var _403=node.findAllMatchingNodes(_3fb,_401);
for(var j=0;j<_403.length;j++){
_3fd.push(_403[j]);
}
}
}
return _3fd;
};
_3e3.matches=function(_405,_406){
if(_406<0||_406>=_405.length){
return -1;
}
if(this.matchesToken(_405[_406])){
return _406+1;
}
if(!this.isWildcard()){
return -1;
}else{
if(this.kind!=_405[_406].kind){
return -1;
}
do{
_406++;
}while(_406<_405.length&&this.kind==_405[_406].kind);
return _406;
}
};
_3e3.matchesToken=function(_407){
return this.name==_407.name&&this.kind==_407.kind;
};
Node.createNode=function(name,_409,kind){
var node=new Node();
node.name=name;
node.parent=_409;
node.kind=kind;
return node;
};
return Node;
})();
var _40c=(function(){
var _40d=function(name,kind){
this.kind=kind;
this.name=name;
};
return _40d;
})();
window.Oid=(function(){
var Oid=function(data){
this.rep=data;
};
var _412=Oid.prototype;
_412.asArray=function(){
return this.rep;
};
_412.asString=function(){
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
var _416=(function(){
var _417=function(){
};
_417.create=function(_418,_419,_41a){
var _41b=_418+":"+_419;
var _41c=[];
for(var i=0;i<_41b.length;++i){
_41c.push(_41b.charCodeAt(i));
}
var _41e="Basic "+Base64.encode(_41c);
return new ChallengeResponse(_41e,_41a);
};
return _417;
})();
function InternalDefaultChallengeHandler(){
this.canHandle=function(_41f){
return false;
};
this.handle=function(_420,_421){
_421(null);
};
};
window.PasswordAuthentication=(function(){
function PasswordAuthentication(_422,_423){
this.username=_422;
this.password=_423;
};
PasswordAuthentication.prototype.clear=function(){
this.username=null;
this.password=null;
};
return PasswordAuthentication;
})();
window.ChallengeRequest=(function(){
var _424=function(_425,_426){
if(_425==null){
throw new Error("location is not defined.");
}
if(_426==null){
return;
}
var _427="Application ";
if(_426.indexOf(_427)==0){
_426=_426.substring(_427.length);
}
this.location=_425;
this.authenticationParameters=null;
var _428=_426.indexOf(" ");
if(_428==-1){
this.authenticationScheme=_426;
}else{
this.authenticationScheme=_426.substring(0,_428);
if(_426.length>_428+1){
this.authenticationParameters=_426.substring(_428+1);
}
}
};
return _424;
})();
window.ChallengeResponse=(function(){
var _429=function(_42a,_42b){
this.credentials=_42a;
this.nextChallengeHandler=_42b;
};
var _42c=_429.prototype;
_42c.clearCredentials=function(){
if(this.credentials!=null){
this.credentials=null;
}
};
return _429;
})();
window.BasicChallengeHandler=(function(){
var _42d=function(){
this.loginHandler=undefined;
this.loginHandlersByRealm={};
};
var _42e=_42d.prototype;
_42e.setRealmLoginHandler=function(_42f,_430){
if(_42f==null){
throw new ArgumentError("null realm");
}
if(_430==null){
throw new ArgumentError("null loginHandler");
}
this.loginHandlersByRealm[_42f]=_430;
return this;
};
_42e.canHandle=function(_431){
return _431!=null&&"Basic"==_431.authenticationScheme;
};
_42e.handle=function(_432,_433){
if(_432.location!=null){
var _434=this.loginHandler;
var _435=_3c8.getRealm(_432);
if(_435!=null&&this.loginHandlersByRealm[_435]!=null){
_434=this.loginHandlersByRealm[_435];
}
var _436=this;
if(_434!=null){
_434(function(_437){
if(_437!=null&&_437.username!=null){
_433(_416.create(_437.username,_437.password,_436));
}else{
_433(null);
}
});
return;
}
}
_433(null);
};
_42e.loginHandler=function(_438){
_438(null);
};
return _42d;
})();
window.DispatchChallengeHandler=(function(){
var _439=function(){
this.rootNode=new Node();
var _43a="^(.*)://(.*)";
this.SCHEME_URI_PATTERN=new RegExp(_43a);
};
function delChallengeHandlerAtLocation(_43b,_43c,_43d){
var _43e=tokenize(_43c);
var _43f=_43b;
for(var i=0;i<_43e.length;i++){
var _441=_43e[i];
if(!_43f.hasChild(_441.name,_441.kind)){
return;
}else{
_43f=_43f.getChild(_441.name);
}
}
_43f.removeValue(_43d);
};
function addChallengeHandlerAtLocation(_442,_443,_444){
var _445=tokenize(_443);
var _446=_442;
for(var i=0;i<_445.length;i++){
var _448=_445[i];
if(!_446.hasChild(_448.name,_448.kind)){
_446=_446.addChild(_448.name,_448.kind);
}else{
_446=_446.getChild(_448.name);
}
}
_446.appendValues(_444);
};
function lookupByLocation(_449,_44a){
var _44b=new Array();
if(_44a!=null){
var _44c=findBestMatchingNode(_449,_44a);
if(_44c!=null){
return _44c.values;
}
}
return _44b;
};
function lookupByRequest(_44d,_44e){
var _44f=null;
var _450=_44e.location;
if(_450!=null){
var _451=findBestMatchingNode(_44d,_450);
if(_451!=null){
var _452=_451.getValues();
if(_452!=null){
for(var i=0;i<_452.length;i++){
var _454=_452[i];
if(_454.canHandle(_44e)){
_44f=_454;
break;
}
}
}
}
}
return _44f;
};
function findBestMatchingNode(_455,_456){
var _457=tokenize(_456);
var _458=0;
return _455.findBestMatchingNode(_457,_458);
};
function tokenize(uri){
var _45a=new Array();
if(uri==null||uri.length==0){
return _45a;
}
var _45b=new RegExp("^(([^:/?#]+):(//))?([^/?#]*)?([^?#]*)(\\?([^#]*))?(#(.*))?");
var _45c=_45b.exec(uri);
if(_45c==null){
return _45a;
}
var _45d=_45c[2]||"http";
var _45e=_45c[4];
var path=_45c[5];
var _460=null;
var _461=null;
var _462=null;
var _463=null;
if(_45e!=null){
var host=_45e;
var _465=host.indexOf("@");
if(_465>=0){
_461=host.substring(0,_465);
host=host.substring(_465+1);
var _466=_461.indexOf(":");
if(_466>=0){
_462=_461.substring(0,_466);
_463=_461.substring(_466+1);
}
}
var _467=host.indexOf(":");
if(_467>=0){
_460=host.substring(_467+1);
host=host.substring(0,_467);
}
}else{
throw new ArgumentError("Hostname is required.");
}
var _468=host.split(/\./);
_468.reverse();
for(var k=0;k<_468.length;k++){
_45a.push(new _40c(_468[k],_3c5.HOST));
}
if(_460!=null){
_45a.push(new _40c(_460,_3c5.PORT));
}else{
if(getDefaultPort(_45d)>0){
_45a.push(new _40c(getDefaultPort(_45d).toString(),_3c5.PORT));
}
}
if(_461!=null){
if(_462!=null){
_45a.push(new _40c(_462,_3c5.USERINFO));
}
if(_463!=null){
_45a.push(new _40c(_463,_3c5.USERINFO));
}
if(_462==null&&_463==null){
_45a.push(new _40c(_461,_3c5.USERINFO));
}
}
if(isNotBlank(path)){
if(path.charAt(0)=="/"){
path=path.substring(1);
}
if(isNotBlank(path)){
var _46a=path.split("/");
for(var p=0;p<_46a.length;p++){
var _46c=_46a[p];
_45a.push(new _40c(_46c,_3c5.PATH));
}
}
}
return _45a;
};
function getDefaultPort(_46d){
if(defaultPortsByScheme[_46d.toLowerCase()]!=null){
return defaultPortsByScheme[_46d];
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
var _46f=_439.prototype;
_46f.clear=function(){
this.rootNode=new Node();
};
_46f.canHandle=function(_470){
return lookupByRequest(this.rootNode,_470)!=null;
};
_46f.handle=function(_471,_472){
var _473=lookupByRequest(this.rootNode,_471);
if(_473==null){
return null;
}
return _473.handle(_471,_472);
};
_46f.register=function(_474,_475){
if(_474==null||_474.length==0){
throw new Error("Must specify a location to handle challenges upon.");
}
if(_475==null){
throw new Error("Must specify a handler to handle challenges.");
}
addChallengeHandlerAtLocation(this.rootNode,_474,_475);
return this;
};
_46f.unregister=function(_476,_477){
if(_476==null||_476.length==0){
throw new Error("Must specify a location to un-register challenge handlers upon.");
}
if(_477==null){
throw new Error("Must specify a handler to un-register.");
}
delChallengeHandlerAtLocation(this.rootNode,_476,_477);
return this;
};
return _439;
})();
window.NegotiableChallengeHandler=(function(){
var _478=function(){
this.candidateChallengeHandlers=new Array();
};
var _479=function(_47a){
var oids=new Array();
for(var i=0;i<_47a.length;i++){
oids.push(Oid.create(_47a[i]).asArray());
}
var _47d=GssUtils.sizeOfSpnegoInitialContextTokenWithOids(null,oids);
var _47e=ByteBuffer.allocate(_47d);
_47e.skip(_47d);
GssUtils.encodeSpnegoInitialContextTokenWithOids(null,oids,_47e);
return ByteArrayUtils.arrayToByteArray(Base64Util.encodeBuffer(_47e));
};
var _47f=_478.prototype;
_47f.register=function(_480){
if(_480==null){
throw new Error("handler is null");
}
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
if(_480===this.candidateChallengeHandlers[i]){
return this;
}
}
this.candidateChallengeHandlers.push(_480);
return this;
};
_47f.canHandle=function(_482){
return _482!=null&&_482.authenticationScheme=="Negotiate"&&_482.authenticationParameters==null;
};
_47f.handle=function(_483,_484){
if(_483==null){
throw Error(new ArgumentError("challengeRequest is null"));
}
var _485=new _3ce();
for(var i=0;i<this.candidateChallengeHandlers.length;i++){
var _487=this.candidateChallengeHandlers[i];
if(_487.canHandle(_483)){
try{
var _488=_487.getSupportedOids();
for(var j=0;j<_488.length;j++){
var oid=new Oid(_488[j]).asString();
if(!_485.containsKey(oid)){
_485.put(oid,_487);
}
}
}
catch(e){
}
}
}
if(_485.isEmpty()){
_484(null);
return;
}
};
return _478;
})();
window.NegotiableChallengeHandler=(function(){
var _48b=function(){
this.loginHandler=undefined;
};
_48b.prototype.getSupportedOids=function(){
return new Array();
};
return _48b;
})();
window.NegotiableChallengeHandler=(function(){
var _48c=function(){
this.loginHandler=undefined;
};
_48c.prototype.getSupportedOids=function(){
return new Array();
};
return _48c;
})();
var _48d={};
(function(){
var _48e=_26b.getLogger("com.kaazing.gateway.client.html5.Windows1252");
var _48f={8364:128,129:129,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,141:141,381:142,143:143,144:144,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,157:157,382:158,376:159};
var _490={128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376};
_48d.toCharCode=function(n){
if(n<128||(n>159&&n<256)){
return n;
}else{
var _492=_490[n];
if(typeof (_492)=="undefined"){
_48e.severe(this,"Windows1252.toCharCode: Error: Could not find "+n);
throw new Error("Windows1252.toCharCode could not find: "+n);
}
return _492;
}
};
_48d.fromCharCode=function(code){
if(code<256){
return code;
}else{
var _494=_48f[code];
if(typeof (_494)=="undefined"){
_48e.severe(this,"Windows1252.fromCharCode: Error: Could not find "+code);
throw new Error("Windows1252.fromCharCode could not find: "+code);
}
return _494;
}
};
var _495=String.fromCharCode(127);
var NULL=String.fromCharCode(0);
var _497="\n";
var _498=function(s){
_48e.entering(this,"Windows1252.escapedToArray",s);
var a=[];
for(var i=0;i<s.length;i++){
var code=_48d.fromCharCode(s.charCodeAt(i));
if(code==127){
i++;
if(i==s.length){
a.hasRemainder=true;
break;
}
var _49d=_48d.fromCharCode(s.charCodeAt(i));
switch(_49d){
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
_48e.severe(this,"Windows1252.escapedToArray: Error: Escaping format error");
throw new Error("Escaping format error");
}
}else{
a.push(code);
}
}
return a;
};
var _49e=function(buf){
_48e.entering(this,"Windows1252.toEscapedByteString",buf);
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
var chr=String.fromCharCode(_48d.toCharCode(n));
switch(chr){
case _495:
a.push(_495);
a.push(_495);
break;
case NULL:
a.push(_495);
a.push("0");
break;
case _497:
a.push(_495);
a.push("n");
break;
default:
a.push(chr);
}
}
return a.join("");
};
_48d.toArray=function(s,_4a4){
_48e.entering(this,"Windows1252.toArray",{"s":s,"escaped":_4a4});
if(_4a4){
return _498(s);
}else{
var a=[];
for(var i=0;i<s.length;i++){
a.push(_48d.fromCharCode(s.charCodeAt(i)));
}
return a;
}
};
_48d.toByteString=function(buf,_4a8){
_48e.entering(this,"Windows1252.toByteString",{"buf":buf,"escaped":_4a8});
if(_4a8){
return _49e(buf);
}else{
var a=[];
while(buf.remaining()){
var n=buf.getUnsigned();
a.push(String.fromCharCode(_48d.toCharCode(n)));
}
return a.join("");
}
};
})();
function CloseEvent(_4ab,_4ac,_4ad,_4ae){
this.reason=_4ae;
this.code=_4ad;
this.wasClean=_4ac;
this.type="close";
this.bubbles=true;
this.cancelable=true;
this.target=_4ab;
};
function MessageEvent(_4af,_4b0,_4b1){
return {target:_4af,data:_4b0,origin:_4b1,bubbles:true,cancelable:true,type:"message",lastEventId:""};
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
var _4b3=function(_4b4,_4b5){
var _4b6=_4b5||{};
if(window.WebKitBlobBuilder){
var _4b7=new window.WebKitBlobBuilder();
for(var i=0;i<_4b4.length;i++){
var part=_4b4[i];
if(_4b6.endings){
_4b7.append(part,_4b6.endings);
}else{
_4b7.append(part);
}
}
var blob;
if(_4b6.type){
blob=_4b7.getBlob(type);
}else{
blob=_4b7.getBlob();
}
blob.slice=blob.webkitSlice||blob.slice;
return blob;
}else{
if(window.MozBlobBuilder){
var _4b7=new window.MozBlobBuilder();
for(var i=0;i<_4b4.length;i++){
var part=_4b4[i];
if(_4b6.endings){
_4b7.append(part,_4b6.endings);
}else{
_4b7.append(part);
}
}
var blob;
if(_4b6.type){
blob=_4b7.getBlob(type);
}else{
blob=_4b7.getBlob();
}
blob.slice=blob.mozSlice||blob.slice;
return blob;
}else{
var _4bb=[];
for(var i=0;i<_4b4.length;i++){
var part=_4b4[i];
if(typeof part==="string"){
var b=BlobUtils.fromString(part,_4b6.endings);
_4bb.push(b);
}else{
if(part.byteLength){
var _4bd=new Uint8Array(part);
for(var i=0;i<part.byteLength;i++){
_4bb.push(_4bd[i]);
}
}else{
if(part.length){
_4bb.push(part);
}else{
if(part._array){
_4bb.push(part._array);
}else{
throw new Error("invalid type in Blob constructor");
}
}
}
}
}
var blob=concatMemoryBlobs(_4bb);
blob.type=_4b6.type;
return blob;
}
}
};
function MemoryBlob(_4be,_4bf){
return {_array:_4be,size:_4be.length,type:_4bf||"",slice:function(_4c0,end,_4c2){
var a=this._array.slice(_4c0,end);
return MemoryBlob(a,_4c2);
},toString:function(){
return "MemoryBlob: "+_4be.toString();
}};
};
function concatMemoryBlobs(_4c4){
var a=Array.prototype.concat.apply([],_4c4);
return new MemoryBlob(a);
};
window.Blob=_4b3;
})();
(function(_4c6){
_4c6.BlobUtils={};
BlobUtils.asString=function asString(blob,_4c8,end){
if(blob._array){
}else{
if(FileReader){
var _4ca=new FileReader();
_4ca.readAsText(blob);
_4ca.onload=function(){
cb(_4ca.result);
};
_4ca.onerror=function(e){
console.log(e,_4ca);
};
}
}
};
BlobUtils.asNumberArray=(function(){
var _4cc=[];
var _4cd=function(){
if(_4cc.length>0){
try{
var _4ce=_4cc.shift();
_4ce.cb(_4ce.blob._array);
}
finally{
if(_4cc.length>0){
setTimeout(function(){
_4cd();
},0);
}
}
}
};
var _4cf=function(cb,blob){
if(blob._array){
_4cc.push({cb:cb,blob:blob});
if(_4cc.length==1){
setTimeout(function(){
_4cd();
},0);
}
}else{
if(FileReader){
var _4d2=new FileReader();
_4d2.readAsArrayBuffer(blob);
_4d2.onload=function(){
var _4d3=new DataView(_4d2.result);
var a=[];
for(var i=0;i<_4d2.result.byteLength;i++){
a.push(_4d3.getUint8(i));
}
cb(a);
};
}else{
throw new Error("Cannot convert Blob to binary string");
}
}
};
return _4cf;
})();
BlobUtils.asBinaryString=function asBinaryString(cb,blob){
if(blob._array){
var _4d8=blob._array;
var a=[];
for(var i=0;i<_4d8.length;i++){
a.push(String.fromCharCode(_4d8[i]));
}
setTimeout(function(){
cb(a.join(""));
},0);
}else{
if(FileReader){
var _4db=new FileReader();
if(_4db.readAsBinaryString){
_4db.readAsBinaryString(blob);
_4db.onload=function(){
cb(_4db.result);
};
}else{
_4db.readAsArrayBuffer(blob);
_4db.onload=function(){
var _4dc=new DataView(_4db.result);
var a=[];
for(var i=0;i<_4db.result.byteLength;i++){
a.push(String.fromCharCode(_4dc.getUint8(i)));
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
var _4e0=[];
for(var i=0;i<s.length;i++){
_4e0.push(s.charCodeAt(i));
}
return BlobUtils.fromNumberArray(_4e0);
};
BlobUtils.fromNumberArray=function fromNumberArray(a){
if(typeof (Uint8Array)!=="undefined"){
return new Blob([new Uint8Array(a)]);
}else{
return new Blob([a]);
}
};
BlobUtils.fromString=function fromString(s,_4e4){
if(_4e4&&_4e4==="native"){
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
var _4e7=function(){
this._queue=[];
this._count=0;
this.completion;
};
_4e7.prototype.enqueue=function(cb){
var _4e9=this;
var _4ea={};
_4ea.cb=cb;
_4ea.id=this._count++;
this._queue.push(_4ea);
var func=function(){
_4e9.processQueue(_4ea.id,cb,arguments);
};
return func;
};
_4e7.prototype.processQueue=function(id,cb,args){
for(var i=0;i<this._queue.length;i++){
if(this._queue[i].id==id){
this._queue[i].args=args;
break;
}
}
while(this._queue.length&&this._queue[0].args!==undefined){
var _4f0=this._queue.shift();
_4f0.cb.apply(null,_4f0.args);
}
};
var _4f1=(function(){
var _4f2=function(_4f3,_4f4){
this.label=_4f3;
this.value=_4f4;
};
return _4f2;
})();
var _4f5=(function(){
var _4f6=function(_4f7){
var uri=new URI(_4f7);
if(isValidScheme(uri.scheme)){
this._uri=uri;
}else{
throw new Error("HttpURI - invalid scheme: "+_4f7);
}
};
function isValidScheme(_4f9){
return "http"==_4f9||"https"==_4f9;
};
var _4fa=_4f6.prototype;
_4fa.getURI=function(){
return this._uri;
};
_4fa.duplicate=function(uri){
try{
return new _4f6(uri);
}
catch(e){
throw e;
}
return null;
};
_4fa.isSecure=function(){
return ("https"==this._uri.scheme);
};
_4fa.toString=function(){
return this._uri.toString();
};
_4f6.replaceScheme=function(_4fc,_4fd){
var uri=URI.replaceProtocol(_4fc,_4fd);
return new _4f6(uri);
};
return _4f6;
})();
var _4ff=(function(){
var _500=function(_501){
var uri=new URI(_501);
if(isValidScheme(uri.scheme)){
this._uri=uri;
if(uri.port==undefined){
this._uri=new URI(_500.addDefaultPort(_501));
}
}else{
throw new Error("WSURI - invalid scheme: "+_501);
}
};
function isValidScheme(_503){
return "ws"==_503||"wss"==_503;
};
function duplicate(uri){
try{
return new _500(uri);
}
catch(e){
throw e;
}
return null;
};
var _505=_500.prototype;
_505.getAuthority=function(){
return this._uri.authority;
};
_505.isSecure=function(){
return "wss"==this._uri.scheme;
};
_505.getHttpEquivalentScheme=function(){
return this.isSecure()?"https":"http";
};
_505.toString=function(){
return this._uri.toString();
};
var _506=80;
var _507=443;
_500.setDefaultPort=function(uri){
if(uri.port==0){
if(uri.scheme=="ws"){
uri.port=_506;
}else{
if(uri.scheme=="wss"){
uri.port=_507;
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
_500.addDefaultPort=function(_509){
var uri=new URI(_509);
if(uri.port==undefined){
_500.setDefaultPort(uri);
}
return uri.toString();
};
_500.replaceScheme=function(_50b,_50c){
var uri=URI.replaceProtocol(_50b,_50c);
return new _500(uri);
};
return _500;
})();
var _50e=(function(){
var _50f={};
_50f["ws"]="ws";
_50f["wss"]="wss";
_50f["javascript:wse"]="ws";
_50f["javascript:wse+ssl"]="wss";
_50f["javascript:ws"]="ws";
_50f["javascript:wss"]="wss";
_50f["flash:wsr"]="ws";
_50f["flash:wsr+ssl"]="wss";
_50f["flash:wse"]="ws";
_50f["flash:wse+ssl"]="wss";
var _510=function(_511){
var _512=getProtocol(_511);
if(isValidScheme(_512)){
this._uri=new URI(URI.replaceProtocol(_511,_50f[_512]));
this._compositeScheme=_512;
this._location=_511;
}else{
throw new SyntaxError("WSCompositeURI - invalid composite scheme: "+getProtocol(_511));
}
};
function getProtocol(_513){
var indx=_513.indexOf("://");
if(indx>0){
return _513.substr(0,indx);
}else{
return "";
}
};
function isValidScheme(_515){
return _50f[_515]!=null;
};
function duplicate(uri){
try{
return new _510(uri);
}
catch(e){
throw e;
}
return null;
};
var _517=_510.prototype;
_517.isSecure=function(){
var _518=this._uri.scheme;
return "wss"==_50f[_518];
};
_517.getWSEquivalent=function(){
try{
var _519=_50f[this._compositeScheme];
return _4ff.replaceScheme(this._location,_519);
}
catch(e){
throw e;
}
return null;
};
_517.getPlatformPrefix=function(){
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
_517.toString=function(){
return this._location;
};
return _510;
})();
var _51a=(function(){
var _51b=function(_51c,_51d,_51e){
if(arguments.length<3){
var s="ResumableTimer: Please specify the required parameters 'callback', 'delay', and 'updateDelayWhenPaused'.";
throw Error(s);
}
if((typeof (_51c)=="undefined")||(_51c==null)){
var s="ResumableTimer: Please specify required parameter 'callback'.";
throw Error(s);
}else{
if(typeof (_51c)!="function"){
var s="ResumableTimer: Required parameter 'callback' must be a function.";
throw Error(s);
}
}
if(typeof (_51d)=="undefined"){
var s="ResumableTimer: Please specify required parameter 'delay' of type integer.";
throw Error(s);
}else{
if((typeof (_51d)!="number")||(_51d<=0)){
var s="ResumableTimer: Required parameter 'delay' should be a positive integer.";
throw Error(s);
}
}
if(typeof (_51e)=="undefined"){
var s="ResumableTimer: Please specify required boolean parameter 'updateDelayWhenPaused'.";
throw Error(s);
}else{
if(typeof (_51e)!="boolean"){
var s="ResumableTimer: Required parameter 'updateDelayWhenPaused' is a boolean.";
throw Error(s);
}
}
this._delay=_51d;
this._updateDelayWhenPaused=_51e;
this._callback=_51c;
this._timeoutId=-1;
this._startTime=-1;
};
var _520=_51b.prototype;
_520.cancel=function(){
if(this._timeoutId!=-1){
window.clearTimeout(this._timeoutId);
this._timeoutId=-1;
}
this._delay=-1;
this._callback=null;
};
_520.pause=function(){
if(this._timeoutId==-1){
return;
}
window.clearTimeout(this._timeoutId);
var _521=new Date().getTime();
var _522=_521-this._startTime;
this._timeoutId=-1;
if(this._updateDelayWhenPaused){
this._delay=this._delay-_522;
}
};
_520.resume=function(){
if(this._timeoutId!=-1){
return;
}
if(this._callback==null){
var s="Timer cannot be resumed as it has been canceled.";
throw new Error(s);
}
this.start();
};
_520.start=function(){
if(this._delay<0){
var s="Timer delay cannot be negative";
}
this._timeoutId=window.setTimeout(this._callback,this._delay);
this._startTime=new Date().getTime();
};
return _51b;
})();
var _525=(function(){
var _526=function(){
this._parent=null;
this._challengeResponse=new ChallengeResponse(null,null);
};
_526.prototype.toString=function(){
return "[Channel]";
};
return _526;
})();
var _527=(function(){
var _528=function(_529,_52a,_52b){
_525.apply(this,arguments);
this._location=_529;
this._protocol=_52a;
this._extensions=[];
this._controlFrames={};
this._controlFramesBinary={};
this._escapeSequences={};
this._handshakePayload="";
this._isEscape=false;
this._bufferedAmount=0;
};
var _52c=_528.prototype=new _525();
_52c.getBufferedAmount=function(){
return this._bufferedAmount;
};
_52c.toString=function(){
return "[WebSocketChannel "+_location+" "+_protocol!=null?_protocol:"-"+"]";
};
return _528;
})();
var _52d=(function(){
var _52e=function(){
this._nextHandler;
this._listener;
};
var _52f=_52e.prototype;
_52f.processConnect=function(_530,_531,_532){
this._nextHandler.processConnect(_530,_531,_532);
};
_52f.processAuthorize=function(_533,_534){
this._nextHandler.processAuthorize(_533,_534);
};
_52f.processTextMessage=function(_535,text){
this._nextHandler.processTextMessage(_535,text);
};
_52f.processBinaryMessage=function(_537,_538){
this._nextHandler.processBinaryMessage(_537,_538);
};
_52f.processClose=function(_539,code,_53b){
this._nextHandler.processClose(_539,code,_53b);
};
_52f.setIdleTimeout=function(_53c,_53d){
this._nextHandler.setIdleTimeout(_53c,_53d);
};
_52f.setListener=function(_53e){
this._listener=_53e;
};
_52f.setNextHandler=function(_53f){
this._nextHandler=_53f;
};
return _52e;
})();
var _540=function(_541){
this.connectionOpened=function(_542,_543){
_541._listener.connectionOpened(_542,_543);
};
this.textMessageReceived=function(_544,s){
_541._listener.textMessageReceived(_544,s);
};
this.binaryMessageReceived=function(_546,obj){
_541._listener.binaryMessageReceived(_546,obj);
};
this.connectionClosed=function(_548,_549,code,_54b){
_541._listener.connectionClosed(_548,_549,code,_54b);
};
this.connectionError=function(_54c,e){
_541._listener.connectionError(_54c,e);
};
this.connectionFailed=function(_54e){
_541._listener.connectionFailed(_54e);
};
this.authenticationRequested=function(_54f,_550,_551){
_541._listener.authenticationRequested(_54f,_550,_551);
};
this.redirected=function(_552,_553){
_541._listener.redirected(_552,_553);
};
this.onBufferedAmountChange=function(_554,n){
_541._listener.onBufferedAmountChange(_554,n);
};
};
var _556=(function(){
var _557=function(){
var _558="";
var _559="";
};
_557.KAAZING_EXTENDED_HANDSHAKE="x-kaazing-handshake";
_557.KAAZING_SEC_EXTENSION_REVALIDATE="x-kaazing-http-revalidate";
_557.HEADER_SEC_EXTENSIONS="X-WebSocket-Extensions";
_557.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT="x-kaazing-idle-timeout";
_557.KAAZING_SEC_EXTENSION_PING_PONG="x-kaazing-ping-pong";
return _557;
})();
var _55a=(function(){
var _55b=function(_55c,_55d){
_527.apply(this,arguments);
this.requestHeaders=[];
this.responseHeaders={};
this.readyState=WebSocket.CONNECTING;
this.authenticationReceived=false;
this.wasCleanClose=false;
this.closeCode=1006;
this.closeReason="";
this.preventFallback=false;
};
return _55b;
})();
var _55e=(function(){
var _55f=function(){
};
var _560=_55f.prototype;
_560.createChannel=function(_561,_562,_563){
var _564=new _55a(_561,_562,_563);
return _564;
};
return _55f;
})();
var _565=(function(){
var _566=function(){
};
var _567=_566.prototype;
_567.createChannel=function(_568,_569){
var _56a=new _55a(_568,_569);
return _56a;
};
return _566;
})();
var _56b=(function(){
var _56c=function(_56d,_56e){
this._location=_56d.getWSEquivalent();
this._protocol=_56e;
this._webSocket;
this._compositeScheme=_56d._compositeScheme;
this._connectionStrategies=[];
this._selectedChannel;
this.readyState=0;
this._closing=false;
this._negotiatedExtensions={};
this._compositeScheme=_56d._compositeScheme;
};
var _56f=_56c.prototype=new _527();
_56f.getReadyState=function(){
return this.readyState;
};
_56f.getWebSocket=function(){
return this._webSocket;
};
_56f.getCompositeScheme=function(){
return this._compositeScheme;
};
_56f.getNextStrategy=function(){
if(this._connectionStrategies.length<=0){
return null;
}else{
return this._connectionStrategies.shift();
}
};
_56f.getRedirectPolicy=function(){
return this.getWebSocket().getRedirectPolicy();
};
return _56c;
})();
var _570=(function(){
var _571="WebSocketControlFrameHandler";
var LOG=_26b.getLogger(_571);
var _573=function(){
LOG.finest(_571,"<init>");
};
var _574=function(_575,_576){
var _577=0;
for(var i=_576;i<_576+4;i++){
_577=(_577<<8)+_575.getAt(i);
}
return _577;
};
var _579=function(_57a){
if(_57a.byteLength>3){
var _57b=new DataView(_57a);
return _57b.getInt32(0);
}
return 0;
};
var _57c=function(_57d){
var _57e=0;
for(var i=0;i<4;i++){
_57e=(_57e<<8)+_57d.charCodeAt(i);
}
return _57e;
};
var ping=[9,0];
var pong=[10,0];
var _582={};
var _583=function(_584){
if(typeof _582.escape==="undefined"){
var _585=[];
var i=4;
do{
_585[--i]=_584&(255);
_584=_584>>8;
}while(i);
_582.escape=String.fromCharCode.apply(null,_585.concat(pong));
}
return _582.escape;
};
var _587=function(_588,_589,_58a,_58b){
if(_556.KAAZING_SEC_EXTENSION_REVALIDATE==_589._controlFrames[_58b]){
var url=_58a.substr(5);
if(_589._redirectUri!=null){
if(typeof (_589._redirectUri)=="string"){
var _58d=new URI(_589._redirectUri);
url=_58d.scheme+"://"+_58d.authority+url;
}else{
url=_589._redirectUri.getHttpEquivalentScheme()+"://"+_589._redirectUri.getAuthority()+url;
}
}else{
url=_589._location.getHttpEquivalentScheme()+"://"+_589._location.getAuthority()+url;
}
_588._listener.authenticationRequested(_589,url,_556.KAAZING_SEC_EXTENSION_REVALIDATE);
}else{
if(_556.KAAZING_SEC_EXTENSION_PING_PONG==_589._controlFrames[_58b]){
if(_58a.charCodeAt(4)==ping[0]){
var pong=_583(_58b);
_588._nextHandler.processTextMessage(_589,pong);
}
}
}
};
var _58f=_573.prototype=new _52d();
_58f.handleConnectionOpened=function(_590,_591){
LOG.finest(_571,"handleConnectionOpened");
var _592=_590.responseHeaders;
if(_592[_556.HEADER_SEC_EXTENSIONS]!=null){
var _593=_592[_556.HEADER_SEC_EXTENSIONS];
if(_593!=null&&_593.length>0){
var _594=_593.split(",");
for(var j=0;j<_594.length;j++){
var tmp=_594[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _598=new WebSocketExtension(ext);
_598.enabled=true;
_598.negotiated=true;
if(tmp.length>1){
var _599=tmp[1].replace(/^\s+|\s+$/g,"");
if(_599.length==8){
try{
var _59a=parseInt(_599,16);
_590._controlFrames[_59a]=ext;
if(_556.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_590._controlFramesBinary[_59a]=ext;
}
_598.escape=_599;
}
catch(e){
LOG.finest(_571,"parse control frame bytes error");
}
}
}
_590.parent._negotiatedExtensions[ext]=_598;
}
}
}
this._listener.connectionOpened(_590,_591);
};
_58f.handleTextMessageReceived=function(_59b,_59c){
LOG.finest(_571,"handleMessageReceived",_59c);
if(_59b._isEscape){
_59b._isEscape=false;
this._listener.textMessageReceived(_59b,_59c);
return;
}
if(_59c==null||_59c.length<4){
this._listener.textMessageReceived(_59b,_59c);
return;
}
var _59d=_57c(_59c);
if(_59b._controlFrames[_59d]!=null){
if(_59c.length==4){
_59b._isEscape=true;
return;
}else{
_587(this,_59b,_59c,_59d);
}
}else{
this._listener.textMessageReceived(_59b,_59c);
}
};
_58f.handleMessageReceived=function(_59e,_59f){
LOG.finest(_571,"handleMessageReceived",_59f);
if(_59e._isEscape){
_59e._isEscape=false;
this._listener.binaryMessageReceived(_59e,_59f);
return;
}
if(typeof (_59f.byteLength)!="undefined"){
var _5a0=_579(_59f);
if(_59e._controlFramesBinary[_5a0]!=null){
if(_59f.byteLength==4){
_59e._isEscape=true;
return;
}else{
_587(this,_59e,String.fromCharCode.apply(null,new Uint8Array(_59f,0)),_5a0);
}
}else{
this._listener.binaryMessageReceived(_59e,_59f);
}
}else{
if(_59f.constructor==ByteBuffer){
if(_59f==null||_59f.limit<4){
this._listener.binaryMessageReceived(_59e,_59f);
return;
}
var _5a0=_574(_59f,_59f.position);
if(_59e._controlFramesBinary[_5a0]!=null){
if(_59f.limit==4){
_59e._isEscape=true;
return;
}else{
_587(this,_59e,_59f.getString(Charset.UTF8),_5a0);
}
}else{
this._listener.binaryMessageReceived(_59e,_59f);
}
}
}
};
_58f.processTextMessage=function(_5a1,_5a2){
if(_5a2.length>=4){
var _5a3=_57c(_5a2);
if(_5a1._escapeSequences[_5a3]!=null){
var _5a4=_5a2.slice(0,4);
this._nextHandler.processTextMessage(_5a1,_5a4);
}
}
this._nextHandler.processTextMessage(_5a1,_5a2);
};
_58f.setNextHandler=function(_5a5){
var _5a6=this;
this._nextHandler=_5a5;
var _5a7=new _540(this);
_5a7.connectionOpened=function(_5a8,_5a9){
_5a6.handleConnectionOpened(_5a8,_5a9);
};
_5a7.textMessageReceived=function(_5aa,buf){
_5a6.handleTextMessageReceived(_5aa,buf);
};
_5a7.binaryMessageReceived=function(_5ac,buf){
_5a6.handleMessageReceived(_5ac,buf);
};
_5a5.setListener(_5a7);
};
_58f.setListener=function(_5ae){
this._listener=_5ae;
};
return _573;
})();
var _5af=(function(){
var LOG=_26b.getLogger("RevalidateHandler");
var _5b1=function(_5b2){
LOG.finest("ENTRY Revalidate.<init>");
this.channel=_5b2;
};
var _5b3=function(_5b4){
var _5b5=_5b4.parent;
if(_5b5){
return (_5b5.readyState>=2);
}
return false;
};
var _5b6=_5b1.prototype;
_5b6.connect=function(_5b7){
LOG.finest("ENTRY Revalidate.connect with {0}",_5b7);
if(_5b3(this.channel)){
return;
}
var _5b8=this;
var _5b9=new XMLHttpRequest0();
_5b9.withCredentials=true;
_5b9.open("GET",_5b7+"&.krn="+Math.random(),true);
if(_5b8.channel._challengeResponse!=null&&_5b8.channel._challengeResponse.credentials!=null){
_5b9.setRequestHeader("Authorization",_5b8.channel._challengeResponse.credentials);
this.clearAuthenticationData(_5b8.channel);
}
_5b9.onreadystatechange=function(){
switch(_5b9.readyState){
case 2:
if(_5b9.status==403){
_5b9.abort();
}
break;
case 4:
if(_5b9.status==401){
_5b8.handle401(_5b8.channel,_5b7,_5b9.getResponseHeader("WWW-Authenticate"));
return;
}
break;
}
};
_5b9.send(null);
};
_5b6.clearAuthenticationData=function(_5ba){
if(_5ba._challengeResponse!=null){
_5ba._challengeResponse.clearCredentials();
}
};
_5b6.handle401=function(_5bb,_5bc,_5bd){
if(_5b3(_5bb)){
return;
}
var _5be=this;
var _5bf=_5bc;
if(_5bf.indexOf("/;a/")>0){
_5bf=_5bf.substring(0,_5bf.indexOf("/;a/"));
}else{
if(_5bf.indexOf("/;ae/")>0){
_5bf=_5bf.substring(0,_5bf.indexOf("/;ae/"));
}else{
if(_5bf.indexOf("/;ar/")>0){
_5bf=_5bf.substring(0,_5bf.indexOf("/;ar/"));
}
}
}
var _5c0=new ChallengeRequest(_5bf,_5bd);
var _5c1;
if(this.channel._challengeResponse.nextChallengeHandler!=null){
_5c1=this.channel._challengeResponse.nextChallengeHandler;
}else{
_5c1=_5bb.challengeHandler;
}
if(_5c1!=null&&_5c1.canHandle(_5c0)){
_5c1.handle(_5c0,function(_5c2){
try{
if(_5c2!=null&&_5c2.credentials!=null){
_5be.channel._challengeResponse=_5c2;
_5be.connect(_5bc);
}
}
catch(e){
}
});
}
};
return _5b1;
})();
var _5c3=(function(){
var _5c4="WebSocketNativeDelegateHandler";
var LOG=_26b.getLogger(_5c4);
var _5c6=function(){
LOG.finest(_5c4,"<init>");
};
var _5c7=_5c6.prototype=new _52d();
_5c7.processConnect=function(_5c8,uri,_5ca){
LOG.finest(_5c4,"connect",_5c8);
if(_5c8.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
if(_5c8._delegate==null){
var _5cb=new _2d7();
_5cb.parent=_5c8;
_5c8._delegate=_5cb;
_5cc(_5cb,this);
}
_5c8._delegate.connect(uri.toString(),_5ca);
};
_5c7.processTextMessage=function(_5cd,text){
LOG.finest(_5c4,"processTextMessage",_5cd);
if(_5cd._delegate.readyState()==WebSocket.OPEN){
_5cd._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_5c7.processBinaryMessage=function(_5cf,obj){
LOG.finest(_5c4,"processBinaryMessage",_5cf);
if(_5cf._delegate.readyState()==WebSocket.OPEN){
_5cf._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_5c7.processClose=function(_5d1,code,_5d3){
LOG.finest(_5c4,"close",_5d1);
try{
_5d1._delegate.close(code,_5d3);
}
catch(e){
LOG.finest(_5c4,"processClose exception: ",e);
}
};
_5c7.setIdleTimeout=function(_5d4,_5d5){
LOG.finest(_5c4,"idleTimeout",_5d4);
try{
_5d4._delegate.setIdleTimeout(_5d5);
}
catch(e){
LOG.finest(_5c4,"setIdleTimeout exception: ",e);
}
};
var _5cc=function(_5d6,_5d7){
var _5d8=new _540(_5d7);
_5d6.setListener(_5d8);
};
return _5c6;
})();
var _5d9=(function(){
var _5da="WebSocketNativeBalancingHandler";
var LOG=_26b.getLogger(_5da);
var _5dc=function(){
LOG.finest(_5da,"<init>");
};
var _5dd=function(_5de,_5df,_5e0){
_5df._redirecting=true;
_5df._redirectUri=_5e0;
_5de._nextHandler.processClose(_5df);
};
var _5e1=_5dc.prototype=new _52d();
_5e1.processConnect=function(_5e2,uri,_5e4){
_5e2._balanced=0;
this._nextHandler.processConnect(_5e2,uri,_5e4);
};
_5e1.handleConnectionClosed=function(_5e5,_5e6,code,_5e8){
if(_5e5._redirecting==true){
_5e5._redirecting=false;
var _5e9=_5e5._redirectUri;
var _5ea=_5e5._location;
var _5eb=_5e5.parent;
var _5ec=_5eb.getRedirectPolicy();
if(_5ec instanceof HttpRedirectPolicy){
if(!_5ec.isRedirectionAllowed(_5ea.toString(),_5e9.toString())){
_5e5.preventFallback=true;
var s=_5ec.toString()+": Cannot redirect from "+_5ea.toString()+" to "+_5e9.toString();
this._listener.connectionClosed(_5e5,false,1006,s);
return;
}
}
_5e5._redirected=true;
_5e5.handshakePayload="";
var _5ee=[_556.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_5e5._protocol.length;i++){
_5ee.push(_5e5._protocol[i]);
}
this.processConnect(_5e5,_5e5._redirectUri,_5ee);
}else{
this._listener.connectionClosed(_5e5,_5e6,code,_5e8);
}
};
_5e1.handleMessageReceived=function(_5f0,obj){
LOG.finest(_5da,"handleMessageReceived",obj);
if(_5f0._balanced>1){
this._listener.binaryMessageReceived(_5f0,obj);
return;
}
var _5f2=_2b1(obj);
if(_5f2.charCodeAt(0)==61695){
if(_5f2.match("N$")){
_5f0._balanced++;
if(_5f0._balanced==1){
this._listener.connectionOpened(_5f0,_556.KAAZING_EXTENDED_HANDSHAKE);
}else{
this._listener.connectionOpened(_5f0,_5f0._acceptedProtocol||"");
}
}else{
if(_5f2.indexOf("R")==1){
var _5f3=new _4ff(_5f2.substring(2));
_5dd(this,_5f0,_5f3);
}else{
LOG.warning(_5da,"Invalidate balancing message: "+target);
}
}
return;
}else{
this._listener.binaryMessageReceived(_5f0,obj);
}
};
_5e1.setNextHandler=function(_5f4){
this._nextHandler=_5f4;
var _5f5=new _540(this);
var _5f6=this;
_5f5.connectionOpened=function(_5f7,_5f8){
if(_556.KAAZING_EXTENDED_HANDSHAKE!=_5f8){
_5f7._balanced=2;
_5f6._listener.connectionOpened(_5f7,_5f8);
}
};
_5f5.textMessageReceived=function(_5f9,_5fa){
LOG.finest(_5da,"textMessageReceived",_5fa);
if(_5f9._balanced>1){
_5f6._listener.textMessageReceived(_5f9,_5fa);
return;
}
if(_5fa.charCodeAt(0)==61695){
if(_5fa.match("N$")){
_5f9._balanced++;
if(_5f9._balanced==1){
_5f6._listener.connectionOpened(_5f9,_556.KAAZING_EXTENDED_HANDSHAKE);
}else{
_5f6._listener.connectionOpened(_5f9,"");
}
}else{
if(_5fa.indexOf("R")==1){
var _5fb=new _4ff(_5fa.substring(2));
_5dd(_5f6,_5f9,_5fb);
}else{
LOG.warning(_5da,"Invalidate balancing message: "+target);
}
}
return;
}else{
_5f6._listener.textMessageReceived(_5f9,_5fa);
}
};
_5f5.binaryMessageReceived=function(_5fc,obj){
_5f6.handleMessageReceived(_5fc,obj);
};
_5f5.connectionClosed=function(_5fe,_5ff,code,_601){
_5f6.handleConnectionClosed(_5fe,_5ff,code,_601);
};
_5f4.setListener(_5f5);
};
_5e1.setListener=function(_602){
this._listener=_602;
};
return _5dc;
})();
var _603=(function(){
var _604="WebSocketNativeHandshakeHandler";
var LOG=_26b.getLogger(_604);
var _606="Sec-WebSocket-Protocol";
var _607="Sec-WebSocket-Extensions";
var _608="Authorization";
var _609="WWW-Authenticate";
var _60a="Set-Cookie";
var _60b="GET";
var _60c="HTTP/1.1";
var _60d=":";
var _60e=" ";
var _60f="\r\n";
var _610=function(){
LOG.finest(_604,"<init>");
};
var _611=function(_612,_613){
LOG.finest(_604,"sendCookieRequest with {0}",_613);
var _614=new XMLHttpRequest0();
var path=_612._location.getHttpEquivalentScheme()+"://"+_612._location.getAuthority()+(_612._location._uri.path||"");
path=path.replace(/[\/]?$/,"/;api/set-cookies");
_614.open("POST",path,true);
_614.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_614.send(_613);
};
var _616=function(_617,_618,_619){
var _61a=[];
var _61b=[];
_61a.push("WebSocket-Protocol");
_61b.push("");
_61a.push(_606);
_61b.push(_618._protocol.join(","));
var _61c=[_556.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT,_556.KAAZING_SEC_EXTENSION_PING_PONG];
var ext=_618._extensions;
if(ext.length>0){
_61c.push(ext);
}
_61a.push(_607);
_61b.push(_61c.join(","));
_61a.push(_608);
_61b.push(_619);
var _61e=_61f(_618._location,_61a,_61b);
_617._nextHandler.processTextMessage(_618,_61e);
};
var _61f=function(_620,_621,_622){
LOG.entering(_604,"encodeGetRequest");
var _623=[];
_623.push(_60b);
_623.push(_60e);
var path=[];
if(_620._uri.path!=undefined){
path.push(_620._uri.path);
}
if(_620._uri.query!=undefined){
path.push("?");
path.push(_620._uri.query);
}
_623.push(path.join(""));
_623.push(_60e);
_623.push(_60c);
_623.push(_60f);
for(var i=0;i<_621.length;i++){
var _626=_621[i];
var _627=_622[i];
if(_626!=null&&_627!=null){
_623.push(_626);
_623.push(_60d);
_623.push(_60e);
_623.push(_627);
_623.push(_60f);
}
}
_623.push(_60f);
var _628=_623.join("");
return _628;
};
var _629=function(_62a,_62b,s){
if(s.length>0){
_62b.handshakePayload+=s;
return;
}
var _62d=_62b.handshakePayload.split("\n");
_62b.handshakePayload="";
var _62e="";
for(var i=_62d.length-1;i>=0;i--){
if(_62d[i].indexOf("HTTP/1.1")==0){
var temp=_62d[i].split(" ");
_62e=temp[1];
break;
}
}
if("101"==_62e){
var _631=[];
var _632="";
for(var i=0;i<_62d.length;i++){
var line=_62d[i];
if(line!=null&&line.indexOf(_607)==0){
_631.push(line.substring(_607.length+2));
}else{
if(line!=null&&line.indexOf(_606)==0){
_632=line.substring(_606.length+2);
}else{
if(line!=null&&line.indexOf(_60a)==0){
_611(_62b,line.substring(_60a.length+2));
}
}
}
}
_62b._acceptedProtocol=_632;
if(_631.length>0){
var _634=[];
var _635=_631.join(", ").split(", ");
for(var j=0;j<_635.length;j++){
var tmp=_635[j].split(";");
var ext=tmp[0].replace(/^\s+|\s+$/g,"");
var _639=new WebSocketExtension(ext);
if(_556.KAAZING_SEC_EXTENSION_IDLE_TIMEOUT===ext){
var _63a=tmp[1].match(/\d+/)[0];
if(_63a>0){
_62a._nextHandler.setIdleTimeout(_62b,_63a);
}
continue;
}else{
if(_556.KAAZING_SEC_EXTENSION_PING_PONG===ext){
try{
var _63b=tmp[1].replace(/^\s+|\s+$/g,"");
var _63c=parseInt(_63b,16);
_62b._controlFrames[_63c]=ext;
_62b._escapeSequences[_63c]=ext;
continue;
}
catch(e){
throw new Error("failed to parse escape key for x-kaazing-ping-pong extension");
}
}else{
if(tmp.length>1){
var _63b=tmp[1].replace(/^\s+|\s+$/g,"");
if(_63b.length==8){
try{
var _63c=parseInt(_63b,16);
_62b._controlFrames[_63c]=ext;
if(_556.KAAZING_SEC_EXTENSION_REVALIDATE===ext){
_62b._controlFramesBinary[_63c]=ext;
}
_639.escape=_63b;
}
catch(e){
LOG.finest(_604,"parse control frame bytes error");
}
}
}
}
}
_639.enabled=true;
_639.negotiated=true;
_634.push(_635[j]);
}
if(_634.length>0){
_62b.parent._negotiatedExtensions[ext]=_634.join(",");
}
}
return;
}else{
if("401"==_62e){
_62b.handshakestatus=2;
var _63d="";
for(var i=0;i<_62d.length;i++){
if(_62d[i].indexOf(_609)==0){
_63d=_62d[i].substring(_609.length+2);
break;
}
}
_62a._listener.authenticationRequested(_62b,_62b._location.toString(),_63d);
}else{
_62a._listener.connectionFailed(_62b);
}
}
};
var _63e=function(_63f,_640){
try{
_640.handshakestatus=3;
_63f._nextHandler.processClose(_640);
}
finally{
_63f._listener.connectionFailed(_640);
}
};
var _641=_610.prototype=new _52d();
_641.processConnect=function(_642,uri,_644){
_642.handshakePayload="";
var _645=[_556.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_644.length;i++){
_645.push(_644[i]);
}
this._nextHandler.processConnect(_642,uri,_645);
if((typeof (_642.parent.connectTimer)=="undefined")||(_642.parent.connectTimer==null)){
_642.handshakestatus=0;
var _647=this;
setTimeout(function(){
if(_642.handshakestatus==0){
_63e(_647,_642);
}
},5000);
}
};
_641.processAuthorize=function(_648,_649){
_616(this,_648,_649);
};
_641.handleConnectionOpened=function(_64a,_64b){
LOG.finest(_604,"handleConnectionOpened");
if(_556.KAAZING_EXTENDED_HANDSHAKE==_64b){
_616(this,_64a,null);
_64a.handshakestatus=1;
if((typeof (_64a.parent.connectTimer)=="undefined")||(_64a.parent.connectTimer==null)){
var _64c=this;
setTimeout(function(){
if(_64a.handshakestatus<2){
_63e(_64c,_64a);
}
},5000);
}
}else{
_64a.handshakestatus=2;
this._listener.connectionOpened(_64a,_64b);
}
};
_641.handleMessageReceived=function(_64d,_64e){
LOG.finest(_604,"handleMessageReceived",_64e);
if(_64d.readyState==WebSocket.OPEN){
_64d._isEscape=false;
this._listener.textMessageReceived(_64d,_64e);
}else{
_629(this,_64d,_64e);
}
};
_641.handleBinaryMessageReceived=function(_64f,_650){
LOG.finest(_604,"handleMessageReceived",_650);
if(_64f.readyState==WebSocket.OPEN){
_64f._isEscape=false;
this._listener.binaryMessageReceived(_64f,_650);
}else{
_629(this,_64f,String.fromCharCode.apply(null,new Uint8Array(_650)));
}
};
_641.setNextHandler=function(_651){
this._nextHandler=_651;
var _652=this;
var _653=new _540(this);
_653.connectionOpened=function(_654,_655){
_652.handleConnectionOpened(_654,_655);
};
_653.textMessageReceived=function(_656,buf){
_652.handleMessageReceived(_656,buf);
};
_653.binaryMessageReceived=function(_658,buf){
_652.handleBinaryMessageReceived(_658,buf);
};
_653.connectionClosed=function(_65a,_65b,code,_65d){
if(_65a.handshakestatus<3){
_65a.handshakestatus=3;
}
_652._listener.connectionClosed(_65a,_65b,code,_65d);
};
_653.connectionFailed=function(_65e){
if(_65e.handshakestatus<3){
_65e.handshakestatus=3;
}
_652._listener.connectionFailed(_65e);
};
_651.setListener(_653);
};
_641.setListener=function(_65f){
this._listener=_65f;
};
return _610;
})();
var _660=(function(){
var _661="WebSocketNativeAuthenticationHandler";
var LOG=_26b.getLogger(_661);
var _663=function(){
LOG.finest(_661,"<init>");
};
var _664=_663.prototype=new _52d();
_664.handleClearAuthenticationData=function(_665){
if(_665._challengeResponse!=null){
_665._challengeResponse.clearCredentials();
}
};
_664.handleRemoveAuthenticationData=function(_666){
this.handleClearAuthenticationData(_666);
_666._challengeResponse=new ChallengeResponse(null,null);
};
_664.doError=function(_667){
this._nextHandler.processClose(_667);
this.handleClearAuthenticationData(_667);
this._listener.connectionFailed(_667);
};
_664.handle401=function(_668,_669,_66a){
var _66b=this;
var _66c=_668._location;
var _66d=null;
if(typeof (_668.parent.connectTimer)!="undefined"){
_66d=_668.parent.connectTimer;
if(_66d!=null){
_66d.pause();
}
}
if(_668.redirectUri!=null){
_66c=_668._redirectUri;
}
if(_556.KAAZING_SEC_EXTENSION_REVALIDATE==_66a){
var ch=new _55a(_66c,_668._protocol,_668._isBinary);
ch.challengeHandler=_668.parent.challengeHandler;
ch.parent=_668.parent;
var _66f=new _5af(ch);
_66f.connect(_669);
}else{
var _670=new ChallengeRequest(_66c.toString(),_66a);
var _671;
if(_668._challengeResponse.nextChallengeHandler!=null){
_671=_668._challengeResponse.nextChallengeHandler;
}else{
_671=_668.parent.challengeHandler;
}
if(_671!=null&&_671.canHandle(_670)){
_671.handle(_670,function(_672){
try{
if(_672==null||_672.credentials==null){
_66b.doError(_668);
}else{
if(_66d!=null){
_66d.resume();
}
_668._challengeResponse=_672;
_66b._nextHandler.processAuthorize(_668,_672.credentials);
}
}
catch(e){
_66b.doError(_668);
}
});
}else{
this.doError(_668);
}
}
};
_664.handleAuthenticate=function(_673,_674,_675){
_673.authenticationReceived=true;
this.handle401(_673,_674,_675);
};
_664.setNextHandler=function(_676){
this._nextHandler=_676;
var _677=this;
var _678=new _540(this);
_678.authenticationRequested=function(_679,_67a,_67b){
_677.handleAuthenticate(_679,_67a,_67b);
};
_676.setListener(_678);
};
_664.setListener=function(_67c){
this._listener=_67c;
};
return _663;
})();
var _67d=(function(){
var _67e="WebSocketHixie76FrameCodecHandler";
var LOG=_26b.getLogger(_67e);
var _680=function(){
LOG.finest(_67e,"<init>");
};
var _681=_680.prototype=new _52d();
_681.processConnect=function(_682,uri,_684){
this._nextHandler.processConnect(_682,uri,_684);
};
_681.processBinaryMessage=function(_685,data){
if(data.constructor==ByteBuffer){
var _687=data.array.slice(data.position,data.limit);
this._nextHandler.processTextMessage(_685,Charset.UTF8.encodeByteArray(_687));
}else{
if(data.byteLength){
this._nextHandler.processTextMessage(_685,Charset.UTF8.encodeArrayBuffer(data));
}else{
if(data.size){
var _688=this;
var cb=function(_68a){
_688._nextHandler.processBinaryMessage(_685,Charset.UTF8.encodeByteArray(_68a));
};
BlobUtils.asNumberArray(cb,data);
}else{
throw new Error("Invalid type for send");
}
}
}
};
_681.setNextHandler=function(_68b){
this._nextHandler=_68b;
var _68c=this;
var _68d=new _540(this);
_68d.textMessageReceived=function(_68e,text){
_68c._listener.binaryMessageReceived(_68e,ByteBuffer.wrap(Charset.UTF8.toByteArray(text)));
};
_68d.binaryMessageReceived=function(_690,buf){
throw new Error("draft76 won't receive binary frame");
};
_68b.setListener(_68d);
};
_681.setListener=function(_692){
this._listener=_692;
};
return _680;
})();
var _693=(function(){
var _694="WebSocketNativeHandler";
var LOG=_26b.getLogger(_694);
var _696=function(){
var _697=new _660();
return _697;
};
var _698=function(){
var _699=new _603();
return _699;
};
var _69a=function(){
var _69b=new _570();
return _69b;
};
var _69c=function(){
var _69d=new _5d9();
return _69d;
};
var _69e=function(){
var _69f=new _5c3();
return _69f;
};
var _6a0=function(){
var _6a1=new _67d();
return _6a1;
};
var _6a2=(browser=="safari"&&typeof (WebSocket.CLOSING)=="undefined");
var _6a3=_696();
var _6a4=_698();
var _6a5=_69a();
var _6a6=_69c();
var _6a7=_69e();
var _6a8=_6a0();
var _6a9=function(){
LOG.finest(_694,"<init>");
if(_6a2){
this.setNextHandler(_6a8);
_6a8.setNextHandler(_6a3);
}else{
this.setNextHandler(_6a3);
}
_6a3.setNextHandler(_6a4);
_6a4.setNextHandler(_6a5);
_6a5.setNextHandler(_6a6);
_6a6.setNextHandler(_6a7);
};
var _6aa=function(_6ab,_6ac){
LOG.finest(_694,"<init>");
};
var _6ad=_6a9.prototype=new _52d();
_6ad.setNextHandler=function(_6ae){
this._nextHandler=_6ae;
var _6af=new _540(this);
_6ae.setListener(_6af);
};
_6ad.setListener=function(_6b0){
this._listener=_6b0;
};
return _6a9;
})();
var _6b1=(function(){
var _6b2=_26b.getLogger("com.kaazing.gateway.client.html5.WebSocketEmulatedProxyDownstream");
var _6b3=512*1024;
var _6b4=1;
var _6b5=function(_6b6,_6b7){
_6b2.entering(this,"WebSocketEmulatedProxyDownstream.<init>",_6b6);
this.sequence=_6b7;
this.retry=3000;
if(_6b6.indexOf("/;e/dtem/")>0){
this.requiresEscaping=true;
}
var _6b8=new URI(_6b6);
var _6b9={"http":80,"https":443};
if(_6b8.port==undefined){
_6b8.port=_6b9[_6b8.scheme];
_6b8.authority=_6b8.host+":"+_6b8.port;
}
this.origin=_6b8.scheme+"://"+_6b8.authority;
this.location=_6b6;
this.activeXhr=null;
this.reconnectTimer=null;
this.idleTimer=null;
this.idleTimeout=null;
this.lastMessageTimestamp=null;
this.buf=new ByteBuffer();
var _6ba=this;
setTimeout(function(){
connect(_6ba,true);
_6ba.activeXhr=_6ba.mostRecentXhr;
startProxyDetectionTimer(_6ba,_6ba.mostRecentXhr);
},0);
_6b2.exiting(this,"WebSocketEmulatedProxyDownstream.<init>");
};
var _6bb=_6b5.prototype;
var _6bc=0;
var _6bd=255;
var _6be=1;
var _6bf=128;
var _6c0=129;
var _6c1=127;
var _6c2=137;
var _6c3=3000;
_6bb.readyState=0;
function connect(_6c4,_6c5){
_6b2.entering(this,"WebSocketEmulatedProxyDownstream.connect");
if(_6c4.reconnectTimer!==null){
_6c4.reconnectTimer=null;
}
stopIdleTimer(_6c4);
var _6c6=new URI(_6c4.location);
var _6c7=[];
var _6c8=_6c4.sequence++;
_6c7.push(".ksn="+_6c8);
switch(browser){
case "ie":
_6c7.push(".kns=1");
_6c7.push(".kf=200&.kp=2048");
break;
case "safari":
_6c7.push(".kp=256");
break;
case "firefox":
_6c7.push(".kp=1025");
break;
case "android":
_6c7.push(".kp=4096");
_6c7.push(".kbp=4096");
break;
}
if(browser=="android"||browser.ios){
_6c7.push(".kkt=20");
}
_6c7.push(".kc=text/plain;charset=windows-1252");
_6c7.push(".kb=4096");
_6c7.push(".kid="+String(Math.random()).substring(2));
if(_6c7.length>0){
if(_6c6.query===undefined){
_6c6.query=_6c7.join("&");
}else{
_6c6.query+="&"+_6c7.join("&");
}
}
var xhr=new XMLHttpRequest0();
xhr.id=_6b4++;
xhr.position=0;
xhr.opened=false;
xhr.reconnect=false;
xhr.requestClosing=false;
xhr.onreadystatechange=function(){
if(xhr.readyState==3){
if(_6c4.idleTimer==null){
var _6ca=xhr.getResponseHeader("X-Idle-Timeout");
if(_6ca){
var _6cb=parseInt(_6ca);
if(_6cb>0){
_6cb=_6cb*1000;
_6c4.idleTimeout=_6cb;
_6c4.lastMessageTimestamp=new Date().getTime();
startIdleTimer(_6c4,_6cb);
}
}
}
}
};
xhr.onprogress=function(){
if(xhr==_6c4.activeXhr&&_6c4.readyState!=2){
_process(_6c4);
}
};
xhr.onload=function(){
if(xhr==_6c4.activeXhr&&_6c4.readyState!=2){
_process(_6c4);
xhr.onerror=function(){
};
xhr.ontimeout=function(){
};
xhr.onreadystatechange=function(){
};
if(!xhr.reconnect){
doError(_6c4);
}else{
if(xhr.requestClosing){
doClose(_6c4);
}else{
if(_6c4.activeXhr==_6c4.mostRecentXhr){
connect(_6c4);
_6c4.activeXhr=_6c4.mostRecentXhr;
startProxyDetectionTimer(_6c4,_6c4.activeXhr);
}else{
var _6cc=_6c4.mostRecentXhr;
_6c4.activeXhr=_6cc;
switch(_6cc.readyState){
case 1:
case 2:
startProxyDetectionTimer(_6c4,_6cc);
break;
case 3:
_process(_6c4);
break;
case 4:
_6c4.activeXhr.onload();
break;
default:
}
}
}
}
}
};
xhr.ontimeout=function(){
_6b2.entering(this,"WebSocketEmulatedProxyDownstream.connect.xhr.ontimeout");
doError(_6c4);
};
xhr.onerror=function(){
_6b2.entering(this,"WebSocketEmulatedProxyDownstream.connect.xhr.onerror");
doError(_6c4);
};
xhr.open("GET",_6c6.toString(),true);
xhr.send("");
_6c4.mostRecentXhr=xhr;
};
function startProxyDetectionTimer(_6cd,xhr){
if(_6cd.location.indexOf(".ki=p")==-1){
setTimeout(function(){
if(xhr&&xhr.readyState<3&&_6cd.readyState<2){
if(_6cd.location.indexOf("?")==-1){
_6cd.location+="?.ki=p";
}else{
_6cd.location+="&.ki=p";
}
connect(_6cd,false);
}
},_6c3);
}
};
_6bb.disconnect=function(){
_6b2.entering(this,"WebSocketEmulatedProxyDownstream.disconnect");
if(this.readyState!==2){
_disconnect(this);
}
};
function _disconnect(_6cf){
_6b2.entering(this,"WebSocketEmulatedProxyDownstream._disconnect");
if(_6cf.reconnectTimer!==null){
clearTimeout(_6cf.reconnectTimer);
_6cf.reconnectTimer=null;
}
stopIdleTimer(_6cf);
if(_6cf.mostRecentXhr!==null){
_6cf.mostRecentXhr.onprogress=function(){
};
_6cf.mostRecentXhr.onload=function(){
};
_6cf.mostRecentXhr.onerror=function(){
};
_6cf.mostRecentXhr.abort();
}
if(_6cf.activeXhr!=_6cf.mostRecentXhr&&_6cf.activeXhr!==null){
_6cf.activeXhr.onprogress=function(){
};
_6cf.activeXhr.onload=function(){
};
_6cf.activeXhr.onerror=function(){
};
_6cf.activeXhr.abort();
}
_6cf.lineQueue=[];
_6cf.lastEventId=null;
_6cf.location=null;
_6cf.readyState=2;
};
function _process(_6d0){
_6d0.lastMessageTimestamp=new Date().getTime();
var xhr=_6d0.activeXhr;
var _6d2=xhr.responseText;
if(_6d2.length>=_6b3){
if(_6d0.activeXhr==_6d0.mostRecentXhr){
connect(_6d0,false);
}
}
var _6d3=_6d2.slice(xhr.position);
xhr.position=_6d2.length;
var buf=_6d0.buf;
var _6d5=_48d.toArray(_6d3,_6d0.requiresEscaping);
if(_6d5.hasRemainder){
xhr.position--;
}
buf.position=buf.limit;
buf.putBytes(_6d5);
buf.position=0;
buf.mark();
parse:
while(true){
if(!buf.hasRemaining()){
break;
}
var type=buf.getUnsigned();
switch(type&128){
case _6bc:
var _6d7=buf.indexOf(_6bd);
if(_6d7==-1){
break parse;
}
var _6d8=buf.array.slice(buf.position,_6d7);
var data=new ByteBuffer(_6d8);
var _6da=_6d7-buf.position;
buf.skip(_6da+1);
buf.mark();
if(type==_6be){
handleCommandFrame(_6d0,data);
}else{
dispatchText(_6d0,data.getString(Charset.UTF8));
}
break;
case _6bf:
case _6c0:
var _6db=0;
var _6dc=false;
while(buf.hasRemaining()){
var b=buf.getUnsigned();
_6db=_6db<<7;
_6db|=(b&127);
if((b&128)!=128){
_6dc=true;
break;
}
}
if(!_6dc){
break parse;
}
if(buf.remaining()<_6db){
break parse;
}
var _6de=buf.array.slice(buf.position,buf.position+_6db);
var _6df=new ByteBuffer(_6de);
buf.skip(_6db);
buf.mark();
if(type==_6bf){
dispatchBytes(_6d0,_6df);
}else{
if(type==_6c2){
dispatchPingReceived(_6d0);
}else{
dispatchText(_6d0,_6df.getString(Charset.UTF8));
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
function handleCommandFrame(_6e0,data){
while(data.remaining()){
var _6e2=String.fromCharCode(data.getUnsigned());
switch(_6e2){
case "0":
break;
case "1":
_6e0.activeXhr.reconnect=true;
break;
case "2":
_6e0.activeXhr.requestClosing=true;
break;
default:
throw new Error("Protocol decode error. Unknown command: "+_6e2);
}
}
};
function dispatchBytes(_6e3,buf){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6e3.lastEventId;
e.data=buf;
e.decoder=_2aa;
e.origin=_6e3.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6e3.onmessage)==="function"){
_6e3.onmessage(e);
}
};
function dispatchText(_6e6,data){
var e=document.createEvent("Events");
e.initEvent("message",true,true);
e.lastEventId=_6e6.lastEventId;
e.text=data;
e.origin=_6e6.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_6e6.onmessage)==="function"){
_6e6.onmessage(e);
}
};
function dispatchPingReceived(_6e9){
if(typeof (_6e9.onping)==="function"){
_6e9.onping();
}
};
function doClose(_6ea){
doError(_6ea);
};
function doError(_6eb){
if(_6eb.readyState!=2){
_6eb.disconnect();
fireError(_6eb);
}
};
function fireError(_6ec){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_6ec.onerror)==="function"){
_6ec.onerror(e);
}
};
function startIdleTimer(_6ee,_6ef){
stopIdleTimer(_6ee);
_6ee.idleTimer=setTimeout(function(){
idleTimerHandler(_6ee);
},_6ef);
};
function idleTimerHandler(_6f0){
var _6f1=new Date().getTime();
var _6f2=_6f1-_6f0.lastMessageTimestamp;
var _6f3=_6f0.idleTimeout;
if(_6f2>_6f3){
doError(_6f0);
}else{
startIdleTimer(_6f0,_6f3-_6f2);
}
};
function stopIdleTimer(_6f4){
if(_6f4.idleTimer!=null){
clearTimeout(_6f4.idleTimer);
_6f4.IdleTimer=null;
}
};
return _6b5;
})();
var _6f5=(function(){
var _6f6=_26b.getLogger("WebSocketEmulatedProxy");
var _6f7=function(){
this.parent;
this._listener;
this.closeCode=1005;
this.closeReason="";
this.sequence=0;
};
var _6f8=_6f7.prototype;
_6f8.connect=function(_6f9,_6fa){
_6f6.entering(this,"WebSocketEmulatedProxy.connect",{"location":_6f9,"subprotocol":_6fa});
this.URL=_6f9.replace("ws","http");
this.protocol=_6fa;
this._prepareQueue=new _4e7();
this._sendQueue=[];
_6fb(this);
_6f6.exiting(this,"WebSocketEmulatedProxy.<init>");
};
_6f8.readyState=0;
_6f8.bufferedAmount=0;
_6f8.URL="";
_6f8.onopen=function(){
};
_6f8.onerror=function(){
};
_6f8.onmessage=function(_6fc){
};
_6f8.onclose=function(){
};
var _6fd=128;
var _6fe=129;
var _6ff=0;
var _700=255;
var _701=1;
var _702=138;
var _703=[_701,48,49,_700];
var _704=[_701,48,50,_700];
var _705=function(buf,_707){
_6f6.entering(this,"WebSocketEmulatedProxy.encodeLength",{"buf":buf,"length":_707});
var _708=0;
var _709=0;
do{
_709<<=8;
_709|=(_707&127);
_707>>=7;
_708++;
}while(_707>0);
do{
var _70a=_709&255;
_709>>=8;
if(_708!=1){
_70a|=128;
}
buf.put(_70a);
}while(--_708>0);
};
_6f8.send=function(data){
var _70c=this;
_6f6.entering(this,"WebSocketEmulatedProxy.send",{"data":data});
switch(this.readyState){
case 0:
_6f6.severe(this,"WebSocketEmulatedProxy.send: Error: readyState is 0");
throw new Error("INVALID_STATE_ERR");
case 1:
if(data===null){
_6f6.severe(this,"WebSocketEmulatedProxy.send: Error: data is null");
throw new Error("data is null");
}
var buf=new ByteBuffer();
if(typeof data=="string"){
_6f6.finest(this,"WebSocketEmulatedProxy.send: Data is string");
var _70e=new ByteBuffer();
_70e.putString(data,Charset.UTF8);
buf.put(_6fe);
_705(buf,_70e.position);
buf.putBytes(_70e.array);
}else{
if(data.constructor==ByteBuffer){
_6f6.finest(this,"WebSocketEmulatedProxy.send: Data is ByteBuffer");
buf.put(_6fd);
_705(buf,data.remaining());
buf.putBuffer(data);
}else{
if(data.byteLength){
_6f6.finest(this,"WebSocketEmulatedProxy.send: Data is ByteArray");
buf.put(_6fd);
_705(buf,data.byteLength);
buf.putByteArray(data);
}else{
if(data.size){
_6f6.finest(this,"WebSocketEmulatedProxy.send: Data is Blob");
var cb=this._prepareQueue.enqueue(function(_710){
var b=new ByteBuffer();
b.put(_6fd);
_705(b,_710.length);
b.putBytes(_710);
b.flip();
doSend(_70c,b);
});
BlobUtils.asNumberArray(cb,data);
return true;
}else{
_6f6.severe(this,"WebSocketEmulatedProxy.send: Error: Invalid type for send");
throw new Error("Invalid type for send");
}
}
}
}
buf.flip();
this._prepareQueue.enqueue(function(_712){
doSend(_70c,buf);
})();
return true;
case 2:
return false;
default:
_6f6.severe(this,"WebSocketEmulatedProxy.send: Error: invalid readyState");
throw new Error("INVALID_STATE_ERR");
}
_6f6.exiting(this,"WebSocketEmulatedProxy.send");
};
_6f8.close=function(code,_714){
_6f6.entering(this,"WebSocketEmulatedProxy.close");
switch(this.readyState){
case 0:
_715(this);
break;
case 1:
if(code!=null&&code!=0){
this.closeCode=code;
this.closeReason=_714;
}
doSend(this,new ByteBuffer(_704));
break;
}
};
_6f8.setListener=function(_716){
this._listener=_716;
};
function openUpstream(_717){
if(_717.readyState!=1){
return;
}
if(_717.idleTimer){
clearTimeout(_717.idleTimer);
}
var xdr=new XMLHttpRequest0();
xdr.onreadystatechange=function(){
if(xdr.readyState==4){
switch(xdr.status){
case 200:
setTimeout(function(){
doFlush(_717);
},0);
break;
}
}
};
xdr.onload=function(){
openUpstream(_717);
};
xdr.open("POST",_717._upstream+"&.krn="+Math.random(),true);
_717.upstreamXHR=xdr;
_717.idleTimer=setTimeout(function(){
if(_717.upstreamXHR!=null){
_717.upstreamXHR.abort();
}
openUpstream(_717);
},30000);
};
function doSend(_719,buf){
_6f6.entering(this,"WebSocketEmulatedProxy.doSend",buf);
_719.bufferedAmount+=buf.remaining();
_719._sendQueue.push(buf);
_71b(_719);
if(!_719._writeSuspended){
doFlush(_719);
}
};
function doFlush(_71c){
_6f6.entering(this,"WebSocketEmulatedProxy.doFlush");
var _71d=_71c._sendQueue;
var _71e=_71d.length;
_71c._writeSuspended=(_71e>0);
if(_71e>0){
var _71f=_71c.sequence++;
if(_71c.useXDR){
var out=new ByteBuffer();
while(_71d.length){
out.putBuffer(_71d.shift());
}
out.putBytes(_703);
out.flip();
_71c.upstreamXHR.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_71c.upstreamXHR.setRequestHeader("X-Sequence-No",_71f.toString());
_71c.upstreamXHR.send(_2c5(out,_71c.requiresEscaping));
}else{
var xhr=new XMLHttpRequest0();
xhr.open("POST",_71c._upstream+"&.krn="+Math.random(),true);
xhr.onreadystatechange=function(){
if(xhr.readyState==4){
_6f6.finest(this,"WebSocketEmulatedProxy.doFlush: xhr.status="+xhr.status);
switch(xhr.status){
case 200:
setTimeout(function(){
doFlush(_71c);
},0);
break;
default:
_715(_71c);
break;
}
}
};
var out=new ByteBuffer();
while(_71d.length){
out.putBuffer(_71d.shift());
}
out.putBytes(_703);
out.flip();
xhr.setRequestHeader("X-Sequence-No",_71f.toString());
if(browser=="firefox"){
if(xhr.sendAsBinary){
_6f6.finest(this,"WebSocketEmulatedProxy.doFlush: xhr.sendAsBinary");
xhr.setRequestHeader("Content-Type","application/octet-stream");
xhr.sendAsBinary(_2c5(out));
}else{
xhr.send(_2c5(out));
}
}else{
xhr.setRequestHeader("Content-Type","text/plain; charset=utf-8");
xhr.send(_2c5(out,_71c.requiresEscaping));
}
}
}
_71c.bufferedAmount=0;
_71b(_71c);
};
var _6fb=function(_722){
_6f6.entering(this,"WebSocketEmulatedProxy.connect");
var url=new URI(_722.URL);
url.scheme=url.scheme.replace("ws","http");
locationURI=new URI((browser=="ie")?document.URL:location.href);
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&url.scheme===locationURI.scheme){
_722.useXDR=true;
}
switch(browser){
case "opera":
_722.requiresEscaping=true;
break;
case "ie":
if(!_722.useXDR){
_722.requiresEscaping=true;
}else{
if((typeof (Object.defineProperties)==="undefined")&&(navigator.userAgent.indexOf("MSIE 8")>0)){
_722.requiresEscaping=true;
}else{
_722.requiresEscaping=false;
}
}
break;
default:
_722.requiresEscaping=false;
break;
}
var _724=_722.requiresEscaping?"/;e/ctem":"/;e/ctm";
url.path=url.path.replace(/[\/]?$/,_724);
var _725=url.toString();
var _726=_725.indexOf("?");
if(_726==-1){
_725+="?";
}else{
_725+="&";
}
_725+=".kn="+String(Math.random()).substring(2);
_6f6.finest(this,"WebSocketEmulatedProxy.connect: Connecting to "+_725);
var _727=new XMLHttpRequest0();
var _728=false;
_727.withCredentials=true;
_727.open("GET",_725,true);
_727.setRequestHeader("Content-Type","text/plain; charset=utf-8");
_727.setRequestHeader("X-WebSocket-Version","wseb-1.0");
_727.setRequestHeader("X-Accept-Commands","ping");
var _729=_722.sequence++;
_727.setRequestHeader("X-Sequence-No",_729.toString());
if(_722.protocol.length){
var _72a=_722.protocol.join(",");
_727.setRequestHeader("X-WebSocket-Protocol",_72a);
}
for(var i=0;i<_722.parent.requestHeaders.length;i++){
var _72c=_722.parent.requestHeaders[i];
_727.setRequestHeader(_72c.label,_72c.value);
}
_727.onredirectallowed=function(_72d,_72e){
var _72f=_722.parent.parent;
var _730=_72f.getRedirectPolicy();
if((typeof (_730)!="undefined")&&(_730!=null)){
if(!_730.isRedirectionAllowed(_72d,_72e)){
_727.statusText=_730.toString()+": Cannot redirect from "+_72d+" to "+_72e;
_722.closeCode=1006;
_722.closeReason=_727.statusText;
_722.parent.closeCode=_722.closeCode;
_722.parent.closeReason=_722.closeReason;
_722.parent.preventFallback=true;
doError(_722);
return false;
}
}
return true;
};
_727.onreadystatechange=function(){
switch(_727.readyState){
case 2:
if(_727.status==403){
doError(_722);
}else{
var _731=_722.parent.parent._webSocket.connectTimeout;
if(_731==0){
_731=5000;
}
timer=setTimeout(function(){
if(!_728){
doError(_722);
}
},_731);
}
break;
case 3:
break;
case 4:
_728=true;
if(_727.status==401){
_722._listener.authenticationRequested(_722.parent,_727._location,_727.getResponseHeader("WWW-Authenticate"));
return;
}
if(_722.readyState<1){
if(_727.status==201){
var _732=_727.responseText.split("\n");
var _733=_732[0];
var _734=_732[1];
var _735=new URI(_727.xhr._location);
var _736=new URI(_733);
var _737=new URI(_734);
if(_735.host.toLowerCase()!=_736.host.toLowerCase()){
throw new Error("Hostname in original URI does not match with the hostname in the upstream URI.");
}
if(_735.host.toLowerCase()!=_737.host.toLowerCase()){
throw new Error("Hostname in original URI does not match with the hostname in the downstream URI.");
}
_722._upstream=_735.scheme+"://"+_735.authority+_736.path;
_722._downstream=new _6b1(_734,_722.sequence);
var _738=_734.substring(0,_734.indexOf("/;e/"));
if(_738!=_722.parent._location.toString().replace("ws","http")){
_722.parent._redirectUri=_738;
}
_739(_722,_722._downstream);
_722.parent.responseHeaders=_727.getAllResponseHeaders();
_73a(_722);
}else{
doError(_722);
}
}
break;
}
};
_727.send(null);
_6f6.exiting(this,"WebSocketEmulatedProxy.connect");
};
var _73a=function(_73b){
_6f6.entering(this,"WebSocketEmulatedProxy.doOpen");
_73b.readyState=1;
var _73c=_73b.parent;
_73c._acceptedProtocol=_73c.responseHeaders["X-WebSocket-Protocol"]||"";
if(_73b.useXDR){
this.upstreamXHR=null;
openUpstream(_73b);
}
_73b._listener.connectionOpened(_73b.parent,_73c._acceptedProtocol);
};
function doError(_73d){
if(_73d.readyState<2){
_6f6.entering(this,"WebSocketEmulatedProxy.doError");
_73d.readyState=2;
if(_73d.idleTimer){
clearTimeout(_73d.idleTimer);
}
if(_73d.upstreamXHR!=null){
_73d.upstreamXHR.abort();
}
if(_73d.onerror!=null){
_73d._listener.connectionFailed(_73d.parent);
}
}
};
var _715=function(_73e,_73f,code,_741){
_6f6.entering(this,"WebSocketEmulatedProxy.doClose");
switch(_73e.readyState){
case 2:
break;
case 0:
case 1:
_73e.readyState=WebSocket.CLOSED;
if(_73e.idleTimer){
clearTimeout(_73e.idleTimer);
}
if(_73e.upstreamXHR!=null){
_73e.upstreamXHR.abort();
}
if(typeof _73f==="undefined"){
_73e._listener.connectionClosed(_73e.parent,true,1005,"");
}else{
_73e._listener.connectionClosed(_73e.parent,_73f,code,_741);
}
break;
default:
}
};
var _71b=function(_742){
};
var _743=function(_744,_745){
_6f6.finest("WebSocket.handleMessage: A WebSocket frame received on a WebSocket");
if(_745.text){
_744._listener.textMessageReceived(_744.parent,_745.text);
}else{
if(_745.data){
_744._listener.binaryMessageReceived(_744.parent,_745.data);
}
}
};
var _746=function(_747){
var _748=ByteBuffer.allocate(2);
_748.put(_702);
_748.put(0);
_748.flip();
doSend(_747,_748);
};
var _739=function(_749,_74a){
_6f6.entering(this,"WebSocketEmulatedProxy.bindHandlers");
_74a.onmessage=function(_74b){
switch(_74b.type){
case "message":
if(_749.readyState==1){
_743(_749,_74b);
}
break;
}
};
_74a.onping=function(){
if(_749.readyState==1){
_746(_749);
}
};
_74a.onerror=function(){
try{
_74a.disconnect();
}
finally{
_715(_749,true,_749.closeCode,_749.closeReason);
}
};
_74a.onclose=function(_74c){
try{
_74a.disconnect();
}
finally{
_715(_749,true,this.closeCode,this.closeReason);
}
};
};
return _6f7;
})();
var _74d=(function(){
var _74e="WebSocketEmulatedDelegateHandler";
var LOG=_26b.getLogger(_74e);
var _750=function(){
LOG.finest(_74e,"<init>");
};
var _751=_750.prototype=new _52d();
_751.processConnect=function(_752,uri,_754){
LOG.finest(_74e,"connect",_752);
if(_752.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
var _755=!!window.MockWseTransport?new MockWseTransport():new _6f5();
_755.parent=_752;
_752._delegate=_755;
_756(_755,this);
_755.connect(uri.toString(),_754);
};
_751.processTextMessage=function(_757,text){
LOG.finest(_74e,"connect",_757);
if(_757.readyState==WebSocket.OPEN){
_757._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_751.processBinaryMessage=function(_759,obj){
LOG.finest(_74e,"processBinaryMessage",_759);
if(_759.readyState==WebSocket.OPEN){
_759._delegate.send(obj);
}else{
throw new Error("WebSocket is already closed");
}
};
_751.processClose=function(_75b,code,_75d){
LOG.finest(_74e,"close",_75b);
try{
_75b._delegate.close(code,_75d);
}
catch(e){
listener.connectionClosed(_75b);
}
};
var _756=function(_75e,_75f){
var _760=new _540(_75f);
_75e.setListener(_760);
};
return _750;
})();
var _761=(function(){
var _762="WebSocketEmulatedAuthenticationHandler";
var LOG=_26b.getLogger(_762);
var _764=function(){
LOG.finest(_762,"<init>");
};
var _765=_764.prototype=new _52d();
_765.handleClearAuthenticationData=function(_766){
if(_766._challengeResponse!=null){
_766._challengeResponse.clearCredentials();
}
};
_765.handleRemoveAuthenticationData=function(_767){
this.handleClearAuthenticationData(_767);
_767._challengeResponse=new ChallengeResponse(null,null);
};
_765.handle401=function(_768,_769,_76a){
var _76b=this;
var _76c=null;
if(typeof (_768.parent.connectTimer)!="undefined"){
_76c=_768.parent.connectTimer;
if(_76c!=null){
_76c.pause();
}
}
if(_556.KAAZING_SEC_EXTENSION_REVALIDATE==_76a){
var _76d=new _5af(_768);
_768.challengeHandler=_768.parent.challengeHandler;
_76d.connect(_769);
}else{
var _76e=_769;
if(_76e.indexOf("/;e/")>0){
_76e=_76e.substring(0,_76e.indexOf("/;e/"));
}
var _76f=new _4ff(_76e.replace("http","ws"));
var _770=new ChallengeRequest(_76e,_76a);
var _771;
if(_768._challengeResponse.nextChallengeHandler!=null){
_771=_768._challengeResponse.nextChallengeHandler;
}else{
_771=_768.parent.challengeHandler;
}
if(_771!=null&&_771.canHandle(_770)){
_771.handle(_770,function(_772){
try{
if(_772==null||_772.credentials==null){
_76b.handleClearAuthenticationData(_768);
_76b._listener.connectionFailed(_768);
}else{
if(_76c!=null){
_76c.resume();
}
_768._challengeResponse=_772;
_76b.processConnect(_768,_76f,_768._protocol);
}
}
catch(e){
_76b.handleClearAuthenticationData(_768);
_76b._listener.connectionFailed(_768);
}
});
}else{
this.handleClearAuthenticationData(_768);
this._listener.connectionFailed(_768);
}
}
};
_765.processConnect=function(_773,_774,_775){
if(_773._challengeResponse!=null&&_773._challengeResponse.credentials!=null){
var _776=_773._challengeResponse.credentials.toString();
for(var i=_773.requestHeaders.length-1;i>=0;i--){
if(_773.requestHeaders[i].label==="Authorization"){
_773.requestHeaders.splice(i,1);
}
}
var _778=new _4f1("Authorization",_776);
for(var i=_773.requestHeaders.length-1;i>=0;i--){
if(_773.requestHeaders[i].label==="Authorization"){
_773.requestHeaders.splice(i,1);
}
}
_773.requestHeaders.push(_778);
this.handleClearAuthenticationData(_773);
}
this._nextHandler.processConnect(_773,_774,_775);
};
_765.handleAuthenticate=function(_779,_77a,_77b){
_779.authenticationReceived=true;
this.handle401(_779,_77a,_77b);
};
_765.setNextHandler=function(_77c){
this._nextHandler=_77c;
var _77d=new _540(this);
var _77e=this;
_77d.authenticationRequested=function(_77f,_780,_781){
_77e.handleAuthenticate(_77f,_780,_781);
};
_77c.setListener(_77d);
};
_765.setListener=function(_782){
this._listener=_782;
};
return _764;
})();
var _783=(function(){
var _784="WebSocketEmulatedHandler";
var LOG=_26b.getLogger(_784);
var _786=new _761();
var _787=new _570();
var _788=new _74d();
var _789=function(){
LOG.finest(_784,"<init>");
this.setNextHandler(_786);
_786.setNextHandler(_787);
_787.setNextHandler(_788);
};
var _78a=_789.prototype=new _52d();
_78a.processConnect=function(_78b,_78c,_78d){
var _78e=[];
for(var i=0;i<_78d.length;i++){
_78e.push(_78d[i]);
}
var _790=_78b._extensions;
if(_790.length>0){
_78b.requestHeaders.push(new _4f1(_556.HEADER_SEC_EXTENSIONS,_790.join(";")));
}
this._nextHandler.processConnect(_78b,_78c,_78e);
};
_78a.setNextHandler=function(_791){
this._nextHandler=_791;
var _792=this;
var _793=new _540(this);
_793.commandMessageReceived=function(_794,_795){
if(_795=="CloseCommandMessage"&&_794.readyState==1){
}
_792._listener.commandMessageReceived(_794,_795);
};
_791.setListener(_793);
};
_78a.setListener=function(_796){
this._listener=_796;
};
return _789;
})();
var _797=(function(){
var _798="WebSocketFlashEmulatedDelegateHandler";
var LOG=_26b.getLogger(_798);
var _79a=function(){
LOG.finest(_798,"<init>");
};
var _79b=_79a.prototype=new _52d();
_79b.processConnect=function(_79c,uri,_79e){
LOG.finest(_798,"connect",_79c);
if(_79c.readyState==2){
throw new Error("WebSocket is already closed");
}
var _79f=new _308();
_79f.parent=_79c;
_79c._delegate=_79f;
_7a0(_79f,this);
_79f.connect(uri.toString(),_79e);
};
_79b.processTextMessage=function(_7a1,text){
LOG.finest(_798,"connect",_7a1);
if(_7a1.readyState==1){
_7a1._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_79b.processBinaryMessage=function(_7a3,_7a4){
LOG.finest(_798,"connect",_7a3);
if(_7a3.readyState==1){
_7a3._delegate.send(_7a4);
}else{
throw new Error("WebSocket is already closed");
}
};
_79b.processClose=function(_7a5,code,_7a7){
LOG.finest(_798,"close",_7a5);
_7a5._delegate.close(code,_7a7);
};
var _7a0=function(_7a8,_7a9){
var _7aa=new _540(_7a9);
_7a8.setListener(_7aa);
_7aa.redirected=function(_7ab,_7ac){
_7ab._redirectUri=_7ac;
};
};
return _79a;
})();
var _7ad=(function(){
var _7ae="WebSocketFlashEmulatedHandler";
var LOG=_26b.getLogger(_7ae);
var _7b0=function(){
var _7b1=new _761();
return _7b1;
};
var _7b2=function(){
var _7b3=new _570();
return _7b3;
};
var _7b4=function(){
var _7b5=new _797();
return _7b5;
};
var _7b6=_7b0();
var _7b7=_7b2();
var _7b8=_7b4();
var _7b9=function(){
LOG.finest(_7ae,"<init>");
this.setNextHandler(_7b6);
_7b6.setNextHandler(_7b7);
_7b7.setNextHandler(_7b8);
};
var _7ba=_7b9.prototype=new _52d();
_7ba.processConnect=function(_7bb,_7bc,_7bd){
var _7be=[_556.KAAZING_EXTENDED_HANDSHAKE];
for(var i=0;i<_7bd.length;i++){
_7be.push(_7bd[i]);
}
var _7c0=_7bb._extensions;
if(_7c0.length>0){
_7bb.requestHeaders.push(new _4f1(_556.HEADER_SEC_EXTENSIONS,_7c0.join(";")));
}
this._nextHandler.processConnect(_7bb,_7bc,_7be);
};
_7ba.setNextHandler=function(_7c1){
this._nextHandler=_7c1;
var _7c2=new _540(this);
_7c1.setListener(_7c2);
};
_7ba.setListener=function(_7c3){
this._listener=_7c3;
};
return _7b9;
})();
var _7c4=(function(){
var _7c5="WebSocketFlashRtmpDelegateHandler";
var LOG=_26b.getLogger(_7c5);
var _7c7;
var _7c8=function(){
LOG.finest(_7c5,"<init>");
_7c7=this;
};
var _7c9=_7c8.prototype=new _52d();
_7c9.processConnect=function(_7ca,uri,_7cc){
LOG.finest(_7c5,"connect",_7ca);
if(_7ca.readyState==2){
throw new Error("WebSocket is already closed");
}
var _7cd=new _339();
_7cd.parent=_7ca;
_7ca._delegate=_7cd;
_7ce(_7cd,this);
_7cd.connect(uri.toString(),_7cc);
};
_7c9.processTextMessage=function(_7cf,text){
LOG.finest(_7c5,"connect",_7cf);
if(_7cf.readyState==1){
_7cf._delegate.send(text);
}else{
throw new Error("WebSocket is already closed");
}
};
_7c9.processBinaryMessage=function(_7d1,_7d2){
LOG.finest(_7c5,"connect",_7d1);
if(_7d1.readyState==1){
_7d1._delegate.send(_7d2);
}else{
throw new Error("WebSocket is already closed");
}
};
_7c9.processClose=function(_7d3,code,_7d5){
LOG.finest(_7c5,"close",_7d3);
_7d3._delegate.close(code,_7d5);
};
var _7ce=function(_7d6,_7d7){
var _7d8=new _540(_7d7);
_7d8.redirected=function(_7d9,_7da){
_7d9._redirectUri=_7da;
};
_7d6.setListener(_7d8);
};
return _7c8;
})();
var _7db=(function(){
var _7dc="WebSocketFlashRtmpHandler";
var LOG=_26b.getLogger(_7dc);
var _7de=function(){
var _7df=new _761();
return _7df;
};
var _7e0=function(){
var _7e1=new _570();
return _7e1;
};
var _7e2=function(){
var _7e3=new _7c4();
return _7e3;
};
var _7e4=_7de();
var _7e5=_7e0();
var _7e6=_7e2();
var _7e7=function(){
LOG.finest(_7dc,"<init>");
this.setNextHandler(_7e4);
_7e4.setNextHandler(_7e5);
_7e5.setNextHandler(_7e6);
};
var _7e8=function(_7e9,_7ea){
LOG.finest(_7dc,"<init>");
};
var _7eb=_7e7.prototype=new _52d();
_7eb.setNextHandler=function(_7ec){
this._nextHandler=_7ec;
var _7ed=new _540(this);
_7ec.setListener(_7ed);
};
_7eb.setListener=function(_7ee){
this._listener=_7ee;
};
return _7e7;
})();
var _7ef=(function(){
var _7f0="WebSocketSelectedHandler";
var _LOG=_26b.getLogger(_7f0);
var _7f2=function(){
_LOG.fine(_7f0,"<init>");
};
var _7f3=_7f2.prototype=new _52d();
_7f3.processConnect=function(_7f4,uri,_7f6){
_LOG.fine(_7f0,"connect",_7f4);
if(_7f4.readyState==WebSocket.CLOSED){
throw new Error("WebSocket is already closed");
}
this._nextHandler.processConnect(_7f4,uri,_7f6);
};
_7f3.handleConnectionOpened=function(_7f7,_7f8){
_LOG.fine(_7f0,"handleConnectionOpened");
var _7f9=_7f7;
if(_7f9.readyState==WebSocket.CONNECTING){
_7f9.readyState=WebSocket.OPEN;
this._listener.connectionOpened(_7f7,_7f8);
}
};
_7f3.handleMessageReceived=function(_7fa,_7fb){
_LOG.fine(_7f0,"handleMessageReceived",_7fb);
if(_7fa.readyState!=WebSocket.OPEN){
return;
}
this._listener.textMessageReceived(_7fa,_7fb);
};
_7f3.handleBinaryMessageReceived=function(_7fc,_7fd){
_LOG.fine(_7f0,"handleBinaryMessageReceived",_7fd);
if(_7fc.readyState!=WebSocket.OPEN){
return;
}
this._listener.binaryMessageReceived(_7fc,_7fd);
};
_7f3.handleConnectionClosed=function(_7fe,_7ff,code,_801){
_LOG.fine(_7f0,"handleConnectionClosed");
var _802=_7fe;
if(_802.readyState!=WebSocket.CLOSED){
_802.readyState=WebSocket.CLOSED;
this._listener.connectionClosed(_7fe,_7ff,code,_801);
}
};
_7f3.handleConnectionFailed=function(_803){
_LOG.fine(_7f0,"connectionFailed");
if(_803.readyState!=WebSocket.CLOSED){
_803.readyState=WebSocket.CLOSED;
this._listener.connectionFailed(_803);
}
};
_7f3.handleConnectionError=function(_804,e){
_LOG.fine(_7f0,"connectionError");
this._listener.connectionError(_804,e);
};
_7f3.setNextHandler=function(_806){
this._nextHandler=_806;
var _807={};
var _808=this;
_807.connectionOpened=function(_809,_80a){
_808.handleConnectionOpened(_809,_80a);
};
_807.redirected=function(_80b,_80c){
throw new Error("invalid event received");
};
_807.authenticationRequested=function(_80d,_80e,_80f){
throw new Error("invalid event received");
};
_807.textMessageReceived=function(_810,buf){
_808.handleMessageReceived(_810,buf);
};
_807.binaryMessageReceived=function(_812,buf){
_808.handleBinaryMessageReceived(_812,buf);
};
_807.connectionClosed=function(_814,_815,code,_817){
_808.handleConnectionClosed(_814,_815,code,_817);
};
_807.connectionFailed=function(_818){
_808.handleConnectionFailed(_818);
};
_807.connectionError=function(_819,e){
_808.handleConnectionError(_819,e);
};
_806.setListener(_807);
};
_7f3.setListener=function(_81b){
this._listener=_81b;
};
return _7f2;
})();
var _81c=(function(){
var _81d=function(_81e,_81f,_820){
this._nativeEquivalent=_81e;
this._handler=_81f;
this._channelFactory=_820;
};
return _81d;
})();
var _821=(function(){
var _822="WebSocketCompositeHandler";
var _LOG=_26b.getLogger(_822);
var _824="javascript:ws";
var _825="javascript:wss";
var _826="javascript:wse";
var _827="javascript:wse+ssl";
var _828="flash:wse";
var _829="flash:wse+ssl";
var _82a="flash:wsr";
var _82b="flash:wsr+ssl";
var _82c={};
var _82d={};
var _82e=new _565();
var _82f=new _55e();
var _830=true;
var _831={};
if(Object.defineProperty){
try{
Object.defineProperty(_831,"prop",{get:function(){
return true;
}});
_830=false;
}
catch(e){
}
}
var _832=function(){
this._handlerListener=createListener(this);
this._nativeHandler=createNativeHandler(this);
this._emulatedHandler=createEmulatedHandler(this);
this._emulatedFlashHandler=createFlashEmulatedHandler(this);
this._rtmpFlashHandler=createFlashRtmpHandler(this);
_LOG.finest(_822,"<init>");
pickStrategies();
_82c[_824]=new _81c("ws",this._nativeHandler,_82e);
_82c[_825]=new _81c("wss",this._nativeHandler,_82e);
_82c[_826]=new _81c("ws",this._emulatedHandler,_82f);
_82c[_827]=new _81c("wss",this._emulatedHandler,_82f);
_82c[_828]=new _81c("ws",this._emulatedFlashHandler,_82f);
_82c[_829]=new _81c("wss",this._emulatedFlashHandler,_82f);
_82c[_82a]=new _81c("ws",this._rtmpFlashHandler,_82f);
_82c[_82b]=new _81c("wss",this._rtmpFlashHandler,_82f);
};
function isIE6orIE7(){
if(browser!="ie"){
return false;
}
var _833=navigator.appVersion;
return (_833.indexOf("MSIE 6.0")>=0||_833.indexOf("MSIE 7.0")>=0);
};
function isXdrDisabledonIE8IE9(){
if(browser!="ie"){
return false;
}
var _834=navigator.appVersion;
return ((_834.indexOf("MSIE 8.0")>=0||_834.indexOf("MSIE 9.0")>=0)&&typeof (XDomainRequest)==="undefined");
};
function pickStrategies(){
if(isIE6orIE7()||isXdrDisabledonIE8IE9()){
_82d["ws"]=new Array(_824,_828,_826);
_82d["wss"]=new Array(_825,_829,_827);
}else{
_82d["ws"]=new Array(_824,_826);
_82d["wss"]=new Array(_825,_827);
}
};
function createListener(_835){
var _836={};
_836.connectionOpened=function(_837,_838){
_835.handleConnectionOpened(_837,_838);
};
_836.binaryMessageReceived=function(_839,buf){
_835.handleMessageReceived(_839,buf);
};
_836.textMessageReceived=function(_83b,text){
var _83d=_83b.parent;
_83d._webSocketChannelListener.handleMessage(_83d._webSocket,text);
};
_836.connectionClosed=function(_83e,_83f,code,_841){
_835.handleConnectionClosed(_83e,_83f,code,_841);
};
_836.connectionFailed=function(_842){
_835.handleConnectionFailed(_842);
};
_836.connectionError=function(_843,e){
_835.handleConnectionError(_843,e);
};
_836.authenticationRequested=function(_845,_846,_847){
};
_836.redirected=function(_848,_849){
};
_836.onBufferedAmountChange=function(_84a,n){
_835.handleBufferedAmountChange(_84a,n);
};
return _836;
};
function createNativeHandler(_84c){
var _84d=new _7ef();
var _84e=new _693();
_84d.setListener(_84c._handlerListener);
_84d.setNextHandler(_84e);
return _84d;
};
function createEmulatedHandler(_84f){
var _850=new _7ef();
var _851=new _783();
_850.setListener(_84f._handlerListener);
_850.setNextHandler(_851);
return _850;
};
function createFlashEmulatedHandler(_852){
var _853=new _7ef();
var _854=new _7ad();
_853.setListener(_852._handlerListener);
_853.setNextHandler(_854);
return _853;
};
function createFlashRtmpHandler(_855){
var _856=new _7ef();
var _857=new _7db();
_856.setListener(_855._handlerListener);
_856.setNextHandler(_857);
return _856;
};
var _858=function(_859,_85a){
var _85b=_82c[_85a];
var _85c=_85b._channelFactory;
var _85d=_859._location;
var _85e=_85c.createChannel(_85d,_859._protocol);
_859._selectedChannel=_85e;
_85e.parent=_859;
_85e._extensions=_859._extensions;
_85e._handler=_85b._handler;
_85e._handler.processConnect(_859._selectedChannel,_85d,_859._protocol);
};
var _85f=_832.prototype;
_85f.fallbackNext=function(_860){
_LOG.finest(_822,"fallbackNext");
var _861=_860.getNextStrategy();
if(_861==null){
this.doClose(_860,false,1006,"");
}else{
_858(_860,_861);
}
};
_85f.doOpen=function(_862,_863){
if(_862._lastErrorEvent!==undefined){
delete _862._lastErrorEvent;
}
if(_862.readyState===WebSocket.CONNECTING){
_862.readyState=WebSocket.OPEN;
if(_830){
_862._webSocket.readyState=WebSocket.OPEN;
}
_862._webSocketChannelListener.handleOpen(_862._webSocket,_863);
}
};
_85f.doClose=function(_864,_865,code,_867){
if(_864._lastErrorEvent!==undefined){
_864._webSocketChannelListener.handleError(_864._webSocket,_864._lastErrorEvent);
delete _864._lastErrorEvent;
}
if(_864.readyState===WebSocket.CONNECTING||_864.readyState===WebSocket.OPEN||_864.readyState===WebSocket.CLOSING){
_864.readyState=WebSocket.CLOSED;
if(_830){
_864._webSocket.readyState=WebSocket.CLOSED;
}
_864._webSocketChannelListener.handleClose(_864._webSocket,_865,code,_867);
}
};
_85f.doBufferedAmountChange=function(_868,n){
_868._webSocketChannelListener.handleBufferdAmountChange(_868._webSocket,n);
};
_85f.processConnect=function(_86a,_86b,_86c){
_LOG.finest(_822,"connect",_86a);
var _86d=_86a;
_LOG.finest("Current ready state = "+_86d.readyState);
if(_86d.readyState===WebSocket.OPEN){
_LOG.fine("Attempt to reconnect an existing open WebSocket to a different location");
throw new Error("Attempt to reconnect an existing open WebSocket to a different location");
}
var _86e=_86d._compositeScheme;
if(_86e!="ws"&&_86e!="wss"){
var _86f=_82c[_86e];
if(_86f==null){
throw new Error("Invalid connection scheme: "+_86e);
}
_LOG.finest("Turning off fallback since the URL is prefixed with java:");
_86d._connectionStrategies.push(_86e);
}else{
var _870=_82d[_86e];
if(_870!=null){
for(var i=0;i<_870.length;i++){
_86d._connectionStrategies.push(_870[i]);
}
}else{
throw new Error("Invalid connection scheme: "+_86e);
}
}
this.fallbackNext(_86d);
};
_85f.processTextMessage=function(_872,_873){
_LOG.finest(_822,"send",_873);
var _874=_872;
if(_874.readyState!=WebSocket.OPEN){
_LOG.fine("Attempt to post message on unopened or closed web socket");
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _875=_874._selectedChannel;
_875._handler.processTextMessage(_875,_873);
};
_85f.processBinaryMessage=function(_876,_877){
_LOG.finest(_822,"send",_877);
var _878=_876;
if(_878.readyState!=WebSocket.OPEN){
_LOG.fine("Attempt to post message on unopened or closed web socket");
throw new Error("Attempt to post message on unopened or closed web socket");
}
var _879=_878._selectedChannel;
_879._handler.processBinaryMessage(_879,_877);
};
_85f.processClose=function(_87a,code,_87c){
_LOG.finest(_822,"close");
var _87d=_87a;
if(_87a.readyState===WebSocket.CONNECTING||_87a.readyState===WebSocket.OPEN){
_87a.readyState=WebSocket.CLOSING;
if(_830){
_87a._webSocket.readyState=WebSocket.CLOSING;
}
}
var _87e=_87d._selectedChannel;
_87e._handler.processClose(_87e,code,_87c);
};
_85f.setListener=function(_87f){
this._listener=_87f;
};
_85f.handleConnectionOpened=function(_880,_881){
var _882=_880.parent;
this.doOpen(_882,_881);
};
_85f.handleMessageReceived=function(_883,obj){
var _885=_883.parent;
switch(_885.readyState){
case WebSocket.OPEN:
if(_885._webSocket.binaryType==="blob"&&obj.constructor==ByteBuffer){
obj=obj.getBlob(obj.remaining());
}else{
if(_885._webSocket.binaryType==="arraybuffer"&&obj.constructor==ByteBuffer){
obj=obj.getArrayBuffer(obj.remaining());
}else{
if(_885._webSocket.binaryType==="blob"&&obj.byteLength){
obj=new Blob([new Uint8Array(obj)]);
}else{
if(_885._webSocket.binaryType==="bytebuffer"&&obj.byteLength){
var u=new Uint8Array(obj);
var _887=[];
for(var i=0;i<u.byteLength;i++){
_887.push(u[i]);
}
obj=new ByteBuffer(_887);
}else{
if(_885._webSocket.binaryType==="bytebuffer"&&obj.size){
var cb=function(_88a){
var b=new ByteBuffer();
b.putBytes(_88a);
b.flip();
_885._webSocketChannelListener.handleMessage(_885._webSocket,b);
};
BlobUtils.asNumberArray(cb,data);
return;
}
}
}
}
}
_885._webSocketChannelListener.handleMessage(_885._webSocket,obj);
break;
case WebSocket.CONNECTING:
case WebSocket.CLOSING:
case WebSocket.CLOSED:
break;
default:
throw new Error("Socket has invalid readyState: "+$this.readyState);
}
};
_85f.handleConnectionClosed=function(_88c,_88d,code,_88f){
var _890=_88c.parent;
if(_890.readyState===WebSocket.CONNECTING&&!_88c.authenticationReceived&&!_88c.preventFallback){
this.fallbackNext(_890);
}else{
this.doClose(_890,_88d,code,_88f);
}
};
_85f.handleConnectionFailed=function(_891){
var _892=_891.parent;
var _893=1006;
var _894="";
if(_891.closeReason.length>0){
_893=_891.closeCode;
_894=_891.closeReason;
}
if(_892.readyState===WebSocket.CONNECTING&&!_891.authenticationReceived&&!_891.preventFallback){
this.fallbackNext(_892);
}else{
this.doClose(_892,false,_893,_894);
}
};
_85f.handleConnectionError=function(_895,e){
_895.parent._lastErrorEvent=e;
};
return _832;
})();
(function(){
var _897="HttpRedirectPolicy";
var LOG=_26b.getLogger(_897);
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
var _89b=HttpRedirectPolicy.prototype;
_89b.toString=function(){
return "HttpRedirectPolicy."+this.name;
};
_89b.isRedirectionAllowed=function(_89c,_89d){
if(arguments.length<2){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify both the 'originalLoc' and the 'redirectLoc' parameters.";
throw Error(s);
}
if(typeof (_89c)=="undefined"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify required 'originalLoc' parameter.";
throw Error(s);
}else{
if(typeof (_89c)!="string"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Required parameter 'originalLoc' is a string.";
throw Error(s);
}
}
if(typeof (_89d)=="undefined"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Please specify required 'redirectLoc' parameter.";
throw Error(s);
}else{
if(typeof (_89d)!="string"){
var s="HttpRedirectPolicy.isRedirectionAllowed(): Required parameter 'redirectLoc' is a string.";
throw Error(s);
}
}
var _89f=false;
var _8a0=new URI(_89c.toLowerCase().replace("http","ws"));
var _8a1=new URI(_89d.toLowerCase().replace("http","ws"));
switch(this.name){
case "ALWAYS":
_89f=true;
break;
case "NEVER":
_89f=false;
break;
case "PEER_DOMAIN":
_89f=isPeerDomain(_8a0,_8a1);
break;
case "SAME_DOMAIN":
_89f=isSameDomain(_8a0,_8a1);
break;
case "SAME_ORIGIN":
_89f=isSameOrigin(_8a0,_8a1);
break;
case "SUB_DOMAIN":
_89f=isSubDomain(_8a0,_8a1);
break;
default:
var s="HttpRedirectPolicy.isRedirectionAllowed(): Invalid policy: "+this.name;
throw new Error(s);
}
return _89f;
};
function isPeerDomain(_8a2,_8a3){
if(isSameDomain(_8a2,_8a3)){
return true;
}
var _8a4=_8a2.scheme.toLowerCase();
var _8a5=_8a3.scheme.toLowerCase();
if(_8a5.indexOf(_8a4)==-1){
return false;
}
var _8a6=_8a2.host;
var _8a7=_8a3.host;
var _8a8=getBaseDomain(_8a6);
var _8a9=getBaseDomain(_8a7);
if(_8a7.indexOf(_8a8,(_8a7.length-_8a8.length))==-1){
return false;
}
if(_8a6.indexOf(_8a9,(_8a6.length-_8a9.length))==-1){
return false;
}
return true;
};
function isSameDomain(_8aa,_8ab){
if(isSameOrigin(_8aa,_8ab)){
return true;
}
var _8ac=_8aa.scheme.toLowerCase();
var _8ad=_8ab.scheme.toLowerCase();
if(_8ad.indexOf(_8ac)==-1){
return false;
}
var _8ae=_8aa.host.toLowerCase();
var _8af=_8ab.host.toLowerCase();
if(_8ae==_8af){
return true;
}
return false;
};
function isSameOrigin(_8b0,_8b1){
var _8b2=_8b0.scheme.toLowerCase();
var _8b3=_8b1.scheme.toLowerCase();
var _8b4=_8b0.authority.toLowerCase();
var _8b5=_8b1.authority.toLowerCase();
if((_8b2==_8b3)&&(_8b4==_8b5)){
return true;
}
return false;
};
function isSubDomain(_8b6,_8b7){
if(isSameDomain(_8b6,_8b7)){
return true;
}
var _8b8=_8b6.scheme.toLowerCase();
var _8b9=_8b7.scheme.toLowerCase();
if(_8b9.indexOf(_8b8)==-1){
return false;
}
var _8ba=_8b6.host.toLowerCase();
var _8bb=_8b7.host.toLowerCase();
if(_8bb.length<_8ba.length){
return false;
}
var s="."+_8ba;
if(_8bb.indexOf(s,(_8bb.length-s.length))==-1){
return false;
}
return true;
};
function getBaseDomain(host){
var _8be=host.split(".");
var len=_8be.length;
if(len<=2){
return host;
}
var _8c0="";
for(var i=1;i<len;i++){
_8c0+="."+_8be[i];
}
return _8c0;
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
var _8c2=new _821();
window.WebSocket=(function(){
var _8c3="WebSocket";
var LOG=_26b.getLogger(_8c3);
var _8c5={};
var _8c6=function(url,_8c8,_8c9,_8ca,_8cb,_8cc){
LOG.entering(this,"WebSocket.<init>",{"url":url,"protocol":_8c8});
this.url=url;
this.protocol=_8c8;
this.extensions=_8c9||[];
this.connectTimeout=0;
this._challengeHandler=_8ca;
this._redirectPolicy=HttpRedirectPolicy.ALWAYS;
if(typeof (_8cb)!="undefined"){
_8cd(_8cb);
this.connectTimeout=_8cb;
}
if(typeof (_8cc)!="undefined"){
_8ce(_8cc);
this._redirectPolicy=_8cc;
}
this._queue=[];
this._origin="";
this._eventListeners={};
setProperties(this);
_8cf(this,this.url,this.protocol,this.extensions,this._challengeHandler,this.connectTimeout);
};
var _8d0=function(s){
if(s.length==0){
return false;
}
var _8d2="()<>@,;:\\<>/[]?={}\t \n";
for(var i=0;i<s.length;i++){
var c=s.substr(i,1);
if(_8d2.indexOf(c)!=-1){
return false;
}
var code=s.charCodeAt(i);
if(code<33||code>126){
return false;
}
}
return true;
};
var _8d6=function(_8d7){
if(typeof (_8d7)==="undefined"){
return true;
}else{
if(typeof (_8d7)==="string"){
return _8d0(_8d7);
}else{
for(var i=0;i<_8d7.length;i++){
if(!_8d0(_8d7[i])){
return false;
}
}
return true;
}
}
};
var _8cf=function(_8d9,_8da,_8db,_8dc,_8dd,_8de){
if(!_8d6(_8db)){
throw new Error("SyntaxError: invalid protocol: "+_8db);
}
var uri=new _50e(_8da);
if(!uri.isSecure()&&document.location.protocol==="https:"){
throw new Error("SecurityException: non-secure connection attempted from secure origin");
}
var _8e0=[];
if(typeof (_8db)!="undefined"){
if(typeof _8db=="string"&&_8db.length){
_8e0=[_8db];
}else{
if(_8db.length){
_8e0=_8db;
}
}
}
_8d9._channel=new _56b(uri,_8e0);
_8d9._channel._webSocket=_8d9;
_8d9._channel._webSocketChannelListener=_8c5;
_8d9._channel._extensions=_8dc;
if(typeof (_8dd)!="undefined"){
_8d9._channel.challengeHandler=_8dd;
}
if((typeof (_8de)!="undefined")&&(_8de>0)){
var _8e1=_8d9._channel;
var _8e2=new _51a(function(){
if(_8e1.readyState==_8c6.CONNECTING){
_8c2.doClose(_8e1,false,1006,"Connection timeout");
_8c2.processClose(_8e1,0,"Connection timeout");
_8e1.connectTimer=null;
}
},_8de,false);
_8d9._channel.connectTimer=_8e2;
_8e2.start();
}
_8c2.processConnect(_8d9._channel,uri.getWSEquivalent());
};
function setProperties(_8e3){
_8e3.onmessage=null;
_8e3.onopen=null;
_8e3.onclose=null;
_8e3.onerror=null;
if(Object.defineProperty){
try{
Object.defineProperty(_8e3,"readyState",{get:function(){
if(_8e3._channel){
return _8e3._channel.readyState;
}else{
return _8c6.CLOSED;
}
},set:function(){
throw new Error("Cannot set read only property readyState");
}});
var _8e4="blob";
Object.defineProperty(_8e3,"binaryType",{enumerable:true,configurable:true,get:function(){
return _8e4;
},set:function(val){
if(val==="blob"||val==="arraybuffer"||val==="bytebuffer"){
_8e4=val;
}else{
throw new SyntaxError("Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'");
}
}});
Object.defineProperty(_8e3,"bufferedAmount",{get:function(){
return _8e3._channel.getBufferedAmount();
},set:function(){
throw new Error("Cannot set read only property bufferedAmount");
}});
}
catch(ex){
_8e3.readyState=_8c6.CONNECTING;
_8e3.binaryType="blob";
_8e3.bufferedAmount=0;
}
}else{
_8e3.readyState=_8c6.CONNECTING;
_8e3.binaryType="blob";
_8e3.bufferedAmount=0;
}
};
var _8e6=_8c6.prototype;
_8e6.send=function(data){
switch(this.readyState){
case 0:
LOG.error("WebSocket.send: Error: Attempt to send message on unopened or closed WebSocket");
throw new Error("Attempt to send message on unopened or closed WebSocket");
case 1:
if(typeof (data)==="string"){
_8c2.processTextMessage(this._channel,data);
}else{
_8c2.processBinaryMessage(this._channel,data);
}
break;
case 2:
case 3:
break;
default:
LOG.error("WebSocket.send: Illegal state error");
throw new Error("Illegal state error");
}
};
_8e6.close=function(code,_8e9){
if(typeof code!="undefined"){
if(code!=1000&&(code<3000||code>4999)){
var _8ea=new Error("code must equal to 1000 or in range 3000 to 4999");
_8ea.name="InvalidAccessError";
throw _8ea;
}
}
if(typeof _8e9!="undefined"&&_8e9.length>0){
var buf=new ByteBuffer();
buf.putString(_8e9,Charset.UTF8);
buf.flip();
if(buf.remaining()>123){
throw new SyntaxError("SyntaxError: reason is longer than 123 bytes");
}
}
switch(this.readyState){
case 0:
case 1:
_8c2.processClose(this._channel,code,_8e9);
break;
case 2:
case 3:
break;
default:
LOG.error("WebSocket.close: Illegal state error");
throw new Error("Illegal state error");
}
};
_8e6.getChallengeHandler=function(){
return this._challengeHandler||null;
};
_8e6.setChallengeHandler=function(_8ec){
if(typeof (_8ec)=="undefined"){
var s="WebSocket.setChallengeHandler(): Parameter 'challengeHandler' is required";
throw new Error(s);
}
this._challengeHandler=_8ec;
this._channel.challengeHandler=_8ec;
};
_8e6.getRedirectPolicy=function(){
return this._redirectPolicy;
};
_8e6.setRedirectPolicy=function(_8ee){
_8ce(_8ee);
this._redirectPolicy=_8ee;
};
var _8cd=function(_8ef){
if(typeof (_8ef)=="undefined"){
var s="WebSocket.setConnectTimeout(): int parameter 'connectTimeout' is required";
throw new Error(s);
}
if(typeof (_8ef)!="number"){
var s="WebSocket.setConnectTimeout(): connectTimeout should be an integer";
throw new Error(s);
}
if(_8ef<0){
var s="WebSocket.setConnectTimeout(): Connect timeout cannot be negative";
throw new Error(s);
}
return;
};
var _8ce=function(_8f1){
if(typeof (_8f1)=="undefined"){
var s="WebSocket.validateHttpRedirectPolicy(): Parameter 'redirectPolicy' is required";
throw new Error(s);
}
if(!(_8f1 instanceof HttpRedirectPolicy)){
var s="WebSocket.validateHttpRedirectPolicy(): Parameter 'redirectPolicy' must be of type HttpRedirectPolicy";
throw new Error(s);
}
};
var _8f3=function(_8f4,data){
var _8f6=new MessageEvent(_8f4,data,_8f4._origin);
_8f4.dispatchEvent(_8f6);
};
var _8f7=function(_8f8){
var _8f9=new Date().getTime();
var _8fa=_8f9+50;
while(_8f8._queue.length>0){
if(new Date().getTime()>_8fa){
setTimeout(function(){
_8f7(_8f8);
},0);
return;
}
var buf=_8f8._queue.shift();
var ok=false;
try{
if(_8f8.readyState==_8c6.OPEN){
_8f3(_8f8,buf);
ok=true;
}else{
_8f8._queue=[];
return;
}
}
finally{
if(!ok){
if(_8f8._queue.length==0){
_8f8._delivering=false;
}else{
setTimeout(function(){
_8f7(_8f8);
},0);
}
}
}
}
_8f8._delivering=false;
};
var _8fd=function(_8fe,_8ff,code,_901){
LOG.entering(_8fe,"WebSocket.doClose");
delete _8fe._channel;
setTimeout(function(){
var _902=new CloseEvent(_8fe,_8ff,code,_901);
_8fe.dispatchEvent(_902);
},0);
};
_8c5.handleOpen=function(_903,_904){
_903.protocol=_904;
var _905={type:"open",bubbles:true,cancelable:true,target:_903};
_903.dispatchEvent(_905);
};
_8c5.handleMessage=function(_906,obj){
if(!Object.defineProperty&&!(typeof (obj)==="string")){
var _908=_906.binaryType;
if(!(_908==="blob"||_908==="arraybuffer"||_908==="bytebuffer")){
var _909={type:"error",bubbles:true,cancelable:true,target:_906,message:"Invalid binaryType. Valid values are 'blob', 'arraybuffer' and 'bytebuffer'"};
_906.dispatchEvent(_909);
return;
}
}
_906._queue.push(obj);
if(!_906._delivering){
_906._delivering=true;
_8f7(_906);
}
};
_8c5.handleClose=function(_90a,_90b,code,_90d){
_8fd(_90a,_90b,code,_90d);
};
_8c5.handleError=function(_90e,_90f){
LOG.entering(_90e,"WebSocket.handleError"+_90f);
setTimeout(function(){
_90e.dispatchEvent(_90f);
},0);
};
_8c5.handleBufferdAmountChange=function(_910,n){
_910.bufferedAmount=n;
};
_8e6.addEventListener=function(type,_913,_914){
this._eventListeners[type]=this._eventListeners[type]||[];
this._eventListeners[type].push(_913);
};
_8e6.removeEventListener=function(type,_916,_917){
var _918=this._eventListeners[type];
if(_918){
for(var i=0;i<_918.length;i++){
if(_918[i]==_916){
_918.splice(i,1);
return;
}
}
}
};
_8e6.dispatchEvent=function(e){
var type=e.type;
if(!type){
throw new Error("Cannot dispatch invalid event "+e);
}
try{
var _91c=this["on"+type];
if(typeof _91c==="function"){
_91c(e);
}
}
catch(e){
LOG.severe(this,type+" event handler: Error thrown from application");
}
var _91d=this._eventListeners[type];
if(_91d){
for(var i=0;i<_91d.length;i++){
try{
_91d[i](e);
}
catch(e2){
LOG.severe(this,type+" event handler: Error thrown from application");
}
}
}
};
_8c6.CONNECTING=_8e6.CONNECTING=0;
_8c6.OPEN=_8e6.OPEN=1;
_8c6.CLOSING=_8e6.CLOSING=2;
_8c6.CLOSED=_8e6.CLOSED=3;
return _8c6;
})();
window.WebSocket.__impls__={};
window.WebSocket.__impls__["flash:wse"]=_308;
}());
(function(){
window.WebSocketExtension=(function(){
var _91f="WebSocketExtension";
var LOG=_26b.getLogger(_91f);
var _921=function(name){
this.name=name;
this.parameters={};
this.enabled=false;
this.negotiated=false;
};
var _923=_921.prototype;
_923.getParameter=function(_924){
return this.parameters[_924];
};
_923.setParameter=function(_925,_926){
this.parameters[_925]=_926;
};
_923.getParameters=function(){
var arr=[];
for(var name in this.parameters){
if(this.parameters.hasOwnProperty(name)){
arr.push(name);
}
}
return arr;
};
_923.parse=function(str){
var arr=str.split(";");
if(arr[0]!=this.name){
throw new Error("Error: name not match");
}
this.parameters={};
for(var i=1;i<arr.length;i++){
var _92c=arr[i].indexOf("=");
this.parameters[arr[i].subString(0,_92c)]=arr[i].substring(_92c+1);
}
};
_923.toString=function(){
var arr=[this.name];
for(var p in this.parameters){
if(this.parameters.hasOwnProperty(p)){
arr.push(p.name+"="+this.parameters[p]);
}
}
return arr.join(";");
};
return _921;
})();
})();
(function(){
window.WebSocketRevalidateExtension=(function(){
var _92f=function(){
};
var _930=_92f.prototype=new WebSocketExtension(_556.KAAZING_SEC_EXTENSION_REVALIDATE);
return _92f;
})();
})();
(function(){
window.WebSocketFactory=(function(){
var _931="WebSocketFactory";
var LOG=_26b.getLogger(_931);
var _933=function(){
this.extensions={};
var _934=new WebSocketRevalidateExtension();
this.extensions[_934.name]=_934;
this.redirectPolicy=HttpRedirectPolicy.ALWAYS;
};
var _935=_933.prototype;
_935.getExtension=function(name){
return this.extensions[name];
};
_935.setExtension=function(_937){
this.extensions[_937.name]=_937;
};
_935.setChallengeHandler=function(_938){
if(typeof (_938)=="undefined"){
var s="WebSocketFactory.setChallengeHandler(): Parameter 'challengeHandler' is required";
throw new Error(s);
}
this.challengeHandler=_938;
var _93a=this.extensions[_556.KAAZING_SEC_EXTENSION_REVALIDATE];
_93a.enabled=(_938!=null);
};
_935.getChallengeHandler=function(){
return this.challengeHandler||null;
};
_935.createWebSocket=function(url,_93c){
var ext=[];
for(var key in this.extensions){
if(this.extensions.hasOwnProperty(key)&&this.extensions[key].enabled){
ext.push(this.extensions[key].toString());
}
}
var _93f=this.getChallengeHandler();
var _940=this.getDefaultConnectTimeout();
var _941=this.getDefaultRedirectPolicy();
var ws=new WebSocket(url,_93c,ext,_93f,_940,_941);
return ws;
};
_935.setDefaultConnectTimeout=function(_943){
if(typeof (_943)=="undefined"){
var s="WebSocketFactory.setDefaultConnectTimeout(): int parameter 'connectTimeout' is required";
throw new Error(s);
}
if(typeof (_943)!="number"){
var s="WebSocketFactory.setDefaultConnectTimeout(): connectTimeout should be an integer";
throw new Error(s);
}
if(_943<0){
var s="WebSocketFactory.setDefaultConnectTimeout(): Connect timeout cannot be negative";
throw new Error(s);
}
this.connectTimeout=_943;
};
_935.getDefaultConnectTimeout=function(){
return this.connectTimeout||0;
};
_935.setDefaultRedirectPolicy=function(_945){
if(typeof (_945)=="undefined"){
var s="WebSocketFactory.setDefaultRedirectPolicy(): int parameter 'redirectPolicy' is required";
throw new Error(s);
}
if(!(_945 instanceof HttpRedirectPolicy)){
var s="WebSocketFactory.setDefaultRedirectPolicy(): redirectPolicy should be an instance of HttpRedirectPolicy";
throw new Error(s);
}
this.redirectPolicy=_945;
};
_935.getDefaultRedirectPolicy=function(){
return this.redirectPolicy;
};
return _933;
})();
})();
window.___Loader=new _3a1(_26a);
})();
})();
