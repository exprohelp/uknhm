$(document).ready(function () {
	GetCenterMaster();		
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
			console.log(data)
			if (data.ResultSet.Table.length > 0) {
				if (data.ResultSet.Table.length > 0) {
					var tbody = '';
					var count = 0;
					$.each(data.ResultSet.Table, function (key, val) {
						count++;
						if (val.checked =='unchecked')
							tbody += '<tr style="background:#ffa2a2">';
						else
							tbody += '<tr>';

						tbody += '<td style="display:none">' + val.DoctorId + '</td>';
						tbody += '<td>' + val.DoctorName + '</td>';
						tbody += '<td>' + val.MobileNo + '</td>';
						tbody += '<td>' + val.degree + '</td>';
						tbody += '<td>' + val.specialization + '</td>';
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
