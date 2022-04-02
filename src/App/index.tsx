import React, { useRef, useEffect } from 'react';
import styles from './index.module.scss';
import {
  BoxBufferGeometry, Clock, Color, DoubleSide, Mesh, PerspectiveCamera,
  Scene, ShaderMaterial, sRGBEncoding, Texture, TextureLoader, WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import fragment from './shader/fragment.frag';
import vertex from './shader/vertex.vert';

export const App = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) { return }
    const container = ref.current;
    const { offsetWidth: width, offsetHeight: height } = container;
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(new Color('black'));
    renderer.outputEncoding = sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.append(renderer.domElement);

    const onWindowResize = () => {
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    const camera = new PerspectiveCamera(70, width / height, 0.001, 1000);
    camera.position.set(0, 0, 7);
    new OrbitControls(camera, renderer.domElement);
    const scene = new Scene();
    const geometry1 = new BoxBufferGeometry(1, 3, 1, 20, 20, 20);
    const geometry2 = new BoxBufferGeometry(3, 1, 1, 20, 20, 20);
    const geometry = BufferGeometryUtils.mergeBufferGeometries([geometry1, geometry2]);
    const texture1 = new Texture();
    new TextureLoader()
      .loadAsync('soul.jpg')
      .then(map => {
        texture1.copy(map);
        texture1.needsUpdate = true;
      })
      .catch(error => console.log(error));

    const material = new ShaderMaterial({
      uniforms: {
        texture1: { value: texture1 },
        uTime: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side: DoubleSide,
    });
    const board = new Mesh(geometry, material);

    scene.add(board);

    const clock = new Clock();

    let timer: number;
    const draw = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      timer = requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    return () => cancelAnimationFrame(timer);
  }, [ref])

  return <div
    className={styles.root}
    ref={ref}
  />
}