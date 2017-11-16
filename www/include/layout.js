var g_headerHeight = 62;
var g_footerHeight = 32;
var g_layoutWidthMin = 780
var g_layoutWidthMax = 1280;

var fnAutoResizeWindow = function() {
	$('#content').height($(window).height() - g_headerHeight - g_footerHeight);

	if ($(window).width() < g_layoutWidthMin)
	{
		$('#container').width(g_layoutWidthMin);
	}
	else if ($(window).width() > g_layoutWidthMax)
	{
		$('#container').width(g_layoutWidthMax);
	}
	else
	{
		$('#container').width($(window).width());
	}
};

function setContentOne(page)
{
	var $iframe = $('#iframe_page');
	$iframe.attr('src', page.link);
	$iframe.attr('id', 'uniContent');
}

function setContentTwo(page)
{
    var cmd = '';
	var id, link, type;
	var defaultPage;
	var $sidenav, $mainContent, $iframe, $menu;
	
	if (!page['sidenav']['element'].hasOwnProperty('length')) // only one element 
	{
		alert("There are only one element in sidenav\nNo need to use sidenav!\n");
		return false;
	}

	for (var elementInd in page['sidenav']['element'])
	{
		type = page['sidenav']['element'][elementInd]['type'];
		if (type == 'arrow')
		{
			cmd += '<li><i class="icon-sort-down"></i></li>';
		}
		else if (type == 'link')
		{
			if (!page['sidenav']['element'][elementInd].hasOwnProperty('id'))
				continue;
			if (!page['sidenav']['element'][elementInd].hasOwnProperty('link'))
				continue;

			id 	 = page['sidenav']['element'][elementInd]['id'];
			link = page['sidenav']['element'][elementInd]['link'];
			
			cmd += '<li><a id="' + id.replace(/ /g,"") + '" href="' + link + '" target="iframe_page" onclick="menuSelected(this)">'+ id + '</a></li>';
		}
		else
		{
			alert("Do not support this type" + type.toString());
		}
	}

	$menu = $('<ul/>', { 'id': 'menu' });
	$menu.addClass('menu vertical');
	$menu.html(cmd);
	$sidenav = $('<div/>', { 'id': 'sidenav' });
	$sidenav.append($menu);

	$iframe = $('#iframe_page');
	$mainContent = $('<div/>', { 'id': 'mainContent' });
	$mainContent.append($iframe);

	$('#content').append($sidenav);
	$('#content').append($mainContent);	

	$('.menu.vertical li a:first').addClass('selected');
	$('#iframe_page').attr('src',$('.menu.vertical li a')[0].href);
	
}


function setContentLayout(layout)
{
	for (var element in layout)
	{
		if (location.pathname.match(element.toString() + '.html'))
		{
			if (layout[element].hasOwnProperty('link'))
			{
				setContentOne(layout[element]);
			}

			if (layout[element].hasOwnProperty('sidenav'))
			{
				setContentTwo(layout[element]);
			}
			break;
		}

		if (location.pathname.match('index.html'))
		{
			if (layout[element].hasOwnProperty('link'))
			{
				setContentOne(layout[0]);
			}

			if (layout[element].hasOwnProperty('sidenav'))
			{
				setContentTwo(layout[0]);
			}
			break;
		}
	}
}

function setHeaderMenu(layout)
{
	var cmd = '',
	    selectid = '';
	var wwwindex = window.location.href.indexOf('/www/'),
		htmlindex = window.location.href.indexOf('.html');
	for (var element in layout)
	{
		if (layout[element].hasOwnProperty('link') || layout[element].hasOwnProperty('sidenav'))
		{
			if (element == 'index')
			{
				continue;
			}
			else
			{
				var elementString = element.toString();
				var header = translator(element);
				var headerString = header.toString();
				cmd += '<li id="' + element + '"><a href="' + elementString + '.html' + '">' + header[0].toString().toUpperCase() + headerString.substr(1,headerString.length-1) + '</a></li>';
			}
		}
	}
	cmd += '<li class="float-right">'
		+ '<a href="http://' + window.location.host + '/setup/application/vadp.html" title="Exit">'
		+ '<img src="pic/close.png"></img>'
		+ '</a></li>';
	$('#headermenu').append(cmd);
	
	selectid = window.location.href.substring(wwwindex+5, htmlindex);
	if (selectid === 'index')
		selectid = 'liveview';
	$('#' + selectid).addClass('selected');
}

function setLayout()
{
	$.get('layout.xml', function(xml){
		var layout = $.xml2json(xml);
		document.title = xml.getElementsByTagName("root")[0].getAttribute("title");
		setHeaderMenu(layout);
		setContentLayout(layout);
		$('#content').height($(window).height() - g_headerHeight - g_footerHeight);
		setTimeout("$(window).bind(\"resize\", fnAutoResizeWindow);", 500);
	});
	
	if (sessionStorage.getItem("login"))
	{
		var login = sessionStorage.getItem("login").split(",");
		document.getElementById("usernameID").value = login[0];
		document.getElementById("passwordID").value = login[1];		
	}
}

function loginForm()
{
	$.blockUI({ message: document.getElementById('loginForm') });	
}

function pressKey(event)
{	
	if (event.keyCode == 13)
	{
		saveLogin();
	}
}

function saveLogin()
{
	$.unblockUI();
	var username = document.getElementById("usernameID").value;
	var password = document.getElementById("passwordID").value;
	var account = [username, password];
	sessionStorage.setItem("login", account);
	location.reload();
}

function cancelLogin()
{
	$.unblockUI();
}

function menuSelected(obj)
{
    $('.menu.vertical li a.selected').removeClass("selected");
	$('#' + obj.id).addClass("selected");
}

function sendCrossiFrameMessage(message, iframeurl)
{
    var target=document.getElementById("iframe_page");
	try 
	{  
        target.contentWindow.postMessage(message, iframeurl);  
    }
	catch(e) 
	{  
        //console.log(e); 
        return false;
    }
}
