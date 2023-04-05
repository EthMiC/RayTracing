var renderResolution = { "x": 250, "y": 250 };
var aspectRatio = renderResolution.x / renderResolution.y;
var projectResolution = { "x": 1000, "y": 1000 };
var bounces = 1;
var image;

var canv = document.getElementById('canvas');
canv.width = projectResolution.x;
canv.height = projectResolution.y;
var ctx = canv.getContext("2d");
var clrs = [];

function render(_cam) {
    setTimeout(() => {
        frame++;
        render(objects[0]);
    }, 0)
    anglePerPixelX = (_cam.fov) / renderResolution.x;
    anglePerPixelY = (_cam.fov) / renderResolution.y;
    startPixelX = (_cam.fov / 2) - (anglePerPixelX);
    startPixelY = (_cam.fov / 2) - (anglePerPixelY);
    let pixels = [];
    for (let x = 0; x < renderResolution.x; x++) {
        pixels.push([]);
        for (let y = 0; y < renderResolution.y; y++) {
            let clr = Color(0, 0, 0, true);
            let r = new ray(Vector3(_cam.trans.pos.x, _cam.trans.pos.y, _cam.trans.pos.z), AngToDir(Vector3(((startPixelY - (anglePerPixelY * y)) / aspectRatio), startPixelX - (anglePerPixelX * x), 0)).forward);
            let rayClr = Color(255, 255, 255);
            let lightClr = Color(0, 0, 0, true);
            let illuminated = false;
            let lastObj;
            for (let i = 0; i < bounces + 1; i++) {
                obj = r.shootRay();
                if (obj) {
                    if (obj.type != "Light") {
                        // clr = ColorAdd(clr, ColorScalarMult(dls(r.hitPoint, obj), Math.pow(InverseSquareLaw(dists[x][y]), 1/4)));
                        rayClr = ColorMult(rayClr, obj.clr);
                        r.trans.pos = r.hitPoint;
                        r.trans.dir = VectorBounce(r.trans.dir, obj.normal(r.hitPoint));
                        lastObj = obj;
                    }
                    else {
                        if (i < 1) {
                            // clr = ColorAdd(clr, ColorScalarDiv(ColorScalarMult(obj.clr, obj.calcPower(r.hitPoint)), bounces + 1));
                            lightClr = ColorAdd(lightClr, ColorScalarMult(obj.clr, obj.calcPower(r.hitPoint)));
                            illuminated = true;
                        }
                        break;
                    }
                }
                else {
                    if (i < 1) {
                        // clr = ColorAdd(clr, ColorScalarDiv(ColorScalarMult(world.clr, world.integ), bounces + 1));
                        lightClr = ColorAdd(lightClr, ColorScalarMult(world.clr, world.integ));
                        illuminated = true;
                    }
                    break;
                }
            }
            if (obj && !illuminated) {
                lightClr = ColorAdd(lightClr, dls(r.hitPoint, lastObj));
            }
            clr = ColorScalarMult(ColorMult(lightClr, rayClr), 4);
            clrs[x][y] = ColorAdd(clrs[x][y], clr);
            pixels[x][y] = scaleLight(ColorScalarDiv(clrs[x][y], frame));
        }
    }
    console.log(scaleLight(ColorScalarDiv(clrs[125][125], frame)));

    let xScale = projectResolution.x / renderResolution.x;
    let yScale = (projectResolution.y / renderResolution.y);
    for (let x = 0; x < renderResolution.x; x++) {
        for (let y = 0; y < renderResolution.y; y++) {
            let p = pixels[renderResolution.x - x - 1][renderResolution.y - y - 1];
            ctx.fillStyle = p;
            ctx.fillRect(x * xScale, (renderResolution.y - y - 1) * yScale, xScale, yScale);
        }
    }
}

function dls(_pos, _obj) {
    let _clr = Color(0, 0, 0);
    let dir;
    for (let i = 0; i < lights.length; i++) {
        l = lights[i];
        dir = DirTo(_pos, l.trans.pos);
        let dlsr = new ray(_pos, dir);
        // console.log(dlsr.trans.pos);
        let obj = dlsr.shootRay(l, _obj);
        // console.log(dlsr.trans.pos);
        if (obj == l) {
            let lightPower = VectorDotProduct(dlsr.trans.dir, _obj.normal(_pos));
            _clr = ColorAdd(_clr, ColorScalarMult(ColorScalarMult(ColorMult(_obj.clr, l.clr), l.calcPower(_pos)), lightPower));
        }
        // _clr = ColorScalarMult(Color(dlsr.trans.rot.x, dlsr.trans.rot.y, dlsr.trans.rot.z), 25);
    }
    // _clr = _obj.clr;
    return _clr;
}

class ray {
    constructor(_pos, _dir, _minDir) {
        this.trans = {
            "pos": _pos,
            "dir": _dir,
        };
    }
    shootRay(_l, _obj) {
        this.iters = 0;
        let minDist = Infinity;
        let minDistInt;
        let minDistType;

        for (let j = 0; j < objects.length; j++) {
            let o = objects[j];
            if (o.type != "Cam") {
                let offsetPos = VectorSub(this.trans.pos, o.trans.pos);
                if (o == _obj) {
                    offsetPos = VectorSub(VectorAdd(this.trans.pos, VectorScalarDiv(_obj.normal(this.trans.pos), 10)), o.trans.pos);
                }
                let b = VectorDotProduct(offsetPos, this.trans.dir);
                let c = VectorDotProduct(offsetPos, offsetPos) - Math.pow(o.trans.scale.x, 2);
                let discriminant = b * b - c;
                if (discriminant >= 0) {
                    let dst1 = -b + Math.sqrt(discriminant);
                    let dst2 = -b - Math.sqrt(discriminant);
                    let dst;
                    if (dst1 >= 0) {
                        if (dst2 >= 0) {
                            dst = Math.min(dst1, dst2);
                            if (dst < minDist) {
                                minDist = dst;
                                minDistInt = j;
                                minDistType = "Object";
                            }
                        }
                        else {
                            dst = dst1;
                        }
                    }
                }
            }
        }

        if (!_l) {
            for (let j = 0; j < lights.length; j++) {
                let l = lights[j];
                let offsetPos = VectorSub(this.trans.pos, l.trans.pos);
                let b = VectorDotProduct(offsetPos, this.trans.dir);
                let c = VectorDotProduct(offsetPos, offsetPos) - Math.pow(l.trans.rad, 2);
                let discriminant = b * b - c;
                if (discriminant >= 0) {
                    let dst1 = -b + Math.sqrt(discriminant);
                    let dst2 = -b - Math.sqrt(discriminant);
                    let dst;
                    if (dst1 + dst2 >= dst1 && dst1 + dst2 >= dst2) {
                        dst = Math.min(dst1, dst2);
                        if (dst < minDist) {
                            minDist = dst;
                            minDistInt = j;
                            minDistType = "Light";
                        }
                    }
                }
            }
        }
        else {
            let offsetPos = VectorSub(this.trans.pos, _l.trans.pos);
            let b = VectorDotProduct(offsetPos, this.trans.dir);
            let c = VectorDotProduct(offsetPos, offsetPos) - Math.pow(_l.trans.rad, 2);
            let discriminant = b * b - c;
            if (discriminant >= 0) {
                let dst1 = -b + Math.sqrt(discriminant);
                let dst2 = -b - Math.sqrt(discriminant);
                let dst;
                if (dst1 + dst2 >= dst1 && dst1 + dst2 >= dst2) {
                    dst = Math.min(dst1, dst2);
                    if (dst < minDist) {
                        minDist = dst;
                        minDistInt = null;
                        minDistType = null;
                    }
                }
            }
        }

        this.hitPoint = VectorAdd(this.trans.pos, VectorScalarMult(this.trans.dir, minDist));
        return minDistType ? minDistType == "Object" ? objects[minDistInt] : lights[minDistInt] : _l;
    }
}