let onBtn = document.querySelector("#onButton");
let offBtn = document.querySelector("#offButton");

onBtn.onclick = function () {
    Puck.write("LED1.set();\n");
}

offBtn.onclick = function () {
    Puck.write("LED1.reset();\n");
}