(function() {
	
	$(function() { new AsyncCalculator() });

	var AsyncCalculator = function() {
		this.order = ['a', 'b', 'c', 'd', 'e', 'bubble'];
		this.current = 0;
		this.requests = [];
		this.getRandomOrder();
		this.listenAtHover();
		this.listenButton();
	};

	var p = AsyncCalculator.prototype;

	p.getRandomOrder = function() {
		this.order.pop();
		this.order.sort(function(){ return 0.5 - Math.random(); });
		$('#order').text(this.order.join());
		this.order.push('bubble');
	};

	p.listenAtHover = function() {
		$('#button').hover(() => {
			$('li').removeClass('inactivated').addClass('activated');  // 用toggleClass的话连续点两次会出错，下同
			$('#info-bar').text('');
			$('p').remove();
		}, () => {
			$('li').add('#info-bar').removeClass('activated').addClass('inactivated');
			$('li span').addClass('hidden');
			this.abortAllRequests();
			this.getRandomOrder();
			this.current = 0;
		});
	};

	p.abortAllRequests = function() {
		this.requests.forEach(function(request) {
			if (request != null) request.abort();
			request = null;
		});
	}

	p.listenButton = function() {
		var that = this;
		$('.apb').click(function() {
			if (that.current == 0) that.startCalls(null, 0, that[that.order[0]+'Handler']);
		});
	};

	p.disableButtonsExcept = function(clickedButton) {
		$('li').not(clickedButton).removeClass('activated').addClass('inactivated');
	};

	p.enableButtonsUnclicked = function() {
		$('li').each(function() {
			if ($('#'+$(this).attr('id')+' span').hasClass('hidden'))
				$(this).removeClass('inactivated').addClass('activated');
		});
	};

	p.startCalls = function(err, currentSum, callback) {
		if (err) {
			$('#message').append('<p>'+err.message+'</p>');
			callback.call(this, null, err.currentSum, this[this.order[1]+'Handler']);
		} else {
			callback.call(this, null, 0, this[this.order[1]+'Handler']);
		}
	};

	p.aHandler = function(err, currentSum, callback) {
		var that = this;
		if (err) {
			$('#message').append('<p>'+err.message+'</p>');
			callback.call(this, null, err.currentSum, this[this.order[this.current+1]+'Handler']);
		} else {
			var callee = arguments.callee;
			if (this.current-1 >= 0) var caller = this[this.order[this.current-1]+'Handler'];
			else var caller = this['startCalls'];
			this.disableButtonsExcept($('#A'));
			$('#A span').removeClass('hidden').text("...");
			var request = $.post('getNumber', function(data) {
				var fail = isfail();
				if (fail) {
					var err = { message: 'A:这不是秘密', currentSum: currentSum };
					caller.call(that, err, currentSum, callee);
				} else {
					$('#A span').text(data);
					$('#message').append('<p>A:这是个天大的秘密</p>');
					currentSum += parseInt(data);
					$('#A').removeClass('activated').addClass('inactivated');
					that.enableButtonsUnclicked();
					that.current++;
					callback.call(that, null, currentSum, that[that.order[that.current+1]+'Handler']);
				}
			}).fail(function() {
				var err = { message: 'A:这不是秘密', currentSum: currentSum };
				caller.call(that, err, currentSum, callee);
			});
			this.requests.push(request);
		}
	};

	p.bHandler = function(err, currentSum, callback) {
		var that = this;
		if (err) {
			$('#message').append('<p>'+err.message+'</p>');
			callback.call(this, null, err.currentSum, this[this.order[this.current+1]+'Handler']);
		} else {
			var callee = arguments.callee;
			if (this.current-1 >= 0) var caller = this[this.order[this.current-1]+'Handler'];
			else var caller = this['startCalls'];
			this.disableButtonsExcept($('#B'));
			$('#B span').removeClass('hidden').text("...");
			var request = $.post('getNumber', function(data) {
				var fail = isfail();
				if (fail) {
					var err = { message: 'B:我知道', currentSum: currentSum };
					caller.call(that, err, currentSum, callee);
				} else {
					$('#B span').text(data);
					$('#message').append('<p>B:我不知道</p>');
					currentSum += parseInt(data);
					$('#B').removeClass('activated').addClass('inactivated');
					that.enableButtonsUnclicked();
					that.current++;
					callback.call(that, null, currentSum, that[that.order[that.current+1]+'Handler']);
				}
			}).fail(function() {
				var err = { message: 'B:我知道', currentSum: currentSum };
				caller.call(that, err, currentSum, callee);
			});
			this.requests.push(request);
		}
	};

	p.cHandler = function(err, currentSum, callback) {
		var that = this;
		if (err) {
			$('#message').append('<p>'+err.message+'</p>');
			callback.call(this, null, err.currentSum, this[this.order[this.current+1]+'Handler']);
		} else {
			var callee = arguments.callee;
			if (this.current-1 >= 0) var caller = this[this.order[this.current-1]+'Handler'];
			else var caller = this['startCalls'];
			this.disableButtonsExcept($('#C'));
			$('#C span').removeClass('hidden').text("...");
			var request = $.post('getNumber', function(data) {
				var fail = isfail();
				if (fail) {
					var err = { message: 'C:你知道', currentSum: currentSum };
					caller.call(that, err, currentSum, callee);
				} else {
					$('#C span').text(data);
					$('#message').append('<p>C:你不知道</p>');
					currentSum += parseInt(data);
					$('#C').removeClass('activated').addClass('inactivated');
					that.enableButtonsUnclicked();
					that.current++;
					callback.call(that, null, currentSum, that[that.order[that.current+1]+'Handler']);
				}
			}).fail(function() {
				var err = { message: 'C:你知道', currentSum: currentSum };
				caller.call(that, err, currentSum, callee);
			});
			this.requests.push(request);
		}
	};

	p.dHandler = function(err, currentSum, callback) {
		var that = this;
		if (err) {
			$('#message').append('<p>'+err.message+'</p>');
			callback.call(this, null, err.currentSum, this[this.order[this.current+1]+'Handler']);
		} else {
			var callee = arguments.callee;
			if (this.current-1 >= 0) var caller = this[this.order[this.current-1]+'Handler'];
			else var caller = this['startCalls'];
			this.disableButtonsExcept($('#D'));
			$('#D span').removeClass('hidden').text("...");
			var request = $.post('getNumber', function(data) {
				var fail = isfail();
				if (fail) {
					var err = { message: 'D:他知道', currentSum: currentSum };
					caller.call(that, err, currentSum, callee);
				} else {
					$('#D span').text(data);
					$('#message').append('<p>D:他不知道</p>');
					currentSum += parseInt(data);
					$('#D').removeClass('activated').addClass('inactivated');
					that.enableButtonsUnclicked();
					that.current++;
					callback.call(that, null, currentSum, that[that.order[that.current+1]+'Handler']);
				}
			}).fail(function() {
				var err = { message: 'D:他知道', currentSum: currentSum };
				caller.call(that, err, currentSum, callee);
			});
			this.requests.push(request);
		}
	};

	p.eHandler = function(err, currentSum, callback) {
		var that = this;
		if (err) {
			$('#message').append('<p>'+err.message+'</p>');
			callback.call(this, null, err.currentSum, this[this.order[this.current+1]+'Handler']);
		} else {
			var callee = arguments.callee;
			if (this.current-1 >= 0) var caller = this[this.order[this.current-1]+'Handler'];
			else var caller = this['startCalls'];
			this.disableButtonsExcept($('#E'));
			$('#E span').removeClass('hidden').text("...");
			var request = $.post('getNumber', function(data) {
				var fail = isfail();
				if (fail) {
					var err = { message: 'E:是的', currentSum: currentSum };
					caller.call(that, err, currentSum, callee);
				} else {
					$('#E span').text(data);
					$('#message').append('<p>E:才怪</p>');
					currentSum += parseInt(data);
					$('#E').removeClass('activated').addClass('inactivated');
					that.enableButtonsUnclicked();
					that.current++;
					callback.call(that, null, currentSum, that[that.order[that.current+1]+'Handler']);
				}
			}).fail(function() {
				var err = { message: 'E:是的', currentSum: currentSum };
				caller.call(that, err, currentSum, callee);
			});
			this.requests.push(request);
		}
	};

	p.bubbleHandler = function(err, currentSum, callback) {
		var that = this;
		if (err) {
			$('#message').append('<p>'+err.message+'</p>');
			// callback(null, err.currentSum, this[this.order[this.current+1]+'Handler']);
		} else {
			var callee = arguments.callee;
			var caller = this[this.order[this.current-1]+'Handler'];
			var fail = isfail();
			if (fail) {
				var err = { message: '大气泡:楼主异步调用战斗力惊人,目测超过'+currentSum, currentSum: currentSum };
				caller.call(that, err, currentSum, callee);
			} else {
				$('#message').append('<p>大气泡:楼主异步调用战斗力感人,目测不超过'+currentSum+'</p>');
				$('#info-bar').text(currentSum);
			}
		}
	};

	var isfail = function() {
		return Math.random() < 0.5;
	}

})();