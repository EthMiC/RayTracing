var world;
var Cam;
var frame = 1;

function start() {
    //Edit these to change World and Camera parameters
    createWorld(1, 100, Color(25, 25, 25), Color(30, 50, 100), Color(155, 155, 155), Color(255, 200, 75), 0, 0);
    addObject("Camera", Vector3(0, 0, 0), Vector3(0, 0, 0), 60);

    //Add objects here

    //Dont Touch
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
