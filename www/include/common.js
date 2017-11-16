if (getCookie("activatedmode") == 0)
{
    setCookie("activatedmode", 'digital'); //default value
}
var activatedmode = getCookie("activatedmode");

var input_title = new Array(100);
var lan=getCookie("lan");
var bIsWinMSIE = ((navigator.appName == "Microsoft Internet Explorer") && navigator.platform.match("Win")) ? true : false;
var bIsFireFox = navigator.userAgent.match("Firefox") != null ? true : false;
var bIsChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ? true : false;
var ffversion;

//IE11 navigator.appName = Netscape, so we need to check navigator.userAgent.
if(!bIsWinMSIE)
{
	//IE11
	if(navigator.userAgent.match("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})") != null)
	{
		bIsWinMSIE = true;
	}
}

if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent))
{
    ffversion=new Number(RegExp.$1);
}

function loadlanguage()
{
	var tran = document.getElementsByTagName("span");
	for (var i = 0; i < tran.length; i++)
	{	
		if (tran[i].title == "symbol")
		{
			tran[i].innerHTML = translator(tran[i].innerHTML);
			tran[i].title = "";
		}
	}
	
	var opt = document.getElementsByTagName("option");
	for (var i = 0; i < opt.length; i++)
	{	
		if (opt[i].title == "symbol")
		{
			opt[i].text = translator(opt[i].text);
			opt[i].title = "";
		}
	}
	
	var input = document.getElementsByTagName("input");
	for (var i = 0; i < input.length; i++)
	{	
		if((input[i].type == "button" || input[i].type == "submit") && input[i].title == "symbol")
		{
			input[i].value = translator(input[i].value);
			input[i].title = "";
		}
	}

}

function loadvalue_MultiLangList()
{
	var input=document.getElementsByTagName("select");
	if(custom_translator_ok) 
		langCount = eval(system_info_language_count)+ eval(system_info_customlanguage_count) ;
	else
		langCount = eval(system_info_language_count);
	
	for (var i = 0; i < input.length; i++)
	{
		title = input[i].title.split(",");

		if(title[0]=="parameter")
		{
			for (j = 0; j < langCount; j ++)
			{			
				eval("value="+input[i].options[j].text);
				//eval("value="+input[i].options[j].innerHTML);
				input[i].options[j].text = value;
				input[i].options[j].text = unescape(input[i].options[j].text);
			}						
		}		
	}
}

function loadvalue()
{
	var input=document.getElementsByTagName("input");
	for (var i = 0; i < input.length; i++)
	{
		//if (i == 30)
			//console.log(i + ", " + $(input[i]).val());
		
		input_title[i]=input[i].title;
		title = input[i].title.split(",");
		if(title[0]=="param")
		{			
			if(input[i].type=="text" || input[i].type=="password")
			{
				try {
					eval("input["+i+"].value="+input[i].name);
				} catch (err) {
					input[i].value="";
				}
			}
			else if(input[i].type=="hidden")
			{
				try {
					eval("input["+i+"].value="+input[i].name);
				} catch (err) {
					input[i].value="";
				}
				if(eval("typeof(input["+(i+1)+"])")!="undefined")
				{
					if(input[i+1].type=="checkbox")
					{
						if(input[i].value=="0")
							input[i+1].checked=0;
						else
							input[i+1].checked=1;
					}
				}
			}
			else if(input[i].type=="radio")
			{
				try {
					eval("value="+input[i].name);
				} catch (err) {
					value=""
				}
				if (input[i].value == value)
				{
					input[i].checked = true;
				}
			}
			input[i].title="";
		}
		else if(title[0]=="param_chk")
		{
			input[i].title="";
		}
	}
	
	var input=document.getElementsByTagName("select");
	for (var i = 0; i < input.length; i++)
	{
		title = input[i].title.split(",");
		if(title[0]=="param")
		{
			try {
				eval("value="+input[i].name);
			} catch (err) {
				value=""
			}
			for (j = 0; j < input[i].length; j ++)
			{			
				if (input[i].options[j].value == value)
				{
					input[i].options[j].selected = true;
					break;
				}
			}
			input[i].title="";
		}
	}

	var input=document.getElementsByTagName("span");
	for (var i = 0; i < input.length; i++)
	{	
		title = input[i].title.split(",");
		if(title[0]=="param")
		{
			if(eval("typeof("+input[i].innerHTML+")")!="undefined")
			{
				eval("value="+input[i].innerHTML);
				input[i].innerHTML=value;
				input[i].innerHTML=unescape(input[i].innerHTML);
			}
			input[i].title="";
		}
	}
	return 0;
}

var initalFlag = 0;
function receiveparam()
{	
	if (XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200)
	{
		eval(XMLHttpRequestObject.responseText);
		if(typeof(receivedone)=="function")
			receivedone();
		loadvalue();
		if(typeof(loadvaluedone)=="function")
			loadvaluedone();

	}
	
	if(initalFlag == "0" && document.getElementById("logo") != null) /*for Configuration Page round corner effect*/
	{
			updateLogoInfo();
			resizeLogo();
			
			//Nifty("div#outter-wrapper","small","nonShadow");		
			//Nifty("div#case","normal","nonShadow");
			//document.getElementsByTagName("b")[5].style.position = "relative";
			
			initalFlag = "1";
	}			
}

function updatecheck(inputName, checkbox)
{
	if (checkbox.checked)
		inputName.value = "1";
	else
		inputName.value = "0";
}

function updatecheckById(Id, checkbox)
{
	if (checkbox.checked)
		document.getElementById(Id).value = "1";
	else
		document.getElementById(Id).value = "0";
}

function checkSpecialCharInString(instr){
	if (/^[^`'"\\/<>(){}[\];|!#$*,=& ]*$/.test(instr.value))
	{
		return 0;
	}
	instr.focus();
	instr.select();
	alert(translator("you_have_used_invalid_characters_special"));
	return -1;
}

function checkInString(instr){
	for (i = 0; i < instr.value.length; i++){
        c = instr.value.charAt(i);
        if (c == '"' || c == '\'' || c == '<' || c == '>' || c == '&')
        {          alert(translator("you_have_used_invalid_characters_sh"));
          instr.focus();
          instr.select();
          return -1;
        }
    }

   return 0;
}

function checkInString2(instr){
	for (i = 0; i < instr.value.length; i++){
        c = instr.value.charAt(i);
        if (c == '"' || c == '\'' || c == '<' || c == '>' || c == '=' || c == '&')
        {
          alert(translator("you_have_used_invalid_characters_host"));
          instr.focus();
          instr.select();
          return -1;
        }
    }

   return 0;
}

function checkFilenameString(instr){
  for (i = 0; i < instr.value.length; i++){
    c = instr.value.charAt(i);
    if (c == '"' || c == '\'' || c == '<' || c == '>' || c == '/' || c == ':' || c == '*' || c == '.' || c == '?' || c == '|' || c == '\\' || c == '&')
    {
       alert(translator("you_have_used_invalid_characters_lg"));
       instr.focus();
       instr.select();
       return -1;
    }
  }
  return 0;
}

function checkInSpace(instr){
	for (i = 0; i < instr.value.length; i++){
        c = instr.value.charAt(i);
        if (c == ' ')
        {
          alert(translator("space_is_invalid"));
          instr.focus();
          instr.select();
          return -1;
        }
    }

   return 0;
}

function checkIPaddr(input)
{
    var filter=/^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/;
	if (!filter.test(input.value) || (!input.disabled && input.value == "0.0.0.0"))
    {
		alert(translator("please_enter_a_valid_ip_address"));
		input.focus();
		input.select();
		return -1;
	}

	return 0;
}

function checkIP6(input)
{
	var filter=[
		/^(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}$/i,
		/^[a-f0-9]{0,4}::$/i,
		/^:(?::[a-f0-9]{1,4}){1,6}$/i,
		/^(?:[a-f0-9]{1,4}:){1,6}:$/i,
		/^(?:[a-f0-9]{1,4}:)(?::[a-f0-9]{1,4}){1,6}$/i,
		/^(?:[a-f0-9]{1,4}:){2}(?::[a-f0-9]{1,4}){1,5}$/i,
		/^(?:[a-f0-9]{1,4}:){3}(?::[a-f0-9]{1,4}){1,4}$/i,
		/^(?:[a-f0-9]{1,4}:){4}(?::[a-f0-9]{1,4}){1,3}$/i,
		/^(?:[a-f0-9]{1,4}:){5}(?::[a-f0-9]{1,4}){1,2}$/i,
		/^(?:[a-f0-9]{1,4}:){6}(?::[a-f0-9]{1,4})$/i
			];
	for (var i=0; i<filter.length; i++)
	{
		if (filter[i].test(input.value))
		{
			return 0;
		}
	}
	return -1;
}

function checkIP6_4(input)
{
	var filter=[
		/^(?:[a-f0-9]{1,4}:){6}(?:\d{1,3}\.){3}\d{1,3}$/i,
		/^:(?::[a-f0-9]{1,4}){0,4}:(?:\d{1,3}\.){3}\d{1,3}$/i,
		/^(?:[a-f0-9]{1,4}:){1,5}:(?:\d{1,3}\.){3}\d{1,3}$/i,
		/^(?:[a-f0-9]{1,4}:)(?::[a-f0-9]{1,4}){1,4}:(?:\d{1,3}\.){3}\d{1,3}$/i,
		/^(?:[a-f0-9]{1,4}:){2}(?::[a-f0-9]{1,4}){1,3}:(?:\d{1,3}\.){3}\d{1,3}$/i,
		/^(?:[a-f0-9]{1,4}:){3}(?::[a-f0-9]{1,4}){1,2}:(?:\d{1,3}\.){3}\d{1,3}$/i,
		/^(?:[a-f0-9]{1,4}:){4}(?::[a-f0-9]{1,4}):(?:\d{1,3}\.){3}\d{1,3}$/i
			];
	for (var i=0; i<filter.length; i++)
	{
		if (filter[i].test(input.value))
		{
			return 0;
		}
	}
	return -1;
}

function checkIP6_linkLocal(input)
{
	var filter=/^fe(?:[a-b8-9]{1}[a-f0-9]{1}):/i;
	if((input.value != "") && (checkIP6(input) || !filter.test(input.value)))
	{
		alert(translator("please_enter_a_valid_ip_address"));
		input.focus();
		input.select();
		return -1;
	}
		return 0;
}

function checkIPtable6(input)
{
	if(checkIP6(input))
	{
		alert(translator("please_enter_a_valid_ip_address"));
		input.focus();
		input.select();
		return -1;
	}
	return 0;
}

function checkIPtableAdmin(input)
{
	if(checkIP6(input))
	{
		if(checkIPaddr(input))
		{
			input.focus();
			input.select();
			return -1;
		}
	}
	return 0;
}

function checkIPaddr6(input)
{
	var f1=/^ff(?:[a-f0-9]{2}):/i;//Multicast
	var f2=/^2002:/i;//6to4Tunnel
	var f3=/^fe(?:[a-b8-9]{1}[a-f0-9]{1}):/i;//LinkLocal
	// can't use Multicast, 6to4Tunnel and LinkLocal
	if((input.value != "") && ((checkIP6(input) || f1.test(input.value) || f2.test(input.value) || f3.test(input.value)) && checkIP6_4(input)))
	{
		alert(translator("please_enter_a_valid_ip_address"));
		input.focus();
		input.select();
		return -1;
	}
	return 0;
}

function checkWinsIPaddr(input)
{
	// Wins IP addr can only be empty or match IP addr rule
	if(input.value != "")
	{
		if(checkIPaddr(input))
			return -1;
	}
	return 0;
}

function checkMultiCastIPaddr(input)
{
	var filter=/\d+\.\d+\.\d+\.\d+/;
	if (!filter.test(input.value)){
		alert(translator("please_enter_a_valid_ip_address"));
		input.focus();
		input.select();
		return -1;
	}
	input.value = input.value.match(filter)[0];
	subip = input.value.split(".");
	if ((parseInt(subip[0]) > 239) || (parseInt(subip[0]) < 224 ))
	{
			alert(translator("please_enter_a_valid_ip_address"));
			input.focus();
			input.select();
			return -1;
	}
	for (i = 1; i < subip.length; i ++)
	{
		if ((parseInt(subip[i]) > 255) || (parseInt(subip[i]) < 0 ))
		{
			alert(translator("please_enter_a_valid_ip_address"));
			input.focus();
			input.select();
			return -1;
		}
	}	
	return 0;
}

function checkPort(thisObj)
{
	switch(thisObj.name)
	{
		case "network_http_port":
			defaultPort=80;
			message="http_port_must_be_80_or_from_1025_to_65535";
			break;
		case "network_http_alternateport":
			defaultPort=8080;
			message="secondary_http_port_must_be_from_1025_to_65535";
			break;
		case "network_ftp_port":
			defaultPort=21;
			message="ftp_port_must_be_21_or_from_1025_to_65535";
			break;
		case "network_rtsp_port":
			defaultPort=554;
			message="rtsp_port_must_be_554_or_from_1025_to_65535";
			break;	
		case "network_rtp_videoport":
			defaultPort=5556;
			message="rtp_video_port_must_be_from_1025_to_65535";
			break;	
		case "network_rtp_audioport":
			defaultPort=5558;
			message="rtp_audio_port_must_be_from_1025_to_65535";
			break;	
		case "network_rtsp_s0_multicast_videoport":
			defaultPort=5556;
			message="rtsp_s0_multicast_video_port_must_be_from_1025_to_65535";
			break;		
		case "network_rtsp_s0_multicast_audioport":
			defaultPort=5558;
			message="rtsp_s0_multicast_audio_port_must_be_from_1025_to_65535";
			break;	
		case "network_rtsp_s1_multicast_videoport":
			defaultPort=5556;
			message="rtsp_s1_multicast_video_port_must_be_from_1025_to_65535";
			break;	
		case "network_rtsp_s1_multicast_audioport":
			defaultPort=5558;
			message="rtsp_s1_multicast_audio_port_must_be_from_1025_to_65535";
			break;
		case "network_rtsp_s2_multicast_videoport":
			defaultPort=5556;
			message="rtsp_s2_multicast_video_port_must_be_from_1025_to_65535";
			break;	
		case "network_rtsp_s2_multicast_audioport":
			defaultPort=5558;
			message="rtsp_s2_multicast_audio_port_must_be_from_1025_to_65535";
			break;
		case "network_rtsp_s3_multicast_videoport":
			defaultPort=5556;
			message="rtsp_s3_multicast_video_port_must_be_from_1025_to_65535";
			break;	
		case "network_rtsp_s3_multicast_audioport":
			defaultPort=5558;
			message="rtsp_s3_multicast_audio_port_must_be_from_1025_to_65535";
			break;
		case "network_rtsp_s4_multicast_videoport":
			defaultPort=5556;
			message="rtsp_s4_multicast_video_port_must_be_from_1025_to_65535";
			break;	
		case "network_rtsp_s4_multicast_audioport":
			defaultPort=5558;
			message="rtsp_s4_multicast_audio_port_must_be_from_1025_to_65535";
			break;
		case "syslog_serverport":
			defaultPort=514;
			message="syslog_server_port_must_be_514_or_from_1025_to_65535";
			break;
		case "network_sip_port":
			defaultPort=5060;
			message="two_way_audio_port_must_be_from_1025_to_65535";
			break;
		case "network_https_port":
			defaultPort=443;
			message="https_port_must_be_443_or_from_1025_to_65535";
			break;
	}

	if (checkNumChar(thisObj))
		return -1;

	if (thisObj.value == defaultPort)
		return 0;
	if ((thisObj.value > 1024) && (thisObj.value <= 65535))
		return 0;
	alert(translator(message));
	thisObj.select();
	thisObj.focus();
	return -1;
}

function checkPassword(Pass1, Pass2)
{
    var vPass1 = Pass1.value;
    var vPass2 = Pass2.value;

    for (i = 0; i < vPass1.length; i++){
        c = vPass1.charAt(i);
        if (!( (c>='@' && c<='Z') || (c>='a' && c<='z') || (c>='0' && c<='9') || c=="!" ||
               c=="$" || c=="%" || c=="-" || c=="." || c=="^" || c=="_" || c=="~"))
        {
          alert(translator("you_have_used_invalid_characters_passwd"));
          Pass1.focus();
          Pass1.select();
          return -1;
        }
    }

    if (vPass1 != vPass2){
        alert(translator("the_confirm_password_differs_from_the_password"));
        Pass1.focus();
        Pass1.select();
        return -1;
    }
    return 0;
}

function checkemail(input)
{
	var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if (filter.test(input.value))
		return 0;
	else{
		alert(translator("please_input_a_valid_email_address"));
		input.focus();
		input.select();
		return -1;
	}
}

function checkNumChar(chkValue)
{
	for (i = 0; i < chkValue.value.length; i++)
	{
		c = chkValue.value.charAt(i);
		if (!(c>='0' && c<='9'))
		{
			chkValue.select();
			chkValue.focus();
			alert(translator("please_input_a_valid_value"));
			return -1;
		}
	}
}

function checkNumRange(thisObj, up, down)
{
	if (checkNumChar(thisObj))
		return -1;
	if ((parseInt(thisObj.value) >= down) && (parseInt(thisObj.value) <= up) && parseInt(thisObj.value) == parseFloat(thisObj.value))
		return 0;
	alert(translator("please_input_a_valid_value") + "[" + down + " ~ " + up + "]");
	thisObj.select();
	thisObj.focus();
	return -1;
}

function checkInverseNumRange(thisObj, up, down)
{
	if ((parseInt(thisObj.value) <= down) && (parseInt(thisObj.value) >= up) && parseInt(thisObj.value) == parseFloat(thisObj.value))
		return 0;
	alert(translator("please_input_a_valid_value") + "[1/" + down + " ~ 1/" + up + "]");
	//thisObj.select();
	thisObj.focus();
	return -1;
}

function checkHHMM(input)
{
	var filter=/\d\d:\d\d/;
	if (!filter.test(input.value))
	{
		alert(translator("please_enter_a_valid_time"));
		input.focus();
		input.select();
		return -1;
	}
	input.value = input.value.match(filter)[0];
	sub_item = input.value.split(":");
	if (((parseInt(sub_item[0], 10) >= 24) || (parseInt(sub_item[1], 10) >= 60)) && ((parseInt(sub_item[0], 10) != 24) || (parseInt(sub_item[1], 10) != 00)))
	{
		alert(translator("please_enter_a_valid_time"));
		input.focus();
		input.select();
		return -1;
	}
	
	return 0;
}

function checkStringSize(input)
{
	len=0;
	for(i=0; (i<input.value.length) && (len<input.maxLength); i++)
		if(input.value.charCodeAt(i)<0x80)
			len+=1;
		else if(input.value.charCodeAt(i)<0x800)
			len+=2;
		else if(input.value.charCodeAt(i)<0x10000)
			len+=3;
		else if(input.value.charCodeAt(i)<0x200000)
			len+=4;
		else if(input.value.charCodeAt(i)<0x4000000)
			len+=5;
		else
			len+=6;
	if(len>input.maxLength)
		i--;
	input.value=input.value.substring(0,i);
}

function checkAccessName (input)
{
	if (!/^[0-9a-zA-Z_\-\.]+$/.test(input.value))
	{
		alert(translator("accessname_can_only_contains_numeric_alpha"));
		input.focus();
		input.select();
		return -1;
	}
	return 0;
}

function checkvalue()
{
	var input=document.getElementsByTagName("input");
	for (var i = 0; i < input.length; i++)
	{	
		//if (i == 30)
			//console.log(i + ", " + $(input[i]).val());
		
		// when you active to create <input> tag in .js, the input.length will larger than input_title[], so check is it undefined.
		if (typeof(input_title[i]) === "undefined")
			continue;
		
		title = input_title[i].split(",");
		if(title[0]=="param" || title[0]=="param_chk")
		{
			if(input[i].type=="text" || input[i].type=="password")
			{
				if(title[1]=="string")
				{
					checkStringSize(input[i]);
					if(checkInString(input[i]))
						return -1;
					if(title[2]=="empty")
					{
						if(CheckEmptyString(input[i]))
							return -1;	
					}
					else if(title[2]=="space")
					{
						if(checkInSpace(input[i]))
							return -1;
					}
					else if (title[2]=="accessname")
					{
						if (checkAccessName(input[i]))
							return -1;
					}
					else if (title[2] == "strict")
					{
						if (checkSpecialCharInString(input[i]))
							return -1;
					}

				}
				else if(title[1]=="string2")
				{
					checkStringSize(input[i]);
					if(checkInString2(input[i]))
						return -1;					
				}
				else if(title[1]=="num")
				{
					if(checkNumRange(input[i], parseInt(title[2]), parseInt(title[3])))
						return -1;
				}
				else if(title[1]=="port")
				{
					if(checkPort(input[i]))
						return -1;
				}
				else if(input[i].value=="")
				{
					continue;
				}
				else if(title[1]=="filename")
				{
					if(checkFilenameString(input[i]))
						return -1;
				}
				else if(title[1]=="ipaddr")
				{
					if(checkIPaddr(input[i]))
						return -1;
				}
				else if(title[1]=="ipaddr6")
				{
					if(checkIPaddr6(input[i]))
						return -1;
				}
				else if(title[1]=="ipaddr6router")
				{
					if(checkIP6_linkLocal(input[i]))
						return -1;
				}
				else if(title[1]=="iptable6")
				{
					if(checkIPtable6(input[i]))
						return -1;
				}
				else if(title[1]=="iptableadmin")
				{
					if(checkIPtableAdmin(input[i]))
						return -1;
				}
				else if(title[1]=="winsipaddr")
				{
					if(checkWinsIPaddr(input[i]))
						return -1;
				}
				else if(title[1]=="multicastipaddr")
				{
					if(checkMultiCastIPaddr(input[i]))
						return -1;
				}
				else if(title[1]=="email")
				{
					if(checkemail(input[i]))
						return -1;
				}
				else if(title[1]=="time")
				{
					if(checkHHMM(input[i]))
						return -1;
				}
				else if(title[1]=="completetime")
				{
					if(checkHHMMSS(input[i]))
						return -1;
				}
				else if(title[1]=="date")
				{
					if(checkYYYYMMDD(input[i]))
						return -1;
				}
			}
		}
	}
	return 0;
}

function getCookie(Name) 
{
  var search = Name + "=";
  if (document.cookie.length > 0) { 
      // if there are any cookies
      offset = document.cookie.indexOf(search);
      if (offset != -1) { 
          // if cookie exists
          offset += search.length;

          // set index of beginning of value
          end = document.cookie.indexOf(";", offset);

          // set index of end of cookie value
          if (end == -1)
              end = document.cookie.length;

          return unescape(document.cookie.substring(offset, end));
      }
  }
  return 0;
}

function setCookie(name, value, expire, path) 
{
	var strCookie = name + "=" + escape(value);

    if (expire)
    {
        strCookie += "; expires=" + expire.toGMTString();
    }
    else
    {
        var expires = new Date();
        expires.setTime(expires.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
        strCookie += "; expires=" + expires.toGMTString();
    }

    if (path)
    {
        strCookie += "; path =" + path;
    }
    else
    {
        strCookie += "; path =/";
    }
	
    document.cookie = strCookie;
}

function translator(str)
{
    if(document.all)
    {
        if(xmlDocLang.getElementsByTagName(str)[(lan >= 100)?0:lan] != null)
		{
            //cause some translator in some language could be a NULL value. eg: <delay_for></delay_for> in Japanese 
            if(xmlDocLang.getElementsByTagName(str)[(lan >= 100)?0:lan].childNodes.length != 0)
                return xmlDocLang.getElementsByTagName(str)[(lan >= 100)?0:lan].childNodes[0].nodeValue;
            else
                return "";
		}
		else
		{
            //return str + " (_UNTRANSLATED_)";
            return str;
        }
	}
    else
    {
	
        if(typeof xmlDocLang.getElementsByTagName(str)[(lan >= 100)?0:lan] != "undefined")
		{
            if(xmlDocLang.getElementsByTagName(str)[(lan >= 100)?0:lan].childNodes.length != 0)            
                return xmlDocLang.getElementsByTagName(str)[(lan >= 100)?0:lan].childNodes[0].nodeValue;
            else
                return "";
		}
		else
		{	
            //return str + " (_UNTRANSLATED_)";
            return str;
        }
	}
}

function updateDynSelOpt(x, aList)
{
	var cnt;

	cnt = 0;
	for (i = 0; i < aList.length; i ++) {

		if (aList[i][0])	cnt ++;
	}
	
	if (cnt != 0) {
		x.length = cnt;
		j = 0;
		for (i = 0; i < aList.length; i ++) {
			if (aList[i][0]) {
				x.options[j].text = aList[i][1];
				x.options[j].value = aList[i][2];
				j ++;
			}
		}
	}
	
	return cnt;
}

function showimage_innerHTML(type, destBlock, baudio, busefullscene, bjoystick, bMetadataEnabled, pluginPort)
{
	var clientOptValue = 127;
	if (baudio == false)
	{
		clientOptValue = 122;
	}
	var streamingbuffertime=getCookie("streamingbuffertime");

	var str_innerHTML = "";

	var thisURL = document.URL;  
	var http_method = thisURL.split(":");

	var bMetadata = false;
	
	if (typeof(bMetadataEnabled)!='undefined')
	{
		bMetadata = bMetadataEnabled;
	}

	if (bIsWinMSIE)
	{
		switch (type)
		{
		case 'q':
		
		case '0':
			W=W + X_OFFSET;
			H=H + Y_OFFSET;
			STRETCH = "true";
			break;
		case '1':
		case '5':
		case '6':
			if (busefullscene)
			{
            	streamsource = 3;
			}
			W=BaseWidth + X_OFFSET_MD;
			H=BaseHeight + Y_OFFSET_MD;
			STRETCH = "true";
			break;
		case '2':
			if (busefullscene)
			{
            	streamsource = 3;
			}
			W=BaseWidth + X_OFFSET;
			H=BaseHeight + Y_OFFSET;
			STRETCH = "true";
		case '3':
		case '4':
			if (busefullscene)
			{
		            	streamsource = 3;
			}
			W = 320+X_OFFSET;
			H = 240+Y_OFFSET;
			STRETCH = "true";
			break;				
		}

		// The ActiveX plug-in	
		str_innerHTML += "<object class=CropZone id=\"" + PLUGIN_ID + "\" width=" + W + " height=" + H;
		str_innerHTML += " standby=\"Loading plug-in...\" classid=CLSID:" + CLASS_ID;
		str_innerHTML += " codebase=\"/" + PLUGIN_NAME + "#version=" + PLUGIN_VER + "\">";

		var Instr = location.hostname;
		var i = Instr.indexOf(":");
		
		try{
			eval(getCookie("strVolumeClient"));
			eval(getCookie("strMicVolumeClient"));
		//	str_innerHTML += "<param name=\"PlayVolume\" value="+volumeClient+">";
		//	str_innerHTML += "<param name=\"MicVolume\" value="+micVolumeClient+">";
		}
		catch(e){
		}

		str_innerHTML += "<param name=\"Url\" VALUE=" +  thisURL + "\" >";

		if (http_method[0] == "https")
		{
			str_innerHTML += "<param name=\"HttpPort\" VALUE=\"" +  network_https_port + "\" >";
		}
		else
		{
			str_innerHTML += "<param name=\"HttpPort\" VALUE=\"" +  network_http_port + "\" >";
		}
		
		switch (type)
		{
		case 'q':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"false\">";
			str_innerHTML += "<param name=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"false\">";
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"false\">";
			break;
		case '0':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"false\">";
			str_innerHTML += "<param name=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"false\">";
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"false\">";
			
			str_innerHTML += "<param name=\"EnableMetadata\" value=\"" + bMetadata + "\">";
			// user == (null), means no set root password
			// privilege 1: viewer, 4: operator, 6: admin
            
			/*
			if ((user=="(null)")||(privilege=="4")||(privilege=="6")) 
			{
		//		str_innerHTML += "<PARAM NAME=\"EnableTwoWayAudio\" VALUE=\"true\">";
		//		str_innerHTML += "<PARAM NAME=\"EnableMuteWhenTalk\" VALUE=\"true\">";
			}
			*/
			break;
		case '1':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"true\">";
			str_innerHTML += "<PARAM NAME=\"EnableMD\" VALUE=\"true\">";
			str_innerHTML += "<PARAM NAME=\"GetMD\" VALUE=\"/cgi-bin/admin/getmd.cgi\">";
			str_innerHTML += "<PARAM NAME=\"SetMD\" VALUE=\"/cgi-bin/admin/setmd.cgi\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"true\">";
			break;
		case '2':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"true\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"true\">";
			break;
		case '3':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"true\">";
			str_innerHTML += "<PARAM NAME=\"EightTimesInMaskPosSize\" VALUE=\"true\">";
			str_innerHTML += "<PARAM NAME=\"GetMaskEditParmUrl\" VALUE=\"/cgi-bin/admin/getpm.cgi\">";
			str_innerHTML += "<PARAM NAME=\"SetMaskEditParmUrl\" VALUE=\"/cgi-bin/admin/setpm.cgi\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"false\">";
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"false\">";
			break;
		case '4':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"true\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"false\">";
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"false\">";
			break;				
		case '5':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"true\">";
			str_innerHTML += "<PARAM NAME=\"EnableMD\" VALUE=\"true\">";
			str_innerHTML += "<PARAM NAME=\"GetMD\" VALUE=\"/cgi-bin/admin/getmd_normal.cgi\">";
			str_innerHTML += "<PARAM NAME=\"SetMD\" VALUE=\"/cgi-bin/admin/setmd.cgi\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"true\">";
	        str_innerHTML += "<param name=\"IgnoreBorder\" value= \"true\">";
			break;
		case '6':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"true\">";
			str_innerHTML += "<PARAM NAME=\"EnableMD\" VALUE=\"true\">";
			str_innerHTML += "<PARAM NAME=\"GetMD\" VALUE=\"/cgi-bin/admin/getmd_profile.cgi\">";
			str_innerHTML += "<PARAM NAME=\"SetMD\" VALUE=\"/cgi-bin/admin/setmd_profile.cgi\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"true\">";
		    str_innerHTML += "<param name=\"IgnoreBorder\" value= \"true\">";
			break;
		}
		str_innerHTML += "<param name=\"ViewStream\" VALUE=\"" + streamsource + "\">";
		str_innerHTML += "<param name=\"ViewChannel\" VALUE=\"1\">";
		str_innerHTML += "<param name=\"VSize\" VALUE=\"CMS\">";
		str_innerHTML += "<param name=\"Stretch\" VALUE=\"" + STRETCH + "\">";
		str_innerHTML += "<param NAME=\"StretchFullScreen\" VALUE=\"false\">";
		str_innerHTML += "<param NAME=\"PluginCtrlID\" VALUE=\"\">";
		
		// Support Joystick
		if (activatedmode == "digital")
		{
			str_innerHTML += "<PARAM NAME=\"PtzURL\" VALUE=\"/cgi-bin/camctrl/eCamCtrl.cgi\">";
			str_innerHTML += "<PARAM NAME=\"RecallUrl\" VALUE=\"/cgi-bin/camctrl/eRecall.cgi\">";
		}
		else if (activatedmode == "mechanical")
		{
			str_innerHTML += "<PARAM NAME=\"PtzURL\" VALUE=\"/cgi-bin/camctrl/camctrl.cgi\">";
			str_innerHTML += "<PARAM NAME=\"RecallUrl\" VALUE=\"/cgi-bin/camctrl/recall.cgi\">";
		}

		str_innerHTML += "<PARAM NAME=\"ControlPort\" VALUE="+network_rtsp_port+">";

		str_innerHTML += "<PARAM NAME=\"EnableJoystick\" VALUE=\""+ bjoystick +"\">";
		str_innerHTML += "<PARAM NAME=\"UpdateJoystickInterval\" VALUE=\"100\">";
		str_innerHTML += "<PARAM NAME=\"JoystickSpeedLvs\" VALUE=\"5\">";
		
		str_innerHTML += "<param name=\"Language\" VALUE=\"" + PLUGIN_LANG + "\">";
		str_innerHTML += "<param name=\"MP4Conversion\" VALUE=\"true\">";
		str_innerHTML += "<param name=\"EnableFullScreen\" VALUE=\"true\">";
		str_innerHTML += "<param name=\"AutoStartConnection\" VALUE=\"true\">";
		str_innerHTML += "<param name=\"ClickEventHandler\" VALUE=\"3\">";
		str_innerHTML += "<param name=\"StreamingBufferTime\" VALUE=\"" + streamingbuffertime + "\">";
		str_innerHTML += "<PARAM NAME=\"BeRightClickEventHandler\" VALUE=\""+ bjoystick +"\">";
		str_innerHTML += "<param name=\"DarwinConnection\" value=\"false\">";
		str_innerHTML += "<param name=\"ReadSettingByParam\" value=\"true\">";
		//str_innerHTML += "<param name=\"ConnectionProtocol\" value=\"1\">";
		str_innerHTML += '<param name="PlayMute" value=false>';
		str_innerHTML += "<param name=\"EnableMotionAlert\" value=\"false\">";

		//	str_innerHTML += translator("this_is_a_plugin_activex");
		//	str_innerHTML += "<br>";
		//	str_innerHTML += translator("if_you_see_this_text_your_browser_does_not_support_or_has_disabled_activex");
		//	str_innerHTML += "<p/>";
		str_innerHTML += "</object>";
	}
/*
	else if (ffversion >= 3 || bIsChrome)
	{
		switch (type)
		{
		case 'q':
		case '0':
			W=W + X_OFFSET;
			H=H + Y_OFFSET;
			STRETCH = 1;
			break;
		case '1':
		case '5':
		case '6':
			if (busefullscene)
			{
				streamsource = 3;
			}
			W=BaseWidth + X_OFFSET_MD;
			H=BaseHeight + Y_OFFSET_MD;
			STRETCH = 1;
			break;
		case '2':
			if (busefullscene)
			{
				streamsource = 3;
			}
			W=BaseWidth + X_OFFSET;
			H=BaseHeight + Y_OFFSET;
			STRETCH = 1;
		case '3':
		case '4':
			if (busefullscene)
			{
		            	streamsource = 3;
			}
			W = 320+X_OFFSET;
			H = 240+Y_OFFSET;
			STRETCH = 1;
			break;				
		}
		
		str_innerHTML  = "<object class=CropZone id=\"" + PLUGIN_ID + "\" width=" + W + " height=" + H;
		str_innerHTML += " name=\"" + PLUGIN_ID + "\" type=\"" + FFTYPE + "\">";
		
		try{
			eval(getCookie("strVolumeClient"));
			eval(getCookie("strMicVolumeClient"));
			//str_innerHTML += "<param name=\"PlayVolume\" value="+volumeClient+">";
			//str_innerHTML += "<param name=\"MicVolume\" value="+micVolumeClient+">";
		}
		catch(e){
		}

		str_innerHTML += "<param name=\"Url\" VALUE=" +  thisURL + "\" >";

		if (http_method[0] == "https")
		{
			str_innerHTML += "<param name=\"HttpPort\" VALUE=\"" +  network_https_port + "\" >";
		}
		else
		{
			str_innerHTML += "<param name=\"HttpPort\" VALUE=\"" +  network_http_port + "\" >";
		}
		
		switch (type)
		{
		case 'q':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"0\">";
			str_innerHTML += "<param name=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";
			// user == (null), means no set root password
			// privilege 1: viewer, 4: operator, 6: admin
			if ((user=="(null)")||(privilege=="4")||(privilege=="6")) 
			{
				str_innerHTML += "<PARAM NAME=\"EnableTwoWayAudio\" VALUE=\"1\">";
			}
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"0\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"0\">";
			break;
		case '0':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"0\">";
			str_innerHTML += "<param name=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";
			// user == (null), means no set root password
			// privilege 1: viewer, 4: operator, 6: admin
			if ((user=="(null)")||(privilege=="4")||(privilege=="6")) 
			{
				str_innerHTML += "<PARAM NAME=\"EnableTwoWayAudio\" VALUE=\"1\">";
			}
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"0\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"0\">";
			break;
		case '1':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"1\">";
			str_innerHTML += "<PARAM NAME=\"EnableMD\" VALUE=\"1\">";
			str_innerHTML += "<PARAM NAME=\"GetMD\" VALUE=\"/cgi-bin/admin/getmd.cgi\">";
			str_innerHTML += "<PARAM NAME=\"SetMD\" VALUE=\"/cgi-bin/admin/setmd.cgi\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"1\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"1\">";
			break;
		case '2':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"1\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"1\">";
			break;
		case '3':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"1\">";
			str_innerHTML += "<PARAM NAME=\"EightTimesInMaskPosSize\" VALUE=\"1\">";
			str_innerHTML += "<PARAM NAME=\"GetMaskEditParmUrl\" VALUE=\"/cgi-bin/admin/getpm.cgi\">";
			str_innerHTML += "<PARAM NAME=\"SetMaskEditParmUrl\" VALUE=\"/cgi-bin/admin/setpm.cgi\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"0\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"0\">";
			break;
		case '4':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"1\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"0\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"0\">";
			break;				
		case '5':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"1\">";
			str_innerHTML += "<PARAM NAME=\"EnableMD\" VALUE=\"1\">";
			str_innerHTML += "<PARAM NAME=\"GetMD\" VALUE=\"/cgi-bin/admin/getmd_normal.cgi\">";
			str_innerHTML += "<PARAM NAME=\"SetMD\" VALUE=\"/cgi-bin/admin/setmd.cgi\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"1\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"1\">";
			break;
		case '6':
			str_innerHTML += "<param name=\"DisplayErrorMsg\" value=\"1\">";
			str_innerHTML += "<PARAM NAME=\"EnableMD\" VALUE=\"1\">";
			str_innerHTML += "<PARAM NAME=\"GetMD\" VALUE=\"/cgi-bin/admin/getmd_profile.cgi\">";
			str_innerHTML += "<PARAM NAME=\"SetMD\" VALUE=\"/cgi-bin/admin/setmd_profile.cgi\">";
			str_innerHTML += "<PARAM NAME=\"ClientOptions\" VALUE=\"" + clientOptValue + "\">";	
			str_innerHTML += "<param name=\"IgnoreCaption\" value= \"1\">";	
			str_innerHTML += "<param name=\"IgnoreBorder\" value= \"1\">";
			break;
		}
		
		str_innerHTML += "<param name=\"ViewStream\" VALUE=\"" + streamsource + "\">";
		str_innerHTML += "<param name=\"Stretch\" VALUE=\"" + STRETCH + "\">";
		str_innerHTML += "<param NAME=\"StretchFullScreen\" VALUE=\"0\">";
		
		// Support Joystick
		if (activatedmode == "digital")
		{
			str_innerHTML += "<PARAM NAME=\"PtzURL\" VALUE=\"/cgi-bin/camctrl/eCamCtrl.cgi\">";
			str_innerHTML += "<PARAM NAME=\"RecallUrl\" VALUE=\"/cgi-bin/camctrl/eRecall.cgi\">";
		}
		else if (activatedmode == "mechanical")
		{
			str_innerHTML += "<PARAM NAME=\"PtzURL\" VALUE=\"/cgi-bin/camctrl/camctrl.cgi\">";
			str_innerHTML += "<PARAM NAME=\"RecallUrl\" VALUE=\"/cgi-bin/camctrl/recall.cgi\">";
		}

		var ffparam = (bjoystick == true)? 1: 0;
		
		str_innerHTML += "<PARAM NAME=\"ControlPort\" VALUE="+network_rtsp_port+">";

		str_innerHTML += "<PARAM NAME=\"EnableJoystick\" VALUE=\"" + ffparam + "\">";
		str_innerHTML += "<PARAM NAME=\"UpdateJoystickInterval\" VALUE=\"100\">";
		str_innerHTML += "<PARAM NAME=\"JoystickSpeedLvs\" VALUE=\"5\">";
		
		str_innerHTML += "<param name=\"StreamingBufferTime\" VALUE=\"" + streamingbuffertime + "\">";
		str_innerHTML += "<param name=\"Language\" VALUE=\"" + PLUGIN_LANG + "\">";
		str_innerHTML += "<param name=\"MP4Conversion\" VALUE=\"1\">";
		str_innerHTML += "<param name=\"EnableFullScreen\" VALUE=\"1\">";
		str_innerHTML += "<param name=\"AutoStartConnection\" VALUE=\"1\">";
		str_innerHTML += "<param name=\"ClickEventHandler\" VALUE=\"3\">";
		str_innerHTML += "<PARAM NAME=\"BeRightClickEventHandler\" VALUE=\"" + ffparam + "\">";

		str_innerHTML += "<param name=\"DarwinConnection\" value=\"0\">";

		str_innerHTML += "</object>";		
	}*/
	else if (navigator.appName == "Netscape" || ffversion >=3 || bIsChrome)
	{		
		// Force playing GlobalView streaming
		switch (type)
		{
            //0:index
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '8':
				/*if (busefullscene)
				{
					streamsource = 3;
				}*/
				(codectype=="mjpeg") ? eval("AccessName=network_http_s"+streamsource+"_accessname")
					: eval("AccessName=network_rtsp_s"+streamsource+"_accessname");
				break;
		}

		if (codectype=="mjpeg")
		{
			Y_OFFSET = 0;
			if (type!=0)
			{
				Width=BaseWidth;
				Height=BaseHeight;
			}
			
			thisURL = document.URL;  
			http_method = thisURL.split(":");
			if (http_method[0] == "https")
			{
				str_innerHTML += "<img id=\"" + PLUGIN_ID + "\" src=\"https://" + location.host + "/" + AccessName + "\" width=\"" +Width+ "\" height=\"" +Height+"\"/>";
			}
			else
			{
				str_innerHTML += "<img id=\"" + PLUGIN_ID + "\" src=\"http://" + location.host + "/" + AccessName + "\" width=\"" +Width+ "\" height=\"" +Height+"\"/>";
			}
		}
		else
		{
			Y_OFFSET = 16; // Quicktime contrlbar height
			if (type!=0)
			{
				Width=BaseWidth;
				Height=BaseHeight + Y_OFFSET;
			}
			else
			{
				Width=W;// + X_OFFSET;
				Height=H;// + Y_OFFSET;
			}
			// Using rtsp port as default
            pluginPort = pluginPort || network_rtsp_port;
			
			str_innerHTML += "<embed SCALE=\"ToFit\" id=\"" + PLUGIN_ID + "\" width=\"" + Width + "\" height=\"" + Height + "\"";
			str_innerHTML += " type=\"video/quicktime\" qtsrc=\"rtsp://" + location.hostname+':'+ pluginPort + "/" + AccessName + "\"";
			str_innerHTML += " qtsrcdontusebrowser src=\"/realqt.mov\" autoplay=\"true\" controller=\"true\" postdomevents=\"true\"\>";
		}
	}
	else
	{
		str_innerHTML += "Please use Firefox, Mozilla or Netscape<br>";
	}

	if(type == '7') 
	{
		document.getElementById(destBlock).innerHTML = "";		
	}
	else
	{
		//document.getElementById(destBlock).innerHTML = str_innerHTML;
		$("#digitalZoomRatio").css("display","block");
		$("#" + destBlock + " object").remove();
		$("#" + destBlock).append(str_innerHTML);
		
		try
		{
			if (bIsWinMSIE || ffversion >= 3 || bIsChrome)
			{
				if (document.getElementById(PLUGIN_ID) != null)
				{
					//addPluginEvent(document.getElementById(PLUGIN_ID), "VNDPWrapperReady", StartPlugin);
					pluginInterval = setInterval("StartPlugin()",  500);
				}
				/*
				pluginInterval = setInterval("StartPlugin()",  500);
				//StartPlugin();
				window.onscroll = function()
				{
					 // redraw video plugin on scroll event
					 try
					 {
						 WinLessPluginCtrl.RedrawIE();
					 }
					 catch(err)
					 {
					 }
				};*/
			}
				
		}
		catch (err)
		{
			Log("%s", err.description);
		}
	}
}

var pluginInterval = -1;
function StartPlugin()
{
	if (document.getElementById(PLUGIN_ID).StreamStatus != null)
	{
		clearInterval(pluginInterval);

		if (document.getElementById("RtspCtrlBtn-bar") != null)
		{
			document.getElementById("RtspCtrlBtn-bar").style.display = "block";
			$("#viewsizeCtrlBlk").show();
		}
	}
}

function reDrawPlugin()
{
	window.onscroll = function()
	{
		try
		{
			frames[0].WinLessPluginCtrl.RedrawIE();
		}
		catch(err){}
	};
}

function openurl(url, resizable)
{
	var subWindow = window.open(url, "","width=600, height=500, scrollbars=yes, status=yes,resizable=" + (resizable == undefined ? "no" : resizable));
	subWindow.focus();
}

function countdown()
{
	var board = document.getElementById("progress_bar");
	count --;
	if (count < 0)
	{
		parent.window.location = newlocation;
	}
	else
	{
		board.value = board.value + "|";
		setTimeout("countdown()", intervel);
	}
}

function showNotification(wait_time)
{
	newlocation = "http://" + network_ipaddress + ":" + network_http_port + "/";

	document.getElementById("notification").style.display = "block";
	document.getElementById("notify_location").innerHTML = newlocation;
	count = 100;
	intervel = wait_time * 1000 / count;
	countdown();
}

function SetPluginString(obj)
{
    var i;
    var vMLCodePage = translator("vmlcodepage");
    var vMLFontSize = translator("vmlfontsize");
    var vMLCharSet = translator("vmlcharset");
    var vMLPitch = translator("vmlpitch");
    var vMLSwiss = translator("vmlswiss");
    var vMLFontName = translator("vmlfontname");
    var avMLLangStr = new Array(121);
    
    avMLLangStr[0] = translator("fail_to_connect_server");
    avMLLangStr[1] = translator("zoom");
    avMLLangStr[2] = translator("hide");
    avMLLangStr[3] = translator("media_option");
    avMLLangStr[4] = translator("protocol_option");
    avMLLangStr[5] = translator("the_auto_detection_order_of_transimission_protocol_is_udp_tcp_http");
    avMLLangStr[6] = translator("http_video_only");
    avMLLangStr[7] = translator("tcp");
    avMLLangStr[8] = translator("error");
    avMLLangStr[9] = translator("the_downstream_audio_connection_for_the_current_user_is_not_authorized");
    avMLLangStr[10] = translator("the_media_type_has_been_changed_to_video_only_because_audio_connection");
    avMLLangStr[11] = translator("the_connection_is_closed_because_downstream_audio_connection_is_not_authorized_for_downstream_audio");
    avMLLangStr[12] = translator("the_connection_is_closed_because_server_audio_mode_is_set_to");
    avMLLangStr[13] = translator("the_upstream_channel_is_occupied_please_try_later");
    avMLLangStr[14] = translator("connections_already_exceed_the_limit");
    avMLLangStr[15] = translator("full_duplex");
    avMLLangStr[16] = translator("half_duplex");
    avMLLangStr[17] = translator("talk_only");
    avMLLangStr[18] = translator("listen_only");
    avMLLangStr[19] = translator("audio_disabled");
    avMLLangStr[20] = translator("a_disabled");
    avMLLangStr[21] = translator("audio_only");
    avMLLangStr[22] = translator("no_sound_card");
    avMLLangStr[23] = translator("could_not_initialize_audio_capture_device");
    avMLLangStr[24] = translator("the_upstream_audio_connection_is_not_allowed");
    avMLLangStr[25] = translator("the_downstream_audio_connection_is_not_allowed");
    avMLLangStr[26] = translator("the_media_type_has_been_changed_to_video_only_because_the_audio_mode_is_set_to");
    avMLLangStr[27] = translator("talk");
    avMLLangStr[28] = translator("stop_talk");
    avMLLangStr[29] = translator("the_downstream_audio_connection_is_not_allowed_because_the_media_from_server_contains_no_audio");
    avMLLangStr[30] = translator("the_media_type_has_been_changed_to_video_only_because_the_media_from_server_contains_no_audio");
    avMLLangStr[31] = translator("play");
    avMLLangStr[32] = translator("pause");
    avMLLangStr[33] = translator("resume");
    avMLLangStr[34] = translator("stop");
    avMLLangStr[35] = translator("buffering");
    avMLLangStr[36] = translator("because_the_network_environment_problem_transmission_mode_changes_to_unicast");
    avMLLangStr[37] = translator("because_the_network_environment_problem_transmission_protocol_changes_to_tcp");
    avMLLangStr[38] = translator("please_insert_window_names_on_all_windows");
    avMLLangStr[39] = translator("motion_detection");
    avMLLangStr[40] = translator("connection_is_closed");
    avMLLangStr[41] = translator("save_window_completed");
    avMLLangStr[42] = translator("save_window_failed");
    avMLLangStr[43] = translator("please_close_all_warning_window_first");
    avMLLangStr[44] = translator("because_the_connection_problem_of_network_environment");
    avMLLangStr[45] = translator("warning");
    avMLLangStr[46] = translator("window_name");
    avMLLangStr[47] = translator("sensitivity");
    avMLLangStr[48] = translator("percentage");
    avMLLangStr[49] = translator("new");
    avMLLangStr[50] = translator("save");
    avMLLangStr[51] = translator("disable_digital_zoom");
    avMLLangStr[52] = translator("zoom_factors");
    avMLLangStr[53] = translator("connecting_to");
    avMLLangStr[54] = translator("mute");
    avMLLangStr[55] = translator("_system");
    avMLLangStr[56] = translator("system_error");
    avMLLangStr[57] = translator("can_not_open_registry");
    avMLLangStr[58] = translator("settings_saved");
    avMLLangStr[59] = translator("save_parameter_fail");
    avMLLangStr[60] = translator("disable_audio");
    avMLLangStr[61] = translator("digital_zoom_edit");
    avMLLangStr[62] = translator("play_volume");
    avMLLangStr[63] = translator("mic_volume");
    avMLLangStr[64] = translator("audio_on");
    avMLLangStr[65] = translator("mic_on");
    avMLLangStr[66] = translator("hide_panel");
    avMLLangStr[67] = translator("authenticated_failed");
    avMLLangStr[68] = translator("connect_failed");
    avMLLangStr[69] = translator("x");
    avMLLangStr[70] = translator("y");
    avMLLangStr[71] = translator("width");
    avMLLangStr[72] = translator("height");
    avMLLangStr[73] = translator("private_mask");
    avMLLangStr[74] = translator("path_does_not_exist");
    avMLLangStr[75] = translator("path_cannot_be_empty");
    avMLLangStr[76] = translator("recording_failed");
    avMLLangStr[77] = translator("recording_stop_because_disk_full_or_write_fail");    
    avMLLangStr[78] = translator("version_information");    
    avMLLangStr[79] = translator("connecting_to");
    avMLLangStr[80] = translator("start_avi_recording");
    avMLLangStr[81] = translator("stop_avi_recording");
    avMLLangStr[82] = translator("start_mp4_recording");
    avMLLangStr[83] = translator("stop_mp4_recording");
    avMLLangStr[84] = translator("mp4_recording_disabled_permission_insufficient");
    avMLLangStr[85] = translator("connect_failed");
    avMLLangStr[86] = translator("talk_disable");
    avMLLangStr[87] = translator("color");
    avMLLangStr[88] = translator("invalid_prefix_name");
    avMLLangStr[89] = translator("show_the_motion_regions_and_trajectories");
    avMLLangStr[90] = translator("hide_motion_regions_and_trajectories");
    avMLLangStr[91] = translator("joystick_settings");
    avMLLangStr[92] = translator("selected_joystick");
    avMLLangStr[93] = translator("calibrate");
    avMLLangStr[94] = translator("configure_buttons");
    avMLLangStr[95] = translator("ok");
    avMLLangStr[96] = translator("cancel");
    avMLLangStr[97] = translator("apply");
    avMLLangStr[98] = translator("buttons_configuration");
    avMLLangStr[99] = translator("assign_actions");
    avMLLangStr[100] = translator("actions");
    avMLLangStr[101] = translator("button");
    avMLLangStr[102] = translator("assigned_actions");
    avMLLangStr[103] = translator("assign");
    avMLLangStr[104] = translator("clear_selected");
    avMLLangStr[105] = translator("toogle_play_pause");
    avMLLangStr[106] = translator("stop_streaming");
    avMLLangStr[107] = translator("snapshot");
    avMLLangStr[108] = translator("fullscreen");
    avMLLangStr[109] = translator("start_stop_recording");
    avMLLangStr[110] = translator("pan");
    avMLLangStr[111] = translator("patrol");
    avMLLangStr[112] = translator("stop");
    avMLLangStr[113] = translator("digital_output_on");
    avMLLangStr[114] = translator("digital_output_off");
    avMLLangStr[115] = translator("preset");
    avMLLangStr[116] = translator("assign_button");
    avMLLangStr[117] = translator("please_select_the_button_from_the_list");
    avMLLangStr[118] = translator("this_button_is_already_assigned_to");
    avMLLangStr[119] = translator("zoom_in");
    avMLLangStr[120] = translator("zoom_out");

    obj.SetGivenLangInfo(vMLCodePage, vMLFontSize, vMLCharSet, vMLPitch, vMLSwiss, vMLFontName);
    for (i = 0; i < avMLLangStr.length; i++) 
        obj.SetLangString(i, avMLLangStr[i]);
    obj.Language = "update";
    if (obj.Connect() == 0) return true;
}

function SetWinLessPluginString(obj)
{
    var i;
    var vMLCodePage = parseInt(translator("vmlcodepage")); //Interger
    var vMLFontSize = parseInt(translator("vmlfontsize")); //Interger
    var vMLCharSet = parseInt(translator("vmlcharset"));   //Interger
    var vMLPitch = parseInt(translator("vmlpitch"));       //BOOL
    var vMLSwiss = parseInt(translator("vmlswiss"));       //BOOL
    var vMLFontName = translator("vmlfontname");           //String
    var avMLLangStr = new Array(61);
    
    avMLLangStr[0] = translator("connecting_to")+" %s";
    avMLLangStr[1] = translator("connecting_to");
    avMLLangStr[2] = translator("buffering");   
    avMLLangStr[3] = translator("audio_disabled");    
    avMLLangStr[4] = translator("audio_only");
    avMLLangStr[5] = translator("no_sound_card");
    avMLLangStr[6] = translator("_system");
    avMLLangStr[7] = translator("warning");
    avMLLangStr[8] = translator("could_not_initialize_audio_capture_device");
    avMLLangStr[9] = "Two way audio is being used by another user. Please try again later.";
    avMLLangStr[10] = translator("the_upstream_audio_connection_is_not_allowed");
    avMLLangStr[11] = "The upstream audio connection is disabled.";
    avMLLangStr[12] = "Invalid username or password!";
    avMLLangStr[13] = "Connection is failed!";
    avMLLangStr[14] = translator("connection_is_closed");
    avMLLangStr[15] = translator("connections_already_exceed_the_limit");
    avMLLangStr[16] = translator("the_downstream_audio_connection_is_not_allowed_because_the_media_from_server_contains_no_audio");
    avMLLangStr[17] = translator("the_media_type_has_been_changed_to_video_only_because_the_media_from_server_contains_no_audio");
    avMLLangStr[18] = translator("because_the_network_environment_problem_transmission_mode_changes_to_unicast");
    avMLLangStr[19] = translator("because_the_network_environment_problem_transmission_protocol_changes_to_tcp");
    avMLLangStr[20] = "Because the connection problem of network environment,\ntransmission protocol changes to HTTP.";
    avMLLangStr[21] = translator("path_does_not_exist");
    avMLLangStr[22] = translator("path_cannot_be_empty");
    avMLLangStr[23] = translator("invalid_prefix_name");
    avMLLangStr[24] = translator("system_error");
    avMLLangStr[25] = "Failed to save settings or failed to load registry files!";
    avMLLangStr[26] = translator("settings_saved");
    avMLLangStr[27] = translator("save_parameter_fail");    
    avMLLangStr[28] = translator("recording_failed");
    avMLLangStr[29] = translator("recording_stop_because_disk_full_or_write_fail");    
    avMLLangStr[30] = translator("version_information");
    avMLLangStr[31] = translator("joystick_settings");
    avMLLangStr[32] = translator("selected_joystick");
    avMLLangStr[33] = translator("calibrate");
    avMLLangStr[34] = translator("configure_buttons");
    avMLLangStr[35] = translator("ok");
    avMLLangStr[36] = translator("cancel");
    avMLLangStr[37] = translator("apply");
    avMLLangStr[38] = translator("buttons_configuration");
    avMLLangStr[39] = translator("assign_actions");
    avMLLangStr[40] = translator("actions");
    avMLLangStr[41] = translator("button");
    avMLLangStr[42] = translator("assigned_actions");
    avMLLangStr[43] = translator("assign");
    avMLLangStr[44] = translator("clear_selected");
    avMLLangStr[45] = translator("toogle_play_pause");
    avMLLangStr[46] = translator("stop_streaming");
    avMLLangStr[47] = translator("snapshot");
    avMLLangStr[48] = translator("fullscreen");
    avMLLangStr[49] = translator("start_stop_recording");
    avMLLangStr[50] = translator("pan");
    avMLLangStr[51] = translator("patrol");
    avMLLangStr[52] = translator("stop");
    avMLLangStr[53] = translator("digital_output_on");
    avMLLangStr[54] = translator("digital_output_off");
    avMLLangStr[55] = translator("preset");
    avMLLangStr[56] = translator("assign_button");
    avMLLangStr[57] = translator("please_select_the_button_from_the_list");
    avMLLangStr[58] = translator("this_button_is_already_assigned_to")+" (%s)";
    avMLLangStr[59] = translator("zoom_in");
    avMLLangStr[60] = translator("zoom_out");

    obj.SetGivenLangInfo(vMLCodePage, vMLFontSize, vMLCharSet, vMLPitch, vMLSwiss, vMLFontName);
    for (i = 0; i < avMLLangStr.length; i++) 
        obj.SetLangString(i, avMLLangStr[i]);
    //obj.Language = "update";
    if (obj.Connect() == 0)
    {
    	obj.UseBitmap = 0;
    	return true;
    }
}


function CheckEmptyString(input)
{
	if(input.value=="")
	{
		alert(translator("field_cannot_be_empty"));
		input.focus();
		input.select();
		return -1;
	}
	return 0;
}

function getCheckedValue(radioObj) {
	if(!radioObj)
		return "";
	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

function CountLength(String)
{
    var CurCharLen = 0;
    var MaxCharLen = 40;

    for (var i = 0; i < String.length; i++)
    {
        var AsciiValue = String.charCodeAt(i);
        if (AsciiValue < 128)
        {
            CurCharLen ++;
        }       
        else if (AsciiValue < 256)
        {
            CurCharLen += 2;
        }
        else
        {
            CurCharLen += 3;
        }
    }
    return CurCharLen;
}
function checkHHMMSS(input)
{
	var filter=/\d\d:\d\d:\d\d/;
	if (!filter.test(input.value)){
		alert(translator("please_enter_a_valid_complete_time"));
		input.focus();
		input.select();
		return -1;
	}
	input.value = input.value.match(filter)[0];
	sub_item = input.value.split(":");
	if (((parseInt(sub_item[0], 10) > 23) || (parseInt(sub_item[0], 10) < 00)) ||
		((parseInt(sub_item[1], 10) > 59) || (parseInt(sub_item[1], 10) < 00)) ||
		((parseInt(sub_item[2], 10) > 59) || (parseInt(sub_item[2], 10) < 00)))
	{
		alert(translator("please_enter_a_valid_complete_time"));
		input.focus();
		input.select();
		return -1;
	}
	
	return 0;
}

function checkYYYYMMDD(input)
{
	var filter=/\d\d\d\d\/\d\d\/\d\d/;
	if (!filter.test(input.value)){
		alert(translator("please_enter_a_valid_date"));
		input.focus();
		input.select();
		return -1;
	}
	input.value = input.value.match(filter)[0];
	sub_item = input.value.split("/");
	if (((parseInt(sub_item[0], 10) > 2035) || (parseInt(sub_item[0], 10) < 2000)) ||
		((parseInt(sub_item[1], 10) > 12) || (parseInt(sub_item[1], 10) < 01)) ||
		((parseInt(sub_item[2], 10) > 31) || (parseInt(sub_item[2], 10) < 01)))
	{
		alert(translator("please_enter_a_valid_date"));
		input.focus();
		input.select();
		return -1;
	}
	
	return 0;
}
// validSuffix is a comma-separated string
function checkSuffix (fileobj, validSuffix)
{
	var suffix = fileobj.value.split(".");
	suffix = suffix[suffix.length - 1].toLowerCase();
	validSuffix = validSuffix.split(",");
	for (var i=0; i < validSuffix.length; i++)
	{
		if (suffix == validSuffix[i])
		{
			return 0;
		}
	}

	return -1;
}

function switchBlock(block, icon, cb)
{

	var aBlock = document.getElementById(block);
	var aIcon = document.getElementById(icon);
	
	if (aIcon.src.indexOf("/pic/rightArrow.gif") != -1)
	{
		//aBlock.style.display = "block";
		//SlideToggle(aBlock,"Auto","Slide");
		//$('#'+block).slideToggle("slow", cb);
		$('#'+block).slideToggle("slow" ,function(){
			//2011/01/06 ken, this is for buggy IE7, triggers hasLayout on IE7 for div contained in block has layout
			$('#'+block).css("zoom", "1"); 
		});
		aIcon.src = "/pic/downArrow.gif";
	}
	else
	{
		//aBlock.style.display = "none";
		//SlideToggle(aBlock,"Auto","Slide");
		//$('#'+block).slideToggle("slow", cb);
		$('#'+block).slideToggle("slow",function(){
			//2011/01/06 ken, this is for buggy IE7, triggers hasLayout on IE7 for div contained in block has layout
			$('#'+block).css("zoom", "1");
		});
		aIcon.src = "/pic/rightArrow.gif";
	}
}

function addPluginEventEX(obj,evt,fn,id) {
	var func = function() {fn()};
	if (window.addEventListener)
		obj.addEventListener(evt,func,false);
	else if (window.attachEvent)
		obj.attachEvent('on'+evt,func);
}


function addPluginEvent(obj,evt,fn)
{
	if (window.attachEvent)
	{
		obj.attachEvent('on'+evt,fn);
	}
	else if (window.addEventListener)
	{
		obj.addEventListener(evt,fn,false);
	}
}

function removePluginEvent(obj,evt,fn)
{
	if (window.removeEventListener)
		obj.removeEventListener(evt,fn,false);
	else if (window.detachEvent)
		obj.detachEvent('on'+evt,fn);
}

function createCSS(selector, declaration, bOptionPage)
{
    // test for IE
    var ua = navigator.userAgent.toLowerCase();
    var isIE = (/msie/.test(ua)) && !(/opera/.test(ua)) && (/win/.test(ua));
    
    // create the style node for all browsers
    var style_node = document.createElement("style");
    style_node.setAttribute("type", "text/css");
    style_node.setAttribute("media", "screen");
    
    // append a rule for good browsers
    if (!isIE) 
        style_node.appendChild(document.createTextNode(selector + " {" + declaration + "}"));
    
    if (bOptionPage != "1") 
    {
        if (document.all) 
        {						
            // use alternative methods for IE
            if (isIE && document.styleSheets && document.styleSheets.length > 0) 
            {
                var last_style_node = document.styleSheets[document.styleSheets.length - 1];
                if (typeof(last_style_node.addRule) == "object") 
                    last_style_node.addRule(selector, declaration);
            }
        }
        else 
        {
            // append the style node
            document.getElementsByTagName("head")[0].appendChild(style_node);
        }
    }
    else 
    {
        var iframe;
        if (document.frames) 
            iframe = document.frames[0];
        else 
            iframe = window.frames[0];
        
        if (document.all) 
        {
            if (isIE && document.styleSheets && document.styleSheets.length > 0) 
            {
                var last_style_node = window.frames[0].document.styleSheets[window.frames[0].document.styleSheets.length - 1];
                if (typeof(last_style_node.addRule) == "object")
								{
									last_style_node.addRule(selector, declaration);
									//alert('in');
								}
                    
            }
        }
        else 
        {
            // append the style node
            window.frames[0].document.getElementsByTagName("head")[0].appendChild(style_node);
        }
    }
}

function updateConfPageColor()
{		
	switch(layout_theme_option)
	{
		case "1":				
				document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/blue_theme_conf.css\" media=\"all\"/>");
				break;
				
		case "2":
				document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/gray_theme_conf.css\" media=\"all\"/>");		
				break;

		case "3":
				document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/black_theme_conf.css\" media=\"all\"/>");		
				break;
				
		case "4":
				createCSS("div#config","color: " + layout_theme_color_configbackground,'0');
				createCSS(".confGroup","background-color: " + layout_theme_color_configbackground,'0');
				createCSS(".confCase","background-color: " + layout_theme_color_case,'0');	
				createCSS(".conf_sidenav_bg","background-color: " + layout_theme_color_configbackground,'0');									
				createCSS("body","background-color: " + layout_theme_color_controlbackground,'0');
				createCSS(".confSubpageGroup","background-color: " + layout_theme_color_configbackground,'0');
				//createCSS(".confCase","border-color: " + layout_theme_color_case,'0');

				createCSS("#navi","color: " + layout_theme_color_configbackground,"0");
				createCSS("#navi li a","color: " + layout_theme_color_configbackground,"0");
				createCSS("#navi .naviSelect","background-color: " + layout_theme_color_configbackground,"0");
				createCSS("#navi .naviSelect a","color: #fff","0");

				break;
		default:
				break;			
	}	
}

function updateLogoInfo()
{
	layout_logo_link = "http://www.vivotek.com";
	var logoElement = document.getElementById("logo");
	var wraptocenter = "<div class='wraptocenter wraptocenter_logo'><span></span>";
	var logo_src = "/pic/VIVOTEK_Logo.gif";
	
    var formalLink = layout_logo_link;
    if ((formalLink.indexOf("http://") != 0) &&
        (formalLink.indexOf("https://") != 0))
    {
        formalLink = "http://" + formalLink;
    }
    
	if (logoElement != null) 
	{		
		logo_src = "/pic/VIVOTEK_Logo.gif";
	}		
	logoElement.innerHTML = wraptocenter + "<a href=\"" + formalLink + "\" target=\"_blank\"><img alt=\"logo\" src=\"" + logo_src + "\" /></a></div>";
}	

function updatePowerByVVTKLogo()
{
	var logoElement = document.getElementById("sidebar-footer");
	var powerbyvvtk_logo_src = "/pic/PowerByVIVOTEK.gif";

	if (layout_logo_powerbyvvtk_hidden == 0)
	{
		logoElement.innerHTML = "<span></span><img src=\"" + powerbyvvtk_logo_src + "\" />";
	}
}

function resizeLogo()
{
		var custom_logo_img = document.getElementById("logo").getElementsByTagName("img")[0];
		var nodewith = 0,nodeheight = 0;
		
		var widthRatio = custom_logo_img.width / 160;
		var heightRatio = custom_logo_img.height / 50;
		if(widthRatio > 1 || heightRatio > 1)
		{			
			var param = (heightRatio>widthRatio)?".height='50'":".width='160'";
			eval('document.getElementById("logo").getElementsByTagName("img")[0]' + param);
		}		    
}

/* ULTRA-SIMPLE EVENT ADDING */
function addEventSimple(obj,evt,fn) {
	if (obj.addEventListener)
		obj.addEventListener(evt,fn,false);
	else if (obj.attachEvent)
		obj.attachEvent('on'+evt,fn);
}

function removeEventSimple(obj,evt,fn) {
	if (obj.removeEventListener)
		obj.removeEventListener(evt,fn,false);
	else if (obj.detachEvent)
		obj.detachEvent('on'+evt,fn);
}

function loadTranslator()
{
	var XMLHttpRequestTranslator = false;
	var XMLHttpRequestState = false;
	var XMLHttpRequestCustomTranslator = false;
	if (window.XMLHttpRequest)
	{
		XMLHttpRequestTranslator = new XMLHttpRequest();
		XMLHttpRequestCustomTranslator = new XMLHttpRequest();
		XMLHttpRequestNowTranslator = new XMLHttpRequest();
		XMLHttpRequestState = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		XMLHttpRequestTranslator = new ActiveXObject("Microsoft.XMLHTTP");
		XMLHttpRequestCustomTranslator = new ActiveXObject("Microsoft.XMLHTTP");
		XMLHttpRequestNowTranslator = new ActiveXObject("Microsoft.XMLHTTP");
		XMLHttpRequestState = new ActiveXObject("Microsoft.XMLHTTP");
	}
	/*
	//custom_translator_ok = 1  : "custom_translator.xml" file exists and isn't empty.
	custom_translator_ok = 0;
	XMLHttpRequestState.open("GET", "/cgi-bin/viewer/getparam.cgi?system_info_customlanguage_count&layout&system_info_language_count", false);
	XMLHttpRequestState.setRequestHeader("If-Modified-Since","0");
	XMLHttpRequestState.send(null);
	eval(XMLHttpRequestState.responseText);
	
	if(system_info_customlanguage_count > 0) //custom_translator.xml == empty file -> IE6 fail, IE7 return 204, Fx return 200, 
	{
		XMLHttpRequestCustomTranslator.open("GET", "/include/custom_translator.xml", false);
		XMLHttpRequestCustomTranslator.send(null);
		if (XMLHttpRequestCustomTranslator.status == 200)
			custom_translator_ok = 1;
	}
	*/
	XMLHttpRequestNowTranslator.open("GET", "./include/translator.xml", false);
	XMLHttpRequestNowTranslator.setRequestHeader("If-Modified-Since",0);
	XMLHttpRequestNowTranslator.send(null);
	xmlDocLang=XMLHttpRequestNowTranslator.responseXML;
	
	if(lan == 100) //lan=100 for custom_translator
	{	
		if (custom_translator_ok != 1)
		{
			alert(translator("fail_to_load_custom_translator"));
			// Set to default lan
            setCookie("lan", 0);
            location.reload();
		}
		else
		{
            xmlDocLang=XMLHttpRequestCustomTranslator.responseXML;
		}
	}
}


var bSaved = false;
function checkOnClose(elem)
{
	if(bSaved == true)
	{
		if(opener == null) //for normal Browser, eg: Firefox
		{
			window.close();
			return -1;
		}			
		else if(typeof(opener.location.reload) == "unknown") //For stupid IE
		{
			window.close();
			return -1;			
		}
		opener.location.reload();
		window.close();
	}
	else 
	{
		if(window.closed == true) //refresh event cause onunload
		{
			window.close();
		}
		else if(typeof(elem) != "undefined" && elem.id == "btn_close")
		{
			window.close();
		}
	}
}

/* for thickbox close*/
function thickbox_close(elem)
{
	if(bSaved == true)
	{
		parent.location.reload();
		self.parent.tb_remove();
	}
	else 
	{
		if(typeof(elem) != "undefined" && elem.id == "btn_close")
		{
			parent.location.reload();
			self.parent.tb_remove();
		}
	}	
}

/* for event server and media close*/
function svr_media_close(elem)
{
	if(bSaved == true)
	{
		if (parent.location.href.search("event.html") > 0)
		{
			parent.location += '&step=3'
			parent.location.reload();
		}
		else
		{
			parent.location.reload();
			self.parent.tb_remove();
		}
	}
	else 
	{
		if(typeof(elem) != "undefined" && elem.id == "btn_close")
		{
			//parent.location.reload();
			if (parent.location.href.search("event.html") > 0)
			{
				$(parent.document.getElementById('action-menu')).children('ul').children('li').css({"background":"#C4EAFF url('/pic/action-down-arrow.png') no-repeat right center", "border-bottom":"1px solid #BFBAB0", "padding-bottom":"5px"});
				$(parent.document.getElementById('server-media')).slideUp(500);
			}
			else
			{	
				parent.location.reload();
				self.parent.tb_remove();
			}
		}
	}	
}

// load translator
loadTranslator();

var XMLHttpRequestObject = false;
if (window.XMLHttpRequest)
	XMLHttpRequestObject = new XMLHttpRequest();
else if (window.ActiveXObject)
	XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
XMLHttpRequestObject.onreadystatechange = receiveparam;

// 0 is basic mode, 1 is advanced mode

var g_mode = getCookie("g_mode");

// initialization for all Configuration Page
//if( location.href.indexOf(".html") != -1 && location.href.indexOf("index.html") == -1) {	updateConfPageColor(layout_theme_option);}
document.write("<script type='text/javascript' src='/niftycube.js'></script>");
//document.write("<link rel='stylesheet' href='/css/jquery-ui-themeroller.css' type='text/css' media='screen'/>");
document.write("<script type='text/javascript' src='/include/jquery.js'></script>");
//document.write("<script type='text/javascript' src='/include/jquery-ui-personalized-1.5.js'></script>");

function sleep(milliseconds)
{
    var start = new Date().getTime();
    while (new Date().getTime() < start + milliseconds);
}

function blockUI(msg)
{
    $.blockUI({ css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: 0.5, 
        color: '#fff' 
        },
        fadeIn: 0,
        fadeOut: 0,
        message: msg
    });
}

/* tabs ui */
function tabsUI(aTab) {
	var selectTab = (aTab == undefined ? 0 : aTab);
	//insert the border line under the tabs area
	$(".tabs").append("<div class='tab-bottom-line'></div>")
	
	//disable the anchor 
	$(".tabs a").click(function(e){
		e.preventDefault();
	});
		
	$(".tab-page").eq(selectTab).css("display","block");
	$(".tabs li").eq(selectTab).css({"z-index":"2", "background-color":"#fff"});
	$(".tabs li").eq(selectTab).children("a").css("color" , "#0186d1");
	
	$(".tabs ul li").click(function(){
		$(".tab-page").css("display","none");
		$(".tabs li").css({"z-index":"0", "background-color":"#d3d3d3"});
		$(".tabs li a").css({"color":"#666"});
		$($(this.childNodes).attr("href")).css("display","block");
		this.style.zIndex = 2;
		this.style.backgroundColor = "#fff";
		$(this).children("a").css("color" , "#0186d1");
	});
}

function langSelect()
{
	var customizedIndex;
	var str_html = "<div><ul id='lang'>";

	// Normal language
	var normalCount = eval(system_info_language_count);
	for (i = 0; i < normalCount ; i++)
	{
		str_html += "<li><a href='javascript:changlan("+ i +")'><span title='param'>system_info_language_i" + i + "</span></a></li>";
	}

	// Customized language
	customizedIndex = normalCount;
	var customizedCount = eval(system_info_customlanguage_count);
	if (custom_translator_ok == 1)
	{
		for (i = 0; i < customizedCount ; i++)
		{
			str_html += "<li><a href='javascript:changlan("+ (customizedIndex+i) +")'><span title='param'>system_info_customlanguage_i" + i + "</span></a></li>";
		}
	}
	str_html += "</ul></div>";
	
	$("#navi").after(str_html);
	
	$("body").click(
		function(){
			$("#lang").css("display", "none");
		}
	);
	$("#navi ul li").eq(2).click(
		function(event){
			event.stopPropagation();
			$('#lang').css('display', 'block');
			if (lan < 100)
			{
				$('#lang li').eq(lan).children().css({"color":"#ff6600", "background":"#c4eaff"})
			}
			else
			{
				$('#lang li').eq(normalCount).children().css({"color":"#ff6600", "background":"#c4eaff"})
			}
		}
	);
}

function changlan(seleted_lan)
{
	if (seleted_lan == system_info_language_count) 
	{
		if (custom_translator_ok) 
		{
			setCookie("lan", 100);
		}
		else 
		{
			alert(translator(fail_to_load_custom_translator.xml));
			setCookie("lan", 0);
		}
	}
	else 
	{
		setCookie("lan", seleted_lan);
	}
	lan = getCookie("lan");
	location.reload();
}

function getLastStreamSource()
{
	pkgname = location.pathname.split('/')[1];
	eval("streamnum=capability_nmediastream");
	if (pkgname === "Counting")
	{
		streamsource = parseInt(streamnum)-1;   // rossini: use last stream
	}
	else
	{
		streamsource = parseInt(streamnum)-2;	//evan: SC8131 use stream 1
	}
	setCookie('streamsource', streamsource);
	
	eval("codectype=videoin_c0_s" + streamsource + "_codectype");

	if (codectype == "mjpeg")
		eval("AccessName=network_http_s" + streamsource + "_accessname");
	else //(codectype == "mpeg4") || (codectype == "h264")
		eval("AccessName=network_rtsp_s" + streamsource + "_accessname");
	
	if (eval("typeof(videoin_c0_s" + streamsource + "_streamtype) !== \"undefined\""))
	{
		//Penlin: set streamType first into Cookie
		eval("streamtype=videoin_c0_s" + streamsource + "_streamtype");
		setCookie('streamtype',streamtype);
	}
}

function pluginCreated()
{
	if(!bIsWinMSIE)
	{
		QtRegisterListener();
		QtSetupCheck();
		return;
	}
	if (document.getElementById(PLUGIN_ID).PluginBeCreated != true)
	{
		setTimeout('pluginCreated()', 100);
	}
}

function QtRegisterListener()
{
    var obj = document.getElementById(PLUGIN_ID);

    qtDurChangeCnt = 0;

    if (obj)
    {
        QtAddListener(obj, 'qt_durationchange', QtDurationChange, false);
        QtAddListener(obj, 'qt_timechanged', QtTimeChanged, false);
    }
}

var qtDurChangeCnt = 0;

function QtDurationChange()
{
    //console.log("QtDurationChange");
    qtDurChangeCnt = qtDurChangeCnt + 1;
} 

function QtTimeChanged()
{
    //console.log("QtTimeChanged");
    QtMicroAdjustArea();
} 

function QtAddListener(obj, evt, handler, captures)
{
    if (document.addEventListener)
        obj.addEventListener(evt, handler, captures);
    else
        // IE
        obj.attachEvent('on' + evt, handler);
}

function QtMicroAdjustArea()
{
    // When stream view size is larger than #showimageBlock, QuickTime 
    // can't show streaming after connection. And the root cause can't 
    // figured out! This workaround can make QuickTime show video after  
    // adjusting the size of plugin.

	var h = $("#" + PLUGIN_ID).height();
	var w = $("#" + PLUGIN_ID).width();

	$("#" + PLUGIN_ID).height(h - 1);
    $("#" + PLUGIN_ID).width(w - 1);
    
}

function QtSetupCheck()
{
    setTimeout("QtCheck()", 1000);
}

function QtCheck()
{
    // If quicktime use HTTP connection setting, it will cause 400 bad request error,
    // because the RTSP streaming server don't accept HTTP protocol under RTSP port.
    // In this stuation, only one 'qt_durationchange' events will be received. So if
    // this stuation is detected, we will use http port to reconnect streaming server
    // over HTTP instead of the default RTSP port.

    if (qtDurChangeCnt <= 1)
    {
        // Quicktime status string format:
        // "Status, ErrorNo: Error message"
        // Ex: "Complete, 400: Bad request"

        var qtErr = $("#" + PLUGIN_ID)[0].GetPluginStatus().split(", ")[1];

        if (qtErr)
        {
            var qtErrCode = qtErr.split(":")[0];

            if (qtErrCode == "400")
            {
                // Remove default Quicktime dom element and reconnect streaming server over HTTP
                //$("#" + PLUGIN_ID).remove();                
                //showimage_innerHTML('0', 'showimageBlock', true, false, true, network_http_port);

                $("#" + PLUGIN_ID).height(parseInt(Height+16));
                $("#" + PLUGIN_ID).width(parseInt(Width));
                $("#" + PLUGIN_ID).attr("SCALE", "ToFit");
                $("#" + PLUGIN_ID)[0].SetURL('rtsp://' + location.hostname + ':' + network_http_port + '/' + AccessName);

                QtRegisterListener();
            }
            else
            {
                // Fix me: Need to handle other errors??
                // console.log(qtErr);
            }
        }

        QtSetupCheck();
    }
}

function getProtocolURL(urlMode)
{
	var pcol;
	var url = document.URL;
	/* urlMode:1 get motion jpeg streaming url
	 *		   0 get WebSocket server url */
	if (url.substring(0, 5) == "https")
	{
		url = url.substr(8);
		if (urlMode == 0)
		{
			/*pcol = "wss://";
			url = url.split(/[/:]+/);
			url[0] = url[0] + ":" + eval("network_websocket_port");*/
			alert("WebSocket Server not support wss:// yet!");
			return;
		}
		else
		{
			pcol = "https://";
			url = url.split("/");
		}
	}
	else if (url.substring(0, 4) == "http")
	{
		url = url.substr(7);

		if (urlMode == 0)
		{
			pcol = "ws://";
			url = url.split(/[/:]+/);
			if (typeof(network_websocket_port) === "undefined")
			{
				network_websocket_port=777;
			}
			url[0] = url[0] + ":" + network_websocket_port;
		}
		else
		{
			pcol = "http://";
			url = url.split("/");
		}
	}
	else
	{
		alert("Input URL only support http/https protocol");
	}
	
	return pcol + url[0];
}

function WebSocketInfo(Interface, Callback)
{
	this.Interface = Interface;
	this.Instance;
	this.TODO = Callback;
	this.tryCount = 0;
	this.Init = false;
}

function StartWebSocket(WebSocketID)
{
	if (typeof MozWebSocket != "undefined")
	{
		WebSocketID.Instance = new MozWebSocket(getProtocolURL(0),
								WebSocketID.Interface);
	}
	else
	{
		WebSocketID.Instance = new WebSocket(getProtocolURL(0),
								WebSocketID.Interface);
	}

	try
	{
		WebSocketID.Instance.onmessage = function got_packet(msg)
		{
			WebSocketID.TODO(msg);
		}
	
		/* when browser has counting error,
		   we need reconnect websocket,
		   each 2 sec to try reconnect */
		WebSocketID.Instance.onopen = function()
		{
			WebSocketID.Init = true;
		}
		WebSocketID.Instance.onclose = function()
		{
			if (WebSocketID.tryCount < 2)
			{
				WebSocketID.tryCount++;
			}
			else if (!WebSocketID.Init)
			{
				alert("Connect WebSocket Failed, Please check firewall port" + eval("network_websocket_port") +  "for WebSocket.");
				return;
			}

			setTimeout(function(){StartWebSocket(WebSocketID);}, 2000);
		}
		WebSocketID.Instance.onerror = function()
		{
			WebSocketID.Instance.close();
		}
	}
	catch(exception)
	{
		alert('<p>Error' + exception);
	}
}

function closeWebSocket(WebSocketID)
{
	WebSocketID.Instance.close();
}

function isSpeedDome(ptzenabled)
{
	ptzenabledValue = parseInt(ptzenabled, 10);
	binaryResult = (ptzenabledValue >>> 0).toString(2);

	binaryResultLen = binaryResult.length;

	//bit 8(invalidate bit should be 0), 
	//bit 7(0:built-in PT; 1:external), bit 5(focus), bit 4(zoom), bit 3(tilt), bit 2(pan)
	if ((binaryResult.charAt(binaryResult.length - 9) != "1") &&(binaryResult.charAt(binaryResult.length - 8) != "1") && (binaryResult.charAt(binaryResult.length - 6) == "1") && (binaryResult.charAt(binaryResult.length - 5) == "1") && (binaryResult.charAt(binaryResult.length - 4) == "1") && (binaryResult.charAt(binaryResult.length - 3) == "1"))
	{
		return 1;
	}
	else
	{
		return 0;
	}
}

function getParamValueByName(paramName)
{
	var paramValue = null;

	try {
		paramValue = eval(paramName);
	} 
	catch (error) {
		//alert(error.message);
		return "";	
	}
	
        if (typeof(paramName) == 'undefined')
	{
		return "";
	}

	return paramValue;
}

function ParamUndefinedOrZero(par)
{
	try
	{
		if (eval(par) == "-")
		{
			return true;
		}
		
		if (eval(par) == "0")
		{
			return true;
		}
	}
	catch(err)
	{
		return true;
	}

	return false;
}
