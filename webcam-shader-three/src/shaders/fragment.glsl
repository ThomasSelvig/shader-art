uniform sampler2D textureUniform;
varying vec2 vUv;

void main() {
    vec4 texture = texture2D(textureUniform, vUv);
    // float fac = .01;
    // gl_FragColor = vec4(
    //     fac / abs(texture.x),
    //     fac / abs(texture.y),
    //     fac / abs(texture.z),
    //     1.
    // );
    gl_FragColor = texture;
}