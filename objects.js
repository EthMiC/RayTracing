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
    constructor(_integ, _clr) {
        this.integ = _integ;
        this.clr = _clr;
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