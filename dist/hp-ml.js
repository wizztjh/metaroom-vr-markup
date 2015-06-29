(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GameObject = (function () {
  function GameObject() {
    _classCallCheck(this, GameObject);

    var self = this;
    this.metaObjects = new Map();

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.domElement.id = 'hpml-webgl-canvas';

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xffff99, 0.0075);

    this.camera = new THREE.PerspectiveCamera(75, this.getWidth() / this.getHeight(), 0.3, 10000);

    this.controls = new THREE.VRControls(this.camera);

    this.effect = new THREE.VREffect(this.renderer);
    this.effect.setSize(this.getWidth(), this.getHeight());

    this.manager = new WebVRManager(this.renderer, this.effect, { hideButton: false });

    this.clock = new THREE.Clock(true);
    this.clock.start();

    function animate() {
      self.controls.update();
      // Render the scene through the manager.
      self.manager.render(self.scene, self.camera);
      requestAnimationFrame(animate);
    }
    animate();
    // Object.keys(initObjs).forEach(function(name){
    //   returnObject = initObjs[name].apply(self)
    //   self.add(name, returnObject);
    // });
    // window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  _createClass(GameObject, [{
    key: 'getWidth',
    value: function getWidth() {
      return window.innerWidth;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return window.innerHeight;
    }
  }, {
    key: 'add',
    value: function add(metaObject) {
      this.scene.add(metaObject.mesh);
      this.metaObjects.set(metaObject.mesh.uuid, metaObject);
    }
  }, {
    key: 'remove',
    value: function remove(metaObject) {
      this.scene.remove(metaObject.mesh);
      this.metaObjects['delete'](metaObject.mesh.uuid);
    }
  }]);

  return GameObject;
})();

Polymer({
  is: 'meta-verse',

  properties: {
    gameObject: Object
  },

  created: function created() {
    this.gameObject = new GameObject();
    this.appendChild(this.gameObject.renderer.domElement);
  },

  listeners: {
    'meta-attached': 'handleChildrenAttachment',
    'meta-detached': 'handleChildrenDetachment'
  },

  handleChildrenAttachment: function handleChildrenAttachment(e) {
    var target = e.detail.target;

    target.metaVerse = this;
    //TODO: need to find a better way to store the objects, it should be tree form
    this.gameObject.add(target.metaObject);

    console.log('trigged', e.type, e);
  },

  handleChildrenDetachment: function handleChildrenDetachment(e) {
    this.gameObject.remove(e.detail.target.metaObject);
    console.log('trigged', e.type, e);
  }
});

Polymer({
  is: 'meta-room',

  properties: {
    metaVerse: Object,
    metaObject: Object
  },

  created: function created() {
    var boxWidth = 10;
    var texture = THREE.ImageUtils.loadTexture('img/box.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxWidth, boxWidth);
    var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x333333,
      side: THREE.BackSide
    });

    var mesh = new THREE.Mesh(geometry, material);

    this.metaObject = {
      mesh: mesh
    };
  },

  attached: function attached() {
    this.fire('meta-attached', {
      target: this
    });
  },

  detached: function detached() {
    this.metaVerse.fire('meta-detached', {
      target: this
    });
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGVlamlhaGVuL3dvcmtzcGFjZS9WUmNvbGxhYi9zcmMvaHAtbWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7SUNBTSxVQUFVO0FBQ0gsV0FEUCxVQUFVLEdBQ0Q7MEJBRFQsVUFBVTs7QUFFWixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUU3QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzlELFFBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUVyRCxRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsbUJBQW1CLENBQUE7O0FBRWpELFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFFLFFBQVEsRUFBRSxNQUFNLENBQUUsQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRTlGLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FB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QUFDO0dBQ0o7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgR2FtZU9iamVjdHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5tZXRhT2JqZWN0cyA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogZmFsc2UgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcblxuICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC5pZCA9ICdocG1sLXdlYmdsLWNhbnZhcydcblxuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLnNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2dFeHAyKCAweGZmZmY5OSwgMC4wMDc1ICk7XG5cbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgdGhpcy5nZXRXaWR0aCgpIC8gdGhpcy5nZXRIZWlnaHQoKSwgMC4zLCAxMDAwMCk7XG5cbiAgICB0aGlzLmNvbnRyb2xzID0gbmV3IFRIUkVFLlZSQ29udHJvbHModGhpcy5jYW1lcmEpO1xuXG4gICAgdGhpcy5lZmZlY3QgPSBuZXcgVEhSRUUuVlJFZmZlY3QodGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy5lZmZlY3Quc2V0U2l6ZSh0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCkpO1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbmV3IFdlYlZSTWFuYWdlcih0aGlzLnJlbmRlcmVyLCB0aGlzLmVmZmVjdCwge2hpZGVCdXR0b246IGZhbHNlfSk7XG5cbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKHRydWUpXG4gICAgdGhpcy5jbG9jay5zdGFydCgpXG5cbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xuICAgICAgc2VsZi5jb250cm9scy51cGRhdGUoKTtcbiAgICAgIC8vIFJlbmRlciB0aGUgc2NlbmUgdGhyb3VnaCB0aGUgbWFuYWdlci5cbiAgICAgIHNlbGYubWFuYWdlci5yZW5kZXIoc2VsZi5zY2VuZSwgc2VsZi5jYW1lcmEpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIH1cbiAgICBhbmltYXRlKCk7XG4gICAgLy8gT2JqZWN0LmtleXMoaW5pdE9ianMpLmZvckVhY2goZnVuY3Rpb24obmFtZSl7XG4gICAgLy8gICByZXR1cm5PYmplY3QgPSBpbml0T2Jqc1tuYW1lXS5hcHBseShzZWxmKVxuICAgIC8vICAgc2VsZi5hZGQobmFtZSwgcmV0dXJuT2JqZWN0KTtcbiAgICAvLyB9KTtcbiAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRXaWR0aCgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG4gIH1cblxuICBnZXRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgfVxuXG4gIGFkZChtZXRhT2JqZWN0KSB7XG4gICAgdGhpcy5zY2VuZS5hZGQobWV0YU9iamVjdC5tZXNoKTtcbiAgICB0aGlzLm1ldGFPYmplY3RzLnNldCggbWV0YU9iamVjdC5tZXNoLnV1aWQsIG1ldGFPYmplY3QpO1xuICB9XG5cbiAgcmVtb3ZlKG1ldGFPYmplY3QpIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZShtZXRhT2JqZWN0Lm1lc2gpO1xuICAgIHRoaXMubWV0YU9iamVjdHMuZGVsZXRlKG1ldGFPYmplY3QubWVzaC51dWlkKVxuICB9XG59XG5cblBvbHltZXIoe1xuICAgIGlzOiAnbWV0YS12ZXJzZScsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBnYW1lT2JqZWN0OiBPYmplY3RcbiAgICB9LFxuXG4gICAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmdhbWVPYmplY3QgPSBuZXcgR2FtZU9iamVjdCgpO1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZCggdGhpcy5nYW1lT2JqZWN0LnJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcbiAgICB9LFxuXG4gICAgbGlzdGVuZXJzOiB7XG4gICAgICAnbWV0YS1hdHRhY2hlZCc6ICdoYW5kbGVDaGlsZHJlbkF0dGFjaG1lbnQnLFxuICAgICAgJ21ldGEtZGV0YWNoZWQnOiAnaGFuZGxlQ2hpbGRyZW5EZXRhY2htZW50JyxcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2hpbGRyZW5BdHRhY2htZW50OiBmdW5jdGlvbihlKXtcbiAgICAgIHZhciB0YXJnZXQgPSBlLmRldGFpbC50YXJnZXRcblxuICAgICAgdGFyZ2V0Lm1ldGFWZXJzZSA9IHRoaXNcbiAgICAgIC8vVE9ETzogbmVlZCB0byBmaW5kIGEgYmV0dGVyIHdheSB0byBzdG9yZSB0aGUgb2JqZWN0cywgaXQgc2hvdWxkIGJlIHRyZWUgZm9ybVxuICAgICAgdGhpcy5nYW1lT2JqZWN0LmFkZCh0YXJnZXQubWV0YU9iamVjdClcblxuICAgICAgY29uc29sZS5sb2coJ3RyaWdnZWQnLGUudHlwZSwgZSlcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2hpbGRyZW5EZXRhY2htZW50OiBmdW5jdGlvbihlKXtcbiAgICAgIHRoaXMuZ2FtZU9iamVjdC5yZW1vdmUoZS5kZXRhaWwudGFyZ2V0Lm1ldGFPYmplY3QpXG4gICAgICBjb25zb2xlLmxvZygndHJpZ2dlZCcsZS50eXBlLCBlKVxuICAgIH0sXG59KTtcblxuUG9seW1lcih7XG4gICAgaXM6ICdtZXRhLXJvb20nLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgbWV0YVZlcnNlOiBPYmplY3QsXG4gICAgICBtZXRhT2JqZWN0OiBPYmplY3RcbiAgICB9LFxuXG4gICAgY3JlYXRlZDogZnVuY3Rpb24oKXtcbiAgICAgIHZhciBib3hXaWR0aCA9IDEwO1xuICAgICAgdmFyIHRleHR1cmUgPSBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlKFxuICAgICAgICAnaW1nL2JveC5wbmcnXG4gICAgICApO1xuICAgICAgdGV4dHVyZS53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgdGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgdGV4dHVyZS5yZXBlYXQuc2V0KGJveFdpZHRoLCBib3hXaWR0aCk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoYm94V2lkdGgsIGJveFdpZHRoLCBib3hXaWR0aCk7XG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICBtYXA6IHRleHR1cmUsXG4gICAgICAgIGNvbG9yOiAweDMzMzMzMyxcbiAgICAgICAgc2lkZTogVEhSRUUuQmFja1NpZGVcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICAgIHRoaXMubWV0YU9iamVjdCA9IHtcbiAgICAgICAgbWVzaDogbWVzaFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhdHRhY2hlZDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmZpcmUoJ21ldGEtYXR0YWNoZWQnLCB7XG4gICAgICAgIHRhcmdldDogdGhpc1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRldGFjaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMubWV0YVZlcnNlLmZpcmUoJ21ldGEtZGV0YWNoZWQnLCB7XG4gICAgICAgIHRhcmdldDogdGhpc1xuICAgICAgfSk7XG4gICAgfVxufSk7XG4iXX0=
