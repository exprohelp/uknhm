using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using UKNHMApi.Models;

namespace UKNHMApi.Repository.Invoice
{
	public class Invoice
	{
		public dataSet Invoice_Queries(ipInvoice objBO)
		{
			dataSet dsObj = new dataSet();
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pInvoice_Queries", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@InvoiceNo", SqlDbType.VarChar, 28).Value = objBO.InvoiceNo;
					cmd.Parameters.Add("@ReceiptNo", SqlDbType.VarChar, 50).Value = objBO.ReceiptNo;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar, 50).Value = objBO.Prm1;
					cmd.Parameters.Add("@from", SqlDbType.VarChar, 20).Value = objBO.from;
					cmd.Parameters.Add("@to", SqlDbType.VarChar, 20).Value = objBO.to;
					cmd.Parameters.Add("@login_id", SqlDbType.VarChar, 50).Value = objBO.login_id;
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
		public string Invoice_ReceivedPayInfo(ReceivedPayInfo objBO)
		{
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pInvoice_ReceivedPayInfo", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;
					cmd.Parameters.Add("@InvoiceNo", SqlDbType.VarChar).Value = objBO.InvoiceNo;
					cmd.Parameters.Add("@ReceiptNo", SqlDbType.VarChar, 28).Value = objBO.ReceiptNo;
					cmd.Parameters.Add("@PayMode", SqlDbType.VarChar, 30).Value = objBO.PayMode;
					cmd.Parameters.Add("@Amount", SqlDbType.Decimal, 30).Value = objBO.Amount;
					cmd.Parameters.Add("@TDSAmount", SqlDbType.Decimal, 30).Value = objBO.TDSAmount;
					cmd.Parameters.Add("@AccountNo", SqlDbType.VarChar, 30).Value = objBO.AccountNo;
					cmd.Parameters.Add("@BankName", SqlDbType.VarChar,100).Value = objBO.BankName;
					cmd.Parameters.Add("@ChequeDate", SqlDbType.Date, 20).Value = objBO.ChequeDate;
					cmd.Parameters.Add("@RefNo", SqlDbType.VarChar, 50).Value = objBO.RefNo;
					cmd.Parameters.Add("@Remark", SqlDbType.VarChar,50).Value = objBO.Remark;
					cmd.Parameters.Add("@Prm1", SqlDbType.VarChar).Value = objBO.Prm1;
					cmd.Parameters.Add("@FilePath", SqlDbType.VarChar, 100).Value = objBO.FilePath;
					cmd.Parameters.Add("@login_id", SqlDbType.VarChar,10).Value = objBO.login_id;
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
		public string GenerateInvoiceofMonth(ReceivedPayInfo objBO)
		{
			string processInfo = string.Empty;
			using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
			{
				using (SqlCommand cmd = new SqlCommand("pGenerateInvoiceofMonth", con))
				{
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.CommandTimeout = 2500;
					cmd.Parameters.Add("@CentreId", SqlDbType.VarChar, 10).Value = objBO.CentreId;				
					cmd.Parameters.Add("@MonthDate", SqlDbType.Date, 20).Value = objBO.MonthDate;					
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