# RayTracing
A little RayTracing engine im making in js.
Not properly implemented, im using a shortcut and consequently any light bounce number above 2 makes the whole thing look ugly.

Following lines of code should all be added in the Start funtion in the init.js file

How to Initiate world scene:
createWorld(Sky Intensity: number, Sun Intensity: number, Ground/below horizon Color: Color(), Sky Color: Color(), Horizon Color: Color(), Sun Color: Color(), Sun Elavation: number, Sun Angle Around Scene: number)

How to Add Camera into the scene:
    addObject("Cam", Vector3(-30, 0, 0), Vector3(0, 0, 0), 50);
addObject("Cam", Position: Vector3, Rotation: Vector3, Field of View Angle: number)

How to Add Spheres into the scene:
addObject("Spheres", Position: Vector, Rotation: Vector, Scale: Vector, Color: Color, Emmision Color: Color, Emmision Strength: number, Roughness: number);

How to Add Meshes into the scene:
addObject(Mesh Type: String, Position: Vector, Rotation: Vector, Scale: Vector, Color: Color, Emmision Color: Color, Emmision strength: number, roughness: number, if Mesh type is Cylinder then [ring number: number, column number: number])

A Vector is a function with 3 parameters
    Vector(x, y, z)

A Color is a function with 3 parameters
    Color(r, g, b)