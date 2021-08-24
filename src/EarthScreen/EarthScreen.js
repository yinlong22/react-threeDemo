import * as THREE from "three";
import {renderHelper} from "../renderHelper";
import Stats from "three/examples/jsm/libs/stats.module";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {LOCATIONS} from "./city";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";

export const EarthScreen = () => {
    let scene, camera, renderer, earthMesh, light, controls, stats, allLight, cityLast
        , isTween, tween = null
    const textureLoader = new THREE.TextureLoader();
    const locationGroup = new THREE.Group();
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster()

    threeStart();

    function initScene() {
        scene = new THREE.Scene();
        scene.opacity = 0;
        scene.transparent = true;
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(-500, 500, -500)
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
        allLight = new THREE.AmbientLight(0xFFFFFF);
        allLight.position.set(100, 100, 200);

        // 平行光 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
        light = new THREE.DirectionalLight(0xffffbb, 1);
        light.position.set(-11, 3, 1);

        const sun = new THREE.SpotLight(0x393939, 2.5);
        sun.position.set(-15, 10, 21);

        scene.add(allLight, light, sun);
    }

    // 地球
    function initEarth() {
        // 实例化一个半径为 200 的球体
        const earthGeo = new THREE.SphereGeometry(200, 100, 100);
        const earthMater = new THREE.MeshPhongMaterial({
            specular: 0x404040,
            shininess: 5,
            map: textureLoader.load('/earth.jpg'),
            specularMap: textureLoader.load('/earth_spec.jpg'),
            bumpMap: textureLoader.load('/earth_bump.jpg')
        });
        earthMesh = new THREE.Mesh(earthGeo, earthMater);
        earthMesh.name = "earth"
        scene.add(earthMesh);
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
        LOCATIONS.forEach(location => {
                const material = new THREE.MeshBasicMaterial({
                    map: textureLoader.load('/location.png'),
                    transparent: true, //背景透明的png贴图，注意开启透明计算
                    side: THREE.DoubleSide, //双面可见
                    fog: true,
                    depthWrite: false, //禁止写入深度缓冲区数据
                });
                const sprite = new THREE.Sprite(material)
                const pos = Point(location.coord[1], location.coord[0], 201);
                sprite.position.set(pos.x, pos.y, pos.z)
                sprite.name = location.name;
                sprite.coord = {lg: location.coord[1], lt: location.coord[0]};
                sprite.scale.set(20, 20, 1)
                const coordVec3 = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
                const meshNormal = new THREE.Vector3(0, 0, 1);
                sprite.quaternion.setFromUnitVectors(meshNormal, coordVec3);
                locationGroup.add(sprite)
                scene.add(locationGroup);
                // 字体
                // const map = new THREE.TextureLoader().load('/img.png');
                // sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: map, color: '#ffffff', opacity: 0.5}));
                // sprite.scale.set(32, 22, 1);
                // sprite.center.set(0.5, -0.5);

            }
        )
    }

    //点击
    // function onPointClick(event) {
    //     event.preventDefault();
    //     if (selectObject) {
    //         selectObject.material.color.set("#69f");
    //         selectObject = null;
    //     }
    //     const mouse = new THREE.Vector2();
    //     const raycaster = new THREE.Raycaster();
    //     //计算在图形中位置 鼠标   x  -1到1之间
    //     mouse.x = (event.clientX / document.querySelector('.showDemos').clientWidth) * 2 - 1;
    //     mouse.y = -(event.clientY / document.querySelector('.showDemos').clientHeight) * 2 + 1;
    //     //从新 从相机到鼠标位置射线 并且获得接触的物体。
    //     if (!camera) return
    //     raycaster.setFromCamera(mouse, camera);
    // const intersects = raycaster.intersectObjects(scene.children, true);
    // if (intersects.length > 0) {
    //     const res = intersects.filter(function (res) {
    //         return res && res.object
    //     })[0];
    //     if (res && res.object) {
    //         console.log(res)
    //         console.log(earthMesh, '===');
    //         if (res.object.id === 12) return;
    //         const coordVec3 = new THREE.Vector3(104.071833, 30.580517,200 * 1.01).normalize();
    //         const meshNormal = new THREE.Vector3(0, 0, 1);
    //         earthMesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
    //         selectObject = res.object;
    //         selectObject.material.color.set("#ffc466")
    //     }
    // }
    // }
    function rotate2Center(coord) {
        const lg = THREE.Math.degToRad(coord.lg),
            lt = THREE.Math.degToRad(coord.lt);
        return {x: lt, y: lg};
    }

    function rotateEarth(intervalX, intervalY) {
        isTween = true;
        if (tween) tween.stop();
        tween = new TWEEN.Tween({
            rotateY: earthMesh.rotation.y,
            rotateX: earthMesh.rotation.x,
            rotateLoc: locationGroup.rotation.y
        })
            .to({
                rotateY: earthMesh.rotation.y + intervalY,
                rotateX: earthMesh.rotation.x + intervalX,
                rotateLoc: locationGroup.rotation.y + intervalY
            }, 1000);
        tween.easing(TWEEN.Easing.Sinusoidal.InOut);
        const onUpdate = function () {
            earthMesh.rotation.y = this.rotateY;
            earthMesh.rotation.x = this.rotateX;
            locationGroup.rotation.y = this.rotateLoc;
            locationGroup.rotation.x = this.rotateX;
        }
        const onComplete = function () {
            isTween = false;
        }
        tween.onUpdate(onUpdate);
        tween.onComplete(onComplete);
        tween.start();
    }

    function onPointClick(e) {
        e.preventDefault();
        // 鼠标点击位置的屏幕坐标转换成threejs中的标准坐标-1<x<1, -1<y<1
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        // 获取raycaster直线和所有模型相交的数组集合
        const intersects = raycaster.intersectObjects(locationGroup.children, true);
        console.log(intersects, '===');
        // if (intersects.length > 0) {
        //     if (cityLast) cityLast.scale.set(1, 1, 1);
        //     // 只取第一个相交物体
        //     const city = intersects[0].object;
        //     cityLast = city;
        //     // 放大
        //     city.scale.set(1.5, 1.5, 1.5);
        //
        //     // 显示城市名
        //     // const cityName = city.name;
        //     // const cityText = document.getElementById("cityName");
        //     // cityText.className = "";
        //     // setTimeout(function () {
        //     //     cityText.innerText = cityName;
        //     //     cityText.className = "showed";
        //     // }, 500)
        //
        //     // 旋转到中心
        //     console.log(city.coord);
        //     const rotateRad = rotate2Center(city.coord);
        //     let finalY = -rotateRad.y;
        //     while (earthMesh.rotation.y > 0 && finalY + Math.PI * 2 < earthMesh.rotation.y) finalY += Math.PI * 2;
        //     while (earthMesh.rotation.y < 0 && finalY - Math.PI * 2 > earthMesh.rotation.y) finalY -= Math.PI * 2;
        //     if (Math.abs(finalY - earthMesh.rotation.y) > Math.PI) {
        //         if (finalY > earthMesh.rotation.y) finalY -= Math.PI * 2;
        //         else finalY += Math.PI * 2;
        //     }
        //     console.log(rotateRad)
        //     // rotateRad.x-earthGroup.rotation.x, rotateRad.y-earthGroup.rotation.y
        //     rotateEarth(rotateRad.x - earthMesh.rotation.x, finalY - earthMesh.rotation.y);
        // }
    }

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
        window.addEventListener("click", onPointClick, false)
        animate();
    }

    function animate() {
        stats.update();
        TWEEN.update();
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