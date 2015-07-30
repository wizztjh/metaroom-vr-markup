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
    return {};
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
    mesh.rotation.x = 90 * (Math.PI/180);
    mesh.position.set(0, 0 , 0);
    mesh.scale.set(this.roomWidth, this.roomDepth , 1);
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
