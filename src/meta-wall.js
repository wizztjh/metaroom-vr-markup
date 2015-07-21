class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super()
    this.dom = dom;
    this.metaObject = this.createMetaObject();
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
    var group = this.metaObject.group;

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
        group.rotation.y = 90 * (Math.PI/180);
        group.position.set(-(this.roomWidth/2), this.roomHeight/2, 0);
        break;
      case 'front':
        group.position.set(0, (this.roomHeight/2), -(this.roomDepth/2));
        break;
      case 'back':
        group.position.set(0, (this.roomHeight/2), this.roomDepth/2);
        break;
      case 'ceiling':
        group.rotation.x = 90 * (Math.PI/180);
        group.position.set(0, (this.roomHeight), 0);
        break;
      case 'right':
        group.rotation.y = 90 * (Math.PI/180);
        group.position.set(this.roomWidth/2, this.roomHeight/2, 0);
        break;
    }
  }

}

class MetaWall extends HTMLElement {
  createdCallback() {
    this.controller = new MetaWallController(this);

    this.addEventListener('meta-attached', function(e){
      var targetController = e.detail.controller;

      if (targetController.templateID() == '#meta-poster') {
        e.stopPropagation();
        targetController.metaWall = this;
        this.controller.metaObject.group.add(targetController.metaObject.mesh);
      }
    }, false);

    this.addEventListener('meta-detached', function(e){
      var targetController = e.detail.controller;

      if (targetController.templateID() == '#meta-poster') {
        e.stopPropagation();
        this.controller.metaObject.group.remove(targetController.metaObject.mesh);
      }

    }, false);

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
