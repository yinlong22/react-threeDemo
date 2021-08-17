import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {renderHelper} from "../renderHelper";

export const TDTexture = () => {
    let mesh, renderer, scene, camera;
    const API = {
        offsetX: 0,
        offsetY: 0,
        repeatX: 0.25,
        repeatY: 0.25,
        rotation: Math.PI / 4, // positive is counter-clockwise
        centerX: 0.5,
        centerY: 0.5
    };

    init();

    function init() {
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderHelper(renderer.domElement)

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(10, 15, 25);
        scene.add(camera);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.minDistance = 20;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI / 2;

        const geometry = new THREE.BoxGeometry(10, 10, 10);

        new THREE.TextureLoader().load('/uv_grid_opengl.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            //texture.matrixAutoUpdate = false; // default true; set to false to update texture.matrix manually
            const material = new THREE.MeshBasicMaterial({map: texture});

            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            updateUvTransform();
            render();
        });
        window.addEventListener('resize', onWindowResize);
    }

    function render() {
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function updateUvTransform() {
        const texture = mesh.material.map;
        if (texture.matrixAutoUpdate === true) {
            texture.offset.set(API.offsetX, API.offsetY);
            texture.repeat.set(API.repeatX, API.repeatY);
            texture.center.set(API.centerX, API.centerY);
            texture.rotation = API.rotation; // rotation is around [ 0.5, 0.5 ]
        } else {
            // one way...
            //texture.matrix.setUvTransform( API.offsetX, API.offsetY, API.repeatX, API.repeatY, API.rotation, API.centerX, API.centerY );
            // another way...
            texture.matrix
                .identity()
                .translate(-API.centerX, -API.centerY)
                .rotate(API.rotation)                    // I don't understand how rotation can preceed scale, but it seems to be required...
                .scale(API.repeatX, API.repeatY)
                .translate(API.centerX, API.centerY)
                .translate(API.offsetX, API.offsetY);
        }
        render();
    }

    return (<div/>)
}
