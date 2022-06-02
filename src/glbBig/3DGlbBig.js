import * as THREE from 'three'
import {renderHelper} from "../renderHelper";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export const TDGlbBig = () => {
    let renderer, scene, camera, controls
    init();
    animate()

    function initRender() {
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderHelper(renderer.domElement)
        renderer.outputEncoding = THREE.sRGBEncoding;
    }

    function initScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xa0a0a0 );
        scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(-10, 0, 23);
        scene.add(camera);
    }

    function initControls() {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.minDistance = 10;
        controls.maxDistance = 50;
        controls.enablePan = false;
    }

    function initLight() {
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 200, 0 );
        scene.add( hemiLight );
        const light = new THREE.PointLight(0xffffff, 1.5);
        const allLight = new THREE.AmbientLight(0xffffff, .2)
        allLight.position.set(100, 100, 200);
        const sun = new THREE.SpotLight(0x393939, 2.5);
        sun.position.set(-15, 10, 21);
        scene.add(allLight, light, sun);
    }

    function loadModel() {
        new GLTFLoader().load('/MS_LLT_01_glb.glb', function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.material.normalMapType = THREE.ObjectSpaceNormalMap;
                    child.geometry.deleteAttribute('normal');
                    child.material.side = THREE.DoubleSide;
                    child.scale.multiplyScalar(0.5);
                    new THREE.Box3().setFromObject(child).getCenter(child.position).multiplyScalar(-1);
                    scene.add(child);
                }
            });
            render();
        });
    }

    function init() {
        initRender()
        initScene()
        initCamera()
        initControls()
        initLight()
        loadModel()
        window.addEventListener('resize', onWindowResize);
    }

    function animate() {
    }

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    return (
        <div/>
    )
}
