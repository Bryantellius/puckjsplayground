// Called when we get a line of data - updates the light color
function onLine(line) {
  try {
    var j = JSON.parse(line);
    console.log("Received JSON: ", j);
    elements.light.setValue(j.light * 100);
  } catch (e) {
    console.log("Received: ", line);
  }
}
var connection;
function connectDevice() {
  Puck.connect(function (c) {
    if (!c) {
      alert("Couldn't connect!");
      return;
    }
    connection = c;
    // remove modal window
    elements.modal.remove();
    // Handle the data we get back, and call 'onLine'
    // whenever we get a line
    var buf = "";
    connection.on("data", function (d) {
      buf += d;
      var i = buf.indexOf("\n");
      while (i >= 0) {
        onLine(buf.substr(0, i));
        buf = buf.substr(i + 1);
        i = buf.indexOf("\n");
      }
    });
    // First, reset Puck.js
    connection.write("reset();\n", function () {
      // Wait for it to reset itself
      setTimeout(function () {
        // Now tell it to write data on the current light level to Bluetooth
        // 10 times a second. Also ensure that when disconnected, Puck.js
        // resets so the setInterval doesn't keep draining battery.
        connection.write(
          "setInterval(function(){Bluetooth.println(JSON.stringify({light:Puck.light()}));},100);NRF.on('disconnect', function() {reset()});\n",
          function () {
            console.log("Ready...");
          }
        );
      }, 1500);
    });
  });
}
// Set up the controls we see on the screen
var elements = {
  heading: TD.label({
    x: 10,
    y: 10,
    width: 190,
    height: 50,
    label: "My Dashboard",
  }),
  light: TD.gauge({
    x: 10,
    y: 70,
    width: 190,
    height: 220,
    label: "Light",
    value: 0,
    min: 0,
    max: 100,
  }),
  modal: TD.modal({
    x: 10,
    y: 10,
    width: 190,
    height: 430,
    label: "Click to connect",
    onchange: connectDevice,
  }),
};
for (var i in elements) document.body.appendChild(elements[i]);
