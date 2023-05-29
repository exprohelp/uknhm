using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using UKNHMApi.Models;
using UKNHMApi.Repository.ApplicationResources;

namespace UKNHMApi.Repository
{
	public class SmsClass
	{      
		public string SendSms(string MobileNoByComaSeperated, string msg)
		{
			String responseFromServer = string.Empty;
            string providerName = string.Empty;
            string url = "";
			string Provider = string.Empty;
			try
			{
                string smstext = string.Empty;
               
                Admin repo = new Admin();
                ipAdmin objBO = new ipAdmin();
                objBO.Logic = "ActiveSmsProvider";
                dataSet ds = repo.MasterQueries(objBO);
                providerName = ds.ResultSet.Tables[0].Rows[0].Field<string>(0);
                if (ds.ResultSet.Tables[0].Rows[0].Field<string>(0).Contains("ValueFirst"))
                {
                    smstext = msg;
                    url = "https://http.myvfirst.com/smpp/sendsms?username=chndnotphtp&password=chn2130O&to=" + MobileNoByComaSeperated + "&from=chandn&text=" + smstext + "";
                }
                else if (ds.ResultSet.Tables[0].Rows[0].Field<string>(0).Contains("NexGen"))
                {
                    smstext = "to=91"+MobileNoByComaSeperated+"&indiaDltContentTemplateId=1007789497012223999&indiaDltPrincipalEntityId=1001969186191969669&";
                    smstext += "text="+msg;
                    url = "https://api2.nexgplatforms.com/sms/1/text/query?username=ChndnApiT&password=ExPro@1967&from=CHANDN&" + smstext;
                }


                WebRequest request = WebRequest.Create(url);
				request.Method = "GET";
				//request.ContentLength = sURL.Length;
				request.Credentials = CredentialCache.DefaultCredentials;
				HttpWebResponse response1 = (HttpWebResponse)request.GetResponse();
				Stream dataStream = response1.GetResponseStream();
				StreamReader reader = new StreamReader(dataStream);
				responseFromServer = reader.ReadToEnd();
				reader.Close();
				dataStream.Close();
				response1.Close();
			}
			catch (Exception ex)
			{
				responseFromServer = ex.Message;
			}
            if (providerName.Contains("NexGen"))
            {
                NexGenResponse.Root response = JsonConvert.DeserializeObject<NexGenResponse.Root>(responseFromServer);
                if (response.messages[0].status.groupName.Contains("PENDING"))
                    responseFromServer = "Sent";
                else
                    responseFromServer = "Failed";                                           
            }
            return responseFromServer;
		}
        public string SendSmsByTemplateId(string MobileNoByComaSeperated, string msg,string TemplateId)
        {
            String responseFromServer = string.Empty;
            string providerName = string.Empty;
            string url = "";
            string Provider = string.Empty;
            try
            {
                //test
                string smstext = string.Empty;

                Admin repo = new Admin();
                ipAdmin objBO = new ipAdmin();
                objBO.Logic = "ActiveSmsProvider";
                dataSet ds = repo.MasterQueries(objBO);
                providerName = ds.ResultSet.Tables[0].Rows[0].Field<string>(0);
               
                if (ds.ResultSet.Tables[0].Rows[0].Field<string>(0).Contains("ValueFirst"))
                {
                    smstext = msg;
                    url = "https://http.myvfirst.com/smpp/sendsms?username=chndnotphtp&password=chn2130O&to=" + MobileNoByComaSeperated + "&from=chandn&text=" + smstext + "";
                }
                else if (ds.ResultSet.Tables[0].Rows[0].Field<string>(0).Contains("NexGen"))
                {
                    smstext = "to=91" + MobileNoByComaSeperated + "&indiaDltContentTemplateId=" + TemplateId + "&indiaDltPrincipalEntityId=1001969186191969669&";
                    smstext += "text=" + msg;
                    url = "https://api2.nexgplatforms.com/sms/1/text/query?username=ChndnApiT&password=ExPro@1967&from=CHANDN&" + smstext;
                }


                WebRequest request = WebRequest.Create(url);
                request.Method = "GET";
                //request.ContentLength = sURL.Length;
                request.Credentials = CredentialCache.DefaultCredentials;
                HttpWebResponse response1 = (HttpWebResponse)request.GetResponse();
                Stream dataStream = response1.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                responseFromServer = reader.ReadToEnd();
                reader.Close();
                dataStream.Close();
                response1.Close();
            }
            catch (Exception ex)
            {
                responseFromServer = "System Response:" + ex.Message;                
            }
            if (providerName.Contains("NexGen"))
            {
                try
                {
                    NexGenResponse.Root response = JsonConvert.DeserializeObject<NexGenResponse.Root>(responseFromServer);
                    if (response.messages[0].status.groupName.Contains("PENDING"))
                        responseFromServer = "Sent";
                    else
                        responseFromServer = "Failed";
                }
                catch (Exception ex) {
                    responseFromServer = "Next Gen Response:" + responseFromServer;
                }
            }
            return responseFromServer;
        }       
    }
}