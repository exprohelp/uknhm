$(document).ready(function () {
	OnLoad();
	$('table thead').on('change', 'input:checkbox', function () {
		var IsCheck = $(this).is(':checked');
		if (IsCheck) {
			$(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', true);
		}
		else {
			$(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', false);
		}
	});
	$('#tblCentre tbody').on('change', 'input:checkbox', function () {
		if ($(this).closest('tr').attr('class') == 'group') {
			var IsCheck = $(this).is(':checked');
			if (IsCheck) {
				$(this).closest('tr').nextUntil('tr.group').find('input[type=checkbox]').prop('checked', true);
			}
			else {
				$(this).closest('tr').nextUntil('tr.group').find('input[type=checkbox]').prop('checked', false);
			}
		}
	});
});

function OnLoad() {
	$("#tblRole tbody").empty();
	$("#tblCentre tbody").empty();
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "OnLoadForCentreAllot";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var tbody = '';
			var temp1 = '';
			$.each(data.ResultSet.Table1, function (key, val) {
				if (temp1 != val.RoleFor) {
					tbody += "<tr style='background:#ddd'>";
					tbody += "<td colspan='2'>" + val.RoleFor + "</td>";
					tbody += "</tr>";
					temp1 = val.RoleFor;
				}
				tbody += "<tr>";
				tbody += "<td>" + val.RoleName + "</td>";
				tbody += "<td><button class='btn-success btn-go' onclick=selectRow();GetUserByRole('" + val.RoleId + "')><i class='fa fa-sign-in'></i></button></td>";
				tbody += "</tr>";
			});
			$("#tblRole tbody").append(tbody);

			var temp = '';
			var tbody1 = '';
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.districtName) {
					tbody1 += "<tr class='group'>";
					tbody1 += "<td colspan='2'><input type='checkbox' checked />&nbsp;" + val.districtName + "</td>";
					tbody1 += "</tr>";
					temp = val.districtName;
				}
				tbody1 += "<tr>";
				tbody1 += "<td><input type='checkbox' checked  data-centreid='" + val.centreId+"'/></td>";
				tbody1 += "<td>" + val.centre_name + "</td>";
				tbody1 += "</tr>";
			});
			$("#tblCentre tbody").append(tbody1);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetUserByRole(Prm1) {
	$("#tblUserInfo tbody").empty();
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = Prm1;
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetUserByRole";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var tbody = '';		
			$.each(data.ResultSet.Table, function (key, val) {			
				tbody += "<tr>";
				tbody += "<td><input type='checkbox' checked data-userid='" + val.UserId +"'/></td>";
				tbody += "<td>" + val.UserName + "</td>";
				tbody += "</tr>";
			});
			$("#tblUserInfo tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function AllotCentreToUserInBulk() {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	var userInfo = [];	
	$("#tblUserInfo tbody").find('input[type=checkbox]:checked').each(function () {
		var UserId = $(this).data('userid');
		$("#tblCentre tbody tr:not(.group)").find('input[type=checkbox]:checked').each(function () {
			var CentreId = $(this).data('centreid');
			userInfo.push({
				'UserId': UserId,
				'CentreId': CentreId
			});
		});		
	});	
	objBO.UserType = '-';
	objBO.UserId = '-';
	objBO.UserName = '-';
	objBO.MobileNo = '-';
	objBO.Prm1 = JSON.stringify(userInfo);
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "AllotCentreUserWise";	
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {			
			if (data.includes('Success')) {
				alert(data);				
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