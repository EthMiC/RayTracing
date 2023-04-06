var objects = [];
var lights = [];

class object {
    constructor(_pos, _rot, _scale, _clr, _type) {
        this.trans = {
            "pos": { "x": _pos.x, "y": _pos.y, "z": _pos.z },
            "rot": { "x": _rot.x, "y": _rot.y, "z": _rot.z },
            "scale": { "x": _scale.x, "y": _scale.y, "z": _scale.z }
        };
        this.clr = _clr;
        this.type = _type;
    }
    closestDist(vec3) {
        let objDistToPoint = Dist(this.trans.pos, vec3);
        return Math.abs(objDistToPoint - this.trans.scale.x);
    }
    normal(_vec3) {
        return normalize(VectorSub(_vec3, this.trans.pos));
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
    constructor(_skyPwr, _sunPwr, _zenithClr, _horizonClr, _sunClr, _sunElavation, _sunAngle) {
        this.skyPwr = _skyPwr;
        this.zenithClr = _zenithClr;
        this.horizonClr = _horizonClr;
        this.sunClr = _sunClr;
        this.sunElavation = _sunElavation;
        this.sunAngle = _sunAngle;
        this.sunPwr = _sunPwr;
    }
    getSunDir(){
        return normalize(Vector3(Math.sin(this.sunAngle), Math.sin(this.sunElavation), Math.cos(this.sunAngle)));
    }
    getColor(_dir){
        let skyClr = ColorLerp(this.horizonClr, this.zenithClr, clamp(VectorDotProduct(Vector3(0, 1, 0), _dir) * 4, 0, 1));
        let sunDiv = 2.5
        let sunAmount = ColorLerp(Color(0, 0, 0), this.sunClr, Math.pow(clamp(VectorDotProduct(this.getSunDir(), _dir), 0, 1), sunDiv) / Math.pow(5, sunDiv - 1));
        return ColorAdd(ColorScalarMult(skyClr, this.skyPwr), ColorScalarMult(sunAmount, this.sunPwr));
    }
    
}

function addObject(_type, _pos, _i1, _i2, _i3) {
    switch (_type) {
        case "Cam":
            /*
            rot = i1;
            fov = i2;
            */
            objects.push(new cam(_pos, _i1, _i2));
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