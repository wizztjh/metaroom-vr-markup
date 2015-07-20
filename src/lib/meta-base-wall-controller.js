import MetaBaseController from "./meta-base-controller.js"

export default class MetaBaseWallController extends MetaBaseController {
  constructor() {
    super()
    this.roomWidth = 10
    this.roomHeight = 10
    this.roomDepth = 10
  }

  createMesh() {
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

    return new THREE.Mesh(geometry, material);
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
