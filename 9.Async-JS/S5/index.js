(function() {
	
	$(function() { new AsyncCalculator() });

	var AsyncCalculator = function() {
		this.order = ['#A', '#B', '#C', '#D', '#E', '#info-bar'];
		this.current = 0;
		this.requests = [];
		this.getRandomOrder();
		this.listenAtHover();
		this.listenButton();
	};

	var p = AsyncCalculator.prototype;

	p.aHandler = function(err, currentSum, callback) {
		if (err) {
			$('#message').text(err.message);
			callback(null, err.currentSum, this[this.order[this.current+1]+'Handler']);
		} else {
			this.disableButtonsExcept($('#A'));
			$('#A span').removeClass('hidden').text("...");
			var request = $.post('getNumber', function(data) {
				$('#A span').text(data);
				currentSum += parseInt(data);
				$('#A').removeClass('activated').addClass('inactivated');
				that.enableButtonsUnclicked();
				callback(null, currentSum, )
			}).fail(function() {
				console.log('fail');
				that.getNumber(clickedButton);
			});
			this.requests.push(request);
		}
	};

	p.getRandomOrder = function() {
		this.order.pop();
		this.order.sort(function(){ return 0.5 - Math.random(); });
		$('#order').text(this.order.join());
		this.order.push('#info-bar');
	};

	p.listenAtHover = function() {
		$('#button').hover(() => {
			$('li').removeClass('inactivated').addClass('activated');  // 用toggleClass的话连续点两次会出错，下同
			$('#info-bar').text('');
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
		$('.apb').click(function() { if (that.current == 0) that.autoClick(); });
		$('li').click(function() { that.getNumber($(this)); }).on('done', function() { that.autoClick(); });
		$('#info-bar').click(function() { that.calculate(); });
	};

	p.getNumber = function(clickedButton) {
		var that = this;
		if (this.isEnabled(clickedButton)) {
			this.disableButtonsExcept(clickedButton);
			$('#'+clickedButton.attr('id')+' span').removeClass('hidden').text("...");
			var request = $.post('getNumber', function(data) {
				$('#'+clickedButton.attr('id')+' span').text(data);
				clickedButton.removeClass('activated').addClass('inactivated');
				that.enableButtonsUnclicked();
				that.isEachButtonClicked();
				clickedButton.trigger('done');
			}).fail(function() {
				console.log('fail');
				that.getNumber(clickedButton);
			});
			this.requests.push(request);
		}
	};

	p.isEnabled = function(clickedButton) {
		return clickedButton.hasClass('activated');
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

	p.isEachButtonClicked = function() {
		var count = 0;
		$('li').each(function() {
			if (!($('#'+$(this).attr('id')+' span').hasClass('hidden'))) count++;
		});
		if (count == 5) $('#info-bar').removeClass('inactivated').addClass('activated');
	};

	p.calculate = function() {
		if ($('#info-bar').hasClass('activated')) {
			var sum = 0;
			$('span').each(function() {
				sum += parseInt($(this).text());
			});
			$('#info-bar').text(''+sum).removeClass('activated').addClass('inactivated');
		}
	};

	p.autoClick = function() {
		$(this.order[this.current]).trigger('click');
		this.current++;
	};

})();