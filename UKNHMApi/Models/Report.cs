using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace UKNHMApi.Models
{
	public class ipReport
	{
		public int AutoId { get; set; }
		public string hosp_id { get; set; }	
		public string ItemId { get; set; }
		public string DistrictName { get; set; }
		public string CentreType { get; set; }
		public string MobileNo { get; set; }
		public string remark { get; set; }
		public string CentreId { get; set; }
		public string VisitNo { get; set; }
		public string Prm1 { get; set; }
		public string Prm2 { get; set; }
		public string Prm3 { get; set; }
		public string from { get; set; }
		public string to { get; set; }
		public int IsActive { get; set; }
		public string ReportType { get; set; }
		public string login_id { get; set; }
		public string Logic { get; set; }
	}
	public class EQASInfo:ipReport
	{
		public string BarcodeNo { get; set; }		
		public string testCode { get; set; }		
		public string ObservationId { get; set; }		
		public string ObservationName { get; set; }		
		public string chandan_reading { get; set; }		
		public string chandan_RefRange { get; set; }		
		public string chandan_unit { get; set; }		
		public string OutLabName { get; set; }		
		public string OutLab_reading { get; set; }		
		public string OutLab_RefRange { get; set; }		
		public string OutLab_unit { get; set; }		
		public string OutLab_ReportPath { get; set; }		
		public string read_Status { get; set; }		
		public string ImageName { get; set; }		
		public string IsAwaited { get; set; }		
	}
	public class dataSet
	{
		public string Msg { get; set; }
		public DataSet ResultSet { get; set; }
	}
}