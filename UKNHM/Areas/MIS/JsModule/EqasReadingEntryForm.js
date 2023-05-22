var ArrayUnit = [];
var ArrayRange = [];
var _visitNoforAwaited = "";
$(document).ready(function () {
    searchTableh('txtSearch', 'tblInfo');
    $('#btnFeededList').on('click', function () {
        EQASFeededReport();
        $('#modalViewExisting').modal('show');
    });
    $("#tblInfo tbody").on('click', 'button', function () {
        var elem = $(this);
        var ObservationId = $(elem).closest('tr').find('td:eq(1)').text();
        GetRangeUnit(ObservationId, elem);
    });
    $("#tblChandanInfo tbody").on('change', 'select', function () {
        var val = $(this).find('option:selected').text();
        $(this).siblings('input:text').val(val);
    });
    $("input[id=IsAwaited]").on('change', function () {
        var IsCheck = $(this).is(':checked');
        if (IsCheck)
            $('input[id=FileUpload]').attr('disabled', true);
        else
            $('input[id=FileUpload]').attr('disabled', false);
    });
});
function AddObservation(elem) {
    console.log(ArrayUnit)
    console.log(ArrayRange)
    var TestId = $(elem).closest('tr').find('td:eq(0)').text();
    var LabObservation_ID = $(elem).closest('tr').find('td:eq(1)').text();
    var LabObservationName = $(elem).closest('tr').find('td:eq(2)').text();
    var reading = $(elem).closest('tr').find('td:eq(3)').text();
    var refRange = $(elem).closest('tr').find('td:eq(4)').text();
    var ReadingFormat = $(elem).closest('tr').find('td:eq(5)').text();
    var BarcodeNo = $(elem).closest('tr').find('td:eq(6)').text();
    var info = [];
    var tbody = '';
    var selectedArrayUnit = '';
    var selectedArrayRange = '';
    $("#tblChandanInfo tbody tr").each(function () {
        info.push($(this).find('td').eq(1).text());
    });
    if ($.inArray(LabObservation_ID, info) > -1) {
        alert('Already Added.');
        return
    }
    else {
        tbody += "<tr>";
        tbody += "<td style='display:none'>" + TestId + "</td>";
        tbody += "<td style='display:none'>" + LabObservation_ID + "</td>";
        tbody += "<td>" + LabObservationName + "</td>";
        tbody += "<td><input type='text class='form-control' value='" + reading + "' placeholder='Chandan Reading' style='width:100%'/></td>";
        tbody += "<td style='display:none'>" + refRange + "</td>";
        tbody += "<td><input type='text class='form-control' value='" + ReadingFormat + "' placeholder='Chandan Unit' style='width:100%'/></td>";
        tbody += "<td><input type='text class='form-control' placeholder='Lab Reading'/></td>";
        tbody += "<td><select class='form-control1' style='width:100%'>";
        selectedArrayUnit = (ArrayUnit.length > 0) ? ArrayUnit[0].split('|')[0] : '';
        if (ArrayUnit.length > 0) {
            for (var i = 0; i < ArrayUnit.length; i++) {
                tbody += "<option " + ArrayUnit[i].split('|')[1] + ">" + ArrayUnit[i].split('|')[0] + "</option>";
                if (ArrayUnit[i].split('|')[1] == 'selected')
                    selectedArrayUnit = ArrayUnit[i].split('|')[0];
            }
        }      
        var unit = (ArrayUnit.length === 0) ? 'N/A' : ArrayUnit[0];
        tbody += "</select><input type='text' id='txtUnit' value='" + selectedArrayUnit + "' class='form-control range-unit' style='width:76%'/></td>";
        tbody += "<td><select class='form-control1' style='width:100%'>";
        selectedArrayRange = (ArrayRange.length > 0) ? ArrayRange[0].split('|')[0] : '';
        if (ArrayRange.length > 0) {
            for (var i = 0; i < ArrayRange.length; i++) {
                tbody += "<option " + ArrayRange[i].split('|')[1] + ">" + ArrayRange[i].split('|')[0] + "</option>";
                if (ArrayRange[i].split('|')[1] == 'selected')
                    selectedArrayRange = ArrayRange[i].split('|')[0];
            }
        }
        var range = (ArrayRange.length === 0) ? 'N/A' : ArrayRange[0];
        tbody += "</select><input type='text' id='txtRange' value='" + selectedArrayRange + "' class='form-control range-unit' style='width:85%'/></td>";
        tbody += "<td><select class='form-control1'>";
        tbody += "<option>Results Satisfied</option>";
        tbody += "<option>Not Satisfied</option>";
        tbody += "</select></td>";
        tbody += "<td style='display:none'>" + BarcodeNo + "</td>";
        tbody += "<td><button class='btn btn-danger btn-xs' onclick=RemoveRow(this)><i class='fa fa-trash'></i></button></td>";
        tbody += "</tr>";
        $("#tblChandanInfo tbody").append(tbody);
    }
}
function GetRangeUnit(ObservationId, elem) {
    ArrayUnit = [];
    ArrayRange = [];
    if ($('#ddlOutLab option:selected').text() == 'Select') {
        alert('Please Choose Lab.');
        return;
    }
    var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
    var objBO = {};
    objBO.DistrictName = '-';
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = $('#ddlOutLab option:selected').text();
    objBO.Prm2 = ObservationId;
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.login_id = Active.userId;
    objBO.Logic = "GetRangeUnit";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                ArrayUnit.push(val.Range_Unit + '|' + val.IsSelected);
            });
            $.each(data.ResultSet.Table1, function (key, val) {
                ArrayRange.push(val.Range_Unit + '|' + val.IsSelected);
            });
        },
        error: function (response) {
            alert('Server Error...!');
        },
        complete: function (response) {
            AddObservation(elem);
        }
    });
}
function RemoveRow(elem) {
    $(elem).closest('tr').remove();
}
function GetInfo() {
    $("#tblInfo tbody").empty();
    $("#tblChandanInfo tbody").empty();
    var url = config.baseUrl + "/api/Report/PatientInfoByBarcode";
    var objBO = {};
    objBO.Prm1 = $('#txtVisitNo').val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                console.log(data);
                var tbody = '';
                $.each(data.ResultSet.Table, function (key, val) {
                    var Age = val.Age + ' / ' + val.Gender
                    $("#txtInvoiceNo").text(val.LedgerTransactionNo);
                    $("#txtPatientName").text(val.PName);
                    $("#txtAgeGender").text(Age);
                    $("#txtRegDate").text(val.Ragdate);
                });
                $.each(data.ResultSet.Table1, function (key, val) {
                    if (val.Approved == 1)
                        tbody += "<tr style='background:#abe9ab'>";
                    else
                        tbody += "<tr>";

                    tbody += "<td style='display:none'>" + val.Itemid_Interface + "</td>";
                    tbody += "<td>" + val.LabObservation_ID + "</td>";
                    tbody += "<td>" + val.LabObservationName + "</td>";
                    tbody += "<td>" + val.reading + "</td>";
                    tbody += "<td>" + val.refRange + "</td>";
                    tbody += "<td>" + val.ReadingFormat + "</td>";
                    tbody += "<td style='display:none'>" + val.BarcodeNo + "</td>";
                    tbody += "<td><button class='btn-warning'>Add</button></td>";
                    tbody += "</tr>";
                    $("#txtBarcodeNo").text(val.BarcodeNo);
                });
                $("#tblInfo tbody").append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DownloadReport(logic) {
    var url = config.baseUrl + "/api/Report/GetTestIds";
    var objBO = {};
    objBO.VisitNo = $('#txtInvoiceNo').text();
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
                var link = 'http://' + logic + '/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=' + TestIds.join(',') + '&Mobile=1';
                window.open(link, '_blank');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertEQASInfo() {
    if (Validation()) {
        var EQASInfo = [];
        var waiting = "<img src='/content/img/waiting.gif' style='width:15px'/>&nbsp;Processing..."
        $('#btnSave').html(waiting).prop('disabled', true);
        var url = config.baseUrl + "/api/Report/EQAS_InsertEQASInfo";
        var objBO = {};
        $('#tblChandanInfo tbody tr').each(function () {
            EQASInfo.push({
                'VisitNo': $('#txtInvoiceNo').text(),
                'BarcodeNo': $(this).find('td:eq(10)').text(),
                'testCode': $(this).find('td:eq(0)').text(),
                'Prm1': '-',
                'ObservationId': $(this).find('td:eq(1)').text(),
                'ObservationName': $(this).find('td:eq(2)').text(),
                'chandan_reading': $(this).find('td:eq(3)').find('input').val(),
                'chandan_RefRange': $(this).find('td:eq(4)').text(),
                'chandan_unit': $(this).find('td:eq(5)').find('input').val(),
                'OutLabName': $('#ddlOutLab option:selected').text(),
                'OutLab_reading': $(this).find('td:eq(6)').find('input').val(),
                'OutLab_RefRange': $(this).find('td:eq(8)').find('input').val(),
                'OutLab_unit': $(this).find('td:eq(7)').find('input').val(),
                'OutLab_ReportPath': ($("input[id=IsAwaited]").is(':checked') == true) ? 'Report Awaited' : '-',
                'read_Status': $(this).find('td:eq(9)').find('select option:selected').text(),
            });
        });
        objBO.VisitNo = $('#txtInvoiceNo').text();
        objBO.Prm1 = JSON.stringify(EQASInfo);
        objBO.login_id = Active.userId;
        objBO.Logic = 'Insert';
        var UploadDocumentInfo = new XMLHttpRequest();
        var data = new FormData();
        data.append('obj', JSON.stringify(objBO));
        data.append('ImageByte', $('input[id=FileUpload]')[0].files[0]);
        UploadDocumentInfo.onreadystatechange = function () {
            if (UploadDocumentInfo.status) {
                if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                    var json = JSON.parse(UploadDocumentInfo.responseText);
                    console.log(json.Message)
                    if (json.Message.includes('Success')) {
                        $('#btnSave').text('Submit').prop('disabled', false);
                        alert(json.Message);
                        $('#tblChandanInfo tbody').empty();
                        $('#tblInfo tbody').empty();
                        $("#txtInvoiceNo").text('');
                        $("#txtPatientName").text('');
                        $("#txtAgeGender").text('');
                        $("#txtRegDate").text('');
                        $("#txtBarcodeNo").text('');
                        $("#txtVisitNo").val('');
                        $("#FileUpload").val('');
                    }
                    else {
                        alert(json.Message);
                        $('#btnSave').text('Submit').prop('disabled', false);
                    }
                }
            }
        }
        UploadDocumentInfo.open('POST', url, true);
        UploadDocumentInfo.send(data);
    }
}
function UpdateAwaitedReportPath() {
    if (_visitNoforAwaited == '') {
        alert('Visit No Not Found.');
        return
    }
    var waiting = "<img src='/content/img/waiting.gif' style='width:15px'/>&nbsp;Processing..."
    $('#btnUpdateAwaitedReport').html(waiting).prop('disabled', true);
    var url = config.baseUrl + "/api/Report/EQAS_UpdateAwaitedReportPath";
    var objBO = {};
    objBO.VisitNo = _visitNoforAwaited;
    objBO.Prm1 = '';
    objBO.login_id = Active.userId;
    objBO.Logic = 'UpdateReportPath';
    var UploadDocumentInfo = new XMLHttpRequest();
    var data = new FormData();
    data.append('obj', JSON.stringify(objBO));
    data.append('ImageByte', $('input[id=AwaitedFileUpload]')[0].files[0]);
    UploadDocumentInfo.onreadystatechange = function () {
        if (UploadDocumentInfo.status) {
            if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                var json = JSON.parse(UploadDocumentInfo.responseText);
                console.log(json.Message)
                if (json.Message.includes('Success')) {
                    $('#btnUpdateAwaitedReport').text('Submit').prop('disabled', false);
                    alert(json.Message);
                    $('#modalViewExisting').modal('hide');
                }
                else {
                }
            }
        }
    }
    UploadDocumentInfo.open('POST', url, true);
    UploadDocumentInfo.send(data);
}
function Validation() {
    var lenth = $('#tblChandanInfo tbody tr').length;
    var OutLab = $('#ddlOutLab option:selected').text()
    var FileUpload = $('#FileUpload').val()
    if (!lenth > 0) {
        alert('Please Add Observation.');
        return false
    }
    if (OutLab == 'Select') {
        alert('Please Choose Out Lab.');
        $('span.selection').find('span[aria-labelledby=select2-ddlOutLab-container]').css({ 'border-color': 'red' }).focus();
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlOutLab-container]').removeAttr('style');
    }
    if ($("input[id=IsAwaited]").is(':checked') == false) {
        if (FileUpload == '') {
            alert('Please Choose Report.');
            $('#FileUpload').css({ 'border-color': 'red' }).focus();
            return false;
        }
        else {
            $('#FileUpload').removeAttr('style');
        }
    }
    return true;
}
function EQASFeededReport() {
    $("#tblEQASReport tbody").empty();
    var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
    var objBO = {};
    objBO.DistrictName = '-';
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = $('#txtVisitNo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.from = "1900/01/01";
    objBO.to = "1900/01/01";
    objBO.login_id = Active.userId;
    objBO.Logic = "EQASInfoOfVisit";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var isAwaited = '';
            var visitNo = '';
            var tbody = "";
            var option = '';
            var status = ['Satisfactory', 'Both Satisfactory', 'Un-Satisfactory', 'Marginal Variation'];
            $.each(data.ResultSet.Table, function (key, val) {
                option = '';
                _visitNoforAwaited = val.VisitNo;
                isAwaited = val.OutLab_ReportPath;
                console.log(val.read_Status)
                for (var v in status) {
                    if (val.read_Status == status[v])
                        option += "<option selected>" + status[v] + "</option>";
                    else
                        option += "<option>" + status[v] + "</option>";
                }
                if (visitNo != val.VisitNo) {
                    tbody += "<tr>";
                    tbody += "<td style='background:#cdebfd'>" + val.VisitNo + " [" + val.PatientName + "] - " + val.visitDate + " " + "</td>";
                    tbody += "<td style='background:#cdebfd;text-align:center' colspan='4'><a class='btn-report' onclick=DownloadReport('192.168.0.21')>Chandan Report</a></td>";
                    tbody += "<td style='background:#cdebfd;text-align:center' colspan='5'><a href='" + val.OutLab_ReportPath + "' target='_blank' class='btn-report'>EQAS Report</a></td>";
                    tbody += "</tr>";
                    visitNo = val.VisitNo;
                }

                tbody += "<tr>";
                tbody += "<td style='display:none'>" + val.AutoId + "</td>";
                tbody += "<td style='display:none'>" + val.ObservationId + "</td>";
                tbody += "<td>" + val.ObservationName + "</td>";
                tbody += "<td><input type='text class='form-control' value='" + val.chandan_reading + "' placeholder='Chandan Reading' style='width:100%'/></td>";
                tbody += "<td><input type='text class='form-control' value='" + val.chandan_unit + "' placeholder='Chandan Unit' style='width:100%'/></td>";
                tbody += "<td>" + val.chandan_RefRange + "</td>";
                tbody += "<td>" + val.OutLabName + "</td>";
                tbody += "<td><input type='text class='form-control' value='" + val.OutLab_reading + "' placeholder='Reading' style='width:100%'/></td>";
                tbody += "<td><input type='text class='form-control' value='" + val.OutLab_unit + "' placeholder='Unit' style='width:100%' /></td>";
                tbody += "<td><input type='text class='form-control' value='" + val.OutLab_RefRange + "' placeholder='Lab Ref. Range' style='width:100%'/></td>";
                tbody += "<td><select id='ViewStatus'>";
                tbody += option;
                tbody += "</select></td>";
                tbody += "<td class='flex'>";
                tbody += "<button class='btn btn-warning btn-xs' data-logic='UpdateEQASInfo' onclick=UpdateDeleteEQASInfo(this)><i class='fa fa-edit'></i></button>&nbsp;";
                tbody += "<button class='btn btn-danger btn-xs' data-logic='DeleteEQASInfo' onclick=UpdateDeleteEQASInfo(this)><i class='fa fa-trash'></i></button>";
                tbody += "</td>";
                tbody += "</tr>";
            });
            if (isAwaited == 'Report Awaited')
                $('.UploadAwaitedReport').show();
            else
                $('.UploadAwaitedReport').hide();

            $("#tblEQASReport tbody").append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdateDeleteEQASInfo(elem) {
    if (confirm('Are you sure?')) {
        var url = config.baseUrl + "/api/Report/EQAS_InsertEQASInfo";
        var objBO = {};
        objBO.chandan_reading = $(elem).closest('tr').find('td:eq(3)').find('input').val();
        objBO.chandan_unit = $(elem).closest('tr').find('td:eq(4)').find('input').val();
        objBO.OutLab_reading = $(elem).closest('tr').find('td:eq(7)').find('input').val();
        objBO.OutLab_RefRange = $(elem).closest('tr').find('td:eq(9)').find('input').val();
        objBO.OutLab_unit = $(elem).closest('tr').find('td:eq(8)').find('input').val();
        objBO.read_Status = $(elem).closest('tr').find('td:eq(10)').find('select option:selected').text();
        objBO.Prm1 = $(elem).closest('tr').find('td:eq(0)').text();
        objBO.login_id = Active.userId;
        objBO.Logic = $(elem).data('logic');
        var UploadDocumentInfo = new XMLHttpRequest();
        var data = new FormData();
        data.append('obj', JSON.stringify(objBO));
        data.append('ImageByte', $('input[id=FileUpload]')[0].files[0]);
        UploadDocumentInfo.onreadystatechange = function () {
            if (UploadDocumentInfo.status) {
                if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                    var json = JSON.parse(UploadDocumentInfo.responseText);
                    console.log(json.Message)
                    if (json.Message.includes('Success')) {
                        if (objBO.Logic == 'UpdateEQASInfo')
                            $(elem).closest('tr').find('td*').css('background', '#8dff8d');
                        else if (objBO.Logic == 'DeleteEQASInfo')
                            $(elem).closest('tr').remove();
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
}
function DeleteAllEQASInfo() {
    if (confirm('Are you sure?')) {
        if (_visitNoforAwaited == '') {
            alert('Visit No Not Found.');
            return
        }
        var url = config.baseUrl + "/api/Report/EQAS_InsertUpdateEQASInfo";
        var objBO = {};
        objBO.VisitNo = _visitNoforAwaited;
        objBO.Logic = 'DeleteEQASInfoInBulk';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert('Successfully Deleted.');
                    $("#tblEQASReport tbody").empty();
                    $('#modalViewExisting').modal('hide');
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
function DownloadReport(logic) {
    var url = config.baseUrl + "/api/Report/GetTestIds";
    var objBO = {};
    objBO.VisitNo = $('#txtInvoiceNo').text();
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
                var link = 'http://' + logic + '/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=' + TestIds.join(',') + ',' + '&Mobile=1';
                window.open(link, '_blank');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

//$('table tbody tr').each(function () {
//	$(this).find('p').text();
//})