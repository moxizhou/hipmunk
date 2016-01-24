var ttt;

$(function() {
	
	var FADE_TIME = 500;
	var CLASSES = {
		board: '.board',
		overlay: '.overlay'
	};

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
		
		//always start AI at index 0 if they start first because minimax calculates to index 0
		if (event.data) {
			ttt.move(0, ttt.ai, ttt.board);
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
			$('td').removeClass();
			$(CLASSES.overlay).removeClass('replay');
		},
		toggleBoard: function() {
			$(CLASSES.overlay).css('display', 'none');
			$(CLASSES.board).fadeTo(FADE_TIME, 1);
		}
	};

	//click event handlers
	$('.fa-repeat').on('click', UIManager.initialize);
	$('#player-start').on('click', start);
	$('#ai-start').on('click', true, start);
	$('td').on('click', playerClick);
	$(CLASSES.overlay).on('click', function noop(e) { return e.preventDefault(); });
	
	UIManager.initialize();

});