using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using UKNHMApi.Models;

namespace UKNHMApi.Repository.MobileApp
{
	public class DownloadLogic
	{
        public string DownloadLISReport(PatientInfo ipProfile)
        {
            string result = string.Empty;
            string virtualPath = string.Empty;
            string Url = string.Empty;
            LISDBLayer lISDBLayer = new LISDBLayer();
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                System.Net.WebClient Client = new System.Net.WebClient();
                dataSet rs = lISDBLayer.CheckRegDATE(ipProfile.TestIds);
                Url = "http://192.168.0.21/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";                
                if (rs.ResultSet.Tables[0].Rows.Count > 0)
                {
                    if (rs.ResultSet.Tables[0].Rows[0]["DBType"].ToString() == "BackupDB")
                    {
                        Url = "http://192.168.0.21/Chandan/Design/Lab/labreportnew_NhmUkArchive1.aspx?IsPrev=1&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                    }
                }
                var bytes = Client.DownloadData(Url);
                result = SaveReport(out virtualPath, ipProfile.VisitNo, bytes);
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }
     
        public string DownloadLISReportOld(PatientInfo ipProfile)
		{
			string result = string.Empty;
            string Url = "";

            string virtualPath = string.Empty;
			HttpResponseMessage response = new HttpResponseMessage();
			try
			{
				System.Net.WebClient Client = new System.Net.WebClient();
                string LastArchiveDate = ConfigurationManager.ConnectionStrings["LastArchiveDate"].ToString();
                Url = "http://192.168.0.21/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                //if (!string.IsNullOrEmpty(ipProfile.RegDate))
                //{
                //    if (Convert.ToDateTime(ipProfile.RegDate) <= Convert.ToDateTime(LastArchiveDate))
                //    {
                //        Url = "http://192.168.0.21/Chandan/Design/Lab/labreportnew_NhmUkArchive1.aspx?IsPrev=1&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                //    }
                //    else
                //    {
                //        Url = "http://192.168.0.21/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                //    }
                //}
                //else
                //{
                //    Url = "http://192.168.0.21/Chandan/Design/Lab/labreportnew_NhmUk.aspx?IsPrev=1&PHead=1&testid=" + ipProfile.TestIds + "&Mobile=1";
                //}

                var bytes = Client.DownloadData(Url);
				result = SaveReport(out virtualPath, ipProfile.VisitNo, bytes);
			}
			catch (Exception ex)
			{
				result = ex.Message;
			}
			return result;
		}
		public string SaveReport(out string virtualPath, string VisitNo, byte[] pdfByte)
		{
			string result = string.Empty;
			string Month = System.DateTime.Now.ToString("MM-yyyy");
			string directory = "E:\\Document\\Diagnostic\\" + Month + "\\";
			string Path = directory + VisitNo.Replace("/","_") + ".pdf";
			try
			{
				if (!Directory.Exists(directory))
					Directory.CreateDirectory(directory);

				File.WriteAllBytes(Path, pdfByte);
				result = "Success";
				virtualPath = "\\Document\\Diagnostic\\" + Month + "\\" + VisitNo.Replace("/", "_") + ".pdf";
			}
			catch (Exception ex) { result = ex.Message; virtualPath = ""; }
			return virtualPath;
		}
	}
}