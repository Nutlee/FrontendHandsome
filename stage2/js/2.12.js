EventUtil.addHandler($("#root"),"click",function(event) {
	resetNode($('#root'));
	var event=EventUtil.getEvent(event),
		target=EventUtil.getTarget(event);
	if (target.className == "level") {
		target.className+=" selected";
	};
})
EventUtil.addHandler($('#delnode'),'click',function(event){
	var selectedDom=getElementsByClassName('selected'),
		selectedLen=selectedDom.length;
	if (selectedLen) {
		for (var i = selectedDom.length - 1; i >= 0; i--) {
			var delElement=selectedDom[i];
			delElement.parentNode.removeChild(delElement);
		};
	} else {
		alert("请输入选中的节点！");
	}
})
EventUtil.addHandler($('#addnode'),'click',function(event){
	var selectedDom=getElementsByClassName('selected'),
		selectedLen=selectedDom.length,
		insertNodeName = $("#inputnode").value;
	if (selectedLen) {
		if (insertNodeName) {
			for (var i = selectedDom.length - 1; i >= 0; i--) {
				var delElement=selectedDom[i],
					insertElementHtml='<div class="level">'+insertNodeName+'</div>';
				delElement.innerHTML+=insertElementHtml;
			};
		} else {
			alert('请输入插入的节点名！');
		}
	} else {
		alert("请选中节点！")
	}
})