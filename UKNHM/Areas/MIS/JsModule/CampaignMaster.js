var _mobileNo = '';
var _campaignId = '';
$(document).ready(function () {
    FillCurrentDate('txtCampaignDate')
    FillCurrentDate('txtExpireDate')
    GetCenter();
    GetCampaignMaster();
    $("#tblCampaignMaster tbody").on('click', 'button', function () {
        selectRow(this);
        _campaignId = $(this).closest('tr').find('td:eq(2)').text();
        GetCampaignInfo();
    });
});
function GetCenter() {
    var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
    var objBO = {};
    objBO.LabCode = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetCenterMaster";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var centreName = '';
            if (data.ResultSet.Table.length > 0) {
                $("#ddlCentreName").empty().append($("<option></option>").val("Select").html("Select")).select2();        
                $.each(data.ResultSet.Table, function (key, val) {
                    if (centreName != val.centreId) {
                        $("#ddlCentreName").append($("<option></option>").val(val.centreId).html(val.centre_name));
                        centreName = val.centreId;
                    }
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetCampaignMaster() {
    $("#tblCampaignMaster tbody").empty();
    var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
    var objBO = {};
    objBO.LabCode = '-';
    objBO.CentreId = $('#ddlCentreName option:selected').val();
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetCampaignMaster";
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
                        tbody += "<tr style='background:#c6e5ff'>";
                        tbody += "<td colspan='11'>Centre Name : " + val.centre_name + "</td>";
                        tbody += "</tr>";
                        centre = val.centre_name
                    }
                    tbody += "<tr>";
                    tbody += "<td class='hide'>" + val.AutoId + "</td>";
                    tbody += "<td>";
                    tbody += "<label class='switch'>";
                    tbody += "<input type='checkbox' onchange=UpdateStatus(" + val.AutoId + ") class='IsActive' id='chkActive' " + val.checked + ">";
                    tbody += "<span class='slider round'></span>";
                    tbody += "</label>";
                    tbody += "</td>";
                    tbody += "<td>" + val.CampaignId + "</td>";
                    tbody += "<td>" + val.Description + "</td>";
                    tbody += "<td>" + val.CampaignDate + "</td>";
                    tbody += "<td>" + val.ExpiryDate + "</td>";
                    tbody += "<td>" + val.CampaignType + "</td>";
                    if (val.CampaignType =='Without Mobile')
                        tbody += "<td>-</td>";
                    else                        
                    tbody += "<td><button class='btn btn-warning btn-xs'><i class='fa fa-sign-in'></i></button></td>";
                    tbody += "</tr>";
                });
                $("#tblCampaignMaster tbody").append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetCampaignInfo() {
    $("#tblCampaignInfo tbody").empty();
    var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
    var objBO = {};
    objBO.LabCode = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = _campaignId
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetCampaignInfo";
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
                    tbody += "<tr>";
                    tbody += "<td class='hide'>" + val.AutoId + "</td>";
                    tbody += "<td>" + val.CampaignId + "</td>";
                    tbody += "<td>" + val.MobileNo + "</td>";                
                    tbody += "<td><button class='btn btn-danger btn-xs'><i class='fa fa-trash'></i></button></td>";
                    tbody += "</tr>";
                    $('#txtCampaignInfo').text(val.Description);
                });
                $("#tblCampaignInfo tbody").append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertCampaignInfo() {
    var url = config.baseUrl + "/api/Unit/Unit_InsertUpdateUnitWorking";
    var objBO = {};
    objBO.VisitNo = _campaignId;
    objBO.CentreId = '-';
    objBO.Remark = '-';
    objBO.Prm1 = $("#txtMobileNo").val();
    objBO.Prm2 = '-';
    objBO.from = $("#txtCampaignDate").val();
    objBO.to = $("#txtExpireDate").val();
    objBO.login_id = Active.userId;
    objBO.Logic = 'InsertCampaignInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                $("#txtMobileNo").val('');
                GetCampaignInfo()
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
function InsertCampaignMaster() {
    if ($("#ddlCentreName option:selected").val() == 'Select') {
        alert('Please Select Centre Name');
        $("#ddlCentreName").focus()
        return
    }
    if ($("#ddlCampaignType option:selected").val() == 'Select') {
        alert('Please Select Campaign Type');
        $("#ddlCampaignType").focus()
        return
    }
    if ($("#FileUpload").val() == '') {
        alert('Please Provide File');
        $("#FileUpload").focus()
        return
    }
    if ($("#txtDescription").val() == '') {
        alert('Please Provide Description');
        $("#txtDescription").focus()
        return
    }
    var url = config.baseUrl + "/api/Unit/InsertCampaignMaster";
    var objBO = {};
    objBO.VisitNo = '-';
    objBO.CentreId = $("#ddlCentreName option:selected").val();
    objBO.Remark = $("#txtDescription").val();
    objBO.Prm1 = $("#ddlCampaignType option:selected").val();
    objBO.Prm2 = '.'+$('input[id=FileUpload]').val().split('.').pop();
    objBO.from = $("#txtCampaignDate").val();
    objBO.to = $("#txtExpireDate").val();
    objBO.login_id = Active.userId;
    objBO.Logic = 'InsertCampaignMaster';

    var UploadDocumentInfo = new XMLHttpRequest();
    var data = new FormData();
    data.append('obj', JSON.stringify(objBO));
    data.append('ImageByte', $('input[id=FileUpload]')[0].files[0]);
    UploadDocumentInfo.onreadystatechange = function () {
        if (UploadDocumentInfo.status) {
            if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                var json = JSON.parse(UploadDocumentInfo.responseText);
                if (json.Message.includes('Success')) {
                    GetCampaignMaster();
                    $("#txtDescription").val('');
                    FillCurrentDate('txtCampaignDate')
                    FillCurrentDate('txtExpireDate')
                    $("#ddlCentreName").prop('selectedIndex', '0').change();
                    $('input[id=FileUpload]').val('');
                }
                else {
                    alert(json.Message);
                }
            }
        }
    }
    UploadDocumentInfo.open('POST', url, true);
    UploadDocumentInfo.send(data);
}
function UpdateStatus(autoId) { 
    var url = config.baseUrl + "/api/Unit/InsertCampaignMaster";
    var objBO = {};
    objBO.VisitNo = '-';
    objBO.CentreId = '-';
    objBO.Remark = '-';
    objBO.Prm1 = '-';
    objBO.fSize = autoId;
    objBO.Prm2 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = 'UpdateStatusCampaign';

    var UploadDocumentInfo = new XMLHttpRequest();
    var data = new FormData();
    data.append('obj', JSON.stringify(objBO));
    data.append('ImageByte', $('input[id=FileUpload]')[0].files[0]);
    UploadDocumentInfo.onreadystatechange = function () {
        if (UploadDocumentInfo.status) {
            if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                var json = JSON.parse(UploadDocumentInfo.responseText);
                if (json.Message.includes('Success')) {
                    //GetCampaignMaster();                   
                }
                else {
                    alert(json.Message);
                }
            }
        }
    }
    UploadDocumentInfo.open('POST', url, true);
    UploadDocumentInfo.send(data);
}