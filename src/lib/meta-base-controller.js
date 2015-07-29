// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

export default class MetaBaseController{
  constructor(dom) {
    this.dom = dom;
    this.properties = {}
    this.propertiesKey.forEach((key) => {
      var settings = this.propertiesSettings[key]
      var value = settings.type(this.dom.getAttribute(settings.attrName) || settings.default)

      Object.defineProperty(this.properties, key, {
        get: function(){
          return value
        },
        set: function(inputValue){
          value = settings.type(inputValue)
        }
      })
    });
  }

  templateID(){
    throw 'Please define a template id';
  }

  setupComponent() {
    var template = document.importNode( owner.querySelector(this.templateID()).content, true)
    this.dom.appendChild(template);
  }

  get propertiesSettings() {
    return {}
  }

  get propertiesKey() {
    return Object.keys(this.propertiesSettings);
  }

  get metaChildrenNames(){
    return []
  }
  get metaChildrenQuerySelectorString(){
    return this.metaChildrenNames.join(' ,')
  }

  isAllowedAttribute(attrName) {
    return this.propertiesKey.indexOf(attrName) != -1
  }

  updateChildrenDisplayInline() {

    // TODO: change the board to parent to make it generic
    var parent = this;
    // TODO: only select the direct child
    // TODO: refactore this mess
    var children = parent.dom.querySelectorAll(this.metaChildrenQuerySelectorString);

    var lines = [];
    var currentLine = 0;
    var currentLineWidth = 0;

    [].forEach.call(children, function (child, index) {
      if (!child.controller){ return; }

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

        var group = child.controller.metaObject.group;
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


}
