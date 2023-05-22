$(document).ready(function () {
	FillCurrentMonth('txtFrom');
});


function ApprovalPendency() {
	$("#tblPendingTotal tbody").empty();
	$("#tblPendingInfo tbody").empty();
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
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
	objBO.Logic = "CMS_ApprovalPendency";
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
					Appr = eval(val.TotalCentre) - eval(val.Pending);
					tbody1 += "<tr>";
					tbody1 += "<td style='width: 55%'>" + val.Centre + "</td>";
					tbody1 += "<td class='text-right'>" + val.TotalCentre + "</td>";
					tbody1 += "<td class='text-right'>" + Appr + "</td>";
					tbody1 += "<td class='text-right'>" + val.Pending + "</td>";
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
					Appr1 = eval(val.Total) - eval(val.CMS_Pend);
					if (val.CMS_Pend == 0) tbody += "<tr style='background:#d5ffc4'>"; else tbody += "<tr>";
				
					tbody += "<td>" + val.CentreName + "</td>";
					tbody += "<td class='text-right'>" + val.Total + "</td>";
					tbody += "<td class='text-right'>" + Appr1 + "</td>";
					tbody += "<td class='text-right'>" + val.CMS_Pend + "</td>";
					tbody += "</tr>";
					Appr1=0;
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