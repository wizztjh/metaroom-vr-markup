class MetaBoardController extends MRM.MetaBaseController {
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();

    this.metaObject.mesh.position.set(0,0,0.1)
    this.setupComponent();
    this.metaWall = null;

    this.updateMetaObject()
  }

  get propertiesSettings() {
    return {
      width: {type: Number, default: 1, attrName: 'width'},
      height: {type: Number, default: 1, attrName: 'height'}
    }
  }

  templateID() {
    return "#meta-board"
  }

  createMetaObject(){
    var planeHeight = 1;
    var planeWidth = 1;
    var texture = THREE.ImageUtils.loadTexture(
      'img/box.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
    var material = new THREE.MeshBasicMaterial({
      // map: texture,
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
    mesh.scale.y = this.properties.height

    this.updateChildrenDisplayInline();
  }

  get metaChildrenNames(){
    return ["meta-text", "meta-image"]
  }


}

class MetaBoard extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaBoardController(this);
    super.createdCallback();
  }

  attachedCallback() {
    var event = new CustomEvent('meta-attached', {
      'detail': {'controller': this.controller},
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  detachedCallback() {
    var event = new CustomEvent('meta-detached', {
      'detail': {'controller': this.controller},
      bubbles: true
    });
    this.controller.metaWall.dispatchEvent(event);
  }

  metaAttached(e) {
    var targetController = e.detail.controller;

    if (targetController.templateID() === '#meta-image' || targetController.templateID() === '#meta-text' ) {
      e.stopPropagation();
      targetController.parent = this;
      this.controller.metaObject.group.add(targetController.metaObject.group);
      this.controller.updateChildrenDisplayInline()
    }
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (targetController.templateID() === '#meta-image' || targetController.templateID() === '#meta-text') {
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.mesh);
    }
  }

  metaChildAttributeChanged(e) {
    var targetController = e.detail.controller;
    var attrName = e.detail.attrName

    if (targetController.templateID() === '#meta-image' || targetController.templateID() === '#meta-text') {

      if(attrName === 'width' || attrName === 'height') {
        e.stopPropagation();
        this.controller.updateChildrenDisplayInline()
      }
    }

  }

}

document.registerElement('meta-board', MetaBoard);
