// export interface OrienterParams {
//   onChange?(e: any): void; // 陀螺仪转动触发
//   onOrient?(e: any): void;
// }

export default class Orienter {
  _params = {};
  _lon = 0;
  _lat = 0;
  _lastLon;
  _lastLat;
  _moothFactor = 10; // 平滑因子
  _boundary = 320; // 边界
  _direction = window.orientation || 0; // 方向
  _bindChange;
  _bindOrient;

  constructor(params) {
    this._params = Object.assign(
      {
        onChange() {},
        onOrient() {},
      },
      params
    );
    this.bind();
  }

  bind = () => {
    this._bindChange = this._onChange.bind(this);
    this._bindOrient = this._onOrient.bind(this);
    // 陀螺仪
    window.addEventListener("deviceorientation", this._bindChange);
    // 横屏还是竖屏
    window.addEventListener("orientationchange", this._bindOrient);
  };

  destroy = () => {
    window.removeEventListener("deviceorientation", this._bindChange, false);
    window.removeEventListener("orientationchange", this._bindOrient, false);
  };

  _onOrient(event) {
    this._direction = window.orientation;
    //@ts-ignore
    this._params.onOrient(event);
    this._lastLon = this._lastLat = 0;
  }

  _mooth(x, lx) {
    //插值为了平滑些

    if (lx === undefined) {
      return x;
    }

    //0至360,边界值特例，有卡顿待优化
    if (Math.abs(x - lx) > this._boundary) {
      if (lx > this._boundary) {
        lx = 0;
      } else {
        lx = 360;
      }
    }

    //滤波降噪
    x = lx + (x - lx) / this._moothFactor;
    return x;
  }

  _onChange(evt) {
    switch (this._direction) {
      case 0:
        this._lon = -(evt.alpha + evt.gamma);
        this._lat = evt.beta - 90;
        break;
      case 90:
        this._lon = evt.alpha - Math.abs(evt.beta);
        this._lat = evt.gamma < 0 ? -90 - evt.gamma : 90 - evt.gamma;
        break;
      case -9_0:
        this._lon = -(evt.alpha + Math.abs(evt.beta));
        this._lat = evt.gamma > 0 ? evt.gamma - 90 : 90 + evt.gamma;
        break;
    }

    this._lon = this._lon > 0 ? this._lon % 360 : (this._lon % 360) + 360;

    //插值为了平滑，修复部分android手机陀螺仪数字有抖动异常的
    this._lastLat = this._lat = this._mooth(this._lat, this._lastLat);
    this._lastLon = this._lon = this._mooth(this._lon, this._lastLon);

    if (this._params.onChange) {
      this._params.onChange({
        lon: this._lon,
        lat: this._lat,
      });
    }
  }
}
