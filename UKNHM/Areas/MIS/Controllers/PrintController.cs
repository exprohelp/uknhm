using System.Data;
using System.Text;
using System.Web.Mvc;
using UKNHM.App_Start;
using UKNHM.Repository;
using UKNHMApi.Models;

namespace UKNHM.Areas.MIS.Controllers
{
    public class PrintController : Controller
    {
        public string TestPrint(string Name, string Mobile)
        {

            return "";
        }
        public FileResult PrintEQASReport(string from, string to, string loginId, string Prm1, string Prm2, string District)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            if (!TempData.ContainsKey("IsActive"))
            {
                return pdfConverter.ConvertToPdf("-", "<h3 style='text-align:center;color:red'>Your Session is Out. Kindly Login Again.</h3>", "-", "EQAS-Report.pdf");
            }
            ipReport obj = new ipReport();
            obj.DistrictName = District;
            obj.Prm1 = Prm1;
            obj.Prm2 = Prm2;
            obj.from = from;
            obj.to = to;
            obj.login_id = loginId;
            obj.Logic = "EQASReport";
            dataSet dsResult = APIProxy.CallWebApiMethod("Report/MIS_ReportQueries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder h = new StringBuilder();
            StringBuilder b = new StringBuilder();
            StringBuilder f = new StringBuilder();
            h.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px;zoom:1.6'>");
            string chandanLogo = HttpContext.Server.MapPath(@"~/Content/img/logo.png");
            string nhmLogo = HttpContext.Server.MapPath(@"~/Content/img/logo_nhm.png");
            //string QRCode = HttpContext.Server.MapPath(@"/Content/img/QRCode.png");
            h.Append("<div style='text-align:left;width:27%;float:left'>");
            h.Append("<img src=" + chandanLogo + " style='width:170px;margin-top:5px;' />");
            h.Append("</div>");
            h.Append("<div style='text-align:left;width:auto;float:left;width:43%;'>");
            h.Append("<h2 style='font-weight:bold;margin:0;text-align:center'>Chandan Healthcare Ltd</h2>");
            h.Append("<h4 style='text-align:center;margin:0;'>Biotech Park, Kursi Road, Lucknow</h4>");
            h.Append("<hr/>");
            h.Append("<h2 style='font-weight:bold;margin:0;text-align:center'>EQAS REPORT</h2>");
            h.Append("</div>");
            h.Append("<div style='text-align:left;width:30%;float:left'>");
            h.Append("<img src=" + nhmLogo + " style='width:175px;' />");
            h.Append("</div>");
            h.Append("<div style='text-align:left;width:50%;float:left'>");
            h.Append("<p style='color:black;font-size:12px'><b>Note 1 : <span >Variation in Results may occur due to different equipment, different reagent, difference in testing  methodology  and sample integrity</b></span></p>");
            h.Append("</div>");
            h.Append("<div style='text-align:left;width:50%;float:right'>");
            h.Append("<p style='color:black;font-size:12px'><b>Note 2 : <span >Unit of Results also vary due to change in equipment, method therefore it has been made uniform to get both lab results in same unit</b></span></p>");
            h.Append("</div>");
            h.Append("</div>");
            h.Append("<hr style='margin:0'/>");
            b.Append("<table border='1' style='width:100%;font-size:12px;border-collapse: collapse;margin-top:0px;'>");
            b.Append("<tr style='background:#2492b3;color:white'>");
            b.Append("<th style='text-align:left;border-color:white'>Observation Name</th>");
            b.Append("<th style='text-align:center;border-color:white' colspan='3'>Chandan</th>");
            b.Append("<th style='text-align:center;border-color:white' colspan='5'>EQAS</th>");
            b.Append("</tr>");
            b.Append("<tr style='background:#2492b3;color:white'>");
            b.Append("<th style='text-align:left;border-color:white'>Observation Name</th>");
            b.Append("<th style='width:6%;border-color:white'>Reading</th>");
            b.Append("<th style='width:7%;border-color:white'>Unit</th>");
            b.Append("<th style='width:10%;border-color:white'>Ref-Range</th>");
            b.Append("<th style='width:13%;border-color:white'>Lab Name</th>");
            b.Append("<th style='width:6%;border-color:white'>Reading</th>");
            b.Append("<th style='width:7%;border-color:white'>Unit</th>");
            b.Append("<th style='width:10%;border-color:white'>Ref-Range</th>");
            b.Append("<th style='width:8%;border-color:white'>Status</th>");
            b.Append("</tr>");
            string region = string.Empty;
            string district = string.Empty;
            string VisitNo = string.Empty;
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    if (region != dr["regionName"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td style='background:#f7e509' colspan='9'>Region : " + dr["regionName"].ToString() + "</td>");
                        b.Append("</tr>");
                        region = dr["regionName"].ToString();
                    }
                    if (district != dr["districtName"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td style='background:#f9b9b8' colspan='9'>District : " + dr["districtName"].ToString() + "</td>");
                        b.Append("</tr>");
                        district = dr["districtName"].ToString();
                    }
                    if (VisitNo != dr["VisitNo"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td style='background:#cdebfd' colspan='9'>" + dr["VisitNo"].ToString() + " [" + dr["PatientName"].ToString() + "] - " + dr["visitDate"].ToString() + " " + "</td>");
                        b.Append("</tr>");
                        VisitNo = dr["VisitNo"].ToString();
                    }
                    b.Append("<tr>");
                    b.Append("<td style='padding-left:4px;'>" + dr["ObservationName"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["chandan_reading"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["chandan_unit"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["chandan_RefRange"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["OutLabName"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["OutLab_reading"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["OutLab_unit"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["OutLab_RefRange"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'><b>" + dr["read_Status"].ToString() + "</b></td>");
                    b.Append("</tr>");
                }
            }
            b.Append("</table>");

            pdfConverter.Header_Enabled = true;
            pdfConverter.Footer_Enabled = true;
            pdfConverter.Footer_Hight = 35;
            pdfConverter.Header_Hight = 120;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "EQAS-Report.pdf");
        }     
        public FileResult PrintEQASReportForCMO(string Prm1)
        {
            PdfGenerator pdfConverter = new PdfGenerator();
            if (!TempData.ContainsKey("IsActive"))
            {
                return pdfConverter.ConvertToPdf("-", "<h3 style='text-align:center;color:red'>Your Session is Out. Kindly Login Again.</h3>", "-", "EQAS-Report.pdf");
            }
            ipReport obj = new ipReport();
            obj.Prm1 = Prm1;
            obj.from = "1900/01/01";
            obj.to = "1900/01/01"; ;
            obj.Logic = "EQASReportForCMO";
            dataSet dsResult = APIProxy.CallWebApiMethod("Report/MIS_ReportQueries", obj);
            DataSet ds = dsResult.ResultSet;
            string _result = string.Empty;
            StringBuilder h = new StringBuilder();
            StringBuilder b = new StringBuilder();
            StringBuilder f = new StringBuilder();
            h.Append("<div style='width:100%;float:left;margin-top:-12px;padding:8px;zoom:1.6'>");
            string chandanLogo = HttpContext.Server.MapPath(@"~/Content/img/logo.png");
            string nhmLogo = HttpContext.Server.MapPath(@"~/Content/img/logo_nhm.png");
            //string QRCode = HttpContext.Server.MapPath(@"/Content/img/QRCode.png");
            h.Append("<div style='text-align:left;width:27%;float:left'>");
            h.Append("<img src=" + chandanLogo + " style='width:170px;margin-top:5px;' />");
            h.Append("</div>");
            h.Append("<div style='text-align:left;width:auto;float:left;width:43%;'>");
            h.Append("<h2 style='font-weight:bold;margin:0;text-align:center'>Chandan Healthcare Ltd</h2>");
            h.Append("<h4 style='text-align:center;margin:0;'>Biotech Park, Kursi Road, Lucknow</h4>");
            h.Append("<hr/>");
            h.Append("<h2 style='font-weight:bold;margin:0;text-align:center'>EQAS REPORT</h2>");
            h.Append("</div>");
            h.Append("<div style='text-align:left;width:30%;float:left'>");
            h.Append("<img src=" + nhmLogo + " style='width:175px;' />");
            h.Append("</div>");
            h.Append("<div style='text-align:left;width:50%;float:left'>");
            h.Append("<p style='color:black;font-size:12px'><b>Note 1 : <span >Variation in Results may occur due to different equipment, different reagent, difference in testing  methodology  and sample integrity</b></span></p>");
            h.Append("</div>");
            h.Append("<div style='text-align:left;width:50%;float:right'>");
            h.Append("<p style='color:black;font-size:12px'><b>Note 2 : <span >Unit of Results also vary due to change in equipment, method therefore it has been made uniform to get both lab results in same unit</b></span></p>");
            h.Append("</div>");
            h.Append("</div>");
            h.Append("<hr style='margin:0'/>");
            b.Append("<table border='1' style='width:100%;font-size:12px;border-collapse: collapse;margin-top:0px;'>");
            b.Append("<tr style='background:#2492b3;color:white'>");
            b.Append("<th style='text-align:left;border-color:white'>Observation Name</th>");
            b.Append("<th style='text-align:center;border-color:white' colspan='3'>Chandan</th>");
            b.Append("<th style='text-align:center;border-color:white' colspan='5'>EQAS</th>");
            b.Append("</tr>");
            b.Append("<tr style='background:#2492b3;color:white'>");
            b.Append("<th style='text-align:left;border-color:white'>Observation Name</th>");
            b.Append("<th style='width:6%;border-color:white'>Reading</th>");
            b.Append("<th style='width:7%;border-color:white'>Unit</th>");
            b.Append("<th style='width:10%;border-color:white'>Ref-Range</th>");
            b.Append("<th style='width:13%;border-color:white'>Lab Name</th>");
            b.Append("<th style='width:6%;border-color:white'>Reading</th>");
            b.Append("<th style='width:7%;border-color:white'>Unit</th>");
            b.Append("<th style='width:10%;border-color:white'>Ref-Range</th>");
            b.Append("<th style='width:8%;border-color:white'>Status</th>");
            b.Append("</tr>");
            string region = string.Empty;
            string centre_name = string.Empty;
            string VisitNo = string.Empty;
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    if (centre_name != dr["centre_name"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td style='background:#f9b9b8' colspan='9'>Centre_name : " + dr["centre_name"].ToString() + ", Invoice No : " + Prm1 + "</td>");
                        b.Append("</tr>");
                        centre_name = dr["centre_name"].ToString();
                    }
                    if (VisitNo != dr["VisitNo"].ToString())
                    {
                        b.Append("<tr>");
                        b.Append("<td style='background:#cdebfd' colspan='9'>" + dr["VisitNo"].ToString() + " [" + dr["PatientName"].ToString() + "] - " + dr["visitDate"].ToString() + " " + "</td>");
                        b.Append("</tr>");
                        VisitNo = dr["VisitNo"].ToString();
                    }
                    b.Append("<tr>");
                    b.Append("<td style='padding-left:4px;'>" + dr["ObservationName"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["chandan_reading"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["chandan_unit"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["chandan_RefRange"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["OutLabName"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["OutLab_reading"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["OutLab_unit"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'>" + dr["OutLab_RefRange"].ToString() + "</td>");
                    b.Append("<td style='padding-left:4px;'><b>" + dr["read_Status"].ToString() + "</b></td>");
                    b.Append("</tr>");
                }
            }
            b.Append("</table>");

            pdfConverter.Header_Enabled = true;
            pdfConverter.Footer_Enabled = true;
            pdfConverter.Footer_Hight = 35;
            pdfConverter.Header_Hight = 120;
            pdfConverter.PageMarginLeft = 10;
            pdfConverter.PageMarginRight = 10;
            pdfConverter.PageMarginBottom = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageMarginTop = 10;
            pdfConverter.PageName = "A4";
            pdfConverter.PageOrientation = "Portrait";
            return pdfConverter.ConvertToPdf(h.ToString(), b.ToString(), "-", "EQAS-Report.pdf");
        }
    }
}