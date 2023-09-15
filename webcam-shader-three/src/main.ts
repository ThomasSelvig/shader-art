import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './style.css'
import vertex from "./shaders/vertex.glsl"
import fragment from "./shaders/fragment.glsl"


const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
// allow orbit controls to move the camera
camera.position.z = 0.01;

const scene = new THREE.Scene();

// texture
const video = document.getElementById( 'video' ) as HTMLVideoElement ;
const videoTexture = new THREE.VideoTexture( video );
videoTexture.colorSpace = THREE.SRGBColorSpace;

// shaded material from video texture
const videoShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    textureUniform: { value: videoTexture }
  }
});

// plane mesh using material
const geometry = new THREE.PlaneGeometry( 16, 9 );
geometry.scale( 0.5, 0.5, 0.5 );
const mesh = new THREE.Mesh( geometry, videoShaderMaterial );
mesh.scale.multiply(new THREE.Vector3(-1, 1, 1))  // flip the mesh 180deg
mesh.position.set(0, 0, -5)
mesh.lookAt(camera.position)
scene.add(mesh)

// setup renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// setup controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = true;
controls.enablePan = true;

// resize logic
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
})

// request camera and set <video /> elem's src to webcam stream
if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
  const constraints = { video: { width: 1920, height: 1080, facingMode: 'user' } };
  navigator.mediaDevices.getUserMedia( constraints )
    .then( function ( stream ) {
      // apply the stream to the video element used in the texture
      video.srcObject = stream;
      video.play();
    })
    .catch( function ( error ) {
      console.error( 'Unable to access the camera/webcam.', error );
    });
} else {
  console.error( 'MediaDevices interface not available.' );
}

function animate() {

  // update video texture
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    videoTexture.needsUpdate = true;
  }

  // update controls
  controls.update()

  // render
  renderer.render( scene, camera );
  requestAnimationFrame( animate );

}
animate()