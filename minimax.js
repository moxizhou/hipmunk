var ai = {
	move: function(board) {
		var bestMove = this._minimax(board);
		ttt.move(bestMove, ttt.ai, ttt.board);
		return bestMove;
	},

	_onNextMove: function(board, player, cb) {
		for (var i = 0; i < board.length; i++) {
			var newBoard = _.clone(board);
			var nextMove = ttt.move(i, player, newBoard);
			if (nextMove) cb(newBoard, i);
		}
	},

	//minimax recursive decision tree, always assume opponent is the highest level
	_minimax: function minimax(board) {
		var topScore = this._ARBITRARY_LOW_NUMBER;
		var move = 0;
		
		this._onNextMove(board, ttt.ai, function(newBoard, _move) {
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
		this._onNextMove(board, ttt.player, function(newBoard) {
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
		this._onNextMove(board, ttt.ai, function(newBoard) {
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