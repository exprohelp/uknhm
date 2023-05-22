$(document).ready(function () {
	$('input:text').attr('autocomplete', 'off');
	GetCenter();
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	$('#ddlReportType').on('change', function () {
		var val = $(this).find('option:selected').text();
		if (val == 'Pending') {
			$('input[type=date]').prop('disabled', true);
		}
		else {
			$('input[type=date]').prop('disabled', false);
		}
	});
	$("#tblPatientRegister tbody").on('click', 'button[id=btnReportView]', function () {
		var VisitNo = $(this).closest('tr').find('td:eq(0)').text();
		DiagnosticBookingReportByVisitNo(VisitNo);
		$("#modalReportView").modal('show');
	});
	$("#tblPatientRegister tbody").on('click', 'button[id=btnApprove]', function () {
		var visitNo = $(this).closest('tr').find('td:eq(1)').text();
		Approve(visitNo, $(this));
	});
	$(".btnPresc").on('click', 'button', function () {
		var path = $(this).data('path');
		$('#imgPresc').closest('a').prop('href', path);
		$('#imgPresc').prop('src', path);
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
function GetPatientRegister() {
	$("#tblPatientRegister tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "PatientRegister";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {

				var tbody = '';
				var count = 0;
				$.each(data.ResultSet.Table, function (key, val) {
					count++;
					if (val.ApproveDate.length > 4) {
						tbody += "<tr style='color:#297309'>";
					}
					else {
						tbody += "<tr>";
					}
					tbody += "<td>" + val.VisitNo + "</td>";
					tbody += "<td>" + val.visitDate + "</td>";
					tbody += "<td>" + val.PatientName + "</td>";
					tbody += "<td>" + val.Age + "</td>";
					tbody += "<td>" + val.Gender + "</td>";
					tbody += "<td>" + val.PrescribedBy + "</td>";
					tbody += "<td class='text-right'>" + val.BillAmount + "</td>";
					tbody += "<td><button class='btn-danger btn-go' id='btnReportView'>View</button></td>";
					tbody += "<td><button class='btn-danger btn-go' onclick=PatientInfo('" + val.VisitNo + "')>View</button></td>";
					tbody += "<td>" + val.ApproveDate + "</td>";
					tbody += "<td class='text-right'>" + val.ApprAmount + "</td>";
					tbody += "<td>" + val.Investigation + "</td>";
					//tbody += "<td><button class='btn-danger btn-go' onclick=PatientInfo('" + val.VisitNo + "')><i class='fa fa-sign-in'></i></button></td>";
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
function PatientRegisterByVisitNo() {
	$("#tblPatientRegister tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#txtInput').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "PatientRegisterByVisitNo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				var tbody = '';
				var count = 0;
				$.each(data.ResultSet.Table, function (key, val) {
					count++;
					if (val.ApproveDate.length > 4) {
						tbody += "<tr style='color:#297309'>";
					}
					else {
						tbody += "<tr>";
					}
					tbody += "<td>" + val.VisitNo + "</td>";
					tbody += "<td>" + val.visitDate + "</td>";
					tbody += "<td>" + val.PatientName + "</td>";
					tbody += "<td>" + val.Age + "</td>";
					tbody += "<td>" + val.Gender + "</td>";
					tbody += "<td>" + val.PrescribedBy + "</td>";
					tbody += "<td class='text-right'>" + val.BillAmount + "</td>";
					tbody += "<td><button class='btn-danger btn-go' id='btnReportView'>View</button></td>";
					tbody += "<td><button class='btn-danger btn-go' onclick=PatientInfo('" + val.VisitNo + "')>View</button></td>";
					tbody += "<td>" + val.ApproveDate + "</td>";
					tbody += "<td class='text-right'>" + val.ApprAmount + "</td>";
					tbody += "<td>" + val.Investigation + "</td>";
					//tbody += "<td><button class='btn-danger btn-go' onclick=PatientInfo('" + val.VisitNo + "')><i class='fa fa-sign-in'></i></button></td>";
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
function PatientInfo(visitNo) {
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = visitNo;
    objBO.Prm1 = window.location.origin;
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "PatientInfo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					$("#txtUnitName").text(val.centre_name);
					$("#txtVisitDate").text(val.visitDate);
					$("#txtPatientName").text(val.PatientName);
					$("#txtPrescribedBy").text(val.DoctorName);
					$("#txtMobileNo").text(val.MobileNo);
				});

				$("#tblPatientInfo tbody").empty();
				var tbody = '';
				var count = 0;
				var total = 0;
				var discount = 0;
				var totalAmt = 0;
				var cencelTotalAmt = 0;
				$.each(data.ResultSet.Table1, function (key, val) {
					count++;
					total += val.total;
					discount += val.discount;
					totalAmt += val.netAmount;
					if (val.IsCancelled == '1') {
						tbody += "<tr style='background:#ffb3b3'>";
						cencelTotalAmt += val.netAmount;
					}
					else {
						tbody += "<tr>";
					}

					tbody += "<td>" + count + "</td>";
					tbody += "<td>" + val.testName + "</td>";
					tbody += "<td class='text-right'>" + val.total + "</td>";
					tbody += "<td class='text-right'>" + val.discount + "</td>";
					tbody += "<td class='text-right'>" + val.netAmount + "</td>";
					tbody += "</tr>";
				});
				tbody += "<tr>";
				tbody += "<th style='background:#f5f5f5' colspan='2'>Total Amount</th>";
				tbody += "<th style='background:#f5f5f5' class='text-right'>" + total + "</th>";
				tbody += "<th style='background:#f5f5f5' class='text-right'>" + discount.toFixed(2) + "</th>";
				tbody += "<th style='background:#f5f5f5' class='text-right'>" + totalAmt.toFixed(2) + "</th>";
				tbody += "</tr>";
				if (cencelTotalAmt > 0) {
					tbody += "<tr>";
					tbody += "<th style='background:#f5f5f5;text-align:right' colspan='4'>Total Cancel Amount</th>";
					tbody += "<th style='background:#f5f5f5' class='text-right'>-" + cencelTotalAmt.toFixed(2) + "</th>";
					tbody += "</tr>";
				}
				$("#tblPatientInfo tbody").append(tbody);
				var button = '';
				var img = '';
				$('.btnPresc').empty();
				$.each(data.ResultSet.Table2, function (key, val) {
					if (img == '') {
						$('#imgPresc').closest('a').prop('href', val.virtual_location);
						$('#imgPresc').prop('src', val.virtual_location);
						img = val.virtual_location;
					}
					button += "<button type='button' data-path='" + val.virtual_location + "' class='btn-flat btn-success accept'>" + val.doc_name + "</button>&nbsp;";
				});			
				$('.btnPresc').append(button);
				$("#modalPatientInfo").modal('show');

			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Approve(visitNo, elem) {
	var url = config.baseUrl + "/api/Report/MIS_InsertUpdateReports";
	var objBO = {};
	objBO.VisitNo = visitNo;
	objBO.MobileNo = '-';
	objBO.remark = '-';
	objBO.Prm1 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "ApproveReport";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				$(elem).closest('tr').css('color', '#297309');
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

//Patient Report View
function DiagnosticBookingReportByVisitNo(VisitNo) {
	//ShowHideLoader("Show");
	$('#ReportView').empty();
	var url = config.baseUrl + "/api/MobileApp/DiagnosticBookingReportByVisitNo";
	var objBO = {};
	objBO.VisitNo = VisitNo;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			console.log(data);
			if (data != '') {
				$('#ReportView').html(data);
			}
			else {
			}
		},
		complete: function (res) {
			//ShowHideLoader("Hide");
		},
		error: function (response) {
			alert('Server Error...!');
			//ShowHideLoader("Hide");
		}
	});
}
function DownloadReport(visitNo, TestIds) {
	$('#LineLoader').attr("src", '#');
	var loading = "<a href='#' class='btn btn-info btn-sm fa-pdf'><img width='80' height='5' src='" + config.rootUrl + "/Content/img/loading.gif' />Downloading</a>";
	$('#btnDownload').html(loading)
	var url = config.baseUrl + "/api/MobileApp/DownloadLISReport";
	var objBO = {};
	objBO.VisitNo = visitNo;
    objBO.TestIds = TestIds;
    objBO.RegDate = $('#modalReportView').find('table:eq(0) tbody').find('tr:eq(2)').find('td:eq(1)').text();
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			var href = "<a href='" + data + "' target='_blank' class='btn btn-success btn-sm'>View Report</a>";
			$('#btnDownload').html(href)
		},
		complete: function (res) {
			//ShowHideLoader("Hide");
		},
		error: function (response) {
			alert('Server Error...!');
			//ShowHideLoader("Hide");
		}
	});
}