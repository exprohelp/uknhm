$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
    //GetCentreMaster();
    GetDistrict();
	$('#ddlReport').on('change', function () {
		var val = $(this).find('option:selected').val();
		if (val == 'TestCountBreackup') {
			//$('#txtTo').prop('disabled', true);
			$('#ddlCentre').prop('disabled', true);
            $('#ddlDistrict').prop('disabled', true);
		}
		else {
			$('#txtTo').prop('disabled', false);
			$('#ddlCentre').prop('disabled', false);
            $('#ddlDistrict').prop('disabled', false);
		}
	});
});
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
function GetCentreMaster() {
	var url = config.baseUrl + "/api/Report/MIS_ReportQueries";
	var objBO = {};
    objBO.Prm1 = $('#ddlDistrict option:selected').text();
	objBO.Prm2 = '-';
	objBO.login_id = Active.userId;
    objBO.Logic = "GetCenterByDistrict";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#ddlCentre").empty().append($('<option></option>').val('ALL').html('ALL')).change();
			$.each(data.ResultSet.Table, function (key, val) {
				$("#ddlCentre").append($('<option></option>').val(val.centreId).html(val.centre_name));
			});
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function DownloadExcel() {
	var waiting = "<img src='/Content/img/waiting.gif' style='width:15px'/>&nbsp;Downloading.."
	$('#btnSave').html(waiting).prop('disabled', true).css('width','50%');	
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
	var cartId = $('#ddlCart option:selected').val();
	var itemid = $('#ddlItem option:selected').val();
	if (cartId == "0") {
		alert("Please select Cart");
		return false;
	}
	if (itemid == "0") {
		alert("Please select item");
		return false;
	}
	var objBO = {};
    objBO.DistrictName = $('#ddlDistrict option:selected').text();
	objBO.CentreType = '-';
	objBO.CentreId = $('#ddlCentre option:selected').val();
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.ReportType = 'XL';
	objBO.Logic = $('#ddlReport option:selected').val();
	Global_DownloadExcel1(url, objBO, $('#ddlReport option:selected').text() + ".xlsx");	
}

function Global_DownloadExcel1(Url, objBO, fileName) {
	var ajax = new XMLHttpRequest();
	ajax.open("Post", Url, true);
	ajax.responseType = "blob";
	ajax.setRequestHeader("Content-type", "application/json")
	ajax.onreadystatechange = function () {
		if (this.readyState == 4) {
			var blob = new Blob([this.response], { type: "application/octet-stream" });
			saveAs(blob, fileName); //reference by ~/JsModule/FileSaver.min.js	
			$('#btnSave').html('XL Download').prop('disabled', false).css('width', '38%');
		}
	};
	ajax.send(JSON.stringify(objBO));
}




