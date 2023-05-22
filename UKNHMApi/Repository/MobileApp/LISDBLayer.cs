using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Data.SqlClient;
using UKNHMApi.Models;
using UKNHMApi.Repository.ApplicationResources;
using UKNHMApi.Repository.Unit;

namespace UKNHMApi.Repository.MobileApp
{
    public class LISDBLayer
    {
        Lab repositoryLab = new Lab();
        Admin repositoryAdmin = new Admin();

        public dataSet CheckRegDATE(string TestIds)
        {
            string[] t = TestIds.Split(',');
            string qry = string.Empty;

            qry += " SELECT lt.Date,(CASE WHEN lt.Date > '2022-12-31' THEN 'CurrentDB' ELSE 'BackupDB' END ) DBType FROM f_ledgertransaction lt ";
            qry += " INNER JOIN patient_labinvestigation_opd plo ON plo.LedgerTransactionNo = lt.LedgerTransactionNo ";
            qry += " WHERE test_id = " + t[0] + "";
            return ExecuteDataset(qry);
        }

        public dataSet SampleReadingLog(EQASInfo objBO)
        {
            string qry = string.Empty;
            qry += " SELECT ItemName, lom.Name,VALUE,OldValue,L.`ResultDateTime`,l.`ResultEnterdByName` FROM PATIENT_LABinvestigation_OPD t ";
            qry += " INNER JOIN PATIENT_LABOBSERVATION_OPD_AUDITTRAIL l ON t.Test_ID = l.Test_ID ";
            qry += " INNER JOIN labObservation_Master lom ON lom.LabObservation_id = l.`LabObservation_ID` ";
            qry += " WHERE barcodeno = '" + objBO.BarcodeNo + "' ORDER BY ItemName,lom.Name ";
            return ExecuteDataset(qry);
        }
        public dataSet GetTestIds(ipUnit objBO)
        {
            string qry = string.Empty;
            qry += " SELECT Test_Id FROM  f_ledgertransaction lt  ";
            qry += " INNER JOIN Patient_labInvestigation_OPD pli ON lt.`LedgerTransactionID`= pli.`LedgerTransactionID` ";
            qry += " WHERE lt.LedgerTransactionNo='" + objBO.VisitNo + "' AND pli.`Approved`= 1 AND pli.`ReportType`= 1 AND lt.`IsCancel`= 0 ";
            return ExecuteDataset(qry);
        }
        public dataSet PatientInfoByBarcode(ipUnit objBO)
        {
            string qry = string.Empty;
            qry += " SELECT lt.LedgerTransactionNo,PName,Age,lt.Date Regdate, lt.`Gender` FROM f_ledgertransaction lt ";
            qry += " INNER JOIN Patient_labInvestigation_OPD pli ON lt.`LedgerTransactionID`= pli.`LedgerTransactionID`   ";
            qry += " WHERE pli.BarcodeNo = '" + objBO.Prm1 + "' group by lt.LedgerTransactionNo,PName,Age,lt.Date, lt.`Gender` ; ";

            //qry += " SELECT pli.Itemid_Interface,plo.LabObservation_ID,CONCAT(plo.LabObservationName, ':', SampleTypeName) LabObservationName,pli.BarcodeNo, ";
            //qry += " CAST(plo.`Value` AS DECIMAL(10, 2)) reading,plo.DisplayReading refRange, plo.MinValue,plo.MaxValue,pli.Approved ,IsCancel ";
            //qry += " Flag, ReadingFormat ";
            //qry += " FROM f_ledgertransaction lt ";
            //qry += " INNER JOIN Patient_labInvestigation_OPD pli ON lt.`LedgerTransactionID`= pli.`LedgerTransactionID` AND pli.`Approved`= 1 AND pli.`ReportType`= 1 AND lt.`IsCancel`= 0 ";
            //qry += " INNER JOIN centre_master cm ON cm.centreID = pli.CentreIDSession ";
            //qry += " INNER JOIN Patient_labObservation_OPD plo ON pli.`Test_ID`= plo.`Test_ID` ";
            //qry += " INNER JOIN patient_master pm ON pm.Patient_ID = lt.Patient_ID ";
            //qry += " INNER JOIN doctor_referal dr ON dr.Doctor_id = lt.Doctor_id ";
            //qry += " WHERE pli.BarcodeNo = '" + objBO.Prm1 + "' ";


            qry += " SELECT pli.Itemid_Interface,plo.LabObservation_ID,CONCAT(plo.LabObservationName, ':', SampleTypeName) LabObservationName,pli.BarcodeNo, ";
            qry += " CAST(plo.`Value` AS DECIMAL(10, 2)) reading,plo.DisplayReading refRange, plo.MinValue ,plo.MaxValue MAX_VALUE, pli.Approved ,IsCancel ";
            qry += " Flag, ReadingFormat ";
            qry += " FROM f_ledgertransaction lt ";
            qry += " INNER JOIN Patient_labInvestigation_OPD pli ON lt.`LedgerTransactionID`= pli.`LedgerTransactionID` AND pli.`Approved`= 1 AND pli.`ReportType`= 1 AND lt.`IsCancel`= 0 ";
            qry += " INNER JOIN centre_master cm ON cm.centreID = pli.CentreIDSession ";
            qry += " INNER JOIN Patient_labObservation_OPD plo ON pli.`Test_ID`= plo.`Test_ID`  ";
            qry += " INNER JOIN patient_master pm ON pm.Patient_ID = lt.Patient_ID ";
            qry += " INNER JOIN doctor_referal dr ON dr.Doctor_id = lt.Doctor_id ";
            qry += " WHERE pli.BarcodeNo = '" + objBO.Prm1 + "' ";
            qry += " UNION ";
            qry += " SELECT pli.Itemid_Interface,pli.Test_ID LabObservation_ID, CONCAT(pli.ItemName) LabObservationName,pli.BarcodeNo,  ";
            qry += " '' reading,'' DisplayReading,'' refRange,'' MinValue,'' AS MAX_VALUE, pli.Approved,IsCancel FROM f_ledgertransaction lt ";
            qry += " INNER JOIN Patient_labInvestigation_OPD pli ON lt.`LedgerTransactionID`= pli.`LedgerTransactionID` ";
            qry += " WHERE pli.BarcodeNo = '" + objBO.Prm1 + "' AND NOT EXISTS( ";
            qry += "  SELECT * FROM Patient_labObservation_OPD WHERE Test_ID = pli.Test_ID ";
            qry += "  ) ";



            return ExecuteDataset(qry);
        }
        public dataSet UKNHReport(ipUnit objBO)
        {
            string qry = string.Empty;
            qry += " call sp_UKNHReport ('" + objBO.from + "','" + objBO.to + "','" + objBO.Prm1 + "','" + objBO.Prm2 + "','" + objBO.Logic + "') ";
            return ExecuteDataset(qry);
        }
        public string ITDoseApproveVisitNos(ipUnit objBO)
        {

            string processInfo = string.Empty;
            string qry = string.Empty;
            qry += " SELECT pli.LedgerTransactionNo AS VisitNo,cm.CentreCode AS unit_id,cm1.CentreCode login_id, pli.TestCode testCode, ";
            qry += " pli.Test_Id ItDoseTestId, cm1.Centre AS ApprovedByLab,DATE_FORMAT(pli.ApprovedDate, '%Y-%m-%d %T.%f') ApprovedDate, ";
            qry += " pli.ApprovedName ApprovedBy, ItemID_Interface ";
            qry += " FROM patient_labinvestigation_opd pli ";
            qry += " INNER JOIN centre_master cm ON cm.CentreID = pli.TestCentreID ";
            qry += " INNER JOIN centre_master cm1 ON cm1.CentreID = pli.CentreIDSession ";
            qry += " AND pli.Approved = 1 ";
            qry += " AND pli.Test_ID IN(" + objBO.Prm1 + ") ";
            dataSet ds = ExecuteDataset(qry);
            TestApproveInfo obj = new TestApproveInfo();
            if (ds.ResultSet.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.ResultSet.Tables[0].Rows)
                {
                    obj.VisitNo = dr["VisitNo"].ToString();
                    obj.testCode = dr["testCode"].ToString();
                    obj.ItDoseTestId = dr["ItDoseTestId"].ToString();
                    obj.ApprovedDate = dr["ApprovedDate"].ToString();
                    obj.ApprovedBy = dr["ApprovedBy"].ToString();
                    obj.ApprovedBylab = dr["ApprovedByLab"].ToString();
                    obj.ItemID_Interface = dr["ItemID_Interface"].ToString();
                    obj.Logic = "ManualUpdate";
                }
            }
            return processInfo = repositoryLab.MarkTestApproved(obj);
        }
        public dataSet ITDoseRegistrationInfo(ipUnit objBO)
        {
            string qry = string.Empty;
            qry += " SELECT VisitNo, PNAME, Test_Id,ItemName, DATE_FORMAT(LogisticReceiveDate, '%d-%m-%Y %h:%i:%s %p') LogisticReceiveDate,DATE_FORMAT(ApprovedDate, '%d-%m-%Y %h:%i:%s %p') ApprovedDate,PerformingCentre, ";
            qry += " DATE_FORMAT(DeliveryDate, '%d-%m-%Y %h:%i:%s %p') DeliveryDate ,TAT,(CASE WHEN IFNULL(ApprovedDate, NOW())<= DeliveryDate THEN 'N' ELSE 'Y' END ) delay ";
            qry += " FROM( SELECT pli.LedgerTransactionNo AS VisitNo, patient_id, pli.Test_Id, ItemName, cm.Centre PerformingCentre, ";
            qry += " (SELECT MAX(LogisticReceiveDate) LogisticReceiveDate FROM sample_logistic WHERE testid = pli.Test_ID) LogisticReceiveDate, ";
            qry += " ApprovedDate,pli.DeliveryDate,TIMESTAMPDIFF(MINUTE, pli.DeliveryDate, IFNULL(ApprovedDate, NOW())) / 60  TAT ";
            qry += " FROM patient_labinvestigation_opd pli ";
            qry += " INNER JOIN centre_master cm1 ON cm1.CentreID = pli.CentreID ";
            qry += " LEFT OUTER JOIN centre_master cm ON cm.CentreID = pli.TestCentreID ";
            qry += " WHERE pli.LedgerTransactionNo IN(" + objBO.Prm1 + ") and pli.isRefund=0 ";
            qry += " ) X INNER JOIN patient_master pm ON pm.patient_id = x.patient_id  ORDER BY VisitNo; ";
            return ExecuteDataset(qry);
        }
        public dataSet ITDoseChandanBulkSync(ipUnit objBO)
        {
            string qry = string.Empty;
            qry += " SELECT pli.LedgerTransactionNo AS VisitNo,pli.TestCode testCode, DATE_FORMAT(pli.ApprovedDate, '%Y-%m-%d %T.%f') ApprovedDate,  ";
            qry += " pli.ApprovedName ApprovedBy, cm1.Centre AS ApprovedByLab,ItemID_Interface ";
            qry += " FROM patient_labinvestigation_opd pli ";
            qry += " INNER JOIN centre_master cm1 ON cm1.CentreID = pli.TestCentreID ";
            qry += " INNER JOIN centre_master cm ON cm.CentreID = pli.CentreID AND cm.IntegrationType = 'NHM-UK' ";
            qry += " WHERE pli.ApprovedDate BETWEEN '" + objBO.from + "' AND '" + objBO.to + "' ";
            dataSet ds = ExecuteDataset(qry);

            MasterInfo obj = new MasterInfo();
            obj.Logic = "BulkSyncTableErase";
            repositoryAdmin.InsertUpdatemaster(obj);
            using (SqlConnection con = new SqlConnection(GlobalConfig.ConStr_UKNHM))
            {

                using (SqlBulkCopy sbk = new SqlBulkCopy(con))
                {
                    sbk.DestinationTableName = "BulkSyncTable";
                    sbk.BulkCopyTimeout = 0;
                    if (ds.ResultSet.Tables[0].Rows.Count > 0)
                    {
                        con.Open();
                        sbk.WriteToServer(ds.ResultSet.Tables[0]);
                    }
                    sbk.Close();
                    con.Close();
                }
            }
            //Get Data
            objBO.Logic = "BulkSyncMismatchedRecord";
            return repositoryLab.Unit_VerificationQueries(objBO);
        }
        public string MarkITDoseSynced(MasterInfo obj)
        {
            string processInfo = string.Empty;
            string qry = string.Empty;
            qry += " SELECT LedgerTransactionNo FROM patient_labinvestigation_opd WHERE LedgerTransactionNo='" + obj.Prm1 + "' ";
            dataSet ds = ExecuteDataset(qry);
            if (ds.ResultSet.Tables.Count > 0)
            {
                if (ds.ResultSet.Tables[0].Rows.Count > 0)
                {
                    obj.Logic = "MarkITDoseSynced";
                    processInfo = repositoryAdmin.InsertUpdatemaster(obj);
                }
                else
                    processInfo = "Record Not Found in ITDose.";
            }
            return processInfo;
        }
        public dataSet DiagnosticBookingReportByVisitNo(string VisitNo)
        {
            string qry = string.Empty;
            qry += " SELECT cm.ReportPrintingName,cm.Address,cm.Mobile,cm.Landline,DATE_FORMAT(lt.Date,'%d-%m-%Y') Date,lt.LedgerTransactionNo,lt.LedgerTransactionID,pm.PName ,plo.Test_ID, ";
            qry += " im.Name TestName, IF(plo.Approved = 0, 'Pending', 'Ready') ReportStatus FROM f_ledgertransaction lt ";
            qry += " INNER JOIN patient_labinvestigation_opd plo ON plo.LedgerTransactionNo = lt.LedgerTransactionNo ";
            qry += " INNER JOIN investigation_master im ON im.Investigation_Id = plo.Investigation_ID and im.Reporting=1 ";
            qry += " INNER JOIN patient_master pm ON pm.Patient_ID = plo.Patient_ID ";
            qry += " INNER JOIN centre_master cm ON cm.Centreid = lt.Centreid  ";
            qry += " INNER JOIN doctor_referal dr ON dr.Doctor_id = lt.Doctor_id ";
            qry += " WHERE lt.IsCancel = 0 AND plo.IsRefund=0 AND lt.LedgerTransactionNo = '" + VisitNo + "'";
            qry += " ORDER BY lt.Date DESC ";
            return ExecuteDataset(qry);
        }

        public string ExecuteScalar(string qry)
        {
            string processInfo = string.Empty;
            MySqlConnection con = new MySqlConnection(GlobalConfig.ConStr_LISByItDose);
            MySqlCommand cmd = new MySqlCommand(qry, con);
            cmd.CommandType = CommandType.Text;
            cmd.CommandTimeout = 2500;
            try
            {
                con.Open();
                if (cmd.ExecuteNonQuery() > 0)
                {
                    processInfo = "Successfully Saved";
                }
                else
                {
                    processInfo = "Not Saved";
                }
            }
            catch (MySqlException MySqlEx)
            {
                if (!MySqlEx.ToString().Contains("Violation of PRIMARY KEY"))
                    processInfo = "Error Found   : " + MySqlEx.Message;
                else
                    processInfo = " ";
            }
            finally { con.Close(); }
            return processInfo;
        }
        public dataSet ExecuteDataset(string commandText)
        {
            MySqlConnection con = new MySqlConnection(GlobalConfig.ConStr_LISByItDose);
            dataSet dsObj = new dataSet();
            DataSet ds = new DataSet();
            MySqlCommand cmd = new MySqlCommand(commandText, con);
            cmd.CommandType = CommandType.Text;
            cmd.CommandTimeout = 2500;
            try
            {                
                MySqlDataAdapter da = new MySqlDataAdapter(cmd);
                da.Fill(ds);
                dsObj.ResultSet = ds;
                dsObj.Msg = "Success";
            }
            catch (Exception ex)
            {
                dsObj.ResultSet = null;
                dsObj.Msg = ex.Message;
            }            
            return dsObj;
        }
    }
}