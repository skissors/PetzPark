let r = document.querySelector(":root");
let rs = getComputedStyle(r);

let theme = "basic";
let backgroundValue = "rotate";

window.addEventListener("load", startup, false);

function startup() {
	document.getElementsByName("theme-style").forEach((p) => {
		if (p.id === "basic") p.checked = true;
		p.addEventListener("change", updateTheme, false);
	});

	document.getElementsByName("background-options").forEach((p) => {
		if (p.id === "bk-rotate") p.checked = true;
		p.addEventListener("change", updateBackground, false);
	});

	document.querySelectorAll(".color-text").forEach((p) => {
		let prefix = p.id.slice(0, p.id.length - 4);
		if (prefix != "background") p.value = rs.getPropertyValue("--" + prefix);
		else p.value = "#c0c0c0";

		p.addEventListener("change", updateColorTxt, false);
	});

	document.querySelectorAll(".color-picker").forEach((p) => {
		let prefix = p.id.slice(0, p.id.length - 7);
		if (prefix != "background") p.value = rs.getPropertyValue("--" + prefix);
		else p.value = "#c0c0c0";

		p.addEventListener("change", updateColorPicker, false);
	});

	var selectElement = document.getElementById("background-select");

	backgrounds.forEach((b) => {
		let newOption = document.createElement("option");
		newOption.value = b;
		newOption.text = b;
		selectElement.add(newOption);
	});

	selectElement.addEventListener("change", updateBackgroundImg, false);
	document.getElementById("background-url").addEventListener("change", updateBackgroundImg, false);
}

function updateTheme(event) {
	theme = event.target.value;
	document.getElementById("frame-window").className = "window " + theme;
}

function updateColorPicker(event) {
	let newColor = event.target.value;
	let id = event.target.id;

	let prefix = id.slice(0, id.length - 7);
	let text = prefix + "-txt";

	if (prefix != "background" || document.getElementById("bk-solid").checked) {
		r.style.setProperty("--" + prefix, newColor);
		backgroundValue = newColor.slice(1, 7);
	}
	document.getElementById(text).value = newColor;
}

function updateColorTxt(event) {
	let newColor = event.target.value;
	let id = event.target.id;

	let prefix = id.slice(0, id.length - 4);
	let picker = prefix + "-picker";

	if (newColor.charAt(0) === "#" && newColor.length === 7) {
		if (prefix != "background" || document.getElementById("bk-solid").checked) {
			r.style.setProperty("--" + prefix, newColor);
			backgroundValue = newColor.slice(1, 7);
		}
		document.getElementById(picker).value = newColor;
	}
}

function updateBackground(event) {
	let text = event.target.value;
	let id = event.target.id;

	if (text === "rotate") {
		let nBkgd = Math.floor(Math.random() * backgrounds.length);
		r.style.setProperty("--background", "url('wallpaper/" + backgrounds[nBkgd] + "')");
		backgroundValue = "rotate";
	} else if (text === "fixed") {
		let wall = document.getElementById("background-select").value;
		r.style.setProperty("--background", "url('wallpaper/" + wall + "')");
		// CHANGE THIS TO FULL URL
		backgroundValue = "https://skissors.github.io/PetzPark/wallpaper/" + wall;
	} else if (text === "solid") {
		let color = document.getElementById("background-txt").value;
		r.style.setProperty("--background", color);
		backgroundValue = color.slice(1, 7);
	} else if (text === "custom") {
		url = document.getElementById("background-url").value;
		if (url != "") r.style.setProperty("--background", "url('" + url + "')");
		backgroundValue = url;
	}
}

function updateBackgroundImg(event) {
	let id = event.target.id;
	let value = event.target.value;

	if (id === "background-select" && document.getElementById("bk-fixed").checked) {
		r.style.setProperty("--background", "url('wallpaper/" + value + "')");
		// CHANGE THIS TO FULL URL
		backgroundValue = "https://skissors.github.io/PetzPark/wallpaper/" + value;
	} else if (id === "background-url" && document.getElementById("bk-custom").checked && value != "") {
		r.style.setProperty("--background", "url('" + value + "')");
		backgroundValue = value;
	}
}

function generateCode() {
	let textColor = rs.getPropertyValue("--text-color").slice(1, 7);
	let outlineColor = rs.getPropertyValue("--outline-color").slice(1, 7);

	let seed = Math.floor(Math.random() * 10000);

	console.log(backgroundValue);

	let url = `https://skissors.github.io/PetzPark/widget.html?seed=${seed}&theme=${theme}&textColor=${textColor}&outlineColor=${outlineColor}&background=${backgroundValue}`;

	if (theme === "win95") {
		let win95color1 = rs.getPropertyValue("--w95-color-1").slice(1, 7);
		let win95color2 = rs.getPropertyValue("--w95-color-2").slice(1, 7);

		url += `&winColor1=${win95color1}&winColor2=${win95color2}`;
	}

	let template = `<iframe src="${url}" style="width: 250px; height:250px; border: none"></iframe>`;

	document.getElementById("copy-box").innerHTML = template;
}

function copyText() {
    let text = document.getElementById("copy-box").innerHTML;
    // Copy the text inside the text field
    navigator.clipboard.writeText(text);
    
    // Alert the copied text
    alert("Copied the code successfully");
}

document.getElementById("pet-pix").onmousedown = petting;
document.getElementById("pet-pix").onmouseup = cleanupPetting;
document.getElementById("pet-pix").addEventListener('mouseout', cleanupPetting);

function petting(e) {
    e.preventDefault();
    e.target.classList.add("petting");
    e.target.title = ""
    e.target.src="https://skissors.github.io/PetzPark/petz/petting/jack.gif";
}

function cleanupPetting(e) {
    e.target.classList.remove("petting");
    e.target.title = "click and hold to pet me!"
    e.target.src="https://skissors.github.io/PetzPark/petz/idle/jack.gif";
}

