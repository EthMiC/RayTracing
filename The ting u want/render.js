var renderResolution = { "x": 250, "y": 250 };
var aspectRatio = renderResolution.x / renderResolution.y;
var projectResolution = { "x": 1000, "y": 1000 };
var bounces = 1;

var canv = document.getElementById('canvas');
canv.width = projectResolution.x;
canv.height = projectResolution.y;
var ctx = canv.getContext("2d");
var clrs = [];
var subtractableTime;
var times = [];
var time = Date.now();
var maxFrameRate = 0;
let frameRate = 0;

function render() {
    setTimeout(() => {
        frame++;
        render(objects[0]);
    }, 0)
    let anglePerPixelX = (Cam.fov) / renderResolution.x;
    let anglePerPixelY = (Cam.fov) / renderResolution.y;
    let startPixelX = (Cam.fov / 2) - (anglePerPixelX / 2);
    let startPixelY = (Cam.fov / 2) - (anglePerPixelY);
    // let pixels = [];
    for (let x = 0; x < renderResolution.x; x++) {
        // pixels.push([]);
        for (let y = 0; y < renderResolution.y; y++) {
            let obj;
            let clr = Color(0, 0, 0, true);
            let r = new ray(Vector3(Cam.trans.pos.x, Cam.trans.pos.y, Cam.trans.pos.z), AngToDir(VectorAdd(Cam.trans.rot, Vector3(((startPixelY - (anglePerPixelY * y)) / aspectRatio), startPixelX - (anglePerPixelX * x), 0))).forward);
            let rayClr = Color(255, 255, 255);
            let lightClr = Color(0, 0, 0, true);
            for (let i = bounces; i >= 0; i--) {
                let hitData = r.shootRay(obj);
                if (hitData.hit) {
                    obj = hitData.hitObject;
                    if (obj.type != "Light") {
                        // clr = ColorAdd(clr, ColorScalarMult(dls(r.hitPoint, obj), Math.pow(InverseSquareLaw(dists[x][y]), 1/4)));
                        rayClr = ColorMult(rayClr, obj.clr);
                        r.trans.pos = hitData.hitPoint;
                        let roughness = i <= 1 ? 1 : 0.22;
                        r.trans.dir = VectorBounce(r.trans.dir, hitData.hitNormal, roughness, ((frame * renderResolution.x * renderResolution.y * bounces) + (x * renderResolution.y * bounces) + (y * bounces) + (i)));
                    }
                    else {
                        // clr = ColorAdd(clr, ColorScalarDiv(ColorScalarMult(obj.clr, obj.calcPower(r.hitPoint)), bounces + 1));
                        lightClr = ColorAdd(lightClr, ColorScalarMult(obj.clr, obj.calcPower(r.hitPoint)));
                        break;
                    }
                }
                else {
                    // clr = ColorAdd(clr, ColorScalarDiv(ColorScalarMult(world.clr, world.integ), bounces + 1));
                    lightClr = ColorAdd(lightClr, world.getColor(r.trans.dir));
                    break;
                }
            }
            clr = ColorScalarMult(ColorMult(lightClr, rayClr), 2);
            let weight = 1 / (frame);
            clrs[x][y] = ColorAdd(ColorScalarMult(clrs[x][y], 1 - weight), ColorScalarMult(clr, weight));
            // pixels[x][y] = scaleLight(clrs[x][y]);
        }
    }

    let xScale = projectResolution.x / renderResolution.x;
    let yScale = (projectResolution.y / renderResolution.y);
    for (let x = 0; x < renderResolution.x; x++) {
        for (let y = 0; y < renderResolution.y; y++) {
            let c = scaleLight(clrs[renderResolution.x - x - 1][renderResolution.y - y - 1]);
            ctx.fillStyle = c;
            ctx.fillRect(x * xScale, (renderResolution.y - y - 1) * yScale, xScale, yScale);
        }
    }

    let timeNow = Date.now();
    times.push(timeNow - time);
    if (frame > 10) {
        ctx.font = "30px Arial Red";
        ctx.fillStyle = "red";
        frameRate = lerp(frameRate, 1000 / ((times[0] + times[1] + times[2] + times[3] + times[4] + times[5] + times[6] + times[7] + times[8] + times[9]) / 10), 0.25);
        maxFrameRate = Math.max(maxFrameRate, frameRate);
        ctx.fillText(frameRate >= 1 ? "fps : " + truncTill2(frameRate) : "spf : " + truncTill2(1 / frameRate), 10, 50);
        ctx.fillText(maxFrameRate >= 1 ? "Best fps : " + truncTill2(maxFrameRate) : "Best spf : " + truncTill2(1 / maxFrameRate), 10, 100);
        times.shift(0, 1);
    }
    time = timeNow;
}

function truncTill2(_val) {
    return Math.trunc(_val * 100) / 100;
}

// function dls(_pos, _obj) {
//     let _clr = Color(0, 0, 0, true);
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
                    for (var k = 0; k < o.tris.length; k += 3) {
                        let p = o.points;
                        let t = o.tris;
                        let pA = ()=>{
                            let defVec = VectorMult(p[t[k]], o.trans.scale);
                            let orientation = AngToDir(o.trans.rot);
                            let forVec = VectorScalarMult(orientation.forward, defVec.z);
                            let upVec = VectorScalarMult(orientation.up, defVec.y);
                            let rigVec = VectorScalarMult(orientation.right, defVec.x);
                            return VectorAdd(VectorAdd(forVec, rigVec), upVec);
                        }
                        let pB = ()=>{
                            let defVec = VectorMult(p[t[k + 1]], o.trans.scale);
                            let orientation = AngToDir(o.trans.rot);
                            let forVec = VectorScalarMult(orientation.forward, defVec.z);
                            let upVec = VectorScalarMult(orientation.up, defVec.y);
                            let rigVec = VectorScalarMult(orientation.right, defVec.x);
                            return VectorAdd(VectorAdd(forVec, rigVec), upVec);
                        }
                        let pC = ()=>{
                            let defVec = VectorMult(p[t[k + 2]], o.trans.scale);
                            let orientation = AngToDir(o.trans.rot);
                            let forVec = VectorScalarMult(orientation.forward, defVec.z);
                            let upVec = VectorScalarMult(orientation.up, defVec.y);
                            let rigVec = VectorScalarMult(orientation.right, defVec.x);
                            return VectorAdd(VectorAdd(forVec, rigVec), upVec);
                        }
                        let edgeAB = VectorSub(pB(), pA());
                        let edgeAC = VectorSub(pC(), pA());
                        let normal = VectorCrossProduct(edgeAB, edgeAC);

                        o.normal = normalize(normal);

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

class HitInfo{
    constructor() {
        this.hit = false;
        this.hitPoint;
        this.hitObject;
        this.hitNormal;
    }
}