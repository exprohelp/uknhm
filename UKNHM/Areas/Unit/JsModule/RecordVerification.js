$(document).ready(function () {
	$('input:text').attr('autocomplete', 'off');
	FillCurrentDate('txtFrom');
	GetDoctorList();
	GetCenter();
	GetTestMaster();
	$(".btnPresc").on('click', '#btnPresc', function () {
		var doc = $(this).text();
		var path = $(this).data('path');
		if (doc != 'Add More') {
			$('#imgPresc').closest('a').prop('href', path);
			$('#imgPresc').prop('src', path).show();
			$('#btnDeleteDoc').text('Delete ' + doc).show();
			$('.UploadSection').hide();
		}
		else {
			$('.UploadSection').show();
			$('#imgPresc').hide();
			$('#btnDeleteDoc').hide();
		}
	});
	$(".btnPresc").on('click', '#btnDeleteDoc', function () {
		var doc = $(this).text().replace('Delete', '').trim();
		DeleteDoc(doc)
	});
	$("#FileUpload").on('change', function () {
		myFileInput = document.querySelector('input[type="file"]');
		var name = $('#ddlPresc option:selected').text();
		var extn = myFileInput.files[0].name.split('.').pop().toLowerCase();
		$("#txtFileName").text(name + '.' + extn);
	});
	$("#btnFileUpload").on('click', function () {
		$("#FileUpload").trigger('click');
	});
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
	$("#AddNewTest").on('click', function () {
		var tbody = '';
		var rate = $('#txtTestAmount').val();
		var testCode = $("#ddlTestName option:selected").val();
		var testName = $("#ddlTestName option:selected").text();
		var isTest = [];
		$('#tblPatientInfo tbody tr').each(function () {
			isTest.push($(this).find('td:eq(1)').text());
		});
		if ($.inArray(testCode, isTest) < 0) {
			tbody += '<tr class="newTest">';
			tbody += "<td><button class='btn-danger btn-go'><i class='fa fa-trash'></i></button></td>";
			tbody += "<td style='display:none'>" + testCode + "</td>";
			tbody += "<td>" + testName + "</td>";
			tbody += "<td class='text-right'>" + rate + "</td>";
			tbody += "<td><input type='text' class='form-control' disabled=''/></td>";
			tbody += '</tr>';
			$('#tblPatientInfo tbody').append(tbody);
		}
		else {
			alert('This Test Already Selected.');
		}
	});
	$("#ddlTestName").on('change', function () {
		var rate = $(this).find('option:selected').data('rate');
		var testCode = $(this).find('option:selected').val();
		var testName = $(this).find('option:selected').text();
		$('#txtTestAmount').val(rate);
	});
	$("#tblPatientInfo tbody").on('click', 'button', function () {
		$(this).closest('tr').remove();
	});
});
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
				$("#ddlCentreName").empty().append($("<option></option>").val("0").html("Select")).select2();
				$("#ddlCentreName").append($("<option></option>").val("ALL").html("ALL")).select2();
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
function GetTestMaster() {
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
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
			if (data.ResultSet.Table.length > 0) {
				$("#ddlTestName").empty().append($("<option></option>").val("Select").html("Select")).select2();
				$.each(data.ResultSet.Table, function (key, value) {
					$("#ddlTestName").append($("<option data-rate=" + value.rate + "></option>").val(value.testCode).html(value.testName));
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}
function BookingListForVerification() {
	$("#tblPatientRegister tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = $('#ddlCentreName option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = $('#ddlReportType option:selected').text();
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtFrom').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "BookingListForVerification";
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
function BookingListByVisitNo() {
	$("#tblPatientRegister tbody").empty();
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = $('#ddlCentreName option:selected').val();
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
	var url = config.baseUrl + "/api/Unit/Unit_VerificationQueries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = '-';
    objBO.VisitNo = visitNo;
    objBO.Prm1 = window.location.origin;
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
					if (val.IsVerified == 'Y') {
						$("#btnSubmit").hide();
						$("#btnApprove").hide();
						//$("#btnUpdateBarcode").hide();
					}
					else {
						$("#btnSubmit").show();
						$("#btnApprove").show();						
						//$("#btnUpdateBarcode").show();						
					}
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

				$("#tblPatientInfo tbody").empty();
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
						tbody += "<td>-</td>";

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
					$('#imgPresc').closest('a').prop('href', val.virtual_location);
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
				$("#txtFileName").text(ScanDoc.length);
				if (ScanDoc.length > 0)
					button += "<button type='button' id='btnPresc' class='btn-flat btn-default accept'>Add More</button>&nbsp;";

				button += "<button type='button' id='btnDeleteDoc' class='btn-flat btn-warning' style='margin-left:20%'>Delete " + doc + "</button>";		
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
	if ($('#txtVisitNo').text() != '') {
		objBO.push({
			'VisitNo': $('#txtVisitNo').text(),
			'PatientName': $('#txtPatientName').val(),
			'Gender': $('#ddlGender option:selected').text(),
			'Age': $('#txtAge').val(),
			'AgeType': $('#ddlAgeType option:selected').text(),
			'DoctorId': $('#ddlDoctor option:selected').val(),
			'TestCode': '-',
			'Amount': '-',
			'IsCancelled': -1,
			'CancelRemark': '-',
			'hosp_id': 'CH01',
			'login_id': Active.userId,
			'Logic': 'UpdateOrCancel',
		});
	}
	$('#tblPatientInfo tbody tr.newTest').each(function () {
		objBO.push({
			'VisitNo': $('#txtVisitNo').text(),
			'PatientName': $('#txtPatientName').val(),
			'Gender': $('#ddlGender option:selected').text(),
			'Age': $('#txtAge').val(),
			'AgeType': $('#ddlAgeType option:selected').text(),
			'DoctorId': $('#ddlDoctor option:selected').val(),
			'TestCode': $(this).find('td:eq(1)').text(),
			'Amount': $(this).find('td:eq(3)').text(),
			'IsCancelled': 0,
			'CancelRemark': '-',
			'hosp_id': 'CH01',
			'login_id': Active.userId,
			'Logic': 'UpdateOrCancel',
		});
	});
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
function Approve() {
	var url = config.baseUrl + "/api/Unit/Unit_InsertUpdateVerification";
	var objBO = [];
	if ($('#txtVisitNo').text() != '') {
		objBO.push({
			'VisitNo': $('#txtVisitNo').text(),
			'PatientName': '',
			'Gender': '',
			'Age': '',
			'AgeType': '',
			'DoctorId': '',
			'TestCode': '',
			'Amount': '',
			'IsCancelled': 0,
			'CancelRemark': '-',
			'hosp_id': 'CH01',
			'login_id': Active.userId,
			'Logic': 'Verify'
		});
	}
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
				$("#modalPatientInfo").modal('hide');
				$("#tblPatientRegister tbody tr").each(function () {
					var visiNo = $('#txtVisitNo').text();
					if ($(this).find('td:eq(0)').text() == visiNo)
						$(this).closest('tr').remove();
				});
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
function UpdateBarcode() {
	if (confirm('Are You Sure to Update Barcode?')) {
		if ($('#txtBarcodeNo').val() == '') {
			alert('Please Enter Barcode No.');
			return
		}
		var url = config.baseUrl + "/api/Unit/Insert_ScanedDocument";
		var objBO = {};
		objBO.VisitNo = $('#txtVisitNo').text();
		objBO.CentreId = '-';
		objBO.doc_name = '-';
		objBO.barcodeNo = $('#txtBarcodeNo').val();
		objBO.doc_location = '-';
		objBO.fSize = '-';
		objBO.login_id = Active.userId;
		objBO.Logic = 'UpdateBarCode';
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
function DeleteDoc(docName) {
	var url = config.baseUrl + "/api/Unit/Unit_InsertUpdateVerification";
	var objBO = [];
	if ($('#txtVisitNo').text() != '') {
		objBO.push({
			'VisitNo': $('#txtVisitNo').text(),
			'PatientName': '',
			'Gender': '',
			'Age': '',
			'AgeType': '',
			'DoctorId': '',
			'TestCode': '',
			'Prm1': docName,
			'Amount': '',
			'IsCancelled': 0,
			'CancelRemark': '-',
			'hosp_id': 'CH01',
			'login_id': Active.userId,
			'Logic': 'DeleteDoc'
		});
	}
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('Success')) {
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
function UploadPresc1() {
	var url = config.baseUrl + "/api/Utility/UploadPrescription";
	var objBO = {};
	objBO.imageByte = $('input[id=FileUpload]')[0].files[0];
	objBO.ImageName = '07-2021\UK001\UK001_21-22_000006_IDCard.jpeg';
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
function InsertPresc(doc_location, fSize) {
	var url = config.baseUrl + "/api/Unit/Insert_ScanedDocument";
	var objBO = {};
	objBO.VisitNo = $('#txtVisitNo').text();
	objBO.CentreId = $('#txtCentreId').text();
	objBO.doc_name = $('#ddlPresc option:selected').text();
	objBO.barcodeNo = $('#txtBarcodeNo').val();
	objBO.doc_location = doc_location;
	objBO.fSize = fSize;
	objBO.login_id = Active.userId;
	objBO.Logic = 'ReUploadPrescription';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.includes('OK')) {
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
function UploadPresc() {
	if ($('input[id=FileUpload]')[0].files.length > 0) {
		var url = config.baseUrl + "/api/Utility/UploadPrescription";
		var objBO = {};
		objBO.VisitNo = $('#txtVisitNo').text();
		objBO.CentreId = $('#txtCentreId').text();
		objBO.barcodeNo = $('#txtBarcodeNo').val();
		objBO.doc_name = $('#ddlPresc option:selected').text();
		objBO.ImageName = $("#txtFileName").text();
		objBO.login_id = Active.userId;
		objBO.ServerUrl = window.location.origin;
		objBO.Logic = 'ReUploadPrescription';	
		var UploadDocumentInfo = new XMLHttpRequest();
		var data = new FormData();
		data.append('obj', JSON.stringify(objBO));
		data.append('ImageByte', $('input[id=FileUpload]')[0].files[0]);
		UploadDocumentInfo.onreadystatechange = function () {
			if (UploadDocumentInfo.status) {
				if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
					var json = JSON.parse(UploadDocumentInfo.responseText);
					if (json.Message.includes('OK')) {
						alert('Uploaded Successfully');
						PatientInfo(objBO.VisitNo);
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
	else {
		alert('Please Choose Document..!');
	}
}
function IsValid(upload) {
	var files = $(upload).get(0).files;
	var data1 = files[0]['name'].split('.');
	var photo1 = data1[0] + '.' + data1[1];
	if (files.length > 0) {
		if ((files[0].type == 'image/jpeg') || (files[0].type == 'image/png') || (files[0].type == 'image/jpg') || (files[0].type == 'application/pdf')) {
			var size = parseInt((files[0].size) / 1024);
			if (size > 2000) {
				$('input[type=file]').val('');
				$('#txtFileName').text('');
				alert('File Size should be less then 2 MB.');
				return false;
			}
		}
		else {
			$('input[type=file]').val('');
			$('#txtFileName').text('');
			alert('File is Not Valid.');
			return false;
		}
	}
	return true;
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