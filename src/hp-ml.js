class GameObject{
  constructor(){
    this.objects = {};

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
      console.log('trigged',e.type, e)
      e.detail.target.metaVerse = this
    },

    handleChildrenDetachment: function(e){
      console.log('trigged',e.type, e)
    },
});

Polymer({
    is: 'meta-room',

    properties: {
      metaVerse: Object
    },

    created: {
    }

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
