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
function TatReport(centerId) {
	$("#tblTatReport tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = centerId;
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#ddlCategory option:selected').val();
	objBO.Prm2 = $('#ddlTestName option:selected').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "TatReport:UKNHM";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var visitNo = '';
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				if (visitNo != val.VisitNo) {
					tbody += "<tr>";
					tbody += "<td style='background:#cdebfd' colspan='6'>" + val.VisitNo + " [" + val.PatientName + "] " + "<span style='float:right;color:red'>" + val.calamityRemark+"</span></td>";					
					tbody += "<tr>";
					visitNo = val.VisitNo;
				}		
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
			$("#modalTatInfo").modal('show');
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DelayedTestList(centerId) {
	_testInfo = [];	
	$("#tblChandanDelayTest tbody").empty();
	$("#tblTatReport tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = centerId;
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#ddlCategory option:selected').val();
	objBO.Prm2 = $('#ddlTestName option:selected').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "DelayedTest:List";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var temp = '';
			var tbody = '';
			var visitNos = '';
			$.each(data.ResultSet.Table, function (key, val) {
				if (temp != val.VisitNo) {
					tbody += "<tr style='background:#ddd'>";
					tbody += "<td colspan='5'>" + val.VisitNo + ' (' + val.PatientName + ')' + ', Hub Verified : ' + val.IsVerified + ', ITDose Sync : ' + val.SyncFailResult + "</td>";
					tbody += "</tr>";
					temp = val.VisitNo						
				}

				tbody += "<tr>";
				tbody += "<td style='display:none'>" + val.testCode + "</td>";
				tbody += "<td>" + val.test_name + "</td>";
				tbody += "<td>" + val.visitDate + "</td>";
				tbody += "<td>" + val.TargetDateTime + "</td>";
				tbody += "<td>" + val.ReportApproveDate + "</td>";
				tbody += "<td>" + val.TAT.toFixed(2) + "</td>";
				tbody += "</tr>";
			});
			$("#tblChandanDelayTest tbody").append(tbody);
			$("#modalDelaytestInfo").modal('show');
		},
		error: function (response) {
			alert('Server Error...!');
		},		
	});
}
function DistrictSummary() {
    $("#tblDelayReport tbody").empty();
    $("#tblDistrictSummary tbody").empty();
    $("#tblDelayInfo tbody").empty();
    var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
    var objBO = {};
    objBO.DistrictName = '-';
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = $('#ddlCategory option:selected').val();
    objBO.Prm2 = $('#ddlTestName option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "TatReport:DistrictSummary";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var temp = '';
            var tbody = '';
            var totalInfo = '';
            var regionName = '';
            var PatientCount = 0;
            var TotalCentre = 0;
            var ActiveCentre = 0;
            var netAmount = 0;
            var Scaned_Pend = 0;
            var HUB_VPend = 0;
            var MOTH_VPend = 0;
            var Appr_Pend = 0;
            var SyncItdose = 0;
            var TestCount = 0;
            var delay = 0;
            var delay_perc = 0;
            $.each(data.ResultSet.Table, function (key, val) {
                TestCount += val.TestCount;
                delay += val.delay;
                delay_perc += val.delay_perc;
                if (regionName != val.regionName) {
                    tbody += "<tr style='background:#f1ecb1'>";
                    tbody += "<td colspan='5'>" + val.regionName + "</td>";
                    tbody += "</tr>";
                    regionName = val.regionName;
                }
                tbody += "<tr data-centreid='" + val.CentreId + "' >";
                tbody += "<td class='bg-group'>" + val.districtName + "</td>";
                tbody += "<td class='text-center'>" + val.TestCount + "</td>";
                tbody += "<td class='text-center'>" + val.delay + "</td>";
                tbody += "<td class='text-center'>" + val.delay_perc + "</td>";               
                tbody += "<td><button  onclick=TatReportSummary(this) class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                tbody += "</tr>";
                TotalCentre++;
                if ((val.PatientCount) > 0)
                    ActiveCentre++;
            });
            totalInfo += "<tr>";
            totalInfo += "<td class='text-center'>-</td>";
            totalInfo += "<td class='text-center'>" + TestCount.toFixed(0) + "</td>";
            totalInfo += "<td class='text-center'>" + delay.toFixed(0) + "</td>";
            totalInfo += "<td class='text-center'>" + (delay * 100 / TestCount).toFixed(2) + "</td>";
            totalInfo += "</tr>";

            $("#tblDistrictSummary tbody").append(tbody);
            $("#tblDelayInfo tbody").append(totalInfo);
        },   
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function TatReportSummary(elem) {
    selectRow(elem);
	$("#tblDelayReport tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
    var objBO = {};
    objBO.DistrictName = $(elem).closest('tr').find('td:eq(0)').text();
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#ddlCategory option:selected').val();
	objBO.Prm2 = $('#ddlTestName option:selected').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
    objBO.Logic = "TatReport:UKNHM-Summary";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var temp = '';
			var tbody = '';
			var totalInfo = '';
			var PatientCount = 0;
			var TotalCentre = 0;
			var ActiveCentre = 0;
			var netAmount = 0;
			var Scaned_Pend = 0;
			var HUB_VPend = 0;
			var MOTH_VPend = 0;
			var Appr_Pend = 0;
			var SyncItdose = 0;
			var TestCount = 0;
			var delay = 0;
			var delay_perc = 0;
			$.each(data.ResultSet.Table, function (key, val) {			
				TestCount += val.TestCount;
				delay += val.delay;
				delay_perc += val.delay_perc;
				tbody += "<tr data-centreid='" + val.CentreId + "' >";
				tbody += "<td class='bg-group'><button class='btn btn-warning btn-xs' onclick=TatReport('" + val.CentreId + "')>Detailed</button> " + val.centre_name + "</td>";			
				tbody += "<td class='text-center'>" + val.TestCount + "</td>";
				tbody += "<td class='text-center'>" + val.delay + "</td>";

				if (eval(val.delay_perc) > 0)
					tbody += "<td class='text-center'><button data-centreid='" + val.CentreId + "' onclick=DelayedTestList('" + val.CentreId + "') class='btn-danger btn btn-xs btnDelay'>" + val.delay_perc + "</button></td>";
				else
					tbody += "<td class='text-center'>" + val.delay_perc + "</td>";

				tbody += "</tr>";
				TotalCentre++;
				if ((val.PatientCount) > 0)
					ActiveCentre++;
			});	
			$("#tblDelayReport tbody").append(tbody);	
		},			
		error: function (response) {
			alert('Server Error...!');
		}
	});
}

