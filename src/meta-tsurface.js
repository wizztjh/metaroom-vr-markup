class MetaTsurfaceController extends MRM.MetaComponentController {
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();

    this.setupComponent();
    this.parent = null;

    this.updateMetaObject()
  }

  get eventActionSettings(){
    return {
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateTableDimension": true,
      "updateTSurfaceVisibility": true
    }
  }

  get metaChildrenNames(){
    return ["meta-board", "meta-text", "meta-picture", "meta-table", "meta-item"]
  }

  get propertiesSettings() {
    return {
      thickness: {
        type: Number,
        default: 0.03,
        onChange: "updateMetaObject"
      },
      tableWidth: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      tableHeight: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      },
      tableLength: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },

      width: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      },
      length: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      }
    }
  }

  get tagName() {
    return "meta-tsurface"
  }

  updateDimension() {
    this.properties.width = this.properties.tableWidth
    this.properties.length = this.properties.tableLength
  }

  createMetaObject(){

    var group = new THREE.Group();
    return {
      group: group
    };
  }

  updateMetaObject(){
    this.metaObject.group.position.z = this.properties.tableHeight / 2;
    this.updateChildrenDisplayInline();
  }

}

class MetaTsurface extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaTsurfaceController(this);
    super.createdCallback();
  }
}

document.registerElement('meta-tsurface', MetaTsurface);
