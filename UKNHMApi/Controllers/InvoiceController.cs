using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using UKNHMApi.Models;
using UKNHMApi.Repository.Invoice;
using UKNHMApi.Repository.Utility;

namespace UKNHMApi.Controllers
{
	[RoutePrefix("api/Invoice")]
	public class InvoiceController : ApiController
	{
		private Invoice repositoryReport = new Invoice();     
        [HttpPost]
		[Route("Invoice_Queries")]
		public HttpResponseMessage Invoice_Queries([FromBody] ipInvoice objBO)
		{
			if (objBO.ReportType == "XL")
			{
				dataSet ds = repositoryReport.Invoice_Queries(objBO);
				UKNHMApi.Repository.ExcelGenerator obj = new Repository.ExcelGenerator();
				return obj.GetExcelFile(ds.ResultSet);
			}
			else
			{
				dataSet ds = repositoryReport.Invoice_Queries(objBO);
				return Request.CreateResponse(HttpStatusCode.OK, ds);
			}
		}

		[HttpPost]
		[Route("GenerateInvoiceofMonth")]
		public HttpResponseMessage GenerateInvoiceofMonth([FromBody]ReceivedPayInfo obj)
		{
			string result = repositoryReport.GenerateInvoiceofMonth(obj);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
		[HttpPost]
		[Route("InvoiceReceivedPayInfo")]
		public HttpResponseMessage InvoiceReceivedPayInfo([FromBody]ReceivedPayInfo obj)
		{
			string result = repositoryReport.Invoice_ReceivedPayInfo(obj);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
		[HttpPost]
		[Route("Invoice_ReceivedPayInfo")]
		public async Task<HttpResponseMessage> Invoice_ReceivedPayInfo()
		{
			HttpResponseMessage response = new HttpResponseMessage();
			PatientInfo objBO = new PatientInfo();
			SubmitStatus ss = new SubmitStatus();
			if (!Request.Content.IsMimeMultipartContent())
			{
				ss.Status = 0;
				ss.Message = "This is not multipart content";
				response = Request.CreateResponse(HttpStatusCode.UnsupportedMediaType, "This is not multipart content");
			}
			try
			{
				string outFileName = string.Empty;
				string exten = string.Empty;
				var filesReadToProvider = await Request.Content.ReadAsMultipartAsync();
				//Json String of object  ipUploadDocument to be send at first or 0 index parameter   
				var json = await filesReadToProvider.Contents[0].ReadAsStringAsync();
				ReceivedPayInfo obj = JsonConvert.DeserializeObject<ReceivedPayInfo>(json);
				//Image to be send at second or 1 index parameter  
				byte[] fileBytes = await filesReadToProvider.Contents[1].ReadAsByteArrayAsync();
				string FileName = filesReadToProvider.Contents[1].Headers.ContentDisposition.FileName;
				if (fileBytes.Length > 10)
				{
					string temp = FileName.Substring((FileName.Length) - 7).Replace("\"", "");
					string[] extenArray = temp.ToString().Split('.');
					 exten = extenArray[extenArray.Length - 1];
					obj.FilePath ="."+exten;
				}
				ss.Message = repositoryReport.Invoice_ReceivedPayInfo(obj);
				obj.ReceiptNo = ss.Message.Split('|')[1];
				if (ss.Message.Contains("Success"))
				{
					if (fileBytes.Length > 10)
					{						
						obj.ImageName = obj.ReceiptNo + "." + exten;
						ss.Message = UploadClass.UploadBillReceipt(out outFileName, fileBytes, obj.ImageName);
						response = Request.CreateResponse(HttpStatusCode.OK, ss);
					}
					response = Request.CreateResponse(HttpStatusCode.OK, ss);
				}
			}
			catch (Exception ex)
			{
				ss.Status = 0;
				ss.Message = ex.Message;
				response = Request.CreateResponse(HttpStatusCode.OK, ss);
			}
			return response;
			//string doc_location = string.Empty;
			//string result = UploadClass.UploadPrescription(out doc_location, obj.imageByte, obj.ImageName);
			//return Request.CreateResponse(HttpStatusCode.OK, result);
		}
	}
}
