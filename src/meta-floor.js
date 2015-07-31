class MetaFloorController extends MRM.MetaBaseWallController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.metaObject = this.createMetaObject()

    this.metaVerse = null;
    this.setupComponent();

    this.updateMetaObject();
  }

  get propertiesSettings(){
    return {
      width: { type: Number, default: 1 },
      length: { type: Number, default: 1 },
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
      roomLength: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      }
    };
  }

  get tagName() {
    return "meta-floor"
  }

  get metaChildrenNames(){
    // TODO: we need to include meta-image, meta-board and meta-text
    return ["meta-table"]
  }

  updateMetaObject() {
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;
    group.rotation.x = 270 * (Math.PI/180);
    group.position.set(0, 0 , 0);
    mesh.scale.set(this.properties.roomWidth, this.properties.roomLength , 1);
  }
}

class MetaFloor extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaFloorController(this);
    super.createdCallback();
  }

  metaAttached(e) {
    var targetController = e.detail.controller;

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      targetController.parent = this;
      this.controller.metaObject.group.add(targetController.metaObject.group);
    }
  }
}

document.registerElement('meta-floor', MetaFloor);
