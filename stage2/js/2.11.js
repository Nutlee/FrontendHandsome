// 因为非递归效率高，所以无论搜索还是遍历都只做了非递归。


var searchRadio=$("#search-radio"),
	trRadio=$("#tr-radio"),
	searchKeyInput=$("#searchkey");
EventUtil.addHandler(searchRadio,"change",function(event){
	var event=EventUtil.getEvent(event);
	if (event.target.checked) {
		diabledInput(false);
	} else {
		diabledInput(true);
	}
})		
function diabledInput(isDisabled){
	searchKeyInput.disabled=isDisabled;
}
EventUtil.addHandler(trRadio,"click",function(event){
	diabledInput(true);
})
searchKeyInput.disabled=true;
//非递归深度优先实现
//keyNode 为搜索Node
var trMethod0 = function (root,keyNode) {
	// console.log(keyNode);

    var treeNodes=root.children;

    if (!treeNodes || !treeNodes.length) {return};
    var stack = [],trStack = [root];
    if (keyNode === root.firstChild.nodeValue.trim()) {
    	root.className+=" search-focus";
    	return trStack;
    }    
    //先将第一层节点放入栈
    for (var i = 0, len = treeNodes.length; i < len; i++) {
        stack.push(treeNodes[i]);
    }

    var item;
    
    while (stack.length) {
        item = stack.shift();
        trStack.push(item);
        if (keyNode === item.firstChild.nodeValue.trim()) {
        	item.className+=" search-focus";
        	return trStack;
        }
        // console.log(stack);
        // console.log(item.innerHTML);

        //如果该节点有子节点，继续添加进入栈顶
        if (item.children && item.children.length) {
            len = item.children.length;

            for (; len; len--) {
            	// console.log(item.children[len - 1]);
	            stack.unshift(item.children[len - 1]);
            }
            // stack = item.children.concat(stack);
        }
    }
    // console.log(trStack);
    return trStack;
};

//非递归广度优先实现
//keyNode 为搜索Node
var trMethod1 = function (root,keyNode) {
	var treeNodes=root.children;
    if (!treeNodes || !treeNodes.length) {return};

    var stack = [],trStack=[root];
    if (keyNode === root.firstChild.nodeValue.trim()) {
    	root.className+=" search-focus";
    	return trStack;
    }
    //先将第一层节点放入栈
    for (var i = 0, len = treeNodes.length; i < len; i++) {
        stack.push(treeNodes[i]);
    }

    var item;
    while (stack.length) {
        item = stack.shift();
        trStack.push(item);
        if (keyNode === item.firstChild.nodeValue.trim()) {
        	item.className+=" search-focus";
        	return trStack;
        }
        // console.log(item.className);

        //如果该节点有子节点，继续添加进入栈底
        if (item.children && item.children.length) {
            len = item.children.length;
            for (i = 0; i < len; i++) {
                stack.push(item.children[i]);
            }

            // stack = stack.concat(item.children);
        }
    }
    // console.log(trStack);
    return trStack;
};

var trOption={
	speed: 500,
	timeId: ""
}

function focusNode(nodeList) {
	var node=nodeList.shift(),arCallee=arguments.callee;
	// console.log(node);
	node.className+=" focus";
 	trOption.timeId=setTimeout(function(){
	    node.className = node.className.replace((new RegExp("(^|\\s)focus(\\s|$)")),"");
	    //TO DO 正则表达式可以合并
	    node.className = node.className.replace((new RegExp("(^|\\s)search-focus(\\s|$)")),"");
	    if (!nodeList.length) {
	    	return;
	    };
	    arCallee(nodeList);
    }, trOption.speed)

}
function resetNode(rootNode) {
	for (var i = 0; i < trOption.timeId; i++) {
		// console.log("清除了",hightTimer);
		clearTimeout(trOption.timeId);
	};
	rootNode.className="root";
	var level=rootNode.getElementsByTagName("div");
	for(var i = 0, length1 = level.length; i < length1; i++){
		var levelDom=level[i];
		if (levelDom.className !== "level") {
			levelDom.className = "level";
		};
	}
	// focusNodeList=[];
}


EventUtil.addHandler($("#act"),"click",function(event){
	// var firstType=$("#firsttype").value,
	// 	trStack=[],root=$("#root");
	// 遍历
/*	if (trRadio.checked) {
		root = $("#root");
		resetNode(root);
		switch (firstType) {
			case "0":
				trStack=trMethod0(root);
				break;
			case "1":
				trStack=trMethod1(root);
				break;
		}
		focusNode(trStack);

	} else if (searchRadio.checked) {
		//搜索
		root = $("#root");
		resetNode(root);
		switch (firstType) {
			case "0":
				// console.log($("#searchkey").value);
				trStack=trMethod0(root,$("#searchkey").value);
				break;
			case "1":
				trStack=trMethod1(root,$("#searchkey").value);
				break;
		}
		focusNode(trStack);
	}*/
	var searchkey=$("#searchkey"),
		keyNode = searchkey.disabled ? null:searchkey.value;
	resetNode(root);
	animate(treMethod($("#firsttype").value,$("#root"),keyNode),focusNode);
})
function treMethod(type,root,keyNode) {
	var trStack=[];
	switch (type) {
		case "0":
			trStack=trMethod0(root,keyNode);
			break;
		case "1":
			trStack=trMethod0(root,keyNode);
			break;		
	}
	return trStack;
}
function animate(trStack,callback) {
	callback(trStack);
}
EventUtil.addHandler($("#stopAct"),"click",function(event){
	resetNode($('#root'));
})