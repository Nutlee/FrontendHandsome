var EventUtil = {
	addHandler: function(element,type,handler) {
		if (element.addEventListener) {
			element.addEventListener(type,handler,false);
		} else if (element.attachEvent) {
			element.attachEvent("on"+type,handler);
		} else {
			element["on"+type]=handler;
		}
	},
	getEvent: function(event) {
		return event ? event :window.event;
	},
	getTarget: function(event) {
		return event.target || event.scrElement;
	},
	getCharCode: function(event) {
		if (typeof event.charCode == "number") {
			return event.charCode;
		} else {
			return event.keyCode;
		}
	},
	preventDefault: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	removeHandler: function(element,type,handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type,handler,false);
		} else if (element.detachEvent) {
			element.detachEvent("on"+type,handler);
		} else {
			element["on"+type] = null;
		}
	},
	stopPropagation: function(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}
};
function creatTagBlock(str) {
	var tag=document.createElement("div");
	tag.className="tagblock";
	tag.innerHTML=str;
	return tag;
}
function appendTagBlock(parent,node) {
	parent.appendChild(node);
}

// tag 按下逗号 回车 空格
var keyArray=[13,32,44];
	EventUtil.addHandler($("taginput"),"keypress",function(event){
		event = EventUtil.getEvent(event);
		if ( ( keyArray.indexOf(EventUtil.getCharCode(event)))> -1) {
			// 阻止提交
			EventUtil.preventDefault(event);
			var tagarea=$("tagarea"),tags=tagarea.getElementsByTagName("div"),tagLabel=$("taginput").value.trim();
			for(var i = 0, len = tags.length; i < len; i++){
				if (tags[i].innerHTML==tagLabel) {
					return false;
				}
			};
			if (len == 10) {
				tags[0].parentNode.removeChild(tags[0]);
			};
			appendTagBlock(tagarea,creatTagBlock(tagLabel));
		}
	});
	EventUtil.addHandler($("tagarea"),"mouseover",function(event){
		event = EventUtil.getEvent(event);	
		var target=EventUtil.getTarget(event);
		if (target.className=="tagblock") {
			event.target.innerHTML=tagOperateStr+event.target.innerHTML;
		}
	});
	var tagOperateStr="删除";
	EventUtil.addHandler($("tagarea"),"mouseout",function(event){
		event = EventUtil.getEvent(event);	
		var target=EventUtil.getTarget(event);
		if (target.className=="tagblock") {
			event.target.innerHTML=event.target.innerHTML.replace(tagOperateStr,"");
		}
	})	
	EventUtil.addHandler($("tagarea"),"click",function(event){
		event = EventUtil.getEvent(event);	
		var target=EventUtil.getTarget(event);
		if (target.className=="tagblock") {
			target.parentNode.removeChild(target);
		}
	});	
	function $(id) {
		return document.getElementById(id);
	}