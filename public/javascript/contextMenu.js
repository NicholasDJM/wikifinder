/* global bootstrap clearForm iconPreviewContain */
function contextMenu(event) { //eslint-disable-line no-unused-vars
	event.preventDefault();
	console.dir(event.target.id);
	const bookmark = event.target.getAttribute("data-bookmark");
	const menu = document.getElementById("context-menu");
	menu.style.top = event.pageY+"px";
	menu.style.left = event.pageX+"px";
	menu.style.display = "block";
	const item2 = document.getElementById("contextItem-Edit");
	const item3 = document.getElementById("contextItem-Delete");
	item2.style.display = "none";
	item3.style.display = "none";
	if (bookmark!=undefined) {
		item2.style.display = "block";
		item3.style.display = "block";
		item2.setAttribute("data-bookmark", bookmark);
		item3.setAttribute("data-bookmark", bookmark);
	}
}
function hideContextMenu() {
	document.getElementById("context-menu").style.display = "none";
}

function selectContextItem(event) {//eslint-disable-line no-unused-vars
	const data = event.target;
	const modal = new bootstrap.Modal(document.getElementById("bookmarkModal"));
	if (data.id=="contextItem-Create") {
		modal.show();
	}
	if (data.id=="contextItem-Edit") {
		clearForm();
		setTimeout(function () {
			document.getElementById("bookmark-name").value = document.getElementById("bookmark"+data.getAttribute("data-bookmark")+"Text").innerText;
			document.getElementById("bookmark-url").value = document.getElementById("bookmark"+data.getAttribute("data-bookmark")+"Link").href;
			document.getElementById("bookmark-icon").value = document.getElementById("bookmark"+data.getAttribute("data-bookmark")+"Icon").getAttribute("data-url");
			document.getElementById("color-sample").style.backgroundColor = document.getElementById("bookmark"+data.getAttribute("data-bookmark")+"Color").style.backgroundColor;
			if (document.getElementById("bookmark"+data.getAttribute("data-bookmark")+"Icon").style.backgroundSize=="contain") {
				document.getElementById("bookmark-icon-preview-contain").click(); 
			}
			modal.show();
		}, 12);
	}
	hideContextMenu();
}
console.log("contextMenu.js loaded.");