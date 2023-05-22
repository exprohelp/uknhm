using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;
using UKNHMApi.Models;

namespace UKNHM.App_Start
{
    public class PreventDirectCallAttribute : System.Web.Mvc.ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Request.RawUrl.Contains(filterContext.ActionDescriptor.ActionName))
            {
                throw new HttpException(404, "HTTP/1.1 404 Not Found");
            }

            base.OnActionExecuting(filterContext);
        }
    }
    public class APIProxy
	{
		public static string Baseurl = ConfigurationManager.AppSettings["APIHostPath"].ToString();
		public static dataSet CallWebApiMethod(string methodRoute, Object obj)
		{
			dataSet ds = new dataSet();
			using (var client = new HttpClient())
			{
				try
				{
					client.BaseAddress = new Uri(Baseurl);
					HttpResponseMessage response = client.PostAsJsonAsync("api/" + methodRoute + "", obj).Result;
					if (response.IsSuccessStatusCode)
					{
						string response_data = response.Content.ReadAsStringAsync().Result;
						ds = JsonConvert.DeserializeObject<dataSet>(response_data, new JsonSerializerSettings
						{
							NullValueHandling = NullValueHandling.Ignore,
							MissingMemberHandling = MissingMemberHandling.Ignore,
							Formatting = Formatting.None,
							DateFormatHandling = DateFormatHandling.IsoDateFormat,
							FloatParseHandling = FloatParseHandling.Decimal
						});
					}
				}
				catch (Exception ex) { ds.ResultSet = null; ds.Msg = ex.Message; }
			}
			return ds;
		}

	}
}