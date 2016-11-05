(function() {
	$(function() { new Maze(); });

	var Maze = function() {
		this.hasMouseBeenOut = false;
		this.isOver = true;
		this.outcome = $('#outcome');
		this.addListener();
	};

	var p = Maze.prototype;

	p.addListener = function() {
		var that = this;
		this.walls = $('.wall');
		this.walls.each(function() { $(this).mouseover(function() { that.hit(this); }); });
		$('#start').mouseover(function() { that.start(); });
		$('#end').mouseover(function() { that.check(); });
		$('#maze').mouseleave(function() { that.hasMouseBeenOut = true; });
	};

	p.hit = function(wall) {
		if (!this.hasMouseBeenOut && this.isOver === false) {
			$(wall).removeClass('defaultColor').addClass('hitColor');
			this.lose();
		}
	};

	p.lose = function() { this.outcome.text("You Lose"); this.over(); };

	p.start = function() {
		this.outcome.addClass('hide');
		this.hasMouseBeenOut = false;
		this.isOver = false;
		this.walls.each(function() { $(this).removeClass('hitColor').addClass('defaultColor'); });
	};

	p.check = function() {
		if (this.isOver === false) {
			if (this.hasMouseBeenOut === false) this.win();
			else this.cheat();
		}
	};

	p.cheat = function() {
		this.outcome.text("Don't cheat,you should start from the 'S' and move to the 'E' inside the maze!");
		this.over();
	};

	p.win = function() { this.outcome.text("You Win"); this.over(); };

	p.over = function() {
		this.isOver = true;
		this.outcome.removeClass('hide');
	};

})();