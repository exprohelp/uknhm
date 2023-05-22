$(document).ready(function () {
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
});

function DownloadExcel() {
	var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries";
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
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.Prm2 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.ReportType = 'XL';
	objBO.Logic = "RawDataTestWise";
	Global_DownloadExcel(url, objBO, "RawData.xlsx");
}
