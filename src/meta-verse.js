// Shim & native-safe ownerDocument lookup
//TODO: Move child element of meta-verse inside meta-verse-content #98917702
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaVerseController extends MRM.MetaBaseController {
  constructor(dom){
    super()
    this.dom = dom;
    this.gameObject = new MRM.GameObject(this);
    this.parent = null;
    this.metaStyle = new MRM.MetaStyle(this);
    this.metaObject = this.createMetaObject();
    this.globalMetaStyle = {}
    this.ready = false;
    this.videos = [];

    this.setupComponent();
    this.attachMetaObject(this);
  }

  get tagName(){
    return "meta-verse"
  }

  get metaChildrenNames(){
    return ["meta-style", "meta-room", "meta-floor"]
  }

  createMetaObject(){
    var mesh, group, src = "";

    if(this.metaStyle.hasOwnProperty("skybox-texture")){
      src = this.metaStyle['skybox-texture'];
    }

    var geometry = new THREE.SphereGeometry( 5000, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {
      map: THREE.ImageUtils.loadTexture( src ),
      side: THREE.BackSide
    } );
    mesh = new THREE.Mesh( geometry, material );
    group = new THREE.Group();
    group.add(mesh);
    return {
      mesh: mesh,
      group: group
    };
  }

  setupComponent() {
    var template = owner.querySelector("#meta-verse").content.cloneNode(true);

    // NOTE: Add a canvas to the template
    template.appendChild( this.gameObject.renderer.domElement );

    this.dom.appendChild(template);
  }

  // TODO: rename to update global metaStyle
  updateMetaStyle(targetController) {
    var metaStyles = targetController.metaStyle
    if(metaStyles){
      metaStyles.forEach((metaStyle) => {
        metaStyle.selectors.forEach((selector) => {
          this.globalMetaStyle[selector] = this.globalMetaStyle[selector] || {}

          metaStyle.declarations.forEach((declaration) => {
            this.globalMetaStyle[selector][declaration.property] = declaration.value
          })

        })
      });
    }
  }

  getAllMetaChildren(){
    return document.querySelectorAll("meta-style, meta-room, meta-wall, meta-floor, meta-board, meta-picture, meta-text, meta-table, meta-tsurface, meta-tbottom, meta-item, meta-video, meta-pillar");
  }

  triggerMetaReady(){
    var metaVerse = this;
    var metaChildren = this.getAllMetaChildren();
    var count = metaChildren.length;
    var event = new CustomEvent('meta-ready', {});

    function dispatchWhenAllReady(){
      count--;
      if(count <= 0){
        metaVerse.ready = true;
        metaVerse.dom.dispatchEvent(event);
      }
    }

    if (count ===0 ) {
      dispatchWhenAllReady();
    } else {
      [].forEach.call(metaChildren, function(metaTag){
        if(metaTag.controller){
          dispatchWhenAllReady();
        } else {
          metaTag.addEventListener('meta-ready', function(){
            dispatchWhenAllReady();
          })
        }
      });
    }
  }

  propagateMetaStyle(){
    if (this.ready === false) {
      return;
    }
    var globalMetaStyle = this.globalMetaStyle
    var metaChildren = this.getAllMetaChildren();

    [].forEach.call(metaChildren, function(metaTag){
      if(metaTag.controller) {
        if(metaTag.controller.metaStyle.clear){
          metaTag.controller.metaStyle.clear()
        }
      }
    });

    // NOTE: we sort and reverse because we want to prioritize id -> class -> meta tag
    Object.keys(globalMetaStyle).sort().reverse().forEach((selector) => {
      [].forEach.call( document.querySelectorAll(selector), function(metaComponent){
        var metaStyleProperties = globalMetaStyle[selector]

        Object.keys(metaStyleProperties).forEach(function(property){
          metaComponent.controller.metaStyle[property] = metaStyleProperties[property]
        });
      })
    });

    [].forEach.call(metaChildren, (metaTag)=>{
      if(metaTag.controller) {
        if(metaTag.controller.metaStyle.applyMetaStyleAttribute){
          metaTag.controller.metaStyle.applyMetaStyleAttribute();
        }
      }
    });

    [].forEach.call(metaChildren, (metaTag)=>{
      if(metaTag.controller) {
        if(metaTag.controller.metaStyle.applyMetaStyleAttribute){
          metaTag.controller.updateMetaObject();
        }
        if(metaTag.controller.tagName === 'meta-video'){
          this.videos.push(metaTag);
        }
      }
    });
    this.metaStyle.applyMetaStyleAttribute();
    this.updateMetaObject();
  }

  updateMetaObject(){
    var src;
    if(this.metaStyle.metaStyle.hasOwnProperty("skybox-texture")){
      src = this.metaStyle.metaStyle['skybox-texture'];
    }

    var texture = THREE.ImageUtils.loadTexture(src);
    this.metaObject.mesh.material.map = texture;
  }

  attachMetaObject(targetController){
    targetController.parent = this
    this.gameObject.add(targetController.metaObject);
  }

  needsUpdate(){
    _.forEach(this.videos, (video) => {
      if(video.controller){
        if( video.controller.videoElement.readyState !== video.controller.videoElement.HAVE_ENOUGH_DATA )	return;
        video.controller.metaObject.mesh.material.needsUpdate = true;
      }
    })
  }

}

class MetaVerse extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaVerseController(this);
    super.createdCallback()

    this.addEventListener('meta-ready', (e) => {
      this.controller.propagateMetaStyle();
    })
    //TODO: refactor this whole mess, we need to trigger the meta ready after we listen to meta-ready
    this.controller.triggerMetaReady()
  }

  metaAttached(e) {
    // TODO: move this to a mixin with meta component
    var targetController = e.detail.controller;
    _.forEach(e.detail.actions, (value, action) => {
      if (typeof this.controller[action] === 'function') {
        this.controller[action].call(this.controller, targetController)
        delete e.detail.actions[action]
      }
    })
  }

  metaDetached(e) {
    var controller = e.detail.controller;
    if(controller.tagName == 'meta-room') {
      this.controller.gameObject.remove(e.detail.controller.metaObject);
    }
    // TODO: do something if meta-style is removed
  }

  metaChildAttributeChanged(e) {
    var targetController = e.detail.controller;

    if (e.detail.actions.propagateMetaStyle) {
      if (targetController.tagName === 'meta-style') {
        this.controller.globalMetaStyle = {}
        this.controller.updateMetaStyle(targetController);
      }
      this.controller.propagateMetaStyle()
      delete e.detail.actions.propagateMetaStyle
    }
  }

}

document.registerElement('meta-verse', MetaVerse);
