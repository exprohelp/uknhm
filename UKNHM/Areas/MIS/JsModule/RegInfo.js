var _testInfo = [];
$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	GetCentreMaster();
	$('#tblRegReport tbody').on('click', 'a', function () {
		var pendingReport = $(this).data('pending');
		var CentreId = $(this).closest('tr').data('centreid');
		DelayedTestSummary(CentreId, pendingReport);
	});
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
	objBO.Logic = "DailyRegInfo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var temp = '';
			var tbody = '';
			var totalInfo = '';
			var PatientCount = 0;
			var TotalCentre = 0;
			var ActiveCentre = 0;
			var netAmount = 0;
			var Scaned_Pend = 0;
			var HUB_VPend = 0;
			var MOTH_VPend = 0;
			var Appr_Pend = 0;
			var SyncItdose = 0;
			var TestCount = 0;
			var delay = 0;
			var delay_perc = 0;
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.HubName) {
					tbody += "<tr style='background: #cae9ff'>";
					tbody += "<td class='bg-group' colspan='11'>" + val.HubName + "</td>";
					tbody += "</tr>";
					temp = val.HubName;
				}
				PatientCount += val.PatientCount;
				netAmount += val.netAmount;
				Scaned_Pend += val.Scaned_Pend;
				HUB_VPend += val.HUB_VPend;
				MOTH_VPend += val.MOTH_VPend;
				Appr_Pend += val.CMS_Pend;
				SyncItdose += val.SyncItdose;
				TestCount += val.TestCount;
				delay += val.delay;
				delay_perc += val.delay_perc;
				tbody += "<tr data-centreid='" + val.CentreId + "' >";
				tbody += "<td class='bg-group'>" + val.centre_name + "</td>";
				tbody += "<td>" + val.PatientCount + "</td>";
				tbody += "<td>" + val.netAmount + "</td>";
				if (eval(val.Scaned_Pend)>0)
					tbody += "<td><a href='#' data-pending='IsScaned'>" + val.Scaned_Pend + "</a></td>";
				else
					tbody += "<td>" + val.Scaned_Pend + "</td>";

				if (eval(val.HUB_VPend) > 0)
					tbody += "<td><a href='#' data-pending='IsVerified'>" + val.HUB_VPend + "</a></td>";
				else
					tbody += "<td>" + val.HUB_VPend + "</td>";

				if (eval(val.MOTH_VPend) > 0)
					tbody += "<td><a href='#' data-pending='IsMotherLabVerified'>" + val.MOTH_VPend + "</a></td>";
				else
					tbody += "<td>" + val.MOTH_VPend + "</td>";

				if (eval(val.CMS_Pend) > 0)
					tbody += "<td><a href='#' data-pending='ApproveType'>" + val.CMS_Pend + "</a></td>";
				else
					tbody += "<td>" + val.CMS_Pend + "</td>";			
		
				tbody += "<td>" + val.SyncItdose + "</td>";
				tbody += "<td>" + val.TestCount + "</td>";
				tbody += "<td>" + val.delay + "</td>";

				if (eval(val.delay_perc) > 0)
					tbody += "<td><button data-centreid='" + val.CentreId + "' onclick=DelayTestInfo(this) class='btn-danger btn btnDelay'>" + val.delay_perc + "</button></td>";
				else
					tbody += "<td>" + val.delay_perc + "</td>";

				tbody += "</tr>";
				TotalCentre++;
				if ((val.PatientCount) > 0)
					ActiveCentre++;
			});
			totalInfo += "<tr>";
			totalInfo += "<td>" + ActiveCentre + "/" + TotalCentre + "</td>";
			totalInfo += "<td>" + PatientCount.toFixed(0) + "</td>";
			totalInfo += "<td>" + netAmount.toFixed(0) + "</td>";
			totalInfo += "<td>" + Scaned_Pend.toFixed(0) + "</td>";
			totalInfo += "<td>" + HUB_VPend.toFixed(0) + "</td>";
			totalInfo += "<td>" + MOTH_VPend.toFixed(0) + "</td>";
			totalInfo += "<td>" + Appr_Pend.toFixed(0) + "</td>";
			totalInfo += "<td>" + SyncItdose.toFixed(0) + "</td>";
			totalInfo += "<td>" + TestCount.toFixed(0) + "</td>";
			totalInfo += "<td>" + delay.toFixed(0) + "</td>";
			totalInfo += "<td>" + (delay * 100 / TestCount).toFixed(2) + "</td>";
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

function DelayTestInfo(elem) {
    $(elem).closest('tr').addClass('selected-row');
	_testInfo = [];
	var visitNos = [];
	var centreName = $(elem).closest('tr').find('td:eq(0)').text();
	$("#txtCentreName").text(centreName);
	$("#tblChandanDelayTest tbody").empty();
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = $(elem).data('centreid');
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "DelayedTestInfo";
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
				if (temp != val.VisitNo) {
					tbody += "<tr style='background:#ddd'>";
					tbody += "<td colspan='5'>" + val.VisitNo + ' (' + val.PatientName + ')' + ', Hub Verified : ' + val.IsVerified + ', ITDose Sync : ' + val.SyncFailResult + "</td>";
					tbody += "</tr>";
					temp = val.VisitNo
					visitNos.push("'" + val.VisitNo + "'");
					if (val.ApprovedDate == null) {
						debugger
						_testInfo.push({
							'VisitNo': val.VisitNo,
							'testCode': val.testCode
						});
					}
				}


				tbody += "<tr>";
				tbody += "<td style='display:none'>" + val.testCode + "</td>";
				tbody += "<td>" + val.test_name + "</td>";
				tbody += "<td>" + val.visitDate + "</td>";
				tbody += "<td>" + val.TargetDateTime + "</td>";
				tbody += "<td>" + val.ReportApproveDate + "</td>";
				tbody += "<td>" + val.TAT.toFixed(2) + "</td>";
				tbody += "</tr>";
			});
			$("#tblChandanDelayTest tbody").append(tbody);
			$("#modalDelaytestInfo").modal('show');
		},
		error: function (response) {
			alert('Server Error...!');
		},
		complete: function (response) {
			ITDoseRegistrationInfo(visitNos.join(','));
		}
	});
}
function DelayedTestSummary(centreId, pendingReport) {	
	$("#tblPendingInfo tbody").empty();
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = centreId;
	objBO.VisitNo = '-';
	objBO.Prm1 = pendingReport;
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "DelayedTestSummary";
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
				if (temp != val.VisitNo) {
					tbody += "<tr style='background:#bdf0ff'>";
					tbody += "<td colspan='2'>" + val.VisitNo + ' (' + val.PatientName + ')' + "</td>";
					tbody += "</tr>";
					temp = val.VisitNo				
				}
				if (val.IsCancelled==1)
					tbody += "<tr style='background:#fdbebe'>";
				else
					tbody += "<tr>";

				tbody += "<td style='display:none'>" + val.testCode + "</td>";
				tbody += "<td>" + val.test_name + "</td>";
				tbody += "<td>" + val.visitDate + "</td>";				
				tbody += "</tr>";
			});
			$("#tblPendingInfo tbody").append(tbody);
			$("#modalPendingInfo").modal('show');
		},
		error: function (response) {
			alert('Server Error...!');
		},	
	});
}
function ProcessingLabTAT(hospId) {
	$("#tblITDoseDelayTest tbody").empty();
	var from = $('#txtFrom').val().replace('T', ' ') + ':00';
	var to = $('#txtTo').val().replace('T', ' ') + ':00';
	var url = config.baseUrl + "/api/Unit/UKNHReport";
	var objBO = {};
	objBO.Prm1 = hospId;
	objBO.from = from;
	objBO.to = to;
	objBO.Prm2 = '-';
	objBO.Logic = "DelayedTestInfo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var temp = '';
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.VisitNo) {
					tbody += "<tr style='background:#ddd'>";
					tbody += "<td colspan='5'>" + val.VisitNo + ' (' + val.PNAME + ')' + "</td>";
					tbody += "</tr>";
					temp = val.VisitNo
				}
				tbody += "<tr>";
				tbody += "<td>" + val.ItemName + "</td>";
				tbody += "<td>" + val.LogisticReceiveDate + "</td>";
				tbody += "<td>" + val.DeliveryDate + "</td>";
				tbody += "<td>" + val.ApprovedDate + "</td>";
				tbody += "<td>" + val.TAT + "</td>";
				tbody += "</tr>";
			});
			$("#tblITDoseDelayTest tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ITDoseRegistrationInfo(visitNos) {
	$("#tblITDoseDelayTest tbody").empty();
	var from = $('#txtFrom').val().replace('T', ' ') + ':00';
	var to = $('#txtTo').val().replace('T', ' ') + ':00';
	var url = config.baseUrl + "/api/Unit/ITDoseRegistrationInfo";
	var objBO = {};
	objBO.Prm1 = visitNos;
	objBO.from = from;
	objBO.to = to;
	objBO.Prm2 = '-';
	objBO.Logic = "DelayedTestInfo";
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
				if (temp != val.VisitNo) {
					tbody += "<tr style='background:#ddd'>";
					tbody += "<td colspan='6'>" + val.VisitNo + ' (' + val.PNAME + ')' + "</td>";
					tbody += "</tr>";
					temp = val.VisitNo
				}
				tbody += "<tr>";
				tbody += "<td style='display:none'>" + val.Test_Id + "</td>";
				tbody += "<td>" + val.ItemName + "</td>";
				tbody += "<td>" + val.LogisticReceiveDate + "</td>";
				tbody += "<td>" + val.DeliveryDate + "</td>";
				tbody += "<td>" + val.ApprovedDate + "</td>";
				if (eval(val.TAT) > 0)
					tbody += "<td style='color:red'>" + val.TAT + "</td>";
				else
					tbody += "<td>" + val.TAT + "</td>";
				tbody += "<td><button onclick=Approve('" + val.Test_Id + "') class='btn-warning'><i class='fa fa-sign-in'></i></button></td>";
				tbody += "</tr>";
			});
			$("#tblITDoseDelayTest tbody").append(tbody);
			console.log(_testInfo)
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Approve(Test_Id) {
	var url = config.baseUrl + "/api/Unit/ITDoseApproveVisitNos";
	var objBO = {};
	objBO.Prm1 = Test_Id;
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Prm2 = '-';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success'))
				alert(data);
			else
				alert(data);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}