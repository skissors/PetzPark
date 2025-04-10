let id = "";
let origin = window.origin;

function initCrossFrame(newOrigin) {
    if(newOrigin) origin = newOrigin;
	window.addEventListener("message", childMessageProcessor);
    document.addEventListener("click", sendClickEvent);
}

function childMessageProcessor(e) {
	if (e.origin === origin) {
		let data = JSON.parse(e.data);
		if (data.id) {
            id = data.id;
            updateURL();
        }
	}
}

function sendClickEvent() {
    window.top.postMessage(JSON.stringify({ "click" : id }));
}

function updateURL() {
    let message = {
        "id":id,
        "url":window.location.href, 
        "title":document.title,
    }
	window.top.postMessage(JSON.stringify(message));
}
