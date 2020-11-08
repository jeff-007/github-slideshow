<template>
    <div>
        <canvas id="canvasElem2"></canvas>
        <!-- 小球散落 -->
        <canvas id="canvasElem1"></canvas>

        <!-- 三维正方体 -->
        <div class="container" id="container"></div>
    </div>

</template>

<script>
import * as Three from 'three';
// import Three from '@/three/vtkLoader.js'
const TWEEN = require('@tweenjs/tween.js')
import C from '@/canvas/utils.js'
import { Ball } from '@/canvas/ball.js';

export default {
  name: 'TriangleDemo',
  components: {},
  props: {},
  data() {
    return {
      camera: false,
      scene: false
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.initThree();
    // this.initVtkRabbit()
    this.springBall();
    this.drawBall()
  },
  methods: {
    springBall() {
      const canvas = document.querySelector('#canvasElem1');
      const ctx = canvas.getContext('2d');

      const W = canvas.width = window.innerWidth;
      const H = canvas.height = 600;

      const mouse = C.getOffSet(canvas);

      // 小球模拟喷泉
      const balls = [];
      const g = 0.05;
      for (let i = 0; i < 100; i++) {
        balls.push(new Ball({
          x: W / 2,
          y: H,
          r: Math.random() > 0.9 ? C.randomNum([25, 40]) : C.randomNum([15, 30]),
          fillStyle: C.randomColor(),
          vx: C.randomNum([-3, 3]),
          vy: C.randomNum([0, -10])
        }))
      }
      const that = this;
      function drawBall(ball) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vy += g;
        // 超过边界后初始化
        if (ball.x - ball.r >= W || ball.x + ball.r <= 0 || ball.y - ball.r >= H || ball.y + ball.r <= 0) {
          ball.x = W / 2;
          ball.y = H;
          ball.vx = C.randomNum([-3, 3]);
          ball.vy = C.randomNum([0, -10]);
        }
        ball.render(ctx);
      }

      (function move() {
        window.requestAnimationFrame(move);
        ctx.clearRect(0, 0, W, H);
        balls.forEach(drawBall);
      })();
    },
    drawBall() {
      const canvas = document.querySelector('#canvasElem2');
      const ctx = canvas.getContext('2d');

      const W = canvas.width = window.innerWidth;
      const H = canvas.height = 600;

      const mouse = C.getOffSet(canvas);
      const _that = this;
      // 小球散落
      const ballList = []; const num = 200; const g = 0.2; const bounce = -0.8;
      const floor = 300; // 小球落地高度
      const f1 = 250; // 视距
      const hx = W / 2; const hy = H / 2; // 消失点
      const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
      ballColor.addColorStop(0, 'rgb(255, 255, 255)');
      ballColor.addColorStop(0.3, 'rgba(0, 255, 240, 1)');
      ballColor.addColorStop(0.5, 'rgba(0, 240, 255, 1)');
      ballColor.addColorStop(0.8, 'rgba(0, 110, 255, 0.8)');
      ballColor.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      for (let i = 0; i < num; i++) {
        ballList.push(new Ball({
          y3d: -200,
          r: 10,
          fillStyle: ballColor,
          vx: C.randomNum([-6, 6]),
          vy: C.randomNum([-3, -6]),
          vz: C.randomNum([-5, 5])
        }))
      }
      function move(ball) {
        ball.vy += g;
        ball.x3d += ball.vx;
        ball.y3d += ball.vy;
        ball.z3d += ball.vz;
        if (ball.y3d > floor) {
          ball.y3d = floor;
          ball.vy *= bounce;
        }
        if (ball.z3d > -f1) {
          const scale = f1 / (f1 + ball.z3d);
          ball.scaleX = ball.scaleY = scale;
          ball.x = hx + ball.x3d * scale;
          ball.y = hy + ball.y3d * scale;
          ball.show = true
        } else {
          ball.show = false
        }
      }
      function draw(ball) {
        ball.show && ball.render(ctx)
      }
      function zSort(a, b) {
        return b.z3d - a.z3d
      }
      (function drawBall() {
        window.requestAnimationFrame(drawBall);
        ctx.clearRect(0, 0, W, H);
        ballList.forEach(move);
        ballList.forEach(zSort);
        ballList.forEach(draw)
      })();
    },

    initThree() {
      const container = document.getElementById('container');
      const camera = new Three.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500);
      camera.position.z = 2750;

      const scene = new Three.Scene();
      scene.fog = new Three.Fog(0x050505, 2000, 3500);

      scene.add(new Three.AmbientLight(0x444444));

      const light1 = new Three.DirectionalLight(0xffffff, 0.5);
      light1.position.set(1, 1, 1);
      const light2 = new Three.DirectionalLight(0xffffff, 1.5);
      light2.position.set(0, -1, 0);
      scene.add(light1);
      scene.add(light2);

      const triangles = 30000;
      const geometry = new Three.BufferGeometry();
      const positions = new Float32Array(triangles * 3 * 3);
      const normals = new Float32Array(triangles * 3 * 3);
      const colors = new Float32Array(triangles * 3 * 3);

      const color = new Three.Color();
      const n = 800; const n2 = n / 2;
      const d = 12; const d2 = d / 2; // individual triangle size

      const pA = new Three.Vector3();
      const pB = new Three.Vector3();
      const pC = new Three.Vector3();

      const cb = new Three.Vector3();
      const ab = new Three.Vector3();

      for (let i = 0; i < positions.length; i += 9) {
        const x = Math.random() * n - n2;
        const y = Math.random() * n - n2;
        const z = Math.random() * n - n2;

        const ax = x + Math.random() * d - d2;
        const ay = y + Math.random() * d - d2;
        const az = z + Math.random() * d - d2;

        const bx = x + Math.random() * d - d2;
        const by = y + Math.random() * d - d2;
        const bz = z + Math.random() * d - d2;

        const cx = x + Math.random() * d - d2;
        const cy = y + Math.random() * d - d2;
        const cz = z + Math.random() * d - d2;

        positions[i] = ax;
        positions[i + 1] = ay;
        positions[i + 2] = az;

        positions[i + 3] = bx;
        positions[i + 4] = by;
        positions[i + 5] = bz;

        positions[i + 6] = cx;
        positions[i + 7] = cy;
        positions[i + 8] = cz;

        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);

        // 求得每个三角形平面的法向量
        // 此例中为每个顶点均设置了一个法向量，同一个平面的三个顶点法向量相同
        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);
        cb.normalize();

        const nx = cb.x;
        const ny = cb.y;
        const nz = cb.z;

        // 将法向量的x, y, z坐标存放在normals数组中
        normals[i] = nx;
        normals[i + 1] = ny;
        normals[i + 2] = nz;

        normals[i + 3] = nx;
        normals[i + 4] = ny;
        normals[i + 5] = nz;

        normals[i + 6] = nx;
        normals[i + 7] = ny;
        normals[i + 8] = nz;

        const vx = (x / n) + 0.5;
        const vy = (y / n) + 0.5;
        const vz = (z / n) + 0.5;

        color.setRGB(vx, vy, vz);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;

        colors[i + 3] = color.r;
        colors[i + 4] = color.g;
        colors[i + 5] = color.b;

        colors[i + 6] = color.r;
        colors[i + 7] = color.g;
        colors[i + 8] = color.b;
      }
      geometry.addAttribute('position', new Three.BufferAttribute(positions, 3));
      geometry.addAttribute('normal', new Three.BufferAttribute(normals, 3));
      geometry.addAttribute('color', new Three.BufferAttribute(colors, 3));

      // 计算包裹该geometry的立方体或长方体大小
      geometry.computeBoundingSphere();

      const materail = new Three.MeshPhongMaterial({
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: Three.DoubleSide, vertexColors: Three.VertexColors
      });

      const mesh = new Three.Mesh(geometry, materail);
      scene.add(mesh);
      // initTween()

      const renderer = new Three.WebGL1Renderer({ antialias: false });
      renderer.setClearColor(scene.fog.color);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      container.appendChild(renderer.domElement);

      // 鼠标拾取 mouse: 当前鼠标坐标
      const rayCaster = new Three.Raycaster();
      const mouse = { x: 0, y: 0 };
      let INTERSECTED;

      window.addEventListener('resize', onWindowResize, false);

      window.addEventListener('mousemove', onDocumentMouseMove, false);
      const that = this;

      // Tween.js动画
      function initTween() {
        new TWEEN.Tween(mesh.position).to({ x: -400 }, 3000).repeat(Infinity).start()
      }
      function initGrid() {
        // 网格的边长是1000，每个小网格的边长是50
        const helper = new Three.GridHelper(1000, 50);
        helper.setColors(0x0000ff, 0x808080);
        scene.add(helper);
      }

      function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      }

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function animate() {
        requestAnimationFrame(animate);
        render();
        TWEEN.update()
      }
      function render() {
        // 鼠标拾取元素
        rayCaster.setFromCamera(mouse, camera); // 即获得一条从相机射向鼠标的线段
        const intersects = rayCaster.intersectObjects(scene.children); // 获取所有添加到scene中的和相机指向鼠标的线段相交的元素
        //  INTERSECTED 表示当前已选中的相交元素
        //  该函数限制了只显示相交的第一个元素，并且设置相交元素所高亮显示的颜色
        if (intersects.length > 0) {
          if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex('0xff0000')
          }
        } else {
          if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
          INTERSECTED = null
        }

        const time = Date.now() * 0.001;
        mesh.rotation.x = time * 0.25;
        mesh.rotation.y = time * 0.5;
        renderer.render(scene, camera);
      }
      animate()
    }

    // vtk兔子模型
    // initVtkRabbit() {
    //   let container, stats;
    //   let camera, scene, renderer;
    //   let cross;
    //   let controls = {}
    //   init();
    //   animate();
    //
    //   function init() {
    //     camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1e10);
    //     camera.position.z = 0.2;
    //
    //     controls.rotateSpeed = 5.0;
    //     controls.zoomSpeed = 5;
    //     controls.panSpeed = 2;
    //
    //     controls.noZoom = false;
    //     controls.noPan = false;
    //
    //     controls.staticMoving = true;
    //     controls.dynamicDampingFactor = 0.3;
    //
    //     scene = new Three.Scene();
    //     scene.add(camera);
    //
    //     // 方向光
    //     let dirLight = new Three.DirectionalLight(0xffffff);
    //     dirLight.position.set(200, 200, 1000).normalize();
    //
    //     camera.add(dirLight);
    //     camera.add(dirLight.target);
    //     // A begin
    //     let material = new Three.MeshLambertMaterial({ color: 0xffffff, side: Three.DoubleSide });
    //     let loader = new Three.VTKLoader();
    //     loader.addEventListener('load', function(event) {
    //       let geometry = event.content;
    //       let mesh = new Three.Mesh(geometry, material);
    //       mesh.position.setY(-0.09);
    //       scene.add(mesh);
    //     });
    //     loader.load('../assets/three/bunny.vtk');
    //     // A end
    //     // renderer
    //     renderer = new Three.WebGLRenderer({ antialias: false });
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    //     container = document.getElementById('container');
    //     container.appendChild(renderer.domElement);
    //
    //
    //     window.addEventListener('resize', onWindowResize, false);
    //   }
    //
    //   function onWindowResize() {
    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    //     // controls.handleResize();
    //   }
    //
    //   function animate() {
    //     requestAnimationFrame(animate);
    //     // controls.update();
    //     renderer.render(scene, camera);
    //   }
    // }
  }
}
</script>

<style scoped lang="scss">
    canvas{
        background: rgba(0, 0, 0, 1);
        margin: 40px 0;
    }
</style>
