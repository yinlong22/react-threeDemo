import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {ObjectLoader} from 'three/src/loaders/ObjectLoader'
import {renderHelper} from "../renderHelper";

export const TDDemo = () => {
    //场景
    const scene = new THREE.Scene();

//相机
    const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
//设置相机坐标
    camera.position.set(50, 30, 100);

//渲染器
    const renderer = new THREE.WebGLRenderer();
//设置渲染器的颜色和大小
    renderer.setClearColor(0x404040);
    renderer.setSize(window.innerWidth, window.innerHeight);
//将renderer（渲染器）的dom元素（renderer.domElement）添加到我们的HTML文档中。
//这就是渲染器用来显示场景给我们看的<canvas>元素
    renderHelper(renderer.domElement)

//鼠标控制旋转
    new OrbitControls(camera, renderer.domElement);
//设置是否可以缩放,默认值为true
// controls.enableZoom = false;
//设置鼠标交互,设置为false之后，不能移动位置，不能旋转物体,默认为true
// controls.enableRotate = false;

//设置光源
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.setScalar(100);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

//添加灰色网格线
    scene.add(new THREE.GridHelper(20, 20));

//导入obj模型
    const objLoader = new ObjectLoader();
    objLoader.load('../static/Pokeball_OBJ.obj', function (object) {

            //设置模型缩放比例
            object.scale.set(1, 1, 1);
            //设置模型的坐标
            object.position.set(0, 0, 0);

            //PI属性就是π,还表示了弧度π = 180°,Math.PI = 3.14 = 180°
            //将模型z轴旋转90度,三种写法都可以
            // object.rotation.z = -Math.PI * 0.5;
            // object.rotateZ(-Math.PI * 0.5);
            // object.rotation.set(0,0,-Math.PI * 0.5);

            //绘制模型周围的立方体连线
            // var box = new THREE.Box3().setFromObject(object);
            // var box3Helper = new THREE.Box3Helper(box);
            // scene.add(box3Helper);

            //辅助工具,x,y,z三维坐标轴
            // scene.add(new THREE.AxesHelper(20));

            // object.traverse(function(child) {
            //     if (child instanceof THREE.Mesh) {
            //         //设置模型皮肤
            //         child.material.map = THREE.ImageUtils.loadTexture( './static/p.jpg');
            //     }
            // });
            //将模型添加到场景中
            scene.add(object);
        },
        // onProgress回调
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError回调
        function (err) {
            console.error('An error happened');
        }
    );

    function render() {
        //动画循环渲染
        requestAnimationFrame(render);
        //渲染到页面上
        renderer.render(scene, camera);
    }

    render();

    return (
        <div/>
    )
}
