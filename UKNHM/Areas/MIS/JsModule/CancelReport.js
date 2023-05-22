$(document).ready(function () {
    CloseSidebar();
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    GetDistrict();    
});
function CancellationSummary() {
    $('#tblCancellationSummary tbody').empty();
    var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries";
    var objBO = {};
    objBO.DistrictName = $("#ddlDistrict option:selected").val();
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "CancellationSummary";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.ResultSet.Table.length > 0) {
                var tbody = '';
                var temp = '';
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.HubName) {
                        tbody += "<tr style='background:#ddd'>";
                        tbody += "<td colspan='4'>Hub Lab Name : " + val.HubName + "</td>";
                        tbody += "</tr>";
                        temp = val.HubName
                    }
                    tbody += "<tr>";
                    tbody += "<td>" + val.centre_name + "</td>";
                    tbody += "<td>" + val.PatientCount + "</td>";
                    tbody += "<td>" + val.TestCount + "</td>";
                    tbody += "<td><button class='btn-warning' onclick=selectRow(this);CancellationDetail('" + val.centreId + "')><i class='fa fa-sign-in'></i></button></td>";
                    tbody += "</tr>";
                });
                $('#tblCancellationSummary tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CancellationDetail(centreId) {
    $('#txtCentreInfo').text(centreId);
    $('#tblCancellationDetail tbody').empty();
    var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries";
    var objBO = {};
    objBO.DistrictName = '-';
    objBO.CentreType = '-';
    objBO.CentreId = centreId;
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "CancellationDetail";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.ResultSet.Table.length > 0) {
                var tbody = '';
                var temp = '';
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.VisitNo) {
                        tbody += "<tr style='background:#ddd'>";
                        tbody += "<td colspan='6'>" + val.VisitNo + ', ' + val.PatientName + "</td>";
                        tbody += "</tr>";
                        temp = val.VisitNo
                    }
                    tbody += "<tr>";
                    tbody += "<td>" + val.visitDate + "</td>";
                    tbody += "<td>" + val.test_name + "</td>";
                    tbody += "<td>" + val.netAmount + "</td>";
                    tbody += "<td>" + val.CancelDate + "</td>";
                    tbody += "<td>" + val.CancelRemark + "</td>";
                    tbody += "<td>" + val.CancelBy + "</td>";
                    tbody += "</tr>";
                });
                $('#tblCancellationDetail tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
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