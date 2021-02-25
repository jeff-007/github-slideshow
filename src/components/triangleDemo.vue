<template>
    <div>
<!--        <canvas id="canvasElem2"></canvas>-->
<!--        &lt;!&ndash; 小球散落 &ndash;&gt;-->
<!--&lt;!&ndash;        <canvas id="canvasElem1"></canvas>&ndash;&gt;-->

<!--        &lt;!&ndash; 粒子花园 &ndash;&gt;-->
<!--        <canvas id="canvasElem3"></canvas>-->

<!--        &lt;!&ndash; 3d星空环绕 &ndash;&gt;-->
<!--        <canvas id="canvasElem4"></canvas>-->

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
import * as Stats from 'three/examples/js/libs/stats.min.js'
import * as dat from 'three/examples/jsm/libs/dat.gui.module.js'
import { Lensflare } from 'three/examples/jsm/objects/Lensflare.js'
import { Projector } from 'three/examples/jsm/renderers/Projector.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

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
      // this.bumpTexture()
      this.testAxios()
  },
  methods: {
      testAxios() {
        const postData = {
            mid: '123',
            name: 'jeff'
        }
        const that = this;
        this.$api.moduleOne.testMethod(postData).then(res => {
            console.log(res)
        }).catch(error => {})
      },
      bumpTexture() {
          let stats = initStats();

          // create a scene, that will hold all our elements such as objects, cameras and lights.
          let scene = new Three.Scene();

          // create a camera, which defines where we're looking at.
          let camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

          // create a render and set the size
          let webGLRenderer = new Three.WebGLRenderer();
          webGLRenderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
          webGLRenderer.setSize(window.innerWidth, window.innerHeight);
          webGLRenderer.shadowMapEnabled = true;

          let sphere1 = createMesh(new Three.BoxGeometry(15, 15, 2), "");
          sphere1.rotation.y = -0.5;
          sphere1.position.x = 12;
          scene.add(sphere1);

          let sphere2 = createMesh(new Three.BoxGeometry(15, 15, 2), "stone.jpg", "stone-bump.jpg");
          sphere2.rotation.y = 0.5;
          sphere2.position.x = -12;
          scene.add(sphere2);
          console.log(sphere2.geometry.faceVertexUvs);

          let floorTex = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37');
          let plane = new Three.Mesh(new Three.BoxGeometry(200, 100, 0.1, 30), new Three.MeshPhongMaterial({
              color: 0x3c3c3c,
              map: floorTex
          }));
          plane.position.y = -7.5;
          plane.rotation.x = -0.5 * Math.PI;
          scene.add(plane);

          // position and point the camera to the center of the scene
          camera.position.x = 0;
          camera.position.y = 12;
          camera.position.z = 28;
          camera.lookAt(new Three.Vector3(0, 0, 0));

          let ambiLight = new Three.AmbientLight(0x242424);
          scene.add(ambiLight);

          let light = new Three.SpotLight();
          light.position.set(0, 30, 30);
          light.intensity = 1.2;
          scene.add(light);

          // add the output of the renderer to the html element
          document.getElementById('container').appendChild(webGLRenderer.domElement);

          // call the render function
          let step = 0;
          // setup the control gui
          let controls = new function () {
              this.bumpScale = 0.2;
              this.changeTexture = "weave";
              this.rotate = false;

              this.changeTexture = function (e) {
                  let texture = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37')
                  sphere2.material.map = texture;
                  sphere1.material.map = texture;

                  let bump = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37')
                  sphere2.material.bumpMap = bump;
              };

              this.updateBump = function (e) {
                  console.log(sphere2.material.bumpScale);
                  sphere2.material.bumpScale = e;
              }
          };


          let gui = new dat.GUI();
          render();

          function createMesh(geom, imageFile, bump) {
              let texture = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37')
              geom.computeVertexNormals();
              let mat = new Three.MeshPhongMaterial();
              mat.map = texture;

              if (bump) {
                  let bump = new TextureLoader().load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37')
                  mat.bumpMap = bump;
                  mat.bumpScale = 0.2;
                  console.log('d');
              }


              // create a multimaterial
              let mesh = new Three.Mesh(geom, mat);

              return mesh;
          }

          function render() {
              stats.update();

              if (controls.rotate) {
                  sphere1.rotation.y -= 0.01;
                  sphere2.rotation.y += 0.01;
              }

//            sphere1.rotation.y=step+=0.01;
//            sphere1.rotation.x=step;
//            sphere2.rotation.y=step;
//            sphere2.rotation.x=step;

              // render using requestAnimationFrame
              requestAnimationFrame(render);
              webGLRenderer.render(scene, camera);
          }

          function initStats() {

              var stats = new Stats();
              stats.setMode(0); // 0: fps, 1: ms

              // Align top-left
              stats.domElement.style.position = 'absolute';
              stats.domElement.style.left = '0px';
              stats.domElement.style.top = '0px';

              document.getElementById('container').appendChild(stats.domElement);

              return stats;
          }
      },
    morphTarget() {
      const stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new Three.Scene();

      // create a camera, which defines where we're looking at.
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);

      // create a render and set the size
      const webGLRenderer = new Three.WebGLRenderer();
      webGLRenderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
      webGLRenderer.setSize(window.innerWidth, window.innerHeight);
      webGLRenderer.shadowMapEnabled = true;

      // position and point the camera to the center of the scene
      camera.position.x = 250;
      camera.position.y = 250;
      camera.position.z = 350;
      camera.lookAt(new Three.Vector3(100, 50, 0));


      // add spotlight for the shadows
      const spotLight = new Three.DirectionalLight(0xffffff);
      spotLight.position.set(300, 200, 300);
      spotLight.intensity = 1;
      scene.add(spotLight);

      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(webGLRenderer.domElement);

      // call the render function
      const step = 0;


      // setup the control gui
      var controls = new function() {
        this.keyframe = 0;
      }();

      var gui = new dat.GUI();
      gui.add(controls, 'keyframe', 0, 15).step(1).onChange(function(e) {
        showFrame(e);
      });
      var mesh;
      var meshAnim;
      var frames = [];
      var currentMesh;
      var clock = new Three.Clock();

      // var loader = new Three.JSONLoader();
      const loader = new Three.ObjectLoader();
      loader.load('../assets/models/horse.json', function(object) {
        scene.add(object)
      })
      // loader.load('../assets/models/horse.json', function(geometry) {
      //
      //   var mat = new Three.MeshLambertMaterial(
      //     {
      //       morphTargets: true,
      //       vertexColors: Three.FaceColors
      //     });
      //
      //
      //   var mat2 = new Three.MeshLambertMaterial(
      //     { color: 0xffffff, vertexColors: Three.FaceColors });
      //
      //   mesh = new Three.Mesh(geometry, mat);
      //   mesh.position.x = -100;
      //   frames.push(mesh);
      //   currentMesh = mesh;
      //   morphColorsToFaceColors(geometry);
      //
      //   mesh.geometry.morphTargets.forEach(function(e) {
      //     var geom = new Three.Geometry();
      //     geom.vertices = e.vertices;
      //     geom.faces = geometry.faces;
      //
      //
      //     var morpMesh = new Three.Mesh(geom, mat2);
      //     frames.push(morpMesh);
      //     morpMesh.position.x = -100;
      //
      //   });
      //
      //   geometry.computeVertexNormals();
      //   geometry.computeFaceNormals();
      //   geometry.computeMorphNormals();
      //
      //   meshAnim = new Three.MorphAnimMesh(geometry, mat);
      //   meshAnim.duration = 1000;
      //   meshAnim.position.x = 200;
      //   meshAnim.position.z = 0;
      //
      //   scene.add(meshAnim);
      //
      //   showFrame(0);
      //
      // });

      function showFrame(e) {
        scene.remove(currentMesh);
        scene.add(frames[e]);
        currentMesh = frames[e];
        console.log(currentMesh);
      }

      function morphColorsToFaceColors(geometry) {

        if (geometry.morphColors && geometry.morphColors.length) {

          var colorMap = geometry.morphColors[0];
          for (var i = 0; i < colorMap.colors.length; i++) {
            geometry.faces[i].color = colorMap.colors[i];
            geometry.faces[i].color.offsetHSL(0, 0.3, 0);
          }
        }
      }

      render();

      function render() {
        stats.update();

        var delta = clock.getDelta();
        webGLRenderer.clear();
        if (meshAnim) {
          meshAnim.updateAnimation(delta * 1000);
          meshAnim.rotation.y += 0.01;
        }
        // render using requestAnimationFrame


        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
      }

      function initStats() {

        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms


        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);

        return stats;
      }
    },
    initOrbit() {
      const stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new Three.Scene();

      // create a camera, which defines where we're looking at.
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

      // create a render and set the size
      const webGLRenderer = new Three.WebGLRenderer();
      webGLRenderer.setClearColor(new Three.Color(0x000, 1.0));
      webGLRenderer.setSize(window.innerWidth, window.innerHeight);
      webGLRenderer.shadowMap.enabled = true;

      const sphere = createMesh(new Three.SphereGeometry(20, 40, 40));
      // add the sphere to the scene
      scene.add(sphere);

      // position and point the camera to the center of the scene
      camera.position.x = -20;
      camera.position.y = 30;
      camera.position.z = 40;
      camera.lookAt(new Three.Vector3(0, 0, 0));

      const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);
      orbitControls.autoRotate = true;
      const clock = new Three.Clock();

      const ambiLight = new Three.AmbientLight(0x111111);
      scene.add(ambiLight);
      const spotLight = new Three.DirectionalLight(0xffffff);
      spotLight.position.set(-20, 30, 40);
      spotLight.intensity = 1.5;
      scene.add(spotLight);

      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(webGLRenderer.domElement);

      // call the render function
      const step = 0;

      render();

      function createMesh(geom) {
        // const planetTexture = Three.ImageUtils.loadTexture('../assets/textures/planets/mars_1k_color.jpg');
        const normalTexture = Three.ImageUtils.loadTexture('../assets/textures/planets/mars_1k_normal.jpg');

        const textLoader = new Three.TextureLoader()
        const planetTexture = textLoader.load('http://testt2.wmnetwork.cc/res/index/banners/meet_cloud.png?ver=4.9.37');
        console.log(planetTexture)

        planetTexture.wrapS = Three.RepeatWrapping;
        planetTexture.wrapT = Three.RepeatWrapping;
        planetTexture.repeat.set(1, 1);

        const planeMaterial = new Three.MeshLambertMaterial({ map: planetTexture });

        // const planetMaterial = new Three.MeshPhongMaterial({ map: planetTexture, bumpMap: normalTexture });


        const wireFrameMat = new Three.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        // create a multimaterial
        const mesh = new Three.Mesh(geom, planeMaterial);
        // const mesh = SceneUtils.createMultiMaterialObject(geom, [planeMaterial, wireFrameMat]);
        return mesh;
      }

      function render() {
        stats.update();
        const delta = clock.getDelta();
        orbitControls.update(delta);

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
      }

      function initStats() {

        const stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);
        return stats;
      }
    },
    //  ?未完成
    initTweenPoint() {
      const stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new Three.Scene();

      // create a camera, which defines where we're looking at.
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

      // create a render and set the size
      const webGLRenderer = new Three.WebGLRenderer();
      webGLRenderer.setClearColor(new Three.Color(0x000, 1.0));
      webGLRenderer.setSize(window.innerWidth, window.innerHeight);
      webGLRenderer.shadowMap.enabled = true;

      // position and point the camera to the center of the scene
      camera.position.x = 10;
      camera.position.y = 10;
      camera.position.z = 10;
      camera.lookAt(new Three.Vector3(0, -2, 0));

      // add spotlight for the shadows
      const spotLight = new Three.SpotLight(0xffffff);
      spotLight.position.set(20, 20, 20);
      scene.add(spotLight);

      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(webGLRenderer.domElement);

      // call the render function
      const step = 0;


      // setup the control gui
      const controls = new function() {
        // we need the first child, since it's a multimaterial
      }();

      let pointCloud = new Three.Object3D();
      let loadedGeometry;


      // create a tween
      // http://sole.github.io/tween.js/examples/03_graphs.html
      const posSrc = { pos: 1 };
      const tween = new TWEEN.Tween(posSrc).to({ pos: 0 }, 5000);
      tween.easing(TWEEN.Easing.Sinusoidal.InOut);

      const tweenBack = new TWEEN.Tween(posSrc).to({ pos: 1 }, 5000);
      tweenBack.easing(TWEEN.Easing.Sinusoidal.InOut);

      tween.chain(tweenBack);
      tweenBack.chain(tween);


      const onUpdate = function() {
        let count = 0;
        const pos = this.pos;

        loadedGeometry.groups.forEach(function(e) {
          const newY = ((e.y + 3.22544) * pos) - 3.22544;
          pointCloud.geometry.groups[count++].set(e.x, newY, e.z);
        });

        pointCloud.sortParticles = true;
      };

      tween.onUpdate(onUpdate);
      tweenBack.onUpdate(onUpdate);


      const gui = new dat.GUI();


      const loader = new PLYLoader();

      loader.load('../assets/models/test.ply', function(geometry) {
        loadedGeometry = geometry.clone();
        console.log('===');
        console.log(loadedGeometry)

        const material = new Three.PointCloudMaterial({
          color: 0xffffff,
          size: 0.4,
          opacity: 0.6,
          transparent: true,
          blending: Three.AdditiveBlending,
          map: generateSprite()
        });

        pointCloud = new Three.PointCloud(geometry, material);
        pointCloud.sortParticles = true;

        tween.start();
        scene.add(pointCloud);
      });


      render();

      // from THREE.js examples
      function generateSprite() {

        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const texture = new Three.Texture(canvas);
        texture.needsUpdate = true;
        return texture;

      }

      function render() {
        stats.update();
        TWEEN.update();
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
      }

      function initStats() {

        const stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);

        return stats;
      }
    },
    //  使用Projector和Three.Raycaster来检测是否使用鼠标点击了某个对象
    getSelectObject() {
      const stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new Three.Scene();

      // create a camera, which defines where we're looking at.
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

      // create a render and set the size
      const renderer = new Three.WebGLRenderer();

      renderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true

      document.addEventListener('mousedown', onDocumentMouseDown, false);
      document.addEventListener('mousemove', onDocumentMouseMove, false);

      // create the ground plane
      const planeGeometry = new Three.PlaneGeometry(60, 20, 1, 1);
      const planeMaterial = new Three.MeshLambertMaterial({ color: 0xffffff });
      const plane = new Three.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true

      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 15;
      plane.position.y = 0;
      plane.position.z = 0;

      // add the plane to the scene
      scene.add(plane);

      // create a cube
      const cubeGeometry = new Three.BoxGeometry(4, 4, 4);
      const cubeMaterial = new Three.MeshLambertMaterial({ color: 0xff0000 });
      const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true

      // position the cube
      cube.position.x = -9;
      cube.position.y = 3;
      cube.position.z = 0;

      // add the cube to the scene
      scene.add(cube);

      const sphereGeometry = new Three.SphereGeometry(4, 20, 20);
      const sphereMaterial = new Three.MeshLambertMaterial({ color: 0x7777ff });
      const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);

      // position the sphere
      sphere.position.x = 20;
      sphere.position.y = 0;
      sphere.position.z = 2;
      // add the sphere to the scene
      scene.add(sphere);
      sphere.castShadow = true

      const cylinderGeometry = new Three.CylinderGeometry(2, 2, 20);
      const cylinderMaterial = new Three.MeshLambertMaterial({ color: 0x77ff77 });
      const cylinder = new Three.Mesh(cylinderGeometry, cylinderMaterial);

      cylinder.position.set(0, 0, 1);

      scene.add(cylinder);


      // position and point the camera to the center of the scene
      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 30;
      camera.lookAt(scene.position);

      // add subtle ambient lighting
      const ambientLight = new Three.AmbientLight(0x0c0c0c);
      scene.add(ambientLight);

      // add spotlight for the shadows
      const spotLight = new Three.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true

      scene.add(spotLight);

      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(renderer.domElement);

      // call the render function
      let step = 0;
      let scalingStep = 0;

      const controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.scalingSpeed = 0.03;
        this.showRay = false;
      }();

      const gui = new dat.GUI();
      gui.add(controls, 'rotationSpeed', 0, 0.5);
      gui.add(controls, 'bouncingSpeed', 0, 0.5);
      gui.add(controls, 'scalingSpeed', 0, 0.5);
      gui.add(controls, 'showRay').onChange(function(e) {
        if (tube) scene.remove(tube)
      });

      render();

      function render() {
        stats.update();
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        // scale the cylinder

        scalingStep += controls.scalingSpeed;
        const scaleX = Math.abs(Math.sin(scalingStep / 4));
        const scaleY = Math.abs(Math.cos(scalingStep / 5));
        const scaleZ = Math.abs(Math.sin(scalingStep / 7));
        cylinder.scale.set(scaleX, scaleY, scaleZ);

        // render using requestAnimationFrame
        renderer.render(scene, camera);
        requestAnimationFrame(render);

      }

      const projector = new Projector();
      let tube;

      function onDocumentMouseDown(event) {
        //  通过鼠标点击的位置计算raycaster所需要的点的位置，以屏幕中心为原点，x和y值的范围均为-1到1
        //  点击位置距离屏幕左上角距离/屏幕的大小 得出点击位置占全屏幕宽的百分比，转换成在屏幕中心为原点，-1到1范围内的坐标
        let vector = new Three.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);

        vector = vector.unproject(camera);

        const raycaster = new Three.Raycaster(camera.position, vector.sub(camera.position).normalize());

        const intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

        if (intersects.length > 0) {


          intersects[0].object.material.transparent = true;
          intersects[0].object.material.opacity = 0.1;
        }
      }

      function onDocumentMouseMove(event) {
        if (controls.showRay) {
          let vector = new Three.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
          vector = vector.unproject(camera);

          const raycaster = new Three.Raycaster(camera.position, vector.sub(camera.position).normalize());
          const intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

          if (intersects.length > 0) {

            const points = [];
            points.push(new Three.Vector3(-30, 39.8, 30));
            points.push(intersects[0].point);

            const mat = new Three.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
            const tubeGeometry = new Three.TubeGeometry(new Three.SplineCurve3(points), 60, 0.001);

            if (tube) scene.remove(tube);

            if (controls.showRay) {
              tube = new Three.Mesh(tubeGeometry, mat);
              scene.add(tube);
            }
          }
        }
      }

      function initStats() {

        const stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);

        return stats;
      }
    },
    //  pointCloud
    initPoints() {
      const stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new Three.Scene();

      // create a camera, which defines where we're looking at.
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

      // create a render and set the size
      const webGLRenderer = new Three.WebGLRenderer();
      webGLRenderer.setClearColor(new Three.Color(0x000000, 1.0));
      webGLRenderer.setSize(window.innerWidth, window.innerHeight);

      // position and point the camera to the center of the scene
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 150;

      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(webGLRenderer.domElement);

      createParticles();
      render();

      function createParticles() {
        const geom = new Three.Geometry();
        const material = new Three.PointCloudMaterial({ size: 4, vertexColors: true, color: 0xffffff });

        for (let x = -5; x < 5; x++) {
          for (let y = -5; y < 5; y++) {
            const particle = new Three.Vector3(x * 10, y * 10, 0);
            geom.vertices.push(particle);
            geom.colors.push(new Three.Color(Math.random() * 0x00ffff));
          }
        }

        const cloud = new Three.PointCloud(geom, material);
        scene.add(cloud);
      }
      function render() {
        stats.update();
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
      }

      function initStats() {

        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);

        return stats;
      }
    },
    //  创建法向量
    initNormalMaterial() {
      const stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new Three.Scene();

      // create a camera, which defines where we're looking at.
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

      // create a render and set the size
      let renderer;
      const webGLRenderer = new Three.WebGLRenderer();
      webGLRenderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
      webGLRenderer.setSize(window.innerWidth, window.innerHeight);
      webGLRenderer.shadowMap.enabled = true;


      // let canvasRenderer = new Three.CanvasRenderer();
      // canvasRenderer.setSize(window.innerWidth, window.innerHeight);
      renderer = webGLRenderer;

      const groundGeom = new Three.PlaneGeometry(100, 100, 4, 4);
      const groundMesh = new Three.Mesh(groundGeom, new Three.MeshBasicMaterial({ color: 0x777777 }));
      groundMesh.rotation.x = -Math.PI / 2;
      groundMesh.position.y = -20;
      scene.add(groundMesh);

      const sphereGeometry = new Three.SphereGeometry(14, 20, 20);
      const cubeGeometry = new Three.BoxGeometry(15, 15, 15);
      const planeGeometry = new Three.PlaneGeometry(14, 14, 4, 4);


      var meshMaterial = new Three.MeshNormalMaterial({ color: 0x7777ff });
      var sphere = new Three.Mesh(sphereGeometry, meshMaterial);
      var cube = new Three.Mesh(cubeGeometry, meshMaterial);
      var plane = new Three.Mesh(planeGeometry, meshMaterial);

      // position the sphere
      sphere.position.x = 0;
      sphere.position.y = 3;
      sphere.position.z = 2;

      console.log('======')
      console.log(sphere);

      // 生成每个面的法线
      // 每个面face中包含了构成该面的顶点在vertices中的索引
      // 通过centroid.add方法将当前三个点的x,y,z坐标分别相加
      for (let f = 0, fl = sphere.geometry.faces.length; f < fl; f++) {
        const face = sphere.geometry.faces[f];
        const centroid = new Three.Vector3(0, 0, 0);
        centroid.add(sphere.geometry.vertices[face.a]);
        centroid.add(sphere.geometry.vertices[face.b]);
        centroid.add(sphere.geometry.vertices[face.c]);
        console.log(centroid)
        centroid.divideScalar(3);

        const arrow = new Three.ArrowHelper(
          face.normal,
          centroid,
          2,
          0x3333FF,
          0.5,
          0.5);
        sphere.add(arrow);
      }


      cube.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
      plane.position.set(sphere.position.x, sphere.position.y, sphere.position.z);


      // add the sphere to the scene
      scene.add(cube);

      // position and point the camera to the center of the scene
      camera.position.x = -20;
      camera.position.y = 30;
      camera.position.z = 40;
      camera.lookAt(new Three.Vector3(10, 0, 0));

      // add subtle ambient lighting
      const ambientLight = new Three.AmbientLight(0x0c0c0c);
      scene.add(ambientLight);

      // add spotlight for the shadows
      const spotLight = new Three.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      scene.add(spotLight);

      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(renderer.domElement);

      // call the render function
      let step = 0;
      const oldContext = null;

      const controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;

        this.opacity = meshMaterial.opacity;
        this.transparent = meshMaterial.transparent;

        this.visible = meshMaterial.visible;
        this.side = 'front';

        this.wireframe = meshMaterial.wireframe;
        this.wireframeLinewidth = meshMaterial.wireframeLinewidth;

        this.selectedMesh = 'cube';

        this.shadow = 'flat';

      }();

      const gui = new dat.GUI();


      const spGui = gui.addFolder('Mesh');
      spGui.add(controls, 'opacity', 0, 1).onChange(function(e) {
        meshMaterial.opacity = e
      });
      spGui.add(controls, 'transparent').onChange(function(e) {
        meshMaterial.transparent = e
      });
      spGui.add(controls, 'wireframe').onChange(function(e) {
        meshMaterial.wireframe = e
      });
      spGui.add(controls, 'wireframeLinewidth', 0, 20).onChange(function(e) {
        meshMaterial.wireframeLinewidth = e
      });
      spGui.add(controls, 'visible').onChange(function(e) {
        meshMaterial.visible = e
      });
      spGui.add(controls, 'side', ['front', 'back', 'double']).onChange(function(e) {
        console.log(e);
        switch (e) {
          case 'front':
            meshMaterial.side = Three.FrontSide;
            break;
          case 'back':
            meshMaterial.side = Three.BackSide;
            break;
          case 'double':
            meshMaterial.side = Three.DoubleSide;
            break;
        }
        meshMaterial.needsUpdate = true;

      });
      spGui.add(controls, 'shadow', ['flat', 'smooth']).onChange(function(e) {
        switch (e) {
          case 'flat':
            // https://github.com/mrdoob/three.js/issues/1929
            meshMaterial.shading = Three.FlatShading;
            break;
          case 'smooth':
            meshMaterial.shading = Three.SmoothShading;
            break;
        }

        const oldPos = sphere.position.clone();
        scene.remove(sphere);
        scene.remove(plane);
        scene.remove(cube);
        sphere = new Three.Mesh(sphere.geometry.clone(), meshMaterial);
        cube = new Three.Mesh(cube.geometry.clone(), meshMaterial);
        plane = new Three.Mesh(plane.geometry.clone(), meshMaterial);

        sphere.position.set(oldPos.x, oldPos.y, oldPos.z);
        cube.position.set(oldPos.x, oldPos.y, oldPos.z);
        plane.position.set(oldPos.x, oldPos.y, oldPos.z);

        switch (controls.selectedMesh) {
          case 'cube':
            scene.add(cube);

            break;
          case 'sphere':
            scene.add(sphere);

            break;
          case 'plane':
            scene.add(plane);
            break;

        }

        meshMaterial.needsUpdate = true;
      });

      spGui.add(controls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange(function(e) {

        scene.remove(plane);
        scene.remove(cube);
        scene.remove(sphere);


        switch (e) {
          case 'cube':
            scene.add(cube);

            break;
          case 'sphere':
            scene.add(sphere);

            break;
          case 'plane':
            scene.add(plane);
            break;

        }

        scene.add(e);
      });

      render();

      function render() {
        stats.update();

        cube.rotation.y = step += 0.01;
        plane.rotation.y = step;
        sphere.rotation.y = step;


        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }

      function initStats() {

        const stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms


        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);

        return stats;
      }
    },
    //  半球光，更贴近环境光
    initHemiLight() {
      var stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      var scene = new Three.Scene();
      scene.fog = new Three.Fog(0xaaaaaa, 0.010, 200);

      // create a camera, which defines where we're looking at.
      var camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


      // create a render and set the size
      var renderer = new Three.WebGLRenderer();

      renderer.setClearColor(new Three.Color(0xaaaaff, 1.0));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;


      // create the ground plane
      var textureGrass = Three.ImageUtils.loadTexture('../assets/textures/ground/grasslight-big.jpg');
      textureGrass.wrapS = Three.RepeatWrapping;
      textureGrass.wrapT = Three.RepeatWrapping;
      textureGrass.repeat.set(4, 4);


      var planeGeometry = new Three.PlaneGeometry(1000, 200, 20, 20);
      var planeMaterial = new Three.MeshLambertMaterial({ map: textureGrass });
      //        var planeMaterial = new Three.MeshLambertMaterial();
      var plane = new Three.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;

      // rotate and position the plane
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 15;
      plane.position.y = 0;
      plane.position.z = 0;

      // add the plane to the scene
      scene.add(plane);

      // create a cube
      var cubeGeometry = new Three.BoxGeometry(4, 4, 4);
      var cubeMaterial = new Three.MeshLambertMaterial({ color: 0xff3333 });
      var cube = new Three.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;

      // position the cube
      cube.position.x = -4;
      cube.position.y = 3;
      cube.position.z = 0;

      // add the cube to the scene
      scene.add(cube);

      var sphereGeometry = new Three.SphereGeometry(4, 25, 25);
      var sphereMaterial = new Three.MeshLambertMaterial({ color: 0x7777ff });
      var sphere = new Three.Mesh(sphereGeometry, sphereMaterial);

      // position the sphere
      sphere.position.x = 10;
      sphere.position.y = 5;
      sphere.position.z = 10;
      sphere.castShadow = true;

      // add the sphere to the scene
      scene.add(sphere);

      // position and point the camera to the center of the scene
      camera.position.x = -20;
      camera.position.y = 15;
      camera.position.z = 45;
      //        camera.position.x = -120;
      //        camera.position.y = 165;
      //        camera.position.z = 145;
      camera.lookAt(new Three.Vector3(10, 0, 0));


      // add spotlight for a bit of light
      var spotLight0 = new Three.SpotLight(0xcccccc);
      spotLight0.position.set(-40, 60, -10);
      spotLight0.lookAt(plane);
      scene.add(spotLight0);


      // var target = new Three.Object3D();
      // target.position.set(5, 0, 0)

      var hemiLight = new Three.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
      hemiLight.position.set(0, 500, 0);
      scene.add(hemiLight);


      var pointColor = '#ffffff';
      //    var dirLight = new THREE.SpotLight( pointColor);
      var dirLight = new Three.DirectionalLight(pointColor);
      dirLight.position.set(30, 10, -50);
      dirLight.castShadow = true;
      //        dirLight.shadowCameraNear = 0.1;
      //        dirLight.shadowCameraFar = 100;
      //        dirLight.shadowCameraFov = 50;
      dirLight.target = plane;
      dirLight.shadowCameraNear = 0.1;
      dirLight.shadowCameraFar = 200;
      dirLight.shadowCameraLeft = -50;
      dirLight.shadowCameraRight = 50;
      dirLight.shadowCameraTop = 50;
      dirLight.shadowCameraBottom = -50;
      dirLight.shadowMapWidth = 2048;
      dirLight.shadowMapHeight = 2048;


      scene.add(dirLight);


      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(renderer.domElement);

      // call the render function
      var step = 0;

      // used to determine the switch point for the light animation
      var invert = 1;
      var phase = 0;

      var controls = new function() {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;

        this.hemisphere = true;
        this.color = 0x00ff00;
        this.skyColor = 0x0000ff;
        this.intensity = 0.6;

      }();

      var gui = new dat.GUI();

      gui.add(controls, 'hemisphere').onChange(function(e) {

        if (!e) {
          hemiLight.intensity = 0;
        } else {
          hemiLight.intensity = controls.intensity;
        }
      });
      gui.addColor(controls, 'color').onChange(function(e) {
        hemiLight.groundColor = new Three.Color(e);
      });
      gui.addColor(controls, 'skyColor').onChange(function(e) {
        hemiLight.color = new Three.Color(e);
      });
      gui.add(controls, 'intensity', 0, 5).onChange(function(e) {
        hemiLight.intensity = e;
      });

      render();

      function render() {
        stats.update();
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }

      function initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);

        return stats;
      }
    },
    //  环境光demo
    initAmbientLight() {
      const stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new Three.Scene();

      // create a camera, which defines where we're looking at.
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

      // create a render and set the size
      const renderer = new Three.WebGLRenderer();

      renderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMapEnabled = true;

      // create the ground plane
      const planeGeometry = new Three.PlaneGeometry(60, 20, 1, 1);
      const planeMaterial = new Three.MeshLambertMaterial({ color: 0xffffff });
      var plane = new Three.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;

      // rotate and position the plane
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 15;
      plane.position.y = 0;
      plane.position.z = 0;

      // add the plane to the scene
      scene.add(plane);

      // create a cube
      const cubeGeometry = new Three.BoxGeometry(4, 4, 4);
      const cubeMaterial = new Three.MeshLambertMaterial({ color: 0xff0000 });
      const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
      cube.castShadow = true;

      // position the cube
      cube.position.x = -4;
      cube.position.y = 3;
      cube.position.z = 0;

      // add the cube to the scene
      scene.add(cube);

      const sphereGeometry = new Three.SphereGeometry(4, 20, 20);
      const sphereMaterial = new Three.MeshLambertMaterial({ color: 0x7777ff });
      const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);

      // position the sphere
      sphere.position.x = 20;
      sphere.position.y = 0;
      sphere.position.z = 2;
      sphere.castShadow = true;

      // add the sphere to the scene
      scene.add(sphere);

      // position and point the camera to the center of the scene
      camera.position.x = -25;
      camera.position.y = 30;
      camera.position.z = 25;
      camera.lookAt(new Three.Vector3(10, 0, 0));

      // add subtle ambient lighting
      const ambiColor = '#0c0c0c';
      const ambientLight = new Three.AmbientLight(ambiColor);
      scene.add(ambientLight);

      // add spotlight for the shadows
      const spotLight = new Three.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      scene.add(spotLight);

      const helper = new Three.SpotLightHelper(spotLight);
      scene.add(helper);


      // 调试投影
      // let debugCamera = new Three.CameraHelper(spotLight.shadow.camera);
      // scene.add(debugCamera)

      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(renderer.domElement);

      // call the render function
      let step = 0;

      const controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.disableSpotlight = false;
      }();

      const gui = new dat.GUI();
      gui.addColor(controls, 'ambientColor').onChange(function(e) {
        ambientLight.color = new Three.Color(e);
      });
      gui.add(controls, 'disableSpotlight').onChange(function(e) {
        spotLight.visible = !e;
      });


      render();

      function render() {
        helper.update();
        stats.update();
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }

      function initStats() {

        const stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);

        return stats;
      }
    },
    initDemo() {
      const stats = initStats();

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      const scene = new Three.Scene();

      // create a camera, which defines where we're looking at.
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      scene.add(camera);

      // create a render and set the size
      const renderer = new Three.WebGLRenderer();

      renderer.setClearColor(new Three.Color(0xEEEEEE, 1.0));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;

      // create the ground plane
      const planeGeometry = new Three.PlaneGeometry(60, 40, 1, 1);
      const planeMaterial = new Three.MeshLambertMaterial({ color: 0xffffff });
      const plane = new Three.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;

      // rotate and position the plane
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;

      // add the plane to the scene
      scene.add(plane);

      // position and point the camera to the center of the scene
      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 30;
      camera.lookAt(scene.position);

      // add subtle ambient lighting
      const ambientLight = new Three.AmbientLight(0x0c0c0c);
      scene.add(ambientLight);

      // add spotlight for the shadows
      const spotLight = new Three.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      scene.add(spotLight);

      // add the output of the renderer to the html element
      document.getElementById('container').appendChild(renderer.domElement);

      // call the render function
      const step = 0;

      const controls = new function() {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;

        this.removeCube = function() {
          const allChildren = scene.children;
          const lastObject = allChildren[allChildren.length - 1];
          if (lastObject instanceof Three.Mesh) {
            scene.remove(lastObject);
            this.numberOfObjects = scene.children.length;
          }
        };

        this.addCube = function() {

          const cubeSize = Math.ceil((Math.random() * 3));
          const cubeGeometry = new Three.BoxGeometry(cubeSize, cubeSize, cubeSize);
          const cubeMaterial = new Three.MeshLambertMaterial({ color: Math.random() * 0xffffff });
          const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
          cube.castShadow = true;
          cube.name = 'cube-' + scene.children.length;


          // position the cube randomly in the scene

          cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
          cube.position.y = Math.round((Math.random() * 5));
          cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

          // add the cube to the scene
          scene.add(cube);
          this.numberOfObjects = scene.children.length;
        };

        this.outputObjects = function() {
          console.log(scene.children);
        }
      }();

      const gui = new dat.GUI();
      gui.add(controls, 'rotationSpeed', 0, 0.5);
      gui.add(controls, 'addCube');
      gui.add(controls, 'removeCube');
      gui.add(controls, 'outputObjects');
      gui.add(controls, 'numberOfObjects').listen();

      render();

      function render() {
        stats.update();

        // rotate the cubes around its axes
        scene.traverse(function(e) {
          if (e instanceof Three.Mesh && e != plane) {

            e.rotation.x += controls.rotationSpeed;
            e.rotation.y += controls.rotationSpeed;
            e.rotation.z += controls.rotationSpeed;
          }
        });

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }

      function initStats() {

        const stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('container').appendChild(stats.domElement);

        return stats;
      }
    },
    initShadowDemo() {
      const scene = new Three.Scene();
      const camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new Three.WebGL1Renderer();
      renderer.setClearColor(new Three.Color(0x000000));
      renderer.setSize(window.innerWidth, window.innerHeight);
      const axes = new Three.AxesHelper(20);
      scene.add(axes);

      const planeGeometry = new Three.PlaneGeometry(120, 40);
      const planeMaterial = new Three.MeshLambertMaterial({
        color: 0xAAAAAA
      });

      const plane = new Three.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.set(15, 0, 0);
      scene.add(plane);

      const cubeGeometry = new Three.BoxGeometry(6, 6, 6);
      const cubeMaterial = new Three.MeshLambertMaterial({
        color: 0xFF0000,
        wireframe: false
      });
      const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(-4, 3, 0);
      scene.add(cube);

      const sphereGeometry = new Three.SphereGeometry(6, 20, 20);
      const sphereMaterial = new Three.MeshLambertMaterial({
        color: 0x7777FF,
        wireframe: false
      });
      const sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(20, 4, 2);
      scene.add(sphere);

      camera.position.set(-30, 40, 30);
      camera.lookAt(scene.position);

      const spotLight = new Three.SpotLight(0xFFFFFF);
      spotLight.position.set(-40, 40, -15);
      // 启用阴影功能
      spotLight.castShadow = true;
      spotLight.shadow.mapSize = new Three.Vector2(1024, 1024);
      spotLight.shadow.camera.far = 130;
      spotLight.shadow.camera.near = 40;
      scene.add(spotLight)

      document.getElementById('container').appendChild(renderer.domElement);
      // 设置接受和投射阴影的物体
      plane.receiveShadow = true;
      cube.castShadow = true;
      sphere.castShadow = true;
      spotLight.castShadow = true;
      renderer.shadowMap.enabled = true;

      // 添加动画控制面板
      const controls = new function() {
        this.rotationSpeed = 0.02;
        this.bounceSpeed = 0.02;
      }()
      const gui = new dat.GUI();
      gui.add(controls, 'rotationSpeed', 0, 0.5);
      gui.add(controls, 'bounceSpeed', 0, 0.5);

      const state = initState();
      renderScene()

      function renderScene() {
        state.update();
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera)
      }
      function initState() {
        const stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom)
        return stats
      }
      function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      // listen to the resize events
      window.addEventListener('resize', onResize, false);
    },
    initStars() {
      const canvas = document.querySelector('#canvasElem4');
      const ctx = canvas.getContext('2d');

      let W = canvas.width = window.innerWidth;
      const H = canvas.height = 600;

      const mouse = C.getOffSet(canvas);
      let hx; let hy; const f1 = 250;
      const maxZ = 1200; // 小球z坐标最远超过1200时进行重新绘制
      let particles = []; // 粒子保存数组
      const f = 0.8

      // 动态设置画布尺寸， 以及隐藏点坐标
      window.onresize = function() {
        W = canvas.width = window.innerWidth;
        hx = W / 2;
        hy = H / 2;
        createParticles(W * H / 3200)
      }

      function createParticles(num) {
        // 窗口大小变化时，重新绘制粒子
        if (particles.length != num) {
          particles = [];
        }
        for (let i = 0; i < num; i++) {
          particles.push(new Ball({
            x3d: C.randomNum([-1.5 * W, 2 * W]),
            y3d: C.randomNum([-1.5 * W, 2 * W]),
            z3d: C.randomNum([0, maxZ]),
            r: 10,
            vz: C.randomNum([-2, 2]), // z轴上的速度
            az: C.randomNum([-2, -1]) // z轴上的加速度
          }))
        }
      }

      window.onresize();

      function move(p) {
        p.vz += p.az;
        p.vz *= f;
        p.z3d += p.vz

        // 粒子运动到视点时，重制粒子至消失点
        if (p.z3d < -f1) {
          p.z3d += maxZ;
        }

        // 三维运动缩放比
        const scale = f1 / (f1 + p.z3d);
        p.scaleX = p.scaleY = scale;

        // 粒子在画布中的真实坐标
        p.x = hx + p.x3d * scale;
        p.y = hy + p.y3d * scale;

        p.alpha = Math.min(Math.abs(scale) * 1.5, 1)

      }

      function drawStar(p) {
        p.render(ctx)
      }

      // 排序
      function zSort(a, b) {
        return b.z3d - a.z3d
      }

      (function draw() {
        window.requestAnimationFrame(draw)

        ctx.clearRect(0, 0, W, H);

        particles.forEach(move);
        particles.forEach(zSort);
        particles.forEach(drawStar);
      })()
    },
    initParticles() {
      const canvas = document.querySelector('#canvasElem3');
      const ctx = canvas.getContext('2d');

      let W = canvas.width = window.innerWidth;
      const H = canvas.height = 600;

      const mouse = C.getOffSet(canvas);

      const particles = []; const spring = 0.0001;

      function reCreate() {
        W = canvas.width = window.innerWidth;
        createParticles(W * H / 10000);
      }

      reCreate()
      window.onresize = reCreate

      function createParticles(num) {
        // 窗口大小改变后，先清空粒子数组
        if (num !== particles.length) {
          particles.length = 0;
        }
        for (let i = 0; i < num; i++) {
          particles.push(new Ball({
            x: C.randomNum([0, W]),
            y: C.randomNum([0, H]),
            fillStyle: '#fff',
            vx: C.randomNum([-2, 2]),
            vy: C.randomNum([-2, 2]),
            r: C.randomNum([3, 10])
          }))
        }
      }

      // 绘制粒子
      function draw(particle) {
        particle.render(ctx);
      }

      // 绘制粒子连线，粒子距离越远线条越细
      function drawLine(current, target, dist, minDist) {
        ctx.save();
        ctx.lineWidth = 2 * Math.max(0, (1 - dist / minDist));
        ctx.globalAlpha = Math.max(0, (1 - dist / minDist));
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.lineTo(current.x, current.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.restore();
      }

      function checkSpring(current, target) {
        // 两个粒子之间的距离
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);

        // 设置最小距离，当两个粒子之间的距离小于最小距离进行弹动，并绘制连线
        const minDist = W / 10;
        if (dist < minDist) {
          drawLine(current, target, dist, minDist);
          const ax = dx * spring;
          const ay = dy * spring;
          current.vx += ax;
          current.vy += ay;
          target.vx -= ax;
          target.vy -= ay;
        }
      }

      function move(particle, i) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 粒子之间的碰撞处理，target保存需要和当前粒子进行碰撞检测的目标粒子
        for (let j = i + 1; j < particles.length; j++) {
          const target = particles[j];
          checkSpring(particle, target)
        }

        // 边界处理，超过某侧边界后会从另外一侧出现
        if (particle.x - particle.r > W) {
          particle.x = -particle.r;
        } else if (particle.x + particle.r < 0) {
          particle.x = W + particle.r;
        }
        if (particle.y - particle.r > H) {
          particle.y = -particle.r;
        } else if (particle.y + particle.r < 0) {
          particle.y = H + particle.r;
        }
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);

        ctx.clearRect(0, 0, W, H);

        particles.forEach(move)
        particles.forEach(draw)
      })()
    },
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
    /*canvas{*/
    /*    background: rgba(0, 0, 0, 1);*/
    /*    margin: 40px 0;*/
    /*}*/
</style>
