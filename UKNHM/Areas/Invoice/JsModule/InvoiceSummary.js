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
	objBO.Prm1 = '-';
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
						tbody += "<td colspan='10'>Centre Name : " + val.HospitalName + "</td>";
						tbody += "</tr>";
						centre = val.HospitalName
					}
					totalAmount += val.totalAmount;
					totalDiscount += val.totalDiscount;
					amount += val.amount;
					InvoiceAmount += val.InvoiceAmount;					
					EQAS_Deduction += val.EQAS_Deduction;
					AmountTobePaid += val.AmountTobePaid;

					tbody += "<tr>";
					tbody += "<td>" + val.InvoiceMonth.replace('1', '') + "</td>";
					tbody += "<td style='white-space: nowrap'><i class='fa fa-file-pdf-o'>&nbsp;</i><a href='PrintInvoice?InvoiceNo=" + val.InvoiceNo + "' target='_blank'>" + val.InvoiceNo + "</a></td>";
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
					
					tbody += "<td class='text-right'><type style='font-size:8px'>" + val.InvoiceType+'</type> : <b>' + val.InvoiceAmount + "</b></td>";				
					tbody += "<td class='text-right'>" + val.EQAS_Deduction + "</td>";
					tbody += "<td class='text-right'>" + val.AmountTobePaid + "</td>";
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