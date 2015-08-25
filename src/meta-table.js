// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaTableController extends MRM.MetaComponentController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
    this.parent = null;
    this.metaObject = this.createMetaObject();

    this.updateMetaObject();
  }

  createMetaObject(){
    var group = new THREE.Group();
    // need to have table geometry, set all visible none

    var height = 1;
    var width = 1;
    var depth = 1;

    var geometry = new THREE.TableGeometry(width, height, depth, 0.03, 0.01, 0.01);
    var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 90 * (Math.PI/180);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    var group = new THREE.Group();
    group.add( mesh );


    return {
      group: group,
      mesh: mesh
    }
  }

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateChildrenDisplayInline": true
    }
  }

  get eventActionSettings(){
    return {
      "width": ["updateChildrenDisplayInline"],
      "length": ["updateChildrenDisplayInline"],
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
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
            child.controller.properties.tableWidth = value
          })
        }
      },
      height: {
        type: Number,
        default: 1,
        attrName: 'height',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            child.controller.properties.tableHeight = value
          })
        }
      },
      length: {
        type: Number,
        default: 1,
        attrName: 'length',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            child.controller.properties.tableLength = value
          })
        }
      },
      tsurfaceThickness: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      tbottomThickness: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      tbottomPadding: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      }
    }
  }

  get tagName() {
    return "meta-table";
  }

  get metaChildrenNames(){
    return ['meta-tsurface', 'meta-tbottom']
  }

  updateMetaObject (){
    this.metaObject.group.position.z = this.properties.height / 2;
    this.metaObject.mesh.scale.set(this.properties.width, this.properties.height, this.properties.length);
  }

  updateTableDimension(targetController){
    targetController.properties.tableWidth = this.properties.width
    targetController.properties.tableHeight = this.properties.height
    targetController.properties.tableLength = this.properties.length
  }
}

class MetaTable extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaTableController(this);
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

document.registerElement('meta-table', MetaTable);
