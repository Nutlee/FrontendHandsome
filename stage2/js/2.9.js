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
function $(id) {
	return document.getElementById(id);
}

//创建tag dom
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
//判断按下keyArray
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
//鼠标移动到 tag
var tagOperateStr="删除";
EventUtil.addHandler($("tagarea"),"mouseover",function(event){
	event = EventUtil.getEvent(event);	
	var target=EventUtil.getTarget(event);
	if (target.className=="tagblock") {
		event.target.innerHTML=tagOperateStr+event.target.innerHTML;
	}
});
//鼠标移出 tag
EventUtil.addHandler($("tagarea"),"mouseout",function(event){
	event = EventUtil.getEvent(event);	
	var target=EventUtil.getTarget(event);
	if (target.className=="tagblock") {
		event.target.innerHTML=event.target.innerHTML.replace(tagOperateStr,"");
	}
})
//点击tag	
EventUtil.addHandler($("tagarea"),"click",function(event){
	event = EventUtil.getEvent(event);	
	var target=EventUtil.getTarget(event);
	if (target.className=="tagblock") {
		target.parentNode.removeChild(target);
	}
});	

function createHobbyBlock(str) {
	var blockHtml="",
		inputArr=inputHobbyArray(str),
		areaArr=areaHobbyArray(),
		insertArr=[];
	if (areaArr.length) {
		for(var i = 0, len = inputArr.length; i < len; i++){
			if (areaArr.indexOf(inputArr[i]) < 0) {
				insertArr.push(inputArr[i]);
			}
		}
		insertArr=areaArr.concat(insertArr);
		if (insertArr.length>10) {
			insertArr.splice(0,insertArr.length-10)
		} else if (insertArr.length == 0){
			return "";
		} 
	} else {
		insertArr=inputArr;
	}
	return renderHobbyArea(insertArr);
}
//兴趣爱好输入数组
function inputHobbyArray(str) {
	//按 任意空白符 换行符 回车符 半角全角逗号 顿号 分割数组
	var inputArr=str.split(/[\s\n\r\,\，\、]+/);
		tempArr=[];
	//输入数组去重
	for(var i = 0, length1 = inputArr.length; i < length1; i++){
		if (tempArr.indexOf(inputArr[i]) == -1) {
			tempArr.push(inputArr[i]);
		}
	}
	return tempArr;
}
//兴趣爱好 已存在数组
function areaHobbyArray() {
	var hobbyArray=[],hobbyArrayObj=$("hobbyarea").getElementsByTagName("div");
	for(var i = 0, len = hobbyArrayObj.length; i < len; i++){
		hobbyArray.push(hobbyArrayObj[i].innerHTML);
	}
	return hobbyArray;
}
//通过数组渲染显示
function renderHobbyArea(arr) {
	var blockHtml="";
	for(var i = 0, length1 = arr.length; i < length1; i++){
		if (arr[i]) {
			blockHtml+="<div>"+arr[i].trim()+"</div>";
		};
	}
	return blockHtml;
}
EventUtil.addHandler($("hobbybtn"),"click",function(event){
	var innerHtml=createHobbyBlock($("hobbyinput").value);
	if (innerHtml) {
		$("hobbyarea").innerHTML=innerHtml;
	}	
})