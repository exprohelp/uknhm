$(document).ready(function () {
	var VisitNo = query()['VisitNo'];
	DiagnosticBookingReportByVisitNo(VisitNo);
});
function DiagnosticBookingReportByVisitNo(VisitNo) {
	//ShowHideLoader("Show");
	var url = config.baseUrl + "/api/MobileApp/DiagnosticBookingReportByVisitNo";
	var objBO = {};
	objBO.VisitNo = VisitNo;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
		success: function (data) {
			if (data != '') {
				$('#divReports').html(data);				
			}
			else {
				$('.header').html('Pending');
			}
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
function DownloadReport(visitNo, TestIds) {
	$('#LineLoader').attr("src", '#');
	var loading = "<a href='#' class='btn btn-info btn-sm fa-pdf'><img width='80' height='5' src='" + config.rootUrl + "/Content/img/loading.gif' />Downloading</a>";
	$('#btnDownload').html(loading)
	var url = config.baseUrl + "/api/MobileApp/DownloadLISReport";
	var objBO = {};
	objBO.VisitNo = visitNo;
    objBO.TestIds = TestIds;
    objBO.RegDate = $('#divReports').find('table:eq(0) tbody').find('tr:eq(2)').find('td:eq(1)').text(); 
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		contentType: "application/json;charset=utf-8",
		dataType: "JSON",
        success: function (data) {
            console.log(data)
			var href = "<a href='" + data + "' target='_blank' class='btn btn-success btn-sm'>ViewReport</a>";
			$('#btnDownload').html(href)
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