/*global Cookie clear_form*/
//let bookmarksPerRow = 8;
//window.onload = getBookmarks();
let bookmarksTotal = 0;
function getBookmarks() {
	if (Cookie !== undefined) {
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
	} else {
		setTimeout(function () {
			getBookmarks();
		}, 10);
	}
}

function addBookmark(name, url, icon, color="#808080", edit=0){
	// Name: Name of bookmark
	// URL: Address for bookmark link
	// Icon: URL for bookmark icon image
	// Colour: Background if icon isn't used.
	// Edit: Bookmark Position (Internal variable, used when generating bookmarks or updating bookmark position.)
	/*let bookmarks;
	if (edit>bookmarksPerRow || bookmarksTotal>bookmarksPerRow) {
		if (edit>bookmarksPerRow*2 || bookmarksTotal>bookmarksPerRow*2) {
			bookmarks = document.getElementById("bookmarkrow3");
		} else {
			bookmarks = document.getElementById("bookmarkrow2");
		}
	} else {
		bookmarks = document.getElementById("bookmarkrow1");
	}*/
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
	bookmarks.insertBefore(element, document.getElementById("bookmarkadd")[0]);
	bookmarksTotal=bookmarksTotal+1;
	let link = document.createElement("a");
	if (url.substring(0, 7)=="http://" || url.substring(0, 8)=="https://") {
		link.href = url;
	} else {
		link.href = "https://"+url;
	}
	element.appendChild(link);
	let iconDiv = document.createElement("div");
	iconDiv.style.backgroundColor=color;
	let iconDiv2 = document.createElement("div");
	if (icon == "") {
		iconDiv.classList.add("bookmark-no-icon");
		iconDiv.classList.add("contrast-bg");
		iconDiv.id = "bookmark"+num+"NoIconText";
		let iconDivText=document.createTextNode(name.substring(0, 1));
		iconDivText.classList.add("contrast-el");
		iconDiv.appendChild(iconDivText);
	} else {
		if (!(icon.substring(0, 7)=="http://" || icon.substring(0, 8)=="https://")) {
			icon = "https://"+icon;
		}
		iconDiv.classList.add("bookmark");
		iconDiv2.classList.add("icon");
		iconDiv2.style.background = "url("+icon+") center no-repeat";
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
	clear_form();
}

