class MetaFloorController extends MRM.MetaBaseWallController{
  constructor(dom){
    super();
    this.dom = dom;
    this.metaObject = {
      mesh: this.createMesh()
    }
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
    console.log('update height for meta floor', this.roomHeight)
    mesh.position.set(0, -(this.roomHeight/2), 0);
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
