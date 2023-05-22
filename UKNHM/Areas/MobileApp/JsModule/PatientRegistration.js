var IsOTPByPass = false;
$(document).ready(function () {
    var centreId = query()['CentreId'];
    var LoginId = query()['LoginId'];
    if (typeof centreId === 'undefind') {

        alert('Access Denied for this Centre.');
        $('body').css('pointer-events', 'none');
        $("#txtCollectionCenter").text('Centre Is not Alloted.');
    }
    else {
        sessionStorage.setItem('userId', LoginId);
        GetDoctorList(centreId);
        GetActiveCampaign();
    }   
    $('input:text').attr('autocomplete', 'off');
    searchTableh('txtSeachTest', 'tblTest');
    $('#tblTest tbody').on('change', 'input[type=checkbox]', function () {
        var tbody = '';
        var checkbox = $(this);
        var IsCheck = $(this).is(':checked');
        var testCode = $(this).closest('tr').find('td:eq(1)').text();
        var testName = $(this).closest('tr').find('td:eq(2)').text();
        var isTest = [];
        $('#tblSelectedTest tbody tr').each(function () {
            isTest.push($(this).find('td:eq(1)').text());
        });
        if (IsCheck) {
            if ($.inArray(testCode, isTest) < 0) {
                tbody += '<tr>';
                tbody += '<td><button class="btn-danger btn-del"><i class="fa fa-trash"></i></button></td>';
                tbody += '<td style="display:none">' + testCode + '</td>';
                tbody += '<td>' + testName + '</td>';
                tbody += '</tr>';
                $('#tblSelectedTest tbody').append(tbody);
            }
            else {
                alert('This Test Already Selected.');
                $(checkbox).prop('checked', false);
            }
        }
        else {
            $('#tblSelectedTest tbody tr').each(function () {
                if ($(this).find('td:eq(1)').text() == testCode) {
                    $(this).closest('tr').remove();
                }
            });
        }
    });
    $('#tblSelectedTest tbody').on('click', 'button', function () {
        var testCode = $(this).closest('tr').find('td:eq(1)').text();
        $(this).closest('tr').remove();
        $('#tblTest tbody tr').each(function () {
            if ($(this).find('td:eq(1)').text() == testCode) {
                $(this).find('input[type=checkbox]').prop('checked', false);
            }
        });
    });
});


function GetCenter(centreId) {
    sessionStorage.setItem('centreId', '');
    $("#txtCollectionCenter").text('');
    var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
    var objBO = {};
    objBO.LabCode = '-';
    objBO.CentreId = centreId;
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetCenterInfoByCentreId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, value) {
                    sessionStorage.setItem('centreId', value.centreId);
                    $("#txtCollectionCenter").text(value.centre_name);
                });
            }
            else {
                alert('Please Contact Admin. Centre Not Authorised.');
                $('body').css('pointer-events', 'none');
                $("#txtCollectionCenter").text('Centre Is not Alloted.');
            }
        },
        complete: function (response) {
            GetDoctorList();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDoctorList(centreId) {
    var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
    var objBO = {};
    objBO.LabCode = '-';
    objBO.CentreId = centreId;
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetDoctorMaster";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {           
            if (data.ResultSet.Table.length > 0) {
                $("#ddlDoctor").empty().append($("<option></option>").val("Select").html("Select")).select2();
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlDoctor").append($("<option></option>").val(value.DoctorId).html(value.DoctorName));
                });
            }

            if (data.ResultSet.Table1.length > 0) {
                $.each(data.ResultSet.Table1, function (key, value) {
                    sessionStorage.setItem('centreId', value.centreId);
                    $("#txtCollectionCenter").text(value.centre_name);
                });
            }
            else {
                alert('Please Contact Admin. Centre Not Authorised.');
                $('body').css('pointer-events', 'none');
                $("#txtCollectionCenter").text('Centre Is not Alloted.');
            }
            var test = "";
            $('#tblTest tbody').empty();
            if (data.ResultSet.Table2.length > 0) {
                $.each(data.ResultSet.Table2, function (key, val) {
                    test += '<tr>';
                    test += '<td><input type="checkbox" /></td>';
                    test += '<td style="display:none">' + val.testCode + '</td>';
                    test += '<td>' + val.testName + '</td>';
                    test += '</tr>';
                });
                $('#tblTest tbody').append(test);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetActiveCampaign() {  
    $("#CampaignDiv").hide();
    $("#ddlCampaignType").empty().append($("<option></option>").val("-").html("Select")).select2();
    var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
    var objBO = {};
    objBO.LabCode = '-';
    objBO.CentreId = sessionStorage.getItem('centreId');
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetActiveCampaign";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            if (data.ResultSet.Table.length > 0) {                
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#CampaignDiv").show();
                    $("#ddlCampaignType").append($("<option></option>").val(value.CampaignId).html(value.ActiveCampaign));
                });
            }
            else {
                //alert('Data Not Found..');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });

}
function GetTestMaster() {
     $('#tblTest tbody').empty();
    var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
    var objBO = {};
    objBO.LabCode = '-';
    objBO.CentreId = sessionStorage.getItem('centreId');
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetTestMaster";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {           
            var tbody = "";           
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += '<tr>';
                    tbody += '<td><input type="checkbox" /></td>';
                    tbody += '<td style="display:none">' + val.testCode + '</td>';
                    tbody += '<td>' + val.testName + '</td>';
                    tbody += '</tr>';
                });
                $('#tblTest tbody').append(tbody);
            }
            else {
                //alert('Data Not Found..');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertPatient() {
    if (sessionStorage.getItem('centreId') == '') {
        alert('Centre Id Not Available.');
        return;
    }
    if (Validation()) {
        if (confirm('Are you sure to Submit?')) {
            var waiting = "<img src='/content/img/waiting.gif' style='width:15px'/>&nbsp;Submitting.."
            $('#btnSubmit').html(waiting).prop('disabled', true);

            var url = config.baseUrl + "/api/MobileApp/Register_Patient";
            var objBO = {};
            var TestCodes = [];
            $('#tblSelectedTest tbody tr').each(function () {
                TestCodes.push($(this).find('td:eq(1)').text());
            });
            objBO.CentreId = sessionStorage.getItem('centreId');
            objBO.PatientType = $('#ddlPatientType option:selected').text();
            objBO.PatientName = $('#txtPatientName').val();
            objBO.MobileNo = $('#txtMobileNo').val();
            objBO.age = $('#txtAge').val();
            objBO.ageType = $('#ddlAgeType option:selected').val();
            objBO.gender = $('#ddlGender option:selected').text();
            objBO.doctorId = $('#ddlDoctor option:selected').val();
            objBO.doctorName = $('#ddlDoctor option:selected').text();
            objBO.remark = '-';
            objBO.TestCodes = TestCodes.join('|');
            objBO.login_id = sessionStorage.getItem('userId');;
            objBO.Logic = "Insert";
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objBO),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.includes('Success')) {
                        $('#btnSubmit').html('Submit');
                        alert('Successfully Registered.');
                        $('#txtPatientName').val('');
                        $('#txtMobileNo').val('');
                        $('#txtAge').val('');
                        $('#txtOTP').val('');
                        $('#ddlAgeType').prop('selectedIndex', '0').change();
                        $('#ddlGender').prop('selectedIndex', '0').change();
                        $('#ddlDoctor').prop('selectedIndex', '0').change();
                        $('#tblTest tbody').find('input[type=checkbox]').prop('checked', false);
                        $('#tblSelectedTest tbody').empty();
                        $("#divFormBody").addClass('Inactive');
                        $("#txtMobileNo").prop('disabled', false);                   
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
}
function Validation() {
    var mobile = $('#txtMobileNo').val();
    var name = $('#txtPatientName').val();
    var gender = $('#ddlGender option:selected').text();
    var age = $('#txtAge').val();
    var doctor = $('#ddlDoctor option:selected').text();
    var test = $('#tblSelectedTest tbody tr').length;

    if (mobile == '') {
        alert('Provide Mobile No.');
        $('#txtMobileNo').css('border-color', 'red').focus();
        return false;
    } else if ((mobile).length < 10) {
        alert('Mobile No should be 10 Digit.');
        $('#txtMobileNo').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtMobileNo').removeAttr('style');
    }
    if (name == '') {
        alert('Please Provide Patient Name.');
        $('#txtPatientName').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtPatientName').removeAttr('style');
    }
    if (gender == 'Select') {
        alert('Please Select Gender.');
        $('#ddlGender').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#ddlGender').removeAttr('style');
    }
    if (age == '') {
        alert('Please Provide Patient Age.');
        $('#txtAge').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtAge').removeAttr('style');
    }
    if (doctor == 'Select') {
        alert('Please Select Prescribed By.');
        $('span.selection').find('span[aria-labelledby=select2-ddlDoctor-container]').css({ 'border-color': 'red' }).focus();
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlDoctor-container]').removeAttr('style');

    }
    if (test < 1) {
        alert('Please Select Test.');
        return false;
    }
    return true;
}
//SMS
function CheckOTPByPass() {
    var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
    var objBO = {};
    objBO.VisitNo = $("#ddlCampaignType option:selected").val();
    objBO.CentreId = query()['CentreId'];
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $("#txtMobileNo").val();
    objBO.Logic = "CheckOTPByPassByCentre2";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    if (val.OTPByPass == 'Y') {
                        IsOTPByPass = true;
                        GetOtp();
                    }
                    else {
                        IsOTPByPass = false;
                        GetOtp();
                    }
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetOtp() {
    //GetOtp
    var mobile = $("#txtMobileNo").val();
    if (mobile != "" || mobile != null) {
        if (mobile.length == 10) {
            $.ajax({
                method: "POST",
                url: config.baseUrl + '/api/MobileApp/GetOtp',
                data: {},
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                success: function (data) {
                    if (data.length == '4') {
                        $("#hidgetotp").val(data);
                        if (!IsOTPByPass) {
                            SendSMS(mobile, data);
                        }
                        else {
                            alert('Verify OTP to Proceed.');
                            $("#txtOTP").val(data);
                        }
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
        else {
            alert('mobile number should be 10 digit');
            return false;
        }
    }
    else {
        alert('Please enter mobile number');
        return false;
    }
}
function verifyOtp() {
    var otpval = $("#hidgetotp").val();
    if (otpval != "") {
        if ($("#hidgetotp").val() == $("#txtOTP").val()) {
            $("#divFormBody").removeClass('Inactive');
            alert('Your mobile validate successfully');
            $("#txtMobileNo").prop('disabled', true);
            $("#hidgetotp").val('');
            $("#txtOTP").val('');
        }
        else {
            alert('OTP does not match');
            $("#txtMobileNo").prop('disabled', false);
            return false;
        }
    }
    else {
        alert('Otp not found');
        return false;
    }
}
function SendSMS(mobileno, otp) {
    var objBO = {};
    objBO.MobileNo = mobileno;
    objBO.Otp = otp;
    $.ajax({
        method: "POST",
        url: config.baseUrl + '/api/MobileApp/SendSMS',
        data: JSON.stringify(objBO),
        //data: { 'mobile': mobileno, 'otp': otp },
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Sent')) {
                //alert('OTP sent successfully.');
                $("#txtOTP").css('border-color', 'green').focus();
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