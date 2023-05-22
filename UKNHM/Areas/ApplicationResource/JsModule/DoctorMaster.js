var _doctorId = '';
$(document).ready(function () {
	GetCenterMaster();
	GetDegreeSpec();
	$("#ddlCentre").on('change', function () {
		var centerId = $(this).find('option:selected').val();
		var centerName = $(this).find('option:selected').text();
		$('#centreName').text("Centre Name : " + centerName);
		$('#centreId').text(centerId);
	});
});
function GetCenterMaster() {
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetCenterMaster";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				//Center Name
				$("#ddlCentre").empty().append($("<option></option>").val("Select").html("Select")).select2();
				$.each(data.ResultSet.Table, function (key, val) {
					$("#ddlCentre").append($("<option></option>").val(val.centreId).html(val.centre_name));
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetDoctorMaster() {
	$('#tblDoctorMaster tbody').empty();
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = $("#ddlCentre option:selected").val();
	objBO.Prm2 = '-';
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
				if (data.ResultSet.Table.length > 0) {
					var tbody = '';
					var count = 0;
					$.each(data.ResultSet.Table, function (key, val) {
						count++;
						tbody += '<tr>';
						tbody += '<td style="display:none">' + val.DoctorId + '</td>';
						tbody += "<td>";
						tbody += "<label class='switch'>";
						tbody += "<input type='checkbox' data-userid=" + val.UserId + " onchange=UpdateStatus('" + val.DoctorId + "') data-isactive=" + val.IsActive + " class='IsActive' id='chkActive' " + val.checked + ">";
						tbody += "<span class='slider round'></span>";
						tbody += "</label>";
						tbody += "</td>";
						tbody += '<td>' + val.DoctorName + '</td>';
						tbody += '<td>' + val.MobileNo + '</td>';
						tbody += '<td>' + val.degree + '</td>';
						tbody += '<td>' + val.specialization + '</td>';
						tbody += '<td><button class="btn-danger" onclick=selectRow(this);GetDoctorInfo("' + val.DoctorId + '")><i class="fa fa-sign-in">&nbsp;</i></button></td>';
						tbody += '</tr>';
					});
					$('#tblDoctorMaster tbody').append(tbody);
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetDoctorInfo(doctorId) {
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = doctorId;
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetDoctorByDoctorId";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				if (data.ResultSet.Table.length > 0) {
					$.each(data.ResultSet.Table, function (key, val) {
						_doctorId = val.DoctorId;
						$('#txtDoctorName').val(val.DoctorName);
						$('#txtMobile').val(val.MobileNo);
						$('#ddlDegree option').each(function () {
							if ($(this).text() == val.degree) {
								$('#ddlDegree').prop('selectedIndex', '' + $(this).index() + '').change();
							}
						});
						$('#ddlSpecialization option').each(function () {
							if ($(this).text() == val.specialization) {
								$('#ddlSpecialization').prop('selectedIndex', '' + $(this).index() + '').change();
							}
						});
					});
					$('#btnSaveDoctor').text('Update');
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function GetDegreeSpec() {
	var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
	var objBO = {};
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
	objBO.Logic = "GetDegreeSpec";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				//Degree
				$("#ddlDegree").empty().append($("<option></option>").val("Select").html("Select")).select2();
				$.each(data.ResultSet.Table, function (key, val) {
					$("#ddlDegree").append($("<option></option>").val(val.DegId).html(val.DegreeName));
				});
				//Specialization
				$("#ddlSpecialization").empty().append($("<option></option>").val("Select").html("Select")).select2();
				$.each(data.ResultSet.Table1, function (key, val) {
					$("#ddlSpecialization").append($("<option></option>").val(val.Spec_id).html(val.SpecializationName));
				});
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function InsertDoctor() {
	if (Validation()) {
		if (confirm('Are you sure to Submit?')) {
			var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
			var objBO = {};
			objBO.DoctorId = _doctorId;
			objBO.DoctorName = $('#txtDoctorName').val();
			objBO.Degree = $('#ddlDegree option:selected').text();
			objBO.Specialization = $('#ddlSpecialization option:selected').text();
			objBO.CenterId = $('#centreId').text();
			objBO.MobileNo = $('#txtMobile').val();
			objBO.Prm1 = '-';
			objBO.Prm2 = '-';
			objBO.login_id = Active.userId;
			objBO.Logic = ($('#btnSaveDoctor').text() == 'Submit') ? 'InsertDoctor' : 'UpdateDoctor';
			$.ajax({
				method: "POST",
				url: url,
				data: JSON.stringify(objBO),
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					if (data.includes('Success')) {
						alert(data);
						Clear();
						GetDoctorMaster();
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
function UpdateStatus(doctorId) {
	var url = config.baseUrl + "/api/ApplicationResources/InsertUpdatemaster";
	var objBO = {};
	objBO.DoctorId = doctorId;
	objBO.login_id = Active.userId;
	objBO.Logic = 'UpdateDoctorStatus';
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			GetDoctorMaster();
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});

}
function Validation() {
	var CenterId = $('#centreId').text();
	var doctorName = $('#txtDoctorName').val();
	var degree = $('#ddlDegree option:selected').text();
	var specialization = $('#ddlSpecialization option:selected').text();

	if (CenterId == '') {
		alert('Please Select Centre Name.');
		$('span.selection').find('span[aria-labelledby=select2-ddlCentre-container]').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlCentre-container]').removeAttr('style');
	}
	if (doctorName == '') {
		alert('Please Provide Doctor Name.');
		$('#txtDoctorName').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('#txtDoctorName').removeAttr('style');
	}
	if (degree == 'Select') {
		alert('Please Select Degree.');
		$('span.selection').find('span[aria-labelledby=select2-ddlDegree-container]').css('border-color', 'red').focus();
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlDegree-container]').removeAttr('style');
	}
	if (specialization == 'Select') {
		alert('Please Select Specialization.');
		$('span.selection').find('span[aria-labelledby=select2-ddlSpecialization-container]').css({ 'border-color': 'red' }).focus();
		return false;
	}
	else {
		$('span.selection').find('span[aria-labelledby=select2-ddlSpecialization-container]').removeAttr('style');
	}
	return true;
}
function Clear() {
	$('input:text').val('');
	$('#ddlDegree').prop('selectedIndex', '0').change();
	$('#ddlSpecialization').prop('selectedIndex', '0').change();
	$('#btnSaveDoctor').text('Submit')
	_doctorId = '';
}