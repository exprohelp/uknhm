
$(document).ready(function () {
	GetUserInfo('GetMobileAppUserInfo');
	GetCentreMaster();
});


function GetChandanEmpInfo() {
	if ($('#txtUserId').val() == '') {
		alert('Please Provide User Id');
		return;
	}
	$('#txtUserName').val('');
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = $('#txtUserId').val();
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetChandanEmpInfo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = '';
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						$('#txtUserName').val(val.emp_name);
					});
				}
				else {
					alert('Record Not Found.');
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
			$("#ddlCentre").empty().append($('<option></option>').val('ALL').html('Select')).change();
			$.each(data.ResultSet.Table, function (key, val) {
				$("#ddlCentre").append($('<option></option>').val(val.centreId).html(val.centre_name));
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetUserInfo(logic) {
	$('#tblUserInfo tbody').empty();
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = $("#ddlCentre option:selected").val();
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = logic;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = '';
			var temp = '';
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						if (temp != val.centre_name) {
							tbody += "<tr style='background:#cbe7ff'>";
							tbody += "<td colspan='4'>" + val.centre_name + "</td>";
							tbody += "</tr>";
							temp = val.centre_name;
						}
						tbody += "<tr>";
						tbody += "<td>" + val.UserId + "</td>";
						tbody += "<td>" + val.emp_name + "</td>";
						tbody += "<td>" + val.centre_name + "</td>";
						tbody += "<td><button id='btnDelete' onclick=DeleteMobileAppUser('" + val.UserId + "') class='btn-danger'><i class='fa fa-trash'></i></button></td>";
						tbody += "</tr>";
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
		objBO.CenterId = $('#ddlCentre option:selected').val();
		objBO.UserId = $('#txtUserId').val();
		objBO.login_id = Active.userId;
		objBO.Logic = "InsertMobileAppUser";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					alert(data);
					GetUserInfo();
					$('#txtUserId').val('');
					$('#txtUserName').val('');
					$('#ddlCentre').prop('selectedIndex', '0').change();
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
function DeleteMobileAppUser(UserId) {
	if (confirm('Are you sure to Delete This User?')) {
		var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
		var objBO = {};
		objBO.UserId = UserId;
		objBO.Logic = "DeleteMobileAppUser";
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('Success')) {
					GetUserInfo();
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
function Validation() {
	var Centre = $('#ddlCentre option:selected').text();
	var UserId = $('#txtUserId').val();
	var UserName = $('#txtUserName').val();

	if (Centre == 'Select') {
		alert('Please Select Centre');
		$('#ddlCentre').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#ddlCentre').removeAttr('style');
	}
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
	return true;
}
