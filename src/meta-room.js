// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaRoomController extends MRM.MetaBaseController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
  }

  get propertiesSettings() {
    return {
    }
  }

  templateID() {
    return "#meta-room";
  }

  forEachMetaWallBase(callback) {
    [].forEach.call(this.dom.querySelectorAll("meta-wall, meta-floor"), callback)
  }
}

class MetaRoom extends HTMLElement {
  createdCallback() {
    this.controller = new MetaRoomController(this);
    this.addEventListener('meta-attached', function(e){
      var targetController = e.detail.controller;
      var templateID = targetController.templateID();

      if (templateID == "#meta-wall" || templateID == '#meta-floor') {
        targetController.roomDimensionChange(this.getAttribute('width'), this.getAttribute('height'), this.getAttribute('depth'));
      }
    });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch(attrName) {
      //TODO: write unit test for this
      case 'height':
        this.controller.forEachMetaWallBase(function(metaWallBase){
          metaWallBase.controller.roomHeightChange(newValue)
        });
        break;

      case 'depth':
        this.controller.forEachMetaWallBase(function(metaWallBase){
          metaWallBase.controller.roomDepthChange(newValue)
        });
        break;

      case 'width':
        this.controller.forEachMetaWallBase(function(metaWallBase){
          metaWallBase.controller.roomWidthChange(newValue)
        });
        break;
    }
  }

}

document.registerElement('meta-room', MetaRoom);
