var fireMetaEventsBehavior = {
  properties: {
    metaVerse: Object,
    metaObject: Object,
  },

  attached: function() {
    this.update()
    this.fire('meta-attached', {
      target: this
    });
  },

  detached: function() {
    this.metaVerse.fire('meta-detached', {
      target: this
    });
  }
}

export default fireMetaEventsBehavior;
