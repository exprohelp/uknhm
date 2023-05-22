using UKNHMApi.Models;

namespace UKNHMApi.Repository
{
	public class SMSDataLayer
	{
		SmsClass sms = new SmsClass();
		public string AuthenticateUserLoginOTP(ipSMS objBO)
		{
			string msg = objBO.Otp + " is your chandan member verification code";
            string smsresponse = sms.SendSmsByTemplateId(objBO.MobileNo, msg, "1007368458238551885");
            if (!string.IsNullOrEmpty(smsresponse))
			{
				return smsresponse;
			}
			else
			{
				return "SMS not send, please try again";
			}
		}
		public string NHMPatientRegistrationOTP(ipSMS objBO)
		{
			SmsClass sms = new SmsClass();
			string msg = "Your Verification Code is " + objBO.Otp + " for registration under NHM, Uttarakhand Free diagnostic Services. Team Chandan";
		    string smsresponse = sms.SendSmsByTemplateId(objBO.MobileNo, msg, "1007789497012223999");
            if (!string.IsNullOrEmpty(smsresponse))
			{
				return smsresponse;
			}
			else
			{
				return "SMS not send, please try again";
			}
		}
		public string SendReportDownloadLink(ipSMS objBO)
		{
			SmsClass sms = new SmsClass();
			string msg = "You are registered under NHM,Uttarakhand Free Diagnostic services, Download Report https://exprohelp.com/UKNHM//mobileApp/App/dpr?VisitNo="+objBO.Prm1+ " :Chandan";		
			string smsresponse = sms.SendSmsByTemplateId(objBO.MobileNo, msg, "1007672078453847720");
			if (!string.IsNullOrEmpty(smsresponse))
			{
				return smsresponse;
			}
			else
			{
				return "SMS not send, please try again";
			}
		}
		public string PasswordChangeSMS(ipSMS objBO)
		{
			SmsClass sms = new SmsClass();
			string link = "http://exprohelp.com/uknhm/mobileApp/app/UserPasswordChange?MobileNo=" + objBO.MobileNo + "";
			//string msg = "You are registered under NHM,Uttarakhand Free Diagnostic services, Download Report https://exprohelp.com/UKNHM//mobileApp/App/dpr?VisitNo=" + objBO.Prm1 + " :Chandan";
			//string msg = "Dear User, Click the below link to change your password. -Team Chandan "+ link + "";
			string msg = "Dear User, Click the below link to change your password. -Team Chandan http://exprohelp.com/uknhm/mobileApp/app/upc?MNo=" + objBO.MobileNo + "";
			string smsresponse = sms.SendSms(objBO.MobileNo, msg);
			if (!string.IsNullOrEmpty(smsresponse))
			{
				return smsresponse;
			}
			else
			{
				return "SMS not send, please try again";
			}
		}
	}
}