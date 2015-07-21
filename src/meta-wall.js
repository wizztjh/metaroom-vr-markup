class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super()
    this.dom = dom;
    this.metaObject = {
      mesh: this.createMesh()
    }
    this.setupComponent();
    this.metaVerse = null;

    this.align = 'front'

    this.alignChange(this.dom.getAttribute('align'));
  }

  templateID() {
    return "#meta-wall"
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    switch(this.align) {
      case 'left':
      case 'right':
      mesh.scale.set(this.roomDepth, this.roomHeight , 1);
      break;

      case 'ceiling':
      mesh.scale.set(this.roomWidth, this.roomDepth , 1);
      break;

      case 'front':
      case 'back':
      mesh.scale.set(this.roomWidth, this.roomHeight , 1);
      break;

    }

    switch (this.align) {
      case 'left':
        mesh.rotation.y = 90 * (Math.PI/180);
        mesh.position.set(-(this.roomWidth/2), this.roomHeight/2, 0);
        break;
      case 'front':
        mesh.position.set(0, (this.roomHeight/2), -(this.roomDepth/2));
        break;
      case 'back':
        mesh.position.set(0, (this.roomHeight/2), this.roomDepth/2);
        break;
      case 'ceiling':
        mesh.rotation.x = 90 * (Math.PI/180);
        mesh.position.set(0, (this.roomHeight), 0);
        break;
      case 'right':
        mesh.rotation.y = 90 * (Math.PI/180);
        mesh.position.set(this.roomWidth/2, this.roomHeight/2, 0);
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
