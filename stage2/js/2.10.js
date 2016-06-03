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
// 存储遍历结果数组
var focusNodeList=[];
/**
 * 遍历算法 效果展示  延迟focusNodeList（遍历结果数组） 添加、延迟移除focus这个class
 * 
 * @param  {[type]} nodeList [description]
 * @return {[type]}          [description]
 */
var hightTimer;
var speed=500;
function focusNode(nodeList) {
	var node=nodeList.shift();
	// console.log(node);
	node.className+=" focus";
 	hightTimer=setTimeout(function(){
	    node.className = node.className.replace((new RegExp("(^|\\s)focus(\\s|$)")),"");
	    if (!nodeList.length) {
	    	return;
	    };
	    focusNode(nodeList);
    }, speed)
}
function resetNode(rootNode) {
	for (var i = 0; i < hightTimer; i++) {
		// console.log("清除了",hightTimer);
		clearTimeout(hightTimer);
	};
	rootNode.className="root";
	var level=rootNode.getElementsByTagName("div");
	for(var i = 0, length1 = level.length; i < length1; i++){
		level[i].className="level";
	}
	focusNodeList=[];

}
$("#test").onclick=function() {
	resetNode($("#root"));
}
/**
 * 先序遍历 递归
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
var preOrder0 = function (node) {
  if (node) { 
  	focusNodeList.push(node);
    preOrder0(node.children[0]);
    preOrder0(node.children[1]);
  } 
}
/**
 * 先序遍历 非递归
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
var preOrder1 =function (node) {
	if (!node) {
	    throw new Error('Empty Tree')
	}	
    var stack=[]; //模拟栈  
    stack.push(node);  
    do{  
    	//pop() 后进先出
        if((node=stack.pop())!=null){ //出栈  
            focusNodeList.push(node); 
            stack.push(node.children[1]); //右子节点入栈  
            stack.push(node.children[0]); //左子节点入栈  
        }  
    }while(!!stack.length);	
}
EventUtil.addHandler($("#NLRbtn"),"click",function(){
	var rootNode=$("#root");
	resetNode(rootNode);	
	switch (getValueBySelName("method")) {
		case "0":
			preOrder0(rootNode);
			hightTimer=setTimeout(focusNode(focusNodeList), speed);
			break;
		case "1":
			preOrder1($("#root"));
			hightTimer=setTimeout(focusNode(focusNodeList), speed);		
			break;
	}
})

/**
 * 中序 递归
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
var inOrder0 = function (node) {
  if (node) {
    inOrder0(node.children[0]);
    focusNodeList.push(node);
    inOrder0(node.children[1]);
  }
}
/**
 * 中序列 非递归
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
var inOrder1 = function (node) {
	 if (!node) {
	     throw new Error('Empty Tree')
	 }
	 var stack = []
	 while (stack.length !== 0 || node) {
	     if (node) {
	         stack.push(node)
	         node = node.children[0];
	     } else {
	         node = stack.pop()
	         focusNodeList.push(node);
	         node = node.children[1];
	     }
	 }
}
EventUtil.addHandler($("#LNRbtn"),"click",function(){
	var rootNode=$("#root");
	resetNode(rootNode);
	switch (getValueBySelName("method")) {
		case "0":
			inOrder0(rootNode);
			setTimeout(focusNode(focusNodeList), speed);
			break;
		case "1":
			inOrder1(rootNode);
			setTimeout(focusNode(focusNodeList), speed);
			break;
	}
})

/**
 * 后序 递归
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
var postOrder0 = function (node) {
  if (node) {
    postOrder0(node.children[0]);
    postOrder0(node.children[1]);
    focusNodeList.push(node);
  }
}
/**
 * 后序 非递归  使用1个栈
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
// var postOrder1 = function (node) {
// 	if (!node) {
// 	    throw new Error('Empty Tree');
// 	}
// 	var stack = [];
// 	stack.push(node);
// 	var tmp = null;
// 	while (stack.length !== 0) {
// 	    tmp = stack[stack.length - 1]
// 	    if (tmp.children[0] && node !== tmp.children[0] && node !== tmp.children[1]) {
// 	        stack.push(tmp.children[0]);
// 	    } else if (tmp.children[1] && node !== tmp.children[1]) {
// 	        stack.push(tmp.children[1]);
// 	    } else {
// 	        focusNodeList.push(stack.pop());
// 	        node = tmp;
// 	    }
// 	}
// }
/**
 * 后序 非递归 使用两个栈
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
var postOrder1 = function (node) {
	if (node) {
	    var s1 = []
	    var s2 = []
	    s1.push(node)
	    while (s1.length !== 0) {
	        node = s1.pop()
	        s2.push(node)
	        if (node.children[0]) {
	            s1.push(node.children[0])
	        }
	        if (node.children[1]) {
	            s1.push(node.children[1])
	        }
	    }
	    while (s2.length !== 0) {
	        focusNodeList.push(s2.pop());
	    }
	}
}
EventUtil.addHandler($("#LRNbtn"),"click",function(){
	var rootNode=$("#root");
	resetNode(rootNode);	
	switch (getValueBySelName("method")) {
		case "0":
			postOrder0(rootNode);
			setTimeout(focusNode(focusNodeList), speed);			
			break;
		case "1":
			postOrder1(rootNode);
			setTimeout(focusNode(focusNodeList), speed);
			break;
	}
})
