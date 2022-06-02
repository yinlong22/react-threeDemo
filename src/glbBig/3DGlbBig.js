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
        scene.background = new THREE.Color(0xaf1f1f1);
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(3, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(-10, 0, 23);
        scene.add(camera);
    }

    function initControls() {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 10;
        controls.maxDistance = 50;
        controls.enablePan = false;
        controls.autoRotate = true
        controls.autoRotateSpeed = 1.0
        controls.addEventListener('change', render);
    }

    function initLight() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 200, 0);
        const light = new THREE.PointLight(0xffffff, 1.5);
        const allLight = new THREE.AmbientLight(0xffffff, .2)
        allLight.position.set(100, 100, 200);
        const sun = new THREE.SpotLight(0x393939, 2.5);
        sun.position.set(-15, 10, 21);
        scene.add(allLight, light, sun, hemiLight);
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

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const canvasPixelWidth = canvas.width / window.devicePixelRatio;
        const canvasPixelHeight = canvas.height / window.devicePixelRatio;

        const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function animate() {
        controls.update();
        render();
        requestAnimationFrame(animate);
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
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

    function init() {
        initRender()
        initScene()
        initCamera()
        initControls()
        initLight()
        loadModel()
        window.addEventListener('resize', onWindowResize);
    }

    return (
        <div/>
    )
}
