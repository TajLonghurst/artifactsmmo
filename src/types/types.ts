export interface Cooldown {
  total_seconds: number;
  remaining_seconds: number;
  started_at: string;
  expiration: string;
  reason: string;
}

export interface Item {
  code: string;
  quantity: number;
}

export interface Details {
  xp: number;
  items: Item[];
}

interface InventoryItem {
  slot: number;
  code: string;
  quantity: number;
}

export interface Character {
  name: string;
  account: string;
  skin: string;
  level: number;
  xp: number;
  max_xp: number;
  gold: number;
  speed: number;
  mining_level: number;
  mining_xp: number;
  mining_max_xp: number;
  woodcutting_level: number;
  woodcutting_xp: number;
  woodcutting_max_xp: number;
  fishing_level: number;
  fishing_xp: number;
  fishing_max_xp: number;
  weaponcrafting_level: number;
  weaponcrafting_xp: number;
  weaponcrafting_max_xp: number;
  gearcrafting_level: number;
  gearcrafting_xp: number;
  gearcrafting_max_xp: number;
  jewelrycrafting_level: number;
  jewelrycrafting_xp: number;
  jewelrycrafting_max_xp: number;
  cooking_level: number;
  cooking_xp: number;
  cooking_max_xp: number;
  alchemy_level: number;
  alchemy_xp: number;
  alchemy_max_xp: number;
  hp: number;
  max_hp: number;
  haste: number;
  critical_strike: number;
  wisdom: number;
  prospecting: number;
  attack_fire: number;
  attack_earth: number;
  attack_water: number;
  attack_air: number;
  dmg: number;
  dmg_fire: number;
  dmg_earth: number;
  dmg_water: number;
  dmg_air: number;
  res_fire: number;
  res_earth: number;
  res_water: number;
  res_air: number;
  x: number;
  y: number;
  cooldown: number;
  cooldown_expiration: string;
  weapon_slot: string;
  rune_slot: string;
  shield_slot: string;
  helmet_slot: string;
  body_armor_slot: string;
  leg_armor_slot: string;
  boots_slot: string;
  ring1_slot: string;
  ring2_slot: string;
  amulet_slot: string;
  artifact1_slot: string;
  artifact2_slot: string;
  artifact3_slot: string;
  utility1_slot: string;
  utility1_slot_quantity: number;
  utility2_slot: string;
  utility2_slot_quantity: number;
  bag_slot: string;
  task: string;
  task_type: string;
  task_progress: number;
  task_total: number;
  inventory_max_items: number;
  inventory: InventoryItem[];
}

export interface Fight {
  xp: number;
  gold: number;
  drops: Drop[];
  turns: number;
  monster_blocked_hits: BlockedHits;
  player_blocked_hits: BlockedHits;
  logs: string[];
  result: string;
}

interface BlockedHits {
  fire: number;
  earth: number;
  water: number;
  air: number;
  total: number;
}

interface Drop {
  code: string;
  quantity: number;
}

export interface Destination {
  name: string;
  skin: string;
  x: number;
  y: number;
  content: Content;
}

interface Content {
  type: string;
  code: string;
}

export type Slot =
  | "weapon"
  | "shield"
  | "helmet"
  | "body_armor"
  | "leg_armor"
  | "boots"
  | "ring1"
  | "ring2"
  | "amulet"
  | "artifact1"
  | "artifact2"
  | "artifact3"
  | "utility1"
  | "utility2"
  | "bag"
  | "rune";

interface Effect {
  code: string;
  value: number;
}

interface CraftItem {
  code: string;
  quantity: number;
}

interface Craft {
  skill: string;
  level: number;
  items: CraftItem[];
  quantity: number;
}

export interface UnEquipItem {
  name: string;
  code: string;
  level: number;
  type: string;
  subtype: string;
  description: string;
  effects: Effect[];
  craft: Craft;
  tradeable: boolean;
}

export type Drops =
  | "ash_wood"
  | "sap"
  | "gudgeon"
  | "algae"
  | "copper_ore"
  | "topaz_stone"
  | "topaz"
  | "emerald"
  | "emerald_stone"
  | "ruby"
  | "ruby_stone"
  | "sapphire"
  | "sapphire_stone"
  | "sunflower"
  | "shrimp"
  | "golden_shrimp"
  | "iron_ore"
  | "spruce_wood"
  | "apple"
  | "coal"
  | "trout"
  | "silver_chalice"
  | "birch_wood"
  | "nettle_leaf"
  | "bass"
  | "gold_ore"
  | "dead_wood"
  | "strange_ore"
  | "diamond_stone"
  | "diamond"
  | "magic_wood"
  | "magic_sap"
  | "salmon"
  | "golden_chalice"
  | "glowstem_leaf"
  | "mithril_ore";
