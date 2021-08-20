import * as THREE from "three";
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";
import {renderHelper} from "../renderHelper";

export const xxx = () => {
    let container, camera, scene, renderer, cloudsMesh, earth, group, raycaster, mouse
    let mouseX = 0
    let mouseY = 0
    let locationGroup = null;
    let objects = [];
    let targetRotation = 0;
    let targetRotationOnMouseDown = 0;
    let mouseXOnMouseDown = 0;
    let stateforzhuan = "0";
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;


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
        name: 'antarctica',
        coord: [-77.96666667, -155.63333333], // 77° 58' S, 155° 38' W
        position: [-1.32, -5.05, 0.98],
        cameraFarPosition: [-7.88, -27.00, 1.87],
        cameraNearPosition: [-1.39, -4.75, 0.33],
        imageName: 'earch/i_antarctica.png',
        coordSpriteIndex: 0,
        videoSprite: [50.90, 69.00],
        soundSprite: [36, 46.05714285714286]
    }];


    init();
    animate();

    function init() {
        container = document.querySelector('.showDemos')
        if (!container)return
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 23;
        scene = new THREE.Scene();

        group = new THREE.Group();
        locationGroup = new THREE.Group();
        scene.add(group);
        group.add(locationGroup);
        //地点
        LOCATIONS.forEach(location => {
                const sprite = createLocationSprite(location)
                locationGroup.add(sprite)
                objects.push(sprite)
            }
        )
        //地球
        earth = createEarth();
        objects.push(earth);
        group.add(earth);
        //云彩
        const cloudsGeo = new THREE.SphereGeometry(5.1, 32, 32);
        const cloudsMater = new THREE.MeshPhongMaterial({
            map: getTexture('/clouds.png'),
            transparent: true,
            opacity: 1,
            // blending: THREE.additiveBlending
        });
        cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater);
        group.add(cloudsMesh);

        //灯
        scene.add(new THREE.AmbientLight(0x39393939, 0.9));

        const spotLight = new THREE.SpotLight(0xffffff, 1.2);
        spotLight.position.set(-26, 15, 15);
        //角度
        spotLight.angle = 0.2;
        //投影
        spotLight.castShadow = false;
        spotLight.penumbra = 0.4;
        spotLight.distance = 124;
        spotLight.decay = 1;
        spotLight.shadow.camera.near = 50;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.camera.fov = 35;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.mapSize.width = 1024;
        scene.add(spotLight);

        //光影投射器
        raycaster = new THREE.Raycaster();
        //鼠标的点
        mouse = new THREE.Vector2();
        //渲染
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderHelper(renderer.domElement);

        document.addEventListener('mousedown', onDocumentMouseDown, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function createEarth() {
        return new THREE.Mesh(
            new THREE.SphereGeometry(5, 32, 32),
            new THREE.MeshPhongMaterial({
                map: getTexture('/earth.jpg'),
                // bumpMap: getTexture('earch/earth_bump.55b3930.jpg'),
                bumpScale: 0.15,
                // specularMap: getTexture('earch/earth_spec.jpg'),
                specular: new THREE.Color('#909090'),
                shininess: 5,
                transparent: true
            })
        )
    }

    function getTexture(str) {
        const loader = new THREE.TextureLoader();
        return loader.load(str);
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        // cloudsMesh.rotation.y += 0.0002;
        // if (stateforzhuan === "1") {
        //     group.rotation.y += targetRotation;
        //     targetRotation = 0;
        // } else {
        //     group.rotation.y += 0.0008;
        // }
        TWEEN.update();
        renderer.render(scene, camera);
    }


    function createLocationSprite(location) {
        const spriteMaterial = new THREE.SpriteMaterial({
            map: THREE.ImageUtils.loadTexture(location.imageName),
            color: 0xffffff,
            fog: true
        })
        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.position.set(location.position[0], location.position[1], location.position[2])
        sprite.scale.set(1.4, 1.4, 1.4)
        return sprite
    }

//点击
    function onDocumentMouseDown(event) {
        event.preventDefault();
        //计算在图形中位置 鼠标   x  -1到1之间
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        //从新 从相机到鼠标位置射线 并且获得接触的物体。
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects);
        //除了地球以外的精灵面
        if (intersects.length > 0 && intersects[0].face == null) {
            //点击
            intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
            new TWEEN.Tween(camera.position).to({x: 0, y: 0, z: 18}, 1000).start();
        } else {
            onDocumentMouseDownzhuan(event);
        }
    }

//按下鼠标的时候
    function onDocumentMouseDownzhuan(event) {
        //标志标识正在控制
        stateforzhuan = "1";
        event.preventDefault();
        //移动
        window.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('mouseup', onDocumentMouseUp, false);
        window.addEventListener('mouseout', onDocumentMouseOut, false);
        //mouseXOnMouseDown距离中线的距离
        mouseXOnMouseDown = event.clientX - windowHalfX;
    }

    function onDocumentMouseUp() {
        stateforzhuan = "0";
        window.removeEventListener('mousemove', onDocumentMouseMove, false);
        window.removeEventListener('mouseup', onDocumentMouseUp, false);
        window.removeEventListener('mouseout', onDocumentMouseOut, false);
    }

    function onDocumentMouseOut() {
        stateforzhuan = "0";
        window.removeEventListener('mousemove', onDocumentMouseMove, false);
        window.removeEventListener('mouseup', onDocumentMouseUp, false);
        window.removeEventListener('mouseout', onDocumentMouseOut, false);
    }

//移动
    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        //mouseXOnMouseDown距离中线的距离
        targetRotation = 180 * (mouseX - mouseXOnMouseDown) * 0.000008 / 3.145926 * 5;
        mouseXOnMouseDown = mouseX;
    }

    return <div/>
}