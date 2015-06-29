import GameObject from './game-object.js'

Polymer({
    is: 'meta-verse',

    properties: {
      gameObject: Object
    },

    created: function() {
      this.gameObject = new GameObject();
      this.appendChild( this.gameObject.renderer.domElement );
    },

    listeners: {
      'meta-attached': 'handleChildrenAttachment',
      'meta-detached': 'handleChildrenDetachment',
    },

    handleChildrenAttachment: function(e){
      var target = e.detail.target

      target.metaVerse = this
      //TODO: need to find a better way to store the objects, it should be tree form
      this.gameObject.add(target.metaObject)

      console.log('trigged',e.type, e)
    },

    handleChildrenDetachment: function(e){
      this.gameObject.remove(e.detail.target.metaObject)
      console.log('trigged',e.type, e)
    },
});
