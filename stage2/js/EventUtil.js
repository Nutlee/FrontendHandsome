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
	}
};

//id取dom
function $(id) {
	id=id.split("#")[1];
	return document.getElementById(id);
}
// 重置定时器
function resetTimer() {
	for (var i = 0; i <timeId; i++) {
		// console.log("清除了",hightTimer);
		clearTimeout(timeId);
	};
}
function removeClass(dom,cls) {
	var regTxt='(^|\\s)'+cls+'(\\s|$)';
	dom.className = dom.className.replace((new RegExp(regTxt)),"");
}