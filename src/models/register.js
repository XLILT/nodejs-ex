$(document).ready(function(){
	$('.register-box form').submit(function(){
		$.ajax({
			type: 'POST',
			contentType: 'application/x-www-form-urlencoded',
			url: '/register',
			data: encrypt_register_form($(this)),
			dataType: 'text',
			async: false,
			success: function(data){
				var data_obj = JSON.parse(data);
				if(data_obj.result === 0){
					$('.register-box .register-result span').html("恭喜你，注册成功!请前往登陆。");
				}
				else {
					$('.register-box .register-result span').html("抱歉，注册失败!");
					console.log(data);
				}
			},
			error: function(){
				$('.register-box .register-result span').html("抱歉，注册失败!");
				console.error("ajax error");
			}
		});

		return false;
	});
});

function encrypt_register_form(form) {
	var form_arr = form.serializeArray();
	form_arr.forEach(function(data) {
		if(data.name === "passwd") {
			data.value = $.md5(data.value);
		}
	});

	var ret_str = $.param(form_arr);
    //var ret_str = JSON.stringify(form_arr);
	return ret_str;
}
