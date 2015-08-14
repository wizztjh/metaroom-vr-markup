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
      "id": ["propagateMetaStyle"]
    }
  }

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateTableDimension": true
    }
  }

  get propertiesSettings() {
    return {
      tableWidth: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      tableHeight: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      tableLength: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
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
      },
      align: { type: String, default: "front", attrName: "align" }
    }
  }

  get tagName() {
    return "meta-tbottom"
  }

  updateDimension() {
    this.properties.width = this.properties.tableWidth
    this.properties.length = this.properties.tableHeight
  }

  createMetaObject(){
    var height = 1;
    var width = 1;
    var depth = 1;
    var texture = THREE.ImageUtils.loadTexture(
      'img/box.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);

    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
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
    switch (this.properties.align) {
      case 'front':
      case 'back':
        mesh.scale.set(this.properties.tableWidth, 0.1, this.properties.tableHeight);
        this.properties.width = this.properties.tableWidth
        this.properties.length = this.properties.tableHeight
        break;
      case 'right':
      case 'left':
        mesh.scale.set(this.properties.tableLength, 0.1, this.properties.tableHeight);
        this.properties.width = this.properties.tableLength
        this.properties.length = this.properties.tableHeight
        break;
    }

    switch (this.properties.align) {
      case 'front':
        group.position.set(0, -(this.properties.tableLength/2), this.properties.tableHeight/2);
        group.rotation.x = 0
        group.rotation.y = 0
        group.rotation.z = 0
        break;
      case 'back':
        group.position.set(0, (this.properties.tableLength/2), this.properties.tableHeight/2);
        group.rotation.x = 0
        group.rotation.y = 180 * (Math.PI/180)
        group.rotation.z = 0
        break;
      case 'left':
        group.position.set( -(this.properties.tableWidth/2), 0, this.properties.tableHeight/2);
        group.rotation.x = 0
        group.rotation.y = 0
        group.rotation.z = 270 * (Math.PI/180);
      break;
      case 'right':
        group.position.set( (this.properties.tableWidth/2), 0, this.properties.tableHeight/2);
        group.rotation.x = 0
        group.rotation.y = 0
        group.rotation.z = 90 * (Math.PI/180);
      break;
    }
  }

}

class MetaTbottom extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaTbottomController(this);
  }
}

document.registerElement('meta-tbottom', MetaTbottom);
