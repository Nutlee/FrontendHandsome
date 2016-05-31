var wrap= $("wrap"),
	maxColHeight=200;
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
$("sort").onclick=bubleSort;
function $(id) {
	return document.getElementById(id);
}
function drawCol (num) {
	var maxNum=100,
		redBlock=document.createElement("div");
		
	//正则验证数字合法
	if ( checkInputValue(num) && num>9 && num<101 ){
		redBlock.className="redblock";
		redBlock.style.height=num/100*maxColHeight+"px";
		// redBlock.style.marginLeft=20+"px";
		return redBlock;
	} else {
		alert("请输入10-100合法数字！");
		return ;
	} 
}
function checkInputValue(str) {
	var rule= new RegExp("^[0-9]*$","g");
	return(rule.test(str));
}
function randomQue() {
	var col,colsHtml="";
	for (var i = 0; i < 20; i++) {
		col=Math.round(Math.random()*90+10);
		//改成innerHTML提高性能
		colsHtml+="<div class=\"redblock\" style=\"height:"+col/100*maxColHeight+"px;\"></div>";
		// wrap.insertBefore(drawCol(col), wrap.firstChild);
	};
	if (wrap.innerHTML) {
		wrap.innerHTML="";
	}
	wrap.innerHTML=colsHtml;
}
// function bubleSort() {
// 	var sortQue=wrap.childNodes,tempItem;
// 	console.log(sortQue);
// 	for(var i = 0, len = sortQue.length-1; i < len; i++){
// 		for(var j = 1,len = sortQue.length; j < len; j++){
// 			if (sortQue[j-1].offsetHeight>sortQue[j].offsetHeight) {
// 				tempItem=sortQue[j-1].style.height;
// 				sortQue[j-1].style.height=sortQue[j].style.height;
// 				sortQue[j].style.height=tempItem;
// 			};
// 			setTimeout(a, 1000)
// 		}
// 	}
// 	// tempItem=sortQue[0].outerHTML;
// 	// sortQue[0].outerHTML=sortQue[1].outerHTML;
// 	// sortQue[1].outerHTML=tempItem;	
// 	// console.log(sortQue);
// }

function bubleSort() {
	var sortQue=wrap.childNodes,tempItem,
		i=0,j=1,len=sortQue.length;
	var p=setInterval(function() {
		console.log("i="+i+",j="+j);
		if (i == len-1) {
			clearInterval(p);
		} 
		if (j<len) {
			if (sortQue[j-1].offsetHeight>sortQue[j].offsetHeight) {
				tempItem=sortQue[j-1].style.height;
				sortQue[j-1].style.height=sortQue[j].style.height;
				sortQue[j].style.height=tempItem;			
			}
		}
		if( j == len){
			j = 1;
			i++;
		} else {
			j++;
		}
	}, 50);	
}