/**
 * Copyright (c) 2007-2014, Kaazing Corporation. All rights reserved.
 */

YUI.add("map-model",function(Y){
"use strict";
var _2=Y.Lang,_3="mapModel";
Y.MapModel=Y.Base.create(_3,Y.Model,[],{MAPMODEL_ADD_EVENT:_3+":add",MAPMODEL_REMOVE_EVENT:_3+":remove",MAPMODEL_UPDATE_KEY_EVENT:_3+":updatekey",initializer:function(){
var _4=this;
_4.publish(_4.MAPMODEL_ADD_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
_4.publish(_4.MAPMODEL_REMOVE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
_4.publish(_4.MAPMODEL_UPDATE_KEY_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
_4.items={};
},putItem:function(_5,_6){
this.removeItem(_5);
this.items[_5]=_6;
_6&&_6.addTarget(this);
this.fire(this.MAPMODEL_ADD_EVENT,{item:_6});
return _6;
},removeItem:function(_7){
var _8=this.items;
if(_8.hasOwnProperty(_7)){
var _9=_8[_7];
if(_9){
_9.removeTarget(this);
}
delete _8[_7];
this.fire(this.MAPMODEL_REMOVE_EVENT,{item:_9});
}
},getItem:function(_a){
return this.items[_a];
},hasKey:function(_b){
return this.items.hasOwnProperty(_b);
},updateKey:function(_c,_d){
var _e=this.items;
if(this.hasKey(_d)){
this.removeItem(_d);
}
if(this.hasKey(_c)){
var _f=_e[_c];
delete _e[_c];
_e[_d]=_f;
this.fire(this.MAPMODEL_UPDATE_KEY_EVENT,{oldKey:_c,newKey:_d});
}
},size:function(){
var _10=this.items;
var _11=0;
for(var k in _10){
if(_10.hasOwnProperty(k)){
_11++;
}
}
return _11;
},keys:function(){
var _13=this.items;
var _14=[];
for(var k in _13){
if(_13.hasOwnProperty(k)){
_14.push(k);
}
}
return _14;
},values:function(){
var _16=this.items;
var _17=[];
for(var k in _16){
if(_16.hasOwnProperty(k)){
_17.push(_16[k]);
}
}
return _17;
}},{ATTRS:{}});
},"0.99",{requires:["model"]});
YUI.add("cluster-model",function(Y){
"use strict";
var _1a=Y.Lang,_1b="clusterModel";
Y.ClusterModel=Y.Base.create(_1b,Y.Model,[],{initializer:function(){
this.get("gatewayModels").addTarget(this);
},hasAttribute:function(_1c){
return Y.ClusterConfigModel.ATTRS.hasOwnProperty(_1c);
},start:function(_1d){
return this.createGatewayModel("",_1d,true);
},logout:function(){
CC.console.log("### starting cluster logout");
this.set("loggingOut",true);
var _1e=this.getGateways();
if(_1e){
_1e.forEach(function(_1f){
_1f.disconnect();
_1f.destroyGateway();
});
}
CC.console.log("### finishing cluster logout");
},createGatewayModel:function(_20,_21,_22){
var _23=new Y.GatewayModel({clusterModel:this,loginProcessor:this.get("loginProcessor"),connectionUrl:_21,instanceKey:_20,canChangeUrl:_22});
this.get("gatewayModels").putItem(_20,_23);
return _23;
},findGatewayModelByInstanceKey:function(_24){
var _25=this.get("gatewayModels").values();
for(var i=0;i<_25.length;i++){
var _27=_25[i];
if(_27.get("instanceKey")===_24){
return _27;
}
}
return null;
},setFirstGatewayInstanceKey:function(_28){
var _29=this.get("gatewayModels");
_29.updateKey("",_28);
},loginCompleted:function(_2a){
this.set("isCluster",_2a.isCluster());
var _2b=_2a.get("gatewayConfig");
this.set("versionInfo",_2b.get("versionInfo"));
this.set("loggedIn",true);
},destroyGateway:function(_2c){
var _2d=_2c.get("instanceKey");
this.get("gatewayModels").removeItem(_2d);
_2c.destroyGateway();
},processClusterStateData:function(_2e,_2f,_30,_31,_32,_33){
var _34=this;
this.set("connectionSoftLimit",_31);
this.set("connectionHardLimit",_32);
var _35={};
for(var _36 in _2e){
if(_2e.hasOwnProperty(_36)){
var _37=null;
if(_30&&_30.hasOwnProperty(_36)){
var _38=_30[_36];
for(var i=0;i<_38.length;i++){
var _3a=_38[i];
if(_3a.startsWith("ws://")){
_37=_3a;
}else{
if(_3a.startsWith("wss://")){
_37=_3a;
break;
}
}
}
}
_35[_36]=_37;
}
}
var _3b=this.getGateways();
_3b.forEach(function(_3c){
var _3d=_3c.get("instanceKey");
if(!_35.hasOwnProperty(_3d)){
_3c.shutDown(_33);
}else{
delete _35[_3d];
}
});
for(var _36 in _35){
if(_35.hasOwnProperty(_36)){
this.createGatewayModel(_36,_35[_36]);
}
}
},processMembershipChange:function(_3e){
var _3f=_3e.instanceKey;
var _40=_3e.eventType;
var _41=this.findGatewayModelByInstanceKey(_3f);
if(_40==="join"){
if(!_41){
_41=this.createGatewayModel(_3f,"");
CC.console.log("Processing JOIN created gateway model for instance key "+_3f);
}
}else{
if(_41){
_41.processLeave(_3e.readTime);
}
}
},processManagementServiceChange:function(_42){
var _43=_42.instanceKey;
var _44=this.findGatewayModelByInstanceKey(_43);
if(!_44){
_44=this.createGatewayModel(_43,"");
}
if(_42.eventType=="add"){
_44.processAddManagementService(_42.accepts,_42.readTime);
}else{
_44.processRemoveManagementService(_42.accepts,_42.readTime);
}
},processConnectionLimitChange:function(_45){
this.set((_45.eventType===MngtAPI_SNMP.prototype.CONNECTION_SOFT_LIMIT?"connectionSoftLimit":"connectionHardLimit"),_45.value);
},getNumGateways:function(){
return this.get("gatewayModels").size();
},getGateways:function(){
var _46=this.get("gatewayModels");
return ((_46.size()>0)?_46.values():null);
},getSortedGateways:function(){
var _47=this.getGateways();
if(!_47||_47.length==0){
return null;
}
_47.sort(function(g1,g2){
var val=compareStrings(g1.get("connectionUrl"),g2.get("connectionUrl"));
if(val!=0){
return val;
}
return compareNumbers(g1.get("stopTime"),g2.get("stopTime"),true,0);
});
return _47;
},getAvailableGateways:function(){
var _4b=this.getGateways();
if(!_4b||_4b.length==0){
return null;
}
for(var i=_4b.length-1;i>=0;i--){
if(!_4b[i].isAvailable()){
_4b.splice(i,1);
}
}
return _4b;
},getUsableGateways:function(){
var _4d=this.getGateways();
if(!_4d||_4d.length==0){
return null;
}
for(var i=_4d.length-1;i>=0;i--){
if(!_4d[i].isUsable()){
_4d.splice(i,1);
}
}
return _4d;
},getMembersList:function(){
var _4f=this.getGateways();
var _50=[];
if(_4f){
for(var i=0;i<_4f.length;i++){
_50[i]=_4f[i].get("gatewayLabel");
}
}
_50.sort(function(a,b){
return compareStrings(a.toLowerCase(),b.toLowerCase());
});
return _50;
}},{ATTRS:{startTime:{valueFn:function(){
return new Date();
}},isCluster:{value:false},connectionSoftLimit:{value:null},connectionHardLimit:{value:null},versionInfo:{value:null},gatewayModels:{valueFn:function(){
var ml=new Y.MapModel({model:Y.GatewayModel});
ml.modelName="GatewayModel";
return ml;
}},loginProcessor:{value:null},loggedIn:{value:false},loggingOut:{value:false},defaultCredentials:{value:null},numQuarantined:{getter:function(){
return 0;
}},numRunning:{getter:function(){
var _55=0;
var _56=this.getGateways();
for(var i=0;i<_56.length;i++){
var _58=_56[i];
if(!_58.get("stopTime")){
_55++;
}
}
return _55;
}}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("gateway-model",function(Y){
"use strict";
var _5a=Y.Lang,_5b="gatewayModel",_5c={UNINITIALIZED:0,DISCONNECTED:10,DISCONNECTING:20,CONNECTING:30,CONNECTED:50,AVAILABLE:100};
Y.GatewayModel=Y.Base.create(_5b,Y.Model,[],{GATEWAY_AVAILABLE_EVENT:_5b+":gatewayAvailable",GATEWAY_UNAVAILABLE_EVENT:_5b+":gatewayUnavailable",ADD_SERVICE_EVENT:_5b+":addService",REMOVE_SERVICE_EVENT:_5b+":removeService",START_CONNECT_TIMER_LIST:[100,1000,5000,10000,30000,60000],initializer:function(){
var _5d=this;
this.set("createTime",Date.now());
this.publish(this.GATEWAY_AVAILABLE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.GATEWAY_UNAVAILABLE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.ADD_SERVICE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.REMOVE_SERVICE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.get("serviceModels").addTarget(this);
this.on(Y.MapModel.prototype.MAPMODEL_ADD_EVENT,this.onServiceModelAdd,this);
this.on(Y.MapModel.prototype.MAPMODEL_REMOVE_EVENT,this.onServiceModelRemove,this);
var _5e=this.get("connectionUrl");
if(_5e){
this.startFirstConnect(_5e);
}else{
invokeLater(function(){
_5d.setGatewayState(_5c.AVAILABLE);
},0);
}
},hasAttribute:function(_5f){
return Y.GatewayModel.ATTRS.hasOwnProperty(_5f);
},destroyGateway:function(){
this.set("clusterModel",null);
this.set("destroyed",true);
this.destroy();
},startFirstConnect:function(_60){
var _61=this;
this.setGatewayState(_5c.DISCONNECTED);
this.set("connectionUrl",_60);
invokeLater(function(){
_61.doConnect();
},10);
},doConnect:function(){
var _62=this;
var _63=this.get("clusterModel");
this.setGatewayState(_5c.CONNECTING);
var _64=this.get("credentials");
if(!_64){
_64=_63.get("defaultCredentials");
}
if(!_64){
this.get("loginProcessor").requestLoginLock(_62,function(_65,_66,_67){
_62.set("connectionUrl",_65);
_62.set("credentials",_62.encodeCredentials(_66,_67));
_62.doConnect2(function(_68){
_62.handleBadCredentials(_65,_66,_67);
});
},_62.get("canChangeUrl"));
}else{
this.set("credentials",_64);
this.doConnect2(function(_69){
_62.onClose(_69);
});
}
},doConnect2:function(_6a){
var _6b=this;
var _6c=this.get("mngtApi");
if(_6c){
_6c.disconnect();
_6c.setChallengeHandler(null);
_6c.setOpenListener(null);
_6c.setExceptionListener(null);
_6c.setCloseListener(null);
}
var _6d=new MngtAPI_SNMP();
_6d._snmp._gatewayModel=this;
_6c=new MngtAPI(_6d);
this.set("mngtApi",_6c);
_6c.setOpenListener(function(_6e){
_6b.clearLoginLock();
var _6f=_6b.get("clusterModel");
if(!_6f.get("defaultCredentials")){
_6f.set("defaultCredentials",_6b.get("credentials"));
}
var _70=_6b.get("mngtApi");
_70.getChallengeHandler().resetTries();
_70.setExceptionListener(function(_71){
_6b.onError(_71);
});
_70.setCloseListener(function(_72){
_6b.onClose(_72);
});
_6b.onOpen(_6e);
});
_6c.setExceptionListener(function(_73){
alert("Exception during connection processing for "+_6b.getDebugIdStr());
});
_6c.setCloseListener(function(_74){
CC.console.debug("mngtApi.closeListener callback for gateway ["+_6b.get("connectionUrl")+", key = "+_6b.get("instanceKey")+"]");
_6a(_74);
});
var _75=this.makeChallengeHandler(this,this.get("credentials"));
_6c.setChallengeHandler(_75);
_6c.connect(this.get("connectionUrl"));
},handleBadCredentials:function(_76,_77,_78){
var _79=this.get("loginProcessor");
_79.processLogin(true,_77,_78);
},encodeCredentials:function(_7a,_7b){
var str=_7a+":"+_7b;
return btoa(unescape(encodeURIComponent(str)));
},makeChallengeHandler:function(_7d,_7e){
return {gatewayModel:_7d,credentials:_7e,tryNumber:0,canHandle:function(_7f){
return (_7f!=null&&_7f.authenticationScheme==="Basic"&&_7f.location.endsWith("/snmp"));
},resetTries:function(){
this.tryNumber=0;
},handle:function(_80,_81){
var _82=this;
CC.console.debug("challengeHandler.handle for gateway ["+this.gatewayModel.get("connectionUrl")+"], instanceKey ["+this.gatewayModel.get("instanceKey")+"]");
if(!_7d.isAuthenticated()){
if(this.tryNumber>0){
_81(null);
return;
}
this.tryNumber++;
}else{
CC.console.debug("revalidating");
var i=0;
}
var _84=null;
if(_80.location!==null){
_84=new ChallengeResponse("Basic "+this.credentials,null);
}
_81(_84);
},updateCredentials:function(_85){
this.credentials=_85;
}};
},clearStartConnectTimer:function(){
var _86=this.get("startConnectTimerId");
if(_86){
window.clearTimeout(_86);
this.set("startConnectTimerId",null);
}
},resetStartConnectIndex:function(){
this.set("startConnectIndex",0);
},getStartConnectWaitTime:function(){
var _87=this.get("startConnectIndex");
if(_87>0){
_87--;
}
return this.START_CONNECT_TIMER_LIST[_87];
},disconnect:function(){
if(this.isOpen()){
this.get("mngtApi").disconnect();
}
},clearLoginLock:function(){
this.get("loginProcessor").clearLoginLock(this);
},onError:function(_88){
CC.console.error("onError for "+this.getDebugIdStr());
this.onClose(null);
},onClose:function(_89){
var _8a=this;
CC.console.debug("standard onClose for gateway ["+this.get("connectionUrl")+", key = "+this.get("instanceKey")+"]");
this.set("authenticated",false);
var _8b=this.get("clusterModel");
if(this.get("stopTime")){
CC.console.debug("dead instance "+this.get("instanceKey"));
return;
}else{
if(!_8b||_8b.get("loggingOut")){
CC.console.debug("logging out "+this.get("instanceKey"));
return;
}
}
this.setGatewayState(_5c.DISCONNECTED);
var _8c=this.get("startConnectIndex");
if(_8c<this.START_CONNECT_TIMER_LIST.length-1){
this.set("startConnectIndex",_8c+1);
}
CC.console.log("Setting doConnect for "+this.START_CONNECT_TIMER_LIST[_8c]+"ms from now for instance "+this.get("instanceKey"));
this.set("startConnectTimerId",invokeLater(function(){
_8a.doConnect();
},this.START_CONNECT_TIMER_LIST[_8c]));
},onOpen:function(_8d){
var _8e=this;
this.set("authenticated",true);
this.clearStartConnectTimer();
this.resetStartConnectIndex();
CC.console.debug("### Successfully logged into management service for "+this.getDebugIdStr());
this.setGatewayState(_5c.CONNECTED);
CC.console.log("## onOpen, after setting gatewayState to CONNECTED");
this.get("mngtApi").getClusterState(function(_8f){
invokeLater(function(){
_8e.onOpen1(_8f);
},0);
});
},onOpen1:function(_90){
var _91=this;
var _92=this.get("clusterModel");
var _93=_90.instanceKey;
var _94=this.get("instanceKey");
var _95=this.get("mngtApi");
if(_94!==""&&_94!==_93){
if(this.get("stopTime")){
CC.console.warn("Somehow in onOpen1 for gateway instance "+this.get("instanceKey")+" ("+this.getDebugIdStr()+") "+"that has already been stopped. "+"Disconnecting this gateway instance.");
this.disconnect();
}else{
this.shutDown(_90.readTime);
if(_92.findGatewayModelByInstanceKey(_93)){
CC.console.error("Somehow in onOpen1 for gateway instance "+_94+" ("+this.get("connectionUrl")+") "+"that is not marked as stopped, but a new instance "+"key already exists for this connection URL. "+"Disconnecting this gateway instance and marking it "+"as stopped.");
}else{
_92.createGatewayModel(_93,this.get("connectionUrl"));
}
}
return;
}
if(_94===""){
this.set("instanceKey",_93);
_92.setFirstGatewayInstanceKey(_93);
}
var _96=_90.hostAndPID;
if(_96!==undefined&&_96!==null){
var _97=_96.split("@");
_96=_97[1]+" : "+_97[0];
}else{
_96="";
}
this.set("hostAndPID",_96);
this.set("startTime",_90.startTime);
this.set("upTime",_90.upTime);
if(!_90.mngtServiceMap||isEmptyObject(_90.mngtServiceMap)){
_90.mngtServiceMap={};
_90.mngtServiceMap[this.get("instanceKey")]=[this.get("connectionUrl")];
}
invokeLater(function(){
_92.processClusterStateData(_90.clusterMembers,_90.balancerMap,_90.mngtServiceMap,_90.clusterConnectionSoftLimit,_90.clusterConnectionHardLimit,_90.readTime);
},0);
_95.startNotifications(function(_98){
_91.notificationCallback(_98);
});
invokeLater(function(){
_91.onOpen2();
},0);
},onOpen2:function(){
var _99=this;
if(!this.get("summaryDataDefinitions")){
var _9a=this.get("mngtApi");
_9a.getSummaryDataDefinitions(function(_9b){
_99.set("summaryDataDefinitions",_9b);
var _9c=new Y.GatewayDynamicDataModel({gatewayModel:_99});
_99.set("dynamicDataModel",_9c);
_9c.addTarget(_99);
var _9d=new Y.SystemModel({gatewayModel:_99});
_99.set("systemModel",_9d);
_9d.addTarget(_99);
var _9e=new Y.CpuListModel({gatewayModel:_99});
_99.set("cpuListModel",_9e);
_9e.addTarget(_99);
var _9f=new Y.NicListModel({gatewayModel:_99});
_99.set("nicListModel",_9f);
_9f.addTarget(_99);
var _a0=new Y.JvmModel({gatewayModel:_99});
_99.set("jvmModel",_a0);
_a0.addTarget(_99);
invokeLater(function(){
_99.onOpen3();
},0);
});
}else{
invokeLater(function(){
_99.onOpen3();
},0);
}
},onOpen3:function(){
var _a1=this;
if(!this.get("gatewayConfig")){
this.get("mngtApi").getGatewayConfiguration(function(_a2){
_a2.gatewayModel=_a1;
var _a3=new Y.GatewayConfigModel(_a2);
_a1.set("gatewayConfig",_a3);
var _a4=_a1.get("serviceModels");
var _a5=_a1.get("startTime");
var _a6=_a3.get("serviceConfigs");
for(var i=0;i<_a6.length;i++){
var _a8=_a6[i];
if(!_a8.isManagement()){
var _a9=_a8.get("serviceId");
var _aa=new Y.ServiceModel({gatewayModel:_a1,serviceId:_a9,startTime:_a5});
_a4.putItem(_a9,_aa);
}
}
invokeLater(function(){
_a1.onOpen4();
},0);
});
}else{
invokeLater(function(){
_a1.onOpen4();
},0);
}
},onOpen4:function(){
var _ab=this;
this.get("mngtApi").getGateway(function(_ac){
_ab.get("dynamicDataModel").load(_ac);
invokeLater(function(){
_ab.onOpen5();
},0);
});
},onOpen5:function(){
var _ad=this;
this.get("mngtApi").getSystemStats(function(_ae){
_ad.get("systemModel").load(_ae);
invokeLater(function(){
_ad.onOpen6();
},0);
});
},onOpen6:function(){
var _af=this;
this.get("mngtApi").getCpuListStats(function(_b0){
_af.get("cpuListModel").load(_b0);
invokeLater(function(){
_af.onOpen7();
},0);
});
},onOpen7:function(){
var _b1=this;
this.get("mngtApi").getNicListStats(function(_b2){
_b1.get("nicListModel").load(_b2);
invokeLater(function(){
_b1.onOpen8();
},0);
});
},onOpen8:function(){
var _b3=this;
this.get("mngtApi").getJVMStats(function(_b4){
_b3.get("jvmModel").load(_b4);
invokeLater(function(){
_b3.onOpen9();
},0);
});
},onOpen9:function(){
var _b5=this;
_b5.get("mngtApi").getServices(function(_b6){
var _b7=_b5.get("serviceModels");
_b6.forEach(function(_b8){
_b7.getItem(_b8.serviceId).load(_b8);
});
invokeLater(function(){
_b5.onOpen10();
},0);
});
},onOpen10:function(){
var _b9=this;
var fn=function(_bb){
if(_bb&&_bb.length>0){
var _bc=_bb.shift();
_b9.get("mngtApi").setServiceNotifications(_bc.get("serviceId"),1,function(){
fn(_bb);
});
}else{
invokeLater(function(){
_b9.onOpen11();
},0);
}
};
fn(_b9.getServices());
},onOpen11:function(){
var _bd=this;
this.get("mngtApi").getGatewaySessions(function(_be){
var _bf,_c0,_c1,_c2,_c3;
CC.console.debug("GetGatewaySessions for "+_bd.getDebugIdStr()+"\n   returned "+_be.length+" current sessions");
_c1=(_be&&_be.length>0?_be[0].readTime:Date.now());
_c3={};
for(var i=0;i<_be.length;i++){
_c0=_be[i];
_bf=_c3[""+_c0.serviceId];
if(!_bf){
_bf={};
_c3[""+_c0.serviceId]=_bf;
}
_bf[""+_c0.sessionId]=_c0;
}
_c2=_bd.getServices();
_c2.forEach(function(_c5){
_bf=_c3[""+_c5.get("serviceId")];
_c5.updateSessionData(_bf,_c1);
});
invokeLater(function(){
_bd.onOpen12();
},0);
});
},onOpen12:function(){
this.processQueuedNotifications();
this.set("loginCompleted",true);
this.setGatewayState(_5c.AVAILABLE);
this.get("clusterModel").loginCompleted(this);
},shutDown:function(_c6){
if(!this.get("stopTime")){
CC.console.log("### Marking gateway instance at ["+this.get("connectionUrl")+" with instanceKey ["+this.get("instanceKey")+"] as shut down, at stop time "+_c6);
this.set("stopTime",_c6);
this.disconnect();
var _c7=this.get("dynamicDataModel");
if(_c7){
_c7.shutDown(_c6);
}
this.clearLoginLock();
this.clearStartConnectTimer();
this.resetStartConnectIndex();
}
},notificationCallback:function(_c8){
if(this.get("stopTime")){
return;
}
var _c9=_c8.type;
if(_c9===CC.Constants.NotificationType.MEMBERSHIP_CHANGE){
this.get("clusterModel").processMembershipChange(_c8);
}else{
if(_c9===CC.Constants.NotificationType.MANAGEMENT_SERVICE_CHANGE){
this.get("clusterModel").processManagementServiceChange(_c8);
}else{
if(_c9===CC.Constants.NotificationType.CONNECTION_LIMIT_CHANGE){
this.get("clusterModel").processConnectionLimitChange(_c8);
}else{
if(_c9===CC.Constants.NotificationType.BALANCER_MAP_CHANGE){
this.processBalancerMapChange(_c8);
}else{
_c8.gatewayModel=this;
if(!this.isAvailable()){
this.pushNotification(_c8);
}else{
this.processNotification(_c8);
}
}
}
}
}
},pushNotification:function(_ca){
this.get("notificationQueue").push(_ca);
},processLeave:function(_cb){
CC.console.log("### processLeave for gateway "+this.getDebugIdStr());
this.shutDown(_cb);
},processAddManagementService:function(_cc,_cd){
var _ce=this.get("connectionUrl");
var _cf=this.get("instanceKey");
if(_ce){
CC.console.log(this.getDebugIdStr()+" ignoring addManagementService for instanceKey "+_cf+" because connectionUrl is already set: "+_ce);
return;
}
if(!_cc){
CC.console.error(this.getDebugIdStr()+" adding management service for instanceKey "+_cf+" but it has no accepts!");
return;
}
_ce=null;
for(var i=0;i<_cc.length;i++){
var _d1=_cc[i];
if(_d1.startsWith("wss://")){
_ce=_d1;
break;
}else{
if(_d1.startsWith("ws://")){
_ce=_d1;
}
}
}
if(!_ce){
CC.console.warn(this.getDebugIdStr()+" Adding management service for instanceKey "+_cf+" but it has no WS:// or WSS:// accepts!");
return;
}
CC.console.info(this.getDebugIdStr()+" Adding management service for instance key "+_cf+", connectionUrl "+_ce);
this.set("canChangeUrl",false);
this.startFirstConnect(_ce);
},processRemoveManagementService:function(_d2,_d3){
},processBalancerMapChange:function(_d4){
},processNotification:function(_d5){
var _d6=_d5.type;
switch(_d6){
case CC.Constants.NotificationType.GATEWAY_SUMMARY:
this.get("dynamicDataModel").processNotification(_d5);
break;
case CC.Constants.NotificationType.SYSTEM_SUMMARY:
this.get("systemModel").processNotification(_d5);
break;
case CC.Constants.NotificationType.CPU_LIST_SUMMARY:
this.get("cpuListModel").processNotification(_d5);
break;
case CC.Constants.NotificationType.NIC_LIST_SUMMARY:
this.get("nicListModel").processNotification(_d5);
break;
case CC.Constants.NotificationType.JVM_SUMMARY:
this.get("jvmModel").processNotification(_d5);
break;
default:
var _d7=this.getService(_d5.serviceId);
if(_d7){
_d7.processNotification(_d5);
}else{
CC.console.error("#### Processing a service-or-session notification for:\n   "+this.getDebugIdStr()+",\n   "+"service ID "+_d5.serviceId+",\n   "+"session ID "+_d5.sessionId+",\n   "+"### SERVICE WAS NOT FOUND");
}
}
},processQueuedNotifications:function(){
var _d8=this;
var _d9=this.get("notificationQueue");
var _da=_d9.length;
CC.console.debug("Processing "+_da+" queued notifications for "+_d8.getDebugIdStr()+":");
if(_da>0){
while(_d9.length>0){
var _db=_d9.shift();
_d8.processNotification(_db);
}
CC.console.debug("Done processing queued notifications for "+this.getDebugIdStr());
}
},isConnecting:function(){
return this.get("gatewayState")===_5c.CONNECTING;
},isOpen:function(){
var _dc=this.get("mngtApi");
return (_dc!==null&&_dc.isOpen());
},isDisconnecting:function(){
return this.get("gatewayState")===_5c.DISCONNECTING;
},isAvailable:function(){
return this.get("gatewayState")===_5c.AVAILABLE;
},isAuthenticated:function(){
return this.get("authenticated");
},isUsable:function(){
return (this.get("loginCompleted")&&!this.get("stopTime")?true:false);
},setGatewayState:function(_dd){
var _de=this.get("gatewayState");
if(_de!==_dd){
CC.console.info("Marking gateway at ["+this.get("connectionUrl")+"], instanceKey ["+this.get("instanceKey")+"] as "+this.gatewayStateString(_dd));
this.set("gatewayState",_dd);
if(_dd===_5c.AVAILABLE){
this.fire(this.GATEWAY_AVAILABLE_EVENT,{gatewayModel:this});
}else{
if(_de===_5c.AVAILABLE){
this.fire(this.GATEWAY_UNAVAILABLE_EVENT,{gatewayModel:this});
}
}
}
},gatewayStateString:function(_df){
switch(_df){
case _5c.UNINITIALIZED:
return "UNINITIALIZED";
case _5c.DISCONNECTED:
return "DISCONNECTED";
case _5c.DISCONNECTING:
return "DISCONNECTING";
case _5c.CONNECTING:
return "CONNECTING";
case _5c.CONNECTED:
return "CONNECTED";
case _5c.AVAILABLE:
return "AVAILABLE";
default:
return "UNKNOWN";
}
},isCluster:function(){
var _e0=this.get("gatewayConfig");
if(!_e0){
return false;
}
var _e1=_e0.get("clusterConfig");
return (_e1!==undefined&&_e1!==null);
},isClusterPeer:function(){
return this.isCluster();
},getUniqueId:function(){
return this.get("gatewayLabel");
},onServiceModelAdd:function(ev){
ev.halt(true);
var _e3=ev.item;
if(_e3.name==="serviceModel"){
CC.console.debug("GatewayModel:onServiceModelAdd for service ID "+_e3.get("serviceId"));
this.fire(this.ADD_SERVICE_EVENT,{serviceModel:_e3});
}else{
CC.console.debug("GatewayModel:onServiceModelAdd - "+"ignoring mapModel:add event for item.name = "+_e3.name);
}
},onServiceModelRemove:function(ev){
ev.halt(true);
var _e5=ev.item;
if(_e5.name==="serviceModel"){
CC.console.debug("GatewayModel:onServiceModelRemove for service ID "+_e5.get("serviceId"));
this.fire(this.REMOVE_SERVICE_EVENT,{serviceModel:_e5});
}else{
CC.console.debug("GatewayModel:onServiceModelRemove - "+"ignoring mapModel:remove event for item.name = "+_e5.name);
}
},getService:function(_e6){
return this.get("serviceModels").getItem(_e6);
},getServices:function(){
var _e7=this.get("serviceModels").values();
return (_e7.length>0?_e7:null);
},getMembersList:function(){
var _e8=this.getServices();
var _e9=[];
if(_e8){
for(var i=0;i<_e8.length;i++){
_e9[i]=_e8[i].get("serviceLabel");
}
}
_e9.sort(function(a,b){
return compareStrings(a.toLowerCase(),b.toLowerCase());
});
return _e9;
},getLatestAcrossServices:function(_ed){
var arr=[];
var _ef=this.getServices();
if(_ef){
_ef.forEach(function(_f0){
arr.push(_f0.get(_ed));
});
}
return arr;
},summaryAttributeIndex:function(_f1,_f2){
var _f3=this.get("summaryDataDefinitions");
var _f4=_f3[_f1];
if(!_f4){
return -1;
}
return _f4.fields.indexOf(_f2);
},getSummaryDataDefinition:function(_f5){
var _f6=this.get("summaryDataDefinitions");
var _f7=_f6[_f5];
return _f7;
},getDebugIdStr:function(){
return "gateway ("+this.get("gatewayLabel")+")";
},getDynamicDataValue:function(_f8){
var _f9=this.get("dynamicDataModel");
return (_f9?_f9.getValue(_f8):null);
},getSystemDataValue:function(_fa){
var _fb=this.get("systemModel");
return (_fb?_fb.getValue(_fa):null);
},isManaged:function(){
return (this.get("connectionUrl")?true:false);
},dump:function(){
CC.console.debug("GatewayModel for GW "+this.getDebugIdStr());
var _fc=2;
dumpAttr(this,"gatewayState",_fc);
dumpAttr(this,"connectionUrl",_fc);
dumpAttr(this,"gatewayConfig",_fc);
dumpAttr(this,"hostAndPID",_fc);
dumpAttr(this,"startTime",_fc);
dumpAttr(this,"instanceKey",_fc);
dumpAttr(this,"upTime",_fc);
}},{ATTRS:{clusterModel:{value:null},loginProcessor:{value:null},credentials:{value:null},authenticated:{value:false},instanceKey:{value:""},createTime:{value:null},canChangeUrl:{value:false},gatewayState:{value:_5c.UNINITIALIZED},loginCompleted:{value:false},connectionUrl:{value:null},mngtApi:{value:null},notificationQueue:{value:[]},startConnectIndex:{value:0},startConnectTimerId:{value:null},gatewayConfig:{value:null},summaryDataDefinitions:{value:null},dynamicDataModel:{value:null},systemModel:{value:null},cpuListModel:{value:null},nicListModel:{value:null},jvmModel:{value:null},serviceModels:{valueFn:function(){
var ml=new Y.MapModel({model:Y.ServiceModel});
ml.modelName="ServiceModel";
return ml;
}},hostAndPID:{value:null},upTime:{value:null},startTime:{value:null},stopTime:{value:null},gatewayLabel:{getter:function(_fe,_ff){
var url=(this.get("connectionUrl")||this.get("instanceKey"));
var pos=url.indexOf("//");
if(pos>=0){
url=url.substring(pos+2);
}
pos=url.indexOf("/");
if(pos>=0){
url=url.substring(0,pos);
}
return url;
}},totalCurrentSessions:{getter:function(_102,_103){
var arr=this.getLatestAcrossServices("totalCurrentSessions");
var val=arr.reduce(function(prev,curr,_108,arr){
return (prev+(curr===null?0:curr));
},0);
return val;
}},totalBytesReceived:{getter:function(_10a,_10b){
var arr=this.getLatestAcrossServices("totalBytesReceived");
var val=arr.reduce(function(prev,curr,_110,arr){
return (prev+(curr===null?0:curr));
},0);
return val;
}},totalBytesSent:{getter:function(_112,_113){
var arr=this.getLatestAcrossServices("totalBytesSent");
var val=arr.reduce(function(prev,curr,_118,arr){
return (prev+(curr===null?0:curr));
},0);
return val;
}},readTime:{getter:function(_11a,_11b){
var _11c=this.getDynamicDataValue("readTime");
return (_11c?_11c:this.get("createTime"));
}},osName:{getter:function(_11d,_11e){
return this.getSystemDataValue(_11e);
}},uptimeSeconds:{getter:function(_11f,_120){
return this.getSystemDataValue(_120);
}},totalFreeMemory:{getter:function(_121,_122){
return this.getSystemDataValue(_122);
}},totalUsedMemory:{getter:function(_123,_124){
return this.getSystemDataValue(_124);
}},totalMemory:{getter:function(_125,_126){
return this.getSystemDataValue(_126);
}},totalFreeSwap:{getter:function(_127,_128){
return this.getSystemDataValue(_128);
}},totalUsedSwap:{getter:function(_129,_12a){
return this.getSystemDataValue(_12a);
}},totalSwap:{getter:function(_12b,_12c){
return this.getSystemDataValue(_12c);
}},freeMemoryPercentage:{getter:function(_12d,_12e){
return this.getSystemDataValue(_12e);
}},usedMemoryPercentage:{getter:function(_12f,_130){
return this.getSystemDataValue(_130);
}},freeSwapPercentage:{getter:function(_131,_132){
return this.getSystemDataValue(_132);
}},usedSwapPercentage:{getter:function(_133,_134){
return this.getSystemDataValue(_134);
}},cpuPercentage:{getter:function(_135,_136){
return this.getSystemDataValue(_136);
}}}});
},"0.99",{requires:["model","cluster-model","service-model","session-model","gateway-dynamic-data-model","gateway-cluster-data-model","jvm-model","system-model","cpu-list-model","nic-list-model"]});
YUI.add("service-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="serviceModel";
Y.ServiceModel=Y.Base.create(NAME,Y.Model,[],{ADD_SESSION_EVENT:NAME+":addSession",REMOVE_SESSION_EVENT:NAME+":removeSession",initializer:function(){
var _13a=this;
this.publish(this.ADD_SESSION_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.REMOVE_SESSION_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
var _13b=new Y.ServiceDynamicDataModel({serviceModel:this});
this.set("dynamicDataModel",_13b);
_13b.addTarget(this);
var _13c=this.get("sessionModels");
_13c.addTarget(this);
this.on(Y.MapModel.prototype.MAPMODEL_ADD_EVENT,this.onSessionAdd,this);
this.on(Y.MapModel.prototype.MAPMODEL_REMOVE_EVENT,this.onSessionRemove,this);
var _13d=this.get("gatewayModel");
_13d.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
},hasAttribute:function(_13e){
return Y.ServiceModel.ATTRS.hasOwnProperty(_13e);
},load:function(_13f){
this.get("dynamicDataModel").load(_13f);
},processNotification:function(_140){
var _141=_140.type;
switch(_141){
case CC.Constants.NotificationType.SERVICE_SUMMARY:
this.get("dynamicDataModel").processNotification(_140);
break;
case CC.Constants.NotificationType.SESSION_OPEN:
this.processSessionOpen(_140);
break;
case CC.Constants.NotificationType.SESSION_CLOSE:
this.processSessionClose(_140);
break;
case CC.Constants.NotificationType.CURRENT_SESSION_COUNT:
break;
case CC.Constants.NotificationType.TOTAL_SESSION_COUNT:
break;
default:
this.processSessionNotification(_140);
}
},processSessionOpen:function(_142){
var _143=_142.sessionId;
var _144=new Y.SessionModel({serviceModel:this,serviceId:this.get("serviceId"),sessionId:_143,sessionOpen:1,enableNotifications:0,startTime:_142.startTime,localAddress:_142.localAddress,remoteAddress:_142.remoteAddress,principals:_142.principals,sessionTypeName:_142.sessionTypeName,sessionDirection:_142.sessionDirection,extensions:_142.extensions,protocolVersion:_142.protocolVersion});
var _145=this.get("gatewayModel").getSummaryDataDefinition("session");
var _146=_145.fields.length-1;
var _147=[];
for(var i=0;i<_146;i++){
_147[i]=0;
}
_144.load({summaryData:_147});
var _149=this.get("sessionModels");
_149.putItem(_143,_144);
},processSessionClose:function(_14a){
var _14b=_14a.sessionId;
var _14c=_14a.readTime;
var _14d=this.getSession(_14b);
if(!_14d){
return;
}
_14d.close(_14c);
},processSessionNotification:function(_14e){
var _14f=this.getSession(_14e.sessionId);
if(_14f){
_14f.processNotification(_14e);
}else{
var _150=this.getServiceConfig();
}
},onSessionAdd:function(ev){
ev.halt(true);
var item=ev.item;
if(item.name==="sessionModel"){
this.fire(this.ADD_SESSION_EVENT,{sessionModel:item});
}else{
}
},onSessionRemove:function(ev){
ev.halt(true);
var item=ev.item;
if(item.name==="sessionModel"){
CC.console.debug("ServiceModel:onSessionRemove for session ID "+item.get("sessionId"));
CC.console.debug("### ServiceModel: firing "+this.REMOVE_SESSION_EVENT);
this.fire(this.REMOVE_SESSION_EVENT,{sessionModel:item});
}else{
CC.console.debug("ServiceModel:onSessionRemove - "+"ignoring mapModel:remove event for item.name = "+item.name);
}
},afterStopTimeChange:function(ev){
if(!this.get("stopTime")){
this.set("stopTime",ev.newVal);
}
},updateSessionData:function(_156,_157){
var _158=this.getSessions();
if(_158){
_158.forEach(function(_159){
var _15a=""+_159.get("sessionId");
var _15b=(_156&&_156[_15a]);
if(!_15b){
_159.close(_157);
}else{
_159.load(_15b);
delete _156[_15a];
}
});
}
if(_156){
for(var _15c in _156){
if(_156.hasOwnProperty(_15c)){
this.storeGatewaySession(_156[_15c]);
}
}
}
},storeGatewaySession:function(_15d){
var _15e=this;
var _15f=_15d.sessionId;
var _160=_15e.get("sessionModels");
var _161=_160.getItem(_15f);
if(!_161){
_161=new Y.SessionModel({serviceModel:this,serviceId:_15d.serviceId,sessionId:_15f,sessionOpen:_15d.sessionOpen,enableNotifications:_15d.enableNotifications,startTime:_15d.startTime,localAddress:_15d.localAddress,remoteAddress:_15d.remoteAddress,principals:(_15d.principals?parseJSON(_15d.principals):null),sessionTypeName:_15d.sessionTypeName,sessionDirection:_15d.sessionDirection,});
_161.load(_15d);
_160.putItem(_15f,_161);
}else{
_161.load(_15d);
}
},getSession:function(_162){
return this.get("sessionModels").getItem(_162);
},getSessions:function(){
var _163=this.get("sessionModels").values();
return (_163.length>0?_163:null);
},dumpSessionModels:function(){
CC.console.debug(this.getDebugIdStr());
var _164=this.get("sessionModels").values();
if(_164.length>0){
for(var i=0;i<_164.length;i++){
var _166=_164[i];
CC.console.debug("   Session id: "+_166.get("sessionId")+", "+(_166.get("sessionOpen")===0?"CLOSED":"OPEN"));
}
}else{
CC.console.debug("   Has no sessions");
}
},getDebugIdStr:function(){
var _167=this.get("serviceId");
var _168=this.get("gatewayModel");
var _169=_168.get("gatewayConfig");
var _16a=_169.getServiceConfig(_167);
return _168.getDebugIdStr()+",\n   service (ID: "+_167+", name: '"+_16a.get("name")+"', type: '"+_16a.get("type")+"')";
},getServiceConfig:function(){
return this.get("gatewayModel").get("gatewayConfig").getServiceConfig(this.get("serviceId"));
},isBalanced:function(){
var _16b=this.getServiceConfig();
return (_16b!==null&&_16b.isBalanced());
},getDynamicDataValue:function(_16c){
return this.get("dynamicDataModel").getValue(_16c);
},dump:function(){
CC.console.debug("ServiceModel for gateway "+this.get("gatewayModel").getDebugIdStr());
var _16d=2;
dumpAttr(this,"serviceId",_16d);
dumpValue("serviceConfig",this.get("gatewayModel").get("gatewayConfig").getServiceConfig(this.get("serviceId")));
dumpSessionModels();
}},{ATTRS:{gatewayModel:{value:null},dynamicDataModel:{value:null},serviceId:{value:null},sessionModels:{valueFn:function(){
var ml=new Y.MapModel({model:Y.SessionModel});
ml.modelName="SessionModel";
return ml;
}},gatewayLabel:{getter:function(_16f,_170){
return this.get("gatewayModel").get("gatewayLabel");
}},startTime:{value:null},stopTime:{value:null},serviceLabel:{getter:function(){
var _171=this.getServiceConfig();
var name=_171.get("name");
if(name&&name.trim()!=""){
return name.trim();
}else{
var type=_171.get("type");
var _174=this.get("serviceId");
return "Id "+_174+" ("+type+")";
}
}},state:{getter:function(_175,_176){
return this.getDynamicDataValue("state");
}},serviceConnected:{getter:function(_177,_178){
return this.getDynamicDataValue("serviceConnected");
}},totalBytesReceived:{getter:function(_179,_17a){
return this.getDynamicDataValue("totalBytesReceived");
}},totalBytesReceivedThroughput:{getter:function(_17b,_17c){
return this.getDynamicDataValue("totalBytesReceivedThroughput");
}},totalBytesSent:{getter:function(_17d,_17e){
return this.getDynamicDataValue("totalBytesSent");
}},totalBytesSentThroughput:{getter:function(_17f,_180){
return this.getDynamicDataValue("totalBytesSentThroughput");
}},totalCurrentSessions:{getter:function(_181,_182){
var _183=this.getDynamicDataValue("totalCurrentSessions");
return _183;
}},totalCurrentNativeSessions:{getter:function(_184,_185){
return this.getDynamicDataValue("totalCurrentNativeSessions");
}},totalCurrentEmulatedSessions:{getter:function(_186,_187){
return this.getDynamicDataValue("totalCurrentEmulatedSessions");
}},totalCumulativeSessions:{getter:function(_188,_189){
return this.getDynamicDataValue("totalCumulativeSessions");
}},totalCumulativeNativeSessions:{getter:function(_18a,_18b){
return this.getDynamicDataValue("totalCumulativeNativeSessions");
}},totalCumulativeEmulatedSessions:{getter:function(_18c,_18d){
return this.getDynamicDataValue("totalCumulativeEmulatedSessions");
}},totalExceptionCount:{getter:function(_18e,_18f){
return this.getDynamicDataValue("totalExceptionCount");
}},latestException:{getter:function(_190,_191){
return this.getDynamicDataValue("latestException");
}},latestExceptionTime:{getter:function(_192,_193){
return this.getDynamicDataValue("latestExceptionTime");
}},lastSuccessfulConnectTime:{getter:function(_194,_195){
return this.getDynamicDataValue("lastSuccessfulConnectTime");
}},lastFailedConnectTime:{getter:function(_196,_197){
return this.getDynamicDataValue("lastFailedConnectTime");
}},lastHeartbeatPingResult:{getter:function(_198,_199){
return this.getDynamicDataValue("lastHeartbeatPingResult");
}},lastHeartbeatPingTimestamp:{getter:function(_19a,_19b){
return this.getDynamicDataValue("lastHeartbeatPingTimestamp");
}},heartbeatPingCount:{getter:function(_19c,_19d){
return this.getDynamicDataValue("heartbeatPingCount");
}},heartbeatPingSuccesses:{getter:function(_19e,_19f){
return this.getDynamicDataValue("heartbeatPingSuccesses");
}},heartbeatPingFailures:{getter:function(_1a0,_1a1){
return this.getDynamicDataValue("heartbeatPingFailures");
}},heartbeatRunning:{getter:function(_1a2,_1a3){
return this.getDynamicDataValue("heartbeatRunning");
}},enableNotifications:{getter:function(_1a4,_1a5){
return this.getDynamicDataValue("enableNotifications");
}},loggedInSessions:{getter:function(_1a6,_1a7){
return this.getDynamicDataValue("loggedInSessions");
}},readTime:{getter:function(_1a8,_1a9){
return this.getDynamicDataValue("readTime");
}}}});
},"0.99",{requires:["model","gateway-model","session-model","service-dynamic-data-model"]});
YUI.add("session-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="sessionModel";
Y.SessionModel=Y.Base.create(NAME,Y.Model,[],{CLOSE_SESSION_EVENT:NAME+":closeSession",initializer:function(){
this.publish(this.CLOSE_SESSION_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.formatRemoteAddress();
var _1ad=new Y.SessionDynamicDataModel({sessionModel:this});
this.set("dynamicDataModel",_1ad);
_1ad.addTarget(this);
var _1ae=this.get("serviceModel");
_1ae.after("serviceModel:stopTimeChange",this.afterStopTimeChange,this);
},formatRemoteAddress:function(){
var _1af=this.get("remoteAddress");
if(_1af&&_1af.length>0){
if(_1af.startsWith("[")){
_1af=_1af.substring(1,_1af.length-1);
}
var _1b0=_1af.indexOf("?");
if(_1b0>0){
_1af=_1af.substring(0,_1b0);
}
}else{
_1af="";
}
this.set("remoteAddress",_1af);
},afterStopTimeChange:function(ev){
if(!this.get("stopTime")){
this.set("stopTime",ev.newVal);
}
},formatStartTime:function(){
},hasAttribute:function(_1b2){
return Y.SessionModel.ATTRS.hasOwnProperty(_1b2);
},load:function(_1b3){
this.get("dynamicDataModel").load(_1b3);
},close:function(_1b4){
this.set("sessionOpen",0);
this.set("stopTime",_1b4);
this.fire(this.CLOSE_SESSION_EVENT,{sessionModel:this});
},startClose:function(){
var _1b5=this.get("serviceModel");
if(!_1b5){
return;
}
var _1b6=_1b5.get("gatewayModel");
if(!_1b6){
return;
}
var _1b7=_1b6.get("mngtApi");
_1b7.closeSession(_1b5.get("serviceId"),this.get("sessionId"));
},processNotification:function(_1b8){
var _1b9=_1b8.type;
switch(_1b9){
case CC.Constants.NotificationType.SESSION_SUMMARY:
this.get("dynamicDataModel").processNotification(_1b8);
break;
default:
}
},getUptime:function(){
var _1ba=this.get("startTime");
var _1bb=this.get("stopTime");
if(!_1bb){
_1bb=this.get("readTime");
}
if(!_1bb){
_1bb=(new Date()).getTime();
}
return _1bb-_1ba;
},getGatewayModel:function(){
var _1bc=this.get("serviceModel");
return (_1bc?_1bc.get("gatewayModel"):null);
},getDebugIdStr:function(){
return this.get("serviceModel").getDebugIdStr()+",\n   session (ID: "+this.get("sessionId")+")";
},getDynamicDataValue:function(_1bd){
return this.get("dynamicDataModel").getValue(_1bd);
}},{ATTRS:{serviceModel:{value:null},dynamicDataModel:{value:null},serviceId:{value:null},sessionId:{value:null},sessionOpen:{value:null},enableNotifications:{value:null},startTime:{value:null},stopTime:{value:null},localAddress:{value:null},remoteAddress:{value:null},principals:{value:null},sessionTypeName:{value:null},sessionDirection:{value:null},extensions:{value:null},protocolVersion:{value:null},mark:{value:false},action:{getter:function(_1be,_1bf){
var _1c0=this.get("serviceModel");
var _1c1=_1c0.get("gatewayModel");
return "<button type=\"button\" class=\"goButton\""+"instanceKey=\""+_1c1.get("instanceKey")+"\" "+"serviceId=\""+_1c0.get("serviceId")+"\" "+"sessionId=\""+this.get("sessionId")+"\" "+"></button>";
}},gatewayLabel:{getter:function(_1c2,_1c3){
var _1c4=this.get("serviceModel");
return _1c4.get("gatewayLabel");
}},serviceLabel:{getter:function(_1c5,_1c6){
var _1c7=this.get("serviceModel");
return _1c7.get("serviceLabel");
}},uptime:{getter:function(_1c8,_1c9){
return this.getUptime();
}},readBytes:{getter:function(_1ca,_1cb){
return this.getDynamicDataValue(_1cb);
}},readBytesThroughput:{getter:function(_1cc,_1cd){
return this.getDynamicDataValue(_1cd);
}},writtenBytes:{getter:function(_1ce,_1cf){
return this.getDynamicDataValue(_1cf);
}},writtenBytesThroughput:{getter:function(_1d0,_1d1){
return this.getDynamicDataValue(_1d1);
}},readTime:{getter:function(_1d2,_1d3){
return this.getDynamicDataValue(_1d3);
}},state:{getter:function(_1d4,_1d5){
var _1d6=this.get("sessionOpen");
return (_1d6===1?"Open":"Closed");
}}}});
},"0.99",{requires:["model","gateway-model","service-model","session-dynamic-data-model"]});
YUI.add("cluster-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="clusterConfigModel";
Y.ClusterConfigModel=Y.Base.create(NAME,Y.Model,[],{hasAttribute:function(_1da){
return Y.ClusterConfigModel.ATTRS.hasOwnProperty(_1da);
},initializer:function(){
},dump:function(){
CC.console.debug("ClusterConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _1db=2;
dumpAttr(this,"name",_1db);
dumpAttr(this,"accepts",_1db);
dumpAttr(this,"connects",_1db);
dumpAttr(this,"connectOptions",_1db);
}},{ATTRS:{gatewayModel:{value:null},name:{value:null},accepts:{value:null},connects:{value:null},connectOptions:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("cpu-list-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="cpuListModel";
Y.CpuListModel=Y.Base.create(NAME,Y.Model,[],{dataDefinition:null,UPDATE_EVENT:NAME+":update",initializer:function(){
var _1df=this.get("gatewayModel").getSummaryDataDefinition("cpuList");
this.dataDefinition=_1df;
this.publish(this.UPDATE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
},hasAttribute:function(_1e0){
if(_1e0=="numCpus"){
return true;
}
return (this._getAttributeIndex(_1e0)>=0);
},getValue:function(_1e1,_1e2,_1e3){
if(_1e2=="numCpus"){
var _1e4=this.get("numCpus");
return (_1e3?[CC.Constants.CONSTANT_TIME,_1e4]:_1e4);
}
var _1e5=this._getAttributeIndex(_1e2);
if(_1e5<0){
return undefined;
}
var data=this.get("data");
if(!data){
return null;
}
var val=data[_1e1][_1e5];
if(typeOf(val)=="function"){
val=val();
}
return (_1e3?[this.getReadTime(),val]:val);
},getReadTime:function(){
var data=this.get("data");
if(!data||data.length==0){
return 0;
}
return data[data.length-1];
},load:function(_1e9){
if(_1e9){
this.set("numCpus",_1e9.numCpus);
this.loadSummaryData(_1e9.summaryData);
}
},loadSummaryData:function(_1ea){
if(_1ea&&_1ea.length>0){
var _1eb=this.getReadTime();
var _1ec=this.get("numCpus");
for(var i=0;i<_1ea.length;i++){
var item=_1ea[i];
var _1ef=item.cpuData;
var _1f0=item.readTime;
if(_1ef==null||_1ef==undefined){
continue;
}
for(var cpu=0;cpu<_1ef.length;cpu++){
_1ef[cpu].push(_1f0);
}
if(_1f0>_1eb){
_1eb=_1f0;
this.set("data",_1ef);
}
this.fire(this.UPDATE_EVENT,{model:this,data:_1ef});
}
}
},processNotification:function(_1f2){
this.loadSummaryData(_1f2.value);
},_getAttributeIndex:function(_1f3){
var _1f4=this.dataDefinition.fields.indexOf(_1f3);
return _1f4;
}},{ATTRS:{gatewayModel:{value:null},numCpus:{value:null},data:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("gateway-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="gatewayConfigModel";
Y.GatewayConfigModel=Y.Base.create(NAME,Y.Model,[],{hasAttribute:function(_1f8){
return Y.GatewayConfigModel.ATTRS.hasOwnProperty(_1f8);
},initializer:function(){
var _1f9=this.get("gatewayModel");
var _1fa=this.get("clusterConfig");
if(_1fa){
_1fa.gatewayModel=_1f9;
this.set("clusterConfig",new Y.ClusterConfigModel(_1fa));
}
var _1fb=this.get("licensesConfig");
if(_1fb){
_1fb.gatewayModel=_1f9;
this.set("licensesConfig",new Y.LicensesConfigModel(_1fb));
}
var _1fc=this.get("networkConfig");
if(_1fc){
_1fc.gatewayModel=_1f9;
this.set("networkConfig",new Y.NetworkConfigModel(_1fc));
}
var _1fd=this.get("securityConfig");
if(_1fd){
_1fd.gatewayModel=_1f9;
this.set("securityConfig",new Y.SecurityConfigModel(_1fd));
_1fd=this.get("securityConfig");
}
var _1fe=this.get("serviceDefaultsConfig");
if(_1fe){
_1fe.gatewayModel=_1f9;
this.set("serviceDefaultsConfig",new Y.ServiceDefaultsConfigModel(_1fe));
}
var _1ff=this.get("serviceConfigs");
if(_1ff){
if(_1ff.length===0){
this.set("serviceConfigs",null);
}else{
var _200=_1fd.get("realmConfigs");
for(var i=0;i<_1ff.length;i++){
var _202=_1ff[i];
_202.gatewayModel=_1f9;
_1ff[i]=new Y.ServiceConfigModel(_202);
var _203=(_200?_200[_1ff[i].get("realm")]:null);
_1ff[i].set("realm",_203);
if(_203){
_203.addServiceConfig(_1ff[i]);
}
}
this.set("serviceConfigs",_1ff);
}
}
},getServiceConfig:function(_204){
var _205=this.get("serviceConfigs");
if(_205){
for(var i=0;i<_205.length;i++){
var _207=_205[i];
if(_207.get("serviceId")===_204){
return _207;
}
}
}
return null;
},getRealmConfig:function(_208){
var _209=this.get("securityConfig");
return (_209?_209.getRealmConfig(_208):null);
},dump:function(){
CC.console.debug("GatewayConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _20a=2;
dumpAttr(this,"productTitle",_20a);
dumpAttr(this,"productVersionBuild",_20a);
dumpAttr(this,"productEdition",_20a);
dumpAttr(this,"clusterConfig",_20a);
dumpAttr(this,"licensesConfig",_20a);
dumpAttr(this,"networkConfig",_20a);
dumpAttr(this,"securityConfig",_20a);
dumpAttr(this,"serviceDefaultsConfig",_20a);
dumpAttr(this,"serviceConfigs",_20a);
dumpAttr(this,"readTime",_20a);
}},{ATTRS:{gatewayModel:{value:null},productTitle:{value:null},productVersionBuild:{value:null},productEdition:{value:null},clusterConfig:{value:null},licensesConfig:{value:null},networkConfig:{value:null},securityConfig:{value:null},serviceDefaultsConfig:{value:null},serviceConfigs:{value:null},readTime:{value:null}}});
},"0.99",{requires:["model","cluster-config-model","licenses-config-model","network-config-model","security-config-model","service-config-model","service-defaults-config-model","gateway-model"]});
YUI.add("gateway-dynamic-data-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="gatewayDynamicDataModel";
Y.GatewayDynamicDataModel=Y.Base.create(NAME,Y.Model,[],{dataDefinition:null,UPDATE_EVENT:NAME+":update",readTimeIndex:-1,initializer:function(){
var _20e=this.get("gatewayModel").getSummaryDataDefinition("gateway");
this.dataDefinition=_20e;
this.readTimeIndex=this._getAttributeIndex("readTime");
this.publish(this.UPDATE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
},hasAttribute:function(_20f){
return (this._getAttributeIndex(_20f)>=0);
},getValue:function(_210,_211){
var _212=this._getAttributeIndex(_210);
if(_212<0){
return undefined;
}
var data=this.get("data");
if(!data){
return null;
}
var val=data[_212];
if(typeOf(val)=="function"){
val=val();
}
return (_211?[this.getReadTime(),val]:val);
},getReadTime:function(){
var data=this.get("data");
return data[data.length-1];
},load:function(_216){
var _217=_216.summaryData;
_217.push(_216.readTime);
this.loadSummaryData(_217);
},loadSummaryData:function(_218){
var data=this.get("data");
if(!data||data[this.readTimeIndex]!==_218[this.readTimeIndex]){
this.set("data",_218);
this.fire(this.UPDATE_EVENT,{model:this,data:_218});
}
},processNotification:function(_21a){
var _21b=_21a.value;
var _21c=_21a.readTime;
_21b.push(_21c);
this.loadSummaryData(_21b);
},shutDown:function(_21d){
var data=this.get("data");
if(data&&data[this.readTimeIndex]===_21d){
return;
}
if(!data){
data=[];
var _21f=this.dataDefinition.fields.length;
for(var i=0;i<_21f;i++){
data[i]=0;
}
}else{
data=data.slice();
data[this._getAttributeIndex("totalCurrentSessions")]=0;
}
data[this.readTimeIndex]=_21d;
this.loadSummaryData(data);
},_getAttributeIndex:function(_221){
var _222=this.dataDefinition.fields.indexOf(_221);
return _222;
}},{ATTRS:{gatewayModel:{value:null},data:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("jvm-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="jvmModel";
Y.JvmModel=Y.Base.create(NAME,Y.Model,[],{dataDefinition:null,UPDATE_EVENT:NAME+":update",initializer:function(){
var _226=this.get("gatewayModel").getSummaryDataDefinition("jvm");
this.dataDefinition=_226;
this.publish(this.UPDATE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
},hasAttribute:function(_227){
return (this._getAttributeIndex(_227)>=0);
},getValue:function(_228,_229){
var _22a=this._getAttributeIndex(_228);
if(_22a<0){
return undefined;
}
var data=this.get("data");
if(!data){
return null;
}
var val=data[_22a];
if(typeOf(val)=="function"){
val=val();
}
return (_229?[this.getReadTime(),val]:val);
},getReadTime:function(){
var data=this.get("data");
if(!data||data.length==0){
return 0;
}
return data[data.length-1];
},load:function(_22e){
this.loadSummaryData(_22e["summaryData"]);
},loadSummaryData:function(_22f){
if(_22f&&_22f.length>0){
var _230=this.getReadTime();
for(var i=0;i<_22f.length;i++){
var item=_22f[i];
var _233=item.jvmData;
var _234=item.readTime;
if(_233==null||_233==undefined){
continue;
}
_233.push(_234);
if(_234>_230){
_230=_234;
this.set("data",_233);
}
this.fire(this.UPDATE_EVENT,{model:this,data:_233});
}
}
},processNotification:function(_235){
this.loadSummaryData(_235.value);
},_getAttributeIndex:function(_236){
var _237=this.dataDefinition.fields.indexOf(_236);
return _237;
}},{ATTRS:{gatewayModel:{value:null},data:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("license-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="licenseConfigModel";
Y.LicenseConfigModel=Y.Base.create(NAME,Y.Model,[],{hasAttribute:function(_23b){
return Y.LicenseConfigModel.ATTRS.hasOwnProperty(_23b);
},initializer:function(){
},sortCompare:function(_23c){
var _23d=compareStrings(this.get("productName"),_23c.get("productName"));
if(_23d!=0){
return _23d;
}
_23d=compareStrings(this.get("productVersion"),_23c.get("productVersion"));
if(_23d!=0){
return _23d;
}
_23d=compareNumbers(this.get("issueDate"),_23c.get("issueDate"));
if(_23d!=0){
return _23d;
}
return 0;
},equals:function(_23e){
if(!_23e){
return false;
}
if(this===_23e){
return true;
}
if(!equalModelStrings(_23e.get("name"),this.get("name"))){
return false;
}
if(!equalModelStrings(_23e.get("company"),this.get("company"))){
return false;
}
if(!equalModelStrings(_23e.get("email"),this.get("email"))){
return false;
}
if(!equalModelNumbers(_23e.get("issueDate"),this.get("issueDate"))){
return false;
}
if(!equalModelStrings(_23e.get("productName"),this.get("productName"))){
return false;
}
if(!equalModelStrings(_23e.get("productVersion"),this.get("productVersion"))){
return false;
}
if(!equalModelStrings(_23e.get("licenseType"),this.get("licenseType"))){
return false;
}
if(!equalModelNumbers(_23e.get("nodeLimit"),this.get("nodeLimit"))){
return false;
}
if(!equalModelNumbers(_23e.get("notValidBeforeDate"),this.get("notValidBeforeDate"))){
return false;
}
if(!equalModelNumbers(_23e.get("notValidAfterDate"),this.get("notValidAfterDate"))){
return false;
}
return true;
},dump:function(){
CC.console.debug("LicenseConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _23f=2;
dumpAttr(this,"name",_23f);
dumpAttr(this,"company",_23f);
dumpAttr(this,"email",_23f);
dumpAttr(this,"issueDate",_23f);
dumpAttr(this,"productName",_23f);
dumpAttr(this,"productVersion",_23f);
dumpAttr(this,"licenseType",_23f);
dumpAttr(this,"nodeLimit",_23f);
dumpAttr(this,"notValidBeforeDate",_23f);
dumpAttr(this,"notValidAfterDate",_23f);
}},{ATTRS:{licensesConfigModel:{value:null},name:{value:null},company:{value:null},email:{value:null},issueDate:{value:null},productName:{value:null},productVersion:{value:null},licenseType:{value:null},nodeLimit:{value:null},notValidBeforeDate:{value:null},notValidAfterDate:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("licenses-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="licensesConfigModel";
Y.LicensesConfigModel=Y.Base.create(NAME,Y.Model,[],{hasAttribute:function(_243){
return Y.LicensesConfigModel.ATTRS.hasOwnProperty(_243);
},initializer:function(){
var _244=this;
var _245=this.get("licenses");
if(_245){
_245.forEach(function(val,_247,arr){
val.licensesConfigModel=_244;
arr[_247]=new Y.LicenseConfigModel(val);
});
_245.sort(function(l1,l2){
function compareField(_24b){
var f1=l1.get(_24b);
var f2=l2.get(_24b);
if(f1===undefined||f1===null){
return (f2===undefined||f2===null?0:1);
}else{
if(f2===undefined||f2===null){
return -1;
}else{
if(f1===f2){
return 0;
}else{
return (f1<f2?-1:1);
}
}
}
};
var _24e=["name","company","productName","productVersion","licenseType","issueDate","nodeLimit","notValidBeforeDate","notValidAfterDate"];
for(var i=0;i<_24e.length;i++){
var v=compareField(_24e[i]);
if(v!=0){
return v;
}
}
return 0;
});
}
},equals:function(_251){
if(!_251){
return false;
}
if(this===_251){
return true;
}
if(!equalModelNumbers(licenseConfig.get("connectionSoftLimit"),this.get("connectionSoftLimit"))){
return false;
}
if(!equalModelNumbers(licenseConfig.get("connectionHardLimit"),this.get("connectionHardLimit"))){
return false;
}
if(!equalModelStrings(licenseConfig.get("allowedServices"),this.get("allowedServices"))){
return false;
}
return true;
},dump:function(){
CC.console.debug("LicenseConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _252=2;
dumpAttr(this,"licenses",_252);
dumpAttr(this,"connectionSoftLimit",_252);
dumpAttr(this,"connectionHardLimit",_252);
dumpAttr(this,"allowedServices",_252);
}},{ATTRS:{gatewayModel:{value:null},licenses:{value:null},connectionSoftLimit:{value:null},connectionHardLimit:{value:null},allowedServices:{value:null}}});
},"0.99",{requires:["model","gateway-model","license-config-model"]});
YUI.add("list-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="listModel";
Y.ListModel=Y.Base.create(NAME,Y.Model,[],{LISTMODEL_ADD_EVENT:"listModel:add",LISTMODEL_REMOVE_EVENT:"listModel:remove",initializer:function(){
var _256=this;
_256.publish(_256.LISTMODEL_ADD_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
_256.publish(_256.LISTMODEL_REMOVE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
_256.items=[];
},add:function(_257){
this.items.push(_257);
this.fire(this.LISTMODEL_ADD_EVENT,{item:_257});
return _257;
},remove:function(_258){
var _259=this.items;
var _25a=_259.indexOf(_258);
if(_25a>=0){
_259.splice(_25a,1);
this.fire(this.LISTMODEL_REMOVE_EVENT,{item:_258});
}
},item:function(_25b){
return this.items[_25b];
},size:function(){
return this.items.length;
},values:function(){
var _25c=this.items;
var vals=_25c.slice(0);
return vals;
},filter:function(fn){
var _25f=this.items;
var vals=[];
if(_25f){
_25f.forEach(function(item){
if(fn(item)){
vals.push(item);
}
});
}
return vals;
}},{ATTRS:{}});
},"0.99",{requires:["model"]});
YUI.add("network-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="networkConfigModel";
Y.NetworkConfigModel=Y.Base.create(NAME,Y.Model,[],{hasAttribute:function(_265){
return Y.NetworkConfigModel.ATTRS.hasOwnProperty(_265);
},initializer:function(){
},dump:function(){
CC.console.debug("NetworkConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _266=2;
dumpAttr(this,"addressMappings",_266);
}},{ATTRS:{gatewayModel:{value:null},addressMappings:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("nic-list-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="nicListModel";
Y.NicListModel=Y.Base.create(NAME,Y.Model,[],{dataDefinition:null,UPDATE_EVENT:NAME+":update",initializer:function(){
var _26a=this.get("gatewayModel").getSummaryDataDefinition("nicList");
this.dataDefinition=_26a;
this.publish(this.UPDATE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
},hasAttribute:function(_26b){
if(_26b=="netInterfaceNames"){
return true;
}
return (this._getAttributeIndex(_26b)>=0);
},getValue:function(_26c,_26d,_26e){
if(_26d=="netInterfaceNames"){
var _26f=this.get("netInterfaceNames");
return (_26e?[CC.Constants.CONSTANT_TIME,_26f]:_26f);
}
var _270=this._getAttributeIndex(_26d);
if(_270<0){
return undefined;
}
var data=this.get("data");
if(!data){
return null;
}
var val=data[_26c][_270];
if(typeOf(val)=="function"){
val=val();
}
return (_26e?[this.getReadTime(),val]:val);
},getReadTime:function(){
var data=this.get("data");
if(!data||data.length==0){
return 0;
}
return data[data.length-1];
},load:function(_274){
this.set("netInterfaceNames",_274["netInterfaceNames"]);
this.loadSummaryData(_274["summaryData"]);
},loadSummaryData:function(_275){
if(_275&&_275.length>0){
var _276=this.getReadTime();
var _277=this.get("netInterfaceNames");
for(var i=0;i<_275.length;i++){
var item=_275[i];
var _27a=item.nicData;
var _27b=item.readTime;
if(_27a==null||_27a==undefined){
continue;
}
for(var j=0;j<_277.length;j++){
_27a[j].push(_27b);
}
if(_27b>_276){
_276=_27b;
this.set("data",_27a);
}
this.fire(this.UPDATE_EVENT,{model:this,data:_27a});
}
}
},processNotification:function(_27d){
this.loadSummaryData(_27d.value);
},_getAttributeIndex:function(_27e){
var _27f=this.dataDefinition.fields.indexOf(_27e);
return _27f;
}},{ATTRS:{gatewayModel:{value:null},netInterfaceNames:{value:null},data:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("realm-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="realmConfigModel";
Y.RealmConfigModel=Y.Base.create(NAME,Y.Model,[],{hasAttribute:function(_283){
return Y.RealmConfigModel.ATTRS.hasOwnProperty(_283);
},initializer:function(){
var _284=this.get("loginModules");
if(_284){
for(var i=0;i<_284.length;i++){
var _286=_284[i];
var _287=_286.options;
if(_287){
delete _287["GATEWAY_CONFIG_DIRECTORY"];
}
}
this.set("loginModules",_284);
}
},dump:function(){
CC.console.debug("SecurityConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _288=2;
dumpAttr(this,"name",_288);
dumpAttr(this,"description",_288);
dumpAttr(this,"httpChallengeScheme",_288);
dumpAttr(this,"authorizationMode",_288);
dumpAttr(this,"authorizationTimeout",_288);
dumpAttr(this,"sessionTimeout",_288);
dumpAttr(this,"userPrincipalClasses",_288);
dumpAttr(this,"httpCookieNames",_288);
dumpAttr(this,"httpHeaders",_288);
dumpAttr(this,"httpQueryParams",_288);
dumpAttr(this,"loginModules",_288);
},equals:function(_289){
if(!_289){
return false;
}
if(this===_289){
return true;
}
if(!equalModelStrings(_289.get("name"),this.get("name"))){
return false;
}
if(!equalModelStrings(_289.get("description"),this.get("description"))){
return false;
}
if(!equalModelStrings(_289.get("httpChallengeScheme"),this.get("httpChallengeScheme"))){
return false;
}
if(!equalModelStrings(_289.get("authorizationMode"),this.get("authorizationMode"))){
return false;
}
if(!equalModelNumbers(_289.get("authorizationTimeout"),this.get("authorizationTimeout"))){
return false;
}
if(!equalModelNumbers(_289.get("sessionTimeout"),this.get("sessionTimeout"))){
return false;
}
if(!equalModelArrays(_289.get("userPrincipalClasses"),this.get("userPrincipalClasses"))){
return false;
}
if(!equalModelArrays(_289.get("httpCookieNames"),this.get("httpCookieNames"))){
return false;
}
if(!equalModelArrays(_289.get("httpHeaders"),this.get("httpHeaders"))){
return false;
}
if(!equalModelArrays(_289.get("httpQueryParams"),this.get("httpQueryParams"))){
return false;
}
if(!equalModelArrays(_289.get("loginModules"),this.get("loginModules"))){
return false;
}
return true;
},sortCompare:function(scm){
var _28b=this.get("name");
var _28c=scm.get("name");
_28b=_28b.toLowerCase();
_28c=_28c.toLowerCase();
if(_28b<_28c){
return -1;
}else{
if(_28b>_28c){
return 1;
}else{
return 0;
}
}
},addServiceConfig:function(_28d){
this.get("serviceConfigs").push(_28d);
}},{ATTRS:{gatewayModel:{value:null},name:{value:null},description:{value:null},httpChallengeScheme:{value:null},authorizationMode:{value:null},authorizationTimeout:{value:null},sessionTimeout:{value:null},userPrincipalClasses:{value:null},httpCookieNames:{value:null},httpHeaders:{value:null},httpQueryParams:{value:null},loginModules:{value:null},serviceConfigs:{value:[]}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("security-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="securityConfigModel";
Y.SecurityConfigModel=Y.Base.create(NAME,Y.Model,[],{hasAttribute:function(_291){
return Y.SecurityConfigModel.ATTRS.hasOwnProperty(_291);
},initializer:function(){
var _292=this.get("realmConfigs");
if(_292){
if(_292.length===0){
this.set("realmConfigs",null);
}else{
var _293=this.get("gatewayModel");
var _294={};
for(var i=0;i<_292.length;i++){
var _296=_292[i];
_296.gatewayModel=_293;
_296=new Y.RealmConfigModel(_296);
_294[_296.get("name")]=_296;
}
this.set("realmConfigs",_294);
}
}
},equalsKeystoreInfo:function(_297){
if(!_297){
return false;
}
if(this===_297){
return true;
}
if(!equalModelStrings(_297.get("keystoreType"),this.get("keystoreType"))){
return false;
}
return true;
},sortCompareKeystore:function(_298){
if(!_298){
return -1;
}
var val;
val=compareStrings(this.get("keystoreType"),_298.get("keystoreType"));
if(val!=0){
return val;
}
return 0;
},equalsTruststoreInfo:function(_29a){
if(!_29a){
return false;
}
if(this===_29a){
return true;
}
if(!equalModelStrings(_29a.get("truststoreType"),this.get("truststoreType"))){
return false;
}
return true;
},sortCompareTruststore:function(_29b){
if(!_29b){
return -1;
}
var val;
val=compareStrings(this.get("truststoreType"),_29b.get("truststoreType"));
if(val!=0){
return val;
}
return 0;
},getRealmConfig:function(_29d){
var _29e=this.get("realmConfigs");
return (_29e?_29e[_29d]:null);
},dump:function(){
CC.console.debug("SecurityConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _29f=2;
dumpAttr(this,"keystoreType",_29f);
dumpAttr(this,"keystoreCertificateInfo",_29f);
dumpAttr(this,"truststoreType",_29f);
dumpAttr(this,"truststoreCertificateInfo",_29f);
dumpAttr(this,"realmConfigs",_29f);
}},{ATTRS:{gatewayModel:{value:null},keystoreType:{value:null},keystoreCertificateInfo:{value:null},truststoreType:{value:null},truststoreCertificateInfo:{value:null},realmConfigs:{value:null}}});
},"0.99",{requires:["model","gateway-model","realm-config-model"]});
YUI.add("service-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="serviceConfigModel";
var _2a3=(function(){
var _2a4=0;
return function(){
return _2a4++;
};
})();
Y.ServiceConfigModel=Y.Base.create(NAME,Y.Model,[],{SERVICE_TYPE_VALUES:{broadcast:10,echo:10,"stomp.proxy":10,"stomp.jms":10,"stomp.interceptor":10,directory:20,balancer:19,session:20,keyring:20,"http.proxy":30,"kerberos.proxy":30,proxy:30,"management.jmx":100,"$management.jmx$":100,"management.snmp":101,"$management.snmp$":101},hasAttribute:function(_2a5){
return Y.ServiceConfigModel.ATTRS.hasOwnProperty(_2a5);
},initializer:function(){
this.set("clientServiceConfigId",_2a3());
},equals:function(_2a6){
if(!_2a6){
return false;
}
if(this===_2a6){
return true;
}
if(!equalModelStrings(_2a6.get("name"),this.get("name"))){
return false;
}
if(!equalModelStrings(_2a6.get("type"),this.get("type"))){
return false;
}
if(!equalModelStrings(_2a6.get("description"),this.get("description"))){
return false;
}
if(!equalModelObjects(_2a6.get("crossSiteConstraints"),this.get("crossSiteConstraints"))){
return false;
}
if(!equalModelObjects(_2a6.get("properties"),this.get("properties"))){
return false;
}
if(!equalModelArrays(_2a6.get("requiredRoles"),this.get("requiredRoles"))){
return false;
}
if(!equalModelObjects(_2a6.get("mimeMappings"),this.get("mimeMappings"))){
return false;
}
if(!this.equalRealms(_2a6)){
return false;
}
if(!equalModelObjects(_2a6.get("acceptOptions"),this.get("acceptOptions"))){
return false;
}
if(!equalModelObjects(_2a6.get("connectOptions"),this.get("connectOptions"))){
return false;
}
if(!equalModelArrays(_2a6.get("balances"),this.get("balances"))){
return false;
}
if(!this.isBalanced()){
if(!equalModelStrings(_2a6.get("accepts"),this.get("accepts"))){
return false;
}
}
if(!equalModelStrings(_2a6.get("connects"),this.get("connects"))){
return false;
}
return true;
},equalRealms:function(scm){
var _2a8=this.get("realm");
var _2a9=scm.get("realm");
if(_2a8){
if(!_2a8.equals(_2a9)){
return false;
}
}else{
if(_2a9){
return false;
}
}
return true;
},equalConnectOptions:function(scm){
var _2ab=this.get("connectOptions");
var _2ac=scm.get("connectOptions");
if(_2ab){
if(!thisOptions.equals(_2ac)){
return false;
}
}else{
if(_2ac){
return false;
}
}
return true;
},sortCompare:function(scm){
var _2ae=this.SERVICE_TYPE_VALUES[this.get("type")];
var _2af=this.SERVICE_TYPE_VALUES[scm.get("type")];
if(_2ae<_2af){
return -1;
}else{
if(_2ae>_2af){
return 1;
}
}
var _2b0=this.get("name");
var _2b1=scm.get("name");
if(!_2b0){
return (_2b1?1:0);
}else{
if(!_2b1){
return -1;
}else{
_2b0=_2b0.toLowerCase();
_2b1=_2b1.toLowerCase();
if(_2b0<_2b1){
return -1;
}else{
return (_2b0===_2b1?0:1);
}
}
}
},isManagement:function(){
var type=this.get("type");
return (type.startsWith("$management.")||type.startsWith("management.")?true:false);
},isBalanced:function(){
var _2b3=this.get("balances");
return (_2b3&&_2b3.length>0);
},dump:function(){
CC.console.debug("ServiceConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _2b4=2;
dumpAttr(this,"name",_2b4);
dumpAttr(this,"type",_2b4);
dumpAttr(this,"description",_2b4);
dumpAttr(this,"accepts",_2b4);
dumpAttr(this,"acceptOptions",_2b4);
dumpAttr(this,"balances",_2b4);
dumpAttr(this,"connects",_2b4);
dumpAttr(this,"connectOptions",_2b4);
dumpAttr(this,"notifys",_2b4);
dumpAttr(this,"notifyOptions",_2b4);
dumpAttr(this,"crossSiteConstraints",_2b4);
dumpAttr(this,"properties",_2b4);
dumpAttr(this,"requiredRoles",_2b4);
dumpAttr(this,"realm",_2b4);
dumpAttr(this,"mimeMappings",_2b4);
}},{ATTRS:{gatewayModel:{value:null},serviceId:{value:null},type:{value:null},name:{value:null},description:{value:null},accepts:{value:null},acceptOptions:{value:null},balances:{value:null},connects:{value:null},connectOptions:{value:null},notifys:{value:null},notifyOptions:{value:null},crossSiteConstraints:{value:null},properties:{value:null},requiredRoles:{value:null},realm:{value:null},mimeMappings:{value:null},label:{getter:function(){
var _2b5=this.get("name");
if(!_2b5){
_2b5="Type: "+this.get("type");
}
return _2b5;
}}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("service-defaults-config-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="serviceDefaultsConfigModel";
Y.ServiceDefaultsConfigModel=Y.Base.create(NAME,Y.Model,[],{hasAttribute:function(_2b9){
return Y.ServiceDefaultsConfigModel.ATTRS.hasOwnProperty(_2b9);
},initializer:function(){
},dump:function(){
CC.console.debug("ServiceDefaultsConfig for GW "+this.get("gatewayModel").getDebugIdStr());
var _2ba=2;
dumpAttr(this,"acceptOptions",_2ba);
dumpAttr(this,"mimeMappings",_2ba);
}},{ATTRS:{gatewayModel:{value:null},acceptOptions:{value:null},mimeMappings:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
YUI.add("service-dynamic-data-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="serviceDynamicDataModel";
Y.ServiceDynamicDataModel=Y.Base.create(NAME,Y.Model,[],{dataDefinition:null,UPDATE_EVENT:NAME+":update",readTimeIndex:-1,initializer:function(){
var _2be=this.get("serviceModel").get("gatewayModel").getSummaryDataDefinition("service");
var _2bf=_2be.fields;
if(_2bf.indexOf("totalBytesSentThroughput")<0){
_2bf.push("totalBytesSentThroughput","totalBytesReceivedThroughput",_2bf.pop());
}
this.dataDefinition=_2be;
this.readTimeIndex=this._getAttributeIndex("readTime");
this.publish(this.UPDATE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
},hasAttribute:function(_2c0){
return (this._getAttributeIndex(_2c0)>=0);
},getValue:function(_2c1,_2c2){
var _2c3=this._getAttributeIndex(_2c1);
if(_2c3<0){
return undefined;
}
var data=this.get("data");
if(!data){
return null;
}
var val=data[_2c3];
if(typeOf(val)=="function"){
val=val();
}
return (_2c2?[this.getReadTime(),val]:val);
},getReadTime:function(){
var data=this.get("data");
return data[data.length-1];
},load:function(_2c7){
var _2c8=_2c7.summaryData;
var _2c9=_2c7.readTime;
_2c8[this._getAttributeIndex("totalBytesSentThroughput")]=_2c8[this._getAttributeIndex("totalBytesSent")].toFixed(2);
_2c8[this._getAttributeIndex("totalBytesReceivedThroughput")]=_2c8[this._getAttributeIndex("totalBytesReceived")].toFixed(2);
_2c8[this._getAttributeIndex("readTime")]=_2c7.readTime;
this.loadSummaryData(_2c8);
},loadSummaryData:function(_2ca){
var data=this.get("data");
if(!data||data[this.readTimeIndex]!==_2ca[this.readTimeIndex]){
this.set("data",_2ca);
this.fire(this.UPDATE_EVENT,{model:this,data:_2ca});
}
},processNotification:function(_2cc){
var _2cd=_2cc.value;
var _2ce=_2cc.readTime;
_2cd[this._getAttributeIndex("totalBytesSentThroughput")]=this.computeThroughputAttr(_2cd,"totalBytesSent",_2ce);
_2cd[this._getAttributeIndex("totalBytesReceivedThroughput")]=this.computeThroughputAttr(_2cd,"totalBytesReceived",_2ce);
_2cd[this._getAttributeIndex("readTime")]=_2ce;
this.loadSummaryData(_2cd);
},_getAttributeIndex:function(_2cf){
var _2d0=this.dataDefinition.fields.indexOf(_2cf);
return _2d0;
},_setValue:function(_2d1,_2d2){
var _2d3=this._getAttributeIndex(_2d1);
this.get("data")[_2d3]=_2d2;
},computeThroughputAttr:function(_2d4,_2d5,_2d6){
var _2d7=this.getValue(_2d5);
var _2d8=this.getValue("readTime");
var _2d9=this._getAttributeIndex(_2d5);
var _2da=_2d4[_2d9];
var val;
if(_2d8===_2d6){
val=_2da;
}else{
val=((_2da-_2d7)/(_2d6-_2d8))*1000;
}
return val.toFixed(2);
},},{ATTRS:{serviceModel:{value:null},data:{value:null}}});
},"0.99",{requires:["model","service-model"]});
YUI.add("session-dynamic-data-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="sessionDynamicDataModel";
Y.SessionDynamicDataModel=Y.Base.create(NAME,Y.Model,[],{dataDefinition:null,UPDATE_EVENT:NAME+":update",readTimeIndex:-1,initializer:function(){
var _2df=this.get("sessionModel").get("serviceModel").get("gatewayModel").getSummaryDataDefinition("session");
this.dataDefinition=_2df;
this.readTimeIndex=this._getAttributeIndex("readTime");
this.publish(this.UPDATE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
},hasAttribute:function(_2e0){
return (this._getAttributeIndex(_2e0)>=0);
},getValue:function(_2e1,_2e2){
var _2e3=this._getAttributeIndex(_2e1);
if(_2e3<0){
return undefined;
}
var data=this.get("data");
if(!data){
return null;
}
var val=data[_2e3];
if(typeOf(val)=="function"){
val=val();
}
return (_2e2?[this.getReadTime(),val]:val);
},getReadTime:function(){
var data=this.get("data");
return data[data.length-1];
},load:function(_2e7){
var _2e8=_2e7.summaryData;
var _2e9=_2e7.readTime;
_2e8.push(_2e9);
this.loadSummaryData(_2e8);
},loadSummaryData:function(_2ea){
var data=this.get("data");
if(!data||data[this.readTimeIndex]!==_2ea[this.readTimeIndex]){
this.set("data",_2ea);
this.fire(this.UPDATE_EVENT,{model:this,data:_2ea});
}
},processNotification:function(_2ec){
var _2ed=_2ec.value;
var _2ee=_2ec.readTime;
var _2ef=this._getAttributeIndex("readBytesThroughput");
_2ed[_2ef]=_2ed[_2ef].toFixed(2);
_2ef=this._getAttributeIndex("writtenBytesThroughput");
_2ed[_2ef]=_2ed[_2ef].toFixed(2);
_2ed[this._getAttributeIndex("readTime")]=_2ee;
this.loadSummaryData(_2ed);
},_getAttributeIndex:function(_2f0){
return this.dataDefinition.fields.indexOf(_2f0);
},_setValue:function(_2f1,_2f2){
var _2f3=this._getAttributeIndex(_2f1);
this.get("data")[_2f3]=_2f2;
},},{ATTRS:{sessionModel:{value:null},data:{value:null}}});
},"0.99",{requires:["model","session-model"]});
YUI.add("system-model",function(Y){
"use strict";
var Lang=Y.Lang,NAME="systemModel";
Y.SystemModel=Y.Base.create(NAME,Y.Model,[],{dataDefinition:null,UPDATE_EVENT:NAME+":update",initializer:function(){
var _2f7=this.get("gatewayModel").getSummaryDataDefinition("system");
this.dataDefinition=_2f7;
this.publish(this.UPDATE_EVENT,{emitFacade:true,broadcast:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
},hasAttribute:function(_2f8){
return (this._getAttributeIndex(_2f8)>=0);
},getValue:function(_2f9,_2fa){
var _2fb=this._getAttributeIndex(_2f9);
if(_2fb<0){
return undefined;
}
var data=this.get("data");
if(!data){
return null;
}
var val=data[_2fb];
if(typeOf(val)=="function"){
val=val();
}
return (_2fa?[this.getReadTime(),val]:val);
},getReadTime:function(){
var data=this.get("data");
if(!data||data.length==0){
return 0;
}
return data[data.length-1];
},load:function(_2ff){
this.loadSummaryData(_2ff["summaryData"]);
},loadSummaryData:function(_300){
if(_300&&_300.length>0){
var _301=this.getReadTime();
for(var i=0;i<_300.length;i++){
var item=_300[i];
var _304=item.systemData;
var _305=item.readTime;
if(_304==null||_304==undefined){
continue;
}
_304.push(_305);
if(_305>_301){
_301=_305;
this.set("data",_304);
}
this.fire(this.UPDATE_EVENT,{model:this,data:_304});
}
}
},processNotification:function(_306){
this.loadSummaryData(_306.value);
},_getAttributeIndex:function(_307){
var _308=this.dataDefinition.fields.indexOf(_307);
return _308;
}},{ATTRS:{gatewayModel:{value:null},data:{value:null}}});
},"0.99",{requires:["model","gateway-model"]});
