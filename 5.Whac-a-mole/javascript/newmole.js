(function() {
	$(function() { new Mole(); });

	var Mole = function() {
		this.scoreDiv = $('#score');
		this.timeDiv = $('#time');
		this.conditionDiv = $('#condition');
		this.setInfo();
		this.createHoles();
		this.addControllerListener();
	};

	var p = Mole.prototype;

	p.setInfo = function() {
		this.timeKey = null; this.score = 0; this.time = 30; this.isOver = true; this.selected = 0;
	}

	p.createHoles = function() {
		this.holes = [];
		this.hole_area = $('#hole_area');
		for(var i = 0; i < 60; i++) {
			var new_hole = document.createElement('input');
			this.setNewHole(new_hole, i);
			this.holes.push(new_hole);
		}
		this.hole_area.append(this.holes);
	};

	p.setNewHole = function(new_hole, i) {
		var that = this;
		new_hole.type = "radio";
		new_hole.className = "hole";
		new_hole.name = i;
		new_hole.addEventListener('click', function() { that.check(this); });
	};

	p.check = function(hole) {
		hole.checked = false;
		if (!this.isOver && this.isSelected(hole)) {
			this.randomSelect();
			this.score++;
		} else if (!this.isOver && !this.isSelected(hole)) {
			this.score--;
		}
		this.refreshScore();
	};

	p.addControllerListener = function() {
		var that = this;
		this.controller = $('#controller');
		this.controller.click(function() {
			if (that.isOver === true) that.start();
			else that.over();
		});
	};

	p.isSelected = function(hole) {
		if (hole.name == this.selected) return true;
		return false;
	};

	p.randomSelect = function() {
		this.selected = Math.floor(Math.random()*60);
		this.holes[this.selected].checked = true;
	};

	p.refreshScore = function() { this.scoreDiv.text(this.score); };

	p.refreshTime = function() { this.timeDiv.text(this.time); };

	p.refreshCondition = function() { this.conditionDiv.text(this.ConditionToString()); };

	p.start = function() {
		this.score = 0;
		this.time = 30;
		this.isOver = false;
		this.refreshScore();
		this.refreshCondition();
		this.randomSelect();
		this.startTiming();
	};

	p.over = function() {
		this.time = 0;
		this.isOver = true;
		this.holes[this.selected].checked = false;
		this.refreshCondition();
		this.refreshTime();
		this.stopTiming();
		alert("Game Over.\nYour score is: " + this.score);
	};

	p.startTiming = function() {
		var that = this;
		this.refreshTime();
		this.time--;
		if (this.time == -1) { this.over(); }
		this.timeKey = setTimeout(function() { that.startTiming(); }, 1000);
	};

	p.stopTiming = function() { clearTimeout(this.timeKey); this.timeKey = null; };

	p.ConditionToString = function() {
		if (this.isOver === true) return "Game Over";
		return "Playing";
	};

})();