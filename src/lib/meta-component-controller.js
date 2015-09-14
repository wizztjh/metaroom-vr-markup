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

  updateChildrenDisplayInline(){
    var metaComponent = this,
        children = this.getMetaChildren(),
        lineIndex = 0,
        currentLineWidth = 0,
        currentLineLength = 0,
        childrenInLine = [],
        totalLength = 0,
        eventToTriggerOnResize;

    function pushChildForChildrenDisplayInline(index, child){
      if(metaComponent.childrenPositionIndexMap[index]){
        return;
      }
      if(checkResizeComponent(index, child)){
        // TODO: maybe we can add a new propertiesSettings `bubbleUp` to enable the event bubbling when attribute changes
        var eventToTriggerOnResize = new CustomEvent('size-attributes-change', {
          'detail': {
            'controller': metaComponent,
          },
          bubbles: true
        });
        resizeComponent(child.controller.properties.width, child.controller.properties.length)
        metaComponent.updateChildrenDisplayInline();
        return eventToTriggerOnResize;
      }
      calculateChildPosition(child);
      metaComponent.childrenPositionIndexMap[index] = true;
    }
    function resizeComponent(deltaX, deltaY){
      if(deltaX + currentLineWidth > metaComponent.properties.width){
        metaComponent.properties.width = deltaX + currentLineWidth;
        return;
      }
      if(deltaY + totalLength > metaComponent.properties.length){
        metaComponent.properties.length = deltaY + totalLength;
      }
    }
    function checkResizeComponent(index, child){
      if(currentLineWidth + child.controller.properties.width > metaComponent.properties.width &&
        (metaComponent.properties.length - (totalLength + currentLineLength)) < child.controller.properties.length){
        return 1;
      }else if(totalLength + child.controller.properties.length > metaComponent.properties.length){
        return 1;
      }else{
        return 0;
      }
    }
    function calculateChildPosition(child){
      var x = 0,
          y = 0;
      if((currentLineWidth + child.controller.properties.width) > metaComponent.properties.width){
        totalLength += currentLineLength;
        currentLineWidth = 0;
        currentLineLength = 0;
        lineIndex++;
      }
      x = currentLineWidth + (child.controller.properties.width / 2) - (metaComponent.properties.width / 2)
      var group = child.controller.metaObject.group;
      group.position.x = x;
      currentLineWidth += child.controller.properties.width;
      y = ((metaComponent.properties.length / 2) - totalLength) - (child.controller.properties.length / 2) -
        (currentLineLength - child.controller.properties.length);
      if(currentLineLength < child.controller.properties.length){
        currentLineLength = child.controller.properties.length;
        y = (metaComponent.properties.length / 2) - (totalLength + (currentLineLength / 2));
        _.forEach(childrenInLine[lineIndex], (child) =>{
          var group = child.controller.metaObject.group;
          group.position.y = ((metaComponent.properties.length / 2) - totalLength) - (child.controller.properties.length / 2) -
            (currentLineLength - child.controller.properties.length);
        });
      }
      group.position.y = y;
      childrenInLine[lineIndex] = childrenInLine[lineIndex] || [];
      childrenInLine[lineIndex].push(child);
    }

    _.forEach(children, (child, index) => {
      if(!child.controller){
        return;
      }
      metaComponent.childrenPositionIndexMap[index] = false;
    })

    _.forEach(children, (child, index) =>{
      if (!child.controller){ return; }
      eventToTriggerOnResize = pushChildForChildrenDisplayInline(index, child);
    });

    return eventToTriggerOnResize;
  }
}
