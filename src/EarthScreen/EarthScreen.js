import * as THREE from "three";
import {renderHelper} from "../renderHelper";
import Stats from "three/examples/jsm/libs/stats.module";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {LOCATIONS} from "./city";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import {degToRad} from "three/src/math/MathUtils";
import {useEffect} from "react";

export const EarthScreen = () => {
    let scene, camera, renderer, earthMesh, light, controls, stats,
        tween, city = null
    const textureLoader = new THREE.TextureLoader();
    const locationGroup = new THREE.Group();
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster()

    useEffect(()=>{
        threeStart();
    },[])

    function initScene() {
        scene = new THREE.Scene();
        scene.opacity = 0;
        scene.transparent = true;
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.z = 500;
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
        earthMesh.rotation.y = -(Math.PI / 2).toFixed(2);
        earthMesh.name = "earth"
        scene.add(earthMesh);
    }

    // 光源
    function initLight() {
        // 位于场景正上方的光源，颜色从天空颜色渐变为地面颜色。
        // light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

        // 环境光
        const allLight = new THREE.AmbientLight(0xFFFFFF);
        allLight.position.set(100, 100, 200);

        // 平行光 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
        light = new THREE.DirectionalLight(0xffffbb, 1);
        light.position.set(-11, 3, 1);

        const sun = new THREE.SpotLight(0x393939, 2.5);
        sun.position.set(-15, 10, 21);

        scene.add(allLight, light, sun);
    }

    /**
     *lng:经度
     *lat:维度
     *radius:地球半径
     */
    function Point(lng, lat, radius) {
        const lg = THREE.Math.degToRad(lng),
            lt = THREE.Math.degToRad(lat);
        const y = radius * Math.sin(lt);
        const temp = radius * Math.cos(lt);
        const x = temp * Math.sin(lg);
        const z = temp * Math.cos(lg);
        return {x: x, y: y, z: z}
    }

    function createPointMesh() {
        // 打点
        LOCATIONS.forEach(location => {
                //设置坐标
                const sprite = new THREE.Sprite(new THREE.SpriteMaterial(
                    {
                        map: textureLoader.load('/location.png'),
                        depthWrite: false, //禁止写入深度缓冲区数据
                    }));
                const pos = Point(location.coord[1], location.coord[0], 200 * 1.05)
                sprite.coord = {lg: location.coord[1], lt: location.coord[0]}
                sprite.position.set(pos.x, pos.y, pos.z);
                sprite.scale.set(20, 20, 1);
                sprite.name = location.name
                //城市名
                const spriteText = new THREE.Sprite(new THREE.SpriteMaterial(
                    {
                        color: 0x000000,
                        map: textureLoader.load(`/i_${(location.name).toLowerCase()}.png`),
                        depthWrite: false, //禁止写入深度缓冲区数据
                    }));
                spriteText.position.set(pos.x, pos.y, pos.z);
                spriteText.scale.set(50, 50, 1.5);
                locationGroup.add(sprite, spriteText);
                scene.add(locationGroup);
            }
        )
    }

    function rotate2Center(coord) {
        return {x: degToRad(coord.lt), y: degToRad(coord.lg)};
    }

    function rotateEarth(intervalX, intervalY) {
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
            earthMesh.rotation.y = this._object.rotateY;
            earthMesh.rotation.x = this._object.rotateX;
            locationGroup.rotation.y = this._object.rotateLoc;
            locationGroup.rotation.x = this._object.rotateX;
        }
        const onComplete = function () {
        }
        tween.onUpdate(onUpdate);
        tween.onComplete(onComplete);
        tween.start();
    }

    function onPointClick(e) {
        e.preventDefault();
        console.log(controls.rotation);
        // 鼠标点击位置的屏幕坐标转换成threejs中的标准坐标-1<x<1, -1<y<1
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        // 获取raycaster直线和所有模型相交的数组集合
        const intersects = raycaster.intersectObjects(locationGroup.children, true);
        if (intersects.length > 0 && intersects[0].object.name) {
            // 只取第一个相交物体
            if (city) city.scale.set(20, 20, 1);
            city = intersects[0].object;
            // 放大
            city.scale.set(30, 30, 1);

            // 显示城市名
            // const cityName = city.name;
            // const cityText = document.getElementById("cityName");
            // cityText.className = "";
            // setTimeout(function () {
            //     cityText.innerText = cityName;
            //     cityText.className = "showed";
            // }, 500)

            // 旋转到中心
            const rotateRad = rotate2Center(city.coord);
            let finalY = -rotateRad.y;
            while (earthMesh.rotation.y > 0 && finalY + Math.PI * 2 < earthMesh.rotation.y) finalY += Math.PI * 2;
            while (earthMesh.rotation.y < 0 && finalY - Math.PI * 2 > earthMesh.rotation.y) finalY -= Math.PI * 2;
            if (Math.abs(finalY - earthMesh.rotation.y) > Math.PI) {
                if (finalY > earthMesh.rotation.y) finalY -= Math.PI * 2;
                else finalY += Math.PI * 2;
            }
            rotateEarth(rotateRad.x - earthMesh.rotation.x,
                finalY - earthMesh.rotation.y-(Math.PI / 2).toFixed(2));
        }
    }

    function startControl() {
        document.addEventListener('mousedown', onPointClick);
        // 载入控制器
        controls = new OrbitControls(camera, renderer.domElement);
    }

    function threeStart() {
        initThree();
        initScene();
        initCamera();
        initStats();
        initLight();
        initEarth();
        createPointMesh()
        startControl()
        animate();
    }

    function animate() {
        stats.update();
        renderer.clear();
        renderer.render(scene, camera);
        requestAnimationFrame(() => {
            TWEEN.update();
            if (controls) {
                controls.update();
                animate()
            }
        });
    }

    return <div/>
}