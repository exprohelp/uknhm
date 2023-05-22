using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using UKNHMApi.Models;
using UKNHMApi.Repository.MobileApp;
using UKNHMApi.Repository.Report;
using UKNHMApi.Repository.Utility;

namespace UKNHMApi.Controllers
{
    [RoutePrefix("api/Report")]
    public class ReportController : ApiController
    {
        private Report repositoryReport = new Report();
        private LISDBLayer repositoryLisDBLayer = new LISDBLayer();

        [HttpPost]
        [Route("MIS_SaleAnalysisQueries")]
        public HttpResponseMessage MIS_SaleAnalysisQueries([FromBody] ipReport objBO)
        {
            if (objBO.ReportType == "XL")
            {
                dataSet ds = repositoryReport.MIS_SaleAnalysisQueries(objBO);
                UKNHMApi.Repository.ExcelGenerator obj = new Repository.ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repositoryReport.MIS_SaleAnalysisQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }
        }
        [HttpPost]
        [Route("SampleReadingLog")]
        public HttpResponseMessage SampleReadingLog([FromBody] EQASInfo objBO)
        {
            dataSet ds = repositoryLisDBLayer.SampleReadingLog(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
        [HttpPost]
        [Route("GetTestIds")]
        public HttpResponseMessage GetTestIds([FromBody] ipUnit objBO)
        {
            dataSet ds = repositoryLisDBLayer.GetTestIds(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
        [HttpPost]
        [Route("PatientInfoByBarcode")]
        public HttpResponseMessage PatientInfoByBarcode([FromBody] ipUnit objBO)
        {
            dataSet ds = repositoryLisDBLayer.PatientInfoByBarcode(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
        [HttpPost]
        [Route("MasterQueries")]
        public HttpResponseMessage MasterQueries([FromBody] ipReport objBO)
        {
            dataSet ds = repositoryReport.MasterQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
        [HttpPost]
        [Route("MIS_ReportQueries")]
        public HttpResponseMessage MIS_ReportQueries([FromBody] ipReport objBO)
        {
            if (objBO.ReportType == "XL")
            {
                dataSet ds = repositoryReport.MIS_ReportQueries(objBO);
                UKNHMApi.Repository.ExcelGenerator obj = new Repository.ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repositoryReport.MIS_ReportQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }           
        }
        [HttpPost]
        [Route("pMIS_FinCommisionQueries")]
        public HttpResponseMessage pMIS_FinCommisionQueries([FromBody] ipReport objBO)
        {
            dataSet ds = repositoryReport.MIS_FinCommisionQueries(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, ds);
        }
        [HttpPost]
        [Route("ChandanMIS_ReportQueries2")]
        public HttpResponseMessage ChandanMIS_ReportQueries2([FromBody] ipReport objBO)
        {
            if (objBO.ReportType == "XL")
            {
                dataSet ds = repositoryReport.ChandanMIS_ReportQueries2(objBO);
                UKNHMApi.Repository.ExcelGenerator obj = new Repository.ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repositoryReport.ChandanMIS_ReportQueries2(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }
        }
        [HttpPost]
        [Route("ChandanMIS_ReportQueries")]
        public HttpResponseMessage ChandanMIS_ReportQueries([FromBody] ipReport objBO)
        {
            if (objBO.ReportType == "XL")
            {
                dataSet ds = repositoryReport.ChandanMIS_ReportQueries(objBO);
                UKNHMApi.Repository.ExcelGenerator obj = new Repository.ExcelGenerator();
                return obj.GetExcelFile(ds.ResultSet);
            }
            else
            {
                dataSet ds = repositoryReport.ChandanMIS_ReportQueries(objBO);
                return Request.CreateResponse(HttpStatusCode.OK, ds);
            }
        }
        [HttpPost]
        [Route("MIS_InsertUpdateReports")]
        public HttpResponseMessage MIS_InsertUpdateReports([FromBody] ipReport objBO)
        {
            string result = repositoryReport.MIS_InsertUpdateReports(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("EQAS_InsertUpdateEQASInfo")]
        public HttpResponseMessage EQAS_InsertEQASInfo([FromBody] EQASInfo objBO)
        {
            string result = repositoryReport.EQAS_InsertEQASInfo(objBO);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
        [HttpPost]
        [Route("EQAS_UpdateAwaitedReportPath")]
        public async Task<HttpResponseMessage> EQAS_UpdateAwaitedReportPath()
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
                EQASInfo obj = JsonConvert.DeserializeObject<EQASInfo>(json);
                //Image to be send at second or 1 index parameter  
                byte[] fileBytes = await filesReadToProvider.Contents[1].ReadAsByteArrayAsync();
                string FileName = filesReadToProvider.Contents[1].Headers.ContentDisposition.FileName;
                obj.ImageName = obj.VisitNo;
                if (fileBytes.Length > 10)
                {
                    obj.OutLab_ReportPath = FileName.Substring((FileName.Length) - 5).Replace("\"", "");
                    obj.ImageName = obj.ImageName + FileName.Substring((FileName.Length) - 5).Replace("\"", "");
                    ss.Message = UploadClass.UploadEQASReport(out outFileName, out virtual_path, fileBytes, obj.ImageName);
                    response = Request.CreateResponse(HttpStatusCode.OK, ss);
                    obj.OutLab_ReportPath = virtual_path;
                    obj.Logic = "UpdateReportPath";
                    ss.Message = repositoryReport.EQAS_InsertEQASInfo(obj);
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
        [HttpPost]
        [Route("EQAS_InsertEQASInfo")]
        public async Task<HttpResponseMessage> EQAS_InsertEQASInfo()
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
                EQASInfo obj = JsonConvert.DeserializeObject<EQASInfo>(json);
                //Image to be send at second or 1 index parameter  
                byte[] fileBytes = await filesReadToProvider.Contents[1].ReadAsByteArrayAsync();
                string FileName = filesReadToProvider.Contents[1].Headers.ContentDisposition.FileName;
                ss.Message = repositoryReport.EQAS_InsertEQASInfo(obj);
                if (ss.Message.Contains("Success"))
                {
                    if (fileBytes.Length > 10)
                    {
                        obj.ImageName = ss.Message.Split('|')[1];
                        obj.OutLab_ReportPath = FileName.Substring((FileName.Length) - 5).Replace("\"", "");
                        obj.ImageName = obj.ImageName + FileName.Substring((FileName.Length) - 5).Replace("\"", "");
                        ss.Message = UploadClass.UploadEQASReport(out outFileName, out virtual_path, fileBytes, obj.ImageName);
                        response = Request.CreateResponse(HttpStatusCode.OK, ss);
                        obj.OutLab_ReportPath = virtual_path;
                        obj.Logic = "UpdateReportPath";
                        ss.Message = repositoryReport.EQAS_InsertEQASInfo(obj);
                    }
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
        [HttpPost]
        [Route("UpdateReportPath")]
        public async Task<HttpResponseMessage> UpdateReportPath()
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
                EQASInfo obj = JsonConvert.DeserializeObject<EQASInfo>(json);
                //Image to be send at second or 1 index parameter  
                byte[] fileBytes = await filesReadToProvider.Contents[1].ReadAsByteArrayAsync();
                string FileName = filesReadToProvider.Contents[1].Headers.ContentDisposition.FileName;
                if (fileBytes.Length > 10)
                {
                    obj.OutLab_ReportPath = FileName.Substring((FileName.Length) - 5).Replace("\"", "");
                    obj.ImageName = obj.ImageName + FileName.Substring((FileName.Length) - 5).Replace("\"", "");
                    ss.Message = UploadClass.UploadEQASReport(out outFileName, out virtual_path, fileBytes, obj.ImageName);
                    response = Request.CreateResponse(HttpStatusCode.OK, ss);
                    obj.OutLab_ReportPath = virtual_path;
                    repositoryReport.EQAS_InsertEQASInfo(obj);
                    ss.Message = ss.Message +"|"+ virtual_path;
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
