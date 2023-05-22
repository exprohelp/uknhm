using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UKNHMApi.Models
{
	public class ipAdmin
	{
		public int AutoId { get; set; }
		public string hosp_id { get; set; }
		public string DoctorId { get; set; }
		public string DoctorName { get; set; }
		public string Degree { get; set; }
		public string Specialization { get; set; }
		public string CenterId { get; set; }
		public string DistrictName { get; set; }
		public string CentreType { get; set; }
		public string MobileNo { get; set; }
		public string remark { get; set; }
		public string CentreId { get; set; }
		public string VisitNo { get; set; }
		public string Prm1 { get; set; }
		public string Prm2 { get; set; }
		public string from { get; set; }
		public string to { get; set; }
		public int IsActive { get; set; }
		public string login_id { get; set; }
		public string Logic { get; set; }
	}
	public class Authenticate : ipAdmin
	{
		public string UserType { get; set; }
		public string UserId { get; set; }
		public string Username { get; set; }
		public string Password { get; set; }
	}
	public class MasterInfo:ipAdmin
	{
		public string UserType { get; set; }
		public string UserId { get; set; }
		public string UserName { get; set; }
		public string Pwd { get; set; }
	}
}