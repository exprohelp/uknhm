using DotNetIntegrationKit;
using System;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web.Mvc;
using UKNHM.App_Start;
using UKNHM.Repository;
using UKNHMApi.Models;

namespace UKNHM.Areas.Invoice.Controllers
{
    public class InvoiceController : Controller
    {
        public ActionResult InvoiceSummary()
        {
            return View();
        }
        public ActionResult ReceivableReport()
        {
            return View();
        }
        public ActionResult InvoiceSummaryForCMS()
        {
            return View();
        }
        public ActionResult BillPayment()
        {
            return View();
        }
        public ActionResult BillDetails()
        {
            return View();
        }
        public ActionResult GenInvoice()
        {
            return View();
        }
        public ActionResult InvoicePaymentInfo()
        {
            return View();
        }
        public ActionResult InvoiceCMOVerification()
        {
            return View();
        }
        public ActionResult EQASDeduction()
        {
            return View();
        }
        public ActionResult InvoicePaymentResponse()
        {
            UKNHMApi.Repository.Invoice.Invoice repositoryInvoice = new UKNHMApi.Repository.Invoice.Invoice();
            string dbResponse = string.Empty;
            try
            {
                string strPGResponse = Request["msg"].ToString();  //Reading response of PG
                if (strPGResponse != "" || strPGResponse != null)
                {
                    RequestURL objRequestURL = new RequestURL();    //Creating Object of Class DotNetIntegration_1_1.RequestURL
                    string strDecryptedVal = null;                  //Decrypting the PG response
                    if (!String.IsNullOrEmpty(Convert.ToString(Session["PropertyFile"])))
                    {
                        string strFilePath = ConfigurationManager.AppSettings["FilePath"].ToString();
                        string[] FilePath = strFilePath.Split('\\');
                        string MerchantCode = Convert.ToString(Session["Merchant_Code"]);
                        //strFilePath = FilePath[0] + "\\" + FilePath[2] + "\\" + MerchantCode + "\\" + FilePath[4];
                        strDecryptedVal = objRequestURL.VerifyPGResponse(strPGResponse, strFilePath);
                        Response.Write(strDecryptedVal);
                    }
                    else
                    {
                        string strIsKey = ConfigurationManager.AppSettings["Key"].ToString();
                        string strIsIv = ConfigurationManager.AppSettings["IV"].ToString();
                        strDecryptedVal = objRequestURL.VerifyPGResponse(strPGResponse, strIsKey, strIsIv);
                        string[] info = strDecryptedVal.ToString().Split('|');
                        ViewBag.Status = info[1].Split('=')[1];
                        ViewBag.ReferenceNo = info[3].Split('=')[1];
                        ViewBag.TransactionId = info[5].Split('=')[1];
                        ViewBag.DateTime = info[8].Split('=')[1];
                        ViewBag.Amount = info[6].Split('=')[1];
                        //ReceivedPayInfo obj = new ReceivedPayInfo();
                        //obj.ReceiptNo = info[3].Split('=')[1]; 
                        //obj.Logic = "UpdatePaymentStatus";
                        // dbResponse = repositoryInvoice.Invoice_ReceivedPayInfo(obj);												
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return View();
        }
        public void MakePayment(string ReceiptNo, string Name, string Amount)
        {
            String response = "";
            try
            {
                var ResponseUrl = Request.UrlReferrer.Scheme + "://" + Request.UrlReferrer.Authority + "/Invoice/Invoice/InvoicePaymentResponse";
                var Merchant_Code = ConfigurationManager.AppSettings["Merchant_Code"].ToString();
                var Key = ConfigurationManager.AppSettings["Key"].ToString();
                var IV = ConfigurationManager.AppSettings["IV"].ToString();
                RequestURL objRequestURL = new RequestURL();
                string TXT_requesttype = "T";
                if (TXT_requesttype == "T")
                {
                    response = objRequestURL.SendRequest
                                 (
                                  "T"
                                 , Merchant_Code//Merchant Code
                                 , ReceiptNo//Reference No
                                 , Name
                                 , Amount + ".00"// amount
                                 , "INR" //Currency
                                 , "Chandan123" //CustomerUniqId
                                 , ResponseUrl
                                 , ""
                                 , ReceiptNo
                                 , "FIRST_" + Amount + ".00_0.0" // sale item detail
                                 , "07-08-2018"
                                 , "-" //email
                                 , "9838003146"//mobile
                                 , ""
                                 , ""
                                 , ""
                                 , ""
                                 , Key// Key
                                 , IV//IV
                                 );
                }
                String strResponse = response.ToUpper();
                bool IsValid = false;
                if (strResponse.StartsWith("ERROR"))
                {
                    if (strResponse == "ERROR073")
                    {
                        response = objRequestURL.SendRequest(
                                      "T"
                                 , Merchant_Code//Merchant Code
                                , "1254687/12-25"//Reference No
                                 , Name
                                 , Amount + ".00"// amount
                                 , "INR" //Currency
                                 , "Chandan123" //CustomerUniqId
                                 , ResponseUrl
                                 , ""
                                 , ReceiptNo
                                 , "FIRST_" + Amount + ".00_0.0" // sale item detail
                                 , "07-08-2018"
                                 , "-" //email
                                 , "9838003146"//mobile
                                 , ""
                                 , ""
                                 , ""
                                 , ""
                                 , Key// Key
                                 , IV//IV
                               );
                        strResponse = response.ToUpper();
                    }
                    else
                    {

                    }
                }
                else
                {
                    IsValid = true;
                }
                if (TXT_requesttype == "T")
                {
                    if (IsValid)
                    {
                        Response.Write("<form name='s1_2' id='s1_2' action='" + response + "' method='post'> ");
                        Response.Write("<script type='text/javascript' language='javascript' >document.getElementById('s1_2').submit();");
                        Response.Write("</script>");
                        Response.Write("<script language='javascript' >");
                        Response.Write("</script>");
                        Response.Write("</form> ");
                    }
                }
                else
                {

                }
            }
            catch (Exception)
            {
                throw;
            }
        }      
        public FileResult PrintInvoice(string InvoiceNo)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            if (!TempData.ContainsKey("IsActive"))
            {
                return pdfConverter.ConvertToPdf("-", "<h3 style='text-align:center;color:red'>Your Session is Out. Kindly Login Again.</h3>", "-", "EQAS-Report.pdf");
            }
            ipInvoice obj = new ipInvoice();
            obj.InvoiceNo = InvoiceNo;
            obj.Logic = "PrintInvoice";
            dataSet dsResult = APIProxy.CallWebApiMethod("Invoice/Invoice_Queries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            StringBuilder f = new StringBuilder();
            int Count = 0;
            double TotalAmount = 0;
            double Discount = 0;
            //double AdjAmount = 0;
            double NetAmount = 0;
            double AmountToBePaid = 0;
            string invoiceNo = string.Empty;
            string InvoiceType = string.Empty;
            double InvoiceAmount = 0;
            double AmountTobePaid = 0;
            double EQAS_Deduction = 0;

            b.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px'>");
            string chandanLogo = HttpContext.Server.MapPath(@"~/Content/img/logo.png");
            string nhmLogo = HttpContext.Server.MapPath(@"~/Content/img/logo_nhm.png");
            //string QRCode = HttpContext.Server.MapPath(@"/Content/img/QRCode.png");
            b.Append("<div style='text-align:left;width:32%;float:left'>");
            b.Append("<img src=" + chandanLogo + " style='width:170px;margin-top:5px;' />");
            b.Append("</div>");
            b.Append("<div style='text-align:left;width:auto;float:left;width:43%;'>");
            b.Append("<span style='margin-left:20px;font-size:25px'><b>निःशुल्क जाँच योजना</b></span>");
            b.Append("<h2 style='font-weight:bold;margin:0'>Chandan Healthcare Ltd</h2>");
            b.Append("<span style='text-align:left;'>Biotech Park, Kursi Road, Lucknow</span><br/>");
            b.Append("<span style='text-align:left;'><b>CIN No: U85196UP1995PLC018739</b><br/><b>GSTIN : 09AACCC1996N1Z2</b></span><br/>");         
            b.Append("</div>");
            b.Append("<div style='text-align:left;width:25%;float:left'>");
            b.Append("<img src=" + nhmLogo + " style='width:175px;' />");
            b.Append("</div>");
            b.Append("</div>");
            b.Append("<hr/>");
            if (ds.Tables.Count > 0 && ds.Tables[2].Rows.Count > 0)
            {
                invoiceNo = ds.Tables[2].Rows[0]["InvoiceNo"].ToString();
                InvoiceType = ds.Tables[2].Rows[0]["InvoiceType"].ToString();
                InvoiceAmount = Convert.ToDouble(ds.Tables[2].Rows[0]["InvoiceAmount"].ToString());
                AmountTobePaid = Convert.ToDouble(ds.Tables[2].Rows[0]["AmountTobePaid"].ToString());
                EQAS_Deduction = Convert.ToDouble(ds.Tables[2].Rows[0]["EQAS_Deduction"].ToString());
            }
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    TotalAmount = Convert.ToDouble(dr["totalAmount"].ToString());
                    Discount = Convert.ToDouble(dr["totalDiscount"].ToString());
                    //AdjAmount = Convert.ToDouble(dr["adj_amount"].ToString());
                    NetAmount = Convert.ToDouble(dr["amount"].ToString());

                    b.Append("<table style='width:100%;font-size:14px;text-align:left;background:#ececec;'>");
                    b.Append("<tr>");
                    b.Append("<td><b>Invoice Type</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td><b>" + InvoiceType + "</b></td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>Vendor Name</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["VendorName"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Invoice No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + invoiceNo + "</td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>Pan No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["PanNo"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("<td><b>Invoice Month</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["InvoiceMonth"].ToString() + "</td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>Bill To</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["BillTo"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("</tr>");
                    b.Append("</table>");
                }
            }
            b.Append("<table border='1' style='width:100%;font-size:12px;border-collapse: collapse;margin-top:10px;'>");
            b.Append("<tr>");
            b.Append("<th style='width:1%;text-align:left;padding-left:4px;'>S.No.</th>");
            b.Append("<th style='text-align:left;padding-left:4px;'>Test Category</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>No. of Test</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Total Amount</th>");
            b.Append("</tr>");
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    Count++;
                    b.Append("<tr>");
                    b.Append("<td style='padding-left:4px;'>" + Count + "</td>");
                    b.Append("<td style='white-space: nowrap;padding-left:4px;'>" + dr["testCategory"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["testCount"]) + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToInt32(dr["netAmount"]) + "</td>");
                    b.Append("</tr>");
                }
            }
            b.Append("</table>");
            b.Append("<div style='width:100%;float:left;margin-top:5px'>");
            b.Append("<hr/>");
            b.Append("<div style='width:40%;float:left'>");
            b.Append("<b>Remark : </b>");
            b.Append("</div>");
            b.Append("<div style='width:60%;float:right'>");
            b.Append("<table style='font-size:12px;float:right' border='0' cellspacing='0'>");
            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Total Amount</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + TotalAmount.ToString("0.00") + "</b></td>");
            b.Append("</tr>");
            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Discount (45%) </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + Discount.ToString("0.00") + "</b></td>");
            b.Append("</tr>");
            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Net Amount </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + NetAmount.ToString("0.00") + "</b></td>");
            b.Append("</tr>");
            if (InvoiceType.Contains("UPFRONT"))
            {
                b.Append("<tr style='font-size:13px'>");
                b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Upfront Amount (80%)</b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
                b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + InvoiceAmount + "</b></td>");
                b.Append("</tr>");

                b.Append("<tr style='font-size:13px'>");
                b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Amount To Be Paid </b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
                b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + AmountTobePaid + "</b></td>");
                b.Append("</tr>");
            }
            else
            {
                b.Append("<tr style='font-size:13px'>");
                b.Append("<td colspan='2' style='width:55%;text-align:left'><b>EQAS Amount (20%)</b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
                b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + InvoiceAmount + "</b></td>");
                b.Append("</tr>");


                //if (EQAS_Deduction > 0)
                //{
                b.Append("<tr style='font-size:13px'>");
                b.Append("<td colspan='2' style='width:55%;text-align:left'><b>EQAS Deduction Amount </b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
                b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + EQAS_Deduction.ToString("0.00") + "</b></td>");
                b.Append("</tr>");

                b.Append("<tr style='font-size:13px'>");
                b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Amount To Be Paid </b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
                b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
                b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + AmountTobePaid + "</b></td>");
                b.Append("</tr>");
                //}				

            }
            //b.Append("<tr style='font-size:13px'>");
            //b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Prev. Month EQA Amount (20%)</b></td>");
            //b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            //b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            //b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + equas_prvMonth.ToString("0.00") + "</b></td>");
            //b.Append("</tr>");

            b.Append("</table>");
            b.Append("</div>");
            b.Append("</div>");
            b.Append("<div style='text-align:right;width:100%;float:right;'>");
            b.Append("<span style='text-align:right;width:70%;float:right;font-size:13px'><b>Amount in Words : </b>" + AmountConverter.ConvertToWords(Convert.ToString(AmountTobePaid).ToString()) + "</span>");
            b.Append("</div>");

            f.Append("<div style='width:100%;float:left;margin-top:5px;zoom:1.5'>");
            f.Append("<div style='width:50%;float:left'>");
            string QRCode = GenerateQRCode.GenerateMyQCCode("https://exprohelp.com/UKNHM//Invoice/Invoice/PrintInvoice?InvoiceNo=" + InvoiceNo);
            f.Append("<img src=" + QRCode + " style='width:100px;margin-top:5px;' />");
            f.Append("</div>");
            f.Append("<div style='width:50%;float:right;margin-top:85px;text-align:center'>");
            f.Append("<hr/>Authorized Signature");
            f.Append("</div>");
            f.Append("</div>");
            f.Append("<div style='width:100%;float:left'><br/>");
            f.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
            f.Append("<p style='font-size:13px;text-align:center'>Note : this is system generated invoice, it is strictly recommended to check every entries (including recoveries)</p>");
            f.Append("<p><hr style='margin-top:-14px;margin-bottom:-14px;border:1px solid #000'></p>");
            f.Append("</div>");

            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = true;
            pdfConverter.Footer_Hight = 135;
            pdfConverter.Header_Hight = 70;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), f.ToString(), "Print-Invoice.pdf");
        }
        public FileResult PrintInvoicePaymentInfo(string ReceiptNo)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            //if (!TempData.ContainsKey("IsActive"))
            //{
            //    return pdfConverter.ConvertToPdf("-", "<h3 style='text-align:center;color:red'>Your Session is Out. Kindly Login Again.</h3>", "-", "EQAS-Report.pdf");
            //}
            ipInvoice obj = new ipInvoice();
            obj.ReceiptNo = ReceiptNo;
            obj.Logic = "PrintInvoicePaymentInfo";
            dataSet dsResult = APIProxy.CallWebApiMethod("Invoice/Invoice_Queries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder b = new StringBuilder();
            StringBuilder h = new StringBuilder();
            StringBuilder f = new StringBuilder();
            int Count = 0;
            double InvoiceAmount = 0;          
            double EQASDeduction = 0;          
            double NetPayable = 0;          
            string centre_name = string.Empty;
            string invoiceNo = string.Empty;
            string InvoiceType = string.Empty;

            b.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px'>");           
            b.Append("<h2 style='font-weight:bold;margin:0;text-align:left'>Payment Details</h2>");
            b.Append("</div>");         
            b.Append("<hr/>");
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                { 
                    b.Append("<table style='width:100%;font-size:14px;text-align:left;background:#ececec;'>");
                    b.Append("<tr>");
                    b.Append("<td><b>Receipt No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td><b>" + dr["ReceiptNo"].ToString() + "</b></td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>Pay Mode</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["PayMode"].ToString() + "</td>");
                    b.Append("</tr>");

                    b.Append("<tr>");
                    b.Append("<td><b>Ref No</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["RefNo"].ToString() + "</td>");
                    b.Append("<td colspan='4'>&nbsp;</td>");
                    b.Append("<td><b>Remark</b></td>");
                    b.Append("<td><b>:</b></td>");
                    b.Append("<td>" + dr["Remark"].ToString() + "</td>");
                    b.Append("</tr>");
                    b.Append("<tr>");
                    b.Append("</table>");
                }
            }
            b.Append("<table border='1' style='width:100%;font-size:12px;border-collapse: collapse;margin-top:10px;'>");
            b.Append("<tr>");
            b.Append("<th style='width:1%;text-align:left;padding-left:4px;'>S.No.</th>");         
            b.Append("<th style='text-align:left;padding-left:4px;'>Invoice Month</th>");
            b.Append("<th style='text-align:left;padding-left:4px;'>Invoice No</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Invoice Amount</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>EQAS Deduction</th>");
            b.Append("<th style='text-align:right;padding-right:4px;'>Net Payable</th>");
            b.Append("</tr>");
            if (ds.Tables.Count > 0 && ds.Tables[1].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    InvoiceAmount += Convert.ToDouble(dr["InvoiceAmount"]);
                    EQASDeduction += Convert.ToDouble(dr["EQAS_Deduction"]);
                    NetPayable += Convert.ToDouble(dr["NetPayable"]);
                    if (centre_name != dr["centre_name"].ToString())
                    {
                        b.Append("<tr style='background:#ddd'>");
                        b.Append("<td colspan='6' style='white-space: nowrap;padding-left:4px;'><b>Center Name : </b>" + dr["centre_name"].ToString() + "</td>");
                        b.Append("</tr>");
                        centre_name = dr["centre_name"].ToString();
                    }
                    Count++;
                    b.Append("<tr>");
                    b.Append("<td style='padding-left:4px;'>" + Count + "</td>");               
                    b.Append("<td style='white-space: nowrap;padding-left:4px;'>" + dr["InvoiceMonth"].ToString() + "</td>");
                    b.Append("<td style='white-space: nowrap;padding-left:4px;'>" + dr["InvoiceNo"].ToString() + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToDecimal(dr["InvoiceAmount"]).ToString("0.00") + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToDecimal(dr["EQAS_Deduction"]).ToString("0.00") + "</td>");
                    b.Append("<td style='text-align:right;padding-right:4px;'>" + Convert.ToDecimal(dr["NetPayable"]).ToString("0.00") + "</td>");
                    b.Append("</tr>");
                }
            }
            b.Append("</table>");
            b.Append("<div style='width:100%;float:left;margin-top:5px'>");
            b.Append("<hr/>");
            b.Append("<div style='width:40%;float:left'>");          
            b.Append("</div>");
            b.Append("<div style='width:60%;float:right'>");
            b.Append("<table style='font-size:12px;float:right' border='0' cellspacing='0'>");
            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Invoice Amount</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + InvoiceAmount.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>EQAS Deduction Amount </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + EQASDeduction.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("<tr style='font-size:13px'>");
            b.Append("<td colspan='2' style='width:55%;text-align:left'><b>Paid Amount</b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> : </b></td>");
            b.Append("<td style='width:10%;text-align:center'><b> Rs. </b></td>");
            b.Append("<td style='width:25%;text-align:right;white-space: nowrap;'><b>" + NetPayable.ToString("0.00") + "</b></td>");
            b.Append("</tr>");

            b.Append("</table>");
            b.Append("</div>");
            b.Append("</div>");
            b.Append("</div>");

            pdfConverter.Header_Enabled = false;
            pdfConverter.Footer_Enabled = false;
            pdfConverter.Footer_Hight = 135;
            pdfConverter.Header_Hight = 70;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), f.ToString(), "Print-Invoice.pdf");
        }
    }
}