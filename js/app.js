function connectDevice() {
  // connect, and ask for the battery percentage
  Puck.eval("{bat:Puck.getBatteryPercentage()}", function (d, err) {
    if (!d) {
      alert("Web Bluetooth connection failed!\n" + (err || ""));
      return;
    }
    // remove the 'connect' window
    elements.modal.remove();
    // update the controls with the values we received
    elements.bat.setValue(d.bat);
    // now get the history - these could take a while
    // so we do it separately.
    Puck.eval("history", function (d) {
      elements.temp.setData(d);
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
  bat: TD.gauge({
    x: 10,
    y: 70,
    width: 190,
    height: 220,
    label: "Battery Level",
    value: 0,
    min: 0,
    max: 100,
  }),
  temp: TD.graph({
    x: 210,
    y: 10,
    width: 400,
    height: 180,
    label: "Temperature",
  }),
  redled: TD.toggle({
    x: 210,
    y: 200,
    width: 200,
    height: 90,
    label: "Red LED",
    value: 0,
    onchange: function (el, v) {
      Puck.write("LED1.write(" + v + ");\n");
    },
  }),
  flash: TD.button({
    x: 420,
    y: 200,
    width: 190,
    height: 90,
    label: "Flash!",
    onchange: function () {
      Puck.write("digitalPulse(LED3,1,500);\n");
    },
  }),
  modal: TD.modal({
    x: 10,
    y: 10,
    width: 600,
    height: 430,
    label: "Click to connect",
    onchange: connectDevice,
  }),
};
for (var i in elements) document.body.appendChild(elements[i]);
