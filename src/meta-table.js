// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaTableController extends MRM.MetaBaseController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
    this.parent = null;
    this.metaObject = this.createMetaObject();
  }

  createMetaObject(){
    var group = new THREE.Group();

    return {
      group: group
    }
  }

  get propertiesSettings() {
    return {
      width: {type: Number, default: 1, attrName: 'width'},
      height: {type: Number, default: 1, attrName: 'height'},
      depth: {type: Number, default: 1, attrName: 'depth'}
    }
  }

  get tagName() {
    return "meta-table";
  }

  get metaChildrenNames(){
    return ['meta-tsurface']
  }
}

class MetaTable extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaTableController(this);
    super.createdCallback()
  }

  //TODO: refactor this
  metaAttached(e) {
    var targetController = e.detail.controller;

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      targetController.parent = this;
      this.controller.metaObject.group.add(targetController.metaObject.group);

      targetController.properties.tableWidth = this.controller.properties.width
      targetController.properties.tableHeight = this.controller.properties.height
      targetController.properties.tableDepth = this.controller.properties.depth
    }
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.group);
    }
  }

}

document.registerElement('meta-table', MetaTable);
