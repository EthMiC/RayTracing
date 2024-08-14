var world;
var Cam;
var frame = 1;

function start() {
    createWorld(1, 50, Color(25, 25, 25), Color(30, 50, 100), Color(155, 155, 155), Color(255, 200, 75), 0, 0);
    addObject("Cam", Vector3(-30, 0, 0), Vector3(0, 0, 0), 50);
    // addObject("Light", Vector3(0, 0, 7), 1, 50, Color(255, 255, 255));
    // addObject("Light", Vector3(-3, -3, -3), .5, 10, Color(255, 0, 0));
    // --------------------------------------------------------------------------------------------------
    // addObject("Plane", Vector3(0, 0, -10), Vector3(0, 0, 0), Vector3(1000, 1000, 1000), Color(150, 230, 10), Color(0, 0, 0), 0, 1);
    // --------------------------------------------------------------------------------------------------
    // for (let t = 0; t < 10; t++) {
    //     let randX = Math.random() * 80; 
    //     let randY = (Math.random()-0.5) * 80;
        // addObject("Cylinder", Vector3(randX, randY, 5), Vector3(0, 0, 0), Vector3(1, 1, 9), Color(164, 116, 73), Color(0, 0, 0), 0, 1, [2, 5]);
        // addObject("Cube", Vector3(randX, randY, -5), Vector3(0, 0, 0), Vector3(0.75, 0.75, 10), Color(164, 116, 73), Color(0, 0, 0), 0, 1);
        // addObject("Cube", Vector3(randX, randY, 1), Vector3(0, 0, 0), Vector3(3, 3, 4), Color(255, 255, 0), Color(0, 0, 0), 0, 0.75);
        // addObject("Sphere", Vector3(randX, randY, -1), Vector3(0, 0, 0), 5, Color(255, 255, 0), Color(0, 0, 0), 0, 0.75);
        // addObject("Sphere", Vector3(randX, randY, 2), Vector3(0, 0, 0), 3, Color(155, 255, 0), Color(0, 0, 0), 0, 0.75);
    // }
    // for (let t = 0; t < 100; t++) {
    //     let randX = (Math.random()-0.5) * 80;
    //     let randZ = Math.random() * 80; 
    //     addObject("Cylinder", Vector3(randX, -5.5, randZ), Vector3(0, 0, 0), Vector3(1, 9, 1), Color(164, 116, 73), 1, [2, 5]);
    //     //addObject("Cube", Vector3(randX, -5, randZ), Vector3(0, 0, 0), Vector3(0.75, 10, 0.75), Color(164, 116, 73), 1);
    //     // addObject("Cube", Vector3(randX, 1, randZ), Vector3(0, 0, 0), Vector3(3, 4, 3), Color(255, 255, 0), 0.75);
    //     addObject("Sphere", Vector3(randX, -1, randZ), Vector3(0, 0, 0), 5, Color(255, 255, 0), 0.75);
    //     addObject("Sphere", Vector3(randX, 2, randZ), Vector3(0, 0, 0), 3, Color(155, 255, 0), 0.75);
    // }
    // --------------------------------------------------------------------------------------------------
    // addObject("Plane", Vector3(0, 0, 0), Vector3(0, 0, 0), Vector3(10, 10, 10), Color(200, 255, 100), Color(0, 0, 0), 0, 1);
    // addObject("Plane", Vector3(0, 0, -10), Vector3(0, 0, 0), Vector3(1000, 1000, 1000), Color(200, 255, 100), 0.1);
    // addObject("Plane", Vector3(0, 0, 0), Vector3(Math.PI/2, 0, 0), Vector3(10, 10, 10), Color(200, 255, 100), 1);
    // addObject("Plane", Vector3(0, 0, 0), Vector3(3*Math.PI/4, 0, 0), Vector3(10, 10, 10), Color(200, 255, 100), 1);
    // addObject("Plane", Vector3(0, 0, 0), Vector3(Math.PI, 0, 0), Vector3(10, 10, 10), Color(200, 255, 100), 1);
    // addObject("Plane", Vector3(0, 0, 0), Vector3(5*Math.PI/4, 0, 0), Vector3(10, 10, 10), Color(200, 255, 100), 1);
    // addObject("Plane", Vector3(0, 0, 0), Vector3(3*Math.PI/2, 0, 0), Vector3(10, 10, 10), Color(200, 255, 100), 1);
    // addObject("Plane", Vector3(0, 0, 0), Vector3(7*Math.PI/4, 0, 0), Vector3(10, 10, 10), Color(200, 255, 100), 1);
    // --------------------------------------------------------------------------------------------------
    // addObject("Cylinder", Vector3(0, 0, 0), Vector3(0, 0, 0), Vector3(5, 5, 10), Color(164, 116, 73), Color(0, 0, 0), 0, 1, [2, 40]);
    // --------------------------------------------------------------------------------------------------
    // addObject("Plane", Vector3(0, 0, 0), Vector3(0, Math.PI/2, 0), Vector3(10, 10, 10), Color(200, 255, 100), Color(0, 0, 0), 0, 1);
    // --------------------------------------------------------------------------------------------------
    addObject("Plane", Vector3(-11, 0, 0), Vector3(0, -Math.PI/2, 0), Vector3(10, 10, 10), Color(255, 255, 255), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, 11, 0), Vector3(0, 0, 0), Vector3(11, 1, 11), Color(255, 50, 255), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, -11, 0), Vector3(0, 0, 0), Vector3(11, 1, 11), Color(255, 255, 50), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(11, 0, 0), Vector3(0, 0, 0), Vector3(1, 11, 11), Color(255, 50, 50), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, 0, -11), Vector3(0, 0, 0), Vector3(11, 11, 1), Color(255, 255, 255), Color(0, 0, 0), 0, 1);
    addObject("Cube", Vector3(0, 0, 11), Vector3(0, 0, 0), Vector3(11, 11, 1), Color(50, 255, 255), Color(0, 0, 0), 0, 1);
    // --------------------------------------------------------------------------------------------------
    addObject("Cube", Vector3(0, 0, 10.5), Vector3(0, 0, 0), Vector3(3, 5, 1), Color(0, 0, 0), Color(255, 255, 255), 10, 0);
    // --------------------------------------------------------------------------------------------------
    // addObject("Sphere", Vector3(0, 10010, 0), Vector3(0, 0, 0), 10000, Color(155, 155, 155), Color(0, 0, 0), 0, 1);
    // addObject("Sphere", Vector3(0, -10010, 0), Vector3(0, 0, 0), 10000, Color(255, 0, 255), Color(0, 0, 0), 0, 1);
    // addObject("Sphere", Vector3(10010, 0, 0), Vector3(0, 0, 0), 10000, Color(255, 255, 0), Color(0, 0, 0), 0, 1);
    // addObject("Sphere", Vector3(0, 0, -10010), Vector3(0, 0, 0), 10000, Color(0, 255, 255), Color(0, 0, 0), 0, 1);
    // addObject("Sphere", Vector3(0, 0, 10010), Vector3(0, 0, 0), 10000, Color(255, 0, 0), Color(0, 0, 0), 0, 1);
    // --------------------------------------------------------------------------------------------------
    // addObject("Custom", Vector3(5, -5, 0), Vector3(Math.PI/2, Math.PI/2, 0), Vector3(10, 10, 10), Color(100, 200, 100), 1, [Vector3(-1, 0, -1), Vector3(1, 0, -1), Vector3(-1, 0, 1), Vector3(1, 0, 1)], [0, 2, 3, 0, 3, 1]);
    // addObject("Custom", Vector3(-5, 0, 0), Vector3(Math.PI/2, 0, 0), Vector3(10, 10, 10), Color(100, 200, 100), 1, [Vector3(-1, 0, -1), Vector3(1, 0, -1), Vector3(-1, 0, 1), Vector3(1, 0, 1)], [0, 2, 3, 0, 3, 1]);
    // --------------------------------------------------------------------------------------------------
    // addObject("Cube", Vector3(0, 0, 0), Vector3(0, 0, 0), Vector3(20, 10, 20), Color(255, 200, 155), 1);
    // addObject("Cube", Vector3(0, 0, -17.5), Vector3(0, 0, 0), Vector3(2.5, 7.5, 5), Color(255, 200, 155), 1);
    // --------------------------------------------------------------------------------------------------
    // addObject("Sphere", Vector3(0, -4, 6), Vector3(0, 0, 0), 5, Color(0, 0, 255), 1);
    // addObject("Sphere", Vector3(-12, -5, 0), Vector3(0, 0, 0), 5, Color(0, 255, 0), 1);
    // addObject("Sphere", Vector3(12, -5, 0), Vector3(0, 0, 0), 5, Color(255, 0, 0), 1);
    addObject("Sphere", Vector3(-3, 0, -7), Vector3(0, 0, 0), 3, Color(255, 255, 50), Color(0, 0, 0), 0, 1);
    // --------------------------------------------------------------------------------------------------
    // addObject("Sphere", Vector3(0, 0, 0), Vector3(0, 0, 0), 50, Color(0, 255, 0), 1);
    // addObject("Sphere", Vector3(0, -45, 0), Vector3(0, 0, 0), 5, Color(255, 0, 0), 1);
    // addObject("Sphere", Vector3(0, 45, 0), Vector3(0, 0, 0), 5, Color(0, 0, 255), 1);
    // addObject("Sphere", Vector3(-45, 0, 0), Vector3(0, 0, 0), 5, Color(255, 0, 155), 1);
    // addObject("Sphere", Vector3(45, 0, 0), Vector3(0, 0, 0), 5, Color(155, 0, 255), 1);
    // --------------------------------------------------------------------------------------------------

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
