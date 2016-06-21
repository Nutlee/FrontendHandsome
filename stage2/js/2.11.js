var searchRadio=document.getElementById("search-radio"),
	trRadio=document.getElementById("tr-radio"),
	searchKeyInput=document.getElementById("searchKey");
EventUtil.addHandler(searchRadio,"change",function(event){
	var event=EventUtil.getEvent(event);
	if (event.target.checked) {
		diabledInput(true);
	} else {
		diabledInput(false);
	}
})		
function diabledInput(isDisabled){
	searchKeyInput.disabled=isDisabled;
}
EventUtil.addHandler(trRadio,"click",function(event){
	diabledInput(false);
})
//非递归广度优先实现
var iterator1 = function (treeNodes) {
    if (!treeNodes || !treeNodes.length) return;

    var stack = [];

    //先将第一层节点放入栈
    for (var i = 0, len = treeNodes.length; i < len; i++) {
        stack.push(treeNodes[i]);
    }

    var item;

    while (stack.length) {
        item = stack.shift();

        console.log(item.id);

        //如果该节点有子节点，继续添加进入栈底
        if (item.children && item.children.length) {
            //len = item.children.length;

            // for (i = 0; i < len; i++) {
            //  stack.push(item.children[i]);
            // }

            stack = stack.concat(item.children);
        }
    }
};

//非递归深度优先实现
var iterator2 = function (treeNodes) {
    if (!treeNodes || !treeNodes.length) return;

    var stack = [];

    //先将第一层节点放入栈
    for (var i = 0, len = treeNodes.length; i < len; i++) {
        stack.push(treeNodes[i]);
    }

    var item;

    while (stack.length) {
        item = stack.shift();

        console.log(item.id);

        //如果该节点有子节点，继续添加进入栈顶
        if (item.children && item.children.length) {
            // len = item.children.length;

            // for (; len; len--) {
            //  stack.unshift(item.children[len - 1]);
            // }
            stack = item.children.concat(stack);
        }
    }
};

EventUtil.addHandler(document.getElementById("act"),"click",function(event){
	var firstType=document.getElementById("firsttype").value;
	// 遍历
	if (trRadio.checked) {
		switch (firstType) {
			case "0":
				// statements_1
				break;
			case "1":
				// statements_def
				break;
		}

	} else if (searchRadio.checked) {
		switch (firstType) {
			case "0":
				// statements_1
				break;
			case "1":
				// statements_def
				break;
		}

	}
})