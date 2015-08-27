class MetaTbottomController extends MRM.MetaComponentController {
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
      "id": ["propagateMetaStyle"],
      "align": ["updateTbottomVisibility"]
    }
  }

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateTbottomVisibility": true
    }
  }

  get propertiesSettings() {
    return {
      "table-padding-top": {
        type: Number,
        default: 0.01,
        onChange: "updateMetaObject"
      },
      "thickness": {
        type: Number,
        default: 0.03,
        onChange: "updateMetaObject"
      },
      align: {
        type: String,
        default: "front",
        attrName: "align",
        // onChange: (value) => {
        //
        // }
      }
    }
  }

  get tagName() {
    return "meta-tbottom"
  }

  createMetaObject(){
    var group = new THREE.Group();

    return {
      // mesh: mesh,
      group: group
    };
  }

  updateMetaObject(){

  }

}

class MetaTbottom extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaTbottomController(this);
  }
  // attach callback: when attach set meta-table table geometry tbottom side to be visible
}

document.registerElement('meta-tbottom', MetaTbottom);
