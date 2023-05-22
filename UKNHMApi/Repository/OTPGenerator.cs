using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UKNHMApi.Repository
{
	public static class OTPGenerator
	{
		//Example  
		//string[] saAllowedCharacters = { "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" };
		//string sRandomOTP = = GenerateRandomOTP(8, saAllowedCharacters);
		public static string GenerateRandomOTP(int iOTPLength)
		{
			string[] saAllowedCharacters = { "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" };
			string sOTP = String.Empty;
			string sTempChars = String.Empty;
			Random rand = new Random();
			for (int i = 0; i < iOTPLength; i++)
			{

				int p = rand.Next(0, saAllowedCharacters.Length);

				sTempChars = saAllowedCharacters[rand.Next(0, saAllowedCharacters.Length)];

				sOTP += sTempChars;

			}		
			return sOTP;
		}
	}
}