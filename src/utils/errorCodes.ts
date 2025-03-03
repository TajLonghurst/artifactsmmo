export const ERROR_CODES = {
  //# General

  code_invalid_payload: 422,
  code_too_many_requests: 429,
  code_not_found: 404,
  // code_fatal_error: 500,

  //# Account Error Codes
  code_token_invalid: 452,
  code_token_expired: 453,
  code_token_missing: 454,
  code_token_generation_fail: 455,
  code_username_already_used: 456,
  code_email_already_used: 457,
  code_same_password: 458,
  code_current_password_invalid: 459,

  //# Character Error Codes
  code_character_not_enough_hp: 483,
  code_character_maximum_utilites_equiped: 484,
  code_character_item_already_equiped: 485,
  code_character_locked: 486,
  code_character_not_this_task: 474,
  code_character_too_many_items_task: 475,
  code_character_no_task: 487,
  code_character_task_not_completed: 488,
  code_character_already_task: 489,
  code_character_already_map: 490,
  code_character_slot_equipment_error: 491,
  code_character_gold_insufficient: 492,
  code_character_not_skill_level_required: 493,
  code_character_name_already_used: 494,
  code_max_characters_reached: 495,
  code_character_not_level_required: 496,
  code_character_inventory_full: 497,
  code_character_not_found: 498,
  code_character_in_cooldown: 499,

  //# Item Error Codes
  code_item_insufficient_quantity: 471,
  code_item_invalid_equipment: 472,
  code_item_recycling_invalid_item: 473,
  code_item_invalid_consumable: 476,
  code_missing_item: 478,

  //# Grand Exchange Error Codes
  code_ge_max_quantity: 479,
  code_ge_not_in_stock: 480,
  code_ge_not_the_price: 482,
  code_ge_transaction_in_progress: 436,
  code_ge_no_orders: 431,
  code_ge_max_orders: 433,
  code_ge_too_many_items: 434,
  code_ge_same_account: 435,
  code_ge_invalid_item: 437,
  code_ge_not_your_order: 438,

  //# Bank Error Codes
  code_bank_insufficient_gold: 460,
  code_bank_transaction_in_progress: 461,
  code_bank_full: 462,

  //# Maps Error Codes
  // code_map_not_found: 597,
  // code_map_content_not_found: 598,
} as const;

export const errorCode = (status: number) => {
  const entry = Object.entries(ERROR_CODES).find(
    ([_, value]) => value === status
  );
  return entry ? entry[0] : undefined;
};
