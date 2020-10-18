<template>
    <div class="container" id="container"></div>
</template>

<script>
import * as Three from 'three';
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
    this.initThree()
  },
  methods: {
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

      const triangles = 1600000;
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

      geometry.computeBoundingSphere();

      const materail = new Three.MeshPhongMaterial({
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: Three.DoubleSide, vertexColors: Three.VertexColors
      });

      const mesh = new Three.Mesh(geometry, materail);
      scene.add(mesh);

      const renderer = new Three.WebGL1Renderer({ antialias: false });
      renderer.setClearColor(scene.fog.color);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      container.appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);
      const that = this
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function animate() {
        requestAnimationFrame(animate);
        render();
      }
      function render() {
        const time = Date.now() * 0.001;
        mesh.rotation.x = time * 0.25;
        mesh.rotation.y = time * 0.5;
        renderer.render(scene, camera);
      }
      // animate()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
