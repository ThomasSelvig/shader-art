uniform sampler2D textureUniform;
varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(textureUniform, vUv);
}