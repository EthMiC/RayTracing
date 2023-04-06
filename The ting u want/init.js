var world;
var frame = 1;

function start() {
    createWorld(0.25, 1, Color(135, 206, 235), Color(200, 200, 200), Color(255, 200, 36), Math.PI/4, Math.PI/3);
    addObject("Cam", Vector3(0, 0, -30), Vector3(0, 0, 0), 60);
    // addObject("Light", Vector3(0, 7, 0), 1, 100, Color(255, 255, 255));
    // --------------------------------------------------------------------------------------------------
    // addObject("Sphere", Vector3(0, 10010, 0), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(255, 255, 255));
    addObject("Sphere", Vector3(0, -10010, 0), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(155, 155, 155));
    // addObject("Sphere", Vector3(10010, 0, 0), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(255, 0, 255));
    // addObject("Sphere", Vector3(-10010, 0, 0), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(255, 255, 0));
    // addObject("Sphere", Vector3(0, 0, 10010), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(255, 0, 0));
    // --------------------------------------------------------------------------------------------------
    addObject("Sphere", Vector3(0, -5, 6), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(0, 0, 255));
    addObject("Sphere", Vector3(-12, -5, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(0, 255, 0));
    addObject("Sphere", Vector3(12, -5, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(255, 0, 0));
    addObject("Sphere", Vector3(0, -7, 0), Vector3(0, 0, 0), Vector3(3, 3, 3), Color(255, 255, 0));
    // --------------------------------------------------------------------------------------------------
    // addObject("Sphere", Vector3(0, 0, 0), Vector3(0, 0, 0), Vector3(50, 50, 50), Color(0, 255, 0));
    // addObject("Sphere", Vector3(0, -45, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(255, 0, 0));
    // addObject("Sphere", Vector3(0, 45, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(0, 0, 255));
    // addObject("Sphere", Vector3(-45, 0, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(255, 0, 155));
    // addObject("Sphere", Vector3(45, 0, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(155, 0, 255));
    // --------------------------------------------------------------------------------------------------

    for (let x = 0; x < renderResolution.x; x++) {
        clrs.push([]);
        for (let y = 0; y < renderResolution.y; y++) {
            clrs[x][y] = Color(0, 0, 0, true);
        }
    }
}

function createWorld(_skyPwr, _sunPwr, _zenithClr, _horizonClr, _sunClr, _sunElavation, _sunAngle){
    world = new World(_skyPwr, _sunPwr, _zenithClr, _horizonClr, _sunClr, _sunElavation, _sunAngle)
}

start();

render(objects[0]);
