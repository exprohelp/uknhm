$(document).ready(function () {
	$('input:text').attr('autocomplete', 'off');
	FillCurrentDate('txtFrom');
	GetDoctorList();	

	$("#tblPatientInfo thead").on('keyup', 'input:text', function () {
		var remark = $(this).val();
		$(this).parents('table').find('tbody tr').find('input:text').val(remark);
	});
	$("#tblPatientInfo thead").on('change', 'input[type=checkbox]', function () {
		var isCheck = $(this).is(':checked');
		if (isCheck) {
			$("#tblPatientInfo tbody").find('input[type=checkbox]').prop('checked', true);
			$("#tblPatientInfo tbody tr").addClass('IsCancel');
		}
		else {
			$("#tblPatientInfo tbody").find('input[type=checkbox]').prop('checked', false);
			$("#tblPatientInfo tbody tr").removeClass('IsCancel');
		}
	});
	$("#tblPatientInfo tbody").on('change', 'input[type=checkbox]', function () {
		var isCheck = $(this).is(':checked');
		if (isCheck) {
			$(this).closest('tr').addClass('IsCancel');
		}
		else {
			$(this).closest('tr').removeClass('IsCancel');
		}
	});		
    $("#tblPatientInfo tbody").on('click', '#btnCancelTest', function () {
        var visitNo = $('#txtVisitNo').text();
        var testCode = $(this).closest('tr').find('td:eq(1)').text();
        DirectLinkForCancelTest(visitNo, testCode);
	});
});
var tmpAnimation = 0;
function Rotate() {
	var element = $("#imgPresc");
	tmpAnimation += 90;

	$({ degrees: tmpAnimation - 90 }).animate({ degrees: tmpAnimation }, {
		duration: 2000,
		step: function (now) {
			element.css({
				transform: 'rotate(' + now + 'deg)'
			});
		}
	});
}
function GetDoctorList() {
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
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
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function BookingListByVisitNo() {
	$("#tblPatientRegister tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#txtInput').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtFrom').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "BookingListForVerificationByVisitNo";
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
						tbody += "<td colspan='10'>Centre Name : " + val.centre_name + "</td>";
						tbody += "</tr>";
						centre = val.centre_name
					}
					tbody += "<tr>";
					tbody += "<td>" + val.VisitNo + "</td>";
					tbody += "<td>" + val.barcode_no + "</td>";
					tbody += "<td>" + val.visitDate + "</td>";
					tbody += "<td>" + val.PatientName + "</td>";
					tbody += "<td>" + val.Age + "</td>";
					tbody += "<td>" + val.Gender + "</td>";
					tbody += "<td>" + val.PrescribedBy + "</td>";
					tbody += "<td class='text-right'>" + val.BillAmount + "</td>";
					tbody += "<td><button class='btn-danger btn-go' onclick=selectRow();PatientInfo('" + val.VisitNo + "')>View</button></td>";
					tbody += "<td>" + val.ApproveDate + "</td>";
					tbody += "</tr>";
				});
				$("#tblPatientRegister tbody").append(tbody);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function PatientInfo(visitNo) {
    $("#tblPatientInfo tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = visitNo;
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "PatientInfo";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {					
					$("#txtVisitNo").text(val.VisitNo);
					$("#txtBarcodeNo").val(val.barcode_no);
					$("#txtCentreId").text(val.centreId);
					$("#txtUnitName").text(val.centre_name);
					$("#txtAge").val(val.age);
					$("#txtPatientName").val(val.PatientName);
					$("#txtMobileNo").text(val.MobileNo);
					$("#ddlAgeType option").map(function () {
						if ($(this).text() == val.AgeType) {
							$("#ddlAgeType").prop('selectedIndex', '' + $(this).index() + '').change();
						}
					});
					$("#ddlGender option").map(function () {
						if ($(this).val() == val.gender) {
							$("#ddlGender").prop('selectedIndex', '' + $(this).index() + '').change();
						}
					});
					$("#ddlDoctor option").map(function () {
						if ($(this).val() == val.DoctorId) {
							$("#ddlDoctor").prop('selectedIndex', '' + $(this).index() + '').change();
						}
					});
				});

			
				var tbody = '';
				var count = 0;
				var total = 0;
				var discount = 0;
				var totalAmt = 0;
				$.each(data.ResultSet.Table1, function (key, val) {

					if (val.IsCancelled == '1')
						tbody += "<tr class='bg-danger'>";
					else
						tbody += "<tr>";

					if (val.IsCancelled == '0')
						tbody += "<td><input type='checkbox'/></td>";
					else
						tbody += "<td><button id='btnCancelTest' class='btn btn-danger btn-xs'><i class='fa fa-refresh'></i></button></td>";

					tbody += "<td style='display:none'>" + val.testCode + "</td>";
					tbody += "<td>" + val.testName + "</td>";
					tbody += "<td class='text-right'>" + val.netAmount + "</td>";
					tbody += "<td><input type='text' class='form-control' value='" + val.CancelRemark + "'/></td>";
					tbody += "</tr>";
				});
				$("#tblPatientInfo tbody").append(tbody);
				var button = '';
				var NoImage = '';
				var img = '';
				var doc = '';
				var IsDelete = 0;
				var ScanDoc = ['PRC_1', 'PRC_2', 'IDCard'];
				$('#imgPresc').prop('src', '');
				$('.btnPresc').empty();
				$('#ddlPresc').empty().append($('<option></option>').val('0').html('Select')).change();
				$.each(data.ResultSet.Table2, function (key, val) {
					$('#imgPresc').prop('src', val.virtual_location);
					img = val.virtual_location;
					doc = val.doc_name;
					ScanDoc.splice(ScanDoc.indexOf(val.doc_name), 1);
					button += "<button type='button' id='btnPresc' data-path='" + val.virtual_location + "' class='btn-flat btn-success accept'>" + val.doc_name + "</button>&nbsp;";
				});
				for (i = 0; i < ScanDoc.length; i++) {
					IsDelete++
					$('#ddlPresc').append($('<option></option>').val(ScanDoc[i]).html(ScanDoc[i]));
				}							
				button += "<button type='button' id='btnRotate' class='btn-flat btn-danger' onclick=Rotate() style='margin-left:20%'>Rotate Image</button>";
				$('.btnPresc').append(button);
				$("#modalPatientInfo").modal('show');
				$('.UploadSection').hide();
			}

		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function Insert() {
	//var IsRemark = $('#tblPatientInfo tbody tr.IsCancel').map(function () {

	//});
	var url = config.baseUrl + "/api/Unit/Unit_InsertUpdateVerification";
	var objBO = [];
	//if ($('#txtVisitNo').text() != '') {
	//	objBO.push({
	//		'VisitNo': $('#txtVisitNo').text(),
	//		'PatientName': $('#txtPatientName').val(),
	//		'Gender': $('#ddlGender option:selected').text(),
	//		'Age': $('#txtAge').val(),
	//		'AgeType': $('#ddlAgeType option:selected').text(),
	//		'DoctorId': $('#ddlDoctor option:selected').val(),
	//		'TestCode': '-',
	//		'Amount': '-',
	//		'IsCancelled': -1,
	//		'CancelRemark': '-',
	//		'hosp_id': 'CH01',
	//		'login_id': Active.userId,
	//		'Logic': 'UpdateOrCancel',
	//	});
	//}
	//$('#tblPatientInfo tbody tr.newTest').each(function () {
	//	objBO.push({
	//		'VisitNo': $('#txtVisitNo').text(),
	//		'PatientName': $('#txtPatientName').val(),
	//		'Gender': $('#ddlGender option:selected').text(),
	//		'Age': $('#txtAge').val(),
	//		'AgeType': $('#ddlAgeType option:selected').text(),
	//		'DoctorId': $('#ddlDoctor option:selected').val(),
	//		'TestCode': $(this).find('td:eq(1)').text(),
	//		'Amount': $(this).find('td:eq(3)').text(),
	//		'IsCancelled': 0,
	//		'CancelRemark': '-',
	//		'hosp_id': 'CH01',
	//		'login_id': Active.userId,
	//		'Logic': 'UpdateOrCancel',
	//	});
	//});
	$('#tblPatientInfo tbody tr.IsCancel').each(function () {
		objBO.push({
			'VisitNo': $('#txtVisitNo').text(),
			'PatientName': $('#txtPatientName').val(),
			'Gender': $('#ddlGender option:selected').text(),
			'Age': $('#txtAge').val(),
			'AgeType': $('#ddlAgeType option:selected').text(),
			'DoctorId': $('#ddlDoctor option:selected').val(),
			'TestCode': $(this).find('td:eq(1)').text(),
			'Amount': $(this).find('td:eq(3)').text(),
			'IsCancelled': 1,
			'CancelRemark': $(this).find('td:eq(4)').find('input:text').val(),
			'hosp_id': 'CH01',
			'login_id': Active.userId,
			'Logic': 'UpdateOrCancel',
		});
	});
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				alert(data);
				var visitNo = $('#txtVisitNo').text();
				PatientInfo(visitNo);
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
function ChangeDoctor() {
	if (confirm('Are You Sure to Change Doctor?')) {
		if ($('#txtBarcodeNo').val() == '') {
			alert('Please Enter Barcode No.');
			return
		}
		var url = config.baseUrl + "/api/Unit/Insert_ScanedDocument";
		var objBO = {};
		objBO.VisitNo = $('#txtVisitNo').text();
		objBO.CentreId = '-';
		objBO.doc_name = '-';
		objBO.barcodeNo = $('#ddlDoctor').val();
		objBO.doc_location = '-';
		objBO.fSize = '-';
		objBO.login_id = Active.userId;
		objBO.Logic = 'ChangeDoctor';
		$.ajax({
			method: "POST",
			url: url,
			data: JSON.stringify(objBO),
			dataType: "json",
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.includes('OK')) {
					alert('Barcode Updated Successfully.');
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
function DirectLinkForCancelTest(visitNo,testCode) {
    if (confirm('Are You Sure to Cancel Test?')) {       
        var url = config.baseUrl + "/api/Unit/ItDose_DirectLinkForCancelTest";
        var objBO = {};
        objBO.VisitNo = visitNo;
        objBO.TestCodes = testCode;   
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data);
                alert(data)
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}