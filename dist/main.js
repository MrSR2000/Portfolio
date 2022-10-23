import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .5, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//adding shape
const geometry = new THREE.TorusGeometry(2 , 1, 16, 100);
// const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe: true});    //wrapping Mesh basic no reflecton 
const doughnutOuter =  new THREE.TextureLoader().load('doughnut.jpg');
//const material = new THREE.MeshStandardMaterial({color: 0x000000});
const torus = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({map: doughnutOuter}));
scene.add(torus);

//adding light source
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(15,15,15);
scene.add(pointLight);

//for hepling where the point light is situated
const lightHelper = new THREE.PointLightHelper(pointLight);
//const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper);

//move the camera in different direction with mouse 
const controls = new OrbitControls(camera, renderer.domElement);

//randomly generate stars 
function addStar(){
  const geometry = new THREE.SphereGeometry(.125,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const[x,y,z] = Array(3).fill().map( ()=> THREE.MathUtils.randFloatSpread(100)); //generate random no from +100 to -100
  
  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);


//adding space background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//adding moon
const moonOuter = new THREE.TextureLoader().load('moon.jpg');
const moonTexture =  new THREE.TextureLoader().load('moonTexture.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonOuter,
    normalMap: moonTexture,
  })
);

scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10); //both do the same thing

//camera 
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x+= 0.05;
  moon.rotation.y+= 0.75;
  moon.rotation.z+= 0.05;

  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.01;


}

document.body.onscroll = moveCamera;
moveCamera();



//animate 
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x+=0.001;
  torus.rotation.y+=0.001;
  torus.rotation.z+=0.001;

  controls.update();


  renderer.render(scene, camera);
}

animate();