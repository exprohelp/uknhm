var login_otp = 'N'
$(document).ready(function () {
	var IsMenu = sessionStorage.getItem('IsLogin');
	var userName = sessionStorage.getItem('userName');
	if (IsMenu) {
		$('.login-area user').text(userName);
		LoadMenu();
	}
	$('#txtOTP').prop('disabled', true);
	$('#OTP').hide();
	$('#btnVerify').on('click', function () {
		verifyOtp();
		//window.location.href = window.location.origin + "/uknhm/mis/report/dashboard";
	});
	$('#ddlUserType').on('change', function () {
		var userType = $(this).find('option:selected').text();
		if (userType == "Select User Type")
			$('.info').addClass('input');
		else
			$('.info').removeClass('input');

		if (userType == "NHM") {
			$('#OTP').show();
			$('#Login').toggleClass('col-md-6');
			$('#Login').css({ 'display': 'flex', 'width': 'auto' });
		}
		else {
			$('#OTP').hide();
			$('#Login').removeAttr('style');
			$('#Login').removeClass('col-md-6');
		}
	});
});

function PrintTest() {
    var url = "/Invoice/Invoice/PrintInvoice";
    //var url = "/MIS/Print/TestPrint?Name=Nitin&Mobile=9670244590";    
    var InvoiceNo = "INV/UK001/2223/03441-EQAS"; 
    $.ajax({
        url: url,
        type: 'post',
        async: true,
        data: { InvoiceNo: InvoiceNo},
        success: function (data) {
            window.open(url, '_blank');
        },
        error: function (err) {
            alert("fail");//Ajax request fail
            alert(err.responseText);//error will displayed here
        }
    });

}
function authenticate() {
	var UserType = $('#ddlUserType option:selected').text();
	var url = config.baseUrl + "/api/ApplicationResources/Authenticate_LoginInfo";
	var objBO = {};
	objBO.UserType = $('#ddlUserType option:selected').text();
	objBO.UserId = $('#txtUserId').val();
	objBO.Password = $('#txtPassword').val();
	objBO.Prm1 = '-';
	objBO.Logic = "Authenticate";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			if (data.Msg.includes('Success')) {
				$.each(data.ResultSet.Table, function (key, val) {
					sessionStorage.setItem('userId', val.UserId);
					sessionStorage.setItem('userName', val.UserName);
					sessionStorage.setItem('mobileNo', val.mobile_no);
					sessionStorage.setItem('userType', val.UserType);
				});
				sessionStorage.setItem('IsLogin', true);
				sessionStorage.setItem('LoadMenu', JSON.stringify(data));
				if (UserType == 'Chandan') {
					window.location.href = config.rootUrl + '/MIS/Report/Dashboard'
				}
				else {
					$.each(data.ResultSet.Table, function (key, val) {
						login_otp = val.otp_flag;
						GetOtp(val.mobile_no);
					});
				}
			}
			else {
				alert(data.Msg);
			}
		},
		complete: function (response) {
			LoadMenu();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
//User Login
function LoadMenu() {
	$('#menu-list').empty();
	var html = '';
	var MenuInfo = sessionStorage.getItem('LoadMenu');
	var data = JSON.parse(MenuInfo);
	$.each(data.ResultSet.Table1, function (key, val) {
		html += "<li><a href='" + config.rootUrl + '/' + val.menu_link + "'>" + val.menu_name + "</a></li>";
	});
	$('#menu-list').append(html);
}
//Stop Loading
function stopLoading() {
	$('#btnLogin i').remove();
}

//SMS
function GetOtp(mobile) {
	//GetOtp
	console.log(mobile)
	if (mobile != "" || mobile != null) {
		if (mobile.length == 10) {
			$.ajax({
				method: "POST",
				url: config.baseUrl + '/api/ApplicationResources/GetOtp',
				data: {},
				contentType: "application/json;charset=utf-8",
				dataType: "JSON",
				success: function (data) {
					console.log(data)
					if (data.length == '6') {
						$("#hidgetotp").val(data);
						if (login_otp == 'Y')
							$("#txtOTP").val(data);
						else
							SendSMS(mobile, data);

						$('#txtOTP').prop('disabled', false);

					}
					else {
						alert(data);
					}
				},
				error: function (response) {
					alert('Server Error...!');
				}
			});
		}
		else {
			alert('mobile number should be 10 digit');
			return false;
		}
	}
	else {
		alert('Please enter mobile number');
		return false;
	}
}

function verifyOtp() {
	var otpval = $("#hidgetotp").val();
	if (otpval != "") {
		if ($("#hidgetotp").val() == $("#txtOTP").val()) {
			$("#hidgetotp").val('');
			window.location.href = config.rootUrl + "/mis/report/dashboard";
		}
		else {
			alert('OTP does not match');
			$("#txtOTP").val('');
			return false;
		}
	}
	else {
		alert('Otp not found');
		return false;
	}
}

function SendSMS(mobileno, otp) {
	objBO = {};
	objBO.MobileNo = mobileno;
	objBO.Otp = otp;
	$.ajax({
		method: "POST",
		url: config.baseUrl + '/api/ApplicationResources/AuthenticateUserLoginOTP',
		data: JSON.stringify(objBO),
		//data: { 'mobile': mobileno, 'otp': otp },
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
            if (data.includes('Sent')) {
                alert('OTP sent successfully.');
                $("#txtOTP").val('').focus();
            }			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

function OTPTesting() {
    var objBO = {};
    objBO.MobileNo = $('#txtUserId').val();
    objBO.Otp = $('#txtPassword').val();
    $.ajax({
        method: "POST",
        url: config.baseUrl + '/api/MobileApp/OTPTesting',
        data: JSON.stringify(objBO),       
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data)
            if (data.includes('Sent')) {
                alert('OTP sent successfully.');               
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}