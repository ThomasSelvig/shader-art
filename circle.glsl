// signed distance functions
float sdCircle(vec2 pos, float rad) {
    return length(pos) - rad;    
}


void main() {
    // clip space
    vec2 uv = gl_FragCoord.xy / iResolution.xy * 2. - 1.;
    // correct for aspect ratio
    uv.x *= iResolution.x / iResolution.y;

    float circleDist = abs(sdCircle(uv, .5));
    float circleTransform = smoothstep(0., .1, circleDist);

    gl_FragColor = vec4(vec3(circleTransform), 1);
}