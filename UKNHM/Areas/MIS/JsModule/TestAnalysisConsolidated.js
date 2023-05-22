$(document).ready(function () {
	OnLoad();
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
});
function OnLoad() {
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "OnLoadForTestAnalysis";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				//Center Name
				$("#ddlCentreName").empty().append($("<option></option>").val("Select").html("Select")).select2();
				$("#ddlCentreName").append($("<option selected></option>").val("ALL").html("ALL")).select2();
				$.each(data.ResultSet.Table, function (key, val) {
					$("#ddlCentreName").append($("<option></option>").val(val.centreId).html(val.centre_name));
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetTestByCategory() {
	var url = config.baseUrl + "/api/Report/MasterQueries";
	var objBO = {};
	objBO.Prm1 = $('#ddlCategory option:selected').text();
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetTestByCategory";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$("#ddlTestName").empty().append($("<option></option>").val("Select").html("Select")).select2();
				$("#ddlTestName").append($("<option></option>").val("ALL").html("ALL")).select2();
				$.each(data.ResultSet.Table, function (key, val) {
					$("#ddlTestName").append($("<option data-category='" + val.testCategory + "'></option>").val(val.testCode).html(val.testName));
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function CategoryWiseData() {
	$("#tblTestInfo tbody").empty();
	$("#tblTestAnalysis tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "CategoryWiseConsolidated";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			if (data.ResultSet.Table.length > 0) {
				var tbody = '';
				$.each(data.ResultSet.Table, function (key, val) {
					tbody += "<tr>";
					tbody += "<td>" + val.testCategory + "</td>";
					tbody += "<td style='text-align:right'>" + val.TestCount + "</td>";
					tbody += "<td style='text-align:right'>" + val.Amount + "</td>";
					tbody += "<td><button class='btndown btn-success' data-category='" + val.testCategory + "' onclick=selectRow('this');TestWiseDataByCategory(this)><i class='fa fa-arrow-right'></></button></td>";
					tbody += "</tr>";
				});
				$("#tblTestAnalysis tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function TestWiseDataByCategory(elem) {
	$("#tblTestInfo tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = $(elem).data('category');
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "TestCategoryConsolidated";	
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				tbody += "<tr>";
				tbody += "<td>" + val.testName + "</td>";
				tbody += "<td class='text-right'>" + val.TestCount + "</td>";
				tbody += "<td class='text-right'>" + val.Amount + "</td>";
				tbody += "</tr>";
			});
			$("#tblTestInfo tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

