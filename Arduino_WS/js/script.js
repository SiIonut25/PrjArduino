var pageUrl = "";
var pathName = "";

var divMiddleContainer = null;
var selectedLedInterval = null;

$(document).ready(function(){
	console.log("ready");
	
	divMiddleContainer = $("#divMiddleContainer");
	
	
	AddAdditionalHtml();
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
	
	setInterval(function(){ GetTempData(); }, 15000);
});

function BindLedPage(){
	divMiddleContainer.show();
	divMiddleContainer.html("<div class='c-header'></div><div class='c-levels'></div><div class='c-buttons'></div>");
	for(index = 0; index < 96; index++){
		divMiddleContainer.find(".c-levels").append("<input type='text' id='led_" + index + "' />");
	}
	var ledNr = 0;
	if(pathName == "/led1"){
		ledNr = 1;
		divMiddleContainer.find(".c-header").html("Channel 1 Settings - SUMP");
		GetLedData(ledNr);
	}
	else if(pathName == "/led2"){
		ledNr = 2;
		divMiddleContainer.find(".c-header").html("Channel 2 Settings - Color: BLUE");
		GetLedData(ledNr);
	}
	else if(pathName == "/led3"){
		ledNr = 3;
		divMiddleContainer.find(".c-header").html("Channel 3 Settings - Color: WHITE");
		GetLedData(ledNr);
	}
	else if(pathName == "/led4"){
		ledNr = 4;
		divMiddleContainer.find(".c-header").html("Channel 4 Settings - Color: ROYAL BLUE");
		GetLedData(ledNr);
	}
	else if(pathName == "/led5"){
		ledNr = 5;
		divMiddleContainer.find(".c-header").html("Channel 5 Settings - Color: RED");
		GetLedData(ledNr);
	}
	else if(pathName == "/led6"){
		ledNr = 6;
		divMiddleContainer.find(".c-header").html("Channel 6 Settings - Color: UV");
		GetLedData(ledNr);
	}
	
	if($.cookie('authkey')){
		divMiddleContainer.find(".c-levels input").prop("disabled", false);
		divMiddleContainer.find(".c-buttons").html('<button type="button" id="btnUpdateLed" led="' + ledNr + '" class="btn btn-primary">Update</button>');
		//divMiddleContainer.find(".c-buttons").html('<button type="button" class="btn btn-secondary"></button>');
		
		$("#btnUpdateLed").click(function(){
			var ledValues = "";
			for(index = 0; index < 96; index++){
				ledValues += $("#led_" + index).val();
				if(index < 95){
					ledValues += "#";
				}
			}
			UpdateLedChannel($(this).attr("led"), ledValues);
		});
	}
	else {
		divMiddleContainer.find(".c-levels input").prop("disabled", true);
	}
	
	$("#divMiddleContainer input").click(function(){
		selectedLedInterval = $(this).attr("id").replace("led_", "")
		$('#modalSlider').modal('show');
		$( "#slider" ).slider({
			value:100,
			min: 0,
			max: 100,
			step: 1,
			slide: function( event, ui ) {
				$("#ledAmount").val(ui.value + " %");
				$("#led_" + selectedLedInterval).val(ui.value + " %");
			}
		});
		$("#ledAmount").val($("#slider").slider("value") + " %");
	});
}

function AddAdditionalHtml(){
	$("#divHeader").html(menuHtml + loginHtml + populSlider);
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
					$("#divTempWater").attr("style", "color:" + jsonResult.waterTempColor + ";");
					$("#divTempWater .temp-color").attr("style", "background-color:" + jsonResult.waterTempColor + ";");
					$("#divTempWater .temp-value").html(jsonResult.tempWater);
					$("#divTempRoom").attr("style", "color:" + jsonResult.roomTempColor + ";");
					$("#divTempRoom .temp-color").attr("style", "background-color:" + jsonResult.roomTempColor + ";");
					$("#divTempRoom .temp-value").html(jsonResult.tempRoom);
					$("#divTempLed").attr("style", "color:" + jsonResult.ledTempColor + ";");
					$("#divTempLed .temp-color").attr("style", "background-color:" + jsonResult.ledTempColor + ";");
					$("#divTempLed .temp-value").html(jsonResult.tempLed);
					
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

function UpdateLedChannel(ledCh, ledValues){
	var data = { authkey: $.cookie('authkey'), channel: ledCh, ledValues: ledValues };
	$.ajax({
		method: "POST",
		url: "/set-led",
		data: data,
		statusCode: {
			401: function(msq) {
                console.log(msq);
            },
            200: function(result) {
				console.log(result);
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


function GetLedData(channel){
	var loginCookie = $.cookie('authkey');
	$.ajax({
		method: "POST",
		url: "/get-led",
		data: { authkey: loginCookie, channel: channel },
		statusCode: {
			401: function(msq) {
                console.log(msq);
            },
            200: function(result) {
				var jsonResult = jQuery.parseJSON(result);
				for(ind = 1; ind < 97; ind++){
					$("#led_" + (ind - 1)).val(jsonResult[ind]);
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
	
	var populSlider = '<div class="modal fade" id="modalSlider" tabindex="-1" role="dialog" aria-labelledby="mySliderLabel" aria-hidden="true" style="display:none">\
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
						<div id="slider"></div>\
						<label data-error="wrong" data-success="right" for="defaultForm-email" id="lblLedChannel">Led channel</label>\
						<input type="text" id="ledAmount" readonly style="border:0; color:#f6931f; font-weight:bold;">\
					</div>\
				</div>\
				<div class="modal-footer d-flex justify-content-center">\
					<button class="btn btn-default" id="btnLogin">Save</button>\
				</div>\
			</div>\
		</div>\
	</div>';
	
	