/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var chartObj=chartData[pageState.nowGraTime][pageState.nowSelectCity],
      chartKeyArray=Object.getOwnPropertyNames(chartObj),
      chartWrap=document.getElementById("aqi-chart-wrap"),
      itemWidth=chartWrap.clientWidth/(chartKeyArray.length*2+1),
      colors=["#000000","#00CC00","#333300","#660000","#666600",
              "#990000","#999900","#CCCC00","#666699","#339999"]
      //假设最大值
      maxAqi=500;
  chartWrap.innerHTML="";
  for (var i = 0; i < chartKeyArray.length; i++) {
    var left=i*itemWidth*2+itemWidth,
        itemHeight=chartObj[chartKeyArray[i]]/maxAqi*chartWrap.clientHeight,
        itemNode= {
          left: left,
          height: itemHeight,
          width: itemWidth,
          backgroundColor: colors[Math.floor(Math.random() * 9)],
          descDate: chartKeyArray[i],
          descValue: chartObj[chartKeyArray[i]]
        }
        chartWrap.innerHTML+=combineNode(itemNode);
  };
}
//拼装节点
function combineNode(obj) {
    // console.log(obj);
    var descmLeft=(obj.width-72)/2,
        descNode="<div class=\"desc\" style=\"margin-left:"+descmLeft+"px;z-index:999;\"><p>"+obj.descDate+"</p><p>AQI："+obj.descValue+"</p></div>";
       return "<div class=\"aqi-item\" style=\"left:"+obj.left+"px;width:"+obj.width+"px;height:"+obj.height+"px;background-color:"+obj.backgroundColor+";\">"+descNode+"</div>";
       // return "1";
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var nowgraTimeValue=this.value;
  if (nowgraTimeValue!=pageState.nowGraTime) {
  // 设置对应数据
      pageState.nowGraTime= nowgraTimeValue;
  // 调用图表渲染函数
      renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var nowCityValue=this.value;
  if (nowCityValue!=pageState.nowSelectCity) {
    // 设置对应数据
      pageState.nowSelectCity=nowCityValue;
    // 调用图表渲染函数
      renderChart();
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radiobtn=document.getElementById("form-gra-time").getElementsByTagName("input");
    for (var i = 0; i < radiobtn.length; i++) {
      (function(num){
        radiobtn[num].onclick=graTimeChange;
        if (num==0) {
            pageState.nowGraTime=radiobtn[num].value;
        }
      })(i);
    };
}
/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var selListItem="";
    for (variable in aqiSourceData) {
      selListItem+="<option>"+variable+"</option>";
    }
    var selList=document.getElementById("city-select");
    pageState.nowSelectCity=selList.getElementsByTagName("option")[0].innerHTML;
    selList.innerHTML=selListItem;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
    selList.onchange=citySelectChange;

  // 监听鼠标移动到每一个柱时
    var chartWrap=document.getElementById("aqi-chart-wrap");
    EventUtil.addHandler(chartWrap,"mouseover",function(e){
      if (e.target.className.indexOf("aqi-item")>-1) {
          e.target.className+=" active";
      }
    });
    EventUtil.addHandler(chartWrap,"mouseout",function(e){
      if (e.target.className.indexOf("aqi-item")>-1) {
          e.target.className = e.target.className.replace(/\sactive/, "");
      }
    });    

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  var tempCity,
      week={},
      month={},
      dayKey,
      dayInWeekIndex=5,
      weekCount,dayInMonthIndex=0,
      weekAqiCount=0,monthAqiCount=0,
      weekAverage,monthAverage;
  for (var key in aqiSourceData) {
      var eachWeek={},eachMonth={};
      tempCity=aqiSourceData[key];
      weekCount=0;
      dayKey = Object.getOwnPropertyNames(tempCity);
      for (var i = 0;i<dayKey.length ; i++) {
        weekCount=Math.ceil((i+dayInWeekIndex)/7);
        weekAqiCount+=tempCity[dayKey[i]];
        //周节点
        if (i+dayInWeekIndex>=7) {
          if ( ((i+dayInWeekIndex)%7==0)||(i==dayKey.length-1 ) ){
              //取周平均值
              if (weekCount==1) {
                  //第一周
                  weekAverage=Math.round(weekAqiCount/(i+1));
              // } else if ((dayKey.length-weekCount*7)<7 ) {
              } else if (i==dayKey.length-1) {
                  //最后一周
                  weekAverage=Math.round(weekAqiCount/(i+dayInWeekIndex-(weekCount-1)*7));
              } else {
                  weekAverage=Math.round(weekAqiCount/7);
              }
              eachWeek[dayKey[i].slice(0, 4)+"第"+weekCount+"周"]=weekAverage;
              // console.log(weekAverage);
              weekAqiCount=0;
            }
        } 
        //月节点 
        monthAqiCount+=tempCity[dayKey[i]];
        dayInMonthIndex++;
        if ( ( (i<dayKey.length-1)&&(dayKey[i+1].slice(5,7)!=dayKey[i].slice(5,7)) )||(i==dayKey.length-1)){
            monthAverage=Math.round(monthAqiCount/dayInMonthIndex);
            // console.log(dayKey[i].slice(0,7)+"月"+monthAverage);
            monthAqiCount=0;
            dayInMonthIndex=0;
          }
        eachMonth[dayKey[i].slice(0,7)+"月"]=monthAverage;
      };
      week[key]=eachWeek;
      month[key]=eachMonth;
  }
  //处理好的数据存到 chartData 中
  chartData={
    day: aqiSourceData,
    week: week,
    month: month
  }
  // console.log(weekCount);
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

var EventUtil= {
  addHandler: function(element,type,handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler,false);
    } else if (element.attachEvent) {
      element.attachEvent("on"+type,handler);
    } else {
      element["on"+type]=handler;
    }
  },
  removeHandler: function(element,type,handler) {
     if (element.removeEventListener) {
      element.removeEventListener(type, handler,false);
    } else if (element.detachEvent) {
      element.detachEvent("on"+type,handler);
    } else {
      element["on"+type]=null;
    }       
  }
}
init();