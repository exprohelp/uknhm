
var _userId = '';
var _centreId = '';
$(document).ready(function () {
	_userId = sessionStorage.getItem('UserId');	
	_centreId = sessionStorage.getItem('centreId');		
	if (typeof _centreId === 'undefined') {
		alert('Centre Id Not Available. Contact Admin!');
		$('body').css({
			'opacity': '0.5',
			'pointer-events': 'none'
		});
	}
	FillCurrentDate('txtDate');
});
function GetPendency() {
	$('#tblDispatchInfo tbody').empty();
	var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = _centreId;
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtDate').val();
	objBO.to = '1900/01/01';
	objBO.login_id = _userId;
	objBO.Logic = "GetPendencyForDispatch";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {		
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					$('#txtTotalPatient').text(val.totalPatient);
					$('#txtTotalScannedPendency').text(val.totalScanedPendency);
				});
				var tbody = '';
				$.each(data.ResultSet.Table1, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.dispatchNo + "</td>";
					tbody += "<td>" + val.dispatchdate + "</td>";
					tbody += "<td>" + val.totalRecord + "</td>";
					tbody += "</tr>";
				});
				$('#tblDispatchInfo tbody').append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DispatchSample() {
	$('#tblDispatchInfo tbody').empty();
	var url = config.baseUrl + "/api/MobileApp/Dispatch_ReceiveSample";
	var objBO = {};
	objBO.CentreId = _centreId;
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#txtDate').val();	
	objBO.login_id = _userId;
	objBO.Logic = "DispatchSample";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			if (data.includes('Success')) {
				GetPendency();
				alert(data)
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}