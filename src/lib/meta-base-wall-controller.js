import MetaBaseController from "./meta-base-controller.js"

export default class MetaBaseWallController extends MetaBaseController {
  createMesh() {
    var planeHeight = 20;
    var planeWidth = 20;
    var texture = THREE.ImageUtils.loadTexture(
      'img/box.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(planeHeight, planeWidth);

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    return new THREE.Mesh(geometry, material);
  }
}
