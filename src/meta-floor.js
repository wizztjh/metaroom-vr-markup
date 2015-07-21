class MetaFloorController extends MRM.MetaBaseWallController{
  constructor(dom){
    super();
    this.dom = dom;
    this.metaObject = this.createMetaObject()

    this.metaVerse = null;
    this.setupComponent();

    this.updateMetaObject();
  }

  templateID() {
    return "#meta-floor"
  }

  updateMetaObject() {
    var mesh = this.metaObject.mesh;
    mesh.rotation.x = 90 * (Math.PI/180);
    mesh.position.set(0, 0 , 0);
    mesh.scale.set(this.roomWidth, this.roomDepth , 1);
  }
}

class MetaFloor extends HTMLElement {
  createdCallback() {
    this.controller = new MetaFloorController(this);
  }

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
    this.dispatchEvent(event);
  }
}

document.registerElement('meta-floor', MetaFloor);
