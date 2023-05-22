using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using UKNHMApi.Models;

namespace UKNHMApi.Repository.Unit
{
	public class Lab
	{
		UKNHMApi.LISProxy.SaleService ItdoseProxy = new LISProxy.SaleService();        
		public dataSet Unit_VerificationQueries(ipUnit objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pUnit_VerificationQueries", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@LabCode", SqlDbType.VarChar, 10).Value = objBO.LabCode;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 100).Value = objBO.VisitNo;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 50).Value = objBO.Prm2;
					cmd.Parameters.Add("@from", SqlDbType.DateTime, 30).Value = Convert.ToDateTime(objBO.from);
					cmd.Parameters.Add("@to", SqlDbType.DateTime, 30).Value = Convert.ToDateTime(objBO.to);
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
		public string Unit_InsertUpdateVerification(List<PatientDetails> objBO)
		{

	    	string VisitNo = string.Empty;
			string PatientName = string.Empty;
			string Gender = string.Empty;
			string Prm1 = string.Empty;
			string Logic = string.Empty;
			int Age = 0;
			string AgeType = string.Empty;
			string DoctorId = string.Empty;
			string processInfo = string.Empty;
			string login_id = string.Empty;
			string hosp_id = string.Empty;
			if (objBO.Count > 0)
			{
				DataTable dt = new DataTable();
				dt.Columns.Add("VisitNo", typeof(string));
				dt.Columns.Add("TestCode", typeof(string));
				dt.Columns.Add("Amount", typeof(decimal));
				dt.Columns.Add("IsCancelled", typeof(int));
				dt.Columns.Add("CancelRemark", typeof(string));
				foreach (PatientDetails obj in objBO)
				{
					VisitNo = obj.VisitNo;
					PatientName = obj.PatientName;
					Prm1 = obj.Prm1;
					Gender = obj.Gender;
					Logic = obj.Logic;
					Age = obj.Age;
					AgeType = obj.AgeType;
					DoctorId = obj.DoctorId;
					hosp_id = obj.hosp_id;
					login_id = obj.login_id;
					if (obj.IsCancelled > -1)
					{
						DataRow dr = dt.NewRow();
						dr["VisitNo"] = obj.VisitNo;
						dr["TestCode"] = obj.TestCode;
						dr["Amount"] = obj.Amount;
						dr["IsCancelled"] = obj.IsCancelled;
						dr["CancelRemark"] = obj.CancelRemark;
						dt.Rows.Add(dr);
					}
				}
			

				using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
				{
					using (SqlCommand cmd = new SqlCommand("pUnit_VerifyAndCancel", con))
					{
						cmd.CommandType = CommandType.StoredProcedure;
						cmd.CommandTimeout = 2500;
						cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 50).Value = VisitNo;
						cmd.Parameters.Add("@PatientName", SqlDbType.VarChar, 100).Value = PatientName;
						cmd.Parameters.Add("@Gender", SqlDbType.VarChar, 10).Value = Gender;
						cmd.Parameters.Add("@Age", SqlDbType.Int, 3).Value = Age;
						cmd.Parameters.Add("@AgeType", SqlDbType.VarChar, 10).Value = AgeType;
						cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 10).Value = Prm1;
						cmd.Parameters.Add("@DoctorId", SqlDbType.VarChar, 10).Value = DoctorId;
						cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 10).Value = login_id;
						cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = Logic;
						cmd.Parameters.AddWithValue("udt_TestInfo", dt);
						cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
						cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
						try
						{
							con.Open();
							cmd.ExecuteNonQuery();
							processInfo = (string)cmd.Parameters["@result"].Value.ToString();
							con.Close();

							if (Logic == "UpdateOrCancel")
							{
								// Cancelling Test in ITDOSE 
								ipUnit obj1 = new ipUnit();
								obj1.VisitNo = VisitNo;
								obj1.from = "1900/01/01";
								obj1.to = "1900/01/01";
								obj1.Logic = "CancelTestInfo";
								dataSet ds = Unit_VerificationQueries(obj1);
								if (ds.ResultSet.Tables.Count > 0 && ds.ResultSet.Tables[0].Rows.Count > 0)
								{
									foreach (DataRow dr in ds.ResultSet.Tables[0].Rows)
									{
										try
										{
											ItdoseProxy.UPHealth_CancelTest(dr["VisitNo"].ToString(), dr["testCode"].ToString());
										}
										catch (Exception ex) { string test = ex.Message; }
									}
								}
							}


						}
						catch (SqlException sqlEx)
						{
							processInfo = "Error Found   : " + sqlEx.Message;
						}
						finally { con.Close(); }
					}
				}
			}
			return processInfo;
		}
		public string Unit_InsertUpdateUnitWorking(PatientInfo objBO)
		{
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pUnit_InsertUpdateUnitWorking", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 20).Value = objBO.VisitNo;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 5).Value = objBO.CentreId;
					cmd.Parameters.Add("@doc_name", SqlDbType.VarChar, 30).Value = objBO.doc_name;
					cmd.Parameters.Add("@barcodeNo", SqlDbType.VarChar, 30).Value = objBO.barcodeNo;
					cmd.Parameters.Add("@doc_location", SqlDbType.VarChar, 200).Value = objBO.doc_location;
					cmd.Parameters.Add("@fSize", SqlDbType.BigInt).Value = objBO.fSize;
					cmd.Parameters.Add("@Remark", SqlDbType.VarChar, 200).Value = objBO.Remark;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 50).Value = objBO.Prm2;
					cmd.Parameters.Add("@from", SqlDbType.DateTime, 30).Value = objBO.from;
					cmd.Parameters.Add("@to", SqlDbType.DateTime, 30).Value = objBO.to;
					cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 20).Value = objBO.login_id;
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
		public string Insert_ScanedDocument(PatientInfo objBO)
		{
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pInsert_ScanedDocument", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@centreId", SqlDbType.VarChar, 5).Value = objBO.CentreId;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 25).Value = objBO.VisitNo;
					cmd.Parameters.Add("@barcodeNo", SqlDbType.VarChar, 30).Value = objBO.barcodeNo;
					cmd.Parameters.Add("@doc_name", SqlDbType.VarChar, 30).Value = objBO.doc_name;
					cmd.Parameters.Add("@doc_location", SqlDbType.VarChar, 200).Value = objBO.doc_location;
					cmd.Parameters.Add("@ServerUrl", SqlDbType.VarChar, 100).Value = objBO.ServerUrl;
					cmd.Parameters.Add("@f_size", SqlDbType.BigInt).Value = objBO.fSize;
					cmd.Parameters.Add("@emp_code", SqlDbType.VarChar, 20).Value = objBO.login_id;
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
		public string MarkTestApproved(TestApproveInfo objBO)
		{
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pMarkTestApproved", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 20).Value = objBO.VisitNo;
					cmd.Parameters.Add("@testCode", SqlDbType.VarChar, 20).Value = objBO.testCode;
					cmd.Parameters.Add("@ItDoseTestId", SqlDbType.VarChar, 20).Value = objBO.ItDoseTestId;
					cmd.Parameters.Add("@ApprovedDate", SqlDbType.DateTime).Value = objBO.ApprovedDate;
					cmd.Parameters.Add("@ApprovedBy", SqlDbType.VarChar, 200).Value = objBO.ApprovedBy;
					cmd.Parameters.Add("@ApprovedBylab", SqlDbType.VarChar, 20).Value = objBO.ApprovedBylab;
					cmd.Parameters.Add("@ItemID_Interface", SqlDbType.VarChar, 20).Value = objBO.ItemID_Interface;
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