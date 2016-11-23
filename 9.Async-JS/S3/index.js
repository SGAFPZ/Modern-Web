(function() {
	
	$(function() { new AsyncCalculator() });

	var AsyncCalculator = function() {
		this.order = ['#A', '#B', '#C', '#D', '#E', '#info-bar'];
		this.current = 0;
		this.requests = [];
		this.listenAtHover();
		this.listenButton();
	};

	var p = AsyncCalculator.prototype;

	p.listenAtHover = function() {
		$('#button').hover(() => {
			$('li').removeClass('inactivated').addClass('activated');  // 用toggleClass的话连续点两次会出错，下同
			$('#info-bar').text('');
		}, () => {
			$('li').add('#info-bar').removeClass('activated').addClass('inactivated');
			$('li span').addClass('hidden');
			this.abortAllRequests();  // 鼠标移开后中断所有请求
			this.current = 0;
		});
	};

	p.abortAllRequests = function() {
		this.requests.forEach((request) => {
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
			// 用setTimeout括起来之后，disableButtonsExcept变为异步调用，把disable延后，这样才能'同时'按下其他按钮
			setTimeout(() => { that.disableButtonsExcept(clickedButton); }, 100);
			$('#'+clickedButton.attr('id')+' span').removeClass('hidden').text("...");
			var request = $.post('getNumber', function(data) {
				$('#'+clickedButton.attr('id')+' span').text(data);
				clickedButton.removeClass('activated').addClass('inactivated');
				that.enableButtonsUnclicked();
				if (that.hasEachButtonGotNumber()) $('#info-bar').trigger('click');
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

	p.hasEachButtonGotNumber = function() {
		var count = 0;
		$('li').each(function() {
			if ($('#'+$(this).attr('id')+' span').text() != '...') count++;
		});
		if (count == 5) { $('#info-bar').removeClass('inactivated').addClass('activated'); return true; }
		return false;
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
		for (var i = 0; i < 5; i++)
			$(this.order[i]).trigger('click');
	};

})();