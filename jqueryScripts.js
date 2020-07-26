$(document).ready(function() {
    $('#menu').load('../../menu.htm');
	$('#footer').load('../../footer.htm');
	$('#cookies').load('../../cookies.htm',null,function(){ doSetUp(); });
});