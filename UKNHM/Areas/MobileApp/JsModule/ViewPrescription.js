$(document).ready(function () {
	FillCurrentDate('txtFrom');
	$(document).on('click', 'button.btn-view', function () {		
		var src = $(this).data('pres');
		$('#imgPresc').prop('src', src);
		$('#modalPrescriptionInfo').modal('show');
	});
});


function GetPrescriptionInfo(logic) {
	var url = config.baseUrl + "/api/MobileApp/MobileApp_Queries";
	var objBO = {};
	objBO.LabCode = '-';
	objBO.CentreId = sessionStorage.getItem('centreId');
	objBO.VisitNo = $('#txtInput').val();
	objBO.Prm1 = $('#txtInput').val();
	objBO.from = $('#txtFrom').val();
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = logic;
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			var tbody = "";
			var VisitNo = "";
			$('#Prescription').empty();
			if (data.ResultSet.Table.length > 0) {
				$.each(data.ResultSet.Table, function (key, val) {
					if (VisitNo != val.VisitNo) {
						tbody += '<div class="info">';
						tbody += '<span><b>Name :</b> ' + val.PatientName + '   <b>Visit No :</b> ' + val.VisitNo + '</span>';
						//tbody += '<download><button class="btn-primary btn-xs bn1 pull-left">Download</button><div class="flex pull-right"><input id="txtFrom" maxlength="10" class="bn" placeholder="Mobile No." type="text" value=' + val.MobileNo + ' style="width:66%"/><button style="width:34%" class="btn-primary btn-xs bn1 pull-left">Send Report</button></div></download>';
						tbody += '<div class="table table-responsive" style="border:1px solid #ccc;padding: 3px;">';
						tbody += '<table class="table-bordered" id="tblPrescInfo" style="width: 100%;">';
						tbody += '<tbody>';
						VisitNo = val.VisitNo;
						$.each(data.ResultSet.Table, function (key, val) {
							if (VisitNo == val.VisitNo) {
								tbody += '<tr>';
								tbody += '<td>' + val.doc_name + '</td>';
								tbody += '<td style="width:10%"><button class="btn-view btn-warning" data-pres=' + val.virtual_location + '>View</button></td>';
								tbody += '</tr>';
							}
						});
						tbody += '</tbody>';
						tbody += '</table>';
						tbody += '</div></div>';
					}
				});
				$('#Prescription').append(tbody);
				$('#txtInput').val('');
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

