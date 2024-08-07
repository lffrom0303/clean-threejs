import * as THREE from "../../three.module.js";
import { OrbitControls } from "../../examples/jsm/controls/OrbitControls.js";
import Stats from "../../examples/jsm/libs/stats.module.js";

class Scene {
	constructor() {}
	async init(dom, params = {}) {
		this.options = {
			isStat: true,
			isAxesHelper: true,
			isClick: true,
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
		//click
		if (this.options.isClick) {
			this.addClickFn();
		}
		//resize
		window.addEventListener("resize", this.onWindowResize.bind(this));
	}
	addClickFn() {
		// 变量用于判断拖拽和点击
		this.isDragging = false;
		this.mouseDownPosition = new THREE.Vector2();

		// 监听鼠标按下事件
		window.addEventListener("mousedown", (event) => {
			this.isDragging = false; // 重置拖拽状态
			this.mouseDownPosition.set(event.clientX, event.clientY); // 记录按下时的位置
		});
		// 监听鼠标移动事件
		window.addEventListener("mousemove", (event) => {
			const moveDistance = Math.sqrt(
				Math.pow(event.clientX - this.mouseDownPosition.x, 2) +
					Math.pow(event.clientY - this.mouseDownPosition.y, 2)
			);
			if (moveDistance > 5) {
				// 如果移动距离大于阈值，认为是拖拽
				this.isDragging = true;
			}
		});
		// 监听鼠标抬起事件
		window.addEventListener("mouseup", (event) => {
			if (!this.isDragging) {
				// 只有在未拖拽的情况下才触发点击事件
				this.onMouseClick(event);
			}
		});
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
	onMouseClick(event) {
		console.log("onMouseClick");
		// 创建 Raycaster 和鼠标向量
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		// 将鼠标点击位置的屏幕坐标转换为 Three.js 坐标
		let { width, height } = this.getDomWidthAndHeight();
		mouse.x = (event.clientX / width) * 2 - 1;
		mouse.y = -(event.clientY / height) * 2 + 1;
		// 更新 Raycaster
		raycaster.setFromCamera(mouse, this.camera);
		// 计算交点
		const intersects = raycaster.intersectObjects(this.scene.children, true);
		if (intersects.length > 0) {
			// 获取第一个交点（即最接近相机的物体）
			const intersect = intersects[0];
			// 设置新的相机位置，使相机靠近点击的物体
			const newCameraPosition = intersect.point
				.clone()
				.add(new THREE.Vector3(2, 2, 2));
			this.camera.position.copy(newCameraPosition);
			// 使相机朝向点击的物体
			this.camera.lookAt(intersect.object.position);
			// 更新 OrbitControls 以反映新的相机位置
			this.controls.update();
		}
	}
}
export default new Scene();
