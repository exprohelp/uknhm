using System;
using System.Web.Mvc;

namespace UKNHM.Areas.ApplicationResource.Controllers
{
	public class AdminController : Controller
	{		
		// GET: ApplicationResource/Admin 
		public ActionResult Login()
		{
			return View();
		}
		public ActionResult Dashboard()
		{		
			return View();
		}
		public ActionResult DoctorMaster()
		{
			return View();
		}
		public ActionResult DoctorView()
		{
			return View();
		}
		public ActionResult UserMaster()
		{
			return View();
		}
		public ActionResult MobileAppUser()
		{
			return View();
		}
		public ActionResult CentreAllotment()
		{
			return View();
		}
	}
}