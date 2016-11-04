function set_puzzles(variables) {
	var steps = document.getElementById('steps');
	var p_c = document.getElementById('puzzle_container');
	var fragment = document.createDocumentFragment();
	var hidden = document.createElement('div');
	hidden.className = "p15 puzzle row3 col3 background0"; hidden.relrow = 3; hidden.relcol = 3;
	hidden.row = 3; hidden.col = 3; hidden.name = 15; hidden.id = 'P';
	variables.hidden_p = hidden;
	var func = function() { check_and_react(this, variables, steps); };
	for (var i = 0; i <= 3; i++) {
		for (var j = 0; j <= 3; j++) {
			if (i == 3 && j == 3) break;
			var new_puzzle = document.createElement('div');
			var number = "p"+(i*4+j);
			var row = "row"+i;
			var col = "col"+j;
			new_puzzle.classList.add(number, 'puzzle', row, col, "background0");
			new_puzzle.relrow = i; new_puzzle.relcol = j;
			new_puzzle.row = i; new_puzzle.col = j; new_puzzle.name = i*4+j; new_puzzle.id = String.fromCharCode(65+new_puzzle.name);
			new_puzzle.addEventListener('click', func);
			fragment.appendChild(new_puzzle);
		}
	}
	fragment.appendChild(hidden);
	p_c.appendChild(fragment);
}

function move(cur_puzzle, hidden) {
	var oldrow = "row"+cur_puzzle.row;
	var oldcol = "col"+cur_puzzle.col;
	var row = "row"+hidden.row;
	var col = "col"+hidden.col;
	cur_puzzle.classList.remove(oldrow, oldcol);
	cur_puzzle.classList.add(row, col);
	var temp = cur_puzzle.col; cur_puzzle.col = hidden.col; hidden.col = temp;
	temp = cur_puzzle.row; cur_puzzle.row = hidden.row; hidden.row = temp;
}

function check_and_react(new_puzzle, variables, steps) {
	if (variables.over === 0) {
		if (new_puzzle.row == variables.hidden_p.row &&
			(new_puzzle.col == variables.hidden_p.col-1 || new_puzzle.col == variables.hidden_p.col+1)) {
			if (in_rightpos(new_puzzle)) variables.count--;  //如果移动前位置正确，那么移动后匹配个数减1,下同
			move(new_puzzle, variables.hidden_p);
			variables.steps++;
			steps.innerHTML = "steps: "+variables.steps;
			if (in_rightpos(new_puzzle)) variables.count++;  //如果移动后位置正确，那么移动后匹配个数加1,下同
		} else if (new_puzzle.col == variables.hidden_p.col &&
			(new_puzzle.row == variables.hidden_p.row-1 || new_puzzle.row == variables.hidden_p.row+1)) {
			if (in_rightpos(new_puzzle)) variables.count--;
			move(new_puzzle, variables.hidden_p);
			variables.steps++;
			steps.innerHTML = "steps: "+variables.steps;
			if (in_rightpos(new_puzzle)) variables.count++;
		}
		if (variables.count == 15) {
			variables.over = 1;
			over();
		}
	}
}

function upset(variables) {
	/*先随机选定一片拼图(实际上是选中了这片拼图的位置，之后选中的其它拼图都会和这个位置上的拼图互换)*/
	var random = String.fromCharCode(65+(Math.floor(Math.random()*15)));
	/*last用于保证相邻两次随机选择的拼图不会相同*/
	var last = random;
	var n = 20;
	var temp, a, b;
	/*n每减2，就能保证任意不同的三片拼图之间相互换一下位置(互换后三片都不会在先前的位置，这样以来逆序对奇*/
	/*性一定和原来相同)，或者全部保持不变(random等于上上次的random)，所以只要n是偶数就能保证有解。       */
	while (n--) {
		a = document.getElementById(random); if (in_rightpos(a)) variables.count--;
		while (random === last) random = String.fromCharCode(65+(Math.floor(Math.random()*15)));
		last = random;
		b = document.getElementById(random); if (in_rightpos(b)) variables.count--;
		/*交换a,b的行、列属性，并修改类名*/
		temp = a.col; a.col = b.col; b.col = temp;
		temp = a.row; a.row = b.row; b.row = temp;
		if (in_rightpos(a)) variables.count++; if (in_rightpos(b)) variables.count++;
		a.classList.remove("row"+b.row, "col"+b.col); a.classList.add("row"+a.row, "col"+a.col);
		b.classList.remove("row"+a.row, "col"+a.col); b.classList.add("row"+b.row, "col"+b.col);
	}
	variables.steps = 0;
	document.getElementById('steps').innerHTML = "steps: "+variables.steps;
}

function over() {
	setTimeout(function() {
		document.getElementById('P').classList.remove('hidden');
	}, 200);
	document.getElementById('outcome').textContent = "YOU WIN!";
	document.getElementById('restart').innerHTML = "开始";
}

function restart(variables) {
	variables.over = 0;
	variables.steps = 0;
	document.getElementById('steps').innerHTML = "steps: "+variables.steps;
	setTimeout(function() {
		document.getElementById('P').classList.add('hidden');
	}, 200);
	setTimeout(function() {
		upset(variables);
	}, 500);
	document.getElementById('outcome').textContent = "";
	document.getElementById('restart').innerHTML = "重新开始";
}

function in_rightpos(puzzle) {
	if (puzzle.row*4+puzzle.col == puzzle.name) return true;
	return false;
}

window.onload = function() {
	var variables = { count: 15, over: 1, picture_number: 0, hidden_p: undefined, steps: 0 };
	set_puzzles(variables);
	document.getElementById('original_picture').classList.add('background0');
	document.getElementById('restart').onclick = function() { restart(variables); };
	document.getElementById('change_picture').onclick = function() {
		var oldbg = "background"+variables.picture_number;
		variables.picture_number = (variables.picture_number+1)%4;
		var newbg = "background"+variables.picture_number;
		var puzzles = document.getElementsByClassName('puzzle');
		for (var i = 0; i < puzzles.length; i++) {
			puzzles[i].classList.remove(oldbg);
			puzzles[i].classList.add(newbg);
		}
		var original_picture = document.getElementById('original_picture');
		original_picture.classList.remove(oldbg);
		original_picture.classList.add(newbg);
	};
	document.getElementById('display_picture').onclick = function() {
		var visible = document.getElementById('original_picture');
		if (visible.classList.contains('hidden')) {
			document.getElementById('display_picture').innerHTML = "隐藏原图";
			visible.classList.remove('hidden');
		} else {
			document.getElementById('display_picture').innerHTML = "显示原图";
			visible.classList.add('hidden');
		}
	};
	/*document.getElementById('cheat').onclick = function() {
		
	}*/
};

/*
//to be finished
function AI() {


	function Node() {
		var f = 0, g = 0, h = 0;
		var prev = null, next = null;
		var state = [];
		var hash = '';
	}


	this.Astar = function() {
		var openList = null, closeList = new Set();
		var start_node = new Node();
		start_node.state = this.get_state();
		start_node.hash = this.get_hash(start_node.state);
		start_node.prev = null; start_node.next = null;
		var right_hash = 'ABCDEFGHIJKLMNOP';
		start_node.g = 1; start_node.h = guessCost(start_node.hash, right_hash);
		start_node.f = start_node.g+start_node.h;
		openList = start_node;
		while (openList !== null) {
			var min_node = openList;
			var it = min_node.next, prev = null, last = min_node;
			while (it !== null) {
				if (min_node.f > it.f) { min_node = it; prev = last; }
				last = it;
				it = it.next;
			}
			if (min_node.hash === right_hash) break;
			//找到P的位置
			var p_x = 0, p_y = 0;
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					if ((min_node.state)[i][j] === 'P') {
						p_x = i; p_y = j;
					}
				}
			}
			var dir = [[-1, 0], [0, 1], [1, 0], [0, -1]];
			for (let k = 0; k < 4; k++) {
				var new_x = p_x+dir[k][0], new_y = p_y+dir[k][1];
				if (!this.isValid(new_x, new_y)) continue;
				//新节点
				var new_node = new Node();
				//复制原来的state
				new_node.state = [];
				for (let i = 0; i < 4; i++) new_node.state.push([]);
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 4; j++) {
						new_node.state[i][j] = min_node.state[i][j];
					}
				}
				//修改state
				let temp = new_node.state[p_x][p_y];
				new_node.state[p_x][p_y] = new_node.state[new_x][new_y];
				new_node.state[new_x][new_y] = temp;
				//计算hash, g, h, f
				new_node.hash = this.get_hash(new_node.state);
				new_node.g = min_node.g+1; new_node.h = guessCost(new_node.hash, right_hash);
				new_node.prev = min_node;
				it = openList;
				var isinopen = 0;
				while (it !== null) {
					if (it.hash === new_node.hash) {
						isinopen = 1;
						if (new_node.hash < it.hash) {
							it.g = new_node.g;
							it.h = new_node.h;
							it.f = new_node.f;
							it.prev = new_node.prev;
						}
					}
				}
				if (isinopen === 0) {

				}
			}
		}
	}


	this.isValid = function(x, y) {
		return (x >= 0 && x <= 3 && y >= 0 && y <= 3);
	}


	this.get_state = function() {
		var a = [];
		var p = document.getElementsByClassName('puzzle');
		for (let i = 0; i < 4; i++) a.push([]);
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				var temp = p[4*i+j];
				a[temp.row][temp.col] = temp.id;
			}
		}
		return a;
	}


	this.get_hash = function(state) {
		var hash = '';
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				hash = hash+state[i][j];
			}
		}
		return hash;
	}


	var guessCost = function(current_h, right_h) {
		var res = 0;
		for (var i = 0; i < 16; i++) {
			for (var j = 0; j < 16; j++) {
				if (current_h[i] === right_h[j]) {
					current_x = i/4; current_y = i%4;
					right_x = j/4; right_y = j%4;
					res += Math.sqrt(Math.pow(current_x-right_x, 2)+Math.pow(current_y-right_y, 2));
				}
			}
		}
		return res;
	}
}

*/

