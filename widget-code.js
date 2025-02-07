let r = document.querySelector(":root");
let rs = getComputedStyle(r);

let themeList = ["basic", "win95", "winXP"];

let params = new URL(document.location).searchParams;

let petIndex = 0;

window.addEventListener("load", startup, false);

function startup() {
	let theme = params.get("theme");
	if (theme && themeList.includes(theme)) {
		document.getElementById("frame-window").className = "window " + theme;
		if (theme === "win95") {
			let color1 = params.get("winColor1");
			let color2 = params.get("winColor2");
			if (color1 && color1.length === 6) {
				if (!(color2 && color2.length === 6)) color2 = color1;
				r.style.setProperty("--w95-color-1", "#" + color1);
				r.style.setProperty("--w95-color-2", "#" + color2);
			}
		}

	}
	if (!theme || theme === "basic") {
		let borderStyle = params.get("border");
		if (borderStyle && borderStyle === "no-border") {
			r.style.setProperty("--basic-border", "none");
		}
	}

	let textColor = params.get("textColor");
	if (textColor && textColor.length === 6) {
		r.style.setProperty("--text-color", "#" + textColor);
	}

	let outlineColor = params.get("outlineColor");
	if (outlineColor && outlineColor.length === 6) {
		r.style.setProperty("--outline-color", "#" + outlineColor);
	}

	let title = params.get("title") 
	if (title && title === "none") {
		document.getElementById("title-bar").style = "display:none"
	}

	let randGen = setupSeededRandom();

	petIndex = randGen(petz.length);

	let fixedPet = params.get("fixedPet");
	if(fixedPet && fixedPet < petz.length) petIndex = fixedPet;

	let background = params.get("background");
	if (background && background != "rotate") {
		if (background === "none") {
			r.style.setProperty("--background", "none");
		} else if (background.charAt(0) === "h") {
			r.style.setProperty("--background", "url('" + background + "')");
		} else if (background.length === 6) {
			r.style.setProperty("--background", "#" + background);
		}
	} else {
		let bkgd = backgrounds[randGen(backgrounds.length)];
		console.log(bkgd);
		r.style.setProperty("--background", "url('https://skissors.github.io/PetzPark/wallpaper/" + bkgd + "')");
	}

	loadPetData(petz[petIndex]);
	setupPetting(petz[petIndex]);
}

function setupSeededRandom() {
	let seed = params.get("seed");
	if (!seed) {
		seed = 1;
	}

	let urlHash = 1;
	if (parent !== window) {
		var referrer = document.referrer;
		urlHash = Math.abs(referrer.hashCode()) % 1000;
	}
	var date = new Date();
	var num = urlHash + (date.getDate() + 10) * 1111111 * date.getMonth() + date.getFullYear() * seed;

	return SeedRandom(num);
}

function loadPetData(pet) {
	document.getElementById("petName").innerHTML = pet.name;
	document.getElementById("ownerInfo").innerHTML = "owned by " + pet.owner + " @ " + pet.site;
	document.getElementById("petLink").href = pet.url;
	document.getElementById("pet-pix").src = "petz/idle/" + cleanName(pet.name) + '-' + cleanName(pet.owner) + ".gif";
}

function setupPetting(pet) {
	document.getElementById("pet-pix").onmousedown = petting;
	document.getElementById("pet-pix").onmouseup = cleanupPetting;
	document.getElementById("pet-pix").addEventListener("mouseout", cleanupPetting);
	let cleanPetName = cleanName(pet.name) + '-' + cleanName(pet.owner)

	function petting(e) {
		e.preventDefault();
		e.target.classList.add("petting");
		e.target.title = "";
		e.target.src = "petz/petting/" + cleanPetName + ".gif";
	}

	function cleanupPetting(e) {
		e.target.classList.remove("petting");
		e.target.title = "click and hold to pet me!";
		e.target.src = "petz/idle/" + cleanPetName + ".gif";
	}
}

function cleanName(name) {
	return name.replace(/[^0-9a-z]/gi, "").toLowerCase();
}

// from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
String.prototype.hashCode = function () {
	var hash = 0,
		i,
		chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr = this.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

// from https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator
function SeedRandom(state1, state2) {
	var mod1 = 4294967087;
	var mul1 = 65539;
	var mod2 = 4294965887;
	var mul2 = 65537;
	if (typeof state1 != "number") {
		state1 = +new Date();
	}
	if (typeof state2 != "number") {
		state2 = state1;
	}
	state1 = (state1 % (mod1 - 1)) + 1;
	state2 = (state2 % (mod2 - 1)) + 1;
	function random(limit) {
		state1 = (state1 * mul1) % mod1;
		state2 = (state2 * mul2) % mod2;
		if (state1 < limit && state2 < limit && state1 < mod1 % limit && state2 < mod2 % limit) {
			return random(limit);
		}
		return (state1 + state2) % limit;
	}
	return random;
}
