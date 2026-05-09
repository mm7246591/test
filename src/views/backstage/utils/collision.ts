import type { PlacedItem } from "../type/interface";

/** 使用 AABB碰撞 判斷 target 是否與 items 中任一物件重疊（自身除外） */
export const hasOverlap = (
  target: PlacedItem,
  items: PlacedItem[],
): boolean => {
  return items.some(
    (other) =>
      other.id !== target.id &&
      target.x < other.x + other.width &&
      target.x + target.width > other.x &&
      target.y < other.y + other.height &&
      target.y + target.height > other.y,
  );
};
