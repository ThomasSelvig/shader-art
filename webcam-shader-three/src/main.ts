import './style.css'
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
camera.position.z = 0.01;

const scene = new THREE.Scene();

const video = document.getElementById( 'video' ) as HTMLVideoElement ;

const texture = new THREE.VideoTexture( video );
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.PlaneGeometry( 16, 9 );
geometry.scale( 0.5, 0.5, 0.5 );

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  uniform sampler2D textureUniform;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(textureUniform, vUv);
  }
`;
const videoShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    textureUniform: { value: texture }  // Set your texture here
  }
});

// const material = new THREE.MeshBasicMaterial( { map: texture } );
// const mesh = new THREE.Mesh( geometry, material );
const mesh = new THREE.Mesh( geometry, videoShaderMaterial );
mesh.position.set(0, 0, -5)
mesh.lookAt(camera.position)
scene.add(mesh)

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = true;
controls.enablePan = true;

if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
  // const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };
  const constraints = { video: { width: 1920, height: 1080, facingMode: 'user' } };
  navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

    // apply the stream to the video element used in the texture

    video.srcObject = stream;
    video.play();

  } ).catch( function ( error ) {

    console.error( 'Unable to access the camera/webcam.', error );

  } );

} else {

  console.error( 'MediaDevices interface not available.' );

}

function animate() {

  // update video texture
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    texture.needsUpdate = true;
  }
  // update controls
  controls.update()
  // render
  renderer.render( scene, camera );
  requestAnimationFrame( animate );

}
animate()