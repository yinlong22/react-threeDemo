import * as THREE from "three";
import {renderHelper} from "../renderHelper";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {useEffect} from "react";
import Stats from "three/examples/jsm/libs/stats.module";

export const TDEarth = () => {
    let scene, camera, renderer, earthMesh, cloudsMesh, light, controls, stats

    // document.addEventListener('DOMContentLoaded', function () {
    //     threeStart();
    // })
    useEffect(() => {
        threeStart();
    }, [threeStart])

    function initScene() {
        scene = new THREE.Scene();
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.x = -500;
        camera.position.y = 500;
        camera.position.z = -500;
    }

    // 渲染器
    function initThree() {
        // 实例化 THREE.WebGLRenderer 对象。
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: renderer
        });
        // 设置 renderer 的大小
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 挂载到准备的 domElement 上
        renderHelper(renderer.domElement)
        // Sets the clear color and opacity.
        renderer.setClearColor(0x000000, 1.0);
    }

    // 地球
    function initEarth() {
        // 实例化一个半径为 200 的球体
        const earthGeo = new THREE.SphereGeometry(200, 100, 100);
        const earthMater = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('/earthNormal.jpg')
        });
        earthMesh = new THREE.Mesh(earthGeo, earthMater);
        scene.add(earthMesh);

    }

    // 云
    function initClouds() {
        // 实例化一个球体，半径要比地球的大一点，从而实现云飘咋地球上的感觉
        const cloudsGeo = new THREE.SphereGeometry(201, 100, 100);

        // transparent 与 opacity 搭配使用，设置材质的透明度，当 transparent 设为 true 时， 会对材质特殊处理，对性能会有些损耗。
        const cloudsMater = new THREE.MeshPhongMaterial({
            alphaMap: new THREE.TextureLoader().load('/clouds.jpg'),
            transparent: true,
            opacity: 0.2
        });

        cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater);
        scene.add(cloudsMesh);
    }

    // 帧蘋
    function initStats() {
        stats = new Stats();
        const container = document.querySelector('.showDemos')
        if (!container) return
        container.appendChild(stats.dom)
    }

    // 光源
    function initLight() {
        // A light source positioned directly above the scene, with color fading from the sky color to the ground color.
        // 位于场景正上方的光源，颜色从天空颜色渐变为地面颜色。
        //  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        // scene.add(light);

        // 环境光
        light = new THREE.AmbientLight(0xFFFFFF);
        light.position.set(100, 100, 200);
        scene.add(light);

        // 平行光
        // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
        // light = new THREE.DirectionalLight(0xffffbb, 1);
        // light.position.set(-1, 1, 1);
        // scene.add(light);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function threeStart() {
        initThree();
        initScene();
        initCamera();
        initStats();
        initLight();
        initEarth();
        initClouds();
        // 载入控制器
        controls = new OrbitControls(camera, renderer.domElement);
        renderer.clear();
        animate();
    }

    function animate() {
        controls.update();
        stats.update();
        // 地球自转
        earthMesh.rotation.y -= 0.002;
        // 漂浮的云层
        cloudsMesh.rotation.y -= 0.005;
        cloudsMesh.rotation.z += 0.005;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    return <div/>
}