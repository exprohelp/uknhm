$(document).ready(function () {	
	GetCenter();
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');	
	$("#tblDoctorWiseReport tbody").on('click', 'button', function () {		
		var doctorId = $(this).closest('tr').find('td:eq(0)').text();		
		DoctorWiseTestReport(doctorId);
		selectRow($(this));
	});
});
function GetCenter() {
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetCenterMaster";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$("#ddlCentreName").empty().append($("<option></option>").val("0").html("Select")).select2();
				var centreName = '';
				$.each(data.ResultSet.Table, function (key, val) {
					if (centreName != val.centreId) {
						$("#ddlCentreName").append($("<option></option>").val(val.centreId).html(val.centre_name));
						centreName = val.centreId;
					}
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DoctorWiseReport() {
	$("#tblDoctorWiseReport tbody").empty();
	$("#tblDoctorWiseTestReport tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = '';
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "DoctorWiseReport";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var visitNo = '';
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				//if (visitNo != val.VisitNo) {
				//	tbody += "<tr>";
				//	tbody += "<td style='background:#cdebfd' colspan='6'>" + val.VisitNo + " [" + val.PatientName + "] " + "</td>";
				//	tbody += "<tr>";
				//	visitNo = val.VisitNo;
				//}
				//if (val.delayFlag == 'Y') {
				//	tbody += "<tr style='background:red'>";
				//}
				//else {
				//	tbody += "<tr>";
				//}
				tbody += "<tr>";
				tbody += "<td style='display:none'>" + val.DoctorId + "</td>";
				tbody += "<td>" + val.DoctorName + "</td>";
				tbody += "<td class='text-right'>" + val.PatientCount + "</td>";
				tbody += "<td class='text-right'>" + val.TestCount + "</td>";									
				tbody += "<td><button class='btndown btn-success'><i class='fa fa-arrow-right'></i></button></td>";
				tbody += "</tr>";
			});
			$("#tblDoctorWiseReport tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DoctorWiseTestReport(doctorId) {
	$("#tblDoctorWiseTestReport tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = doctorId;
	objBO.Prm2 = '';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "DoctorWiseTestReport";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {		
			var tbody = '';
			var temp = '';
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.testCategory) {
					tbody += "<tr>";
					tbody += "<td style='background:#cdebfd' colspan='3'>" + val.testCategory + "</td>";
					tbody += "</tr>";
					temp = val.testCategory;
				}
				tbody += "<tr>";
				tbody += "<td>" + val.testName + "</td>";
				tbody += "<td class='text-right'>" + val.PatientCount + "</td>";
				tbody += "<td class='text-right'>" + val.TestCount + "</td>";			
				tbody += "</tr>";
			});
			$("#tblDoctorWiseTestReport tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
