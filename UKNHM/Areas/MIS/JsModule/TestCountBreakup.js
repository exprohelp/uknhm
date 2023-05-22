$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
});


function TestCountBreackup() {
	$("#tblPendingTotal tbody").empty();
	$("#tblPendingInfo tbody").empty();
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "TestCountBreackupByTime";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var tbody1 = '';
			var tbody = '';
			var temp = '';
			var Appr = 0;
			var Appr1 = 0;
			if (Object.keys(data.ResultSet).length > 0) {

				$.each(data.ResultSet.Table, function (key, val) {					
					tbody1 += "<tr>";
					tbody1 += "<td style='width: 55%'>" + val.centre_name + "</td>";
					tbody1 += "<td class='text-right'>" + val.TestCountBefore2pm + "</td>";
					tbody1 += "<td class='text-right'>" + val.TestCountAfter2pm + "</td>";				
					tbody1 += "</tr>";
				});
				$("#tblPendingTotal tbody").append(tbody1);
				$.each(data.ResultSet.Table1, function (key, val) {
					if (temp != val.districtName) {
						tbody += "<tr style='background:#cbf3ff'>";
						tbody += "<td colspan='4'>" + val.districtName + "</td>";
						tbody += "</tr>";
						temp = val.districtName;
					}
					tbody += "<tr>";
					tbody += "<td>" + val.centre_name + "</td>";
					tbody += "<td class='text-right'>" + val.TestCountBefore2pm + "</td>";
					tbody += "<td class='text-right'>" + val.TestCountAfter2pm + "</td>";				
					tbody += "</tr>";
					Appr1 = 0;
				});
				$("#tblPendingInfo tbody").append(tbody);
			}
			else {
				alert('No Record Found.');
			}
		},
		complete: function () {
			var th0 = $("#tblPendingTotal thead th:eq(0)").width() + 11;
			console.log(th0)
			$("#tblPendingInfo thead tr:eq(1) th:eq(0)").css('width', th0 + 'px');
			$("#tblPendingInfo tbody td:eq(0)").css('width', th0 + 'px');
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}