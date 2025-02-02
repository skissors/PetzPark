document.getElementById("pet-pix").onmousedown = petting;
document.getElementById("pet-pix").onmouseup = cleanupPetting;
document.getElementById("pet-pix").addEventListener('mouseout', cleanupPetting);

function petting(e) {
    e.preventDefault();
    e.target.classList.add("petting");
    e.target.title = ""
    e.target.src="petz/petting/fitz.gif";
}

function cleanupPetting(e) {
    e.target.classList.remove("petting");
    e.target.title = "click and hold to pet me!"
    e.target.src="petz/idle/fitz.gif";
}