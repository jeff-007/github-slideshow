import * as Three from 'three'

// 初始化场景，相机，渲染器
// 设置渲染器大小，并将渲染后的dom插入到body中
const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
const renderer = new Three.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 定义几何体和材质
const geometry = new Three.CubeGeometry(2, 2, 2);
const material = new Three.MeshBasicMaterial({ color: 'red' })

// 材质和几何体组成最后的网格对象
const cube = new Three.Mesh(geometry, material)

scene.add(cube)
camera.position.z = 5;
renderer.render(scene, camera)

