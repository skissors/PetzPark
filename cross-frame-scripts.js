let id = "";
let origin = window.origin;

function initCrossFrame(newOrigin) {
    console.log(origin)
    if(newOrigin) origin = newOrigin;
    console.log(origin)
	window.addEventListener("message", childMessageProcessor);
    document.addEventListener("click", sendClickEvent);
}

function childMessageProcessor(e) {
    console.log("processing message")
    console.log(e)
	if (e.origin === origin) {
		let data = JSON.parse(e.data);
		if (data.id) {
            id = data.id;
            updateURL();
        }
	}
}

function sendClickEvent() {
    console.log("sending click event")
    window.top.postMessage(JSON.stringify({ "click" : id }));
}

function updateURL() {
    console.log("sending url event")
    let message = {
        "id":id,
        "url":window.location.href, 
        "title":document.title,
    }
    console.log(message)
	window.top.postMessage(JSON.stringify(message));
}
