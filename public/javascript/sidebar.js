function showSidebar() { //eslint-disable-line no-unused-vars
	document.querySelector("#sidebar").classList.remove("hideSidebar");
	document.querySelector("#sidebar").classList.add("showSidebar");
	document.querySelector("#settingsButton").classList.add("bi-x");
	document.querySelector("#settingsButton").classList.remove("bi-sliders");
	document.querySelector("#sidebarCloser").style.display="block";
	document.querySelector("#sidebarCloser").classList.add("fadeSidebarCloserToBlack");
	document.querySelector("#sidebarCloser").classList.remove("fadeSidebarCloserFromBlack");
}
function hideSidebar() { //eslint-disable-line no-unused-vars
	document.querySelector("#sidebar").classList.add("hideSidebar");
	document.querySelector("#sidebar").classList.remove("showSidebar");
	document.querySelector("#settingsButton").classList.add("bi-sliders");
	document.querySelector("#settingsButton").classList.remove("bi-x");
	document.querySelector("#sidebarCloser").classList.add("fadeSidebarCloserFromBlack");
	document.querySelector("#sidebarCloser").classList.remove("fadeSidebarCloserToBlack");
	setTimeout(function () {
		document.querySelector("#sidebarCloser").style.display="none";
	}, 250);
}

window.addEventListener("load", ()=>{
	document.querySelector("#settingsButton").addEventListener("click", ()=>{
		if (document.querySelector(".showSidebar")) {
			//console.log("Hiding sidebar.");
			hideSidebar();
		} else {
			//console.log("Showing sidebar.");
			showSidebar();
		}
	});
	document.querySelector("#sidebarCloser").addEventListener("click", ()=>{
		document.querySelector("#settingsButton").click();
	});
});

console.log("sidebar.js loaded.");