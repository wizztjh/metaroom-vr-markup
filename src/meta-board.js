class MetaBoardController extends MRM.MetaBaseController {
  constructor(dom){
    super()
    this.dom = dom;
    this.metaObject = {
      mesh: this.createMesh()
    }
    this.metaObject.mesh.position.set(0,0,0.1)
    this.setupComponent();
    this.metaWall = null;

    this.width = this.dom.getAttribute('width') || 1;
    this.height = this.dom.getAttribute('height') || 1;

    this.x = this.dom.getAttribute('x') || 0;
    this.y = this.dom.getAttribute('y') || 0;

    this.updateMetaObject();
  }

  templateID() {
    return "#meta-board"
  }

  createMesh(){
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

  widthChange(width){
    this.width = width;
    this.updateMetaObject()
  }

  heightChange(height){
    this.height = height;
    this.updateMetaObject()
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    mesh.position.x = this.x
    mesh.position.y = this.y

    mesh.scale.x = this.width
    mesh.scale.y = this.height
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

  attributeChangedCallback(attrName, oldValue, newValue) {
    console.log("attrName", attrName);
    switch(attrName) {
      case 'y':
        this.controller.yChange(newValue)
        break;
      case 'x':
        this.controller.xChange(newValue)
        break;
      case 'width':
        this.controller.widthChange(newValue);
        break;
      case 'height':
        this.controller.heightChange(newValue);
        break;
    }
  }

}

document.registerElement('meta-board', MetaBoard);
