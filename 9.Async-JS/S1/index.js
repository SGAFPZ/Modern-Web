(function() {
	
	$(function() { new AsyncCalculator() });

	var AsyncCalculator = function() {
		this.listenAtHover();
		this.listenButtonClick();
	};

	var p = AsyncCalculator.prototype;

	// p.ini = function() {
	// 	$('#info-bar').addClass('inactivated').attr('enable')
	// };

	p.listenAtHover = function() {
		$('#button').hover(() => {
			$('li').removeClass('inactivated').addClass('activated');  // 用toggleClass的话连续点两次会出错，下同
			$('#info-bar').text('');
		}, () => {
			$('li').add('#info-bar').removeClass('activated').addClass('inactivated');
			$('li span').addClass('hidden');
		});
	};

	p.listenButtonClick = function() {
		var that = this;
		$('li').click(function() { that.getNumber($(this)); });
		$('#info-bar').click(function() { that.calculate(); });
	};

	p.getNumber = function(clickedButton) {
		var that = this;
		if (this.isEnabled(clickedButton)) {
			this.disableButtonsExcept(clickedButton);
			$('#'+clickedButton.attr('id')+' span').removeClass('hidden').text("...");
			$.post('getNumber', function(data) {
				$('#'+clickedButton.attr('id')+' span').text(data);
				clickedButton.removeClass('activated').addClass('inactivated');
				that.enableButtonsUnclicked();
				that.isEachButtonClicked();
			}).fail(function() {
				console.log('fail');
				that.getNumber(clickedButton);
			});
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
	}

})();