// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

export default class MetaBaseController{
  constructor(dom) {
    this.dom = dom;
    this.properties = {}
    this.propertiesKey.forEach((key) => {
      var settings = this.propertiesSettings[key]
      var attrValue = this.isAllowedAttribute(key) ? this.dom.getAttribute(settings.attrName) : null
      var value = settings.type( attrValue || settings.default)

      Object.defineProperty(this.properties, key, {
        get: function(){
          return value
        },
        set: (inputValue) => {
          var oldValue = value;
          var onChangeFunction = settings.onChange;
          value = settings.type(inputValue)

          if(typeof settings.onChange === "string") {
            onChangeFunction = this[settings.onChange]
          }

          if(typeof onChangeFunction === "function") {
            if(oldValue !== value) {
              onChangeFunction.call(this, value, oldValue, key)
            }
          }

        }
      })
    });
  }

  get tagName() {
    throw 'Please define a tag name';
  }

  setupComponent() {
    var template = document.importNode( owner.querySelector("#" + this.tagName).content, true)
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
    return this.metaChildrenNames.map(function(selector){
      return `:scope > ${selector}`
    }).join(' ,')
  }

  forEachMetaChildren(callback){
    [].forEach.call(this.dom.querySelectorAll(this.metaChildrenQuerySelectorString), callback)
  }

  isChildren(tagName) {
    return this.metaChildrenNames.indexOf(tagName) != -1
  }

  isAllowedAttribute(attrName) {
    var allowedkey = this.propertiesKey.filter((key) => {
      return !!this.propertiesSettings[key].attrName;
    });
    return allowedkey.indexOf(attrName) != -1
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

        nextComponentX += Number(child.controller.properties.width)/2;

        var group = child.controller.metaObject.group;
        group.position.x = nextComponentX;
        nextComponentX += child.controller.properties.width/2;

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
