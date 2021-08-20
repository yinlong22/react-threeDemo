import * as THREE from "three";
import {renderHelper} from "../renderHelper";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {useEffect} from "react";
import Stats from "three/examples/jsm/libs/stats.module";

export const EarthScreen = () => {
    let scene, camera, renderer, earthMesh, light, controls, stats, pointMesh = null
    const LOCATIONS = [{
        name: 'namibia',
        coord: [-19.2, 14.11666667], // 19° 12' S, 13° 67' E
        position: [4.6, -1.29, -2.42],
        cameraFarPosition: [-20.03, 13.47, -14.61],
        cameraNearPosition: [-3.54, 2.38, -2.58],
        imageName: 'earch/i_namibia.png',
        coordSpriteIndex: 4,
        videoSprite: [10.80, 19.10],
        soundSprite: [0, 10.057142857142857]
    }, {
        name: 'mariana',
        coord: [18.25, 142.81666667], // 17° 75' N, 142° 49' E
        position: [-4.390, 2.660, -2.410],
        cameraFarPosition: [26.46, -6.94, -9.96],
        cameraNearPosition: [4.52, -1.30, -1.63],
        imageName: 'earch/i_mariana.png',
        coordSpriteIndex: 3,
        videoSprite: [2.80, 8.40],
        soundSprite: [24, 34.10938775510204]
    }, {
        name: 'greenland',
        coord: [72.16666667, -43], // 71° 70' N, 42° 60' W
        position: [1.880, 5.09, 0.89],
        cameraFarPosition: [7.24, 26.52, 7.06],
        cameraNearPosition: [1.30, 4.66, 1.24],
        imageName: 'earch/i_greenland.png',
        coordSpriteIndex: 2,
        videoSprite: [40.20, 47.80],
        soundSprite: [48, 58.10938775510204]
    }, {
        name: 'galapagos',
        coord: [1.33333333, -91.15], // 01° 20' N, 90° 69' W
        position: [0.550, 0.024, 5.39],
        cameraFarPosition: [-0.60, 0.14, 28.21],
        cameraNearPosition: [-0.10, 0.024, 4.99],
        imageName: 'earch/i_galapagos.png',
        coordSpriteIndex: 1,
        videoSprite: [22.00, 37.43],
        soundSprite: [12, 22.057142857142857]
    }, {
        name: 'chengdu',
        coord: [104.071833, 30.580517], // 77° 58' S, 155° 38' W
        position: [-1.32, -5.05, 0.98],
        cameraFarPosition: [-7.88, -27.00, 1.87],
        cameraNearPosition: [-1.39, -4.75, 0.33],
        imageName: 'earch/i_antarctica.png',
        coordSpriteIndex: 0,
        videoSprite: [50.90, 69.00],
        soundSprite: [36, 46.05714285714286]
    }];

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
            map: new THREE.TextureLoader().load('/beautifulEarth.png')
        });
        earthMesh = new THREE.Mesh(earthGeo, earthMater);
        scene.add(earthMesh);
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
        LOCATIONS.forEach(location => {
                const material = new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load('/lensflare0_alpha.png'),
                    transparent: true, //使用背景透明的png贴图，注意开启透明计算
                    // side: THREE.DoubleSide, //双面可见
                    depthWrite: false, //禁止写入深度缓冲区数据
                });
                const planGeometry = new THREE.PlaneGeometry(3, 3);
                pointMesh = new THREE.Mesh(planGeometry, material);
                const size = 200 * 0.08;//矩形平面Mesh的尺寸
                pointMesh.scale.set(size, size, size);
                //设置mesh位置
                const coord = Point(location.coord[0], location.coord[1], 200 * 1.01)

                // 字体
                new THREE.FontLoader().load('/helvetiker_bold.typeface.json', function (font) {
                    const color = 0x006699;
                    const matLite = new THREE.MeshBasicMaterial({
                        color: color,
                        opacity: 0.4,
                        side: THREE.DoubleSide
                    });
                    const message = location.name
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

                const aMesh = new THREE.Mesh(aGeo, aMater).rotateX(Math.PI / 2);
                const groupMesh = new THREE.Group()
                groupMesh.add(pointMesh, aMesh);
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
        )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function threeStart() {
        initThree();
        initScene();
        initCamera();
        initStats();
        initLight();
        initEarth();
        createPointMesh()
        // 载入控制器
        controls = new OrbitControls(camera, renderer.domElement);
        animate();
    }

    function animate() {
        stats.update();

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