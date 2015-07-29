class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();
    this.setupComponent();
    this.metaVerse = null;

    this.updateMetaObject();
  }

  templateID() {
    return "#meta-wall"
  }

  get propertiesSettings(){
    return {
      align: { type: String, default: "front", attrName: "align" },
      width: { type: Number, default: 1 },
      height: { type: Number, default: 1 }
    }
  }

  updateChildrenDisplayInline() {

    var parent = this;
    // TODO: only select the direct child
    // TODO: refactore this mess
    var children = parent.dom.querySelectorAll("meta-board");

    var lines = [];
    var currentLine = 0;
    var currentLineWidth = 0;

    [].forEach.call(children, function (child, index) {
      if (!child.controller){ return; }

      // TODO: add width and height property to meta-wall to make it generic
      if(currentLineWidth + Number(child.controller.properties.width) <= parent.properties.width){
        currentLineWidth += Number(child.controller.properties.width);
      }else{
        currentLine += 1;
        currentLineWidth = 0;
      }
      lines[currentLine] = lines[currentLine] || []
      lines[currentLine].push(child);
    });

    var biggestHeightForEachLine = []
    lines.forEach(function(line, lineIndex){
      var biggestHeight = 0
      ,   baseLineY
      ,   nextComponentX = -(Number(parent.properties.width)/2);

      line.forEach(function(child, childIndex){
        if (childIndex === 0) {
          nextComponentX += Number(child.controller.properties.width)/2;
        }

        // TODO: make all the metaObject to have a group, simplify things
        var group = child.controller.metaObject.group;
        console.log("sets group x:", nextComponentX)
        group.position.x = nextComponentX;
        nextComponentX += Number(child.controller.properties.width);

        if(child.controller.properties.height > biggestHeight) {
          biggestHeight = Number(child.controller.properties.height)
        }
      });

      biggestHeightForEachLine.push(biggestHeight)

      baseLineY = Number(parent.properties.height)/2 - biggestHeightForEachLine.reduce((previousValue, currentValue) => {
        return previousValue += currentValue
      });

      line.forEach(function(child, childIndex){
        var group = child.controller.metaObject.group;
        group.position.y = baseLineY + child.controller.properties.height/2;
      });

    });

  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;
    // TODO: sets the properties.width and height of wall for refference

    switch(this.properties.align) {
      case 'left':
      case 'right':
      mesh.scale.set(this.roomDepth, this.roomHeight , 1);
      this.properties.width = this.roomDepth
      this.properties.height = this.roomHeight
      break;

      case 'ceiling':
      mesh.scale.set(this.roomWidth, this.roomDepth , 1);
      this.properties.width = this.roomWidth
      this.properties.height = this.roomDepth
      break;

      case 'front':
      case 'back':
      mesh.scale.set(this.roomWidth, this.roomHeight , 1);
      this.properties.width = this.roomWidth
      this.properties.height = this.roomHeight
      break;

    }

    switch (this.properties.align) {
      case 'left':
        group.rotation.y = 90 * (Math.PI/180);
        group.position.set(-(this.roomWidth/2), this.roomHeight/2, 0);
        break;
      case 'front':
        group.position.set(0, (this.roomHeight/2), -(this.roomDepth/2));
        break;
      case 'back':
        group.position.set(0, (this.roomHeight/2), this.roomDepth/2);
        break;
      case 'ceiling':
        group.rotation.x = 90 * (Math.PI/180);
        group.position.set(0, (this.roomHeight), 0);
        break;
      case 'right':
        group.rotation.y = 90 * (Math.PI/180);
        group.position.set(this.roomWidth/2, this.roomHeight/2, 0);
        break;
    }
    this.updateChildrenDisplayInline();
  }

}

class MetaWall extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaWallController(this);
    super.createdCallback();
  }

  metaAttached(e) {
    var targetController = e.detail.controller;

    if (targetController.templateID() == '#meta-board') {
      e.stopPropagation();
      targetController.metaWall = this;
      this.controller.metaObject.group.add(targetController.metaObject.group);
      this.controller.updateChildrenDisplayInline()
    }
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (targetController.templateID() == '#meta-board') {
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.group);
    }
  }
}

document.registerElement('meta-wall', MetaWall);
