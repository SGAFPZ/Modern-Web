(function() {
	$(function() { new Mole(); });

	var Mole = function() {
		this.setInfo();
		this.createHoles();
		this.addControllerListener();
	};

	var p = Mole.prototype;

	p.setInfo = function() {
		$(this).attr({ timeKey: null, score: 0, time: 30, isOver: true, selected: 0,
					scoreDiv: $('#score'), timeDiv: $('#time'), conditionDiv: $('#condition') });
	}

	p.createHoles = function() {
		this.holes = [];
		for(var i = 0; i < 60; i++) {
			var new_hole = $('<input/>');
			this.setNewHole(new_hole, i);
			this.holes.push(new_hole);
		}
		$('#hole_area').append(this.holes);
	};

	p.setNewHole = function(hole, i) {
		var that = this;
		hole.attr({ type: "radio", name: i }).addClass('hole').click(function() { that.check(hole); });
	};

	p.check = function(hole) {
		hole.prop('checked', false);
		if (!this.isOver) {
			if (this.isSelected(hole)) { this.randomSelect(); this.score++; }
			else { this.score--; }
		}
		this.refreshScore();
	};

	p.addControllerListener = function() {
		var that = this;
		$('#controller').click(function() {
			if (that.isOver === true) that.start();
			else that.over();
		});
	};

	p.isSelected = function(hole) {
		if (parseInt(hole.attr('name')) == this.selected) return true;
		return false;
	};

	p.randomSelect = function() {
		this.selected = Math.floor(Math.random()*60);
		this.holes[this.selected].prop('checked', true);
	};

	p.refreshScore = function() { this.scoreDiv.text(this.score); };

	p.refreshTime = function() { this.timeDiv.text(this.time); };

	p.refreshCondition = function() { this.conditionDiv.text(this.ConditionToString()); };

	p.start = function() {
		this.score = 0; this.refreshScore();
		this.isOver = false; this.refreshCondition();
		this.time = 30; this.startTiming();
		this.randomSelect();
	};

	p.over = function() {
		this.time = 0; this.refreshTime();
		this.isOver = true; this.refreshCondition();
		this.holes[this.selected].prop('checked', false);
		this.stopTiming();
		alert("Game Over.\nYour score is: " + this.score);
	};

	p.startTiming = function() {
		var that = this;
		this.refreshTime();
		this.time--;
		if (this.time == -1) { this.over(); return; }
		this.timeKey = setTimeout(function() { that.startTiming(); }, 1000);
	};

	p.stopTiming = function() { clearTimeout(this.timeKey); this.timeKey = null; };

	p.ConditionToString = function() {
		if (this.isOver === true) return "Game Over";
		return "Playing";
	};

})();