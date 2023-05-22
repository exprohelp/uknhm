using System.Data;
using System.Data.SqlClient;
using UKNHMApi.Models;

namespace UKNHMApi.Repository.ApplicationResources
{
	public class Admin
	{
		public dataSet Authenticate_LoginInfo(Authenticate objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pAuthenticate_LoginInfo", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@UserType", SqlDbType.VarChar, 10).Value = objBO.UserType;
					cmd.Parameters.Add("@UserId", SqlDbType.VarChar, 20).Value = objBO.UserId;
					cmd.Parameters.Add("@Password", SqlDbType.VarChar, 20).Value = objBO.Password;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@Logic", SqlDbType.VarChar, 50).Value = objBO.Logic;
					cmd.Parameters.Add("@result", SqlDbType.VarChar, 50).Value = "";
					cmd.Parameters["@result"].Direction = ParameterDirection.InputOutput;
					try
					{
						con.Open();
						DataSet ds = new DataSet();
						SqlDataAdapter da = new SqlDataAdapter(cmd);
						da.Fill(ds);
						dsObj.ResultSet = ds;
						dsObj.Msg = (string)cmd.Parameters["@result"].Value.ToString();
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
		public dataSet MasterQueries(ipAdmin objBO)
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
		public string InsertUpdatemaster(MasterInfo objBO)
		{
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pm_InsertUpdatemaster", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@UserType", SqlDbType.VarChar, 20).Value = objBO.UserType;
					cmd.Parameters.Add("@UserId", SqlDbType.VarChar, 20).Value = objBO.UserId;
					cmd.Parameters.Add("@UserName", SqlDbType.VarChar, 100).Value = objBO.UserName;
					cmd.Parameters.Add("@Pwd", SqlDbType.VarChar, 100).Value = objBO.Pwd;
					cmd.Parameters.Add("@DoctorId", SqlDbType.VarChar, 20).Value = objBO.DoctorId;
					cmd.Parameters.Add("@DoctorName", SqlDbType.VarChar, 100).Value = objBO.DoctorName;
					cmd.Parameters.Add("@Degree", SqlDbType.VarChar, 100).Value = objBO.Degree;
					cmd.Parameters.Add("@Specialization", SqlDbType.VarChar, 100).Value = objBO.Specialization;
					cmd.Parameters.Add("@CenterId", SqlDbType.VarChar, 20).Value = objBO.CenterId;
					cmd.Parameters.Add("@MobileNo", SqlDbType.VarChar, 10).Value = objBO.MobileNo;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar).Value = objBO.Prm1;
					cmd.Parameters.Add("@Prm2", SqlDbType.VarChar, 100).Value = objBO.Prm2;
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
	}
}