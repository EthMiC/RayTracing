var world;
var Cam;
var frame = 1;

function start() {
    // Create World
    createWorld(1, 50, Color(25, 25, 25), Color(30, 50, 100), Color(155, 155, 155), Color(255, 200, 75), 0, 0);
    // Create Camera
    addObject("Cam", Vector3(-30, 0, 0), Vector3(0, 0, 0), 50);
    // Create Objects
    addObject("Plane", Vector3(-11, 0, 0), Vector3(0, -Math.PI/2, 0), Vector3(10, 10, 10), Color(255, 255, 255), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, 11, 0), Vector3(0, 0, 0), Vector3(11, 1, 11), Color(255, 50, 255), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, -11, 0), Vector3(0, 0, 0), Vector3(11, 1, 11), Color(255, 255, 50), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(11, 0, 0), Vector3(0, 0, 0), Vector3(1, 11, 11), Color(255, 50, 50), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, 0, -11), Vector3(0, 0, 0), Vector3(11, 11, 1), Color(255, 255, 255), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, 0, 11), Vector3(0, 0, 0), Vector3(11, 11, 1), Color(50, 255, 255), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, 0, 10.5), Vector3(0, 0, 0), Vector3(3, 5, 1), Color(0, 0, 0), Color(255, 255, 255), 10, 0);
    addObject("Sphere", Vector3(-3, 0, -7), Vector3(0, 0, 0), 3, Color(255, 255, 50), Color(0, 0, 0), 0, 1);

    anglePerPixelX = (Cam.fov) / renderResolution.x;
    anglePerPixelY = (Cam.fov) / renderResolution.y;
    startPixelX = (Cam.fov / 2) - (anglePerPixelX / 2);
    startPixelY = (Cam.fov / 2) - (anglePerPixelY / 2);
    for (let x = 0; x < renderResolution.x; x++) {
        clrs.push([]);
        for (let y = 0; y < renderResolution.y; y++) {
            clrs[x][y] = Color(0, 0, 0);
        }
    }
}

function createWorld(_skyPwr, _sunPwr, _groundClr, _zenithClr, _horizonClr, _sunClr, _sunElavation, _sunAngle) {
    world = new World(_skyPwr, _sunPwr, _groundClr, _zenithClr, _horizonClr, _sunClr, _sunElavation, _sunAngle)
}

start();

setTimeout(render, 10);
