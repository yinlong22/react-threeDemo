import * as THREE from "three";
import {renderHelper} from "../renderHelper";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {useEffect} from "react";
import Stats from "three/examples/jsm/libs/stats.module";

export const BeautifulEarth = () => {
    let scene, camera, renderer, earthMesh, cloudsMesh, light, controls, stats, pointMesh = null

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

    // 星空
    function initStars() {
        const positions = [];
        const colors = [];
        const geometry = new THREE.BufferGeometry();
        for (let i = 0; i < 5000; i++) {
            const vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2 - 1;
            vertex.y = Math.random() * 2 - 1;
            vertex.z = Math.random() * 2 - 1;
            positions.push(vertex.x, vertex.y, vertex.z);
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55);
            colors.push(color.r, color.g, color.b);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const starsMaterial = new THREE.ParticleBasicMaterial({
            size: 1,
            transparent: true,
            opacity: 1,
            vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        const stars = new THREE.ParticleSystem(geometry, starsMaterial);
        stars.scale.set(300, 300, 300);
        scene.add(stars);
    }

    // 地球
    function initEarth() {
        // 实例化一个半径为 200 的球体
        const earthGeo = new THREE.SphereGeometry(200, 100, 100);
        const earthMater = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('/earth_atmos_2048.jpg')
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
            alphaMap: new THREE.TextureLoader().load('/earth_clouds_2048.png'),
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
        // 位于场景正上方的光源，颜色从天空颜色渐变为地面颜色。
        // light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

        // 环境光
        light = new THREE.AmbientLight(0xFFFFFF);
        light.position.set(100, 100, 200);
        scene.add(light);

        // 平行光 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
        // light = new THREE.DirectionalLight(0xffffbb, 1);
        // light.position.set(-1, 1, 1);
    }

    /**
     *lng:经度
     *lat:维度
     *radius:地球半径
     */
    function Point(lng, lat, radius) {
        const theta = (90 + lng) * (Math.PI / 180)
        const phi = (90 - lat) * (Math.PI / 180)
        return (new THREE.Vector3()).setFromSpherical(new THREE.Spherical(radius, phi, theta))
    }

    function createPointMesh() {
        // 打点
        const material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/lensflare0_alpha.png'),
            transparent: true, //使用背景透明的png贴图，注意开启透明计算
            // side: THREE.DoubleSide, //双面可见
            depthWrite: false, //禁止写入深度缓冲区数据
        });
        const planGeometry = new THREE.PlaneGeometry(3, 3);
        pointMesh = new THREE.Mesh(planGeometry, material);
        const size = 200 * 0.08;//矩形平面Mesh的尺寸
        pointMesh.scale.set(size, size, size);//设置mesh大小
        //设置mesh位置
        const coord = Point(104.071833, 30.580517, 200 * 1.01)

        // 字体
        new THREE.FontLoader().load('/helvetiker_bold.typeface.json', function (font) {
            const color = 0x006699;
            const matLite = new THREE.MeshBasicMaterial({
                color: color,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            const message = "chengdu";
            const shapes = font.generateShapes(message, 8);
            const geometry = new THREE.ShapeGeometry(shapes);
            geometry.computeBoundingBox();
            const text = new THREE.Mesh(geometry, matLite);
            text.position.set(coord.x + 16, coord.y + 12, coord.z - 2);
            text.rotateY(Math.PI)
            scene.add(text);
        });

        // 圆锥
        const aGeo = new THREE.ConeGeometry(8, 30, 30);
        // 创建分段节点处类的材质
        const aMater = new THREE.MeshPhongMaterial({
            color: 0x4076fa,
            transparent: true,
            opacity: 0.9
        })
        const aMesh = new THREE.Mesh(aGeo, aMater);
        const bMesh = aMesh.rotateX(Math.PI / 2)

        const groupMesh = new THREE.Group()
        groupMesh.add(pointMesh, bMesh);
        groupMesh.position.set(coord.x, coord.y, coord.z);
        // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
        const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize();
        // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
        const meshNormal = new THREE.Vector3(0, 0, 1);
        // 四元数属性.quaternion表示mesh的角度状态
        //.setFromUnitVectors();计算两个向量之间构成的四元数值
        groupMesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

        setTimeout(() => {
            scene.add(groupMesh);
        }, 1000)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function threeStart() {
        initThree();
        initScene();
        initCamera();
        initStars()
        initStats();
        initLight();
        initEarth();
        initClouds();
        createPointMesh()
        // 载入控制器
        controls = new OrbitControls(camera, renderer.domElement);
        animate();
    }

    function animate() {
        stats.update();
        // 地球自转
        // earthMesh.rotation.y -= 0.02;
        // rStatus -= 0.05
        // if (rStatus>=0){
        //     const axis = new THREE.Vector3(1, 0, 0);
        //     earthMesh.rotateOnAxis(axis, Math.PI / 20)
        // }


        // 漂浮的云层
        cloudsMesh.rotation.y -= 0.005;
        cloudsMesh.rotation.z += 0.005;

        renderer.clear();
        renderer.render(scene, camera);
        requestAnimationFrame(() => {
            if (controls) {
                controls.update();
                animate()
            }
        });
    }

    return <div/>
}