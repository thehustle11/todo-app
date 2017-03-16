if (localStorage.tasks) {
	updateUI();
}

function undo(action) {
	if (action === 'store') {
		var tasks = JSON.parse(localStorage.tasks);
		if (localStorage.tasks !== '[]') {
			localStorage.undo = JSON.stringify(tasks);
			$('.undo').css({
				'display': 'block'
			});
		}
	} else if (action === 'undo') {
		var undo = JSON.parse(localStorage.undo);
		localStorage.tasks = JSON.stringify(undo);
		updateUI();
	}
}

function addToArray(item) {
	$('.undo').css({
		'display': 'none'
	});
	if (localStorage.tasks) {
		var tasks = JSON.parse(localStorage.tasks);
		tasks.unshift({value: item, completed: false});
		localStorage.tasks = JSON.stringify(tasks);
	} else {
		localStorage.tasks = JSON.stringify([{value: item, completed: false}]);
	}
	updateUI();
}

function updateUI() {
	var tasks = JSON.parse(localStorage.tasks);
	$('.tasks ul').html('');
	for (i = 0; i < tasks.length; i++) {
		if (tasks[i].completed) {
			$('<li><i class="material-icons fa fa-check"></i>' + tasks[i].value.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</li>').appendTo('.tasks ul');
			$('.tasks li:eq('+i+')').addClass('completed');
		} else {
			$('<li>' + tasks[i].value.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</li>').appendTo('.tasks ul');
			$('.tasks li:eq('+i+')').removeClass('completed');
		}
	}
}

$('.tasks ul').on('click', 'li', function() {
	var tasks = JSON.parse(localStorage.tasks);
	var index = $(this).index();
	var completed = !tasks[index].completed;
	tasks[index].completed = completed;
	localStorage.tasks = JSON.stringify(tasks);
	updateUI();
});

$('.insert').keyup(function(e) {
	if (e.keyCode == 13 && $(this).val().length > 0 && $(this).val() !== ' ') {
		addToArray($(this).val());
		$(this).select();
		$('li:first-child').hide();
		$('li:first-child').slideDown(100);
	}
});

$('.insert').focus(function() {
	$(this).select();
});

var justPressed = false;

$('#markAll').click(function() {
	if (localStorage.tasks) {
		undo('store');
		var tasks = JSON.parse(localStorage.tasks);
		if (justPressed == false) {
			for (i = 0; i < tasks.length; i++) {
				tasks[i].completed = true;
				localStorage.tasks = JSON.stringify(tasks);
			}
			justPressed = true;
		} else if (justPressed) {
			for (i = 0; i < tasks.length; i++) {
				tasks[i].completed = false;
				localStorage.tasks = JSON.stringify(tasks);
			}
			justPressed = false;
		}
		updateUI();
	}
});

$('#trashAll').click(function() {
	if (localStorage.tasks) {
		undo('store');
		justPressed = false;
		var tasks = JSON.parse(localStorage.tasks);
		for (i = tasks.length - 1; i > -1; i--) {
			if (tasks[i].completed) {
				tasks.splice(i,1);
				localStorage.tasks = JSON.stringify(tasks);
				updateUI();
			}
		}
	}
});

$('.undo').click(function() {
	undo('undo');
	$('.undo').css({
		'display': 'none'
	});
	justPressed = !justPressed;
});

$('#scrollTop').click(function() {
	$('body').animate({scrollTop:0}, 'slow', 'swing');
});

$(document).scroll(function() {
	if ($(this).scrollTop() > 90) {
		$('.insertBox').css({
			'position': 'fixed',
			'top': 0,
			'left': 0,
			'right': 0,
			'background': 'rgba(144,238,144,0.75)'
		});
		$('.tasks').css({
			'margin-top': 95
		});
		$('#scrollTop').css({
			'display': 'block'
		});
		$('.insertBox').addClass('testforiphone');
	} else {
		$('.insertBox').css({
			'position': 'static',
			'background': 'none'
		});
		$('.tasks').css({
			'margin-top': 0
		});
		$('#scrollTop').css({
			'display': 'none'
		});
		$('.insertBox').removeClass('testforiphone');
	}
});
