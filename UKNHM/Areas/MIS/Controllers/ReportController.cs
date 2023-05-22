using System.Web.Mvc;

namespace UKNHM.Areas.MIS.Controllers
{
	public class ReportController : Controller
	{
		// GET: MIS/Report\
		public ActionResult Dashboard()
		{
			TempData["IsActive"] =true;			
			return View();
		}
		public ActionResult Dashboard2()
		{
			return View();
		}
		public ActionResult PatientRegister()
		{
			return View();
		}
		public ActionResult PatientApproval()
		{
			return View();
		}
		public ActionResult TestAnalysis()
		{
			return View();
		}
		public ActionResult TestAnalysisConsolidated()
		{
			return View();
		}
		public ActionResult TatReport()
		{
			return View();
		}
		public ActionResult TatReportChandan()
		{
			return View();
		}
		public ActionResult DoctorWiseReport()
		{
			return View();
		}
		public ActionResult PatientAudit()
		{
			return View();
		}
		public ActionResult RegInfo()
		{
			return View();
		}
		public ActionResult RawData()
		{
			return View();
		}
		public ActionResult RawDataTestWise()
		{
			return View();
		}
		public ActionResult NHMSummary()
		{
			return View();
		}
		public ActionResult NHMOverAllSummary()
		{
			return View();
		}
		public ActionResult CancelReport()
		{
			return View();
		}
		public ActionResult CMSApprovalPendency()
		{
			return View();
		}
		public ActionResult TestCountBreakup()
		{			
			return View();			
		}
		public ActionResult EqasReadingEntryForm()
		{
			return View();
		}
		public ActionResult EQASReport()
		{
			return View();
		}
        public ActionResult EQASReportNHM()
        {
            return View();
        }
        public ActionResult SampleReadingLog()
		{
			return View();
		}
		public ActionResult RepeatedEntry()
		{
			return View();
		}
        public ActionResult CentreList()
        {
            return View();
        }
        public ActionResult MonthlySaleReport()
        {
            return View();
        }
        public ActionResult EQASDateShifting()
        {
            return View();
        }
        public ActionResult CampaignMaster()
        {
            return View();
        }
    }
}