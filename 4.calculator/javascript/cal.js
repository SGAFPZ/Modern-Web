function io_refresh(new_input) {
	var x = document.getElementById('output_container_1');
	var y = document.getElementById('output_container_2');
	var content = x.value;
	if (new_input == "CE") {
		var new_content = "";
		var result = "";
	} else if (new_input == "delete") {
		var new_content = content.substring(0, content.length-1);
		var result = "";
	} else if (new_input == "equal") {
		var new_content = content;
		var result = "";
		var flag = 1;
		/*两个及以上连续除号的判断*/
		for (var j = 0; j < content.length; j++) {
			if (content.charAt(j) == "/" && content.charAt(j+1) == "/") {
				alert("Error");
				flag = 0;
				break;
			}
		}
		if (content == "") flag = 0;
		if (flag) {
			/*去掉前缀0*/
			for (var i = 0; i < content.length; i++) {
				if ((content.charAt(i-1) == "" || content.charAt(i-1) == "+" || content.charAt(i-1) == "-" ||
					content.charAt(i-1) == "*" || content.charAt(i-1) == "/" || content.charAt(i-1) == "(") &&
					content.charAt(i) == "0" && (content.charAt(i+1) != "*" && content.charAt(i+1) != "-" &&
					content.charAt(i+1) != "+" && content.charAt(i+1) !="/" && content.charAt(i+1) != ")")) {
					content = content.substring(0, i) + content.substring(i+1, content.length);
					i--;
				}
			}
			try {
				var result = eval(content);
				if (result == undefined || result == Infinity || result == -Infinity || isNaN(result)) {
					result = "";
					alert("Error");
				} else {
					result = result.toExponential(9);
					result = eval(result);
				}
			}
			catch(SyntaxError) {
				result = "";
				alert("Error");
			}
		}
	} else if ((new_input == "+" || new_input == "-" || new_input == "*" || new_input == "/") && y.value != "") {
		/*在output_container_2中有数据时按下操作符按钮后，需要把数据添加到output_container_1中*/
		var new_content = y.value+new_input;
		var result = "";
	} else {
		var new_content = x.value+new_input;
		var result = y.value;
		if (y.value != "") {
			/*在output_container_2中有数据时按下非操作符按钮后，需要把结果清空*/
			new_content = new_input;
			result = "";
		}
	}
	x.value = new_content;
	y.value = result;
}

window.onload = function() {
	document.getElementById('seven').onclick = function() {
		io_refresh("7");
	};
	document.getElementById('eight').onclick = function() {
		io_refresh("8");
	};
	document.getElementById('nine').onclick = function() {
		io_refresh("9");
	};
	document.getElementById('divide').onclick = function() {
		io_refresh("/");
	};
	document.getElementById('four').onclick = function() {
		io_refresh("4");
	};
	document.getElementById('five').onclick = function() {
		io_refresh("5");
	};
	document.getElementById('six').onclick = function() {
		io_refresh("6");
	};
	document.getElementById('multiply').onclick = function() {
		io_refresh("*");
	};
	document.getElementById('one').onclick = function() {
		io_refresh("1");
	};
	document.getElementById('two').onclick = function() {
		io_refresh("2");
	};
	document.getElementById('three').onclick = function() {
		io_refresh("3");
	};
	document.getElementById('minus').onclick = function() {
		io_refresh("-");
	};
	document.getElementById('zero').onclick = function() {
		io_refresh("0");
	};
	document.getElementById('dot').onclick = function() {
		io_refresh(".");
	};
	document.getElementById('plus').onclick = function() {
		io_refresh("+");
	};
	document.getElementById('bracket_l').onclick = function() {
		io_refresh("(");
	};
	document.getElementById('bracket_r').onclick = function() {
		io_refresh(")");
	};
	document.getElementById('delete').onclick = function() {
		io_refresh("delete");
	};
	document.getElementById('CE').onclick = function() {
		io_refresh("CE");
	};
	document.getElementById('equal').onclick = function() {
		io_refresh("equal");
	};
};
