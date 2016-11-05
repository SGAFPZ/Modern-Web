function hit_wall(outcome, itself, condition) {
	/*鼠标从游戏进行中碰到墙，并且是从迷宫内部碰到，墙才会变红，否则不反应*/
	if (outcome.style.opacity == "0" && condition.value == 0) {
		outcome.textContent = "You Lose";
		outcome.style.opacity = "1";
		itself.style.backgroundColor = 'red';
	}
}

function wall_sets(outcome, condition) {
	var walls = document.getElementsByClassName('wall');
	for (var i = 0; i < walls.length-1; i++) {
		walls[i].addEventListener('mouseover', function() {
			hit_wall(outcome, this, condition);
		});
	}
}

window.onload = function() {
	var condition = {value: 1}; /*1代表在maze外，0代表在maze内*/
	var outcome = document.getElementById('outcome');
	var walls = document.getElementsByClassName('wall');
	var maze = document.getElementById('maze');
	outcome.style.opacity = "0";

	document.getElementById('start').onmouseover = function() {
		outcome.style.opacity = "0";
		condition.value = 0;
		for (var i = 0; i < 9; i++) {
			walls[i].style.backgroundColor = '#EEEEEE';
		}
	}

	maze.onmouseleave = function() {
		condition.value = 1;
		for (var i = 0; i < 9; i++) {
			walls[i].style.backgroundColor = '#EEEEEE';
		}
	}

	wall_sets(outcome, condition);

	document.getElementById('end').onmouseover = function() {
		if (condition.value == 0 && outcome.style.opacity == "0") {
			outcome.style.opacity = "1";
			outcome.textContent = "You Win";
		} else if (condition.value == 1 && outcome.style.opacity == "0") {
			outcome.style.opacity = "1";
			outcome.textContent = "Don't cheat,you should start from the 'S' and move to the 'E' inside the maze!";
		}
	}

}