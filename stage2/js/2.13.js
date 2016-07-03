EventUtil.addHandler($('#root'),"click",function(){
	var event=EventUtil.getEvent(event),
		target=EventUtil.getTarget(event);
		cldNode=target.getElementsByTagName('ul')[0],
		allNode = this.parentNode.getElementsByTagName('li');
	if (target.nodeName.toLowerCase() === 'li') {
		for (var i = allNode.length - 1; i >= 0; i--) {
			var iNode=allNode[i];
			if (elementHasClassName(iNode,'focus')) {
				removeClass(iNode,'focus');
			}
		};
		target.className += 'focus';
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
