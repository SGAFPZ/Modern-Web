(function() {
	$(function() { new Calculator(); });

	var Calculator = function() {
		this.output1 = $('#output_container_1');
		this.output2 = $('#output_container_2');
		this.expression = "";
		this.result = "";
		this.addButtonListener();
	};
	
	var p = Calculator.prototype;

	p.addButtonListener = function() {
		var that = this;
		$('button').each(function() {
			this.addEventListener('click', function() { check(that, this); });
		});
	};

	var check = function(that, button) {
		if (button.id == 'equal') { that.changeResult(); }
		else { that.changeExpression(button); }
		that.refresh();
	};

	p.changeResult = function() {
		var deltExpression = this.deelWithExpression();
		var tempResult = this.getAnwser(deltExpression);
		if (this.isValidResult(tempResult)) {
			tempResult = tempResult.toExponential(9);
			this.result = eval(tempResult);
		} else {
			if (deltExpression !== "") alert("Error");
		}
	};

	p.getAnwser = function(deltExpression) {
		var tempResult = "";
		try { tempResult = eval(deltExpression); }
		catch(SyntaxError) { tempResult = undefined; }
		return tempResult;
	};

	p.changeExpression = function(elem) {
		if (elem.id == 'CE') { this.clear(); }
		else if (elem.id == 'delete') { this.del(); }
		else { this.appendChar(elem); }
	};

	p.clear = function() {
		this.expression = "";
		this.result = "";
	};

	p.del = function() {
		this.expression = this.expression.substring(0, this.expression.length-1);
		this.result = "";
	};

	p.appendChar = function(elem) {
		var char = elem.textContent;
		if ((char == "+" || char == "-" || char == "*" || char == "/") && this.result !== "") {
			this.expression = this.result+char;
			this.result = "";
		} else {
			if (this.result !== "") this.clear();
			this.expression = this.expression+char;
		}
	};
	
	p.refresh = function() {
		this.output1.val(this.expression);
		this.output2.val(this.result);
	};
	
	p.deelWithExpression = function() {
		var newExpression = this.expression;
		if (this.findAdjacentDivisionSign()) { return; }
		newExpression = this.removeExtraZero(newExpression);
		return newExpression;
	};

	p.isValidResult = function(tempResult) {
		if (tempResult === undefined || tempResult == Infinity || tempResult == -Infinity || isNaN(tempResult)) { return false; }
		return true;
	};

	p.findAdjacentDivisionSign = function() {
		for (var j = 0; j < this.expression.length; j++)
			if (this.expression.charAt(j) == "/" && this.expression.charAt(j+1) == "/") { return true; }
		return false;
	};

	p.removeExtraZero = function(newExpression) {
		for (var i = 0; i < newExpression.length; i++) {
			if (this.haveExtraZero(newExpression, i)) {
				newExpression = newExpression.substring(0, i) + newExpression.substring(i+1, newExpression.length);
				i--;
			}
		}
		return newExpression;
	};

	p.haveExtraZero = function(newExpression, i) {
		return (newExpression.charAt(i-1) === "" || newExpression.charAt(i-1) == "+" || newExpression.charAt(i-1) == "-" ||
				newExpression.charAt(i-1) == "*" || newExpression.charAt(i-1) == "/" || newExpression.charAt(i-1) == "(") &&
				newExpression.charAt(i) == "0" && (newExpression.charAt(i+1) != "*" && newExpression.charAt(i+1) != "-" &&
				newExpression.charAt(i+1) != "+" && newExpression.charAt(i+1) !="/" && newExpression.charAt(i+1) != ")");
	};

})();