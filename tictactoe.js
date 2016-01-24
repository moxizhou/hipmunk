var PLAYER_MOVE = 'X';
var AI_MOVE = 'O';
$(function() {
	var ttt;

    function playerClick() {
		var row = $(this).attr('value');

    	//if player's turn and valid move
    	if (ttt.move(row, ttt.player)) {
    		//add player's move
    		$(this).addClass('fa fa-times fa-4x');

    		//calculate and add ai's move
    		var bestMove = ttt.aiMove();
    		$('td[value=' + bestMove + ']').addClass('fa fa-circle-o fa-4x');
    		
    		checkWinner();
    	}
    }

    function checkWinner() {
    	var winner = ttt.getScore();
    	var text;
    	if (winner !== false) {
    		switch(winner) {
    			case 1:
    				text = 'You lost!'
    				break;
    			case -1:
    				text = 'You won!'
    				break;
    			case 0:
    				text = 'You tied!'
    				break;
    			default:
    				break;
    		}
    		//fade board and turn click event off
    		$('.board').fadeTo(500, 0.3);
	    	$('.overlay').css('display', 'block').addClass('replay');
    		//display win/lose/tie results in center and allow click of retry
    		$('.end').text(text);
    		$('.fa-repeat').on('click', initialize)
    			.parent().css('display', 'flex');
    	}
		
    }

    function initialize() {
    	$('.board').css('display', 'none');
		$('.initial').css('display', 'block');
    	$('.player-start').on('click', start);
    	$('.ai-start').on('click', true, start);
    	$('.overlay').click(function noop(e) { return e.preventDefault(); });
    }

    function start(event) {
    	//instantiate class
    	ttt = new TicTacToe();

    	$('.overlay').css('display', 'none');
    	$('.board').fadeTo(500, 1);
    	$('td').removeClass().on('click', playerClick);
    	if (event.data) {
			var bestMove = ttt.aiMove();
    		$('td[value=' + bestMove + ']').addClass('fa fa-circle-o fa-4x');
    	}
    }

    initialize();

});

function TicTacToe() {
	this.board = new Array(9);
	this.player = PLAYER_MOVE;
	this.ai = AI_MOVE;
}

function move(i, player, board) {
	board = board || this.board;
	if (!board[i]) {
		board[i] = player;
		return true;
	}
	return false;
}

TicTacToe.prototype.move = move;

TicTacToe.prototype.aiMove = function() {
	var bestMove = this.minimax(this);
	this.move(bestMove, this.ai);
	return bestMove;
}

function isHorizontalVictory(board, player) {
	return (board[0] == player && board[1] == player && board[2] == player) ||
		(board[3] == player && board[4] == player && board[5] == player) ||
		(board[6] == player && board[7] == player && board[8] == player);
} 
function isVerticalVictory(board, player) {
	return (board[0] == player && board[3] == player && board[6] == player) ||
		(board[1] == player && board[4] == player && board[7] == player) ||
		(board[2] == player && board[5] == player && board[8] == player);
}
function isDiagonalVictory(board, player) {
	return (board[0] == player && board[4] == player && board[8] == player) ||
		(board[2] == player && board[4] == player && board[6] == player);
}
TicTacToe.prototype.hasWinner = function(player, board) {
	board = board || this.board;
	return isHorizontalVictory(board, player) || isVerticalVictory(board, player) || isDiagonalVictory(board, player);
}
	

TicTacToe.prototype.noMoves = function(board) {
	board = board || this.board;
	var result = true;
	for (var i = 0; i < board.length; i++) {
		if (!board[i]) {
			result = false;
			break;
		}
	}
	return result;
}

//all the conditions to win 
TicTacToe.prototype.getScore = function(board) {
	board = board || this.board;
	if (this.hasWinner(this.ai, board)) {
		return 1;
	} else if (this.hasWinner(this.player, board)) {
		return -1;
	} else if (this.noMoves(board)){
		return 0;
	} else {
		return false;
	}
}

function onNextMove(board, player, cb) {
	for (var i = 0; i < board.length; i++) {
		var newBoard = _.clone(board);
		var nextMove = move(i, player, newBoard);
		if (nextMove) cb(newBoard, i);
	}
}
//minimax recursive decision tree, always assume opponent is the highest level
TicTacToe.prototype.minimax = function() {
	var ARBITRARY_LOW_NUMBER = -10000;
	var topScore = ARBITRARY_LOW_NUMBER;
	var move = 0;
	var self = this;
	
	onNextMove(self.board, self.ai, function(newBoard, _move) {
		var currentScore = self.minValue(newBoard);
		if (currentScore > topScore) {
			topScore = currentScore;
			move = _move;
		}
	});
	return move;
}

//ideal opponent, always minimize ai score
TicTacToe.prototype.minValue = function(board) {
	var winner = this.getScore(board);
	if (winner !== false) {
		return winner;
	}
	var topScore = 10000;
	var self = this;
	onNextMove(board, self.player, function(newBoard) {
		var currentScore = self.maxValue(newBoard);
		if (currentScore < topScore) {
			topScore = currentScore;
		}
	});
	return topScore;
}

//ideal ai, always maximize ai score
TicTacToe.prototype.maxValue = function(board) {
	var winner = this.getScore(board);
	if (winner !== false) {
		return winner;
	}
	var topScore = -10000;
	var self = this;
	onNextMove(board, self.ai, function(newBoard) {
		var currentScore = self.minValue(newBoard);
		if (currentScore > topScore) {
			topScore = currentScore;
		}
	})
	return topScore;
}
