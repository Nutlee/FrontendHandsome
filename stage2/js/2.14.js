~function() {
	var AIRCRAFT_SPEED = 2;   //飞行速度 
	var AIRCRAFT_RESOURCE_DISCHARGE = 0.5;   // 能量消耗
	var AIRCRAFT_RESOURCE_CHARGE = 0.2;     // 能量增加

	var AIRCRAFT_SIZE = 40; //飞船大小
	var AIRCRAFT_POWERBAR_POS_OFFSET = 5; //电量条位置位移
	var AIRCRAFT_POWERBAR_COLOR_GOOD = "#70ed3f"; //电量良好状态颜色
	var AIRCRAFT_POWERBAR_COLOR_MEDIUM = "#fccd1f"; //电量一般状态颜色
	var AIRCRAFT_POWERBAR_COLOR_BAD = "#fb0000"; //电量差状态颜色
	var AIRCRAFT_POWERBAR_WIDTH = 5;  //电量条宽度


	var FAILURE_RATE = 0.3; //消息发送失败率
	
	var PLANET_RADIUS = 120;
	var ORBITSPACE = 60;

	var orbitPaint = document.getElementById('container'),
		orbitPaintWidth = orbitPaint.clientWidth,
		orbitPaintHeight = orbitPaint.clientHeight;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	/**
	 * 打印指令
	 * @param  {[type]} msg [description]
	 * @return {[type]}     [description]
	 */
	function printf(msg) {
		var consoleEle = document.getElementById('console');
		consoleEle.innerHTML += '<div>'+msg+'</div>';
	};

	function Message(targetID,cmd) {
		this.id = targetID;
		this.command = cmd;
	};

	/**
	 * 飞船类
	 */
	function Aircraft(id) {
		this.id = id;
		this.powerStatus = 'pause';
		this.resourceStatus = 100;
		this.deg = 0;
		// 所处的轨道 - 飞船宽度/2 
		this.orbit = PLANET_RADIUS + (id) * ORBITSPACE - AIRCRAFT_SIZE/2;
		this.mediator = null;
		this.timer = 0;
	};
	Aircraft.prototype.powerSystem = function() {
		var self =this;
		var start = function() {
			self.timer = setTimeout(function(){
				start();
				var deg=self.deg;
				self.deg = ((deg >= 360)?0:deg+=AIRCRAFT_SPEED);
				console.log('运行角度',self.deg);
			}, 20);
		};
		var pause = function() {
			clearTimeout(self.timer);
		};
		return {
			start: function(){
				start();
				printf('飞船发射id '+self.id);
				return this;
			},
			pause: function() {
				pause();
				printf('飞船停止id '+self.id);
				return this;
			}
		}
	};
	Aircraft.prototype.resourceSystem = function() {
		var self = this;
		//充电
		var charge = function() {
			var timer = setTimeout(function(){
				var powerStatus = self.powerStatus,
				    resourceStatus = self.resourceStatus;
				if (powerStatus ==='destory') {
					clearTimeout(timer);
					return;
				};
				if (resourceStatus >= 100) {
					clearTimeout(timer);
					self.powerStatus = 100;
					return;
				};
				self.resourceStatus += AIRCRAFT_RESOURCE_CHARGE;
				charge();
			}, 20);
		};
		//放电
		var discharge = function() {
			var timer = setTimeout(function(){
				var powerStatus = self.powerStatus,
				    resourceStatus = self.resourceStatus;
				if (powerStatus === 'pause' || powerStatus ==='destory') {
					clearTimeout(timer);
					return;
				};
				if (resourceStatus <= 0) {
					clearTimeout(timer);
					self.controlSystem().changeStatus("pause");
					self.resourceStatus = 0;
					return;
				};
				self.resourceStatus -= AIRCRAFT_RESOURCE_DISCHARGE;
				discharge();
			}, 20)
		};
		return {
			charge:function(){
				charge();
				printf('飞船持续充电中id '+self.id);
				return this;
			},
			discharge: function() {
				discharge();
				printf('飞船开始耗能id '+self.id);
				return this;
			}
		}		
	};
	Aircraft.prototype.destorySystem = function() {
		var self = this;
		var destory = function() {
			clearTimeout(self.timer);
			self.mediator.remove(self);
		};
		return {
			destory:function(){
				destory();
				printf('飞船摧毁id '+self.id);
			}
		}
	};	
	Aircraft.prototype.controlSystem = function() {
		var self = this;
		var statuses = {
			start: function(status) {
				self.powerStatus = 'start';
				self.powerSystem().start();
				self.resourceSystem().discharge().charge();
			},
			pause: function(status) {
				self.powerStatus = 'pause';
				self.powerSystem().pause();
				self.resourceSystem().charge();
			},
			destory: function(status) {
				self.powerStatus = 'destory';
				self.destorySystem().destory();
			}
		}
		var changeStatus = function(status) {
			if (!!statuses[status]) {
				statuses[status]();
				printf('飞船id '+self.id+' 状态切换至 '+status)
			};
		};
		return {
			changeStatus: changeStatus
		}
	};
	Aircraft.prototype.signSystem = function() {
		var self = this;
		return {
			listen:function(msg,sender) {
				var status = self.powerStatus,
					command = msg.command,
					id = msg.id;
				if (self.id === id && status !== command ) {
					if ( (status === 'destory') && ( command === 'start' || command === 'pause')) {
						printf('飞船处于摧毁状态，操作无响应 id'+id);
						return;
					};
					self.controlSystem().changeStatus(command);
				};
			}
		}
	};

	/*
	 * 指挥官类
	 */
	function Commander() {
		this.id = 'Comder';
		this.cmds = [];
		this.mediator = null;
	};
	Commander.prototype.sendMessage = function(msg) {
		this.mediator.sendMessage(msg);
		this.cmds.push(msg);
	};
	function Mediator() {
		var aircrafts = [],
			commander = null;
		return {
			register: function(reg) {
				if (reg instanceof Commander) {
					commander = reg;
					reg.mediator = this;
					printf('控制中心（mediator）注册 --- 指挥官（commander）'+reg.id);
					return;
				} else if ( reg instanceof Aircraft) {
					aircrafts[reg.id] = reg;
					reg.mediator = this;
					printf('控制中心（mediator）注册 --- 飞船（Aircraft）'+reg.id);
					return;
				};		
			},
			sendMessage:function(msg,sender) {
				// var success = true;
				var success = Math.random() > FAILURE_RATE ? true : false; //若随机数大于发送失败率则执行消息发送
				if (success) {
					if (msg.command === 'launch') {
						this.create(msg);
					};
					for (var key in aircrafts) {
					    if (aircrafts[key]) { //所有飞船迭代接收消息
					        aircrafts[key].signSystem().listen(msg, sender);
					    }
					}
					printf('广播成功---飞船 '+msg.id+' command '+msg.command);
				} else {
					printf('广播失败---飞船 '+msg.id+' command '+msg.command);
				}
			},
			create:function(msg) {
				if (aircrafts[msg.id]) {
					printf('飞船已经存在id '+msg.id);
					return;
				};
				var aircraft = new Aircraft(msg.id);
				this.register(aircraft);
				printf('广播---飞船 '+msg.id+ ' 创建成功');
			},
			remove:function(aircraft) {
				if ( aircraft instanceof Aircraft && ([].indexOf.call(aircrafts,aircraft)>-1) ) {
					var id = aircraft.id;
					delete aircrafts[id];
					printf('摧毁飞船 '+id);
				};
				printf('已进行飞船摧毁广播');
			},
			getAircrafts: function() {
				return aircrafts;
			}
		}
	};

	// 返回 父容器中的索引
	function elementIndex(ele) {
		var parent = ele.parentNode,
			cls = parent.className,
			operateParent = parent.parentNode,
			eleArray = operateParent.querySelectorAll('.'+cls);
		for(var i = 0, len = eleArray.length; i < len; i++){
			if (eleArray[i] === parent ) {
				return i;
			}
		};
	};

	/**
	 * 绑定控制按钮
	 * @param  {[type]} operateID [控制按钮最外层容器id]
	 * @param  {[Commander]} commander [指挥官实例]
	 * @return {[type]}           [description]
	 */
	function bindEvent(operateID,commander) {
		document.getElementById(operateID).addEventListener('click', function(event){
			var target = event.target,
				targetName = "";
			if (target.tagName.toLowerCase() === 'button') {
				targetName = target.name;
				printf('点击了'+targetName);
				var msg = new Message(elementIndex(target),targetName);
				commander.sendMessage(msg);
				// console.log(commander.mediator.getAircrafts());
			};
		});
	};

	/**
	 * 动画集
	 * @param  {[type]} ){		var canvas        [description]
	 * @return {[type]}          [description]
	 */
	var AnimUtil = (function(){
		var canvas = document.getElementById('orbitcanvas');
		canvas.width = orbitPaintWidth;
		canvas.height = orbitPaintHeight;
		var canvasContent = canvas.getContext("2d");

		var cacheCanvas = document.createElement("canvas");
		cacheCanvas.width = orbitPaintWidth;
		cacheCanvas.height = orbitPaintHeight;
		var cacheCtx = cacheCanvas.getContext("2d"); //生成缓存画布

		var mediator = null;
		function drawAircraft (_ctx, aircraft) {
			var aircraftImg = new Image();  //创建飞船贴图
			 aircraftImg.onload = function() { //当飞船贴图加载后开始在画布上画(由于onload是异步进行的，所以执行顺序上会不是太清晰)
			     try {  //由于存在获取不了画布的情况产生错误，因此采用try..catch将错误丢弃
			         _ctx.save(); //保存画布原有状态
			         _ctx.translate(orbitPaintWidth/2, orbitPaintHeight/2);  //更改画布坐标系，将画布坐标原点移到画布中心
			         _ctx.rotate(-aircraft.deg * Math.PI / 180); //根据飞船飞行角度进行画布选择
			        
			         //画电量条，根据电量状态改变颜色
			         _ctx.beginPath();
			         if (aircraft.resourceStatus > 70) {
			             _ctx.strokeStyle = AIRCRAFT_POWERBAR_COLOR_GOOD;
			         } else if (aircraft.resourceStatus < 70 && aircraft.resourceStatus > 30) {
			             _ctx.strokeStyle = AIRCRAFT_POWERBAR_COLOR_MEDIUM;
			         } else {
			             _ctx.strokeStyle = AIRCRAFT_POWERBAR_COLOR_BAD;
			         }
			         _ctx.lineWidth = AIRCRAFT_POWERBAR_WIDTH;
			         _ctx.moveTo(aircraft.orbit, -AIRCRAFT_POWERBAR_POS_OFFSET);
			         _ctx.lineTo(aircraft.orbit + AIRCRAFT_SIZE * (aircraft.resourceStatus / 100), -AIRCRAFT_POWERBAR_POS_OFFSET);
			         _ctx.stroke();

			         _ctx.drawImage(aircraftImg, aircraft.orbit, 0, AIRCRAFT_SIZE, AIRCRAFT_SIZE); //画飞船贴图
			         _ctx.restore(); //恢复画布到原有状态
			         canvasContent.clearRect(0, 0, orbitPaintWidth, orbitPaintHeight);  
			         canvasContent.drawImage(cacheCanvas, 0, 0, orbitPaintWidth, orbitPaintHeight); //将缓存画布内容复制到屏幕画布上

			     } catch (error) {
			         return false;
			     }
			 };
			 aircraftImg.src = "./images/min-iconfont-rocket-active.png"; 
		};	
		var onDraw = function(aircrafts) {
		    if (!(aircrafts === undefined || aircrafts.every(function(item, index, array) {
		            return item === undefined;  //判断飞船队列是否存在，以及飞船队列是否为空；若不是则执行下面步骤
		        }))) {
		        cacheCtx.clearRect(0, 0, orbitPaintWidth, orbitPaintHeight); //每次更新清空缓存画布
		        for (var i = 0; i < aircrafts.length; i++) {  //迭代绘制飞船
		            if (aircrafts[i] !== undefined) {
		                drawAircraft(cacheCtx, aircrafts[i]);
		            }
		        }
		    } else {
		        canvasContent.clearRect(0, 0, orbitPaintWidth, orbitPaintHeight);
		    }
		};			
		function setMediator(_mediator) {
			mediator = _mediator;
		};
		function animLoop() {
			requestAnimationFrame(animLoop);
			onDraw(mediator.getAircrafts())
			console.log('动画刷新');
		};
		return {
			setMediator: setMediator,
			animLoop: animLoop
		};
	})();

	//初始化
	window.onload = function() {
		var commander = new Commander(),
			mediator = new Mediator();
		mediator.register(commander);
		mediator.register(AnimUtil);
		bindEvent('operate',commander);
		AnimUtil.setMediator(mediator);
		
		//手动绘一次 canvas
		document.getElementById('forcedraw').addEventListener('click', function(){
			event.stopPropagation();
			event.returnValue = false;
			AnimUtil.animLoop();
		})
		//日志跟随滚动
		var consoleList = document.getElementById('console');
		consoleList.addEventListener('DOMNodeInserted', function(){
			this.scrollTop = this.scrollHeight;
		});	

		//清空日志
		var consoleLegend = consoleList.getElementsByTagName('legend')[0].innerHTML;	
		document.getElementById('clearconsole').addEventListener('click', function(event){
			event.stopPropagation();
			event.returnValue = false;
			var legend;
			if (consoleList.getElementsByTagName('div').length>0) {
				legend = '<legend>'+consoleLegend+'</legend>';
				consoleList.innerHTML = legend;
			};
		});

		// 开始高速刷新
		AnimUtil.animLoop();
	};
}();
