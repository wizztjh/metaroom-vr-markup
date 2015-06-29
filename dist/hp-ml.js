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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGVlamlhaGVuL3dvcmtzcGFjZS9NZXRhUm9vbU1hcmt1cExhbmd1YWdlL3NyYy9ocC1tbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztJQ0FNLFVBQVU7QUFDSCxXQURQLFVBQVUsR0FDRDswQkFEVCxVQUFVOztBQUVaLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRTdCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDOUQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXJELFFBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQTs7QUFFakQsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixRQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBRSxDQUFDOztBQUV2RCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFOUYsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsRCxRQUFJLENBQUMsTUFBTSxHQUFH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QUk7S0FDYixDQUFDLENBQUM7R0FDSjtDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBHYW1lT2JqZWN0e1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLm1ldGFPYmplY3RzID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiBmYWxzZSB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXG4gICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LmlkID0gJ2hwbWwtd2ViZ2wtY2FudmFzJ1xuXG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZ0V4cDIoIDB4ZmZmZjk5LCAwLjAwNzUgKTtcblxuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB0aGlzLmdldFdpZHRoKCkgLyB0aGlzLmdldEhlaWdodCgpLCAwLjMsIDEwMDAwKTtcblxuICAgIHRoaXMuY29udHJvbHMgPSBuZXcgVEhSRUUuVlJDb250cm9scyh0aGlzLmNhbWVyYSk7XG5cbiAgICB0aGlzLmVmZmVjdCA9IG5ldyBUSFJFRS5WUkVmZmVjdCh0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLmVmZmVjdC5zZXRTaXplKHRoaXMuZ2V0V2lkdGgoKSwgdGhpcy5nZXRIZWlnaHQoKSk7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBuZXcgV2ViVlJNYW5hZ2VyKHRoaXMucmVuZGVyZXIsIHRoaXMuZWZmZWN0LCB7aGlkZUJ1dHRvbjogZmFsc2V9KTtcblxuICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2sodHJ1ZSlcbiAgICB0aGlzLmNsb2NrLnN0YXJ0KClcblxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgICBzZWxmLmNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgLy8gUmVuZGVyIHRoZSBzY2VuZSB0aHJvdWdoIHRoZSBtYW5hZ2VyLlxuICAgICAgc2VsZi5tYW5hZ2VyLnJlbmRlcihzZWxmLnNjZW5lLCBzZWxmLmNhbWVyYSk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgfVxuICAgIGFuaW1hdGUoKTtcbiAgICAvLyBPYmplY3Qua2V5cyhpbml0T2JqcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAvLyAgIHJldHVybk9iamVjdCA9IGluaXRPYmpzW25hbWVdLmFwcGx5KHNlbGYpXG4gICAgLy8gICBzZWxmLmFkZChuYW1lLCByZXR1cm5PYmplY3QpO1xuICAgIC8vIH0pO1xuICAgIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uV2luZG93UmVzaXplLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIGdldFdpZHRoKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIGdldEhlaWdodCgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICB9XG5cbiAgYWRkKG1ldGFPYmplY3QpIHtcbiAgICB0aGlzLnNjZW5lLmFkZChtZXRhT2JqZWN0Lm1lc2gpO1xuICAgIHRoaXMubWV0YU9iamVjdHMuc2V0KCBtZXRhT2JqZWN0Lm1lc2gudXVpZCwgbWV0YU9iamVjdCk7XG4gIH1cblxuICByZW1vdmUobWV0YU9iamVjdCkge1xuICAgIHRoaXMuc2NlbmUucmVtb3ZlKG1ldGFPYmplY3QubWVzaCk7XG4gICAgdGhpcy5tZXRhT2JqZWN0cy5kZWxldGUobWV0YU9iamVjdC5tZXNoLnV1aWQpXG4gIH1cbn1cblxuUG9seW1lcih7XG4gICAgaXM6ICdtZXRhLXZlcnNlJyxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGdhbWVPYmplY3Q6IE9iamVjdFxuICAgIH0sXG5cbiAgICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZ2FtZU9iamVjdCA9IG5ldyBHYW1lT2JqZWN0KCk7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKCB0aGlzLmdhbWVPYmplY3QucmVuZGVyZXIuZG9tRWxlbWVudCApO1xuICAgIH0sXG5cbiAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICdtZXRhLWF0dGFjaGVkJzogJ2hhbmRsZUNoaWxkcmVuQXR0YWNobWVudCcsXG4gICAgICAnbWV0YS1kZXRhY2hlZCc6ICdoYW5kbGVDaGlsZHJlbkRldGFjaG1lbnQnLFxuICAgIH0sXG5cbiAgICBoYW5kbGVDaGlsZHJlbkF0dGFjaG1lbnQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgdmFyIHRhcmdldCA9IGUuZGV0YWlsLnRhcmdldFxuXG4gICAgICB0YXJnZXQubWV0YVZlcnNlID0gdGhpc1xuICAgICAgLy9UT0RPOiBuZWVkIHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIHN0b3JlIHRoZSBvYmplY3RzLCBpdCBzaG91bGQgYmUgdHJlZSBmb3JtXG4gICAgICB0aGlzLmdhbWVPYmplY3QuYWRkKHRhcmdldC5tZXRhT2JqZWN0KVxuXG4gICAgICBjb25zb2xlLmxvZygndHJpZ2dlZCcsZS50eXBlLCBlKVxuICAgIH0sXG5cbiAgICBoYW5kbGVDaGlsZHJlbkRldGFjaG1lbnQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgdGhpcy5nYW1lT2JqZWN0LnJlbW92ZShlLmRldGFpbC50YXJnZXQubWV0YU9iamVjdClcbiAgICAgIGNvbnNvbGUubG9nKCd0cmlnZ2VkJyxlLnR5cGUsIGUpXG4gICAgfSxcbn0pO1xuXG5Qb2x5bWVyKHtcbiAgICBpczogJ21ldGEtcm9vbScsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBtZXRhVmVyc2U6IE9iamVjdCxcbiAgICAgIG1ldGFPYmplY3Q6IE9iamVjdFxuICAgIH0sXG5cbiAgICBjcmVhdGVkOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIGJveFdpZHRoID0gMTA7XG4gICAgICB2YXIgdGV4dHVyZSA9IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoXG4gICAgICAgICdpbWcvYm94LnBuZydcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICB0ZXh0dXJlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoYm94V2lkdGgsIGJveFdpZHRoKTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShib3hXaWR0aCwgYm94V2lkdGgsIGJveFdpZHRoKTtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgIG1hcDogdGV4dHVyZSxcbiAgICAgICAgY29sb3I6IDB4MzMzMzMzLFxuICAgICAgICBzaWRlOiBUSFJFRS5CYWNrU2lkZVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgdGhpcy5tZXRhT2JqZWN0ID0ge1xuICAgICAgICBtZXNoOiBtZXNoXG4gICAgICB9XG4gICAgfSxcblxuICAgIGF0dGFjaGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZmlyZSgnbWV0YS1hdHRhY2hlZCcsIHtcbiAgICAgICAgdGFyZ2V0OiB0aGlzXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgZGV0YWNoZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5tZXRhVmVyc2UuZmlyZSgnbWV0YS1kZXRhY2hlZCcsIHtcbiAgICAgICAgdGFyZ2V0OiB0aGlzXG4gICAgICB9KTtcbiAgICB9XG59KTtcbiJdfQ==
