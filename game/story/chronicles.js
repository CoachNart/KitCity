/**
 * Empty storyline registry.
 * The previous mission catalogue and all of its narrative content have been removed.
 * A future storyline must be authored as new content rather than inheriting old missions.
 */
export const CHARACTER_ORDER = Object.freeze([]);
export const CHAPTERS = Object.freeze([]);
export const MISSIONS = Object.freeze([]);
export const FIRST_ENCOUNTER_ORDER = Object.freeze([]);
export const MISSION_BY_ID = Object.freeze({});

export function getNextMission() {
  return null;
}

export function validateChronicles() {
  return {
    valid: true,
    errors: [],
    missionCount: 0,
    characterCount: 0,
    implementedStoryStates: []
  };
}
