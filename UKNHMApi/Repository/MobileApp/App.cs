using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using UKNHMApi.Models;

namespace UKNHMApi.Repository.MobileApp
{
	public class App
	{
		public dataSet MobileApp_Queries(ipMobileApp objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pMobileApp_Queries", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@LabCode", SqlDbType.VarChar, 10).Value = objBO.LabCode;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 100).Value = objBO.VisitNo;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@from", SqlDbType.Date, 20).Value = objBO.from;
					cmd.Parameters.Add("@to", SqlDbType.Date, 20).Value = objBO.to;
					cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
					cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
					try
					{
						con.Open();
						DataSet ds = new DataSet();
						SqlDataAdapter da = new SqlDataAdapter(cmd);
						da.Fill(ds);
						dsObj.ResultSet = ds;
						dsObj.Msg = "Success";
						con.Close();
					}
					catch (SqlException sqlEx)
					{
						dsObj.ResultSet = null;
						dsObj.Msg = sqlEx.Message;
					}
					finally { con.Close(); }
					return dsObj;
				}
			}
		}
        public dataSet HR_Queries(HRQueries objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_ExHrd))
            {
                using (SqlCommand cmd = new SqlCommand("pHR_Queries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@unit_id", SqlDbType.VarChar, 10).Value = objBO.unit_id;
                    cmd.Parameters.Add("@comp_id", SqlDbType.VarChar, 10).Value = objBO.comp_id;
                    cmd.Parameters.Add("@logic", SqlDbType.VarChar, 50).Value = objBO.logic;
                    cmd.Parameters.Add("@prm_1", SqlDbType.VarChar, 20).Value = objBO.prm_1;
                    cmd.Parameters.Add("@prm_2", SqlDbType.VarChar, 20).Value = objBO.prm_2;
                    cmd.Parameters.Add("@prm_3", SqlDbType.VarChar, 20).Value = objBO.prm_3;
                    cmd.Parameters.Add("@loginid", SqlDbType.VarChar, 10).Value = objBO.loginid;
                    cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;                   
                    try
                    {
                        con.Open();
                        DataSet ds = new DataSet();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(ds);
                        dsObj.ResultSet = ds;
                        dsObj.Msg = "Success";
                        con.Close();
                    }
                    catch (SqlException sqlEx)
                    {
                        dsObj.ResultSet = null;
                        dsObj.Msg = sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return dsObj;
                }
            }
        }
        public string Register_Patient(PatientInfo objBO)
		{
			dataSet dsObj = new dataSet();
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pRegister_Patient", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@PatientType", SqlDbType.VarChar, 10).Value = objBO.PatientType;
					cmd.Parameters.Add("@PatientName", SqlDbType.VarChar, 150).Value = objBO.PatientName;
					cmd.Parameters.Add("@MobileNo", SqlDbType.VarChar, 150).Value = objBO.MobileNo;
					cmd.Parameters.Add("@age", SqlDbType.Int, 5).Value = objBO.age;
					cmd.Parameters.Add("@ageType", SqlDbType.VarChar, 10).Value = objBO.ageType;
					cmd.Parameters.Add("@gender", SqlDbType.VarChar, 10).Value = objBO.gender;
					cmd.Parameters.Add("@doctorId", SqlDbType.VarChar, 20).Value = objBO.doctorId;
					cmd.Parameters.Add("@doctorName", SqlDbType.VarChar, 100).Value = objBO.doctorName;
					cmd.Parameters.Add("@remark", SqlDbType.VarChar, 200).Value = objBO.remark;
					cmd.Parameters.Add("@TestCodes", SqlDbType.VarChar, 500).Value = objBO.TestCodes;
					cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
					cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
					cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
					cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
					try
					{
						con.Open();
						cmd.ExecuteNonQuery();
						processInfo = (string)cmd.Parameters["@result"].Value.ToString();
						con.Close();
						if (processInfo.Contains("Success"))
						{
							string VisitNo = processInfo.Split('|')[1];
							SmsClass sms = new SmsClass();
							string msg = "You are registered under NHM,Uttarakhand Free Diagnostic services, Download Report https://exprohelp.com/UKNHM//mobileApp/App/dpr?VisitNo=" + VisitNo + " :Chandan";
							string smsresponse = sms.SendSmsByTemplateId(objBO.MobileNo, msg, "1007672078453847720");
						}
					}
					catch (SqlException sqlEx)
					{
						processInfo = "Error Found   : " + sqlEx.Message;
					}
					finally { con.Close(); }
					return processInfo;
				}
			}
		}
        public string Ins_Att_Reg(AttendInfo objBO)
        {
            dataSet dsObj = new dataSet();
            string processInfo = string.Empty;
            using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_ExHrd))
            {
                using (SqlCommand cmd = new SqlCommand("p_Ins_Att_Reg", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@inp_date", SqlDbType.VarChar, 10).Value = objBO.inp_date;
                    cmd.Parameters.Add("@emp_code", SqlDbType.VarChar, 10).Value = objBO.emp_code;
                    cmd.Parameters.Add("@status", SqlDbType.VarChar, 10).Value = objBO.status;
                    cmd.Parameters.Add("@Mgrcode", SqlDbType.VarChar, 10).Value = objBO.Mgrcode;                                                    
                    cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
                    cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
                    try
                    {
                        con.Open();
                        cmd.ExecuteNonQuery();
                        processInfo = (string)cmd.Parameters["@result"].Value.ToString();
                        con.Close();                        
                    }
                    catch (SqlException sqlEx)
                    {
                        processInfo = "Error Found   : " + sqlEx.Message;
                    }
                    finally { con.Close(); }
                    return processInfo;
                }
            }
        }
        public string DiagnosticBookingReportByVisitNo(PatientInfo obj)
		{
			LISDBLayer objdb = new LISDBLayer();
			string str = "";

			//string id = Common.Decrypt(obj.TrnNo);
			string id = obj.VisitNo;
			dataSet result = new dataSet();

			result = objdb.DiagnosticBookingReportByVisitNo(id);
			if (result.ResultSet.Tables[0].Rows.Count > 0)
			{
				var visitList = result.ResultSet.Tables[0].AsEnumerable().Select(x => new { ReportPrintingName = x.Field<string>("ReportPrintingName"), Address = x.Field<string>("Address"), Mobile = x.Field<string>("Mobile"), Landline = x.Field<string>("Landline"), PatientName = x.Field<string>("PName"), LedgerTransactionNo = x.Field<string>("LedgerTransactionNo"), LedgerTransactionID = x.Field<int>("LedgerTransactionID"), entry_date = x.Field<string>("date") }).Distinct();
				try
				{
					foreach (var t in visitList)
					{
						str += "<div class='panel-group' style='margin:-11px;margin-top:10px'>";
						str += "<div class='panel panel-primary' >";
						string header = "<img src='/Content/img/NHM_logo.png' style='width: 100%'/><br/><h4>Address : " + t.Address + "</h4>";
						//header += "<br/><a href='http://www.chandan24x7.com/' class='btn btn-warning' role='button'>Download Chandan24x7 App</a>";
						string logo = "<img src='https://exprohelp.com/UKNHM/Content/img/NHM_logo.png' style='width: 100%'/>";
						str += "<div class='panel-heading' style='text-align:center'><h4 class='header'>Centre  : " + t.ReportPrintingName + "  <br/>Address : " + t.Address + "</h4></div>";
						str += "<div class='panel-body'>";
						str += "<table>";
						str += "<tr><td style='width:35%'>Visit No : </td><td style='width:65%'>" + t.LedgerTransactionNo + "</td> </tr>";
						str += "<tr><td style='width:35%'>Patient Name: </td><td style='width:65%'>" + t.PatientName + "</td> </tr>";
						str += "<tr><td style='width:35%'>Reg.Date : </td><td style='width:65%'>" + t.entry_date + "</td> </tr>";
						str += "</table>";
						str += "</div>";
						str += "</div>";
						str += "<div class='panel panel-info'>";
						str += "<div class='panel-heading' style='text-align:center'>Test Information</div>";

						//In Lab Report
						var visitItemListInLab = result.ResultSet.Tables[0].AsEnumerable().Where(y => y.Field<string>("LedgerTransactionNo") == t.LedgerTransactionNo)
						.Select(x => new
						{
							Test_ID = x.Field<int>("Test_ID"),
							TestName = x.Field<string>("TestName"),
							ReportStatus = x.Field<string>("ReportStatus"),
						});
						string Testids = string.Empty;
						foreach (var ti in visitItemListInLab)
						{
							if (ti.ReportStatus.Contains("Ready"))
								Testids = Testids + ti.Test_ID + ",";
						}
						str += "<div class='panel-body'>";

						str += "<div class='card-header'>";
						str += "<table style='width:100%'>";
						str += "<tr>";
						str += "<td style='width:60%'>Please Download</td>";
						if (Testids.Length > 5)
							str += "<td id='btnDownload' style='width:20%;text-align:center'><a name='" + t.LedgerTransactionNo + "' id='" + Testids + "' onclick='DownloadReport(this.name,this.id)' class='btn btn-info btn-sm'>Report<a/></td>";
						else
							str += "<td style='width:20%'></td>";

						str += "</tr>";
						str += "</table>";
						str += "</div>";
						str += "<div class='card-body' style='background: #ffffff;height:180px;overflow-y:scroll'>";
						str += "<table class='table-bordered tab-content' style='width:100%'>";
						foreach (var ti in visitItemListInLab)
						{
							str += "<tr>";
							str += "<td style='width:70%;font-size:13px'>" + ti.TestName + "</td>";
							str += "<td style='width:30%;font-size:13px;text-align:center'>" + ti.ReportStatus + "</td>";
							str += "</tr>";
						}
						str += "</table>";
						str += "</div>";
						str += "</div></div>";

						str += "</div>";
					}
				}
				catch (Exception ex) { str = ex.Message; }
			}
			else
			{
				string VisitNo = string.Empty;
				string Patient = string.Empty;
				string TestName = string.Empty;
				string MobileNo = string.Empty;
				string Centre = string.Empty;
				string Address = string.Empty;
				string cr_date = string.Empty;
				ipMobileApp objBO = new ipMobileApp();
				objBO.VisitNo = obj.VisitNo;
				objBO.Logic = "PatientReport:ByVisitNo";
				dataSet testList = MobileApp_Queries(objBO);
				try
				{
					foreach (DataRow dr in testList.ResultSet.Tables[0].Rows)
					{
						VisitNo = dr["VisitNo"].ToString();
						Patient = dr["PatientName"].ToString();
						TestName = dr["TestName"].ToString();
						MobileNo = dr["MobileNo"].ToString();
						Centre = "-";
						Address = "-";
						cr_date = dr["cr_date"].ToString();
					}
					str += "<div class='panel-group' style='margin:-11px;margin-top:10px'>";
					str += "<div class='panel panel-primary' >";
					str += "<div class='panel-heading' style='text-align:center'><img src='https://exprohelp.com/UKNHM/Content/img/NHM_logo.png' style='width: 100%;'/></div>";
					str += "<div class='panel-body'>";
					str += "<table>";
					str += "<tr><td style='width:35%'>Visit No : </td><td style='width:65%'>" + VisitNo + "</td> </tr>";
					str += "<tr><td style='width:35%'>Patient Name: </td><td style='width:65%'>" + Patient + "</td> </tr>";
					str += "<tr><td style='width:35%'>Reg.Date : </td><td style='width:65%'>" + cr_date + "</td> </tr>";
					str += "</table>";
					str += "</div>";
					str += "</div>";
					str += "<div class='panel panel-info'>";
					str += "<div class='panel-heading' style='text-align:center'>Test Information</div>";
					str += "<div class='panel-body'>";
					str += "<div class='card-body' style='background: #ffffff;height:180px;overflow-y:scroll'>";
					str += "<table class='table-bordered tab-content' style='width:100%'>";
					foreach (DataRow dr in testList.ResultSet.Tables[0].Rows)
					{
						str += "<tr>";
						str += "<td style='width:70%;font-size:13px'>" + dr["TestName"].ToString() + "</td>";
						str += "<td style='width:30%;font-size:13px;text-align:center'>" + dr["status"].ToString() + "</td>";
						str += "</tr>";
					}
					str += "</table>";
					str += "</div>";
					str += "</div></div>";
					str += "</div>";
				}
				catch (Exception ex) { str = ex.Message; }
			}

			return str;
		}
		public string Dispatch_ReceiveSample(SampleInfo objBO)
		{
			dataSet dsObj = new dataSet();
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pDispatch_ReceiveSample", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@DispatchNo", SqlDbType.VarChar, 30).Value = objBO.DispatchNo;
					cmd.Parameters.Add("@SampleNo", SqlDbType.VarChar, 30).Value = objBO.SampleNo;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 30).Value = objBO.VisitNo;
					cmd.Parameters.Add("@InputDate", SqlDbType.Date).Value = objBO.Prm1;
					cmd.Parameters.Add("@remark", SqlDbType.VarChar, 200).Value = objBO.remark;				
					cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = objBO.login_id;
					cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
					cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
					cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
					try
					{
						con.Open();
						cmd.ExecuteNonQuery();
						processInfo = (string)cmd.Parameters["@result"].Value.ToString();
						con.Close();						
					}
					catch (SqlException sqlEx)
					{
						processInfo = "Error Found   : " + sqlEx.Message;
					}
					finally { con.Close(); }
					return processInfo;
				}
			}
		}
	}
}