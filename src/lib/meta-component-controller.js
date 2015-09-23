// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

import MetaBaseController from './meta-base-controller.js'

export default class MetaComponentController extends MetaBaseController{
  constructor(dom) {
    super()
    this.dom = dom;
    this.metaStyle = new MRM.MetaStyle(this)
    this.properties = {}
    this.childrenPositionIndexMap = [];
    // TODO: create a class for property, to use the set and get of class
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

  get metaAttachedActions(){
    return {}
  }

  attachMetaObject(targetController){
    targetController.parent = this
    this.metaObject.group.add(targetController.metaObject.group)
  }

  get tagName() {
    throw 'Please define a tag name';
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

  get eventActionSettings(){
    return {};
  }

  getMetaChildren(){
    return this.dom.querySelectorAll(this.metaChildrenQuerySelectorString);
  }

  updateChildrenDisplayInline() {
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
