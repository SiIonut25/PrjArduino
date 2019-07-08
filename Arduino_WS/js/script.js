$(document).ready(function(){
	console.log("ready");
	AddBootstrapMenu();
	TryAutoLogin();
});

function AddBootstrapMenu(){
	$("#divHeader").html(menuHtml + loginHtml);
	$("#btnLogin").click(function(){
		var data = { username: userName, password: userPass };
		TryLogin("/login", data);
	});
}

function TryLogin(url, data){
	$.ajax({
		method: "POST",
		url: url,
		data: data,
		statusCode: {
            400: function(msq) {
                console.log(msq);
			},
			401: function(msq) {
                console.log(msq);
            },
            200: function(authkey) {
				console.log("authkey: " + authkey);
				$.cookie('authkey', authkey);
				$('#modalLoginForm').modal('hide');
				$("#liWelcome").show();
            }
        },
        success: function() {
            console.log("success");
        },
        error: function(e) {
            alert(e);
        }
	  });
}

function TryAutoLogin(){
	var loginCookie = $.cookie('authkey');
	var data = { authkey: authkey };
	TryLogin("/cookie-login", data);
}



var menuHtml = '<nav class="navbar navbar-expand-lg navbar-light bg-light">\
	<a class="navbar-brand" href="#">Meniu</a>\
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
	  <span class="navbar-toggler-icon"></span>\
	</button>\
  	<div class="collapse navbar-collapse" id="navbarSupportedContent">\
	  <ul class="navbar-nav mr-auto">\
	  <li class="dropdown" id="liWelcome" style="display:none;">\
            <a href="#" class="nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown" aria-expanded="false"> \
                Welcome, User <b class="caret"></b>\
            </a>\
            <div class="dropdown-menu dropdown-menu-right position-absolute" aria-labelledby="navbarDropdown">\
				<a class="dropdown-item" href="#">Logout</a>\
				<div class="dropdown-divider"></div>\
                <a class="dropdown-item" href="#">Another action</a>\
                <a class="dropdown-item" href="#">Something else here</a>\
            </div>\
        </li>\
		<li class="nav-item active">\
		  <a class="nav-link" href="/">Acasa<span class="sr-only">(current)</span></a>\
		</li>\
		<li class="nav-item">\
		  <a class="nav-link" href="" data-toggle="modal" data-target="#modalLoginForm">Login</a>\
		</li>\
		<li class="nav-item dropdown">\
		  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
			Dropdown\
		  </a>\
		  <div class="dropdown-menu" aria-labelledby="navbarDropdown">\
			<a class="dropdown-item" href="#">Action</a>\
			<a class="dropdown-item" href="#">Another action</a>\
			<div class="dropdown-divider"></div>\
			<a class="dropdown-item" href="#">Something else here</a>\
		  </div>\
		</li>\
		<li class="nav-item">\
		  <a class="nav-link disabled" href="#">Disabled</a>\
		</li>\
	  </ul>\
	</div>\
  </nav>';

  var loginHtml = '<div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
		<div class="modal-dialog" role="document">\
			<div class="modal-content">\
			<div class="modal-header text-center">\
				<h4 class="modal-title w-100 font-weight-bold">Sign in</h4>\
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
				<span aria-hidden="true">&times;</span>\
				</button>\
			</div>\
			<div class="modal-body mx-3">\
				<div class="md-form mb-5">\
				<i class="fas fa-envelope prefix grey-text"></i>\
				<input type="email" id="defaultForm-email" class="form-control validate">\
				<label data-error="wrong" data-success="right" for="defaultForm-email">Your email</label>\
				</div>\
				<div class="md-form mb-4">\
				<i class="fas fa-lock prefix grey-text"></i>\
				<input type="password" id="defaultForm-pass" class="form-control validate">\
				<label data-error="wrong" data-success="right" for="defaultForm-pass">Your password</label>\
				</div>\
			</div>\
			<div class="modal-footer d-flex justify-content-center">\
				<button class="btn btn-default" id="btnLogin">Login</button>\
			</div>\
			</div>\
		</div>\
	</div>';