$(document).ready(function () {
	//CloseSidebar();
	FillCurrentMonth('txtFrom');
	GetCenter();

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
function InvoiceList(logic) {
	$("#tblInvoiceSummary tbody").empty();
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.InvoiceNo = '-';
	objBO.Prm1 = $('#ddlRegion option:selected').text();
	objBO.from = $('#txtFrom').val() + '-01';
	objBO.to = '1900/01/01';
	objBO.Logic = logic;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var centreName = '';
			var invoiceTotal = 0;
			var deductionTotal = 0;
			var regionName = '';
			var districtName = '';
			if (data.ResultSet.Table.length > 0) {
				var tbody = '';				
				$.each(data.ResultSet.Table, function (key, val) {
					//if (regionName != val.regionName) {
					//	tbody += "<tr>";
					//	tbody += "<td style='background:#ddd946' colspan='9'>Region : " + val.regionName + "</td>";
					//	tbody += "</tr>";
					//	regionName = val.regionName;
					//}
					if (districtName != val.districtName) {
						tbody += "<tr>";
						tbody += "<td style='background:#f9b9b8' colspan='9'>District : " + val.districtName + "</td>";
						tbody += "</tr>";
						districtName = val.districtName;
					}
					invoiceTotal += val.InvoiceAmount;
					deductionTotal += val.EQAS_Deduction;
					if (eval(val.EQAS_VerifyDate!=null))
						tbody += "<tr style='background:#12bbb385'>";
					else
						tbody += "<tr>";

					tbody += "<td style='display:none'>" + val.MasterInvoiceNo + "</td>";
					tbody += "<td style='display:none'>" + val.InvoiceNo + "</td>";
					tbody += "<td>" + val.InvoiceMonth.replace('1', '') + "</td>";
					tbody += "<td style='white-space: nowrap'><i class='fa fa-file-pdf-o'>&nbsp;</i><a href='PrintInvoice?InvoiceNo=" + val.InvoiceNo + "' target='_blank'>" + val.InvoiceNo + "</a></td>";
					tbody += "<td>" + val.HospitalName + "</td>";					
					tbody += "<td class='text-right'><b>" + val.InvoiceAmount + "</b></td>";
					tbody += "<td class='text-right'>";
					if (parseInt(val.not_satisfied_count) >0)
						tbody += "<button onclick=EQASAbnormalReport('" + val.MasterInvoiceNo + "') class='btn btn-warning btn-xs'>" + val.not_satisfied_count + "</button>";
					else
						tbody += "<button onclick=EQASAbnormalReport('" + val.MasterInvoiceNo + "') class='btn btn-default btn-xs'>" + val.not_satisfied_count + "</button>";
					if (eval(val.EQAS_VerifyDate !=null)) {
						tbody += "<button class='btn btn-danger btn-xs' disabled onclick=CalEQASDeduct(this)>Deduct</button></td>";
					}
					else {
						tbody += "<button class='btn btn-danger btn-xs' onclick=CalEQASDeduct(this)>Deduct</button></td>";
					}
					tbody += "<td class='flex'><input type='text' class='form-control' value=" + val.EQAS_Deduction + " readonly='readonly' style='height: 20px;width: 60%;'/>";
				if (eval(val.not_satisfied_count) > 0 || val.EQAS_VerifyDate!=null) {
						tbody += "&nbsp;<button id='btnVerify' class='btn btn-success btn-xs' disabled onclick=EQASDeductionEntry(this)><i class='fa fa-check-circle'>&nbsp;</i>Verify</button></td>";
					}
					else {
					tbody += "&nbsp;<button id='btnVerify' class='btn btn-success btn-xs' onclick=EQASDeductionEntry(this)><i class='fa fa-check-circle'>&nbsp;</i>Verify</button></td>";
					}
					tbody += "</tr>";
				});
				tbody += "<tr>";
				tbody += "<td colspan='2' class='text-right'><b>Total</b></td>";			
				tbody += "<td></td>";
				tbody += "<td class='text-right'><b>" + invoiceTotal.toFixed(2) + "</b></td>";
				tbody += "<td></td>";
				tbody += "<td class='text-left'><b>" + deductionTotal.toFixed(2) +"</b></td>";	
				tbody += "</tr>";
				$("#tblInvoiceSummary tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function CalEQASDeduct(elem) {
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = $(elem).closest('tr').find('td:eq(0)').text();
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Logic = 'CalEQASDeduct';	
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {			
			$.each(data.ResultSet.Table, function (key, val) {			
				$(elem).closest('tr').find('td:nth-last-child(1)').find('input:text').val(val.deduction);				
				$(elem).closest('tr').find('td:nth-last-child(1)').find('button').prop('disabled',false);				
			}); 
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function EQASAbnormalReport(invoiceNo) {
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
					tbody += "<td style='background:#cdebfd;text-align:center' colspan='4'><a class='btn-report' onclick=DownloadReport('192.168.0.21')>Chandan Report</a></td>";
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
function DownloadReport(logic) {
	var url = config.baseUrl + "/api/Report/GetTestIds";
	var objBO = {};
	objBO.VisitNo = $('#txtInvoiceNo').text();
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
				var link = 'http://' + logic + '/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=' + TestIds.join(',') + '&Mobile=1';
				window.open(link, '_blank');
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function EQASDeductionEntry(elem) {
	var url = config.baseUrl + "/api/Report/EQAS_InsertEQASInfo";
	var objBO = {};
	objBO.ObservationId = $(elem).closest('tr').find('td:eq(1)').text();
		objBO.Prm1 = $(elem).closest('tr').find('td:nth-last-child(1)').find('input:text').val();
	objBO.login_id = Active.userId,
		objBO.Logic = 'EQASDeductionEntry';
	var UploadDocumentInfo = new XMLHttpRequest();
	var data = new FormData();
	data.append('obj', JSON.stringify(objBO));
	data.append('ImageByte', null);
	UploadDocumentInfo.onreadystatechange = function () {
		if (UploadDocumentInfo.status) {
			if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
				var json = JSON.parse(UploadDocumentInfo.responseText);				
				if (json.Message.includes('Success')) {
					$(elem).closest('tr').find('td:nth-last-child(1)').find('input:text').val('');
					$(elem).closest('tr').css('background', '#12bbb385').find('td:nth-last-child(1)').find('button').prop('disabled',true);
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