function setLanguage(language) { //eslint-disable-line no-unused-vars
	document.cookie = "preferredLanguage="+language+"; expires=Fri, 10 Dec 2077 12:00:00 UTC";
	document.cookie = "preferredLanguage="+language+"; expires=Fri, 10 Dec 2077 12:00:00 UTC; path=/homepage";
	window.location.replace(window.location.href);
	//https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
	//https://www.phpied.com/files/location-location/location-location.html
	
	setTimeout(function () {
		window.location.reload(true);
		//This will execute if the href has a # at the end.
	}, 5000);
}