export const homeScenes = [
  { id: "cosmic", name: "深空漫游", subtitle: "BEYOND THE ORDINARY", description: "把辽阔的宇宙，留在触手可及的地方。", label: "COSMIC WANDER" },
  { id: "alpine", name: "山野来信", subtitle: "A MOMENT OF STILLNESS", description: "越过层峦与薄雾，给思绪一点呼吸的空间。", label: "ALPINE LETTERS" },
  { id: "dune", name: "日落之后", subtitle: "SLOW DOWN A LITTLE", description: "让温柔的光线，陪你度过平常的一天。", label: "AFTER THE SUNSET" },
] as const;

export type SceneId = typeof homeScenes[number]["id"];
