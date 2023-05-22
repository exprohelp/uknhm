$(document).ready(function () {
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);
});

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
}
function SummaryData() {
    $("#tblTestAnalysis tbody").empty();
    var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
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
    objBO.Logic = "SummaryData";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            var regionName = '';
            var districtName = '';
            var centre_name = '';
            var tbody = '';
            var tTotalCentre = 0;
            var tActiveCentres = 0;
            var tCMSApproved = 0;
            //total initial
            var tPatientCount = 0;
            var tTestCount = 0;
            var tReportDone = 0;
            var tReportPend = 0;
            var tNHMApproved = 0;
            var tNHMApprovedPend = 0;
            var tnetAmount = 0;
            var tdelayCount = 0;
            var tPaid = 0;
            var tdelayPerc = 0;

            var gPatientCount = 0;
            var gTestCount = 0;
            var gReportDone = 0;
            var gReportPend = 0;
            var gNHMApproved = 0;
            var gNHMApprovedPend = 0;
            var gnetAmount = 0;
            var gdelayCount = 0;
            var gPaid = 0;
            var gdelayPerc = 0;

            var kPatientCount = 0;
            var kTestCount = 0;
            var kReportDone = 0;
            var kReportPend = 0;
            var kNHMApproved = 0;
            var kNHMApprovedPend = 0;
            var knetAmount = 0;
            var kdelayCount = 0;
            var kPaid = 0;
            var kdelayPerc = 0;

            var dPatientCount = 0;
            var dTestCount = 0;
            var dReportDone = 0;
            var dReportPend = 0;
            var dNHMApproved = 0;
            var dNHMApprovedPend = 0;
            var dnetAmount = 0;
            var ddelayCount = 0;
            var dPaid = 0;
            var ddelayPerc = 0;
            $.each(data.ResultSet.Table, function (key, val) {
                tTotalCentre++;
                if (val.PatientCount > 0) {
                    tActiveCentres++;
                }
                if (val.NHMApprovedPend == 0 && val.PatientCount) {
                    tCMSApproved++;
                }
                tPatientCount += val.PatientCount;
                tTestCount += val.TestCount;
                tReportDone += val.ReportDone;
                tReportPend += val.ReportPend;
                tNHMApproved += val.NHMApproved;
                tNHMApprovedPend += val.NHMApprovedPend;
                tnetAmount += val.netAmount;
                tdelayCount += val.delayCount;
                tPaid += val.Paid;
                tdelayPerc += val.delayPerc;
                if (val.regionName == "Garhwal") {
                    gPatientCount += val.PatientCount;
                    gTestCount += val.TestCount;
                    gReportDone += val.ReportDone;
                    gReportPend += val.ReportPend;
                    gNHMApproved += val.NHMApproved;
                    gNHMApprovedPend += val.NHMApprovedPend;
                    gnetAmount += val.netAmount;
                    gdelayCount += val.delayCount;
                    gPaid += val.Paid;
                    gdelayPerc += val.delayPerc;
                }
                if (val.regionName == "Kumaon") {
                    kPatientCount += val.PatientCount;
                    kTestCount += val.TestCount;
                    kReportDone += val.ReportDone;
                    kReportPend += val.ReportPend;
                    kNHMApproved += val.NHMApproved;
                    kNHMApprovedPend += val.NHMApprovedPend;
                    knetAmount += val.netAmount;
                    kdelayCount += val.delayCount;
                    kPaid += val.Paid;
                    kdelayPerc += val.delayPerc;
                }
            });
            tbody += "<tr style='background: #ffbfbf;'>";
            tbody += "<td></td>";
            tbody += "<td class='text-center'>" + tActiveCentres + '/' + tTotalCentre + "</td>";
            tbody += "<td>" + tCMSApproved + '/' + tActiveCentres + "</td>";
            tbody += "<td>" + tPatientCount + "</td>";
            tbody += "<td>" + tTestCount + "</td>";
            tbody += "<td>" + tReportDone + "</td>";
            tbody += "<td>" + tReportPend + "</td>";
            tbody += "<td>" + tNHMApproved + "</td>";
            tbody += "<td>" + tNHMApprovedPend + "</td>";
            tbody += "<td>" + tnetAmount.toFixed(2) + "</td>";
            tbody += "<td>" + tdelayCount + "</td>";
            tbody += "<td>" + tPaid + "</td>";
            tbody += "<td>" + (tdelayCount * 100 / tTestCount).toFixed(2) + "</td>";
            tbody += "</tr>";
            $.each(data.ResultSet.Table, function (key, val) {
                if (regionName != val.regionName) {
                    if (val.regionName == "Garhwal") {
                        tbody += "<tr class='selectrow'>";
                        tbody += "<td class='district'></td>";
                        tbody += "<td style='color:blue;cursor:pointer;' colspan='2'>" + val.regionName + "</td>";
                        tbody += "<td>" + gPatientCount + "</td>";
                        tbody += "<td>" + gTestCount + "</td>";
                        tbody += "<td>" + gReportDone + "</td>";
                        tbody += "<td>" + gReportPend + "</td>";
                        tbody += "<td>" + gNHMApproved + "</td>";
                        tbody += "<td>" + gNHMApprovedPend + "</td>";
                        tbody += "<td>" + gnetAmount.toFixed(2) + "</td>";
                        tbody += "<td>" + gdelayCount + "</td>";
                        tbody += "<td>" + gPaid + "</td>";
                        tbody += "<td>" + (gdelayCount * 100 / gTestCount).toFixed(2) + "</td>";
                        tbody += "</tr>";
                    }
                    if (val.regionName == "Kumaon") {
                        tbody += "<tr class='selectrow'>";
                        tbody += "<td class='district'></td>";
                        tbody += "<td style='color:blue;cursor:pointer;' colspan='2'>" + val.regionName + "</td>";
                        tbody += "<td>" + kPatientCount + "</td>";
                        tbody += "<td>" + kTestCount + "</td>";
                        tbody += "<td>" + kReportDone + "</td>";
                        tbody += "<td>" + kReportPend + "</td>";
                        tbody += "<td>" + kNHMApproved + "</td>";
                        tbody += "<td>" + kNHMApprovedPend + "</td>";
                        tbody += "<td>" + knetAmount.toFixed(2) + "</td>";
                        tbody += "<td>" + kdelayCount + "</td>";
                        tbody += "<td>" + kPaid + "</td>";
                        tbody += "<td>" + (kdelayCount * 100 / kTestCount).toFixed(2) + "</td>";
                        tbody += "</tr>";
                    }
                    regionName = val.regionName;
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (val.regionName == regionName) {
                            if (districtName != val.districtName) {
                                districtName = val.districtName;
                                $.each(data.ResultSet.Table, function (key, val) {
                                    if (val.districtName == districtName) {
                                        if (centre_name != val.centre_name) {
                                            dPatientCount += val.PatientCount;
                                            dTestCount += val.TestCount;
                                            dReportDone += val.ReportDone;
                                            dReportPend += val.ReportPend;
                                            dNHMApproved += val.NHMApproved;
                                            dNHMApprovedPend += val.NHMApprovedPend;
                                            dnetAmount += val.netAmount;
                                            ddelayCount += val.delayCount;
                                            dPaid += val.Paid;
                                            //centre_name = val.centre_name;
                                        }
                                    }
                                });
                                tbody += "<tr class='district'>";
                                tbody += "<td class='district'></td>";
                                tbody += "<td class='district' style='color:blue;cursor:pointer;' colspan='2'>" + val.districtName + "</td>";
                                tbody += "<td class='district'>" + dPatientCount + "</td>";
                                tbody += "<td class='district'>" + dTestCount + "</td>";
                                tbody += "<td class='district'>" + dReportDone + "</td>";
                                tbody += "<td class='district'>" + dReportPend + "</td>";
                                tbody += "<td class='district'>" + dNHMApproved + "</td>";
                                tbody += "<td class='district'>" + dNHMApprovedPend + "</td>";
                                tbody += "<td class='district'>" + dnetAmount.toFixed(2) + "</td>";
                                tbody += "<td class='district'>" + ddelayCount + "</td>";
                                tbody += "<td class='district'>" + dPaid + "</td>";
                                tbody += "<td class='district'>" + (ddelayCount * 100 / dTestCount).toFixed(2) + "</td>";
                                tbody += "</tr>";
                                dPatientCount = 0;
                                dTestCount = 0;
                                dReportDone = 0;
                                dReportPend = 0;
                                dNHMApproved = 0;
                                dNHMApprovedPend = 0;
                                dnetAmount = 0;
                                ddelayCount = 0;
                                dPaid = 0;
                                ddelayPerc = 0;
                                $.each(data.ResultSet.Table, function (key, val) {
                                    if (val.districtName == districtName) {
                                        //centre_name = '';
                                        if (centre_name != val.centre_name) {
                                            tbody += "<tr class='hospital'>";
                                            tbody += "<td class='hospital'>" + val.CentreType + "</td>";
                                            tbody += "<td class='hospital' colspan='2'>" + val.centre_name + "</td>";
                                            tbody += "<td class='hospital'>" + val.PatientCount + "</td>";
                                            tbody += "<td class='hospital'>" + val.TestCount + "</td>";
                                            tbody += "<td class='hospital'>" + val.ReportDone + "</td>";
                                            tbody += "<td class='hospital'>" + val.ReportPend + "</td>";
                                            tbody += "<td class='hospital'>" + val.NHMApproved + "</td>";
                                            tbody += "<td class='hospital'>" + val.NHMApprovedPend + "</td>";
                                            tbody += "<td class='hospital'>" + val.netAmount.toFixed(2) + "</td>";
                                            tbody += "<td class='hospital'>" + val.delayCount + "</td>";
                                            tbody += "<td class='hospital'>" + val.Paid + "</td>";
                                            tbody += "<td class='hospital'>" + val.delayPerc + "</td>";
                                            tbody += "</tr>";
                                            centre_name = val.centre_name;
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
            $("#tblTestAnalysis tbody").append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function RegionWiseData() {
    $("#tblTestAnalysis tbody").empty();
    var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
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
    objBO.Logic = "RegionWiseData";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            var tbody = '';
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += "<tr>";
                tbody += "<td style='color:blue;cursor:pointer;' data-region=" + val.regionName + " onclick=districtWiseData(this)>" + val.regionName + "</td>";
                tbody += "<td>" + val.PatientCount + "</td>";
                tbody += "<td>" + val.TestCount + "</td>";
                tbody += "<td>" + val.ReportDone + "</td>";
                tbody += "<td>" + val.ReportPend + "</td>";
                tbody += "<td>" + val.NHMApproved + "</td>";
                tbody += "<td>" + val.NHMApprovedPend + "</td>";
                tbody += "<td>" + val.netAmount + "</td>";
                tbody += "<td>" + val.delayCount + "</td>";
                tbody += "<td>" + val.Paid + "</td>";
                tbody += "<td>" + val.delayPerc + "</td>";
                tbody += "</tr>";
            });
            $("#tblTestAnalysis tbody").append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function districtWiseData(elem) {
    Selected(elem)
    $('tr.hospital').remove();
    $('tr.district').remove();
    var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
    var objBO = {};
    objBO.DistrictName = '-';
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = $(elem).data('region');
    objBO.Prm2 = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "districtWiseData";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            var tbody = '';
            var temp = '';
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += "<tr class='district'>";
                tbody += "<td class='district' style='color:blue;cursor:pointer;' data-district=" + val.districtName + " onclick=HospitalWiseData(this)>" + val.districtName + "</td>";
                tbody += "<td class='district'>" + val.PatientCount + "</td>";
                tbody += "<td class='district'>" + val.TestCount + "</td>";
                tbody += "<td class='district'>" + val.ReportDone + "</td>";
                tbody += "<td class='district'>" + val.ReportPend + "</td>";
                tbody += "<td class='district'>" + val.NHMApproved + "</td>";
                tbody += "<td class='district'>" + val.NHMApprovedPend + "</td>";
                tbody += "<td class='district'>" + val.netAmount + "</td>";
                tbody += "<td class='district'>" + val.delayCount + "</td>";
                tbody += "<td class='district'>" + val.Paid + "</td>";
                tbody += "<td class='district'>" + val.delayPerc + "</td>";
                tbody += "</tr>";
            });
            $(elem).closest('tr').after(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function HospitalWiseData(elem) {
    Selected(elem);
    $('tr.hospital').remove();
    var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
    var objBO = {};
    objBO.DistrictName = '-';
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = $(elem).data('district');
    objBO.Prm2 = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "HospitalWiseData";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {

            var tbody = '';
            var temp = '';
            if (Object.keys(data.ResultSet).length > 0) {
                //tbody += "<tr class='hospital'>";
                //tbody += "<th class='hospital'>Centre Name</th>";
                //tbody += "<th class='hospital'>Patient Count</th>";
                //tbody += "<th class='hospital'>Test Count</th>";
                //tbody += "<th class='hospital'>Report Done</th>";
                //tbody += "<th class='hospital'>Report Pend</th>";
                //tbody += "<th class='hospital'>Approved</th>";
                //tbody += "<th class='hospital'>Approved Pend</th>";
                //tbody += "<th class='hospital'>Net Amount</th>";
                //tbody += "<th class='hospital'>Delay Count</th>";
                //tbody += "<th class='hospital'>Delay Perc</th>";
                //tbody += "</tr>";
                $.each(data.ResultSet.Table, function (key, val) {
                    //if (temp != objBO.Prm1) {
                    //	tbody += "<tr class='hospital'>";
                    //	tbody += "<td colspan='10' class='hospital bg-hospital'>" + objBO.Prm1 + "</td>";
                    //	tbody += "</tr>";
                    //	temp = objBO.Prm1;
                    //}
                    tbody += "<tr class='hospital'>";
                    tbody += "<td class='hospital'>" + val.centre_name + "</td>";
                    tbody += "<td class='hospital'>" + val.PatientCount + "</td>";
                    tbody += "<td class='hospital'>" + val.TestCount + "</td>";
                    tbody += "<td class='hospital'>" + val.ReportDone + "</td>";
                    tbody += "<td class='hospital'>" + val.ReportPend + "</td>";
                    tbody += "<td class='hospital'>" + val.NHMApproved + "</td>";
                    tbody += "<td class='hospital'>" + val.NHMApprovedPend + "</td>";
                    tbody += "<td class='hospital'>" + val.netAmount + "</td>";
                    tbody += "<td class='hospital'>" + val.delayCount + "</td>";
                    tbody += "<td class='hospital'>" + val.Paid + "</td>";
                    tbody += "<td class='hospital'>" + val.delayPerc + "</td>";
                    tbody += "</tr>";
                });
                $(elem).closest('tr').after(tbody);
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Selected(elem) {
    $(elem).parents('tbody').find('tr').removeClass('selectrow');
    $(elem).closest('tr').addClass('selectrow');
}
function DownloadXL() {
    var url = config.baseUrl + "/api/Report/ChandanMIS_ReportQueries2";
    var objBO = {};
    objBO.DistrictName = '-';
    objBO.CentreType = '-';
    objBO.CentreId = '-';
    objBO.VisitNo = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.ReportType = "XL";
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = "SummaryData";
    Global_DownloadExcel(url, objBO, "NHMOverallSummary.xlsx");   
}