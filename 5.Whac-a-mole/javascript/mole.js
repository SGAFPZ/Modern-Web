function start_timing(time, variables) {
	time.textContent = variables.time + "";
	variables.time--;
	if (variables.time == -1) {
		stop_timing(variables);
		stop_sets(variables);
		return;
	}
	variables.key = setTimeout(function() { start_timing(time, variables); }, 1000);
}

function set_holes(variables) {
	var hole_area = document.getElementById('hole_area');
	for (var i = 0; i < 60; i++) {
		var new_hole = document.createElement('input');
		new_hole.type = "radio";
		new_hole.className = "hole";
		new_hole.name = i+"";
		new_hole.addEventListener('click', function() { check(this, variables); });
		hole_area.appendChild(new_hole);
	}
}

function check(current_hole, variables) {
	if (parseInt(current_hole.name) == variables.selected && variables.key != null) {
		current_hole.checked = false;
		random_select(variables);
		variables.score++;
	} else if (parseInt(current_hole.name) != variables.selected && variables.key != null) {
		current_hole.checked = false;
		variables.score--;
	} else {
		current_hole.checked = false;
	}
	document.getElementById('score').textContent = variables.score+"";
}

function random_select(variables) {
	variables.selected = Math.floor(Math.random()*60);
	document.getElementsByTagName('input')[variables.selected].checked = true;
}

function start_sets(variables) {
	document.getElementById('condition').textContent = "Playing";
	document.getElementById('score').textContent = "0";
	random_select(variables);
	variables.time = 30;
	variables.score = 0;
}

function stop_sets(variables) {
	document.getElementById('condition').textContent = "Game Over";
	document.getElementById('time').textContent = "0";
	document.getElementsByTagName('input')[variables.selected].checked = false;
	var result = "Game Over.\nYour score is: " + variables.score;
	alert(result);
}

function stop_timing(variables) {
	clearTimeout(variables.key);
	variables.key = null;
}

window.onload = function() {
	var variables = {key: null, selected: 0, score: 0, time: 0};
	set_holes(variables);
	var controller = document.getElementById('controller');
	controller.onclick = function() {
		var condition = document.getElementById('condition');
		var time = document.getElementById('time');
		if (condition.textContent == "Game Over") {
			start_sets(variables);
			start_timing(time, variables);
		} else if (condition.textContent == "Playing") {
			stop_timing(variables);
			stop_sets(variables);
		}
	}
}

