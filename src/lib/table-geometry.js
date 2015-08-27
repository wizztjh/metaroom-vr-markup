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

  var tbottomDimensionAndPositions = scope.getTbottomDimensionAndPositions( width, height, depth, tsurfaceThickness, tbottomThickness, tbottomPadding );
  var tsurfaceDimensionAndPosition = scope.getTsurfaceDimensionAndPosition( width, height, depth, tsurfaceThickness, tbottomThickness, tbottomPadding );

  tbottomDimensionAndPositions.forEach(function(dimensionAndPosition){
    buildCube(dimensionAndPosition.dimension, dimensionAndPosition.position)
  });
  this.mergeVertices();

  //tsurface
  buildCube(tsurfaceDimensionAndPosition.dimension, tsurfaceDimensionAndPosition.position)

  this.computeFaceNormals();
  this.computeVertexNormals();

  function buildCube(dimension, pos) {
    scope.getCubeVertices(dimension, pos).forEach(function(planeVertices){
      buildPlane.apply(scope, planeVertices)
    })
  }

  function buildPlane(verticeA, verticeB, verticeC, verticeD){
    var offset = scope.vertices.length;
    scope.vertices.push( verticeA );
    scope.vertices.push( verticeB );
    scope.vertices.push( verticeC );
    scope.vertices.push( verticeD );
    var face1 = new THREE.Face3( offset +2 , offset +1, offset );
    var face2 = new THREE.Face3( offset, offset +3, offset + 2 );
    face1.materialIndex = 0;
    face2.materialIndex = 0;

    scope.faces.push( face1 );
    scope.faces.push( face2 );
  }
};

THREE.TableGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TableGeometry.prototype.constructor = THREE.TableGeometry;

THREE.TableGeometry.prototype.update = function( width, height, depth, tsurfaceThickness, tbottomThickness, tbottomPadding ){
  var scope = this;
  var tbottomDimensionAndPositions = this.getTbottomDimensionAndPositions( width, height, depth, tsurfaceThickness, tbottomThickness, tbottomPadding );
  var tsurfaceDimensionAndPosition = this.getTsurfaceDimensionAndPosition( width, height, depth, tsurfaceThickness, tbottomThickness, tbottomPadding );

  var newVertices = tbottomDimensionAndPositions.reduce(function(previous, dimensionAndPosition){
    return previous.concat.apply(previous, scope.getCubeVertices(dimensionAndPosition.dimension, dimensionAndPosition.position));
  }, []);

  var mergedVertices = this.mergeAndReturnVertices(newVertices);

  mergedVertices = mergedVertices.concat.apply(mergedVertices, this.getCubeVertices(tsurfaceDimensionAndPosition.dimension, tsurfaceDimensionAndPosition.position));

  this.vertices.forEach(function(vertex, i){
    vertex.x = mergedVertices[i].x;
    vertex.y = mergedVertices[i].y;
    vertex.z = mergedVertices[i].z;
  });

  this.verticesNeedUpdate = true
}

THREE.TableGeometry.prototype.mergeAndReturnVertices = function(vertices){
  var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
  var unique = [], changes = [];

  var v, key;
  var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
  var precision = Math.pow( 10, precisionPoints );
  var i, il, face;
  var indices, j, jl;

  for ( i = 0, il = vertices.length; i < il; i ++ ) {

    v = vertices[ i ];
    key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

    if ( verticesMap[ key ] === undefined ) {

      verticesMap[ key ] = i;
      unique.push( vertices[ i ] );
      changes[ i ] = unique.length - 1;

    } else {
      //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
      changes[ i ] = changes[ verticesMap[ key ] ];

    }

  };

  var diff = vertices.length - unique.length;
  return unique;

}

THREE.TableGeometry.prototype.getCubeVertices = function(dimension, pos){
  var widthHalf = dimension.width/2;
  var heightHalf = dimension.height/2;
  var depthHalf = dimension.depth/2;

  return [
    //top plane
    [
      new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y, - depthHalf + pos.z)
    , new THREE.Vector3( widthHalf + pos.x,  heightHalf + pos.y, - depthHalf + pos.z)
    , new THREE.Vector3( widthHalf + pos.x,  heightHalf + pos.y,   depthHalf + pos.z)
    , new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y,   depthHalf + pos.z)
    ],
    //bottom plane
    [
      new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y,   depthHalf + pos.z)
    , new THREE.Vector3( widthHalf + pos.x, -heightHalf + pos.y,   depthHalf + pos.z)
    , new THREE.Vector3( widthHalf + pos.x, -heightHalf + pos.y, - depthHalf + pos.z)
    , new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y, - depthHalf + pos.z)
    ],
    //left plane
    [
      new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y, -depthHalf + pos.z)
    , new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y,  depthHalf + pos.z)
    , new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y,  depthHalf + pos.z)
    , new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y, -depthHalf + pos.z)
    ],
    // right plane
    [
        new THREE.Vector3(widthHalf + pos.x, -heightHalf + pos.y, -depthHalf + pos.z)
      , new THREE.Vector3(widthHalf + pos.x, -heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3(widthHalf + pos.x,  heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3(widthHalf + pos.x,  heightHalf + pos.y, -depthHalf + pos.z)
    ],
    // front plane
    [
        new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x,  heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x, -heightHalf + pos.y,  depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y,  depthHalf + pos.z)
    ],
    // back plane
    [
        new THREE.Vector3(-widthHalf + pos.x, -heightHalf + pos.y, -depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x, -heightHalf + pos.y, -depthHalf + pos.z)
      , new THREE.Vector3( widthHalf + pos.x,  heightHalf + pos.y, -depthHalf + pos.z)
      , new THREE.Vector3(-widthHalf + pos.x,  heightHalf + pos.y, -depthHalf + pos.z)
    ]
  ]
}

THREE.TableGeometry.prototype.getTsurfaceDimensionAndPosition = function( width, height, depth, tsurfaceThickness, tbottomThickness, tbottomPadding ){
  return {
    dimension: {
      width: width,
      height: tsurfaceThickness,
      depth: depth
    },
    position: {
      x: 0,
      y: height/2 + tsurfaceThickness/2,
      z: 0
    }
  }
}

THREE.TableGeometry.prototype.getTbottomDimensionAndPositions = function( width, height, depth, tsurfaceThickness, tbottomThickness, tbottomPadding ){
  return [
    //cube front left
    {
      dimension: {
        width: tbottomThickness,
        height: height - tsurfaceThickness,
        depth: tbottomThickness
      },
      position: {
        x: width/2 - tbottomThickness/2 - tbottomPadding,
        y: tsurfaceThickness/2,
        z: depth/2 - tbottomThickness/2 - tbottomPadding
      }
    },
    // cube front middle
    {
      dimension: {
        width: width - tbottomThickness*2 - tbottomPadding * 2,
        height: height - tsurfaceThickness,
        depth: tbottomThickness
      },
      position: {
        x: 0,
        y: tsurfaceThickness/2,
        z: depth/2 - tbottomThickness/2 - tbottomPadding
      }
    },
    // front right
    {
      dimension: {
        width: tbottomThickness,
        height: height - tsurfaceThickness,
        depth: tbottomThickness
      },
      position: {
        x: - (width/2 - tbottomThickness/2 - tbottomPadding),
        y: tsurfaceThickness/2,
        z: depth/2 - tbottomThickness/2 - tbottomPadding
      }
    },
    // right middle
    {
      dimension: {
        width: tbottomThickness,
        height: height - tsurfaceThickness,
        depth: depth - 2 * tbottomThickness - 2 * tbottomPadding
      },
      position: {
        x: - (width/2 - tbottomThickness/2 - tbottomPadding),
        y: tsurfaceThickness/2,
        z: 0
      }
    },
    // back right
    {
      dimension: {
        width: tbottomThickness,
        height: height - tsurfaceThickness,
        depth: tbottomThickness
      },
      position: {
        x: - (width/2 - tbottomThickness/2 - tbottomPadding),
        y: tsurfaceThickness/2,
        z: - (depth/2 - tbottomThickness/2 - tbottomPadding)
      }
    },
    // back middle
    {
      dimension: {
        width: width - tbottomThickness*2 - tbottomPadding * 2,
        height: height - tsurfaceThickness,
        depth: tbottomThickness
      },
      position: {
        x: 0,
        y: tsurfaceThickness/2,
        z: - (depth/2 - tbottomThickness/2 - tbottomPadding)
      }
    },
    // back left
    {
      dimension: {
        width: tbottomThickness,
        height: height - tsurfaceThickness,
        depth: tbottomThickness
      },
      position: {
        x: width/2 - tbottomThickness/2 - tbottomPadding,
        y: tsurfaceThickness/2,
        z: - ( depth/2 - tbottomThickness/2 - tbottomPadding )
      }
    },
    // left middle
    {
      dimension: {
        width: tbottomThickness,
        height: height - tsurfaceThickness,
        depth: depth - 2 * tbottomThickness - 2 * tbottomPadding
      },
      position: {
        x: (width/2 - tbottomThickness/2 - tbottomPadding),
        y: tsurfaceThickness/2,
        z: 0
      }
    }
  ]
}
