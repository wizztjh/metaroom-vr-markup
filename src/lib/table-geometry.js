THREE.TableGeometry = function ( width, height, depth, tsurfaceThickness, tbottomThickness, tbottomPadding) {

  THREE.Geometry.call( this );

  this.type = 'TableGeometry';

  this.parameters = {
    width: width,
    height: height,
    depth: depth,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1,
    tbottomPadding: tbottomPadding
  };

  this.widthSegments = 1;
  this.heightSegments =  1;
  this.depthSegments = 1;
  this.tsurfaceThickness = tsurfaceThickness || 0.1;
  this.tbottomThickness = tbottomThickness || 0.1;
  this.tbottomPadding = tbottomPadding || 0.0;

  var scope = this;

  var width_half = width / 2;
  var height_half = height / 2;
  var depth_half = depth / 2;

  var tsurface_thickness_half = tsurfaceThickness / 2;


  //tbottom front
  // cube front left
  buildCube({
    width: tbottomThickness,
    height: height - tsurfaceThickness,
    depth: tbottomThickness
  }, {
    x: width/2 - tbottomThickness/2 - tbottomPadding,
    y: tsurfaceThickness/2,
    z: depth/2 - tbottomThickness/2 - tbottomPadding
  })

  // cube front middle
  buildCube({
    width: width - tbottomThickness*2 - tbottomPadding * 2,
    height: height - tsurfaceThickness,
    depth: tbottomThickness
  }, {
    x: 0,
    y: tsurfaceThickness/2,
    z: depth/2 - tbottomThickness/2 - tbottomPadding
  })

  // cube front right
  buildCube({
    width: tbottomThickness,
    height: height - tsurfaceThickness,
    depth: tbottomThickness
  }, {
    x: - (width/2 - tbottomThickness/2 - tbottomPadding),
    y: tsurfaceThickness/2,
    z: depth/2 - tbottomThickness/2 - tbottomPadding
  })

  // cube left middle
  buildCube({
    width: tbottomThickness,
    height: height - tsurfaceThickness,
    depth: depth - 2 * tbottomThickness - 2 * tbottomPadding
  }, {
    x: - (width/2 - tbottomThickness/2 - tbottomPadding),
    y: tsurfaceThickness/2,
    z: 0
  })

  // cube back right
  buildCube({
    width: tbottomThickness,
    height: height - tsurfaceThickness,
    depth: tbottomThickness
  }, {
    x: - (width/2 - tbottomThickness/2 - tbottomPadding),
    y: tsurfaceThickness/2,
    z: - (depth/2 - tbottomThickness/2 - tbottomPadding)
  })

  // cube back middle
  buildCube({
    width: width - tbottomThickness*2 - tbottomPadding * 2,
    height: height - tsurfaceThickness,
    depth: tbottomThickness
  }, {
    x: 0,
    y: tsurfaceThickness/2,
    z: - (depth/2 - tbottomThickness/2 - tbottomPadding)
  })

  // cube back left
  buildCube({
    width: tbottomThickness,
    height: height - tsurfaceThickness,
    depth: tbottomThickness
  }, {
    x: width/2 - tbottomThickness/2 - tbottomPadding,
    y: tsurfaceThickness/2,
    z: - ( depth/2 - tbottomThickness/2 - tbottomPadding )
  })

  // cube left middle
  buildCube({
    width: tbottomThickness,
    height: height - tsurfaceThickness,
    depth: depth - 2 * tbottomThickness - 2 * tbottomPadding
  }, {
    x: (width/2 - tbottomThickness/2 - tbottomPadding),
    y: tsurfaceThickness/2,
    z: 0
  })

  this.mergeVertices();

  //tsurface
  buildCube({width: width, height: tsurfaceThickness, depth: depth}, { x: 0, y: height/2 + tsurfaceThickness/2, z: 0 })

  this.computeFaceNormals();
  this.computeVertexNormals();

  function buildCube(dimension, pos) {
    var widthHalf = dimension.width/2;
    var heightHalf = dimension.height/2;
    var depthHalf = dimension.depth/2;

    // top plane
    buildPlane(
        new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y, - depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x,  heightHalf + pos.y, - depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x,  heightHalf + pos.y,   depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y,   depthHalf + pos.z)
    );

    // bottom plane
    buildPlane(
        new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y, - depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x, -heightHalf + pos.y, - depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x, -heightHalf + pos.y,   depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y,   depthHalf + pos.z)
    );

    // left plane
    buildPlane(
        new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y, -depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y, -depthHalf + pos.z)
    );

    // right plane
    buildPlane(
        new THREE.Vector3(widthHalf + pos.x, -heightHalf + pos.y, -depthHalf + pos.z)
      , new THREE.Vector3(widthHalf + pos.x, -heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3(widthHalf + pos.x,  heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3(widthHalf + pos.x,  heightHalf + pos.y, -depthHalf + pos.z)
    );

    // front plane
    buildPlane(
        new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y, -depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x, -heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x,  heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y, -depthHalf + pos.z)
    );

    // back plane
    buildPlane(
        new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y, depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x, -heightHalf + pos.y, depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x,  heightHalf + pos.y, depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y, depthHalf + pos.z)
    );
  }

  function buildPlane(verticeA, verticeB, verticeC, verticeD){
    var offset = scope.vertices.length;

    scope.vertices.push( verticeA );
    scope.vertices.push( verticeB );
    scope.vertices.push( verticeC );
    scope.vertices.push( verticeD );
    scope.faces.push( new THREE.Face3( offset +2 , offset +1, offset) )
    scope.faces.push( new THREE.Face3( offset, offset +3, offset + 2 ) )
  }


};

THREE.TableGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TableGeometry.prototype.constructor = THREE.TableGeometry;

