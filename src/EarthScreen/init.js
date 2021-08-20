// import * as THREE from "three";
// import {renderHelper} from "../renderHelper";
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
//
// export const init = () => {
//     container = document.getElementById( 'container' );
//     camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
//     camera.position.z = 23;
//     scene = new THREE.Scene();
//
//     group = new THREE.Group();
//     locationGroup = new THREE.Group();
//     scene.add( group );
//     group.add( locationGroup );
//     //地点
//     LOCATIONS.forEach(location=&gt;{
//         const sprite = createLocationSprite(location)
//         locationGroup.add(sprite)
//         objects.push( sprite )
//     });
//
//     //地球
//     earth = createEarth();
//     objects.push( earth );
//     group.add(earth);
//     //云彩
//     const cloudsGeo = new THREE.SphereGeometry(5.1,32,32);
//     const cloudsMater = new THREE.MeshPhongMaterial({map:getTexture('/earth_cloud.171481f.png'),transparent:true,opacity:1,blending:THREE.additiveBlending});
//     cloudsMesh = new THREE.Mesh(cloudsGeo,cloudsMater);
//     group.add(cloudsMesh);
//
//     //灯
//     scene.add(new THREE.AmbientLight(0x39393939,0.9));
//
//     const spotLight = new THREE.SpotLight(0xffffff,1.2);
//     spotLight.position.set(-26,15,15);
//     //角度
//     spotLight.angle = 0.2;
//     //投影
//     spotLight.castShadow = false;
//     spotLight.penumbra = 0.4;
//     spotLight.distance = 124;
//     spotLight.decay = 1;
//     spotLight.shadow.camera.near = 50;
//     spotLight.shadow.camera.far = 200;
//     spotLight.shadow.camera.fov = 35;
//     spotLight.shadow.mapSize.height = 1024;
//     spotLight.shadow.mapSize.width = 1024;
//     scene.add(spotLight);
//
//     //光影投射器
//     raycaster = new THREE.Raycaster();
//     //鼠标的点
//     mouse = new THREE.Vector2();
//     //渲染
//     renderer = new THREE.WebGLRenderer({antialias:true});
//     renderer.setClearColor(0x000000,0);
//     renderer.setPixelRatio( window.devicePixelRatio );
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     container.appendChild( renderer.domElement );
//
//     document.addEventListener( 'mousedown', onDocumentMouseDown, false );
//     window.addEventListener( 'resize', onWindowResize, false );
// }