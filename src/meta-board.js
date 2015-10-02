class MetaBoardController extends MRM.MetaComponentController {
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();

    this.metaObject.mesh.position.set(0,0,0.1)
    this.setupComponent();
    this.parent = dom.parentElement.controller;

    this.updateMetaObject()
  }

  get propertiesSettings() {
    return {
      width: {type: Number, default: 1, attrName: 'width'},
      length: {type: Number, default: 1, attrName: 'length'}
    }
  }

  get tagName() {
    return "meta-board"
  }

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateChildrenDisplayInline": true,
      "propagateMetaStyle": true
    }
  }

  createMetaObject(){
    var planeLength = 1;
    var planeWidth = 1;
    var geometry = new THREE.PlaneGeometry(planeWidth, planeLength,1,1);
    var material = new THREE.MeshBasicMaterial({
      color: 0x333333,
      side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geometry, material);
    var group = new THREE.Group();
    group.add( mesh );
    return {
      mesh: mesh,
      group: group
    };
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;

    mesh.scale.x = this.properties.width
    mesh.scale.y = this.properties.length

    if(this.metaStyle.metaStyle["position"] === 'absolute'){
      var group = this.metaObject.group;
      group.position.x = - (this.parent.properties.width/2) + (this.metaStyle["left"] || 0) + (this.properties.width/2);
      group.position.y = (this.parent.properties.length/2) - (this.metaStyle["top"] || 0) - (this.properties.length/2);
      if(this.metaStyle.metaStyle['rotate-x']){
        group.rotation.x = this.metaStyle.metaStyle['rotate-x'] * (Math.PI / 180);
      }else if(this.metaStyle.metaStyle['rotate-y']){
        group.rotation.y = this.metaStyle.metaStyle['rotate-y'] * (Math.PI / 180);
      }else if(this.metaStyle.metaStyle['rotate-z']){
        group.rotation.z = this.metaStyle.metaStyle['rotate-z'] * (Math.PI / 180);
      }
    }
    group.position.z = this.parent.metaStyle['thickness']/2 || 0;
    this.updateChildrenDisplayInline();
  }

  get metaChildrenNames(){
    return ["meta-text", "meta-picture", "meta-table", "meta-video"]
  }

  get eventActionSettings(){
    return {
      "width": ["updateChildrenDisplayInline"],
      "length": ["updateChildrenDisplayInline"],
      "meta-style": ['propagateMetaStyle'],
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

}

class MetaBoard extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaBoardController(this);
    super.createdCallback();
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.group);
    }
  }

  metaChildAttributeChanged(e) {
    var targetController = e.detail.controller;
    var attrName = e.detail.attrName

    if (this.controller.isChildren(targetController.tagName) ){

      if (e.detail.actions.updateChildrenDisplayInline) {
        this.controller.updateChildrenDisplayInline()
        delete e.detail.actions.updateChildrenDisplayInline
      }
    }

  }

}

document.registerElement('meta-board', MetaBoard);
