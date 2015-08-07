/**
 * Copyright (c) 2007-2014, Kaazing Corporation. All rights reserved.
 */

YUI.add("about-panel",function(Y){
"use strict";
var _2=Y.Lang,_3="aboutPanel";
Y.AboutPanel=Y.Base.create(_3,Y.Panel,[Y.WidgetInheritCss],{firstTime:true,initializer:function(){
this.plug(Y.Plugin.Drag,{handles:[".yui3-widget-hd"]});
this.dd.plug(Y.Plugin.DDConstrained,{constraint2node:"#content"});
this.set("dragObj",new Y.DD.Drag({node:"#aboutPanel"}));
},display:function(){
if(this.firstTime){
this.render();
this.firstTime=false;
}else{
centerPanel(this);
}
},renderUI:function(){
Y.AboutPanel.superclass.renderUI.apply(this,arguments);
var _4=Y.one(this.get("contentBox"));
var _5=_4.one("#aboutProduct");
var _6=_4.one("#aboutVersion");
var _7=_4.one("#aboutBuild");
var _8=this.get("app");
var _9=_8.clusterModel;
var _a=computeDisplayVersionInfo(_9.get("versionInfo"));
if(_a){
_5.setHTML(_a[0]);
_6.setHTML(_a[1]);
_7.setHTML(_a[2]);
}else{
_5.set("text","");
_6.set("text","");
_7.set("text","");
}
},handleOkayButton:function(e){
},},{ATTRS:{srcNode:{value:"#aboutPanel"},app:{value:null},centered:{value:true},modal:{value:true},zIndex:{value:5},buttons:{value:[{value:"OK",classNames:"commandButton aboutOkay",action:function(e){
e.preventDefault();
this.hide();
},section:Y.WidgetStdMod.FOOTER}]}}});
},"0.99",{requires:["panel","dd","dd-plugin","dd-drag","event","gallery-widget-inherit-css"],skinnable:false});
YUI.add("login-panel",function(Y){
"use strict";
var _e=Y.Lang,_f="loginPanel";
Y.LoginPanel=Y.Base.create(_f,Y.Panel,[Y.WidgetInheritCss],{firstTime:true,connectionUrlField:Y.one("#connectionUrl"),usernameField:Y.one("#loginUsername"),passwordField:Y.one("#loginPassword"),loginInvalidMessage:Y.one("#loginInvalidMessage"),initializer:function(){
var _10=this;
var _11=function(e){
var _13=(e.keyCode?e.keyCode:e.which);
if(_13===13){
e.preventDefault();
var _14=Y.one("#loginOkay");
_14.simulate("click");
}
};
this.connectionUrlField.on("keypress",_11);
this.usernameField.on("keypress",_11);
this.passwordField.on("keypress",_11);
var _15=Y.one("#loginOkay");
_15.on("click",function(e){
this.handleLoginButton(e);
},this);
},display:function(_17,_18,_19,_1a,_1b,_1c){
var _1d=this;
this.connectionUrlField.set("value",cvtUndefOrNull(_17,""));
if(!_18){
this.connectionUrlField.setAttribute("readonly","readonly");
}
this.usernameField.set("value",cvtUndefOrNull(_1a,""));
this.passwordField.set("value",cvtUndefOrNull(_1b,""));
if(_19){
this.loginInvalidMessage.removeClass("hidden");
}else{
this.loginInvalidMessage.addClass("hidden");
}
this.set("callback",_1c);
if(this.firstTime){
this.render();
this.firstTime=false;
}else{
centerPanel(this);
}
this.usernameField.focus();
},handleLoginButton:function(e){
this.handleButton(e);
},handleButton:function(e){
e.preventDefault();
this.hide();
var _20=this.connectionUrlField.get("value");
var _21=this.usernameField.get("value");
var _22=this.passwordField.get("value");
this.connectionUrlField.set("value","");
this.usernameField.set("value","");
this.passwordField.set("value","");
this.get("callback")(_20,_21,_22,false);
}},{ATTRS:{srcNode:{value:"#loginPanel"},centered:{value:true},modal:{value:true},zIndex:{value:5},buttons:{value:[]},callback:{value:null}}});
},"0.99",{requires:["panel","gallery-widget-inherit-css"],skinnable:false});
YUI.add("monitor-filter-panel",function(Y){
"use strict";
var _24=Y.Lang,_25="monitorFilterPanel",_26="alpha",_27="numeric",_28="function";
Y.MonitorFilterPanel=Y.Base.create(_25,Y.Panel,[Y.WidgetInheritCss],{maxFilters:10,firstTime:true,initializer:function(){
this.plug(Y.Plugin.Drag,{handles:[".yui3-widget-hd"]});
this.dd.plug(Y.Plugin.DDConstrained,{constraint2node:"#content"});
this.set("dragObj",new Y.DD.Drag({node:"#monitorFilterPanel"}));
},buildFieldNameSelector:function(_29,_2a,_2b){
var id="monitorFilterFieldName_"+_2a;
var _2d=_29.one("#"+id);
if(!_2d){
_2d=createSELECT(_29,"monitorFilterFieldName").set("id","monitorFilterFieldName_"+_2a).set("tabIndex",1+(_2a*3)).setStyle("top",30*_2a);
_2d.on("click",this.clickedFilter,this);
_2d.on("change",this.selectedFilter,this);
}
removeAllChildren(_2d);
this.addOption(_2d,"","Choose...");
var _2e=this.get("fieldDefinitions");
for(var i=0;i<_2e.length;i++){
var fld=_2e[i];
this.addOption(_2d,fld[0],fld[1]);
}
_2d.set("selectedIndex",0);
_2d.set("disabled",!_2b);
return _2d;
},buildAndDiv:function(_31,_32,_33){
var id="monitorFilterAnd_"+_32;
var _35=_31.one("#"+id);
var _36=_31.create("<DIV>").addClass("monitorFilterAnd").set("text","and").set("id","monitorFilterAnd_"+_32).setAttribute("disabled",!_33).setStyle("top",30*_32);
if(_35){
_31.replaceChild(_36,_35);
}else{
_31.append(_36);
}
return _36;
},buildConditionSelector:function(_37,_38,_39,_3a){
var id="monitorFilterCondition_"+_38;
var _3c=_37.one("#"+id);
var _3d=_37.create("<SELECT>").addClass("monitorFilterCondition").set("id","monitorFilterCondition_"+_38).set("disabled",!_3a).set("tabIndex",2+(_38*3)).setStyle("top",30*_38);
if(_39){
this.addOption(_3d,"SET","is set");
this.addOption(_3d,"UNSET","is not set");
this.addOption(_3d,"EQ","==");
this.addOption(_3d,"NEQ","!=");
}
if(_39===_26||_39===_27){
this.addOption(_3d,"LEQ","<=");
this.addOption(_3d,"LT","<");
this.addOption(_3d,"GT",">");
this.addOption(_3d,"GEQ",">=");
}
if(_39===_26){
this.addOption(_3d,"CONTAIN","contains");
this.addOption(_3d,"NOT_CONTAIN","does not contain");
this.addOption(_3d,"START","starts with");
this.addOption(_3d,"END","ends with");
}
if(_3c){
_37.replaceChild(_3d,_3c);
}else{
_37.append(_3d);
}
return _3d;
},buildTextValueEntry:function(_3e,_3f,_40,_41){
var id="monitorFilterValue_"+_3f;
var _43=_3e.one("#"+id);
var _44=_3e.create("<INPUT>").addClass("monitorFilterValue").set("id",id).set("type",(_40===_27?"number":"text")).set("disabled",!_41).set("tabIndex",3+(_3f*3)).setStyle("top",30*_3f);
if(_43){
_3e.replaceChild(_44,_43);
}else{
_3e.append(_44);
}
return _44;
},buildSelectValueEntry:function(_45,_46,_47,_48){
var id="monitorFilterValue_"+_46;
var _4a=_45.one("#"+id);
var _4b=_45.create("<SELECT>").addClass("monitorFilterValue").set("id",id).set("selectedIndex",0).setStyle("top",30*_46).set("disabled",!_48).set("tabIndex",3+(_46*3)).setStyle("top",30*_46);
for(var i=0;i<_47.length;i++){
this.addOption(_4b,_47[i],_47[i]);
}
if(_4a){
_45.replaceChild(_4b,_4a);
}else{
_45.append(_4b);
}
return _4b;
},selectedFilter:function(ev){
var _4e=this;
var _4f=ev.target;
var _50=_4f.get("value");
var id=_4f.get("id");
var _52=parseInt(id.substring(id.lastIndexOf("_")+1),10);
var _53=_4f.get("parentNode");
if(_50===""){
this.buildConditionSelector(_53,_52,null,false);
this.buildTextValueEntry(_53,_52,null,false);
for(var i=_52+1;i<this.maxFilters;i++){
var _55=this.buildAndDiv(_53,i,false);
var _4f=this.buildFieldNameSelector(_53,i,false,false);
var _56=this.buildConditionSelector(_53,i,null,false);
var _57=this.buildTextValueEntry(_53,i,null,false);
}
return;
}
var _58=this.getFieldDefinition(_50);
var _59=_58[2];
this.buildConditionSelector(_53,_52,_59,true);
if(typeOf(_59)===_28){
var _5a=this.gatherFilterEntries();
this.buildSelectValueEntry(_53,_52,_59(_5a),true);
}else{
this.buildTextValueEntry(_53,_52,_59,true);
}
if(_52<this.maxFilters-1){
_53.one("#monitorFilterAnd_"+(_52+1)).setAttribute("disabled",false);
_53.one("#monitorFilterFieldName_"+(_52+1)).set("disabled",false);
}
},checkEnter:function(e){
var _5c=(e.keyCode?e.keyCode:e.which);
if(_5c===13){
e.preventDefault();
var _5d=Y.one("#sessionsSearchButton");
_5d.simulate("click");
}
},display:function(_5e,_5f,_60,_61){
this.set("clusterModel",_5e);
this.set("fieldDefinitions",_60);
this.set("callback",_61);
if(this.firstTime){
this.render();
this.firstTime=false;
}else{
centerPanel(this);
}
this.assignFilters(null);
this.assignFilters(_5f);
this.get("contentBox").one("#monitorFilterFieldName_0").focus();
},assignFilters:function(_62){
var _63=this.get("contentBox");
var _64=_63.one("#monitorFilterListDiv");
var _65=0;
if(_62!==undefined&&_62!==null){
var _66=_62.getSubFilters();
_65=_66.length;
var _67=null;
var _68=null;
for(var _69=0;_69<_65;_69++){
var _6a=_66[_69];
var _6b=this.getFieldDefinition(_6a.attribute);
var _6c=_6b[2];
if(_69>0){
_67=_64.one("#monitorFilterAnd_"+_69);
if(!_67){
_67=this.buildAndDiv(_64,_69,true);
}else{
_67.setAttribute("disabled",false);
}
}
_68=_64.one("#monitorFilterFieldName_"+_69);
if(!_68){
_68=this.buildFieldNameSelector(_64,_69,true);
}else{
_68.set("disabled",false);
}
this.setSelectItem(_68,_6a.attribute);
var _6d=this.buildConditionSelector(_64,_69,_6c,true);
this.setSelectItem(_6d,_6a.operator);
var _6e=null;
if(typeOf(_6c)==="function"){
_6e=this.buildSelectValueEntry(_64,_69,_6c(),true);
this.setSelectItem(_6e,_6a.value);
}else{
_6e=this.buildTextValueEntry(_64,_69,_6c,true);
this.setTextItem(_6e,_6a.value);
}
}
}
for(var i=_65;i<this.maxFilters;i++){
if(i>0){
this.buildAndDiv(_64,i,(i===_65));
}
this.buildFieldNameSelector(_64,i,(i===_65));
this.buildConditionSelector(_64,i,null,false);
this.buildTextValueEntry(_64,i,null,false);
}
},addOption:function(_70,_71,_72){
var _73=createOPTION(_70,null,_72,_71);
},setSelectItem:function(_74,_75){
var _76=_74.get("options");
for(var i=0;i<_76.size();i++){
var _78=_76.item(i);
if(_78.get("value")===_75){
_74.set("selectedIndex",i);
}
}
},setTextItem:function(_79,_7a){
_79.set("value",""+_7a);
},gatherFilterEntries:function(){
var _7b=[];
for(var i=0;i<this.maxFilters;i++){
var _7d=Y.one("#monitorFilterFieldName_"+i);
var _7e=_7d.get("value");
if(!_7e||_7e===""){
continue;
}
var _7f=Y.one("#monitorFilterCondition_"+i);
var _80=_7f.get("value");
var _81=Y.one("#monitorFilterValue_"+i);
var _82=_81.get("value").trim();
var _83=[_7e,_80,_82];
_7b.push(_83);
}
return _7b;
},handleClearButton:function(e){
e.preventDefault();
this.assignFilters(null);
},handleOkayButton:function(e){
e.preventDefault();
var _86=this.gatherFilterEntries();
var _87=[];
var _88=new AndFilter();
for(var i=0;i<_86.length;i++){
var _8a=_86[i];
var _8b=_8a[0];
var _8c=_8a[1];
var _8d=_8a[2];
var _8e=this.getFieldDefinition(_8b);
if(_8d===""&&_8c!=="SET"&&_8c!=="UNSET"){
_87.push("Field '"+_8e[1]+"' has no value");
continue;
}
var _8f=_8e[2];
if(typeOf(_8f)==="function"){
_88.addFilter(new ValueFilter(_8b,_8c,_8d));
}else{
if(_8f===_27){
if(_8c!=="SET"&&_8c!=="UNSET"){
if(!isNumeric(_8d)){
_87.push("Field '"+_8e[1]+"' must be a number");
continue;
}
_8d=parseFloat(_8d);
}else{
_8d="";
}
_88.addFilter(new NumericFilter(_8b,_8c,_8d));
}else{
_88.addFilter(new AlphaFilter(_8b,_8c,_8d));
}
}
}
if(_87.length>0){
var _90="Cannot save filter:";
for(var i=0;i<_87.length;i++){
_90=_90+"\n  "+_87[i];
}
alert(_90);
return;
}
this.hide();
var _91=this.get("callback");
if(_91){
_91(_88);
}
},handleCancelButton:function(e){
e.preventDefault();
this.hide();
},getFieldDefinition:function(_93){
var _94=this.get("fieldDefinitions");
var _95=null;
for(var i=0;i<_94.length;i++){
_95=_94[i];
if(_95[0]===_93){
return _95;
}
}
return null;
}},{ATTRS:{srcNode:{value:"#monitorFilterPanel"},clusterModel:{value:null},fieldDefinitions:{value:null},callback:{value:null},centered:{value:true},modal:{value:true},zIndex:{value:5},buttons:{value:[{value:"Clear",classNames:"monitorFilterClear commandButton",action:function(e){
this.handleClearButton(e);
},section:Y.WidgetStdMod.FOOTER},{value:"OK",classNames:"monitorFilterOkay commandButton",action:function(e){
this.handleOkayButton(e);
},section:Y.WidgetStdMod.FOOTER},{value:"Cancel",classNames:"monitorFilterCancel commandButton",action:function(e){
this.handleCancelButton(e);
},section:Y.WidgetStdMod.FOOTER}]}}});
},"0.99",{requires:["panel","dd","dd-plugin","dd-drag","event","gallery-widget-inherit-css"],skinnable:false});
"use strict";
function defineSplitPanel(Y){
Y.SplitPanel=Y.Base.create("splitPanel",Y.Widget,[],{initializer:function(){
var _9b=this;
var _9c=this.get("topPanel");
if(_9c){
this.set("topPanel",Y.one(_9c));
}
var _9d=this.get("bottomPanel");
if(_9d){
this.set("bottomPanel",Y.one(_9d));
}
var _9e=this.get("divider");
if(_9e){
this.set("divider",Y.one(_9e));
}
Y.one("window").on("resize",_9b.resizeFn,_9b);
},renderUI:function(){
var _9f=this;
var _a0=_9f.getSizeAttr();
var _a1=_9f.getTopPositionAttr();
var _a2=_9f.getBottomPositionAttr();
var _a3=_9f.get("contentBox");
var _a4=_9f.get("boundingBox");
var _a5=_9f.get("topContainer");
if(!_a5){
_a5=createDIV(_a3,"yui3-splitpanel-"+_a1+"-panel");
_9f.set("topContainer",_a5);
}
var _a6=_9f.get("topPanel");
if(_a6){
_a5.append(_a6);
}
var _a7=_9f.get("divider");
if(!_a7){
_a7=createDIV(_a3,"yui3-splitpanel-divider").set("id","splitPanelDivider");
_9f.set("divider",_a7);
}
var _a8=_9f.get("bottomContainer");
if(!_a8){
_a8=createDIV(_a3,"yui3-splitpanel-"+_a2+"-panel");
_9f.set("bottomContainer",_a8);
}
var _a9=_9f.get("bottomPanel");
if(_a9){
_a8.append(_a9);
}
var _aa=parseInt(_a3.getStyle(_a0),10);
var _ab=_9f.getFullSize(_a7);
var _ac=_9f.get("initialPosition");
var _ad=0;
if(isNumeric(_ac)){
_ad=parseInt(_ac,10);
if(_ad<0){
_ad=_aa+_ad;
}
}else{
if(_ac.endsWith("%")){
_ad=parseInt(_ac.substring(0,_ac.length-1),10);
if(_ad<0){
_ad=100+_ad;
}
_ad=Math.floor(_ad*_aa);
}else{
if(_ac.endsWith("px")){
_ad=parseInt(_ac.substring(0,_ac.length-2),10);
if(_ad<0){
_ad=_aa+_ad;
}
}
}
}
_ad-=Math.floor((_ab+1)/2);
_ad=Math.max(_ad,_9f.get("topPanelMinSize")+1);
_ad=Math.min(_ad,_aa-_9f.get("bottomPanelMinSize")-_ab);
_a5.setStyle(_a0,_ad-1);
_a7.setStyle(_a1,_ad);
_a8.setStyle(_a1,_ad+_ab);
_a8.setStyle(_a0,_aa-(_ad+_ab));
_9f.set("desiredBottomSize",_aa-(_ad+_ab));
var _ae=new Y.DD.Drag({node:"#splitPanelDivider"}).plug(Y.Plugin.DDConstrained,{constrain2node:_a3});
_9f.set("drag",_ae);
_ae.on("drag:start",_9f.onDragStart,_9f);
_ae.on("drag:drag",_9f.onDragDrag,_9f);
_ae.on("drag:align",function(e){
var _b0=e.target;
var _b1=_9f.get("contentBox");
var _b2=_9f.get("divider");
var _b3=_9f.get("topPanelMinSize");
var _b4=_9f.get("bottomPanelMinSize");
var _b5=_9f.getSizeAttr();
var min,max,_b8;
var _b9=_b1.getXY();
var _ba=parseInt(_b1.getStyle(_b5),10);
var _bb=_9f.getFullSize(_b2);
if(_9f.isVertical()){
min=_b9[1]+_b3;
max=_b9[1]+_ba-_b4-_bb;
_b8=e.pageY-_b0.deltaXY[1];
if(_b8<min){
_b8=min;
}else{
if(_b8>max){
_b8=max;
}
}
_b0.actXY=[_b1.getX(),_b8];
}else{
min=_b9[0]+_b3;
max=_b9[0]+_ba-_b4-_bb;
_b8=e.pageX-_b0.deltaXY[0];
if(_b8<min){
_b8=min;
}else{
if(_b8>max){
_b8=max;
}
}
_b0.actXY=[_b8,_b1.getY()];
}
e.preventDefault();
});
},resizeFn:function(ev){
var _bd=this;
var _be=_bd.getSizeAttr();
var _bf=_bd.getTopPositionAttr();
var _c0=_bd.get("contentBox");
var _c1=parseInt(_c0.getStyle(_be),10);
var _c2=_bd.get("topContainer");
var _c3=parseInt(_c2.getStyle(_be),10);
var _c4=_bd.getFullSize(_c2);
var _c5=_bd.get("divider");
var _c6=_bd.getFullSize(_c5);
var _c7=_bd.get("bottomContainer");
var _c8=parseInt(_c7.getStyle(_be),10);
var _c9=_bd.getFullSize(_c7);
var _ca=_bd.get("desiredBottomSize");
var _cb=_c4+_c6+_c9;
var _cc=_c1-_cb;
if(_cc>0){
if(_c9<_ca){
if(_c9+_cc<=_ca){
_c7.setStyle(_be,_c8+_cc);
_cc=0;
}else{
_cc=(_c9+_cc-_ca);
_c7.setStyle(_be,_c8+_cc);
}
}
if(_cc>0){
_c2.setStyle(_be,_c3+_cc);
_c5.setStyle(_bf,parseInt(_c5.getStyle(_bf),10)+_cc);
_c7.setStyle(_bf,parseInt(_c7.getStyle(_bf),10)+_cc);
}
}else{
if(_cc<0){
_cc=-_cc;
var _cd=_bd.get("topPanelMinSize");
var _ce=_bd.get("bottomPanelMinSize");
var _cf;
if(_c4>_cd){
_cf=_c4-_cd;
_cf=Math.min(_cf,_cc);
_c2.setStyle(_be,_c3-_cf);
_c5.setStyle(_bf,parseInt(_c5.getStyle(_bf),10)-_cf);
_c7.setStyle(_bf,parseInt(_c7.getStyle(_bf),10)-_cf);
_cc=_cc-_cf;
}
if(_cc>0){
_c7.setStyle(_be,_c8-_cc);
}
}else{
}
}
},onDragStart:function(ev){
this.set("lastDivPosition",this.getDivPosition(ev));
},onDragDrag:function(ev){
var _d2=this.getDivPosition(ev);
var _d3=this.get("lastDivPosition");
var _d4=(_d2-_d3);
if(_d4!==0){
var _d5=this.getSizeAttr();
var _d6=this.getTopPositionAttr();
var _d7=this.get("topContainer");
_d7.setStyle(_d5,(parseInt(_d7.getStyle(_d5),10)+_d4));
var _d8=this.get("divider");
var top=parseInt(_d8.getStyle(_d6),10);
_d8.setStyle(_d6,(top+_d4));
var _da=this.get("bottomContainer");
var _db=parseInt(_da.getStyle(_d5),10);
top=parseInt(_da.getStyle(_d6),10);
_da.setStyle(_d6,(top+_d4));
_da.setStyle(_d5,(_db-_d4));
this.set("desiredBottomSize",(_db-_d4));
this.set("lastDivPosition",_d2);
}
},isVertical:function(){
return (this.get("direction")==="vertical");
},getDivPosition:function(ev){
return (this.isVertical()?ev.pageY:pageX);
},getSizeAttr:function(ev){
return (this.isVertical()?"height":"width");
},getTopPositionAttr:function(ev){
return (this.isVertical()?"top":"left");
},getBottomPositionAttr:function(ev){
return (this.isVertical()?"bottom":"right");
},getFullSize:function(_e0){
var _e1=this.getSizeAttr();
var _e2=this.getTopPositionAttr();
var _e3=this.getBottomPositionAttr();
var _e4=_e0.getStyle("margin-"+_e2);
_e4=(_e4?parseInt(_e4,10):0);
var _e5=_e0.getStyle("border-"+_e2);
_e5=(_e5?parseInt(_e5,10):0);
var _e6=parseInt(_e0.getStyle(_e1),10);
var _e7=_e0.getStyle("border-"+_e3);
_e7=(_e7?parseInt(_e7,10):0);
var _e8=_e0.getStyle("margin-"+_e3);
_e8=(_e8?parseInt(_e8,10):0);
var _e6=_e4+_e5+_e6+_e7+_e8;
return _e6;
}},{ATTRS:{container:{value:null},direction:{value:"vertical"},topContainer:{value:null},bottomContainer:{value:null},initialPosition:{value:"50%"},desiredBottomSize:{value:null},topPanel:{value:null},topPanelMinSize:{value:0},bottomPanel:{value:null},bottomPanelMinSize:{value:0},divider:{value:null},lastDivPosition:{value:null},}});
};
