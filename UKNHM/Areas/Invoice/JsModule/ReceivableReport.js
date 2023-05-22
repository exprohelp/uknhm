$(document).ready(function () {
    ReceivableReport();
});
function ReceivableReport() {
    $("#tblReceivableReport tbody").empty();
    var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
    var objBO = {};
    objBO.CentreId = $('#ddlCentreName option:selected').val();
    objBO.InvoiceNo = '-';
    objBO.Prm1 = $('#ddlReportBy option:selected').val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId; 
    objBO.Logic = 'ReceivableReportDistrictWise';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {          
            var centreName = '';
            if (data.ResultSet.Table.length > 0) {
                var tbody = '';
                var district = '';
                var dwdistrict = data.ResultSet.Table[0].districtName;

                var count = 0;
                var totalLength = data.ResultSet.Table.length;

                var InvoiceAmount = 0;
                var EQAS_Deduction = 0;
                var InvoicePayable = 0;
                var PaidAmount = 0;
                var InvoiceBalance = 0;
                var PendingInvoice = 0;
                var OverAllBusiness = 0;
                var OverAllBalance = 0;

                var dwInvoiceAmount = 0;
                var dwEQAS_Deduction = 0;
                var dwInvoicePayable = 0;
                var dwPaidAmount = 0;
                var dwInvoiceBalance = 0;
                var dwPendingInvoice = 0;
                var dwOverAllBusiness = 0;
                var dwOverAllBalance = 0;
                $.each(data.ResultSet.Table, function (key, val) {
                    count++;
                    if (dwdistrict != val.districtName) {
                        tbody += "<tr style='background:#ddd'>";
                        tbody += "<th class='text-right'>Total</th>";
                        tbody += "<th class='text-right'>" + dwInvoiceAmount.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwEQAS_Deduction.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwInvoicePayable.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwPaidAmount.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwInvoiceBalance.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwPendingInvoice.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwOverAllBusiness.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwOverAllBalance.toFixed(0) + "</th>";
                        tbody += "</tr>";
                        dwInvoiceAmount = 0;
                        dwEQAS_Deduction = 0;
                        dwInvoicePayable = 0;
                        dwPaidAmount = 0;
                        dwInvoiceBalance = 0;
                        dwPendingInvoice = 0;
                        dwOverAllBusiness = 0;
                        dwOverAllBalance = 0;
                        dwdistrict = val.districtName
                    }
                    dwInvoiceAmount += val.InvoiceAmount;
                    dwEQAS_Deduction += val.EQAS_Deduction;
                    dwInvoicePayable += val.InvoicePayable;
                    dwPaidAmount += val.PaidAmount;
                    dwInvoiceBalance += val.InvoiceBalance;
                    dwPendingInvoice += val.PendingInvoice;
                    dwOverAllBusiness += val.OverAllBusiness;
                    dwOverAllBalance += val.OverAllBalance;
                    if (district != val.districtName) {
                        tbody += "<tr style='background:#c6e5ff'>";
                        tbody += "<td style='display:none'>" + val.districtName + "</td>";
                        tbody += "<td colspan='9'><a href='#' class='gbtn' onclick=CenterWiseRecord(this)>" + val.districtName + "</a></td>";
                        tbody += "</tr>";
                        district = val.districtName
                    }
                    InvoiceAmount += val.InvoiceAmount;
                    EQAS_Deduction += val.EQAS_Deduction;
                    InvoicePayable += val.InvoicePayable;
                    PaidAmount += val.PaidAmount;
                    InvoiceBalance += val.InvoiceBalance;
                    PendingInvoice += val.PendingInvoice;
                    OverAllBusiness += val.OverAllBusiness;
                    OverAllBalance += val.OverAllBalance;

                    tbody += "<tr>";
                    tbody += "<td>" + val.InvoiceType + "</td>";
                    tbody += "<td class='text-right'>" + val.InvoiceAmount.toFixed(0) + "</td>";
                    tbody += "<td class='text-right'>" + val.EQAS_Deduction.toFixed(0) + "</td>";
                    tbody += "<td class='text-right'>" + val.InvoicePayable.toFixed(0)+ "</td>";
                    tbody += "<td class='text-right'>" + val.PaidAmount.toFixed(0)+ "</td>";
                    tbody += "<td class='text-right'>" + val.InvoiceBalance.toFixed(0)+ "</td>";
                    tbody += "<td class='text-right'>" + val.PendingInvoice.toFixed(0)+ "</td>";
                    tbody += "<td class='text-right'>" + val.OverAllBusiness.toFixed(0)+ "</td>";
                    tbody += "<td class='text-right'>" + val.OverAllBalance.toFixed(0)+ "</td>";
                    tbody += "</tr>";
                    if (count == totalLength) {
                        tbody += "<tr style='background:#ddd'>";
                        tbody += "<th class='text-right'>Total</th>";
                        tbody += "<th class='text-right'>" + dwInvoiceAmount.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwEQAS_Deduction.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwInvoicePayable.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwPaidAmount.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwInvoiceBalance.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwPendingInvoice.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + OverAllBusiness.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwOverAllBalance.toFixed(0) + "</th>";
                        tbody += "</tr>";
                        dwInvoiceAmount = 0;
                        dwEQAS_Deduction = 0;
                        dwInvoicePayable = 0;
                        dwPaidAmount = 0;
                        dwInvoiceBalance = 0;
                        dwPendingInvoice = 0;
                        dwOverAllBusiness = 0;
                        dwOverAllBalance = 0;                      
                    }
                });
                tbody += "<tr style='background:#ffbdbd'>";
                tbody += "<th class='text-right'>Grand Total</th>";
                tbody += "<th class='text-right'>" + InvoiceAmount.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + EQAS_Deduction.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + InvoicePayable.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + PaidAmount.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + InvoiceBalance.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + PendingInvoice.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + OverAllBusiness.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + OverAllBalance.toFixed(0) + "</th>";
                tbody += "</tr>";
                $("#tblReceivableReport tbody").append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CenterWiseRecord(elem) {
    $('#txtDistrict').text($(elem).closest('tr').find('td:eq(0)').text());
    $("#tblCenterWiseRecord tbody").empty();
    var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
    var objBO = {};
    objBO.CentreId = '-';
    objBO.InvoiceNo = $('#ddlReportBy option:selected').val();
    objBO.Prm1 = $(elem).closest('tr').find('td:eq(0)').text();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.login_id = Active.userId;
    objBO.Logic = 'ReceivableReportByDistrict';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var centreName = '';
            if (data.ResultSet.Table.length > 0) {
                var tbody = '';
                var district = '';
                var centre_name = '';            
                var dwcentre_name = data.ResultSet.Table[0].centre_name;

                var count = 0;
                var totalLength = data.ResultSet.Table.length;

                var InvoiceAmount = 0;
                var EQAS_Deduction = 0;
                var InvoicePayable = 0;
                var PaidAmount = 0;
                var InvoiceBalance = 0;
                var PendingInvoice = 0;
                var OverAllBusiness = 0;
                var OverAllBalance = 0;

                var dwInvoiceAmount = 0;
                var dwEQAS_Deduction = 0;
                var dwInvoicePayable = 0;
                var dwPaidAmount = 0;
                var dwInvoiceBalance = 0;
                var dwPendingInvoice = 0;
                var dwOverAllBusiness = 0;
                var dwOverAllBalance = 0;
                $.each(data.ResultSet.Table, function (key, val) {
                    count++;
                    if (dwcentre_name != val.centre_name) {
                        tbody += "<tr style='background:#ddd'>";
                        tbody += "<th class='text-right'>Total</th>";
                        tbody += "<th class='text-right'>" + dwInvoiceAmount.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwEQAS_Deduction.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwInvoicePayable.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwPaidAmount.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwInvoiceBalance.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwPendingInvoice.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwOverAllBusiness.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwOverAllBalance.toFixed(0) + "</th>";
                        tbody += "</tr>";
                        dwInvoiceAmount = 0;
                        dwEQAS_Deduction = 0;
                        dwInvoicePayable = 0;
                        dwPaidAmount = 0;
                        dwInvoiceBalance = 0;
                        dwPendingInvoice = 0;
                        dwOverAllBusiness= 0;
                        dwOverAllBalance = 0;
                        dwcentre_name = val.centre_name
                    }
                    dwInvoiceAmount += val.InvoiceAmount;
                    dwEQAS_Deduction += val.EQAS_Deduction;
                    dwInvoicePayable += val.InvoicePayable;
                    dwPaidAmount += val.PaidAmount;
                    dwInvoiceBalance += val.InvoiceBalance;
                    dwPendingInvoice += val.PendingInvoice;
                    dwOverAllBusiness += val.OverAllBusiness;
                    dwOverAllBalance += val.OverAllBalance;
                    if (centre_name != val.centre_name) {
                        tbody += "<tr style='background:#c6e5ff'>";                
                        tbody += "<td colspan='9'>" + val.centre_name + "</td>";
                        tbody += "</tr>";
                        centre_name = val.centre_name
                    }
                    InvoiceAmount += val.InvoiceAmount;
                    EQAS_Deduction += val.EQAS_Deduction;
                    InvoicePayable += val.InvoicePayable;
                    PaidAmount += val.PaidAmount;
                    InvoiceBalance += val.InvoiceBalance;
                    PendingInvoice += val.PendingInvoice;
                    OverAllBusiness += val.OverAllBusiness;
                    OverAllBalance += val.OverAllBalance;

                    tbody += "<tr>";
                    tbody += "<td>" + val.InvoiceType + "</td>";
                    tbody += "<td class='text-right'>" + val.InvoiceAmount.toFixed(0) + "</td>";
                    tbody += "<td class='text-right'>" + val.EQAS_Deduction.toFixed(0)+ "</td>";
                    tbody += "<td class='text-right'>" + val.InvoicePayable.toFixed(0) + "</td>";
                    tbody += "<td class='text-right'>" + val.PaidAmount.toFixed(0) + "</td>";
                    tbody += "<td class='text-right'>" + val.InvoiceBalance.toFixed(0) + "</td>";
                    tbody += "<td class='text-right'>" + val.PendingInvoice.toFixed(0) + "</td>";
                    tbody += "<td class='text-right'>" + val.OverAllBusiness.toFixed(0) + "</td>";
                    tbody += "<td class='text-right'>" + val.OverAllBalance.toFixed(0) + "</td>";
                    tbody += "</tr>";
                    if (count == totalLength) {
                        tbody += "<tr style='background:#ddd'>";
                        tbody += "<th class='text-right'>Total</th>";
                        tbody += "<th class='text-right'>" + dwInvoiceAmount.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwEQAS_Deduction.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwInvoicePayable.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwPaidAmount.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwInvoiceBalance.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwPendingInvoice.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwOverAllBusiness.toFixed(0) + "</th>";
                        tbody += "<th class='text-right'>" + dwOverAllBalance.toFixed(0) + "</th>";
                        tbody += "</tr>";
                        dwInvoiceAmount = 0;
                        dwEQAS_Deduction = 0;
                        dwInvoicePayable = 0;
                        dwPaidAmount = 0;
                        dwInvoiceBalance = 0;
                        dwPendingInvoice = 0;
                        dwOverAllBusiness = 0;
                        dwOverAllBalance = 0;
                    }
                });
                tbody += "<tr style='background:#ffbdbd'>";
                tbody += "<th class='text-right'>Grand Total</th>";
                tbody += "<th class='text-right'>" + InvoiceAmount.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + EQAS_Deduction.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + InvoicePayable.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + PaidAmount.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + InvoiceBalance.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + PendingInvoice.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + OverAllBusiness.toFixed(0) + "</th>";
                tbody += "<th class='text-right'>" + OverAllBalance.toFixed(0) + "</th>";
                tbody += "</tr>";
                $("#tblCenterWiseRecord tbody").append(tbody);
                $("#modalCenterWiseRecord").modal('show');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}