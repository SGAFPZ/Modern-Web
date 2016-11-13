(function() {
	$(function() { new Register(); });

	var Register = function() {
		this.input = $('div>input');
		this.listenButtonClick();
		this.listenInputFocous();
		this.listenInputBlur();
	};

	var p = Register.prototype;

	p.listenInputFocous = function() {
		this.input.focus(function() {
			var input = $(this);
			if (input.prop('value') == input.attr('name')) input.prop('value', '');
		});
	};

	p.listenInputBlur = function() {
		var that = this;
		this.input.blur(function() { that.check($(this)); });
	};

	p.check = function(input) {
		var name = input.attr('name');
		var value = input.prop('value');
		if (value == "") {
			input.prop('value', name);
		} else {
			if (this.isValid(input)) this.showPass(name);
			else this.showError(name);
		}
	};

	p.listenButtonClick = function() {
		var that = this;
		$('#reset').click(function() {
			$('form>div:odd').text("").removeClass();
			that.input.each(function() {
				$(this).prop('value', $(this).attr('name'));
			});
		});
	};

	p.isValid = function(input) {
		if (input.attr('name') == 'Username') {
			var reg = /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/;
		} else if (input.attr('name') == 'ID') {
			var reg = /^[1-9][0-9]{7}$/;
		} else if (input.attr('name') == 'Phone') {
			var reg = /^[1-9][0-9]{10}$/;
		} else if (input.attr('name') == 'Email') {
			var reg = /^[a-zA-Z_\-]+@(([a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/;
		}
		return reg.test(input.prop('value'));
	}

	p.showPass = function(name) {
		var divID = "#"+name+"Check";
		$(divID).text('Pass').removeClass('wrong').addClass('right');
	}

	p.showError = function(name) {
		var divID = "#"+name+"Check";
		$(divID).text('Wrong format').removeClass('right').addClass('wrong');
	}

})();