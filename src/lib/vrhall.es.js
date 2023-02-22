var ns = Object.defineProperty;
var is = (d, e, t) => e in d ? ns(d, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : d[e] = t;
var A = (d, e, t) => (is(d, typeof e != "symbol" ? e + "" : e, t), t);
/*!
 * camera-controls
 * https://github.com/yomotsu/camera-controls
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
const G = {
  LEFT: 1,
  RIGHT: 2,
  MIDDLE: 4
}, m = Object.freeze({
  NONE: 0,
  ROTATE: 1,
  TRUCK: 2,
  OFFSET: 4,
  DOLLY: 8,
  ZOOM: 16,
  TOUCH_ROTATE: 32,
  TOUCH_TRUCK: 64,
  TOUCH_OFFSET: 128,
  TOUCH_DOLLY: 256,
  TOUCH_ZOOM: 512,
  TOUCH_DOLLY_TRUCK: 1024,
  TOUCH_DOLLY_OFFSET: 2048,
  TOUCH_DOLLY_ROTATE: 4096,
  TOUCH_ZOOM_TRUCK: 8192,
  TOUCH_ZOOM_OFFSET: 16384,
  TOUCH_ZOOM_ROTATE: 32768
});
function ue(d) {
  return d.isPerspectiveCamera;
}
function le(d) {
  return d.isOrthographicCamera;
}
const ye = Math.PI * 2, mt = Math.PI / 2, Bt = 1e-5;
function z(d, e = Bt) {
  return Math.abs(d) < e;
}
function U(d, e, t = Bt) {
  return z(d - e, t);
}
function _t(d, e) {
  return Math.round(d / e) * e;
}
function Oe(d) {
  return isFinite(d) ? d : d < 0 ? -Number.MAX_VALUE : Number.MAX_VALUE;
}
function Me(d) {
  return Math.abs(d) < Number.MAX_VALUE ? d : d * (1 / 0);
}
function qe(d, e) {
  e.set(0, 0), d.forEach((t) => {
    e.x += t.clientX, e.y += t.clientY;
  }), e.x /= d.length, e.y /= d.length;
}
function We(d, e) {
  return le(d) ? (console.warn(`${e} is not supported in OrthographicCamera`), !0) : !1;
}
function gt(d) {
  return d.invert ? d.invert() : d.inverse(), d;
}
class os {
  constructor() {
    this._listeners = {};
  }
  /**
   * Adds the specified event listener.
   * @param type event name
   * @param listener handler function
   * @category Methods
   */
  addEventListener(e, t) {
    const s = this._listeners;
    s[e] === void 0 && (s[e] = []), s[e].indexOf(t) === -1 && s[e].push(t);
  }
  // hasEventListener( type: string, listener: Listener ): boolean {
  // 	const listeners = this._listeners;
  // 	return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;
  // }
  /**
   * Removes the specified event listener
   * @param type event name
   * @param listener handler function
   * @category Methods
   */
  removeEventListener(e, t) {
    const n = this._listeners[e];
    if (n !== void 0) {
      const o = n.indexOf(t);
      o !== -1 && n.splice(o, 1);
    }
  }
  /**
   * Removes all event listeners
   * @param type event name
   * @category Methods
   */
  removeAllEventListeners(e) {
    if (!e) {
      this._listeners = {};
      return;
    }
    Array.isArray(this._listeners[e]) && (this._listeners[e].length = 0);
  }
  /**
   * Fire an event type.
   * @param event DispatcherEvent
   * @category Methods
   */
  dispatchEvent(e) {
    const s = this._listeners[e.type];
    if (s !== void 0) {
      e.target = this;
      const n = s.slice(0);
      for (let o = 0, i = n.length; o < i; o++)
        n[o].call(this, e);
    }
  }
}
const Gt = typeof window < "u", rs = Gt && /Mac/.test(navigator.platform), Et = !(Gt && "PointerEvent" in window), Be = 1 / 8;
let b, yt, Ge, $e, Q, S, C, we, te, se, pe, wt, Tt, ee, Ae, Re, xt, Je, Rt, et, tt, Ve;
class Te extends os {
  /**
   * Creates a `CameraControls` instance.
   *
   * Note:
   * You **must install** three.js before using camera-controls. see [#install](#install)
   * Not doing so will lead to runtime errors (`undefined` references to THREE).
   *
   * e.g.
   * ```
   * CameraControls.install( { THREE } );
   * const cameraControls = new CameraControls( camera, domElement );
   * ```
   *
   * @param camera A `THREE.PerspectiveCamera` or `THREE.OrthographicCamera` to be controlled.
   * @param domElement A `HTMLElement` for the draggable area, usually `renderer.domElement`.
   * @category Constructor
   */
  constructor(e, t) {
    if (super(), this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.minDistance = 0, this.maxDistance = 1 / 0, this.infinityDolly = !1, this.minZoom = 0.01, this.maxZoom = 1 / 0, this.dampingFactor = 0.05, this.draggingDampingFactor = 0.25, this.azimuthRotateSpeed = 1, this.polarRotateSpeed = 1, this.dollySpeed = 1, this.truckSpeed = 2, this.dollyToCursor = !1, this.dragToOffset = !1, this.verticalDragToForward = !1, this.boundaryFriction = 0, this.restThreshold = 0.01, this.colliderMeshes = [], this.cancel = () => {
    }, this._enabled = !0, this._state = m.NONE, this._viewport = null, this._dollyControlAmount = 0, this._hasRested = !0, this._boundaryEnclosesCamera = !1, this._needsUpdate = !0, this._updatedLastTime = !1, this._elementRect = new DOMRect(), this._activePointers = [], this._truckInternal = (s, n, o) => {
      if (ue(this._camera)) {
        const i = S.copy(this._camera.position).sub(this._target), a = this._camera.getEffectiveFOV() * b.MathUtils.DEG2RAD, r = i.length() * Math.tan(a * 0.5), c = this.truckSpeed * s * r / this._elementRect.height, h = this.truckSpeed * n * r / this._elementRect.height;
        this.verticalDragToForward ? (o ? this.setFocalOffset(this._focalOffsetEnd.x + c, this._focalOffsetEnd.y, this._focalOffsetEnd.z, !0) : this.truck(c, 0, !0), this.forward(-h, !0)) : o ? this.setFocalOffset(this._focalOffsetEnd.x + c, this._focalOffsetEnd.y + h, this._focalOffsetEnd.z, !0) : this.truck(c, h, !0);
      } else if (le(this._camera)) {
        const i = this._camera, a = s * (i.right - i.left) / i.zoom / this._elementRect.width, r = n * (i.top - i.bottom) / i.zoom / this._elementRect.height;
        o ? this.setFocalOffset(this._focalOffsetEnd.x + a, this._focalOffsetEnd.y + r, this._focalOffsetEnd.z, !0) : this.truck(a, r, !0);
      }
    }, this._rotateInternal = (s, n) => {
      const o = ye * this.azimuthRotateSpeed * s / this._elementRect.height, i = ye * this.polarRotateSpeed * n / this._elementRect.height;
      this.rotate(o, i, !0);
    }, this._dollyInternal = (s, n, o) => {
      const i = Math.pow(0.95, -s * this.dollySpeed), a = this._sphericalEnd.radius * i, r = this._sphericalEnd.radius, c = r * (s >= 0 ? -1 : 1);
      this.dollyTo(a), this.infinityDolly && (a < this.minDistance || this.maxDistance === this.minDistance) && (this._camera.getWorldDirection(S), this._targetEnd.add(S.normalize().multiplyScalar(c)), this._target.add(S.normalize().multiplyScalar(c))), this.dollyToCursor && (this._dollyControlAmount += this._sphericalEnd.radius - r, this.infinityDolly && (a < this.minDistance || this.maxDistance === this.minDistance) && (this._dollyControlAmount -= c), this._dollyControlCoord.set(n, o));
    }, this._zoomInternal = (s, n, o) => {
      const i = Math.pow(0.95, s * this.dollySpeed), a = this._zoomEnd;
      this.zoomTo(this._zoom * i), this.dollyToCursor && (this._dollyControlAmount += this._zoomEnd - a, this._dollyControlCoord.set(n, o));
    }, typeof b > "u" && console.error("camera-controls: `THREE` is undefined. You must first run `CameraControls.install( { THREE: THREE } )`. Check the docs for further information."), this._camera = e, this._yAxisUpSpace = new b.Quaternion().setFromUnitVectors(this._camera.up, Ge), this._yAxisUpSpaceInverse = gt(this._yAxisUpSpace.clone()), this._state = m.NONE, this._domElement = t, this._domElement.style.touchAction = "none", this._domElement.style.userSelect = "none", this._domElement.style.webkitUserSelect = "none", this._target = new b.Vector3(), this._targetEnd = this._target.clone(), this._focalOffset = new b.Vector3(), this._focalOffsetEnd = this._focalOffset.clone(), this._spherical = new b.Spherical().setFromVector3(S.copy(this._camera.position).applyQuaternion(this._yAxisUpSpace)), this._sphericalEnd = this._spherical.clone(), this._zoom = this._camera.zoom, this._zoomEnd = this._zoom, this._nearPlaneCorners = [
      new b.Vector3(),
      new b.Vector3(),
      new b.Vector3(),
      new b.Vector3()
    ], this._updateNearPlaneCorners(), this._boundary = new b.Box3(new b.Vector3(-1 / 0, -1 / 0, -1 / 0), new b.Vector3(1 / 0, 1 / 0, 1 / 0)), this._target0 = this._target.clone(), this._position0 = this._camera.position.clone(), this._zoom0 = this._zoom, this._focalOffset0 = this._focalOffset.clone(), this._dollyControlAmount = 0, this._dollyControlCoord = new b.Vector2(), this.mouseButtons = {
      left: m.ROTATE,
      middle: m.DOLLY,
      right: m.TRUCK,
      wheel: ue(this._camera) ? m.DOLLY : le(this._camera) ? m.ZOOM : m.NONE
    }, this.touches = {
      one: m.TOUCH_ROTATE,
      two: ue(this._camera) ? m.TOUCH_DOLLY_TRUCK : le(this._camera) ? m.TOUCH_ZOOM_TRUCK : m.NONE,
      three: m.TOUCH_TRUCK
    }, this._domElement) {
      const s = new b.Vector2(), n = new b.Vector2(), o = new b.Vector2(), i = (f) => {
        if (!this._enabled)
          return;
        const R = {
          pointerId: f.pointerId,
          clientX: f.clientX,
          clientY: f.clientY,
          deltaX: 0,
          deltaY: 0
        };
        this._activePointers.push(R), this._domElement.ownerDocument.removeEventListener("pointermove", c, { passive: !1 }), this._domElement.ownerDocument.removeEventListener("pointerup", u), this._domElement.ownerDocument.addEventListener("pointermove", c, { passive: !1 }), this._domElement.ownerDocument.addEventListener("pointerup", u), w(f);
      }, a = (f) => {
        if (!this._enabled)
          return;
        const R = {
          pointerId: 0,
          clientX: f.clientX,
          clientY: f.clientY,
          deltaX: 0,
          deltaY: 0
        };
        this._activePointers.push(R), this._domElement.ownerDocument.removeEventListener("mousemove", h), this._domElement.ownerDocument.removeEventListener("mouseup", p), this._domElement.ownerDocument.addEventListener("mousemove", h), this._domElement.ownerDocument.addEventListener("mouseup", p), w(f);
      }, r = (f) => {
        this._enabled && (f.preventDefault(), Array.prototype.forEach.call(f.changedTouches, (R) => {
          const x = {
            pointerId: R.identifier,
            clientX: R.clientX,
            clientY: R.clientY,
            deltaX: 0,
            deltaY: 0
          };
          this._activePointers.push(x);
        }), this._domElement.ownerDocument.removeEventListener("touchmove", l, { passive: !1 }), this._domElement.ownerDocument.removeEventListener("touchend", y), this._domElement.ownerDocument.addEventListener("touchmove", l, { passive: !1 }), this._domElement.ownerDocument.addEventListener("touchend", y), w(f));
      }, c = (f) => {
        f.cancelable && f.preventDefault();
        const R = f.pointerId, x = this._findPointerById(R);
        if (x) {
          if (x.clientX = f.clientX, x.clientY = f.clientY, x.deltaX = f.movementX, x.deltaY = f.movementY, f.pointerType === "touch")
            switch (this._activePointers.length) {
              case 1:
                this._state = this.touches.one;
                break;
              case 2:
                this._state = this.touches.two;
                break;
              case 3:
                this._state = this.touches.three;
                break;
            }
          else
            this._state = 0, (f.buttons & G.LEFT) === G.LEFT && (this._state = this._state | this.mouseButtons.left), (f.buttons & G.MIDDLE) === G.MIDDLE && (this._state = this._state | this.mouseButtons.middle), (f.buttons & G.RIGHT) === G.RIGHT && (this._state = this._state | this.mouseButtons.right);
          O();
        }
      }, h = (f) => {
        const R = this._findPointerById(0);
        R && (R.clientX = f.clientX, R.clientY = f.clientY, R.deltaX = f.movementX, R.deltaY = f.movementY, this._state = 0, (f.buttons & G.LEFT) === G.LEFT && (this._state = this._state | this.mouseButtons.left), (f.buttons & G.MIDDLE) === G.MIDDLE && (this._state = this._state | this.mouseButtons.middle), (f.buttons & G.RIGHT) === G.RIGHT && (this._state = this._state | this.mouseButtons.right), O());
      }, l = (f) => {
        f.cancelable && f.preventDefault(), Array.prototype.forEach.call(f.changedTouches, (R) => {
          const x = R.identifier, L = this._findPointerById(x);
          L && (L.clientX = R.clientX, L.clientY = R.clientY);
        }), O();
      }, u = (f) => {
        const R = f.pointerId, x = this._findPointerById(R);
        if (x && this._activePointers.splice(this._activePointers.indexOf(x), 1), f.pointerType === "touch")
          switch (this._activePointers.length) {
            case 0:
              this._state = m.NONE;
              break;
            case 1:
              this._state = this.touches.one;
              break;
            case 2:
              this._state = this.touches.two;
              break;
            case 3:
              this._state = this.touches.three;
              break;
          }
        else
          this._state = m.NONE;
        M();
      }, p = () => {
        const f = this._findPointerById(0);
        f && this._activePointers.splice(this._activePointers.indexOf(f), 1), this._state = m.NONE, M();
      }, y = (f) => {
        switch (Array.prototype.forEach.call(f.changedTouches, (R) => {
          const x = R.identifier, L = this._findPointerById(x);
          L && this._activePointers.splice(this._activePointers.indexOf(L), 1);
        }), this._activePointers.length) {
          case 0:
            this._state = m.NONE;
            break;
          case 1:
            this._state = this.touches.one;
            break;
          case 2:
            this._state = this.touches.two;
            break;
          case 3:
            this._state = this.touches.three;
            break;
        }
        M();
      };
      let E = -1;
      const _ = (f) => {
        if (!this._enabled || this.mouseButtons.wheel === m.NONE)
          return;
        if (f.preventDefault(), this.dollyToCursor || this.mouseButtons.wheel === m.ROTATE || this.mouseButtons.wheel === m.TRUCK) {
          const I = performance.now();
          E - I < 1e3 && this._getClientRect(this._elementRect), E = I;
        }
        const R = rs ? -1 : -3, x = f.deltaMode === 1 ? f.deltaY / R : f.deltaY / (R * 10), L = this.dollyToCursor ? (f.clientX - this._elementRect.x) / this._elementRect.width * 2 - 1 : 0, N = this.dollyToCursor ? (f.clientY - this._elementRect.y) / this._elementRect.height * -2 + 1 : 0;
        switch (this.mouseButtons.wheel) {
          case m.ROTATE: {
            this._rotateInternal(f.deltaX, f.deltaY);
            break;
          }
          case m.TRUCK: {
            this._truckInternal(f.deltaX, f.deltaY, !1);
            break;
          }
          case m.OFFSET: {
            this._truckInternal(f.deltaX, f.deltaY, !0);
            break;
          }
          case m.DOLLY: {
            this._dollyInternal(-x, L, N);
            break;
          }
          case m.ZOOM: {
            this._zoomInternal(-x, L, N);
            break;
          }
        }
        this.dispatchEvent({ type: "control" });
      }, g = (f) => {
        this._enabled && f.preventDefault();
      }, w = (f) => {
        if (!this._enabled)
          return;
        if (qe(this._activePointers, Q), this._getClientRect(this._elementRect), s.copy(Q), n.copy(Q), this._activePointers.length >= 2) {
          const x = Q.x - this._activePointers[1].clientX, L = Q.y - this._activePointers[1].clientY, N = Math.sqrt(x * x + L * L);
          o.set(0, N);
          const I = (this._activePointers[0].clientX + this._activePointers[1].clientX) * 0.5, $ = (this._activePointers[0].clientY + this._activePointers[1].clientY) * 0.5;
          n.set(I, $);
        }
        if ("touches" in f || "pointerType" in f && f.pointerType === "touch")
          switch (this._activePointers.length) {
            case 1:
              this._state = this.touches.one;
              break;
            case 2:
              this._state = this.touches.two;
              break;
            case 3:
              this._state = this.touches.three;
              break;
          }
        else
          this._state = 0, (f.buttons & G.LEFT) === G.LEFT && (this._state = this._state | this.mouseButtons.left), (f.buttons & G.MIDDLE) === G.MIDDLE && (this._state = this._state | this.mouseButtons.middle), (f.buttons & G.RIGHT) === G.RIGHT && (this._state = this._state | this.mouseButtons.right);
        this.dispatchEvent({ type: "controlstart" });
      }, O = () => {
        if (!this._enabled)
          return;
        qe(this._activePointers, Q);
        const f = this._domElement && document.pointerLockElement === this._domElement, R = f ? -this._activePointers[0].deltaX : n.x - Q.x, x = f ? -this._activePointers[0].deltaY : n.y - Q.y;
        if (n.copy(Q), ((this._state & m.ROTATE) === m.ROTATE || (this._state & m.TOUCH_ROTATE) === m.TOUCH_ROTATE || (this._state & m.TOUCH_DOLLY_ROTATE) === m.TOUCH_DOLLY_ROTATE || (this._state & m.TOUCH_ZOOM_ROTATE) === m.TOUCH_ZOOM_ROTATE) && this._rotateInternal(R, x), (this._state & m.DOLLY) === m.DOLLY || (this._state & m.ZOOM) === m.ZOOM) {
          const L = this.dollyToCursor ? (s.x - this._elementRect.x) / this._elementRect.width * 2 - 1 : 0, N = this.dollyToCursor ? (s.y - this._elementRect.y) / this._elementRect.height * -2 + 1 : 0;
          this._state === m.DOLLY ? this._dollyInternal(x * Be, L, N) : this._zoomInternal(x * Be, L, N);
        }
        if ((this._state & m.TOUCH_DOLLY) === m.TOUCH_DOLLY || (this._state & m.TOUCH_ZOOM) === m.TOUCH_ZOOM || (this._state & m.TOUCH_DOLLY_TRUCK) === m.TOUCH_DOLLY_TRUCK || (this._state & m.TOUCH_ZOOM_TRUCK) === m.TOUCH_ZOOM_TRUCK || (this._state & m.TOUCH_DOLLY_OFFSET) === m.TOUCH_DOLLY_OFFSET || (this._state & m.TOUCH_ZOOM_OFFSET) === m.TOUCH_ZOOM_OFFSET || (this._state & m.TOUCH_DOLLY_ROTATE) === m.TOUCH_DOLLY_ROTATE || (this._state & m.TOUCH_ZOOM_ROTATE) === m.TOUCH_ZOOM_ROTATE) {
          const L = Q.x - this._activePointers[1].clientX, N = Q.y - this._activePointers[1].clientY, I = Math.sqrt(L * L + N * N), $ = o.y - I;
          o.set(0, I);
          const V = this.dollyToCursor ? (n.x - this._elementRect.x) / this._elementRect.width * 2 - 1 : 0, D = this.dollyToCursor ? (n.y - this._elementRect.y) / this._elementRect.height * -2 + 1 : 0;
          this._state === m.TOUCH_DOLLY || this._state === m.TOUCH_DOLLY_ROTATE || this._state === m.TOUCH_DOLLY_TRUCK || this._state === m.TOUCH_DOLLY_OFFSET ? this._dollyInternal($ * Be, V, D) : this._zoomInternal($ * Be, V, D);
        }
        ((this._state & m.TRUCK) === m.TRUCK || (this._state & m.TOUCH_TRUCK) === m.TOUCH_TRUCK || (this._state & m.TOUCH_DOLLY_TRUCK) === m.TOUCH_DOLLY_TRUCK || (this._state & m.TOUCH_ZOOM_TRUCK) === m.TOUCH_ZOOM_TRUCK) && this._truckInternal(R, x, !1), ((this._state & m.OFFSET) === m.OFFSET || (this._state & m.TOUCH_OFFSET) === m.TOUCH_OFFSET || (this._state & m.TOUCH_DOLLY_OFFSET) === m.TOUCH_DOLLY_OFFSET || (this._state & m.TOUCH_ZOOM_OFFSET) === m.TOUCH_ZOOM_OFFSET) && this._truckInternal(R, x, !0), this.dispatchEvent({ type: "control" });
      }, M = () => {
        qe(this._activePointers, Q), n.copy(Q), this._activePointers.length === 0 && (this._domElement.ownerDocument.removeEventListener("pointermove", c, { passive: !1 }), this._domElement.ownerDocument.removeEventListener("pointerup", u), this._domElement.ownerDocument.removeEventListener("touchmove", l, { passive: !1 }), this._domElement.ownerDocument.removeEventListener("touchend", y), this.dispatchEvent({ type: "controlend" }));
      };
      this._domElement.addEventListener("pointerdown", i), Et && this._domElement.addEventListener("mousedown", a), Et && this._domElement.addEventListener("touchstart", r), this._domElement.addEventListener("pointercancel", u), this._domElement.addEventListener("wheel", _, { passive: !1 }), this._domElement.addEventListener("contextmenu", g), this._removeAllEventListeners = () => {
        this._domElement.removeEventListener("pointerdown", i), this._domElement.removeEventListener("mousedown", a), this._domElement.removeEventListener("touchstart", r), this._domElement.removeEventListener("pointercancel", u), this._domElement.removeEventListener("wheel", _, { passive: !1 }), this._domElement.removeEventListener("contextmenu", g), this._domElement.ownerDocument.removeEventListener("pointermove", c, { passive: !1 }), this._domElement.ownerDocument.removeEventListener("mousemove", h), this._domElement.ownerDocument.removeEventListener("touchmove", l, { passive: !1 }), this._domElement.ownerDocument.removeEventListener("pointerup", u), this._domElement.ownerDocument.removeEventListener("mouseup", p), this._domElement.ownerDocument.removeEventListener("touchend", y);
      }, this.cancel = () => {
        this._state !== m.NONE && (this._state = m.NONE, this._activePointers.length = 0, M());
      };
    }
    this.update(0);
  }
  /**
       * Injects THREE as the dependency. You can then proceed to use CameraControls.
       *
       * e.g
       * ```javascript
       * CameraControls.install( { THREE: THREE } );
       * ```
       *
       * Note: If you do not wish to use enter three.js to reduce file size(tree-shaking for example), make a subset to install.
       *
       * ```js
       * import {
       * 	Vector2,
       * 	Vector3,
       * 	Vector4,
       * 	Quaternion,
       * 	Matrix4,
       * 	Spherical,
       * 	Box3,
       * 	Sphere,
       * 	Raycaster,
       * 	MathUtils,
       * } from 'three';
       *
       * const subsetOfTHREE = {
       * 	Vector2   : Vector2,
       * 	Vector3   : Vector3,
       * 	Vector4   : Vector4,
       * 	Quaternion: Quaternion,
       * 	Matrix4   : Matrix4,
       * 	Spherical : Spherical,
       * 	Box3      : Box3,
       * 	Sphere    : Sphere,
       * 	Raycaster : Raycaster,
       * 	MathUtils : {
       * 		DEG2RAD: MathUtils.DEG2RAD,
       * 		clamp: MathUtils.clamp,
       * 	},
       * };
  
       * CameraControls.install( { THREE: subsetOfTHREE } );
       * ```
       * @category Statics
       */
  static install(e) {
    b = e.THREE, yt = Object.freeze(new b.Vector3(0, 0, 0)), Ge = Object.freeze(new b.Vector3(0, 1, 0)), $e = Object.freeze(new b.Vector3(0, 0, 1)), Q = new b.Vector2(), S = new b.Vector3(), C = new b.Vector3(), we = new b.Vector3(), te = new b.Vector3(), se = new b.Vector3(), pe = new b.Vector3(), wt = new b.Vector3(), Tt = new b.Vector3(), ee = new b.Spherical(), Ae = new b.Spherical(), Re = new b.Box3(), xt = new b.Box3(), Je = new b.Sphere(), Rt = new b.Quaternion(), et = new b.Quaternion(), tt = new b.Matrix4(), Ve = new b.Raycaster();
  }
  /**
   * list all ACTIONs
   * @category Statics
   */
  static get ACTION() {
    return m;
  }
  /**
   * The camera to be controlled
   * @category Properties
   */
  get camera() {
    return this._camera;
  }
  set camera(e) {
    this._camera = e, this.updateCameraUp(), this._camera.updateProjectionMatrix(), this._updateNearPlaneCorners(), this._needsUpdate = !0;
  }
  /**
   * Whether or not the controls are enabled.
   * `false` to disable user dragging/touch-move, but all methods works.
   * @category Properties
   */
  get enabled() {
    return this._enabled;
  }
  set enabled(e) {
    this._enabled = e, e ? (this._domElement.style.touchAction = "none", this._domElement.style.userSelect = "none", this._domElement.style.webkitUserSelect = "none") : (this.cancel(), this._domElement.style.touchAction = "", this._domElement.style.userSelect = "", this._domElement.style.webkitUserSelect = "");
  }
  /**
   * Returns `true` if the controls are active updating.
   * readonly value.
   * @category Properties
   */
  get active() {
    return !this._hasRested;
  }
  /**
   * Getter for the current `ACTION`.
   * readonly value.
   * @category Properties
   */
  get currentAction() {
    return this._state;
  }
  /**
   * get/set Current distance.
   * @category Properties
   */
  get distance() {
    return this._spherical.radius;
  }
  set distance(e) {
    this._spherical.radius === e && this._sphericalEnd.radius === e || (this._spherical.radius = e, this._sphericalEnd.radius = e, this._needsUpdate = !0);
  }
  // horizontal angle
  /**
   * get/set the azimuth angle (horizontal) in radians.
   * Every 360 degrees turn is added to `.azimuthAngle` value, which is accumulative.
   * @category Properties
   */
  get azimuthAngle() {
    return this._spherical.theta;
  }
  set azimuthAngle(e) {
    this._spherical.theta === e && this._sphericalEnd.theta === e || (this._spherical.theta = e, this._sphericalEnd.theta = e, this._needsUpdate = !0);
  }
  // vertical angle
  /**
   * get/set the polar angle (vertical) in radians.
   * @category Properties
   */
  get polarAngle() {
    return this._spherical.phi;
  }
  set polarAngle(e) {
    this._spherical.phi === e && this._sphericalEnd.phi === e || (this._spherical.phi = e, this._sphericalEnd.phi = e, this._needsUpdate = !0);
  }
  /**
   * Whether camera position should be enclosed in the boundary or not.
   * @category Properties
   */
  get boundaryEnclosesCamera() {
    return this._boundaryEnclosesCamera;
  }
  set boundaryEnclosesCamera(e) {
    this._boundaryEnclosesCamera = e, this._needsUpdate = !0;
  }
  /**
   * Adds the specified event listener.
   * Applicable event types (which is `K`) are:
   * | Event name          | Timing |
   * | ------------------- | ------ |
   * | `'controlstart'`    | When the user starts to control the camera via mouse / touches. ¹ |
   * | `'control'`         | When the user controls the camera (dragging). |
   * | `'controlend'`      | When the user ends to control the camera. ¹ |
   * | `'transitionstart'` | When any kind of transition starts, either user control or using a method with `enableTransition = true` |
   * | `'update'`          | When the camera position is updated. |
   * | `'wake'`            | When the camera starts moving. |
   * | `'rest'`            | When the camera movement is below `.restThreshold` ². |
   * | `'sleep'`           | When the camera end moving. |
   *
   * 1. `mouseButtons.wheel` (Mouse wheel control) does not emit `'controlstart'` and `'controlend'`. `mouseButtons.wheel` uses scroll-event internally, and scroll-event happens intermittently. That means "start" and "end" cannot be detected.
   * 2. Due to damping, `sleep` will usually fire a few seconds after the camera _appears_ to have stopped moving. If you want to do something (e.g. enable UI, perform another transition) at the point when the camera has stopped, you probably want the `rest` event. This can be fine tuned using the `.restThreshold` parameter. See the [Rest and Sleep Example](https://yomotsu.github.io/camera-controls/examples/rest-and-sleep.html).
   *
   * e.g.
   * ```
   * cameraControl.addEventListener( 'controlstart', myCallbackFunction );
   * ```
   * @param type event name
   * @param listener handler function
   * @category Methods
   */
  addEventListener(e, t) {
    super.addEventListener(e, t);
  }
  /**
   * Removes the specified event listener
   * e.g.
   * ```
   * cameraControl.addEventListener( 'controlstart', myCallbackFunction );
   * ```
   * @param type event name
   * @param listener handler function
   * @category Methods
   */
  removeEventListener(e, t) {
    super.removeEventListener(e, t);
  }
  /**
   * Rotate azimuthal angle(horizontal) and polar angle(vertical).
   * Every value is added to the current value.
   * @param azimuthAngle Azimuth rotate angle. In radian.
   * @param polarAngle Polar rotate angle. In radian.
   * @param enableTransition Whether to move smoothly or immediately
   * @category Methods
   */
  rotate(e, t, s = !1) {
    return this.rotateTo(this._sphericalEnd.theta + e, this._sphericalEnd.phi + t, s);
  }
  /**
   * Rotate azimuthal angle(horizontal) to the given angle and keep the same polar angle(vertical) target.
   *
   * e.g.
   * ```
   * cameraControls.rotateAzimuthTo( 30 * THREE.MathUtils.DEG2RAD, true );
   * ```
   * @param azimuthAngle Azimuth rotate angle. In radian.
   * @param enableTransition Whether to move smoothly or immediately
   * @category Methods
   */
  rotateAzimuthTo(e, t = !1) {
    return this.rotateTo(e, this._sphericalEnd.phi, t);
  }
  /**
   * Rotate polar angle(vertical) to the given angle and keep the same azimuthal angle(horizontal) target.
   *
   * e.g.
   * ```
   * cameraControls.rotatePolarTo( 30 * THREE.MathUtils.DEG2RAD, true );
   * ```
   * @param polarAngle Polar rotate angle. In radian.
   * @param enableTransition Whether to move smoothly or immediately
   * @category Methods
   */
  rotatePolarTo(e, t = !1) {
    return this.rotateTo(this._sphericalEnd.theta, e, t);
  }
  /**
   * Rotate azimuthal angle(horizontal) and polar angle(vertical) to the given angle.
   * Camera view will rotate over the orbit pivot absolutely:
   *
   * azimuthAngle
   * ```
   *       0º
   *         \
   * 90º -----+----- -90º
   *           \
   *           180º
   * ```
   * | direction | angle                  |
   * | --------- | ---------------------- |
   * | front     | 0º                     |
   * | left      | 90º (`Math.PI / 2`)    |
   * | right     | -90º (`- Math.PI / 2`) |
   * | back      | 180º (`Math.PI`)       |
   *
   * polarAngle
   * ```
   *     180º
   *      |
   *      90º
   *      |
   *      0º
   * ```
   * | direction            | angle                  |
   * | -------------------- | ---------------------- |
   * | top/sky              | 180º (`Math.PI`)       |
   * | horizontal from view | 90º (`Math.PI / 2`)    |
   * | bottom/floor         | 0º                     |
   *
   * @param azimuthAngle Azimuth rotate angle to. In radian.
   * @param polarAngle Polar rotate angle to. In radian.
   * @param enableTransition  Whether to move smoothly or immediately
   * @category Methods
   */
  rotateTo(e, t, s = !1) {
    const n = b.MathUtils.clamp(e, this.minAzimuthAngle, this.maxAzimuthAngle), o = b.MathUtils.clamp(t, this.minPolarAngle, this.maxPolarAngle);
    this._sphericalEnd.theta = n, this._sphericalEnd.phi = o, this._sphericalEnd.makeSafe(), this._needsUpdate = !0, s || (this._spherical.theta = this._sphericalEnd.theta, this._spherical.phi = this._sphericalEnd.phi);
    const i = !s || U(this._spherical.theta, this._sphericalEnd.theta, this.restThreshold) && U(this._spherical.phi, this._sphericalEnd.phi, this.restThreshold);
    return this._createOnRestPromise(i);
  }
  /**
   * Dolly in/out camera position.
   * @param distance Distance of dollyIn. Negative number for dollyOut.
   * @param enableTransition Whether to move smoothly or immediately.
   * @category Methods
   */
  dolly(e, t = !1) {
    return this.dollyTo(this._sphericalEnd.radius - e, t);
  }
  /**
   * Dolly in/out camera position to given distance.
   * @param distance Distance of dolly.
   * @param enableTransition Whether to move smoothly or immediately.
   * @category Methods
   */
  dollyTo(e, t = !1) {
    const s = this._sphericalEnd.radius, n = b.MathUtils.clamp(e, this.minDistance, this.maxDistance);
    if (this.colliderMeshes.length >= 1) {
      const a = this._collisionTest(), r = U(a, this._spherical.radius);
      if (!(s > n) && r)
        return Promise.resolve();
      this._sphericalEnd.radius = Math.min(n, a);
    } else
      this._sphericalEnd.radius = n;
    this._needsUpdate = !0, t || (this._spherical.radius = this._sphericalEnd.radius);
    const i = !t || U(this._spherical.radius, this._sphericalEnd.radius, this.restThreshold);
    return this._createOnRestPromise(i);
  }
  /**
   * Zoom in/out camera. The value is added to camera zoom.
   * Limits set with `.minZoom` and `.maxZoom`
   * @param zoomStep zoom scale
   * @param enableTransition Whether to move smoothly or immediately
   * @category Methods
   */
  zoom(e, t = !1) {
    return this.zoomTo(this._zoomEnd + e, t);
  }
  /**
   * Zoom in/out camera to given scale. The value overwrites camera zoom.
   * Limits set with .minZoom and .maxZoom
   * @param zoom
   * @param enableTransition
   * @category Methods
   */
  zoomTo(e, t = !1) {
    this._zoomEnd = b.MathUtils.clamp(e, this.minZoom, this.maxZoom), this._needsUpdate = !0, t || (this._zoom = this._zoomEnd);
    const s = !t || U(this._zoom, this._zoomEnd, this.restThreshold);
    return this._createOnRestPromise(s);
  }
  /**
   * @deprecated `pan()` has been renamed to `truck()`
   * @category Methods
   */
  pan(e, t, s = !1) {
    return console.warn("`pan` has been renamed to `truck`"), this.truck(e, t, s);
  }
  /**
   * Truck and pedestal camera using current azimuthal angle
   * @param x Horizontal translate amount
   * @param y Vertical translate amount
   * @param enableTransition Whether to move smoothly or immediately
   * @category Methods
   */
  truck(e, t, s = !1) {
    this._camera.updateMatrix(), te.setFromMatrixColumn(this._camera.matrix, 0), se.setFromMatrixColumn(this._camera.matrix, 1), te.multiplyScalar(e), se.multiplyScalar(-t);
    const n = S.copy(te).add(se), o = C.copy(this._targetEnd).add(n);
    return this.moveTo(o.x, o.y, o.z, s);
  }
  /**
   * Move forward / backward.
   * @param distance Amount to move forward / backward. Negative value to move backward
   * @param enableTransition Whether to move smoothly or immediately
   * @category Methods
   */
  forward(e, t = !1) {
    S.setFromMatrixColumn(this._camera.matrix, 0), S.crossVectors(this._camera.up, S), S.multiplyScalar(e);
    const s = C.copy(this._targetEnd).add(S);
    return this.moveTo(s.x, s.y, s.z, t);
  }
  /**
   * Move target position to given point.
   * @param x x coord to move center position
   * @param y y coord to move center position
   * @param z z coord to move center position
   * @param enableTransition Whether to move smoothly or immediately
   * @category Methods
   */
  moveTo(e, t, s, n = !1) {
    const o = S.set(e, t, s).sub(this._targetEnd);
    this._encloseToBoundary(this._targetEnd, o, this.boundaryFriction), this._needsUpdate = !0, n || this._target.copy(this._targetEnd);
    const i = !n || U(this._target.x, this._targetEnd.x, this.restThreshold) && U(this._target.y, this._targetEnd.y, this.restThreshold) && U(this._target.z, this._targetEnd.z, this.restThreshold);
    return this._createOnRestPromise(i);
  }
  /**
   * Fit the viewport to the box or the bounding box of the object, using the nearest axis. paddings are in unit.
   * set `cover: true` to fill enter screen.
   * e.g.
   * ```
   * cameraControls.fitToBox( myMesh );
   * ```
   * @param box3OrObject Axis aligned bounding box to fit the view.
   * @param enableTransition Whether to move smoothly or immediately.
   * @param options | `<object>` { cover: boolean, paddingTop: number, paddingLeft: number, paddingBottom: number, paddingRight: number }
   * @returns Transition end promise
   * @category Methods
   */
  fitToBox(e, t, { cover: s = !1, paddingLeft: n = 0, paddingRight: o = 0, paddingBottom: i = 0, paddingTop: a = 0 } = {}) {
    const r = [], c = e.isBox3 ? Re.copy(e) : Re.setFromObject(e);
    c.isEmpty() && (console.warn("camera-controls: fitTo() cannot be used with an empty box. Aborting"), Promise.resolve());
    const h = _t(this._sphericalEnd.theta, mt), l = _t(this._sphericalEnd.phi, mt);
    r.push(this.rotateTo(h, l, t));
    const u = S.setFromSpherical(this._sphericalEnd).normalize(), p = Rt.setFromUnitVectors(u, $e), y = U(Math.abs(u.y), 1);
    y && p.multiply(et.setFromAxisAngle(Ge, h)), p.multiply(this._yAxisUpSpaceInverse);
    const E = xt.makeEmpty();
    C.copy(c.min).applyQuaternion(p), E.expandByPoint(C), C.copy(c.min).setX(c.max.x).applyQuaternion(p), E.expandByPoint(C), C.copy(c.min).setY(c.max.y).applyQuaternion(p), E.expandByPoint(C), C.copy(c.max).setZ(c.min.z).applyQuaternion(p), E.expandByPoint(C), C.copy(c.min).setZ(c.max.z).applyQuaternion(p), E.expandByPoint(C), C.copy(c.max).setY(c.min.y).applyQuaternion(p), E.expandByPoint(C), C.copy(c.max).setX(c.min.x).applyQuaternion(p), E.expandByPoint(C), C.copy(c.max).applyQuaternion(p), E.expandByPoint(C), E.min.x -= n, E.min.y -= i, E.max.x += o, E.max.y += a, p.setFromUnitVectors($e, u), y && p.premultiply(et.invert()), p.premultiply(this._yAxisUpSpace);
    const _ = E.getSize(S), g = E.getCenter(C).applyQuaternion(p);
    if (ue(this._camera)) {
      const w = this.getDistanceToFitBox(_.x, _.y, _.z, s);
      r.push(this.moveTo(g.x, g.y, g.z, t)), r.push(this.dollyTo(w, t)), r.push(this.setFocalOffset(0, 0, 0, t));
    } else if (le(this._camera)) {
      const w = this._camera, O = w.right - w.left, M = w.top - w.bottom, f = s ? Math.max(O / _.x, M / _.y) : Math.min(O / _.x, M / _.y);
      r.push(this.moveTo(g.x, g.y, g.z, t)), r.push(this.zoomTo(f, t)), r.push(this.setFocalOffset(0, 0, 0, t));
    }
    return Promise.all(r);
  }
  /**
   * Fit the viewport to the sphere or the bounding sphere of the object.
   * @param sphereOrMesh
   * @param enableTransition
   * @category Methods
   */
  fitToSphere(e, t) {
    const s = [], o = e instanceof b.Sphere ? Je.copy(e) : as(e, Je);
    if (s.push(this.moveTo(o.center.x, o.center.y, o.center.z, t)), ue(this._camera)) {
      const i = this.getDistanceToFitSphere(o.radius);
      s.push(this.dollyTo(i, t));
    } else if (le(this._camera)) {
      const i = this._camera.right - this._camera.left, a = this._camera.top - this._camera.bottom, r = 2 * o.radius, c = Math.min(i / r, a / r);
      s.push(this.zoomTo(c, t));
    }
    return s.push(this.setFocalOffset(0, 0, 0, t)), Promise.all(s);
  }
  /**
   * Make an orbit with given points.
   * @param positionX
   * @param positionY
   * @param positionZ
   * @param targetX
   * @param targetY
   * @param targetZ
   * @param enableTransition
   * @category Methods
   */
  setLookAt(e, t, s, n, o, i, a = !1) {
    const r = C.set(n, o, i), c = S.set(e, t, s);
    this._targetEnd.copy(r), this._sphericalEnd.setFromVector3(c.sub(r).applyQuaternion(this._yAxisUpSpace)), this.normalizeRotations(), this._needsUpdate = !0, a || (this._target.copy(this._targetEnd), this._spherical.copy(this._sphericalEnd));
    const h = !a || U(this._target.x, this._targetEnd.x, this.restThreshold) && U(this._target.y, this._targetEnd.y, this.restThreshold) && U(this._target.z, this._targetEnd.z, this.restThreshold) && U(this._spherical.theta, this._sphericalEnd.theta, this.restThreshold) && U(this._spherical.phi, this._sphericalEnd.phi, this.restThreshold) && U(this._spherical.radius, this._sphericalEnd.radius, this.restThreshold);
    return this._createOnRestPromise(h);
  }
  /**
   * Similar to setLookAt, but it interpolates between two states.
   * @param positionAX
   * @param positionAY
   * @param positionAZ
   * @param targetAX
   * @param targetAY
   * @param targetAZ
   * @param positionBX
   * @param positionBY
   * @param positionBZ
   * @param targetBX
   * @param targetBY
   * @param targetBZ
   * @param t
   * @param enableTransition
   * @category Methods
   */
  lerpLookAt(e, t, s, n, o, i, a, r, c, h, l, u, p, y = !1) {
    const E = S.set(n, o, i), _ = C.set(e, t, s);
    ee.setFromVector3(_.sub(E).applyQuaternion(this._yAxisUpSpace));
    const g = we.set(h, l, u), w = C.set(a, r, c);
    Ae.setFromVector3(w.sub(g).applyQuaternion(this._yAxisUpSpace)), this._targetEnd.copy(E.lerp(g, p));
    const O = Ae.theta - ee.theta, M = Ae.phi - ee.phi, f = Ae.radius - ee.radius;
    this._sphericalEnd.set(ee.radius + f * p, ee.phi + M * p, ee.theta + O * p), this.normalizeRotations(), this._needsUpdate = !0, y || (this._target.copy(this._targetEnd), this._spherical.copy(this._sphericalEnd));
    const R = !y || U(this._target.x, this._targetEnd.x, this.restThreshold) && U(this._target.y, this._targetEnd.y, this.restThreshold) && U(this._target.z, this._targetEnd.z, this.restThreshold) && U(this._spherical.theta, this._sphericalEnd.theta, this.restThreshold) && U(this._spherical.phi, this._sphericalEnd.phi, this.restThreshold) && U(this._spherical.radius, this._sphericalEnd.radius, this.restThreshold);
    return this._createOnRestPromise(R);
  }
  /**
   * setLookAt without target, keep gazing at the current target
   * @param positionX
   * @param positionY
   * @param positionZ
   * @param enableTransition
   * @category Methods
   */
  setPosition(e, t, s, n = !1) {
    return this.setLookAt(e, t, s, this._targetEnd.x, this._targetEnd.y, this._targetEnd.z, n);
  }
  /**
   * setLookAt without position, Stay still at the position.
   * @param targetX
   * @param targetY
   * @param targetZ
   * @param enableTransition
   * @category Methods
   */
  setTarget(e, t, s, n = !1) {
    const o = this.getPosition(S);
    return this.setLookAt(o.x, o.y, o.z, e, t, s, n);
  }
  /**
   * Set focal offset using the screen parallel coordinates. z doesn't affect in Orthographic as with Dolly.
   * @param x
   * @param y
   * @param z
   * @param enableTransition
   * @category Methods
   */
  setFocalOffset(e, t, s, n = !1) {
    this._focalOffsetEnd.set(e, t, s), this._needsUpdate = !0, n || this._focalOffset.copy(this._focalOffsetEnd);
    const o = !n || U(this._focalOffset.x, this._focalOffsetEnd.x, this.restThreshold) && U(this._focalOffset.y, this._focalOffsetEnd.y, this.restThreshold) && U(this._focalOffset.z, this._focalOffsetEnd.z, this.restThreshold);
    return this._createOnRestPromise(o);
  }
  /**
   * Set orbit point without moving the camera.
   * SHOULD NOT RUN DURING ANIMATIONS. `setOrbitPoint()` will immediately fix the positions.
   * @param targetX
   * @param targetY
   * @param targetZ
   * @category Methods
   */
  setOrbitPoint(e, t, s) {
    this._camera.updateMatrixWorld(), te.setFromMatrixColumn(this._camera.matrixWorldInverse, 0), se.setFromMatrixColumn(this._camera.matrixWorldInverse, 1), pe.setFromMatrixColumn(this._camera.matrixWorldInverse, 2);
    const n = S.set(e, t, s), o = n.distanceTo(this._camera.position), i = n.sub(this._camera.position);
    te.multiplyScalar(i.x), se.multiplyScalar(i.y), pe.multiplyScalar(i.z), S.copy(te).add(se).add(pe), S.z = S.z + o, this.dollyTo(o, !1), this.setFocalOffset(-S.x, S.y, -S.z, !1), this.moveTo(e, t, s, !1);
  }
  /**
   * Set the boundary box that encloses the target of the camera. box3 is in THREE.Box3
   * @param box3
   * @category Methods
   */
  setBoundary(e) {
    if (!e) {
      this._boundary.min.set(-1 / 0, -1 / 0, -1 / 0), this._boundary.max.set(1 / 0, 1 / 0, 1 / 0), this._needsUpdate = !0;
      return;
    }
    this._boundary.copy(e), this._boundary.clampPoint(this._targetEnd, this._targetEnd), this._needsUpdate = !0;
  }
  /**
   * Set (or unset) the current viewport.
   * Set this when you want to use renderer viewport and .dollyToCursor feature at the same time.
   * @param viewportOrX
   * @param y
   * @param width
   * @param height
   * @category Methods
   */
  setViewport(e, t, s, n) {
    if (e === null) {
      this._viewport = null;
      return;
    }
    this._viewport = this._viewport || new b.Vector4(), typeof e == "number" ? this._viewport.set(e, t, s, n) : this._viewport.copy(e);
  }
  /**
   * Calculate the distance to fit the box.
   * @param width box width
   * @param height box height
   * @param depth box depth
   * @returns distance
   * @category Methods
   */
  getDistanceToFitBox(e, t, s, n = !1) {
    if (We(this._camera, "getDistanceToFitBox"))
      return this._spherical.radius;
    const o = e / t, i = this._camera.getEffectiveFOV() * b.MathUtils.DEG2RAD, a = this._camera.aspect;
    return ((n ? o > a : o < a) ? t : e / a) * 0.5 / Math.tan(i * 0.5) + s * 0.5;
  }
  /**
   * Calculate the distance to fit the sphere.
   * @param radius sphere radius
   * @returns distance
   * @category Methods
   */
  getDistanceToFitSphere(e) {
    if (We(this._camera, "getDistanceToFitSphere"))
      return this._spherical.radius;
    const t = this._camera.getEffectiveFOV() * b.MathUtils.DEG2RAD, s = Math.atan(Math.tan(t * 0.5) * this._camera.aspect) * 2, n = 1 < this._camera.aspect ? t : s;
    return e / Math.sin(n * 0.5);
  }
  /**
   * Returns its current gazing target, which is the center position of the orbit.
   * @param out current gazing target
   * @category Methods
   */
  getTarget(e) {
    return (e && e.isVector3 ? e : new b.Vector3()).copy(this._targetEnd);
  }
  /**
   * Returns its current position.
   * @param out current position
   * @category Methods
   */
  getPosition(e) {
    return (e && e.isVector3 ? e : new b.Vector3()).setFromSpherical(this._sphericalEnd).applyQuaternion(this._yAxisUpSpaceInverse).add(this._targetEnd);
  }
  /**
   * Returns its current focal offset, which is how much the camera appears to be translated in screen parallel coordinates.
   * @param out current focal offset
   * @category Methods
   */
  getFocalOffset(e) {
    return (e && e.isVector3 ? e : new b.Vector3()).copy(this._focalOffsetEnd);
  }
  /**
   * Normalize camera azimuth angle rotation between 0 and 360 degrees.
   * @category Methods
   */
  normalizeRotations() {
    this._sphericalEnd.theta = this._sphericalEnd.theta % ye, this._sphericalEnd.theta < 0 && (this._sphericalEnd.theta += ye), this._spherical.theta += ye * Math.round((this._sphericalEnd.theta - this._spherical.theta) / ye);
  }
  /**
   * Reset all rotation and position to defaults.
   * @param enableTransition
   * @category Methods
   */
  reset(e = !1) {
    const t = [
      this.setLookAt(this._position0.x, this._position0.y, this._position0.z, this._target0.x, this._target0.y, this._target0.z, e),
      this.setFocalOffset(this._focalOffset0.x, this._focalOffset0.y, this._focalOffset0.z, e),
      this.zoomTo(this._zoom0, e)
    ];
    return Promise.all(t);
  }
  /**
   * Set current camera position as the default position.
   * @category Methods
   */
  saveState() {
    this.getTarget(this._target0), this.getPosition(this._position0), this._zoom0 = this._zoom, this._focalOffset0.copy(this._focalOffset);
  }
  /**
   * Sync camera-up direction.
   * When camera-up vector is changed, `.updateCameraUp()` must be called.
   * @category Methods
   */
  updateCameraUp() {
    this._yAxisUpSpace.setFromUnitVectors(this._camera.up, Ge), gt(this._yAxisUpSpaceInverse.copy(this._yAxisUpSpace));
  }
  /**
   * Update camera position and directions.
   * This should be called in your tick loop every time, and returns true if re-rendering is needed.
   * @param delta
   * @returns updated
   * @category Methods
   */
  update(e) {
    const t = this._state === m.NONE ? this.dampingFactor : this.draggingDampingFactor, s = Math.min(t * e * 60, 1), n = this._sphericalEnd.theta - this._spherical.theta, o = this._sphericalEnd.phi - this._spherical.phi, i = this._sphericalEnd.radius - this._spherical.radius, a = wt.subVectors(this._targetEnd, this._target), r = Tt.subVectors(this._focalOffsetEnd, this._focalOffset);
    if (!z(n) || !z(o) || !z(i) || !z(a.x) || !z(a.y) || !z(a.z) || !z(r.x) || !z(r.y) || !z(r.z) ? (this._spherical.set(this._spherical.radius + i * s, this._spherical.phi + o * s, this._spherical.theta + n * s), this._target.add(a.multiplyScalar(s)), this._focalOffset.add(r.multiplyScalar(s)), this._needsUpdate = !0) : (this._spherical.copy(this._sphericalEnd), this._target.copy(this._targetEnd), this._focalOffset.copy(this._focalOffsetEnd)), this._dollyControlAmount !== 0) {
      if (ue(this._camera)) {
        const p = this._camera, y = S.setFromSpherical(this._sphericalEnd).applyQuaternion(this._yAxisUpSpaceInverse).normalize().negate(), E = C.copy(y).cross(p.up).normalize();
        E.lengthSq() === 0 && (E.x = 1);
        const _ = we.crossVectors(E, y), g = this._sphericalEnd.radius * Math.tan(p.getEffectiveFOV() * b.MathUtils.DEG2RAD * 0.5), O = (this._sphericalEnd.radius - this._dollyControlAmount - this._sphericalEnd.radius) / this._sphericalEnd.radius, M = S.copy(this._targetEnd).add(E.multiplyScalar(this._dollyControlCoord.x * g * p.aspect)).add(_.multiplyScalar(this._dollyControlCoord.y * g));
        this._targetEnd.lerp(M, O);
      } else if (le(this._camera)) {
        const p = this._camera, y = p.getWorldDirection(S.clone()), E = this._targetEnd.x * y.x + this._targetEnd.y * y.y + this._targetEnd.z * y.z, _ = S.set(this._dollyControlCoord.x, this._dollyControlCoord.y, (p.near + p.far) / (p.near - p.far)).unproject(p), g = C.set(0, 0, -1).applyQuaternion(p.quaternion), w = we.copy(_).add(g.multiplyScalar(-_.dot(p.up))), M = -(this._zoom - this._dollyControlAmount - this._zoomEnd) / this._zoom;
        this._targetEnd.lerp(w, M);
        const f = this._targetEnd.x * y.x + this._targetEnd.y * y.y + this._targetEnd.z * y.z, R = y.multiplyScalar(f - E);
        this._targetEnd.sub(R);
      }
      this._target.copy(this._targetEnd), this._boundary.clampPoint(this._targetEnd, this._targetEnd), this._dollyControlAmount = 0;
    }
    const c = this._collisionTest();
    this._spherical.radius = Math.min(this._spherical.radius, c), this._spherical.makeSafe(), this._camera.position.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse).add(this._target), this._camera.lookAt(this._target), (!z(this._focalOffset.x) || !z(this._focalOffset.y) || !z(this._focalOffset.z)) && (this._camera.updateMatrix(), te.setFromMatrixColumn(this._camera.matrix, 0), se.setFromMatrixColumn(this._camera.matrix, 1), pe.setFromMatrixColumn(this._camera.matrix, 2), te.multiplyScalar(this._focalOffset.x), se.multiplyScalar(-this._focalOffset.y), pe.multiplyScalar(this._focalOffset.z), S.copy(te).add(se).add(pe), this._camera.position.add(S)), this._boundaryEnclosesCamera && this._encloseToBoundary(this._camera.position.copy(this._target), S.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse), 1);
    const l = this._zoomEnd - this._zoom;
    this._zoom += l * s, this._camera.zoom !== this._zoom && (z(l) && (this._zoom = this._zoomEnd), this._camera.zoom = this._zoom, this._camera.updateProjectionMatrix(), this._updateNearPlaneCorners(), this._needsUpdate = !0);
    const u = this._needsUpdate;
    return u && !this._updatedLastTime ? (this._hasRested = !1, this.dispatchEvent({ type: "wake" }), this.dispatchEvent({ type: "update" })) : u ? (this.dispatchEvent({ type: "update" }), z(n, this.restThreshold) && z(o, this.restThreshold) && z(i, this.restThreshold) && z(a.x, this.restThreshold) && z(a.y, this.restThreshold) && z(a.z, this.restThreshold) && z(r.x, this.restThreshold) && z(r.y, this.restThreshold) && z(r.z, this.restThreshold) && z(l, this.restThreshold) && !this._hasRested && (this._hasRested = !0, this.dispatchEvent({ type: "rest" }))) : !u && this._updatedLastTime && this.dispatchEvent({ type: "sleep" }), this._updatedLastTime = u, this._needsUpdate = !1, u;
  }
  /**
   * Get all state in JSON string
   * @category Methods
   */
  toJSON() {
    return JSON.stringify({
      enabled: this._enabled,
      minDistance: this.minDistance,
      maxDistance: Oe(this.maxDistance),
      minZoom: this.minZoom,
      maxZoom: Oe(this.maxZoom),
      minPolarAngle: this.minPolarAngle,
      maxPolarAngle: Oe(this.maxPolarAngle),
      minAzimuthAngle: Oe(this.minAzimuthAngle),
      maxAzimuthAngle: Oe(this.maxAzimuthAngle),
      dampingFactor: this.dampingFactor,
      draggingDampingFactor: this.draggingDampingFactor,
      dollySpeed: this.dollySpeed,
      truckSpeed: this.truckSpeed,
      dollyToCursor: this.dollyToCursor,
      verticalDragToForward: this.verticalDragToForward,
      target: this._targetEnd.toArray(),
      position: S.setFromSpherical(this._sphericalEnd).add(this._targetEnd).toArray(),
      zoom: this._zoomEnd,
      focalOffset: this._focalOffsetEnd.toArray(),
      target0: this._target0.toArray(),
      position0: this._position0.toArray(),
      zoom0: this._zoom0,
      focalOffset0: this._focalOffset0.toArray()
    });
  }
  /**
   * Reproduce the control state with JSON. enableTransition is where anim or not in a boolean.
   * @param json
   * @param enableTransition
   * @category Methods
   */
  fromJSON(e, t = !1) {
    const s = JSON.parse(e), n = S.fromArray(s.position);
    this.enabled = s.enabled, this.minDistance = s.minDistance, this.maxDistance = Me(s.maxDistance), this.minZoom = s.minZoom, this.maxZoom = Me(s.maxZoom), this.minPolarAngle = s.minPolarAngle, this.maxPolarAngle = Me(s.maxPolarAngle), this.minAzimuthAngle = Me(s.minAzimuthAngle), this.maxAzimuthAngle = Me(s.maxAzimuthAngle), this.dampingFactor = s.dampingFactor, this.draggingDampingFactor = s.draggingDampingFactor, this.dollySpeed = s.dollySpeed, this.truckSpeed = s.truckSpeed, this.dollyToCursor = s.dollyToCursor, this.verticalDragToForward = s.verticalDragToForward, this._target0.fromArray(s.target0), this._position0.fromArray(s.position0), this._zoom0 = s.zoom0, this._focalOffset0.fromArray(s.focalOffset0), this.moveTo(s.target[0], s.target[1], s.target[2], t), ee.setFromVector3(n.sub(this._targetEnd).applyQuaternion(this._yAxisUpSpace)), this.rotateTo(ee.theta, ee.phi, t), this.zoomTo(s.zoom, t), this.setFocalOffset(s.focalOffset[0], s.focalOffset[1], s.focalOffset[2], t), this._needsUpdate = !0;
  }
  /**
   * Dispose the cameraControls instance itself, remove all eventListeners.
   * @category Methods
   */
  dispose() {
    this._removeAllEventListeners();
  }
  _findPointerById(e) {
    let t = null;
    return this._activePointers.some((s) => s.pointerId === e ? (t = s, !0) : !1), t;
  }
  _encloseToBoundary(e, t, s) {
    const n = t.lengthSq();
    if (n === 0)
      return e;
    const o = C.copy(t).add(e), a = this._boundary.clampPoint(o, we).sub(o), r = a.lengthSq();
    if (r === 0)
      return e.add(t);
    if (r === n)
      return e;
    if (s === 0)
      return e.add(t).add(a);
    {
      const c = 1 + s * r / t.dot(a);
      return e.add(C.copy(t).multiplyScalar(c)).add(a.multiplyScalar(1 - s));
    }
  }
  _updateNearPlaneCorners() {
    if (ue(this._camera)) {
      const e = this._camera, t = e.near, s = e.getEffectiveFOV() * b.MathUtils.DEG2RAD, n = Math.tan(s * 0.5) * t, o = n * e.aspect;
      this._nearPlaneCorners[0].set(-o, -n, 0), this._nearPlaneCorners[1].set(o, -n, 0), this._nearPlaneCorners[2].set(o, n, 0), this._nearPlaneCorners[3].set(-o, n, 0);
    } else if (le(this._camera)) {
      const e = this._camera, t = 1 / e.zoom, s = e.left * t, n = e.right * t, o = e.top * t, i = e.bottom * t;
      this._nearPlaneCorners[0].set(s, o, 0), this._nearPlaneCorners[1].set(n, o, 0), this._nearPlaneCorners[2].set(n, i, 0), this._nearPlaneCorners[3].set(s, i, 0);
    }
  }
  // lateUpdate
  _collisionTest() {
    let e = 1 / 0;
    if (!(this.colliderMeshes.length >= 1) || We(this._camera, "_collisionTest"))
      return e;
    const s = S.setFromSpherical(this._spherical).divideScalar(this._spherical.radius);
    tt.lookAt(yt, s, this._camera.up);
    for (let n = 0; n < 4; n++) {
      const o = C.copy(this._nearPlaneCorners[n]);
      o.applyMatrix4(tt);
      const i = we.addVectors(this._target, o);
      Ve.set(i, s), Ve.far = this._spherical.radius + 1;
      const a = Ve.intersectObjects(this.colliderMeshes);
      a.length !== 0 && a[0].distance < e && (e = a[0].distance);
    }
    return e;
  }
  /**
   * Get its client rect and package into given `DOMRect` .
   */
  _getClientRect(e) {
    const t = this._domElement.getBoundingClientRect();
    return e.x = t.left, e.y = t.top, this._viewport ? (e.x += this._viewport.x, e.y += t.height - this._viewport.w - this._viewport.y, e.width = this._viewport.z, e.height = this._viewport.w) : (e.width = t.width, e.height = t.height), e;
  }
  _createOnRestPromise(e) {
    return e ? Promise.resolve() : (this._hasRested = !1, this.dispatchEvent({ type: "transitionstart" }), new Promise((t) => {
      const s = () => {
        this.removeEventListener("rest", s), t();
      };
      this.addEventListener("rest", s);
    }));
  }
  _removeAllEventListeners() {
  }
}
function as(d, e) {
  const t = e, s = t.center;
  Re.makeEmpty(), d.traverseVisible((o) => {
    o.isMesh && Re.expandByObject(o);
  }), Re.getCenter(s);
  let n = 0;
  return d.traverseVisible((o) => {
    if (!o.isMesh)
      return;
    const i = o, a = i.geometry.clone();
    if (a.applyMatrix4(i.matrixWorld), a.isBufferGeometry) {
      const c = a.attributes.position;
      for (let h = 0, l = c.count; h < l; h++)
        S.fromBufferAttribute(c, h), n = Math.max(n, s.distanceToSquared(S));
    } else {
      const r = a.attributes.position, c = new b.Vector3();
      for (let h = 0, l = r.count; h < l; h++)
        c.fromBufferAttribute(r, h), n = Math.max(n, s.distanceToSquared(c));
    }
  }), t.radius = Math.sqrt(n), t;
}
const cs = window.THREE.AnimationClip, hs = window.THREE.Bone, ls = window.THREE.Box3, st = window.THREE.BufferAttribute, ds = window.THREE.BufferGeometry, us = window.THREE.ClampToEdgeWrapping, ge = window.THREE.Color, ps = window.THREE.DirectionalLight, fs = window.THREE.DoubleSide, Vt = window.THREE.FileLoader, ms = window.THREE.FrontSide, nt = window.THREE.Group, _s = window.THREE.ImageBitmapLoader, gs = window.THREE.InstancedMesh, Es = window.THREE.InterleavedBuffer, ys = window.THREE.InterleavedBufferAttribute, ws = window.THREE.Interpolant, Ts = window.THREE.InterpolateDiscrete, Yt = window.THREE.InterpolateLinear, xs = window.THREE.Line, Rs = window.THREE.LineBasicMaterial, bs = window.THREE.LineLoop, Os = window.THREE.LineSegments, Xt = window.THREE.LinearFilter, jt = window.THREE.LinearMipmapLinearFilter, Ms = window.THREE.LinearMipmapNearestFilter, As = window.THREE.Loader, _e = window.THREE.LoaderUtils, it = window.THREE.Material, Ss = window.THREE.MathUtils, Qe = window.THREE.Matrix4, Ls = window.THREE.Mesh, Ie = window.THREE.MeshBasicMaterial, Ee = window.THREE.MeshPhysicalMaterial, Kt = window.THREE.MeshStandardMaterial, vs = window.THREE.MirroredRepeatWrapping, Ps = window.THREE.NearestFilter, Cs = window.THREE.NearestMipmapLinearFilter, Is = window.THREE.NearestMipmapNearestFilter, Hs = window.THREE.NumberKeyframeTrack, Zt = window.THREE.Object3D, Ds = window.THREE.OrthographicCamera, Fs = window.THREE.PerspectiveCamera, Ns = window.THREE.PointLight, Us = window.THREE.Points, zs = window.THREE.PointsMaterial, ks = window.THREE.PropertyBinding, Qt = window.THREE.Quaternion, bt = window.THREE.QuaternionKeyframeTrack, ht = window.THREE.RepeatWrapping, Bs = window.THREE.Skeleton, Gs = window.THREE.SkinnedMesh, Vs = window.THREE.Sphere, Ys = window.THREE.SpotLight, Ot = window.THREE.Texture, Xs = window.THREE.TextureLoader, qt = window.THREE.TriangleFanDrawMode, js = window.THREE.TriangleStripDrawMode, Wt = window.THREE.Vector2, xe = window.THREE.Vector3, Ks = window.THREE.VectorKeyframeTrack, Ne = window.THREE.sRGBEncoding;
class Zs extends As {
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new Js(t);
    }), this.register(function(t) {
      return new an(t);
    }), this.register(function(t) {
      return new cn(t);
    }), this.register(function(t) {
      return new tn(t);
    }), this.register(function(t) {
      return new sn(t);
    }), this.register(function(t) {
      return new nn(t);
    }), this.register(function(t) {
      return new on(t);
    }), this.register(function(t) {
      return new $s(t);
    }), this.register(function(t) {
      return new rn(t);
    }), this.register(function(t) {
      return new en(t);
    }), this.register(function(t) {
      return new qs(t);
    }), this.register(function(t) {
      return new hn(t);
    }), this.register(function(t) {
      return new ln(t);
    });
  }
  load(e, t, s, n) {
    const o = this;
    let i;
    this.resourcePath !== "" ? i = this.resourcePath : this.path !== "" ? i = this.path : i = _e.extractUrlBase(e), this.manager.itemStart(e);
    const a = function(c) {
      n ? n(c) : console.error(c), o.manager.itemError(e), o.manager.itemEnd(e);
    }, r = new Vt(this.manager);
    r.setPath(this.path), r.setResponseType("arraybuffer"), r.setRequestHeader(this.requestHeader), r.setWithCredentials(this.withCredentials), r.load(e, function(c) {
      try {
        o.parse(c, i, function(h) {
          t(h), o.manager.itemEnd(e);
        }, a);
      } catch (h) {
        a(h);
      }
    }, s, a);
  }
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  setDDSLoader() {
    throw new Error(
      'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'
    );
  }
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  parse(e, t, s, n) {
    let o;
    const i = {}, a = {};
    if (typeof e == "string")
      o = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (_e.decodeText(new Uint8Array(e, 0, 4)) === $t) {
        try {
          i[v.KHR_BINARY_GLTF] = new dn(e);
        } catch (h) {
          n && n(h);
          return;
        }
        o = JSON.parse(i[v.KHR_BINARY_GLTF].content);
      } else
        o = JSON.parse(_e.decodeText(new Uint8Array(e)));
    else
      o = e;
    if (o.asset === void 0 || o.asset.version[0] < 2) {
      n && n(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const r = new bn(o, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    r.fileLoader.setRequestHeader(this.requestHeader);
    for (let c = 0; c < this.pluginCallbacks.length; c++) {
      const h = this.pluginCallbacks[c](r);
      a[h.name] = h, i[h.name] = !0;
    }
    if (o.extensionsUsed)
      for (let c = 0; c < o.extensionsUsed.length; ++c) {
        const h = o.extensionsUsed[c], l = o.extensionsRequired || [];
        switch (h) {
          case v.KHR_MATERIALS_UNLIT:
            i[h] = new Ws();
            break;
          case v.KHR_DRACO_MESH_COMPRESSION:
            i[h] = new un(o, this.dracoLoader);
            break;
          case v.KHR_TEXTURE_TRANSFORM:
            i[h] = new pn();
            break;
          case v.KHR_MESH_QUANTIZATION:
            i[h] = new fn();
            break;
          default:
            l.indexOf(h) >= 0 && a[h] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + h + '".');
        }
      }
    r.setExtensions(i), r.setPlugins(a), r.parse(s, n);
  }
  parseAsync(e, t) {
    const s = this;
    return new Promise(function(n, o) {
      s.parse(e, t, n, o);
    });
  }
}
function Qs() {
  let d = {};
  return {
    get: function(e) {
      return d[e];
    },
    add: function(e, t) {
      d[e] = t;
    },
    remove: function(e) {
      delete d[e];
    },
    removeAll: function() {
      d = {};
    }
  };
}
const v = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class qs {
  constructor(e) {
    this.parser = e, this.name = v.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let s = 0, n = t.length; s < n; s++) {
      const o = t[s];
      o.extensions && o.extensions[this.name] && o.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, o.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, s = "light:" + e;
    let n = t.cache.get(s);
    if (n)
      return n;
    const o = t.json, r = ((o.extensions && o.extensions[this.name] || {}).lights || [])[e];
    let c;
    const h = new ge(16777215);
    r.color !== void 0 && h.fromArray(r.color);
    const l = r.range !== void 0 ? r.range : 0;
    switch (r.type) {
      case "directional":
        c = new ps(h), c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      case "point":
        c = new Ns(h), c.distance = l;
        break;
      case "spot":
        c = new Ys(h), c.distance = l, r.spot = r.spot || {}, r.spot.innerConeAngle = r.spot.innerConeAngle !== void 0 ? r.spot.innerConeAngle : 0, r.spot.outerConeAngle = r.spot.outerConeAngle !== void 0 ? r.spot.outerConeAngle : Math.PI / 4, c.angle = r.spot.outerConeAngle, c.penumbra = 1 - r.spot.innerConeAngle / r.spot.outerConeAngle, c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + r.type);
    }
    return c.position.set(0, 0, 0), c.decay = 2, de(c, r), r.intensity !== void 0 && (c.intensity = r.intensity), c.name = t.createUniqueName(r.name || "light_" + e), n = Promise.resolve(c), t.cache.add(s, n), n;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, s = this.parser, o = s.json.nodes[e], a = (o.extensions && o.extensions[this.name] || {}).light;
    return a === void 0 ? null : this._loadLight(a).then(function(r) {
      return s._getNodeRef(t.cache, a, r);
    });
  }
}
class Ws {
  constructor() {
    this.name = v.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return Ie;
  }
  extendParams(e, t, s) {
    const n = [];
    e.color = new ge(1, 1, 1), e.opacity = 1;
    const o = t.pbrMetallicRoughness;
    if (o) {
      if (Array.isArray(o.baseColorFactor)) {
        const i = o.baseColorFactor;
        e.color.fromArray(i), e.opacity = i[3];
      }
      o.baseColorTexture !== void 0 && n.push(s.assignTexture(e, "map", o.baseColorTexture, Ne));
    }
    return Promise.all(n);
  }
}
class $s {
  constructor(e) {
    this.parser = e, this.name = v.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const n = this.parser.json.materials[e];
    if (!n.extensions || !n.extensions[this.name])
      return Promise.resolve();
    const o = n.extensions[this.name].emissiveStrength;
    return o !== void 0 && (t.emissiveIntensity = o), Promise.resolve();
  }
}
class Js {
  constructor(e) {
    this.parser = e, this.name = v.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : Ee;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, n = s.json.materials[e];
    if (!n.extensions || !n.extensions[this.name])
      return Promise.resolve();
    const o = [], i = n.extensions[this.name];
    if (i.clearcoatFactor !== void 0 && (t.clearcoat = i.clearcoatFactor), i.clearcoatTexture !== void 0 && o.push(s.assignTexture(t, "clearcoatMap", i.clearcoatTexture)), i.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = i.clearcoatRoughnessFactor), i.clearcoatRoughnessTexture !== void 0 && o.push(s.assignTexture(t, "clearcoatRoughnessMap", i.clearcoatRoughnessTexture)), i.clearcoatNormalTexture !== void 0 && (o.push(s.assignTexture(t, "clearcoatNormalMap", i.clearcoatNormalTexture)), i.clearcoatNormalTexture.scale !== void 0)) {
      const a = i.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new Wt(a, a);
    }
    return Promise.all(o);
  }
}
class en {
  constructor(e) {
    this.parser = e, this.name = v.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : Ee;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, n = s.json.materials[e];
    if (!n.extensions || !n.extensions[this.name])
      return Promise.resolve();
    const o = [], i = n.extensions[this.name];
    return i.iridescenceFactor !== void 0 && (t.iridescence = i.iridescenceFactor), i.iridescenceTexture !== void 0 && o.push(s.assignTexture(t, "iridescenceMap", i.iridescenceTexture)), i.iridescenceIor !== void 0 && (t.iridescenceIOR = i.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), i.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = i.iridescenceThicknessMinimum), i.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = i.iridescenceThicknessMaximum), i.iridescenceThicknessTexture !== void 0 && o.push(s.assignTexture(t, "iridescenceThicknessMap", i.iridescenceThicknessTexture)), Promise.all(o);
  }
}
class tn {
  constructor(e) {
    this.parser = e, this.name = v.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : Ee;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, n = s.json.materials[e];
    if (!n.extensions || !n.extensions[this.name])
      return Promise.resolve();
    const o = [];
    t.sheenColor = new ge(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const i = n.extensions[this.name];
    return i.sheenColorFactor !== void 0 && t.sheenColor.fromArray(i.sheenColorFactor), i.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = i.sheenRoughnessFactor), i.sheenColorTexture !== void 0 && o.push(s.assignTexture(t, "sheenColorMap", i.sheenColorTexture, Ne)), i.sheenRoughnessTexture !== void 0 && o.push(s.assignTexture(t, "sheenRoughnessMap", i.sheenRoughnessTexture)), Promise.all(o);
  }
}
class sn {
  constructor(e) {
    this.parser = e, this.name = v.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : Ee;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, n = s.json.materials[e];
    if (!n.extensions || !n.extensions[this.name])
      return Promise.resolve();
    const o = [], i = n.extensions[this.name];
    return i.transmissionFactor !== void 0 && (t.transmission = i.transmissionFactor), i.transmissionTexture !== void 0 && o.push(s.assignTexture(t, "transmissionMap", i.transmissionTexture)), Promise.all(o);
  }
}
class nn {
  constructor(e) {
    this.parser = e, this.name = v.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : Ee;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, n = s.json.materials[e];
    if (!n.extensions || !n.extensions[this.name])
      return Promise.resolve();
    const o = [], i = n.extensions[this.name];
    t.thickness = i.thicknessFactor !== void 0 ? i.thicknessFactor : 0, i.thicknessTexture !== void 0 && o.push(s.assignTexture(t, "thicknessMap", i.thicknessTexture)), t.attenuationDistance = i.attenuationDistance || 1 / 0;
    const a = i.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new ge(a[0], a[1], a[2]), Promise.all(o);
  }
}
class on {
  constructor(e) {
    this.parser = e, this.name = v.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : Ee;
  }
  extendMaterialParams(e, t) {
    const n = this.parser.json.materials[e];
    if (!n.extensions || !n.extensions[this.name])
      return Promise.resolve();
    const o = n.extensions[this.name];
    return t.ior = o.ior !== void 0 ? o.ior : 1.5, Promise.resolve();
  }
}
class rn {
  constructor(e) {
    this.parser = e, this.name = v.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : Ee;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, n = s.json.materials[e];
    if (!n.extensions || !n.extensions[this.name])
      return Promise.resolve();
    const o = [], i = n.extensions[this.name];
    t.specularIntensity = i.specularFactor !== void 0 ? i.specularFactor : 1, i.specularTexture !== void 0 && o.push(s.assignTexture(t, "specularIntensityMap", i.specularTexture));
    const a = i.specularColorFactor || [1, 1, 1];
    return t.specularColor = new ge(a[0], a[1], a[2]), i.specularColorTexture !== void 0 && o.push(s.assignTexture(t, "specularColorMap", i.specularColorTexture, Ne)), Promise.all(o);
  }
}
class an {
  constructor(e) {
    this.parser = e, this.name = v.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, s = t.json, n = s.textures[e];
    if (!n.extensions || !n.extensions[this.name])
      return null;
    const o = n.extensions[this.name], i = t.options.ktx2Loader;
    if (!i) {
      if (s.extensionsRequired && s.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, o.source, i);
  }
}
class cn {
  constructor(e) {
    this.parser = e, this.name = v.EXT_TEXTURE_WEBP, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, s = this.parser, n = s.json, o = n.textures[e];
    if (!o.extensions || !o.extensions[t])
      return null;
    const i = o.extensions[t], a = n.images[i.source];
    let r = s.textureLoader;
    if (a.uri) {
      const c = s.options.manager.getHandler(a.uri);
      c !== null && (r = c);
    }
    return this.detectSupport().then(function(c) {
      if (c)
        return s.loadTextureImage(e, i.source, r);
      if (n.extensionsRequired && n.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
      return s.loadTexture(e);
    });
  }
  detectSupport() {
    return this.isSupported || (this.isSupported = new Promise(function(e) {
      const t = new Image();
      t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", t.onload = t.onerror = function() {
        e(t.height === 1);
      };
    })), this.isSupported;
  }
}
class hn {
  constructor(e) {
    this.name = v.EXT_MESHOPT_COMPRESSION, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, s = t.bufferViews[e];
    if (s.extensions && s.extensions[this.name]) {
      const n = s.extensions[this.name], o = this.parser.getDependency("buffer", n.buffer), i = this.parser.options.meshoptDecoder;
      if (!i || !i.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return o.then(function(a) {
        const r = n.byteOffset || 0, c = n.byteLength || 0, h = n.count, l = n.byteStride, u = new Uint8Array(a, r, c);
        return i.decodeGltfBufferAsync ? i.decodeGltfBufferAsync(h, l, u, n.mode, n.filter).then(function(p) {
          return p.buffer;
        }) : i.ready.then(function() {
          const p = new ArrayBuffer(h * l);
          return i.decodeGltfBuffer(new Uint8Array(p), h, l, u, n.mode, n.filter), p;
        });
      });
    } else
      return null;
  }
}
class ln {
  constructor(e) {
    this.name = v.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, s = t.nodes[e];
    if (!s.extensions || !s.extensions[this.name] || s.mesh === void 0)
      return null;
    const n = t.meshes[s.mesh];
    for (const c of n.primitives)
      if (c.mode !== J.TRIANGLES && c.mode !== J.TRIANGLE_STRIP && c.mode !== J.TRIANGLE_FAN && c.mode !== void 0)
        return null;
    const i = s.extensions[this.name].attributes, a = [], r = {};
    for (const c in i)
      a.push(this.parser.getDependency("accessor", i[c]).then((h) => (r[c] = h, r[c])));
    return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((c) => {
      const h = c.pop(), l = h.isGroup ? h.children : [h], u = c[0].count, p = [];
      for (const y of l) {
        const E = new Qe(), _ = new xe(), g = new Qt(), w = new xe(1, 1, 1), O = new gs(y.geometry, y.material, u);
        for (let M = 0; M < u; M++)
          r.TRANSLATION && _.fromBufferAttribute(r.TRANSLATION, M), r.ROTATION && g.fromBufferAttribute(r.ROTATION, M), r.SCALE && w.fromBufferAttribute(r.SCALE, M), O.setMatrixAt(M, E.compose(_, g, w));
        for (const M in r)
          M !== "TRANSLATION" && M !== "ROTATION" && M !== "SCALE" && y.geometry.setAttribute(M, r[M]);
        Zt.prototype.copy.call(O, y), O.frustumCulled = !1, this.parser.assignFinalMaterial(O), p.push(O);
      }
      return h.isGroup ? (h.clear(), h.add(...p), h) : p[0];
    }));
  }
}
const $t = "glTF", Se = 12, Mt = { JSON: 1313821514, BIN: 5130562 };
class dn {
  constructor(e) {
    this.name = v.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, Se);
    if (this.header = {
      magic: _e.decodeText(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== $t)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const s = this.header.length - Se, n = new DataView(e, Se);
    let o = 0;
    for (; o < s; ) {
      const i = n.getUint32(o, !0);
      o += 4;
      const a = n.getUint32(o, !0);
      if (o += 4, a === Mt.JSON) {
        const r = new Uint8Array(e, Se + o, i);
        this.content = _e.decodeText(r);
      } else if (a === Mt.BIN) {
        const r = Se + o;
        this.body = e.slice(r, r + i);
      }
      o += i;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class un {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = v.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const s = this.json, n = this.dracoLoader, o = e.extensions[this.name].bufferView, i = e.extensions[this.name].attributes, a = {}, r = {}, c = {};
    for (const h in i) {
      const l = lt[h] || h.toLowerCase();
      a[l] = i[h];
    }
    for (const h in e.attributes) {
      const l = lt[h] || h.toLowerCase();
      if (i[h] !== void 0) {
        const u = s.accessors[e.attributes[h]], p = be[u.componentType];
        c[l] = p.name, r[l] = u.normalized === !0;
      }
    }
    return t.getDependency("bufferView", o).then(function(h) {
      return new Promise(function(l) {
        n.decodeDracoFile(h, function(u) {
          for (const p in u.attributes) {
            const y = u.attributes[p], E = r[p];
            E !== void 0 && (y.normalized = E);
          }
          l(u);
        }, a, c);
      });
    });
  }
}
class pn {
  constructor() {
    this.name = v.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return t.texCoord !== void 0 && console.warn('THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.'), t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}
class fn {
  constructor() {
    this.name = v.KHR_MESH_QUANTIZATION;
  }
}
class Jt extends ws {
  constructor(e, t, s, n) {
    super(e, t, s, n);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, s = this.sampleValues, n = this.valueSize, o = e * n * 3 + n;
    for (let i = 0; i !== n; i++)
      t[i] = s[o + i];
    return t;
  }
  interpolate_(e, t, s, n) {
    const o = this.resultBuffer, i = this.sampleValues, a = this.valueSize, r = a * 2, c = a * 3, h = n - t, l = (s - t) / h, u = l * l, p = u * l, y = e * c, E = y - c, _ = -2 * p + 3 * u, g = p - u, w = 1 - _, O = g - u + l;
    for (let M = 0; M !== a; M++) {
      const f = i[E + M + a], R = i[E + M + r] * h, x = i[y + M + a], L = i[y + M] * h;
      o[M] = w * f + O * R + _ * x + g * L;
    }
    return o;
  }
}
const mn = new Qt();
class _n extends Jt {
  interpolate_(e, t, s, n) {
    const o = super.interpolate_(e, t, s, n);
    return mn.fromArray(o).normalize().toArray(o), o;
  }
}
const J = {
  FLOAT: 5126,
  //FLOAT_MAT2: 35674,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  LINEAR: 9729,
  REPEAT: 10497,
  SAMPLER_2D: 35678,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  UNSIGNED_BYTE: 5121,
  UNSIGNED_SHORT: 5123
}, be = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, At = {
  9728: Ps,
  9729: Xt,
  9984: Is,
  9985: Ms,
  9986: Cs,
  9987: jt
}, St = {
  33071: us,
  33648: vs,
  10497: ht
}, ot = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, lt = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv2",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, ae = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, gn = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: Yt,
  STEP: Ts
}, rt = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function En(d) {
  return d.DefaultMaterial === void 0 && (d.DefaultMaterial = new Kt({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: ms
  })), d.DefaultMaterial;
}
function Le(d, e, t) {
  for (const s in t.extensions)
    d[s] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[s] = t.extensions[s]);
}
function de(d, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(d.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function yn(d, e, t) {
  let s = !1, n = !1, o = !1;
  for (let c = 0, h = e.length; c < h; c++) {
    const l = e[c];
    if (l.POSITION !== void 0 && (s = !0), l.NORMAL !== void 0 && (n = !0), l.COLOR_0 !== void 0 && (o = !0), s && n && o)
      break;
  }
  if (!s && !n && !o)
    return Promise.resolve(d);
  const i = [], a = [], r = [];
  for (let c = 0, h = e.length; c < h; c++) {
    const l = e[c];
    if (s) {
      const u = l.POSITION !== void 0 ? t.getDependency("accessor", l.POSITION) : d.attributes.position;
      i.push(u);
    }
    if (n) {
      const u = l.NORMAL !== void 0 ? t.getDependency("accessor", l.NORMAL) : d.attributes.normal;
      a.push(u);
    }
    if (o) {
      const u = l.COLOR_0 !== void 0 ? t.getDependency("accessor", l.COLOR_0) : d.attributes.color;
      r.push(u);
    }
  }
  return Promise.all([
    Promise.all(i),
    Promise.all(a),
    Promise.all(r)
  ]).then(function(c) {
    const h = c[0], l = c[1], u = c[2];
    return s && (d.morphAttributes.position = h), n && (d.morphAttributes.normal = l), o && (d.morphAttributes.color = u), d.morphTargetsRelative = !0, d;
  });
}
function wn(d, e) {
  if (d.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, s = e.weights.length; t < s; t++)
      d.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (d.morphTargetInfluences.length === t.length) {
      d.morphTargetDictionary = {};
      for (let s = 0, n = t.length; s < n; s++)
        d.morphTargetDictionary[t[s]] = s;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function Tn(d) {
  const e = d.extensions && d.extensions[v.KHR_DRACO_MESH_COMPRESSION];
  let t;
  return e ? t = "draco:" + e.bufferView + ":" + e.indices + ":" + Lt(e.attributes) : t = d.indices + ":" + Lt(d.attributes) + ":" + d.mode, t;
}
function Lt(d) {
  let e = "";
  const t = Object.keys(d).sort();
  for (let s = 0, n = t.length; s < n; s++)
    e += t[s] + ":" + d[t[s]] + ";";
  return e;
}
function dt(d) {
  switch (d) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function xn(d) {
  return d.search(/\.jpe?g($|\?)/i) > 0 || d.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : d.search(/\.webp($|\?)/i) > 0 || d.search(/^data\:image\/webp/) === 0 ? "image/webp" : "image/png";
}
const Rn = new Qe();
class bn {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Qs(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let s = !1, n = !1, o = -1;
    typeof navigator < "u" && (s = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === !0, n = navigator.userAgent.indexOf("Firefox") > -1, o = n ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1), typeof createImageBitmap > "u" || s || n && o < 98 ? this.textureLoader = new Xs(this.options.manager) : this.textureLoader = new _s(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new Vt(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const s = this, n = this.json, o = this.extensions;
    this.cache.removeAll(), this._invokeAll(function(i) {
      return i._markDefs && i._markDefs();
    }), Promise.all(this._invokeAll(function(i) {
      return i.beforeRoot && i.beforeRoot();
    })).then(function() {
      return Promise.all([
        s.getDependencies("scene"),
        s.getDependencies("animation"),
        s.getDependencies("camera")
      ]);
    }).then(function(i) {
      const a = {
        scene: i[0][n.scene || 0],
        scenes: i[0],
        animations: i[1],
        cameras: i[2],
        asset: n.asset,
        parser: s,
        userData: {}
      };
      Le(o, a, n), de(a, n), Promise.all(s._invokeAll(function(r) {
        return r.afterRoot && r.afterRoot(a);
      })).then(function() {
        e(a);
      });
    }).catch(t);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], s = this.json.meshes || [];
    for (let n = 0, o = t.length; n < o; n++) {
      const i = t[n].joints;
      for (let a = 0, r = i.length; a < r; a++)
        e[i[a]].isBone = !0;
    }
    for (let n = 0, o = e.length; n < o; n++) {
      const i = e[n];
      i.mesh !== void 0 && (this._addNodeRef(this.meshCache, i.mesh), i.skin !== void 0 && (s[i.mesh].isSkinnedMesh = !0)), i.camera !== void 0 && this._addNodeRef(this.cameraCache, i.camera);
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  /** Returns a reference to a shared resource, cloning it if necessary. */
  _getNodeRef(e, t, s) {
    if (e.refs[t] <= 1)
      return s;
    const n = s.clone(), o = (i, a) => {
      const r = this.associations.get(i);
      r != null && this.associations.set(a, r);
      for (const [c, h] of i.children.entries())
        o(h, a.children[c]);
    };
    return o(s, n), n.name += "_instance_" + e.uses[t]++, n;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let s = 0; s < t.length; s++) {
      const n = e(t[s]);
      if (n)
        return n;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const s = [];
    for (let n = 0; n < t.length; n++) {
      const o = e(t[n]);
      o && s.push(o);
    }
    return s;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(e, t) {
    const s = e + ":" + t;
    let n = this.cache.get(s);
    if (!n) {
      switch (e) {
        case "scene":
          n = this.loadScene(t);
          break;
        case "node":
          n = this._invokeOne(function(o) {
            return o.loadNode && o.loadNode(t);
          });
          break;
        case "mesh":
          n = this._invokeOne(function(o) {
            return o.loadMesh && o.loadMesh(t);
          });
          break;
        case "accessor":
          n = this.loadAccessor(t);
          break;
        case "bufferView":
          n = this._invokeOne(function(o) {
            return o.loadBufferView && o.loadBufferView(t);
          });
          break;
        case "buffer":
          n = this.loadBuffer(t);
          break;
        case "material":
          n = this._invokeOne(function(o) {
            return o.loadMaterial && o.loadMaterial(t);
          });
          break;
        case "texture":
          n = this._invokeOne(function(o) {
            return o.loadTexture && o.loadTexture(t);
          });
          break;
        case "skin":
          n = this.loadSkin(t);
          break;
        case "animation":
          n = this._invokeOne(function(o) {
            return o.loadAnimation && o.loadAnimation(t);
          });
          break;
        case "camera":
          n = this.loadCamera(t);
          break;
        default:
          if (n = this._invokeOne(function(o) {
            return o != this && o.getDependency && o.getDependency(e, t);
          }), !n)
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(s, n);
    }
    return n;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const s = this, n = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(n.map(function(o, i) {
        return s.getDependency(e, i);
      })), this.cache.add(e, t);
    }
    return t;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(e) {
    const t = this.json.buffers[e], s = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[v.KHR_BINARY_GLTF].body);
    const n = this.options;
    return new Promise(function(o, i) {
      s.load(_e.resolveURL(t.uri, n.path), o, void 0, function() {
        i(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(s) {
      const n = t.byteLength || 0, o = t.byteOffset || 0;
      return s.slice(o, o + n);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(e) {
    const t = this, s = this.json, n = this.json.accessors[e];
    if (n.bufferView === void 0 && n.sparse === void 0) {
      const i = ot[n.type], a = be[n.componentType], r = n.normalized === !0, c = new a(n.count * i);
      return Promise.resolve(new st(c, i, r));
    }
    const o = [];
    return n.bufferView !== void 0 ? o.push(this.getDependency("bufferView", n.bufferView)) : o.push(null), n.sparse !== void 0 && (o.push(this.getDependency("bufferView", n.sparse.indices.bufferView)), o.push(this.getDependency("bufferView", n.sparse.values.bufferView))), Promise.all(o).then(function(i) {
      const a = i[0], r = ot[n.type], c = be[n.componentType], h = c.BYTES_PER_ELEMENT, l = h * r, u = n.byteOffset || 0, p = n.bufferView !== void 0 ? s.bufferViews[n.bufferView].byteStride : void 0, y = n.normalized === !0;
      let E, _;
      if (p && p !== l) {
        const g = Math.floor(u / p), w = "InterleavedBuffer:" + n.bufferView + ":" + n.componentType + ":" + g + ":" + n.count;
        let O = t.cache.get(w);
        O || (E = new c(a, g * p, n.count * p / h), O = new Es(E, p / h), t.cache.add(w, O)), _ = new ys(O, r, u % p / h, y);
      } else
        a === null ? E = new c(n.count * r) : E = new c(a, u, n.count * r), _ = new st(E, r, y);
      if (n.sparse !== void 0) {
        const g = ot.SCALAR, w = be[n.sparse.indices.componentType], O = n.sparse.indices.byteOffset || 0, M = n.sparse.values.byteOffset || 0, f = new w(i[1], O, n.sparse.count * g), R = new c(i[2], M, n.sparse.count * r);
        a !== null && (_ = new st(_.array.slice(), _.itemSize, _.normalized));
        for (let x = 0, L = f.length; x < L; x++) {
          const N = f[x];
          if (_.setX(N, R[x * r]), r >= 2 && _.setY(N, R[x * r + 1]), r >= 3 && _.setZ(N, R[x * r + 2]), r >= 4 && _.setW(N, R[x * r + 3]), r >= 5)
            throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
      }
      return _;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture|null>}
   */
  loadTexture(e) {
    const t = this.json, s = this.options, o = t.textures[e].source, i = t.images[o];
    let a = this.textureLoader;
    if (i.uri) {
      const r = s.manager.getHandler(i.uri);
      r !== null && (a = r);
    }
    return this.loadTextureImage(e, o, a);
  }
  loadTextureImage(e, t, s) {
    const n = this, o = this.json, i = o.textures[e], a = o.images[t], r = (a.uri || a.bufferView) + ":" + i.sampler;
    if (this.textureCache[r])
      return this.textureCache[r];
    const c = this.loadImageSource(t, s).then(function(h) {
      h.flipY = !1, h.name = i.name || a.name || "";
      const u = (o.samplers || {})[i.sampler] || {};
      return h.magFilter = At[u.magFilter] || Xt, h.minFilter = At[u.minFilter] || jt, h.wrapS = St[u.wrapS] || ht, h.wrapT = St[u.wrapT] || ht, n.associations.set(h, { textures: e }), h;
    }).catch(function() {
      return null;
    });
    return this.textureCache[r] = c, c;
  }
  loadImageSource(e, t) {
    const s = this, n = this.json, o = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((l) => l.clone());
    const i = n.images[e], a = self.URL || self.webkitURL;
    let r = i.uri || "", c = !1;
    if (i.bufferView !== void 0)
      r = s.getDependency("bufferView", i.bufferView).then(function(l) {
        c = !0;
        const u = new Blob([l], { type: i.mimeType });
        return r = a.createObjectURL(u), r;
      });
    else if (i.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const h = Promise.resolve(r).then(function(l) {
      return new Promise(function(u, p) {
        let y = u;
        t.isImageBitmapLoader === !0 && (y = function(E) {
          const _ = new Ot(E);
          _.needsUpdate = !0, u(_);
        }), t.load(_e.resolveURL(l, o.path), y, void 0, p);
      });
    }).then(function(l) {
      return c === !0 && a.revokeObjectURL(r), l.userData.mimeType = i.mimeType || xn(i.uri), l;
    }).catch(function(l) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", r), l;
    });
    return this.sourceCache[e] = h, h;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @return {Promise<Texture>}
   */
  assignTexture(e, t, s, n) {
    const o = this;
    return this.getDependency("texture", s.index).then(function(i) {
      if (!i)
        return null;
      if (s.texCoord !== void 0 && s.texCoord != 0 && !(t === "aoMap" && s.texCoord == 1) && console.warn("THREE.GLTFLoader: Custom UV set " + s.texCoord + " for texture " + t + " not yet supported."), o.extensions[v.KHR_TEXTURE_TRANSFORM]) {
        const a = s.extensions !== void 0 ? s.extensions[v.KHR_TEXTURE_TRANSFORM] : void 0;
        if (a) {
          const r = o.associations.get(i);
          i = o.extensions[v.KHR_TEXTURE_TRANSFORM].extendTexture(i, a), o.associations.set(i, r);
        }
      }
      return n !== void 0 && (i.encoding = n), e[t] = i, i;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   * @param  {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(e) {
    const t = e.geometry;
    let s = e.material;
    const n = t.attributes.tangent === void 0, o = t.attributes.color !== void 0, i = t.attributes.normal === void 0;
    if (e.isPoints) {
      const a = "PointsMaterial:" + s.uuid;
      let r = this.cache.get(a);
      r || (r = new zs(), it.prototype.copy.call(r, s), r.color.copy(s.color), r.map = s.map, r.sizeAttenuation = !1, this.cache.add(a, r)), s = r;
    } else if (e.isLine) {
      const a = "LineBasicMaterial:" + s.uuid;
      let r = this.cache.get(a);
      r || (r = new Rs(), it.prototype.copy.call(r, s), r.color.copy(s.color), this.cache.add(a, r)), s = r;
    }
    if (n || o || i) {
      let a = "ClonedMaterial:" + s.uuid + ":";
      n && (a += "derivative-tangents:"), o && (a += "vertex-colors:"), i && (a += "flat-shading:");
      let r = this.cache.get(a);
      r || (r = s.clone(), o && (r.vertexColors = !0), i && (r.flatShading = !0), n && (r.normalScale && (r.normalScale.y *= -1), r.clearcoatNormalScale && (r.clearcoatNormalScale.y *= -1)), this.cache.add(a, r), this.associations.set(r, this.associations.get(s))), s = r;
    }
    s.aoMap && t.attributes.uv2 === void 0 && t.attributes.uv !== void 0 && t.setAttribute("uv2", t.attributes.uv), e.material = s;
  }
  getMaterialType() {
    return Kt;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(e) {
    const t = this, s = this.json, n = this.extensions, o = s.materials[e];
    let i;
    const a = {}, r = o.extensions || {}, c = [];
    if (r[v.KHR_MATERIALS_UNLIT]) {
      const l = n[v.KHR_MATERIALS_UNLIT];
      i = l.getMaterialType(), c.push(l.extendParams(a, o, t));
    } else {
      const l = o.pbrMetallicRoughness || {};
      if (a.color = new ge(1, 1, 1), a.opacity = 1, Array.isArray(l.baseColorFactor)) {
        const u = l.baseColorFactor;
        a.color.fromArray(u), a.opacity = u[3];
      }
      l.baseColorTexture !== void 0 && c.push(t.assignTexture(a, "map", l.baseColorTexture, Ne)), a.metalness = l.metallicFactor !== void 0 ? l.metallicFactor : 1, a.roughness = l.roughnessFactor !== void 0 ? l.roughnessFactor : 1, l.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(a, "metalnessMap", l.metallicRoughnessTexture)), c.push(t.assignTexture(a, "roughnessMap", l.metallicRoughnessTexture))), i = this._invokeOne(function(u) {
        return u.getMaterialType && u.getMaterialType(e);
      }), c.push(Promise.all(this._invokeAll(function(u) {
        return u.extendMaterialParams && u.extendMaterialParams(e, a);
      })));
    }
    o.doubleSided === !0 && (a.side = fs);
    const h = o.alphaMode || rt.OPAQUE;
    if (h === rt.BLEND ? (a.transparent = !0, a.depthWrite = !1) : (a.transparent = !1, h === rt.MASK && (a.alphaTest = o.alphaCutoff !== void 0 ? o.alphaCutoff : 0.5)), o.normalTexture !== void 0 && i !== Ie && (c.push(t.assignTexture(a, "normalMap", o.normalTexture)), a.normalScale = new Wt(1, 1), o.normalTexture.scale !== void 0)) {
      const l = o.normalTexture.scale;
      a.normalScale.set(l, l);
    }
    return o.occlusionTexture !== void 0 && i !== Ie && (c.push(t.assignTexture(a, "aoMap", o.occlusionTexture)), o.occlusionTexture.strength !== void 0 && (a.aoMapIntensity = o.occlusionTexture.strength)), o.emissiveFactor !== void 0 && i !== Ie && (a.emissive = new ge().fromArray(o.emissiveFactor)), o.emissiveTexture !== void 0 && i !== Ie && c.push(t.assignTexture(a, "emissiveMap", o.emissiveTexture, Ne)), Promise.all(c).then(function() {
      const l = new i(a);
      return o.name && (l.name = o.name), de(l, o), t.associations.set(l, { materials: e }), o.extensions && Le(n, l, o), l;
    });
  }
  /** When Object3D instances are targeted by animation, they need unique names. */
  createUniqueName(e) {
    const t = ks.sanitizeNodeName(e || "");
    let s = t;
    for (let n = 1; this.nodeNamesUsed[s]; ++n)
      s = t + "_" + n;
    return this.nodeNamesUsed[s] = !0, s;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(e) {
    const t = this, s = this.extensions, n = this.primitiveCache;
    function o(a) {
      return s[v.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a, t).then(function(r) {
        return vt(r, a, t);
      });
    }
    const i = [];
    for (let a = 0, r = e.length; a < r; a++) {
      const c = e[a], h = Tn(c), l = n[h];
      if (l)
        i.push(l.promise);
      else {
        let u;
        c.extensions && c.extensions[v.KHR_DRACO_MESH_COMPRESSION] ? u = o(c) : u = vt(new ds(), c, t), n[h] = { primitive: c, promise: u }, i.push(u);
      }
    }
    return Promise.all(i);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */
  loadMesh(e) {
    const t = this, s = this.json, n = this.extensions, o = s.meshes[e], i = o.primitives, a = [];
    for (let r = 0, c = i.length; r < c; r++) {
      const h = i[r].material === void 0 ? En(this.cache) : this.getDependency("material", i[r].material);
      a.push(h);
    }
    return a.push(t.loadGeometries(i)), Promise.all(a).then(function(r) {
      const c = r.slice(0, r.length - 1), h = r[r.length - 1], l = [];
      for (let p = 0, y = h.length; p < y; p++) {
        const E = h[p], _ = i[p];
        let g;
        const w = c[p];
        if (_.mode === J.TRIANGLES || _.mode === J.TRIANGLE_STRIP || _.mode === J.TRIANGLE_FAN || _.mode === void 0)
          g = o.isSkinnedMesh === !0 ? new Gs(E, w) : new Ls(E, w), g.isSkinnedMesh === !0 && !g.geometry.attributes.skinWeight.normalized && g.normalizeSkinWeights(), _.mode === J.TRIANGLE_STRIP ? g.geometry = Pt(g.geometry, js) : _.mode === J.TRIANGLE_FAN && (g.geometry = Pt(g.geometry, qt));
        else if (_.mode === J.LINES)
          g = new Os(E, w);
        else if (_.mode === J.LINE_STRIP)
          g = new xs(E, w);
        else if (_.mode === J.LINE_LOOP)
          g = new bs(E, w);
        else if (_.mode === J.POINTS)
          g = new Us(E, w);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + _.mode);
        Object.keys(g.geometry.morphAttributes).length > 0 && wn(g, o), g.name = t.createUniqueName(o.name || "mesh_" + e), de(g, o), _.extensions && Le(n, g, _), t.assignFinalMaterial(g), l.push(g);
      }
      for (let p = 0, y = l.length; p < y; p++)
        t.associations.set(l[p], {
          meshes: e,
          primitives: p
        });
      if (l.length === 1)
        return l[0];
      const u = new nt();
      t.associations.set(u, { meshes: e });
      for (let p = 0, y = l.length; p < y; p++)
        u.add(l[p]);
      return u;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera(e) {
    let t;
    const s = this.json.cameras[e], n = s[s.type];
    if (!n) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return s.type === "perspective" ? t = new Fs(Ss.radToDeg(n.yfov), n.aspectRatio || 1, n.znear || 1, n.zfar || 2e6) : s.type === "orthographic" && (t = new Ds(-n.xmag, n.xmag, n.ymag, -n.ymag, n.znear, n.zfar)), s.name && (t.name = this.createUniqueName(s.name)), de(t, s), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(e) {
    const t = this.json.skins[e], s = [];
    for (let n = 0, o = t.joints.length; n < o; n++)
      s.push(this.getDependency("node", t.joints[n]));
    return t.inverseBindMatrices !== void 0 ? s.push(this.getDependency("accessor", t.inverseBindMatrices)) : s.push(null), Promise.all(s).then(function(n) {
      const o = n.pop(), i = n, a = [], r = [];
      for (let c = 0, h = i.length; c < h; c++) {
        const l = i[c];
        if (l) {
          a.push(l);
          const u = new Qe();
          o !== null && u.fromArray(o.array, c * 16), r.push(u);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c]);
      }
      return new Bs(a, r);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(e) {
    const s = this.json.animations[e], n = [], o = [], i = [], a = [], r = [];
    for (let c = 0, h = s.channels.length; c < h; c++) {
      const l = s.channels[c], u = s.samplers[l.sampler], p = l.target, y = p.node, E = s.parameters !== void 0 ? s.parameters[u.input] : u.input, _ = s.parameters !== void 0 ? s.parameters[u.output] : u.output;
      n.push(this.getDependency("node", y)), o.push(this.getDependency("accessor", E)), i.push(this.getDependency("accessor", _)), a.push(u), r.push(p);
    }
    return Promise.all([
      Promise.all(n),
      Promise.all(o),
      Promise.all(i),
      Promise.all(a),
      Promise.all(r)
    ]).then(function(c) {
      const h = c[0], l = c[1], u = c[2], p = c[3], y = c[4], E = [];
      for (let g = 0, w = h.length; g < w; g++) {
        const O = h[g], M = l[g], f = u[g], R = p[g], x = y[g];
        if (O === void 0)
          continue;
        O.updateMatrix();
        let L;
        switch (ae[x.path]) {
          case ae.weights:
            L = Hs;
            break;
          case ae.rotation:
            L = bt;
            break;
          case ae.position:
          case ae.scale:
          default:
            L = Ks;
            break;
        }
        const N = O.name ? O.name : O.uuid, I = R.interpolation !== void 0 ? gn[R.interpolation] : Yt, $ = [];
        ae[x.path] === ae.weights ? O.traverse(function(D) {
          D.morphTargetInfluences && $.push(D.name ? D.name : D.uuid);
        }) : $.push(N);
        let V = f.array;
        if (f.normalized) {
          const D = dt(V.constructor), X = new Float32Array(V.length);
          for (let B = 0, oe = V.length; B < oe; B++)
            X[B] = V[B] * D;
          V = X;
        }
        for (let D = 0, X = $.length; D < X; D++) {
          const B = new L(
            $[D] + "." + ae[x.path],
            M.array,
            V,
            I
          );
          R.interpolation === "CUBICSPLINE" && (B.createInterpolant = function(j) {
            const re = this instanceof bt ? _n : Jt;
            return new re(this.times, this.values, this.getValueSize() / 3, j);
          }, B.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0), E.push(B);
        }
      }
      const _ = s.name ? s.name : "animation_" + e;
      return new cs(_, void 0, E);
    });
  }
  createNodeMesh(e) {
    const t = this.json, s = this, n = t.nodes[e];
    return n.mesh === void 0 ? null : s.getDependency("mesh", n.mesh).then(function(o) {
      const i = s._getNodeRef(s.meshCache, n.mesh, o);
      return n.weights !== void 0 && i.traverse(function(a) {
        if (a.isMesh)
          for (let r = 0, c = n.weights.length; r < c; r++)
            a.morphTargetInfluences[r] = n.weights[r];
      }), i;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(e) {
    const t = this.json, s = this.extensions, n = this, o = t.nodes[e], i = o.name ? n.createUniqueName(o.name) : "";
    return function() {
      const a = [], r = n._invokeOne(function(u) {
        return u.createNodeMesh && u.createNodeMesh(e);
      });
      r && a.push(r), o.camera !== void 0 && a.push(n.getDependency("camera", o.camera).then(function(u) {
        return n._getNodeRef(n.cameraCache, o.camera, u);
      })), n._invokeAll(function(u) {
        return u.createNodeAttachment && u.createNodeAttachment(e);
      }).forEach(function(u) {
        a.push(u);
      });
      const c = [], h = o.children || [];
      for (let u = 0, p = h.length; u < p; u++)
        c.push(n.getDependency("node", h[u]));
      const l = o.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", o.skin);
      return Promise.all([
        Promise.all(a),
        Promise.all(c),
        l
      ]);
    }().then(function(a) {
      const r = a[0], c = a[1], h = a[2];
      let l;
      if (o.isBone === !0 ? l = new hs() : r.length > 1 ? l = new nt() : r.length === 1 ? l = r[0] : l = new Zt(), l !== r[0])
        for (let u = 0, p = r.length; u < p; u++)
          l.add(r[u]);
      if (o.name && (l.userData.name = o.name, l.name = i), de(l, o), o.extensions && Le(s, l, o), o.matrix !== void 0) {
        const u = new Qe();
        u.fromArray(o.matrix), l.applyMatrix4(u);
      } else
        o.translation !== void 0 && l.position.fromArray(o.translation), o.rotation !== void 0 && l.quaternion.fromArray(o.rotation), o.scale !== void 0 && l.scale.fromArray(o.scale);
      n.associations.has(l) || n.associations.set(l, {}), n.associations.get(l).nodes = e, h !== null && l.traverse(function(u) {
        u.isSkinnedMesh && u.bind(h, Rn);
      });
      for (let u = 0, p = c.length; u < p; u++)
        l.add(c[u]);
      return l;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(e) {
    const t = this.extensions, s = this.json.scenes[e], n = this, o = new nt();
    s.name && (o.name = n.createUniqueName(s.name)), de(o, s), s.extensions && Le(t, o, s);
    const i = s.nodes || [], a = [];
    for (let r = 0, c = i.length; r < c; r++)
      a.push(n.getDependency("node", i[r]));
    return Promise.all(a).then(function(r) {
      for (let h = 0, l = r.length; h < l; h++)
        o.add(r[h]);
      const c = (h) => {
        const l = /* @__PURE__ */ new Map();
        for (const [u, p] of n.associations)
          (u instanceof it || u instanceof Ot) && l.set(u, p);
        return h.traverse((u) => {
          const p = n.associations.get(u);
          p != null && l.set(u, p);
        }), l;
      };
      return n.associations = c(o), o;
    });
  }
}
function On(d, e, t) {
  const s = e.attributes, n = new ls();
  if (s.POSITION !== void 0) {
    const a = t.json.accessors[s.POSITION], r = a.min, c = a.max;
    if (r !== void 0 && c !== void 0) {
      if (n.set(
        new xe(r[0], r[1], r[2]),
        new xe(c[0], c[1], c[2])
      ), a.normalized) {
        const h = dt(be[a.componentType]);
        n.min.multiplyScalar(h), n.max.multiplyScalar(h);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const o = e.targets;
  if (o !== void 0) {
    const a = new xe(), r = new xe();
    for (let c = 0, h = o.length; c < h; c++) {
      const l = o[c];
      if (l.POSITION !== void 0) {
        const u = t.json.accessors[l.POSITION], p = u.min, y = u.max;
        if (p !== void 0 && y !== void 0) {
          if (r.setX(Math.max(Math.abs(p[0]), Math.abs(y[0]))), r.setY(Math.max(Math.abs(p[1]), Math.abs(y[1]))), r.setZ(Math.max(Math.abs(p[2]), Math.abs(y[2]))), u.normalized) {
            const E = dt(be[u.componentType]);
            r.multiplyScalar(E);
          }
          a.max(r);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    n.expandByVector(a);
  }
  d.boundingBox = n;
  const i = new Vs();
  n.getCenter(i.center), i.radius = n.min.distanceTo(n.max) / 2, d.boundingSphere = i;
}
function vt(d, e, t) {
  const s = e.attributes, n = [];
  function o(i, a) {
    return t.getDependency("accessor", i).then(function(r) {
      d.setAttribute(a, r);
    });
  }
  for (const i in s) {
    const a = lt[i] || i.toLowerCase();
    a in d.attributes || n.push(o(s[i], a));
  }
  if (e.indices !== void 0 && !d.index) {
    const i = t.getDependency("accessor", e.indices).then(function(a) {
      d.setIndex(a);
    });
    n.push(i);
  }
  return de(d, e), On(d, e, t), Promise.all(n).then(function() {
    return e.targets !== void 0 ? yn(d, e.targets, t) : d;
  });
}
function Pt(d, e) {
  let t = d.getIndex();
  if (t === null) {
    const i = [], a = d.getAttribute("position");
    if (a !== void 0) {
      for (let r = 0; r < a.count; r++)
        i.push(r);
      d.setIndex(i), t = d.getIndex();
    } else
      return console.error("THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), d;
  }
  const s = t.count - 2, n = [];
  if (e === qt)
    for (let i = 1; i <= s; i++)
      n.push(t.getX(0)), n.push(t.getX(i)), n.push(t.getX(i + 1));
  else
    for (let i = 0; i < s; i++)
      i % 2 === 0 ? (n.push(t.getX(i)), n.push(t.getX(i + 1)), n.push(t.getX(i + 2))) : (n.push(t.getX(i + 2)), n.push(t.getX(i + 1)), n.push(t.getX(i)));
  n.length / 3 !== s && console.error("THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
  const o = d.clone();
  return o.setIndex(n), o;
}
const K = window.THREE.BoxGeometry, Ct = window.THREE.BufferGeometry, q = window.THREE.CylinderGeometry, Mn = window.THREE.DoubleSide, An = window.THREE.Euler, It = window.THREE.Float32BufferAttribute, ce = window.THREE.Line, Sn = window.THREE.LineBasicMaterial, es = window.THREE.Matrix4, T = window.THREE.Mesh, ts = window.THREE.MeshBasicMaterial, ut = window.THREE.Object3D, Ye = window.THREE.OctahedronGeometry, Ln = window.THREE.PlaneGeometry, ie = window.THREE.Quaternion, vn = window.THREE.Raycaster, Pn = window.THREE.SphereGeometry, ve = window.THREE.TorusGeometry, P = window.THREE.Vector3, fe = new vn(), W = new P(), he = new P(), k = new ie(), Ht = {
  X: new P(1, 0, 0),
  Y: new P(0, 1, 0),
  Z: new P(0, 0, 1)
}, at = { type: "change" }, Dt = { type: "mouseDown" }, Ft = { type: "mouseUp", mode: null }, Nt = { type: "objectChange" };
class Cn extends ut {
  constructor(e, t) {
    super(), t === void 0 && (console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.'), t = document), this.isTransformControls = !0, this.visible = !1, this.domElement = t, this.domElement.style.touchAction = "none";
    const s = new Un();
    this._gizmo = s, this.add(s);
    const n = new zn();
    this._plane = n, this.add(n);
    const o = this;
    function i(w, O) {
      let M = O;
      Object.defineProperty(o, w, {
        get: function() {
          return M !== void 0 ? M : O;
        },
        set: function(f) {
          M !== f && (M = f, n[w] = f, s[w] = f, o.dispatchEvent({ type: w + "-changed", value: f }), o.dispatchEvent(at));
        }
      }), o[w] = O, n[w] = O, s[w] = O;
    }
    i("camera", e), i("object", void 0), i("enabled", !0), i("axis", null), i("mode", "translate"), i("translationSnap", null), i("rotationSnap", null), i("scaleSnap", null), i("space", "world"), i("size", 1), i("dragging", !1), i("showX", !0), i("showY", !0), i("showZ", !0);
    const a = new P(), r = new P(), c = new ie(), h = new ie(), l = new P(), u = new ie(), p = new P(), y = new P(), E = new P(), _ = 0, g = new P();
    i("worldPosition", a), i("worldPositionStart", r), i("worldQuaternion", c), i("worldQuaternionStart", h), i("cameraPosition", l), i("cameraQuaternion", u), i("pointStart", p), i("pointEnd", y), i("rotationAxis", E), i("rotationAngle", _), i("eye", g), this._offset = new P(), this._startNorm = new P(), this._endNorm = new P(), this._cameraScale = new P(), this._parentPosition = new P(), this._parentQuaternion = new ie(), this._parentQuaternionInv = new ie(), this._parentScale = new P(), this._worldScaleStart = new P(), this._worldQuaternionInv = new ie(), this._worldScale = new P(), this._positionStart = new P(), this._quaternionStart = new ie(), this._scaleStart = new P(), this._getPointer = In.bind(this), this._onPointerDown = Dn.bind(this), this._onPointerHover = Hn.bind(this), this._onPointerMove = Fn.bind(this), this._onPointerUp = Nn.bind(this), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointermove", this._onPointerHover), this.domElement.addEventListener("pointerup", this._onPointerUp);
  }
  // updateMatrixWorld  updates key transformation variables
  updateMatrixWorld() {
    this.object !== void 0 && (this.object.updateMatrixWorld(), this.object.parent === null ? console.error("TransformControls: The attached 3D object must be a part of the scene graph.") : this.object.parent.matrixWorld.decompose(this._parentPosition, this._parentQuaternion, this._parentScale), this.object.matrixWorld.decompose(this.worldPosition, this.worldQuaternion, this._worldScale), this._parentQuaternionInv.copy(this._parentQuaternion).invert(), this._worldQuaternionInv.copy(this.worldQuaternion).invert()), this.camera.updateMatrixWorld(), this.camera.matrixWorld.decompose(this.cameraPosition, this.cameraQuaternion, this._cameraScale), this.camera.isOrthographicCamera ? this.camera.getWorldDirection(this.eye).negate() : this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(), super.updateMatrixWorld(this);
  }
  pointerHover(e) {
    if (this.object === void 0 || this.dragging === !0)
      return;
    fe.setFromCamera(e, this.camera);
    const t = ct(this._gizmo.picker[this.mode], fe);
    t ? this.axis = t.object.name : this.axis = null;
  }
  pointerDown(e) {
    if (!(this.object === void 0 || this.dragging === !0 || e.button !== 0) && this.axis !== null) {
      fe.setFromCamera(e, this.camera);
      const t = ct(this._plane, fe, !0);
      t && (this.object.updateMatrixWorld(), this.object.parent.updateMatrixWorld(), this._positionStart.copy(this.object.position), this._quaternionStart.copy(this.object.quaternion), this._scaleStart.copy(this.object.scale), this.object.matrixWorld.decompose(this.worldPositionStart, this.worldQuaternionStart, this._worldScaleStart), this.pointStart.copy(t.point).sub(this.worldPositionStart)), this.dragging = !0, Dt.mode = this.mode, this.dispatchEvent(Dt);
    }
  }
  pointerMove(e) {
    const t = this.axis, s = this.mode, n = this.object;
    let o = this.space;
    if (s === "scale" ? o = "local" : (t === "E" || t === "XYZE" || t === "XYZ") && (o = "world"), n === void 0 || t === null || this.dragging === !1 || e.button !== -1)
      return;
    fe.setFromCamera(e, this.camera);
    const i = ct(this._plane, fe, !0);
    if (i) {
      if (this.pointEnd.copy(i.point).sub(this.worldPositionStart), s === "translate")
        this._offset.copy(this.pointEnd).sub(this.pointStart), o === "local" && t !== "XYZ" && this._offset.applyQuaternion(this._worldQuaternionInv), t.indexOf("X") === -1 && (this._offset.x = 0), t.indexOf("Y") === -1 && (this._offset.y = 0), t.indexOf("Z") === -1 && (this._offset.z = 0), o === "local" && t !== "XYZ" ? this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale) : this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale), n.position.copy(this._offset).add(this._positionStart), this.translationSnap && (o === "local" && (n.position.applyQuaternion(k.copy(this._quaternionStart).invert()), t.search("X") !== -1 && (n.position.x = Math.round(n.position.x / this.translationSnap) * this.translationSnap), t.search("Y") !== -1 && (n.position.y = Math.round(n.position.y / this.translationSnap) * this.translationSnap), t.search("Z") !== -1 && (n.position.z = Math.round(n.position.z / this.translationSnap) * this.translationSnap), n.position.applyQuaternion(this._quaternionStart)), o === "world" && (n.parent && n.position.add(W.setFromMatrixPosition(n.parent.matrixWorld)), t.search("X") !== -1 && (n.position.x = Math.round(n.position.x / this.translationSnap) * this.translationSnap), t.search("Y") !== -1 && (n.position.y = Math.round(n.position.y / this.translationSnap) * this.translationSnap), t.search("Z") !== -1 && (n.position.z = Math.round(n.position.z / this.translationSnap) * this.translationSnap), n.parent && n.position.sub(W.setFromMatrixPosition(n.parent.matrixWorld))));
      else if (s === "scale") {
        if (t.search("XYZ") !== -1) {
          let a = this.pointEnd.length() / this.pointStart.length();
          this.pointEnd.dot(this.pointStart) < 0 && (a *= -1), he.set(a, a, a);
        } else
          W.copy(this.pointStart), he.copy(this.pointEnd), W.applyQuaternion(this._worldQuaternionInv), he.applyQuaternion(this._worldQuaternionInv), he.divide(W), t.search("X") === -1 && (he.x = 1), t.search("Y") === -1 && (he.y = 1), t.search("Z") === -1 && (he.z = 1);
        n.scale.copy(this._scaleStart).multiply(he), this.scaleSnap && (t.search("X") !== -1 && (n.scale.x = Math.round(n.scale.x / this.scaleSnap) * this.scaleSnap || this.scaleSnap), t.search("Y") !== -1 && (n.scale.y = Math.round(n.scale.y / this.scaleSnap) * this.scaleSnap || this.scaleSnap), t.search("Z") !== -1 && (n.scale.z = Math.round(n.scale.z / this.scaleSnap) * this.scaleSnap || this.scaleSnap));
      } else if (s === "rotate") {
        this._offset.copy(this.pointEnd).sub(this.pointStart);
        const a = 20 / this.worldPosition.distanceTo(W.setFromMatrixPosition(this.camera.matrixWorld));
        t === "E" ? (this.rotationAxis.copy(this.eye), this.rotationAngle = this.pointEnd.angleTo(this.pointStart), this._startNorm.copy(this.pointStart).normalize(), this._endNorm.copy(this.pointEnd).normalize(), this.rotationAngle *= this._endNorm.cross(this._startNorm).dot(this.eye) < 0 ? 1 : -1) : t === "XYZE" ? (this.rotationAxis.copy(this._offset).cross(this.eye).normalize(), this.rotationAngle = this._offset.dot(W.copy(this.rotationAxis).cross(this.eye)) * a) : (t === "X" || t === "Y" || t === "Z") && (this.rotationAxis.copy(Ht[t]), W.copy(Ht[t]), o === "local" && W.applyQuaternion(this.worldQuaternion), this.rotationAngle = this._offset.dot(W.cross(this.eye).normalize()) * a), this.rotationSnap && (this.rotationAngle = Math.round(this.rotationAngle / this.rotationSnap) * this.rotationSnap), o === "local" && t !== "E" && t !== "XYZE" ? (n.quaternion.copy(this._quaternionStart), n.quaternion.multiply(k.setFromAxisAngle(this.rotationAxis, this.rotationAngle)).normalize()) : (this.rotationAxis.applyQuaternion(this._parentQuaternionInv), n.quaternion.copy(k.setFromAxisAngle(this.rotationAxis, this.rotationAngle)), n.quaternion.multiply(this._quaternionStart).normalize());
      }
      this.dispatchEvent(at), this.dispatchEvent(Nt);
    }
  }
  pointerUp(e) {
    e.button === 0 && (this.dragging && this.axis !== null && (Ft.mode = this.mode, this.dispatchEvent(Ft)), this.dragging = !1, this.axis = null);
  }
  dispose() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerHover), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.traverse(function(e) {
      e.geometry && e.geometry.dispose(), e.material && e.material.dispose();
    });
  }
  // Set current object
  attach(e) {
    return this.object = e, this.visible = !0, this;
  }
  // Detach from object
  detach() {
    return this.object = void 0, this.visible = !1, this.axis = null, this;
  }
  reset() {
    this.enabled && this.dragging && (this.object.position.copy(this._positionStart), this.object.quaternion.copy(this._quaternionStart), this.object.scale.copy(this._scaleStart), this.dispatchEvent(at), this.dispatchEvent(Nt), this.pointStart.copy(this.pointEnd));
  }
  getRaycaster() {
    return fe;
  }
  // TODO: deprecate
  getMode() {
    return this.mode;
  }
  setMode(e) {
    this.mode = e;
  }
  setTranslationSnap(e) {
    this.translationSnap = e;
  }
  setRotationSnap(e) {
    this.rotationSnap = e;
  }
  setScaleSnap(e) {
    this.scaleSnap = e;
  }
  setSize(e) {
    this.size = e;
  }
  setSpace(e) {
    this.space = e;
  }
}
function In(d) {
  if (this.domElement.ownerDocument.pointerLockElement)
    return {
      x: 0,
      y: 0,
      button: d.button
    };
  {
    const e = this.domElement.getBoundingClientRect();
    return {
      x: (d.clientX - e.left) / e.width * 2 - 1,
      y: -(d.clientY - e.top) / e.height * 2 + 1,
      button: d.button
    };
  }
}
function Hn(d) {
  if (this.enabled)
    switch (d.pointerType) {
      case "mouse":
      case "pen":
        this.pointerHover(this._getPointer(d));
        break;
    }
}
function Dn(d) {
  this.enabled && (document.pointerLockElement || this.domElement.setPointerCapture(d.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.pointerHover(this._getPointer(d)), this.pointerDown(this._getPointer(d)));
}
function Fn(d) {
  this.enabled && this.pointerMove(this._getPointer(d));
}
function Nn(d) {
  this.enabled && (this.domElement.releasePointerCapture(d.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.pointerUp(this._getPointer(d)));
}
function ct(d, e, t) {
  const s = e.intersectObject(d, !0);
  for (let n = 0; n < s.length; n++)
    if (s[n].object.visible || t)
      return s[n];
  return !1;
}
const Xe = new An(), H = new P(0, 1, 0), Ut = new P(0, 0, 0), zt = new es(), je = new ie(), Ze = new ie(), ne = new P(), kt = new es(), He = new P(1, 0, 0), me = new P(0, 1, 0), De = new P(0, 0, 1), Ke = new P(), Pe = new P(), Ce = new P();
class Un extends ut {
  constructor() {
    super(), this.isTransformControlsGizmo = !0, this.type = "TransformControlsGizmo";
    const e = new ts({
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      toneMapped: !1,
      transparent: !0
    }), t = new Sn({
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      toneMapped: !1,
      transparent: !0
    }), s = e.clone();
    s.opacity = 0.15;
    const n = t.clone();
    n.opacity = 0.5;
    const o = e.clone();
    o.color.setHex(16711680);
    const i = e.clone();
    i.color.setHex(65280);
    const a = e.clone();
    a.color.setHex(255);
    const r = e.clone();
    r.color.setHex(16711680), r.opacity = 0.5;
    const c = e.clone();
    c.color.setHex(65280), c.opacity = 0.5;
    const h = e.clone();
    h.color.setHex(255), h.opacity = 0.5;
    const l = e.clone();
    l.opacity = 0.25;
    const u = e.clone();
    u.color.setHex(16776960), u.opacity = 0.25, e.clone().color.setHex(16776960);
    const y = e.clone();
    y.color.setHex(7895160);
    const E = new q(0, 0.04, 0.1, 12);
    E.translate(0, 0.05, 0);
    const _ = new K(0.08, 0.08, 0.08);
    _.translate(0, 0.04, 0);
    const g = new Ct();
    g.setAttribute("position", new It([0, 0, 0, 1, 0, 0], 3));
    const w = new q(75e-4, 75e-4, 0.5, 3);
    w.translate(0, 0.25, 0);
    function O(B, oe) {
      const j = new ve(B, 75e-4, 3, 64, oe * Math.PI * 2);
      return j.rotateY(Math.PI / 2), j.rotateX(Math.PI / 2), j;
    }
    function M() {
      const B = new Ct();
      return B.setAttribute("position", new It([0, 0, 0, 1, 1, 1], 3)), B;
    }
    const f = {
      X: [
        [new T(E, o), [0.5, 0, 0], [0, 0, -Math.PI / 2]],
        [new T(E, o), [-0.5, 0, 0], [0, 0, Math.PI / 2]],
        [new T(w, o), [0, 0, 0], [0, 0, -Math.PI / 2]]
      ],
      Y: [
        [new T(E, i), [0, 0.5, 0]],
        [new T(E, i), [0, -0.5, 0], [Math.PI, 0, 0]],
        [new T(w, i)]
      ],
      Z: [
        [new T(E, a), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
        [new T(E, a), [0, 0, -0.5], [-Math.PI / 2, 0, 0]],
        [new T(w, a), null, [Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new T(new Ye(0.1, 0), l.clone()), [0, 0, 0]]
      ],
      XY: [
        [new T(new K(0.15, 0.15, 0.01), h.clone()), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new T(new K(0.15, 0.15, 0.01), r.clone()), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new T(new K(0.15, 0.15, 0.01), c.clone()), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ]
    }, R = {
      X: [
        [new T(new q(0.2, 0, 0.6, 4), s), [0.3, 0, 0], [0, 0, -Math.PI / 2]],
        [new T(new q(0.2, 0, 0.6, 4), s), [-0.3, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new T(new q(0.2, 0, 0.6, 4), s), [0, 0.3, 0]],
        [new T(new q(0.2, 0, 0.6, 4), s), [0, -0.3, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new T(new q(0.2, 0, 0.6, 4), s), [0, 0, 0.3], [Math.PI / 2, 0, 0]],
        [new T(new q(0.2, 0, 0.6, 4), s), [0, 0, -0.3], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new T(new Ye(0.2, 0), s)]
      ],
      XY: [
        [new T(new K(0.2, 0.2, 0.01), s), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new T(new K(0.2, 0.2, 0.01), s), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new T(new K(0.2, 0.2, 0.01), s), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ]
    }, x = {
      START: [
        [new T(new Ye(0.01, 2), n), null, null, null, "helper"]
      ],
      END: [
        [new T(new Ye(0.01, 2), n), null, null, null, "helper"]
      ],
      DELTA: [
        [new ce(M(), n), null, null, null, "helper"]
      ],
      X: [
        [new ce(g, n.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ],
      Y: [
        [new ce(g, n.clone()), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], "helper"]
      ],
      Z: [
        [new ce(g, n.clone()), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], "helper"]
      ]
    }, L = {
      XYZE: [
        [new T(O(0.5, 1), y), null, [0, Math.PI / 2, 0]]
      ],
      X: [
        [new T(O(0.5, 0.5), o)]
      ],
      Y: [
        [new T(O(0.5, 0.5), i), null, [0, 0, -Math.PI / 2]]
      ],
      Z: [
        [new T(O(0.5, 0.5), a), null, [0, Math.PI / 2, 0]]
      ],
      E: [
        [new T(O(0.75, 1), u), null, [0, Math.PI / 2, 0]]
      ]
    }, N = {
      AXIS: [
        [new ce(g, n.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ]
    }, I = {
      XYZE: [
        [new T(new Pn(0.25, 10, 8), s)]
      ],
      X: [
        [new T(new ve(0.5, 0.1, 4, 24), s), [0, 0, 0], [0, -Math.PI / 2, -Math.PI / 2]]
      ],
      Y: [
        [new T(new ve(0.5, 0.1, 4, 24), s), [0, 0, 0], [Math.PI / 2, 0, 0]]
      ],
      Z: [
        [new T(new ve(0.5, 0.1, 4, 24), s), [0, 0, 0], [0, 0, -Math.PI / 2]]
      ],
      E: [
        [new T(new ve(0.75, 0.1, 2, 24), s)]
      ]
    }, $ = {
      X: [
        [new T(_, o), [0.5, 0, 0], [0, 0, -Math.PI / 2]],
        [new T(w, o), [0, 0, 0], [0, 0, -Math.PI / 2]],
        [new T(_, o), [-0.5, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new T(_, i), [0, 0.5, 0]],
        [new T(w, i)],
        [new T(_, i), [0, -0.5, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new T(_, a), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
        [new T(w, a), [0, 0, 0], [Math.PI / 2, 0, 0]],
        [new T(_, a), [0, 0, -0.5], [-Math.PI / 2, 0, 0]]
      ],
      XY: [
        [new T(new K(0.15, 0.15, 0.01), h), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new T(new K(0.15, 0.15, 0.01), r), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new T(new K(0.15, 0.15, 0.01), c), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new T(new K(0.1, 0.1, 0.1), l.clone())]
      ]
    }, V = {
      X: [
        [new T(new q(0.2, 0, 0.6, 4), s), [0.3, 0, 0], [0, 0, -Math.PI / 2]],
        [new T(new q(0.2, 0, 0.6, 4), s), [-0.3, 0, 0], [0, 0, Math.PI / 2]]
      ],
      Y: [
        [new T(new q(0.2, 0, 0.6, 4), s), [0, 0.3, 0]],
        [new T(new q(0.2, 0, 0.6, 4), s), [0, -0.3, 0], [0, 0, Math.PI]]
      ],
      Z: [
        [new T(new q(0.2, 0, 0.6, 4), s), [0, 0, 0.3], [Math.PI / 2, 0, 0]],
        [new T(new q(0.2, 0, 0.6, 4), s), [0, 0, -0.3], [-Math.PI / 2, 0, 0]]
      ],
      XY: [
        [new T(new K(0.2, 0.2, 0.01), s), [0.15, 0.15, 0]]
      ],
      YZ: [
        [new T(new K(0.2, 0.2, 0.01), s), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]
      ],
      XZ: [
        [new T(new K(0.2, 0.2, 0.01), s), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]
      ],
      XYZ: [
        [new T(new K(0.2, 0.2, 0.2), s), [0, 0, 0]]
      ]
    }, D = {
      X: [
        [new ce(g, n.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]
      ],
      Y: [
        [new ce(g, n.clone()), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], "helper"]
      ],
      Z: [
        [new ce(g, n.clone()), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], "helper"]
      ]
    };
    function X(B) {
      const oe = new ut();
      for (const j in B)
        for (let re = B[j].length; re--; ) {
          const Z = B[j][re][0].clone(), Ue = B[j][re][1], ze = B[j][re][2], ke = B[j][re][3], ss = B[j][re][4];
          Z.name = j, Z.tag = ss, Ue && Z.position.set(Ue[0], Ue[1], Ue[2]), ze && Z.rotation.set(ze[0], ze[1], ze[2]), ke && Z.scale.set(ke[0], ke[1], ke[2]), Z.updateMatrix();
          const ft = Z.geometry.clone();
          ft.applyMatrix4(Z.matrix), Z.geometry = ft, Z.renderOrder = 1 / 0, Z.position.set(0, 0, 0), Z.rotation.set(0, 0, 0), Z.scale.set(1, 1, 1), oe.add(Z);
        }
      return oe;
    }
    this.gizmo = {}, this.picker = {}, this.helper = {}, this.add(this.gizmo.translate = X(f)), this.add(this.gizmo.rotate = X(L)), this.add(this.gizmo.scale = X($)), this.add(this.picker.translate = X(R)), this.add(this.picker.rotate = X(I)), this.add(this.picker.scale = X(V)), this.add(this.helper.translate = X(x)), this.add(this.helper.rotate = X(N)), this.add(this.helper.scale = X(D)), this.picker.translate.visible = !1, this.picker.rotate.visible = !1, this.picker.scale.visible = !1;
  }
  // updateMatrixWorld will update transformations and appearance of individual handles
  updateMatrixWorld(e) {
    const s = (this.mode === "scale" ? "local" : this.space) === "local" ? this.worldQuaternion : Ze;
    this.gizmo.translate.visible = this.mode === "translate", this.gizmo.rotate.visible = this.mode === "rotate", this.gizmo.scale.visible = this.mode === "scale", this.helper.translate.visible = this.mode === "translate", this.helper.rotate.visible = this.mode === "rotate", this.helper.scale.visible = this.mode === "scale";
    let n = [];
    n = n.concat(this.picker[this.mode].children), n = n.concat(this.gizmo[this.mode].children), n = n.concat(this.helper[this.mode].children);
    for (let o = 0; o < n.length; o++) {
      const i = n[o];
      i.visible = !0, i.rotation.set(0, 0, 0), i.position.copy(this.worldPosition);
      let a;
      if (this.camera.isOrthographicCamera ? a = (this.camera.top - this.camera.bottom) / this.camera.zoom : a = this.worldPosition.distanceTo(this.cameraPosition) * Math.min(1.9 * Math.tan(Math.PI * this.camera.fov / 360) / this.camera.zoom, 7), i.scale.set(1, 1, 1).multiplyScalar(a * this.size / 4), i.tag === "helper") {
        i.visible = !1, i.name === "AXIS" ? (i.visible = !!this.axis, this.axis === "X" && (k.setFromEuler(Xe.set(0, 0, 0)), i.quaternion.copy(s).multiply(k), Math.abs(H.copy(He).applyQuaternion(s).dot(this.eye)) > 0.9 && (i.visible = !1)), this.axis === "Y" && (k.setFromEuler(Xe.set(0, 0, Math.PI / 2)), i.quaternion.copy(s).multiply(k), Math.abs(H.copy(me).applyQuaternion(s).dot(this.eye)) > 0.9 && (i.visible = !1)), this.axis === "Z" && (k.setFromEuler(Xe.set(0, Math.PI / 2, 0)), i.quaternion.copy(s).multiply(k), Math.abs(H.copy(De).applyQuaternion(s).dot(this.eye)) > 0.9 && (i.visible = !1)), this.axis === "XYZE" && (k.setFromEuler(Xe.set(0, Math.PI / 2, 0)), H.copy(this.rotationAxis), i.quaternion.setFromRotationMatrix(zt.lookAt(Ut, H, me)), i.quaternion.multiply(k), i.visible = this.dragging), this.axis === "E" && (i.visible = !1)) : i.name === "START" ? (i.position.copy(this.worldPositionStart), i.visible = this.dragging) : i.name === "END" ? (i.position.copy(this.worldPosition), i.visible = this.dragging) : i.name === "DELTA" ? (i.position.copy(this.worldPositionStart), i.quaternion.copy(this.worldQuaternionStart), W.set(1e-10, 1e-10, 1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1), W.applyQuaternion(this.worldQuaternionStart.clone().invert()), i.scale.copy(W), i.visible = this.dragging) : (i.quaternion.copy(s), this.dragging ? i.position.copy(this.worldPositionStart) : i.position.copy(this.worldPosition), this.axis && (i.visible = this.axis.search(i.name) !== -1));
        continue;
      }
      i.quaternion.copy(s), this.mode === "translate" || this.mode === "scale" ? (i.name === "X" && Math.abs(H.copy(He).applyQuaternion(s).dot(this.eye)) > 0.99 && (i.scale.set(1e-10, 1e-10, 1e-10), i.visible = !1), i.name === "Y" && Math.abs(H.copy(me).applyQuaternion(s).dot(this.eye)) > 0.99 && (i.scale.set(1e-10, 1e-10, 1e-10), i.visible = !1), i.name === "Z" && Math.abs(H.copy(De).applyQuaternion(s).dot(this.eye)) > 0.99 && (i.scale.set(1e-10, 1e-10, 1e-10), i.visible = !1), i.name === "XY" && Math.abs(H.copy(De).applyQuaternion(s).dot(this.eye)) < 0.2 && (i.scale.set(1e-10, 1e-10, 1e-10), i.visible = !1), i.name === "YZ" && Math.abs(H.copy(He).applyQuaternion(s).dot(this.eye)) < 0.2 && (i.scale.set(1e-10, 1e-10, 1e-10), i.visible = !1), i.name === "XZ" && Math.abs(H.copy(me).applyQuaternion(s).dot(this.eye)) < 0.2 && (i.scale.set(1e-10, 1e-10, 1e-10), i.visible = !1)) : this.mode === "rotate" && (je.copy(s), H.copy(this.eye).applyQuaternion(k.copy(s).invert()), i.name.search("E") !== -1 && i.quaternion.setFromRotationMatrix(zt.lookAt(this.eye, Ut, me)), i.name === "X" && (k.setFromAxisAngle(He, Math.atan2(-H.y, H.z)), k.multiplyQuaternions(je, k), i.quaternion.copy(k)), i.name === "Y" && (k.setFromAxisAngle(me, Math.atan2(H.x, H.z)), k.multiplyQuaternions(je, k), i.quaternion.copy(k)), i.name === "Z" && (k.setFromAxisAngle(De, Math.atan2(H.y, H.x)), k.multiplyQuaternions(je, k), i.quaternion.copy(k))), i.visible = i.visible && (i.name.indexOf("X") === -1 || this.showX), i.visible = i.visible && (i.name.indexOf("Y") === -1 || this.showY), i.visible = i.visible && (i.name.indexOf("Z") === -1 || this.showZ), i.visible = i.visible && (i.name.indexOf("E") === -1 || this.showX && this.showY && this.showZ), i.material._color = i.material._color || i.material.color.clone(), i.material._opacity = i.material._opacity || i.material.opacity, i.material.color.copy(i.material._color), i.material.opacity = i.material._opacity, this.enabled && this.axis && (i.name === this.axis || this.axis.split("").some(function(r) {
        return i.name === r;
      })) && (i.material.color.setHex(16776960), i.material.opacity = 1);
    }
    super.updateMatrixWorld(e);
  }
}
class zn extends T {
  constructor() {
    super(
      new Ln(1e5, 1e5, 2, 2),
      new ts({ visible: !1, wireframe: !0, side: Mn, transparent: !0, opacity: 0.1, toneMapped: !1 })
    ), this.isTransformControlsPlane = !0, this.type = "TransformControlsPlane";
  }
  updateMatrixWorld(e) {
    let t = this.space;
    switch (this.position.copy(this.worldPosition), this.mode === "scale" && (t = "local"), Ke.copy(He).applyQuaternion(t === "local" ? this.worldQuaternion : Ze), Pe.copy(me).applyQuaternion(t === "local" ? this.worldQuaternion : Ze), Ce.copy(De).applyQuaternion(t === "local" ? this.worldQuaternion : Ze), H.copy(Pe), this.mode) {
      case "translate":
      case "scale":
        switch (this.axis) {
          case "X":
            H.copy(this.eye).cross(Ke), ne.copy(Ke).cross(H);
            break;
          case "Y":
            H.copy(this.eye).cross(Pe), ne.copy(Pe).cross(H);
            break;
          case "Z":
            H.copy(this.eye).cross(Ce), ne.copy(Ce).cross(H);
            break;
          case "XY":
            ne.copy(Ce);
            break;
          case "YZ":
            ne.copy(Ke);
            break;
          case "XZ":
            H.copy(Ce), ne.copy(Pe);
            break;
          case "XYZ":
          case "E":
            ne.set(0, 0, 0);
            break;
        }
        break;
      case "rotate":
      default:
        ne.set(0, 0, 0);
    }
    ne.length() === 0 ? this.quaternion.copy(this.cameraQuaternion) : (kt.lookAt(W.set(0, 0, 0), ne, H), this.quaternion.setFromRotationMatrix(kt)), super.updateMatrixWorld(e);
  }
}
const Y = window.THREE, pt = class extends Y.Mesh {
  constructor(t, s) {
    super(t);
    A(this, "isReflector");
    A(this, "camera");
    A(this, "getRenderTarget");
    A(this, "dispose");
    this.isReflector = !0, this.type = "Reflector", this.camera = new Y.PerspectiveCamera();
    const n = this, o = s.color !== void 0 ? new Y.Color(s.color) : new Y.Color(8355711), i = s.textureWidth || 512, a = s.opacity || 1, r = s.textureHeight || 512, c = s.clipBias || 0, h = s.shader || pt.ReflectorShader, l = s.multisample !== void 0 ? s.multisample : 4, u = new Y.Plane(), p = new Y.Vector3(), y = new Y.Vector3(), E = new Y.Vector3(), _ = new Y.Matrix4(), g = new Y.Vector3(0, 0, -1), w = new Y.Vector4(), O = new Y.Vector3(), M = new Y.Vector3(), f = new Y.Vector4(), R = new Y.Matrix4(), x = this.camera, L = new Y.WebGLRenderTarget(
      i,
      r,
      {
        samples: l
      }
    ), N = new Y.ShaderMaterial({
      uniforms: UniformsUtils.clone(h.uniforms),
      fragmentShader: h.fragmentShader,
      vertexShader: h.vertexShader
    });
    N.uniforms.tDiffuse.value = L.texture, N.uniforms.color.value = o, N.uniforms.textureMatrix.value = R, N.uniforms.opacity.value = a, this.material = N, this.onBeforeRender = function(I, $, V) {
      if (y.setFromMatrixPosition(n.matrixWorld), E.setFromMatrixPosition(V.matrixWorld), _.extractRotation(n.matrixWorld), p.set(0, 0, 1), p.applyMatrix4(_), O.subVectors(y, E), O.dot(p) > 0)
        return;
      O.reflect(p).negate(), O.add(y), _.extractRotation(V.matrixWorld), g.set(0, 0, -1), g.applyMatrix4(_), g.add(E), M.subVectors(y, g), M.reflect(p).negate(), M.add(y), x.position.copy(O), x.up.set(0, 1, 0), x.up.applyMatrix4(_), x.up.reflect(p), x.lookAt(M), x.far = V.far, x.updateMatrixWorld(), x.projectionMatrix.copy(V.projectionMatrix), R.set(
        0.5,
        0,
        0,
        0.5,
        0,
        0.5,
        0,
        0.5,
        0,
        0,
        0.5,
        0.5,
        0,
        0,
        0,
        1
      ), R.multiply(x.projectionMatrix), R.multiply(x.matrixWorldInverse), R.multiply(n.matrixWorld), u.setFromNormalAndCoplanarPoint(
        p,
        y
      ), u.applyMatrix4(x.matrixWorldInverse), w.set(
        u.normal.x,
        u.normal.y,
        u.normal.z,
        u.constant
      );
      const D = x.projectionMatrix;
      f.x = (Math.sign(w.x) + D.elements[8]) / D.elements[0], f.y = (Math.sign(w.y) + D.elements[9]) / D.elements[5], f.z = -1, f.w = (1 + D.elements[10]) / D.elements[14], w.multiplyScalar(2 / w.dot(f)), D.elements[2] = w.x, D.elements[6] = w.y, D.elements[10] = w.z + 1 - c, D.elements[14] = w.w, L.texture.encoding = I.outputEncoding, n.visible = !1;
      const X = I.getRenderTarget(), B = I.xr.enabled, oe = I.shadowMap.autoUpdate;
      I.xr.enabled = !1, I.shadowMap.autoUpdate = !1, I.setRenderTarget(L), I.state.buffers.depth.setMask(!0), I.autoClear === !1 && I.clear(), I.render($, x), I.xr.enabled = B, I.shadowMap.autoUpdate = oe, I.setRenderTarget(X);
      const j = V.viewport;
      j !== void 0 && I.state.viewport(j), n.visible = !0;
    }, this.getRenderTarget = function() {
      return L;
    }, this.dispose = function() {
      L.dispose(), n.material.dispose();
    };
  }
};
let Fe = pt;
A(Fe, "ReflectorShader");
Fe.ReflectorShader = {
  uniforms: {
    color: {
      value: null
    },
    tDiffuse: {
      value: null
    },
    textureMatrix: {
      value: null
    },
    opacity: {
      value: 1
    }
  },
  vertexShader: (
    /* glsl */
    `
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`
  ),
  fragmentShader: (
    /* glsl */
    `
		uniform vec3 color;
uniform float opacity;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), opacity );

			#include <encodings_fragment>

		}`
  )
};
var kn = function(d) {
  if (d.getBoundingClientRect)
    return d.getBoundingClientRect();
  var e = 0, t = 0;
  do
    e += d.offsetLeft - d.scrollLeft, t += d.offsetTop - d.scrollTop;
  while (d = d.offsetParent);
  return { left: e, top: t };
};
class Bn {
  constructor(e) {
    A(this, "_params", {});
    A(this, "_lon", 0);
    A(this, "_lat", 0);
    A(this, "_lastLon");
    A(this, "_lastLat");
    A(this, "_moothFactor", 10);
    // 平滑因子
    A(this, "_boundary", 320);
    // 边界
    A(this, "_direction", window.orientation || 0);
    // 方向
    A(this, "_bindChange");
    A(this, "_bindOrient");
    A(this, "bind", () => {
      this._bindChange = this._onChange.bind(this), this._bindOrient = this._onOrient.bind(this), window.addEventListener("deviceorientation", this._bindChange), window.addEventListener("orientationchange", this._bindOrient);
    });
    A(this, "destroy", () => {
      window.removeEventListener("deviceorientation", this._bindChange, !1), window.removeEventListener("orientationchange", this._bindOrient, !1);
    });
    this._params = Object.assign(
      {
        onChange() {
        },
        onOrient() {
        }
      },
      e
    ), this.bind();
  }
  _onOrient(e) {
    this._direction = window.orientation, this._params.onOrient(e), this._lastLon = this._lastLat = 0;
  }
  _mooth(e, t) {
    return t === void 0 || (Math.abs(e - t) > this._boundary && (t > this._boundary ? t = 0 : t = 360), e = t + (e - t) / this._moothFactor), e;
  }
  _onChange(e) {
    switch (this._direction) {
      case 0:
        this._lon = -(e.alpha + e.gamma), this._lat = e.beta - 90;
        break;
      case 90:
        this._lon = e.alpha - Math.abs(e.beta), this._lat = e.gamma < 0 ? -90 - e.gamma : 90 - e.gamma;
        break;
      case -90:
        this._lon = -(e.alpha + Math.abs(e.beta)), this._lat = e.gamma > 0 ? e.gamma - 90 : 90 + e.gamma;
        break;
    }
    this._lon = this._lon > 0 ? this._lon % 360 : this._lon % 360 + 360, this._lastLat = this._lat = this._mooth(this._lat, this._lastLat), this._lastLon = this._lon = this._mooth(this._lon, this._lastLon), this._params.onChange && this._params.onChange({
      lon: this._lon,
      lat: this._lat
    });
  }
}
class Gn {
  constructor(e) {
    // 重力感应
    A(this, "_orienter", null);
    A(this, "_startOrienterAngle", 0);
    A(this, "_enableOrienter", !1);
    A(this, "toggle", () => {
      this.enableOrienter ? this.close() : this.open();
    });
    // 重力感应
    A(this, "open", () => {
      this.enableOrienter = !0, !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? window.DeviceOrientationEvent.requestPermission().then((t) => {
        switch (t) {
          case "granted":
            this._newVROrienter();
            break;
          case "denied":
            alert("你拒绝了使用陀螺仪");
            break;
          case "prompt":
            alert("其他行为");
            break;
        }
      }) : this._newVROrienter();
    });
    // 关闭重力感应
    A(this, "close", () => {
      this.enableOrienter = !1, this._orienter && (this._startOrienterAngle = 0, this._controls.enabled = !0, this._orienter.destroy());
    });
    this._controls = e.controls;
  }
  // 启用重力感应
  set enableOrienter(e) {
    this._enableOrienter = e;
  }
  get enableOrienter() {
    return this._enableOrienter;
  }
  // 重力感应
  _newVROrienter() {
    this._orienter = new Bn({
      onChange: ({ lat: e, lon: t }) => {
        e += 90, this._startOrienterAngle || (this._startOrienterAngle = this._controls.azimuthAngle * (180 / Math.PI) - 90, this._controls.enabled = !1), t -= this._startOrienterAngle, t %= 360, this._controls.rotateTo(
          -t * Math.PI / 180,
          e * Math.PI / 180,
          !1
        );
      }
    });
  }
}
const F = window.THREE;
Te.install({ THREE: F });
class Yn {
  constructor(e) {
    /**
     * 外部传入的配置
     */
    A(this, "_options", {
      // 移动高度
      movieHight: -1,
      // 容器
      container: document.body,
      // 点击元素回调函数
      onClick: null
      // 相机配置
      // cameraOption: {
      //   height: 0.1,
      //   position: { x: 16.928, y: 0.1, z: 0.699 },
      //   lookAt: { x: 30.551, y: 0.1, z: 1.096 },
      // },
    });
    // 尺寸
    A(this, "_size", {
      width: window.innerWidth,
      height: window.innerHeight
    });
    // 渲染器
    A(this, "_renderer", null);
    // 相机
    A(this, "_camera", null);
    // 场景
    A(this, "_scene", null);
    // 时钟
    A(this, "_clock", new F.Clock());
    // 控制器
    A(this, "_controls", null);
    // 动画实例
    A(this, "_requestAnimate", null);
    // 相机和视点的距离
    A(this, "_EPS", 1e-5);
    // gltf加载器
    A(this, "_gltfLoader", new Zs());
    // 屏幕射线
    A(this, "_raycaster", new F.Raycaster());
    // 展厅模型
    A(this, "_hallMesh", null);
    // 展厅地板名称
    A(this, "_hallPlaneName", "plane");
    A(this, "_planeMesh", null);
    // 加载器
    A(this, "_textLoader", new F.TextureLoader());
    // 事件元素
    A(this, "_eventMeshs", []);
    // 控制器
    A(this, "_transfromControls", null);
    // 事件
    A(this, "_events", {});
    // 展品数据
    A(this, "_itemsData", []);
    // 动画
    A(this, "_animates", []);
    // 重力感应实例
    A(this, "gravity", null);
    Object.assign(this._options, e), this._size.width = this._options.container.clientWidth, this._size.height = this._options.container.clientHeight, this._init(), this._bindEvent(), this._lookat().then(() => {
      this._options.callback && this._options.callback();
    }), this._animate(), window.addEventListener("resize", this._resize.bind(this)), this._options.debugger && (this._initTransformControls(), this._scene.add(new F.AxesHelper(1e3))), this.gravity = new Gn(this._controls);
  }
  // initVRButton(target = document.body) {
  //   this._renderer.xr.enabled = true;
  //   this._renderer.xr.setReferenceSpaceType("local");
  //   target.appendChild(VRButton.createButton(this._renderer));
  // }
  addAnimate(e) {
    this._animates.push(e);
  }
  // 加入到可点击元素
  addClickEvent(e) {
    this._eventMeshs.push(e);
  }
  // 镜面反射
  _reflectorPlane() {
    const t = new F.PlaneBufferGeometry(1e3, 1e3), s = new Fe(t, {
      opacity: 0.1,
      textureWidth: 1e3,
      textureHeight: 1e3,
      color: "#fff"
    });
    s.material.side = F.DoubleSide, s.material.transparent = !0, s.material.opacity = 0.1, s.rotation.x = -Math.PI / 2, s.position.y = this._planeMesh.position.y + 0.1, this._scene.add(s);
  }
  /**
   * 初始化
   */
  _init() {
    this._renderer = new F.WebGLRenderer({
      antialias: !0,
      // 抗锯齿
      alpha: !0,
      transparent: !0,
      logarithmicDepthBuffer: !0
      // 解决部分Z-Fighting问题，会消耗性能, 安卓开启
    }), this._renderer.setPixelRatio(window.devicePixelRatio), this._renderer.sortObjects = !0, this._renderer.setSize(this._size.width, this._size.height), this._options.container.innerHTML = "", this._options.container.appendChild(this._renderer.domElement);
    const { width: e, height: t } = this._size;
    this._scene = new F.Scene(), this._camera = new F.PerspectiveCamera(70, e / t, 0.1, 1e4), this._scene.add(this._camera), this._scene.add(new F.AmbientLight(16777215, 1)), this._controls = new Te(
      this._camera,
      this._renderer.domElement
    ), this._controls.maxDistance = this._EPS, this._controls.minZoom = 0.5, this._controls.maxZoom = 5, this._controls.dragToOffset = !1, this._controls.distance = 1, this._controls.dampingFactor = 0.01, this._controls.truckSpeed = 0.01, this._controls.mouseButtons.wheel = Te.ACTION.ZOOM, this._controls.mouseButtons.right = Te.ACTION.NONE, this._controls.touches.two = Te.ACTION.TOUCH_ZOOM, this._controls.touches.three = Te.ACTION.NONE, this._controls.azimuthRotateSpeed = -0.5, this._controls.polarRotateSpeed = -0.5, this._controls.saveState();
  }
  // 初始调试用的变换控制器
  _initTransformControls() {
    this._transformControls = new Cn(
      this._camera,
      this._renderer.domElement
    ), this._transformControls.setSpace("local"), this._transformControls.addEventListener("mouseDown", () => {
      this._controls.enabled = !1;
    }), this._transformControls.addEventListener("mouseUp", () => {
      this._controls.enabled = !0;
    }), this._transformControls.addEventListener("objectChange", (e) => {
      const { position: t, scale: s, rotation: n } = this._transformControls.object;
      console.log(
        `position:{x:${t.x},y:${t.y},z:${t.z}},scale:{x:${s.x},y:${s.y},z:${s.z}},rotation:{x:${n.x},y:${n.y},z:${n.z}}`
      );
    }), window.addEventListener("keydown", (e) => {
      e.key === "q" && this._transformControls.setMode("translate"), e.key === "w" && this._transformControls.setMode("rotate"), e.key === "e" && this._transformControls.setMode("scale");
    }), this._scene.add(this._transformControls);
  }
  /**
   * 重新设置大小
   */
  _resize() {
    this._size.width = this._options.container.clientWidth, this._size.height = this._options.container.clientHeight, this._renderer.setSize(this._size.width, this._size.height);
  }
  // 查看作品
  viewItem(e) {
    const t = this._itemsData.find((s) => s.id === e);
    t ? this.moveTo(t.view, t.position) : console.error("id不存在", e);
  }
  /**
   * 移动动画
   * @param {*} to
   * @param {*} lookat
   * @param {*} duration
   */
  moveTo(e, t, s) {
    this._controls.saveState();
    const n = new F.Vector3(e.x, e.y, e.z);
    n.lerp(new F.Vector3(t.x, t.y, t.z), this._EPS);
    const o = new F.Vector3(), i = new F.Vector3();
    this._controls.getPosition(o), this._controls.getTarget(i), new F.Vector3(e.x, e.y, e.z).lerp(new F.Vector3(t.x, t.y, t.z), this._EPS), this._controls.setLookAt(
      e.x,
      e.y,
      e.z,
      n.x,
      n.y,
      n.z,
      !0
    );
  }
  _findParentOdata(e) {
    return e.odata ? (console.log(e), e) : e.parent ? this._findParentOdata.bind(this)(e.parent) : null;
  }
  /**
   * 传入坐标，返回当前的raycaster屏幕坐标
   * x, y 是画布相对坐标
   */
  _getBoxRaycaster({ x: e, y: t }, s) {
    const n = this._options.container;
    this._mouse = new F.Vector2(), this._mouse.set(
      e / n.clientWidth * 2 - 1,
      -(t / n.clientHeight) * 2 + 1
    ), this._raycaster.setFromCamera(this._mouse, this._camera);
    const o = this._raycaster.intersectObjects(
      [...s, ...this._eventMeshs],
      !0
    ), i = o[0];
    if (i) {
      const a = o[0].point, r = this._camera.position.lerp(a, 1 + this._EPS), c = i.object, h = this._findParentOdata(c);
      return this._options.debugger && h && this._transformControls && this._transformControls.attach(h), h && this._options.onClick && this._options.onClick(h.odata), { position: a, lookat: r, mesh: c };
    } else
      console.log("点击空气？");
    return !1;
  }
  /**
   * 初始化视角
   * @returns
   */
  async _lookat() {
    if (!this._options.cameraOption)
      return;
    const { position: e, lookAt: t } = this._options.cameraOption, s = new F.Vector3(e.x, e.y, e.z);
    s.lerp(new F.Vector3(t.x, t.y, t.z), this._EPS), this._controls.zoomTo(0.8), await this._controls.setLookAt(
      e.x,
      e.y,
      e.z,
      s.x,
      s.y,
      s.z,
      !1
    );
  }
  /**
   * 动画
   */
  _animate() {
    const e = this._clock.getDelta();
    this._controls && this._controls.update(e), this._renderer && this._renderer.render(this._scene, this._camera), this._animates && this._animates.forEach((t) => {
      t(e);
    }), this._requestAnimate = requestAnimationFrame(this._animate.bind(this));
  }
  _mouseDown(e) {
    this._events.startXY = { x: e.clientX, y: e.clientY };
  }
  _mouseUp(e) {
    const { top: t, left: s } = kn(this._options.container), { x: n, y: o } = this._events.startXY, i = 2;
    if (Math.abs(e.clientX - n) > i || Math.abs(e.clientY - o) > i)
      return;
    const a = this._getBoxRaycaster(
      {
        x: e.clientX - s,
        y: e.clientY - t
      },
      [this._hallMesh]
    );
    if (a) {
      const { position: r, lookat: c, mesh: h } = a;
      console.log("rayRes", h, a, r, {
        x: e.clientX - s,
        y: e.clientY - t
      }), h.name === this._hallPlaneName && this.moveTo(
        { x: r.x, y: this._options.movieHight, z: r.z },
        { x: c.x, y: this._options.movieHight, z: c.z },
        3
      );
    }
  }
  /**
   * 事件绑定
   */
  _bindEvent() {
    this._options.container.addEventListener(
      "mousedown",
      this._mouseDown.bind(this)
    ), this._options.container.addEventListener(
      "mouseup",
      this._mouseUp.bind(this)
    );
  }
  /**
   * 加载模型
   * url 模型URL
   * position 模型摆放位置
   * rotation 模型旋转角度
   * scale 模型缩放大小
   * onProgress 模型加载进度 progress => void;
   * callback 回调函数 mesh => void;
   * animate 动画函数 () => void;
   * @param {*} url
   */
  loadGLTF(e) {
    return new Promise((t) => {
      const { url: s, position: n, scale: o, rotation: i, onProgress: a, callback: r, animate: c } = e;
      this._gltfLoader.load(
        s,
        (h) => {
          const l = h.scene;
          new F.Box3().setFromObject(l).getSize(new F.Vector3()), l.scale.set(o, o, o), n && (l.position.y = n.y, l.position.x = n.x, l.position.z = n.z), i && (l.rotation.y = i.y, l.rotation.x = i.x, l.rotation.z = i.z), this._scene.add(l), c && (l.animations = c), r && r(h), t();
        },
        (h) => {
          console.log(h), a && a(h);
        },
        (h) => {
          console.error(h);
        }
      );
    });
  }
  /**
   * 载入展厅模型
   * url 模型URL
   * planeName 地板名称
   * position 模型摆放位置
   * rotation 模型旋转角度
   * scale 模型缩放大小
   * onProgress 模型加载进度
   * callback 回调函数
   */
  async loadHall(e) {
    this._hallPlaneName = e.planeName;
    const t = (s) => {
      this._hallMesh = s.scene, s.scene.traverse((n) => {
        n.name === e.planeName && (this._planeMesh = n);
      }), e.callback(s);
    };
    await this.loadGLTF({ ...e, callback: t });
  }
  /**
   * 载入展品数据
   */
  loadItems(e) {
    this._itemsData = e;
    const { maxSize: t } = this._options;
    e.forEach(async (s) => {
      const n = await this._textLoader.loadAsync(s.url);
      n.image.width > t ? (s.width = t, s.height = t / n.image.width * n.image.height) : (s.height = MAX, s.width = t / n.image.height * n.image.width);
      const o = new F.BoxGeometry(
        s.width,
        s.height,
        s.depth ? s.depth : 2
      ), i = new F.MeshBasicMaterial({
        color: s.color ? s.color : "#ffffff",
        map: this._textLoader.load("./assets/room1/wall.png")
      }), a = new F.MeshBasicMaterial({
        color: s.color ? s.color : "#ffffff",
        map: n
      }), r = new F.Mesh(o, [
        i,
        i,
        i,
        i,
        i,
        a
      ]);
      r.name = s.name, r.rotation.set(s.rotation.x, s.rotation.y, s.rotation.z), r.scale.set(s.scale.x, s.scale.y, s.scale.z), r.position.set(s.position.x, s.position.y, s.position.z), r.odata = s, this._scene.add(r), this._eventMeshs.push(r);
    });
  }
  /**
   * 销毁
   */
  destroy() {
    this._options.container.removeEventListener(
      "mousedown",
      this._mouseDown.bind(this)
    ), this._options.container.removeEventListener(
      "mouseup",
      this._mouseUp.bind(this)
    );
  }
}
export {
  Yn as default
};
