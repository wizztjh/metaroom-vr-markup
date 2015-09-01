import MetaComponentController from "./meta-component-controller.js"

export default class MetaBaseWallController extends MetaComponentController {
  constructor(dom) {
    super(dom)
  }

  createMetaObject() {
    var planeHeight = 1;
    var planeWidth = 1;

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    var group = new THREE.Group();
    group.add( mesh );

    return {
      mesh: mesh,
      group: group
    };
  }
}
