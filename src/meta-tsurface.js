class MetaTsurfaceController extends MRM.MetaBaseController {
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();

    this.setupComponent();
    this.parent = null;

    this.updateMetaObject()
  }

  get propertiesSettings() {
    return {
      align: {type: String, default: "front", attrName: 'align'}
    }
  }

  get tagName() {
    return "meta-tsurface"
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
    texture.repeat.set(20, 20);

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
  }
}

class MetaTsurface extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaTsurfaceController(this);
  }
}

document.registerElement('meta-tsurface', MetaTsurface);
