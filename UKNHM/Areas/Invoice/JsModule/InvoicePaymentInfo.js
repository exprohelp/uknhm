$(document).ready(function () {
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
});
function PaymentInfo(logic) {
    $("#tblPaymentInfo tbody").empty();
    var url = config.baseUrl + "/api/Invoice/Invoice_Queries";
    var objBO = {};
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Logic = logic;
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
                var district = '';
                var count = 0;
                var totalAmount = 0;
                var totalTDSAmount = 0;
                $.each(data.ResultSet.Table, function (key, val) {
                    count++;
                    totalAmount += val.Amount;
                    totalTDSAmount += val.TDSAmount;
                    tbody += "<tr>";
                    tbody += "<td>" + count + "</td>";
                    tbody += "<td><a href='PrintInvoicePaymentInfo?ReceiptNo=" + val.ReceiptNo + "' target='_blank'>" + val.ReceiptNo + "</a></td>";
                    tbody += "<td>" + val.PayMode + "</td>";
                    tbody += "<td>" + val.RefNo + "</td>";
                    tbody += "<td>" + val.Remark + "</td>";
                    tbody += "<td class='text-right'>" + val.Amount + "</td>";
                    tbody += "<td class='text-right'>" + val.TDSAmount + "</td>";
                    tbody += "</tr>";
                });
                tbody += "<tr>";
                tbody += "<td colspan='2' class='text-right'><b>Total</b></td>";
                tbody += "<td colspan='4' class='text-right'><b>" + totalAmount.toFixed(2) + "</b></td>";
                tbody += "<td class='text-right'><b>" + totalTDSAmount.toFixed(2) + "</b></td>";
                tbody += "</tr>";
                $("#tblPaymentInfo tbody").append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PrintInvoice() {
    var District = $("#ddlDistrict option:selected").text();
    var Prm1 = $("#ddlObservationId option:selected").val();
    var Prm2 = $("#ddlRegion option:selected").text();
    var from = $('#txtFrom').val();
    var to = $('#txtTo').val();
    var link = 'PrintInvoicePaymentInfo?ReceiptNo=' + from;
    window.open(link, '_blank');
}