class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();
    this.setupComponent();
    this.metaVerse = null;

    this.updateMetaObject();
  }

  get tagName() {
    return "meta-wall"
  }

  get propertiesSettings(){
    return {
      align: { type: String, default: "front", attrName: "align" },
      width: { type: Number, default: 1 },
      height: { type: Number, default: 1 },
      roomWidth: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      },
      roomHeight: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      },
      roomDepth: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      }
    }
  }

  get metaChildrenNames(){
    return ["meta-board", "meta-picture", "meta-text"]
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;
    // TODO: sets the properties.width and height of wall for refference

    switch(this.properties.align) {
      case 'left':
      case 'right':
      mesh.scale.set(this.properties.roomDepth, this.properties.roomHeight , 1);
      this.properties.width = this.properties.roomDepth
      this.properties.height = this.properties.roomHeight
      break;

      case 'ceiling':
      mesh.scale.set(this.properties.roomWidth, this.properties.roomDepth , 1);
      this.properties.width = this.properties.roomWidth
      this.properties.height = this.properties.roomDepth
      break;

      case 'front':
      case 'back':
      mesh.scale.set(this.properties.roomWidth, this.properties.roomHeight , 1);
      this.properties.width = this.properties.roomWidth
      this.properties.height = this.properties.roomHeight
      break;

    }

    switch (this.properties.align) {
      case 'left':
        group.rotation.y = 90 * (Math.PI/180);
        group.position.set(-(this.properties.roomWidth/2), this.properties.roomHeight/2, 0);
        break;
      case 'front':
        group.position.set(0, (this.properties.roomHeight/2), -(this.properties.roomDepth/2));
        break;
      case 'back':
        group.position.set(0, (this.properties.roomHeight/2), this.properties.roomDepth/2);
        break;
      case 'ceiling':
        group.rotation.x = 90 * (Math.PI/180);
        group.position.set(0, (this.properties.roomHeight), 0);
        break;
      case 'right':
        group.rotation.y = 270 * (Math.PI/180);
        group.position.set(this.properties.roomWidth/2, this.properties.roomHeight/2, 0);
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

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      targetController.parent = this;
      this.controller.metaObject.group.add(targetController.metaObject.group);
      this.controller.updateChildrenDisplayInline()
    }
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.group);
    }
  }

  metaChildAttributeChanged(e){
   var targetController = e.detail.controller;
    var attrName = e.detail.attrName

    if (this.controller.isChildren(targetController.tagName) ){
      if(attrName === 'width' || attrName === 'height') {
        e.stopPropagation();
        this.controller.updateChildrenDisplayInline()
      }
    }
  }
}

document.registerElement('meta-wall', MetaWall);
