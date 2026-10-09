/**
 * Source-of-truth registry for Nigeria's world map.
 * A jurisdiction is not a playable map. Only WORLD_LOCATIONS with status "playable"
 * are wired to existing scene assets; planned locations must not be rendered as live.
 */
const STATE_ROWS = [
  ["abia","Abia","Umuahia","South East"],["adamawa","Adamawa","Yola","North East"],
  ["akwa-ibom","Akwa Ibom","Uyo","South South"],["anambra","Anambra","Awka","South East"],
  ["bauchi","Bauchi","Bauchi","North East"],["bayelsa","Bayelsa","Yenagoa","South South"],
  ["benue","Benue","Makurdi","North Central"],["borno","Borno","Maiduguri","North East"],
  ["cross-river","Cross River","Calabar","South South"],["delta","Delta","Asaba","South South"],
  ["ebonyi","Ebonyi","Abakaliki","South East"],["edo","Edo","Benin City","South South"],
  ["ekiti","Ekiti","Ado-Ekiti","South West"],["enugu","Enugu","Enugu","South East"],
  ["gombe","Gombe","Gombe","North East"],["imo","Imo","Owerri","South East"],
  ["jigawa","Jigawa","Dutse","North West"],["kaduna","Kaduna","Kaduna","North West"],
  ["kano","Kano","Kano","North West"],["katsina","Katsina","Katsina","North West"],
  ["kebbi","Kebbi","Birnin Kebbi","North West"],["kogi","Kogi","Lokoja","North Central"],
  ["kwara","Kwara","Ilorin","North Central"],["lagos","Lagos","Ikeja","South West"],
  ["nasarawa","Nasarawa","Lafia","North Central"],["niger","Niger","Minna","North Central"],
  ["ogun","Ogun","Abeokuta","South West"],["ondo","Ondo","Akure","South West"],
  ["osun","Osun","Osogbo","South West"],["oyo","Oyo","Ibadan","South West"],
  ["plateau","Plateau","Jos","North Central"],["rivers","Rivers","Port Harcourt","South South"],
  ["sokoto","Sokoto","Sokoto","North West"],["taraba","Taraba","Jalingo","North East"],
  ["yobe","Yobe","Damaturu","North East"],["zamfara","Zamfara","Gusau","North West"]
];

const emptyContentSlots = () => ({
  locationIds: [], environmentProfiles: [], npcProfileIds: [], occupationTags: [],
  communityTags: [], mainMissionIds: [], sideMissionIds: [], environmentalEncounterIds: [],
  educationalConceptIds: [], storyArcId: null, unlockRequirement: null
});

export const NIGERIAN_STATES = STATE_ROWS.map(([id,name,administrativeCapital,region]) => ({
  id, name, kind: "state", administrativeCapital, region, status: "registered",
  regionalContext: { geopoliticalZone: region, researchStatus: "not-yet-researched", evidenceRefs: [] },
  content: emptyContentSlots()
}));

export const NIGERIAN_TERRITORIES = [{
  id: "fct", name: "Federal Capital Territory", shortName: "FCT", kind: "territory",
  administrativeCapital: "Abuja", region: "North Central", status: "registered",
  regionalContext: { geopoliticalZone: "North Central", researchStatus: "not-yet-researched", evidenceRefs: [] },
  content: emptyContentSlots()
}];

export const NIGERIAN_JURISDICTIONS = [...NIGERIAN_STATES, ...NIGERIAN_TERRITORIES];

/**
 * This is the only location currently wired to the existing free-roam scene.
 * The label is deliberately broad: this registry does not claim that every
 * Lagos district or any other state's capital has a separate finished map.
 */
export const WORLD_LOCATIONS = [{
  id: "lagos-free-roam",
  jurisdictionId: "lagos",
  settlementName: "Lagos",
  locationType: "city-environment",
  status: "playable",
  environmentAssetId: "kitcity-current-free-roam",
  engineCityId: "lagos",
  environmentProfileIds: ["urban-streets", "market-edge", "transport-corridor", "residential-neighborhood", "public-space"],
  sectorIds: ["commerce-retail", "transport-logistics", "small-business", "civil-society-community"],
  npcProfileIds: [],
  occupationTags: [],
  communityTags: [],
  mainMissionIds: [],
  sideMissionIds: [],
  environmentalEncounterIds: ["pothole-awareness"],
  educationalConceptIds: [],
  storyArcId: "kitcity-open-world-introduction",
  unlockRequirement: null,
  contentStatus: "starter-environment"
}];

export const ENVIRONMENT_PROFILES = [
  {id:"urban-streets",label:"Urban streets",settingTags:["transport","residential","public-space"]},
  {id:"market-edge",label:"Market and commercial edge", settingTags:["market","commerce","small-business"]},
  {id:"school-campus",label:"School or campus", settingTags:["education","students","professional-development"]},
  {id:"farm-cooperative",label:"Farm or cooperative", settingTags:["agriculture","cooperative","supply-chain"]},
  {id:"health-facility",label:"Health facility", settingTags:["healthcare","privacy","public-services"]},
  {id:"legal-professional-office",label:"Legal or professional office", settingTags:["law","professional-services","contracts"]},
  {id:"transport-corridor",label:"Transport and logistics corridor", settingTags:["transport","logistics","small-business"]},
  {id:"workshop-industrial",label:"Workshop or industrial location", settingTags:["manufacturing","construction","skills","small-business"]},
  {id:"technology-creative-hub",label:"Technology or creative hub", settingTags:["technology","media","music","creative-industries"]},
  {id:"government-civic",label:"Government or civic environment", settingTags:["government","public-administration","civic"]},
  {id:"residential-neighborhood",label:"Residential neighborhood", settingTags:["residential","community","services"]},
  {id:"public-space",label:"Public space", settingTags:["community","sports","hospitality","public-services"]},
  {id:"tourism-cultural",label:"Tourism and cultural setting", settingTags:["tourism","hospitality","culture"]},
  {id:"energy-utility",label:"Energy or utility setting", settingTags:["energy","telecommunications","infrastructure"]}
];

export const SECTOR_REGISTRY = [
  ["agriculture","Agriculture"],["commerce-retail","Commerce and retail"],["education","Education"],
  ["healthcare","Healthcare"],["law","Law"],["government-public-administration","Government and public administration"],
  ["finance","Finance"],["transport-logistics","Transport and logistics"],["manufacturing","Manufacturing"],
  ["technology","Technology"],["media-entertainment","Media and entertainment"],["music-creative-industries","Music and creative industries"],
  ["sports","Sports"],["construction-real-estate","Construction and real estate"],["telecommunications","Telecommunications"],
  ["hospitality-tourism","Hospitality and tourism"],["energy","Energy"],["professional-services","Professional services"],
  ["small-business","Small businesses and informal enterprises"],["students-young-professionals","Students and young professionals"],
  ["civil-society-community","Civil society and community organizations"]
].map(([id,label])=>({id,label}));

/** Suggested content directions, not claims that a mission or asset is already present. */
export const LOCATION_CONTENT_TEMPLATE = Object.freeze({
  environmentProfileIds: [], npcProfileIds: [], occupationTags: [], communityTags: [],
  mainMissionIds: [], sideMissionIds: [], environmentalEncounterIds: [],
  educationalConceptIds: [], storyArcId: null, unlockRequirement: null
});

export function getJurisdiction(id) {
  return NIGERIAN_JURISDICTIONS.find(item => item.id === id) || null;
}
export function getState(id) { return NIGERIAN_STATES.find(item => item.id === id) || null; }
export function getTerritory(id) { return NIGERIAN_TERRITORIES.find(item => item.id === id) || null; }
export function getWorldLocation(id) { return WORLD_LOCATIONS.find(item => item.id === id) || null; }
export function getPlayableLocations(jurisdictionId) {
  return WORLD_LOCATIONS.filter(item => item.status === "playable" && (!jurisdictionId || item.jurisdictionId === jurisdictionId));
}
