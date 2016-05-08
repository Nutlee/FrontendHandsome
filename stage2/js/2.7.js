var wrap= $("wrap");
$("leftenter").onclick= function () {
	var node=drawCol($("inputvalue").value);
	if (!!node) {
		wrap.insertBefore(node, wrap.firstChild);
	}
}
$("rightenter").onclick= function () {
	var node=drawCol($("inputvalue").value);	
	if (!!node) {	
	wrap.appendChild(drawCol($("inputvalue").value));
	}
}
$("leftout").onclick=function() {
	if (wrap.innerHTML != "") {
		wrap.removeChild(wrap.firstChild);
	}
}		
$("rightout").onclick=function() {
	if (wrap.innerHTML != "") {
		wrap.removeChild(wrap.lastChild);
	}
}
$("randomNum").onclick=randomQue;
function $(id) {
	return document.getElementById(id);
}
function drawCol (num) {
	var maxNum=100,
		redBlock=document.createElement("div"),
		rule= new RegExp("^[0-9]*$","g");
	//正则验证数字合法
	if (rule.test(num) && num>9 && num<101) {
		redBlock.className="redblock";
		redBlock.style.height=num/100*200+"px";
		// redBlock.style.marginLeft=20+"px";
		return redBlock;
	} else {
		alert("请输入10-100合法数字！");
		return ;
	} 
}
function randomQue() {
	var que=[],col;
	for (var i = 0; i < 20; i++) {
		col=que[i]=Math.round(Math.random()*90+10);
		//改成innerHTML提高性能
		wrap.insertBefore(drawCol(col), wrap.firstChild);
	};
	console.log(que);
}