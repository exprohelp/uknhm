$(document).ready(function () {
	$('input:text').attr('autocomplete', 'off');
	FillCurrentDate('txtFrom');
	FillCurrentDate('txtTo');
	RegionAndDistrict();
	BarChart();
	$('.panel-group').on('hidden.bs.collapse', toggleIcon);
	$('.panel-group').on('shown.bs.collapse', toggleIcon);
});

function toggleIcon(e) {
	$(e.target)
		.prev('.panel-heading')
		.find(".more-less")
		.toggleClass('glyphicon-plus glyphicon-minus');
}
function GetDashboard() {
	var url = config.baseUrl + "/api/Report/pMIS_FinCommisionQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "Dashboard";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data);
			if (data.ResultSet.Table.length > 0) {
				$("#tblDashboard tbody").empty();
				var tbody = '';
				var count = 0;
				$.each(data.ResultSet.Table, function (key, val) {
					count++;
					tbody += "<tr>";
					tbody += "<td>" + count + "</td>";
					tbody += "<td>" + val.CentreType + "</td>";
					tbody += "<td>" + val.centre_name + "</td>";
					tbody += "<td class='text-right'>" + val.PatientCount + "</td>";
					tbody += "<td class='text-right'>" + val.TestCount + "</td>";
					tbody += "<td><button class='btn-danger btn-go'><i class='fa fa-sign-in'></i></button></td>";
					tbody += "</tr>";
				});
				$("#tblDashboard tbody").append(tbody);
				PopulateChartBP(data.ResultSet.Table);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function RegionAndDistrict() {
	$("#accordionKumaon").empty();
	$("#accordionGarwal").empty();
	var url = config.baseUrl + "/api/Report/pMIS_FinCommisionQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "DashBoard:Admin-RegionAndDistrict";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (data.ResultSet.Table.length > 0) {
				$("#accordion").empty();
				var region = '';
				var panel = '';
				var panel1 = '';
				var patient = 0;
				var test = 0;
				var amount = 0;
				var approve = 0;
				var PHCAmount = 0;
				var UPHCAmount = 0;
				var KPHCAmount = 0;
				var KUPHCAmount = 0;
				var GPHCAmount = 0;
				var GUPHCAmount = 0;
				$.each(data.ResultSet.Table, function (key, val) {
					patient += val.tPatientCount;
					test += val.tTestCount;
					amount += val.tAmount;
					approve += val.tCMSAprPend;
					PHCAmount += val.PHCAmount;
					UPHCAmount += val.UPHCAmount;
					if (val.regionName == 'Kumaon') {
						$('#txtKumaonTotalPatient').text(val.tPatientCount);
						$('#txtKumaonTotalTest').text(val.tTestCount);
						$('#txtKumaonTotalAmount').text(val.tAmount);
						$('#txtKumaonTotalAppr').text(val.tCMSAprPend);
						KPHCAmount += val.PHCAmount;
						KUPHCAmount += val.UPHCAmount;
					}
					if (val.regionName == 'Garhwal') {
						$('#txtGarwalTotalPatient').text(val.tPatientCount);
						$('#txtGarwalTotalTest').text(val.tTestCount);
						$('#txtGarwalTotalAmount').text(val.tAmount);
						$('#txtGarwalTotalAppr').text(val.tCMSAprPend);
						GPHCAmount += val.PHCAmount;
						GUPHCAmount += val.UPHCAmount;
					}
				});
				$('#bxTotalPatient').text(patient);
				$('#bxTotalTest').text(test);
				$('#bxTotalAmount').text(amount);
				$('#bxTotalApprove').text(approve);
				$('#bxPHCAmt').text(PHCAmount.toFixed(0));
				$('#bxUPHCAmt').text(UPHCAmount.toFixed(0));
				$('#txtKPHCAmt').text(KPHCAmount.toFixed(0));
				$('#txtKUPHCAmt').text(KUPHCAmount.toFixed(0));
				$('#txtGPHCAmt').text(GPHCAmount.toFixed(0));
				$('#txtGUPHCAmt').text(GUPHCAmount.toFixed(0));
				$.each(data.ResultSet.Table1, function (key, val) {

					if (val.regionName == 'Kumaon') {
						var districtName = val.districtName.replace(/\s/g, '');
						CentreByDistrict(val.districtName);
						panel += '<div class="panel panel-default">';
						panel += '<div class="panel-heading" role="tab" id="headingOne">';
						panel += '<h4 class="panel-title">';
						panel += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + districtName + '" aria-expanded="true" aria-controls="collapseOne">';
						panel += '<i class="more-less glyphicon glyphicon-plus"></i>';
						panel += '' + val.districtName + ' <div class="total-panel"><div class="title-total">Patient : ' + val.tPatientCount + '</div><div class="title-total"> Test : ' + val.tTestCount + '</div><div class="title-total"> Amount : ' + val.tAmount + '</div></div>';
						panel += '</a>';
						panel += '</h4>';
						panel += '</div>';
						panel += '<div id="' + districtName + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
						panel += '<div class="panel-body" style="padding:0">';
						panel += '<div class="scroll">';
						panel += '<table class="table table-bordered" id="tbl' + districtName + '">';
						panel += '<thead>';
						panel += '<tr>';
						panel += '<th>Centre Name</th>';
						panel += '<th style="width: 15%;text-align:right">Patient</th>';
						panel += '<th style="width: 15%;text-align:right">Test</th>';
						panel += '<th style="width: 16%;text-align:right">Amount</th>';
						panel += '<th style="width: 18%;">Pend. Appr.</th>';
						panel += '</tr>';
						panel += '</thead>';
						panel += '<tbody>';
						panel += '</tbody>';
						panel += '</table>';
						panel += '</div>';
						panel += '</div>';
						panel += '</div></div>';
					}
					if (val.regionName == 'Garhwal') {
						var districtName = val.districtName.replace(/\s/g, '');
						CentreByDistrict(val.districtName);
						panel1 += '<div class="panel panel-default">';
						panel1 += '<div class="panel-heading" role="tab" id="headingOne">';
						panel1 += '<h4 class="panel-title">';
						panel1 += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + districtName + '" aria-expanded="true" aria-controls="collapseOne">';
						panel1 += '<i class="more-less glyphicon glyphicon-plus"></i>';
						panel1 += '' + val.districtName + ' <div class="total-panel"><div class="title-total">Patient : ' + val.tPatientCount + '</div><div class="title-total"> Test : ' + val.tTestCount + '</div><div class="title-total"> Amount : ' + val.tAmount + '</div></div>';
						panel1 += '</a>';
						panel1 += '</h4>';
						panel1 += '</div>';
						panel1 += '<div id="' + districtName + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
						panel1 += '<div class="panel-body" style="padding:0">';
						panel1 += '<div class="scroll">';
						panel1 += '<table class="table table-bordered" id="tbl' + districtName + '">';
						panel1 += '<thead>';
						panel1 += '<tr>';
						panel1 += '<th>Centre Name</th>';
						panel1 += '<th style="width: 15%;text-align:right">Patient</th>';
						panel1 += '<th style="width: 15%;text-align:right">Test</th>';
						panel1 += '<th style="width: 16%;text-align:right">Amount</th>';
						panel1 += '<th style="width: 18%;">Pend. Appr.</th>';
						panel1 += '</tr>';
						panel1 += '</thead>';
						panel1 += '<tbody>';
						panel1 += '</tbody>';
						panel1 += '</table>';
						panel1 += '</div>';
						panel1 += '</div>';
						panel1 += '</div></div>';
					}
				});
				$("#accordionKumaon").append(panel);
				$("#accordionGarwal").append(panel1);
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function CentreByDistrict(district) {
	var url = config.baseUrl + "/api/Report/pMIS_FinCommisionQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = district;
	objBO.from = $('#txtFrom').val();
	objBO.to = $('#txtTo').val();
	objBO.login_id = Active.userId;
	objBO.Logic = "DashBoard:Admin-CentreByDistrict";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			$("#tbl" + district.replace(/\s/g, '') + " tbody").empty();
			var tbody = '';
			$.each(data.ResultSet.Table, function (key, val) {
				tbody += "<tr>";
				tbody += "<td>" + val.centre_name + "</td>";
				tbody += "<td class='text-right'>" + val.tPatientCount + "</td>";
				tbody += "<td class='text-right'>" + val.tTestCount + "</td>";
				tbody += "<td class='text-right'>" + val.tAmount + "</td>";
				tbody += "<td class='text-right'>" + val.tCMSAprPend + "</td>";
				tbody += "</tr>";
			});
			$("#tbl" + district.replace(/\s/g, '') + " tbody").append(tbody);
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function BarChart() {
	var url = config.baseUrl + "/api/Report/pMIS_FinCommisionQueries";
	var objBO = {};
	objBO.DistrictName = '-';
	objBO.CentreType = '-';
	objBO.CentreId = '-';
	objBO.VisitNo = '-';
	objBO.Prm1 = '-';
	objBO.from = '1900/01/01';
	objBO.to = '1900/01/01';
	objBO.login_id = Active.userId;
	objBO.Logic = "DashboardChart";
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			if (Object.keys(data.ResultSet).length > 0) {
				if (Object.keys(data.ResultSet.Table).length > 0) {
					var xValues = [];
					var yValues = [];
					var minValue = 0;
					var maxValue = 0;
					$.each(data.ResultSet.Table, function (key, val) {
						xValues.push(val.month_name);
						yValues.push(val.patientCount);
					});
					$('#chartKumaon').remove(); // this is my <canvas> element
					$('#divChartKumaon').append('<canvas id="chartKumaon"><canvas><br />');
					canvas = document.querySelector('#chartKumaon');
					ctxL = canvas.getContext('2d');
					//var ctxL = document.getElementById("divChartGarwal").getContext('2d');
					var myLineChart = new Chart(ctxL, {
						type: 'bar',
						data: {
							labels: xValues,
							datasets: [
								{
									label: "Kumaon Patient",
									data: yValues,
									backgroundColor: [
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)'
									],
									borderColor: [
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)'
									],
									borderWidth: 1
								}
							]
						}
					});
				}
				if (Object.keys(data.ResultSet.Table1).length > 0) {
					var xValues = [];
					var yValues = [];
					var minValue = 0;
					var maxValue = 0;
					$.each(data.ResultSet.Table1, function (key, val) {
						xValues.push(val.month_name);
						yValues.push(val.patientCount);
					});
					$('#chartGarwal').remove(); // this is my <canvas> element
					$('#divChartGarwal').append('<canvas id="chartGarwal"><canvas><br />');
					canvas = document.querySelector('#chartGarwal');
					ctxL = canvas.getContext('2d');
					//var ctxL = document.getElementById("divChartGarwal").getContext('2d');
					var myLineChart = new Chart(ctxL, {
						type: 'bar',
						data: {
							labels: xValues,
							datasets: [
								{
									label: "Garhwal Patient",
									data: yValues,
									backgroundColor: [
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)',
										'rgba(255, 99, 132, 0.2)'
									],
									borderColor: [
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)',
										'rgba(255,99,132,1)'
									],
									borderWidth: 1
								}
							]
						}
					});
				}
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}
function PopulateAccordian() {
	var panel = '';
	panel += '<div class="panel panel-default">';
	panel += '<div class="panel-heading" role="tab" id="headingOne">';
	panel += '<h4 class="panel-title">';
	panel += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">';
	panel += '<i class="more-less glyphicon glyphicon-plus"></i>';
	panel += 'Almora <div class="total-panel"><span class="title-total">Patient : 32564</span><span class="title-total"> Test : 56234</span><span class="title-total"> Amount : 462564</span></div>';
	panel += '</a>';
	panel += '</h4>';
	panel += '</div>';
	panel += '<div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
	panel += '<div class="panel-body">';
	panel += '<div class="scroll">';
	panel += '<table class="table table-bordered" id="tblPatientInfo">';
	panel += '<thead>';
	panel += '<tr>';
	panel += '<th style="width: 1%;">CMD</th>';
	panel += '<th>Centre Name</th>';
	panel += '<th style="width: 15%;text-align:right">Total Patient</th>';
	panel += '<th style="width: 15%;text-align:right">Total Test</th>';
	panel += '<th style="width: 16%;text-align:right">Total Amount</th>';
	panel += '<th style="width: 15%;">Pend./Appr.</th>';
	panel += '</tr>';
	panel += '</thead>';
	panel += '<tbody></tbody>';
	panel += '</table>';
	panel += '</div>';
	panel += '</div>';
	panel += '</div></div>';
}