var createBaseWallBehavior = {
  created: function(){
    var planeHeight = 20;
    var planeWidth = 20;

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geometry, material);
    this.metaObject = {
      mesh: mesh
    }
  }
}

export default createBaseWallBehavior;
