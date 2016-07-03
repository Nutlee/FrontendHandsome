EventUtil.addHandler($('#root'),"click",function(){
	var event=EventUtil.getEvent(event),
		target=EventUtil.getTarget(event),
		cldNode=target.getElementsByTagName('ul')[0],
		allNode = this.parentNode.getElementsByTagName('li');
	if (target.nodeName.toLowerCase() === 'li') {
		for (var i = allNode.length - 1; i >= 0; i--) {
			var iNode=allNode[i];
			if (elementHasClassName(iNode,'focus')) {
				removeClass(iNode,'focus');
			}
		};
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
EventUtil.addHandler($('#operate'),"click",function(){
	var event=EventUtil.getEvent(event),
		target=EventUtil.getTarget(event),
		focusNode=getElementsByClassName('focus')[0];
	if (target.id === 'addnode') {
		var addNodeValue=$('#newnodevalue').value.trim();
		if (focusNode) {
			if (addNodeValue) {
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
	};
	if (target.id === 'delnode') {
		if (focusNode) {
			if (elementHasClassName(focusNode,'root')) {
				alert('根节点不能删除')
			} else {
				focusNode.parentNode.removeChild(focusNode);
			};
		} else {
			alert('请选中节点');
		}
	};
});