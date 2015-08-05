class MetaPictureController extends MRM.MetaComponentController {
  constructor(dom){
    super(dom)
    this.setupComponent();
    this.parent = null;

    this.metaObject = this.createMetaObject()
    this.metaObject.mesh.position.set(0,0,0.2)

    this.updateMetaObject()
  }

  get propertiesSettings() {
    return {
      width: {type: Number, default: 1, attrName: 'width'},
      length: {type: Number, default: 1, attrName: 'length'},
      src: {type: String, default: '', attrName: 'src'},
    }
  }

  get tagName() {
    return "meta-picture"
  }

  get eventActionSettings(){
    return {
      "width": ["updateChildrenDisplayInline"],
      "length": ["updateChildrenDisplayInline"],
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

  createMetaObject(){
    var planeLength = 1;
    var planeWidth = 1;
    var texture = THREE.ImageUtils.loadTexture(
      this.properties.src
    );

    var geometry = new THREE.PlaneGeometry(planeWidth, planeLength,1,1);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x333333,
      side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    var group = new THREE.Group();
    group.add( mesh );

    return {
      mesh: mesh,
      group: group
    }
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;

    mesh.scale.x = this.properties.width
    mesh.scale.y = this.properties.length
  }
}

class MetaPicture extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaPictureController(this);
    super.createdCallback();
  }
}

document.registerElement('meta-picture', MetaPicture);
