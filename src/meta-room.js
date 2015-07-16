// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaRoomController extends MRM.MetaBaseController{
  constructor(dom){
    super();
    this.dom = dom;
    this.setupComponent();
  }

  templateID() {
    return "#meta-room";
  }

  forEachMetaWallBase(callback) {
    [].forEach.call(this.dom.querySelectorAll("meta-wall"), callback)
  }
}

class MetaRoom extends HTMLElement {
  createdCallback() {
    this.controller = new MetaRoomController(this);
    this.addEventListener('meta-attached', function(e){
      var targetController = e.detail.controller;
      var templateID = targetController.templateID();

      if (templateID == "#meta-wall") {
        targetController.roomDimensionChange(this.getAttribute('width'), this.getAttribute('height'), this.getAttribute('depth'));
      }
    });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch(attrName) {
      case 'width':
        this.controller.forEachMetaWallBase(function(metaWallBase){
          metaWallBase.controller.roomWidthChange(newValue)
        });
        break;
    }
  }

}

document.registerElement('meta-room', MetaRoom);
