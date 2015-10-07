import MetaComponentController from "./meta-component-controller.js"

export default class MetaBaseWallController extends MetaComponentController {
  constructor(dom) {
    super(dom)
  }

  createMetaObject() {
    var planeHeight = 1;
    var planeWidth = 1;

    var geometry = new THREE.BoxGeometry(planeWidth, planeHeight, 1);
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

  updateWallChildrenDisplayInline() {
    // TODO: change the board to parent to make it generic
    var parent = this;
    // TODO: only select the direct child
    // TODO: refactore this mess
    var children = this.getMetaChildren()
    var lines = [];
    var currentLine = 0;
    var currentLineWidth = 0;
    var childLength, childWidth;

    [].forEach.call(children, function (child, index) {

      if (!child.controller){ return; }
      if(child.controller.hasOwnProperty("metaStyle")){
        if(child.controller.metaStyle['position'] === 'absolute'){
          return;
        }
      }
      childWidth = (Number(child.controller.properties.width) !== 0 ? Number(child.controller.properties.width) :
        child.controller.computedProperties.width);
      childLength = (Number(child.controller.properties.length) !== 0 ? Number(child.controller.properties.length) :
        child.controller.computedProperties.length);
      if(currentLineWidth + Number(childWidth) <= parent.properties.width){
      }else{
        currentLine += 1;
        currentLineWidth = 0;
      }
      currentLineWidth += Number(childWidth);
      lines[currentLine] = lines[currentLine] || []
      lines[currentLine].push(child);
    });

    var biggestLengthForEachLine = []
    lines.forEach(function(line, lineIndex){
      var biggestLength = 0
      ,   baseLineY
      ,   nextComponentX = -(Number(parent.properties.width)/2);
      line.forEach(function(child, childIndex){
        childWidth = (Number(child.controller.properties.width) !== 0 ? Number(child.controller.properties.width) :
          child.controller.computedProperties.width);
        childLength = (Number(child.controller.properties.length) !== 0 ? Number(child.controller.properties.length) :
          child.controller.computedProperties.length);
        nextComponentX += Number(childWidth)/2;

        var group = child.controller.metaObject.group;
        group.position.x = nextComponentX;
        nextComponentX += childWidth/2;

        if(childLength > biggestLength) {
          biggestLength = Number(childLength)
        }
      });

      biggestLengthForEachLine.push(biggestLength)

      baseLineY = Number(parent.properties.length)/2 - biggestLengthForEachLine.reduce((previousValue, currentValue) => {
        return previousValue += currentValue
      });

      line.forEach(function(child, childIndex){
        var group = child.controller.metaObject.group;
        childLength = (Number(child.controller.properties.length) !== 0 ? Number(child.controller.properties.length) :
          child.controller.computedProperties.length);
        group.position.y = baseLineY + childLength/2;
      });
    });
  }
}
