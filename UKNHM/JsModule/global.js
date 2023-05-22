var config = {
	//local Port
	baseUrl: "http://localhost:51620",
	rootUrl: 'http://localhost:52172',

	//server Port		
	//baseUrl: window.location.origin + '/UKNHMApi',
	//rootUrl: window.location.origin + '/UKNHM'
};
$(document).ready(function () {
	inputLimit();
	onlyInt();
	loading();
	onlyChar();
});
var Active = {
	userName: sessionStorage.getItem('userName'),
	userId: sessionStorage.getItem('userId'),
	userType: sessionStorage.getItem('userType'),
	mobileNo: sessionStorage.getItem('mobileNo'),
	centreId: sessionStorage.getItem('centreId'),
	AppId: sessionStorage.getItem('AppId'),
	doctorId: sessionStorage.getItem('DoctorId')
}
var Loading = {
	small_gear: "<i><img src='" + config.rootUrl + "/images/gear.gif' /></i>"
}
function Global_DownloadExcel(Url, objBO, fileName) {
	var ajax = new XMLHttpRequest();
	ajax.open("Post", Url, true);
	ajax.responseType = "blob";
	ajax.setRequestHeader("Content-type", "application/json")
	ajax.onreadystatechange = function () {
		if (this.readyState == 4) {
			var blob = new Blob([this.response], { type: "application/octet-stream" });
			saveAs(blob, fileName); //reference by ~/JsModule/FileSaver.min.js		
		}
	};
	ajax.send(JSON.stringify(objBO));
}

function Global_DownloadPdf(Url, objBO, fileName) {
	$('#LineLoader').show();
	var ajax = new XMLHttpRequest();
	ajax.open("Post", Url, true);
	type: 'POST',
		ajax.responseType = "blob";

	ajax.onreadystatechange = function () {
		if (this.readyState == 4) {
			var blob = new Blob([this.response], { type: "application/octet-stream" });
			//var blob = new Blob([this.response], { type: "application/application/pdf" });
			saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js
			$('#LineLoader').hide();
		}
	};
	ajax.send(objBO);
}
function query() {
	var vars = [], hash;
	var url = window.location.href.replace('#', '');
	var hashes = url.slice(url.indexOf('?') + 1).split('&');
	for (i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
	}
	return vars;
}

function lockPreviousDate(elementid) {
	//var today = new Date().toISOString().split('T')[0];	
	var today = sessionStorage.getItem('ServerTodayDate').split('T')[0];
	$("#" + elementid).attr("min", today);
}
function FillCurrentDate(elementid) {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;    
	$("#" + elementid).attr("value", today);
}
function FillCurrentMonth(elementid) {
	var date = new Date();
	var month = date.getMonth();
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	var today = year + "-" + month;
	$("#" + elementid).attr("value", today);
}
function maxPrevMonth(elementid) {
	var date = new Date();
	var month = date.getMonth();
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	var today = year + "-" + month;
	$("#" + elementid).attr("max", today);
}
function FillCurrentDateByInputType() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	var today = year + "-" + month + "-" + day;
	$("input[type=date]").attr("value", today);
}
function GetPreviousDate() {     

	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;

	return year + "-" + month + "-" + day;

}
function Properdate(inp_date, seprater) {
	if (inp_date == "")
		corr_formate = "1900/01/01";
	else
		corr_formate = inp_date
	//if (inp_date != "") {
	//    var f = inp_date.split(seprater);
	//    corr_formate = f[2] + "/" + f[1] + "/" + f[0];
	//}
	//else { corr_formate = "1900/01/01"; }
	return corr_formate;
}

function ddmmyyToyymmdd(inp_date, seprater) {

	//if (inp_date == "")
	//    corr_formate = "1900/01/01";
	//else
	//    corr_formate = inp_date
	if (inp_date != "") {
		var f = inp_date.split(seprater);
		corr_formate = f[2] + "/" + f[1] + "/" + f[0];
	}
	else { corr_formate = "1900/01/01"; }
	return corr_formate;
}

function FixTableHead() {
	var table = $('#tblUnCompleteOrder').height();
	var thead = $('#tblUnCompleteOrder').find('thead');
	var tbody = $('#tblUnCompleteOrder').find('tbody');
	if (table == 335) {
		$(thead).css('position', 'absolute');
	}
}
function chkSession() {
	var Username = sessionStorage.getItem('Username');
	var UserID = sessionStorage.getItem('UserID');
	var urlPath = window.location.pathname.toLowerCase();
	var urlOrigin = window.location.origin.toLowerCase();
	var siteUrl = config.rootUrl;
	if (Username != null && urlOrigin == siteUrl) {
		window.location.href = siteUrl + "/Admin/Dashboard";
	}
}

function CloseSidebar() {
	$('.slidefull').trigger('click');
}
function inputLimit() {
	$('input[data-count],table tbody td input[data-count]').on('click', function (e) {
		$('limit').remove('.count');
		$(this).after('<limit class="count"></limit>');
		t = $(this).data('count');
		$('input[data-count]').on('keyup', function (e) {
			$(this).siblings('limit').show();
			$(this).attr('maxlength', t);
			$(this).siblings('limit').text(t);
			len = $(this).val().length;
			r = parseInt(t) - parseInt(len);
			$(this).siblings('limit').text(r);
			if (r <= 0)
				$(this).css('border-color', 'red');
			else
				$(this).removeAttr('style');
		});
	});
}
function selectRow(id) {
	$(id).closest('tr').parents('tbody').find('tr').removeClass('select-row');
	$(id).closest('tr').addClass('select-row');
}
function onlyInt() {
	$('input[data-int]').on('keyup', function () {
		if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '');
	});
}
function tblonlyInt(id) {
	$(id).on('keyup', function () {
		if (/[^\d-]/g.test(this.value)) this.value = this.value.replace(/[^\d-]/g, '');
	});
}
function onlyChar() {
	$('input[data-char]').on('keyup', function () {
		if (/\d+/g.test(this.value)) this.value = this.value.replace(/\d+/g, '');
	});
}
function searchTable(txt, tbl) {
	$('#' + txt).on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#' + tbl + ' tbody tr').filter(function () {
			$(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
		});
	});
}
function searchMenu() {
	var val = $('#txtSearchMenu').val().toLocaleLowerCase();
	$('#menu-list li').filter(function () {
		$(this).toggle($(this).find('a').text().toLocaleLowerCase().indexOf(val) > -1);
	});
}
function searchTableh(txt, tbl) {
	$('#' + tbl + ' thead').on('keyup', '#' + txt, function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#' + tbl + ' tbody tr').filter(function () {
			$(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
		});
	});
}

function searchList(txt, ul) {
	$('#' + txt).on('keyup', function () {
		var val = $(this).val().toLocaleLowerCase();
		$('#' + ul + ' li').filter(function () {
			$(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
		});
	});
}
function loading() {
	$('#LineLoader').hide();
	$(document).on({
		ajaxStart: function () {
			$('#LineLoader').show();
		},
		ajaxStop: function () {
			$('#LineLoader').hide();
		}
	});
}
function mendatory() {
	$('input[data-imp],select[data-imp],textarea[data-imp]').addClass('border-imp');
	$('select.border-imp').each(function () {
		$('span.selection').find('span[aria-labelledby=select2-' + $(this).attr('id') + '-container]').addClass('border-imp');
	});
}
function urlEncript() {
	var url = window.location.href;
	if (history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host + '?' + btoa(url);
		window.history.pushState({ path: newurl }, '', newurl);
	}
}
function toggleFullScreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
}
function MsgBox(msg) {
	$('.alert-msg').remove();
	var msgBox = "";
	msgBox += "<div class='alert-msg'><i class='fa fa-warning fa-2X'></i>";
	msgBox += "<span>" + msg + "</span>";
	msgBox += "<span class='timeout'>X</span>";
	msgBox += "</div>";
	$('#page-content').append(msgBox);

	$('.alert-msg').show();
	$(".alert-msg").fadeIn()
		.css({ top: 0, position: 'absolute' })
		.animate({ top: 20 }, 800, function () {
			setTimeout(function () {
				$('.alert-msg').hide();
				$('.alert-msg').remove();
			}, 100000);
		});
	$('.alert-msg .timeout').click(function () {
		$('.alert-msg').remove();
		$('.alert-msg').fadeOut()
			.css({ top: 0, position: 'absolute' })
	});
}

//Uploading Document
function UploadDocument(url, data) {
	var UploadDocumentInfo = new XMLHttpRequest();
	UploadDocumentInfo.upload.addEventListener('progress', function (e) {
		$('#LineLoader').show();
		var val = (e.loaded / e.total) * 100;
		var percent = val.toFixed(0);
		$('#UploadingStatus').css('width', '' + percent + '%').text(percent + '%');
		if (percent == 100) {
		}
	});

	UploadDocumentInfo.onreadystatechange = function () {
		if (UploadDocumentInfo.status) {
			if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
				var json = JSON.parse(UploadDocumentInfo.responseText);
				if (json.Message.includes('Success')) {

				}
			}
		}
	}
	UploadDocumentInfo.open('POST', url, true);
	UploadDocumentInfo.send(data);
}