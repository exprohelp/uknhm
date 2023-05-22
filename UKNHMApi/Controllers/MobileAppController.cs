using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using UKNHMApi.Models;
using UKNHMApi.Repository;
using UKNHMApi.Repository.MobileApp;

namespace UKNHMApi.Controllers
{
	[RoutePrefix("api/MobileApp")]
	public class MobileAppController : ApiController
    {
		private SMSDataLayer smsDataLayer = new SMSDataLayer();
		private App repositoryApp = new App();
		private DownloadLogic repositoryDownload = new DownloadLogic();

	
		[HttpPost]
		[Route("DiagnosticBookingReportByVisitNo")]
		public HttpResponseMessage DiagnosticBookingReportByVisitNo([FromBody] PatientInfo objBO)
		{
			string result = repositoryApp.DiagnosticBookingReportByVisitNo(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
		[HttpPost]
		[Route("DownloadLISReport")]
		public HttpResponseMessage DownloadLISReport(PatientInfo ipProfile)
		{
			string result = repositoryDownload.DownloadLISReport(ipProfile);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
		[HttpPost]
		[Route("MobileApp_Queries")]
		public HttpResponseMessage MobileApp_Queries([FromBody] ipMobileApp objBO)
		{
			dataSet ds = repositoryApp.MobileApp_Queries(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, ds);
		}

		[HttpPost]
		[Route("Register_Patient")]
		public HttpResponseMessage Register_Patient([FromBody] PatientInfo objBO)
		{
			string Result = repositoryApp.Register_Patient(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, Result);
		}
		[HttpPost]
		[Route("GetOtp")]
		public HttpResponseMessage GetOtp()
		{
			string otpvalue = OTPGenerator.GenerateRandomOTP(4);
			if (!string.IsNullOrEmpty(otpvalue))
			{
				return Request.CreateResponse(HttpStatusCode.OK, otpvalue);			
			}
			else
			{
				return Request.CreateResponse(HttpStatusCode.OK, "Otp not found");			
			}
		}
		[HttpPost]
		[Route("SendSMS")]
		public HttpResponseMessage SendSMS([FromBody] ipSMS objBO) {
			PatientInfo obj = new PatientInfo();
			obj.MobileNo = objBO.MobileNo;
			obj.Logic = "IsUserBlocked";
			string Result = repositoryApp.Register_Patient(obj);
			if(Result.Contains("Blocked"))
			{
				return Request.CreateResponse(HttpStatusCode.OK, Result);
			}
			else
			{
				string smsresponse = smsDataLayer.NHMPatientRegistrationOTP(objBO);
				return Request.CreateResponse(HttpStatusCode.OK, smsresponse);
			}		
		}
		[HttpPost]
		[Route("SendReportDownloadLink")]
		public HttpResponseMessage SendReportDownloadLink([FromBody] ipSMS objBO)
		{
			string smsresponse = smsDataLayer.SendReportDownloadLink(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, smsresponse);
		}
		[HttpPost]
		[Route("Dispatch_ReceiveSample")]
		public HttpResponseMessage Dispatch_ReceiveSample([FromBody] SampleInfo objBO)
		{
			string smsresponse = repositoryApp.Dispatch_ReceiveSample(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, smsresponse);
		}
        [HttpPost]
        [Route("Ins_Att_Reg")]
        public HttpResponseMessage Ins_Att_Reg([FromBody] AttendInfo objBO)
        {
            string smsresponse = repositoryApp.Ins_Att_Reg(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, smsresponse);
        }
        [HttpPost]
        [Route("HRQueries")]
        public HttpResponseMessage HR_Queries([FromBody] HRQueries objBO)
        {
            dataSet ds = repositoryApp.HR_Queries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }

        //OTP Testing MAthod
        [HttpPost]
        [Route("OTPTesting")]
        public HttpResponseMessage OTPTesting([FromBody] ipSMS objBO)
        {
            string smsresponse = smsDataLayer.NHMPatientRegistrationOTP(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, smsresponse);
        }
    }
}
