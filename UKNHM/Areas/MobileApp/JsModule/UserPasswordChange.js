var _userId = '';
$(document).ready(function () {
	$('input:text').attr('autocomplete', 'off');
	var mobileNo = query()['MNo'];
	PatientInfo(mobileNo);
});

function PatientInfo(mobileNo) {
	$("#txtUserId").text('');
	$("#txtMobileNo").text('');
	$("#txtUserName").text('');
	var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = mobileNo;
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = '-'
	objBO.Logic = "PatientInfoByMobile";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					$("#txtUserId").text(val.UserId);
				   _userId= val.UserId;
					$("#txtMobileNo").text(val.mobile_no);
					$("#txtUserName").text(val.UserName);
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ChangePassword() {
	if ($('#txtPassword').val() == '') {
		alert('Please Provide Password');
		return;
	}
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.UserType = '-';
	objBO.UserId = $('#txtUserId').text();
	objBO.Pwd = $('#txtPassword').val();
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = _userId
	objBO.Logic = "ChangePassword";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data);
				$('#txtPassword').val('');
				$('#divFormBody').addClass('Inactive');
				$("#txtOTP").prop('disabled', true);
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
//SMS
function GetOtp() {
	//GetOtp
	var mobile = $("#txtMobileNo").text();
	if (mobile != "" || mobile != null) {
		if (mobile.length == 10) {
			$.ajax({
				method: "POST",
				url: config.baseUrl + '/api/MobileApp/GetOtp',
				data: {},
				contentType: "application/json;charset=utf-8",
				dataType: "JSON",
				success: function (data) {
					if (data.length == '4') {
						$("#hidgetotp").val(data);
						SendSMS(mobile, data);
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
			$("#divFormBody").removeClass('Inactive');
			alert('Your mobile validate successfully');
			$("#txtMobileNo").prop('disabled', true);
			$("#hidgetotp").val('');
			$("#txtOTP").val('');
			$("#txtPassword").val('').focus();
		}
		else {
			alert('OTP does not match');
			$("#txtMobileNo").prop('disabled', false);
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
		url: config.baseUrl + '/api/MobileApp/SendSMS',
		data: JSON.stringify(objBO),
		//data: { 'mobile': mobileno, 'otp': otp },
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			if (data.includes('Sent')) {
				alert('OTP sent successfully.');
				$("#txtOTP").css('border-color', 'green').focus();
				$("#txtOTP").prop('disabled', false);
			}				
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}