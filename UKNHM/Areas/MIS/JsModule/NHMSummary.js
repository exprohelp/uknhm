$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	GetCentreMaster();
});
function GetCentreMaster() {
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetCenterMaster";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#ddlCentre").empty().append($('<option></option>').val('ALL').html('ALL')).change();
			$.each(data.ResultSet.Table, function (key, val) {
				$("#ddlCentre").append($('<option></option>').val(val.centreId).html(val.centre_name));
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DailyRegInfo() {
	$("#tblRegReport tbody").empty();
	$("#tblRegInfo tbody").empty();
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = $('#ddlCentre option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "DailyRegInfoNHM1";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var temp = '';
			var temp1 = '';
			var temp2 = '';
			var count = 0;
			var tbody = '';
			var totalInfo = '';
			var PatientCount = 0;
			var netAmount = 0;
			var Scaned_Pend = 0;
			var HUB_VPend = 0;
			var MOTH_VPend = 0;
			var Appr_Pend = 0;
			var TestCount = 0;
			var SyncItdose = 0;
			//district declare
			var dPatientCount = 0;
			var dTestCount = 0;
			var dnetAmount = 0;
			var dCMS_Pend = 0;
			$.each(data.ResultSet.Table, function (key, val) {


				PatientCount += val.PatientCount;
				TestCount += val.TestCount;
				netAmount += val.netAmount;
				Appr_Pend += val.CMS_Pend;
				count++;
				if (temp != val.regionName) {
					tbody += "<tr style='background: #cae9ff'>";
					tbody += "<td class='bg-group' colspan='8'>" + val.regionName + "</td>";
					tbody += "</tr>";
					temp = val.regionName;
				}

				if (temp1 != val.districtName) {
					
					tbody += "<tr style='background: #fff6c8'>";
					tbody += "<td class='bg-group' colspan='8'>" + val.districtName + "</td>";
					tbody += "</tr>";
					temp1 = val.districtName;
				}

				tbody += "<tr>";
				tbody += "<td class='bg-group'>" + val.centre_name + "</td>";
				tbody += "<td>" + val.PatientCount + "</td>";
				tbody += "<td>" + val.TestCount + "</td>";
				tbody += "<td>" + val.netAmount + "</td>";
				tbody += "<td>" + val.CMS_Pend + "</td>";
				tbody += "</tr>";

				//if (temp1 == val.districtName) {				
				//	dPatientCount += val.PatientCount;
				//	dTestCount += val.TestCount;
				//	dnetAmount += val.netAmount;
				//	dCMS_Pend += val.CMS_Pend;
				//}
				//else {
				//	tbody += "<tr>";
				//	tbody += "<th'>Total</th>";
				//	tbody += "<th>" + dPatientCount + "</th>";
				//	tbody += "<th>" + dTestCount + "</th>";
				//	tbody += "<th>" + dnetAmount + "</th>";
				//	tbody += "<th>" + dCMS_Pend + "</th>";
				//	tbody += "</tr>";

				//	dPatientCount = 0;
				//	dTestCount = 0;
				//	dnetAmount = 0;
				//	dCMS_Pend = 0;
				//}

			});
			totalInfo += "<tr>";
			totalInfo += "<td></td>";
			totalInfo += "<td>" + PatientCount.toFixed(0) + "</td>";
			totalInfo += "<td>" + TestCount.toFixed(0) + "</td>";
			totalInfo += "<td>" + netAmount.toFixed(0) + "</td>";
			totalInfo += "<td>" + Appr_Pend.toFixed(0) + "</td>";
			totalInfo += "</tr>";
			$("#tblRegReport tbody").append(tbody);
			$("#tblRegInfo tbody").append(totalInfo);
		},
		complete: function () {
			var th0 = $("#tblRegReport thead th:eq(0)").width() + 11;
			console.log(th0)
			$("#tblRegInfo thead tr:eq(1) th:eq(0)").css('width', th0 + 'px');
			$("#tblRegInfo tbody td:eq(0)").css('width', th0 + 'px');
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}