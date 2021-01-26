/* global bootstrap clearForm picker confirmDelete*/
function contextMenu(event) { //eslint-disable-line no-unused-vars
	event.preventDefault();
	//console.dir(event.target.id);
	const bookmark = event.target.getAttribute("data-bookmark");
	const menu = document.querySelector("#context-menu");
	menu.style.display = "block";
	const item2 = document.querySelector("#contextItem-Edit");
	const item3 = document.querySelector("#contextItem-Delete");
	item2.style.display = "none";
	item3.style.display = "none";
	if (bookmark!=undefined) {
		item2.style.display = "block";
		item3.style.display = "block";
		item2.dataset.bookmark = bookmark;
		item3.dataset.bookmark = bookmark;
	}
	document.querySelector("#context-menu").classList.remove("contextMenuTopRight");
	document.querySelector("#context-menu").classList.remove("contextMenuBottomLeft");
	document.querySelector("#context-menu").classList.remove("contextMenuBottomRight");
	document.querySelector("#context-menu").classList.add("contextMenuTopLeft");
	let reverseHorizontal = false;
	let reverseVertical = false;
	let width = menu.offsetWidth;
	if (event.pageX < (window.innerWidth - width)) {
		menu.style.left = event.pageX+"px";
	} else {
		menu.style.left = (event.pageX - width)+"px";
		reverseHorizontal = true;
	}
	let height = menu.offsetHeight;
	if (event.pageY < (window.innerHeight - height)) {
		menu.style.top = event.pageY+"px";
	} else {
		menu.style.top = (event.pageY - height)+"px";
		reverseVertical = true;
	}
	if (reverseHorizontal || reverseVertical) {
		menu.classList.remove("contextMenuTopLeft");
	}
	// If context menu is opened near the right edge of the scren.
	if (reverseHorizontal  && !reverseVertical) {
		menu.classList.add("contextMenuTopRight");
	}
	// If context menu is opened near the bottom of the screen.
	if (!reverseHorizontal  && reverseVertical) {
		menu.classList.add("contextMenuBottomLeft");
	}
	// If context menu is opened near the bottom right corner of the screen.
	if (reverseHorizontal  && reverseVertical) {
		menu.classList.add("contextMenuBottomRight");
	}
}
function hideContextMenu() {
	document.querySelector("#context-menu").style.display = "none";
}

function selectContextItem(event) {//eslint-disable-line no-unused-vars
	const data = event.target;
	const modal = new bootstrap.Modal(document.querySelector("#bookmarkModal"));
	if (data.id=="contextItem-Create") {
		modal.show();
	}
	if (data.id=="contextItem-Edit") {
		console.log("Edit selected");
		clearForm(function () {
			console.log("editing...");
			// Name, url, icon contain, and color are working...
			// need icon url,
			document.querySelector("#bookmark-name").value = document.querySelector("#bookmark"+data.getAttribute("data-bookmark")+"Text").textContent;
			document.querySelector("#bookmark-url").value = document.querySelector("#bookmark"+data.getAttribute("data-bookmark")+"Link").href;
			document.querySelector("#bookmark-icon").value = document.querySelector("#bookmark"+data.getAttribute("data-bookmark")+"Icon").getAttribute("data-url");
			document.querySelector("#color-sample").style.backgroundColor = document.querySelector("#bookmark"+data.getAttribute("data-bookmark")+"Color").style.backgroundColor;
			picker.setColor(document.querySelector("#bookmark"+data.getAttribute("data-bookmark")+"Color").style.backgroundColor);
			
			if (document.querySelector("#bookmark"+data.getAttribute("data-bookmark")+"Icon").style.backgroundSize=="contain") {
				document.querySelector("#bookmark-icon-preview-contain").click(); 
			}
			document.querySelector("#bookmark-edit").value = data.getAttribute("data-bookmark");
			modal.show();
		});
	}
	if (data.id=="contextItem-Delete") {
		confirmDelete("", Number.parseInt(data.getAttribute("data-bookmark")));
	}
	hideContextMenu();
}
console.log("contextMenu.js loaded.");