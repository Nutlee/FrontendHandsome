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
function getValueBySelName(name) {
	var obj=document.getElementsByName(name);
	for(var i = 0, length1 = obj.length; i < length1; i++){
		if (obj[i].checked) {
			return obj[i].value;
		}
	}
}
function $(id) {
	id=id.split("#")[1];
	return document.getElementById(id);
}

var focusNodeList=[];
function focusNode(nodeList) {
	console.log("1");
	var node=nodeList.shift();
	node.className+=" focus";
 	setTimeout(function(){
	    node.className = node.className.replace((new RegExp("(^|\\s)focus(\\s|$)")),"");
	    if (!nodeList.length) {
	    	return;
	    };
	    focusNode(nodeList);
    }, 500)
}
/**
 * 先序遍历
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */

var preOrder = function (node) {
  if (node) { 
  	focusNodeList.push(node);
    preOrder(node.children[0]);
    preOrder(node.children[1]);
  } 
}
//先序
EventUtil.addHandler($("#NLRbtn"),"click",function(){
	switch (getValueBySelName("method")) {
		case "0":
			// console.dir($("#root").children);
			preOrder($("#root"));
			setTimeout(focusNode(focusNodeList), 500);
			break;
		case "1":
			break;
	}
})

//中序
var inOrder = function (node) {
  if (node) {
    preOrder(node.children[0]);
    focusNodeList.push(node);
    preOrder(node.children[1]);
  }
}
EventUtil.addHandler($("#LNRbtn"),"click",function(){
	switch (getValueBySelName("method")) {
		case "0":
			// console.dir($("#root").children);
			inOrder($("#root"));
			setTimeout(focusNode(focusNodeList), 500);
			break;
		case "1":
			break;
	}
})

//后序
var postOrder = function (node) {
  if (node) {
    preOrder(node.children[0]);
    preOrder(node.children[1]);
    focusNodeList.push(node);
  }
}
EventUtil.addHandler($("#LRNbtn"),"click",function(){
	switch (getValueBySelName("method")) {
		case "0":
			// console.dir($("#root").children);
			postOrder($("#root"));
			setTimeout(focusNode(focusNodeList), 500);
			break;
		case "1":
			break;
	}
})
