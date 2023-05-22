using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace UKNHMApi.Repository
{
    public class GlobalConfig
    {      
    
        public static string ConStr_UKNHM = ConfigurationManager.ConnectionStrings["ConStr_UKNHM"].ToString();
        public static string ConStr_ExHrd = ConfigurationManager.ConnectionStrings["ConStr_ExHrd"].ToString();
		public static string ConStr_LISByItDose = ConfigurationManager.ConnectionStrings["ConStr_LISByItDose"].ToString();
	}
}