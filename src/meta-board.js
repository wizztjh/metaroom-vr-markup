class MetaBoardController extends MRM.MetaBaseController {
  constructor(dom){
    super()
    this.dom = dom;
    this.metaObject = this.createMetaObject();

    this.metaObject.mesh.position.set(0,0,0.1)
    this.setupComponent();
    this.metaWall = null;

    this.properties = {
      width: ( this.dom.getAttribute('width') || 1 ),
      height: (this.dom.getAttribute('height') || 1),
      x: (this.dom.getAttribute('x') || 0),
      y: (this.dom.getAttribute('y') || 0)
    }
    this.updateMetaObject()
  }

  get allowedAttributes() {
    return ['x', 'y', 'width', 'height']
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
    group.position.x = this.properties.x
    group.position.y = this.properties.y

    mesh.scale.x = this.properties.width
    mesh.scale.y = this.properties.height
  }

  updateChildrenDisplayInline() {
    // TODO: only select the direct child
    var children = this.dom.querySelectorAll("meta-text, meta-image")
    var nextComponentX = -(Number(this.properties.width)/2);
    var biggestHeight = 0;

    ([]).forEach.call(children, function (child, index) {
      if (!child.controller){
        return;
      }
      if (index === 0) {
        nextComponentX += Number(child.controller.properties.width)/2;
      }
      var mesh = child.controller.metaObject.mesh;
      mesh.position.x = nextComponentX;
      nextComponentX += Number(child.controller.properties.width);

      if(child.controller.properties.height > biggestHeight) {
        biggestHeight = child.controller.properties.height
      }
    });

    var baseLineY = Number(this.properties.height)/2 - biggestHeight;
    [].forEach.call(children, function (child, index) {
      if (!child.controller){
        return;
      }
      var mesh = child.controller.metaObject.mesh;

      mesh.position.y = baseLineY + child.controller.properties.height/2;
    })

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

    if (targetController.templateID() == '#meta-image' || targetController.templateID() == '#meta-text' ) {
      e.stopPropagation();
      targetController.parent = this;
      this.controller.metaObject.group.add(targetController.metaObject.mesh);
      this.controller.updateChildrenDisplayInline()
    }
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (targetController.templateID() == '#meta-image' || targetController.templateID() == '#meta-text') {
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.mesh);
    }
  }

}

document.registerElement('meta-board', MetaBoard);
