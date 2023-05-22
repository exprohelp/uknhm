function SampleReadingLog() {
	$("#tblSampleReading tbody").empty();	
	var url = config.baseUrl + "/api/Report/SampleReadingLog";
	var objBO = {};
	objBO.BarcodeNo = $('#txtBarcodeNo').text();
	$.ajax({
		method: "POST",
		url: url,
		data: JSON.stringify(objBO),
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		success: function (data) {
			console.log(data)
			if (data.ResultSet.Table.length > 0) {			
				var tbody = '';				
				var temp = '';				
				$.each(data.ResultSet.Table, function (key, val) {		
					if (temp != val.ItemName) {
						tbody += "<tr style='background:#ddd'>";
						tbody += "<td colspan='5'>" + val.ItemName + "</td>";
						tbody += "</tr>";
						temp = val.ItemName;
					}
					tbody += "<tr>";				
					tbody += "<td>" + val.Name + "</td>";
					tbody += "<td>" + val.VALUE + "</td>";					
					tbody += "<td>" + val.OldValue + "</td>";
					tbody += "<td>" + val.ResultDateTime + "</td>";
					tbody += "<td>" + val.ResultEnterdByName + "</td>";
					tbody += "</tr>";
				});
				$("#tblSampleReading tbody").append(tbody);	
			}
		},
		error: function (response) {
			alert('Server Error...!');
		}
	});
}