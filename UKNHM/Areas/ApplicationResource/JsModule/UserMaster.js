var _mobileNo = '';
$(document).ready(function () {	
	$('.panel-group').on('hidden.bs.collapse', toggleIcon);
	$('.panel-group').on('shown.bs.collapse', toggleIcon);
	GetUserInfo();
	searchTableh('txtSearch','tblUserInfo')
	searchTableh('txtSearch1','tblCentre')
	searchTableh('txtSearch2','tblAllotedCentre')
	$('#ddlUserType').on('change', function () {
		$('#txtUserId').val('');
		$('#txtUserName').val('');
		$('#txtMobileNo').val('');
		$('#txtDesignation').val('');
		var val = $(this).find('option:selected').text();
		if (val == 'Chandan') {
			$('#txtUserId').prop('disabled', false);
			$('#btnAutoGen').text('Get Emp');
		}
		else {
			$('#txtUserId').prop('disabled', true);
			$('#btnAutoGen').text('Auto Gen');
		}
	});
	$('#btnAutoGen').on('click', function () {
		var val = $(this).text();
		if (val == 'Auto Gen') {
			AutoGenUserId();
		}
		else {
			GetChandanEmpInfo();
		}
	});
	$('#tblUserInfo tbody').on('click', '.switch', function () {
		isCheck = $(this).find('input[type=checkbox]').is(':checked');
		var userid = $(this).find('input[type=checkbox]').data('userid');
		var val = $(this).find('input[type=checkbox]').data('isactive');
		if (isCheck) {
			if (val == '1') {
				UpdateStatus(userid, 0);
			}
			else {
				UpdateStatus(userid, 1);
			}
		}
	});
	$('#tblUserInfo tbody').on('click', 'button[id=btnGetInfo]', function () {
		selectRow($(this));
		var userId = $(this).closest('tr').find('td:eq(1)').text();
		var userName = $(this).closest('tr').find('td:eq(2)').text();
		var userFor = $(this).closest('tr').find('td:eq(4)').text();
		var mobileNo = $(this).closest('tr').find('td:eq(3)').text();
		$('#txtUserInfo').text(' : ' + userName.concat('-', userId));
		_mobileNo = mobileNo;
		AllotedRoles(userId);
		GetRoleMaster(userFor);
		//GetCentreMaster();
		GetAllotedCentre(userId);
		if (userFor == 'NHM')
			$('#btnSendLink').show();
		else
			$('#btnSendLink').hide();
	});
	$('#AccordionRole').on('click', '.more-less', function () {
		var roleId = $(this).data('roleid');
		GetMenuByRole(roleId, '#tblRole' + roleId);
	});
	$('#AccordionAllotedRole').on('click', '.more-less', function () {
		var roleId = $(this).data('roleid');
		GetMenuByRole(roleId, '#tblAlloted' + roleId);
	});
	$('#AccordionAllotedRole').on('click', '.assign', function () {
		var roleId = $(this).data('roleid');
		unAllotRoleToUser(roleId);
	});
	$('#AccordionRole').on('click', '.assign', function () {
		var roleId = $(this).data('roleid');
		AllotRoleToUser(roleId);
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

function toggleIcon(e) {
	$(e.target)
		.prev('.panel-heading')
		.find(".more-less")
		.toggleClass('glyphicon-plus glyphicon-minus');
}
function GetChandanEmpInfo() {
	if ($('#txtUserId').val() == '') {
		alert('Please Provide User Id');
		return;
	}
	$('#txtUserName').val('');
	$('#txtMobileNo').val('');
	$('#txtDesignation').val('');
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
						$('#txtMobileNo').val(val.mobile_no);
						$('#txtDesignation').val(val.designation);
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
					});
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetRoleMaster(userFor) {
	$("#AccordionRole").empty();
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.Prm2 = userFor;
	objBO.login_id = Active.userId;
	objBO.Logic = "GetRoleMaster";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var panel = '';
					$.each(data.ResultSet.Table, function (key, val) {
						var roleName = val.RoleName.replace(/\s/g, '');
						panel += '<div class="panel panel-default">';
						panel += '<div class="panel-heading" role="tab" id="headingOne">';
						panel += '<h4 class="panel-title">';
						panel += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + roleName + '" aria-expanded="true" aria-controls="collapseOne">';
						panel += '<i class="more-less glyphicon glyphicon-plus" data-roleid=' + val.RoleId + '></i>';
						panel += '' + val.RoleName + '';
						panel += '</a>';
						panel += '<button class="assign btn-success btn-go" style="color:#3db13d" data-roleid=' + val.RoleId + '>Allot</button>';
						panel += '</h4>';
						panel += '</div>';
						panel += '<div id="' + roleName + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
						panel += '<div class="panel-body" style="padding:0">';
						panel += '<div class="scroll">';
						panel += '<table class="table table-bordered" id="tblRole' + val.RoleId + '">';
						panel += '<thead>';
						panel += '<tr>';
						panel += '<th style="width: 25%;">Menu Id</th>';
						panel += '<th>Menu Name</th>';
						panel += '</tr>';
						panel += '</thead>';
						panel += '<tbody>';
						panel += '</tbody>';
						panel += '</table>';
						panel += '</div>';
						panel += '</div>';
						panel += '</div></div>';
					});
					$("#AccordionRole").append(panel);
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function AllotedRoles(UserId) {
	$("#AccordionAllotedRole").empty();
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = UserId;
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "RoleAllotedToUser";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var panel = '';
					$.each(data.ResultSet.Table, function (key, val) {
						var roleName = val.RoleName.replace(/\s/g, '');
						panel += '<div class="panel panel-default">';
						panel += '<div class="panel-heading" role="tab" id="headingOne">';
						panel += '<h4 class="panel-title">';
						panel += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#Alloted' + roleName + '" aria-expanded="true" aria-controls="collapseOne">';
						panel += '<i class="more-less glyphicon glyphicon-plus" data-roleid=' + val.RoleId + '></i>';
						panel += '' + val.RoleName + '';
						panel += '</a>';
						panel += '<button class="assign btn-danger btn-go" style="color:#3db13d" data-roleid=' + val.RoleId + '>Delete</button>';
						panel += '</h4>';
						panel += '</div>';
						panel += '<div id="Alloted' + roleName + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
						panel += '<div class="panel-body" style="padding:0">';
						panel += '<div class="scroll">';
						panel += '<table class="table table-bordered" id="tblAlloted' + val.RoleId + '">';
						panel += '<thead>';
						panel += '<tr>';
						panel += '<th style="width: 25%;">Menu Id</th>';
						panel += '<th>Menu Name</th>';
						panel += '</tr>';
						panel += '</thead>';
						panel += '<tbody>';
						panel += '</tbody>';
						panel += '</table>';
						panel += '</div>';
						panel += '</div>';
						panel += '</div></div>';
					});
					$("#AccordionAllotedRole").append(panel);
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetMenuByRole(roleId, tbl) {
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = roleId;
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetMenuByRole";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$(tbl + " tbody").empty();
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				tbody += "<tr>";
				tbody += "<td>" + val.menu_id + "</td>";
				tbody += "<td>" + val.menu_name + "</td>";
				tbody += "</tr>";
			});
			$(tbl + " tbody").append(tbody);
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
					tbody += "<td><input type='checkbox' checked/></td>";
					tbody += "<td style='display:none'>" + val.centreId + "</td>";
					tbody += "<td>" + val.centre_name + "</td>";
					tbody += "<td>" + val.districtName + "</td>";
					tbody += "<td><button class='btn-success btn-go' data-centreid=" + val.centreId + ">Allot</button></td>";
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
				tbody += "<tr>";
				tbody += "<td><input type='checkbox'/></td>";
				tbody += "<td style='display:none'>" + val.centreId + "</td>";
				tbody += "<td>" + val.centre_name + "</td>";
				tbody += "<td>" + val.districtName + "</td>";
				tbody += "<td><button class='btn-danger btn-go' data-centreid=" + val.centreId + ">Delete</button></td>";
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
			//var jsonData = [data.ResultSet.Table[0]];
			//for (var j in Object.keys(data.ResultSet.Table[0])) {
			//	console.log(j);
			//}
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						if (temp != val.UserType) {
							tbody += "<tr style='background:#fbf4d4'>";
							tbody += "<td colspan='5'>" + val.UserType + " User Info</td>";
							tbody += "</tr>";
							temp = val.UserType
						}
						tbody += "<tr>";
						tbody += "<td>";
						tbody += "<label class='switch'>";
						tbody += "<input type='checkbox' data-userid=" + val.UserId + " data-isactive=" + val.IsActive + " class='IsActive' id='chkActive' " + val.checked + ">";
						tbody += "<span class='slider round'></span>";
						tbody += "</label>";
						tbody += "</td>";
						tbody += "<td>" + val.UserId + "</td>";
						tbody += "<td>" + val.UserName + "</td>";
						tbody += "<td>" + val.mobile_no + "</td>";
						tbody += "<td style='display:none'>" + val.UserType + "</td>";
						tbody += "<td><button id='btnGetInfo' class='btn-danger'><i class='fa fa-sign-in'></i></button></td>";
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
		objBO.UserType = $('#ddlUserType option:selected').text();
		objBO.UserId = $('#txtUserId').val();
		objBO.UserName = $('#txtUserName').val();
		objBO.MobileNo = $('#txtMobileNo').val();
		objBO.Prm1 = $('#txtDesignation').val();
		objBO.Prm2 = '-';
		objBO.login_id = Active.userId;
		objBO.Logic = "InsertUserInfo";
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
					$('#txtMobileNo').val('');
					$('#txtDesignation').val('');
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
function AllotRoleToUser(roleId) {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.UserType = '-';
	objBO.UserId = $('#tblUserInfo tbody tr.select-row').find('td:eq(1)').text();;
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = roleId;
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
			if (data.includes('Success')) {
				//alert(data);
				AllotedRoles(objBO.UserId);
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
function unAllotRoleToUser(roleId) {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.UserType = '-';
	objBO.UserId = $('#tblUserInfo tbody tr.select-row').find('td:eq(1)').text();
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = roleId;
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "unAllotRoleToUser";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				//alert(data);
				AllotedRoles(objBO.UserId);
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
function AllotCentreToUserInBulk() {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	var SelectedCentres = [];
	$("#tblCentre tbody").find('input[type=checkbox]:checked').each(function () {
		SelectedCentres.push($(this).closest('tr').find('td:eq(1)').text())
	});
	if (SelectedCentres.length == 0) {
		alert('Please Choose Centre.');
		return
	}
	objBO.UserType = '-';
	objBO.UserId = $('#tblUserInfo tbody tr.select-row').find('td:eq(1)').text();;
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = SelectedCentres.join();
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "AllotCentreToUserInBulk";
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
function unAllotCentreToUserInBulk() {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	var SelectedCentres = [];
	$("#tblAllotedCentre tbody").find('input[type=checkbox]:checked').each(function () {
		SelectedCentres.push($(this).closest('tr').find('td:eq(1)').text())
	});
	if (SelectedCentres.length == 0) {
		alert('Please Choose Centre.');
		return
	}
	objBO.UserType = '-';
	objBO.UserId = $('#tblUserInfo tbody tr.select-row').find('td:eq(1)').text();;
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = SelectedCentres.join();
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "unAllotCentreToUserInBulk";
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
function UpdateStatus(userId, IsActive) {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.UserId = userId;
	objBO.Prm1 = IsActive;
	objBO.Logic = 'UpdateStatus';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			GetUserInfo();
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