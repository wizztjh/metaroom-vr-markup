(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

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

exports['default'] = GameObject;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

require('./meta-verse.js');

require('./meta-room.js');

},{"./meta-room.js":3,"./meta-verse.js":4}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gameObjectJs = require('./game-object.js');

var _gameObjectJs2 = _interopRequireDefault(_gameObjectJs);

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

},{"./game-object.js":1}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gameObjectJs = require('./game-object.js');

var _gameObjectJs2 = _interopRequireDefault(_gameObjectJs);

Polymer({
  is: 'meta-verse',

  properties: {
    gameObject: Object
  },

  created: function created() {
    this.gameObject = new _gameObjectJs2['default']();
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

},{"./game-object.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGVlamlhaGVuL3dvcmtzcGFjZS9NZXRhUm9vbU1hcmt1cExhbmd1YWdlL3NyYy9nYW1lLW9iamVjdC5qcyIsIi9Vc2Vycy90ZWVqaWFoZW4vd29ya3NwYWNlL01ldGFSb29tTWFya3VwTGFuZ3VhZ2Uvc3JjL2hwLW1sLmpzIiwiL1VzZXJzL3RlZWppYWhlbi93b3Jrc3BhY2UvTWV0YVJvb21NYXJrdXBMYW5ndWFnZS9zcmMvbWV0YS1yb29tLmpzIiwiL1VzZXJzL3RlZWppYWhlbi93b3Jrc3BhY2UvTWV0YVJvb21NYXJrdXBMYW5ndWFnZS9zcmMvbWV0YS12ZXJzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBcUIsVUFBVTtBQUNsQixXQURRLFVBQVUsR0FDaEI7MEJBRE0sVUFBVTs7QUFFM0IsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM5RCxRQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFckQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLG1CQUFtQixDQUFBOztBQUVqRCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBRSxRQUFRLEVBQUUsTUFBTSxDQUFFLENBQUM7O0FBRXZELFFBQUksQ0FBQyxNQUFNLEdB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QUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRXRDLFdBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7R0FDakM7O0FBRUQsMEJBQXdCLEVBQUUsa0NBQVMsQ0FBQyxFQUFDO0FBQ25DLFFBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ2xELFdBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7R0FDakM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU9iamVjdHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5tZXRhT2JqZWN0cyA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogZmFsc2UgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcblxuICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC5pZCA9ICdocG1sLXdlYmdsLWNhbnZhcydcblxuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLnNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2dFeHAyKCAweGZmZmY5OSwgMC4wMDc1ICk7XG5cbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgdGhpcy5nZXRXaWR0aCgpIC8gdGhpcy5nZXRIZWlnaHQoKSwgMC4zLCAxMDAwMCk7XG5cbiAgICB0aGlzLmNvbnRyb2xzID0gbmV3IFRIUkVFLlZSQ29udHJvbHModGhpcy5jYW1lcmEpO1xuXG4gICAgdGhpcy5lZmZlY3QgPSBuZXcgVEhSRUUuVlJFZmZlY3QodGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy5lZmZlY3Quc2V0U2l6ZSh0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCkpO1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbmV3IFdlYlZSTWFuYWdlcih0aGlzLnJlbmRlcmVyLCB0aGlzLmVmZmVjdCwge2hpZGVCdXR0b246IGZhbHNlfSk7XG5cbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKHRydWUpXG4gICAgdGhpcy5jbG9jay5zdGFydCgpXG5cbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xuICAgICAgc2VsZi5jb250cm9scy51cGRhdGUoKTtcbiAgICAgIC8vIFJlbmRlciB0aGUgc2NlbmUgdGhyb3VnaCB0aGUgbWFuYWdlci5cbiAgICAgIHNlbGYubWFuYWdlci5yZW5kZXIoc2VsZi5zY2VuZSwgc2VsZi5jYW1lcmEpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIH1cbiAgICBhbmltYXRlKCk7XG4gICAgLy8gT2JqZWN0LmtleXMoaW5pdE9ianMpLmZvckVhY2goZnVuY3Rpb24obmFtZSl7XG4gICAgLy8gICByZXR1cm5PYmplY3QgPSBpbml0T2Jqc1tuYW1lXS5hcHBseShzZWxmKVxuICAgIC8vICAgc2VsZi5hZGQobmFtZSwgcmV0dXJuT2JqZWN0KTtcbiAgICAvLyB9KTtcbiAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRXaWR0aCgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG4gIH1cblxuICBnZXRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgfVxuXG4gIGFkZChtZXRhT2JqZWN0KSB7XG4gICAgdGhpcy5zY2VuZS5hZGQobWV0YU9iamVjdC5tZXNoKTtcbiAgICB0aGlzLm1ldGFPYmplY3RzLnNldCggbWV0YU9iamVjdC5tZXNoLnV1aWQsIG1ldGFPYmplY3QpO1xuICB9XG5cbiAgcmVtb3ZlKG1ldGFPYmplY3QpIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZShtZXRhT2JqZWN0Lm1lc2gpO1xuICAgIHRoaXMubWV0YU9iamVjdHMuZGVsZXRlKG1ldGFPYmplY3QubWVzaC51dWlkKVxuICB9XG59XG4iLCJpbXBvcnQgJy4vbWV0YS12ZXJzZS5qcydcbmltcG9ydCAnLi9tZXRhLXJvb20uanMnXG4iLCJpbXBvcnQgR2FtZU9iamVjdCBmcm9tICcuL2dhbWUtb2JqZWN0LmpzJ1xuXG5Qb2x5bWVyKHtcbiAgICBpczogJ21ldGEtcm9vbScsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBtZXRhVmVyc2U6IE9iamVjdCxcbiAgICAgIG1ldGFPYmplY3Q6IE9iamVjdFxuICAgIH0sXG5cbiAgICBjcmVhdGVkOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGJveFdpZHRoID0gMTA7XG4gICAgICB2YXIgdGV4dHVyZSA9IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoXG4gICAgICAgICdpbWcvYm94LnBuZydcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICB0ZXh0dXJlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoYm94V2lkdGgsIGJveFdpZHRoKTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShib3hXaWR0aCwgYm94V2lkdGgsIGJveFdpZHRoKTtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgIG1hcDogdGV4dHVyZSxcbiAgICAgICAgY29sb3I6IDB4MzMzMzMzLFxuICAgICAgICBzaWRlOiBUSFJFRS5CYWNrU2lkZVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgdGhpcy5tZXRhT2JqZWN0ID0ge1xuICAgICAgICBtZXNoOiBtZXNoXG4gICAgICB9XG4gICAgfSxcblxuICAgIGF0dGFjaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZmlyZSgnbWV0YS1hdHRhY2hlZCcsIHtcbiAgICAgICAgdGFyZ2V0OiB0aGlzXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgZGV0YWNoZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5tZXRhVmVyc2UuZmlyZSgnbWV0YS1kZXRhY2hlZCcsIHtcbiAgICAgICAgdGFyZ2V0OiB0aGlzXG4gICAgICB9KTtcbiAgICB9XG59KTtcbiIsImltcG9ydCBHYW1lT2JqZWN0IGZyb20gJy4vZ2FtZS1vYmplY3QuanMnXG5cblBvbHltZXIoe1xuICAgIGlzOiAnbWV0YS12ZXJzZScsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBnYW1lT2JqZWN0OiBPYmplY3RcbiAgICB9LFxuXG4gICAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmdhbWVPYmplY3QgPSBuZXcgR2FtZU9iamVjdCgpO1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZCggdGhpcy5nYW1lT2JqZWN0LnJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcbiAgICB9LFxuXG4gICAgbGlzdGVuZXJzOiB7XG4gICAgICAnbWV0YS1hdHRhY2hlZCc6ICdoYW5kbGVDaGlsZHJlbkF0dGFjaG1lbnQnLFxuICAgICAgJ21ldGEtZGV0YWNoZWQnOiAnaGFuZGxlQ2hpbGRyZW5EZXRhY2htZW50JyxcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2hpbGRyZW5BdHRhY2htZW50OiBmdW5jdGlvbihlKXtcbiAgICAgIHZhciB0YXJnZXQgPSBlLmRldGFpbC50YXJnZXRcblxuICAgICAgdGFyZ2V0Lm1ldGFWZXJzZSA9IHRoaXNcbiAgICAgIC8vVE9ETzogbmVlZCB0byBmaW5kIGEgYmV0dGVyIHdheSB0byBzdG9yZSB0aGUgb2JqZWN0cywgaXQgc2hvdWxkIGJlIHRyZWUgZm9ybVxuICAgICAgdGhpcy5nYW1lT2JqZWN0LmFkZCh0YXJnZXQubWV0YU9iamVjdClcblxuICAgICAgY29uc29sZS5sb2coJ3RyaWdnZWQnLGUudHlwZSwgZSlcbiAgICB9LFxuXG4gICAgaGFuZGxlQ2hpbGRyZW5EZXRhY2htZW50OiBmdW5jdGlvbihlKXtcbiAgICAgIHRoaXMuZ2FtZU9iamVjdC5yZW1vdmUoZS5kZXRhaWwudGFyZ2V0Lm1ldGFPYmplY3QpXG4gICAgICBjb25zb2xlLmxvZygndHJpZ2dlZCcsZS50eXBlLCBlKVxuICAgIH0sXG59KTtcbiJdfQ==
