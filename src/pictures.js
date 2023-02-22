/**
 * 画框数据
 * @params {
 *   id: '', // 唯一标识
 *   position: {x: 0, y: 0, z: 0},  // 模型位置
 *   rotation: {x: 0, y: 0, z: 0},  // 旋转角度
 *   view: {x: 0, y: 0, z: 0},  // 预览点的位置，移动到这里，看向position
 *   scale: {x: 0, y: 0, z: 0},  // 缩放比例
 *   name: '名字',  // 名字
 *   desc: '描述说明',  // 描述说明
 *   url: '资源url',  // 资源url
 *   type: 'picture',  // 'gltf' | 'picture' | 'dot'; // gltf模型，图画模型，图画要自定义画框
 *   boxColor: '#fff', // 画框颜色
 * }
 */
export const data = [
  {
    id: "1", // 唯一标识
    position: {
      x: -0.6593699553026159,
      y: 1.3866967899666711,
      z: 7.067726292206915,
    },
    scale: {
      x: 0.025612307671229958,
      y: 0.025612307671229958,
      z: 0.025612307671229958,
    },
    rotation: { x: 0, y: 0, z: 0 },
    view: { x: 0, y: 0, z: 0 }, // 预览点的位置，移动到这里，看向position
    name: "名字", // 名字
    desc: "描述说明", // 描述说明
    url: "/assets/pictures/1.jpg", // 资源url
    type: "picture", // 'gltf' | 'picture' | 'dot'; // gltf模型，图画模型，图画要自定义画框
    boxColor: "#fff", // 画框颜色
  },
  {
    id: "2", // 唯一标识
    position: {
      x: -2.082931443654556,
      y: 1.407979701012977,
      z: 7.0136165170650795,
    },
    scale: {
      x: 0.025612307671229958,
      y: 0.025612307671229958,
      z: 0.025612307671229958,
    },
    rotation: { x: 0, y: 0, z: 0 },
    view: { x: 0, y: 0, z: 0 }, // 预览点的位置，移动到这里，看向position
    name: "名字", // 名字
    desc: "描述说明", // 描述说明
    url: "/assets/pictures/2.jpg", // 资源url
    type: "picture", // 'gltf' | 'picture' | 'dot'; // gltf模型，图画模型，图画要自定义画框
    boxColor: "#fff", // 画框颜色
  },
  {
    id: "3", // 唯一标识
    position: {
      x: -3.3583092336115548,
      y: 1.407979701012977,
      z: 7.0136165170650795,
    },
    scale: {
      x: 0.025612307671229958,
      y: 0.025612307671229958,
      z: 0.025612307671229958,
    },
    rotation: { x: 0, y: 0, z: 0 },
    view: { x: 0, y: 0, z: 0 }, // 预览点的位置，移动到这里，看向position
    name: "名字", // 名字
    desc: "描述说明", // 描述说明
    url: "/assets/pictures/3.jpg", // 资源url
    type: "picture", // 'gltf' | 'picture' | 'dot'; // gltf模型，图画模型，图画要自定义画框
    boxColor: "#fff", // 画框颜色
  },
];
