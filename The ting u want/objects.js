var objects = [];
var lights = [];

class object {
    constructor(_pos, _rot, _scale, _clr, _roughness, _type, _points, _tris) {
        this.trans = {
            "pos": { "x": _pos.x, "y": _pos.y, "z": _pos.z },
            "rot": { "x": _rot.x, "y": _rot.y, "z": _rot.z },
            "scale": { "x": _scale.x, "y": _scale.y, "z": _scale.z }
        };
        this.clr = _clr;
        this.roughness = _roughness;
        this.type = _type;
        if (this.type == "Mesh") {
            this.points = _points;
            this.tris = _tris;
            this.updateBounds();
        }
    }
    updateBounds() {
        this.negCorner = Vector3(0, 0, 0);
        this.posCorner = Vector3(0, 0, 0);
        let fnlVec = (_raw) => {
            let defVec = VectorMult(_raw, this.trans.scale);
            let orientation = AngToDir(this.trans.rot);
            let forVec = VectorScalarMult(orientation.front, defVec.z);
            let upVec = VectorScalarMult(orientation.up, defVec.y);
            let rigVec = VectorScalarMult(orientation.right, defVec.x);
            return VectorAdd(VectorAdd(forVec, rigVec), upVec);
        }
        for (let i = 0; i < this.points.length; i++) {
            let p = fnlVec(this.points[i]);
            this.negCorner = Vector3(Math.min(p.x, this.negCorner.x), Math.min(p.y, this.negCorner.y), Math.min(p.z, this.negCorner.z));
            this.posCorner = Vector3(Math.max(p.x, this.posCorner.x), Math.max(p.y, this.posCorner.y), Math.max(p.z, this.posCorner.z));
        }
        // console.log(this.trans);
        // console.log(Dist(this.negCorner, this.posCorner));
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
    getSunDir() {
        return normalize(Vector3(Math.sin(this.sunAngle) * Math.cos(this.sunElavation), Math.sin(this.sunElavation), Math.cos(this.sunAngle) * Math.cos(this.sunElavation)));
    }
    getColor(_dir) {
        let skyClr = ColorLerp(this.horizonClr, this.zenithClr, Math.pow(smoothStep(0, 0.4, _dir.y), 0.35));
        let sunFocus = 500;
        let sun = Math.pow(Math.max(0, VectorDotProduct(_dir, this.getSunDir())), sunFocus) * this.sunPwr;

        let ground = smoothStep(-0.01, 0, _dir.y);
        skyClr = ColorLerp(this.groundClr, skyClr, ground);
        let sunMask = ground >= 1;
        return ColorAdd(ColorScalarMult(skyClr, this.skyPwr), ColorScalarMult(ColorScalarMult(this.sunClr, sun), sunMask));
    }

}

function addObject(_type, _pos, _i1, _i2, _i3, _i4, _i5, _i6) {
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
            roughness = i4;
            */
            var newLight = new light(_pos, _i1, _i2, _i3, _i4);
            lights.push(newLight);
            break;
        case "Custom":
            /*
            rot = i1;
            scale = i2;
            clr = i3;
            roughness = i4;
            points = i5;
            tris = i6;
            */
            objects.push(new object(_pos, _i1, _i2, _i3, _i4, "Mesh", _i5, _i6));
            break;
        case "Cube":
            /*
            rot = i1;
            scale = i2;
            clr = i3;
            roughness = i4;
            points = i5;
            tris = i6;
            */
            let cubeVerts = [Vector3(-1, -1, -1), Vector3(1, -1, -1), Vector3(-1, 1, -1), Vector3(1, 1, -1), Vector3(-1, -1, 1), Vector3(1, -1, 1), Vector3(-1, 1, 1), Vector3(1, 1, 1)];
            let cubeTris = [0, 2, 3, 0, 3, 1, 4, 6, 2, 4, 2, 0, 5, 7, 6, 5, 6, 4, 1, 3, 7, 1, 7, 5, 4, 0, 1, 4, 1, 5, 2, 6, 7, 2, 7, 3];
            objects.push(new object(_pos, _i1, _i2, _i3, _i4, "Mesh", cubeVerts, cubeTris));
            break;
        case "Plane":
            /*
            rot = i1;
            scale = i2;
            clr = i3;
            roughness = i4;
            points = i5;
            tris = i6;
            */
            let planeVerts = [Vector3(-1, 0, -1), Vector3(1, 0, -1), Vector3(-1, 0, 1), Vector3(1, 0, 1)];
            let planeTris = [0, 2, 3, 0, 3, 1];
            objects.push(new object(_pos, _i1, _i2, _i3, _i4, "Mesh", planeVerts, planeTris));
            break;
        case "Cylinder":
            /*
            rot = i1;
            scale = i2;
            clr = i3;
            roughness = i4;
            rings = i5[0];
            colss = i5[1];
            */
            let cylinderData = makeCylinder(Math.max(_i5[0], 2), Math.max(_i5[1], 3));
            objects.push(new object(_pos, _i1, _i2, _i3, _i4, "Mesh", cylinderData.verts, cylinderData.tris));
            break;
        default:
            /*
            rot = i1;
            scale = i2;
            clr = i3;
            */
            objects.push(new object(_pos, _i1, Vector3(_i2, 0, 0), _i3, _i4, _type));
            break;
    }
}

function makeCylinder(_rings, _cols) {
    let verts = [];
    verts.push(Vector3(0, -1, 0));
    for (let r = 0; r < _rings; r++) {
        for (let c = 0; c < _cols; c++) {
            let x = -Math.sin(2 * Math.PI * c / (_cols));
            let y = -1 + (2 * r / (_rings - 1));
            let z = Math.cos(2 * Math.PI * c / (_cols));
            let circle = normalize(Vector3(x, 0, z));
            verts.push(VectorAdd(circle, Vector3(0, y, 0)));
        }
    }
    verts.push(Vector3(0, 1, 0));
    let tris = [];
    for (let r = 1; r <= _rings + 1; r++) {
        for (let c = 1; c <= _cols; c++) {
            switch (r) {
                case 1:
                    tris.push(0, c, c >= _cols ? 1 : c + 1);
                    break;
                case _rings + 1:
                    tris.push(((_rings - 1) * _cols) + c, (_rings * _cols) + 1, c >= _cols ? ((_rings - 1) * _cols) + 1 : ((_rings - 1) * _cols) + c + 1);
                    break
                default:
                    tris.push((r - 2) * _cols + c, (r - 1) * _cols + c, c >= _cols ? (r - 1) * _cols + 1 : (r - 1) * _cols + c + 1);
                    tris.push((r - 2) * _cols + c, c >= _cols ? (r - 1) * _cols + 1 : (r - 1) * _cols + c + 1, c >= _cols ? r - 1 : (r - 2) * _cols + c + 1);
                    break;
            }
        }
    }
    return { "verts": verts, "tris": tris };
}