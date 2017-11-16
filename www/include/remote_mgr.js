function loadCurrentSetting()
{
	XMLHttpRequestObject.open("GET", "../cgi-bin/extrainfo.cgi", true);
	XMLHttpRequestObject.setRequestHeader("If-Modified-Since","0");
	XMLHttpRequestObject.send(null);
	loadlanguage();
}

function creatRedirectOption()
{
	var vadpoption = vadp_module_name_and_url.split(",");
	var idx = system_mvaas_redirecturl;
	var select = document.getElementById('redirecturl');
	var opt = document.createElement("option");
	opt.value = 0;
	opt.innerHTML = "Home (index.html)";
	select.appendChild(opt);
	for(var i=1; i<=vadp_module_number; i++)
	{
		var opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = vadpoption[i-1];
		select.appendChild(opt);
	}
	if(select.options[idx] == null)
	{
		select.options[0].selected = true;
	}
	else
	{
		select.options[idx].selected = true;
	}
}

function receivedone()
{
	creatRedirectOption();
}

function switchMode()
{
	var aIcon = document.getElementById("advIcon");
	
	$('#alg_advanced_setting').slideToggle("slow",function(){
		$('#alg_advanced_setting').css("zoom", "1"); 
	});
			
	if (aIcon.src.indexOf("/pic/rightArrow.gif") != -1)
	{
		aIcon.src = "/pic/downArrow.gif";
	}
	else
	{
		aIcon.src = "/pic/rightArrow.gif";
	}
}

function submitform()
{
	//var form = document.forms[0];
	/*
	var Alert = 0;
	var serverport = jQuery('input[name="system_mvaas_registerserver_port"]').val();
	var logport = jQuery('input[name="system_mvaas_logserver_port"]').val();
	if ((serverport != 443 && (serverport < 1025 || serverport > 65535)) || (logport != 8833 && (logport < 1025 || logport > 65535))){
		alert("Server port range is 443, 1025 ~ 65535\nLog server port range is 1025 ~ 65535");
		Alert = 1;
	}
	if (Alert != 1){
		$.post('../cgi-bin/set_param.cgi', $('#system_form').serialize());
	}*/
	if (checkvalue() == 0)
	{
		$.post('../cgi-bin/set_mvaas_param.cgi',
			$('#system_form').serialize(),
			function(data)
			{
				if (data.indexOf("full") != -1)
				{
					alert("Referer list is full");
				}
			}
			);
	}

	//form.submit();
}
