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

function VectorFindAngleBetween(_vec3a, _vec3b, normal) {
    _vec3aMag = magnitude(_vec3a, true);
    _vec3bMag = magnitude(_vec3b, true);
    dot = VectorDotProduct(_vec3a, _vec3b);
    det = ((_vec3a.x * _vec3b.y * normal.z) + (_vec3b.x * normal.y * _vec3a.z) + (normal.x * _vec3a.y * _vec3b.z)) - ((normal.x * _vec3b.y * _vec3a.z) + (_vec3a.x * normal.y * _vec3b.z) + (_vec3b.x * _vec3a.y * normal.z));
    ang = Math.atan2(det, dot);
    return ang;
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

function VectorBounce(_vec3, _normal) {
    let rndVec = normalize(Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)));
    if (VectorDotProduct(rndVec, _normal) < 0){
        rndVec = VectorScalarMult(rndVec, -1);
    }
    return rndVec;
    // return VectorSub(_vec3, VectorScalarMult(_normal, 2 * VectorDotProduct(_vec3, _normal)))
}

function AngToDir(rot) {
    let forward = normalize(Vector3(Math.sin(rot.y), Math.sin(rot.x) * Math.cos(rot.z), Math.cos(rot.x) * Math.cos(rot.y)));
    let rightward = VectorRight(forward);
    let upward = VectorUp(forward);
    return { "forward": forward, "right": rightward, "up": upward };
}

function DirToAng(Z1, Y1, X1) {
    Z1 = normalize(X1);
    if (Y1 && X1) {
        Y1 = normalize(Y1);
        X1 = normalize(Z1);
    }
    else{
        Y1 = Vectorup(Z1);
        X1 = VectorRight(Z1);
    }
    let Y = Math.abs(VectorDotProduct(Vector3(1, 0, 0), Z1)) != 1 ? normalize(VectorCrossProduct(Z1, Vector3(1, 0, 0))) : Vector3(0, 1, 0);
    let X = normalize(VectorCrossProduct(Y, Z1));
    z_vec3Angle = VectorFindAngleBetween(Y1, Y, Z1);
    y_vec3Angle = VectorFindAngleBetween(Vector3(1, 0, 0), X, Y);
    x_vec3Angle = Math.atan2(Y.x, Y.y);
    return Vector3(x_vec3Angle, y_vec3Angle, z_vec3Angle);
}

function InverseSquareLaw(_dist) {
    return 1 / (1 + Math.pow(_dist, 2))
}