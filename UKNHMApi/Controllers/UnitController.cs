using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using UKNHMApi.Models;
using UKNHMApi.Repository.MobileApp;
using UKNHMApi.Repository.Unit;
using UKNHMApi.Repository.Utility;

namespace UKNHMApi.Controllers
{
	[RoutePrefix("api/Unit")]
	public class UnitController : ApiController
	{
        UKNHMApi.LISProxy.SaleService ItdoseProxy = new LISProxy.SaleService();
        private Lab repositoryLab = new Lab();
		private LISDBLayer repositoryLisDBLayer = new LISDBLayer();

		[HttpPost]
		[Route("MarkITDoseSynced")]
		public HttpResponseMessage MarkITDoseSynced([FromBody] MasterInfo objBO)
		{
			string result = repositoryLisDBLayer.MarkITDoseSynced(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
		[HttpPost]
		[Route("ITDoseChandanBulkSync")]
		public HttpResponseMessage ITDoseChandanBulkSync([FromBody] ipUnit objBO)
		{
			dataSet ds = repositoryLisDBLayer.ITDoseChandanBulkSync(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, ds);
		}
		[HttpPost]
		[Route("Unit_VerificationQueries")]
		public HttpResponseMessage Unit_VerificationQueries([FromBody] ipUnit objBO)
		{
			dataSet ds = repositoryLab.Unit_VerificationQueries(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, ds);
		}
		[HttpPost]
		[Route("UKNHReport")]
		public HttpResponseMessage UKNHReport([FromBody] ipUnit objBO)
		{
			dataSet ds = repositoryLisDBLayer.UKNHReport(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, ds);
		}
		[HttpPost]
		[Route("ITDoseApproveVisitNos")]
		public HttpResponseMessage ITDoseApproveVisitNos([FromBody] ipUnit objBO)
		{
			string result = repositoryLisDBLayer.ITDoseApproveVisitNos(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
		[HttpPost]
		[Route("ITDoseRegistrationInfo")]
		public HttpResponseMessage ITDoseRegistrationInfo([FromBody] ipUnit objBO)
		{
			dataSet ds = repositoryLisDBLayer.ITDoseRegistrationInfo(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, ds);
		}
		[HttpPost]
		[Route("Unit_InsertUpdateVerification")]
		public HttpResponseMessage Unit_InsertUpdateVerification([FromBody] List<PatientDetails> objBO)
		{
			string result = repositoryLab.Unit_InsertUpdateVerification(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
		[HttpPost]
		[Route("Unit_InsertUpdateUnitWorking")]
		public HttpResponseMessage Unit_InsertUpdateUnitWorking([FromBody] PatientInfo objBO)
		{
			string result = repositoryLab.Unit_InsertUpdateUnitWorking(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
		[HttpPost]
		[Route("Insert_ScanedDocument")]
		public HttpResponseMessage Insert_ScanedDocument([FromBody] PatientInfo objBO)
		{
			string result = repositoryLab.Insert_ScanedDocument(objBO);
			return Request.CreateResponse(HttpStatusCode.OK, result);
		}
        [HttpPost]
        [Route("ItDose_DirectLinkForCancelTest")]
        public HttpResponseMessage ItDose_DirectLinkForCancelTest([FromBody] PatientInfo objBO)
        {
            string result= ItdoseProxy.UPHealth_CancelTest(objBO.VisitNo, objBO.TestCodes);          
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("InsertCampaignMaster")]
        public async Task<HttpResponseMessage> InsertCampaignMaster()
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
                string virtual_path = string.Empty;
                var filesReadToProvider = await Request.Content.ReadAsMultipartAsync();
                //Json String of object  ipUploadDocument to be send at first or 0 index parameter   
                var json = await filesReadToProvider.Contents[0].ReadAsStringAsync();
                PatientInfo obj = JsonConvert.DeserializeObject<PatientInfo>(json);
                //Image to be send at second or 1 index parameter  
                byte[] fileBytes = await filesReadToProvider.Contents[1].ReadAsByteArrayAsync();
                string FileName = filesReadToProvider.Contents[1].Headers.ContentDisposition.FileName;
                string result = repositoryLab.Unit_InsertUpdateUnitWorking(obj);               
                if (fileBytes.Length > 10 && result.Contains("Success"))
                {
                    string ImageName = result.Split('|')[1]+obj.Prm2;
                    ss.Message = UploadClass.UploadCampaignDoc(out outFileName, out virtual_path, fileBytes, ImageName);                 
                }
                response = Request.CreateResponse(HttpStatusCode.OK, ss);
            }
            catch (Exception ex)
            {
                ss.Status = 0;
                ss.Message = ex.Message;
                response = Request.CreateResponse(HttpStatusCode.OK, ss);
            }
            return response;
        }
    }
}
