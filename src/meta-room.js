// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaRoomController extends MRM.MetaBaseController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
    this.metaObject = this.createMetaObject();
  }

  get propertiesSettings() {
    return {
      width: {
        type: Number,
        default: 1,
        attrName: 'width',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            child.controller.properties.roomWidth = value
          })
        }
      },
      height: {
        type: Number,
        default: 1,
        attrName: 'height',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            child.controller.properties.roomHeight = value
          })
        }
      },
      depth:{
        type: Number,
        default: 1,
        attrName: 'depth',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            child.controller.properties.roomDepth = value
          })
        }
      },
    }
  }

  createMetaObject(){
    var group = new THREE.Group();

    return {
      group: group
    }
  }

  get tagName() {
    return "meta-room";
  }

  get metaChildrenNames(){
    return ["meta-wall", "meta-floor"]
  }
}

//TODO: create a unit spec for MetaRoom
class MetaRoom extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaRoomController(this);
    super.createdCallback()
  }

  metaAttached(e) {
    var targetController = e.detail.controller;

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      targetController.parent = this;
      this.controller.metaObject.group.add(targetController.metaObject.group);

      targetController.properties.roomWidth = this.controller.properties.width
      targetController.properties.roomHeight = this.controller.properties.height
      targetController.properties.roomDepth = this.controller.properties.depth
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

document.registerElement('meta-room', MetaRoom);
