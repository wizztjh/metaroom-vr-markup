class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();
    this.setupComponent();
    this.metaVerse = null;

    this.updateMetaObject();
  }

  templateID() {
    return "#meta-wall"
  }

  get propertiesSettings(){
    return {
      align: { type: String, default: "front", attrName: "align" },
      width: { type: Number, default: 1 },
      height: { type: Number, default: 1 }
    }
  }

  get metaChildrenNames(){
    return ["meta-board"]
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;
    // TODO: sets the properties.width and height of wall for refference

    switch(this.properties.align) {
      case 'left':
      case 'right':
      mesh.scale.set(this.roomDepth, this.roomHeight , 1);
      this.properties.width = this.roomDepth
      this.properties.height = this.roomHeight
      break;

      case 'ceiling':
      mesh.scale.set(this.roomWidth, this.roomDepth , 1);
      this.properties.width = this.roomWidth
      this.properties.height = this.roomDepth
      break;

      case 'front':
      case 'back':
      mesh.scale.set(this.roomWidth, this.roomHeight , 1);
      this.properties.width = this.roomWidth
      this.properties.height = this.roomHeight
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
    this.updateChildrenDisplayInline();
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
      this.controller.metaObject.group.add(targetController.metaObject.group);
      this.controller.updateChildrenDisplayInline()
    }
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (targetController.templateID() == '#meta-board') {
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.group);
    }
  }
}

document.registerElement('meta-wall', MetaWall);
