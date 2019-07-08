$(document).ready(function(){
	console.log("ready");
	AddBootstrapMenu();
});

function AddBootstrapMenu(){
	$("#divHeader").html(menuHtml + loginHtml);
	$("#btnLogin").click(function(){
		TryLogin();
	});
}

function TryLogin(){
	$.ajax({
		method: "POST",
		url: "/login",
		data: { username: $("#defaultForm-email").val(), password: $("#defaultForm-pass").val() },
		statusCode: {
            400: function(msq) {
                console.log(msq);
			},
			401: function(msq) {
                console.log(msq);
            },
            200: function(response) {
                console.log(response);
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



var menuHtml = '<nav class="navbar navbar-expand-lg navbar-light bg-light">\
	<a class="navbar-brand" href="#">Meniu</a>\
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\
	  <span class="navbar-toggler-icon"></span>\
	</button>\
  	<div class="collapse navbar-collapse" id="navbarSupportedContent">\
	  <ul class="navbar-nav mr-auto">\
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
	  <form class="form-inline my-2 my-lg-0">\
		<input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">\
		<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>\
	  </form>\
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