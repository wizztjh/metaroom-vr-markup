class MetaTextController extends MRM.MetaBaseController {
  constructor(dom){
    super(dom)
    this.setupComponent();
    this.parent = null;

    this.properties.text = this.dom.innerText || '';

    this.metaObject = this.createMetaObject();
    this.metaObject.mesh.position.set(0,0,0.2)

    this.updateMetaObject()
  }

  get propertiesSettings() {
    return {
      width: {type: Number, default: 1, attrName: 'width'},
      height: {type: Number, default: 1, attrName: 'height'}
    }
  }

  templateID() {
    return "#meta-text"
  }

  createMetaObject(){
    var planeHeight = 1;
    var planeWidth = 1;

    var canvas1 = document.createElement('canvas');
    var context1 = canvas1.getContext('2d');
    context1.fillStyle = "rgba(255, 0, 0, 0.95)";
    context1.font = "26px Arial"

    context1.fillText(this.properties.text, 0, 50);

    var texture = new THREE.Texture(canvas1);
    texture.needsUpdate = true;
    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x333333,
      side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geometry, material);
    var group = new THREE.Group();

    group.add(mesh);

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

class MetaText extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaTextController(this);
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

document.registerElement('meta-text', MetaText);
