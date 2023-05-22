using System;

namespace UKNHMApi.Models
{
	public class ipMobileApp
	{
		public int AutoId { get; set; }
		public string hosp_id { get; set; }
		public string ItemId { get; set; }
		public string LabCode { get; set; }
		public string CentreId { get; set; }
		public string VisitNo { get; set; }
		public string from { get; set; }
		public string to { get; set; }
		public string Remark { get; set; }
		public string Prm1 { get; set; }
		public string Prm2 { get; set; }
		public int IsActive { get; set; }
		public string login_id { get; set; }
		public string Logic { get; set; }
	}
	public class HRQueries : ipMobileApp
    {
        public string unit_id { get; set; }
        public string comp_id { get; set; }
        public string logic { get; set; }
        public string prm_1 { get; set; }
        public string prm_2 { get; set; }
        public string prm_3 { get; set; }
        public string loginid { get; set; }
        public string login_id { get; set; }
    }
	public class AttendInfo : ipMobileApp
    {
        public string inp_date { get; set; }
        public string emp_code { get; set; }
        public string status { get; set; }
        public string Mgrcode { get; set; }
        public DateTime cr_date { get; set; }
    }

    public class ipSMS
	{
		public string MobileNo { get; set; }
		public string Prm1 { get; set; }
		public string Otp { get; set; }
	}
	public class SampleInfo : ipMobileApp
	{
		public string DispatchNo { get; set; }
		public string SampleNo { get; set; }
		public string remark { get; set; }
	}
	public class PatientInfo : ipMobileApp
	{
		public string TestIds { get; set; }
		public string TrnNo { get; set; }
		public string PatientType { get; set; }
		public string PatientName { get; set; }
		public string MobileNo { get; set; }
		public string EmailId { get; set; }
		public string doc_name { get; set; }
		public string barcodeNo { get; set; }
		public string virtual_location { get; set; }
		public string doc_location { get; set; }
		public int fSize { get; set; }
		public int age { get; set; }
		public byte[] imageByte { get; set; }
		public string FileName { get; set; }
		public string ageType { get; set; }
		public string ServerUrl { get; set; }
		public string gender { get; set; }
		public string doctorId { get; set; }
		public string doctorName { get; set; }
		public string remark { get; set; }
		public string TestCodes { get; set; }
		public string RegDate { get; set; }
	}
}
