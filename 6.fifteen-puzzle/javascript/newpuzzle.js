(function() {
	
	$(function() { new PuzzleGame(); });

	var PuzzleGame = function() {
		this.onloadSetting();
		this.creatPuzzles();
		this.addButtonListener();
	};

	var p = PuzzleGame.prototype;

	p.onloadSetting = function() {
		this.isOver = true;
		this.steps = 0;
		this.pictureNumber = 0;
		this.stepDiv = $('#steps');
		$('#original_picture').addClass('background0');
	};

	p.creatPuzzles = function() {
		this.puzzles = [];
		for (var i = 0; i <= 3; i++)
			for (var j = 0; j <= 3; j++) {
				var newPuzzle = $('<div></div>');
				this.setPuzzle(newPuzzle, i, j);
				this.puzzles.push(newPuzzle);
			}
		$('#puzzle_container').append(this.puzzles);
	};

	p.addButtonListener = function() {
		var that = this;
		$('#change_picture').click(function() { that.changePicture(); });
		$('#display_picture').click(function() { that.displayPicture(); });
		$('#restart').click(function() { that.restart(); });
	};

	p.setPuzzle = function(newPuzzle, i, j) {
		var that = this;
		newPuzzle.addClass(function() { return "p"+(i*4+j)+" puzzle"+" row"+i+" col"+j+" background0"; });
		newPuzzle.attr({ row: i, col: j, name: i*4+j, id: String.fromCharCode(65+i*4+j) });
		if (i == 3 && j == 3) this.hiddenPiece = newPuzzle;
		else newPuzzle.click(function() { that.clickPuzzle($(this)); })
	};

	p.changePicture = function() {
		var oldBackground = "background"+this.pictureNumber;
		this.pictureNumber = (this.pictureNumber+1)%4;
		var newBackground = "background"+this.pictureNumber;
		$('.puzzle').removeClass(oldBackground).addClass(newBackground);
		$('#original_picture').removeClass(oldBackground).addClass(newBackground);
	};

	p.displayPicture = function() {
		var pictureDiv = $('#original_picture');
		var button = $('#display_picture');
		if (pictureDiv.hasClass('hidden')) button.text("隐藏原图");
		else button.text("显示原图");
		pictureDiv.toggleClass('hidden');
	};

	p.restart = function() {
		var that = this;
		this.startSetting();
		setTimeout(function() { $('#P').addClass('hidden'); }, 200);
		setTimeout(function() { that.upset(); }, 500);
	};

	p.startSetting = function() {
		this.steps = 0;
		this.isOver = false;
		this.stepDiv.text("steps: "+this.steps);
		$('#outcome').text("");
		$('#restart').text("重新开始");
	};

	p.clickPuzzle = function(puzzle) {
		if (this.canMove(puzzle)) {
			this.move(puzzle);
			if (!p.isUpsetting) this.check();
		}
	};

	p.canMove = function(puzzle) {
		return ((puzzle.attr('col') == this.hiddenPiece.attr('col') && Math.abs(puzzle.attr('row')-this.hiddenPiece.attr('row')) == 1) ||
				(puzzle.attr('row') == this.hiddenPiece.attr('row') && Math.abs(puzzle.attr('col')-this.hiddenPiece.attr('col')) == 1)) &&
				(this.isOver == false);
	};

	p.move = function(puzzle) {
		var that = this;
		puzzle.removeClass(function() { return "row"+puzzle.attr('row')+" col"+puzzle.attr('col'); });
		puzzle.addClass(function() { return "row"+that.hiddenPiece.attr('row')+" col"+that.hiddenPiece.attr('col'); });
		this.hiddenPiece.removeClass(function() { return "row"+puzzle.attr('row')+" col"+puzzle.attr('col'); })
		this.hiddenPiece.addClass(function() { return "row"+puzzle.attr('row')+" col"+puzzle.attr('col'); });
		var temp = puzzle.attr('col'); puzzle.attr('col', this.hiddenPiece.attr('col')); this.hiddenPiece.attr('col', temp);
		temp = puzzle.attr('row'); puzzle.attr('row', this.hiddenPiece.attr('row')); this.hiddenPiece.attr('row', temp);
		this.steps++; this.stepDiv.text("steps: "+this.steps);
	};

	p.upset = function() {
		p.isUpsetting = true;
		for (var i = 0; i < 1000; i++) {
			var randomPiece = String.fromCharCode(65+(Math.floor(Math.random()*15)));
			this.clickPuzzle($("#"+randomPiece));
		}
		this.steps = 0; this.stepDiv.text("steps: "+this.steps);
		p.isUpsetting = false;
	};

	p.check = function() {
		for (var i = 0; i < 16; i++) {
			if (parseInt(this.puzzles[i].attr('col'))+parseInt(this.puzzles[i].attr('row')*4) != parseInt(this.puzzles[i].attr('name')))
				return;
		}
		this.win();
	}

	p.win = function() {
		setTimeout(function() { $('#P').removeClass('hidden'); }, 200);
		$('#outcome').text("YOU WIN!");
		$('#restart').text("开始");
		this.isOver = true;
	};

})();