$(document).ready(function () {
	OnLoad();
    GetDistrict();
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
});

function GetDistrict() {
    var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
    var objBO = {};
    objBO.DistrictName = '';
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetObservations";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {         
            $("#ddlDistrict").empty().append($("<option></option>").val("ALL").html("ALL")).select2();
            $.each(data.ResultSet.Table1, function (key, val) {
                $("#ddlDistrict").append($("<option></option>").val(val.districtName).html(val.districtName));
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
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
				$("#ddlCentreName").append($("<option></option>").val("ALL").html("ALL")).select2();
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
function TatReport() {
	$("#tblTatReport tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
    objBO.DistrictName = $("#ddlDistrict option:selected").text();
	objBO.CentreType = '-';
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#ddlCategory option:selected').val();
	objBO.Prm2 = $('#ddlTestName option:selected').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "TatReportChandan:UKNHM";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var count =0;
			var visitNo = '';
			var temp = '';
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.centre_name) {
					tbody += "<tr>";
					tbody += "<td style='background:#ffe1b4' colspan='6'>" + val.centre_name + "</td>";
					tbody += "<tr>";
					temp = val.centre_name;
				}
				if (visitNo != val.VisitNo) {
					tbody += "<tr>";
					tbody += "<td style='background:#cdebfd' colspan='6'>" + val.VisitNo + " [" + val.PatientName + "] " + "<span style='float:right;color:red'>" + val.calamityRemark + "</span></td>";						
					tbody += "<tr>";
					visitNo = val.VisitNo;
				}
				count++;
				tbody += "<tr>";
				tbody += "<tr>";
				tbody += "<td>" + val.testName + "</td>";
				tbody += "<td>" + val.RegDate + "</td>";
				tbody += "<td>" + val.dispatchDate + "</td>";
				tbody += "<td>" + val.TargetDateTime + "</td>";
				tbody += "<td>" + val.ReportApproveDate + "</td>";
				if (val.delayFlag == 'Y') {
					tbody += "<td style='background:#f56e6e;color:#fff'>" + val.Tat + "</td>";
				}
				else {
					tbody += "<td>" + val.Tat + "</td>";
				}
				tbody += "</tr>";
			});
			$("#tblTatReport tbody").append(tbody);			
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

