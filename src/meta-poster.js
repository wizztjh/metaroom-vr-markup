class MetaPosterController extends MRM.MetaBaseController {
  constructor(dom){
    super()
    this.dom = dom;
    this.metaObject = {
      mesh: this.createMesh()
    }
    this.metaObject.mesh.position.set(0,0,0.1)
    this.setupComponent();
    this.metaWall = null;
    this.x = 0;
    this.y = 0;
  }

  templateID() {
    return "#meta-poster"
  }

  createMesh(){
    var planeHeight = 3;
    var planeWidth = 3;
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

    return new THREE.Mesh(geometry, material);
  }

  yChange(y){
    this.y = y
    this.updateMetaObject()
  }

  xChange(x){
    this.x = x
    this.updateMetaObject()
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    mesh.position.x = this.x
    mesh.position.y = this.y
  }
}

class MetaPoster extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaPosterController(this);
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

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch(attrName) {
      case 'y':
        this.controller.yChange(newValue)
        break;
      case 'x':
        this.controller.xChange(newValue)
        break;
    }
  }

}

document.registerElement('meta-poster', MetaPoster);
