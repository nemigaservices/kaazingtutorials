/**
 * Copyright (c) 2007-2014, Kaazing Corporation. All rights reserved.
 */

var TEST_ENABLED=true;
function sizeof(_1,_2){
var _3;
var _4=0;
var _5=0;
var _6=0;
var _7=0;
var _8=0;
var _9=0;
var _a=0;
var _b=0;
var _c=0;
var _d=0;
var _e=0;
var _f,_10,key,len,tmp,_14;
if(_2){
_3=_2;
}else{
_3=[];
}
_3.push(_1);
function processPrimitive(_15,_16){
switch(_16){
case "boolean":
_4+=4;
_5++;
break;
case "number":
_4+=8;
_6++;
break;
case "string":
len=_15.length;
_4+=len*2;
_7++;
_8+=len;
break;
case "function":
_d++;
break;
case "null":
case "undefined":
break;
default:
alert("Found unknown item "+_15+" of type "+_16);
}
};
function isSystemObj(_17){
return (_17===window||_17===navigator||_17===localStorage);
};
function processItem(_18,_19){
if(_19!=="array"&&_19!=="object"){
processPrimitive(_18,_19);
}else{
if(isSystemObj(_18)){
CC.console.log("Ignoring system object");
}else{
if(_3.indexOf(_18)>=0){
CC.console.log("Ignoring already-seen object");
}else{
CC.console.log("pushing item of type ["+_19+"]");
_3.push(_18);
}
}
}
};
for(var _1a=_3.indexOf(_1);_1a<_3.length;_1a++){
if(_1a%100==0){
CC.console.log("checking obj #"+_1a);
}
var _f=_3[_1a];
var _1b=typeOf(_f);
if(_1b==="array"){
_9++;
for(var i=0;i<_f.length;i++){
processItem(_f[i],typeOf(_f[i]));
}
}else{
if(_1b!=="object"){
processPrimitive(_f,_1b);
}else{
_a++;
for(key in _f){
_4+=2*key.length;
_b++;
_c+=key.length;
CC.console.log("Found object key ["+key+"]");
try{
processItem(_f[key],typeOf(_f[key]));
}
catch(ex){
_e++;
}
}
}
}
}
return [_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e];
};
function countClusterSize(_1d){
var _1e=[_1d];
var _1f=_1d.getGateways()[0];
_1e.push(_1f);
var _20=null;
var _21=_1f.getServices();
for(var i=0;i<_21.length;i++){
var _23=_21[i];
if(_23.get("serviceLabel")=="performance proxy"){
_20=_23;
}
_1e.push(_23);
}
var _24=_20.get("serviceProcessingDataModels").item(0);
var _25=sizeof(_24,_1e);
alert("The first service processing data model in service ["+_20.get("serviceLabel")+" takes up approximately:\n"+_25[0]+" bytes overall\n"+_25[1]+" booleans\n"+_25[2]+" numbers\n"+_25[3]+" strings ("+_25[4]+" chars)\n"+_25[5]+" arrays\n"+_25[6]+" objects ("+_25[7]+" keys taking "+_25[8]+" chars)\n"+_25[9]+" functions\n"+_25[10]+" unreadable object properties");
return _1e;
};
function countSpdmSize(_26){
var _27=countModelObjects(_26);
var _28=_27["sessionProcessingDataModels"];
var _29=[];
};
function countModelObjects(_2a){
var _2b={clusterModels:[],clusterConfigModels:[],cpuListModels:[],cpuListSummaryDataItems:[],gatewayModels:[],gatewayConfigModels:[],gatewayProcessingDataModels:[],jvmModels:[],jvmSummaryDataItems:[],licenseConfigModels:[],networkConfigModels:[],nicListModels:[],nicListSummaryDataItems:[],realmConfigModels:[],securityConfigModels:[],serviceConfigModels:[],serviceDefaultsConfigModels:[],serviceModels:[],serviceProcessingDataModels:[],sessionModels:[],sessionProcessingDataModels:[],systemModels:[],systemSummaryDataItems:[]};
function processClusterModel(_2c){
if(addModel("clusterModels",_2c)){
var _2d=_2c.get("gatewayModels");
if(_2d){
_2d.values().forEach(function(gw){
processGatewayModel(gw);
});
}
_2d=_2c.get("inProcessGatewayModels");
_2d.forEach(function(gw){
processGatewayModel(gw);
});
}
};
function processGatewayModel(_30){
if(addModel("gatewayModels",_30)){
processGatewayConfigModel(_30.get("gatewayConfig"));
var _31=_30.get("gatewayProcessingDataModels");
for(var i=0;i<_31.size();i++){
processGatewayProcessingDataModel(_31.item(i));
}
var _33=_30.get("systemModel");
if(_33){
processSystemModel(_33);
}
var _34=_30.get("cpuListModel");
if(_34){
processCpuListModel(_34);
}
var _35=_30.get("nicListModel");
if(_35){
processNicListModel(_35);
}
var _36=_30.get("jmvModel");
if(_36){
processJmvModel(_36);
}
var _37=_30.getServices();
if(_37){
_37.forEach(function(_38){
processServiceModel(_38);
});
}
}
};
function processGatewayConfigModel(_39){
if(addModel("gatewayConfigModels",_39)){
var _3a=_39.get("clusterConfig");
if(_3a){
processClusterConfigModel(_3a);
}
var _3b=_39.get("licenseConfig");
if(_3b){
processLicenseConfigModel(_3b);
}
var _3c=_39.get("networkConfig");
if(_3c){
processNetworkConfigModel(_3c);
}
var _3d=_39.get("securityConfig");
if(_3d){
processSecurityConfigModel(_3d);
}
var _3e=_39.get("serviceDefaultsConfig");
if(_3e){
processServiceDefaultsConfigModel(_3e);
}
var _3f=_39.get("serviceConfigs");
if(_3f){
_3f.forEach(function(_40){
processServiceConfigModel(_40);
});
}
}
};
function processClusterConfigModel(_41){
addModel("clusterConfigModels",_41);
};
function processLicenseConfigModel(_42){
addModel("licenseConfigModels",_42);
};
function processNetworkConfigModel(_43){
addModel("networkConfigModels",_43);
};
function processSecurityConfigModel(_44){
if(addModel("securityConfigModels",_44)){
var _45=_44.get("realmConfigs");
if(_45){
for(var _46 in _45){
processRealmConfigModel(_45[_46]);
}
}
}
};
function processRealmConfigModel(_47){
addModel("realmConfigModels",_47);
};
function processServiceDefaultsConfigModel(_48){
addModel("serviceDefaultsConfigModels",_48);
};
function processServiceConfigModel(_49){
addModel("serviceConfigModels",_49);
};
function processGatewayProcessingDataModel(_4a){
addModel("gatewayProcessingDataModels",_4a);
};
function processSystemModel(_4b){
if(addModel("systemModels",_4b)){
var _4c=_4b.get("summaryData");
_4c.forEach(function(_4d){
processSystemSummaryDataItem(_4d);
});
}
};
function processSystemSummaryDataItem(_4e){
_2b["systemSummaryDataItems"].push(_4e);
};
function processCpuListModel(_4f){
if(addModel("cpuListModels",_4f)){
var _50=_4f.get("summaryData");
_50.forEach(function(_51){
processCpuListSummaryDataItem(_51);
});
}
};
function processCpuListSummaryDataItem(_52){
_2b["cpuListSummaryDataItems"].push(_52);
};
function processNicListModel(_53){
if(addModel("nicListModels",_53)){
var _54=_53.get("summaryData");
_54.forEach(function(_55){
processNicListSummaryDataItem(_55);
});
}
};
function processNicListSummaryDataItem(_56){
_2b["nicListSummaryDataItems"].push(_56);
};
function processJvmModel(_57){
if(addModel("jvmModels",_57)){
var _58=_57.get("summaryData");
_58.forEach(function(_59){
processJvmSummaryDataItem(_59);
});
}
};
function processJvmSummaryDataItem(_5a){
_2b["jvmSummaryDataItems"].push(_5a);
};
function processServiceModel(_5b){
if(addModel("serviceModels",_5b)){
var _5c=_5b.get("serviceProcessingDataModels");
for(var i=0;i<_5c.size();i++){
processServiceProcessingDataModel(_5c.item(i));
}
var _5e=_5b.getSessions();
if(_5e){
_5e.forEach(function(_5f){
processSessionModel(_5f);
});
}
}
};
function processServiceProcessingDataModel(_60){
_2b["serviceProcessingDataModels"].push(_60);
};
function processSessionModel(_61){
if(addModel("sessionModels",_61)){
var _62=_61.get("sessionProcessingDataModels");
for(var i=0;i<_62.size();i++){
processSessionProcessingDataModel(_62.item(i));
}
}
};
function processSessionProcessingDataModel(_64){
_2b["sessionProcessingDataModels"].push(_64);
};
function addModel(_65,_66){
var _67=_2b[_65];
if(_67.indexOf(_66)<0){
_67.push(_66);
return true;
}
return false;
};
processClusterModel(_2a);
var msg="Counts of the various types of model objects in the cluster tree:\n";
for(var _69 in _2b){
msg+=(_69+": "+_2b[_69].length+"\n");
}
alert(msg);
return _2b;
};
function countBytesRead(_6a){
var _6b=_6a.getGateways();
var _6c="Read since connection:\n";
if(_6b){
for(var i=0;i<_6b.length;i++){
var _6e=_6b[i];
var _6f=_6e.get("mngtApi");
var _70=_6f._impl._snmp._bytesRead;
var _71=_6f._impl._snmp._fragmentsRead;
_6c+=(_6e.get("gatewayLabel")+": "+_71+" fragments, "+_70+" bytes\n");
}
}else{
_6c+="  No gateways are connected";
}
alert(_6c);
};
