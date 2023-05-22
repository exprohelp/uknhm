﻿$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	GetObservations();
});
function GetObservations() {	
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = '-';
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
			$("#ddlObservationId").empty().append($("<option></option>").val("ALL").html("ALL")).select2();			
			$.each(data.ResultSet.Table, function (key, val) {
				$("#ddlObservationId").append($("<option></option>").val(val.ObservationId).html(val.ObservationName));
			});	
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
function EQASReport() {
	$("#tblEQASReport tbody").empty();
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
	objBO.DistrictName = $("#ddlDistrict option:selected").text();
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = $("#ddlObservationId option:selected").val();
	objBO.Prm2 = $("#ddlRegion option:selected").text();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
    objBO.Logic = "EQASReport-NHM";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			var visitNo = '';
			var regionName = '';
			var centre_name = '';
			var districtName = '';
			var temp = '';
			var tbody = '';
			var count =0;
			$.each(data.ResultSet.Table, function (key, val) {
				if (regionName != val.regionName) {
					tbody += "<tr>";
					tbody += "<td style='background:#ddd946' colspan='9'>Region : " + val.regionName + "</td>";
					tbody += "</tr>";
					regionName = val.regionName;
				}
				if (districtName != val.districtName) {
					tbody += "<tr>";
					tbody += "<td style='background:#f9b9b8' colspan='9'>District : " + val.districtName + "</td>";
					tbody += "</tr>";
					districtName = val.districtName;
				}
				count++;
				//if (centre_name != val.centre_name) {
				//	tbody += "<tr>";
				//	tbody += "<td style='background:#ffe1b4' colspan='8'>" + val.centre_name + "</td>";
				//	tbody += "<tr>";
				//	centre_name = val.centre_name;
				//}
				if (visitNo != val.VisitNo) {
					tbody += "<tr>";
					tbody += "<td style='background:#cdebfd'>" + val.VisitNo + " [" + val.PatientName + "] - " + val.visitDate+" " + "</td>";
                    tbody += "<td style='background:#cdebfd;text-align:center' colspan='4'><a class='btn-report' data-visitdate=" + val.visitDate + " data-visitno=" + val.VisitNo + " onclick=DownloadReport(this)>Chandan Report</a></td>";
                    if (val.OutLab_ReportPath == 'Report Awaited')
                        tbody += "<td style='background:#cdebfd;text-align:center' colspan='4'><a href='#' disabled class='btn-report'>Report Awaited</a></td>";
                    else
                        tbody += "<td style='background:#cdebfd;text-align:center' colspan='4'><a href='" + val.OutLab_ReportPath + "' target='_blank' class='btn-report'>EQAS Report</a></td>";
					tbody += "</tr>";
					visitNo = val.VisitNo;
				}
				//if (val.read_Status == 'Normal')
				//	tbody += "<tr style='background:#f56e6e;'>";
				//else
				//	tbody += "<tr>";

				tbody += "<tr>";
				tbody += "<td style='display:none'>" + val.ObservationId + "</td>";
				tbody += "<td>" + val.ObservationName + "</td>";
				tbody += "<td>" + val.chandan_reading + "</td>";
				tbody += "<td>" + val.chandan_unit + "</td>";
				tbody += "<td>" + val.chandan_RefRange + "</td>";
				tbody += "<td>" + val.OutLabName + "</td>";
				tbody += "<td>" + val.OutLab_reading + "</td>";
				tbody += "<td>" + val.OutLab_unit + "</td>";		
                tbody += "<td>" + val.OutLab_RefRange + "</td>";	
                tbody += "<td>" + val.read_Status + "</td>";	
				tbody += "</tr>";
			});
			$("#tblEQASReport tbody").append(tbody);
			$("#lblTotalTest").html('Total Test Count : ' + count);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function PrintPDF() {
	var District = $("#ddlDistrict option:selected").text();
	var Prm1 = $("#ddlObservationId option:selected").val();
	var Prm2 = $("#ddlRegion option:selected").text();
	var from = $('#txtFrom').val();
	var to = $('#txtTo').val();
	var link = '../Print/PrintEQASReport?from=' + from + '&to=' + to + '&loginId=' + Active.userId + '&Prm1=' + Prm1 + '&Prm2=' + Prm2 + '&District=' + District;
	window.open(link, '_blank');
}
function DownloadReport(elem) {
    var url = config.baseUrl + "/api/Report/GetTestIds";
    var objBO = {};
    objBO.VisitNo = $(elem).data('visitno');
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var TestIds = [];
                $.each(data.ResultSet.Table, function (key, val) {
                    TestIds.push(val.Test_Id)
                });
                if (TestIds.length == 1)
                    TestIds.push(' ');
                var visitDate = new Date($(elem).data('visitdate'));
                var tarDate = new Date('2022-12-31');
                //alert('Length : ' + TestIds.length + '\n ID 1 : ' + AllTestIds);
                if (visitDate <= tarDate)
                    var link = 'http://chandan.online/Chandan/Design/Lab/labreportnew_NhmUkArchive1.aspx?IsPrev=1&PHead=1&testid=' + TestIds.join(',') + '&Mobile=1';
                else
                    var link = 'http://chandan.online/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=' + TestIds.join(',') + '&Mobile=1';

                window.open(link, '_blank');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

