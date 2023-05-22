$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
});

function RepeatedEntrySummary() {
	$("#tblRepeatedEntry tbody").empty();
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "RepeatedEntrySummary";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {		
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var tbody = '';
					var CentreId = '';
					var regionName = '';
					var districtName = '';
					var count = 0;
					$.each(data.ResultSet.Table, function (key, val) {
						count++;
						if (regionName != val.regionName) {
							tbody += "<tr style='background:#ffc8c8'>";
							tbody += "<td colspan='5'>Region : " + val.regionName + "</td>";
							tbody += "</tr>";
							regionName = val.regionName;
						}
						if (districtName != val.districtName) {
							tbody += "<tr style='background:#fcf6b0'>";
							tbody += "<td colspan='5'>District : " + val.districtName + "</td>";
							tbody += "</tr>";
							districtName = val.districtName;
						}
						tbody += "<tr>";
						tbody += "<td style='display:none'>" + val.centreId + "</td>";
						tbody += "<td>" + count + "</td>";															
						tbody += "<td>" + val.centre_name + "</td>";
						tbody += "<td>" + val.MobileNo + "</td>";
						tbody += "<td>" + val.MonthYear + "</td>";
						tbody += "<td class='text-right'><button class='btn-danger btn-go text-right' onclick=RepeatedEntryInfo(this)>" + val.repeat_EntryCount + "</button></td>";
						tbody += "</tr>";
					});
					$("#tblRepeatedEntry tbody").append(tbody);
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		},
	});
}
function RepeatedEntryInfo(elem) {
	$("#tblRepeatedEntryInfo tbody").empty();
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = $(elem).closest('tr').find('td:eq(0)').text();
	objBO.VisitNo = '-';
	objBO.Prm1 = $(elem).closest('tr').find('td:eq(3)').text();
	objBO.Prm2 = $(elem).closest('tr').find('td:eq(4)').text();
	objBO.from ='1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "RepeatedEntryInfo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {			
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var tbody = '';
					var CentreId = '';
					var regionName = '';
					var districtName = '';
					var centre_name = '';
					var count = 0;
					$.each(data.ResultSet.Table, function (key, val) {
						count++;
						if (regionName != val.regionName) {
							tbody += "<tr style='background:#ffc8c8'>";
							tbody += "<td colspan='6'>Region : " + val.regionName + "</td>";
							tbody += "</tr>";
							regionName = val.regionName;
						}
						if (districtName != val.districtName) {
							tbody += "<tr style='background:#fcf6b0'>";
							tbody += "<td colspan='6'>District : " + val.districtName + "</td>";
							tbody += "</tr>";
							districtName = val.districtName;
						}
						if (centre_name != val.centre_name) {
							tbody += "<tr style='background:#e1e1e1'>";
							tbody += "<td colspan='6'>Centre : " + val.centre_name + "</td>";
							tbody += "</tr>";
							centre_name = val.centre_name;
						}
						tbody += "<tr>";
						tbody += "<td>" + count + "</td>";	
						tbody += "<td>" + val.VisitNo + "</td>";
						tbody += "<td>" + val.PatientName + "</td>";
						tbody += "<td>" + val.MobileNo + "</td>";
						tbody += "<td>" + val.gender + "</td>";
						tbody += "<td>" + val.empName + "</td>";
						tbody += "</tr>";
					});
					$("#tblRepeatedEntryInfo tbody").append(tbody);
					$("#modalRepeatedInfo").modal('show');
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		},
	});
}