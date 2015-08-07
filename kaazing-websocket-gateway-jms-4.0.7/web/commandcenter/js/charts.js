/**
 * Copyright (c) 2007-2014, Kaazing Corporation. All rights reserved.
 */

YUI.add("cpu-all-perc-chart",function(Y){
"use strict";
var _2=Y.Lang,_3="cpuAllPercChart";
Y.CpuAllPercChart=Y.Base.create(_3,Y.DashboardChart,[],{initializer:function(){
var _4=this;
var _5=_4.get("model");
_5&&_5.addTarget(_4);
_4.on(Y.CpuListModel.prototype.UPDATE_EVENT,_4.onCpuListUpdate,_4);
},onCpuListUpdate:function(ev){
var _7=this.get("dashboard");
var _8=false;
var _9=ev.model;
var _a=_9.get("gatewayModel");
var _b=this.get("dataItemValues");
var _c=_a.get("instanceKey");
var _d=ev.data;
var _e=_d.length;
if(_e==0){
return;
}
var _f=_b[_c];
if(!_f){
_f=[];
for(var i=0;i<_d.length;i++){
_f.push([]);
}
_b[_c]=_f;
_8=true;
}
var _11=this.get("combinedIndex");
var _12=this.get("readTimeIndex");
if(_11==null){
_12=_a.summaryAttributeIndex("cpuList","readTime");
_11=_a.summaryAttributeIndex("cpuList","combined");
this.set("readTimeIndex",_12);
this.set("combinedIndex",_11);
}
var _13=this.get("yDomain");
var _14=this.get("valuesMultiplier");
var _15;
var _16={domainMin:_13[0],domainMax:_13[1],valuesMultiplier:_14};
var _17=ev.data[0][_12];
for(var _18=0;_18<_e;_18++){
_15=_d[_18][_11];
_16=this.computeDomainBounds(_15,_16.domainMin,_16.domainMax,_16.valuesMultiplier);
insertChartValue(_f[_18],_17,_15);
if(_7.isTimeVisible(_17)){
_8=true;
}
}
if(_16.domainMin!==_13[0]||_16.domainMax!==_13[1]||_16.valuesMultiplier!==_14){
this.set("yDomain",[_16.domainMin,_16.domainMax]);
this.set("valuesMultiplier",_16.valuesMultiplier);
_8=true;
}
this.adjustTitle();
this.adjustSummary();
if(_8){
this.drawChart();
}
},getDataItems:function(){
var _19=this.get("model");
var _1a=[];
var _1b=this.get("dataItemValues");
for(var _1c in _1b){
if(_1b.hasOwnProperty(_1c)){
var _1d=_19.findGatewayModelByInstanceKey(_1c);
if(this.isShowGateway(_1d)){
var _1e=_1d.get("cpuListModel");
var _1f=_1e.get("numCpus");
for(var j=0;j<_1f;j++){
_1a.push([_1c,j]);
}
}
}
}
return _1a;
},getDataItemValues:function(_21){
var _22=_21[0];
var _23=_21[1];
var _24=this.get("dataItemValues");
var _25=_24[_22];
return (!_25?[]:_25[_23]);
},computeSummaryHtml:function(){
var _26=this.get("dashboard");
var val=minMaxAverageMultipleSummaryFn(this.get("dataItemValues"),this.get("valuesMultiplier"),_26.get("xDomainClip")[1]);
return val;
},getDataItemColor:function(_28){
var _29=this.get("model").findGatewayModelByInstanceKey(_28[0]);
return this.get("dashboard").getColor(_29.get("connectionUrl"));
},dataItemsEqual:function(_2a,_2b){
var val=(_2a[0]===_2b[0]&&_2a[1]===_2b[1]);
return val;
}},{ATTRS:{title:{value:null},valueType:{value:"percentage"},showUnits:{value:false},dataItemValues:{value:{}},combinedIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
YUI.add("cpu-avg-perc-chart",function(Y){
"use strict";
var _2e=Y.Lang,_2f="cpuAvgPercChart";
Y.CpuAvgPercChart=Y.Base.create(_2f,Y.DashboardChart,[],{initializer:function(){
var _30=this;
var _31=_30.get("model");
_31&&_31.addTarget(_30);
_30.on(Y.CpuListModel.prototype.UPDATE_EVENT,_30.onCpuListUpdate,_30);
},onCpuListUpdate:function(ev){
var _33=this.get("dashboard");
var _34=false;
var _35=ev.model;
var _36=_35.get("gatewayModel");
var _37=this.get("dataItemValues");
var _38=_36.get("instanceKey");
var _39=ev.data;
var _3a=_37[_38];
if(!_3a){
_3a=[];
_37[_38]=_3a;
_34=true;
}
var _3b=this.get("combinedIndex");
var _3c=this.get("readTimeIndex");
if(_3b==null){
_3c=_36.summaryAttributeIndex("cpuList","readTime");
_3b=_36.summaryAttributeIndex("cpuList","combined");
this.set("readTimeIndex",_3c);
this.set("combinedIndex",_3b);
}
var _3d=_39.length;
var _3e=0;
for(var _3f=0;_3f<_3d;_3f++){
_3e+=_39[_3f][_3b];
}
if(_3d>0){
_3e=_3e/_3d;
}
var _40=ev.data[0][_3c];
var _41=this.get("yDomain");
var _42=this.get("valuesMultiplier");
var _43=this.computeDomainBounds(_3e,_41[0],_41[1],_42);
if(_43.domainMin!==_41[0]||_43.domainMax!==_41[1]||_43.valuesMultiplier!==_42){
this.set("yDomain",[_43.domainMin,_43.domainMax]);
this.set("valuesMultiplier",_43.valuesMultiplier);
_34=true;
}
insertChartValue(_3a,_40,_3e);
if(_33.isTimeVisible(_40)){
_34=true;
}
this.adjustTitle();
this.adjustSummary();
if(_34){
this.drawChart();
}
},getDataItems:function(){
var _44=this.get("model");
var _45=[];
var _46=this.get("dataItemValues");
for(var _47 in _46){
if(_46.hasOwnProperty(_47)){
if(this.isShowGateway(_44.findGatewayModelByInstanceKey(_47))){
_45.push(_47);
}
}
}
return _45;
},getDataItemValues:function(_48){
var _49=this.get("dataItemValues")[_48];
return (!_49?[]:_49);
},computeSummaryHtml:function(){
var _4a=this.get("dashboard");
var val=minMaxAverageSummaryFn(this.get("dataItemValues"),this.get("valuesMultiplier"),_4a.get("xDomainClip")[1]);
return val;
},getDataItemColor:function(_4c){
var _4d=this.get("model").findGatewayModelByInstanceKey(_4c);
return this.get("dashboard").getColor(_4d.get("connectionUrl"));
},dataItemsEqual:function(_4e,_4f){
return (_4e===_4f);
}},{ATTRS:{title:{value:null},valueType:{value:"percentage"},showUnits:{value:false},dataItemValues:{value:{}},combinedIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
YUI.add("current-sessions-chart",function(Y){
"use strict";
var _51=Y.Lang,_52="currentSessionsChart";
Y.CurrentSessionsChart=Y.Base.create(_52,Y.DashboardChart,[],{initializer:function(){
var _53=this;
var _54=_53.get("model");
_54&&_54.addTarget(_53);
_53.on(Y.GatewayDynamicDataModel.prototype.UPDATE_EVENT,_53.onGatewayUpdate,_53);
},onGatewayUpdate:function(ev){
var _56=this.get("dashboard");
var _57=false;
var _58=ev.model;
var _59=_58.get("gatewayModel");
var _5a=this.get("dataItemValues");
var _5b=_59.get("instanceKey");
var _5c=_5a[_5b];
if(!_5c){
_5c=[];
_5a[_5b]=_5c;
_57=true;
}
var _5d=this.get("totalCurrentSessionsIndex");
var _5e=this.get("readTimeIndex");
if(_5d==null){
_5e=_59.summaryAttributeIndex("gateway","readTime");
_5d=_59.summaryAttributeIndex("gateway","totalCurrentSessions");
this.set("readTimeIndex",_5e);
this.set("totalCurrentSessionsIndex",_5d);
}
var _5f=ev.data[_5e];
var _60=ev.data[_5d];
var _61=this.get("yDomain");
var _62=this.get("valuesMultiplier");
var _63=this.computeDomainBounds(_60,_61[0],_61[1],_62);
if(_63.domainMin!==_61[0]||_63.domainMax!==_61[1]||_63.valuesMultiplier!==_62){
this.set("yDomain",[_63.domainMin,_63.domainMax]);
this.set("valuesMultiplier",_63.valuesMultiplier);
_57=true;
}
insertChartValue(_5c,_5f,_60);
if(_56.isTimeVisible(_5f)){
_57=true;
}
this.adjustTitle();
this.adjustSummary();
if(_57){
this.drawChart();
}
},getDataItems:function(){
var _64=this.get("model");
var _65=[];
var _66=this.get("dataItemValues");
for(var _67 in _66){
if(_66.hasOwnProperty(_67)){
var _68=_64.findGatewayModelByInstanceKey(_67);
if(this.isShowGateway(_68)){
_65.push(_67);
}
}
}
return _65;
},getDataItemValues:function(_69){
var _6a=_69;
var _6b=this.get("dataItemValues");
var _6c=_6b[_6a];
return (!_6c?[]:_6c);
},extendLastValue:function(_6d,_6e,_6f){
var _70=this.get("model");
var _71=_70.findGatewayModelByInstanceKey(_6d);
var _72=_71.get("stopTime");
if(_72&&_72<_6f){
return [_72,_6e[1]];
}else{
return [_6f,_6e[1]];
}
},computeSummaryHtml:function(){
var _73=this.get("dashboard");
var val=totalSummaryFn(this.get("dataItemValues"),this.get("valuesMultiplier"),_73.get("xDomainClip")[1]);
return val;
},getDataItemColor:function(_75){
var _76=this.get("model").findGatewayModelByInstanceKey(_75);
return this.get("dashboard").getColor(_76.get("connectionUrl"));
},dataItemsEqual:function(_77,_78){
return (_77===_78);
}},{ATTRS:{title:{value:null},valueType:{value:"number"},interpolation:{value:"step-after"},extendLastValue:{value:true},dataItemValues:{value:{}},totalCurrentSessionsIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
YUI.add("dashboard-chart",function(Y){
"use strict";
var _7a=Y.Lang,_7b="dashboardChart",_7c=false,_7d=0.5,_7e=18,_7f=200,_80="../images/expand.png",_81="../images/expand.png",_82="../images/close.png",_83={"number":{initDomain:[0,10],maxVals:[0,1,5,10,25,50,100,250,500,1000],minVals:[0,-1,-5,-10,-25,-50,-100,-250,-500,-1000],valMultiplierSize:1000,unitsFn:numberUnits},"percentage":{initDomain:[0,100],maxVals:[0,1,5,10,25,50,100,250,500,1000],minVals:[0,-1,-5,-10,-25,-50,-100,-250,-500,-1000],valMultiplierSize:1000,unitsFn:numberUnits},"bytes":{initDomain:[0,1024],maxVals:[0,1,5,10,25,50,100,250,500,1000],minVals:[0,-1,-5,-10,-25,-50,-100,-250,-500,-1000],valMultiplierSize:1024,unitsFn:byteUnits},"byteRate":{initDomain:[0,1024],maxVals:[0,1,5,10,25,50,100,250,500,1000],minVals:[0,-1,-5,-10,-25,-50,-100,-250,-500,-1000],valMultiplierSize:1024,unitsFn:byteRateUnits},"numberRate":{initDomain:[0,10],maxVals:[0,1,5,10,25,50,100,250,500,1000],minVals:[0,-1,-5,-10,-25,-50,-100,-250,-500,-1000],valMultiplierSize:1000,unitsFn:numberRateUnits},"other":{initDomain:[0,1],maxVals:[0,1,5,10,25,50,100,250,500,1000],minVals:[0,-1,-5,-10,-25,-50,-100,-250,-500,-1000],valMultiplierSize:1000,unitsFn:numberUnits},};
Y.DashboardChart=Y.Base.create(_7b,Y.KaazingView,[],{initializer:function(){
var _84=this;
_7c=(BrowserDetect.browser==="Firefox");
var _85=this.get("container");
var _86=createDIV(_85,"dashboardChartContent");
this.set("chartContent",_86);
this.setupChart(_86);
this.setupTitle(_86);
this.adjustTitle();
this.setupSummary(_86);
this.adjustSummary();
this.setupDrag(_85);
var _87=this.get("dashboard");
this.addSubscription(_87.on(Y.DashboardView.prototype.MODEL_CHANGE_EVENT,this.onModelChange,_84));
this.addSubscription(_87.on(Y.DashboardView.prototype.BOUNDS_CHANGE_EVENT,this.onBoundsChange,_84));
this.addSubscription(_87.on(Y.DashboardView.prototype.ADD_CHART_EVENT,this.onAddChart,_84));
this.addSubscription(_87.on(Y.DashboardView.prototype.DELETE_CHART_EVENT,this.onDeleteChart,_84));
this.addSubscription(_87.on(Y.DashboardView.prototype.RESIZE_EVENT,this.onResize,_84));
this.addSubscription(_87.on(Y.DashboardView.prototype.TOGGLE_CHART_SIZE_EVENT,this.onToggleChartSize,_84));
this.addSubscription(_87.on(Y.DashboardView.prototype.SHOW_GATEWAY_CHANGE_EVENT,this.onShowGatewayChange,_84));
},onModelChange:function(ev){
this.drawChart();
},afterConnectionUrlChange:function(ev){
},onBoundsChange:function(ev){
this.drawChart();
},onAddChart:function(ev){
this.unmaximize();
this.drawChart();
},onDeleteChart:function(ev){
this.unmaximize();
this.drawChart();
},onResize:function(ev){
this.drawChart();
},onToggleChartSize:function(ev){
var _8f=ev.maximizedChart;
if(!_8f){
this.unmaximize();
}else{
if(_8f===this){
this.maximize();
}else{
this.hide();
}
}
this.drawChart();
},onShowGatewayChange:function(){
this.drawChart();
},setupChart:function(_90){
var _91=createDIV(_90,"chartArea");
this.set("chartArea",_91);
this.setupCanvas(_91);
this.get("container").addClass("hidden");
this.setupYDomain();
this.setupPanZoom();
},setupCanvas:function(_92){
var _93=createCANVAS(_92,"canvas").set("id","canvas_"+this.get("chartId")).getDOMNode();
var _94=this.get("dashboard");
var _95=_94.get("chartAreaSize");
_93.width=_95[0];
_93.height=_95[1];
this.set("canvas",_93);
var _96=_93.getContext("2d");
this.set("context",_96);
},adjustChartSize:function(){
var _97=this.get("dashboard");
var _98=_97.get("chartContainerSize");
var _99=this.get("container");
_99.setStyle("width",_98[0]+"%");
_99.setStyle("height",_98[1]+"%");
var _9a=this.get("canvas");
var _9b=_97.get("chartAreaSize");
_9a.width=_9b[0];
_9a.height=_9b[1];
},setupYDomain:function(){
var _9c=this.getValueTypeInfo("initDomain").slice(0);
this.set("yDomain",_9c);
},setupPanZoom:function(){
var _9d=this;
var _9e=this.get("canvas");
var _9f=this.get("dashboard");
_9e.addEventListener(_7c?"DOMMouseScroll":"mousewheel",function(e){
_9d.handleMouseWheel(e);
},false);
var _a1=function(e){
e.stopPropagation();
e.preventDefault();
_9d.handlePan(e);
};
_9e.addEventListener("mousedown",function(e){
var _a4=_9d.getMousePos(e);
if(_9d.inChartBody(_a4)){
_9d.set("panMousePos",{x:_a4.x,y:_a4.y});
_9e.addEventListener("mousemove",_a1,false);
_9d.get("dashboard").startPanningOrZooming();
e.stopPropagation();
e.preventDefault();
}
},false);
_9e.addEventListener("mouseup",function(e){
_9d.set("panMousePos",null);
_9e.removeEventListener("mousemove",_a1,false);
_9d.get("dashboard").endPanningOrZooming();
e.stopPropagation();
e.preventDefault();
},false);
},handlePan:function(e){
var _a7=this.get("panMousePos");
var _a8=this.getMousePos(e);
var _a9=_a8.x-_a7.x;
this.set("panMousePos",{x:_a8.x,y:_a8.y});
if(_a9!==0){
this.get("dashboard").translateByPixels(-_a9);
}
},handleMouseWheel:function(ev){
var _ab=this.getWheelDelta(ev);
this.get("dashboard").scale(_ab);
},getWheelDelta:function(ev){
var _ad=Math.max(-1,Math.min(1,(ev.wheelDelta||-ev.detail)));
return _ad;
},getMousePos:function(evt){
var _af=this.get("canvas").getBoundingClientRect();
return {x:evt.clientX-_af.left,y:evt.clientY-_af.top};
},inChartBody:function(_b0){
var _b1=this.get("dashboard");
var _b2=_b1.get("chartMargin");
var _b3=_b1.get("chartSize");
var val=(_b0.x>=_b2.left&&_b0.x<=_b2.left+_b3[0]&&_b0.y>=_b2.top&&_b0.y<=_b2.top+_b3[1]);
return val;
},clearContext:function(){
var _b5=this.get("canvas");
_b5.width=_b5.width;
},setupDrag:function(_b6){
var _b7=new Y.DD.Drag({node:_b6}).addHandle(".titleDiv");
_b7.set("data",{chart:this});
this.set("drag",_b7);
var _b8=new Y.DD.Drop({node:_b6});
_b8.set("data",{chart:this});
this.set("drop",_b8);
},setupTitle:function(_b9){
var _ba=this;
var _bb=createDIV(_b9,"titleDiv");
this.set("titleDiv",_bb);
var _bc=createSPAN(_bb,"","titleSpan");
var _bd=createIMG(_bb,_82,"closeBox");
_bd.setAttribute("alt","Close");
_bd.on("click",function(){
_ba.get("dashboard").handleDeleteChart(_ba);
});
var _be=createIMG(_bb,(this.get("maximized")?_81:_80),"toggleChartSizeBox");
_be.on("click",function(){
_ba.get("dashboard").handleToggleChartSize(_ba);
});
_be.setAttribute("alt","Maximize/unmaximize");
},adjustTitle:function(){
var _bf=this.get("showUnits");
var _c0=this.get("titleDiv");
var _c1=this.get("title");
if(_bf!==false){
var _c2=this.getValueTypeInfo("unitsFn");
var _c3=this.get("valuesMultiplier");
if(_bf||_c3>1){
_c1=_c1+" ("+_c2(_c3)+")";
}
}
var _c4=_c0.one("span");
_c4.set("text",_c1);
},setupSummary:function(_c5){
var _c6=createDIV(_c5,"summaryDiv");
this.set("summaryDiv",_c6);
},adjustSummary:function(){
var _c7=this.get("summaryDiv");
_c7.setHTML(this.computeSummaryHtml());
},drawChart:function(){
var _c8=this.get("dashboard");
if(!_c8.isActiveView()||this.isHidden()){
return;
}
var _c9=Date.now();
this.adjustChartSize();
var _ca=this.get("context");
var _cb=_c8.get("chartMargin");
var _cc=_c8.get("chartSize");
this.clearContext();
this.adjustTitle();
this.drawYAxisAndGrid(_ca,_cb,_cc[0],_cc[1]);
this.drawXAxisAndGrid(_ca,_cb,_cc[0],_cc[1]);
this.drawData(_ca,_cb,_cc[0],_cc[1]);
this.adjustSummary();
},drawYAxisAndGrid:function(_cd,_ce,_cf,_d0){
_cd.save();
_cd.translate(_ce.left,_ce.top+_d0);
_cd.beginPath();
_cd.lineWidth=1;
_cd.strokeStyle="#000000";
_cd.moveTo(0+_7d,0+_7d);
_cd.lineTo(0+_7d,-_d0+_7d);
_cd.stroke();
_cd.save();
_cd.beginPath();
var _d1=this.get("yDomain");
var _d2=[2,5,10,20];
var _d3=null;
var _d4=_d0;
var _d5=_d1[1]-_d1[0];
for(var i=_d2.length-1;i>=0;i--){
var _d7=_d2[i];
if(Math.round(_d4/_d7)>=20&&Math.round(_d5/_d7)>=1){
_d3=_d7;
break;
}
}
if(_d3==null){
_d3=_d2[0];
}
var _d8=this.get("tickSize");
var _d9=((_d1[1]-_d1[0])/_d3);
var _da=-(_d0/_d3);
_cd.font="normal 100% arial";
_cd.textAlign="right";
_cd.textBaseline="middle";
_cd.strokeStyle="#444444";
for(var i=0;i<=_d3;i++){
var _db=Math.round(i*_da);
var _dc=Math.round(i*_d9);
_cd.moveTo(0+_7d,_db+_7d);
_cd.lineTo(-_d8+_7d,_db+_7d);
_cd.strokeText(""+_dc,-12+_7d,_db+_7d);
}
_cd.stroke();
_cd.restore();
_cd.save();
_cd.beginPath();
_cd.strokeStyle="#C8C8C8";
for(var i=0;i<=_d3;i++){
var _db=Math.round(i*_da);
_cd.moveTo(0+_7d,_db+_7d);
_cd.lineTo(_cf+_7d,_db+_7d);
}
_cd.stroke();
_cd.restore();
_cd.restore();
},drawXAxisAndGrid:function(_dd,_de,_df,_e0){
var _e1=this;
var _e2=this.get("dashboard");
_dd.save();
_dd.translate(_de.left,_de.top+_e0);
_dd.beginPath();
_dd.lineWidth=1;
_dd.strokeStyle="#000000";
_dd.moveTo(0+_7d,0+_7d);
_dd.lineTo(_df+_7d,0+_7d);
_dd.stroke();
var _e3=_e2.get("xDomain");
var _e4=_e2.get("xDomainClip");
var _e5=_e2.get("xRange");
var _e6=_e2.get("xTicks");
var _e7=this.get("tickSize");
var _e8=[1000,5000,15000,30000,60000,300000,900000,1800000,3600000];
var _e9=_e8.length;
var _ea=_e3[0];
var _eb=_e3[1];
var _ec=Math.floor((_e5[1]-_e5[0])/_df*_e6);
var _ed=(_eb-_ea)/_ec;
var _ee;
for(var i=0;i<_e9;i++){
if(_ed<_e8[i]||i==_e9-1){
_ee=i;
break;
}
}
var _f0=(_e5[1]-_e5[0])*_e8[_ee]/(_e3[1]-_e3[0]);
if(_f0<_7e){
while(_f0<_7e&&_ee<_e9-1){
_ee++;
_f0=(_e5[1]-_e5[0])*_e8[_ee]/(_e3[1]-_e3[0]);
}
}else{
if(_f0>_7f){
while(_f0>_7f&&_ee>0){
_ee--;
_f0=(_e5[1]-_e5[0])*_e8[_ee]/(_e3[1]-_e3[0]);
}
}
}
_ed=_e8[_ee];
var _f1=_e4[0]%_ed;
var _f2=(_f1==0?_e4[0]:(_e4[0]-_f1)+_ed);
_e6=Math.floor((_e4[1]-_e4[0])/_ed)+1;
_dd.save();
_dd.beginPath();
_dd.font="normal 100% arial";
_dd.textAlign="center";
_dd.textBaseline="middle";
_dd.strokeStyle="#666666";
var _f3=[];
var _f4=[scaleX(_e4[0],_e3,_e5),scaleX(_e4[1],_e3,_e5)];
for(var i=0;i<_e6;i++){
var _f5=_f2+(i*_ed);
var _f6=scaleX(_f5,_e3,_e5);
if(_f6>=_f4[0]&&_f6<=_f4[1]){
_f6-=_f4[0];
_f3.push(_f6);
var _f7=new Date(_f5);
var _f8=(_f7.getSeconds()==0?addZero(_f7.getHours())+":"+addZero(_f7.getMinutes()):":"+addZero(_f7.getSeconds()));
_dd.moveTo(_f6+_7d,0+_7d);
_dd.lineTo(_f6+_7d,_e7+_7d);
_dd.strokeText(_f8,_f6+_7d,13+_7d);
}
}
_dd.stroke();
_dd.restore();
_dd.save();
_dd.beginPath();
_dd.strokeStyle="#C8C8C8";
for(var i=0;i<_f3.length;i++){
var _f6=_f3[i];
_dd.moveTo(_f6+_7d,0+_7d);
_dd.lineTo(_f6+_7d,-_e0+_7d);
}
_dd.stroke();
_dd.restore();
_dd.restore();
},drawData:function(_f9,_fa,_fb,_fc){
var _fd=this;
var _fe=this.getDataItems();
var _ff=_fe.length;
if(_ff==0){
return;
}
var _100=this.get("dashboard");
var _101=_100.get("lastDisplayableTime");
var _102=_100.get("xDomain");
var _103=_100.get("xRange");
var _104=_100.get("xDomainClip");
var _105=_104[0];
if(_101<_105){
return;
}
var _106=Math.min(_104[1],_101);
var _107=_100.get("yRange");
var _108=this.get("yDomain");
var minX=scaleX(_105,_102,_103);
var _10a=this.get("extendLastValue");
var _10b=this.get("interpolation");
for(var i=0;i<_ff;i++){
var _10d=_fe[i];
var _10e=this.getDataItemValues(_10d);
var _10f=_10e.length;
if(_10f===0){
continue;
}
var _110=_10e[0][0];
if(_110>_106){
continue;
}
_110=_10e[_10f-1][0];
if(_110<_105&&!_10a){
continue;
}
var _111,_112;
var j;
for(j=0;j<_10f;j++){
if(_10e[j][0]>=_105){
break;
}
}
_111=(j>0?j-1:j);
for(j=_111;j<_10f;j++){
if(_10e[j][0]>_106){
break;
}
}
var _114=this.getDataItemColor(_10d);
var _115=this.getDataItemLineStyle(_10d);
_112=(j==_10f?j-1:j);
_f9.save();
_f9.translate(_fa.left,_fa.top+_fc);
_f9.beginPath();
_f9.rect(0,0,_fb,-_fc);
_f9.clip();
_f9.beginPath();
_f9.lineWidth=1;
_f9.strokeStyle=_114;
var _116=this.get("valuesMultiplier");
var x,y,item,_11a,_11b;
for(var j=_111;j<=_112;j++){
item=_10e[j];
x=scaleX(item[0],_102,_103)-minX;
y=scaleY(item[1],_108,_116,_107);
if(j==_111){
_f9.moveTo(x+_7d,y+_7d);
}else{
if(_10b==="step-before"){
if(y!=_11b){
this.lineTo(_f9,_115,_11a,_11b,_11a,y);
}
this.lineTo(_f9,_115,_11a,y,x,y);
}else{
if(_10b==="step-after"){
this.lineTo(_f9,_115,_11a,_11b,x,_11b);
if(x!=_11a){
this.lineTo(_f9,_115,x,_11b,x,y);
}
}else{
this.lineTo(_f9,_115,_11a,_11b,x,y);
}
}
}
_11a=x;
_11b=y;
}
if(_10a&&_10e[_112][0]<_106){
var _11c=this.extendLastValue(_10d,_10e[_112],_106);
x=scaleX(_11c[0],_102,_103)-minX;
y=scaleY(_11c[1],_108,_116,_107);
this.lineTo(_f9,_115,_11a,_11b,x,y);
}
_f9.stroke();
_f9.restore();
}
},extendLastValue:function(_11d,_11e,_11f){
return [_11f,_11e[1]];
},lineTo:function(_120,_121,x1,y1,x2,y2){
if(_121==CC.Constants.LineStyle.DASHED){
_120.dashedLine(x1+_7d,y1+_7d,x2+_7d,y2+_7d,[4,2]);
}else{
_120.lineTo(x2+_7d,y2+_7d);
}
},getDataItems:function(){
return [];
},computeSummaryHtml:function(){
return "";
},getDataItemValues:function(_126){
return [];
},destroy:function(_127){
this.deleteSubscriptions();
var _128=this.get("container");
removeAllChildren(_128);
this.set("canvas",null);
this.set("context",null);
this.set("yDomain",null);
this.set("titleDiv",null);
this.set("chartArea",null);
this.set("summaryDiv",null);
this.set("dashboard",null);
var drag=this.get("drag");
if(drag){
drag.set("data",null);
this.set("drag",null);
drag.destroy();
}
var drop=this.get("drop");
if(drop){
drop.set("data",null);
this.set("drop",null);
drop.destroy();
}
Y.DashboardChart.superclass.destroy.call(this,_127);
},isShowGateway:function(_12b){
var val=this.get("dashboard").isShowGateway(_12b.get("connectionUrl"));
return val;
},computeDomainBounds:function(_12d,_12e,_12f,_130){
var _131=_12e*_130;
var _132=_12f*_130;
var _133=false;
if(_12d<_131){
_131=_12d;
_133=true;
}
if(_12d>_132){
_132=_12d;
_133=true;
}
if(_133){
var _134=this.getValueTypeInfo("valMultiplierSize");
_130=1;
var _135=Math.max(Math.abs(_131),Math.abs(_132));
while(_135>_134){
_130=_130*_134;
_135=_135/_134;
}
_12e=this.niceMin(_131/_130);
_12f=this.niceMax(_132/_130);
}
return {domainMin:_12e,domainMax:_12f,valuesMultiplier:_130};
},niceMin:function(_136){
var _137=this.getValueTypeInfo("minVals");
for(var i=0;i<_137.length;i++){
if(_136>=_137[i]){
return _137[i];
}
}
return _137[_137.length-1];
},niceMax:function(_139){
var _13a=this.getValueTypeInfo("maxVals");
for(var i=0;i<_13a.length;i++){
if(_139<=_13a[i]){
return _13a[i];
}
}
return _13a[_13a.length-1];
},isHidden:function(){
var _13c=this.get("container");
return _13c.hasClass("hidden");
},hide:function(){
var _13d=this.get("container");
_13d.addClass("hidden");
return this;
},unhide:function(){
var _13e=this.get("container");
_13e.removeClass("hidden");
return this;
},maximize:function(){
this.unhide();
var _13f=this.get("container");
var _140=_13f.one(".toggleChartSizeBox");
_140.setAttribute("src",_81);
this.set("maximized",true);
},unmaximize:function(){
this.unhide();
var _141=this.get("container");
var _142=_141.one(".toggleChartSizeBox");
_142.setAttribute("src",_80);
this.set("maximized",false);
},isMaximized:function(){
return this.get("maximized");
},isNormal:function(){
return (!this.isHidden()&&!this.isMaximized());
},getValueTypeInfo:function(_143){
var _144=_83[this.get("valueType")];
if(!_144){
_144=_83["other"];
}
return _144[_143];
},getDataItemColor:function(_145){
return this.get("dashboard").getColor(_145);
},getDataItemLineStyle:function(_146){
return CC.Constants.LineStyle.SOLID;
},addSubscription:function(_147){
this.get("subscriptions").push(_147);
},deleteSubscriptions:function(){
var _148=this.get("subscriptions");
_148.forEach(function(_149){
_149.detach();
});
},dumpVals:function(vals){
if(vals&&vals.length>0){
for(var i=0;i<vals.length;i++){
CC.console.debug("["+vals[i][0]+", "+vals[i][1]+"]");
}
CC.console.debug("#########");
CC.console.debug(" ");
}
}},{ATTRS:{container:{value:null},titleDiv:{value:null},chartArea:{value:null},summaryDiv:{value:null},dashboard:{value:null},title:{value:null},valueType:{value:null},showUnits:{value:null},interpolation:{value:"linear"},extendLastValue:{value:false},canvas:{value:null},context:{value:null},yDomain:{value:null},yTicks:{value:5},tickSize:{value:6},valuesMultiplier:{value:1},chartId:{value:null},maximized:{value:false},panMousePos:{value:null},subscriptions:{value:[]}}});
},"0.99",{requires:["kaazing-view","cluster-model","gateway-model","dashboard-view"]});
YUI.add("jvm-heap-chart",function(Y){
"use strict";
var Lang=Y.Lang,NAME="jvmHeapChart";
Y.JvmHeapChart=Y.Base.create(NAME,Y.DashboardChart,[],{initializer:function(){
var _14f=this;
var _150=_14f.get("model");
_150&&_150.addTarget(_14f);
_14f.on(Y.JvmModel.prototype.UPDATE_EVENT,_14f.onJvmUpdate,_14f);
},onJvmUpdate:function(ev){
var _152=this.get("dashboard");
var _153=false;
var _154=ev.model;
var _155=_154.get("gatewayModel");
var _156=this.get("dataItemValues");
var _157=_155.get("instanceKey");
var _158=_156[_157];
if(!_158){
_158=[];
_156[_157]=_158;
_153=true;
}
var _159=this.get("memHeapUsedIndex");
var _15a=this.get("readTimeIndex");
if(_159==null){
_15a=_155.summaryAttributeIndex("jvm","readTime");
_159=_155.summaryAttributeIndex("jvm","memHeapUsed");
this.set("readTimeIndex",_15a);
this.set("memHeapUsedIndex",_159);
}
var _15b=ev.data[_15a];
var _15c=ev.data[_159];
var _15d=this.get("yDomain");
var _15e=this.get("valuesMultiplier");
var _15f=this.computeDomainBounds(_15c,_15d[0],_15d[1],_15e);
if(_15f.domainMin!==_15d[0]||_15f.domainMax!==_15d[1]||_15f.valuesMultiplier!==_15e){
this.set("yDomain",[_15f.domainMin,_15f.domainMax]);
this.set("valuesMultiplier",_15f.valuesMultiplier);
_153=true;
}
insertChartValue(_158,_15b,_15c);
if(_152.isTimeVisible(_15b)){
_153=true;
}
this.adjustTitle();
this.adjustSummary();
if(_153){
this.drawChart();
}
},getDataItems:function(){
var _160=this.get("model");
var _161=[];
var _162=this.get("dataItemValues");
for(var _163 in _162){
if(_162.hasOwnProperty(_163)){
if(this.isShowGateway(_160.findGatewayModelByInstanceKey(_163))){
_161.push(_163);
}
}
}
return _161;
},getDataItemValues:function(_164){
var _165=this.get("dataItemValues")[_164];
return (!_165?[]:_165);
},computeSummaryHtml:function(){
var _166=this.get("dashboard");
var val=minMaxAverageSummaryFn(this.get("dataItemValues"),this.get("valuesMultiplier"),_166.get("xDomainClip")[1]);
return val;
},getDataItemColor:function(_168){
var _169=this.get("model").findGatewayModelByInstanceKey(_168);
return this.get("dashboard").getColor(_169.get("connectionUrl"));
},dataItemsEqual:function(_16a,_16b){
return (_16a===_16b);
}},{ATTRS:{title:{value:null},valueType:{value:"bytes"},showUnits:{value:true},dataItemValues:{value:{}},memHeapUsedIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
YUI.add("nic-read-thpt-combined-chart",function(Y){
"use strict";
var Lang=Y.Lang,NAME="nicReadThptCombinedChart";
Y.NicReadThptCombinedChart=Y.Base.create(NAME,Y.DashboardChart,[],{initializer:function(){
var _16f=this;
var _170=_16f.get("model");
_170&&_170.addTarget(_16f);
_16f.on(Y.NicListModel.prototype.UPDATE_EVENT,_16f.onNicListUpdate,_16f);
},onNicListUpdate:function(ev){
var _172=this.get("dashboard");
var _173=false;
var _174=ev.model;
var _175=_174.get("gatewayModel");
var _176=this.get("dataItemValues");
var _177=_175.get("instanceKey");
var _178=ev.data;
var _179=_178.length;
if(_179==0){
return;
}
var _17a=_176[_177];
if(!_17a){
_17a=[];
_176[_177]=_17a;
_173=true;
}
var _17b=this.get("rxBytesPerSecondIndex");
var _17c=this.get("readTimeIndex");
if(_17b==null){
_17c=_175.summaryAttributeIndex("nicList","readTime");
_17b=_175.summaryAttributeIndex("nicList","rxBytesPerSecond");
this.set("readTimeIndex",_17c);
this.set("rxBytesPerSecondIndex",_17b);
}
var _17d=0;
for(var _17e=0;_17e<_179;_17e++){
_17d+=_178[_17e][_17b];
}
if(_179>0){
_17d=_17d/_179;
}
var _17f=ev.data[0][_17c];
var _180=this.get("yDomain");
var _181=this.get("valuesMultiplier");
var _182=this.computeDomainBounds(_17d,_180[0],_180[1],_181);
if(_182.domainMin!==_180[0]||_182.domainMax!==_180[1]||_182.valuesMultiplier!==_181){
this.set("yDomain",[_182.domainMin,_182.domainMax]);
this.set("valuesMultiplier",_182.valuesMultiplier);
_173=true;
}
insertChartValue(_17a,_17f,_17d);
if(_172.isTimeVisible(_17f)){
_173=true;
}
this.adjustTitle();
this.adjustSummary();
if(_173){
this.drawChart();
}
},getDataItems:function(){
var _183=this.get("model");
var _184=[];
var _185=this.get("dataItemValues");
for(var _186 in _185){
if(_185.hasOwnProperty(_186)){
if(this.isShowGateway(_183.findGatewayModelByInstanceKey(_186))){
_184.push(_186);
}
}
}
return _184;
},getDataItemValues:function(_187){
var _188=this.get("dataItemValues")[_187];
return (!_188?[]:_188);
},computeSummaryHtml:function(){
var _189=this.get("dashboard");
var val=minMaxAverageSummaryFn(this.get("dataItemValues"),this.get("valuesMultiplier"),_189.get("xDomainClip")[1]);
return val;
},getDataItemColor:function(_18b){
var _18c=this.get("model").findGatewayModelByInstanceKey(_18b);
return this.get("dashboard").getColor(_18c.get("connectionUrl"));
},dataItemsEqual:function(_18d,_18e){
return (_18d===_18e);
}},{ATTRS:{title:{value:null},valueType:{value:"byteRate"},showUnits:{value:true},dataItemValues:{value:{}},rxBytesPerSecondIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
YUI.add("nic-read-thpt-indiv-chart",function(Y){
"use strict";
var Lang=Y.Lang,NAME="nicReadThptIndivChart";
Y.NicReadThptIndivChart=Y.Base.create(NAME,Y.DashboardChart,[],{initializer:function(){
var _192=this;
var _193=_192.get("model");
_193&&_193.addTarget(_192);
_192.on(Y.NicListModel.prototype.UPDATE_EVENT,_192.onNicListUpdate,_192);
},onNicListUpdate:function(ev){
var _195=this.get("dashboard");
var _196=false;
var _197=ev.model;
var _198=_197.get("gatewayModel");
var _199=this.get("dataItemValues");
var _19a=_198.get("instanceKey");
var _19b=ev.data;
var _19c=_19b.length;
if(_19c==0){
return;
}
var _19d=_199[_19a];
if(!_19d){
_19d=[];
for(var i=0;i<_19b.length;i++){
_19d.push([]);
}
_199[_19a]=_19d;
_196=true;
}
var _19f=this.get("rxBytesPerSecondIndex");
var _1a0=this.get("readTimeIndex");
if(_19f==null){
_1a0=_198.summaryAttributeIndex("nicList","readTime");
_19f=_198.summaryAttributeIndex("nicList","rxBytesPerSecond");
this.set("readTimeIndex",_1a0);
this.set("rxBytesPerSecondIndex",_19f);
}
var _1a1=this.get("yDomain");
var _1a2=this.get("valuesMultiplier");
var _1a3;
var _1a4={domainMin:_1a1[0],domainMax:_1a1[1],valuesMultiplier:_1a2};
var _1a5=ev.data[0][_1a0];
for(var _1a6=0;_1a6<_19c;_1a6++){
_1a3=_19b[_1a6][_19f];
_1a4=this.computeDomainBounds(_1a3,_1a4.domainMin,_1a4.domainMax,_1a4.valuesMultiplier);
insertChartValue(_19d[_1a6],_1a5,_1a3);
if(_195.isTimeVisible(_1a5)){
_196=true;
}
}
if(_1a4.domainMin!==_1a1[0]||_1a4.domainMax!==_1a1[1]||_1a4.valuesMultiplier!==_1a2){
this.set("yDomain",[_1a4.domainMin,_1a4.domainMax]);
this.set("valuesMultiplier",_1a4.valuesMultiplier);
_196=true;
}
this.adjustTitle();
this.adjustSummary();
if(_196){
this.drawChart();
}
},getDataItems:function(){
var _1a7=this.get("model");
var _1a8=[];
var _1a9=this.get("dataItemValues");
for(var _1aa in _1a9){
if(_1a9.hasOwnProperty(_1aa)){
var _1ab=_1a7.findGatewayModelByInstanceKey(_1aa);
if(this.isShowGateway(_1ab)){
var _1ac=_1ab.get("nicListModel");
var _1ad=_1ac.get("netInterfaceNames");
for(var j=0;j<_1ad.length;j++){
_1a8.push([_1aa,j]);
}
}
}
}
return _1a8;
},getDataItemValues:function(_1af){
var _1b0=_1af[0];
var _1b1=_1af[1];
var _1b2=this.get("dataItemValues");
var _1b3=_1b2[_1b0];
return (!_1b3?[]:_1b3[_1b1]);
},computeSummaryHtml:function(){
var _1b4=this.get("dashboard");
var val=minMaxAverageMultipleSummaryFn(this.get("dataItemValues"),this.get("valuesMultiplier"),_1b4.get("xDomainClip")[1]);
return val;
},getDataItemColor:function(_1b6){
var _1b7=this.get("model").findGatewayModelByInstanceKey(_1b6[0]);
return this.get("dashboard").getColor(_1b7.get("connectionUrl"));
},dataItemsEqual:function(_1b8,_1b9){
var val=(_1b8[0]===_1b9[0]&&_1b8[1]===_1b9[1]);
return val;
}},{ATTRS:{title:{value:null},valueType:{value:"byteRate"},showUnits:{value:true},dataItemValues:{value:{}},rxBytesPerSecondIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
YUI.add("nic-rw-thpt-combined-chart",function(Y){
"use strict";
var Lang=Y.Lang,NAME="nicRWThptCombinedChart";
Y.NicRWThptCombinedChart=Y.Base.create(NAME,Y.DashboardChart,[],{initializer:function(){
var _1be=this;
var _1bf=_1be.get("model");
_1bf&&_1bf.addTarget(_1be);
_1be.on(Y.NicListModel.prototype.UPDATE_EVENT,_1be.onNicListUpdate,_1be);
},onNicListUpdate:function(ev){
var _1c1=this.get("dashboard");
var _1c2=false;
var _1c3=ev.model;
var _1c4=_1c3.get("gatewayModel");
var _1c5=this.get("dataItemValues");
var _1c6=_1c4.get("instanceKey");
var _1c7=ev.data;
var _1c8=_1c7.length;
if(_1c8==0){
return;
}
var _1c9=_1c5[_1c6];
if(!_1c9){
_1c9={read:[],write:[]};
_1c5[_1c6]=_1c9;
_1c2=true;
}
var _1ca=this.get("rxBytesPerSecondIndex");
var _1cb=this.get("txBytesPerSecondIndex");
var _1cc=this.get("readTimeIndex");
if(_1ca==null){
_1cc=_1c4.summaryAttributeIndex("nicList","readTime");
_1ca=_1c4.summaryAttributeIndex("nicList","rxBytesPerSecond");
_1cb=_1c4.summaryAttributeIndex("nicList","txBytesPerSecond");
this.set("readTimeIndex",_1cc);
this.set("rxBytesPerSecondIndex",_1ca);
this.set("txBytesPerSecondIndex",_1cb);
}
var _1cd=0;
var _1ce=0;
for(var _1cf=0;_1cf<_1c8;_1cf++){
_1cd+=_1c7[_1cf][_1ca];
_1ce+=_1c7[_1cf][_1cb];
}
if(_1c8>0){
_1cd=_1cd/_1c8;
_1ce=_1ce/_1c8;
}
var _1d0=ev.data[0][_1cc];
var _1d1=this.get("yDomain");
var _1d2=this.get("valuesMultiplier");
var _1d3=this.computeDomainBounds(_1cd,_1d1[0],_1d1[1],_1d2);
_1d3=this.computeDomainBounds(_1ce,_1d3.domainMin,_1d3.domainMax,_1d3.valuesMultiplier);
if(_1d3.domainMin!==_1d1[0]||_1d3.domainMax!==_1d1[1]||_1d3.valuesMultiplier!==_1d2){
this.set("yDomain",[_1d3.domainMin,_1d3.domainMax]);
this.set("valuesMultiplier",_1d3.valuesMultiplier);
_1c2=true;
}
insertChartValue(_1c9.read,_1d0,_1cd);
insertChartValue(_1c9.write,_1d0,_1ce);
if(_1c1.isTimeVisible(_1d0)){
_1c2=true;
}
this.adjustTitle();
this.adjustSummary();
if(_1c2){
this.drawChart();
}
},getDataItems:function(){
var _1d4=this.get("model");
var _1d5=[];
var _1d6=this.get("dataItemValues");
for(var _1d7 in _1d6){
if(_1d6.hasOwnProperty(_1d7)){
if(this.isShowGateway(_1d4.findGatewayModelByInstanceKey(_1d7))){
_1d5.push([_1d7,"read"],[_1d7,"write"]);
}
}
}
return _1d5;
},getDataItemLineStyle:function(_1d8){
return (_1d8[1]=="read"?CC.Constants.LineStyle.DASHED:CC.Constants.LineStyle.SOLID);
},getDataItemValues:function(_1d9){
var _1da=_1d9[0];
var type=_1d9[1];
var _1dc=this.get("dataItemValues");
var _1dd=_1dc[_1da];
return (!_1dd?[]:_1dd[type]);
},computeSummaryHtml:function(){
var _1de=0;
var _1df=this.get("dataItemValues");
var _1e0=this.get("valuesMultiplier");
var _1e1=this.get("dashboard").get("xDomainClip")[1];
var _1e2={min:0,max:0,total:0,avg:0};
var _1e3={min:0,max:0,total:0,avg:0};
if(_1df){
for(var key in _1df){
if(_1df.hasOwnProperty(key)){
_1de++;
this.computeTotals(_1e2,_1df[key].read,_1e1,_1e0);
this.computeTotals(_1e3,_1df[key].write,_1e1,_1e0);
}
}
if(_1de>0){
_1e2.avg=_1e2.total/_1de;
_1e3.avg=_1e3.total/_1de;
}
}
var val="<div class=\"rwThptSummary\">";
val+="<div class=\"readThpt\">R: </div>"+"<div class=\"readThptLine\">"+"  <svg>"+"    <line class=\"readThpt\" x1=\"3\" y1=\"0\" x2=\"40\" y2=\"0\"></line>"+"  </svg>"+"</div>";
val+="<div class=\"writeThpt\">W: </div>"+"<div class=\"writeThptLine\">"+"  <svg>"+"    <line class=\"writeThpt\" x1=\"3\" y1=\"0\" x2=\"40\" y2=\"0\"></line>"+"  </svg>"+"</div>";
val+="<div class=\"rwThptMaxAverage\">"+"  <div class=\"summaryLabel\">Max: </div>"+"  <div class=\"summaryValue\">"+Math.max(_1e2.max,_1e3.max).toFixed(2)+"</div>"+"  <div class=\"summaryLabel\">&nbsp;Avg.: </div>"+"  <div class=\"summaryValue\">"+((_1e2.avg+_1e3.avg)/2).toFixed(2)+"</div>"+"</div>";
val+="</div>";
return val;
},computeTotals:function(_1e6,_1e7,_1e8,_1e9){
var _1ea=true;
var j;
if(_1e7.length>0){
for(j=_1e7.length-1;j>=0;j--){
if(_1e7[j][0]<_1e8){
break;
}
}
if(j>=0){
var val=_1e7[j][1]/_1e9;
if(_1ea){
_1e6.min=val;
_1e6.max=val;
_1ea=false;
}else{
_1e6.min=Math.min(_1e6.min,val);
_1e6.max=Math.max(_1e6.max,val);
}
_1e6.total+=val;
}
}
},getDataItemColor:function(_1ed){
var _1ee=this.get("model").findGatewayModelByInstanceKey(_1ed[0]);
return this.get("dashboard").getColor(_1ee.get("connectionUrl"));
},getDataItemClasses:function(_1ef){
return "line "+_1ef[1];
},dataItemsEqual:function(_1f0,_1f1){
var val=(_1f0[0]===_1f1[0]&&_1f0[1]===_1f1[1]);
return val;
}},{ATTRS:{title:{value:null},valueType:{value:"byteRate"},showUnits:{value:true},dataItemValues:{value:{}},rxBytesPerSecondIndex:{value:null},txBytesPerSecondIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
YUI.add("nic-write-thpt-combined-chart",function(Y){
"use strict";
var Lang=Y.Lang,NAME="nicWriteThptCombinedChart";
Y.NicWriteThptCombinedChart=Y.Base.create(NAME,Y.DashboardChart,[],{initializer:function(){
var _1f6=this;
var _1f7=_1f6.get("model");
_1f7&&_1f7.addTarget(_1f6);
_1f6.on(Y.NicListModel.prototype.UPDATE_EVENT,_1f6.onNicListUpdate,_1f6);
},onNicListUpdate:function(ev){
var _1f9=this.get("dashboard");
var _1fa=false;
var _1fb=ev.model;
var _1fc=_1fb.get("gatewayModel");
var _1fd=this.get("dataItemValues");
var _1fe=_1fc.get("instanceKey");
var _1ff=ev.data;
var _200=_1ff.length;
if(_200==0){
return;
}
var _201=_1fd[_1fe];
if(!_201){
_201=[];
_1fd[_1fe]=_201;
_1fa=true;
}
var _202=this.get("txBytesPerSecondIndex");
var _203=this.get("readTimeIndex");
if(_202==null){
_203=_1fc.summaryAttributeIndex("nicList","readTime");
_202=_1fc.summaryAttributeIndex("nicList","txBytesPerSecond");
this.set("readTimeIndex",_203);
this.set("txBytesPerSecondIndex",_202);
}
var _204=0;
for(var _205=0;_205<_200;_205++){
_204+=_1ff[_205][_202];
}
if(_200>0){
_204=_204/_200;
}
var _206=ev.data[0][_203];
var _207=this.get("yDomain");
var _208=this.get("valuesMultiplier");
var _209=this.computeDomainBounds(_204,_207[0],_207[1],_208);
if(_209.domainMin!==_207[0]||_209.domainMax!==_207[1]||_209.valuesMultiplier!==_208){
this.set("yDomain",[_209.domainMin,_209.domainMax]);
this.set("valuesMultiplier",_209.valuesMultiplier);
_1fa=true;
}
insertChartValue(_201,_206,_204);
if(_1f9.isTimeVisible(_206)){
_1fa=true;
}
this.adjustTitle();
this.adjustSummary();
if(_1fa){
this.drawChart();
}
},getDataItems:function(){
var _20a=this.get("model");
var _20b=[];
var _20c=this.get("dataItemValues");
for(var _20d in _20c){
if(_20c.hasOwnProperty(_20d)){
if(this.isShowGateway(_20a.findGatewayModelByInstanceKey(_20d))){
_20b.push(_20d);
}
}
}
return _20b;
},getDataItemValues:function(_20e){
var _20f=this.get("dataItemValues")[_20e];
return (!_20f?[]:_20f);
},computeSummaryHtml:function(){
var _210=this.get("dashboard");
var val=minMaxAverageSummaryFn(this.get("dataItemValues"),this.get("valuesMultiplier"),_210.get("xDomainClip")[1]);
return val;
},getDataItemColor:function(_212){
var _213=this.get("model").findGatewayModelByInstanceKey(_212);
return this.get("dashboard").getColor(_213.get("connectionUrl"));
},dataItemsEqual:function(_214,_215){
return (_214===_215);
}},{ATTRS:{title:{value:null},valueType:{value:"byteRate"},showUnits:{value:true},dataItemValues:{value:{}},txBytesPerSecondIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
YUI.add("nic-write-thpt-indiv-chart",function(Y){
"use strict";
var Lang=Y.Lang,NAME="nicWriteThptIndivChart";
Y.NicWriteThptIndivChart=Y.Base.create(NAME,Y.DashboardChart,[],{initializer:function(){
var _219=this;
var _21a=_219.get("model");
_21a&&_21a.addTarget(_219);
_219.on(Y.NicListModel.prototype.UPDATE_EVENT,_219.onNicListUpdate,_219);
},onNicListUpdate:function(ev){
var _21c=this.get("dashboard");
var _21d=false;
var _21e=ev.model;
var _21f=_21e.get("gatewayModel");
var _220=this.get("dataItemValues");
var _221=_21f.get("instanceKey");
var _222=ev.data;
var _223=_222.length;
if(_223==0){
return;
}
var _224=_220[_221];
if(!_224){
_224=[];
for(var i=0;i<_222.length;i++){
_224.push([]);
}
_220[_221]=_224;
_21d=true;
}
var _226=this.get("txBytesPerSecondIndex");
var _227=this.get("readTimeIndex");
if(_226==null){
_227=_21f.summaryAttributeIndex("nicList","readTime");
_226=_21f.summaryAttributeIndex("nicList","txBytesPerSecond");
this.set("readTimeIndex",_227);
this.set("txBytesPerSecondIndex",_226);
}
var _228=this.get("yDomain");
var _229=this.get("valuesMultiplier");
var _22a;
var _22b={domainMin:_228[0],domainMax:_228[1],valuesMultiplier:_229};
var _22c=ev.data[0][_227];
for(var _22d=0;_22d<_223;_22d++){
_22a=_222[_22d][_226];
_22b=this.computeDomainBounds(_22a,_22b.domainMin,_22b.domainMax,_22b.valuesMultiplier);
insertChartValue(_224[_22d],_22c,_22a);
if(_21c.isTimeVisible(_22c)){
_21d=true;
}
}
if(_22b.domainMin!==_228[0]||_22b.domainMax!==_228[1]||_22b.valuesMultiplier!==_229){
this.set("yDomain",[_22b.domainMin,_22b.domainMax]);
this.set("valuesMultiplier",_22b.valuesMultiplier);
_21d=true;
}
this.adjustTitle();
this.adjustSummary();
if(_21d){
this.drawChart();
}
},getDataItems:function(){
var _22e=this.get("model");
var _22f=[];
var _230=this.get("dataItemValues");
for(var _231 in _230){
if(_230.hasOwnProperty(_231)){
var _232=_22e.findGatewayModelByInstanceKey(_231);
if(this.isShowGateway(_232)){
var _233=_232.get("nicListModel");
var _234=_233.get("netInterfaceNames");
for(var j=0;j<_234.length;j++){
_22f.push([_231,j]);
}
}
}
}
return _22f;
},getDataItemValues:function(_236){
var _237=_236[0];
var _238=_236[1];
var _239=this.get("dataItemValues");
var _23a=_239[_237];
return (!_23a?[]:_23a[_238]);
},computeSummaryHtml:function(){
var _23b=this.get("dashboard");
var val=minMaxAverageMultipleSummaryFn(this.get("dataItemValues"),this.get("valuesMultiplier"),_23b.get("xDomainClip")[1]);
return val;
},getDataItemColor:function(_23d){
var _23e=this.get("model").findGatewayModelByInstanceKey(_23d[0]);
return this.get("dashboard").getColor(_23e.get("connectionUrl"));
},dataItemsEqual:function(_23f,_240){
var val=(_23f[0]===_240[0]&&_23f[1]===_240[1]);
return val;
}},{ATTRS:{title:{value:null},valueType:{value:"byteRate"},showUnits:{value:true},dataItemValues:{value:{}},txBytesPerSecondIndex:{value:null},readTimeIndex:{value:null}}});
},"0.99",{requires:["kaazing-view","dashboard-chart","gateway-model"]});
