var _mobileNo = '';
var _userId = '';
$(document).ready(function () {	
	GetUserInfo();
	searchTableh('txtSearch', 'tblUserInfo')
	searchTableh('txtSearch1', 'tblCentre')
	searchTableh('txtSearch2', 'tblAllotedCentre')
	$('#btnAutoGen').on('click', function () {
		AutoGenUserId();	
	});
    $('#tblUserInfo tbody').on('click', 'button[id=btnGetInfo]', function () {
        selectRow($(this));
        var userId = $(this).closest('tr').find('td:eq(1)').text();
        var userName = $(this).closest('tr').find('td:eq(2)').text();
        var mobileNo = $(this).closest('tr').find('td:eq(5)').text();
        $('#txtUserInfo').text(userName);
        _mobileNo = mobileNo;
        //GetCentreMaster();
        GetAllotedCentre(userId);
        $('#modalCentreAllot').modal('show');
    });
	$('#tblUserInfo tbody').on('click', 'button[id=btnGetInfoForEdit]', function () {
		selectRow($(this));
		var userId = $(this).closest('tr').find('td:eq(1)').text();
		var userName = $(this).closest('tr').find('td:eq(2)').text();
		var mobileNo = $(this).closest('tr').find('td:eq(5)').text();
        var designation = $(this).closest('tr').find('td:eq(6)').text();
        _userId = userId;
        $('#txtUserId').val(userId);
        $('#txtUserName').val(userName);
        $('#txtMobileNo').val(mobileNo);
        $('#txtDesignation').val(designation);
        $('#btnSubmit').text('Update');		
	});

	$('#tblCentre').on('click', 'button', function () {
		var centreid = $(this).data('centreid');
		AllotCentreToUser(centreid);
	});
	$('#tblAllotedCentre').on('click', 'button', function () {
		var centreid = $(this).data('centreid');
		unAllotCentreToUser(centreid);
	});
	$('table thead').on('click', 'input[type=checkbox]', function () {
		var isCheck = $(this).is(':checked');
		if (isCheck) {
			$(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', true);
		}
		else {
			$(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', false);
		}
	});
});


function AutoGenUserId() {
	$('#txtUserId').val('');
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "AutoGenUserId";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
                        $('#txtUserId').val(val.UserId);                    
                        $('#txtUserName').val('');
                        $('#txtMobileNo').val('');
                        $('#txtDesignation').val('');
                        $('#btnSubmit').text('Submit')
					});
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetCentreMaster() {
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetCentreMaster";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#tblCentre tbody").empty();
			var tbody = '';
			var AllotedCentres = [];
			$("#tblAllotedCentre tbody tr").each(function () {
				AllotedCentres.push($(this).find('td:eq(1)').text())
			});
			$.each(data.ResultSet.Table, function (key, val) {
				if (!($.inArray(val.centreId, AllotedCentres) > -1)) {
					tbody += "<tr>";
					tbody += "<td style='display:none'><input type='checkbox' checked/></td>";
					tbody += "<td style='display:none'>" + val.centreId + "</td>";
					tbody += "<td>" + val.centre_name + "</td>";
					tbody += "<td>" + val.districtName + "</td>";
					tbody += "<td><button class='btn-success btn-go btn-xs' data-centreid=" + val.centreId + ">Allot</button></td>";
					tbody += "</tr>";
				}
			});
			$("#tblCentre tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetAllotedCentre(userId) {
	$('#btnSendLink').prop('disabled',true);
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = userId;
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetCentreAllotedToUser";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#tblAllotedCentre tbody").empty();
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				$('#btnSendLink').prop('disabled', false);
				tbody += "<tr>";
				tbody += "<td style='display:none'><input type='checkbox'/></td>";
				tbody += "<td style='display:none'>" + val.centreId + "</td>";
				tbody += "<td>" + val.centre_name + "</td>";
				tbody += "<td>" + val.districtName + "</td>";
				tbody += "<td><button class='btn-danger btn-go btn-xs' data-centreid=" + val.centreId + ">Delete</button></td>";
				tbody += "</tr>";
			});
			$("#tblAllotedCentre tbody").append(tbody);
		},
		complete: function () {
			GetCentreMaster();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetUserInfo() {
	$('#tblUserInfo tbody').empty();
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetUserInfo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = '';
			var temp = '';
			console.log(data)
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						if (val.UserType == 'NHM') {
							tbody += "<tr>";
							tbody += "<td><button id='btnGetInfo' class='btn-go btn-danger btn-xs'><i class='fa fa-sign-in'></i></button></td>";
							tbody += "<td>" + val.UserId + "</td>";
							tbody += "<td>" + val.UserName + "</td>";
                            tbody += "<td><button id='btnGetInfoForEdit' class='btn btn-warning btn-xs' style='margin:3px 0;color:#000'>" + val.mobile_no + "</button></td>";
							tbody += "<td style='display:none'>" + val.UserType + "</td>";
                            tbody += "<td style='display:none'>" + val.mobile_no + "</td>";
                            tbody += "<td style='display:none'>" + val.designation + "</td>";
							//tbody += "<td><button onclick=SendPwdChange('" + val.mobile_no + "') class='btn-warning btn-xs btn-go'><i class='fa fa-envelope-square'></i></button></td>";
							tbody += "</tr>";
						}
					});
					$('#tblUserInfo tbody').append(tbody);
				}
			}
		},
		error: function (response) { 
			alert('Server Error...!');
		}
	});
}
function InsertUser() {
	if (Validation()) {
		var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
		var objBO = {};
		objBO.UserType = 'NHM';
		objBO.UserId = $('#txtUserId').val();
		objBO.UserName = $('#txtUserName').val();
		objBO.MobileNo = $('#txtMobileNo').val();
		objBO.Prm1 = $('#txtDesignation').val();
		objBO.Prm2 = '-';
		objBO.login_id = query()['LoginId'];
        objBO.Logic = ($('#btnSubmit').text() == 'Submit') ? "InsertUserInfo" :'UpdateNHMUserInfo';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					AllotRoleToUser(objBO.UserId);
					alert(data);
					GetUserInfo();
					$('#txtUserId').val('');
					$('#txtUserName').val('');
					$('#txtMobileNo').val('');
                    $('#txtDesignation').val('');
                    $('#btnSubmit').text('Submit')
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
}
function AllotRoleToUser(UserId) {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.UserType = '-';
	objBO.UserId = UserId;
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = 'RL009';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "AllotRoleToUser";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function AllotCentreToUser(centreId) {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.UserType = '-';
	objBO.UserId = $('#tblUserInfo tbody tr.select-row').find('td:eq(1)').text();;
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = centreId;
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "AllotCentreToUser";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				//alert(data);
				GetAllotedCentre(objBO.UserId);
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
function unAllotCentreToUser(roleId) {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.UserType = '-';
	objBO.UserId = $('#tblUserInfo tbody tr.select-row').find('td:eq(1)').text();;
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = roleId;
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "unAllotCentreToUser";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				//alert(data);
				GetAllotedCentre(objBO.UserId);
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
function Validation() {
	var UserType = $('#ddlUserType option:selected').text();
	var UserId = $('#txtUserId').val();
	var UserName = $('#txtUserName').val();
	var MobileNo = $('#txtMobileNo').val();
	if (UserId == '') {
		alert('Please Provide User-Id.');
		$('#txtUserId').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtUserId').removeAttr('style');
	}
	if (UserName == '') {
		alert('Please Provide User Name');
		$('#txtUserName').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtUserName').removeAttr('style');
	}
	if (MobileNo == '') {
		alert('Please Provide Mobile No');
		$('#txtMobileNo').css('border-color', 'red').focus();
		return false;
	} else if (MobileNo.length < 10) {
		alert('Mobile No Should be 10 Digit.');
		$('#txtMobileNo').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtMobileNo').removeAttr('style');
	}
	return true;
}
//Send SMS
function SendPwdChange() {
	if (confirm('Are You Sure to Send Change Password Link?')) {
		objBO = {};		
		objBO.MobileNo = _mobileNo;
		objBO.Otp = 1234;//not in use
		$.ajax({
			method: "POST",
			url: config.baseUrl + '/api/ApplicationResources/PasswordChangeSMS',
			data: JSON.stringify(objBO),
			//data: { 'mobile': mobileno, 'otp': otp },
			contentType: "application/json;charset=utf-8",
			dataType: "JSON",
			success: function (data) {
				console.log(data)
				if (data.includes('Sent'))
					alert('Link sent successfully.');
				else
					alert('Link sending Failed.');
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}