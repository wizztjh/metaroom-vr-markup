// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaTableController extends MRM.MetaBaseController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
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
    }
  }

  get tagName() {
    return "meta-table";
  }

  get metaChildrenNames(){
    return []
  }
}

class MetaTable extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaTableController(this);
  }
}

document.registerElement('meta-table', MetaTable);
