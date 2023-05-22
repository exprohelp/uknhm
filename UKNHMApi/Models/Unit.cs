using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UKNHMApi.Models
{
	public class ipUnit
	{
		public int AutoId { get; set; }
		public string hosp_id { get; set; }
		public string ItemId { get; set; }
		public string DistrictName { get; set; }
		public string LabCode { get; set; }
		public string CentreType { get; set; }
		public string MobileNo { get; set; }
		public string remark { get; set; }
		public string CentreId { get; set; }
		public string VisitNo { get; set; }
		public string TestCode { get; set; }
		public string TestId { get; set; }
		public string CancelRemark { get; set; }
		public int IsCancelled { get; set; }
		public decimal Amount { get; set; }
		public string Prm1 { get; set; }
		public string Prm2 { get; set; }
		public string from { get; set; }
		public string to { get; set; }
		public int IsActive { get; set; }
		public string login_id { get; set; }
		public string Logic { get; set; }
	}
	public class PatientDetails : ipUnit
	{				
		public string PatientName { get; set; }
		public string Gender { get; set; }
		public int Age { get; set; }
		public string Prm1 { get; set; }	
		public string AgeType { get; set; }	
		public string DoctorId { get; set; }		
	}
	public class TestApproveInfo : ipUnit
	{
		public string testCode { get; set; }
		public string ItDoseTestId { get; set; }
		public string ApprovedDate { get; set; }
		public string ApprovedBy { get; set; }
		public string ApprovedBylab { get; set; }
		public string ItemID_Interface { get; set; }
	}
}