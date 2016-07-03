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
	stopPropagation: function(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		};
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
//移除className
function removeClass(dom,cls) {
	var regTxt='(^|\\s)'+cls+'(\\s|$)';
	dom.className = dom.className.replace((new RegExp(regTxt)),"");
}
// 根据className取dom
function getElementsByClassName(className) {
	if (document.querySelectorAll) {
		return document.querySelectorAll('.'+className);
	};
	var doms=document.getElementsByTagName("*"),
		classNamesDom=[],
		classReg= new RegExp('(^|\\s)'+className+'(\\s|$)');
	for (var i = doms.length - 1; i >= 0; i--) {
		var dom = doms[i];
		if (classReg.test(dom.className)) {
			classNamesDom.push(dom);
		};
	};
	return classNamesDom;
}
// 判断是否已经有className
function elementHasClassName(ele,className) {
	var classReg= new RegExp('(^|\\s)'+className+'(\\s|$)');
	return classReg.test(ele.className);
}
//dom 增加class
function addClass(ele,className) {
	if (elementHasClassName(ele,className)) {
		return;
	} else {
		ele.className += ' '+className
	}
}
