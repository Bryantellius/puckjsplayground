var history = new Int16Array(100);

function logData() {
    var data = E.getTemperature();
    for (let i = 0; i < history.length; i++) {
        history[i] = history[i + 1];
    }
    history[history.length - 1] = data * 100;
}

setInterval(logData, 1000);