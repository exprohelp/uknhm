$(document).ready(function () {
	$('input:text').attr('autocomplete', 'off');
	GetCenter();
	$("#tblPatientRegister thead").on('keyup', 'input:text', function () {
		var remark = $(this).val();
		$(this).parents('table').find('tbody tr').find('td:eq(4)').text(remark);
	});
});

function GetCenter() {
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
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
			var centreName = '';
			if (data.ResultSet.Table.length > 0) {
				$("#ddlCentreName").empty().append($("<option></option>").val("0").html("Select")).select2();
				$("#ddlCentreName").append($("<option></option>").val("ALL").html("ALL")).select2();
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
function GetTestForDisasterMarking() {
	$("#tblPatientRegister tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	var From = $('#txtFrom').val();
	var To = $('#txtTo').val();
	if (From == '' || To == '') {
		alert('Please Provide From And To Date.');
		return;
	}
	var CentreId = $("#ddlCentreName option:selected").text();
	if (CentreId == 'Select') {
		alert('Please Choose Centre');
		return;
	}
	objBO.LabCode = '-';
	objBO.CentreId = $("#ddlCentreName option:selected").val();
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = From.toString().replace('T', ' ');
	objBO.to = To.replace('T', ' ');
	objBO.login_id = Active.userId;
	objBO.Logic = "GetPatientInfoForDisaster";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			if (data.ResultSet.Table.length > 0) {
				var tbody = '';
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.VisitNo + "</td>";
					tbody += "<td>" + val.barcode_no + "</td>";
					tbody += "<td>" + val.visitDate + "</td>";
					tbody += "<td>" + val.PatientName + "</td>";
					tbody += "<td style='width: 10%'>" + val.Remark + "</td>";
					tbody += "</tr>";
				});
				$("#tblPatientRegister tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DisasterRemark() {
	var url = config.baseUrl + "/api/Unit/Unit_InsertUpdateUnitWorking";
	var objBO = {};
	var From = $('#txtFrom').val();
	var To = $('#txtTo').val();
	if (From == '' || To == '') {
		alert('Please Provide From And To Date.');
		return;
	}
	var CentreId = $("#ddlCentreName option:selected").text();
	if (CentreId == 'Select') {
		alert('Please Choose Centre');
		return;
	}
	objBO.VisitNo = '';
	objBO.CentreId = $("#ddlCentreName option:selected").val();
	objBO.Remark = $("#tblPatientRegister thead input:text").val();
	objBO.Prm1 = $("#ddlCalamityType option:selected").text();
	objBO.Prm2 = '-';
	objBO.from = From.toString().replace('T', ' ');
	objBO.to = To.replace('T', ' ');
	objBO.login_id = Active.userId;
	objBO.Logic = 'DisasterRemarkMarking';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				$("#tblPatientRegister thead input:text").val('');
				GetTestForDisasterMarking();
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