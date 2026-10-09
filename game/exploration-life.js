/**
 * Small, optional discoveries that make the streets worth exploring beyond missions.
 * These are lightweight props in the existing Lagos scene, not claims of new maps.
 */
export const EXPLORATION_DISCOVERIES = [
  {
    id: "buka-lunch-stop",
    name: "Mama Sade's Buka",
    kind: "local-shop",
    position: { x: 132, z: -18 },
    color: "#F6B21A",
    icon: "SHOP",
    description: "A tiny buka tucked beside the busy road. Mama Sade remembers the people who stop to greet her, and today she has a small thank-you for a helpful neighbour.",
    activity: "Take a breather and greet the cook",
    reward: { xp: 8, ngn: 25, item: "buka-goodwill" },
    memory: "Mama Sade greets you like a familiar face when you return."
  },
  {
    id: "old-cinema-mural",
    name: "The Old Cinema Mural",
    kind: "street-art",
    position: { x: -142, z: -52 },
    color: "#C7457E",
    icon: "ART",
    description: "A hand-painted wall celebrates the films, music and street stories that neighbours still talk about. Somebody has been adding tiny details over time.",
    activity: "Take a closer look at the mural",
    reward: { xp: 10, ngn: 0, item: "street-art-memory" },
    memory: "You remember the mural's little signature hidden near the bottom."
  },
  {
    id: "community-football",
    name: "The Street Football Circle",
    kind: "side-activity",
    position: { x: 142, z: 118 },
    color: "#0B7A43",
    icon: "PLAY",
    description: "A few neighbours have marked out a small football target beside the open space. No mission, no lecture—just a quick local challenge.",
    activity: "Try a quick target challenge",
    reward: { xp: 12, ngn: 15, item: "street-football" },
    memory: "The players remember your attempt and save you a place for another round."
  },
  {
    id: "community-noticeboard",
    name: "The Neighbourhood Noticeboard",
    kind: "community",
    position: { x: -150, z: 154 },
    color: "#2D6FB3",
    icon: "NOTICE",
    description: "A weathered noticeboard carries a football fixture, a tailoring advert and a handwritten reminder about a neighbourhood clean-up. Everyday city life, all in one place.",
    activity: "Read the local notices",
    reward: { xp: 8, ngn: 0, item: "community-notices" },
    memory: "The clean-up organiser nods when they see you near the noticeboard again."
  }
];

export function validateExplorationDiscoveries() {
  const errors = [];
  const ids = new Set();
  for (const item of EXPLORATION_DISCOVERIES) {
    if (!item.id || ids.has(item.id)) errors.push("Discovery IDs must be unique: " + item.id);
    ids.add(item.id);
    if (!item.position || !Number.isFinite(item.position.x) || !Number.isFinite(item.position.z)) errors.push("Invalid discovery position: " + item.id);
    if (!item.name || !item.description || !item.activity || !item.reward || !Number.isFinite(item.reward.xp)) errors.push("Incomplete discovery content: " + item.id);
  }
  return errors;
}
