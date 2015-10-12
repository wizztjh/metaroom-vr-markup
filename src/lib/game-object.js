export default class GameObject{
  constructor(metaVerse){
    var self = this;
    this.metaVerseController = metaVerse;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();

    this.metaObjects = new Map();

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.domElement.id = 'hpml-webgl-canvas'
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();

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

    this.dollyCam = new THREE.PerspectiveCamera();
    this.dollyCam.add(this.camera);
    this.scene.add(this.dollyCam);

    this.effect = new THREE.VREffect(this.renderer);
    this.effect.setSize(this.getWidth(), this.getHeight());

    this.manager = new WebVRManager(this.renderer, this.effect, {hideButton: false});

    this.clock = new THREE.Clock(true)
    this.clock.start()

    function animate() {
      var velocity = self.velocity;
      var time = performance.now();
      var delta = ( time - self.prevTime ) / 1000;

      self.camera.rotation.reorder("YXZ")
      var angle = self.camera.rotation.y;
      self.camera.rotation.reorder("XYZ")

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      if ( self.moveForward ) {
        velocity.z -= Math.cos(angle)*100.0 * delta;
        velocity.x -= Math.sin(angle)*100.0 * delta;
      }
      if ( self.moveBackward ) {
        velocity.z += Math.cos(angle)*100.0 * delta;
        velocity.x += Math.sin(angle)*100.0 * delta;
      }

      if ( self.moveLeft ) {
        var leftAngle = angle - 90 * (Math.PI/180)
        velocity.z += Math.cos(leftAngle)*100.0 * delta;
        velocity.x += Math.sin(leftAngle)*100.0 * delta;
      }
      if ( self.moveRight ) {
        var rightAngle = angle + 90 * (Math.PI/180)
        velocity.z += Math.cos(rightAngle)*100.0 * delta;
        velocity.x += Math.sin(rightAngle)*100.0 * delta;
      }

      // console.log(velocity.x, velocity.y, velocity.z)
      self.dollyCam.translateX( velocity.x * delta );
      self.dollyCam.translateZ( velocity.z * delta );

      self.controls.update();
      // Render the scene through the manager.
      self.camera.position.y = 5;
      self.manager.render(self.scene, self.camera);

      requestAnimationFrame(animate);
      self.prevTime = time;
      if(self.metaVerseController){
        self.metaVerseController.needsUpdate();
      }
    }

    animate();
    // Object.keys(initObjs).forEach(function(name){
    //   returnObject = initObjs[name].apply(self)
    //   self.add(name, returnObject);
    // });

    var onKeyDown = function ( event ) {

      switch ( event.keyCode ) {

        case 38: // up
          case 87: // w
          self.moveForward = true;
        break;

        case 37: // left
          case 65: // a
          self.moveLeft = true; break;

        case 40: // down
          case 83: // s
          self.moveBackward = true;
        break;

        case 39: // right
          case 68: // d
          self.moveRight = true;
        break;

      }

    };

    var onKeyUp = function ( event ) {

      switch( event.keyCode ) {

        case 38: // up
          case 87: // w
          self.moveForward = false;
        break;

        case 37: // left
          case 65: // a
          self.moveLeft = false;
        break;

        case 40: // down
          case 83: // s
          self.moveBackward = false;
        break;

        case 39: // right
          case 68: // d
          self.moveRight = false;
        break;

      }

    };

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
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
