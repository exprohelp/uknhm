using System;
using System.Globalization;
using System.IO;
using System.Net.Mail;

namespace UKNHMApi.Repository.Utility
{
	public class UploadClass
	{
        public static string UploadCampaignDoc(out string outFileName, out string virtual_path, byte[] imageByte, string ImageName)
        {
            outFileName = "Error";
            virtual_path = "http://exprohelp.com/UKNHMDoc/Reports/EQAS_Report/" + ImageName;
            string result = "Not Saved";
            string directory = "F:\\OneDrive\\UK_NHM\\Campaign\\";
            try
            {
                if (!Directory.Exists(directory))
                    Directory.CreateDirectory(directory);

                outFileName = directory + ImageName;
                File.WriteAllBytes(outFileName, imageByte);
                result = "Success";
            }
            catch (Exception ex) { result = ex.Message; }
            return result;
        }
        public static string UploadEQASReport(out string outFileName, out string virtual_path, byte[] imageByte, string ImageName)
		{
			outFileName = "Error";
			 virtual_path = "http://exprohelp.com/UKNHMDoc/Reports/EQAS_Report/" + ImageName;
			string result = "Not Saved";       
            string directory = "F:\\OneDrive\\UK_NHM\\Reports\\EQAS_Report\\";
			try
			{
				if (!Directory.Exists(directory))
					Directory.CreateDirectory(directory);

				outFileName = directory + ImageName;
				File.WriteAllBytes(outFileName, imageByte);
				result = "Success";
			}
			catch (Exception ex) { result = ex.Message; }
			return result;
		}
		public static string UploadBillReceipt(out string outFileName, byte[] imageByte, string ImageName)
		{
			outFileName = "Error";
			string result = "Not Saved";			
			string directory = "F:\\UK_NHM\\Reports\\Bill_Receipt\\";
			try
			{
				if (!Directory.Exists(directory))
					Directory.CreateDirectory(directory);

				outFileName = directory + ImageName;
				File.WriteAllBytes(outFileName, imageByte);
				result = "Success";
			}
			catch (Exception ex) { result = ex.Message; }
			return result;
		}
		public static string UploadPrescription(out string outFileName, string CentreId, string VisitNo, byte[] imageByte, string ImageName)
		{
			outFileName = "Error";
			string result = "Not Saved";
			var monthYear = GetmonthYear();
			int curYear = Convert.ToInt32(GetfinYear());
			int nextYear = Convert.ToInt32(GetfinYear()) + 1;
			string finyear = curYear + "-" + nextYear;
			string NewVisitNo = VisitNo.Split('-')[2];
			//var d = dateFormat.ToString("dd-MM-yyyy");
			//var date = d.Substring(d.Length - 3, 7);
			string directory = "F:\\OneDrive\\UK_NHM\\" + monthYear + "\\" + CentreId + "\\";
			try
			{
				if (!Directory.Exists(directory))
					Directory.CreateDirectory(directory);

				outFileName = directory + VisitNo + "_" + ImageName;
				File.WriteAllBytes(outFileName, imageByte);
				result = "Success";
			}
			catch (Exception ex) { result = ex.Message; }
			return result;
		}
		public static string GetmonthYear()
		{
			DateTime.TryParseExact(DateTime.UtcNow.ToString("dd-MM-yyyy"), "dd-MM-yyyy", CultureInfo.CurrentCulture, DateTimeStyles.None, out DateTime resultDate);
			return resultDate.ToString("MM-yyyy");
		}
		public static string GetfinYear()
		{
			DateTime.TryParseExact(DateTime.UtcNow.ToString("dd-MM-yyyy"), "dd-MM-yyyy", CultureInfo.CurrentCulture, DateTimeStyles.None, out DateTime resultDate);
			return resultDate.ToString("yy");
		}
		public static string SendMail(byte[] fileBytes, string ImageName)
		{
			string result = string.Empty;
			string Body = string.Empty;
			MailMessage mail = new MailMessage();
			try
			{
				Attachment att = new Attachment(new MemoryStream(fileBytes), ImageName);
				mail.To.Add("nitink.srivastava529@gmail.com");
				mail.From = new MailAddress("chl.hr@chandan.co.in");

				mail.Subject = "Patient Query (Chandan Hospital) | Attachment ";
				Body += "Patient Email : test@gmail.com";
				Body += "<br />Please Find the Attachment-";
				//mail.Attachments.Add(new Attachment( obj.ImageByte, System.IO.Path.GetFileName(fileAttach.FileName)));
				mail.Attachments.Add(att);
				mail.Body = Body;
				mail.IsBodyHtml = true;

				SmtpClient smtp = new SmtpClient("smtp.zoho.in", 587);
				smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
				smtp.Credentials = new System.Net.NetworkCredential("chl.hr@chandan.co.in", "Newhr@123");
				smtp.EnableSsl = true;
				smtp.Send(mail);
				result = "success";
			}
			catch (Exception ex)
			{
				result = ex.Message;
			}
			finally
			{
				mail.Dispose();
			}
			return result;
		}
	}
}