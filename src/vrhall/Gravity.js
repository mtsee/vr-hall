import Orienter from "./Orienter";

export default class Gravity {
  // 重力感应
  _orienter = null;
  _startOrienterAngle = 0;
  _enableOrienter = false;

  // 启用重力感应
  set enableOrienter(v) {
    this._enableOrienter = v;
  }
  get enableOrienter() {
    return this._enableOrienter;
  }

  constructor(params) {
    this._controls = params.controls;
  }

  toggle = () => {
    if (this.enableOrienter) {
      this.close();
    } else {
      this.open();
    }
  };

  // 重力感应
  open = () => {
    this.enableOrienter = true;
    let isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
      //IOS13+ 授权流程
      window.DeviceOrientationEvent.requestPermission().then((state) => {
        switch (state) {
          case "granted":
            // you can do something
            this._newVROrienter();
            break;
          case "denied":
            alert("你拒绝了使用陀螺仪");
            break;
          case "prompt":
            alert("其他行为");
            break;
        }
      });
    } else {
      this._newVROrienter();
    }
  };

  // 关闭重力感应
  close = () => {
    this.enableOrienter = false;
    if (this._orienter) {
      this._startOrienterAngle = 0;
      this._controls.enabled = true;
      this._orienter.destroy();
    }
  };

  // 重力感应
  _newVROrienter() {
    this._orienter = new Orienter({
      onChange: ({ lat, lon }) => {
        lat += 90;
        if (!this._startOrienterAngle) {
          this._startOrienterAngle =
            this._controls.azimuthAngle * (180 / Math.PI) - 90;
          // 关闭缓动效果
          this._controls.enabled = false;
        }
        lon -= this._startOrienterAngle;
        lon %= 360;
        this._controls.rotateTo(
          (-lon * Math.PI) / 180,
          (lat * Math.PI) / 180,
          false
        );
      },
    });
  }

  destroy() {
    // 销毁
    this._orienter = null;
    this._controls = null;
  }
}
