$(document).ready(function () {
	FillCurrentMonth('txtMonth');
	maxPrevMonth('txtMonth');
});
function CentreWorkToGenInvoice() {
	$("#tblInvoiceInfo tbody").empty();
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.InvoiceNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtMonth').val() + '-01';
	objBO.to = $('#txtMonth').val() + '-01';
	objBO.Logic = 'CentreWorkToGenInvoice';
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
				var region = '';
				var temp = '';
				var netAmount = 0;
				var invoiceAmount = 0;
				$.each(data.ResultSet.Table, function (key, val) {
					netAmount += val.netAmount;
					invoiceAmount += val.InvoiceAmount;
					if (region != val.regionName) {
						tbody += "<tr style='background:#c6e5ff'>";
						tbody += "<td colspan='6'>" + val.regionName + "</td>";
						tbody += "</tr>";
						region = val.regionName
					}
					if (temp != val.districtName) {
						tbody += "<tr style='background:#ffe4be'>";
						tbody += "<td colspan='6'>" + val.districtName + "</td>";
						tbody += "</tr>";
						temp = val.districtName
                    }
                    if (eval(val.InvoiceAmount) > 0 && (eval(val.netAmount) != eval(val.InvoiceAmount)))
                        tbody += "<tr style='background:#ffa6a6'>";
                    else
                        tbody += "<tr>";
                    
					tbody += "<td>" + val.centre_name + "</td>";
					tbody += "<td class='text-right'>" + val.cmsPeding + "</td>";
					tbody += "<td class='text-right'>" + val.netAmount + "</td>";
					if (eval(val.cmsPeding) == 0 && val.MasterInvoiceNo == 'Not Generated')
                        tbody += "<td><button class='btn-success' data-logic='CentreWorkToGenInvoice' onclick=GeneratedInvoiceOfMonth('" + val.centreid + "',this)>Gen Innvoice</button></td>";
					else
						tbody += "<td><button disabled style='opacity: 0.4;' class='btn-success'>Gen Innvoice</button></td>";

					if (val.MasterInvoiceNo != 'Not Generated')
						tbody += "<td><a class='btn btn-warning btn-xs pull-left' href='BillDetails?InvoiceNo=" + val.MasterInvoiceNo + "' target='_blank'>" + val.MasterInvoiceNo + "</a></td>";						
						else
						tbody += "<td>" + val.MasterInvoiceNo + "</td>";

                    if (eval(val.InvoiceAmount) > 0 && (eval(val.netAmount) != eval(val.InvoiceAmount)))
                        tbody += "<td class='text-right'>" + val.InvoiceAmount + "&nbsp;<button class='btn-success' data-logic='Re-GenInvoice' onclick=GeneratedInvoiceOfMonth('" + val.centreid + "',this)>Re-GenInnvoice</button></td>";
                    else
                        tbody += "<td class='text-right'>" + val.InvoiceAmount + "</td>";

					tbody += "</tr>";
				});
				tbody += "<th class='text-right'>Total</th>";
				tbody += "<th class='text-right' colspan='2'>" + netAmount.toFixed(2) + "</th>";
				tbody += "<th class='text-right' colspan='3'>" + invoiceAmount.toFixed(2) + "</th>";
				$("#tblInvoiceInfo tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GeneratedInvoiceOfMonth(CentreId, elem) {
	var url = config.baseUrl + "/api/Invoice/GenerateInvoiceofMonth";
	var objBO = {};
	objBO.CentreId = CentreId;
	objBO.MonthDate = $('#txtMonth').val() + '-01';
    objBO.Logic = $(elem).data('logic');
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			if (data.includes('success')) {
				GetInvoiceOfMonth(CentreId, elem);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetInvoiceOfMonth(CentreId, elem) {	
	var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
	var objBO = {};
	objBO.CentreId = CentreId;
	objBO.InvoiceNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtMonth').val() + '-01';
	objBO.to = $('#txtMonth').val() + '-01';
	objBO.Logic = 'GetInvoiceOfMonth';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					$(elem).closest('tr').find('td:eq(3)').find('button').prop('disabled', true).css('opacity', '0.4');
					//var td = "<i class='fa fa-eye'>&nbsp;</i><a href='BillDetails?InvoiceNo=" + val.InvoiceNo + "' target='_blank'>" + val.InvoiceNo + "</a>";				
					$(elem).closest('tr').find('td:eq(4)').html("<a class='btn btn-warning btn-xs pull-left' href='BillDetails?InvoiceNo=" + val.MasterInvoiceNo + "' target='_blank'>" + val.MasterInvoiceNo + "</a>");
                    $(elem).closest('tr').find('td:eq(5)').text(val.InvoiceAmount);
                    var netAmount = $(elem).closest('tr').find('td:eq(2)').text();
                    if (eval(val.InvoiceAmount) > 0 && (eval(netAmount) != eval(val.InvoiceAmount)))
                        $(elem).closest('tr').css('background','#ffa6a6');                                       
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}