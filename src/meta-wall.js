class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super()
    this.dom = dom;
    this.metaObject = {
      mesh: this.createMesh()
    }
    this.setupComponent();

    this.alignChange(this.dom.getAttribute('align'));
  }

  templateID() {
    return "#meta-wall"
  }

  alignChange(align) {
    var mesh = this.metaObject.mesh;
    switch (align) {
      case 'left':
        mesh.rotation.y = 90 * (Math.PI/180);
        mesh.position.set(-5, 0, 0);
        break;
      case 'front':
        mesh.position.set(0, 0, -5);
        break;
      case 'back':
        mesh.position.set(0, 0, 5);
        break;
      case 'ceiling':
        mesh.rotation.x = 90 * (Math.PI/180);
        mesh.position.set(0, 5, 0);
        break;
      case 'right':
        mesh.rotation.y = 90 * (Math.PI/180);
        mesh.position.set(5, 0, 0);
        break;
    }
  }
}

class MetaWall extends HTMLElement {
  createdCallback() {
    this.controller = new MetaWallController(this);
  }

  attachedCallback() {
    var event = new CustomEvent('meta-attached', {
      'detail': {'target': this},
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
  }
}

document.registerElement('meta-wall', MetaWall);
