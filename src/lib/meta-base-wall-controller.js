import MetaBaseController from "./meta-base-controller.js"

export default class MetaBaseWallController extends MetaBaseController {
  constructor(dom) {
    super(dom)
    this.roomWidth = 10
    this.roomHeight = 10
    this.roomDepth = 10
  }

  createMetaObject() {
    var planeHeight = 1;
    var planeWidth = 1;
    var texture = THREE.ImageUtils.loadTexture(
      'img/box.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
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

  roomDimensionChange(width, height, depth) {
    this.roomHeight = height
    this.roomWidth = width
    this.roomDepth = depth
    this.updateMetaObject()
  }

  roomHeightChange(height) {
    this.roomHeight = height
    this.updateMetaObject()
  }

  roomDepthChange(depth) {
    this.roomDepth = depth
    this.updateMetaObject()
  }

  roomWidthChange(width) {
    this.roomWidth = width
    this.updateMetaObject()
  }

  alignChange(align) {
    this.align = align
    this.updateMetaObject()
  }
}
