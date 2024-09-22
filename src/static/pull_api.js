const appendable = document.getElementById('appendable');
if (!appendable) {
    console.error('Element #appendable not found in the HTML');
} else {
    // Use EventSource to receive streaming updates from the server
    const eventSource = new EventSource('http://localhost:3000/api/stream');

    eventSource.onmessage = function (event) {
        // Each message received is in event.data
        appendJSONToElement(event.data, appendable);
    };
    eventSource.onerror = function (error) {
        console.error('Error occurred with EventSource:', error);
        if (error.eventPhase === EventSource.CLOSED) {
            console.log('Connection closed by server.');
        }
    };
}

function appendJSONToElement(data, element) {
    let temp_elem = document.createElement('p');

    // Pretty-print the streamed data
    temp_elem.innerHTML = JSON.parse(data)["response"];
    element.appendChild(temp_elem);
}
