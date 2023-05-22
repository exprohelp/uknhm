$(document).ready(function () {
	FillCurrentDate('txtFrom');
});


function PatientReport() {
	var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = $('#txtInput').val();
	objBO.Prm1 = $('#txtInput').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "PatientAuditByMobile";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var tbody = "";
			var tbody1 = "";
			var VisitNo = "";
			var total = 0;
			var grandTotal = 0;
			$('#Report').empty();
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					if (VisitNo != val.VisitNo) {
						tbody += '<div class="info">';
						tbody += '<span><b>Name :</b> ' + val.PatientName + '   <b>Visit No :</b> ' + val.VisitNo + '</span>';						
						tbody += '<div class="table table-responsive" style="border:1px solid #ccc;padding: 3px;">';
						tbody += '<table class="table-bordered" id="tblPatientReport" style="width: 100%;">';
						tbody += '<tbody>';
						VisitNo = val.VisitNo;
						total = 0;
						$.each(data.ResultSet.Table, function (key, val) {
							if (VisitNo == val.VisitNo) {
								total += val.netAmount;
								grandTotal += val.netAmount;
								tbody += '<tr>';
								tbody += '<td>' + val.TestName + '</td>';
								tbody += '<td class="text-right" style="width:10%">' + val.netAmount + '</td>';
								tbody += '</tr>';
							}
						});
						tbody += '<tr style="background:#ddd">';
						tbody += '<td>Total Amount</td>';
						tbody += '<td class="text-right">' + total.toFixed(0) + '</td>';
						tbody += '</tr>';
						tbody += '</tbody>';
						tbody += '</table>';
						tbody += '</div></div>';
					}
				});
				tbody1 += '<table class="table-bordered" id="tblPatientReport" style="width: 100%;">';
				tbody1 += '<tr style="background:#ffd4d4">';
				tbody1 += '<td>Total Amount</td>';
				tbody1 += '<td class="text-right">' + grandTotal.toFixed(0) + '</td>';
				tbody1 += '</tr>';
				tbody1 += '</table>';
				tbody = tbody1 + tbody;
				$('#Report').append(tbody);
			
			}
			else {
				//alert('Data Not Found..');
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}

