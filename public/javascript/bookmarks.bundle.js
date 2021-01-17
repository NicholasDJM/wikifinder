(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var fontColorContrast = function(hexColorOrRedOrArray, green, blue) {
  // Check if the color is hexadecimal (with hash)
  var hash = /#/;
  var isHex = hash.test(hexColorOrRedOrArray);
  var isRGB = green !== undefined && blue !== undefined ? true : false;
  var isArray = Array.isArray(hexColorOrRedOrArray);

  //Default is a bright color
  var fontColor = '#ffffff';
  var red = 0;

  if (isHex) {
    red = hexToDec(hexColorOrRedOrArray.substr(1, 2));
    green = hexToDec(hexColorOrRedOrArray.substr(3, 2));
    blue = hexToDec(hexColorOrRedOrArray.substr(5, 2));

  } else if (isRGB) {
    red = parseInt(hexColorOrRedOrArray);
    green = parseInt(green);
    blue = parseInt(blue);

  } else if (isArray) {
    red = parseInt(hexColorOrRedOrArray[0]);
    green = parseInt(hexColorOrRedOrArray[1]);
    blue = parseInt(hexColorOrRedOrArray[2]);

  } else {
    // Not a color, respond with white color
    return fontColor;
  }

  var contrast = Math.sqrt(
    red * red * .241 +
    green * green * .691 +
    blue * blue * .068
  );

  if (contrast > 130) {
    fontColor = '#000000';
  }

  return fontColor;
};

module.exports = fontColorContrast;

var hexToDec = function(hexString) {
  var decString = (hexString).replace(/[^a-f0-9]/gi, '')
  return parseInt(decString, 16)
}

},{}],2:[function(require,module,exports){
/*global Cookie Picker*/
//*
const contrast = require("font-color-contrast");
//*/
//window.onload = getBookmarks();
let bookmarksTotal = 0;
function getBookmarks() {
	let allCookies = Cookie.get();
	for (let i = 0; i < allCookies.length < i; i++) {
		if (allCookies[i] == "bookmark"+i) {
			let bookmark = Cookie.get("bookmark"+i);
			let bookmarkUrl = Cookie.get("bookmark"+i+"url");
			let bookmarkIcon = Cookie.get("bookmark"+i+"icon");
			addBookmark(bookmark, bookmarkUrl, bookmarkIcon, i+1);
			bookmarksTotal+=1;
		}
	}
}

function addBookmark(name, url, icon, color="#222222", edit=0){
	// Name: Name of bookmark
	// URL: Address for bookmark link
	// Icon: URL for bookmark icon image
	// Colour: Background if icon isn't used.
	// Edit: Bookmark Position (Internal variable, used when generating bookmarks or updating bookmark position.)
	let bookmarks = document.getElementById("bookmarks");
	let element = document.createElement("div");
	element.classList.add("col-1");
	element.classList.add("mx-4");
	element.classList.add("py-2");
	let num;
	if (edit>0){
		element.id = "bookmark"+edit;
		num = edit;
	} else {
		element.id = "bookmark"+bookmarksTotal+1;
		num = bookmarksTotal+1;
	}
	element.setAttribute("aria-labelledby", "bookmark"+num+"Text");
	element.setAttribute("draggable", "true");
	element.setAttribute("ondragstart", "startDrag(event)");
	element.setAttribute("ondragover", "allowDrop(event)");
	element.setAttribute("ondragleave", "leave(event)");
	element.setAttribute("ondrop", "moveBookmark(event)");
	element.setAttribute("ondragend", "endDrag(event)");
	element.setAttribute("oncontextmenu", "contextMenu(event)");
	bookmarks.insertBefore(element, document.getElementById("bookmarkadd"));
	bookmarksTotal=bookmarksTotal+1;
	let link = document.createElement("a");
	link.href = getHTTP(url);
	link.id = "bookmark"+bookmarksTotal+"link";
	element.appendChild(link);
	let iconDiv = document.createElement("div");
	iconDiv.style.backgroundColor=color;
	let iconDiv2 = document.createElement("div");
	if (icon == "") {
		iconDiv.classList.add("bookmark-no-icon");
		iconDiv.id = "bookmark"+num+"NoIconText";
		let iconDivText = document.createElement("p");
		console.log(color);
		console.log(contrast(rgb2hex(color)));
		iconDivText.style.color=contrast(rgb2hex(color));
		iconDiv.appendChild(iconDivText);
		let iconDivText2 = document.createTextNode(name.substring(0, 1));
		iconDivText.appendChild(iconDivText2);
	} else {
		if (!(icon.substring(0, 7)=="http://" || icon.substring(0, 8)=="https://")) {
			icon = "https://"+icon;
		}
		iconDiv.classList.add("bookmark");
		iconDiv2.classList.add("icon");
		iconDiv2.style.background = "url("+icon+") center no-repeat";
		if (iconContain) {
			iconDiv2.style.backgroundSize = "contain";
		}
	}
	link.appendChild(iconDiv);
	iconDiv.appendChild(iconDiv2);
	//if (icon=)
	let text = document.createElement("div");
	text.classList.add("bookmark-text");
	text.classList.add("pt-2");
	text.id = "bookmark"+num+"Text";
	let textNode = document.createTextNode(name);
	text.appendChild(textNode);
	link.appendChild(text);
	clearForm();
}

function getHTTP(url, secure=true) {
	if (url.substring(0, 7)=="http://" || url.substring(0, 8)=="https://") {
		return url;
	} else {
		if (secure) {
			return "https://"+url;
		} else {
			return "http://"+url;
		}
	}
}


function startDrag(event) {
	event.dataTransfer.setData("text/plain", event.target.id);
	document.getElementById("bookmarkadd-icon").classList.remove("bi-plus");
	document.getElementById("bookmarkadd-icon").classList.add("bi-gear");
	document.getElementById("bookmarkadd-text").style.display="none";
	document.getElementById("bookmarkadd-edit-text").style.display="";
	document.getElementById("bookmarkremove").style.display="block";
	event.dataTransfer.effectAllowed = "move";
	console.dir(event.target);
}

function allowDrop(event) {
	event.preventDefault();
	event.dataTransfer.dropEffect = "move";
}

function denyDrop(event) {
	event.preventDefault();
	event.dataTransfer.dropEffect = "none";
}

function leave(event) {
	
}

function moveBookmark(event) {
	event.preventDefault();
	let data = event.dataTransfer.getData("text/plain");
	event.target.insertBefore(document.getElementById(data));
}

function endDrag(event) {
	document.getElementById("bookmarkadd-icon").classList.remove("bi-gear");
	document.getElementById("bookmarkadd-icon").classList.add("bi-plus");
	document.getElementById("bookmarkadd-text").style.display="";
	document.getElementById("bookmarkadd-edit-text").style.display="none";
	document.getElementById("bookmarkremove").style.display="none";
}
function deleteBookmark(event) {
	event.preventDefault();
	let data = document.getElementById(event.dataTransfer.getData("text/plain"));
	//data.remove(data.childNodes[0]);
	console.dir(data);
	document.getElementById("debug-output").innerText = data.id;
}

let picker = new Picker({
	parent: document.getElementById("color-picker"),
	alpha: true,
	editor: true,
	color:"#222222ff",
	editorFormat: "hex",
});
function updateColorPickerPosition() {
	setTimeout(function () {updateColorPickerPosition();}, 100);
	let pos = document.getElementById("color-sample").getBoundingClientRect();
	let elem = document.getElementById("color-picker");
	elem.style.top=pos.top+"px";
	//console.log((pos.top-pos.height)+"px");
}
updateColorPickerPosition();
function updateNamePreview() {
	setTimeout(function () {updateNamePreview();}, 100);
	let name = document.getElementById("bookmark-name").value;
	let placeholder = document.getElementById("bookmark-name").placeholder;
	let elem=document.getElementById("bookmark-text-preview");
	if (name=="") {
		elem.innerText=placeholder;
	} else {
		elem.innerText=name;
	}
}
updateNamePreview();
let pickedColor;
picker.onClose = function (color) { // eslint-disable-line no-unused-vars
	picker.setColor(window.getComputedStyle(document.getElementById("color-sample"), null).getPropertyValue("background-color"), true);
};
picker.onChange = function (color) {
	pickedColor = color.rgbaString;
};
picker.onDone = function (color) { // eslint-disable-line no-unused-vars
	document.getElementById("color-sample").style.backgroundColor = pickedColor;
	picker.setColor(pickedColor, true);
};
let oldIconAddress="";
let stopUpdatingIconAddress=false;
function favicon(cb=false) {
	let c=cb.checked;
	if (c) {
		document.getElementById("bookmark-icon").readOnly = true;
		oldIconAddress = document.getElementById("bookmark-icon").value;
		setTimeout(function(){updateFaviconAddress();}, 100);
		stopUpdatingIconAddress=false;
	} else {
		document.getElementById("bookmark-icon").readOnly = false;
		document.getElementById("bookmark-icon").value = oldIconAddress;
		stopUpdatingIconAddress=true;
	}
}

function updateFaviconAddress() {
	if (!stopUpdatingIconAddress) {
		setTimeout(function(){updateFaviconAddress();}, 10);
		document.getElementById("bookmark-icon").value = document.getElementById("bookmark-url").value +"/favicon.ico";
	}
}
function updateNamePlaceholder() {
	setTimeout(function(){updateNamePlaceholder();}, 100);
	document.getElementById("bookmark-name").placeholder = document.getElementById("bookmark-url").value;
}
updateNamePlaceholder();

let iconContain = false;
function updateIconPreview() {
	setTimeout(function () {updateIconPreview();}, 100);
	document.getElementById("bookmark-icon-preview").style.background="url("+getHTTP(document.getElementById("bookmark-icon").value)+") no-repeat center";
	if (iconContain) {
		document.getElementById("bookmark-icon-preview").style.backgroundSize="contain";
	} else {
		document.getElementById("bookmark-icon-preview").style.backgroundSize="inital";
		
	}
}
updateIconPreview();
function iconPreviewContain(cb=false) {
	let c = cb.checked;
	if (c && document.getElementById("bookmark-icon-preview").style.backgroundSize!="contain") {
		iconContain = true;
	} else {
		iconContain = false;
	}
}

function clearForm(){
	document.getElementById("bookmark-name").value = "";
	document.getElementById("bookmark-url").value = "";
	stopUpdatingIconAddress = true;
	favicon();
	setTimeout(function(){
		document.getElementById("bookmark-icon-favicon").checked = false;
		document.getElementById("bookmark-icon").value = "";
	}, 11);
	document.getElementById("color-sample").style.backgroundColor = "#222222";
	picker.setColor("#222222ff", true);
	oldIconAddress = "";
	iconContain = false;
	document.getElementById("bookmark-icon-preview-contain").checked=false;
	document.getElementById("bookmark-edit").value = "";
	
}

function saveBookmark() { // eslint-disable-line no-unused-vars
	let name = document.getElementById("bookmark-name");
	addBookmark(name.value == ""?name.placeholder:name.value, document.getElementById("bookmark-url").value, document.getElementById("bookmark-icon").value, window.getComputedStyle(document.getElementById("color-sample"), null).getPropertyValue("background-color"));
}

//https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
function rgb2hex(rgb) {
	if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
window.clearForm=clearForm;
window.saveBookmark=saveBookmark;
window.favicon=favicon;
window.startDrag=startDrag;
window.allowDrop=allowDrop;
window.leave=leave;
window.moveBookmark=moveBookmark;
window.endDrag=endDrag;
window.deleteBookmark=deleteBookmark;
window.contrast=contrast;
window.iconPreviewContain=iconPreviewContain;
window.denyDrop=denyDrop;

console.log("bookmarks.js loaded.");
},{"font-color-contrast":1}]},{},[2]);
