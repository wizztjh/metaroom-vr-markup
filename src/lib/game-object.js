export default class GameObject{
  constructor(){
    var self = this;
    this.metaObjects = new Map();

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.domElement.id = 'hpml-webgl-canvas'

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0xffff99, 0.0075 );

    this.camera = new THREE.PerspectiveCamera(75, this.getWidth() / this.getHeight(), 0.3, 10000);
    this.camera.position.y = 5;

    this.controls = new THREE.VRControls(this.camera);

    this.effect = new THREE.VREffect(this.renderer);
    this.effect.setSize(this.getWidth(), this.getHeight());

    this.manager = new WebVRManager(this.renderer, this.effect, {hideButton: false});

    this.clock = new THREE.Clock(true)
    this.clock.start()

    function animate() {
      self.controls.update();
      // Render the scene through the manager.
      self.manager.render(self.scene, self.camera);
      requestAnimationFrame(animate);
    }

    animate();
    // Object.keys(initObjs).forEach(function(name){
    //   returnObject = initObjs[name].apply(self)
    //   self.add(name, returnObject);
    // });
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize(){
    this.camera.aspect = this.getWidth() / this.getHeight()
    this.camera.updateProjectionMatrix();
    this.effect.setSize( this.getWidth(), this.getHeight() );
  }

  getWidth() {
    return window.innerWidth;
  }

  getHeight() {
    return window.innerHeight;
  }

  add(metaObject) {
    // TODO: write spec for this
    this.scene.add(metaObject.group);
    this.metaObjects.set( metaObject.group.uuid, metaObject);
  }

  remove(metaObject) {
    this.scene.remove(metaObject.group);
    this.metaObjects.delete(metaObject.group.uuid);
  }
}
