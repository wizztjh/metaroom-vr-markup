class MetaPillarController extends MRM.MetaComponentController{
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();
    this.setupComponent();
    this.parent = dom.parentElement.controller;
    this.updateMetaObject();
  }

  get tagName() {
    return "meta-pillar"
  }

  get propertiesSettings(){
    return {
      face: { type: String, default: "front", attrName: "face" },
      width: { type: Number, default: 1, attrName: "width" },
      length: { type: Number, default: 1, attrName: "length" },
      height: { type: Number, default: 1, attrName: "height"},
      roomHeight: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      }
    };
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

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateChildrenDisplayInline": true
    }
  }

  get eventActionSettings(){
    return {
      "width": ["updateChildrenDisplayInline"],
      "length": ["updateChildrenDisplayInline"],
      "height": ["updateChildrenDisplayInline"],
      "meta-style": ['propagateMetaStyle'],
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

  get metaChildrenNames(){
    return ["meta-board", "meta-picture", "meta-text", "meta-table", "meta-item", "meta-video"]
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;
    if(this.parent && this.parent.parent){
      this.properties.height = this.parent.parent.properties.height;
    }
    if(this.metaObject.group.children.length > 0){
      switch (this.properties.face) {
        case 'left':
          this.alignChildrenByFace(90 * (Math.PI/180), 270 * (Math.PI/180), 0);
          break;
        case 'right':
          this.alignChildrenByFace(90 * (Math.PI/180), 90 * (Math.PI/180), 0);
          break;
        case 'back':
          this.alignChildrenByFace(90 * (Math.PI/180), 180 * (Math.PI/180), 0);
          break;
        default:
          this.alignChildrenByFace(90 * (Math.PI/180), 0, 0);
      }
    }
    mesh.scale.set(this.properties.width, this.properties.length, this.properties.height);
    group.position.z = this.properties.height / 2;
    this.updateChildrenDisplayInline();
  }

  updatePillarChildrenDisplayInline(){
    var width, height, length;
    switch (this.properties.face) {
      case 'left':
        width = 'y';
        height = 'z';
        length = 'x';
        break;
      case 'right':
        width = 'y';
        height = 'z';
        length = 'x';
        break;
      case 'back':
        width = 'x';
        height = 'z';
        length = 'y';
        break;
      default:
        width = 'x';
        height = 'z';
        length = 'y';
    }
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
      if(parent.properties.face === 'left'){
        child.controller.metaObject.group.position[length] = - parent.properties.width/2;
      }else if(parent.properties.face === 'right'){
        child.controller.metaObject.group.position[length] = parent.properties.width/2;
      }else if(parent.properties.face === 'back'){
        child.controller.metaObject.group.position[length] = parent.properties.length/2;
      }else{
        child.controller.metaObject.group.position[length] = - parent.properties.length/2;
      }
      if(child.controller.hasOwnProperty("metaStyle")){
        if(child.controller.metaStyle['position'] === 'absolute'){
          return;
        }
      }
      childWidth = (Number(child.controller.properties.width) !== 0 ? Number(child.controller.properties.width) :
        child.controller.computedProperties.width);
      childLength = (Number(child.controller.properties.length) !== 0 ? Number(child.controller.properties.length) :
        child.controller.computedProperties.length);
      if(currentLineWidth + Number(childWidth) <= parent.metaObject.mesh.scale[width]){
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
      if(!line){
        return;
      }
      var biggestLength = 0
      ,   baseLineY
      ,   nextComponentX = -(parent.metaObject.mesh.scale[width]/2);
      line.forEach(function(child, childIndex){
        childWidth = (Number(child.controller.properties.width) !== 0 ? Number(child.controller.properties.width) :
          child.controller.computedProperties.width);
        childLength = (Number(child.controller.properties.length) !== 0 ? Number(child.controller.properties.length) :
          child.controller.computedProperties.length);
        nextComponentX += Number(childWidth)/2;

        var group = child.controller.metaObject.group;
        group.position[width] = nextComponentX;
        nextComponentX += childWidth/2;

        if(childLength > biggestLength) {
          biggestLength = Number(childLength)
        }
      });

      biggestLengthForEachLine.push(biggestLength)
      baseLineY = parent.metaObject.mesh.scale[height]/2 - biggestLengthForEachLine.reduce((previousValue, currentValue) => {
        return previousValue += currentValue
      });

      line.forEach(function(child, childIndex){
        var group = child.controller.metaObject.group;
        childLength = (Number(child.controller.properties.length) !== 0 ? Number(child.controller.properties.length) :
          child.controller.computedProperties.length);
        group.position[height] = baseLineY + childLength/2;
      });
    });
  }

  alignChildrenByFace(rotateX, rotateY, rotateZ){
    _.forEach(this.metaObject.group.children, function(childGroup){
      if(childGroup instanceof THREE.Group){
        childGroup.rotation.x = rotateX;
        childGroup.rotation.y = rotateY;
        childGroup.rotation.z = rotateZ;
      }
    });
  }
}

class MetaPillar extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaPillarController(this);
    super.createdCallback();
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.group);
      this.controller.updateChildrenDisplayInline();
    }
  }

  metaChildAttributeChanged(e){
    var targetController = e.detail.controller;
    var attrName = e.detail.attrName

    if (this.controller.isChildren(targetController.tagName) ){
      if(targetController.isAllowedAttribute(attrName)) {
        if (e.detail.actions.updateChildrenDisplayInline) {

          this.controller.updateChildrenDisplayInline()
          delete e.detail.actions.updateChildrenDisplayInline

        }
      }
    }
  }
}

document.registerElement('meta-pillar', MetaPillar);
