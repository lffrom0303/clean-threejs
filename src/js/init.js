import * as THREE from "../../three.module.js";
import { OrbitControls } from "../../examples/jsm/controls/OrbitControls.js";
import Stats from "../../examples/jsm/libs/stats.module.js";

class Scene {
	constructor() {}
	async init(dom, params = {}) {
		this.options = {
			isStat: true,
			isAxesHelper: true,
			...params,
		};
		this.dom = dom;
		let { width, height } = this.getDomWidthAndHeight();
		//scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);
		//camera
		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		this.camera.position.set(10, 10, 10);
		this.camera.lookAt(this.scene.position);
		//renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(width, height);
		this.renderer.setPixelRatio(dom.devicePixelRatio);
		this.renderer.setAnimationLoop(this.animate.bind(this));
		dom.appendChild(this.renderer.domElement);
		//orbit controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		//stats
		if (this.options.isStat) {
			this.stat = new Stats();
			dom.appendChild(this.stat.domElement);
		}
		//axes
		if (this.options.isAxesHelper) {
			this.axesHelper = new THREE.AxesHelper(5);
			this.scene.add(this.axesHelper);
		}
		//resize
		window.addEventListener("resize", this.onWindowResize.bind(this));
	}
	animate() {
		this.controls && this.controls.update();
		this.stat && this.stat.update();
		this.renderer.render(this.scene, this.camera);
	}
	getDomWidthAndHeight() {
		return {
			width: this.dom.clientWidth || window.innerWidth,
			height: this.dom.clientHeight || window.innerHeight,
		};
	}
	onWindowResize() {
		let { width, height } = this.getDomWidthAndHeight();
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}
}
export default new Scene();
