// Sample Doctrinal Content - SOW Section 8.1
// Pre-loaded content for demonstration purposes

import { ingestText, DocumentMetadata } from "./document-processor";

// Sample artillery doctrine content
const sampleDocuments: Array<{
  name: string;
  content: string;
  metadata: Partial<DocumentMetadata>;
}> = [
  {
    name: "155mm Dhanush Technical Manual",
    metadata: {
      category: "technical-manual",
      weaponSystems: ["155mm Dhanush"],
      courseTypes: ["YO", "LGSC"],
      topics: ["Gunnery Theory", "Technical Specifications"],
    },
    content: `
# 155mm Dhanush Technical Manual

## 1. Introduction

The 155mm/45 caliber Dhanush is an indigenous towed artillery gun developed by the Ordnance Factory Board (OFB). It is based on the design of the Bofors FH-77B but incorporates several improvements including electronic systems integration.

## 2. Technical Specifications

### 2.1 Ballistic Data
- Caliber: 155mm/45
- Muzzle Velocity: 827 m/s (standard charge)
- Maximum Range: 38 km (base bleed), 30 km (standard HE)
- Rate of Fire: 3 rounds/minute (sustained), 6 rounds/minute (burst)

### 2.2 Weight and Dimensions
- Combat Weight: 12,750 kg
- Travel Weight: 13,350 kg (with crew cabin)
- Overall Length: 11.5 m (travel)
- Barrel Length: 6.975 m

### 2.3 Ammunition Types
- High Explosive (HE-FRAG)
- Base Bleed Extended Range
- Illumination
- Smoke
- Rocket Assisted Projectile (RAP)

## 3. Operating Procedures

### 3.1 Pre-Fire Checks
1. Verify breech block seating
2. Check recoil system fluid level
3. Inspect ammunition for defects
4. Verify communication with Fire Direction Center
5. Confirm target coordinates and fire orders

### 3.2 Loading Sequence
1. Open breech
2. Insert projectile and ram to seating position
3. Insert propellant charge
4. Close breech
5. Verify firing circuit continuity
6. Report "Ready" to Gun Commander

## 4. Safety Procedures

### 4.1 Minimum Safety Distances
- Muzzle: 15 meters
- Rear arc: 50 meters
- Hearing protection: Mandatory within 25 meters

### 4.2 Misfire Procedures
1. Call "MISFIRE" clearly
2. Wait minimum 2 minutes
3. Check firing mechanism
4. If failure persists, treat as dud
5. Follow disposal procedures
`,
  },
  {
    name: "Gun Crew Drill Manual",
    metadata: {
      category: "sop",
      weaponSystems: ["155mm Dhanush", "155mm Bofors"],
      courseTypes: ["YO", "JCO", "OR_CADRE"],
      topics: ["Gun Drill", "Crew Duties"],
    },
    content: `
# Gun Crew Drill Manual

## 1. Crew Organization

A standard artillery gun crew consists of seven personnel, each with specific duties:

### 1.1 No. 1 - Gun Commander
- Overall command of the gun
- Responsible for safety
- Receives and implements fire orders
- Supervises all crew actions
- Reports readiness to battery command

### 1.2 No. 2 - Breech Operator
- Operates breech mechanism
- Responsible for firing
- Maintains breech area cleanliness
- Signals readiness to No. 1

### 1.3 No. 3 - Layer
- Sets and maintains elevation
- Sets and maintains bearing/azimuth
- Operates laying equipment
- Reports "On target" when ready

### 1.4 No. 4 - Loader
- Loads projectiles into breech
- Uses rammer for proper seating
- Coordinates with No. 5 for ammunition
- Maintains loading area safety

### 1.5 No. 5 - Ammunition Handler
- Prepares ammunition
- Sets fuses as ordered
- Passes rounds to No. 4
- Maintains ammunition accounting

### 1.6 No. 6 - Driver/Radio Operator
- Operates towing vehicle
- Maintains communication equipment
- Assists with gun positioning
- Monitors radio net

### 1.7 No. 7 - Reserve/Assistant
- Assists other crew members
- Handles special tasks
- Provides relief during sustained fire

## 2. Standard Gun Drill Sequence

### 2.1 Action Front
1. Gun Commander receives target data
2. Layer sets bearing and elevation
3. Ammunition Handler prepares round
4. Loader stands ready
5. On "LOAD" - Loader rams projectile
6. Breech Operator loads charge and closes breech
7. "READY" reported when gun is laid
8. "FIRE" command executed by No. 2

### 2.2 Timing Standards
- Experienced crew: First round in 60 seconds
- Sustained rate: 3 rounds per minute
- Emergency rate: 6 rounds in first minute

## 3. Safety Protocols

### 3.1 General Safety Rules
- Never stand in front of muzzle
- Always wear hearing protection
- Check ammunition condition before loading
- Maintain communication at all times
- Follow misfire procedures strictly

### 3.2 Movement Safety
- Secure gun for travel
- Verify towing connection
- Check tire pressure
- Brief convoy procedures
`,
  },
  {
    name: "Fire Direction Center Procedures",
    metadata: {
      category: "doctrine",
      courseTypes: ["LGSC", "STA"],
      topics: ["Fire Control", "Tactical Employment"],
    },
    content: `
# Fire Direction Center (FDC) Operations

## 1. FDC Organization

The Fire Direction Center is the brain of the artillery battery, responsible for converting target information into firing data for the guns.

### 1.1 FDC Personnel
- Fire Direction Officer (FDO)
- Fire Direction NCO
- Computer Operators
- Communication Personnel

### 1.2 Equipment
- Fire Direction Computer
- Map boards and plotting equipment
- Communication systems
- Survey data

## 2. Fire Mission Processing

### 2.1 Call For Fire Format
A standard call for fire contains:
1. Observer identification
2. Warning order (Fire Mission, Adjust Fire, Fire for Effect)
3. Target location (grid coordinates, polar, shift from known point)
4. Target description
5. Method of engagement
6. Method of fire and control

### 2.2 Fire Mission Example
"Alpha Battery, this is OP-1, Fire Mission, Grid 12345678, Enemy infantry in open, Battery 2 rounds, At my command, Over."

## 3. Computational Methods

### 3.1 Manual Computation
When digital systems are unavailable:
1. Plot target on firing chart
2. Determine range using scale
3. Determine deflection
4. Look up elevation in firing tables
5. Apply corrections (MV, temperature, wind)

### 3.2 Met Corrections
Standard meteorological corrections:
- Air temperature: Affects air density
- Propellant temperature: Affects muzzle velocity
- Wind: Affects trajectory
- Air pressure: Affects air density

## 4. Types of Fire

### 4.1 Adjust Fire
- Used when target location is uncertain
- Fire single round, observe, adjust
- Continue until rounds on target
- Then "Fire for Effect"

### 4.2 Fire for Effect
- Used when target location is confirmed
- Fire full battery volleys
- Maximum suppressive effect
- Continue until mission accomplished

### 4.3 Time on Target (TOT)
- Coordinate fires from multiple batteries
- All rounds impact simultaneously
- Maximum surprise and effect
- Requires precise timing calculations
`,
  },
  {
    name: "K9 Vajra Operations Guide",
    metadata: {
      category: "technical-manual",
      weaponSystems: ["K9 Vajra"],
      courseTypes: ["YO", "LGSC"],
      topics: ["Self-Propelled Artillery", "Digital Fire Control"],
    },
    content: `
# K9 Vajra Self-Propelled Howitzer

## 1. System Overview

The K9 Vajra is a 155mm/52 caliber self-propelled howitzer procured from South Korea and modified for Indian conditions. It represents a significant capability enhancement for the Indian Army artillery.

## 2. Technical Specifications

### 2.1 Armament
- Main Gun: 155mm/52 caliber
- Maximum Range: 40+ km (base bleed)
- Rate of Fire: 6 rounds/minute (burst), 2 rounds/minute (sustained)
- Ammunition Capacity: 48 rounds (24 ready)

### 2.2 Mobility
- Engine: 1000 HP diesel
- Maximum Speed: 67 km/h (road)
- Off-road Speed: 40 km/h
- Range: 480 km

### 2.3 Protection
- Armored hull (small arms and shell splinters)
- NBC protection system
- Automatic fire suppression

## 3. Fire Control System

### 3.1 Digital Components
- Ballistic computer
- GPS/INS navigation
- Automatic gun laying
- Digital fire control network

### 3.2 Shoot and Scoot Capability
The K9 Vajra can:
1. Receive fire mission while moving
2. Stop and deploy in 60 seconds
3. Fire multiple rounds
4. Displace before counter-battery response

## 4. Crew Duties

### 4.1 Commander
- Overall vehicle command
- Tactical decisions
- Communication with battery

### 4.2 Gunner/Layer
- Operates fire control system
- Verifies laying data
- Monitors gun function

### 4.3 Loader
- Operates automatic loader
- Handles ammunition
- Monitors ammunition status

### 4.4 Driver
- Operates vehicle
- Navigation during movement
- Position selection

### 4.5 Fifth Crew Member
- Assists with ammunition
- Perimeter security
- Relief duties

## 5. Tactical Employment

### 5.1 Advantages
- Rapid displacement
- All-weather capability
- Protected crew
- Digital networking

### 5.2 Considerations
- Fuel consumption
- Maintenance requirements
- Recovery capability
- Training needs
`,
  },
  {
    name: "Artillery Safety Manual",
    metadata: {
      category: "sop",
      weaponSystems: ["155mm Dhanush", "155mm Bofors", "K9 Vajra", "Pinaka MBRL"],
      courseTypes: ["YO", "JCO", "OR_CADRE", "LGSC"],
      topics: ["Safety Procedures", "Emergency Procedures"],
    },
    content: `
# Artillery Safety Manual

## 1. General Safety Principles

Artillery operations involve significant hazards that can cause death or serious injury if safety procedures are not followed.

### 1.1 Cardinal Rules of Artillery Safety
1. Always treat every weapon as if it were loaded
2. Never point the gun at anything you don't intend to destroy
3. Keep your finger off the trigger until ready to fire
4. Be sure of your target and what is beyond it
5. Follow all safety distances and procedures

## 2. Range Safety

### 2.1 Surface Danger Zone
The Surface Danger Zone (SDZ) must be cleared before firing:
- Maximum range of ammunition plus dispersion
- Ricochet area calculations
- Consider adjacent units and civilians

### 2.2 Minimum Safe Distance
Maintain minimum distances from:
- Muzzle blast: 15 meters from gun front
- Rear blast: 50 meters behind gun
- During loading: All personnel clear of breech

## 3. Ammunition Handling

### 3.1 Storage Requirements
- Store in designated ammunition points
- Separate by lot number
- Protect from weather
- Maintain security

### 3.2 Pre-Fire Inspection
Before loading, inspect each round for:
- Physical damage
- Corrosion
- Proper fuze installation
- Correct ammunition type

### 3.3 Fuze Safety
- Do not arm fuzes until directed
- Handle armed fuzes carefully
- Report any dropped armed ammunition
- Verify fuze type matches fire mission

## 4. Misfire Procedures

### 4.1 Immediate Actions
1. Call "MISFIRE" loudly
2. All personnel maintain positions
3. No movement toward gun
4. Begin timing (2 minutes minimum)

### 4.2 After Wait Period
1. Gun Commander approaches gun
2. Check firing mechanism
3. Attempt second firing if appropriate
4. If still misfires, treat as dud

### 4.3 Dud Handling
- Do not attempt to remove from breech
- Evacuate to minimum 100 meters
- Call EOD support
- Mark location clearly

## 5. Emergency Procedures

### 5.1 Fire
- Alert all personnel
- Evacuate ammunition area
- Fight fire only if safe
- Report immediately

### 5.2 Premature Detonation
- Render first aid
- Evacuate casualties
- Secure area
- Preserve evidence for investigation

### 5.3 Runaway Gun
- Clear the area immediately
- Allow gun to cycle empty
- Investigate cause before resuming
`,
  },
];

// Function to load sample documents
export function loadSampleDocuments(): void {
  console.log("Loading sample artillery documents...");

  for (const doc of sampleDocuments) {
    const result = ingestText(doc.content, doc.name, doc.metadata);
    if (result.success) {
      console.log(`Loaded: ${doc.name} (${result.chunkCount} chunks)`);
    } else {
      console.error(`Failed to load: ${doc.name} - ${result.error}`);
    }
  }

  console.log("Sample documents loaded.");
}

// Auto-load on first import
let loaded = false;
export function ensureSampleDocumentsLoaded(): void {
  if (!loaded) {
    loadSampleDocuments();
    loaded = true;
  }
}
