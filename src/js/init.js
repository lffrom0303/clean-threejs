import * as THREE from '../../three.module.js';
import { OrbitControls } from '../../examples/jsm/controls/OrbitControls.js';
import Stats from '../../examples/jsm/libs/stats.module.js';

export function init(
	dom,
	params = {}
) {
	const options = {
		isStat: true,
		isAxesHelper: true,
		...params
	}
	let {width,height} = getDomWidthAndHeight(dom);
	let scene, camera, renderer, controls, stat, axesHelper;
	//scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	//camera
	camera = new THREE.PerspectiveCamera(
		75,
		width / height,
		0.1,
		1000
	);
	camera.position.set(10, 10, 10);
	camera.lookAt(scene.position);
	//renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(dom.devicePixelRatio);
	renderer.setAnimationLoop(animate);
	dom.appendChild(renderer.domElement);
	//orbit controls
	controls = new OrbitControls(camera, renderer.domElement);
	//stats
	if (options.isStat) {
		stat = new Stats();
		dom.appendChild(stat.domElement);
	}
	//axes
	if (options.isAxesHelper) {
		axesHelper = new THREE.AxesHelper(5);
		scene.add(axesHelper);
	}
	//resize
	window.addEventListener('resize', onWindowResize);
	function onWindowResize() {
		let {width,height} = getDomWidthAndHeight(dom);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}
	function animate() {
		controls && controls.update();
		stat && stat.update();
		renderer.render(scene, camera);
	}
	function getDomWidthAndHeight() {
		return {
			width: dom.clientWidth||window.innerWidth,
			height: dom.clientHeight||window.innerHeight
		}
	}
	return { scene, camera, renderer, controls, stat };
}
