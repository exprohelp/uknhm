namespace UKNHMApi.Models
{
	public class ipInvoice
	{
		public string CentreId { get; set; }
		public string InvoiceNo { get; set; }
		public string ReceiptNo { get; set; }
		public string Prm1 { get; set; }
		public string from { get; set; }
		public string to { get; set; }
		public string ReportType { get; set; }
		public string login_id { get; set; }
		public string Logic { get; set; }
	}
	public class ReceivedPayInfo : ipInvoice
	{
		public string ReceiptNo { get; set; }
		public string PayMode { get; set; }
		public decimal Amount { get; set; }
		public decimal TDSAmount { get; set; }
		public string AccountNo { get; set; }
		public string BankName { get; set; }
		public string ChequeDate { get; set; }
		public string MonthDate { get; set; }
		public string RefNo { get; set; }
		public string Remark { get; set; }
		public string ImageName { get; set; }
		public string FilePath { get; set; }
	}
}