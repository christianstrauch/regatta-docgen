export interface RacingRule {
  id: string
  number: string
  title: string
  description: string
  category: "rrs" | "prescription" | "appendix"
  appliesIfMentioned?: boolean
  defaultText: string
  section: "nor" | "si" | "both"
  canModify?: boolean
  part?: string
}

export const racingRules: RacingRule[] = [
  // PART 1 - FUNDAMENTAL RULES
  {
    id: "rule-1",
    number: "1",
    title: "Safety",
    description: "Helping those in danger and life-saving equipment",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Boats shall comply with RRS 1 (Safety).",
    section: "both",
    canModify: false,
    part: "Part 1 - Fundamental Rules"
  },
  {
    id: "rule-2",
    number: "2",
    title: "Fair Sailing",
    description: "Compete with recognized principles of sportsmanship",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Boats shall comply with RRS 2 (Fair Sailing).",
    section: "both",
    canModify: false,
    part: "Part 1 - Fundamental Rules"
  },

  // PART 2 - WHEN BOATS MEET
  {
    id: "rule-10",
    number: "10",
    title: "On Opposite Tacks",
    description: "Port-tack boat keeps clear of starboard-tack boat",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Boats shall comply with RRS Part 2 (When Boats Meet).",
    section: "both",
    canModify: false,
    part: "Part 2 - When Boats Meet"
  },
  {
    id: "rule-18",
    number: "18",
    title: "Mark-Room",
    description: "Mark-room requirements at marks",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Boats shall comply with RRS 18 (Mark-Room).",
    section: "both",
    canModify: false,
    part: "Part 2 - When Boats Meet"
  },

  // PART 3 - CONDUCT OF A RACE
  {
    id: "rule-26",
    number: "26",
    title: "Starting Races",
    description: "Starting sequence and signals",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Races will be started using RRS 26.",
    section: "si",
    canModify: true,
    part: "Part 3 - Conduct of a Race"
  },
  {
    id: "rule-30.1",
    number: "30.1",
    title: "I Flag Rule",
    description: "Round-an-end rule - boats OCS must return around an end",
    category: "rrs",
    appliesIfMentioned: true,
    defaultText: "Rule 30.1 (I Flag) applies. If flag I has been displayed, and any part of a boat's hull, crew or equipment is on the course side during the minute before her starting signal, she shall sail to the pre-start side around an end of the starting line before starting.",
    section: "si",
    canModify: true,
    part: "Part 3 - Conduct of a Race"
  },
  {
    id: "rule-30.2",
    number: "30.2",
    title: "Z Flag Rule",
    description: "20% scoring penalty for boats OCS",
    category: "rrs",
    appliesIfMentioned: true,
    defaultText: "Rule 30.2 (Z Flag) applies. Boats identified as OCS shall receive a 20% scoring penalty without a hearing.",
    section: "si",
    canModify: false,
    part: "Part 3 - Conduct of a Race"
  },
  {
    id: "rule-30.3",
    number: "30.3",
    title: "U Flag Rule",
    description: "Boats in triangle during last minute are scored DNS",
    category: "rrs",
    appliesIfMentioned: true,
    defaultText: "Rule 30.3 (U Flag) applies. Boats in the triangle during the last minute shall be scored Did Not Start (DNS).",
    section: "si",
    canModify: false,
    part: "Part 3 - Conduct of a Race"
  },
  {
    id: "rule-30.4",
    number: "30.4",
    title: "Black Flag Rule",
    description: "Boats in triangle during last minute are disqualified without hearing",
    category: "rrs",
    appliesIfMentioned: true,
    defaultText: "Rule 30.4 (Black Flag) applies. Boats in the triangle during the last minute shall be disqualified without a hearing, even if the race is restarted or resailed.",
    section: "si",
    canModify: false,
    part: "Part 3 - Conduct of a Race"
  },
  {
    id: "rule-32",
    number: "32",
    title: "Shortened Course",
    description: "The race committee may shorten the course",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "The race committee may shorten the course in accordance with RRS 32.",
    section: "si",
    canModify: false,
    part: "Part 3 - Conduct of a Race"
  },
  {
    id: "rule-35",
    number: "35",
    title: "Time Limits",
    description: "Time limits for completing races",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Time limits are specified in the sailing instructions.",
    section: "si",
    canModify: true,
    part: "Part 3 - Conduct of a Race"
  },
  {
    id: "rule-37",
    number: "37",
    title: "VHF Monitoring",
    description: "When flag V is displayed, monitor VHF for safety instructions",
    category: "rrs",
    appliesIfMentioned: true,
    defaultText: "When flag V is displayed, boats shall monitor the designated VHF channel for safety instructions.",
    section: "si",
    canModify: false,
    part: "Part 3 - Conduct of a Race"
  },

  // PART 4 - OTHER REQUIREMENTS WHEN RACING
  {
    id: "rule-40",
    number: "40",
    title: "Personal Flotation Devices",
    description: "Requirements for wearing PFDs",
    category: "rrs",
    appliesIfMentioned: true,
    defaultText: "Personal flotation devices are required to be worn pursuant to RRS 40.1 and 40.2(c).",
    section: "both",
    canModify: false,
    part: "Part 4 - Other Requirements When Racing"
  },
  {
    id: "rule-42",
    number: "42",
    title: "Propulsion",
    description: "Restrictions on methods of propulsion",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Boats shall comply with RRS 42 (Propulsion).",
    section: "both",
    canModify: false,
    part: "Part 4 - Other Requirements When Racing"
  },
  {
    id: "rule-44",
    number: "44",
    title: "Penalties at the Time of an Incident",
    description: "Two-turns and one-turn penalties",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "The penalty for breaking a rule of Part 2 shall be a Two-Turns Penalty under RRS 44.2.",
    section: "si",
    canModify: true,
    part: "Part 4 - Other Requirements When Racing"
  },
  {
    id: "rule-49",
    number: "49",
    title: "Crew Position",
    description: "Competitors shall not station torsos outside lifelines",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Boats shall comply with RRS 49 (Crew Position).",
    section: "both",
    canModify: false,
    part: "Part 4 - Other Requirements When Racing"
  },

  // PART 5 - PROTESTS, REDRESS, HEARINGS
  {
    id: "rule-60",
    number: "60",
    title: "Right to Protest",
    description: "A boat may protest another boat",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Boats may protest in accordance with RRS 60.",
    section: "si",
    canModify: false,
    part: "Part 5 - Protests, Redress, Hearings"
  },
  {
    id: "rule-61",
    number: "61",
    title: "Protest Requirements",
    description: "Requirements for valid protests",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Protests shall be submitted in accordance with RRS 61.",
    section: "si",
    canModify: true,
    part: "Part 5 - Protests, Redress, Hearings"
  },
  {
    id: "rule-63",
    number: "63",
    title: "Hearings",
    description: "Procedures for protest hearings",
    category: "rrs",
    appliesIfMentioned: false,
    defaultText: "Hearings will be conducted in accordance with RRS 63.",
    section: "si",
    canModify: false,
    part: "Part 5 - Protests, Redress, Hearings"
  },

  // APPENDICES
  {
    id: "appendix-a",
    number: "Appendix A",
    title: "Scoring",
    description: "Low Point Scoring System",
    category: "appendix",
    appliesIfMentioned: false,
    defaultText: "The Low Point Scoring System will be used as provided in Appendix A.",
    section: "nor",
    canModify: true,
    part: "Appendices"
  },
  {
    id: "appendix-p",
    number: "Appendix P",
    title: "Special Procedures for Rule 42",
    description: "Procedures for observers to penalize rule 42 violations",
    category: "appendix",
    appliesIfMentioned: true,
    defaultText: "Appendix P (Special Procedures for Rule 42) applies.",
    section: "si",
    canModify: false,
    part: "Appendices"
  },
  {
    id: "appendix-t",
    number: "Appendix T",
    title: "Arbitration",
    description: "Arbitration procedures for protests",
    category: "appendix",
    appliesIfMentioned: true,
    defaultText: "Appendix T (Arbitration) applies.",
    section: "si",
    canModify: false,
    part: "Appendices"
  },

  // US SAILING PRESCRIPTIONS
  {
    id: "appendix-v1",
    number: "Appendix V1",
    title: "One-Turn Penalty (US Sailing)",
    description: "Allows one-turn penalty for certain infractions",
    category: "prescription",
    appliesIfMentioned: true,
    defaultText: "Appendix V1 (allowing one-turn exoneration of certain fouls), but not V2, of the US Sailing Prescriptions applies.",
    section: "si",
    canModify: false,
    part: "US Sailing Prescriptions"
  },
  {
    id: "us-25.1",
    number: "US 25.1",
    title: "NoR and SI Availability",
    description: "RC must ensure NoR and SI are readily available",
    category: "prescription",
    appliesIfMentioned: false,
    defaultText: "US Sailing prescribes that the race committee shall ensure that the notice of race and sailing instructions are readily available to each boat until the end of the event.",
    section: "both",
    canModify: false,
    part: "US Sailing Prescriptions"
  },
  {
    id: "us-part5",
    number: "US Part 5",
    title: "No Fees for Protests",
    description: "No fees shall be charged for protests or requests for redress",
    category: "prescription",
    appliesIfMentioned: false,
    defaultText: "US Sailing prescribes that no fees shall be charged for protests or requests for redress.",
    section: "si",
    canModify: false,
    part: "US Sailing Prescriptions"
  },
  {
    id: "us-34",
    number: "US 34",
    title: "Finishing When Mark Missing",
    description: "Procedure when finishing mark is missing",
    category: "prescription",
    appliesIfMentioned: false,
    defaultText: "US Sailing prescribes that if a finishing mark is missing but another remains, the finishing line is a line through the remaining mark at 90° to the last leg.",
    section: "si",
    canModify: false,
    part: "US Sailing Prescriptions"
  },
  {
    id: "us-76.1",
    number: "US 76.1",
    title: "Competitor Eligibility",
    description: "Prohibition on arbitrary rejection of entries",
    category: "prescription",
    appliesIfMentioned: false,
    defaultText: "US Sailing prescribes that an organizing authority shall not reject entries for arbitrary or capricious reasons or for reason of race, color, religion, national origin, gender, sexual orientation, or age.",
    section: "nor",
    canModify: false,
    part: "US Sailing Prescriptions"
  },
  {
    id: "us-81",
    number: "US 81",
    title: "Hold Harmless Agreements",
    description: "The organizing authority shall not require competitors to assume liabilities",
    category: "prescription",
    appliesIfMentioned: false,
    defaultText: "US Sailing prescribes that the organizing authority shall not require a competitor to assume any liabilities of the organizing authority, race committee, protest committee, host club, sponsors, or any other organization or official involved with the event.",
    section: "nor",
    canModify: false,
    part: "US Sailing Prescriptions"
  }
]

export const commonModifications = [
  {
    rule: "26",
    modification: "Official signals will be made orally by radio on VHF channel [XX]. Placards or flags may not be displayed. (Changes Rule 26.)",
    reason: "Changes starting signal method to radio only"
  },
  {
    rule: "30.1",
    modification: "Rule 30.1 (banning dip starts) applies whether or not the I Flag is displayed.",
    reason: "Makes I Flag rule always apply without flag display"
  },
  {
    rule: "31.2",
    modification: "Any physical contact with the actual Committee Boat shall not be exonerated. (Changes RRS 31.2.)",
    reason: "Stricter penalty for hitting RC boat"
  },
  {
    rule: "35",
    modification: "No finishes will be recorded after the end of the time limit. (Changes Rule 35.)",
    reason: "Strict time limit enforcement"
  },
  {
    rule: "44",
    modification: "The penalty for breaking a rule of Part 2 shall be a One-Turn Penalty (one tack and one gybe) under modified RRS 44.2.",
    reason: "Changes from two-turns to one-turn penalty"
  },
  {
    rule: "61",
    modification: "Protests must be submitted in writing per RRS 61.2 and either hand-delivered by [time] or mailed postmarked no later than [date].",
    reason: "Specifies protest submission requirements"
  }
]

export interface EventDetails {
  // Basic Info
  eventName: string
  organizer: string
  date: string
  firstGunTime?: string
  
  // Location
  racingArea?: string
  startLocation?: string
  finishLocation?: string
  courseLength?: string
  
  // Communication
  vhfChannel?: string
  
  // Entry & Fees
  entryFee?: string
  entryDeadline?: string
  registrationLink?: string
  
  // Awards & Social
  awardsCeremony?: string
  awardsLocation?: string
  
  // Technical
  scoringSystem?: string
  certificateRequired?: string
  timeLimit?: string
  
  // Safety
  pfdRequired?: boolean
  autopilotAllowed?: boolean
  autopilotNotes?: string
  
  // Contact
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  clubAddress?: string
  
  // Fleets
  fleetsDescription?: string
}

export interface SelectedRule {
  ruleId: string
  isSelected: boolean
  modification?: string
}

export interface CustomSection {
  id: string
  title: string
  content: string
  order: number
}

export interface Fleet {
  id: string
  name: string
  description?: string
  color?: string
}

export interface FleetSpecificProvision {
  id: string
  fleetId: string
  content: string
  section: "nor" | "si" | "both"
}

export interface SelectedRuleWithFleet extends SelectedRule {
  fleetId?: string // If set, rule only applies to this fleet
}
