//$('head').append($('<script type="text/javascript" src="http://og4s4svgv.bkt.clouddn.com/sorter.js"></script>'));

(function() {

	var Sorter = function() {
		this.th = $('th');
		this.setStyle();
		this.addThreadListener();
	};
	
	var sorterP = Sorter.prototype;

	sorterP.setStyle = function() {
		this.th.addClass('sharedStyle thStyle');
		$('tr:even').addClass('even');
		$('table').addClass('borderCollapse');
		$('td').addClass('sharedStyle tdStyle');
	};

	sorterP.addThreadListener = function() {
		var that = this;
		this.th.click(function() {
			that.changeStyle($(this));
			that.sort($(this));
		});
	};

	sorterP.changeStyle = function(th) {
		if (th.has('#triangle').length === 0) {
			this.clearSelection();
			th.addClass('selected').append('<img src = "../img/ascend.png" id = "triangle">');
			this.img = $('#triangle');
		} else {
			this.img = $('#triangle');
			if (this.img.attr('src') == '../img/ascend.png') this.img.attr('src', '../img/descend.png');
			else this.img.attr('src', '../img/ascend.png');
		}
	};

	sorterP.clearSelection = function() {
		$('#triangle').remove();
		this.th.each(function() { $(this).removeClass('selected'); });
	};

	sorterP.sort = function(th) {
		var parentTable = th.parents('table');
		var keyIndex = parentTable.find('th').index(th);
		var trs = parentTable.find('tr:gt(0)');
		for (var i = 0; i < trs.length-1; i++)
			for (var j = i+1; j < trs.length; j++)
				this.exchange(trs, i, j, keyIndex);
	};

	sorterP.exchange = function(trs, i, j, keyIndex) {
		var tri = $(trs[i]).find('td'), trj = $(trs[j]).find('td');
		if (this.shouldChange(tri, trj, keyIndex)) {
			tri.each(function(index) {
				var temp = $(this).text();
				$(this).text($(trj[index]).text());
				$(trj[index]).text(temp);
			});
		}
	};

	sorterP.shouldChange = function(tri, trj, keyIndex) {
		return (this.img.attr('src') == '../img/ascend.png' && $(tri[keyIndex]).text() > $(trj[keyIndex]).text()) ||
				(this.img.attr('src') == '../img/descend.png' && $(tri[keyIndex]).text() < $(trj[keyIndex]).text());
	}
	
	$(function() { new Sorter(); });
	
})();