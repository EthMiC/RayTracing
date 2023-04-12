var objects = [];
var lights = [];

class object {
    constructor(_pos, _rot, _scale, _clr, _type, _points, _tris) {
        this.trans = {
            "pos": { "x": _pos.x, "y": _pos.y, "z": _pos.z },
            "rot": { "x": _rot.x, "y": _rot.y, "z": _rot.z },
            "scale": { "x": _scale.x, "y": _scale.y, "z": _scale.z }
        };
        this.normal;
        this.points = _points;
        this.tris = _tris;
        this.clr = _clr;
        this.type = _type;
        this.negCorner = Vector3(0, 0, 0);
        this.posCorner = Vector3(0, 0, 0);
        for (let i = 0; i < this.points; i++){
            let p = this.points[i];
            this.negCorner = Vector3(Math.min(p.x, this.negCorner.x), Math.min(p.y, this.negCorner.y), Math.min(p.z, this.negCorner.z));
            this.posCorner = Vector3(Math.max(p.x, this.negCorner.x), Math.max(p.y, this.negCorner.y), Math.max(p.z, this.negCorner.z));
        }
    }
}

class cam {
    constructor(_pos, _rot, _fov) {
        this.trans = {
            "pos": { "x": _pos.x, "y": _pos.y, "z": _pos.z },
            "rot": { "x": _rot.x, "y": _rot.y, "z": _rot.z }
        };
        this.fov = _fov * (Math.PI / 180);
        this.type = "Cam";
    }
}

class light {
    constructor(_pos, _rad, _integ, _clr) {
        this.trans = {
            "pos": { "x": _pos.x, "y": _pos.y, "z": _pos.z },
            "rad": _rad
        };
        this.integ = _integ;
        this.clr = _clr;
        this.type = "Light";
    }
    calcPower(_vec3) {
        let dist = this.closestDist(_vec3);
        return this.integ * InverseSquareLaw(dist, _vec3);
    }
    closestDist(vec3) {
        let objDistToPoint = Dist(this.trans.pos, vec3);
        return objDistToPoint - this.trans.rad;
    }
}

class World {
    constructor(_skyPwr, _sunPwr, _groundClr, _zenithClr, _horizonClr, _sunClr, _sunElavation, _sunAngle) {
        this.skyPwr = _skyPwr;
        this.sunPwr = _sunPwr;
        this.groundClr = _groundClr;
        this.zenithClr = _zenithClr;
        this.horizonClr = _horizonClr;
        this.sunClr = _sunClr;
        this.sunElavation = _sunElavation;
        this.sunAngle = _sunAngle;
    }
    getSunDir(){
        return normalize(Vector3(Math.sin(this.sunAngle) * Math.cos(this.sunElavation), Math.sin(this.sunElavation), Math.cos(this.sunAngle) * Math.cos(this.sunElavation)));
    }
    getColor(_dir){
        let skyClr = ColorLerp(this.horizonClr, this.zenithClr, Math.pow(smoothStep(0, 0.4, _dir.y), 0.35));
        let sunFocus = 500;
        let sun = Math.pow(Math.max(0, VectorDotProduct(_dir, this.getSunDir())), sunFocus) * this.sunPwr;

        let ground = smoothStep(-0.01, 0, _dir.y);
        skyClr = ColorLerp(this.groundClr, skyClr, ground);
        let sunMask = ground >= 1;
        return ColorAdd(ColorScalarMult(skyClr, this.skyPwr), ColorScalarMult(ColorScalarMult(this.sunClr, sun), sunMask));
    }
    
}

function addObject(_type, _pos, _i1, _i2, _i3, _i4, _i5) {
    switch (_type) {
        case "Camera":
            /*
            rot = i1;
            fov = i2;
            */
            objects.push(new cam(_pos, _i1, _i2));
            Cam = objects[objects.length - 1];
            break;
        case "Light":
            /*
            rad = i1;
            integ = i2;
            clr = i3;
            */
            var newLight = new light(_pos, _i1, _i2, _i3);
            lights.push(newLight);
            break;
        case "Custom":
            /*
            rot = i1;
            scale = i2;
            clr = i3;
            points = i4;
            tris = i5;
            */
            objects.push(new object(_pos, _i1, _i2, _i3, "Mesh", _i4, _i5));
            break;
        case "Cube":
                /*
                rot = i1;
                scale = i2;
                clr = i3;
                points = i4;
                tris = i5;
                */
                let cubeVerts = [Vector3(-1, -1, -1), Vector3(1, -1, -1), Vector3(-1, 1, -1), Vector3(1, 1, -1), Vector3(-1, -1, 1), Vector3(1, -1, 1), Vector3(-1, 1, 1), Vector3(1, 1, 1)];
                let cubeTris = [0, 2, 3, 0, 3, 1, 4, 6, 2, 4, 2, 0, 5, 7, 6, 5, 6, 4, 1, 3, 7, 1, 7, 5, 4, 0, 1, 4, 1, 5, 2, 6, 7, 2, 7, 3];
                objects.push(new object(_pos, _i1, _i2, _i3, "Mesh", cubeVerts, cubeTris));
                break;
        default:
            /*
            rot = i1;
            scale = i2;
            clr = i3;
            */
            objects.push(new object(_pos, _i1, _i2, _i3, _type));
            break;
    }
}