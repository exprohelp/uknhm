using System.Web.Mvc;

namespace UKNHM.Areas.ApplicationResource
{
    public class ApplicationResourceAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "ApplicationResource";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "ApplicationResource_default",
                "ApplicationResource/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}