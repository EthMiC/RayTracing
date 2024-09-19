# RayTracing
A little RayTracing engine im making in js.

Following lines of code should all be added in the Start funtion in the init.js file

How to Initiate world scene:
createWorld(Sky Color, Sun Color, Ground/below horizon Color, Sky Color, Horizon Color, Sun Color, Sun Elavation, Sun Angle Around Scene)

How to Add Camera into the scene:
addObject("Camera", Position, Rotation, Field of View Angle)

How to Add Spheres into the scene:
addObject("Sphere", Position, Rotation(does nothing), Scale, Color, Emmision Color, Emmision Strength, Roughness);

How to Add Meshes into the scene:
addObject(Mesh Type, Position, Rotation, Scale, Color, Emmision Color, Emmision strength, roughness, if Mesh type is Cylinder then [ring number, column number])
