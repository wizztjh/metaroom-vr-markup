class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super()
    this.dom = dom;
    this.metaObject = {
      mesh: this.createMesh()
    }
    this.setupComponent();
    this.metaVerse = null;

    // NOTE: sets default
    this.align = 'front'
    this.roomWidth = 10
    this.roomHeight = 10
    this.roomDepth = 10

    this.alignChange(this.dom.getAttribute('align'));
  }

  templateID() {
    return "#meta-wall"
  }

  roomDimensionChange(width, height, depth) {
    this.roomHeight = height
    this.roomWidth = width
    this.roomDepth = depth
    this.updateMetaObject()
  }

  // roomHeightChange(height) {
  //   this.roomHeight = height
  //   this.updateMetaObject()
  // }
  //
  roomDepthChange(depth) {
    this.roomDepth = depth
    this.updateMetaObject()
  }

  roomWidthChange(width) {
    this.roomWidth = width
    this.updateMetaObject()
  }

  alignChange(align) {
    this.align = align
    this.updateMetaObject()
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    switch (this.align) {
      case 'left':
        mesh.rotation.y = 90 * (Math.PI/180);
        mesh.position.set(-(this.roomWidth/2), 0, 0);
        break;
      case 'front':
        mesh.position.set(0, 0, -(this.roomDepth/2));
        break;
      case 'back':
        mesh.position.set(0, 0, this.roomDepth/2);
        break;
      case 'ceiling':
        mesh.rotation.x = 90 * (Math.PI/180);
        mesh.position.set(0, 5, 0);
        break;
      case 'right':
        mesh.rotation.y = 90 * (Math.PI/180);
        mesh.position.set(this.roomWidth/2, 0, 0);
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
    this.controller.metaVerse.dispatchEvent(event);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch(attrName) {
      case 'align':
        this.controller.alignChange(newValue)
        break;
    }
  }
}

document.registerElement('meta-wall', MetaWall);
