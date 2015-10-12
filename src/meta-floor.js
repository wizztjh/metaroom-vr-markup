class MetaFloorController extends MRM.MetaBaseWallController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.metaObject = this.createMetaObject()
    this.parent = dom.parentElement.controller;

    this.metaVerse = null;
    this.setupComponent();

    this.updateMetaObject();
  }
  get metaAttachedActions(){
    return {
      attachMetaObject: true,
      assignRoomDimension: true
    }
  }

  get propertiesSettings(){
    return {
      width: { type: Number, default: 1, attrName: 'width' },
      length: { type: Number, default: 1, attrName: 'length' },
      roomWidth: {
        type: Number,
        default: 0,
        onChange: "updateMetaObject"
      },
      roomHeight: {
        type: Number,
        default: 0,
        onChange: "updateMetaObject"
      },
      roomLength: {
        type: Number,
        default: 0,
        onChange: "updateMetaObject"
      }
    };
  }

  get tagName() {
    return "meta-floor"
  }

  get metaChildrenNames(){
    return ["meta-table", "meta-picture", "meta-text", "meta-board", "meta-item", "meta-video", "meta-pillar"]
  }

  get eventActionSettings(){
    return {
      "meta-style": ['propagateMetaStyle'],
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

  updateMetaObject() {
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;
    this.properties.width = (this.properties.roomWidth !== 0) ? this.properties.roomWidth : this.properties.width;
    this.properties.length = (this.properties.roomLength !== 0) ? this.properties.roomLength : this.properties.length;

    group.rotation.x = 270 * (Math.PI/180);
    group.position.set(0, 0 - (this.metaStyle['thickness']/2 || 0.125), 0);
    mesh.scale.set(this.properties.width, this.properties.length , 1);

    this.updateChildrenDisplayInline();
  }
}

class MetaFloor extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaFloorController(this);
    super.createdCallback();
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
      if(targetController.isAllowedAttribute(attrName)) {
        if (e.detail.actions.updateChildrenDisplayInline) {

          this.controller.updateChildrenDisplayInline()
          delete e.detail.actions.updateChildrenDisplayInline

        }
      }
    }
  }
}

document.registerElement('meta-floor', MetaFloor);
