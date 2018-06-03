$(document).ready(function(){
	$('.login-register .login').click(function(){
		$('.login-box').removeClass('hide');
		$('.register-box').addClass('hide');
	});

	$('.login-register .register').click(function(){
		$('.login-box').addClass('hide');
		$('.register-box').removeClass('hide');
	});
});

