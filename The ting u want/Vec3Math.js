function Vector3(_x, _y, _z) {
    return { "x": _x, "y": _y, "z": _z };
}

function normalize(_vec3) {
    let mag = magnitude(_vec3);
    return VectorScalarDiv(_vec3, mag);
}

function magnitude(_vec3) {
    return Math.sqrt(Math.pow(_vec3.x, 2) + Math.pow(_vec3.y, 2) + Math.pow(_vec3.z, 2));
}

function VectorAdd(_vec3a, _vec3b) {
    return Vector3(_vec3a.x + _vec3b.x, _vec3a.y + _vec3b.y, _vec3a.z + _vec3b.z);
}

function VectorSub(_vec3a, _vec3b) {
    return Vector3(_vec3a.x - _vec3b.x, _vec3a.y - _vec3b.y, _vec3a.z - _vec3b.z);
}

function VectorMult(_vec3a, _vec3b) {
    return Vector3(_vec3a.x * _vec3b.x, _vec3a.y * _vec3b.y, _vec3a.z * _vec3b.z);
}

function VectorDiv(_vec3a, _vec3b) {
    return Vector3(_vec3a.x / _vec3b.x, _vec3a.y / _vec3b.y, _vec3a.z / _vec3b.z);
}

function VectorDotProduct(_vec3a, _vec3b) {
    _vec3 = VectorMult(_vec3a, _vec3b);
    return _vec3.x + _vec3.y + _vec3.z;
}

function VectorCrossProduct(_vec3a, _vec3b, returnScalar) {
    _vec3 = Vector3((_vec3a.y * _vec3b.z) - (_vec3a.z * _vec3b.y), (_vec3a.z * _vec3b.x) - (_vec3a.x * _vec3b.z), (_vec3a.x * _vec3b.y) - (_vec3a.y * _vec3b.x));
    return returnScalar ? (_vec3.x + _vec3.y + _vec3.z) : _vec3;
}

function VectorPow(_vec3, pow) {
    return Vector3(Math.pow(_vec3.x, pow), Math.pow(_vec3.y, pow), Math.pow(_vec3.z, pow));
}

function VectorScalarMult(_vec3, scalar) {
    return Vector3(_vec3.x * scalar, _vec3.y * scalar, _vec3.z * scalar);
}

function VectorScalarDiv(_vec3, scalar) {
    return Vector3(_vec3.x / scalar, _vec3.y / scalar, _vec3.z / scalar);
}

function VectorFindAngleBetween(_vec3a, _vec3b, _normal) {
    _vec3aMag = magnitude(_vec3a, true);
    _vec3bMag = magnitude(_vec3b, true);
    dot = VectorDotProduct(_vec3a, _vec3b);
    det = ((_vec3a.x * _vec3b.y * _normal.z) + (_vec3b.x * _normal.y * _vec3a.z) + (_normal.x * _vec3a.y * _vec3b.z)) - ((_normal.x * _vec3b.y * _vec3a.z) + (_vec3a.x * _normal.y * _vec3b.z) + (_vec3b.x * _vec3a.y * _normal.z));
    ang = Math.atan2(det, dot);
    return ang;
}

function VectorLerp(_vec3a, _vec3b, _value) {
    let vec3 = Vector3(lerp(_vec3a.x, _vec3b.x, _value), lerp(_vec3a.y, _vec3b.y, _value), lerp(_vec3a.z, _vec3b.z, _value));
    return vec3;
}

function Dist(_vec3a, _vec3b) {
    let _vec3 = VectorSub(_vec3a, _vec3b);
    return magnitude(_vec3);
}

function VectorRight(_vec3) {
    _vec3 = normalize(_vec3);
    return VectorDotProduct(Vector3(0, 1, 0), _vec3) != 1 ? normalize(Vector3(_vec3.z, 0, -_vec3.x)) : Vector3(1, 0, 0);
}

function VectorUp(_vec3) {
    _vec3 = normalize(_vec3);
    return normalize(Vector3(_vec3.x * _vec3.y, Math.pow(_vec3.x, 2) + Math.pow(_vec3.z, 2), _vec3.y * _vec3.z));
}

function DirTo(_vec3a, _vec3b) {
    let sub = VectorSub(_vec3b, _vec3a);
    return normalize(sub);
}

function VectorBounce(_vec3, _normal, _roughness, _rndSeed) {
    let rndVec;
    let rndX;
    let rndY;
    let rndZ;
    for (let safetyLimit = 0; safetyLimit < 100; safetyLimit++) {
        rndX = Math.random();
        rndY = Math.random();
        rndZ = Math.random();
        rndVec = VectorMult(Vector3((rndX - 0.5), (rndY - 0.5), (rndZ - 0.5)), Vector3(2, 2, 2))
        if (magnitude(rndVec) <= 1) {
            rndVec = normalize(rndVec);
            break;
        }
    }
    if (VectorDotProduct(rndVec, _normal) < 0) {
        rndVec = VectorScalarMult(rndVec, -1);
    }
    let specVec = VectorSub(_vec3, VectorScalarMult(_normal, 2 * VectorDotProduct(_vec3, _normal)))
    return VectorLerp(specVec, rndVec, _roughness);
}

function AngToRay(_or, rot) {
    let defVec = normalize(Vector3(Math.cos(rot.y) * Math.cos(rot.z), Math.sin(rot.z), -Math.sin(rot.y) * Math.cos(rot.z)));
    let forVec = VectorScalarMult(_or.front, defVec.x);
    let rigVec = VectorScalarMult(_or.right, defVec.y);
    let upVec = VectorScalarMult(_or.up, defVec.z);
    return VectorAdd(VectorAdd(forVec, rigVec), upVec);
    return defVec;
}

function AngToDir(rot) {
    let Sx = Math.sin(rot.x);
    let Sy = Math.sin(rot.y);
    let Sz = Math.sin(rot.z);
    let Cx = Math.cos(rot.x);
    let Cy = Math.cos(rot.y);
    let Cz = Math.cos(rot.z);
    let front = normalize(Vector3(Cy*Cz, -Cy*Sz, Sy));
    let right = normalize(Vector3(Cz*Sx*Sy+Cx*Sz, Cx*Cz-Sx*Sy*Sz, -Cy*Sx));
    let up = normalize(Vector3(-Cx*Cz*Sy+Sx*Sz, Cz*Sx+Cx*Sy*Sz, Cx*Cy));
    return { "front": front, "right": right, "up": up };
}

function DirToAng(X1, Y1, Z1) {
    X1 = normalize(X1);
    if (Y1 && Z1) {
        Y1 = normalize(Y1);
        Z1 = normalize(Z1);
    }
    else {
        Y1 = VectorRight(Z1);
        Z1 = VectorUp(Z1);
    }
    let Y = Math.abs(VectorDotProduct(Vector3(0, 0, 1), X1)) != 1 ? normalize(VectorCrossProduct(X1, Vector3(0, 0, -1))) : Vector3(0, 1, 0);
    let Z = normalize(VectorCrossProduct(X1, Y));
    x_vec3Angle = VectorFindAngleBetween(Y1, Y, X1);
    y_vec3Angle = VectorFindAngleBetween(Vector3(0, 0, 1), Z, Y);
    z_vec3Angle = Math.atan2(Y.x, Y.y);
    return Vector3(x_vec3Angle, y_vec3Angle, z_vec3Angle);
}

function InverseSquareLaw(_dist) {
    return 1 / (1 + Math.pow(_dist, 2))
}

function lerp(a, b, f) {
    return (a * (1 - f)) + (b * f)
}

function clamp(_value, _min, _max) {
    return Math.min(Math.max(_value, _min), _max);
}

function smoothStep(_minValue, _maxValue, _value) {
    _value = Math.min(Math.max(_value, _minValue), _maxValue);
    _value -= _minValue;
    _maxValue -= _minValue;
    _value /= _maxValue;
    return _value;
}