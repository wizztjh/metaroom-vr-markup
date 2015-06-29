class GameObject{
  constructor(){
    var self = this;
    this.metaObjects = new Map();

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.domElement.id = 'hpml-webgl-canvas'

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0xffff99, 0.0075 );

    this.camera = new THREE.PerspectiveCamera(75, this.getWidth() / this.getHeight(), 0.3, 10000);

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
    // window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  getWidth() {
    return window.innerWidth;
  }

  getHeight() {
    return window.innerHeight;
  }

  add(metaObject) {
    this.scene.add(metaObject.mesh);
    this.metaObjects.set( metaObject.mesh.uuid, metaObject);
  }

  remove(metaObject) {
    this.scene.remove(metaObject.mesh);
    this.metaObjects.delete(metaObject.mesh.uuid)
  }
}

Polymer({
    is: 'meta-verse',

    properties: {
      gameObject: Object
    },

    created: function() {
      this.gameObject = new GameObject();
      this.appendChild( this.gameObject.renderer.domElement );
    },

    listeners: {
      'meta-attached': 'handleChildrenAttachment',
      'meta-detached': 'handleChildrenDetachment',
    },

    handleChildrenAttachment: function(e){
      var target = e.detail.target

      target.metaVerse = this
      //TODO: need to find a better way to store the objects, it should be tree form
      this.gameObject.add(target.metaObject)

      console.log('trigged',e.type, e)
    },

    handleChildrenDetachment: function(e){
      this.gameObject.remove(e.detail.target.metaObject)
      console.log('trigged',e.type, e)
    },
});

Polymer({
    is: 'meta-room',

    properties: {
      metaVerse: Object,
      metaObject: Object
    },

    created: function(){
      var boxWidth = 10;
      var texture = THREE.ImageUtils.loadTexture(
        'img/box.png'
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(boxWidth, boxWidth);
      var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x333333,
        side: THREE.BackSide
      });

      var mesh = new THREE.Mesh(geometry, material);

      this.metaObject = {
        mesh: mesh
      }
    },

    attached: function() {
      this.fire('meta-attached', {
        target: this
      });
    },

    detached: function() {
      this.metaVerse.fire('meta-detached', {
        target: this
      });
    }
});
