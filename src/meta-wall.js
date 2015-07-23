class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super()
    this.dom = dom;
    this.metaObject = this.createMetaObject();
    this.setupComponent();
    this.metaVerse = null;

    this.properties = {
      align: (this.dom.getAttribute('align') || 'front')
    }
    this.updateMetaObject();
    this.startObserverProperties();
  }

  templateID() {
    return "#meta-wall"
  }

  get allowedAttributes(){
    return ['align'];
  }
  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;

    switch(this.properties.align) {
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

    switch (this.properties.align) {
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

class MetaWall extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaWallController(this);
    super.createdCallback();
  }

  metaAttached(e) {
    var targetController = e.detail.controller;

    if (targetController.templateID() == '#meta-board') {
      e.stopPropagation();
      targetController.metaWall = this;
      this.controller.metaObject.group.add(targetController.metaObject.mesh);
    }
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (targetController.templateID() == '#meta-board') {
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.mesh);
    }
  }
}

document.registerElement('meta-wall', MetaWall);
