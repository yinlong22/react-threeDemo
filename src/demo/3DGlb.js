import * as THREE from 'three'
import {renderHelper} from "../renderHelper";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export const TDGlb = () => {
    let renderer, scene, camera;
    init();

    function init() {
        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderHelper(renderer.domElement)

        renderer.outputEncoding = THREE.sRGBEncoding;

        // scene
        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(-10, 0, 23);
        scene.add(camera);

        // controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.minDistance = 10;
        controls.maxDistance = 50;
        controls.enablePan = false;

        // ambient
        scene.add(new THREE.AmbientLight(0xffffff, .2));

        // light
        const light = new THREE.PointLight(0xffffff, 1.5);
        camera.add(light);

        // model
        new GLTFLoader().load('/Nefertiti.glb', function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    // glTF currently supports only tangent-space normal maps.
                    // this model has been modified to demonstrate the use of an object-space normal map.
                    child.material.normalMapType = THREE.ObjectSpaceNormalMap;
                    // attribute normals are not required with an object-space normal map. remove them.
                    child.geometry.deleteAttribute('normal');
                    child.material.side = THREE.DoubleSide;
                    child.scale.multiplyScalar(0.5);

                    // recenter
                    new THREE.Box3().setFromObject(child).getCenter(child.position).multiplyScalar(-1);
                    scene.add(child);
                }
            });
            render();
        });
        window.addEventListener('resize', onWindowResize);
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
