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
function isStr (str) {
  return typeof str === 'string'
}

module.exports = {
  encode (str = '') {
    if (!isStr(str)) {
      throw new Error('Please provide string to encode.')
    }

    return encodeURIComponent(str).replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/%20/g, '+')
  },

  decode (str = '') {
    if (!isStr(str)) {
      throw new Error('Please provide string to decode')
    }

    return decodeURIComponent((str).replace(/\+/g, '%20'))
  }
}

},{}],3:[function(require,module,exports){
/*global Picker bootstrap hideContextMenu*/
/*


######    #####    #####   ##   ##  ##   ##    ###   ######   ##   ##          #######   ######
##   ##  ##   ##  ##   ##  ## ###   ### ###   #   #  ##   ##  ## ###              #     #
######   ##   ##  ##   ##  ###      ## # ##  ####### ######   ####                #      #####
##   ##  ##   ##  ##   ##  ## ###   ##   ##  ##   ## ##  ##   ## ###     ##    #  #           #
######    #####    #####   ##   ##  ##   ##  ##   ## ##   ##  ##   ##    ##     ##      ######


//*/
// TODO: Move event listeners from HTML to Javascript, concat contextMenu.js, bookmark.js and sidebar.js to main.bundle.js via browserify
function getBookmarkTotal() {
	let number = Number.parseInt(localStorage.getItem("totalBookmarks"));
	if (Number.isNaN(number)){
		localStorage.setItem("totalBookmarks", 0);
		return 0;
	}
	return number;
}

function getHTTP(url, secure=true) {
	if (url.slice(0, 7)=="http://" || url.slice(0, 8)=="https://") {
		return url;
	} else {
		return secure ? "https://"+url : "http://"+url;
	}
}

//https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
function rgb2hex(rgb) {
	if (/^#[\da-f]{6}$/i.test(rgb)) return rgb;

	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) { //eslint-disable-line unicorn/consistent-function-scoping
		return ("0" + Number.parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
let oldIconAddress="";
let stopUpdatingIconAddress=false;
let faviconUpdateTime = 10; // Milliseconds
window.addEventListener("load", () => {
	const defaultPickerColor=window.getComputedStyle(document.documentElement).getPropertyValue("--background-color");
	const contrast = require("font-color-contrast");
	const { encode } = require("url-encode-decode");
	/*
	
	
	######    #####    #####   ##   ##  ##   ##    ###   ######   ##   ##   ######
	##   ##  ##   ##  ##   ##  ## ###   ### ###   #   #  ##   ##  ## ###   ##
	######   ##   ##  ##   ##  ###      ## # ##  ####### ######   ####      #####
	##   ##  ##   ##  ##   ##  ## ###   ##   ##  ##   ## ##  ##   ## ###        ##
	######    #####    #####   ##   ##  ##   ##  ##   ## ##   ##  ##   ##  ######
	
	
	//*/
	function getBookmarks() {
		const total = getBookmarkTotal();
		if (total>0) {
			for (let index = 1; index < total+1; index++) {
				let data = JSON.parse(localStorage.getItem("bookmark"+index));
				addBookmark(data.name, data.url, data.iconBase64, data.iconData, data.color, index, false);
			}
		}
	}
	getBookmarks();
	
	function saveBookmarkData(name, url, iconBase64, iconData, backgroundColor, position=0) {
		if (position==0){
			position = getBookmarkTotal()+1;
		}
		console.log("Saving...");
		let bookmarkData={
			name: name,
			url: url,
			iconBase64: iconBase64,
			iconData: iconData,
			color: backgroundColor,
		};
		localStorage.setItem("bookmark"+position, JSON.stringify(bookmarkData));
		localStorage.setItem("totalBookmarks", getBookmarkTotal()+1);
		console.log("name: "+name, "url: "+url, "iconBase64: "+iconBase64, "iconData: "+iconData, "color: "+backgroundColor, "position: "+position);
		console.log("getting saved data...");
		console.log(localStorage.getItem("bookmark"+position));
	}

	function deleteBookmark(elementId) {
		// deleteBookmark requires the Element Object Id, not a number.
		// <div id="bookmark"> We need this id,
		// div data-bookmark="1"> NOT THIS
		// TODO: Remove element from page and data from Web Storage.
		console.log(elementId);
		deleteBookmarkData(document.querySelector(elementId).getAttribute("data-bookmark"));
		document.querySelector(elementId).remove();
	}
	
	function deleteBookmarkData(id) {
		if (!Number.isInteger(Number.parseInt(id))) {
			console.error("ID must be an integer. Got", typeof(Number.parseInt(id)));
			console.log(Number.isInteger(Number.parseInt(id)));
			console.log(id);
			return;
		}
		if (getBookmarkTotal()==0) {
			console.log("Cannot delete bookmark. Bookmark Total is 0.");
			return;
		}
		console.log("Removing bookmark"+Number.parseInt(id)+" from localStorage...");
		localStorage.setItem("totalBookmarks", getBookmarkTotal()-1);
		localStorage.removeItem("bookmark"+id);
	}
	// TODO: Encode icon URL, send a fetch call to ''/encode?url=', and then save the Base64 string to localStorage.
	async function addBookmark(name, url, icon, iconData, color=defaultPickerColor, edit=0, save=true){
		// Name: Name of bookmark.
		// URL: Address for bookmark link.
		// IconData:
		//     Contain: Constrict icon size to fit bookmark button.
		//     IconUrl: URL for bookmark icon image.
		// Colour: Background if icon isn't used.
		// Edit: Bookmark Position (Internal variable, used when generating bookmarks or updating bookmark position.)
		let bookmarks = document.querySelector("#bookmarks");
		let element = document.createElement("div");
		let number = getBookmarkTotal();
		element.classList.add("col-1");
		element.classList.add("mx-4");
		element.classList.add("py-2");
		if (edit>0){
			number = edit;
		}
		element.id = "bookmark"+number;
		//console.log("function addBookmark: Number "+number);
		element.setAttribute("aria-labelledby", "bookmark"+number+"Text");
		element.setAttribute("draggable", "true");
		element.setAttribute("ondragstart", "startDrag(event)");
		element.setAttribute("ondragover", "allowDrop(event)");
		element.setAttribute("ondragleave", "onDragLeave(event)");
		element.setAttribute("ondrop", "moveBookmark(event)");
		element.setAttribute("ondragend", "endDrag()");
		element.setAttribute("oncontextmenu", "window.contextMenu(event)");
		element.setAttribute("data-bookmark", number);
		bookmarks.insertBefore(element, document.querySelector("#bookmarkadd"));
		let link = document.createElement("a");
		link.href = getHTTP(url);
		link.id = "bookmark"+number+"Link";
		link.setAttribute("data-bookmark", number);
		element.append(link);
		let background = document.createElement("div");
		background.classList.add("bookmark");
		background.style.backgroundColor=color;
		background.id="bookmark"+number+"Color";
		background.setAttribute("data-bookmark", number);
		link.append(background);
		let iconDiv = document.createElement("div");
		iconDiv.id = "bookmark"+number+"Icon";
		iconDiv.setAttribute("data-bookmark", number);
		// TODO: Download image data and encode, then save to localStorage, so we don't have to keep downloading everytime we load the page.
		let iconBase64;
		if (icon=="none") {
			if (iconData.iconUrl == "") {
				// Without icon
				iconDiv.classList.add("bookmark-no-icon");
				let iconDivText = document.createElement("p");
				iconDivText.setAttribute("data-bookmark", number);
				iconDivText.style.color=contrast(rgb2hex(color));
				iconDiv.append(iconDivText);
				let iconDivTextNode = document.createTextNode(name.slice(0, 1));
				iconDivText.append(iconDivTextNode);
			} else {
				// With icon
				let encodedUrl=encode(getHTTP(iconData.iconUrl));
				await fetch("/encode?url="+encodedUrl)
					.then((response) => {
						if (response.status >= 200 && response.status <= 299){
							return response.text();
						} else {
							throw new Error(response.statusText);
						}
					}).then((data) => {
						iconDiv.classList.add("icon");
						iconDiv.style.background = "url("+data+") center no-repeat";
						console.log(data);
						if (iconData.contain) {
							iconDiv.style.backgroundSize = "contain";
						}
						iconDiv.dataset.url=getHTTP(iconData.iconUrl);
						iconBase64=data;
					}).catch((error) => {
						console.error(error);
						iconDiv.classList.add("bookmark-no-icon");
						let iconDivText = document.createElement("p");
						iconDivText.setAttribute("data-bookmark", number);
						iconDivText.style.color=contrast(rgb2hex(color));
						iconDiv.append(iconDivText);
						let iconDivTextNode = document.createTextNode(name.slice(0, 1));
						iconDivText.append(iconDivTextNode);
					});
			}
		} else {
			// Icon already encoded.
			iconBase64=icon;
			iconDiv.classList.add("icon");
			iconDiv.style.background = "url("+iconBase64+") center no-repeat";
			if (iconData.contain) {
				iconDiv.style.backgroundSize = "contain";
			}
			iconDiv.dataset.url=getHTTP(iconData.iconUrl);
		}
		background.append(iconDiv);
		let text = document.createElement("div");
		text.setAttribute("data-bookmark", number);
		text.classList.add("bookmark-text");
		text.classList.add("pt-2");
		text.id = "bookmark"+number+"Text";
		let textNode = document.createTextNode(name);
		text.append(textNode);
		link.append(text);
		if (save) {
			clearForm();
			saveBookmarkData(name, getHTTP(url), iconBase64, iconData, color, number);
		}
		return number;
	}

	function editBookmark(id) {
		clearForm(function () {
			console.log(id);
			const modal = new bootstrap.Modal(document.querySelector("#bookmarkModal"));
			document.querySelector("#bookmark-name").value = document.querySelector("#bookmark"+id+"Text").textContent;
			document.querySelector("#bookmark-url").value = document.querySelector("#bookmark"+id+"Link").href;
			document.querySelector("#bookmark-icon").value = document.querySelector("#bookmark"+id+"Icon").getAttribute("data-url");
			document.querySelector("#color-sample").style.backgroundColor = document.querySelector("#bookmark"+id+"Color").style.backgroundColor;
			picker.setColor(document.querySelector("#bookmark"+id+"Color").style.backgroundColor);
			if (document.querySelector("#bookmark"+id+"Icon").style.backgroundSize=="contain") {
				document.querySelector("#bookmark-icon-preview-contain").click(); 
			}
			document.querySelector("#bookmark-edit").value = "";
			modal.show();
		}, id);
	}
	/*
	
	
	#######  #     #  #######  ##    #  #######   ######
	#        #     #  #        # #   #     #     #
	#####     #   #   #####    #  #  #     #      #####
	#          # #    #        #   # #     #           #
	#######     #     #######  #    ##     #     ######
	
	
	//*/
	function startDrag(event) {
		event.dataTransfer.setData("text/plain", event.target.id);
		document.querySelector("#bookmarkadd-icon").classList.remove("bi-plus");
		document.querySelector("#bookmarkadd-icon").classList.add("bi-gear");
		document.querySelector("#bookmarkadd-text").style.display="none";
		document.querySelector("#bookmarkadd-edit-text").style.display="";
		document.querySelector("#bookmarkremove").style.display="block";
		event.dataTransfer.effectAllowed = "move";
		hideContextMenu();
	//console.dir(event.target);
	}

	function allowDrop(event) { //eslint-disable-line unicorn/consistent-function-scoping
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}

	function denyDrop(event) { //eslint-disable-line unicorn/consistent-function-scoping
		event.preventDefault();
		event.dataTransfer.dropEffect = "none";
	}
	function onDragEnter(event) { //eslint-disable-line unicorn/consistent-function-scoping
		//console.log(event.target);//.classList.add("bookmark-allow-move");
		//console.dir(event);
	}

	function onDragLeave(event) { //eslint-disable-line unicorn/consistent-function-scoping
		//event.target.classList.remove("bookmark-allow-move");
		//console.dir(event);
	}

	function moveBookmark(event) {
		event.preventDefault();
		let data = event.dataTransfer.getData("text/plain");
		event.target.insertBefore(document.querySelector("#bookmark"+data));
	}

	function endDrag() {
		document.querySelector("#bookmarkadd-icon").classList.remove("bi-gear");
		document.querySelector("#bookmarkadd-icon").classList.add("bi-plus");
		document.querySelector("#bookmarkadd-text").style.display="";
		document.querySelector("#bookmarkadd-edit-text").style.display="none";
		document.querySelector("#bookmarkremove").style.display="none";
	}
	function deleteBookmarkWithDrag(event) {
		event.preventDefault();
		confirmDelete("", Number.parseInt(document.querySelector("#"+event.dataTransfer.getData("text/plain")).getAttribute("data-bookmark")));
	}
	
	function editBookmarkWithDrag(event) {
		event.preventDefault();
		editBookmark(event.dataTransfer.getData("text/plain").getAttribute("data-bookmark"));
	}
	/*
	
	
	##   ##    #####    #####       ###     #
	# # # #   #     #   #    ##    #   #    #
	#  #  #   #     #   #    ##   #######   #
	#     #   #     #   #    ##   #     #   #
	#     #    #####    #####     #     #   #######
	
	
	//*/
	let picker = new Picker({
		parent: document.querySelector("#color-picker"),
		alpha: false,
		editor: true,
		popup: false,
		color:defaultPickerColor,
		editorFormat: "hex",
	});

	//document.getElementById("picker_done").style.display="none";
	/*
picker.onClose = function (color) { // eslint-disable-line no-unused-vars
	picker.setColor(window.getComputedStyle(document.getElementById("color-sample"), null).getPropertyValue("background-color"), true);
};*/
	let originalColor="";
	picker.onChange = function (color) {
		document.querySelector("#color-sample").style.backgroundColor = color.rgbaString;
		originalColor!="" ? false : originalColor=color.rgbaString;
	};
	picker.onClose = function () {
		document.querySelector("#color-sample").style.backgroundColor = originalColor;
	};
	function updateNamePreview() {
		setTimeout(function () {updateNamePreview();}, 100);
		let name = document.querySelector("#bookmark-name").value;
		let placeholder = document.querySelector("#bookmark-name").placeholder;
		let element=document.querySelector("#bookmark-text-preview");
		if (name=="") {
			element.textContent=placeholder;
		} else {
			element.textContent=name;
		}
	}
	updateNamePreview();
	function favicon(checkbox=false) {
		let c=checkbox.checked;
		if (c) {
			document.querySelector("#bookmark-icon").readOnly = true;
			oldIconAddress = document.querySelector("#bookmark-icon").value;
			setTimeout(function(){updateFaviconAddress();}, faviconUpdateTime);
			stopUpdatingIconAddress=false;
		} else {
			document.querySelector("#bookmark-icon").readOnly = false;
			document.querySelector("#bookmark-icon").value = oldIconAddress;
			stopUpdatingIconAddress=true;
		}
	}

	function updateFaviconAddress() {
		if (!stopUpdatingIconAddress) {
			setTimeout(function(){updateFaviconAddress();}, faviconUpdateTime);
			document.querySelector("#bookmark-icon").value = document.querySelector("#bookmark-url").value +"/favicon.ico";
		}
	}
	function updateNamePlaceholder() {
		document.querySelector("#bookmark-name").placeholder = document.querySelector("#bookmark-url").value;
	}
	setInterval(function(){updateNamePlaceholder();}, 100);

	let iconContain = false;
	function updateIconPreview() {
		if (document.querySelector("#bookmark-icon").value!="") {
			document.querySelector("#bookmark-icon-preview").style.background="url("+getHTTP(document.querySelector("#bookmark-icon").value)+") no-repeat center";
			document.querySelector("#bookmark-icon-preview").textContent = "";
			document.querySelector("#bookmark-icon-preview").classList.remove("bookmark-no-icon-preview");
			document.querySelector("#bookmark-icon-preview").classList.add("bookmark-icon-preview");
		} else {
			document.querySelector("#bookmark-icon-preview").style.background="";
			if (document.querySelector("#bookmark-name").value!="") {
				document.querySelector("#bookmark-icon-preview").textContent = document.querySelector("#bookmark-name").value.slice(0, 1);
			} else if (document.querySelector("#bookmark-name").placeholder!=""){
				document.querySelector("#bookmark-icon-preview").textContent = document.querySelector("#bookmark-name").placeholder.slice(0, 1);
			} else {
				document.querySelector("#bookmark-icon-preview").textContent = "";
			}
			document.querySelector("#bookmark-icon-preview").classList.add("bookmark-no-icon-preview");
			document.querySelector("#bookmark-icon-preview").classList.remove("bookmark-icon-preview");
			console.log(rgb2hex(window.getComputedStyle(document.querySelector("#color-sample")).getPropertyValue("background-color")));
			document.querySelector("#bookmark-icon-preview").style.color=contrast(rgb2hex(window.getComputedStyle(document.querySelector("#color-sample")).getPropertyValue("background-color")));
		}
		if (iconContain) {
			document.querySelector("#bookmark-icon-preview").style.backgroundSize="contain";
		} else {
			document.querySelector("#bookmark-icon-preview").style.backgroundSize="inital";
		
		}
	}
	setInterval(function () {updateIconPreview();}, 100);
	function iconPreviewContain(checkbox=false) {
		let c = checkbox.checked;
		iconContain = c && document.querySelector("#bookmark-icon-preview").style.backgroundSize!="contain" ? true : false;
	}

	function clearForm(callback, ...arguments_){
		favicon();
		setTimeout(function(){
			document.querySelector("#bookmark-name").value = "";
			document.querySelector("#bookmark-url").value = "";
			document.querySelector("#bookmark-icon-favicon").checked = false;
			document.querySelector("#bookmark-icon").value = "";
			document.querySelector("#bookmark-icon-preview").style.background = "";
			document.querySelector("#color-sample").style.backgroundColor = defaultPickerColor;
			picker.setColor(defaultPickerColor, true);
			oldIconAddress = "";
			iconContain = false;
			document.querySelector("#bookmark-icon-preview-contain").checked=false;
			document.querySelector("#bookmark-edit").value = "";
			if (typeof(callback)=="function") {
				setTimeout(function () {
					callback(arguments_);
				}, 1);
			} else if (!callback===undefined) {
				console.warn("Parameter "+String(callback)+" is not a function.");
			}
		}, faviconUpdateTime+1);
	}

	function saveBookmark() {
		// TODO: Add checks for invalid values, e.g. empty values, and HTML characters.
		// TODO IMPORTANT!!!: We need to validate icon URL's as image files.
		//						We also need to ensure we don't hit the localStorage size limit.
		//						Perhaps I can split the Base64 string of into separte itmes in localStorage,
		//							and set how many extra items there are in iconData.
		let name = document.querySelector("#bookmark-name").value == ""?document.querySelector("#bookmark-name").placeholder:document.querySelector("#bookmark-name").value;
		let url = document.querySelector("#bookmark-url").value;
		let icon = "none";
		let contain = document.querySelector("#bookmark-icon-preview").style.backgroundSize=="contain"?true:false;
		let iconData = {
			contain: contain,
			iconUrl: getHTTP(document.querySelector("#bookmark-icon").value)
		};
		let color = window.getComputedStyle(document.querySelector("#color-sample")).getPropertyValue("background-color");
		let edit = document.querySelector("#bookmark-edit").value;
		edit = edit!="" ? Number.parseInt(edit) : 0;
		if (edit==0) {
			edit = getBookmarkTotal()+1;
		}
		console.log(name, url, icon, iconData, color, edit);
		console.log(iconData.contain);
		addBookmark(name, url, icon, iconData, color, edit);
	}
	
	function checkForEdit() {
		if (document.querySelector("#bookmark-edit").value!="") {
			document.querySelector("#bookmark-modal-delete-button").style.display="block";
			document.querySelector("#bookmark-modal-save-button").style.display="block";
			document.querySelector("#bookmark-modal-add-button").style.display="none";
			document.querySelector("#bookmark-modal-title").style.display="none";
			document.querySelector("#bookmark-modal-title-edit").style.display="block";
		} else {
			document.querySelector("#bookmark-modal-save-button").style.display="none";
			document.querySelector("#bookmark-modal-add-button").style.display="block";
			document.querySelector("#bookmark-modal-delete-button").style.display="none";
			document.querySelector("#bookmark-modal-title").style.display="block";
			document.querySelector("#bookmark-modal-title-edit").style.display="none";
		}
	}
	setInterval(function () {checkForEdit();}, 100);
	
	function confirmDelete(confirmation="", override=0) {
		console.log("start 1", override);
		console.log("start 2", typeof(override));
		if (confirmation=="") {
			const modal = new bootstrap.Modal(document.querySelector("#confirmDeleteModal"));
			if (override==0) {
				document.querySelector("#deleteModalEdit").value=document.querySelector("#bookmark-edit").value;
			} else {
				document.querySelector("#deleteModalEdit").value=override;
			}
			modal.show();
			console.log("Showing Delete Modal");
		} else if (confirmation=="I am absolutely sure I want to delete this bookmark.") {
			console.log("start 3", document.querySelector("#deleteModalEdit").value);
			console.log("start 4", typeof(document.querySelector("#deleteModalEdit").value));
			console.log("start 5", Number.parseInt(document.querySelector("#deleteModalEdit").value));
			console.log("start 6", typeof(Number.parseInt(document.querySelector("#deleteModalEdit").value)));
			deleteBookmark("#bookmark"+Number.parseInt(document.querySelector("#deleteModalEdit").value));
			document.querySelector("#deleteModalEdit").value="";
			console.log("Deleting bookmark");
		} else if (confirmation=="Nevermind") {
			document.querySelector("#deleteModalEdit").value="";
			console.log("hiding delete modal");
		}
	}
	
	window.clearForm=clearForm;
	window.saveBookmark=saveBookmark;
	window.favicon=favicon;
	window.startDrag=startDrag;
	window.allowDrop=allowDrop;
	window.onDragEnter=onDragEnter;
	window.onDragLeave=onDragLeave;
	window.moveBookmark=moveBookmark;
	window.endDrag=endDrag;
	window.deleteBookmarkWithDrag=deleteBookmarkWithDrag;
	window.deleteBookmark=deleteBookmark;
	window.editBookmark=editBookmarkWithDrag;
	window.contrast=contrast;
	window.iconPreviewContain=iconPreviewContain;
	window.denyDrop=denyDrop;
	window.picker=picker;
	window.confirmDelete=confirmDelete;

	console.log("bookmarks.js loaded.");
});
},{"font-color-contrast":1,"url-encode-decode":2}]},{},[3]);
