var _invoiceNo = '';
$(document).ready(function () {
	//CloseSidebar();
	FillCurrentMonth('txtFrom');
	//GetCenter();
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
				//$("#ddlCentreName").append($("<option></option>").val("ALL").html("ALL")).select2();
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
function InvoiceList() {
	$("#tblInvoiceSummary tbody").empty();
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.InvoiceNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtFrom').val() + '-01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = 'InvoiceListForCMOVerification';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var centreName = '';
			if (data.ResultSet.Table.length > 0) {
				var tbody = '';
				var centre = '';
				var totalAmount = 0;
				var totalDiscount = 0;
				var amount = 0;
				var InvoiceAmount = 0;
				var eqasAmt = 0;
				var equas_prvMonth = 0;
				var EQAS_Deduction = 0;
				var AmountTobePaid = 0;
				$.each(data.ResultSet.Table, function (key, val) {
					if (centre != val.HospitalName) {
						tbody += "<tr style='background:#c6e5ff'>";
						tbody += "<td colspan='5'>Centre Name : " + val.HospitalName + "</td>";
						tbody += "<td colspan='5'><a class='btn btn-warning btn-xs pull-left' href='BillDetails?InvoiceNo=" + val.MasterInvoiceNo + "' target='_blank'>Print Invoice " + val.InvoiceMonth.replace('1', '') + "</a></td>";
						tbody += "</tr>";
						centre = val.HospitalName
					}
					totalAmount += val.totalAmount;
					totalDiscount += val.totalDiscount;
					amount += val.amount;
					InvoiceAmount += val.InvoiceAmount;
					EQAS_Deduction += val.EQAS_Deduction;
					AmountTobePaid += val.AmountTobePaid;

					if (val.IsCMOVerified == 'Y')
						tbody += "<tr style='background:#b8e3b8'>";
					else
						tbody += "<tr>";

					tbody += "<td>" + val.InvoiceMonth.replace('1', '') + "</td>";
					tbody += "<td style='white-space: nowrap'>" + val.InvoiceNo + "</td>";
					if (val.totalAmount == 0)
						tbody += "<td class='text-right'></td>";
					else
						tbody += "<td class='text-right'>" + val.totalAmount + "</td>";

					if (val.totalDiscount == 0)
						tbody += "<td class='text-right'></td>";
					else
						tbody += "<td class='text-right'>" + val.totalDiscount + "</td>";

					if (val.amount == 0)
						tbody += "<td class='text-right'></td>";
					else
						tbody += "<td class='text-right'>" + val.amount + "</td>";

					tbody += "<td class='text-right'><type style='font-size:8px'>" + val.InvoiceType + '</type> : <b>' + val.InvoiceAmount + "</b></td>";
					if (val.EQAS_VerifyDate != null)
						tbody += "<td class='text-right'><button onclick=EQASAbnormalReport('" + val.MasterInvoiceNo + "') class='btn btn-warning btn-xs'>" + val.EQAS_Deduction + "</button></td>";
					else
						tbody += "<td class='text-right'>0</td>";
					//tbody += "<td class='text-right'>" + val.EQAS_Deduction + "</td>";
					tbody += "<td class='text-right'>" + val.AmountTobePaid + "</td>";
					if (val.IsCMOVerified == 'Y')
						tbody += "<td><button class='btn btn-success btn-xs' disabled>Verify</button></td>";
					else
						tbody += "<td><button class='btn btn-success btn-xs' data-invoice='" + val.InvoiceNo + "' onclick=VerifyInvoice(this)>Verify</button></td>";

					tbody += "</tr>";
				});
				tbody += "<tr>";
				tbody += "<th colspan='2' class='text-right'>Total Amount</th>";
				tbody += "<th class='text-right'>" + totalAmount.toFixed(2) + "</th>";
				tbody += "<th class='text-right'>" + totalDiscount.toFixed(2) + "</th>";
				tbody += "<th class='text-right'>" + amount.toFixed(2) + "</th>";
				tbody += "<th class='text-right'>" + InvoiceAmount.toFixed(2) + "</th>";
				tbody += "<th class='text-right'>" + EQAS_Deduction.toFixed(2) + "</th>";
				tbody += "<th class='text-right'>" + AmountTobePaid.toFixed(2) + "</th>";
				tbody += "</tr>";
				$("#tblInvoiceSummary tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function VerifyInvoice(elem) {
	if (confirm('Are You Sure to Verify?')) {
		var url = config.baseUrl + "/api/Invoice/Invoice_ReceivedPayInfo";
		var objBO = {};
		objBO.CentreId = '-';
		objBO.InvoiceNo = $(elem).data('invoice');
		objBO.ReceiptNo = '-';
		objBO.PayMode = '-';
		objBO.Amount = 1;
		objBO.AccountNo = '-';
		objBO.BankName = '-';
		objBO.ChequeDate = '1900/01/01';
		objBO.RefNo = '-';
		objBO.Remark = '-';
		objBO.FilePath = '-';
		objBO.login_id = Active.userId;
		objBO.Logic = 'InvoiceVerificationByCMO';

		var UploadDocumentInfo = new XMLHttpRequest();
		var data = new FormData();
		data.append('obj', JSON.stringify(objBO));
		data.append('ImageByte', $('input[id=FileUpload]')[0].files[0]);
		UploadDocumentInfo.onreadystatechange = function () {
			if (UploadDocumentInfo.status) {
				if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
					var json = JSON.parse(UploadDocumentInfo.responseText);
					if (json.Message.includes('Success')) {
						//alert('Successfully Verified');
						$(elem).closest('tr').css('background', '#b8e3b8');
					}
					else {
						alert(json.Message);
					}
				}
			}
		}
		UploadDocumentInfo.open('POST', url, true);
		UploadDocumentInfo.send(data);
	}

}
function EQASAbnormalReport(invoiceNo) {
	_invoiceNo = invoiceNo;
	$("#tblEQASAbnormalReport tbody").empty();
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = invoiceNo;
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Logic = "EQASAbnormalReport";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var visitNo = '';
			var tbody = "";
			$.each(data.ResultSet.Table, function (key, val) {
				if (visitNo != val.VisitNo) {
					tbody += "<tr>";
					tbody += "<td style='background:#cdebfd'>" + val.VisitNo + " [" + val.PatientName + "] - " + val.visitDate + " " + "</td>";
					tbody += "<td style='background:#cdebfd;text-align:center' colspan='4'><a class='btn-report' href='#' onclick=DownloadReport('" + val.VisitNo + "')>Chandan Report</a></td>";
					tbody += "<td style='background:#cdebfd;text-align:center' colspan='5'><a href='" + val.OutLab_ReportPath + "' target='_blank' class='btn-report'>EQAS Report</a></td>";
					tbody += "</tr>";
					visitNo = val.VisitNo;
				}
				if (val.read_Status == 'Not Satisfied')
					tbody += "<tr style='#ffb9b9'>";
				else
					tbody += "<tr>";

				tbody += "<td style='display:none'>" + val.AutoId + "</td>";
				tbody += "<td style='display:none'>" + val.ObservationId + "</td>";
				tbody += "<td>" + val.ObservationName + "</td>";
				tbody += "<td>" + val.chandan_reading + "</td>";
				tbody += "<td>" + val.chandan_unit + "</td>";
				tbody += "<td>" + val.chandan_RefRange + "</td>";
				tbody += "<td>" + val.OutLabName + "</td>";
				tbody += "<td>" + val.OutLab_reading + "</td>";
				tbody += "<td>" + val.OutLab_unit + "</td>";
				tbody += "<td>" + val.OutLab_RefRange + "</td>";
				tbody += "<td>" + val.read_Status + "</td>";
				tbody += "</tr>";
			});
			$("#tblEQASAbnormalReport tbody").append(tbody);
			$('#modalAbnormal').modal('show');
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function PrintPDF() {	
	var link = 'https://exprohelp.com/UKNHM/MIS/Print//PrintEQASReportForCMO?Prm1=' + _invoiceNo;
	window.open(link, '_blank');
}
function DownloadReport(visitNo) {
	var url = config.baseUrl + "/api/Report/GetTestIds";
	var objBO = {};
	objBO.VisitNo = visitNo;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				var TestIds = [];
				$.each(data.ResultSet.Table, function (key, val) {
					TestIds.push(val.Test_Id)
				});
				if (TestIds.length == 1)
					TestIds.push(' ');

				//alert('Length : ' + TestIds.length + '\n ID 1 : ' + AllTestIds);
				var link = 'http://chandan.online/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=' + TestIds.join(',') + '&Mobile=1';
				window.open(link, '_blank');
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}