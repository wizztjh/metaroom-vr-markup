import MetaBase from './meta-base.js'

export default class MetaComponent extends MetaBase{
  attachedCallback() {
    // this.controller.metaStyle.applyMetaStyleAttribute();
    var event = new CustomEvent('meta-ready', {});
    this.dispatchEvent(event);

    var event = new CustomEvent('meta-attached', {
      'detail': {
        'controller': this.controller,
        'actions': this.controller.metaAttachedActions
      },
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  detachedCallback() {
    var event = new CustomEvent('meta-detached', {
      'detail': {'controller': this.controller},
      bubbles: true
    });

    if(this.controller.parent) {
      this.controller.parent.dom.dispatchEvent(event);
    } else {
      console.debug('no parent for', this.controller.tagName)
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    var actionsArray = this.controller.eventActionSettings[attrName] || [];

    var actions = actionsArray.reduce(function(memo, action){
      memo[action] = true
      return memo
    }, {});

    //TODO: move this to controller
    if(this.controller.isAllowedAttribute(attrName)){
      var value = this.controller.propertiesSettings[attrName].type(newValue)
      this.controller.properties[attrName] = value
      if (this.controller.updateMetaObject){
        this.controller.updateMetaObject()
      }
    }

    // TODO: maybe we can add a new propertiesSettings `bubbleUp` to enable the event bubbling when attribute changes
    var event = new CustomEvent('meta-attribute-change', {
      'detail': {
        'attrName': attrName,
        'oldValue': oldValue,
        'newValue': newValue,
        'controller': this.controller,
        'actions': actions
      },
      bubbles: true
    });

    this.dispatchEvent(event);
  }

  metaAttached(e) {
    var targetController = e.detail.controller;
    if (this.controller.isChildren(targetController.tagName) ){
      _.forEach(e.detail.actions, (value, action) => {
        if (typeof this.controller[action] === 'function') {
          var event;
          event = this.controller[action](targetController);
          if(event){
            this.dispatchEvent(event);
          }
          delete e.detail.actions[action]
        }
      })
    }
  }

  metaChildAttributeChanged(e) {
    var targetController = e.detail.controller;
    if (this.controller.isChildren(targetController.tagName) ){
      _.forEach(e.detail.actions, (value, action) => {
        if (typeof this.controller[action] === 'function') {
          var event;
          event = this.controller[action](targetController, e.detail.oldValue, e.detail.newValue);
          if(event){
            this.dispatchEvent(event);
          }
          delete e.detail.actions[action]
        }
      });
    }
  }

  metaSizeAttributeChanged(e){
    var targetController = e.detail.controller;
    if(this.controller.isChildren(targetController.tagName)){
      this.controller.updateMetaObject();
      var event = new CustomEvent('size-attributes-change', {
        'detail': {
          'controller': this.controller,
        },
        bubbles: true
      });
      this.dispatchEvent(event);
    }
  }
}
