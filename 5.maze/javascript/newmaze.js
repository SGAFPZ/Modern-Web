(function() {
	$(function() { new Maze(); });

	var Maze = function() {
		this.hasMouseBeenOut = false;
		this.isOver = true;
		this.outcome = $('#outcome');
		this.addWallListener();
		this.addStartListener();
		this.addEndListener();
		this.addMazeListener();
	};

	var p = Maze.prototype;

	p.addWallListener = function() {
		var that = this;
		this.walls = $('.wall');
		this.walls.each(function() {
			this.addEventListener('mouseover', function() { that.hit(this); });
		});
	};

	p.hit = function(wall) {
		if (this.fromInside() && this.isOver === false) {
			this.changeColor(wall);
			this.lose();
		}
	};

	p.fromInside = function() { return !this.hasMouseBeenOut; };

	p.changeColor = function(wall) {
		wall.classList.remove('defaultColor');
		wall.classList.add('hitColor');
	};

	p.lose = function() { this.outcome.text("You Lose"); this.over(); };

	p.addStartListener = function() {
		var that = this;
		this.startDiv = $('#start');
		this.startDiv.mouseover(function() { that.start(); });
	};

	p.start = function() {
		this.outcome.addClass('hide');
		this.hasMouseBeenOut = false;
		this.isOver = false;
		this.walls.each(function() {
			this.classList.remove('hitColor');
			this.classList.add('defaultColor');
		});
	};

	p.addEndListener = function() {
		var that = this;
		this.endDiv = $('#end');
		this.endDiv.mouseover(function() { that.check(); });
	};

	p.check = function() {
		if (this.isOver === false) {
			if (this.hasMouseBeenOut === false) this.win();
			else this.cheat();
		}
	};

	p.addMazeListener = function() {
		var that = this;
		this.mazeDiv = $('#maze');
		this.mazeDiv.mouseleave(function() { that.hasMouseBeenOut = true; });
	};

	p.cheat = function() {
		this.outcome.text("Don't cheat,you should start from the 'S' and move to the 'E' inside the maze!");
		this.over();
	};

	p.win = function() {
		this.outcome.text("You Win");
		this.over();
	};

	p.over = function() {
		this.isOver = true;
		this.outcome.removeClass('hide');
	};

})();