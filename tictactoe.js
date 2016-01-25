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

//All the conditions to win.
//Need to be a negative number, positive number, and neutral number
//so we can take it and subtract from total to calculate min and max
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