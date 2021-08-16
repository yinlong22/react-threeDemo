import * as THREE from 'three'
import {renderHelper} from "../renderHelper";
// import 'three/examples/fonts/optimer_regular.typeface.json'

export const FontDemo = () => {
    let text_1
    const scene = new THREE.Scene();//创建场景
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//创建相机
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderHelper(renderer.domElement)
//创建渲染器
    const spotlight = new THREE.SpotLight(0xFFFFFF);
//定义光源  0xFFFFFF是十六进制颜色名，白色
    spotlight.position.set(-15, 10, 0);
//光源位置
    scene.add(spotlight);
//添加光源
    const loader = new THREE.FontLoader();//开始创建文字
    loader.load("three/examples/fonts/optimer_regular.typeface.json", function (font) {
        //上面导入了optimer_regular.typeface.json
        const new_text = new THREE.TextGeometry("text you want to show", {
            font: font,
            size: 0.5,
            height: 0.3,
            /*
            这里只定义了最基本的参数
            还有其他的参数
            font: THREE.Font的实例
            size: Float, 字体大小, 默认值为100
            height: Float, 挤出文本的厚度。默认值为50
            curveSegments: Integer, (表示文本的)曲线上点的数量，默认值为12
            bevelEnabled: Boolean, 是否开启斜角，默认为false
            bevelThickness: Float, 文本上斜角的深度，默认值为20
            bevelSize: Float, 斜角与原始文本轮廓之间的延伸距离, 默认值为8
            bevelSegments: Integer, 斜角的分段数, 默认值为3
            */
        });
        const material_text = new THREE.MeshLambertMaterial({color: 0x9933FF});
        /*
        定义可以反光的材料,
        也可以使用MeshBasicMeterial,
        只是对光源无效
        0x9933FF是十六进制颜色名
        */
        text_1 = new THREE.Mesh(new_text, material_text);
        //创建文字
        scene.add(text_1);
        //添加文字
        text_1.position.z = -7.4;
        text_1.position.y = 4;
        text_1.position.x = -2.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (text_1 && text_1.position.z >= -12) {
            text_1.position.z -= 0.01;
        }
        renderer.render(scene, camera);
    }

    animate();

    return (
        <div/>
    )
}
