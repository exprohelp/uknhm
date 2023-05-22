$(document).ready(function () {
    GetDistrict();
    $("#tblCentreInfo tbody").on('keyup', '#txtLatLong', function () {
        var Lat = $(this).val().split(',')[0];
        var Long = $(this).val().split(',')[1];
        $(this).closest('tr').find('td:eq(3)').find('input:text:eq(0)').val(Lat);
        $(this).closest('tr').find('td:eq(3)').find('input:text:eq(1)').val(Long);
        IsFill();
    });
});
function IsFill() {
    $("#tblCentreInfo tbody tr").each(function () {
        if ($(this).find('td:eq(3)').find('input:text:eq(0)').val() != '-')
            $(this).find('td:eq(3)').find('input:text:eq(0)').addClass('fill');
        else
            $(this).find('td:eq(3)').find('input:text:eq(0)').removeClass('fill');

        if ($(this).find('td:eq(3)').find('input:text:eq(1)').val() != '-')
            $(this).find('td:eq(3)').find('input:text:eq(1)').addClass('fill');
        else
            $(this).find('td:eq(3)').find('input:text:eq(1)').removeClass('fill');
    });
}
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
function GetCenterInfoForLatLang() {
    $("#tblCentreInfo tbody").empty();
    var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
    var objBO = {};
    objBO.DistrictName = $("#ddlDistrict option:selected").text();
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetCenterInfoForLatLang";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var temp = "";
            $.each(data.ResultSet.Table, function (key, val) {
                if (temp != val.districtName) {
                    tbody += "<tr style='background:#ddd'>";
                    tbody += "<td colspan='7'>" + val.districtName + "</td>";
                    tbody += "</tr>";
                    temp = val.districtName;
                }
                tbody += "<tr>";
                tbody += "<td>" + val.centreId + "</td>";
                tbody += "<td>" + val.centre_name + "</td>";
                tbody += "<td>" + val.CentreType + "</td>";
                tbody += "<td class='flex'><input type='text' class='form-control' value=" + val.CentreLat + " placeholder='Latitude'/>&nbsp;<input type='text' value=" + val.CentreLong + " class='form-control' placeholder='Longitude'/></td>";
                tbody += "<td><input type='text' id='txtLatLong' class='form-control' placeholder='Paste Lat,long'/></td>";
                tbody += "<td><button class='btn btn-warning btn-xs' onclick=UpdateLatLong(this)><i class='fa fa-arrow-right'>&nbsp;</i>Update</button></td>";
                tbody += "</tr>";
            });
            $("#tblCentreInfo tbody").append(tbody);
            IsFill();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdateLatLong(elem) {
    if (confirm('Are you sure to Update?')) {
        var url = config.baseUrl + "/api/Report/MIS_InsertUpdateReports";
        var objBO = {};
        objBO.VisitNo = $(elem).closest('tr').find('td:eq(0)').text();
        objBO.MobileNo = '-';
        objBO.remark = '-';
        objBO.Prm1 = $(elem).closest('tr').find('td:eq(3)').find('input:text:eq(0)').val();
        objBO.Prm2 = $(elem).closest('tr').find('td:eq(3)').find('input:text:eq(1)').val();
        objBO.login_id = Active.userId;
        objBO.Logic = "UpdateCentreLatLong";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                }
                else {
                    alert(data);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
