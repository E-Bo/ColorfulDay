/**
* Trans-Rotate
* @version: 0.1
* @author: E_Bo
* @date: 2014-12-18
* @work with jQuery or Zepto
*/
(function ($,undefined) {
	
	var Origami = function(element, options){
		
		var hasOptions = typeof options == 'object';
		
		this.element = $(element);
		
		var ebo_trigger = ["hover","click"];
		var ebo_animation = ["kami","rolling-over"];
		
		var _trigger = {"hover": " hover-active","click":""};
		
		this.trigger = ebo_trigger[0];
		this.animation = ebo_animation[0];
		
		this.extraClass = "";
		
		this.topElement = null;
		this.bottomElement = null;
		
		if(hasOptions){
			if(typeof(options.trigger) == "string" && ebo_trigger.indexOf(options.trigger) != -1) {
                this.trigger = options.trigger;
           }
		    if(typeof(options.animation) == "string" && ebo_animation.indexOf(options.animation) != -1) {
                this.animation = options.animation;
           }
		    if(typeof(options.extraClass) == "string"){
				 this.extraClass = " " + options.extraClass;
			}
			if(typeof(options.topElement) == "object"){
				 this.topElement = $(options.topElement);
			}
			if(typeof(options.bottomElement) == "object"){
				 this.bottomElement = $(options.bottomElement);
			}
		 }
		 
		 if(!this.topElement || !this.bottomElement){
			 console.error("真是寂寞难耐啊，没有找到对象...");
			 return;
		 }
		 if(this.animation == ebo_animation[1]){
		 	this.extraClass += " "+this.animation;
		 }
		 
		 this.width = this.topElement.width() > this.bottomElement.width() ? this.topElement.width(): this.bottomElement.width();
		 this.height = this.topElement.height() > this.bottomElement.height() ? this.topElement.height(): this.bottomElement.height();

		 function XMLtoString(xml){
		 	//var s = new XMLSerializer();
		 	//return s.serializeToString(xml);
		 	return '<svg width="160" height="160" id="logo_2" class="logo" style="visibility:hidden;"><g><use xlink:href="#niu" x="-26" y="-13" /><use xlink:href="#yan" x="-26" y="-13"/><use xlink:href="#xiao" x="-26" y="-13"/><animate id="logoA_5" attributeName="opacity" values="1;1;0.7;1;1" keyTimes="0;0.1;0.5;0.9;1" begin="1s" dur="1.5s" repeatCount="indefinite"/></g></svg>';
		 }
		 var _topHtml = this.topElement.clone().removeAttr("style")[0].outerHTML || "您的浏览器太low了";
		 var _bottomHtml = this.bottomElement.clone().removeAttr("style")[0].outerHTML || "您的浏览器太low了";
		 
		 this.topElement.hide();
		 this.bottomElement.hide();
		 
		 this.container = $("<div class='origami"+ _trigger[this.trigger] + this.extraClass +"' style='width:"+ this.width +"px;height:"+ this.height +"px;'></div>");
		 
		 var _topContainer = $("<div class='kami-wrapper on-top'>"
		 	+"<div class='kami-mask'>"
		 		+"<div class='kami'>"
					+_topHtml
		 		+"</div>"
		 	+"</div>"
			+"<div class='kami-peek-mask animation'>"
				+"<div class='kami kami-peek'>"
					+_topHtml
					+"<div class='kami-shadow'></div>"
				+"</div>"
			+"</div>"
		 +"</div>");
		 
		 var _bottomContainer = $("<div class='kami-wrapper'>"
		 	+"<div class='kami-mask animation'>"
		 		+"<div class='kami'>"
					+_bottomHtml
		 		+"</div>"
		 	+"</div>"
			+"<div class='kami-peek-mask'>"
				+"<div class='kami kami-peek'>"
					+_bottomHtml
				+"</div>"
			+"</div>"
		 +"</div>");
		 
		 this.container.append(_topContainer,_bottomContainer);
		 
		 this.topElement.hide();
		 this.bottomElement.hide();
		 
		 if(this.trigger == ebo_trigger[1]){
			 var _this = this.container;
			 _this.click(function(){
				 if(_this.hasClass("open")){
					 _this.removeClass("open");
				 }else{
					 _this.addClass("open");
				 }
			 });
		 }
		 
		 this.element.append(this.container);
	}
	
	$.fn.origami = function(options){
		options = options || {};
		this.each(function () {
			var el = $(this);
			if (!el.data('origami'))
				el.data('origami', new Origami(el, options));
		});
	}
})(Zepto);