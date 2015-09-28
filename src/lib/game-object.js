export default class GameObject{
  constructor(){
    var self = this;
    this.metaObjects = new Map();

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.domElement.id = 'hpml-webgl-canvas'
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0xffff99, 0.0095 );

    var hemiLightWhite = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.9 );
    this.hemiLightWhite = hemiLightWhite;
    hemiLightWhite.position.set( 0, 500, 0 );
    this.scene.add( hemiLightWhite );

    var hemiLightToned = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    this.hemiLightToned = hemiLightToned;
    hemiLightToned.color.setHSL( 0.6, 0.75, 0.07 );
    hemiLightToned.groundColor.setHSL( 0.095, 0.5, 0.07 );
    this.scene.add( hemiLightToned );
    hemiLightToned.position.set( 0, 500, 0 );
    this.scene.add( hemiLightToned );

    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
    this.dirLight = dirLight;
    dirLight.position.set( -1, 0.75, 1 );
    dirLight.position.multiplyScalar( 50);

    this.scene.add( dirLight );

    dirLight.castShadow = true;
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

    var d = 300;

    dirLight.shadowCameraLeft = -d;
    dirLight.shadowCameraRight = d;
    dirLight.shadowCameraTop = d;
    dirLight.shadowCameraBottom = -d;

    dirLight.shadowCameraFar = 3500;
    dirLight.shadowBias = -0.0001;
    dirLight.shadowDarkness = 0.05;

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
      self.camera.position.y = 5;
      self.manager.render(self.scene, self.camera);
      requestAnimationFrame(animate);
    }

    animate();
    // Object.keys(initObjs).forEach(function(name){
    //   returnObject = initObjs[name].apply(self)
    //   self.add(name, returnObject);
    // });
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }

  onKeyDown(e){
    if (e.keyCode == 87) { // Move forward incrementally with W
      this.camera.translateZ(-.5);
    }
    else if(e.keyCode == 65) { //Move left incrementally with A
      this.camera.translateX(-.5);
    }
    else if (e.keyCode == 68) { //Move right incrementally with D
      this.camera.translateX(.5);
    }
    else if (e.keyCode == 83) { //Move left incrementally with S
      this.camera.translateZ(.5);
    }
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
