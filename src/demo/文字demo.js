import * as THREE from 'three'
import {renderHelper} from "../renderHelper";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export const FontDemo = () => {
    let camera, scene, renderer;
    init();
    animate();

    function init() {
        // 相机
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(100, -1600, 1800);

        // 场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // loader
        const loader = new THREE.FontLoader();
        loader.load('/helvetiker_bold.typeface.json', function (font) {
            const color = 0x006699;
            // 阴影粗体
            const matDark = new THREE.LineBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });
            // 字体
            const matLite = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            const message = "   Text What\nYou Want to text.";
            const shapes = font.generateShapes(message, 100);
            const geometry = new THREE.ShapeGeometry(shapes);
            geometry.computeBoundingBox();
            const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            geometry.translate(xMid, 0, 0);

            const text = new THREE.Mesh(geometry, matLite);
            text.position.z = -150;
            scene.add(text);
            const holeShapes = [];
            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                if (shape.holes && shape.holes.length > 0) {
                    for (let j = 0; j < shape.holes.length; j++) {
                        const hole = shape.holes[j];
                        holeShapes.push(hole);
                    }
                }
            }
            shapes.push.apply(shapes, holeShapes);

            const lineText = new THREE.Object3D();
            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                const points = shape.getPoints();
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                geometry.translate(xMid, 0, 0);
                const lineMesh = new THREE.Line(geometry, matDark);
                lineText.add(lineMesh);
            }
            scene.add(lineText);
        });
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderHelper(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    return (
        <div/>
    )
}
