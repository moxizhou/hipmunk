var ttt;
var CLASSES = {
	board: '.board',
	overlay: '.overlay'
}
var FADE_TIME = 500;

function playerClick() {
	var index = $(this).attr('value');

	//if player's turn and valid move
	if (ttt.move(index, ttt.player, ttt.board)) {
		UIManager.setMove($(this), true);

		var aiMove = ai.move(ttt.board);
		UIManager.setMove($('td[value=' + aiMove + ']'));		
		checkWinner();
	}
}

function checkWinner() {
	var winner = ttt.getScore(ttt.board);
	var text;
	if (winner !== false) {
		if (winner === 1) {
			text = 'You lost!';
		} else if (winner === -1) {
			text = 'You won!';
		} else {
			text = 'You tied!';
		}
		UIManager.toggleEndGame(text);
	}
}

function start(event) {
	//instantiate class
	ttt = new TicTacToe();
	UIManager.toggleBoard();
	$('td').removeClass();
	if (event.data) {
		//always start AI at index 0 if they start first because minimax calculates to index 0
		UIManager.setMove($('td[value=0]'));
	}
}

var UIManager = {
	setMove: function(box, isPlayer) {
		var icon = isPlayer ? 'fa-times' : 'fa-circle-o'; 
		box.addClass('fa fa-4x ' + icon);
	},
	toggleEndGame: function(endText) {
		$(CLASSES.board).fadeTo(FADE_TIME, 0.3);
    	$(CLASSES.overlay).css('display', 'block').addClass('replay');
		$('#end').text(endText);
	},
	initialize: function() {
		$(CLASSES.board).css('display', 'none');
		$(CLASSES.overlay).removeClass('replay');
		
	},
	toggleBoard: function() {
		$(CLASSES.overlay).css('display', 'none');
		$(CLASSES.board).fadeTo(FADE_TIME, 1);
	}
}

$('.fa-repeat').on('click', UIManager.initialize);
$('#player-start').on('click', start);
$('#ai-start').on('click', true, start);
$('td').on('click', playerClick);
$(CLASSES.overlay).on('click', function noop(e) { return e.preventDefault(); });

UIManager.initialize();

function TicTacToe() {
	this.board = new Array(9);
	this.player = 'X';
	this.ai = 'O';
}

TicTacToe.prototype.move = function(i, player, board) {
	if (!board[i]) {
		board[i] = player;
		return true;
	}
	return false;
};

TicTacToe.prototype._hasWinner = function(player, board) {
	
	function isHorizontalVictory(board, player) {
		return (board[0] === player && board[1] === player && board[2] === player) ||
			(board[3] === player && board[4] === player && board[5] === player) ||
			(board[6] === player && board[7] === player && board[8] === player);
	} 
	function isVerticalVictory(board, player) {
		return (board[0] === player && board[3] === player && board[6] === player) ||
			(board[1] === player && board[4] === player && board[7] === player) ||
			(board[2] === player && board[5] === player && board[8] === player);
	}
	function isDiagonalVictory(board, player) {
		return (board[0] === player && board[4] === player && board[8] === player) ||
			(board[2] === player && board[4] === player && board[6] === player);
	}

	return isHorizontalVictory(board, player) || isVerticalVictory(board, player) || isDiagonalVictory(board, player);
};
	
TicTacToe.prototype._noMoves = function(board) {
	return !_.contains(board, undefined);
};

//All the conditions to win 
TicTacToe.prototype.getScore = function(board) {
	if (this._hasWinner(this.ai, board)) {
		return 1;
	} else if (this._hasWinner(this.player, board)) {
		return -1;
	} else if (this._noMoves(board)) {
		return 0;
	} else {
		return false;
	}
};

function onNextMove(board, player, cb) {
	for (var i = 0; i < board.length; i++) {
		var newBoard = _.clone(board);
		var nextMove = ttt.move(i, player, newBoard);
		if (nextMove) cb(newBoard, i);
	}
}

var ai = {
	move: function(board) {
		var bestMove = this._minimax(board);
		ttt.move(bestMove, ttt.ai, ttt.board);
		return bestMove;
	},
	//minimax recursive decision tree, always assume opponent is the highest level
	_minimax: function minimax(board) {
		var topScore = this._ARBITRARY_LOW_NUMBER;
		var move = 0;
		
		onNextMove(board, ttt.ai, function(newBoard, _move) {
			var currentScore = ai._minValue(newBoard);
			if (currentScore > topScore) {
				topScore = currentScore;
				move = _move;
			}
		});
		return move;
	},
	//ideal opponent, always minimize ai score
	_minValue: function(board) {
		var winner = ttt.getScore(board);
		if (winner !== false) {
			return winner;
		}
		var topScore = this._ARBITRARY_HIGH_NUMBER;
		onNextMove(board, ttt.player, function(newBoard) {
			var currentScore = ai._maxValue(newBoard);
			if (currentScore < topScore) {
				topScore = currentScore;
			}
		});
		return topScore;
	},
	//ideal ai, always maximize ai score
	_maxValue: function(board) {
		var winner = ttt.getScore(board);
		if (winner !== false) {
			return winner;
		}
		var topScore = this._ARBITRARY_LOW_NUMBER;
		onNextMove(board, ttt.ai, function(newBoard) {
			var currentScore = ai._minValue(newBoard);
			if (currentScore > topScore) {
				topScore = currentScore;
			}
		})
		return topScore;
	},
	_ARBITRARY_LOW_NUMBER: -10000,
	_ARBITRARY_HIGH_NUMBER: 10000
}
