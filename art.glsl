
// signed distance functions

float sdCircle(vec2 pos, float rad) {
    return length(pos) - rad;    
}
float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}
float sdHexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}


void main() {
    // clip space
    vec2 uv = gl_FragCoord.xy / iResolution.xy * 2. - 1.;
    // correct for aspect ratio
    uv.x *= iResolution.x / iResolution.y;

    vec3 col = vec3(1., 0., 0.);
    float finalTransform = 0.;


    // add repeating circle
    float repeatingCircleDist = sin(sdCircle(uv, 0.) * 10. + iTime) / 10.;
    // inverse circle distance => glow effect
    repeatingCircleDist = .01 / abs(repeatingCircleDist);
    // add to final transform (condition to be displayed)
    finalTransform += repeatingCircleDist;

    // add hexagon
    float hexDist = sdHexagon(uv, .5);
    finalTransform += .01/abs(hexDist);

    gl_FragColor = vec4(col * finalTransform, 1);
}