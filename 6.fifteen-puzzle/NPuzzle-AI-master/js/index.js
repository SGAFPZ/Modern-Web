/*
Global variables
*/
var game = {
	timer: null,
	imgType: 0,
	isCheating: false,
	size: 25,
	attr: new Array(),
	blocks: new Array(),
	path: [],
	pathIndex: 0,
	desNode: new NPuzzleNode([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0], 5, 5),
	curNode: new NPuzzleNode([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0], 5, 5)
}

/*
Start
*/
$(function() {
	init();
});

/*
Initialize the puzzle.
*/
function init() {
	// Initial image blocks
	for (var i = 0; i < game.size; ++i) {
		var leftOffset = game.desNode.getCol(i) * 81;
		var topOffset = game.desNode.getRow(i) * 81;

		// Record attribute at position i
		game.attr[i] = {
			left: leftOffset + "px",
			top: topOffset + "px"
		}

		var block = $("<div class=\"puzzleBlock\"></div>");
		block.attr("pos", i);  // Extra attribute to record the current block position 
		block.click(blockClickCb);

		if (i != game.size - 1) {  // Escape empty block
			var img = $("<img class=\"puzzleImg\" src=\"img/light.jpg\"></img>");
			img.css("left", -leftOffset + "px");
			img.css("top", -topOffset + "px");
			block.append(img);
		}

		// Record block at position i
		game.blocks[i] = block;
		$("#imgContainer").append(block);
	}

	// Sync with dom elements
	setPuzzleWithNode(game.curNode);

	// Initialize buttons 
	$("#switchBtn").click(function() {
		if (!game.isCheating) {
			if (game.imgType) {
				$("body").attr("class", "lightBackground");
				$("#switchBtn").html("DARK");
			    changeImg("light.jpg");
			} else {
				$("body").attr("class", "darkBackground");
				$("#switchBtn").html("LIGHT");
			    changeImg("dark.jpg");
		    }
		    game.imgType = !game.imgType;
			recover();
		}
	});

	$("#mixBtn").click(function() {
		if (!game.isCheating) {
			game.curNode.shuffle();
			setPuzzleWithNode(game.curNode);
		}
	});

	$("#cheatBtn").click(function() {
		if (!game.isCheating) {
			game.isCheating = true;
			cheat();
		}
	});
}

/*
Make the puzzle content consistent with an NPuzzleNode

@param node the NPuzzleNode object
*/
function setPuzzleWithNode(node) {
	for (var i = 0; i < node.val.length; ++i) {
		var pos = node.val[i] - 1;
		if (pos == -1) {  // Empty block is in game.blocks[size - 1]
			pos = game.size - 1;
		}
		var block = game.blocks[pos];
		block.css("left", game.attr[i].left);
		block.css("top", game.attr[i].top);
		block.attr("pos", i);
	}
}

/*
Click event callback for each image block
*/
function blockClickCb() {
	if (!game.isCheating) {
		var direc = getDirection(game.curNode.emptyPos, $(this).attr("pos"));
		if (direc != Direction.NONE && game.curNode.canMove(direc)) {
			move(direc);
			if (isWin()) {
				setTimeout("showWinMsg();", 150);
			}
		}
	}
}

/*
Move the empty block toward the direction

@param direc the direction
*/
function move(direc) {
	game.curNode.move(direc);
	setPuzzleWithNode(game.curNode);
}

/*
Recover the puzzle to the origin state.
*/
function recover() {
	var des = game.desNode;
	setPuzzleWithNode(des);
	game.curNode = new NPuzzleNode(des.val.slice(0), des.row, des.col);
}

/*
Get the direction from one position to another

@param from the start position
@param to the end position
@return the direction toward the end position.
        If the two position are not adjacent,
        return Direciton.NONE
*/
function getDirection(from, to) {
	var curRow = game.curNode.getRow(from);
	var curCol = game.curNode.getCol(from);
	var desRow = game.curNode.getRow(to);
	var desCol = game.curNode.getCol(to);
	var dRow = desRow - curRow;
	var dCol = desCol - curCol;
	var direc = Direction.NONE;
	if (dRow == 0 && dCol == 1) {
		direc = Direction.RIGHT;
	} else if (dRow == 0 && dCol == -1) {
		direc = Direction.LEFT;
	} else if (dRow == -1 && dCol == 0) {
		direc = Direction.UP;
	} else if (dRow == 1 && dCol == 0) {
		direc = Direction.DOWN;
	}
	return direc;
}

/*
Check if the player wins the game
*/
function isWin() {
	return game.curNode.equals(game.desNode);
}

/*
Show the winning message
*/
function showWinMsg() {
	$("#mainContainer").attr("class", "blur");
	window.setTimeout(function() {
		var winMsg = $("<div class=\"winMsgDiv\"><p>You Win!</p></div>");
		winMsg.click(function() {
			$("#mainContainer").attr("class", "noBlur");
			$(".winMsgDiv").remove();
		});
		$("body").append(winMsg);
	}, 300);   // Show win message after 300ms
}

/*
Change the puzzle image

@param img the file name of the image
*/
function changeImg(img) {
	var images = document.getElementsByTagName("img");
	for (var i = 0; i < images.length; ++i) {
		images[i].src = "img/" + img;
	}
}

/*
Find a solution and recover the puzzle
*/
function cheat() {
	// Searching
	console.log("Searching...");
	var puzzle = new NPuzzle(game.curNode, game.desNode);
	puzzle.run();
	console.log("Searching finished.");
	console.log("Searched nodes: " + puzzle.searchedCnt);
	console.log("Path length: " + puzzle.pathDirec.length);
	// Recover the puzzle
	game.path = puzzle.pathDirec;
	game.pathIndex = 0;
	game.timer = setInterval(function() {
		if (game.pathIndex == game.path.length) {
			clearInterval(game.timer);
			game.isCheating = false;
			game.path = [];
			$("#cheatBtn").html("CHEAT");
			if (isWin()) {
				showWinMsg();
			}
		} else {
			move(game.path[game.pathIndex++]);
			$("#cheatBtn").html(game.path.length - game.pathIndex);
		}
	}, 100);
}
