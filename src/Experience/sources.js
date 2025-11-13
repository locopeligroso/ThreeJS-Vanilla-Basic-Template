export default [
  /*
   * HDRI
   */

  {
    name: "hdriMap",
    type: "hdri",
    path: "textures/environmentMap/preview.hdr",
  },

  /*
   * MODELLI
   */

  {
    name: "start",
    type: "gltfModel",
    path: "models/start.glb",
  },

  {
    name: "gancioGpgpu",
    type: "gltfModel",
    path: "models/Gancio1.glb",
  },

  {
    name: "background",
    type: "gltfModel",
    path: "models/background.glb",
  },

  {
    name: "particleMorphing",
    type: "gltfModel",
    path: "models/particlesMorphing.glb",
  },

  {
    name: "catena",
    type: "gltfModel",
    path: "models/catena.glb",
  },

  /*
   * TEXTURES
   */

  // Backdrop
  {
    name: "backdropMap",
    type: "texture",
    path: "textures/BackdropMap.jpg",
  },

  {
    name: "backdropBump",
    type: "texture",
    path: "textures/green_metal_rust_bump_2k.png",
  },

  {
    name: "backdropNormal",
    type: "texture",
    path: "textures/green_metal_rust_nor_gl_2k.png",
  },
  {
    name: "backdropRough",
    type: "texture",
    path: "textures/green_metal_rust_rough_2k.png",
  },
];
