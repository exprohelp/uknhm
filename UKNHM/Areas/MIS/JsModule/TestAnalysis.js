$(document).ready(function () {
	OnLoad();
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	$("#tblTestAnalysis tbody").on('click', 'button', function () {
		var category = $(this).closest('tr').find('td:eq(0)').data('category');
		var centreid = $(this).closest('tr').find('td:eq(0)').data('centreid');
		selectRow($(this));
		TestWiseDataByCategory(centreid, category);		
	});
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
				//Test Category
				$("#ddlCategory").empty().append($("<option></option>").val("Select").html("Select")).select2();
				$("#ddlCategory").append($("<option selected></option>").val("ALL").html("ALL")).select2();
				$.each(data.ResultSet.Table1, function (key, val) {
					$("#ddlCategory").append($("<option></option>").val(val.testCategory).html(val.testCategory));
				});
				//Test Name
				$("#ddlTestName").empty().append($("<option></option>").val("Select").html("Select")).select2();
				$("#ddlTestName").append($("<option selected></option>").val("ALL").html("ALL")).select2();
				$.each(data.ResultSet.Table2, function (key, val) {
					$("#ddlTestName").append($("<option data-category='" + val.testCategory + "'></option>").val(val.testCode).html(val.testName));
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
	var _testCount = 0;
	$("#tblTestInfo tbody").empty();
	$("#tblTestAnalysis tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#ddlCategory option:selected').val();
	objBO.Prm2 = $('#ddlTestName option:selected').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "CategoryWiseData";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				var tbody = '';
				var centre = '';
				$.each(data.ResultSet.Table, function (key, val) {
			   		if (centre != val.centre_name) {
						var centerTest = 0;
						var centerAmount = 0;					
						//centerTest += val.TestCount;
						//centerAmount += val.Amount;
						centre = val.centre_name;
						$.each(data.ResultSet.Table, function (key, val) {
							if (centre == val.centre_name) {
								centerTest += val.TestCount;
								centerAmount += val.Amount;								
							}
						});
						tbody += "<tr>";
						tbody += "<td style='background:#d3eaff'>" + val.centre_name + "</td>";
						tbody += "<td style='background:#d3eaff;text-align:right'>" + centerTest + "</td>";
						tbody += "<td style='background:#d3eaff;text-align:right'>" + centerAmount.toFixed(2) + "</td>";
						tbody += "<td style='background:#d3eaff;text-align:right'></td>";
						tbody += "</tr>";
					
						$.each(data.ResultSet.Table, function (key, val) {							
							if (centre == val.centre_name) {												
								tbody += "<tr>";
								tbody += "<td data-centreid='" + val.centreId + "' data-category='" + val.testCategory + "'>" + val.testCategory + "</td>";
								tbody += "<td style='text-align:right'>" + val.TestCount + "</td>";
								tbody += "<td style='text-align:right'>" + val.Amount + "</td>";
								tbody += "<td><button class='btndown btn-success'><i class='fa fa-arrow-right'></></button></td>";
								tbody += "</tr>";
								_testCount = _testCount + val.TestCount;
							}
						

						});
					}
				});
				$("#tblTestAnalysis tbody").append(tbody);
				$("#thTotalTestCount").html("Test Count : "+ _testCount);
				
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function TestWiseDataByCategory(centreid, prm1) {
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = centreid;
	objBO.VisitNo = '-';
	objBO.Prm1 = prm1;
	objBO.Prm2 = $('#ddlTestName option:selected').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "TestWiseDataByCategory";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#tblTestInfo tbody").empty();
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

