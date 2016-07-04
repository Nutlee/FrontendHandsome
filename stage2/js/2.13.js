//展开节点
EventUtil.addHandler($('#root'),"click",function(){
	var event=EventUtil.getEvent(event),
		target=EventUtil.getTarget(event),
		cldNode=target.getElementsByTagName('ul')[0];
	if (target.nodeName.toLowerCase() === 'li') {
		resetNode(this.parentNode);
		target.className += ' focus';
	};
	if (cldNode) {
		if (elementHasClassName(cldNode,'hide')) {
			removeClass(cldNode,'hide');
			cldNode.className += 'show';
		} else {
			removeClass(cldNode,'show');
			cldNode.className += 'hide';			
		}
	};
});
//非递归深度优先实现
//keyNode 为搜索Node
var trMethod0 = function (root,keyNode) {
    var treeNodes=root.children[0].children;
    if (!treeNodes || !treeNodes.length) {return};
    var stack = [],trStack = [root];
    if (keyNode === root.firstChild.nodeValue.trim()) {
    	root.className+=" focus";
    	// return trStack;
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
        	item.className+=" focus";
        	showParentBranch(item);
        	// return trStack;
        }
        //如果该节点有子节点，继续添加进入栈顶
        if (item.children && item.children.length) {
            len = item.children[0].children.length;
            for (; len; len--) {
	            stack.unshift(item.children[0].children[len - 1]);
            }
        }
    }
    // console.log(trStack);
    return trStack;
};

//绑定操作
EventUtil.addHandler($('#operate'),"click",function(){
	var event=EventUtil.getEvent(event),
		target=EventUtil.getTarget(event),
		focusNode=getElementsByClassName('focus')[0];
	if (target.id === 'addnode') {
		var addNodeValue=$('#newnodevalue').value.trim();
		if (focusNode) {
			if (addNodeValue) {
				if (focusNode.children.length && focusNode.children[0].className === 'hide') {
					showChildBranch(focusNode);
				};
				var branch=focusNode.getElementsByTagName('ul')[0];
				if (branch) {
					branch.innerHTML += '<li>'+addNodeValue+'</li>';
				} else {
					focusNode.innerHTML += '<ul><li>'+addNodeValue+'</li></ul>';
				};
			} else {
				alert('请输入插入的节点值');
			};
		} else {
			alert('请先选中节点');
		};	
	} else if (target.id === 'delnode') {
		if (focusNode) {
			if (elementHasClassName(focusNode,'root')) {
				alert('根节点不能删除')
			} else {
				focusNode.parentNode.removeChild(focusNode);
			};
		} else {
			alert('请选中节点');
		}
	} else if (target.id === 'searchnode') {
		var nodeTxt = $('#newnodevalue').value.trim(),
			root = $('#root');
		if (nodeTxt) {
			resetNode(root.parentNode);
			trMethod0(root,nodeTxt);
		};
	};
});

function resetNode (root) {
	var allNodes = root.getElementsByTagName('li');
	for (var i = allNodes.length - 1; i >= 0; i--) {
		var iNode=allNodes[i];
		if (elementHasClassName(iNode,'focus')) {
			removeClass(iNode,'focus');
		}
	};	 
};
function showParentBranch(node) {
	var parentNode = node.parentNode;
	while (parentNode.nodeName.toLowerCase() ==='ul') {
		parentNode.className = 'show';
		parentNode = parentNode.parentNode.parentNode;
	}
};
function showChildBranch(node) {
	var childBranchUl = node.getElementsByTagName('ul');
	for (var i = childBranchUl.length - 1; i >= 0; i--) {
		childBranchUl[i].className = 'show';
	};
}
