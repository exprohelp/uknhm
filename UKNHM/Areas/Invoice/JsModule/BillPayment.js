$(document).ready(function () {
	DistrictList();
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	FillCurrentDate('txtChequeDate');
	$("#ddlpayMode").on('change', function () {
		var val = $(this).find('option:selected').text();
		if (val == 'Online') {
			$('#btnPay').show();
			$('#payInfo').addClass('Inactive');
		}
		else {
			$('#btnPay').hide();
			$('#payInfo').removeClass('Inactive');
		}
	});
	$("#FileUpload").on('change', function () {
		var myFileInput = document.querySelector('input[type="file"]');
		var name = myFileInput.files[0].name;
		$("#txtFileName").text(name);
	});
	$("#btnFileUpload").on('click', function () {
		$("#FileUpload").trigger('click');
	});
	$("#tblBillInfo tbody").on('change', 'input:checkbox', function () {
		var IsCheck = $(this).is(':checked');
		var InvoiceNo = $(this).closest('tr').find('td:eq(0)').text();
		var totalAmount = $(this).closest('tr').find('td:eq(2)').text();
		var InvoiceMonth = $(this).closest('tr').find('td:eq(3)').text();
		var tbody = '';
		if (IsCheck) {
			tbody += "<tr>";
			tbody += "<td>" + InvoiceNo + "</td>";
			tbody += "<td class='text-right'>" + totalAmount + "</td>";
			tbody += "<td>" + InvoiceMonth + "</td>";
			tbody += "</tr>";
			$("#tblSelectedBillInfo tbody").append(tbody);
			GenReceiptNo();
		}
		else {
			$("#tblSelectedBillInfo tbody tr").each(function () {
				if ($(this).find('td:eq(0)').text() == InvoiceNo) {
					$(this).closest('tr').remove();
				}
			});
		}
		totalSelectedAmt();
	});
});
function MakePayment(ReceiptNo, Name, Amount) {
	Amount = '1';
	var link = 'MakePayment?ReceiptNo=' + ReceiptNo + '&Name=' + Name + '&Amount=' + Amount;
	window.open(link, '_blank');
	$(this).nextUntil('.group').find('tr').remove();
}
function GenReceiptNo() {
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = '-';
	objBO.ReceiptNo = $("#txtReceiptNo").val();
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Logic = 'GenReceiptNo';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var centreName = '';
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					$("#txtReceiptNo").val(val.ReceiptNo);
				});

			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DistrictList() {
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = '-';
	objBO.ReceiptNo = '-';
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Logic = 'DistrictList';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#ddlDistrict").empty().append($("<option></option>").val("ALL").html("ALL")).select2();
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					$('#ddlDistrict').append($('<option></option>').val(val.districtName).html(val.districtName));
				});

			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function BillInfo() {
	if ($('#ddlDistrict option:selected').text() == 'ALL') {
		alert('Please Select District');
		return;
	}
	$("#tblSelectedBillInfo tbody").empty();
	$("#tblBillInfo tbody").empty();
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = '-';
	objBO.Prm1 = $('#ddlDistrict option:selected').text();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.Logic = 'BillInfoForPayment';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var centreName = '';
			if (data.ResultSet.Table.length > 0) {
				var tbody = '';
				var centre = '';
				$.each(data.ResultSet.Table, function (key, val) {
					if (centre != val.centre_name) {
						tbody += "<tr style='background:#c6e5ff'>";
						tbody += "<td colspan='10'>Centre Name : " + val.centre_name + "";
						tbody += "<a class='btn btn-warning btn-xs pull-right' href='BillDetails?InvoiceNo=" + val.MasterInvoiceNo + "' target='_blank'>Print Invoice " + val.InvoiceMonth.replace('1', '') + "</a></td>";

						tbody += "</tr>";
						centre = val.centre_name
					}
					if (val.IsPaid == 'Y')
						tbody += "<tr style=' background:#d1f3d1'>";
					else
						tbody += "<tr>";

					tbody += "<td>" + val.InvoiceNo + "</td>";
					tbody += "<td>" + val.InvoiceType + "</td>";
					tbody += "<td class='text-right'>" + val.InvoiceAmount + "</td>";
					tbody += "<td>" + val.InvoiceMonth.replace('1', '') + "</td>";
					if (val.IsPaid == 'Y')
						tbody += "<td>-</td>";
					else
						tbody += "<td><input type='checkbox'></td>";

					tbody += "</tr>";
				});
				$("#tblBillInfo tbody").append(tbody);
				totalSelectedAmt();
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ReceivedPayInfo() {
	if (validation()) {
		var InvoiceNos = [];
		$('#tblSelectedBillInfo tbody tr').each(function () {
			InvoiceNos.push($(this).find('td:eq(0)').text());
		});
		if (!InvoiceNos.length > 0) {
			alert('Please Select Invoice.');
			return;
		}
		var waiting = "<img src='/content/img/waiting.gif' style='width:15px'/>&nbsp;Submitting.."
		$('#btnSave').html(waiting).prop('disabled', true);
		var url = config.baseUrl + "/api/Invoice/InvoiceReceivedPayInfo";
		var objBO = {};

		objBO.CentreId = '-';
		objBO.InvoiceNo = InvoiceNos.join('|');
		objBO.ReceiptNo = '-';
		objBO.PayMode = $('#ddlpayMode option:selected').text();
		objBO.Amount = parseFloat($('#txtTotalSelectedAmt').val());
		objBO.TDSAmount = parseFloat($('#txtTDSAmount').val());
		objBO.AccountNo = $('#txtAccountNo').val();
		objBO.BankName ='-';
		objBO.ChequeDate = $('#txtChequeDate').val();
		objBO.RefNo = $('#txtReferenceNo').val();
		objBO.Remark = $('#txtRemark').val();
		objBO.FilePath = '-';
		objBO.login_id = Active.userId;
		objBO.Logic = 'CheckPayment';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {			
				if (data.includes('Success')) {				
					$('#btnSave').prop('disabled', false);
					$('#btnSave').html('Submit');
					BillInfo();
					alert('Successfully Payment');
					clear();
					$('#tblSelectedBillInfo tbody').empty();
					totalSelectedAmt();		
					//$('#payInfo').addClass('Inactive');
				}
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function PaymentReceiptGen() {
	var InvoiceNos = [];
	$('#tblSelectedBillInfo tbody tr').each(function () {
		InvoiceNos.push($(this).find('td:eq(0)').text());
	});
	if (!InvoiceNos.length > 0) {
		alert('Please Select Invoice.');
		return;
	}
	var waiting = "<img src='/content/img/waiting.gif' style='width:15px'/>&nbsp;Paying.."
	$('#btnPay').html(waiting).prop('disabled', true);
	var url = config.baseUrl + "/api/Invoice/Invoice_ReceivedPayInfo";
	var objBO = {};

	objBO.CentreId = '-';
	objBO.InvoiceNo = InvoiceNos.join('|');
	objBO.ReceiptNo = $("#txtReceiptNo").val();
	objBO.PayMode = $('#ddlpayMode option:selected').text();
	objBO.Amount = parseFloat($('#txtTotalSelectedAmt').val());
	objBO.AccountNo = '-';
	objBO.BankName = '-';
	objBO.ChequeDate = '1900/01/01';
	objBO.RefNo = '-';
	objBO.Remark = '-';
	objBO.FilePath = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'UpdateReceiptNoByInvoice';

	var UploadDocumentInfo = new XMLHttpRequest();
	var data = new FormData();
	data.append('obj', JSON.stringify(objBO));
	data.append('ImageByte', $('input[id=FileUpload]')[0].files[0]);
	UploadDocumentInfo.onreadystatechange = function () {
		if (UploadDocumentInfo.status) {
			if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
				var json = JSON.parse(UploadDocumentInfo.responseText);
				console.log(json.Message)
				if (json.Message.includes('Success')) {
					$('#btnPay').text('Pay Now').prop('disabled', false);
					MakePayment(objBO.ReceiptNo, Active.userName, objBO.Amount);
					//$('#tblSelectedBillInfo tbody').empty();
					//$('#txtTotalSelectedAmt').val('');					
				}
				else {
					alert('Already Paid receipt No =' + objBO.ReceiptNo);
					$('#btnPay').text('Pay Now').prop('disabled', true);
				}
			}
		}
	}
	UploadDocumentInfo.open('POST', url, true);
	UploadDocumentInfo.send(data);
}
function totalSelectedAmt() {
	var total = 0;
	$("#tblSelectedBillInfo tbody tr").each(function () {
		total += parseFloat($(this).find('td:eq(1)').text());
	});
	$("#txtTotalSelectedAmt").val(total.toFixed(2));
}
function clear() {
	$('input:text').val('');
	FillCurrentDate('txtChequeDate');
	$('textarea').val
	$("#txtReceiptNo").val('New');
}
function validation() {
	var payMode = $('#ddlpayMode option:selected').text();
	var bankName = $('#ddlBankName option:selected').text();
	var accountNo = $('#txtAccountNo').val();
	var chequeDate = $('#txtChequeDate').val();
	var referenceNo = $('#txtReferenceNo').val();
	var remark = $('#txtRemark').val();

	if (payMode == 'Select') {
		alert('Please Choose Pay Mode.');
		$('span.selection').find('span[aria-labelledby=select2-ddlpayMode-container]').css({ 'border-color': 'red' }).focus();
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlpayMode-container]').removeAttr('style');
	}
	if (bankName == 'Select') {
		alert('Please Choose Pay Mode.');
		$('span.selection').find('span[aria-labelledby=select2-ddlBankName-container]').css({ 'border-color': 'red' }).focus();
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlBankName-container]').removeAttr('style');
	}
	if (accountNo == '') {
		alert('Please Provide Account No.');
		$('#txtAccountNo').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtAccountNo').removeAttr('style');
	}
	if (chequeDate == '') {
		alert('Please Choose Cheque Date.');
		$('#txtChequeDate').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtChequeDate').removeAttr('style');
	}
	if (referenceNo == '') {
		alert('Please Choose Reference No.');
		$('#txtReferenceNo').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtReferenceNo').removeAttr('style');
	}
	if (remark == '') {
		alert('Please Provide Remark.');
		$('#txtRemark').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtRemark').removeAttr('style');
	}
	return true;
}



