$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	$("#tblTestInfo tbody").on('keyup', 'input:text', function () {
		var barcode = $(this).closest('tr').find('td:eq(3)').text();
		var scanBarcode = $(this).val();
		if (barcode == scanBarcode) {
			ReceiveByBarcodeNo(barcode);
		}
	});

});
function GetSampleForDispatch() {
	$("#tblSampleInfo tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "GetSampleForDispatch";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				var temp = '';
				var tbody = '';
				$.each(data.ResultSet.Table, function (key, val) {
					if (temp != val.centre_name) {
						tbody += "<tr>";
						tbody += "<td style='background:#cdebfd' colspan='8'>" + val.centre_name + "</td>";
						tbody += "<tr>";
						temp = val.centre_name;
                    }
                    if (val.IsRcv=='Y')
                        tbody += "<tr style='background:#9cd99c'>";				
                    else tbody += "<tr>";
					tbody += "<td>" + val.dispatchNo + "</td>";
					tbody += "<td>" + val.dispatchdate + "</td>";
					tbody += "<td class='text-right'>" + val.totalRecord + "</td>";
					tbody += "<td><button class='btn btn-warning btn-xs' onclick=selectRow(this);GetTestInfo('" + val.dispatchNo + "')><i class='fa fa-sign-in'></i></button></td>";
					tbody += "</tr>";
				});
				$("#tblSampleInfo tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetTestInfo(dispatchNo) {
	$("#tblTestInfo tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = dispatchNo;
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetTestInfoByDispatchNo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				var tbody = '';
				$.each(data.ResultSet.Table, function (key, val) {
					if (val.hub_ReceivedDate != null)
						tbody += "<tr class='received'>";
					else
						tbody += "<tr>";

					tbody += "<td>" + val.VisitNo + "</td>";
					tbody += "<td>" + val.PatientName + "</td>";
					tbody += "<td>" + val.Investigation + "</td>";
					tbody += "<td>" + val.barcode_no + "</td>";
					tbody += "<td><input type='text'  style='width: 99%' disabled placeholder='Scan Barcode'/></td>";
					tbody += "</tr>";
				});
				$("#tblTestInfo tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ReceiveByDispatchNo() {
	if (confirm('Are you sure to Receive?')) {
		var url = config.baseUrl + "/api/MobileApp/Dispatch_ReceiveSample";
		var objBO = {};
		objBO.CentreId = '-';
		objBO.DispatchNo = $('#tblSampleInfo tbody tr.select-row').find('td:eq(0)').text();
		objBO.VisitNo = '-';
		objBO.Prm1 = '1900/01/01';
		objBO.login_id = Active.userId;
		objBO.Logic = "ReceiveSample";
		if (!objBO.DispatchNo.length > 0) {
			alert('Dispatch No Not Find.')
			return;
		}
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				console.log(data);
				if (data.includes('Success')) {
					alert(data);
					$('#tblTestInfo tbody tr').addClass('received');
				}
			},
			error: function (response) {
				alert('Server Error...!');
			}
		});
	}
}
function ReceiveByBarcodeNo(sampleNo) {	
	var url = config.baseUrl + "/api/MobileApp/Dispatch_ReceiveSample";
	var objBO = {};
	objBO.CentreId = '-';
	objBO.DispatchNo = '-';
	objBO.SampleNo = sampleNo;
	objBO.VisitNo = '-';
	objBO.Prm1 = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "ReceiveSampleByBarcodeNo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			if (data.includes('Success')) {
				alert(data);
				$('#tblTestInfo tbody tr').each(function () {
					if ($(this).find('td:eq(3)').text() == sampleNo)
						$(this).addClass('received');
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}