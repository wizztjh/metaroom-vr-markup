class MetaImageController extends MRM.MetaBaseController {
  constructor(dom){
    super(dom)
    this.setupComponent();
    this.parent = null;

    this.metaObject = this.createMetaObject()
    this.metaObject.mesh.position.set(0,0,0.2)

    this.updateMetaObject()
  }

  get propertiesSettings() {
    return {
      width: {type: Number, default: 1, attrName: 'width'},
      height: {type: Number, default: 1, attrName: 'height'},
      src: {type: String, default: '', attrName: 'src'},
    }
  }

  templateID() {
    return "#meta-image"
  }

  createMetaObject(){
    var planeHeight = 1;
    var planeWidth = 1;
    var texture = THREE.ImageUtils.loadTexture(
      this.properties.src
    );

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x333333,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    var group = new THREE.Group();
    group.add( mesh );

    return {
      mesh: mesh,
      group: group
    }
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;

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

  // TODO: detach should not be bubbling up because it only trigger to the parent
  detachedCallback() {
    var event = new CustomEvent('meta-detached', {
      'detail': {'controller': this.controller},
      bubbles: true
    });
    this.controller.parent.dispatchEvent(event);
  }

}

document.registerElement('meta-image', MetaImage);
