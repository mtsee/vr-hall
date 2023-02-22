import "./index.less";
import { VRHall } from "./VRHall";
import { data } from "./pictures";

window.onload = function () {
  // 实例化
  const vr = new VRHall({
    debugger: true, // 开启调试模式
    maxSize: 25, // 画框最大尺寸
    movieHight: 1.5,
    container: document.getElementById("root"),
    cameraOption: {
      position: { x: 0, y: 1.5, z: 0 },
      lookAt: { x: 3, y: 1.5, z: 3 },
    },
    onClick: (item) => {
      console.log("你点击了", item);
    },
  });

  // 加载厅模型
  vr.loadHall({
    url: "./assets/room1/msg.gltf",
    planeName: "meishu01",
    position: { x: 2, y: -0.2, z: 2 },
    scale: 1,
    callback: (mesh) => {},
    onProgress: (p) => {
      console.log("加载进度", p);
    },
  });

  // 加载画框数据
  vr.loadItems(data);
};
