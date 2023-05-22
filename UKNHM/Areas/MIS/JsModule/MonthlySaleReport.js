$(document).ready(function () {
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    GetDistrict();
});
function GetDistrict() {
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
function SaleSummaryMonthly() {
    $("#tblReport thead").empty();
    $("#tblReport tbody").empty();
    var url = config.baseUrl + "/api/Report/MIS_SaleAnalysisQueries";
    var objBO = {};
    objBO.DistrictName = $("#ddlDistrict option:selected").text();
    objBO.CentreId = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "HospitalSaleSummaryMonthly";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var districtName = '';
            var temp = '';
            var tbody = "";
            var count = 0;
            var thead = "";
            thead += "<tr>";
            for (var col in data.ResultSet.Table[0]) {
                thead += "<th>" + col + "</th>";
            }
            thead += "<tr>";
            $.each(data.ResultSet.Table, function (key, val) {
                count++;              
                tbody += "<tr>";
                for (var col in data.ResultSet.Table[0]) {
                    tbody += "<th>" + val[col] + "</th>";
                }
                tbody += "</tr>";
            });
            $("#tblReport tbody").append(tbody);
            $("#tblReport thead").append(thead);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DownloadXL() {
    var url = config.baseUrl + "/api/Report/MIS_SaleAnalysisQueries";
    var objBO = {};
    objBO.DistrictName = $("#ddlDistrict option:selected").text();
    objBO.CentreId = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.login_id = Active.userId;
    objBO.ReportType ="XL";
    objBO.Logic = "HospitalSaleSummaryMonthly";  
    Global_DownloadExcel(url, objBO, "HospitalSaleSummaryMonthly.xlsx");    
}

