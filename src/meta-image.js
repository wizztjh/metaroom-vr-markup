class MetaImageController extends MRM.MetaBaseController {
  constructor(dom){
    super()
    this.dom = dom;
    this.setupComponent();
    this.parent = null;

    this.properties = {
      width: ( this.dom.getAttribute('width') || 1 ),
      height: (this.dom.getAttribute('height') || 1),
      x: (this.dom.getAttribute('x') || 0),
      y: (this.dom.getAttribute('y') || 0),
      src: (this.dom.getAttribute('src') || '')
    }

    this.metaObject = {
      mesh: this.createMesh()
    }
    this.metaObject.mesh.position.set(0,0,0.1)

    this.updateMetaObject()

    this.startObserverProperties()
  }

  get allowedAttributes() {
    return ['x', 'y', 'width', 'height']
  }

  templateID() {
    return "#meta-image"
  }

  createMesh(){
    var planeHeight = 1;
    var planeWidth = 1;
    var texture = THREE.ImageUtils.loadTexture(
      this.properties.src
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x333333,
      side: THREE.DoubleSide
    });

    return new THREE.Mesh(geometry, material);
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    mesh.position.x = this.properties.x
    mesh.position.y = this.properties.y

    mesh.scale.x = this.properties.width
    mesh.scale.y = this.properties.height
  }
}

class MetaImage extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaImageController(this);
    super.createdCallback();
  }

  // TODO: remove this cause we got this in metabase
  attachedCallback() {
    var event = new CustomEvent('meta-attached', {
      'detail': {'controller': this.controller},
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  detachedCallback() {
    var event = new CustomEvent('meta-detached', {
      'detail': {'controller': this.controller},
      bubbles: true
    });
    this.controller.parent.dispatchEvent(event);
  }

}

document.registerElement('meta-image', MetaImage);
