function getUrlVars(param) {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
  return vars[param];
}

function errorMessage(msg) {
	swal({
		title: "Oops...",
		text: "Something went wrong!<br>Reason: " + msg,
		confirmButtonColor: "#EF5350",
		html: true,
		type: "error"
	});	
}

function getFromJson(elem) {
	if (elem == null || elem == undefined) {
		return '<i>N/A</i>';
	}
	return (elem);
}

function isScrolledIntoView(elem)
{
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom < docViewBottom) && (elemTop > docViewTop));
}

/* SETTINGS MENU LOGIC */

function initMenu(tour) {
	if (!tour)
		throw Exception('Invalid Tour provided !', false);

	$('#resetTipsButton').click(function() {
		localStorage.setItem('powerci_tips', 'yes');
	});

	$('#resetTourButton').click(function() {
		localStorage.removeItem('tour_end');
		localStorage.removeItem('tour_current_step');
		tour.start();
	});

	$('#resetAllButton').click(function() {
		localStorage.removeItem('tour_end');
		localStorage.removeItem('tour_current_step');
		localStorage.setItem('powerci_tips', 'yes');
		//tour.start();
	});
}

function showTips(elem) {
	if (localStorage.getItem('powerci_tips') == "yes" || localStorage.getItem('powerci_tips') == null) {
		$(elem).show();
	} else {
		$(elem).hide();
	}
}

/* SETTINGS MENU LOGIC */