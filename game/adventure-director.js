/**
 * Exploration-first mission director.
 * It never interrupts movement: it only marks an encounter as available.
 */
export class AdventureDirector {
  constructor(snapshot = {}) {
    this.stateId = snapshot.stateId || "lagos";
    this.locationId = snapshot.locationId || "lagos-mainland";
    this.exploreScore = Number(snapshot.exploreScore) || 0;
    this.travelMeters = Number(snapshot.travelMeters) || 0;
    this.activityCount = Number(snapshot.activityCount) || 0;
    this.completed = new Set(snapshot.completed || []);
    this.dismissed = new Set(snapshot.dismissed || []);
    this.available = new Set(snapshot.available || []);
    this.lastMajorEncounter = snapshot.lastMajorEncounter || null;
    this.lastMajorAtActivity = Number(snapshot.lastMajorAtActivity) || 0;
    this.activeConversation = null;
    this.pendingActivity = null;
  }

  recordTravel(meters) {
    if (!Number.isFinite(meters) || meters <= 0) return;
    this.travelMeters += meters;
    this.exploreScore += Math.min(meters, 20) * 0.12;
  }

  recordActivity(activity, value = 1) {
    this.activityCount += Math.max(1, Number(value) || 1);
    const points = { exploration: 8, errand: 12, hazard: 10, discovery: 14, social: 5, freeRoam: 3 };
    this.exploreScore += points[activity] || 2;
    this.pendingActivity = activity;
  }

  recordMissionCompletion(id) {
    if (id) this.completed.add(id);
    this.activityCount += 2;
    this.exploreScore += 12;
  }

  canOffer(encounter) {
    if (!encounter || this.completed.has(encounter.id) || this.dismissed.has(encounter.id)) return false;
    const req = encounter.prerequisites || {};
    if (this.exploreScore < (req.minExploreScore || 0)) return false;
    if (this.travelMeters < (req.minTravelMeters || 0)) return false;
    if ((req.completedAny || []).length && !req.completedAny.some(id => this.completed.has(id))) return false;
    if ((req.completedAll || []).some(id => !this.completed.has(id))) return false;
    // A major educational encounter needs meaningful activity after the last one.
    if (this.lastMajorEncounter && this.activityCount - this.lastMajorAtActivity < 3) return false;
    return true;
  }

  refresh(encounters) {
    for (const encounter of encounters || []) {
      if (this.canOffer(encounter)) this.available.add(encounter.id);
      else this.available.delete(encounter.id);
    }
    return [...this.available];
  }

  begin(encounter) {
    if (!this.available.has(encounter.id) || !this.canOffer(encounter)) return false;
    this.activeConversation = encounter.id;
    this.available.delete(encounter.id);
    this.lastMajorEncounter = encounter.id;
    this.lastMajorAtActivity = this.activityCount;
    return true;
  }

  end(encounterId, outcome = "completed") {
    this.activeConversation = null;
    if (outcome === "completed") this.completed.add(encounterId);
    else if (outcome === "dismissed") this.dismissed.add(encounterId);
  }

  snapshot() {
    return {
      stateId: this.stateId, locationId: this.locationId, exploreScore: this.exploreScore,
      travelMeters: this.travelMeters, activityCount: this.activityCount,
      completed: [...this.completed], dismissed: [...this.dismissed], available: [...this.available],
      lastMajorEncounter: this.lastMajorEncounter, lastMajorAtActivity: this.lastMajorAtActivity
    };
  }
}
