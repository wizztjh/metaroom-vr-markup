Polymer({
    is: 'meta-verse',

    factoryImpl: function(){
      debugger
    },

    listeners: {
      'meta-created': 'handleCreatedChildren'
    },

    handleCreatedChildren: function(e){
      console.log('trigged',e)
    },

    created: function() {
      console.log('meta-verse created');
    },

    properties: {
    },

    ready: function() {},
    attached: function() {},
    detached: function() {},
    attributeChanged: function(name, type) {}
});

Polymer({
    is: 'meta-room',

    created: function() {
      this.fire('meta-created', {
        target: this.is
      });
      console.log('room created');
    }
});
