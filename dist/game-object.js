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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGVlamlhaGVuL3dvcmtzcGFjZS9NZXRhUm9vbU1hcmt1cExhbmd1YWdlL3NyYy9nYW1lLW9iamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBcUIsVUFBVTtBQUNsQixXQURRLFVBQVUsR0FDaEI7MEJBRE0sVUFBVTs7QUFFM0IsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM5RCxRQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFckQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLG1CQUFtQixDQUFBOztBQUVqRCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBRSxRQUFRLEVBQUUsTUFBTSxDQUFFLENBQUM7O0FBRXZELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUU5RixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWxELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNoRCxRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7O0FBRXZELFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7O0FBRWpGLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2xDLFFBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUE7O0FBRWxCLGFBQVMsT0FBTyxHQUFHO0FBQ2pCLFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRXZCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLDJCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2hDO0FBQ0QsV0FBTyxFQUFFLENBQUM7Ozs7OztHQU1YOztlQXJDa0IsVUFBVTs7V0F1Q3JCLG9CQUFHO0FBQ1QsYUFBTyxNQUFNLENBQUMsVUFBVSxDQUFDO0tBQzFCOzs7V0FFUSxxQkFBRztBQUNWLGFBQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQztLQUMzQjs7O1dBRUUsYUFBQyxVQUFVLEVBQUU7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDekQ7OztXQUVLLGdCQUFDLFVBQVUsRUFBRTtBQUNqQixVQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsVUFBSSxDQUFDLFdBQVcsVUFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDOUM7OztTQXZEa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU9iamVjdHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5tZXRhT2JqZWN0cyA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogZmFsc2UgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcblxuICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC5pZCA9ICdocG1sLXdlYmdsLWNhbnZhcydcblxuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLnNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2dFeHAyKCAweGZmZmY5OSwgMC4wMDc1ICk7XG5cbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgdGhpcy5nZXRXaWR0aCgpIC8gdGhpcy5nZXRIZWlnaHQoKSwgMC4zLCAxMDAwMCk7XG5cbiAgICB0aGlzLmNvbnRyb2xzID0gbmV3IFRIUkVFLlZSQ29udHJvbHModGhpcy5jYW1lcmEpO1xuXG4gICAgdGhpcy5lZmZlY3QgPSBuZXcgVEhSRUUuVlJFZmZlY3QodGhpcy5yZW5kZXJlcik7XG4gICAgdGhpcy5lZmZlY3Quc2V0U2l6ZSh0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCkpO1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbmV3IFdlYlZSTWFuYWdlcih0aGlzLnJlbmRlcmVyLCB0aGlzLmVmZmVjdCwge2hpZGVCdXR0b246IGZhbHNlfSk7XG5cbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKHRydWUpXG4gICAgdGhpcy5jbG9jay5zdGFydCgpXG5cbiAgICBmdW5jdGlvbiBhbmltYXRlKCkge1xuICAgICAgc2VsZi5jb250cm9scy51cGRhdGUoKTtcbiAgICAgIC8vIFJlbmRlciB0aGUgc2NlbmUgdGhyb3VnaCB0aGUgbWFuYWdlci5cbiAgICAgIHNlbGYubWFuYWdlci5yZW5kZXIoc2VsZi5zY2VuZSwgc2VsZi5jYW1lcmEpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuICAgIH1cbiAgICBhbmltYXRlKCk7XG4gICAgLy8gT2JqZWN0LmtleXMoaW5pdE9ianMpLmZvckVhY2goZnVuY3Rpb24obmFtZSl7XG4gICAgLy8gICByZXR1cm5PYmplY3QgPSBpbml0T2Jqc1tuYW1lXS5hcHBseShzZWxmKVxuICAgIC8vICAgc2VsZi5hZGQobmFtZSwgcmV0dXJuT2JqZWN0KTtcbiAgICAvLyB9KTtcbiAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRXaWR0aCgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG4gIH1cblxuICBnZXRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgfVxuXG4gIGFkZChtZXRhT2JqZWN0KSB7XG4gICAgdGhpcy5zY2VuZS5hZGQobWV0YU9iamVjdC5tZXNoKTtcbiAgICB0aGlzLm1ldGFPYmplY3RzLnNldCggbWV0YU9iamVjdC5tZXNoLnV1aWQsIG1ldGFPYmplY3QpO1xuICB9XG5cbiAgcmVtb3ZlKG1ldGFPYmplY3QpIHtcbiAgICB0aGlzLnNjZW5lLnJlbW92ZShtZXRhT2JqZWN0Lm1lc2gpO1xuICAgIHRoaXMubWV0YU9iamVjdHMuZGVsZXRlKG1ldGFPYmplY3QubWVzaC51dWlkKVxuICB9XG59XG4iXX0=
