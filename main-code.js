let r = document.querySelector(":root");
let rs = getComputedStyle(r);

let theme = "basic";
let backgroundValue = "rotate";
let borderStyle = "border";

window.addEventListener("load", startup, false);

function startup() {
	document.getElementsByName("theme-style").forEach((p) => {
		if (p.id === "basic") p.checked = true;
		p.addEventListener("change", updateTheme, false);
	});

	document.getElementsByName("border-style").forEach((p) => {
		if (p.id === "b-border") p.checked = true;
		p.addEventListener("change", updateBorder, false);
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

	setupPetting();
	fillGutters();
	removeAlt();
}

function updateTheme(event) {
	theme = event.target.value;
	document.getElementById("frame-window").className = "window " + theme;
}

function updateBorder(event) {
	style = event.target.value;
	borderStyle = style;
	if (style === "no-border") {
		r.style.setProperty("--basic-border", "none");
	} else {
		r.style.setProperty("--basic-border", "2px white inset");
	}
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
	} else if (text === "transparent") {
		r.style.setProperty("--background", "none");
		backgroundValue = "none";
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

	let url = `https://skissors.github.io/PetzPark/widget.html?seed=${seed}&theme=${theme}&textColor=${textColor}&outlineColor=${outlineColor}&background=${backgroundValue}`;

	if (theme === "win95") {
		let win95color1 = rs.getPropertyValue("--w95-color-1").slice(1, 7);
		let win95color2 = rs.getPropertyValue("--w95-color-2").slice(1, 7);

		url += `&winColor1=${win95color1}&winColor2=${win95color2}`;
	} else if (theme === "basic") {
		url += `&border=${borderStyle}`;
	}

	let template = `<iframe src="${url}" style="width: 250px; height:250px; border: none"></iframe>`;

	document.getElementById("copy-box").innerHTML = template;
}

function copyText() {
	let text = document.getElementById("copy-box").value;

	// Copy the text inside the text field
	navigator.clipboard.writeText(text);

	// Alert the copied text
	alert("Copied the code successfully");
}

function setPetPreview() {
	let idle = document.getElementById("pp-idle").value;
	let petting = document.getElementById("pp-petting").value;
	console.log(idle);
	console.log(petting);
	if (!idle || idle === "") idle = "petz/idle/jack.gif";
	if (!petting || petting === "") petting = "petz/petting/jack.gif";
	document.getElementById("pet-pix").src = idle;
	setupPetting(idle, petting);
}

function setupPetting(idle, petting) {
	document.getElementById("pet-pix").onmousedown = startPetting;
	document.getElementById("pet-pix").onmouseup = cleanupPetting;
	document.getElementById("pet-pix").addEventListener("mouseout", cleanupPetting);

	function startPetting(e) {
		e.preventDefault();
		e.target.classList.add("petting");
		e.target.title = "";
		if (!petting || petting === "") petting = "petz/petting/jack.gif";
		e.target.src = petting;
	}

	function cleanupPetting(e) {
		e.target.classList.remove("petting");
		e.target.title = "click and hold to pet me!";
		if (!idle || idle === "") idle = "petz/idle/jack.gif";
		e.target.src = idle;
	}
}

function fillGutters() {
	let height = document.documentElement.scrollHeight;
	let petzToGen = Math.floor(height / 250);

	if (petzToGen * 2 > petz.length) {
		petzToGen = Math.floor(petz.length / 2);
	}

	let left = document.getElementById("left-side");
	let right = document.getElementById("right-side");
	let usedNums = [];

	for (let i = 0; i < petzToGen; i++) {
		left.innerHTML += `<iframe src="widget.html?background=none&border=no-border&title=none&fixedPet=${getUnusedNum()}" style="width: 250px; height:250px; border: none"></iframe>`;
		right.innerHTML += `<iframe src="widget.html?background=none&border=no-border&title=none&fixedPet=${getUnusedNum()}" style="width: 250px; height:250px; border: none"></iframe>`;
	}

	function getUnusedNum() {
		num = Math.floor(Math.random(petz.length) * petz.length);
		while (usedNums.includes(num)) {
			num = Math.floor(Math.random(petz.length) * petz.length);
		}
		usedNums.push(num);
		return num;
	}
}

function removeAlt() {
	var elems = document.getElementById("viewcounter").getElementsByTagName("img");
	for (let e in elems) {
		elems[e].alt = "";
		elems[e].title = "";
	}
}