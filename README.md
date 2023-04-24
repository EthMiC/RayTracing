# RayTracing
A little RayTracing engine im making in js.
Not properly implemented, im using a shortcut and consequently any light bounce number above 2 makes the whole thing look ugly.

Following lines of code should all be added in the Start funtion in the init.js file

How to Initiate world scene:
createWorld(Sky Color, Sun Color, Ground/below horizon Color, Sky Color, Horizon Color, Sun Color, Sun Elavation, Sun Angle Around Scene)

How to Add Camera into the scene:
addObject("Camera", Position, Rotation, Field of View Angle)

How to Add Spheres into the scene:
addObject("Sphere", Position, Rotation(does nothing), Scale, Color, Roughness);

How to Add Meshes into the scene:
addObject(Mesh Type, Position, Rotation, Scale, Color, roughness, if Mesh type is Cylinder then [ring number, column number])
