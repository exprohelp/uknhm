using System.Web.Mvc;

namespace UKNHM.Areas.MobileApp.Controllers
{
	//[RouteArea("MobileApp")]
	public class AppController : Controller
	{
		// GET: MobileApp/App
		public ActionResult PatientRegistration()
		{
			return View();
		}
		public ActionResult MultiOptions()
		{
			return View();
		}
		public ActionResult PatientRegister()
		{
			return View();
		}
		public ActionResult PatientReport()
		{
			return View();
		}
		public ActionResult upc()
		{
			return View();
		}	
		public ActionResult DPR()
		{
			return View();
		}
		public ActionResult OTPByPass()
		{
			return View();
		}
		public ActionResult ViewPrescription()
		{
			return View();
		}
		public ActionResult NHMUserMaster()
		{
			return View();
		}
		public ActionResult DispatchSample()
		{
			return View();
		}
		//[HttpPost]
		//public JsonResult GetOtp()
		//{
		//	string otpvalue = OTPGenerator.GenerateRandomOTP(4);
		//	if (!string.IsNullOrEmpty(otpvalue))
		//	{
		//		return Json(otpvalue, JsonRequestBehavior.AllowGet);
		//	}
		//	else
		//	{
		//		return Json("Otp not found", JsonRequestBehavior.AllowGet);
		//	}
		//}

		//[HttpPost]
		//public JsonResult SendSMS(string mobile, string otp)
		//{			
		//	SmsClass sms = new SmsClass();
		//	string msg = "Your OTP is " + otp + " for registration under NHM, Uttarakhand Free diagnostic Services.";
		//	string smsresponse = sms.SendSms(mobile, msg);
		//	if (!string.IsNullOrEmpty(smsresponse))
		//	{
		//		return Json(smsresponse, JsonRequestBehavior.AllowGet);
		//	}
		//	else
		//	{
		//		return Json("SMS not send, please try again ", JsonRequestBehavior.AllowGet);
		//	}
		//}
	}
}