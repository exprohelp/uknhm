using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using ZXing;

namespace UKNHM.Repository
{
	public class GenerateQRCode
	{
		public static string GenerateMyQCCode(string QCText)
		{
			var QCwriter = new BarcodeWriter();
			QCwriter.Format = BarcodeFormat.QR_CODE;
			var result = QCwriter.Write(QCText);
			string path = HttpContext.Current.Server.MapPath(@"~/Content/img/QRCode.png");		
			var barcodeBitmap = new Bitmap(result);

			using (MemoryStream memory = new MemoryStream())
			{
				using (FileStream fs = new FileStream(path,FileMode.Create, FileAccess.ReadWrite))
				{
					barcodeBitmap.Save(memory, ImageFormat.Jpeg);
					byte[] bytes = memory.ToArray();
					fs.Write(bytes, 0, bytes.Length);
				}
			}
			return path;			
		}
	}
}