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
		var that = this;
		this.input.focus(function() {
			var input = $(this);
			that.showFormatMessage(input.attr('name'));
			if (input.prop('value') == input.attr('name')) input.prop('value', '');
		});
	};

	p.listenInputBlur = function() {
		var that = this;
		this.input.blur(function() { that.check($(this)); $('#formatMessage').text(''); });
	};

	p.showFormatMessage = function(name) {
		if (name == 'Username')
			$('#formatMessage').text('Username: 6-18 digits, letters or underline, start with a letter');
		else if (name == 'ID')
			$('#formatMessage').text('ID: 8 digits, can\'t start with ZERO');
		else if (name == 'Phone')
			$('#formatMessage').text('Phone: 11 digits, can\'t start with ZERO');
		else 
			$('#formatMessage').text('Email: your email address');
	}

	p.check = function(input) {
		var name = input.attr('name');
		var value = input.prop('value');
		if (value == "") {
			input.prop('value', name);
		} else {
			var result = this.checkValidity(input);
			if (result.isValid) this.showPass(name);
			else this.showError(name, result.wrongMessage);
		}
	};

	p.listenButtonClick = function() {
		var that = this;
		$('#reset').click(function() {
			$('form>div:odd').text("").removeClass();
			that.input.each(function() { $(this).prop('value', $(this).attr('name')); });
		});
		$('#register').click(function() {
			if (that.isAllValid()) $('form').submit();
			else return false;
		})
	};

	p.isAllValid = function() {
		var flag = true;
		this.input.trigger('blur');
		$('form>div:odd').each(function() { if ($(this).text() != 'Pass') flag = false; });
		return flag;
	};

	p.checkValidity = function(input) {
		var inputValue = input.prop('value');
		var result = { isValid: true, wrongMessage: "" };
		if (input.attr('name') == 'Username') {
			result.isValid = /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(inputValue);
			if (!result.isValid)
				if (/^[^a-zA-Z].*$/.test(inputValue))
					result.wrongMessage = "Username must start with a letter";
				else if (/^.*[^a-zA-Z0-9_].*$/.test(inputValue))
					result.wrongMessage = "Username contains only letters, digits and underline";
				else if (/^(.{0,5}|.{19,})$/.test(inputValue))
					result.wrongMessage = "The length of Username should be 6-18";
				else result.wrongMessage = "Please enter right Username";
		} else if (input.attr('name') == 'ID') {
			result.isValid = /^[1-9][0-9]{7}$/.test(inputValue);
			if (!result.isValid)
				if (/^.*[^0-9].*$/.test(inputValue))
					result.wrongMessage = "ID contains only digits";
				else if (/^0.*$/.test(inputValue))
					result.wrongMessage = "ID can't start with ZERO";
				else if (/^(.{0,7}|.{9,})$/.test(inputValue))
					result.wrongMessage = "The length of ID should be 8";
				else result.wrongMessage = "Please enter right ID";
		} else if (input.attr('name') == 'Phone') {
			result.isValid = /^[1-9][0-9]{10}$/.test(inputValue);
			if (!result.isValid)
				if (/^.*[^0-9].*$/.test(inputValue))
					result.wrongMessage = "Phone Number contains only digits";
				else if (/^0.*$/.test(inputValue))
					result.wrongMessage = "Phone Number can't start with ZERO";
				else if (/^(.{0,10}|.{12,})$/.test(inputValue))
					result.wrongMessage = "The length of Phone Number should be 11";
				else result.wrongMessage = "Please enter right Phone Number";
		} else if (input.attr('name') == 'Email') {
			result.isValid = /^[a-zA-Z0-9_\-]+@(([a-zA-Z0-9_\-])+\.)+[a-zA-Z]{2,4}$/.test(inputValue);
			if (!result.isValid)
				if (/^.*[^a-zA-Z0-9_@\-\.].*$/.test(inputValue))
					result.wrongMessage = "Email contains only 'a-z','A-Z','0-9','_','-' and '@'";
				else result.wrongMessage = "Please enter right Email address";
		}
		return result;
	};

	p.showPass = function(name) {
		var divID = "#"+name+"Check";
		$(divID).text('Pass').removeClass('wrong').addClass('right');
	}

	p.showError = function(name, wrongMessage) {
		var divID = "#"+name+"Check";
		$(divID).text(wrongMessage).removeClass('right').addClass('wrong');
	}

})();