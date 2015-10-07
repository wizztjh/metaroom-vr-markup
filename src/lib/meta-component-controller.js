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
    if(this.tagName === 'meta-board'){
      return this.updateBoardChildrenDisplayInline();
    }else if(this.tagName === 'meta-wall'){
      return this.updateWallChildrenDisplayInline();
    }else if(this.tagName === 'meta-tsurface'){
      return this.updateTableChildrenDisplayInline();
    }else if(this.tagName === 'meta-pillar'){
      return this.updatePillarChildrenDisplayInline();
    }else if(this.tagName === 'meta-floor'){
      return this.updateWallChildrenDisplayInline();
    }else{
      return null;
    }
  }
}
