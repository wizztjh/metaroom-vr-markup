// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaRoomController extends MRM.MetaComponentController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
    this.metaObject = this.createMetaObject();
  }

  get metaAttachedActions(){
    return {
      attachMetaObject: true
    }
  }

  get propertiesSettings() {
    return {
      width: {
        type: Number,
        default: 1,
        attrName: 'width',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            if(child.controller){
              child.controller.properties.roomWidth = value
            }
          })
        }
      },
      height: {
        type: Number,
        default: 1,
        attrName: 'height',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            if(child.controller){
              child.controller.properties.roomHeight = value
            }
          })
        }
      },
      length:{
        type: Number,
        default: 1,
        attrName: 'length',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            if(child.controller){
              child.controller.properties.roomLength = value
            }
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

  assignRoomDimension(targetController){
    targetController.properties.roomWidth = this.properties.width
    targetController.properties.roomHeight = this.properties.height
    targetController.properties.roomLength = this.properties.length
  }

  updateMetaObject(){
  }
}

//TODO: create a unit spec for MetaRoom
class MetaRoom extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaRoomController(this);
    super.createdCallback()
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
