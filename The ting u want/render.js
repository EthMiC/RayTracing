var renderResolution = { "x": 100, "y": 100 };
var projectResolution = { "x": 1000, "y": 1000 };
var aspectRatio = projectResolution.x / projectResolution.y;
var bounces = 4;

var canv = document.getElementById('canvas');
var fpsCounter = document.getElementById('fpsCounter');
var maxFpsCounter = document.getElementById('maxFpsCounter');
canv.width = projectResolution.x;
canv.height = projectResolution.y;
var ctx = canv.getContext("2d");
var clrs = [];
var time = Date.now();
var maxFrameRate = 0;
let frameRate = 0;

function render() {
    setTimeout(() => {
        frame++;
        render(objects[0]);
    }, 0)
    // let pixels = [];
    for (let x = 0; x < renderResolution.x; x++) {
        // pixels.push([]);
        for (let y = 0; y < renderResolution.y; y++) {
            let obj;
            let clr = Color(0, 0, 0);
            let r = new ray(Vector3(Cam.trans.pos.x, Cam.trans.pos.y, Cam.trans.pos.z), AngToRay(AngToDir(Cam.trans.rot), Vector3(0, ((startPixelY - (anglePerPixelY * y)) / aspectRatio), startPixelX - (anglePerPixelX * x))));
            let rayClr = Color(255, 255, 255);
            let incLight = Color(0, 0, 0);
            for (let i = bounces; i >= 0; i--) {
                let hitData = r.shootRay(obj);
                if (hitData.hit) {
                    obj = hitData.hitObject;
                    if (obj.type != "Light") {
                        r.trans.pos = hitData.hitPoint;
                        r.trans.dir = VectorBounce(r.trans.dir, hitData.hitNormal, obj.roughness, ((frame * renderResolution.x * renderResolution.y * bounces) + (x * renderResolution.y * bounces) + (y * bounces) + (i)));
                        // clr = ColorAdd(clr, ColorScalarMult(dls(r.hitPoint, obj), Math.pow(InverseSquareLaw(dists[x][y]), 1/4)));
                        let emmitedLight = ColorScalarMult(obj.emmClr, obj.emmInteg);
                        incLight = ColorAdd(incLight, ColorMult(emmitedLight, rayClr));
                        if (obj.clr == null){
                            break;
                        }
                        // rayClr = obj.clr;
                        rayClr = ColorScalarMult(ColorMult(rayClr, ColorAdd(obj.clr, obj.emmClr)), VectorDotProduct(r.trans.dir, hitData.hitNormal));
                    }
                }
                else {
                    // clr = ColorAdd(clr, ColorScalarDiv(ColorScalarMult(world.clr, world.integ), bounces + 1));
                    incLight = ColorAdd(incLight, ColorMult(world.getColor(r.trans.dir), rayClr));
                    break;
                }
            }
            clr = ColorScalarMult(incLight, 4);
            let weight = 1 / (frame);
            clrs[x][y] = ColorAdd(ColorScalarMult(clrs[x][y], 1 - weight), ColorScalarMult(clr, weight));
            // clrs[x][y] = clr;
            // clrs[x][y] = rayClr;
            // pixels[x][y] = scaleLight(clrs[x][y]);
        }
    }

    let xScale = projectResolution.x / renderResolution.x;
    let yScale = (projectResolution.y / renderResolution.y);
    ctx.clearRect(0, 0, projectResolution.x, projectResolution.y);
    for (let x = 0; x < renderResolution.x; x++) {
        for (let y = 0; y < renderResolution.y; y++) {
            let c = scaleLight(clrs[renderResolution.x - x - 1][y]);
            ctx.fillStyle = c;
            ctx.fillRect(x * xScale, (renderResolution.y - y - 1) * yScale, xScale, yScale);
        }
    }

    let timeNow = Date.now();
    ctx.font = "30px Arial Red";
    ctx.fillStyle = "red";
    frameRate = 1000 / (timeNow - time);
    fpsCounter.innerHTML = (frameRate >= 1 ? "fps : " + truncTill2(frameRate) : "spf : " + truncTill2(1 / frameRate));
    if (frame > 2) {
        maxFrameRate = Math.max(maxFrameRate, frameRate);
        maxFpsCounter.innerHTML = (maxFrameRate >= 1 ? "Best fps : " + truncTill2(maxFrameRate) : "Best spf : " + truncTill2(1 / maxFrameRate)).toString();
    }
    time = timeNow;
    // objects[1].trans.rot.x+=0.01;
    // objects[1].trans.rot.y+=0.02;
    // objects[1].trans.rot.z+=0.0257;
    // objects[1].update();
}

function truncTill2(_val) {
    return Math.trunc(_val * 100) / 100;
}

// function dls(_pos, _obj) {
//     let _clr = Color(0, 0, 0);
//     let dir;
//     for (let i = 0; i < lights.length; i++) {
//         l = lights[i];
//         dir = DirTo(_pos, l.trans.pos);
//         let dlsr = new ray(_pos, dir);
//         // console.log(dlsr.trans.pos);
//         let obj = dlsr.shootRay(l, _obj);
//         // console.log(dlsr.trans.pos);
//         if (obj == l) {
//             let lightPower = VectorDotProduct(dlsr.trans.dir, _obj.normal(_pos));
//             _clr = ColorAdd(_clr, ColorScalarMult(ColorScalarMult(ColorMult(_obj.clr, l.clr), l.calcPower(_pos)), lightPower));
//         }
//         // _clr = ColorScalarMult(Color(dlsr.trans.rot.x, dlsr.trans.rot.y, dlsr.trans.rot.z, true), 25);
//     }
//     // _clr = _obj.clr;
//     return _clr;
// }

class ray {
    constructor(_pos, _dir) {
        this.trans = {
            "pos": _pos,
            "dir": _dir,
        };
    }
    checkBounds(_obj) {
        let neg = _obj.negCorner;
        let pos = _obj.posCorner;
        let norms = [
            { "dst": pos.x, "dir": Vector3(1, 0, 0) },
            { "dst": pos.y, "dir": Vector3(0, 1, 0) },
            { "dst": pos.z, "dir": Vector3(0, 0, 1) },
            { "dst": neg.x, "dir": Vector3(-1, 0, 0) },
            { "dst": neg.y, "dir": Vector3(0, -1, 0) },
            { "dst": neg.z, "dir": Vector3(0, 0, -1) }
        ]

        for (let colls = 0; colls < norms.length; colls++) {
            let n = norms[colls];
            let det = -VectorDotProduct(this.trans.dir, n.dir);
            let invDet = 1 / det;

            let offsetPos = VectorSub(VectorSub(this.trans.pos, _obj.trans.pos), VectorScalarMult(n.dir, Math.abs(n.dst)));
            let dst = VectorDotProduct(offsetPos, n.dir) * invDet;

            if (det > 1E-6) {
                let hitPoint = VectorAdd(offsetPos, VectorScalarMult(this.trans.dir, dst));
                if (Math.abs(n.dir.x) == 1) {
                    if (hitPoint.y <= pos.y && hitPoint.y >= neg.y &&
                        hitPoint.z <= pos.z && hitPoint.z >= neg.z) {
                        return true;
                    }
                }
                else if (Math.abs(n.dir.y) == 1) {
                    if (hitPoint.x <= pos.x && hitPoint.x >= neg.x &&
                        hitPoint.z <= pos.z && hitPoint.z >= neg.z) {
                        return true;
                    }
                }
                else if (Math.abs(n.dir.z) == 1) {
                    if (hitPoint.y <= pos.y && hitPoint.y >= neg.y &&
                        hitPoint.x <= pos.x && hitPoint.x >= neg.x) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    shootRay(_obj) {
        let hit = new HitInfo();

        let minDist = Infinity;
        let minDistInt;
        let minDistType;
        let finalNormal;

        for (let j = 0; j < objects.length; j++) {
            let o = objects[j];
            if (o.type != "Cam") {
                if (o.type != "Mesh") {
                    let offsetPos = VectorSub(this.trans.pos, o.trans.pos);
                    if (o == _obj) {
                        offsetPos = VectorSub(VectorAdd(this.trans.pos, VectorScalarDiv(this.trans.dir, 10)), o.trans.pos);
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
                            }
                            else {
                                dst = dst1;
                            }
                            if (dst < minDist) {
                                hit.hit = true;
                                minDist = dst;
                                minDistInt = j;
                                minDistType = "Object";
                                finalNormal = normalize(VectorSub(VectorAdd(this.trans.pos, VectorScalarMult(this.trans.dir, minDist)), o.trans.pos));
                            }
                        }
                    }
                }
                else {
                    if (this.checkBounds(o)) {
                        for (var k = 0; k < o.tris.length; k += 3) {
                            let p = o.points;
                            let t = o.tris;
                            let pA = () => {
                                let defVec = VectorMult(p[t[k]], o.trans.scale);
                                let forVec = VectorScalarMult(o.orientation.front, defVec.x);
                                let rigVec = VectorScalarMult(o.orientation.right, defVec.y);
                                let upVec = VectorScalarMult(o.orientation.up, defVec.z);
                                return VectorAdd(VectorAdd(forVec, rigVec), upVec);
                            }
                            let pB = () => {
                                let defVec = VectorMult(p[t[k + 1]], o.trans.scale);
                                let forVec = VectorScalarMult(o.orientation.front, defVec.x);
                                let rigVec = VectorScalarMult(o.orientation.right, defVec.y);
                                let upVec = VectorScalarMult(o.orientation.up, defVec.z);
                                return VectorAdd(VectorAdd(forVec, rigVec), upVec);
                            }
                            let pC = () => {
                                let defVec = VectorMult(p[t[k + 2]], o.trans.scale);
                                let forVec = VectorScalarMult(o.orientation.front, defVec.x);
                                let rigVec = VectorScalarMult(o.orientation.right, defVec.y);
                                let upVec = VectorScalarMult(o.orientation.up, defVec.z);
                                return VectorAdd(VectorAdd(forVec, rigVec), upVec);
                            }
                            let edgeAB = VectorSub(pB(), pA());
                            let edgeAC = VectorSub(pC(), pA());
                            let normal = VectorCrossProduct(edgeAB, edgeAC);

                            let offsetPos = VectorSub(this.trans.pos, o.trans.pos);
                            if (o == _obj) {
                                offsetPos = VectorSub(VectorAdd(this.trans.pos, VectorScalarDiv(this.trans.dir, -10)), o.trans.pos);
                            }

                            let ao = VectorSub(offsetPos, pA());
                            let dao = VectorCrossProduct(ao, this.trans.dir);

                            let det = -VectorDotProduct(this.trans.dir, normal);
                            let invDet = 1 / det;

                            let dst = VectorDotProduct(ao, normal) * invDet;
                            let u = VectorDotProduct(edgeAC, dao) * invDet;
                            let v = -VectorDotProduct(edgeAB, dao) * invDet;
                            let w = 1 - u - v;

                            // console.log(normal);
                            // console.log(Math.sign(det), Math.sign(dst));

                            if (det >= 1E-6 && dst >= 0 && u >= 0 && v >= 0 && w >= 0) {
                                if (dst < minDist) {
                                    hit.hit = true;
                                    minDist = dst;
                                    minDistInt = j;
                                    minDistType = "Object";
                                    finalNormal = normalize(normal);
                                }
                            }
                        }
                    }
                }
            }
        }

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
                        hit.hit = true;
                        minDist = dst;
                        minDistInt = j;
                        minDistType = "Light";
                        finalNormal = VectorSub(VectorAdd(this.trans.pos, VectorScalarMult(this.trans.dir, minDist)), l.trans.pos);
                    }
                }
            }
        }

        if (hit) {
            hit.hitPoint = VectorAdd(this.trans.pos, VectorScalarMult(this.trans.dir, minDist));
            hit.hitObject = minDistType == "Object" ? objects[minDistInt] : lights[minDistInt];
            hit.hitNormal = finalNormal;
        }
        return hit;
    }
}

class HitInfo {
    constructor() {
        this.hit = false;
        this.hitPoint;
        this.hitObject;
        this.hitNormal;
    }
}