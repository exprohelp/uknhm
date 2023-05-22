$(document).ready(function () {
	GetOTPByPass();
});

function GetOTPByPass() {
	$('#tblControl tbody').empty();	
	var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "OTPByPassForPatientRegister";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var tbody = "";
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";				
                    tbody += "<td class='hide'>" + val.AutoId +"</td>";
					tbody += "<th>" + val.control_name +"</th>";
					tbody += "<th>:</th>";
					tbody += "<th>";
					tbody += "<label class='switch'>";
                    tbody += "<input type='checkbox' data-logic='OTPByPassMarking' onchange=OTPByPassMarking(this) class='IsActive' id='chkActive' " + val.checked + ">";
					tbody += "<span class='slider round'></span>";
					tbody += "</th>";
					tbody += "</tr>";
				});				
				$('#tblControl tbody').append(tbody);
            }
            if (data.ResultSet.Table2.length > 0) {
                var tbody1 = "";
                tbody1 += "<tr>";
                tbody1 += "<th style='background:#fff7bf' colspan='3'>SMS Providers</th>";
                tbody1 += "</tr>";
                $.each(data.ResultSet.Table2, function (key, val) {
                    tbody1 += "<tr>";
                    tbody1 += "<td class='hide'>" + val.AutoId + "</td>";
                    tbody1 += "<th>" + val.SMSProviderName + "</th>";
                    tbody1 += "<th>:</th>";
                    tbody1 += "<th>";
                    tbody1 += "<label class='switch'>";
                    tbody1 += "<input type='checkbox' data-logic='SMSByPassMarking' onchange=OTPByPassMarking(this) class='IsActive' id='chkActive' " + val.checked + ">";
                    tbody1 += "<span class='slider round'></span>";
                    tbody1 += "</th>";
                    tbody1 += "</tr>";
                });
                $('#tblControl tbody').append(tbody1);
            }
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}
function OTPByPassMarking(elem) {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
    var objBO = {};
    objBO.Prm1 = $(elem).closest('tr').find('td:eq(0)').text();
    objBO.Logic = $(elem).data('logic');
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			GetOTPByPass();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}