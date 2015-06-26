(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GameObject = (function () {
  function GameObject() {
    _classCallCheck(this, GameObject);

    var self = this;
    this.objects = {};

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
      this.objects[metaObject.mesh.uuid] = metaObject;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGVlamlhaGVuL3dvcmtzcGFjZS9WUmNvbGxhYi9zcmMvaHAtbWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7SUNBTSxVQUFVO0FBQ0gsV0FEUCxVQUFVLEdBQ0Q7MEJBRFQsVUFBVTs7QUFFWixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDOUQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXJELFFBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQTs7QUFFakQsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixRQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBRSxDQUFDOztBQUV2RCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFOUYsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsRCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FB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QUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7QUFDckMsV0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25FLFFBQUksUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDO0FBQ3pDLFNBQUcsRUFBRSxPQUFPO0FBQ1osV0FBSyxFQUFFLFFBQVE7QUFDZixVQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVE7S0FDckIsQ0FBQyxDQUFDOztBQUVILFFBQUksSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRTlDLFFBQUksQ0FBQyxVQUFVLEdBQUc7QUFDaEIsVUFBSSxFQUFFLElBQUk7S0FDWCxDQUFBO0dBQ0Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFXO0FBQ25CLFFBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3pCLFlBQU0sRUFBRSxJQUFJO0tBQ2IsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQsVUFBUSxFQUFFLG9CQUFXO0FBQ25CLFFBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUNuQyxZQUFNLEVBQUUsSUFBSTtLQUNiLENBQUMsQ0FBQztHQUNKO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEdhbWVPYmplY3R7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMub2JqZWN0cyA9IHt9O1xuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiBmYWxzZSB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXG4gICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LmlkID0gJ2hwbWwtd2ViZ2wtY2FudmFzJ1xuXG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZ0V4cDIoIDB4ZmZmZjk5LCAwLjAwNzUgKTtcblxuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB0aGlzLmdldFdpZHRoKCkgLyB0aGlzLmdldEhlaWdodCgpLCAwLjMsIDEwMDAwKTtcblxuICAgIHRoaXMuY29udHJvbHMgPSBuZXcgVEhSRUUuVlJDb250cm9scyh0aGlzLmNhbWVyYSk7XG5cbiAgICB0aGlzLmVmZmVjdCA9IG5ldyBUSFJFRS5WUkVmZmVjdCh0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLmVmZmVjdC5zZXRTaXplKHRoaXMuZ2V0V2lkdGgoKSwgdGhpcy5nZXRIZWlnaHQoKSk7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBuZXcgV2ViVlJNYW5hZ2VyKHRoaXMucmVuZGVyZXIsIHRoaXMuZWZmZWN0LCB7aGlkZUJ1dHRvbjogZmFsc2V9KTtcblxuICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2sodHJ1ZSlcbiAgICB0aGlzLmNsb2NrLnN0YXJ0KClcblxuICAgIGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgICBzZWxmLmNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgLy8gUmVuZGVyIHRoZSBzY2VuZSB0aHJvdWdoIHRoZSBtYW5hZ2VyLlxuICAgICAgc2VsZi5tYW5hZ2VyLnJlbmRlcihzZWxmLnNjZW5lLCBzZWxmLmNhbWVyYSk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgfVxuICAgIGFuaW1hdGUoKTtcbiAgICAvLyBPYmplY3Qua2V5cyhpbml0T2JqcykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAvLyAgIHJldHVybk9iamVjdCA9IGluaXRPYmpzW25hbWVdLmFwcGx5KHNlbGYpXG4gICAgLy8gICBzZWxmLmFkZChuYW1lLCByZXR1cm5PYmplY3QpO1xuICAgIC8vIH0pO1xuICAgIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uV2luZG93UmVzaXplLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIGdldFdpZHRoKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIGdldEhlaWdodCgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICB9XG5cbiAgYWRkKG1ldGFPYmplY3Qpe1xuICAgIHRoaXMuc2NlbmUuYWRkKG1ldGFPYmplY3QubWVzaCk7XG4gICAgdGhpcy5vYmplY3RzW21ldGFPYmplY3QubWVzaC51dWlkXSA9IG1ldGFPYmplY3Q7XG4gIH1cbn1cblxuUG9seW1lcih7XG4gICAgaXM6ICdtZXRhLXZlcnNlJyxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGdhbWVPYmplY3Q6IE9iamVjdFxuICAgIH0sXG5cbiAgICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZ2FtZU9iamVjdCA9IG5ldyBHYW1lT2JqZWN0KCk7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKCB0aGlzLmdhbWVPYmplY3QucmVuZGVyZXIuZG9tRWxlbWVudCApO1xuICAgIH0sXG5cbiAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICdtZXRhLWF0dGFjaGVkJzogJ2hhbmRsZUNoaWxkcmVuQXR0YWNobWVudCcsXG4gICAgICAnbWV0YS1kZXRhY2hlZCc6ICdoYW5kbGVDaGlsZHJlbkRldGFjaG1lbnQnLFxuICAgIH0sXG5cbiAgICBoYW5kbGVDaGlsZHJlbkF0dGFjaG1lbnQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgdmFyIHRhcmdldCA9IGUuZGV0YWlsLnRhcmdldFxuXG4gICAgICB0YXJnZXQubWV0YVZlcnNlID0gdGhpc1xuICAgICAgLy9UT0RPOiBuZWVkIHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIHN0b3JlIHRoZSBvYmplY3RzLCBpdCBzaG91bGQgYmUgdHJlZSBmb3JtXG4gICAgICB0aGlzLmdhbWVPYmplY3QuYWRkKHRhcmdldC5tZXRhT2JqZWN0KVxuXG4gICAgICBjb25zb2xlLmxvZygndHJpZ2dlZCcsZS50eXBlLCBlKVxuICAgIH0sXG5cbiAgICBoYW5kbGVDaGlsZHJlbkRldGFjaG1lbnQ6IGZ1bmN0aW9uKGUpe1xuICAgICAgY29uc29sZS5sb2coJ3RyaWdnZWQnLGUudHlwZSwgZSlcbiAgICB9LFxufSk7XG5cblBvbHltZXIoe1xuICAgIGlzOiAnbWV0YS1yb29tJyxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIG1ldGFWZXJzZTogT2JqZWN0LFxuICAgICAgbWV0YU9iamVjdDogT2JqZWN0XG4gICAgfSxcblxuICAgIGNyZWF0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgYm94V2lkdGggPSAxMDtcbiAgICAgIHZhciB0ZXh0dXJlID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShcbiAgICAgICAgJ2ltZy9ib3gucG5nJ1xuICAgICAgKTtcbiAgICAgIHRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIHRleHR1cmUucmVwZWF0LnNldChib3hXaWR0aCwgYm94V2lkdGgpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KGJveFdpZHRoLCBib3hXaWR0aCwgYm94V2lkdGgpO1xuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgbWFwOiB0ZXh0dXJlLFxuICAgICAgICBjb2xvcjogMHgzMzMzMzMsXG4gICAgICAgIHNpZGU6IFRIUkVFLkJhY2tTaWRlXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgICB0aGlzLm1ldGFPYmplY3QgPSB7XG4gICAgICAgIG1lc2g6IG1lc2hcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYXR0YWNoZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5maXJlKCdtZXRhLWF0dGFjaGVkJywge1xuICAgICAgICB0YXJnZXQ6IHRoaXNcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBkZXRhY2hlZDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm1ldGFWZXJzZS5maXJlKCdtZXRhLWRldGFjaGVkJywge1xuICAgICAgICB0YXJnZXQ6IHRoaXNcbiAgICAgIH0pO1xuICAgIH1cbn0pO1xuIl19
