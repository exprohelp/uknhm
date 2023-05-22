var InvoiceNo = '';
$(document).ready(function () {
	InvoiceNo = query()['InvoiceNo'];
	BillDetails(InvoiceNo);
});

function BillDetails(InvoiceNo) {
	$("#tblBillDetails tbody").empty();
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = InvoiceNo;
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.Logic = 'BillDetails';
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
				var count = 0;
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.VisitNo + "</td>";
					tbody += "<td>" + val.visitDate + "</td>";
					tbody += "<td>" + val.PatientName + "</td>";
					tbody += "<td>" + val.Age + "</td>";
					tbody += "<td>" + val.Gender + "</td>";
					tbody += "<td>" + val.PrescribedBy + "</td>";
					tbody += "<td class='text-right'>" + val.BillAmount + "</td>";
					tbody += "<td>" + val.ApproveDate + "</td>";
					tbody += "<td class='text-right'>" + val.ApprAmount + "</td>";
					tbody += "<td>" + val.Investigation + "</td>";
					tbody += "</tr>";
				});
				$('#btnEQAS').prop('name', InvoiceNo+'-EQAS');
				$('#btnUPFRONT').prop('name', InvoiceNo+'-UPFRONT');				

				$("#tblBillDetails tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function PrintPdf(InvoiceNo) {
	var url = 'PrintInvoice?InvoiceNo=' +InvoiceNo;
	window.open(url, '_blank');
}
function DownloadExcel() {
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = InvoiceNo;
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.ReportType = 'XL';
	objBO.Logic = 'BillDetails';
	Global_DownloadExcel(url, objBO, "BillDetails.xlsx");
}
