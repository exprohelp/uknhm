using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using UKNHMApi.Models;

namespace UKNHMApi.Repository.Report
{
	public class Report
	{
        public dataSet MIS_SaleAnalysisQueries(ipReport objBO)
        {
            dataSet dsObj = new dataSet();
            using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
            {
                using (SqlCommand cmd = new SqlCommand("pMIS_SaleAnalysisQueries", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 2500;
                    cmd.Parameters.Add("@DistrictName", SqlDbType.VarChar, 100).Value = objBO.DistrictName;
                    cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
                    cmd.Parameters.Add("@from", SqlDbType.Date).Value = objBO.from;
                    cmd.Parameters.Add("@to", SqlDbType.Date).Value = objBO.to;
                    cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
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
        public dataSet MasterQueries(ipReport objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pMasterQueries", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 100).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 100).Value = objBO.Prm2;					
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
		public dataSet MIS_ReportQueries(ipReport objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pMIS_ReportQueries", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@DistrictName", SqlDbType.VarChar, 100).Value = objBO.DistrictName;
					cmd.Parameters.Add("@CentreType", SqlDbType.VarChar, 100).Value = objBO.CentreType;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 100).Value = objBO.VisitNo;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 50).Value = objBO.Prm2;
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
		public dataSet MIS_FinCommisionQueries(ipReport objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pMIS_FinCommisionQueries", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@DistrictName", SqlDbType.VarChar, 100).Value = objBO.DistrictName;
					cmd.Parameters.Add("@CentreType", SqlDbType.VarChar, 100).Value = objBO.CentreType;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 100).Value = objBO.VisitNo;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 50).Value = objBO.Prm2;
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
		public dataSet ChandanMIS_ReportQueries2(ipReport objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pMIS_ReportQueries2", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@DistrictName", SqlDbType.VarChar, 100).Value = objBO.DistrictName;
					cmd.Parameters.Add("@CentreType", SqlDbType.VarChar, 100).Value = objBO.CentreType;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 100).Value = objBO.VisitNo;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 50).Value = objBO.Prm2;
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
		public dataSet ChandanMIS_ReportQueries(ipReport objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pChandanMIS_ReportQueries", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@DistrictName", SqlDbType.VarChar, 100).Value = objBO.DistrictName;
					cmd.Parameters.Add("@CentreType", SqlDbType.VarChar, 100).Value = objBO.CentreType;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 100).Value = objBO.VisitNo;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 50).Value = objBO.Prm2;
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
		public string MIS_InsertUpdateReports(ipReport objBO)
		{			
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pMIS_InsertUpdateReports", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 30).Value = objBO.VisitNo;
					cmd.Parameters.Add("@MobileNo", SqlDbType.VarChar, 10).Value = objBO.MobileNo;
					cmd.Parameters.Add("@remark", SqlDbType.VarChar, 200).Value = objBO.remark;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar).Value = objBO.Prm2;
					cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 30).Value = objBO.login_id;
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
		public string EQAS_InsertEQASInfo(EQASInfo objBO)
		{
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pEQAS_InsertEQASInfo", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@VisitNo", SqlDbType.VarChar, 20).Value = objBO.VisitNo;
					cmd.Parameters.Add("@BarcodeNo", SqlDbType.VarChar, 20).Value = objBO.BarcodeNo;
					cmd.Parameters.Add("@testCode", SqlDbType.VarChar, 50).Value = objBO.testCode;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar).Value = objBO.Prm2;
					cmd.Parameters.Add("@Prm3", SqlDbType.VarChar).Value = objBO.Prm3;
					cmd.Parameters.Add("@ObservationId", SqlDbType.VarChar,50).Value = objBO.ObservationId;
					cmd.Parameters.Add("@ObservationName", SqlDbType.VarChar,250).Value = objBO.ObservationName;
					cmd.Parameters.Add("@chandan_reading", SqlDbType.VarChar,200).Value = objBO.chandan_reading;
					cmd.Parameters.Add("@chandan_RefRange", SqlDbType.VarChar,100).Value = objBO.chandan_RefRange;
					cmd.Parameters.Add("@chandan_unit", SqlDbType.VarChar,50).Value = objBO.chandan_unit;
					cmd.Parameters.Add("@OutLabName", SqlDbType.VarChar,100).Value = objBO.OutLabName;
					cmd.Parameters.Add("@OutLab_reading", SqlDbType.VarChar,250).Value = objBO.OutLab_reading;
					cmd.Parameters.Add("@OutLab_RefRange", SqlDbType.VarChar,100).Value = objBO.OutLab_RefRange;
					cmd.Parameters.Add("@OutLab_unit", SqlDbType.VarChar,100).Value = objBO.OutLab_unit;
					cmd.Parameters.Add("@OutLab_ReportPath", SqlDbType.VarChar,250).Value = objBO.OutLab_ReportPath;
					cmd.Parameters.Add("@read_Status", SqlDbType.VarChar,20).Value = objBO.read_Status;
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