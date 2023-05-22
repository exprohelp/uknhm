$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
});
function ITDoseChandanBulkSync() {
	var waiting = "<img src='https://exprohelp.com/UKNHM/content/img/waiting.gif' style='width:15px'/>&nbsp;Syncing.."
	$('#btnSave').html(waiting).prop('disabled', true);
	$("#tblMisMatchRecord tbody").empty();
	var url = config.baseUrl + "/api/Unit/ITDoseChandanBulkSync";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var tbody = '';
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						tbody += "<tr>";
						tbody += "<td>" + val.VisitNo + "</td>";
						tbody += "<td>" + val.PatientName + "</td>";
						tbody += "<td>" + val.test_name + "</td>";
						tbody += "<td>" + val.ApprovedDate + "</td>";
						tbody += "<td>" + val.ApprovedBy + "</td>";
						tbody += "<td>" + val.ApprovedByLab + "</td>";
					});
					$("#btnUpdate").show();
				}
				else {
					tbody += "<tr>";
					tbody += "<td colspan='6' class='text-center text-danger'>MisMatch Record Not Found.</td>";
					tbody += "</tr>";
				}
			}
			$("#tblMisMatchRecord tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		},
		complete: function (res) {
			$('#btnSave').html('Sync Data');
		}
	});
}
function BulkMarkApprove() {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "BulkMarkApprove";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			BulkSyncMismatchedRecord();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}
function BulkSyncMismatchedRecord() {
	$("#tblMisMatchRecord tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "BulkSyncMismatchedRecord";
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
						tbody += "<tr>";
						tbody += "<td>" + val.VisitNo + "</td>";
						tbody += "<td>" + val.PatientName + "</td>";
						tbody += "<td>" + val.test_name + "</td>";
						tbody += "<td>" + val.ApprovedDate + "</td>";
						tbody += "<td>" + val.ApprovedBy + "</td>";
						tbody += "<td>" + val.ApprovedByLab + "</td>";
					});
				}
				else {
					tbody += "<tr>";
					tbody += "<td colspan='6' class='text-center text-danger'>MisMatch Record Not Found.</td>";
					tbody += "</tr>";
				}
			}
			$("#tblMisMatchRecord tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}