/**
 * Copyright (c) 2007-2014, Kaazing Corporation. All rights reserved.
 */

YUI.add("cluster-realm-config-view",function(Y){
"use strict";
var _2=Y.Lang,_3="clusterRealmConfigView";
Y.ClusterRealmConfigView=Y.Base.create(_3,Y.View,[],{initializer:function(){
var _4=this.get("modelList");
_4.addTarget(this);
this.addRealmConfig(_4.item(0));
this.after("modelListChange",this.afterModelChange,this);
this.after("showUrlsChange",this.afterShowUrlsChange,this);
},addRealmConfig:function(_5){
var _6=this.get("modelList");
if(!_6.item(0).equals(_5)){
return false;
}
_6.add(_5);
this.addServiceConfigs(_5);
return true;
},containsRealmConfig:function(_7){
var _8=this.get("modelList");
return (_8.indexOf(_7)>=0);
},removeRealmConfig:function(_9){
var _a=this.get("modelList");
_a.remove(_9);
this.removeServiceConfigs(_9);
},isEmpty:function(){
var _b=this.get("modelList");
return (_b.size()===0);
},addServiceConfigs:function(_c){
var _d=_c.get("serviceConfigs");
if(_d){
var _e=this.get("clusterServiceConfigViews");
var _f=null;
for(var i=0;i<_d.length;i++){
var _11=_d[i];
var _12=false;
for(var j=0;j<_e.length;j++){
_f=_e[j];
if(_f.addServiceConfig(_11)){
_12=true;
break;
}
}
if(!_12){
var _14=new Y.ModelList({model:Y.ServiceConfigModel});
_14.add(_11);
_f=new Y.ClusterServiceConfigView({modelList:_14,clusterModel:this.get("clusterModel"),showUrls:this.get("showUrls"),app:this.get("app")});
_e.push(_f);
}
}
}
},removeServiceConfigs:function(_15){
var _16=_15.get("serviceConfigs");
if(_16){
var _17=this.get("clusterServiceConfigViews");
var _18=null;
for(var i=0;i<_16.length;i++){
var _1a=_16[i];
for(var j=0;j<_17.length;j++){
_18=_17[j];
if(_18.containsServiceConfig(_1a)){
_18.removeServiceConfig(_1a);
if(_18.isEmpty()){
arrayRemove(_17,_18);
_18.destroy();
}
break;
}
}
}
}
},calculateWarnings:function(){
var _1c=this.get("clusterServiceConfigViews");
for(var i=0;i<_1c.length;i++){
_1c[i].calculateWarnings();
}
},destructor:function(){
this.destroySubviews();
},afterModelListChange:function(ev){
this.destroySubviews();
var _1f=$this.get("container");
removeAllChildren(_1f);
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.initializeSubviews();
},afterShowUrlsChange:function(ev){
var _21=this.get("clusterServiceConfigViews");
for(var i=0;i<_21.length;i++){
_21[i].set("showUrls",this.get("showUrls"));
}
},render:function(){
var _23=this;
var _24=Y.one(Y.config.doc.createDocumentFragment());
var _25=this.get("modelList");
var _26=_25.item(0);
var _27=createDIV(_24,"graphicRealm");
var _28=createDIV(_27,"graphicRealmTitleDiv");
var _29=createIMG(_28,"../images/castle3.png","graphicRealmImage");
var _2a=createSPAN(_28,"Realm: ","graphicRealmTitle");
var _2b=createLINK(_28,"javascript:void(0);","graphicRealmTitleName").set("text",_26.get("name"));
_2b.on("click",(function(_2c){
return function(ev){
_23.get("app").save("/config/security/realms?connectionUrl="+_2c.get("gatewayModel").get("connectionUrl")+"&realm="+_2c.get("name"));
};
})(_26));
var _2e=this.get("clusterServiceConfigViews");
var _2f=_2e.length;
if(_2f===0){
var div=createDIV(_27,"graphicNoServiceRealm").set("text","No services refer to this realm");
}else{
var _31=_2e.slice();
_31.sort(function(a,b){
var _34=a.get("modelList").item(0);
var _35=b.get("modelList").item(0);
return _34.sortCompare(_35);
});
for(var i=0;i<_2f;i++){
var _37=_31[i];
_27.append(_37.render().get("container"));
}
}
this.get("container").setHTML(_24);
return this;
},sortCompare:function(_38){
var _39=this.get("modelList").item(0);
var _3a=_38.get("modelList").item(0);
return _39.sortCompare(_3a);
},destroySubviews:function(){
var _3b=this.get("clusterServiceConfigViews");
var i;
for(i=0;i<_3b.length;i++){
var _3d=_3b[i];
_3d.destroy();
}
this.set("clusterServiceConfigViews",[]);
}},{ATTRS:{container:{value:null},app:{value:null},clusterModel:{value:null},modelList:{value:null},clusterServiceConfigViews:{value:[]},showUrls:{value:false}}});
},"0.99",{requires:["view","cluster-model","gateway-model","realm-config-model"]});
YUI.add("cluster-service-config-view",function(Y){
"use strict";
var _3f=Y.Lang,_40="clusterServiceConfigView";
Y.ClusterServiceConfigView=Y.Base.create(_40,Y.View,[],{initializer:function(){
var _41=this;
var _42=_41.get("modelList");
_42.addTarget(_41);
_41.after("showUrlsChange",_41.afterShowUrlsChange,_41);
var _43=new Y.GatewayServiceConfigView({model:_42.item(0),showUrls:this.get("showUrls"),app:this.get("app")});
_43.addTarget(this);
this.set("serviceConfigView",_43);
},addServiceConfig:function(_44){
var _45=this.get("modelList");
if(!_45.item(0).equals(_44)){
return false;
}
_45.add(_44);
return true;
},containsServiceConfig:function(_46){
var _47=this.get("modelList");
return (_47.indexOf(_46)>=0);
},removeServiceConfig:function(_48){
var _49=this.get("modelList");
_49.remove(_48);
},isEmpty:function(){
var _4a=this.get("modelList");
return (_4a.size()===0);
},destructor:function(){
this.get("serviceConfigView").destroy();
this.set("serviceConfigView",null);
},afterShowUrlsChange:function(ev){
this.get("serviceConfigView").set("showUrls",this.get("showUrls"));
},calculateWarnings:function(){
var _4c=this.getNumRelevantGateways();
var _4d=this.get("modelList").size();
this.get("serviceConfigView").set("warning",(_4d===_4c?null:"This service is configured in only "+_4d+" of "+_4c+" cluster members"));
if(_4d>_4c){
var i=0;
}
},getNumRelevantGateways:function(){
var _4f=this.get("clusterModel").getGateways();
var _50=0;
if(_4f){
_4f.forEach(function(_51){
if(!_51.get("stopTime")){
if(!_51.isManaged()||_51.isUsable()){
_50++;
}
}
});
}
return _50;
},render:function(){
var _52=Y.one(Y.config.doc.createDocumentFragment());
var _53=this.get("serviceConfigView");
var _54=_53.render().get("container");
_52.append(_54);
this.get("container").setHTML(_52);
return this;
},sortCompare:function(_55){
var _56=this.get("modelList").item(0);
var _57=_55.get("modelList").item(0);
return _56.sortCompare(_57);
}},{ATTRS:{container:{value:null},app:{value:null},clusterModel:{value:null},modelList:{value:null},serviceConfigView:{value:null},showUrls:{value:false}}});
},"0.99",{requires:["view","cluster-model"]});
YUI.add("config-licenses-view",function(Y){
"use strict";
var _59=Y.Lang,_5a="configLicensesView",_5b=86400000;
Y.ConfigLicensesView=Y.Base.create(_5a,Y.KaazingView,[],{initializer:function(){
var _5c=this.get("model");
_5c&&_5c.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
return this;
},doDisplaySetup:function(){
if(this.get("firstTime")){
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
this.after("clusterModel:connectionHardLimitChange",this.afterConnectionLimitChange,this);
this.updateClusterLicenses();
this.set("firstTime",false);
}
this.render();
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.updateClusterLicenses();
this.render();
},onGatewayAvailable:function(ev){
this.updateClusterLicenses();
this.render();
},afterStopTimeChange:function(ev){
this.updateClusterLicenses();
this.render();
},afterConnectionLimitChange:function(ev){
this.render();
},updateClusterLicenses:function(){
var _62=this.buildLicenseConfigList();
this.set("clusterLicenseConfigs",_62);
},buildLicenseConfigList:function(){
var _63=[];
var i,j,k;
var _67=this.get("model").getUsableGateways();
if(_67&&_67.length>0){
for(i=0;i<_67.length;i++){
var _68=_67[i];
var _69=_68.get("gatewayConfig");
var _6a=_69.get("licensesConfig");
if(!_6a){
continue;
}
var _6b=_6a.get("licenses");
if(!_6b){
continue;
}
_6b.forEach(function(_6c){
var _6d=false;
for(k=0;k<_63.length;k++){
var _6e=_63[k];
if(_6c.equals(_6e[0])){
_6d=true;
_6e.push(_6c);
break;
}
}
if(!_6d){
_63.push([_6c]);
}
});
}
_63.sort(function(_6f,_70){
var _71=_6f[0];
var _72=_70[0];
return _71.sortCompare(_72);
});
}
return _63;
},render:function(){
if(this.isActiveView()){
removeAllChildren(this.get("container").one("#configLicensesData"));
this.renderData();
}
return this;
},renderData:function(){
var _73=this.get("container");
var _74=_73.one("#configLicensesData");
var _75=this.get("clusterLicenseConfigs");
removeAllChildren(_74);
var _76=Y.one(Y.config.doc.createDocumentFragment());
var _77=createDIV(_76,"configLicensesSection");
var _78=createH(_77,3).setHTML("Licenses");
var _79=createTABLE(_77,"configLicenseTable");
this.possiblyCreateDetailTableRow(_79,"Connection Limit:",this.formatConnectionLimit(this.get("model").get("connectionHardLimit")));
if(!_75||_75.length==0){
return;
}
var _7a=Y.one(Y.config.doc.createDocumentFragment());
var _77=createDIV(_7a);
for(var i=0;i<_75.length;i++){
var _7c=createTABLE(_7a,"configDataTable");
_7c.set("id","configSecurityLicenseTable");
var _7d=_75[i];
var _7e=_7d[0];
var _7f=[];
var _80;
for(var j=0;j<_7d.length;j++){
_7e=_7d[j];
_80=_7e.get("licensesConfigModel").get("gatewayModel");
if(_7f.indexOf(_80)==-1){
_7f.push(_80);
}
}
var _82=_7f.map(function(elt,_84,arr){
return elt.get("gatewayLabel");
}).sort().join(", ");
this.possiblyCreateLicenseRow(_7c,"Defined In:",_82);
this.possiblyCreateLicenseRow(_7c,"Product Name:",_7e.get("productName"));
this.possiblyCreateLicenseRow(_7c,"Name:",_7e.get("name"));
this.possiblyCreateLicenseRow(_7c,"Company:",_7e.get("company"));
this.possiblyCreateLicenseRow(_7c,"Email:",_7e.get("email"));
this.possiblyCreateLicenseRow(_7c,"Type:",_7e.get("licenseType"));
this.possiblyCreateLicenseRow(_7c,"Issue Date/Time:",_7e.get("issueDate"));
var _86=_7e.get("notValidAfterDate");
if(!_86){
_86="Does not expire";
}else{
var _87=Date.parse(_86)+1;
_86=formatCommandCenterDate(new Date(_86));
var _88=(_87-Date.now())/_5b;
if(_88<=30){
_86="<span class=\"warningmessage\">"+_86+" (";
if(_88<=0){
_86+="Expired";
}else{
if(_88<1){
_86+="< 1 day left";
}else{
if(_88<2){
_86+="1 day left";
}else{
_86+=(Math.floor(_88)+" days left");
}
}
}
_86+=")</span>";
}
}
this.possiblyCreateLicenseRow(_7c,"Expiration Date/Time:",_86);
this.possiblyCreateLicenseRow(_7c,"Node Limit:",formatNumberToLocale(_7e.get("nodeLimit")));
this.possiblyCreateLicenseRow(_7c,"Connection Limit:",this.formatConnectionLimit(_7e.get("connectionHardLimit")));
this.possiblyCreateLicenseRow(_7c,"Allowed Service Types:",_7e.get("allowedServices"));
}
this.possiblyCreateDetailTableRow(_79,"Licenses:",_7a);
_74.setHTML(_76);
return this;
},possiblyCreateDetailTableRow:function(_89,_8a,_8b){
if(isEmptyValue(_8b)){
return;
}
var tr=createTR(_89);
var td=createTD(tr,"configSecurityDetailLabel").set("text",_8a);
td=createTD(tr,"securityDataValue").setHTML(_8b);
},possiblyCreateLicenseRow:function(_8e,_8f,_90,_91){
if(!isEmptyValue(_90)){
var tr=createTR(_8e);
var td=createTD(tr,"securityDataValue").set("text",_8f).addClass("configSecurityLicenseLabel");
td=createTD(tr,"securityDataValue").setHTML(_90);
if(_91){
td.addClass(_91);
}
}
},formatConnectionLimit:function(_94){
var val=(_94>=(Math.pow(2,31)-1)?"Unlimited":formatNumberToLocale(_94));
return val;
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#configLicensesViewContainer");
}},title:{value:"Configuration : Security : Licenses"},clusterLicenseConfigs:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","licenses-config-model","license-config-model"]});
YUI.add("config-overview-view",function(Y){
"use strict";
var _97=Y.Lang,_98="configOverviewView";
var _99="Hide URLs",_9a="Show URLs";
Y.ConfigOverviewView=Y.Base.create(_98,Y.KaazingView,[],{initializer:function(){
var _9b=this.get("model");
_9b&&_9b.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
return this;
},doDisplaySetup:function(){
this.setupToolbar();
Y.one("#legend").removeClass("hidden");
if(this.get("firstTime")){
this.after("showUrlsChange",this.afterShowUrlsChange,this);
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
this.initializeSubviews();
this.set("firstTime",false);
}
},setupToolbar:function(){
var _9d=this.get("toolbar");
var _9e=this.get("showUrls");
var _9f=createBUTTON(_9d,_9a,"toolbarButton").set("id","configOverviewShowUrls");
var _a0=_9f.getStyle("width");
_9f.setHTML("<span>"+(_9e?_99:_9a)+"</span>");
_9f.setStyle("width",_a0);
_9f.on("click",this.toggleShowUrls,this);
},initializeSubviews:function(){
var _a1=this.get("model");
var _a2=_a1.getGateways();
if(_a2&&_a2.length>0){
for(var i=0;i<_a2.length;i++){
this.addGatewayInstance(_a2[i]);
}
}
},destructor:function(){
this.destroySubviews();
},afterModelChange:function(ev){
this.destroySubviews();
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.initializeSubviews();
this.render();
},onGatewayAvailable:function(ev){
this.addGatewayInstance(ev.gatewayModel);
},afterStopTimeChange:function(ev){
this.removeGatewayInstance(ev.target);
},addGatewayInstance:function(_a7){
var _a8=this.get("model");
if(_a7.isUsable()){
var _a9=_a7.get("gatewayConfig");
var _aa=_a9.get("securityConfig");
var _ab=(_aa&&_aa.get("realmConfigs"));
var i,j,k;
if(_ab){
var _af=this.get("clusterRealmConfigViews");
var _b0=null;
for(var _b1 in _ab){
if(_ab.hasOwnProperty(_b1)){
var _b2=_ab[_b1];
var _b3=false;
for(i=0;i<_af.length;i++){
_b0=_af[i];
if(_b0.addRealmConfig(_b2)){
_b3=true;
break;
}
}
if(!_b3){
var _b4=new Y.ModelList({model:Y.RealmConfigModel});
_b4.add(_b2);
_b0=new Y.ClusterRealmConfigView({clusterModel:_a8,modelList:_b4,showUrls:this.get("showUrls"),app:this.get("app")});
var _b5=false;
for(i=0;i<_af.length;i++){
var _b6=_af[i];
if(_b0.sortCompare(_b6)<0){
_af.splice(i,0,_b0);
_b5=true;
break;
}
}
if(!_b5){
_af.push(_b0);
}
}
}
}
}
var _b7=_a9.get("serviceConfigs");
var _b8=[];
var _b9,_ba;
for(i=0;i<_b7.length;i++){
_b9=_b7[i];
_ba=_b9.get("realm");
if(!_ba){
_b8.push(_b9);
}
}
var _bb=_b8.length;
if(_bb>0){
var _bc=this.get("clusterNoRealmServiceConfigViews");
var _bd=null;
for(i=0;i<_bb;i++){
_b9=_b8[i];
var _b3=false;
for(j=0;j<_bc.length;j++){
var _be=_bc[j];
if(_be.addServiceConfig(_b9)){
_b3=true;
break;
}
}
if(!_b3){
var _b4=new Y.ModelList({model:Y.ServiceConfigModel});
_b4.add(_b9);
_bd=new Y.ClusterServiceConfigView({clusterModel:_a8,modelList:_b4,showUrls:this.get("showUrls"),app:this.get("app")});
var _b5=false;
for(j=0;j<_bc.length;j++){
var _bf=_bc[j];
var _c0=_bd.sortCompare(_bf);
if(_c0<0){
_bc.splice(j,0,_bd);
_b5=true;
break;
}
}
if(!_b5){
_bc.push(_bd);
}
}
}
}
}
this.calculateWarnings();
this.render();
},removeGatewayInstance:function(_c1){
var _c2=this.get("model");
var _c3=_c1.get("gatewayConfig");
if(_c3){
var _c4=_c3.get("securityConfig");
var _c5=(_c4&&_c4.get("realmConfigs"));
var i,j,k;
if(_c5){
var _c9=this.get("clusterRealmConfigViews");
for(var _ca in _c5){
if(_c5.hasOwnProperty(_ca)){
var _cb=_c5[_ca];
for(i=0;i<_c9.length;i++){
var _cc=_c9[i];
if(_cc.containsRealmConfig(_cb)){
_cc.removeRealmConfig(_cb);
if(_cc.isEmpty()){
arrayRemove(_c9,_cc);
_cc.destroy();
}
break;
}
}
}
}
}
var _cd=_c3.get("serviceConfigs");
var _ce=this.get("clusterNoRealmServiceConfigViews");
for(i=0;i<_cd.length;i++){
var _cf=_cd[i];
if(!_cf.get("realm")){
for(j=0;j<_ce.length;j++){
var _d0=_ce[j];
if(_d0.containsServiceConfig(_cf)){
_d0.removeServiceConfig(_cf);
if(_d0.isEmpty()){
arrayRemove(_ce,_d0);
_d0.destroy();
}
break;
}
}
}
}
}
this.calculateWarnings();
this.render();
},calculateWarnings:function(){
var _d1=this.get("clusterRealmConfigViews");
for(var i=0;i<_d1.length;i++){
_d1[i].calculateWarnings();
}
var _d3=this.get("clusterNoRealmServiceConfigViews");
for(var i=0;i<_d3.length;i++){
_d3[i].calculateWarnings();
}
},afterShowUrlsChange:function(ev){
var _d5=this.get("showUrls");
var _d6=this.get("clusterRealmConfigViews");
for(var i=0;i<_d6.length;i++){
_d6[i].set("showUrls",_d5);
}
var _d8=this.get("clusterNoRealmServiceConfigViews");
for(var i=0;i<_d8.length;i++){
_d8[i].set("showUrls",_d5);
}
},render:function(){
var _d9=this.get("container").one("#configOverviewRealmData");
var _da=Y.one(Y.config.doc.createDocumentFragment());
var _db=this.get("clusterRealmConfigViews");
for(var i=0;i<_db.length;i++){
_da.append(_db[i].render().get("container"));
}
_d9.setHTML(_da);
var _dd=this.get("container").one("#configOverviewNoRealmData");
_da=Y.one(Y.config.doc.createDocumentFragment());
var _de=this.get("clusterNoRealmServiceConfigViews");
for(var i=0;i<_de.length;i++){
_da.append(_de[i].render().get("container"));
}
_dd.setHTML(_da);
return this;
},toggleShowUrls:function(ev){
var _e0=!this.get("showUrls");
this.set("showUrls",_e0);
ev.target.setHTML("<span>"+(_e0?_99:_9a)+"</span>");
},destroySubviews:function(){
var _e1=this.get("clusterRealmConfigViews");
var i;
for(i=0;i<_e1.length;i++){
var _e3=_e1[i];
_e3.destroy();
}
this.set("clusterRealmConfigViews",[]);
var _e4=this.get("clusterNoRealmServiceConfigViews");
for(i=0;i<_e4.length;i++){
var _e5=_e4[i];
_e5.destroy();
}
this.set("clusterNoRealmServiceConfigViews",[]);
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#configOverviewContainer");
}},title:{value:"Configuration : Overview"},clusterRealmConfigViews:{value:[]},clusterNoRealmServiceConfigViews:{value:[]},showUrls:{value:true},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","cluster-model"]});
YUI.add("config-security-keystore-view",function(Y){
"use strict";
var _e7=Y.Lang,_e8="configSecurityKeystoreView",_e9=["alias","issuer","notValidBefore","notValidAfter","subject","subjectAlternativeNames","pathConstraint","selfSigned","signatureAlgorithm"],_ea=["Alias","Issuer","Not Valid Before","Not Valid After","Subject","Subject Alternative Names","Certificate Authority?","Self Signed?","Signature Algorithm"];
Y.ConfigSecurityKeystoreView=Y.Base.create(_e8,Y.KaazingView,[],{initializer:function(){
var _eb=this.get("model");
_eb&&_eb.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
return this;
},doDisplaySetup:function(){
if(this.get("firstTime")){
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
this.set("firstTime",false);
}
this.updateClusterKeystores();
this.render();
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.updateClusterKeystores();
this.render();
},onGatewayAvailable:function(ev){
this.updateClusterKeystores();
this.render();
},afterStopTimeChange:function(ev){
this.updateClusterKeystores();
this.render();
},updateClusterKeystores:function(){
var _f0=this.buildKeystoreList();
this.set("clusterSecurityConfigs",_f0);
},buildKeystoreList:function(){
var _f1=[];
var i,j;
var _f4=this.get("model").getUsableGateways();
if(_f4&&_f4.length>0){
for(i=0;i<_f4.length;i++){
var _f5=_f4[i];
var _f6=_f5.get("gatewayConfig");
var _f7=_f6.get("securityConfig");
if(!_f7){
continue;
}
var _f8=false;
for(j=0;j<_f1.length;j++){
var _f9=_f1[j];
if(_f7.equalsKeystoreInfo(_f9[0])){
_f8=true;
_f9.push(_f7);
break;
}
}
if(!_f8){
_f1.push([_f7]);
}
}
_f1.sort(function(_fa,_fb){
var sc1=_fa[0];
var sc2=_fb[0];
return sc1.sortCompareKeystore(sc2);
});
}
return _f1;
},render:function(){
if(this.isActiveView()){
removeAllChildren(this.get("container").one("#configSecurityKeystoreData"));
this.renderData();
}
return this;
},renderData:function(){
var _fe=this;
var _ff=this.get("container");
var _100=_ff.one("#configSecurityKeystoreData");
var _101=this.get("clusterSecurityConfigs");
removeAllChildren(_100);
if(!_101||_101.length==0){
return;
}
var _102=Y.one(Y.config.doc.createDocumentFragment());
for(var i=0;i<_101.length;i++){
var _104=createDIV(_102,"configSecuritySection");
var _105=_101[i];
var _106=_105[0];
var _107=createH(_104,3).setHTML("Keystore");
var _108=createTABLE(_104);
var _109=[];
var _10a;
for(var j=0;j<_105.length;j++){
_106=_105[j];
_10a=_106.get("gatewayModel");
if(_109.indexOf(_10a)==-1){
_109.push(_10a);
}
}
var _10c=_109.map(function(elt,_10e,arr){
return elt.get("gatewayLabel");
}).sort().join(", ");
this.possiblyCreateDetailTableRow(_108,"Defined In:",_10c);
this.possiblyCreateDetailTableRow(_108,"Type:",_106.get("keystoreType"));
var _110=_106.get("keystoreCertificateInfo");
if(_110&&_110.length>0){
var _111=Y.one(Y.config.doc.createDocumentFragment());
var _112=createDIV(_111);
var _113=_110.map(function(elt,_115,_116){
return this.extractCertInfo(elt);
},_fe);
_113.sort(function(a,b){
var _119=a[_e9[0]];
var _11a=b[_e9[0]];
if(_119<_11a){
return -1;
}else{
return (_119>_11a?1:0);
}
});
for(var j=0;j<_113.length;j++){
var _11b=createTABLE(_111,"configDataTable");
_11b.set("id","configSecurityCertificateTable");
var _11c=_113[j];
for(var k=0;k<_e9.length;k++){
var _11e=null;
var _11f=_e9[k];
var _120=_ea[k];
var _121=_11c[_11f];
if(k==0){
_11e="configSecurityCertificateAlias";
}else{
if(_11f==="issuer"){
if(_121!==null&&_121!=undefined){
_121=_121.split(",").join("<BR>");
}
_11e="configSecurityCertificateIssuer";
}else{
if(_11f==="subject"){
if(_121!==null&&_121!=undefined){
_121=_121.split(",");
for(var f=0;f<_121.length;f++){
if(_121[f].startsWith("CN=")){
_121[f]=("<b>"+_121[f]+"</b>");
}
}
_121=_121.join("<BR>");
}
_11e="configSecurityCertificateSubject";
}else{
if(_11f==="subjectAlternativeNames"){
if(!_121){
_121="&nbsp;";
}
}else{
if(_121&&(_11f==="notValidBefore"||_11f==="notValidAfter")){
var d=new Date(_121);
_121=d.toUTCString();
}else{
if(_11f==="pathConstraint"){
if(_121===-1){
_121="NO";
}else{
_121=(_11c["issuer"]&&(_11c["issuer"]===_11c["subject"])?"Root CA":"Intermediate CA");
}
}else{
if(_11f==="selfSigned"){
_121=(_11c["issuer"]&&(_11c["issuer"]===_11c["subject"])?"Yes":"No");
}
}
}
}
}
}
}
this.possiblyCreateCertificateRow(_11b,_120,_121,_11e);
}
}
this.possiblyCreateDetailTableRow(_108,"Certificates:",_111);
}
}
_100.setHTML(_102);
return this;
},possiblyCreateDetailTableRow:function(_124,_125,_126){
if(isEmptyValue(_126)){
return;
}
var tr=createTR(_124);
var td=createTD(tr,"configSecurityDetailLabel").set("text",_125);
td=createTD(tr,"securityDataValue").setHTML(_126);
},extractCertInfo:function(_129){
var _12a={};
for(var prop in _129){
if(_e9.indexOf(prop)>=0){
_12a[prop]=_129[prop];
}
}
return _12a;
},possiblyCreateCertificateRow:function(_12c,_12d,_12e,_12f){
if(!isEmptyValue(_12e)){
var tr=createTR(_12c);
var td=createTD(tr,"securityDataValue").set("text",_12d).addClass("configSecurityCertificateLabel");
td=createTD(tr,"securityDataValue").setHTML(_12e);
if(_12f){
td.addClass(_12f);
}
}
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#configSecurityKeystoreViewContainer");
}},title:{value:"Configuration : Security : Keystores"},clusterSecurityConfigs:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","security-config-model"]});
YUI.add("config-security-realms-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="configSecurityRealmsView";
Y.ConfigSecurityRealmsView=Y.Base.create(NAME,Y.KaazingView,[],{initializer:function(){
var _135=this.get("model");
_135&&_135.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
return this;
},doDisplaySetup:function(){
if(this.get("firstTime")){
this.after("selectedRealmConfigChange",this.afterSelectedRealmConfigChange,this);
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
this.updateClusterRealmConfigs();
this.set("firstTime",false);
}
this.render();
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.updateClusterRealmConfigs();
this.render();
},onGatewayAvailable:function(ev){
this.updateClusterRealmConfigs();
this.render();
},afterStopTimeChange:function(ev){
this.updateClusterRealmConfigs();
this.render();
},afterSelectedRealmConfigChange:function(ev){
this.render();
},updateClusterRealmConfigs:function(){
var _13b=this.buildRealmConfigList();
this.set("clusterRealmConfigs",_13b);
},buildRealmConfigList:function(){
var _13c=[];
var i,j,_13f;
var _140=this.get("model").getUsableGateways();
if(_140&&_140.length>0){
for(i=0;i<_140.length;i++){
var _141=_140[i];
var _142=_141.get("gatewayConfig");
var _143=_142.get("securityConfig");
if(!_143){
continue;
}
var _144=_143.get("realmConfigs");
if(!_144){
continue;
}
for(_13f in _144){
if(_144.hasOwnProperty(_13f)){
var _145=_144[_13f];
var _146=false;
for(j=0;j<_13c.length;j++){
var _147=_13c[j];
if(_145.equals(_147[0])){
_146=true;
_147.push(_145);
break;
}
}
if(!_146){
_13c.push([_145]);
}
}
}
}
_13c.sort(function(_148,_149){
var _14a=_148[0];
var _14b=_149[0];
return _14a.sortCompare(_14b);
});
}
return _13c;
},render:function(){
if(this.isActiveView()){
removeAllChildren(this.get("container").one("#configSecurityRealmsData"));
this.renderToolbar();
this.renderData();
}
return this;
},renderToolbar:function(){
var _14c=this;
var _14d=this.get("clusterRealmConfigs");
var _14e=this.get("toolbar");
removeAllChildren(_14e);
var _14f=createSELECT(_14e,"toolbarSelect");
var _150=createOPTION(_14f,null,"Select a realm...").set("selected",false);
if(_14d&&_14d.length>0){
_14d.sort(function(_151,_152){
var l1=_151[0].get("name").toLowerCase();
var l2=_152[0].get("name").toLowerCase();
if(l1==l2){
return 0;
}else{
return (l1<l2?-1:1);
}
});
var src=this.get("selectedRealmConfig");
for(var i=0;i<_14d.length;i++){
var _157=_14d[i];
var _158=_157[0];
var _159=_158.get("name");
_150=createOPTION(_14f,null,_159);
if(_158.equals(src)){
_150.set("selected",true);
}
}
_14f.after("change",function(ev){
var _15b=ev.target;
var _15c=_15b.get("selectedIndex");
if(_15c<=0){
if(_14c.get("selectedRealmConfig")!==null){
_14c.set("selectedRealmConfig",null);
}
return;
}
var _15d=null;
var _15e=_14c.get("clusterRealmConfigs");
if(_15e&&_15e.length>=_15c){
var _15f=_15e[_15c-1];
if(_15f.length>0){
_15d=_15f[0];
}
}
if(_14c.get("selectedRealmConfig")!==_15d){
_14c.set("selectedRealmConfig",_15d);
}
});
}else{
if(this.get("selectedRealmConfig")!==null){
this.set("selectedRealmConfig",null);
}
}
},renderData:function(){
var _160=this.get("container");
var _161=_160.one("#configSecurityRealmsData");
removeAllChildren(_161);
var src=this.get("selectedRealmConfig");
if(!src){
return;
}
var _163=this;
var _164=Y.one(Y.config.doc.createDocumentFragment());
var _165=createDIV(_164,"configSecuritySection");
var _166=createH(_165,3).setHTML("Realm: <SPAN class=\"configSecurityRealmName\">"+src.get("name")+"</SPAN>");
var _167=createTABLE(_165,"configSecurityRealmTable");
var _168=this.get("clusterRealmConfigs");
var _169;
for(var i=0;i<_168.length;i++){
_169=_168[i];
if(_169.indexOf(src)>=0){
break;
}
}
var _16b=[];
for(var i=0;i<_169.length;i++){
var _16c=_169[i];
var _16d=_16c.get("serviceConfigs");
if(_16d){
for(var j=0;j<_16d.length;j++){
var _16f=_16d[j];
var _170=false;
for(var k=0;k<_16b.length;k++){
var _172=_16b[k];
if(_16f.equals(_172[0])){
_172.push(_16f);
break;
}
}
if(!_170){
_16b.push([_16f]);
}
}
}
}
var _173="";
if(_16b.length>0){
_16b.sort(function(_174,_175){
var _176=_174[0].get("label").toLowerCase();
var _177=_175[0].get("label").toLowerCase();
if(_176<_177){
return -1;
}else{
return (_176===_177?0:1);
}
});
for(var i=0;i<_16b.length;i++){
var _16f=_16b[i][0];
if(i>0){
_173+=", ";
}
_173+=("<A href=\"javascript:void(0);\" "+"class=\"serviceLink\" "+"index=\""+i+"\">"+_16f.get("label")+"</A>");
}
}
_167.delegate("click",_163.handleServiceLink,".serviceLink",_163,_16b);
var _178=[];
var _179;
for(var j=0;j<_169.length;j++){
_179=_169[j].get("gatewayModel");
if(_178.indexOf(_179)==-1){
_178.push(_179);
}
}
var _17a=_178.map(function(elt,_17c,arr){
return elt.get("gatewayLabel");
}).sort().join(", ");
this.possiblyCreateDetailTableRow(_167,"Defined In:",_17a);
this.possiblyCreateDetailTableRow(_167,"Used In Services:",_173);
this.possiblyCreateDetailTableRow(_167,"Description:",src.get("description"));
this.possiblyCreateDetailTableRow(_167,"Authorization Mode:",src.get("authorizationMode"));
this.possiblyCreateDetailTableRow(_167,"Authorization Timeout:",src.get("authorizationTimeout"));
this.possiblyCreateDetailTableRow(_167,"HTTP Challenge Scheme:",src.get("httpChallengeScheme"));
this.possiblyCreateDetailTableRow(_167,"Session Timeout:",src.get("sessionTimeout"));
var _17e=src.get("httpCookieNames");
var _17f=(_17e?_17e.sort().join(",<br>"):"");
this.possiblyCreateDetailTableRow(_167,"HTTP Cookie Names:",_17f);
var _180=src.get("httpHeaders");
var _181=(_180?_180.sort().join(",<br>"):"");
this.possiblyCreateDetailTableRow(_167,"HTTP Headers:",_181);
var _182=src.get("httpQueryParams");
var _183=(_182?_182.sort().join(",<br>"):"");
this.possiblyCreateDetailTableRow(_167,"HTTP Query Parameters:",_183);
var _184=src.get("userPrincipalClasses");
var _185=(_184?_184.sort().join("<br>"):"");
this.possiblyCreateDetailTableRow(_167,"User Principal Classes:",_185);
var _186=src.get("loginModules");
if(_186&&_186.length>0){
var _187=Y.one(Y.config.doc.createDocumentFragment());
var _188=createTABLE(_187,"configDataTable");
_188.set("id","configSecurityLoginModuleTable");
var tr=createTR(_188);
var th=createTH(tr,"configSecurityLoginModuleType").set("text","Type");
th=createTH(tr,"configSecurityLoginModuleSuccess").set("text","Success");
th=createTH(tr).set("text","Options");
for(var j=0;j<_186.length;j++){
var _18b="";
var _18c=_186[j];
var type=_18c.type;
if(type.startsWith("com.kaazing.gateway.server.auth.")){
type=type.substring(type.lastIndexOf(".")+1);
if(type.endsWith("LoginModule")){
type=type.substring(0,type.indexOf("LoginModule"));
type=type.toLowerCase();
}
}
var _18e=_18c.options;
var _18f="";
if(_18e&&!isEmptyObject(_18e)){
for(var prop in _18e){
if(_18e.hasOwnProperty(prop)){
if(_18f!==""){
_18f+="<br>";
}
_18f+="<b>"+prop+": </b>"+_18e[prop];
}
}
}
this.createLoginModuleRow(_188,type,_18c.success,_18f);
}
this.possiblyCreateDetailTableRow(_167,"Login Modules:",_187);
}
_161.setHTML(_164);
return this;
},possiblyCreateDetailTableRow:function(_191,_192,_193){
if(isEmptyValue(_193)){
return;
}
var tr=createTR(_191);
var td=createTD(tr,"configSecurityDetailLabel").setHTML(Y.Escape.html(_192));
td=createTD(tr,"securityDataValue").setHTML(_193);
},createLoginModuleRow:function(_196,type,_198,_199){
var tr=createTR(_196);
var td=createTD(tr,"securityDataValue").set("text",type).addClass("configSecurityLoginModuleType");
td=createTD(tr,"securityDataValue").set("text",_198).addClass("configSecurityLoginModuleSuccess");
td=createTD(tr,"securityDataValue").setHTML(_199);
},handleServiceLink:function(ev,_19d){
var _19e=ev.target;
var _19f=_19e.getAttribute("index");
var _1a0=_19d[_19f];
var _1a1=_1a0[0];
var _1a2=_1a1.get("gatewayModel");
var _1a3=_1a2.get("connectionUrl");
var _1a4=_1a1.get("serviceId");
ev.halt(true);
this.get("app").save("/config/services?connectionUrl="+_1a3+"&serviceId="+_1a4);
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#configSecurityRealmsViewContainer");
}},title:{value:"Configuration : Security : Realms"},toolbar:{value:null},clusterRealmConfigs:{value:null},selectedRealmConfig:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","security-config-model"]});
YUI.add("config-security-truststore-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="configSecurityTruststoreView",_1a8=["alias","issuer","notValidBefore","notValidAfter","subject","subjectAlternativeNames","pathConstraint","selfSigned","signatureAlgorithm"],_1a9=["Alias","Issuer","Not Valid Before","Not Valid After","Subject","Subject Alternative Names","Certificate Authority?","Self Signed?","Signature Algorithm"];
Y.ConfigSecurityTruststoreView=Y.Base.create(NAME,Y.KaazingView,[],{initializer:function(){
var _1aa=this.get("model");
_1aa&&_1aa.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
return this;
},doDisplaySetup:function(){
if(this.get("firstTime")){
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
this.updateClusterTruststores();
this.set("firstTime",false);
}
this.render();
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.updateClusterTruststores();
this.render();
},onGatewayAvailable:function(ev){
this.updateClusterTruststores();
this.render();
},afterStopTimeChange:function(ev){
this.updateClusterTruststores();
this.render();
},updateClusterTruststores:function(){
var _1af=this.buildTruststoreList();
this.set("clusterSecurityConfigs",_1af);
},buildTruststoreList:function(){
var _1b0=[];
var i,j;
var _1b3=this.get("model").getUsableGateways();
if(_1b3&&_1b3.length>0){
for(i=0;i<_1b3.length;i++){
var _1b4=_1b3[i];
var _1b5=_1b4.get("gatewayConfig");
var _1b6=_1b5.get("securityConfig");
if(!_1b6){
continue;
}
var _1b7=false;
for(j=0;j<_1b0.length;j++){
var _1b8=_1b0[j];
if(_1b6.equalsTruststoreInfo(_1b8[0])){
_1b7=true;
_1b8.push(_1b6);
break;
}
}
if(!_1b7){
_1b0.push([_1b6]);
}
}
_1b0.sort(function(_1b9,_1ba){
var sc1=_1b9[0];
var sc2=_1ba[0];
return sc1.sortCompareTruststore(sc2);
});
}
return _1b0;
},render:function(){
if(this.isActiveView()){
removeAllChildren(this.get("container").one("#configSecurityTruststoreData"));
this.renderData();
}
return this;
},renderData:function(){
var _1bd=this;
var _1be=this.get("container");
var _1bf=_1be.one("#configSecurityTruststoreData");
var _1c0=this.get("clusterSecurityConfigs");
removeAllChildren(_1bf);
if(!_1c0||_1c0.length==0){
return;
}
var _1c1=Y.one(Y.config.doc.createDocumentFragment());
for(var i=0;i<_1c0.length;i++){
var _1c3=createDIV(_1c1,"configSecuritySection");
var _1c4=_1c0[i];
var _1c5=_1c4[0];
var _1c6=createH(_1c3,3).setHTML("Truststore");
var _1c7=createTABLE(_1c3);
var _1c8=[];
var _1c9;
for(var j=0;j<_1c4.length;j++){
_1c5=_1c4[j];
_1c9=_1c5.get("gatewayModel");
if(_1c8.indexOf(_1c9)==-1){
_1c8.push(_1c9);
}
}
var _1cb=_1c8.map(function(elt,_1cd,arr){
return elt.get("gatewayLabel");
}).sort().join(", ");
this.possiblyCreateDetailTableRow(_1c7,"Defined In:",_1cb);
this.possiblyCreateDetailTableRow(_1c7,"Type:",_1c5.get("truststoreType"));
var _1cf=_1c5.get("truststoreCertificateInfo");
if(_1cf&&_1cf.length>0){
var _1d0=Y.one(Y.config.doc.createDocumentFragment());
var _1d1=createDIV(_1d0);
var _1d2=_1cf.map(function(elt,_1d4,_1d5){
return this.extractCertInfo(elt);
},_1bd);
_1d2.sort(function(a,b){
var _1d8=a[_1a8[0]];
var _1d9=b[_1a8[0]];
if(_1d8<_1d9){
return -1;
}else{
return (_1d8>_1d9?1:0);
}
});
for(var j=0;j<_1d2.length;j++){
var _1da=createTABLE(_1d0,"configDataTable");
_1da.set("id","configSecurityCertificateTable");
var _1db=_1d2[j];
for(var k=0;k<_1a8.length;k++){
var _1dd=null;
var _1de=_1a8[k];
var _1df=_1a9[k];
var _1e0=_1db[_1de];
if(k==0){
_1dd="configSecurityCertificateAlias";
}else{
if(_1de==="issuer"){
if(_1e0!==null&&_1e0!=undefined){
_1e0=_1e0.split(",").join("<BR>");
}
_1dd="configSecurityCertificateIssuer";
}else{
if(_1de==="subject"){
if(_1e0!==null&&_1e0!=undefined){
_1e0=_1e0.split(",");
for(var f=0;f<_1e0.length;f++){
if(_1e0[f].startsWith("CN=")){
_1e0[f]=("<b>"+_1e0[f]+"</b>");
}
}
_1e0=_1e0.join("<BR>");
}
_1dd="configSecurityCertificateSubject";
}else{
if(_1de==="subjectAlternativeNames"){
if(!_1e0){
_1e0="&nbsp;";
}
}else{
if(_1e0&&(_1de==="notValidBefore"||_1de==="notValidAfter")){
var d=new Date(_1e0);
_1e0=d.toUTCString();
}else{
if(_1de==="pathConstraint"){
if(_1e0===-1){
_1e0="NO";
}else{
_1e0=(_1db["issuer"]&&(_1db["issuer"]===_1db["subject"])?"Root CA":"Intermediate CA");
}
}else{
if(_1de==="selfSigned"){
_1e0=(_1db["issuer"]&&(_1db["issuer"]===_1db["subject"])?"Yes":"No");
}
}
}
}
}
}
}
this.possiblyCreateCertificateRow(_1da,_1df,_1e0,_1dd);
}
}
this.possiblyCreateDetailTableRow(_1c7,"Certificates:",_1d0);
}
}
_1bf.setHTML(_1c1);
var _1e3=_1bf.all(".configDataTable");
if(_1e3){
var _1e4=0;
_1e3.each(function(node){
var _1e6=parseInt(node.getStyle("width"));
if(_1e6>_1e4){
_1e4=_1e6;
}
});
if(_1e4>800){
_1e4=800;
}
_1e3.each(function(node){
node.setStyle("width",_1e4);
});
}
return this;
},possiblyCreateDetailTableRow:function(_1e8,_1e9,_1ea){
if(isEmptyValue(_1ea)){
return;
}
var tr=createTR(_1e8);
var td=createTD(tr,"configSecurityDetailLabel").set("text",_1e9);
td=createTD(tr,"securityDataValue").setHTML(_1ea);
},extractCertInfo:function(_1ed){
var _1ee={};
for(var prop in _1ed){
if(_1a8.indexOf(prop)>=0){
_1ee[prop]=_1ed[prop];
}
}
return _1ee;
},possiblyCreateCertificateRow:function(_1f0,_1f1,_1f2,_1f3){
if(!isEmptyValue(_1f2)){
var tr=createTR(_1f0);
var td=createTD(tr,"securityDataValue").set("text",_1f1).addClass("configSecurityCertificateLabel");
td=createTD(tr,"securityDataValue").setHTML(_1f2);
if(_1f3){
td.addClass(_1f3);
}
}
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#configSecurityTruststoreViewContainer");
}},title:{value:"Configuration : Security : Truststores"},clusterSecurityConfigs:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","security-config-model"]});
YUI.add("config-service-defaults-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="configServiceDefaultsView";
Y.ConfigServiceDefaultsView=Y.Base.create(NAME,Y.KaazingView,[],{initializer:function(){
var _1f9=this.get("model");
_1f9&&_1f9.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
return this;
},doDisplaySetup:function(){
if(this.get("firstTime")){
this.after("selectedGatewayChange",this.afterSelectedGatewayChange,this);
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
this.set("firstTime",false);
}
if(!this.isCluster()){
var _1fb=this.get("model").getUsableGateways();
this.set("selectedGateway",_1fb[0].get("instanceKey"));
}else{
this.renderSelector();
}
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.render();
},onGatewayAvailable:function(ev){
var _1fe=ev.gatewayModel;
if(!this.isCluster()){
this.set("selectedGateway",_1fe.get("instanceKey"));
}else{
this.render();
}
},afterStopTimeChange:function(ev){
var _200=ev.target;
if(_200.get("instanceKey")===this.get("selectedGateway")){
this.set("selectedGateway",null);
}else{
this.render();
}
},afterSelectedGatewayChange:function(ev){
this.render();
},render:function(){
if(this.isActiveView()){
removeAllChildren(this.get("container").one("#configServiceDefaultsData"));
this.renderSelector();
this.renderData();
}
return this;
},renderSelector:function(){
var _202=this;
if(!this.isActiveView()){
return;
}
var _203=this.get("toolbar");
var _204=_203.one("#configServiceDefaultsGatewaySelector");
if(!this.isCluster()){
if(_204){
_203.remove(_204,true);
}
return;
}
var _205=this.get("selectedGateway");
var _206=this.get("model").getUsableGateways();
if(_206){
_206.sort(function(g1,g2){
return compareStrings(g1.get("gatewayLabel").toLowerCase(),g2.get("gatewayLabel").toLowerCase());
});
}
if(!_204){
_204=createSELECT(_203).set("id","configServiceDefaultsGatewaySelector");
}else{
_204.on("change",null);
removeAllChildren(_204);
}
var _209=createOPTION(_204,null,"Select a Cluster Member...").set("selected",false);
if(!_206){
this.set("selectedGateway",null);
return;
}
for(var i=0;i<_206.length;i++){
var _20b=_206[i];
var _20c=_20b.get("gatewayLabel");
var _20d=_20b.get("instanceKey");
_209=createOPTION(_204,null,_20c,_20d);
if(_20d===_205){
_209.set("selected",true);
}
}
_204.on("change",function(ev){
var _20f=ev.target;
var _210=_20f.get("selectedIndex");
if(_210<=0){
_202.set("selectedGateway",null);
return;
}
var _211=_20f.get("options").item(_210).get("value");
_202.set("selectedGateway",_211);
});
},renderData:function(){
var _212=this.get("container");
var _213=this.get("selectedGateway");
if(!_213){
return;
}
var _214=this.get("model").findGatewayModelByInstanceKey(_213);
var _215=(_214&&_214.get("gatewayConfig"));
var _216=(_215&&_215.get("serviceDefaultsConfig"));
var _217=(_216&&_216.get("acceptOptions"));
this.renderAcceptOptions(_212,_217);
var _218=(_216&&_216.get("mimeMappings"));
this.renderMimeMappings(_212,_218);
var _219=(_215!==undefined&&_215!==null&&((_217===undefined||_217===null||isEmptyObject(_217))&&(_218===undefined||_218===null||isEmptyObject(_218))));
this.renderNoDataMessage(_212,_219);
return this;
},renderNoDataMessage:function(_21a,show){
var _21c=_21a.one("#configServiceDefaultsData");
var _21d=_21c.one("#configServiceDefaultsNoDataSection");
if(!_21d){
var _21e=(this.isCluster()?"No service defaults have been specified for this cluster member.":"No service defaults have been specified for this gateway.");
_21d=createDIV(_21c,"configServiceDefaultsSection").set("id","configServiceDefaultsNoDataSection").set("text",_21e);
}
if(show){
_21d.removeClass("hidden");
}else{
_21d.addClass("hidden");
}
},renderAcceptOptions:function(_21f,_220){
var _221=_21f.one("#configServiceDefaultsData");
var _222=_221.one("#configServiceDefaultsAcceptOptionsSection");
if(!_222){
_222=createDIV(_221,"configServiceDefaultsSection").set("id","configServiceDefaultsAcceptOptionsSection");
var _223=createH(_222,3).set("text","Accept Options");
var _224=createTABLE(_222,"configDataTable").set("id","configServiceDefaultsAcceptOptions");
}
var _225=_221.one("#configServiceDefaultsAcceptOptions");
removeAllChildren(_225);
if(!_220||isEmptyObject(_220)){
_222.addClass("hidden");
return;
}
_222.removeClass("hidden");
var tr,td;
var keys=getSortedKeys(_220);
for(var i=0;i<keys.length;i++){
var key=keys[i];
var _22b=_220[key];
var type=typeOf(_22b);
if(type==="array"){
var str="";
for(var j=0;j<_22b.length;j++){
if(j>0){
str+="<br>";
}
str+=Y.Escape.html(_22b[j]);
}
_22b=str;
}else{
_22b=Y.Escape.html(_22b);
}
tr=createTR(_225);
td=createTD(tr,"configServiceDefaultsDataLabel").set("text",key);
td=createTD(tr,"serviceDefaultsDataValue").setHTML(_22b);
}
},renderMimeMappings:function(_22f,_230){
var _231=_22f.one("#configServiceDefaultsData");
var _232=_231.one("#configServiceDefaultsMimeMappingsSection");
if(!_232){
_232=createDIV(_231,"configServiceDefaultsSection").set("id","configServiceDefaultsMimeMappingsSection");
var _233=createH(_232,3).set("text","MIME Mappings");
var _234=createTABLE(_232,"configDataTable").set("id","configServiceDefaultsMimeMappings");
}
var _235=_231.one("#configServiceDefaultsMimeMappings");
removeAllChildren(_235);
if(_230===undefined||_230===null||isEmptyObject(_230)){
_232.addClass("hidden");
return;
}
_232.removeClass("hidden");
var tr,td,_238,th;
_238=createTHEAD(_235);
th=createTH(_238,"configServiceDefaultsDataLabel").set("text","Extension");
th=createTH(_238,"configServiceDefaultsDataLabel").set("text","MIME Type");
var keys=getSortedKeys(_230);
for(var i=0;i<keys.length;i++){
var key=keys[i];
var _23d=_230[key];
tr=createTR(_235);
td=createTD(tr,"configServiceDefaultsDataLabel").set("text",key);
td=createTD(tr,"serviceDefaultsDataValue").set("text",_23d);
}
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#configServiceDefaultsContainer");
}},title:{value:"Configuration : Service Defaults"},selectedGateway:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","service-defaults-config-model"]});
YUI.add("config-services-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="configServicesView";
Y.ConfigServicesView=Y.Base.create(NAME,Y.KaazingView,[],{initializer:function(){
var _241=this.get("model");
_241&&_241.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
return this;
},doDisplaySetup:function(){
if(this.get("firstTime")){
this.after("selectedServiceConfigChange",this.afterSelectedServiceConfigChange,this);
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
this.updateClusterServiceConfigs();
this.set("firstTime",false);
}
this.render();
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.updateClusterServiceConfigs();
this.render();
},onGatewayAvailable:function(ev){
this.updateClusterServiceConfigs();
this.render();
},afterStopTimeChange:function(ev){
this.updateClusterServiceConfigs();
this.render();
},afterSelectedServiceConfigChange:function(ev){
this.render();
},updateClusterServiceConfigs:function(){
var _247=this.buildServiceConfigList();
this.set("clusterServiceConfigs",_247);
},buildServiceConfigList:function(){
var _248=[];
var i,j,k;
var _24c=this.get("model").getUsableGateways();
if(_24c&&_24c.length>0){
for(i=0;i<_24c.length;i++){
var _24d=_24c[i];
var _24e=_24d.get("gatewayConfig");
var _24f=_24e.get("serviceConfigs");
if(!_24f){
continue;
}
_24f.forEach(function(_250){
var _251=false;
for(k=0;k<_248.length;k++){
var _252=_248[k];
if(_250.equals(_252[0])){
_251=true;
_252.push(_250);
break;
}
}
if(!_251){
_248.push([_250]);
}
});
}
_248.sort(function(_253,_254){
var _255=_253[0];
var _256=_254[0];
return _255.sortCompare(_256);
});
}
return _248;
},render:function(){
if(this.isActiveView()){
removeAllChildren(this.get("container").one("#configServicesData"));
this.renderToolbar();
this.renderData();
}
return this;
},renderToolbar:function(){
var _257=this;
var _258=this.get("clusterServiceConfigs");
var _259=this.get("toolbar");
removeAllChildren(_259);
var _25a=createSELECT(_259,"toolbarSelect");
var _25b=createOPTION(_25a,null,"Select a service...").set("selected",false);
if(_258&&_258.length>0){
_258.sort(function(_25c,_25d){
var l1=_25c[0].get("label").toLowerCase();
var l2=_25d[0].get("label").toLowerCase();
if(l1==l2){
return 0;
}else{
return (l1<l2?-1:1);
}
});
var ssc=this.get("selectedServiceConfig");
for(var i=0;i<_258.length;i++){
var _262=_258[i];
var _263=_262[0];
var _264=_263.get("label");
_25b=createOPTION(_25a,null,_264);
if(_263.equals(ssc)){
_25b.set("selected",true);
}
}
_25a.after("change",function(ev){
var _266=ev.target;
var _267=_266.get("selectedIndex");
if(_267<=0){
if(_257.get("selectedServiceConfig")!==null){
_257.set("selectedServiceConfig",null);
}
return;
}
var _268=null;
var _269=_257.get("clusterServiceConfigs");
if(_269&&_269.length>=_267){
var _26a=_269[_267-1];
if(_26a.length>0){
_268=_26a[0];
}
}
if(_257.get("selectedServiceConfig")!==_268){
_257.set("selectedServiceConfig",_268);
}
});
}else{
if(this.get("selectedServiceConfig")!==null){
this.set("selectedServiceConfig",null);
}
}
},renderData:function(){
var _26b=this.get("container");
var _26c=_26b.one("#configServicesData");
removeAllChildren(_26c);
var ssc=this.get("selectedServiceConfig");
if(!ssc){
return;
}
var _26e=Y.one(Y.config.doc.createDocumentFragment());
_26e.append(this.renderDetails(ssc));
_26e.append(this.renderAcceptData(ssc));
_26e.append(this.renderCrossSiteConstraints(ssc));
_26e.append(this.renderConnectData(ssc));
_26e.append(this.renderNotifyData(ssc));
_26e.append(this.renderProperties(ssc));
_26e.append(this.renderAuthorizationConstraints(ssc));
_26e.append(this.renderMimeMappings(ssc));
_26c.append(_26e);
return this;
},renderDetails:function(ssc){
var _270=this;
var _271=Y.one(Y.config.doc.createDocumentFragment());
var _272=createDIV(_271,"configServicesSection");
var _273=createH(_272,3).setHTML("Service: <SPAN class=\"configServicesServiceName\">"+ssc.get("label")+"</SPAN>");
var _274=createTABLE(_272);
var _275=this.get("clusterServiceConfigs");
var _276;
for(var j=0;j<_275.length;j++){
_276=_275[j];
if(_276[0].equals(ssc)){
break;
}
}
var _278=[];
var _279;
for(var j=0;j<_276.length;j++){
_279=_276[j].get("gatewayModel");
if(_278.indexOf(_279)==-1){
_278.push(_279);
}
}
var _27a=_278.map(function(elt,_27c,arr){
return elt.get("gatewayLabel");
}).sort().join(", ");
var tr=createTR(_274);
var td=createTD(tr,"configServicesDetailLabel").set("text","Defined In:");
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_27a));
tr=createTR(_274);
td=createTD(tr,"configServicesDetailLabel").set("text","Type:");
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(ssc.get("type")));
tr=createTR(_274);
td=createTD(tr,"configServicesDetailLabel").set("text","Security Realm:");
var _280=ssc.get("realm");
td=createTD(tr,"servicesDataValue");
if(_280){
var _279=ssc.get("gatewayModel");
var link=createLINK(td,"javascript:void(0)").setHTML(this.createValueHtml(_280.get("name")));
link.on("click",(function(_282,_283){
return function(ev){
ev.halt(true);
_270.get("app").save("/config/security/realms?connectionUrl="+_282+"&realm="+_283);
};
})(_279.get("connectionUrl"),_280.get("name")));
}else{
td.setHTML(this.createValueHtml("<none>"));
}
return _271;
},renderAcceptData:function(ssc){
var _286=this;
var _287=(ssc&&ssc.get("accepts"));
var _288=(ssc&&ssc.get("acceptOptions"));
var _289=!isEmptyValue(_287);
var _28a=!isEmptyValue(_288);
if(!_289&&!_28a){
return;
}
var _28b=Y.one(Y.config.doc.createDocumentFragment());
var _28c=createDIV(_28b,"configServicesSection");
var _28d=createH(_28c,3).set("text","Accepts");
if(_289){
var _28e=createDIV(_28c);
_28d=createH(_28e,4).set("text","URLs");
var _28f=createTABLE(_28e,"configDataTable");
for(var i=0;i<_287.length;i++){
var tr=createTR(_28f);
var td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_287[i]));
}
}
if(_28a){
var _293=createDIV(_28c);
_28d=createH(_293,4).set("text","Options");
var _28f=createTABLE(_293,"configDataTable");
var keys=getSortedKeys(_288);
for(var i=0;i<keys.length;i++){
var key=keys[i];
var _296=_288[key];
var type=typeOf(_296);
var str;
if(type==="array"){
str=_296.map(function(elt,_29a,arr){
return _286.createValueHtml(elt);
}).join("<BR>");
}else{
if(type==="object"){
var _29c=[];
for(var prop in _296){
if(_296.hasOwnProperty(prop)){
_29c.push(prop);
}
}
if(_29c.length===0){
str="";
}else{
_29c.sort();
str=_29c.map(function(elt,_29f,arr){
return "<b>"+_286.createValueHtml(elt)+":</b> "+_286.createValueHtml(_296[elt]);
}).join("<BR>");
}
}else{
str=this.createValueHtml(_296);
}
}
var tr=createTR(_28f);
var td=createTD(tr,"configServicesDataLabel").set("text",key);
td=createTD(tr,"servicesDataValue").setHTML(str);
}
}
return _28b;
},renderConnectData:function(ssc){
var _2a2=(ssc&&ssc.get("connects"));
var _2a3=(ssc&&ssc.get("connectOptions"));
var _2a4=!isEmptyValue(_2a2);
var _2a5=!isEmptyValue(_2a3);
if(!_2a4&&!_2a5){
return;
}
var _2a6=Y.one(Y.config.doc.createDocumentFragment());
var _2a7=createDIV(_2a6,"configServicesSection");
var _2a8=createH(_2a7,3).set("text","Connect");
if(_2a4){
var _2a9=createDIV(_2a7);
_2a8=createH(_2a9,4).set("text","URLs");
var _2aa=createTABLE(_2a9,"configDataTable");
for(var i=0;i<_2a2.length;i++){
var tr=createTR(_2aa);
var td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2a2[i]));
}
}
if(_2a5){
var _2ae=createDIV(_2a7);
_2a8=createH(_2ae,4).set("text","Options");
var _2aa=createTABLE(_2ae,"configDataTable");
var keys=getSortedKeys(_2a3);
for(var i=0;i<keys.length;i++){
var key=keys[i];
var _2b1=_2a3[key];
tr=createTR(_2aa);
td=createTD(tr,"configServicesDataLabel").set("text",key);
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2b1));
}
}
return _2a6;
},renderNotifyData:function(ssc){
var _2b3=(ssc&&ssc.get("notifys"));
var _2b4=(ssc&&ssc.get("notifyOptions"));
var _2b5=!isEmptyValue(_2b3);
var _2b6=!isEmptyValue(_2b4);
if(!_2b5&&!_2b6){
return;
}
var _2b7=Y.one(Y.config.doc.createDocumentFragment());
var _2b8=createDIV(_2b7,"configServicesSection");
var _2b9=createH(_2b8,3).set("text","Notify");
if(_2b5){
var _2ba=createDIV(_2b8);
_2b9=createH(_2ba,4).set("text","URLs");
var _2bb=createTABLE(_2ba,"configDataTable");
for(var i=0;i<_2b3.length;i++){
var tr=createTR(_2bb);
var td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2b3[i]));
}
}
if(_2b6){
var _2bf=createDIV(_2b8);
_2b9=createH(_2bf,4).set("text","Options");
var _2bb=createTABLE(_2bf,"configDataTable");
var keys=getSortedKeys(_2b4);
for(var i=0;i<keys.length;i++){
var key=keys[i];
var _2c2=_2b4[key];
var tr=createTR(_2bb);
var td=createTD(tr,"configServicesDataLabel").set("text",key);
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2c2));
}
}
_2b7;
},renderProperties:function(ssc){
var _2c4=(ssc&&ssc.get("properties"));
if(isEmptyValue(_2c4)){
return;
}
var _2c5=Y.one(Y.config.doc.createDocumentFragment());
var _2c6=createDIV(_2c5,"configServicesSection");
var _2c7=createH(_2c6,3).set("text","Properties");
var _2c8=createTABLE(_2c6,"configDataTable");
var keys=getSortedKeys(_2c4);
for(var i=0;i<keys.length;i++){
var key=keys[i];
var _2cc=_2c4[key];
if(typeOf(_2cc)!=="array"){
_2cc=[_2cc];
}
for(var j=0;j<_2cc.length;j++){
var tr=createTR(_2c8);
var td=createTD(tr,"configServicesDataLabel").set("text",key);
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2cc[j]));
}
}
return _2c5;
},renderCrossSiteConstraints:function(ssc){
var _2d1=(ssc&&ssc.get("crossSiteConstraints"));
if(isEmptyValue(_2d1)){
return;
}
var _2d2=Y.one(Y.config.doc.createDocumentFragment());
var _2d3=createDIV(_2d2,"configServicesSection");
var _2d4=createH(_2d3,3).set("text","Cross-Site Constraints");
var _2d5=createTABLE(_2d3,"configDataTable");
var tr,td,th,_2d9;
_2d9=createTHEAD(_2d5);
th=createTH(_2d9,"configServicesDataLabel").set("text","Origin");
th=createTH(_2d9,"configServicesDataLabel").set("text","Methods");
th=createTH(_2d9,"configServicesDataLabel").set("text","Headers");
th=createTH(_2d9,"configServicesDataLabel").set("text","Maximum Age");
for(var i=0;i<_2d1.length;i++){
var _2db="";
var _2dc="";
var _2dd="";
var _2de="";
var _2df=_2d1[i];
for(var _2e0 in _2df){
if(_2e0==="allow-origin"){
_2db=_2df[_2e0];
}else{
if(_2e0==="allow-methods"){
_2dc=_2df[_2e0];
}else{
if(_2e0==="allow-headers"){
_2dd=_2df[_2e0];
}else{
if(_2e0==="maximum-age"){
_2de=_2df[_2e0];
}
}
}
}
}
tr=createTR(_2d5);
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2db));
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2dc));
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2dd));
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2de));
}
return _2d2;
},renderAuthorizationConstraints:function(ssc){
var _2e2=(ssc&&ssc.get("requiredRoles"));
if(isEmptyValue(_2e2)){
return;
}
var _2e3=Y.one(Y.config.doc.createDocumentFragment());
var _2e4=createDIV(_2e3,"configServicesSection");
var _2e5=createH(_2e4,3).set("text","Authorization Constraints");
var _2e6=createTABLE(_2e4,"configDataTable");
for(var i=0;i<_2e2.length;i++){
var _2e8=_2e2[i].trim();
var tr=createTR(_2e6);
var _2ea;
if(_2e8==="*"){
_2ea="require-valid-user";
_2e8="";
}else{
_2ea="required-role";
}
var td=createTD(tr,"configServicesDataLabel").set("text",_2ea);
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2e8));
}
return _2e3;
},renderMimeMappings:function(ssc){
var _2ed=(ssc&&ssc.get("mimeMappings"));
if(isEmptyValue(_2ed)){
return;
}
var _2ee=Y.one(Y.config.doc.createDocumentFragment());
var _2ef=createDIV(_2ee,"configServicesSection");
var _2f0=createH(_2ef,3).set("text","MIME Mappings");
var _2f1=createTABLE(_2ef,"configDataTable");
var tr,td,_2f4,th;
_2f4=createTHEAD(_2f1);
th=createTH(_2f4,"configServicesDataLabel").set("text","Extension");
th=createTH(_2f4,"configServicesDataLabel").set("text","MIME Type");
var keys=getSortedKeys(_2ed);
for(var i=0;i<keys.length;i++){
var key=keys[i];
var _2f9=_2ed[key];
tr=createTR(_2f1);
td=createTD(tr,"configServicesDataLabel").setHTML(this.createValueHtml(key));
td=createTD(tr,"servicesDataValue").setHTML(this.createValueHtml(_2f9));
}
return _2ee;
},createValueHtml:function(_2fa){
var _2fb=this;
var str;
var type=typeOf(_2fa);
if(type==="array"){
str=_2fa.map(function(elt,_2ff,arr){
return _2fb.createValueHtml(elt);
}).join("<BR>");
}else{
if(type==="object"){
var _301=[];
for(var prop in _2fa){
if(_2fa.hasOwnProperty(prop)){
_301.push(prop);
}
}
if(_301.length===0){
str="";
}else{
_301.sort();
str=_301.map(function(elt,_304,arr){
return "<b>"+_2fb.createValueHtml(elt)+":</b> "+_2fb.createValueHtml(_2fa[elt]);
}).join("<BR>");
}
}else{
str=Y.Escape.html(_2fa);
}
}
return str;
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#configServicesViewContainer");
}},title:{value:"Configuration : Services"},toolbar:{value:null},clusterServiceConfigs:{value:null},selectedServiceConfig:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","service-config-model"]});
YUI.add("dashboard-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="dashboardView",_309="dashboardData",_30a=1.2,_30b=250,_30c=1,_30d="kaazingCommandCenterCharts",_30e=6000,_30f=60000,_310=300000;
var _311="Scrolling",_312="Default Charts",_313="Connected to a cluster",_314="Connected to a single gateway";
var _315="<img src=\"../images/pause.png\"/>",_316="<img src=\"../images/play.png\"/>";
var _317=1,_318=0,_319=-1;
var _31a=false;
Y.DashboardView=Y.Base.create(NAME,Y.KaazingView,[],{MODEL_CHANGE_EVENT:NAME+"modelChange",BOUNDS_CHANGE_EVENT:NAME+"boundsChange",ADD_CHART_EVENT:NAME+"addChart",DELETE_CHART_EVENT:NAME+"deleteChart",RESIZE_EVENT:NAME+"resize",TOGGLE_CHART_SIZE_EVENT:NAME+"toggleChartSize",SHOW_GATEWAY_CHANGE_EVENT:NAME+"showGatewayChange",initializer:function(){
_31a=(navigator.userAgent.toLowerCase().indexOf("webkit")>=0);
var _31b=this.get("model");
_31b.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},onChartDragFn:function(){
},onChartDragEnd:function(ev){
var drag=ev.target;
var data=drag.get("data");
if(data.hit!==true){
ev.preventDefault();
}
delete data.hit;
},onChartDropHit:function(ev){
var _320=this.get("charts");
var drag=ev.drag;
var _322=drag.get("data").chart;
var _323=_320.indexOf(_322);
var drop=ev.drop;
var _325=drop.get("data").chart;
var _326=_320.indexOf(_325);
if(_323!=_326-1){
var _327=_322.get("container");
var _328=_325.get("container");
var _329=_327.get("parentNode");
_329.removeChild(_327);
_329.insertBefore(_327,_328);
_327.setStyle("left","auto");
_327.setStyle("top","auto");
drag.get("data").hit=true;
_320.splice(_323,1);
_320.splice(_323<_326?(_326-1):_326,0,_322);
this.computeAndStoreChartList();
}
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.fire(this.MODEL_CHANGE_EVENT,{});
},afterConnectionUrlChange:function(ev){
if(this.isActiveView()){
this.renderOverallInfo();
this.renderLegend();
}
},onGatewayAvailable:function(ev){
if(this.isActiveView()){
this.renderOverallInfo();
this.renderLegend();
}
},afterStopTimeChange:function(ev){
if(this.isActiveView()){
this.renderOverallInfo();
this.renderLegend();
}
},afterWindowResize:function(){
if(this.isActiveView()){
var _32e=this.get("charts");
if(_32e&&_32e.length>0){
var _32f=this.getMaximizedChart();
this.adjustChartSizes(_32f?1:_32e.length);
this.fire(this.RESIZE_EVENT,{});
}
}
},afterLastDisplayableTimeChange:function(ev){
var _331=ev.prevVal;
var _332=ev.newVal;
var _333=this.get("xDomainClip");
if(!_333){
return;
}
if(_331==null||this.get("scrolling")){
var _334=[_333[0]+(_332-_333[1]),_332];
this.set("xDomainClip",_334);
this.fire(this.BOUNDS_CHANGE_EVENT,{type:"translate",oldXDomainClip:_333,newXDomainClip:_334});
}
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
this.cancelDisplayTimeLoop();
return this;
},doDisplaySetup:function(){
var _336=this;
this.setupToolbar();
this.renderOverallInfo();
this.renderLegend();
if(this.get("firstTime")){
this.publish(this.MODEL_CHANGE_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.BOUNDS_CHANGE_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.ADD_CHART_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.DELETE_CHART_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.RESIZE_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.TOGGLE_CHART_SIZE_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.publish(this.SHOW_GATEWAY_CHANGE_EVENT,{emitFacade:true,broadcast:true,bubbles:true,defaultFn:function(){
},preventedFn:function(){
},stoppedFn:function(){
}});
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
this.after("lastDisplayableTimeChange",this.afterLastDisplayableTimeChange,this);
this.after("scrollingChange",this.afterScrollingChange,this);
Y.after("windowresize",function(){
_336.afterWindowResize();
});
this.after("gatewayModel:connectionUrlChange",this.afterConnectionUrlChange,this);
Y.DD.DDM.on("drag:drag",this.onChartDragFn,this);
Y.DD.DDM.on("drag:end",this.onChartDragEnd,this);
Y.DD.DDM.on("drag:dropmiss",this.onChartDropMiss,this);
Y.DD.DDM.on("drag:drophit",this.onChartDropHit,this);
this.set("firstTime",false);
}
var _337=this.get("charts");
if(!_337){
this.setupChartTimeBounds();
var _338=this.getChartList();
if(_338!==""){
if(_338==null){
_338=this.getDefaultChartList();
}
var _339=false;
for(var i=0;i<_338.length;i++){
if(_338[i].endsWith("+")){
_339=true;
break;
}
}
this.adjustChartSizes(_339?1:_338.length);
var _337=[];
this.set("charts",_337);
var _33b=this.get("container").one(".dashboardCharts");
for(var i=0;i<_338.length;i++){
var _33c=_338[i];
var _33d=_33c.endsWith("+");
if(_33d){
_33c=_33c.substring(0,_33c.length-1);
}
var _33e=this.getChartMetadata(_33c);
if(_33e){
var _33f=this.instantiateChart(_33b,_33e,_33d);
_337.push(_33f);
if(_33d||!_339){
_33f.unhide();
}
}else{
alert("Unable to find the chart named '"+_33c+"'");
}
}
this.computeAndStoreChartList();
}
}
if(this.get("scrolling")){
this.startDisplayTimeLoop();
}else{
if(!this.get("lastDisplayableTime")){
this.updateLastDisplayableTime();
}
}
return this;
},setupChartTimeBounds:function(){
var _340=this;
var _341=this.get("model").get("startTime").getTime();
var now=Date.now();
this.set("xDomain",[_341,Date.now()+_310]);
this.set("xDomainClip",[now-_30e-_30f,now-_30e]);
var fn=function(){
_340.extendX();
};
this.set("maxChartTimeTimerId",invokeLater(fn,_310-60000,_310));
},adjustChartSizes:function(_344){
var _345,_346,rows;
if(_344<2){
_345=100;
_346=100;
}else{
_345=50;
rows=Math.floor((_344+1)/2);
_346=Math.floor(100/rows);
}
var _348=[_345,_346];
this.set("chartContainerSize",_348);
var _349=this.get("container");
var _34a=_349.one(".dashboardCharts");
var _34b=[parseInt(_34a.getStyle("width")),parseInt(_34a.getStyle("height"))];
var _34c=this.get("chartMargin");
var _34d=4;
var _34e=(26+21);
var _34f=1;
var _350=[(_34b[0]*(_345/100))-(2*(_34d+_34f)),(_34b[1]*(_346/100))-_34e-(_34d*2)];
this.set("chartAreaSize",_350);
var _351=[_350[0]-(_34c.left+_34c.right),_350[1]-(_34c.top+_34c.bottom)];
this.set("chartSize",_351);
var _352=this.get("xDomain");
var _353=this.get("xRange");
var _354=this.get("xDomainClip");
if(!_354){
_353=[0,((_352[1]-_352[0])/_30f)*_351[0]];
this.set("xRange",_353);
_354=[_352[0],_352[0]+_30f];
this.set("xDomainClip",_354);
}else{
_353=[0,((_352[1]-_352[0])/(_354[1]-_354[0]))*_351[0]];
this.set("xRange",_353);
}
this.set("yRange",[0,-_351[1]]);
},render:function(){
var _355=this.get("container");
var _356=_355.one("#dashboardData");
removeAllChildren(_356);
createDIV(_356,"dashboardCharts");
createDIV(_356,"dashboardLegendDiv");
return this;
},setupToolbar:function(){
this.clearToolbar();
this.setupToolbarButtons();
this.setupAddChartSelector();
},clearToolbar:function(){
var _357=this.get("toolbar");
removeAllChildren(_357);
},setupToolbarButtons:function(){
var _358=this.get("toolbar");
var _359=createBUTTON(_358,_311,"toolbarButton").set("id","scrollingButton");
this.set("scrollingButton",_359);
_359.on("click",this.handleToggleScrolling,this);
this.adjustScrollingButton();
var _35a=createBUTTON(_358,_312,"toolbarButton").set("id","showDefaultChartsButton");
_35a.on("click",this.handleShowDefaultCharts,this);
},adjustScrollingButton:function(){
var _35b=this.get("scrollingButton");
if(this.get("scrolling")){
_35b.removeClass("paused");
if(!_35b.hasClass("scrolling")){
_35b.addClass("scrolling");
}
}else{
_35b.removeClass("scrolling");
if(!_35b.hasClass("paused")){
_35b.addClass("paused");
}
}
},setupAddChartSelector:function(){
var _35c=this.get("toolbar");
var _35d=_35c.one(".dashboardAddChartSelectorDiv");
var _35e;
if(!_35d){
_35d=createDIV(_35c,"dashboardAddChartSelectorDiv");
var span=createSPAN(_35d,"Add Chart:");
var _360=createSPAN(_35d,"");
_360.addClass("dashboardAddChartSelectorSpan");
_35e=createSELECT(_360,"toolbarSelect");
_35e.on("change",this.handleAddChart,this);
}else{
_35e=_35d.one("select");
}
_35e.get("childNodes").remove();
var app=this.get("app");
var _362=app.getCharts();
var _363=createOPTION(_35e,null,"Select chart...","");
for(var prop in _362){
if(_362.hasOwnProperty(prop)){
var _365=_362[prop];
var _363=createOPTION(_35e,null,_365[0],prop);
}
}
},renderOverallInfo:function(){
var _366=this.get("model");
var _367=this.get("container").one("#dashboardData");
var _368=_367.one("#dashboardOverall");
if(!_368){
_368=createDIV(_367).set("id","dashboardOverall");
}
removeAllChildren(_368);
var _369=_366.get("numRunning");
var div=createDIV(_368,"title");
if(this.isCluster()){
var _36b=_366.get("numQuarantined");
var _369=_366.get("numRunning");
var _36c=_36b+_369;
div.set("text",_313);
div=createDIV(_368,"label").set("text","Members: ");
div=createDIV(_368,"value").set("text",_36c);
div=createDIV(_368,"label").set("text","Quarantined: ");
div=createDIV(_368,"value").set("text",_36b);
div=createDIV(_368,"label").set("text","Running: ");
div=createDIV(_368,"value").set("text",_369);
}else{
div.set("text",_314);
}
},renderLegend:function(){
var _36d=this;
var _36e=this.get("container");
var _36f=_36e.one(".dashboardLegendDiv");
removeAllChildren(_36f);
var _370=createDIV(_36f,"dashboardLegendLabel").set("text","Legend");
var _371=createDIV(_36f,"dashboardLegendInstructions");
var _372=this.get("model");
if(_372.get("isCluster")){
_371.set("text","Click on a cluster member below to show or hide that "+"member's data in all charts");
}else{
_371.set("text","Click on the gateway below to show or hide its "+"data in all charts");
}
var _373=this.createImageCheckbox(_36f,null,"dashboardLegendSelectAll","Select All",function(ev){
var _375=ev._currentTarget;
_36d.handleShowGatewaySelectAll(_375);
});
var _376=this.get("showGatewayList");
if(!_376){
this.updateImageCheckbox(_373,_317);
}else{
if(_376.length==0){
this.updateImageCheckbox(_373,_318);
}else{
this.updateImageCheckbox(_373,_319);
}
}
var _372=this.get("model");
var _377=_372.getSortedGateways();
if(_377){
var _378=null;
for(var i=0;i<_377.length;i++){
var _37a=_377[i];
var url=_37a.get("connectionUrl");
if(!url){
break;
}
if(url!==_378){
var _370=_37a.get("gatewayLabel");
var _37c=this.isShowGateway(url);
var _37d=this.getColor(_37a.get("connectionUrl"));
var _37e=this.createImageCheckbox(_36f,null,"dashboardLegendGateway",_370,(function(url){
return function(ev){
var _381=ev._currentTarget;
_36d.handleShowGatewaySelect(_381,url);
};
})(url));
_37e.setStyle("color",_37d.toString());
this.updateImageCheckbox(_37e,(_37c?_317:_318));
_378=url;
}
}
}
},createImageCheckbox:function(_382,_383,_384,_385,_386){
var div=createDIV(_382,"dashboardCheckbox");
if(_383){
div.set("id",_383);
}
if(_384){
div.addClass(_384);
}
var _388=createLABEL(div);
createSPAN(_388,_385);
var _389=createINPUT(_388,"checkbox");
_389.on("click",_386,this);
return div;
},updateImageCheckbox:function(_38a,_38b){
var _38c=_38a.get("children").item(0);
var _38d=_38c.one("input");
_38c.removeClass("none");
_38c.removeClass("all");
_38c.removeClass("some");
setCheckboxState(_38d._node,_38b);
if(_38b===0){
_38c.addClass("none");
}else{
if(_38b===1){
_38c.addClass("all");
}else{
_38c.addClass("some");
}
}
},handleShowGatewaySelect:function(_38e,_38f){
var _390=this.get("model");
var _391=Y.one(_38e.parentNode.parentNode);
this.updateImageCheckbox(_391,checkboxState(_38e));
var _392=this.get("container").one(".dashboardLegendSelectAll");
var _393=this.get("showGatewayList");
var _394=_390.getGateways();
if(this.isShowGateway(_38f)){
if(!_393){
_393=[];
for(var i=0;i<_394.length;i++){
var _396=_394[i].get("connectionUrl");
if(_396&&_393.indexOf(_396)<0&&_396!==_38f){
_393.push(_396);
}
}
}else{
_393.splice(_393.indexOf(_38f),1);
}
this.updateImageCheckbox(_392,(_393.length==0?0:-1));
}else{
_393.push(_38f);
var _397=false;
for(var i=0;i<_394.length;i++){
var _398=_394[i];
if(_393.indexOf(_398.get("connectionUrl"))<0){
_397=true;
break;
}
}
if(!_397){
_393=null;
}
this.updateImageCheckbox(_392,(!_393?1:-1));
}
this.set("showGatewayList",_393);
this.fire(this.SHOW_GATEWAY_CHANGE_EVENT,{});
},handleShowGatewaySelectAll:function(_399){
var _39a=this;
var _39b=checkboxState(_399);
this.set("showGatewayList",(_39b==0?[]:null));
var _39c=this.get("container");
var _39d=_39c.one(".dashboardLegendDiv");
var _39e=_39d.all(".dashboardCheckbox");
_39e.each(function(_39f){
_39a.updateImageCheckbox(_39f,_39b);
});
this.fire(this.SHOW_GATEWAY_CHANGE_EVENT,{});
},handleShowDefaultCharts:function(){
var _3a0=this.get("charts");
if(_3a0){
for(var i=0;i<_3a0.length;i++){
_3a0[i].destroy({remove:true});
}
this.set("charts",null);
}
this.removeChartList();
this.render();
this.doDisplaySetup();
},handleAddChart:function(ev){
var _3a3=ev.target;
var _3a4=_3a3.get("value");
_3a3.set("selectedIndex",0);
var _3a5=this.getChartMetadata(_3a4);
if(_3a5){
var _3a6=this.get("charts");
if(!_3a6){
_3a6=[];
}
var _3a7=_3a6.length+1;
this.adjustChartSizes(_3a7);
var _3a8=this.instantiateChart(this.getChartsDiv(),_3a5,false);
_3a6.push(_3a8);
this.set("charts",_3a6);
this.fire(this.ADD_CHART_EVENT,{chart:_3a8});
this.computeAndStoreChartList();
}
},handleDeleteChart:function(_3a9){
var _3aa=this.get("charts");
var _3ab=_3aa.indexOf(_3a9);
if(_3ab>=0){
_3aa.splice(_3ab,1);
}
_3a9.destroy({remove:true});
var _3ac=_3aa.length;
this.adjustChartSizes(_3ac);
this.fire(this.DELETE_CHART_EVENT);
this.computeAndStoreChartList();
},handleToggleChartSize:function(_3ad){
var _3ae=this.get("charts");
if(_3ad.isMaximized()){
this.adjustChartSizes(_3ae.length);
this.fire(this.TOGGLE_CHART_SIZE_EVENT,{maximizedChart:null});
}else{
this.adjustChartSizes(1);
this.fire(this.TOGGLE_CHART_SIZE_EVENT,{maximizedChart:_3ad});
}
this.computeAndStoreChartList();
},afterScrollingChange:function(){
this.adjustScrollingButton();
if(this.get("scrolling")){
var _3af=Date.now()-_30e;
var _3b0=this.get("xDomainClip")[1];
this.startDisplayTimeLoop();
this.translateByTime(_3af-_3b0);
}else{
this.cancelDisplayTimeLoop();
}
},handleToggleScrolling:function(){
var _3b1=this.get("scrolling");
if(!_3b1){
var _3b2=this.get("lastDisplayableTime");
var _3b3=this.get("xDomainClip");
var _3b4=[_3b2-_30f,_3b2];
this.set("xDomainClip",_3b4);
var _3b5=this.get("chartSize");
var _3b6=this.get("xDomain");
var _3b7=[0,((_3b6[1]-_3b6[0])/_30f)*_3b5[0]];
this.set("xRange",_3b7);
this.fire(this.BOUNDS_CHANGE_EVENT,{type:"translate",oldXDomainClip:_3b3,newXDomainClip:_3b4});
}
this.set("scrolling",!_3b1);
},instantiateChart:function(_3b8,_3b9,_3ba){
var _3bb=this.get("chartContainerSize");
var div=createDIV(_3b8,"dashboardChart").setStyle("width",_3bb[0]+"%").setStyle("height",_3bb[1]+"%");
var _3bd=_3b9[0];
var _3be=_3b9[1];
var _3bf=new _3be({model:this.get("model"),dashboard:this,container:div,chartId:_30c++,title:_3bd,maximized:_3ba});
return _3bf;
},getMaximizedChart:function(){
var _3c0=this.get("charts");
if(_3c0){
for(var i=0;i<_3c0.length;i++){
var _3c2=_3c0[i];
if(_3c2.isMaximized()){
return _3c2;
}
}
}
return null;
},isShowGateway:function(_3c3){
var _3c4=this.get("showGatewayList");
return (!_3c4||_3c4.indexOf(_3c3)>=0);
},startDisplayTimeLoop:function(){
var _3c5=this;
this.cancelDisplayTimeLoop();
var fn=function(){
_3c5.updateLastDisplayableTime();
};
fn();
var _3c7=invokeLater(fn,_30b,_30b);
this.set("displayLoopTimer",_3c7);
},cancelDisplayTimeLoop:function(){
var _3c8=this.get("displayLoopTimer");
if(_3c8){
clearInterval(_3c8);
this.set("displayLoopTimer",null);
}
},computeAndStoreChartList:function(){
var _3c9=this.get("charts");
if(!_3c9){
this.removeChartList();
}else{
var _3ca=(_3c9.length==0?"":_3c9.map(function(_3cb){
var name=_3cb.name;
return (_3cb.isMaximized()?name+"+":name);
}).join(","));
this.storeChartList(_3ca);
}
},storeChartList:function(_3cd){
localStorage.setItem(_30d,_3cd);
},getChartList:function(){
var _3ce=localStorage.getItem(_30d);
if(_3ce==""){
return "";
}else{
if(!_3ce){
return null;
}else{
return _3ce.split(",");
}
}
},getChartMetadata:function(_3cf){
var _3d0=this.get("app").getChart(_3cf);
return _3d0;
},getDefaultChartList:function(){
var _3d1=this.get("app").DEFAULT_CHART_LIST;
return _3d1;
},removeChartList:function(){
localStorage.removeItem(_30d);
},getChartsDiv:function(){
var _3d2=this.get("container").one(".dashboardCharts");
return _3d2;
},getColor:function(_3d3){
var _3d4=this.get("gatewayColors");
var val=_3d4(_3d3);
return val;
},updateLastDisplayableTime:function(){
this.set("lastDisplayableTime",Date.now()-_30e);
},translateByTime:function(_3d6){
var _3d7=this.get("xDomainClip");
var _3d8=this.get("lastDisplayableTime");
if(_3d7[1]+_3d6>_3d8){
_3d6=_3d8-_3d7[1];
}
if(_3d6!==0){
var _3d9=[_3d7[0]+_3d6,_3d7[1]+_3d6];
this.set("xDomainClip",_3d9);
this.fire(this.BOUNDS_CHANGE_EVENT,{type:"translate",oldXDomainClip:_3d7,newXDomainClip:_3d9});
}
},translateByPixels:function(_3da){
var _3db=this.get("xDomain");
var _3dc=this.get("xRange");
var x0=invertX(0,_3db,_3dc);
var x1=invertX(_3da,_3db,_3dc);
this.translateByTime(x1-x0);
},scale:function(_3df){
var _3e0=this.get("xDomain");
var _3e1=this.get("xRange");
var _3e2=this.get("xDomainClip");
var _3e3=(_3df>0?_30a:1/_30a);
var _3e4=[_3e1[0]*_3e3,_3e1[1]*_3e3];
var _3e5=_3e2[1]-_3e2[0];
var _3e6=_3e5/_3e3;
var _3e7=[_3e2[0]+_3e5/2-_3e6/2,_3e2[1]-_3e5/2+_3e6/2];
var _3e8=this.get("lastDisplayableTime");
if(_3e7[1]>_3e8){
_3e7[0]-=(_3e7[1]-_3e8);
_3e7[1]=_3e8;
}
this.set("xRange",_3e4);
this.set("xDomainClip",_3e7);
this.fire(this.BOUNDS_CHANGE_EVENT,{type:"scale",scaleFactor:_3e3,oldXRange:_3e1,newXRange:_3e4,oldXDomainClip:_3e2,newXDomainClip:_3e7});
},extendX:function(){
var _3e9=this.get("xDomain");
var _3ea=this.get("xRange");
var t0=_3e9[0];
var t1=_3e9[1];
var t2=_3e9[1]+_310;
var _3ee=(t2-t0)/(t1-t0);
var x0=_3ea[0];
var x1=_3ea[1];
var _3f1=(x1-x0)*_3ee+x0;
_3e9[1]=t2;
this.set("xDomain",_3e9);
_3ea[1]=_3f1;
this.set("xRange",_3ea);
},isTimeVisible:function(_3f2){
var _3f3=this.get("xDomainClip");
return (_3f2>=_3f3[0]&&_3f2<=_3f3[1]);
},startPanningOrZooming:function(){
this.set("scrolling",false);
},endPanningOrZooming:function(){
var _3f4=this.get("lastDisplayableTime");
var _3f5=this.get("xDomainClip");
if(Math.abs(_3f4-_3f5[1])<2000){
this.set("scrolling",true);
}
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#dashboardViewContainer");
}},toolbar:{value:null},title:{value:"Dashboard"},chartMargin:{value:{top:10,right:20,bottom:25,left:45}},scrolling:{value:true},chartContainerSize:{value:null},chartAreaSize:{value:null},chartSize:{value:null},charts:{value:null},showGatewayList:{value:null},xTicks:{value:12},maxChartTimeTimerId:{value:null},xDomain:{value:null},xDomainClip:{value:null},xRange:{value:null},yRange:{value:null},lastDisplayableTime:{value:null},displayLoopTimer:{value:null},firstTime:{value:true},gatewayColors:{valueFn:function(){
var _3f6=["#F47D31","#3A6F8F","#FF0000","#48FF48","#0000FF","#OOFFFF","#7FFFD4","#FF7F50","#006400","#DAA520","#CD5C5C","#90EE90","#3CB371","#DDA0DD","#4169E1"];
var _3f7=-1;
var _3f8={};
return function(_3f9){
var val=_3f8[_3f9];
if(val){
return val;
}
val=_3f6[++_3f7];
_3f8[_3f9]=val;
return val;
};
}}}});
},"0.99",{requires:["kaazing-view","cluster-model","gateway-model","dashboard-chart"]});
YUI.add("gateway-config-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="gatewayConfigView";
Y.GatewayConfigView=Y.Base.create(NAME,Y.View,[],{initializer:function(){
var _3fe=this;
var _3ff=this.get("model");
var _400=_3ff.get("gatewayConfig");
var _401=this.get("realmConfigViews");
var _402=_400.get("realmConfigs");
if(_402){
for(var i=0;i<_402.length;i++){
var _404=_402[i];
_401.push(new Y.GatewayRealmConfigView({model:_404,app:this.get("app")}));
}
}
var _405=this.get("noRealmServiceConfigViews");
var _406=_400.get("serviceConfigs");
if(_406){
for(var i=0;i<_406.length;i++){
var _407=_406[i];
if(!_407.get("realm")){
_405.push(new Y.GatewayServiceConfigView({model:_407,app:this.get("app")}));
}
}
}
},destructor:function(){
this.destroySubviews();
},render:function(){
var _408=Y.one(Y.config.doc.createDocumentFragment());
var _409=this.get("modelList");
var _40a=_409.item(0);
var _40b=createDIV(_408,"graphicRealm");
var _40c=createDIV(_40b,"graphicRealmTitleDiv");
var icon=createIMG(_40c,"../images/castle3.png","graphicRealmImage");
var _40e=createSPAN(_40c,"Realm: ","graphicRealmTitle");
var _40f=createSPAN(_40c,_40a.get("name"),"graphicRealmTitleName");
var _410=this.get("clusterServiceConfigViews");
var _411=_410.length;
if(_411===0){
var div=createDIV(_40b,"graphicNoServiceRealm").set("text","No services refer to this realm");
}else{
var _413=_410.slice();
_413.sort(function(a,b){
var _416=a.get("modelList").item(0);
var _417=b.get("modelList").item(0);
return _416.sortCompare(_417);
});
for(var i=0;i<_411;i++){
var _419=_413[i];
_40b.append(_419.render().get("container"));
}
}
this.get("container").setHTML(_408);
return this;
},sortCompare:function(_41a){
var _41b=this.get("modelList").item(0);
var _41c=_41a.get("modelList").item(0);
return _41b.sortCompare(_41c);
}},{ATTRS:{container:{value:null},app:{value:null},model:{value:null},realmConfigViews:{value:[]},noRealmServiceConfigViews:{value:[]}}});
},"0.99",{requires:["view","gateway-config-model"]});
YUI.add("gateway-realm-config-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="gatewayRealmConfigView";
Y.GatewayRealmConfigView=Y.Base.create(NAME,Y.View,[],{initializer:function(){
$this.after("showUrlsChange",$this.afterShowUrlsChange,$this);
},afterShowUrlsChange:function(ev){
},render:function(){
var _421=this;
var _422=_421.get("container");
removeAllChildren(_422);
return realmBox;
}},{ATTRS:{container:{value:null},app:{value:null},showUrls:{value:false}}});
},"0.99",{requires:["view","realm-config-model"]});
YUI.add("gateway-service-config-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="gatewayServiceConfigView";
Y.GatewayServiceConfigView=Y.Base.create(NAME,Y.View,[],{IMAGE_HEIGHT:24,IMAGE_SEPARATION:8,OUTER_SPACE:25,initializer:function(){
var _426=this;
_426.after("showUrlsChange",_426.afterShowUrlsChange,_426);
},afterShowUrlsChange:function(ev){
this.render();
},render:function(){
var _428=this;
var _429=Y.one(Y.config.doc.createDocumentFragment());
var scm=this.get("model");
var _42b=createDIV(_429,"graphicServiceContainer");
var _42c=createDIV(_42b,"graphicService");
var type=scm.get("type");
var _42e=CC.Constants.SERVICE_DISPLAY_INFO[type];
var _42f=_42e.cssServiceType;
if(!_42f){
_42f="unknown-service";
}
_42c.addClass(_42f);
var _430=_42e.image;
if(_430){
var img=createIMG(_42c,_430,"graphicServiceTypeImage");
}
var _432=scm.get("accepts");
var _433=scm.get("connects");
var _434=scm.get("balances");
var _435=(_432?_432.length:0);
var _436=(_433?_433.length:0);
var _437=(_434?_434.length:0);
var _438;
if(_437>0){
_438=(_437>_436?_437:_436);
}else{
_438=(_435>_436?_435:_436);
}
if(_438===0){
_438=1;
}
var _439=(_438*this.IMAGE_HEIGHT)+((_438-1)*this.IMAGE_SEPARATION)+(2*this.OUTER_SPACE);
_42c.setStyle("height",""+_439+"px");
var _43a=scm.get("label");
var _43b=createLINK(_42c,"javascript:void(0);","graphicServiceName").setHTML(_43a);
_43b.on("click",(function(scm){
return function(ev){
_428.get("app").save("/config/services?connectionUrl="+scm.get("gatewayModel").get("connectionUrl")+"&serviceId="+scm.get("serviceId"));
};
})(scm));
var _43e=createDIV(_42c,"graphicServiceTypeName").setHTML(scm.get("type"));
this.renderAccepts((_437>0?_434:_432),_42c);
this.renderConnects(_433,_42c);
var _43f=this.get("warning");
if(_43f&&_43f.length>0){
this.renderWarning(_42c,_43f);
}
this.get("container").setHTML(_429);
return this;
},renderAccepts:function(urls,_441){
if(urls){
for(var i=0;i<urls.length;i++){
var url=urls[i];
var _444=url.indexOf(":");
var _445=url.substring(0,_444).toLowerCase();
var top=this.OUTER_SPACE+(i*(this.IMAGE_HEIGHT+this.IMAGE_SEPARATION));
var _447=createDIV(_441,"graphicServiceAcceptContainer").setStyle("top",top).setAttribute("title",url);
var _448=CC.Constants.TLS_SSL_IMAGES[_445];
if(_448){
img=createIMG(_447,_448,"graphicServiceAcceptLock");
}
if(this.get("showUrls")){
var _44a=createDIV(_447,"graphicServiceAcceptUrl").set("text",url).addClass(_445+"Protocol");
}
var _44b=CC.Constants.PROTOCOL_DISPLAY_INFO[_445];
var _448=_44b.forwardIcon;
var img=createIMG(_447,_448,"graphicServiceAccept");
var _44c=createDIV(_447,"clear");
}
}
},renderConnects:function(_44d,_44e){
if(_44d){
for(var i=0;i<_44d.length;i++){
var _450=_44d[i];
var _451=_450.indexOf(":");
var _452=_450.substring(0,_451);
var top=this.OUTER_SPACE+(i*(this.IMAGE_HEIGHT+this.IMAGE_SEPARATION));
var _454=createDIV(_44e,"graphicServiceConnectContainer").setStyle("top",top).setAttribute("title",_450);
var _455=CC.Constants.PROTOCOL_DISPLAY_INFO[_452];
var _456=_455.forwardIcon;
var img=createIMG(_454,_456,"graphicServiceConnect");
if(this.get("showUrls")){
var _458=createDIV(_454,"graphicServiceConnectUrl").set("text",_450).addClass(_452+"Protocol");
}
_456=CC.Constants.TLS_SSL_IMAGES[_452];
if(_456){
img=createIMG(_454,_456,"graphicServiceConnectLock");
}
var _459=createDIV(_454,"clear");
}
}
},renderWarning:function(_45a,_45b){
var img=createIMG(_45a,CC.Constants.WARNING_IMAGE,"graphicServiceWarningIcon").setAttribute("alt","Warning").setAttribute("title",_45b);
}},{ATTRS:{container:{value:null},app:{value:null},model:{value:null},showUrls:{value:false},warning:{value:null}}});
},"0.99",{requires:["view","service-config-model"]});
"use strict";
function defineJVMView(Y){
Y.JVMView=Y.Base.create("jvmView",Y.View,[],{events:{"#jvmTable button":{click:"handleGraphButtonClick"},"#jvmTable input[type=button]":{click:"handleGraphButtonClick"}},initializer:function(){
var _45e=this;
_45e.set("container","#jvmInfo");
var _45f=_45e.get("model");
_45f&&_45f.addTarget(_45e);
var _460=this.get("gatewayView");
_460.after("modelChange",_45e.afterGWModelChange,_45e);
_45e.after("modelChange",_45e.afterModelChange,_45e);
_45e.after("modelList:add",_45e.afterAdd,_45e);
},afterGWModelChange:function(e){
if(e.newVal){
var _462=e.newVal;
this.set("model",_462.get("jvmContainer"));
}else{
this.set("model",null);
}
},afterModelChange:function(e){
e.prevVal&&e.prevVal.removeTarget(this);
e.newVal&&e.newVal.addTarget(this);
this.render();
},afterAdd:function(e){
this.render();
},render:function(){
var _465=this.get("model");
var _466=(_465?_465.getInstance(-1):null);
var _467=this.get("renderFieldMap");
for(var _468 in _467){
var _469=(_466?_466.get(_467[_468]):"");
replaceTextValue("#"+_468,_469);
}
return this;
},handleGraphButtonClick:function(e){
var _46b=e.target.get("id");
var _46c=_46b.substring(3,_46b.indexOf("Button"));
_46c=_46c.substring(0,1).toLowerCase()+_46c.substring(1);
var _46d=this.get("gatewayView");
var _46e=_46d.get("graphView");
_46e.setTarget({modelList:this.get("model").getInstanceList(),graphAttributeName:_46c});
}},{ATTRS:{gatewayView:{value:null},renderFieldMap:{value:{jvmGatewayIdValue:"gatewayId",jvmClassesLoadedValue:"classesLoaded",jvmTotalClassesLoadedValue:"totalClassesLoaded",jvmTotalClassesUnloadedValue:"totalClassesUnloaded",jvmThreadingLiveThreadsValue:"threadingLiveThreads",jvmThreadingPeakThreadsValue:"threadingPeakThreads",jvmThreadingTotalThreadsValue:"threadingTotalThreads",jvmMemHeapInitSizeValue:"memHeapInitSize",jvmMemHeapUsedValue:"memHeapUsed",jvmMemHeapCommittedValue:"memHeapCommitted",jvmMemHeapMaxSizeValue:"memHeapMaxSize",jvmMemNonHeapInitSizeValue:"memNonHeapInitSize",jvmMemNonHeapUsedValue:"memNonHeapUsed",jvmMemNonHeapCommittedValue:"memNonHeapCommitted",jvmMemNonHeapMaxSizeValue:"memNonHeapMaxSize"}}}});
};
YUI.add("kaazing-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="kaazingView";
Y.KaazingView=Y.Base.create(NAME,Y.View,[],{isActiveView:function(){
var app=this.get("app");
return app.isActiveView(this);
},isInDoc:function(){
var _473=this.get("container");
return (_473.inDoc());
},hasLoggedIn:function(){
var app=this.get("app");
return app.hasLoggedIn();
},isCluster:function(){
var app=this.get("app");
return app.isCluster();
}},{ATTRS:{app:{value:null},title:{value:null,},toolbar:{value:null}}});
},"0.99",{requires:["view","command-center"]});
YUI.add("monitor-gateways-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="monitorGatewaysView",_479=0;
Y.MonitorGatewaysView=Y.Base.create(NAME,Y.KaazingView,[],{initializer:function(){
var _47a=this.get("model");
_47a&&_47a.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},doDisplaySetup:function(){
if(this.get("firstTime")){
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.on(Y.ServiceDynamicDataModel.prototype.UPDATE_EVENT,this.onUpdateService,this);
this.after("gatewayModel:stopTimeChange",this.afterStopTimeChange,this);
var _47c=new AndFilter();
_47c.addFilter(new NumericFilter("stopTime","UNSET",""));
this.set("filter",_47c);
this.after("filterChange",this.afterFilterChange,this);
var data=new Y.ModelList({model:Y.GatewayModel});
var _47e=[{key:"hostAndPID",label:"Host&nbsp;:&nbsp;PID<br>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:70,className:"monitorGatewaysHostAndPID"},{key:"startTime",label:"Start<br>Time",sortable:true,allowHTML:true,emptyCellValue:"",width:70,formatter:function(o){
return formatTableTime(o,"startTime");
},sortFn:function(a,b,desc){
return compareNumbers(a.get("startTime"),b.get("startTime"),desc,0);
},className:"monitorGatewaysStartTime"},{key:"stopTime",label:"Stop<br>Time",sortable:true,allowHTML:true,emptyCellValue:"",width:70,formatter:function(o){
return formatTableTime(o,"stopTime");
},sortFn:function(a,b,desc){
return compareNumbers(a.get("stopTime"),b.get("stopTime"),desc,0);
},className:"monitorGatewaysStartTime"},{key:"totalCurrentSessions",label:"Current<br>Sessions",sortable:true,allowHTML:false,emptyCellValue:"",width:70,formatter:function(o){
var _488=o.record;
return formatNumber(_488.get("totalCurrentSessions"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalCurrentSessions"),b.get("totalCurrentSessions"),desc,0);
},className:"monitorGatewaysCurrentSessions"},{key:"totalBytesReceived",label:"Bytes<br>Read",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _48d=o.record;
return memorySizeString(_48d.get("totalBytesReceived"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalBytesReceived"),b.get("totalBytesReceived"),desc,0);
},className:"monitorGatewaysBytesReceived"},{key:"totalBytesSent",label:"Bytes<br>Written",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _492=o.record;
return memorySizeString(_492.get("totalBytesSent"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalBytesSent"),b.get("totalBytesSent"),desc,0);
},className:"monitorGatewaysBytesSent"}];
var _496=new Y.DataTable({columns:_47e,data:data,recordType:Y.GatewayModel,editable:false,highlightMode:"row",selectionMode:"row",selectionMulti:false});
_496.set("strings.emptyMessage","No gateways meet your selected criteria");
this.set("dataTable",_496);
this.adjustForClusterColumn();
this.doSearch();
_496.render("#monitorGatewaysResults");
this.set("firstTime",false);
}
this.setupToolbar();
},buildFilterFieldDefinitions:function(){
var _497=this;
var _498=[["hostAndPID","Host : PID","alpha"],["startTime","Start Time","numeric"],["stopTime","Stop Time","numeric"],["totalCurrentSessions","Current Sessions","numeric"],["totalBytesReceived","Bytes Read","numeric"],["totalBytesSent","Bytes Written","numeric"]];
if(this.isCluster()){
_498.push(["gatewayLabel","Cluster Member","alpha"]);
}
_498.sort(function(a,b){
var _49b=a[1];
var _49c=b[1];
if(_49b<_49c){
return -1;
}else{
return (_49b===_49c?0:1);
}
});
_497.set("filterFieldDefinitions",_498);
return _498;
},adjustForClusterColumn:function(){
var _49d=this.get("dataTable");
if(_49d){
var _49e=_49d.get("columns");
if(this.isCluster()){
if(_49e[_479].key!=="gatewayLabel"){
_49e.splice(_479,0,{key:"gatewayLabel",label:"Cluster<br>Member",sortable:true,allowHTML:true,emptyCellValue:"",width:60,formatter:function(o){
var _4a0=o.record;
return _4a0.get("gatewayLabel");
},className:"monitorGatewaysGateway"});
_49d.set("columns",_49e);
}
}else{
if(_49e[_479].key==="gatewayLabel"){
_49e.splice(_479,1);
_49d.set("columns",_49e);
}
}
}
},initContextMenu:function(_4a1){
var _4a2=this;
var _4a3=new Y.ContextMenuView({container:Y.Node.create("<div id=\"cmenuView\" class=\"cmenu\" tabindex=\"1\"></div>"),app:this.get("app"),menuItemTemplate:"<div class=\"yui3-contextmenu-menuitem\" data-cmenu=\"{menuIndex}\">{menuContent}</div>",menuItems:[{label:"Shut down",value:"i",handler:_4a2.handleShutDownGateway}],trigger:{node:_4a1.get("srcNode").one("table .yui3-datatable-data"),target:"tr"}});
_4a3.after("selectedMenuChange",_4a2.selectedContextMenuItem,_4a2);
_4a3.after("contextTargetChange",function(e){
var tar=e.newVal,_4a6=e.prevVal||null;
if(_4a6){
_4a6.removeClass("selectTr");
}
if(tar){
tar.addClass("selectTr");
}
});
_4a3.on("contextMenuHide",function(){
var tar=this.get("contextTarget");
if(tar){
tar.removeClass("selectTr");
}
});
_4a2.set("cmenu",_4a3);
},selectedContextMenuItem:function(ev){
var _4a9=this.get("dataTable");
var _4aa=this.get("cmenu");
var tr=_4aa.get("contextTarget");
var _4ac=tr.getAttribute("data-yui3-record");
var _4ad=_4a9.getRecord(_4ac);
var _4ae=+(ev.newVal.menuIndex);
var _4af=ev.newVal.menuItem;
if(_4af.handler){
setTimeout(function(){
_4af.handler.call(this,_4ad);
},0);
}
},handleShutDownGateway:function(_4b0){
alert("Shutting down a gateway is not currently implemented.");
},setupToolbar:function(){
var _4b1=this.get("toolbar");
this.setupFilters(_4b1);
},setupDisplayMax:function(_4b2){
var _4b3=createLABEL(_4b2,"Display max of ");
var _4b4=this.get("maxRows");
var _4b5=createSELECT(_4b2,"monitorMaxRowsSelect").set("id","gatewaysMaxRowsSelect");
_4b5.on("change",this.onMaxRowsChange,this);
var _4b6=createOPTION(_4b5,null,"10","10");
_4b6=createOPTION(_4b5,null,"50","50");
_4b6=createOPTION(_4b5,null,"100","100");
_4b6=createOPTION(_4b5,null,"500","500");
_4b5.get("options").each(function(){
var _4b7=this.get("value");
if(_4b7==_4b4){
this.set("selected","selected");
}
});
_4b3=createLABEL(_4b2," rows");
},setupFilters:function(_4b8){
var _4b9=createLABEL(_4b8,"Filter: ","filterSelector");
var _4ba=createSELECT(_4b9,"toolbarSelect");
_4ba.on("change",this.onFilterSelectChange,this);
var _4bb=createOPTION(_4ba,null,"Choose...","choose");
_4bb=createOPTION(_4ba,null,"Clear all conditions","clear");
_4bb=createOPTION(_4ba,null,"Running Instances","running");
_4bb=createOPTION(_4ba,null,"Stopped Instances","stopped");
_4bb=createOPTION(_4ba,null,"Edit...","edit");
this.displayFilter();
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.render();
},onGatewayAvailable:function(ev){
this.adjustForClusterColumn();
var _4be=ev.gatewayModel;
var _4bf=this.get("filter");
if(!_4bf||_4bf.match(_4be)){
this.get("dataTable").addRow(_4be,null);
}
},onUpdateService:function(ev){
var _4c1=ev.model;
var _4c2=_4c1.get("serviceModel");
var _4c3=_4c2.get("gatewayModel");
var _4c4=this.get("filter");
var _4c5=this.get("dataTable");
var _4c6=(!_4c4||_4c4.match(_4c3));
var _4c7=_4c5.data.indexOf(_4c3);
if(_4c6){
if(_4c7>=0){
var _4c8={};
var _4c9=["totalCurrentSessions","totalBytesReceived","totalBytesSent"];
for(var i=0;i<_4c9.length;i++){
var _4cb=_4c9[i];
_4c8[_4cb]=_4c3.get(_4cb);
}
_4c5.modifyRow(_4c7,_4c8);
}else{
_4c5.addRow(_4c3,null);
}
}else{
if(_4c7>=0){
_4c5.removeRow(_4c3);
}
}
},afterFilterChange:function(){
this.displayFilter();
this.doSearch();
},afterStopTimeChange:function(ev){
this.adjustForClusterColumn();
var _4cd=ev.target;
var _4ce=this.get("filter");
var _4cf=this.get("dataTable");
var _4d0=(!_4ce||_4ce.match(_4cd));
var _4d1=_4cf.data.indexOf(_4cd);
if(_4d0){
if(_4d1>=0){
_4cf.modifyRow(_4d1,{"stopTime":ev.newVal});
}else{
_4cf.addRow(_4cd,null);
}
}else{
if(_4d1>=0){
_4cf.removeRow(_4cd);
}
}
},onMaxRowsChange:function(e){
var _4d3=parseInt(e.target.get("value"),10);
this.set("maxRows",_4d3);
var _4d4=this.get("dataTable");
if(_4d4.data.size()>_4d3){
}
},onFilterSelectChange:function(e){
var _4d6=e.target.get("value");
switch(_4d6){
case "choose":
break;
case "edit":
this.doFilterDisplay();
e.target.set("selectedIndex",0);
break;
case "clear":
var _4d7=new AndFilter();
this.set("filter",_4d7);
e.target.set("selectedIndex",0);
break;
case "running":
var _4d7=new AndFilter();
_4d7.addFilter(new NumericFilter("stopTime","UNSET",""));
this.set("filter",_4d7);
break;
case "stopped":
var _4d7=new AndFilter();
_4d7.addFilter(new NumericFilter("stopTime","SET",""));
this.set("filter",_4d7);
break;
default:
break;
}
},render:function(){
return this;
},doFilterDisplay:function(){
var _4d8=this;
var _4d9=this.get("fieldFieldDefinitions");
if(!_4d9){
_4d9=this.buildFilterFieldDefinitions();
}
this.get("filterPanel").display(this.get("model"),this.get("filter"),_4d9,function(_4da){
_4d8.set("filter",_4da);
});
},displayFilter:function(){
var _4db=this.get("filter");
var _4dc=Y.one("#monitorGatewaysCurrentFilter");
var _4dd=(_4db?_4db.toString():"none");
if(_4dd===""){
_4dd="none";
}
_4dc.setHTML("<span>Current Filter: </span><span class=\"filterValue\">"+_4dd+"</span>");
},clearFilters:function(){
var _4de=new AndFilter();
this.set("filter",_4de);
},doSearch:function(){
var _4df=this.get("filter");
var _4e0=this.get("model");
var _4e1=_4e0.getGateways();
var _4e2=this.get("dataTable");
if(_4e2.data.size()>0){
_4e2.data.reset();
}
if(_4e1){
for(var i=0;i<_4e1.length;i++){
var _4e4=_4e1[i];
if(!_4df||_4df.match(_4e4)){
_4e2.addRow(_4e4,null);
}
}
}
},findFilters:function(_4e5){
var _4e6=this.get("filter");
return (_4e6?_4e6.findFilters(_4e5):null);
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#monitorGatewaysViewContainer");
}},selectionCriterion:{value:null},title:{value:"Monitoring : Gateways"},maxRows:{value:100},dataTable:{value:null},filterFieldDefinitions:{value:null},filter:{value:null},cmenu:{value:null},filterPanel:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["view","cluster-model","gateway-model","monitor-filter-panel"]});
YUI.add("monitor-services-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="monitorServicesView",_4ea=0;
Y.MonitorServicesView=Y.Base.create(NAME,Y.KaazingView,[],{initializer:function(){
var _4eb=this.get("model");
_4eb&&_4eb.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},hideViewCallback:function(){
return this;
},doDisplaySetup:function(){
if(this.get("firstTime")){
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.on(Y.GatewayModel.prototype.ADD_SERVICE_EVENT,this.onAddService,this);
this.on(Y.GatewayModel.prototype.REMOVE_SERVICE_EVENT,this.onRemoveService,this);
this.on(Y.ServiceDynamicDataModel.prototype.UPDATE_EVENT,this.onUpdateService,this);
this.after("serviceModel:stopTimeChange",this.afterStopTimeChange,this);
var _4ed=new AndFilter();
_4ed.addFilter(new NumericFilter("stopTime","UNSET",""));
this.set("filter",_4ed);
this.after("filterChange",this.afterFilterChange,this);
var data=new Y.ModelList({model:Y.ServiceModel});
var _4ef=[{key:"serviceLabel",label:"Service<br>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:100,formatter:function(o){
var _4f1=o.record;
return _4f1.get("serviceLabel");
},className:"monitorServicesService"},{key:"startTime",label:"Start<br>Time",sortable:true,allowHTML:true,emptyCellValue:"",width:70,formatter:function(o){
return formatTableTime(o,"startTime");
},sortFn:function(a,b,desc){
return compareNumbers(a.get("startTime"),b.get("startTime"),desc,0);
},className:"monitorServicesStartTime"},{key:"stopTime",label:"Stop<br>Time",sortable:true,allowHTML:true,emptyCellValue:"",width:70,formatter:function(o){
return formatTableTime(o,"stopTime");
},sortFn:function(a,b,desc){
return compareNumbers(a.get("stopTime"),b.get("stopTime"),desc,0);
},className:"monitorServicesStopTime"},{label:"Current Sessions",children:[{key:"totalCurrentSessions",label:"Total",sortable:true,allowHTML:true,emptyCellValue:"",width:70,formatter:function(o){
var _4fb=o.record;
return formatNumber(_4fb.get("totalCurrentSessions"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalCurrentSessions"),b.get("totalCurrentSessions"),desc,0);
},className:"monitorServicesTotalCurrentSessions"},{key:"totalCurrentNativeSessions",label:"Native",sortable:true,allowHTML:false,emptyCellValue:"",width:70,formatter:function(o){
var _500=o.record;
return formatNumber(_500.get("totalCurrentNativeSessions"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalCurrentNativeSessions"),b.get("totalCurrentNativeSessions"),desc,0);
},className:"monitorServicesTotalCurrentNativeSessions"},{key:"totalCurrentEmulatedSessions",label:"Emulated",sortable:true,allowHTML:false,emptyCellValue:"",width:70,formatter:function(o){
var _505=o.record;
return formatNumber(_505.get("totalCurrentEmulatedSessions"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalCurrentEmulatedSessions"),b.get("totalCurrentEmulatedSessions"),desc,0);
},className:"monitorServicesTotalCurrentEmulatedSessions"}]},{label:"Cumulative Sessions",children:[{key:"totalCumulativeSessions",label:"Total",sortable:true,allowHTML:false,emptyCellValue:"",width:70,formatter:function(o){
var _50a=o.record;
return formatNumber(_50a.get("totalCumulativeSessions"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalCumulativeSessions"),b.get("totalCumulativeSessions"),desc,0);
},className:"monitorServicesTotalCumulativeSessions"},{key:"totalCumulativeNativeSessions",label:"Native",sortable:true,allowHTML:false,emptyCellValue:"",width:70,formatter:function(o){
var _50f=o.record;
return formatNumber(_50f.get("totalCumulativeNativeSessions"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalCumulativeNativeSessions"),b.get("totalCumulativeNativeSessions"),desc,0);
},className:"monitorServicesTotalCumulativeNativeSessions"},{key:"totalCumulativeEmulatedSessions",label:"Emulated",sortable:true,allowHTML:false,emptyCellValue:"",width:70,formatter:function(o){
var _514=o.record;
return formatNumber(_514.get("totalCumulativeEmulatedSessions"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalCumulativeEmulatedSessions"),b.get("totalCumulativeEmulatedSessions"),desc,0);
},className:"monitorServicesTotalCumulativeEmulatedSessions"}]},{key:"totalBytesReceived",label:"Bytes<br>Read",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _519=o.record;
return memorySizeString(_519.get("totalBytesReceived"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalBytesReceived"),b.get("totalBytesReceived"),desc,0);
},className:"monitorServicesTotalBytesReceived"},{key:"totalBytesReceivedThroughput",label:"Bytes Read<br>Throughput",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _51e=o.record;
return memoryThroughputString(_51e.get("totalBytesReceivedThroughput"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalBytesReceivedThroughput"),b.get("totalBytesReceivedThroughput"),desc,0);
},className:"monitorServicesTotalBytesReceivedThroughput"},{key:"totalBytesSent",label:"Bytes<br>Written",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _523=o.record;
return memorySizeString(_523.get("totalBytesSent"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalBytesSent"),b.get("totalBytesSent"),desc,0);
},className:"monitorServicesTotalBytesSent"},{key:"totalBytesSentThroughput",label:"Bytes Written<br>Throughput",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _528=o.record;
return memoryThroughputString(_528.get("totalBytesSentThroughput"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("totalBytesSentThroughput"),b.get("totalBytesSentThroughput"),desc,0);
},className:"monitorServicesTotalBytesSentThroughput"}];
var _52c=new Y.DataTable({columns:_4ef,data:data,recordType:Y.ServiceModel,editable:false,highlightMode:"row",selectionMode:"row",selectionMulti:false});
_52c.set("strings.emptyMessage","No services meet your selected criteria");
this.set("dataTable",_52c);
this.adjustForClusterColumn();
this.doSearch();
_52c.render("#monitorServicesResults");
this.set("firstTime",false);
}
this.setupToolbar();
},buildFilterFieldDefinitions:function(){
var _52d=this;
var _52e=[["totalBytesReceived","Bytes Read","numeric"],["totalBytesReceivedThroughput","Bytes Read Throughput","numeric"],["totalBytesSent","Bytes Written","numeric"],["totalBytesSentThroughput","Bytes Written Throughput","numeric"],["totalCumulativeEmulatedSessions","Cumul. Emulated Sessions","numeric"],["totalCumulativeNativeSessions","Cumul. Native Sessions","numeric"],["totalCumulativeSessions","Cumul. Total Sessions","numeric"],["totalCurrentEmulatedSessions","Current Emulated Sessions","numeric"],["totalCurrentNativeSessions","Current Native Sessions","numeric"],["totalCurrentSessions","Current Total Sessions","numeric"],["serviceLabel","Service","alpha"],["startTime","Start Time","numeric"],["stopTime","Stop Time","numeric"]];
if(this.isCluster()){
_52e.push(["gatewayLabel","Cluster Member","alpha"]);
}
_52e.sort(function(a,b){
var _531=a[1];
var _532=b[1];
if(_531<_532){
return -1;
}else{
return (_531===_532?0:1);
}
});
this.set("filterFieldDefinitions",_52e);
return _52e;
},adjustForClusterColumn:function(){
var _533=this.get("model");
var _534=this.get("dataTable");
if(_534){
var _535=_534.get("columns");
if(this.isCluster()){
if(_535[_4ea].key!=="gatewayLabel"){
_535.splice(_4ea,0,{key:"gatewayLabel",label:"Cluster<br>Member",sortable:true,allowHTML:true,emptyCellValue:"",width:60,formatter:function(o){
var _537=o.record;
return _537.get("gatewayLabel");
},className:"monitorServicesGateway"});
_534.set("columns",_535);
}
}else{
if(_535[_4ea].key==="gatewayLabel"){
_535.splice(_4ea,1);
_534.set("columns",_535);
}
}
}
},initContextMenu:function(_538){
var _539=this;
var _53a=new Y.ContextMenuView({container:Y.Node.create("<div id=\"cmenuView\" class=\"cmenu\" tabindex=\"1\"></div>"),app:this.get("app"),menuItemTemplate:"<div class=\"yui3-contextmenu-menuitem\" data-cmenu=\"{menuIndex}\">{menuContent}</div>",menuItems:[{label:"Inspect",value:"i",handler:_539.handleInspectService}],trigger:{node:_538.get("srcNode").one("table .yui3-datatable-data"),target:"tr"}});
_53a.after("selectedMenuChange",_539.selectedContextMenuItem,_539);
_53a.after("contextTargetChange",function(e){
var tar=e.newVal,_53d=e.prevVal||null;
if(_53d){
_53d.removeClass("selectTr");
}
if(tar){
tar.addClass("selectTr");
}
});
_53a.on("contextMenuHide",function(){
var tar=this.get("contextTarget");
if(tar){
tar.removeClass("selectTr");
}
});
_539.set("cmenu",_53a);
},selectedContextMenuItem:function(ev){
var _540=this.get("dataTable");
var _541=this.get("cmenu");
var tr=_541.get("contextTarget");
var _543=tr.getAttribute("data-yui3-record");
var _544=_540.getRecord(_543);
var _545=+(ev.newVal.menuIndex);
var _546=ev.newVal.menuItem;
if(_546.handler){
setTimeout(function(){
_546.handler.call(this,_544);
},0);
}
},handleInspectService:function(_547){
},setupToolbar:function(){
var _548=this.get("toolbar");
this.setupFilters(_548);
},setupDisplayMax:function(_549){
var _54a=createLABEL(_549,"Display max of ");
var _54b=this.get("maxRows");
var _54c=createSELECT(_549,"monitorMaxRowsSelect").set("id","servicesMaxRowsSelect");
_54c.on("change",this.onMaxRowsChange,this);
var _54d=createOPTION(_54c,null,"10","10");
_54d=createOPTION(_54c,null,"50","50");
_54d=createOPTION(_54c,null,"100","100");
_54d=createOPTION(_54c,null,"500","500");
_54c.get("options").each(function(){
var _54e=this.get("value");
if(_54e==_54b){
this.set("selected","selected");
}
});
_54a=createLABEL(_549," rows");
},setupFilters:function(_54f){
var _550=createLABEL(_54f,"Filter: ","filterSelector");
var _551=createSELECT(_550,"toolbarSelect");
_551.on("change",this.onFilterSelectChange,this);
var _552=createOPTION(_551,null,"Choose...","choose");
_552=createOPTION(_551,null,"Clear all conditions","clear");
_552=createOPTION(_551,null,"Running Service Instances","running");
_552=createOPTION(_551,null,"Stopped Service Instances","stopped");
_552=createOPTION(_551,null,"Edit...","edit");
this.displayFilter();
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.render();
},onGatewayAvailable:function(ev){
this.adjustForClusterColumn();
var _555=ev.gatewayModel;
var _556=_555.getServices();
if(_556&&_556.length>0){
var _557=this.get("filter");
for(var i=0;i<_556.length;i++){
var _559=_556[i];
if(!_557||_557.match(_559)){
this.get("dataTable").addRow(_559,null);
}
}
}
},onAddService:function(ev){
var _55b=ev.serviceModel;
var _55c=this.get("filter");
if(!_55c||_55c.match(_55b)){
this.get("dataTable").addRow(_55b,null);
}
},onUpdateService:function(ev){
var _55e=ev.model;
var _55f=_55e.get("serviceModel");
var _560=this.get("filter");
var _561=this.get("dataTable");
var _562=(!_560||_560.match(_55f));
var _563=_561.data.indexOf(_55f);
if(_562){
if(_563>=0){
var _564={};
var _565=["totalCurrentSessions","totalCurrentNativeSessions","totalCurrentEmulatedSessions","totalCumulativeSessions","totalCumulativeNativeSessions","totalCumulativeEmulatedSessions","totalBytesReceived","totalBytesSent"];
for(var i=0;i<_565.length;i++){
var _567=_565[i];
_564[_567]=_55f.get(_567);
}
_561.modifyRow(_563,_564);
}else{
_561.addRow(_55f,null);
}
}else{
if(_563>=0){
_561.removeRow(_55f);
}
}
},onRemoveService:function(ev){
var _569=ev.serviceModel;
var _56a=this.get("dataTable");
if(_56a.data.indexOf(_569)>=0){
_56a.removeRow(_569,null);
}
},afterStopTimeChange:function(ev){
this.adjustForClusterColumn();
var _56c=ev.target;
var _56d=this.get("filter");
var _56e=this.get("dataTable");
var _56f=(!_56d||_56d.match(_56c));
var _570=_56e.data.indexOf(_56c);
if(_56f){
if(_570>=0){
_56e.modifyRow(_570,{"stopTime":ev.newVal});
}else{
_56e.addRow(_56c,null);
}
}else{
if(_570>=0){
_56e.removeRow(_56c);
}
}
},afterFilterChange:function(){
this.displayFilter();
this.doSearch();
},onMaxRowsChange:function(e){
var _572=parseInt(e.target.get("value"),10);
this.set("maxRows",_572);
var _573=this.get("dataTable");
if(_573.data.size()>_572){
}
},onFilterSelectChange:function(e){
var _575=e.target.get("value");
switch(_575){
case "choose":
break;
case "edit":
this.doFilterDisplay();
e.target.set("selectedIndex",0);
break;
case "clear":
var _576=new AndFilter();
this.set("filter",_576);
e.target.set("selectedIndex",0);
break;
case "running":
var _576=new AndFilter();
_576.addFilter(new NumericFilter("stopTime","UNSET",""));
this.set("filter",_576);
break;
case "stopped":
var _576=new AndFilter();
_576.addFilter(new NumericFilter("stopTime","SET",""));
this.set("filter",_576);
break;
default:
break;
}
},render:function(){
return this;
},doFilterDisplay:function(){
var _577=this;
var _578=this.get("filterFieldDefinitions");
if(!_578){
_578=this.buildFilterFieldDefinitions();
}
this.get("filterPanel").display(this.get("model"),this.get("filter"),_578,function(_579){
_577.set("filter",_579);
});
},displayFilter:function(){
var _57a=this.get("filter");
var _57b=Y.one("#monitorServicesCurrentFilter");
var _57c=(_57a?_57a.toString():"none");
if(_57c===""){
_57c="none";
}
_57b.setHTML("<span>Current Filter: </span><span class=\"filterValue\">"+_57c+"</span>");
},clearFilters:function(){
var _57d=new AndFilter();
this.set("filter",_57d);
},doSearch:function(){
var _57e=this.get("dataTable");
if(_57e.data.size()>0){
_57e.data.reset({silent:true});
}
var _57f=this.get("model");
var _580=_57f.getGateways();
if(!_580){
return;
}
var _581=this.get("filter");
var _582=(_581&&_581.getSubFilters());
if(_582&&_582.length==0){
_582=null;
}
loopGateways:
for(var i=0;i<_580.length;i++){
var _584=_580[i];
if(_582){
for(var f=0;f<_582.length;f++){
var _586=_582[f];
if(this.isGatewayFilter(_586)){
if(!_586.match(_584)){
continue loopGateways;
}
}
}
}
var _587=_584.getServices();
if(!_587){
continue loopGateways;
}
loopServices:
for(var j=0;j<_587.length;j++){
var _589=_587[j];
if(_582){
for(var f=0;f<_582.length;f++){
var _586=_582[f];
if(!this.isGatewayFilter(_586)){
if(!_586.match(_589)){
continue loopServices;
}
}
}
}
_57e.addRow(_589,null);
}
}
},isGatewayFilter:function(_58a){
return (_58a.attribute==="gatewayLabel");
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#monitorServicesViewContainer");
}},selectionCriterion:{value:null},title:{value:"Monitoring : Services"},maxRows:{value:100},dataTable:{value:null},filterFieldDefinitions:{value:null},filter:{value:null},cmenu:{value:null},filterPanel:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","cluster-model","gateway-model","service-model","monitor-filter-panel"]});
YUI.add("monitor-sessions-view",function(Y){
"use strict";
var Lang=Y.Lang,NAME="monitorSessionsView",_58e=1;
Y.MonitorSessionsView=Y.Base.create(NAME,Y.KaazingView,[],{initializer:function(){
var _58f=this.get("model");
_58f&&_58f.addTarget(this);
this.after("modelChange",this.afterModelChange,this);
this.after("*:loggedInChange",this.afterLoggedInChange,this);
},afterLoggedInChange:function(ev){
return (this.isActiveView()?this.doDisplaySetup():null);
},showViewCallback:function(){
return (this.hasLoggedIn()?this.doDisplaySetup():null);
},doDisplaySetup:function(){
var _591=this;
if(this.get("firstTime")){
this.on(Y.GatewayModel.prototype.GATEWAY_AVAILABLE_EVENT,this.onGatewayAvailable,this);
this.on(Y.GatewayModel.prototype.GATEWAY_UNAVAILABLE_EVENT,this.onGatewayUnavailable,this);
this.on(Y.ServiceModel.prototype.ADD_SESSION_EVENT,this.onAddSession,this);
this.on(Y.ServiceModel.prototype.REMOVE_SESSION_EVENT,this.onRemoveSession,this);
this.on(Y.SessionDynamicDataModel.prototype.UPDATE_EVENT,this.onUpdateSession,this);
this.on(Y.SessionModel.prototype.CLOSE_SESSION_EVENT,this.onCloseSession,this);
var _592=new AndFilter();
_592.addFilter(new NumericFilter("stopTime","UNSET",""));
this.set("filter",_592);
this.after("filterChange",this.afterFilterChange,this);
var data=new Y.ModelList({model:Y.SessionModel});
var _594=[{key:"action",label:"&nbsp;",sortable:false,allowHTML:true,width:20,className:"monitorSessionsAction"},{key:"serviceLabel",label:"Service<br>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:100,className:"monitorSessionsService"},{label:"Meta-data",children:[{key:"sessionId",label:"Id<br>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:50,className:"monitorSessionsSessionId"},{key:"startTime",label:"Start Time<BR>&nbsp;",sortable:true,allowHTML:true,emptyCellValue:"",width:70,formatter:function(o){
return formatTableTime(o,"startTime");
},sortFn:function(a,b,desc){
return compareNumbers(a.get("startTime"),b.get("startTime"),desc,0);
},className:"monitorSessionsStartTime"},{key:"stopTime",label:"Stop Time<BR>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:50,formatter:function(o){
return formatTableTime(o,"stopTime");
},sortFn:function(a,b,desc){
return compareNumbers(a.get("stopTime"),b.get("stopTime"),desc,0);
},className:"monitorSessionsCloseTime"},{key:"sessionTypeName",label:"Type<BR>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _59e=o.record;
var _59f=_59e.get("sessionTypeName");
var val=CC.Constants.PROTOCOL_DISPLAY_INFO[_59f];
if(val){
val=val.label;
}else{
val=_59f;
}
return val;
},className:"monitorSessionsSessionType"},{key:"sessionDirection",label:"Direction<BR>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _5a2=o.record;
return _5a2.get("sessionDirection");
},className:"monitorSessionsSessionDirection"}]},{label:"Performance (bytes)",children:[{key:"readBytes",label:"Read<br>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _5a4=o.record;
return memorySizeString(_5a4.get("readBytes"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("readBytes"),b.get("readBytes"),desc,0);
},className:"monitorSessionsBytesRead"},{key:"readBytesThroughput",label:"Read Thpt<br>(bytes/sec)",sortable:true,allowHTML:false,emptyCellValue:"",width:100,formatter:function(o){
var _5a9=o.record;
return formatFloat(_5a9.get("readBytesThroughput"),3);
},sortFn:function(a,b,desc){
return compareNumbers(a.get("readBytesThroughput"),b.get("readBytesThroughput"),desc,0);
},className:"monitorSessionsBytesReadThpt"},{key:"writtenBytes",label:"Written<br>&nbsp;",sortable:true,allowHTML:false,emptyCellValue:"",width:80,formatter:function(o){
var _5ae=o.record;
return memorySizeString(_5ae.get("writtenBytes"));
},sortFn:function(a,b,desc){
return compareNumbers(a.get("writtenBytes"),b.get("writtenBytes"),desc,0);
},className:"monitorSessionsBytesWritten"},{key:"writtenBytesThroughput",label:"Written Thpt<br>(bytes/sec)",sortable:true,allowHTML:false,emptyCellValue:"",width:100,formatter:function(o){
var _5b3=o.record;
return formatFloat(_5b3.get("writtenBytesThroughput"),3);
},sortFn:function(a,b,desc){
return compareNumbers(a.get("writtenBytesThroughput"),b.get("writtenBytesThroughput"),desc,0);
},className:"monitorSessionsBytesWrittenThpt"}]},{key:"principals",label:"Principals<BR>&nbsp;",sortable:true,allowHTML:true,emptyCellValue:"",width:80,formatter:function(o){
var _5b8=o.record;
var _5b9=_5b8.get("principals");
if(isEmptyObject(_5b9)){
return "";
}
var _5ba="";
for(var _5bb in _5b9){
if(_5b9.hasOwnProperty(_5bb)){
if(_5ba!==""){
_5ba+="<BR>";
}
var _5bc=_5b9[_5bb];
if(_5bc.startsWith("com.kaazing.gateway.server.auth.config.parse")){
_5bc=_5bc.substring(_5bc.lastIndexOf(".")+1);
if(_5bc.startsWith("Default")){
_5bc=_5bc.substring(7);
}
if(_5bc.endsWith("Config")){
_5bc=_5bc.substring(0,_5bc.length-6);
}
}else{
_5bc=_5bc.substring(_5bc.lastIndexOf(".")+1);
}
_5ba+=("<b>"+_5bc+"</b>:&nbsp;&nbsp;"+_5bb);
}
}
return _5ba;
},className:"monitorSessionsPrincipalsType"},];
var _5bd=new Y.DataTable({columns:_594,data:data,recordType:Y.SessionModel,editable:false,highlightMode:"row",selectionMode:"row",selectionMulti:false});
_5bd.set("strings.emptyMessage","No sessions meet your selected criteria");
Y.delegate("click",this.handleActionButton,"#monitorSessionsResults","button.goButton",this);
this.set("dataTable",_5bd);
this.adjustForClusterColumn();
this.doSearch();
_5bd.render("#monitorSessionsResults");
_5bd.set("height",this.desiredDataTableHeight());
Y.one("win").on("resize",function(){
if(_591.isActiveView()){
var _5be=_591.desiredDataTableHeight();
_5bd.set("height",_5be);
}
});
this.set("firstTime",false);
}
this.setupToolbar();
},buildFilterFieldDefinitions:function(){
var _5bf=this;
var _5c0=[["readBytes","Bytes Read","numeric"],["readBytesThroughput","Bytes Read Throughput","numeric"],["writtenBytes","Bytes Written","numeric"],["writtenBytesThroughput","Bytes Written Throughput","numeric"],["sessionTypeName","Session Type","alpha"],["sessionDirection","Session Direction","alpha"],["principals","Principals","alpha"],["localAddress","Local Address","alpha"],["serviceLabel","Service","alpha"],["sessionId","Session Id","numeric"],["startTime","Start Time","numeric"],["stopTime","Stop Time","numeric"]];
if(this.isCluster()){
_5c0.push(["gatewayLabel","Cluster Member","alpha"]);
}
_5c0.sort(function(a,b){
var _5c3=a[1];
var _5c4=b[1];
if(_5c3<_5c4){
return -1;
}else{
return (_5c3===_5c4?0:1);
}
});
this.set("filterFieldDefinitions",_5c0);
return _5c0;
},desiredDataTableHeight:function(){
var _5c5=this.get("container").get("clientHeight");
return _5c5-95;
},handleActionButton:function(ev){
var _5c7=this;
var node=Y.one("#monitorSessionsMenu");
if(!node){
var _5c9=Y.one("html");
node=createDIV(_5c9,"popupMenu").set("id","monitorSessionsMenu");
node.on("mousedownoutside",function(){
this.hide();
});
node.delegate("click",this.handleSessionOperation,"a",this,node);
var ul=createUL(node);
var li=createLI(ul);
var link=createLINK(li,"#").set("text","Close Session").setAttribute("command","close");
}
node.setStyle("left",ev.clientX+10).setStyle("top",ev.clientY);
node.setAttribute("instanceKey",ev.target.getAttribute("instanceKey"));
node.setAttribute("serviceId",ev.target.getAttribute("serviceId"));
node.setAttribute("sessionId",ev.target.getAttribute("sessionId"));
node.show();
},handleSessionOperation:function(ev,node){
ev.stopPropagation();
Y.one("#monitorSessionsMenu").hide();
if(!confirm("Are you sure you want to close the selected session?")){
return;
}
var _5cf=node.getAttribute("instanceKey");
var _5d0=parseInt(node.getAttribute("serviceId"));
var _5d1=parseInt(node.getAttribute("sessionId"));
var _5d2=ev.target.getAttribute("command");
var _5d3=this.get("model");
var _5d4=_5d3.findGatewayModelByInstanceKey(_5cf);
if(!_5d4){
alert("Could not find the selected gateway!");
return;
}
if(_5d2==="close"){
_5d4.get("mngtApi").closeSession(_5d0,_5d1);
}else{
alert("unknown command '"+_5d2+"' selected");
}
},adjustForClusterColumn:function(){
var _5d5=this.get("model");
var _5d6=this.get("dataTable");
if(_5d6){
var _5d7=_5d6.get("columns");
if(this.isCluster()){
if(_5d7[_58e].key!=="gatewayLabel"){
_5d7.splice(_58e,0,{key:"gatewayLabel",label:"Cluster<br>Member",sortable:true,allowHTML:true,emptyCellValue:"",width:100,formatter:function(o){
var _5d9=o.record;
return _5d9.get("gatewayLabel");
},className:"monitorSessionsGateway"});
_5d6.set("columns",_5d7);
}
}else{
if(_5d7[_58e].key==="gatewayLabel"){
_5d7.splice(_58e,1);
_5d6.set("columns",_5d7);
}
}
}
},handleCloseSession:function(_5da){
if(confirm("Are you sure you want to close session ID "+_5da.get("sessionId")+"?")){
_5da.startClose();
}
},handleInspectSession:function(_5db){
},setupToolbar:function(){
var _5dc=this.get("toolbar");
this.setupFilters(_5dc);
},setupDisplayMax:function(_5dd){
var _5de=createLABEL(_5dd,"Display max of ");
var _5df=this.get("maxRows");
var _5e0=createSELECT(_5dd,"monitorMaxRowsSelect").set("id","sessionsMaxRowsSelect");
_5e0.on("change",this.onMaxRowsChange,this);
var _5e1=createOPTION(_5e0,null,"10","10");
_5e1=createOPTION(_5e0,null,"50","50");
_5e1=createOPTION(_5e0,null,"100","100");
_5e1=createOPTION(_5e0,null,"500","500");
_5e0.get("options").each(function(){
var _5e2=this.get("value");
if(_5e2==_5df){
this.set("selected","selected");
}
});
_5de=createLABEL(_5dd," rows");
},setupFilters:function(_5e3){
var _5e4=createLABEL(_5e3,"Filter: ","filterSelector");
var _5e5=createSELECT(_5e4,"toolbarSelect");
_5e5.on("change",this.onFilterSelectChange,this);
var _5e6=createOPTION(_5e5,null,"Choose...","choose");
_5e6=createOPTION(_5e5,null,"Clear all conditions","clear");
_5e6=createOPTION(_5e5,null,"Open Sessions","open");
_5e6=createOPTION(_5e5,null,"Closed Sessions","closed");
_5e6=createOPTION(_5e5,null,"Edit...","edit");
this.displayFilter();
},afterModelChange:function(ev){
ev.prevVal&&ev.prevVal.removeTarget(this);
ev.newVal&&ev.newVal.addTarget(this);
this.render();
},onGatewayAvailable:function(ev){
this.adjustForClusterColumn();
var _5e9=ev.gatewayModel;
var _5ea=_5e9.getServices();
if(_5ea&&_5ea.length>0){
var _5eb=this.get("filter");
for(var i=0;i<_5ea.length;i++){
var _5ed=_5ea[i];
var _5ee=_5ed.getSessions();
if(_5ee&&_5ee.length>0){
for(var j=0;j<_5ee.length;j++){
var _5f0=_5ee[j];
if(!_5eb||_5eb.match(_5f0)){
this.addRow(_5f0,null);
}
}
}
}
}
},onGatewayUnavailable:function(ev){
this.adjustForClusterColumn();
},onAddSession:function(ev){
var _5f3=ev.sessionModel;
var _5f4=this.get("filter");
if(!_5f4||_5f4.match(_5f3)){
this.addRow(_5f3,null);
}
},onUpdateSession:function(ev){
var _5f6=ev.model;
var _5f7=_5f6.get("sessionModel");
var _5f8=this.get("filter");
var _5f9=this.get("dataTable");
var _5fa=(!_5f8||_5f8.match(_5f7));
var _5fb=_5f9.data.indexOf(_5f7);
if(_5fa){
if(_5fb>=0){
var _5fc={};
var _5fd=["readBytes","readBytesThroughput","writtenBytes","writtenBytesThroughput"];
for(var i=0;i<_5fd.length;i++){
var _5ff=_5fd[i];
_5fc[_5ff]=_5f7.get(_5ff);
}
this.modifyRow(_5fb,_5fc);
}else{
this.addRow(_5f7,null);
}
}else{
if(_5fb>=0){
this.removeRow(_5f7);
}
}
},onCloseSession:function(ev){
var _601=ev.sessionModel;
var _602=this.get("filter");
var _603=this.get("dataTable");
var _604=(!_602||_602.match(_601));
var _605=_603.data.indexOf(_601);
if(_604){
if(_605>=0){
this.modifyRow(_605,{state:_601.get("state")});
}else{
this.addRow(_601,null);
}
}else{
if(_605>=0){
this.removeRow(_601);
}
}
},onRemoveSession:function(ev){
var _607=ev.sessionModel;
var _608=this.get("dataTable");
if(_608.data.indexOf(_607)>=0){
this.removeRow(_607,null);
}
},afterFilterChange:function(){
this.displayFilter();
this.doSearch();
},onMaxRowsChange:function(e){
var _60a=parseInt(e.target.get("value"),10);
this.set("maxRows",_60a);
var _60b=this.get("dataTable");
if(_60b.data.size()>_60a){
}
},onFilterSelectChange:function(e){
var _60d=e.target.get("value");
switch(_60d){
case "choose":
break;
case "edit":
this.doFilterDisplay();
e.target.set("selectedIndex",0);
break;
case "clear":
var _60e=new AndFilter();
this.set("filter",_60e);
e.target.set("selectedIndex",0);
break;
case "open":
var _60e=new AndFilter();
_60e.addFilter(new NumericFilter("stopTime","UNSET",""));
this.set("filter",_60e);
break;
case "closed":
var _60e=new AndFilter();
_60e.addFilter(new NumericFilter("stopTime","SET",""));
this.set("filter",_60e);
break;
default:
break;
}
},render:function(){
return this;
},doFilterDisplay:function(){
var _60f=this;
var _610=this.get("fieldFieldDefinitions");
if(!_610){
_610=this.buildFilterFieldDefinitions();
}
this.get("filterPanel").display(this.get("model"),this.get("filter"),_610,function(_611){
_60f.set("filter",_611);
});
},displayFilter:function(){
var _612=this.get("filter");
var _613=Y.one("#monitorSessionsCurrentFilter");
var _614=(_612?_612.toString():"none");
if(_614===""){
_614="none";
}
_613.setHTML("<span>Current Filter: </span><span class=\"filterValue\">"+_614+"</span>");
},clearFilters:function(){
var _615=new AndFilter();
this.set("filter",_615);
},doSearch:function(){
var _616=this.get("dataTable");
if(_616.data.size()>0){
_616.data.reset({silent:true});
}
var _617=this.get("model");
var _618=_617.getGateways();
if(!_618){
return;
}
var _619=this.get("filter");
var _61a=(_619&&_619.getSubFilters());
if(_61a&&_61a.length==0){
_61a=null;
}
loopGateways:
for(var i=0;i<_618.length;i++){
var _61c=_618[i];
if(_61a){
for(var f=0;f<_61a.length;f++){
var _61e=_61a[f];
if(this.isGatewayFilter(_61e)){
if(!_61e.match(_61c)){
continue loopGateways;
}
}
}
}
var _61f=_61c.getServices();
if(!_61f){
continue loopGateways;
}
loopServices:
for(var j=0;j<_61f.length;j++){
var _621=_61f[j];
if(_61a){
for(var f=0;f<_61a.length;f++){
var _61e=_61a[f];
if(this.isServiceFilter(_61e)){
if(!_61e.match(_621)){
continue loopServices;
}
}
}
}
var _622=_621.getSessions();
if(!_622){
continue loopServices;
}
loopSessions:
for(var k=0;k<_622.length;k++){
var _624=_622[k];
if(_61a){
for(var f=0;f<_61a.length;f++){
var _61e=_61a[f];
if(!this.isGatewayFilter(_61e)&&!this.isServiceFilter(_61e)){
if(!_61e.match(_624)){
continue loopSessions;
}
}
}
}
this.addRow(_624,null);
}
}
}
},addRow:function(_625,_626){
this.get("dataTable").addRow(_625,_626);
var i=0;
},modifyRow:function(_628,_629){
this.get("dataTable").modifyRow(_628,_629);
},removeRow:function(_62a){
this.get("dataTable").removeRow(_62a);
},isGatewayFilter:function(_62b){
return (_62b.attribute==="gatewayLabel");
},isServiceFilter:function(_62c){
return (_62c.attribute==="serviceLabel");
}},{ATTRS:{container:{valueFn:function(){
return Y.one("#monitorSessionsViewContainer");
}},selectionCriterion:{value:null},title:{value:"Monitoring : Sessions"},maxRows:{value:100},dataTable:{value:null},filterFieldDefinitions:{value:null},filter:{value:null},filterPanel:{value:null},firstTime:{value:true}}});
},"0.99",{requires:["kaazing-view","cluster-model","gateway-model","service-model","session-model","monitor-filter-panel"]});
