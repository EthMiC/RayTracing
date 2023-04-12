var world;
var Cam;
var frame = 1;

function start() {
    createWorld(1, 10, Color(25, 25, 25), Color(30, 50, 100), Color(155, 155, 155), Color(255, 200, 75), Math.PI/8, 0);
    addObject("Camera", Vector3(0, 60, -60), Vector3(-Math.PI/4, 0, 0), 60);
    // addObject("Light", Vector3(0, 7, 0), 1, 2.5, Color(255, 255, 255));
    // addObject("Light", Vector3(-3, -3, -3), .5, 1, Color(255, 0, 0));
    // --------------------------------------------------------------------------------------------------
    addObject("Custom", Vector3(0, -10, 0), Vector3(0, 0, 0), Vector3(1000, 1000, 1000), Color(255, 255, 255), [Vector3(-1, 0, -1), Vector3(1, 0, -1), Vector3(-1, 0, 1), Vector3(1, 0, 1)], [0, 2, 3, 0, 3, 1]);
    // --------------------------------------------------------------------------------------------------
    // addObject("Sphere", Vector3(0, 10010, 0), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(0, 255, 255));
    // addObject("Sphere", Vector3(0, -10010, 0), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(155, 155, 155));
    // addObject("Sphere", Vector3(10010, 0, 0), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(255, 0, 255));
    // addObject("Sphere", Vector3(-10010, 0, 0), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(255, 255, 0));
    // addObject("Sphere", Vector3(0, 0, 10010), Vector3(0, 0, 0), Vector3(10000, 5, 5), Color(255, 0, 0));
    // --------------------------------------------------------------------------------------------------
    // addObject("Custom", Vector3(5, -5, 0), Vector3(Math.PI/2, Math.PI/2, 0), Vector3(10, 10, 10), Color(100, 200, 100), [Vector3(-1, 0, -1), Vector3(1, 0, -1), Vector3(-1, 0, 1), Vector3(1, 0, 1)], [0, 2, 3, 0, 3, 1]);
    // addObject("Custom", Vector3(-5, 0, 0), Vector3(Math.PI/2, 0, 0), Vector3(10, 10, 10), Color(100, 200, 100), [Vector3(-1, 0, -1), Vector3(1, 0, -1), Vector3(-1, 0, 1), Vector3(1, 0, 1)], [0, 2, 3, 0, 3, 1]);
    // --------------------------------------------------------------------------------------------------
    addObject("Cube", Vector3(0, 0, 0), Vector3(0, 0, 0), Vector3(20, 10, 20), Color(255, 200, 155));
    addObject("Cube", Vector3(0, 0, -17.5), Vector3(0, 0, 0), Vector3(2.5, 7.5, 5), Color(255, 200, 155));
    // --------------------------------------------------------------------------------------------------
    // addObject("Sphere", Vector3(0, -4, 6), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(0, 0, 255));
    // addObject("Sphere", Vector3(-12, -5, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(0, 255, 0));
    // addObject("Sphere", Vector3(12, -5, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(255, 0, 0));
    // addObject("Sphere", Vector3(0, -7, -3), Vector3(0, 0, 0), Vector3(3, 3, 3), Color(255, 255, 0));
    // addObject("Custom", Vector3(0, 0, 10), Vector3(0, 0, 0), Vector3(10, 10, 10), Color(100, 255, 200), [Vector3(-1, -1, 0), Vector3(1, -1, 0), Vector3(-1, 1, 0), Vector3(1, 1, 0)], [0, 2, 3, 0, 3, 1]);
    // addObject("Custom", Vector3(10, 0, 0), Vector3(0, 0, 0), Vector3(10, 10, 10), Color(100, 255, 200), [Vector3(0, -1, 1), Vector3(0, -1, -1), Vector3(0, 1, 1), Vector3(0, 1, -1)], [0, 2, 3, 0, 3, 1]);
    // addObject("Custom", Vector3(-10, 0, 0), Vector3(0, 0, 0), Vector3(10, 10, 10), Color(100, 255, 200), [Vector3(0, -1, -1), Vector3(0, -1, 1), Vector3(0, 1, -1), Vector3(0, 1, 1)], [0, 2, 3, 0, 3, 1]);
    // --------------------------------------------------------------------------------------------------
    // addObject("Sphere", Vector3(0, 0, 0), Vector3(0, 0, 0), Vector3(50, 50, 50), Color(0, 255, 0));
    // addObject("Sphere", Vector3(0, -45, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(255, 0, 0));
    // addObject("Sphere", Vector3(0, 45, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(0, 0, 255));
    // addObject("Sphere", Vector3(-45, 0, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(255, 0, 155));
    // addObject("Sphere", Vector3(45, 0, 0), Vector3(0, 0, 0), Vector3(5, 5, 5), Color(155, 0, 255));
    // --------------------------------------------------------------------------------------------------

    anglePerPixelX = (Cam.fov) / renderResolution.x;
    anglePerPixelY = (Cam.fov) / renderResolution.y;
    startPixelX = (Cam.fov / 2) - (anglePerPixelX);
    startPixelY = (Cam.fov / 2) - (anglePerPixelY);
    for (let x = 0; x < renderResolution.x; x++) {
        clrs.push([]);
        for (let y = 0; y < renderResolution.y; y++) {
            clrs[x][y] = Color(0, 0, 0, true);
        }
    }
}

function createWorld(_skyPwr, _sunPwr, _groundClr, _zenithClr, _horizonClr, _sunClr, _sunElavation, _sunAngle){
    world = new World(_skyPwr, _sunPwr, _groundClr, _zenithClr, _horizonClr, _sunClr, _sunElavation, _sunAngle)
}

start();

render();
