namespace UKNHMApi.Models
{
	public class ipUploadPDF
	{
		public string FileName;
		public string FileByteArray;
		public string Logic { get; set; }
	}
	public class SubmitStatus
	{
		public int Status { get; set; }
		public string Message { get; set; }
		public string VisitNo { get; set; }
		public string barcodeNo { get; set; }
		public string virtual_path { get; set; }
		public string doc_location { get; set; }
	}
	public class ipDocumentInfo
	{
		public string HospitalId { get; set; }
		public string CentreId { get; set; }
		public string VisitNo { get; set; }
		public string barcodeNo { get; set; }
		public string doc_name { get; set; }
		public string doctorName { get; set; }
		public string TranId { get; set; }
		public string TrnType { get; set; }
		public byte[] imageByte { get; set; }
		public string ImageName { get; set; }		
		public string ImageType { get; set; }
		public string ServerUrl { get; set; }
		public string login_id { get; set; }
		public string Logic { get; set; }
	}
}