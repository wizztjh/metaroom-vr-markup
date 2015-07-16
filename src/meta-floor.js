class MetaFloorController extends MRM.MetaBaseWallController{
  constructor(dom){
    super();
    this.dom = dom;
    this.metaObject = {
      mesh: this.createMesh()
    }
    this.metaVerse = null;
    this.setupComponent();
    this.update();
  }

  templateID() {
    return "#meta-floor"
  }

  update() {
    var mesh = this.metaObject.mesh;
    mesh.rotation.x = 90 * (Math.PI/180);
    mesh.position.set(0, -5, 0);
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
