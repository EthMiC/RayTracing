function Color(r, g, b){
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function GetRGBValues(_clr) {
    let new_clr = (_clr.slice(
        4,
        _clr.length - 1
    ).split(", "));
    new_clr = parseColorFloats(new_clr);
    return new_clr;
}

function ColorAdd(_clr1, _clr2){
    _clr1 = GetRGBValues(_clr1);
    _clr2 = GetRGBValues(_clr2);
    return Color((_clr1[0] + _clr2[0]), (_clr1[1] + _clr2[1]), (_clr1[2] + _clr2[2]));
}

function ColorMult(_clr1, _clr2){
    _clr1 = ColorScalarDiv(_clr1, 255);
    _clr2 = ColorScalarDiv(_clr2, 255);
    _clr1 = GetRGBValues(_clr1);
    _clr2 = GetRGBValues(_clr2);
    let _clr = Color(_clr1[0] * _clr2[0], _clr1[1] * _clr2[1], _clr1[2] * _clr2[2]);
    _clr = ColorScalarMult(_clr, 255);
    return _clr;
}

function ColorScalarMult(_clr, scalar){
    _clr = GetRGBValues(_clr);
    return Color((_clr[0] * scalar), (_clr[1] * scalar), (_clr[2] * scalar));
}

function ColorScalarDiv(_clr, scalar){
    _clr = GetRGBValues(_clr);
    return Color((_clr[0] / scalar), (_clr[1] / scalar), (_clr[2] / scalar));
}

function ColorLerp(_clr1, _clr2, _value){
    _clr1 = ColorScalarDiv(_clr1, 255);
    _clr2 = ColorScalarDiv(_clr2, 255);
    let clr1RGB = GetRGBValues(_clr1);
    let clr2RGB = GetRGBValues(_clr2);
    let clr = Color(lerp(clr1RGB[0], clr2RGB[0], _value), lerp(clr1RGB[1], clr2RGB[1], _value), lerp(clr1RGB[2], clr2RGB[2], _value));
    return ColorScalarMult(clr, 255);
}

function parseColorFloats(_clr){
    for (var i = 0; i < _clr.length; i++){
        _clr[i] = parseFloat(_clr[i]);
    }
    return _clr;
}

function scaleLight(_clr) {
    _clr = GetRGBValues(_clr);
    for (var i = 0; i < _clr.length; i++){
        _clr[i] = 300 / (1 + Math.pow(Math.E, -(_clr[i] - 100) / 60)) - 45;
    }
    // return value;
    // return -Math.pow(0.99, value - 550) + 255;
    return Color(_clr[0], _clr[1], _clr[2]);
}