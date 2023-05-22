$(document).ready(function () {
	FillCurrentDate('txtFrom');
});


function PatientReport(logic) {
	var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
	var objBO = {};
	objBO.LabCode = '-';//test
	objBO.CentreId = sessionStorage.getItem('centreId');//HIStw
	objBO.VisitNo = $('#txtInput').val();
	objBO.Prm1 = $('#txtInput').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = logic;
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
			$('#Report').empty();
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					if (VisitNo != val.VisitNo) {
						tbody += '<div class="info">';
						tbody += '<span><b>Name :</b> ' + val.PatientName + '   <b>Visit No :</b> ' + val.VisitNo + '</span>';
						tbody += '<download><button class="btn-primary btn-xs bn1 pull-left" onclick=DownloadReport("' + val.VisitNo + '")>Download</button><div class="flex pull-right"><input id="txtMobileNo" maxlength="10" class="bn" placeholder="Mobile No." type="text" value=' + val.MobileNo + ' style="width:66%"/><button style="width:34%" data-visitno=' + val.VisitNo + ' onclick=SendReportDownloadLink(this) class="btn-primary btn-xs bn1 pull-left">Send Report</button></div></download>';
						tbody += '<div class="table table-responsive" style="border:1px solid #ccc;padding: 3px;">';
						tbody += '<table class="table-bordered" id="tblPatientReport" style="width: 100%;">';
						tbody += '<tbody>';
						VisitNo = val.VisitNo;
						$.each(data.ResultSet.Table, function (key, val) {
							if (VisitNo == val.VisitNo) {
								tbody += '<tr>';
								tbody += '<td>' + val.TestName + '</td>';
								tbody += '<td style="width:10%">' + val.status + '</td>';
								tbody += '</tr>';
							}
						});
						tbody += '</tbody>';
						tbody += '</table>';
						tbody += '</div></div>';
					}
				});
				$('#Report').append(tbody);
				$('#txtInput').val('');
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
function DownloadReport(visitNo) {
	window.location.href = config.rootUrl + "/mobileApp/App/dpr?VisitNo=" + visitNo
}
function SendReportDownloadLink(elem) {
	var url = config.baseUrl + "/api/MobileApp/SendReportDownloadLink";
	var objBO = {};
	objBO.MobileNo = $(elem).siblings('input').val();
	objBO.Prm1 = $(elem).data('visitno');
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			if (data.includes('success'))
				alert(data)
			else
				alert(data)
		},
		complete: function (res) {
			//ShowHideLoader("Hide");
		},
		error: function (response) {
			alert('Server Error...!');
			//ShowHideLoader("Hide");
		}
	});
}
