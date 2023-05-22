$(document).ready(function () {
	GetSyncFailedInfo();
});
function GetSyncFailedInfo() {
	$("#tblSysncFailedInfo tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetSyncFailedInfo";
	$.ajax({    
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var temp = '';
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.centre_name) {
					tbody += "<tr style='background:#cfe7ef;height: 0px;'>";
					tbody += "<td colspan='8'>" + val.centre_name + "</td>";
					tbody += "</tr>";
					temp = val.centre_name
				}
				tbody += "<tr>";
				tbody += "<td>" + val.VisitNo + "</td>";
				tbody += "<td>" + val.PatientName + "</td>";
				tbody += "<td>" + val.barcode_no + "</td>";
				tbody += "<td>" + val.MobileNo + "</td>";
				tbody += "<td>" + val.visitDate + "</td>";
				tbody += "<td>" + val.Investigation + "</td>";
				tbody += "<td>" + val.SyncFailResult + "</td>";
				tbody += "<td><button class='btn-success' onclick=MarkITDoseSynced('" + val.VisitNo + "')>Refresh</button></td>";
			});
			$("#tblSysncFailedInfo tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}


function MarkITDoseSynced(VisitNo) {
	var url = config.baseUrl + "/api/Unit/MarkITDoseSynced";
	var objBO = {};
	objBO.Prm1 = VisitNo;
	objBO.login_id = Active.userId;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert('Record Found in ITDose.');
				GetSyncFailedInfo();
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

