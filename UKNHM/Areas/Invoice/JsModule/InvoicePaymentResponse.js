$(document).ready(function () {		
	UpdatePaymentStatus();
});

function UpdatePaymentStatus() {		
	var url = config.baseUrl + "/api/Invoice/Invoice_ReceivedPayInfo";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = '-';
	objBO.ReceiptNo = $("#txtReceiptNo").text();
	objBO.PayMode = 'Online';
	objBO.Amount = $("#txtAmount").text();
	objBO.AccountNo = '-';
	objBO.BankName = '-';
	objBO.ChequeDate = $("#txtPayDate").text();
	objBO.RefNo = '-';
	objBO.Remark = $("#txtPayStatus").text();
	objBO.FilePath = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = 'OnlinePayment';

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
					$('#btnProcess').hide();
					$('#tblBillDetails').show();
					$('#title').show();
				}
				else {
					$('#btnProcess').html('<b>Failed : </b>Receipt No. <b style="color:green">' + objBO.ReceiptNo+'</b> Already Paid or Someting is Wrong. Please Contact Admin.').addClass('text-danger');
				}
			}
			//alert(json.Message);
		}
	}
	UploadDocumentInfo.open('POST', url, true);
	UploadDocumentInfo.send(data);
}




