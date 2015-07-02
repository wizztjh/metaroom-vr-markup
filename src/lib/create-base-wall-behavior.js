var createBaseWallBehavior = {
  created: function(){
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

    var mesh = new THREE.Mesh(geometry, material);
    this.metaObject = {
      mesh: mesh
    }
  }
}

export default createBaseWallBehavior;
