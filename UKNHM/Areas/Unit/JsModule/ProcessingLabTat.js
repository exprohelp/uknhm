$(document).ready(function () {
	ProcessingLabList();
	FillCurrentDayDateTime()
});

function ProcessingLabList() {
	var url = config.baseUrl + "/api/Unit/UKNHReport";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.from = '-';
	objBO.to = '-';
	objBO.Prm2 = '-';
	objBO.Logic = "ProcessingLabList";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					if (data.ResultSet.Table.length > 0) {
						$("#ddlLab").empty().append($("<option></option>").val("Select").html("Select")).select2();
						$.each(data.ResultSet.Table, function (key, val) {
							$("#ddlLab").append($("<option></option>").val(val.CentreId).html(val.Centre));
						});
					}
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function ProcessingLabTAT() {
	$("#tblTatReport tbody").empty();
	var from = $('#txtFrom').val().replace('T', ' ') + ':00';
	var to = $('#txtTo').val().replace('T', ' ') + ':00';
	var url = config.baseUrl + "/api/Unit/UKNHReport";
	var objBO = {};
	objBO.Prm1 = $('#ddlType option:selected').text();
	objBO.from = from;
	objBO.to = to;
	objBO.Prm2 = $('#ddlLab option:selected').val();
	objBO.Logic = "ProcessingLabTAT:" + objBO.Prm1;
	debugger
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var visitNo = '';
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				if (visitNo != val.VisitNo) {
					tbody += "<tr>";
					tbody += "<td style='background:#cdebfd' colspan='8'>" + val.VisitNo + " [" + val.PNAME + "] " + "</td>";
					tbody += "<tr>";
					visitNo = val.VisitNo;
				}
				tbody += "<tr>";
				tbody += "<tr>";
				tbody += "<td>" + val.HospitalName + "</td>";
				tbody += "<td>" + val.HubName + "</td>";
				tbody += "<td>" + val.ItemName + "</td>";
				tbody += "<td>" + val.RegDate + "</td>";
				tbody += "<td>" + val.LogisticReceiveDate + "</td>";
				tbody += "<td>" + val.DeliveryDate + "</td>";
				tbody += "<td>" + val.ApprovedDate + "</td>";
				if (val.delay == 'Y')
					tbody += "<td style='color:red'>" + val.TAT + "</td>";
				else
					tbody += "<td>" + val.TAT + "</td>";

				tbody += "</tr>";
			});
			$("#tblTatReport tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function FillCurrentDayDateTime() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	var today1 = year + "-" + month + "-" + day + 'T00:00';
	var today2 = year + "-" + month + "-" + day + 'T23:59';
	$("#txtFrom").attr("value", today1);
	$("#txtTo").attr("value", today2);
}
