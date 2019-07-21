var pageUrl = "";
var pathName = "";

var divMiddleContainer = null;

$(document).ready(function(){
	console.log("ready");
	
	divMiddleContainer = $("#divMiddleContainer");
	
	
	AddBootstrapMenu();
	TryAutoLogin();
	
	//get page url
	pageUrl = $(location).attr('href');
	pathName = window.location.pathname.toLowerCase();
	if(pageUrl){
		pageUrl = pageUrl.toLowerCase();
		if (pageUrl.indexOf("/led1") > 0 || pageUrl.indexOf("/led2") > 0 || pageUrl.indexOf("/led3") > 0 || 
				pageUrl.indexOf("/led4") > 0 || pageUrl.indexOf("/led5") > 0 || pageUrl.indexOf("/led6") > 0){
			$("#divMiddleContainer").show();
			BindLedPage();
		}
	}
	
	GetTempData();
	
	setInterval(function(){ GetTempData(); }, 30000);
});

function BindLedPage(){
	divMiddleContainer.show();
	divMiddleContainer.html("<div class='c-header'></div><div class='c-levels'></div>");
	for(index = 0; index < 96; index++){
		divMiddleContainer.find(".c-levels").append("<input type='text' id='led_" + index + "' />");
	}
	
	if(pathName == "/led1"){
		divMiddleContainer.find(".c-header").html("Channel 1 Settings - Color: Cool White");
	}
}

function AddBootstrapMenu(){
	$("#divHeader").html(menuHtml + loginHtml);
	$("#btnLogin").click(function(){
		var userName = $("#defaultForm-email").val();
		var userPass = $("#defaultForm-pass").val();
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
				$("#liLogin").show();
				$("#liLogout").hide();
			},
			401: function(msq) {
                console.log(msq);
				$("#liLogin").show();
				$("#liLogout").hide();
            },
            200: function(authkey) {
				console.log("authkey: " + authkey);
				$.cookie('authkey', authkey);
				$('#modalLoginForm').modal('hide');
				$("#liWelcome").show();
				$("#divLedSettings").show();
				$("#liLogin").hide();
				$("#liLogout").show();
            }
        },
        success: function() {
            console.log("success");
        },
        error: function(e) {
            console.log(e.responseText);
			$("#liLogin").show();
			$("#liLogout").hide();
        }
	  });
}

function TryAutoLogin(){
	var loginCookie = $.cookie('authkey');
	var data = { authkey: loginCookie };
	TryLogin("/cookie-login", data);
}

function GetTempData(){
	$.ajax({
		method: "POST",
		url: "/get-temp",
		//data: data,
		statusCode: {
			401: function(msq) {
                console.log(msq);
            },
            200: function(result) {
				var jsonResult = jQuery.parseJSON(result);
				
				if($("#divTempWater").length == 0){
					var strHtml = "<div id='divTempWater' class='row m-t-2 p-1 font-weight-bold' style='color:" + jsonResult.waterTempColor + "'>";
					strHtml += "<div class='col-7'>Temperatura apa:</div>";
					strHtml += "<div class='col-3 temp-value'>" + jsonResult.tempWater + "</div>";
					strHtml += "<div class='col-1 temp-color' style='background-color:" + jsonResult.waterTempColor + "'>&nbsp;</div>";
					strHtml += "</div>";
					strHtml += "<div id='divTempRoom' class='row m-t-2 p-1 font-weight-bold' style='color:" + jsonResult.roomTempColor + "'>";
					strHtml += "<div class='col-7'>Temperatura apa:</div>";
					strHtml += "<div class='col-3 temp-value'>" + jsonResult.tempRoom + "</div>";
					strHtml += "<div class='col-1 temp-color' style='background-color:" + jsonResult.roomTempColor + "'>&nbsp;</div>";
					strHtml += "</div>";
					strHtml += "<div id='divTempLed' class='row m-t-2 p-1 font-weight-bold' style='color:" + jsonResult.ledTempColor + "'>";
					strHtml += "<div class='col-7'>Temperatura apa:</div>";
					strHtml += "<div class='col-3 temp-value'>" + jsonResult.tempLed + "</div>";
					strHtml += "<div class='col-1 temp-color' style='background-color:" + jsonResult.ledTempColor + "'>&nbsp;</div>";
					strHtml += "</div>";
					
					$("#divTopContainer").append(strHtml);
				}
				else{
					//replace values
				}
            }
        },
        success: function() {
            console.log("success");
        },
        error: function(e) {
            console.log(e.responseText);
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
		<li class="nav-item" id="liLogin" style="display:none;">\
		  <a class="nav-link" href="" data-toggle="modal" data-target="#modalLoginForm">Login</a>\
		</li>\
		<li class="nav-item" id="liLogout">\
		  <a class="nav-link" href="">Logout</a>\
		</li>\
		<li class="nav-item dropdown" id="divLedSettings" style="display:none;">\
		  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
			LED\
		  </a>\
		  <div class="dropdown-menu" aria-labelledby="navbarDropdown">\
			<a class="dropdown-item" href="/led1">Channel 1</a>\
			<a class="dropdown-item" href="/led2">Channel 2</a>\
			<a class="dropdown-item" href="/led3">Channel 3</a>\
			<a class="dropdown-item" href="/led4">Channel 4</a>\
			<a class="dropdown-item" href="/led5">Channel 5</a>\
			<a class="dropdown-item" href="/led6">Channel 6</a>\
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