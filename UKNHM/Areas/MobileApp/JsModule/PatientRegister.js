$(document).ready(function () {
	FillCurrentDate('txtFrom')
});

function PatientRegister() {
	$('#tblPatientRegister tbody').empty();
	var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = sessionStorage.getItem('centreId');
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "PatientRegister";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var tbody = "";
			var VisitNo = "";
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					//if (VisitNo != val.VisitNo) {
					//	tbody += '<tr>';
					//	tbody += '<td>' + val.VisitNo + '</td>';					
					//	tbody += '</tr>';
					//	VisitNo = val.VisitNo;
					//}
					tbody += '<tr>';
					tbody += '<td class="bg">' + val.VisitNo + '</td>';
					tbody += '<td class="bg">' + val.PatientName + '</td>';
					tbody += '</tr>';
					tbody += '<tr>';
					tbody += '<td colspan="2">' + val.TestName + '</td>';
					tbody += '</tr>';
				});
				$('#tblPatientRegister tbody').append(tbody);
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
