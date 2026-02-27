import type { Submission, CheckStatus, FormDataUnion } from "@/lib/types"
import { getBrand } from '@/lib/brand';
import type { Brand } from '@/lib/brand';

// ============================================================================
// TYPE GUARDS – safely check for optional properties using Extract
// ============================================================================
type WithItems = Extract<FormDataUnion, { items: any }>;
type WithDefectDetails = Extract<FormDataUnion, { defectDetails: any }>;
type WithSignature = Extract<FormDataUnion, { signature: any }>;

function hasItems(data: FormDataUnion): data is WithItems {
  return 'items' in data;
}
function hasDefectDetails(data: FormDataUnion): data is WithDefectDetails {
  return 'defectDetails' in data;
}
function hasSignature(data: FormDataUnion): data is WithSignature {
  return 'signature' in data;
}

// ============================================================================
// EXCAVATOR HARVESTER SECTIONS (34 sections)
// ============================================================================
const sections: {
  title: string;
  items: string[];
}[] = [
  {
    title: "License and Phepha",
    items: ["Phepha valid.", "Displayed and visible."]
  },
  {
    title: "Protective Structure",
    items: [
      "No cracks/damages.",
      "No bolts missing/loose.",
      "Guards not damaged and intact."
    ]
  },
  {
    title: "Exhaust",
    items: ["Clamps secure.", "No excessive smoking/blowing."]
  },
  {
    title: "Steps and Rails",
    items: ["Steps in good condition.", "Not loose/broken."]
  },
  {
    title: "Cab",
    items: [
      "Cab neat and tidy.",
      "Door and mechanism working.",
      "Door rubber in good condition.",
      "Door handles functional."
    ]
  },
  {
    title: "Windscreen, Windows & Wipers",
    items: [
      "Clean/secure.",
      "No cracks or damages to windscreen.",
      "Window visibility not obscured by cracks.",
      "Wipers are working."
    ]
  },
  {
    title: "Air Conditioner",
    items: ["In working condition."]
  },
  {
    title: "Seats",
    items: [
      "Condition of seat.",
      "Seat secured.",
      "Rotating lock functional.",
      "Seat adjuster functional."
    ]
  },
  {
    title: "Safety Belt",
    items: [
      "Safety belts bolted/secured.",
      "No damage/not extremely dirty/bleached or dyed.",
      "Retractor clip in order and clicks into place."
    ]
  },
  {
    title: "Hooter and Reverse Alarm",
    items: ["Hooter working and in good condition.", "Reverse alarm working."]
  },
  {
    title: "Gauges",
    items: ["In working order.", "Any warning symbols/lights."]
  },
  {
    title: "Hydraulic Controls",
    items: [
      "Not loose/responsive.",
      "No steering play.",
      "Rear steering.",
      "Pivot/steering ram pins not loose."
    ]
  },
  {
    title: "Hydraulic Head Cut Off (Bail Lever)",
    items: [
      "Operational (when it is disengaged, the hydraulics do not operate)."
    ]
  },
  {
    title: "Working Lights (LED)",
    items: [
      "In working order (if LED's, 2 thirds must be working) ie. (If 9 LED's, 6 must be working)."
    ]
  },
  {
    title: "Rotating Light",
    items: ["Flashing/rotating beacon light in working condition."]
  },
  {
    title: "Grill (Sieve)",
    items: [
      "Check condition – no damage.",
      "Not clogged.",
      "Air is moving freely."
    ]
  },
  {
    title: "Battery",
    items: [
      "Secure.",
      "Sufficient water.",
      "Terminals clean/tight & covers on.",
      "No exposed wiring."
    ]
  },
  {
    title: "Radiator",
    items: ["Secure.", "Water level correct.", "No signs of leaking."]
  },
  {
    title: "Air Pre-Cleaner",
    items: [
      "Good condition – no damage/no sucking of air.",
      "Clean and secure.",
      "No dust in pre-cleaner bowl."
    ]
  },
  {
    title: "Fan Belt",
    items: ["No squeaking.", "No signs of damage."]
  },
  {
    title: "Fuel & Oil levels",
    items: [
      "Fuel and oil levels correct.",
      "Fuel cap and hydraulic filler cap secure.",
      "All dipsticks secure."
    ]
  },
  {
    title: "Fuel & Oil Leaks",
    items: [
      "Fuel and oil pipes secure.",
      "No worn or damaged pipes.",
      "No visible fuel and oil leaks."
    ]
  },
  {
    title: "Wiring",
    items: ["No loose, damaged or exposed wires.", "No loose broken plugs."]
  },
  {
    title: "Grease",
    items: ["Adequately greased chassis.", "No missing or damaged grease nipples."]
  },
  {
    title: "Boom Structure",
    items: [
      "Not bent/cracked.",
      "Pins all secured.",
      "No loose/missing bolts."
    ]
  },
  {
    title: "Hydraulic Cylinders",
    items: [
      "Good condition – no damage.",
      "No loose fittings.",
      "No oil leaks.",
      "No missing bolts/nuts."
    ]
  },
  {
    title: "Hydraulic Hoses and Fittings",
    items: [
      "No excessive rubbing.",
      "No loose brackets/bolts/nuts.",
      "Smooth operation.",
      "Jaws not cracked or broken."
    ]
  },
  {
    title: "Harvester Head",
    items: [
      "No pipes leaking/rubbing.",
      "No loose brackets/bolts/nuts.",
      "Roller condition good/smooth operation.",
      "Knives secure/good condition.",
      "Grease hangar link and attachment adequately greased."
    ]
  },
  {
    title: "Cutting Bar & Chain",
    items: [
      "Saw box in good condition.",
      "No wear / adequately lubricated.",
      "Correctly tensioned."
    ]
  },
  {
    title: "Tracks & Sprockets",
    items: [
      "Tracks are aligned.",
      "Not damaged or worn.",
      "No cracks.",
      "No bolts/pins loose or missing."
    ]
  },
  {
    title: "All Excess Loose Debris Removed Pre-Shift",
    items: [
      "Battery area/exhaust area.",
      "Behind the boom/hydraulic cooler.",
      "Engine bay."
    ]
  },
  {
    title: "Escape Hatch & Hammer",
    items: ["Test the escape hatch opening.", "Escape hammer is easily accessible."]
  },
  {
    title: "Communication",
    items: [
      "Radio or cell phone in working condition.",
      "Handheld panic alarm functional."
    ]
  },
  {
    title: "Fire Systems",
    items: [
      "Gauge light working/no warning lights.",
      "No damaged hoses.",
      "Secured/service/seal in place.",
      "Gauges in order."
    ]
  }
];

// ============================================================================
// EXCAVATOR HARVESTER SECTION‑LEVEL ICON MAPPING
// ============================================================================
const iconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Air Pre-Cleaner": "air-pre-cleaner.png",
  "Battery": "battery.png",
  "Hydraulic Head Cut Off (Bail Lever)": "bail-lever.png",
  "Fan Belt": "fan-belt.png",
  "Fuel & Oil levels": "fuel-oil-levels.png",
  "Fuel & Oil Leaks": "fuel-leaks.png",
  "Wiring": "wiring.png",
  "Grease": "grease.png",
  "Grill (Sieve)": "grill.png",
  "Working Lights (LED)": "led.png",
  "Radiator": "radiator.png",
  "Rotating Light": "rotating-light.png",
  "Boom Structure": "boom-structure.png",
  "Hydraulic Cylinders": "hydraulic-cylinders.png",
  "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
  "Harvester Head": "harvester-head.png",
  "Cutting Bar & Chain": "cutting-bar.png",
  "Tracks & Sprockets": "tracks-sprockets.png",
  "All Excess Loose Debris Removed Pre-Shift": "all-excess-loose-debris.png",
  "Escape Hatch & Hammer": "escape-hatch.png",
  "Communication": "communication.png",
  "Fire Systems": "fire-system.png"
};

// ============================================================================
// LIGHT DELIVERY ITEM‑LEVEL ICON MAPPING (matches web form)
// ============================================================================
const lightItemIconMap: Record<string, string> = {
  "Drivers license available": "license2.png",
  "Valid training card": "license2.png",
  "Vehicle registration document": "license2.png",
  "Windscreen (cracks/chips)": "wipes.png",
  "Wipers and washers": "wipes.png",
  "Mirrors (rear view/side)": "mirrors2.png",
  "Lights (head/tail/brake/indicator)": "led.png",
  "Horn": "hooters.png",
  "Seat belt": "safety-belt.png",
  "Seats (condition/adjustment)": "seats.png",
  "Fire extinguisher (serviced/sealed)": "fire-extinguisher.png",
  "Warning triangle": "emergency-triangle.png",
  "Jack and wheel spanner": "wheel-nut.png",
  "Spare wheel (condition/pressure)": "types-spares.png",
  "Tyres (condition/pressure/wear)": "types-spares.png",
  "Brakes (foot/handbrake)": "foot-brake.png",
  "Steering (play/condition)": "steering-column.png",
  "Oil level": "oil-fluid-air-level.png",
  "Coolant level": "radiator.png",
  "Fuel level": "fuel-oil-levels.png",
  "Battery (condition/terminals)": "battery.png",
  "Exhaust system (leaks/condition)": "air-fuel-leaks.png",
  "Body (dents/damage)": "bonnet-retaining-catch.png",
  "Doors (locks/handles)": "cabs.png",
  "General cleanliness": "wipes.png"
};

// ============================================================================
// ICON MAPS FOR ALL OTHER FORMS (per‑item)
// ============================================================================
const lowbedItemIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Body of Cab / Trailer": "cabs.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Mirrors": "mirrors2.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Steering Column": "steering-column.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Clutch": "clutch.png",
  "Lamps": "led.png",
  "Brakes": "foot-brake.png",
  "Handbrake and Trailer Brakes (If Fitted)": "hand-brake.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "Wiring": "wiring.png",
  "Air Tank Drain": "air-fuel-leaks.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png",
  "Fuel, Air and Oil leaks": "fuel-leaks.png",
  "Differentials": "differentials.png",
  "Tyres": "types-spares.png",
  "Mud Flaps": "mud-flap.png",
  "Hoses & Fittings (Air & Hydraulics)": "hydraulic-hoses.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Trailer Deck": "boom-structure.png",
  "Tow Bar & Hitch/King Pin": "tow-hitch.png",
  "Landing Gear": "landing-gear.png",
  "Anchor Points, Chains & Binders": "anchor-points.png",
  "Chevron, Reflectors and Tape": "led.png"
};

const mechanicLDVIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Cab": "cabs.png",
  "Mirrors": "mirrors2.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Steering": "steering-column.png",
  "Gauges": "gauges.png",
  "Working Lights": "led.png",
  "Clutch": "clutch.png",
  "Foot Brake": "foot-brake.png",
  "Hand Brake/Brake Cable": "hand-brake.png",
  "Bonnet Retaining Catch": "bonnet-retaining-catch.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "V- Belt": "fan-belt.png",
  "Wiring": "wiring.png",
  "Tyres & Spare": "types-spares.png",
  "Wheel Nuts": "wheel-nut.png",
  "Mud Flaps": "mud-flap.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png"
};

const excavatorLoaderIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Hydraulic Head Cut Off (Bail Lever)": "bail-lever.png",
  "Working Lights (LED)": "led.png",
  "Rotating Light": "rotating-light.png",
  "Grill (Sieve)": "grill.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "Air Pre-Cleaner": "air-pre-cleaner.png",
  "Fan Belt": "fan-belt.png",
  "Fuel & Oil levels": "fuel-oil-levels.png",
  "Fuel & Oil Leaks": "fuel-leaks.png",
  "Wiring": "wiring.png",
  "Grease": "grease.png",
  "Boom Structure": "boom-structure.png",
  "Hydraulic Cylinders": "hydraulic-cylinders.png",
  "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
  "Grab": "boom-structure.png",
  "Tracks & Sprockets": "tracks-sprockets.png",
  "All Excess Loose Debris Removed Pre-Shift": "all-excess-loose-debris.png",
  "Escape Hatch & Hammer": "escape-hatch.png",
  "Communication": "communication.png",
  "Fire Systems": "fire-system.png"
};

const personalLabourCarrierIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Clutch": "clutch.png",
  "Hand Brake/Brake Cable": "hand-brake.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "Fan Belt": "fan-belt.png",
  "Wiring": "wiring.png",
  "Tyres & Spare": "types-spares.png",
  "Wheel Nuts": "wheel-nut.png",
  "Mud Flaps": "mud-flap.png",
  "Fuel & Oil levels": "fuel-oil-levels.png",
  "Fuel & Oil Leaks": "fuel-leaks.png",
  "Tow Hitch": "tow-hitch.png",
  "Communication": "communication.png",
  "Chocks": "wheel-nut.png",
  "Emergency Triangles": "emergency-triangle.png",
  "Fire Extinguisher (1 x 1.5kg extinguisher)": "fire-extinguisher.png"
};

const ponsseBisonIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Safety/Emergency Cut Out System (Emergency Button)": "emergency-triangle.png",
  "Working Lights (LED)": "led.png",
  "Rotating Light": "rotating-light.png",
  "Park Brake": "hand-brake.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "Fan Belt": "fan-belt.png",
  "Wiring": "wiring.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png",
  "Fuel & Oil Leaks": "fuel-leaks.png",
  "Grease": "grease.png",
  "Tyres": "types-spares.png",
  "Headboard and Uprights": "boom-structure.png",
  "Boom Structure": "boom-structure.png",
  "Hydraulic Cylinders": "hydraulic-cylinders.png",
  "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
  "Grab": "boom-structure.png",
  "All Excess Loose Debris Removed Pre-Shift": "all-excess-loose-debris.png",
  "Visibility Triangle": "emergency-triangle.png",
  "Communication": "communication.png",
  "1 x 6kg Fire Extinguisher": "fire-extinguisher.png",
  "Escape Hatch & Hammer": "escape-hatch.png"
};

const selfLoadingForwarderIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Safety/Emergency Cut Out System (Emergency Button)": "emergency-triangle.png",
  "Working Lights (LED)": "led.png",
  "Park Brake": "hand-brake.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "Fan Belt": "fan-belt.png",
  "Wiring": "wiring.png",
  "Fuel & Oil levels": "fuel-oil-levels.png",
  "Fuel & Oil Leaks": "fuel-leaks.png",
  "Grease": "grease.png",
  "Tyres": "types-spares.png",
  "Headboard and Uprights": "boom-structure.png",
  "Boom Structure": "boom-structure.png",
  "Hydraulic Cylinders": "hydraulic-cylinders.png",
  "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
  "Grab": "boom-structure.png",
  "All Excess Loose Debris Removed Pre-Shift": "all-excess-loose-debris.png",
  "Communication": "communication.png",
  "Fire Systems": "fire-system.png",
  "Escape Hatch": "escape-hatch.png"
};

const skidderIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Exhaust": "exhaust.png",
  "Cab": "cabs.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Working Lights (LED)": "led.png",
  "Rotating Light": "rotating-light.png",
  "Foot Brake": "foot-brake.png",
  "Emergency Park Brake": "hand-brake.png",
  "Battery": "battery.png",
  "Air Pre-Cleaner": "air-pre-cleaner.png",
  "Radiator": "radiator.png",
  "Fan Belt": "fan-belt.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png",
  "Fuel, Air and Oil leaks": "fuel-leaks.png",
  "Grease": "grease.png",
  "Tyres": "types-spares.png",
  "Hydraulic Cylinders": "hydraulic-cylinders.png",
  "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
  "Winch": "winch.png",
  "Tackle": "boom-structure.png",
  "Communication": "communication.png",
  "Fire Extinguisher (1 x 9kg extinguisher)": "fire-extinguisher.png"
};

const timberTruckTrailerIconMap: Record<string, string> = {
  "Vehicle License and Phepha": "license2.png",
  "Body of Cab / Trailer": "cabs.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Mirrors": "mirrors2.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Steering": "steering-column.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Clutch": "clutch.png",
  "Lamps": "led.png",
  "Foot Brake": "foot-brake.png",
  "Handbrake and Trailer Brakes (If Fitted)": "hand-brake.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "Air Tank Drain": "air-fuel-leaks.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png",
  "Fuel, Air and Oil leaks": "fuel-leaks.png",
  "Differentials": "differentials.png",
  "Fire Extinguishers (One in place)": "fire-extinguisher.png"
};

const trailerIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Number Plate": "license2.png",
  "Trailer Body": "cabs.png",
  "Trailer Doors/Opening Flaps": "cabs.png",
  "Steps and Rails": "steps-and-rails.png",
  "Chevron, Reflectors and Tape": "led.png",
  "Working Lights": "led.png",
  "Trailer Plug/Electric Wiring & Connectors": "wiring.png",
  "Hand Brake/Brake Cable": "hand-brake.png",
  "U-Bolts": "wheel-nut.png",
  "Grease": "grease.png",
  "Tyres": "types-spares.png",
  "Wheel Rims": "wheel-nut.png",
  "Wheel Nuts": "wheel-nut.png",
  "Mud Flaps": "mud-flap.png"
};

const serviceDieselTruckIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Body of Cab / Tank": "cabs.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Cab": "cabs.png",
  "Mirrors": "mirrors2.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Steering": "steering-column.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Clutch": "clutch.png",
  "Lamps": "led.png",
  "Foot Brake": "foot-brake.png",
  "Hand Brake/Brake Cable": "hand-brake.png",
  "Battery": "battery.png",
  "Radiator": "radiator.png",
  "Air Tank Drain": "air-fuel-leaks.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png",
  "Fuel, Air and Oil leaks": "fuel-leaks.png",
  "Differentials": "differentials.png"
};

// ============================================================================
// ICON MAPS FOR RECENT FORMS
// ============================================================================
const waterCartTrailerIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Number Plate": "license2.png",
  "Trailer Body": "cabs.png",
  "Water Tank": "cabs.png",
  "Hose Pipe & Nozzle": "hydraulic-hoses.png",
  "Chevron, Reflectors and Tape": "led.png",
  "Working Lights": "led.png",
  "Trailer Plug & Electric Wiring": "wiring.png",
  "U-Bolts": "wheel-nut.png",
  "Straps & Ratchets": "tie-down.png",
  "Safety Chain": "tow-hitch.png",
  "Tyres": "types-spares.png",
  "Wheel Rims": "wheel-nut.png",
  "Wheel Nuts": "wheel-nut.png",
  "Mud Flaps": "mud-flap.png",
  "General Condition": "wipes.png",
  "On/Off Switch": "wiring.png",
  "Pull Start Rope": "fan-belt.png",
  "Fuel Tank": "fuel-oil-levels.png",
  "Fuel levels": "fuel-oil-levels.png",
  "Engine Oil": "oil-fluid-air-level.png",
  "Air Filter": "air-pre-cleaner.png",
  "Guards": "protective-structure.png",
  "Pressure Hose": "hydraulic-hoses.png",
  "Hose Couplings / Quick Coupler": "hydraulic-hoses.png",
  "Pressure Gun": "hydraulic-controls.png",
  "Lance (Wand)": "boom-structure.png"
};

const weeklyMachineryIconMap: Record<string, string> = {
  // A. Engine
  "A1. Conditions/cleanliness": "wipes.png",
  "A2. Leaks (water, oil, or fuel)": "fuel-leaks.png",
  "A3. Fluid levels": "oil-fluid-air-level.png",
  "A4. Starter function": "battery.png",
  "A5. Engine guards": "protective-structure.png",
  "A6. Belts": "fan-belt.png",
  "A7. Radiator hoses and cap": "radiator.png",
  // B. Chassis / Frame / Cab
  "B1. Condition and cleanliness": "wipes.png",
  "B2. Seats": "seats.png",
  "B3. Doors and locks": "cabs.png",
  "B4. Windscreen / Windows": "wipes.png",
  "B5. Mirrors": "mirrors2.png",
  "B6. Chassis cracks": "boom-structure.png",
  "B7. FOPS / ROPS": "protective-structure.png",
  "B8. Headboards / Uprights": "boom-structure.png",
  "B9. Jockey wheel / Load stand (trailer)": "wheel-nut.png",
  "B10. Tow bar and eye and tow hook": "tow-hitch.png",
  // C. Transmission (Drive Train)
  "C1. Clutch operations and hydraulics": "clutch.png",
  "C2. Propshaft, U and CV joints": "differentials.png",
  "C3. Diff and final drives (guards)": "differentials.png",
  "C4. Oil leaks": "fuel-leaks.png",
  "C5. Oscillation": "boom-structure.png",
  "C6. Bogey greasing": "grease.png",
  // D. Electrics
  "D1. Lights": "led.png",
  "D2. Hooter": "hooters.png",
  "D3. Wiper": "wipes.png",
  "D4. Battery - secure": "battery.png",
  "D5. Rotating light": "rotating-light.png",
  "D6. Two way radio": "communication.png",
  // E. Brakes
  "E1. Hydraulic leaks / levels": "fuel-leaks.png",
  "E2. Brake lines / hoses / levers": "foot-brake.png",
  "E3. Exhaust brake": "exhaust.png",
  "E4. Service brake": "foot-brake.png",
  "E5. Handbrake": "hand-brake.png",
  "E6. Retarder emergency stop": "hand-brake.png",
  "E7. Air pressure gauges": "gauges.png",
  // F. Wheels
  "F1. Tyres, rims and spares": "types-spares.png",
  "F2. Tyre air pressure": "types-spares.png",
  "F3. Studs and nuts": "wheel-nut.png",
  "F4. Tracks / rollers / sprockets": "tracks-sprockets.png",
  "F5. Wheel bearings": "wheel-nut.png",
  "F6. Steering - free play": "steering-column.png",
  // G. Exhaust
  "G1. Leaks": "fuel-leaks.png",
  "G2. Brackets": "boom-structure.png",
  "G3. Soot": "exhaust.png",
  // H. Hydraulics
  "H1. No cracks on pipes and fittings": "hydraulic-hoses.png",
  "H2. Hydraulic pipes and fittings secure": "hydraulic-hoses.png",
  "H3. Hydraulic brackets": "hydraulic-controls.png",
  "H4. Oil leaks": "fuel-leaks.png",
  "H5. Cylinders": "hydraulic-cylinders.png",
  "H6. Pins / bushes": "boom-structure.png",
  // I. Safety & Emergency
  "I1. Safety belt": "safety-belt.png",
  "I2. Reverse alarm": "hooters.png",
  "I3. Fire extinguisher / suppression": "fire-extinguisher.png",
  "I4. Chocks x 2": "wheel-nut.png",
  "I5. Emergency triangles x 2": "emergency-triangle.png",
  // J. Attachments (Grab)
  "J1. Hangar link / spacers": "boom-structure.png",
  "J2. Greasing adequate": "grease.png",
  "J3. Rotator": "hydraulic-controls.png",
  "J4. Oil leaks": "fuel-leaks.png",
  "J5. Cracks / wear": "boom-structure.png",
  "J6. Pins / bushes": "boom-structure.png",
  "J7. Grab tines": "boom-structure.png",
  // K. Attachments (Head)
  "K1. Hangar link / spacers": "boom-structure.png",
  "K2. All grease nipples functional / greasing adequate": "grease.png",
  "K3. Rotator": "hydraulic-controls.png",
  "K4. Oil leaks": "fuel-leaks.png",
  "K5. Cracks / wear": "boom-structure.png",
  "K6. Pins / bushes": "boom-structure.png",
  "K7. Knives and rollers sharp": "cutting-bar.png",
  "K8. Rollers / motors / bypass": "hydraulic-cylinders.png",
  "K9. Saw motor / chain guard and cutter bar pump": "cutting-bar.png",
  "K10. Covers secure": "protective-structure.png",
  // L. Attachments (Winch)
  "L1. Mountings": "boom-structure.png",
  "L2. Greasing adequate": "grease.png",
  "L3. Oil leaks": "fuel-leaks.png",
  "L4. Condition": "wipes.png",
  "L5. Cables and chains": "winch.png",
  "L6. Roller guides": "tracks-sprockets.png",
  // M. Crane / Boom
  "M1. Greasing adequate": "grease.png",
  "M2. Cracks": "boom-structure.png",
  "M3. Pins / bushes": "boom-structure.png",
  "M4. Nose cone": "boom-structure.png",
  "M5. Main pin": "boom-structure.png",
};

const bellTimberTruckIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Exhaust": "exhaust.png",
  "Steps and Rails": "steps-and-rails.png",
  "Bonnet Shock Absorbers": "bonnet-retaining-catch.png",
  "Cab": "cabs.png",
  "Mirrors": "mirrors2.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Steering Column": "steering-column.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Lamps": "led.png",
  "Rotating Light": "rotating-light.png",
  "Braking System (Foot Brake/Exhaust Brake)": "foot-brake.png",
  "Emergency Park Brake": "hand-brake.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png",
  "Fuel, Air and Oil leaks": "fuel-leaks.png",
  "Grease": "grease.png",
  "Grill": "grill.png",
  "Air Pre-Cleaner": "air-pre-cleaner.png",
  "Battery": "battery.png",
  "V-Belt": "fan-belt.png",
  "Radiator": "radiator.png",
  "Air Tank Drain": "air-fuel-leaks.png",
  "Wiring": "wiring.png",
  "Prop-Shaft/Universals/Carrier Bearings": "differentials.png",
  "Drive Train": "differentials.png",
  "Tyres": "types-spares.png",
  "Headboard and Uprights": "boom-structure.png",
  "Chevron, Reflectors and Tape": "led.png",
  "Visibility Triangle": "emergency-triangle.png",
  "Boom Structure": "boom-structure.png",
  "Hydraulic Cylinders": "hydraulic-cylinders.png",
  "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
  "Grab": "boom-structure.png",
  "Communication": "communication.png",
  "Chocks": "wheel-nut.png",
  "Fire Extinguisher (1 x 1.5kg extinguisher)": "fire-extinguisher.png",
  "Emergency Triangles": "emergency-triangle.png",
};

// ============================================================================
// NEW ICON MAPS FOR LATEST FORMS
// ============================================================================
const dezziTimberTruckIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Protective Structure": "protective-structure.png",
  "Steps and Rails": "steps-and-rails.png",
  "Bonnet Shock Absorbers": "bonnet-retaining-catch.png",
  "Cab": "cabs.png",
  "Mirrors": "mirrors2.png",
  "Windscreen, Windows & Wipers": "wipes.png",
  "Air Conditioner": "air-conditioner.png",
  "Seats": "seats.png",
  "Safety Belt": "safety-belt.png",
  "Steering Column": "steering-column.png",
  "Hydraulic Controls": "hydraulic-controls.png",
  "Hooter and Reverse Alarm": "hooters.png",
  "Gauges": "gauges.png",
  "Working Lights": "led.png",
  "Rotating Light": "rotating-light.png",
  "Braking System (Foot Brake/Exhaust Brake)": "foot-brake.png",
  "Emergency Park Brake": "hand-brake.png",
  "Fuel & Oil levels": "fuel-oil-levels.png",
  "Fuel & Oil Leaks": "fuel-leaks.png",
  "Grease": "grease.png",
  "Grill": "grill.png",
  "Battery": "battery.png",
  "Air Pre-Cleaner": "air-pre-cleaner.png",
  "V-Belt": "fan-belt.png",
  "Radiator": "radiator.png",
  "Air Tank Drain": "air-fuel-leaks.png",
  "Wiring": "wiring.png",
  "Prop-Shaft/Universals/Carrier Bearings": "differentials.png",
  "Drive Train": "differentials.png",
  "Tyres": "types-spares.png",
  "Headboard and Uprights": "boom-structure.png",
  "Chevron, Reflectors and Tape": "led.png",
  "Visibility Triangle": "emergency-triangle.png",
  "Boom Structure": "boom-structure.png",
  "Hydraulic Cylinders": "hydraulic-cylinders.png",
  "Hydraulic Hoses and Fittings": "hydraulic-hoses.png",
  "Communication": "communication.png",
  "Chocks": "wheel-nut.png",
  "Fire Extinguisher (1 x 1.5kg extinguisher)": "fire-extinguisher.png",
  "Brake Efficiency Test": "foot-brake.png",
};

const dieselCartTrailerIconMap: Record<string, string> = {
  "License and Phepha": "license2.png",
  "Number Plate": "license2.png",
  "Trailer Body": "cabs.png",
  "Diesel Tank": "cabs.png",
  "Hose Pipe & Nozzle": "hydraulic-hoses.png",
  "Chevron, Reflectors and Tape": "led.png",
  "Working Lights": "led.png",
  "Trailer Plug & Electric Wiring": "wiring.png",
  "Hand Brake/Brake Cable": "hand-brake.png",
  "Wiring": "wiring.png",
  "U-Bolts": "wheel-nut.png",
  "Grease": "grease.png",
  "Tyres": "types-spares.png",
  "Wheel Rims": "wheel-nut.png",
  "Fire Extinguisher (1 x 9kg extinguisher)": "fire-extinguisher.png",
};

// ============================================================================
// LOWBED STEPDECK TRAILER – per‑item icon mapping (using composite keys)
// ============================================================================
const lowbedStepdeckItemIconMap: Record<string, string> = {
  // License and Phepha
  "License and Phepha||Phepha valid.": "license2.png",
  "License and Phepha||Displayed and visible.": "license2.png",
  // Body of Cab/Trailer
  "Body of Cab/Trailer||Body work not damaged.": "cabs.png",
  "Body of Cab/Trailer||No dents or scratches.": "cabs.png",
  // Steps and Rails
  "Steps and Rails||Steps in good condition.": "steps-and-rails.png",
  "Steps and Rails||Not loose/broken.": "steps-and-rails.png",
  // Cab
  "Cab||Cab neat and tidy.": "cabs.png",
  "Cab||Door and mechanism working.": "cabs.png",
  "Cab||Door rubber in good condition.": "cabs.png",
  "Cab||Door handles functional.": "cabs.png",
  // Mirrors
  "Mirrors||Mirrors in good condition.": "mirrors2.png",
  "Mirrors||Not damaged.": "mirrors2.png",
  "Mirrors||Adequately secured – not loose.": "mirrors2.png",
  // Windscreen, Windows & Wipers
  "Windscreen, Windows & Wipers||Clean/secure.": "wipes.png",
  "Windscreen, Windows & Wipers||No cracks or damages to windscreen.": "wipes.png",
  "Windscreen, Windows & Wipers||Window visibility not obscured by cracks.": "wipes.png",
  "Windscreen, Windows & Wipers||Wipers are working.": "wipes.png",
  // Air Conditioner
  "Air Conditioner||In working condition.": "air-conditioner.png",
  // Seats
  "Seats||Safety belts bolted/secured.": "safety-belt.png",
  "Seats||No damage/not extremely dirty/bleached or dyed.": "safety-belt.png",
  "Seats||Retractor clip in order and clicks into place.": "safety-belt.png",
  // Steering Column
  "Steering Column||Steering column in order.": "steering-column.png",
  "Steering Column||No excessive movement of steering column when locked in position.": "steering-column.png",
  "Steering Column||Reverse steering functional.": "steering-column.png",
  // Hooter and Reverse Alarm
  "Hooter and Reverse Alarm||Hooter working and in good condition.": "hooters.png",
  "Hooter and Reverse Alarm||Reverse alarm working.": "hooters.png",
  // Gauges
  "Gauges||In working order.": "gauges.png",
  "Gauges||Any warning symbols/lights.": "gauges.png",
  // Clutch
  "Clutch||Clutch taking correctly – not slipping.": "clutch.png",
  "Clutch||In working order.": "clutch.png",
  // Lamps
  "Lamps||Dim/bright lights/brake lights/indicators/hazards/reflector in working order.": "led.png",
  // Brakes
  "Brakes||In working order.": "foot-brake.png",
  "Brakes||Sufficient air build up.": "foot-brake.png",
  // Handbrake and Trailer Brakes (If Fitted)
  "Handbrake and Trailer Brakes (If Fitted)||Working.": "hand-brake.png",
  // Battery
  "Battery||Secure.": "battery.png",
  "Battery||Sufficient water.": "battery.png",
  "Battery||Terminals clean/tight & covers on.": "battery.png",
  "Battery||No exposed wiring.": "battery.png",
  // Radiator
  "Radiator||Secure.": "radiator.png",
  "Radiator||Water level correct.": "radiator.png",
  "Radiator||No signs of leaking.": "radiator.png",
  // Wiring
  "Wiring||No loose, damaged or exposed wires.": "wiring.png",
  "Wiring||No loose broken plugs.": "wiring.png",
  // Air Tank Drain
  "Air Tank Drain||Good condition.": "air-fuel-leaks.png",
  "Air Tank Drain||Drained daily.": "air-fuel-leaks.png",
  // Oil/Fluid/Air Levels
  "Oil/Fluid/Air Levels||Check all oil levels/brake fluid levels/clutch fluid levels at correct.": "oil-fluid-air-level.png",
  "Oil/Fluid/Air Levels||Check air gauge in order.": "oil-fluid-air-level.png",
  // Trailer Deck
  "Trailer Deck||Ensure trailer deck floor is in good condition.": "boom-structure.png",
  "Trailer Deck||Not rusted.": "boom-structure.png",
  // Tow Bar & Hitch/King Pin
  "Tow Bar & Hitch/King Pin||Bolts, eyes and hitch in good condition.": "tow-hitch.png",
  "Tow Bar & Hitch/King Pin||No wearing on the king pin.": "tow-hitch.png",
  // Landing Gear
  "Landing Gear||Ensure stabiliser legs and locking pins are in good condition.": "landing-gear.png",
  // Anchor Points, Chains & Binders
  "Anchor Points, Chains & Binders||Ensure anchor points are safe enough to use.": "anchor-points.png",
  "Anchor Points, Chains & Binders||Chains and binders to be used are in good condition.": "anchor-points.png",
  // Chevron, Reflectors & Tape
  "Chevron, Reflectors & Tape||Securely mounted.": "led.png",
  "Chevron, Reflectors & Tape||No loose breakages.": "led.png",
  // Hydraulic Controls
  "Hydraulic Controls||Not loose/responsive.": "hydraulic-controls.png",
  "Hydraulic Controls||No steering play.": "hydraulic-controls.png",
  "Hydraulic Controls||Rear steering.": "hydraulic-controls.png",
  "Hydraulic Controls||Pivot/steering ram pins not loose.": "hydraulic-controls.png",
};

// ============================================================================
// LOWBED STEPDECK TRAILER SECTIONS (as defined in the web form)
// ============================================================================
const lowbedStepdeckSections: { title: string; items: string[] }[] = [
  {
    title: "License and Phepha",
    items: ["Phepha valid.", "Displayed and visible."]
  },
  {
    title: "Body of Cab/Trailer",
    items: ["Body work not damaged.", "No dents or scratches."]
  },
  {
    title: "Steps and Rails",
    items: ["Steps in good condition.", "Not loose/broken."]
  },
  {
    title: "Cab",
    items: [
      "Cab neat and tidy.",
      "Door and mechanism working.",
      "Door rubber in good condition.",
      "Door handles functional."
    ]
  },
  {
    title: "Mirrors",
    items: [
      "Mirrors in good condition.",
      "Not damaged.",
      "Adequately secured – not loose."
    ]
  },
  {
    title: "Windscreen, Windows & Wipers",
    items: [
      "Clean/secure.",
      "No cracks or damages to windscreen.",
      "Window visibility not obscured by cracks.",
      "Wipers are working."
    ]
  },
  {
    title: "Air Conditioner",
    items: ["In working condition."]
  },
  {
    title: "Seats",
    items: [
      "Safety belts bolted/secured.",
      "No damage/not extremely dirty/bleached or dyed.",
      "Retractor clip in order and clicks into place."
    ]
  },
  {
    title: "Steering Column",
    items: [
      "Steering column in order.",
      "No excessive movement of steering column when locked in position.",
      "Reverse steering functional."
    ]
  },
  {
    title: "Hooter and Reverse Alarm",
    items: ["Hooter working and in good condition.", "Reverse alarm working."]
  },
  {
    title: "Gauges",
    items: ["In working order.", "Any warning symbols/lights."]
  },
  {
    title: "Clutch",
    items: ["Clutch taking correctly – not slipping.", "In working order."]
  },
  {
    title: "Lamps",
    items: ["Dim/bright lights/brake lights/indicators/hazards/reflector in working order."]
  },
  {
    title: "Brakes",
    items: ["In working order.", "Sufficient air build up."]
  },
  {
    title: "Handbrake and Trailer Brakes (If Fitted)",
    items: ["Working."]
  },
  {
    title: "Battery",
    items: [
      "Secure.",
      "Sufficient water.",
      "Terminals clean/tight & covers on.",
      "No exposed wiring."
    ]
  },
  {
    title: "Radiator",
    items: ["Secure.", "Water level correct.", "No signs of leaking."]
  },
  {
    title: "Wiring",
    items: ["No loose, damaged or exposed wires.", "No loose broken plugs."]
  },
  {
    title: "Air Tank Drain",
    items: ["Good condition.", "Drained daily."]
  },
  {
    title: "Oil/Fluid/Air Levels",
    items: [
      "Check all oil levels/brake fluid levels/clutch fluid levels at correct.",
      "Check air gauge in order."
    ]
  },
  {
    title: "Trailer Deck",
    items: ["Ensure trailer deck floor is in good condition.", "Not rusted."]
  },
  {
    title: "Tow Bar & Hitch/King Pin",
    items: ["Bolts, eyes and hitch in good condition.", "No wearing on the king pin."]
  },
  {
    title: "Landing Gear",
    items: ["Ensure stabiliser legs and locking pins are in good condition."]
  },
  {
    title: "Anchor Points, Chains & Binders",
    items: ["Ensure anchor points are safe enough to use.", "Chains and binders to be used are in good condition."]
  },
  {
    title: "Chevron, Reflectors & Tape",
    items: ["Securely mounted.", "No loose breakages."]
  },
  {
    title: "Hydraulic Controls",
    items: [
      "Not loose/responsive.",
      "No steering play.",
      "Rear steering.",
      "Pivot/steering ram pins not loose."
    ]
  }
];

// ============================================================================
// FALLBACK ICON – used when a specific item icon is missing
// ============================================================================
const FALLBACK_ICON = "license2.png";

// ============================================================================
// HELPER: Get the correct icon map for a form type
// ============================================================================
function getIconMapForForm(formType: string): Record<string, string> | null {
  switch (formType) {
    case "light-delivery":
      return lightItemIconMap;
    case "lowbed-trailer":
      return lowbedItemIconMap;
    case "mechanic-ldv":
      return mechanicLDVIconMap;
    case "excavator-loader":
      return excavatorLoaderIconMap;
    case "personal-labour-carrier":
      return personalLabourCarrierIconMap;
    case "ponsse-bison":
      return ponsseBisonIconMap;
    case "self-loading-forwarder":
      return selfLoadingForwarderIconMap;
    case "skidder":
      return skidderIconMap;
    case "timber-truck-trailer":
      return timberTruckTrailerIconMap;
    case "trailer":
      return trailerIconMap;
    case "service-diesel-truck":
      return serviceDieselTruckIconMap;
    case "water-cart-trailer":
      return waterCartTrailerIconMap;
    case "weekly-machinery-condition":
      return weeklyMachineryIconMap;
    case "bell-timber-truck":
      return bellTimberTruckIconMap;
    case "dezzi-timber-truck":
      return dezziTimberTruckIconMap;
    case "diesel-cart-trailer":
      return dieselCartTrailerIconMap;
    case "vehicle-job-card":
    case "daily-attachment-checklist":
    case "daily-machine-checklist":
    case "cintasign-shorthaul":
    case "cintasign-harvesting":
    case "cintasign-loading":
    case "lowbed-stepdeck-trailer":
      // These forms have no icons (or are handled separately)
      return null;
    default:
      return null;
  }
}

// ============================================================================
// HELPER: Load any image from public/images/ as base64 (server + client)
// ============================================================================
async function getImageBase64(filename: string): Promise<string | null> {
  try {
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const imagePath = path.join(process.cwd(), 'public', 'images', filename);
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        return `data:image/png;base64,${imageBuffer.toString('base64')}`;
      }
      // Filesystem unavailable (e.g. Vercel) – fetch via HTTP
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_APP_URL || '';
      if (!baseUrl) {
        console.error(`[PDF] No baseUrl for image fetch – set NEXT_PUBLIC_APP_URL in Vercel env vars`);
        return null;
      }
      const url = `${baseUrl}/images/${filename}`;
      console.log(`[PDF] Fetching image via HTTP: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`[PDF] HTTP fetch failed for ${filename}: ${response.status} ${response.statusText}`);
        return null;
      }
      const buffer = await response.arrayBuffer();
      return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
    } else {
      const response = await fetch(`/images/${filename}`);
      if (!response.ok) return null;
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch (error) {
    console.error(`Failed to load image ${filename}:`, error);
    return null;
  }
}

// ============================================================================
// FORM LABEL HELPERS
// ============================================================================
function formTypeLabel(type: string): string {
  switch (type) {
    case "light-delivery":
      return "Light Delivery Vehicle Daily Checklist"
    case "excavator-loader":
      return "Excavator Loader Pre-Shift Inspection"
    case "excavator-harvester":
      return "Excavator Harvester Pre-Shift Inspection"
    case "lowbed-trailer":
      return "Lowbed & Roll Back Trailer Pre-Shift Inspection"
    case "mechanic-ldv":
      return "Mechanic LDV Daily Checklist"
    case "personal-labour-carrier":
      return "Personal / Labour Carrier Inspection Checklist"
    case "ponsse-bison":
      return "Ponsse Bison Pre-Shift Inspection Checklist"
    case "self-loading-forwarder":
      return "Self Loading Forwarder Pre-Shift Inspection Checklist"
    case "skidder":
      return "Skidder (Grapple & Cable) Pre-Shift Inspection Checklist"
    case "timber-truck-trailer":
      return "Timber Truck And Trailer Checklist"
    case "trailer":
      return "Trailer (Excluding Labour) Inspection Checklist"
    case "service-diesel-truck":
      return "Service/Diesel Truck Pre-Shift Inspection Checklist"
    case "water-cart-trailer":
      return "Water Cart Trailer & Pressure Washer Checklist"
    case "weekly-machinery-condition":
      return "Weekly Machinery Condition Assessment"
    case "bell-timber-truck":
      return "Bell Timber Truck Pre-Shift Checklist"
    case "vehicle-job-card":
      return "Motorised Equipment / Vehicle Job Card"
    case "daily-attachment-checklist":
      return "Daily Attachment Checklist"
    case "daily-machine-checklist":
      return "Daily Machine Checklist"
    case "dezzi-timber-truck":
      return "Dezzi Timber Truck Pre-Shift Checklist"
    case "diesel-cart-trailer":
      return "Diesel Cart Trailer Inspection Checklist"
    case "cintasign-shorthaul":
      return "Cintasign Shorthaul Trip Sheet"
    case "cintasign-harvesting":
      return "Cintasign Harvesting Sheet"
    case "cintasign-loading":
      return "Cintasign Loading Sheet"
    case "lowbed-stepdeck-trailer":
      return "Lowbed And Step Deck Trailer Pre-Use Inspection Checklist"
    default:
      return type
  }
}

function getDocumentDetails(type: string): { ref: string; rev: string; date: string } {
  switch (type) {
    case "light-delivery":
      return { ref: "HSEMS/8.1.19/REG/012", rev: "2", date: "27.03.2020" }
    case "excavator-loader":
      return { ref: "HSEMS/8.1.19/REG/002", rev: "4", date: "27.03.2020" }
    case "excavator-harvester":
      return { ref: "HSEMS/8.1.19/REG/001", rev: "5", date: "27.03.2020" }
    case "lowbed-trailer":
      return { ref: "HSEMS/8.1.19/REG/020", rev: "2", date: "27.03.2024" }
    case "mechanic-ldv":
      return { ref: "HSEMS/8.1.19/REG/017", rev: "2", date: "27.03.2020" }
    case "personal-labour-carrier":
      return { ref: "HSEMS/8.1.19/REG/011", rev: "4", date: "23.03.2024" }
    case "ponsse-bison":
      return { ref: "HSEMS/8.1.19/REG/022", rev: "3", date: "27.03.2020" }
    case "self-loading-forwarder":
      return { ref: "HSEMS/8.1.19/REG/003", rev: "3", date: "27.03.2020" }
    case "skidder":
      return { ref: "HSEMS/8.1.19/REG/006", rev: "2", date: "27.03.2020" }
    case "timber-truck-trailer":
      return { ref: "HSEMS/8.1.19/REG/010", rev: "2", date: "20.04.2024" }
    case "trailer":
      return { ref: "HSEMS/4.4.6.19/REG/013", rev: "2", date: "27.03.2020" }
    case "service-diesel-truck":
      return { ref: "HSEMS/8.1.19/REG/???", rev: "?", date: "27.03.2020" }
    case "water-cart-trailer":
      return { ref: "HSEMS/8.1.19/REG/015", rev: "2", date: "23.03.2020" }
    case "weekly-machinery-condition":
      return { ref: "HSEMS/8.1.19/DOC/011", rev: "10", date: "01.05.2023" }
    case "bell-timber-truck":
      return { ref: "HSEMS/8.1.19/REG/019", rev: "3", date: "27.03.2020" }
    case "vehicle-job-card":
      return { ref: "HSEMS/8.1.19/REG/???", rev: "1", date: "27.03.2020" }
    case "daily-attachment-checklist":
      return { ref: "HSEMS/8.1.19/REG/012", rev: "10", date: "03.07.2024" }
    case "daily-machine-checklist":
      return { ref: "HSEMS/8.1.19/DOC/011", rev: "1", date: "01.05.2023" }
    case "dezzi-timber-truck":
      return { ref: "HSEMS/8.1.19/REG/004", rev: "4", date: "27.03.2020" }
    case "diesel-cart-trailer":
      return { ref: "HSEMS/8.1.9/REG/014", rev: "2", date: "27.03.2020" }
    case "cintasign-shorthaul":
      return { ref: "CINT/LOG/001", rev: "1", date: "01.01.2025" }
    case "cintasign-harvesting":
      return { ref: "CINT/HARV/001", rev: "1", date: "01.03.2025" }
    case "cintasign-loading":
      return { ref: "CINT/LOAD/001", rev: "1", date: "01.03.2025" }
    case "lowbed-stepdeck-trailer":
      return { ref: "HSEMS/8.1.19/REG/021", rev: "1", date: "01.03.2025" }
    default:
      return { ref: "HSEMS/8.1.19/REG/000", rev: "0", date: "01.01.2020" }
  }
}

function statusLabel(status: CheckStatus): string {
  if (!status) return "-"
  const map: Record<string, string> = { ok: "OK", def: "Defect", na: "N/A" }
  return map[status] ?? "-"
}

function formatFieldKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

// ============================================================================
// BRAND‑AWARE LOGO LOADER
// ============================================================================
const brandLogoFile: Record<Brand, string> = {
  ringomode: 'ringomode-logo.png',
  cintasign: 'cintasign-logo.jpg',
};

async function getBrandLogoBase64(brand: Brand): Promise<string> {
  const filename = brandLogoFile[brand];
  const mime = filename.endsWith('.png') ? 'png' : 'jpeg';
  try {
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const logoPath = path.join(process.cwd(), 'public', 'images', filename);
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        return `data:image/${mime};base64,${logoBuffer.toString('base64')}`;
      }
      // Filesystem unavailable (e.g. Vercel) – fetch via HTTP
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_APP_URL || '';
      if (!baseUrl) {
        console.error(`[PDF] No baseUrl for logo fetch – set NEXT_PUBLIC_APP_URL in Vercel env vars`);
        return '';
      }
      const url = `${baseUrl}/images/${filename}`;
      console.log(`[PDF] Fetching logo via HTTP: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`[PDF] HTTP fetch failed for logo ${filename}: ${response.status} ${response.statusText}`);
        return '';
      }
      const buffer = await response.arrayBuffer();
      return `data:image/${mime};base64,${Buffer.from(buffer).toString('base64')}`;
    } else {
      const response = await fetch(`/images/${filename}`);
      if (!response.ok) return '';
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch (error) {
    console.error(`Failed to load image ${filename}:`, error);
    return '';
  }
}

// ============================================================================
// CSV EXPORTS (with type guards)
// ============================================================================
function escapeCSV(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

export function exportSubmissionsToCSV(submissions: Submission[]): void {
  if (submissions.length === 0) return
  const rows: string[][] = []
  rows.push(["ID", "Brand", "Form Type", "Submitted By", "Date", "Status", "Defect Details", "Signature"])
  for (const sub of submissions) {
    rows.push([
      sub.id,
      sub.brand || 'ringomode',
      formTypeLabel(sub.formType),
      sub.submittedBy,
      new Date(sub.submittedAt).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sub.hasDefects ? "Defects Found" : "Clean",
      hasDefectDetails(sub.data) ? sub.data.defectDetails || "" : "",
      hasSignature(sub.data) ? sub.data.signature || "" : "",
    ])
  }
  const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n")
  downloadFile(csv, "submissions.csv", "text/csv;charset=utf-8;")
}

export function exportSingleSubmissionToCSV(sub: Submission): void {
  const brand = sub.brand || 'ringomode';
  const brandName = brand === 'cintasign' ? 'Cintasign' : 'Ringomode DSP';
  const rows: string[][] = []
  rows.push([`${brandName} HSE Management System`])
  rows.push([formTypeLabel(sub.formType)])
  rows.push([])
  rows.push(["Field", "Value"])
  rows.push(["Brand", brand])
  rows.push(["Submitted By", sub.submittedBy])
  rows.push([
    "Date",
    new Date(sub.submittedAt).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  ])
  rows.push(["Status", sub.hasDefects ? "Defects Found" : "Clean"])
  for (const [key, value] of Object.entries(sub.data)) {
    if (key === "items" || key === "hasDefects" || key === "defectDetails" || key === "signature") continue
    rows.push([formatFieldKey(key), String(value) || "-"])
  }
  rows.push([])
  rows.push(["Inspection Item", "Status"])
  if (hasItems(sub.data)) {
    for (const [item, status] of Object.entries(sub.data.items)) {
      rows.push([item, statusLabel(status as CheckStatus)])
    }
  }
  rows.push([])
  if (hasDefectDetails(sub.data) && sub.data.defectDetails) {
    rows.push(["Defect Details", sub.data.defectDetails])
  }
  if (hasSignature(sub.data) && sub.data.signature) {
    rows.push(["Signature", sub.data.signature])
  }
  const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n")
  const filename = `${brand}-${sub.formType}-${sub.submittedBy.replace(/\s/g, "_")}-${sub.id.slice(0, 8)}.csv`
  downloadFile(csv, filename, "text/csv;charset=utf-8;")
}

// ============================================================================
// PDF EXPORT – with support for Cintasign and lowbed‑stepdeck forms
// ============================================================================
export async function exportSubmissionToPDF(sub: Submission, asBuffer?: boolean): Promise<void | Buffer> {
  const { default: jsPDF } = await import("jspdf")
  await import("jspdf-autotable")

  const doc = new jsPDF("p", "mm", "a4")
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  // ----- Use submission's brand -----
  const brand = sub.brand || 'ringomode';
  const brandName = brand === 'cintasign' ? 'Cintasign' : 'Ringomode DSP';
  const logoBase64 = await getBrandLogoBase64(brand);

  let yOffset = 15;
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 8, 80, 25);
      yOffset = 48;
    } catch (error) {
      console.error('Failed to add logo to PDF:', error);
      yOffset = 15;
    }
  }

  // ----- Header with dynamic brand name -----
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(brandName, 14, yOffset)
  doc.text("Excellence - Relevance - Significance", 14, yOffset + 5)

  doc.setFontSize(7)
  doc.setTextColor(150)
  doc.text("HSE Management System", pageWidth - 14, yOffset, { align: "right" })

  doc.setDrawColor(34, 100, 54)
  doc.setLineWidth(0.5)
  doc.line(14, yOffset + 9, pageWidth - 14, yOffset + 9)

  // ----- Form Title -----
  doc.setFontSize(14)
  doc.setTextColor(34, 100, 54)
  doc.text(formTypeLabel(sub.formType), 14, yOffset + 18)

  // ----- Document Reference -----
  const docDetails = getDocumentDetails(sub.formType);
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(34, 100, 54)
  doc.text(
    `Document Ref: ${docDetails.ref} | Rev. ${docDetails.rev} | ${docDetails.date}`,
    14,
    yOffset + 26
  )
  doc.setFont('helvetica', 'normal')

  // ----- Status Badge (not used for job card, but keep for consistency) -----
  doc.setFontSize(9)
  if (sub.hasDefects) {
    doc.setTextColor(220, 50, 50)
    doc.text("DEFECTS FOUND", pageWidth - 14, yOffset + 18, { align: "right" })
  } else {
    doc.setTextColor(34, 139, 34)
    doc.text("CLEAN", pageWidth - 14, yOffset + 18, { align: "right" })
  }

  // ==========================================================================
  // CONDITIONALLY SKIP COMMON FIELDS TABLE FOR VEHICLE JOB CARD
  // ==========================================================================
  let y: number;
  if (sub.formType !== "vehicle-job-card") {
    // ----- Common fields table (submittedBy, date, and basic fields) -----
    const fieldRows: string[][] = []
    fieldRows.push(["Submitted By", sub.submittedBy])
    fieldRows.push(["Document No", (sub as any).documentNo || ""]) // <-- ADDED THIS LINE
    const formattedDate = new Date(sub.submittedAt).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    fieldRows.push(["Date", formattedDate])

    // Add all other top-level fields (excluding arrays and totals)
    for (const [key, value] of Object.entries(sub.data)) {
      if (
        key === "items" ||
        key === "hasDefects" ||
        key === "defectDetails" ||
        key === "signature" ||
        key === "date" ||
        key === "parts" ||
        key === "labour" ||
        key === "partsTotal" ||
        key === "labourTotal" ||
        key === "grandTotal" ||
        // Exclude Cintasign operation‑specific fields
        key === "fleetEntries" ||
        key === "breakdownEntries" ||
        key === "entries" ||
        key === "operator" ||      // top‑level loading supervisor
        key === "fleetNo" ||       // top‑level loading fleet
        key === "shift" ||         // top‑level loading shift
        key === "unit"             // Cintasign unit (already in common)
      ) continue
      fieldRows.push([formatFieldKey(key), String(value) || "-"])
    }

    if (fieldRows.length > 0) {
      ;(doc as any).autoTable({
        startY: yOffset + 33,
        head: [["Information", ""]],
        body: fieldRows,
        theme: "grid",
        headStyles: {
          fillColor: [34, 100, 54],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
        },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 },
        tableWidth: "auto",
      })
    }
    y = (doc as any).lastAutoTable?.finalY ?? yOffset + 33
    y += 10
  } else {
    // For vehicle-job-card we start directly after the header
    y = yOffset + 33
  }

  // ==========================================================================
  // INSPECTION / DATA SECTIONS – HANDLE BY FORM TYPE
  // ==========================================================================
  
  // Preload icons helper (used only by forms that have icons)
  const preloadIcons = async (filenames: string[]): Promise<Map<string, string>> => {
    const map = new Map<string, string>();
    const unique = Array.from(new Set(filenames));
    await Promise.all(unique.map(async (f) => {
      const base64 = await getImageBase64(f);
      if (base64) map.set(f, base64);
    }));
    return map;
  };

  if (sub.formType === "excavator-harvester") {
    // ----- EXCAVATOR HARVESTER: GROUPED SECTIONS WITH ICON IN THE MIDDLE ROW -----
    if (!hasItems(sub.data)) {
      console.warn("No items found for excavator-harvester");
    } else {
      const data = sub.data; // now narrowed to WithItems
      for (const section of sections) {
        const sectionItems = section.items.filter((item: string): boolean => 
          item in data.items
        )
        if (sectionItems.length === 0) continue

        if (y > pageHeight - 70) {
          doc.addPage()
          y = 20
        }

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(34, 100, 54)
        doc.text(section.title, 14, y)
        y += 5

        let iconBase64: string | null = null
        const iconFilename = iconMap[section.title]
        if (iconFilename) {
          iconBase64 = await getImageBase64(iconFilename)
        }

        const splitIndex = Math.floor(sectionItems.length / 2)
        const firstHalf: string[] = sectionItems.slice(0, splitIndex)
        const secondHalf: string[] = sectionItems.slice(splitIndex)

        // Build table rows: all items in order (no separate icon row)
        const tableRows: any[] = []

        firstHalf.forEach((item: string): void => {
          tableRows.push([
            item,
            '',
            statusLabel(data.items[item] as CheckStatus)
          ])
        })

        secondHalf.forEach((item: string): void => {
          tableRows.push([
            item,
            '',
            statusLabel(data.items[item] as CheckStatus)
          ])
        })

        ;(doc as any).autoTable({
          startY: y,
          head: [['Inspection Item', '', 'Status']],
          body: tableRows,
          theme: 'grid',
          headStyles: {
            fillColor: [34, 100, 54],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8,
          },
          styles: {
            fontSize: 8,
            cellPadding: 4,
            lineColor: [200, 200, 200],
            lineWidth: 0.2,
          },
          columnStyles: {
            0: { cellWidth: 110, fontStyle: 'bold' },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 30, halign: 'center' }
          },
          margin: { left: 20, right: 20 },
          didParseCell: (data: Record<string, any>): void => {
            if (data.section === 'body') {
              data.cell.minHeight = 20;
            }
            if (data.section === 'body' && data.column.index === 2) {
              const val = data.row.raw[2] as string
              if (val === 'Defect') {
                data.cell.styles.textColor = [220, 50, 50]
                data.cell.styles.fontStyle = 'bold'
              } else if (val === 'OK') {
                data.cell.styles.textColor = [34, 139, 34]
              } else if (val === 'N/A') {
                data.cell.styles.textColor = [100, 100, 100]
              }
            }
            if (data.section === 'body' && data.column.index === 1) {
              data.cell.styles.lineWidth = 0;
            }
          },
          didDrawCell: (data: Record<string, any>): void => {
            // Draw icon in the middle column of the first row of the second half
            if (
              data.section === 'body' &&
              data.column.index === 1 &&
              data.row.index === firstHalf.length &&
              iconBase64 !== null
            ) {
              try {
                const cellWidth: number = data.cell.width
                const cellHeight: number = data.cell.height
                const maxImgSize = Math.min(cellWidth, cellHeight) - 4;
                const imgSize = Math.min(25, maxImgSize);
                const x: number = data.cell.x + (cellWidth - imgSize) / 2
                const y: number = data.cell.y + (cellHeight - imgSize) / 2
                doc.addImage(iconBase64, 'PNG', x, y, imgSize, imgSize)
              } catch (e) {
                console.error(`Failed to draw icon for ${section.title}`, e)
              }
            }
          }
        })

        y = (doc as any).lastAutoTable.finalY + 15;
      }
    }

    // ----- Defect Details for excavator-harvester -----
    if (hasDefectDetails(sub.data) && sub.data.defectDetails) {
      y += 5;
      if (y > pageHeight - 50) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(10)
      doc.setTextColor(220, 50, 50)
      doc.text("Defect Details:", 14, y)
      y += 7
      doc.setFontSize(8)
      doc.setTextColor(60)
      const lines: string[] = doc.splitTextToSize(sub.data.defectDetails, pageWidth - 28)
      doc.text(lines, 14, y)
      y += lines.length * 5 + 10
    }

    // ----- Signature for excavator-harvester -----
    if (hasSignature(sub.data) && sub.data.signature) {
      if (y > pageHeight - 70) {
        doc.addPage()
        y = 20
      }

      const boxX = 14
      const boxY = y - 5
      const boxWidth = 100
      const boxHeight = 30

      doc.setFillColor(250, 250, 250)
      doc.rect(boxX, boxY, boxWidth, boxHeight, 'F')
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.5)
      doc.rect(boxX, boxY, boxWidth, boxHeight, 'S')

      doc.setFontSize(9)
      doc.setTextColor(0, 128, 0)
      doc.setFont('helvetica', 'bold')
      doc.text("Signature", boxX, boxY - 4)
      doc.setFont('helvetica', 'normal')

      const signature = sub.data.signature
      if (signature && typeof signature === 'string' && signature.startsWith('data:image')) {
        try {
          const imgSize = Math.min(boxHeight - 8, boxWidth - 8)
          const imgX = boxX + (boxWidth - imgSize) / 2
          const imgY = boxY + (boxHeight - imgSize) / 2
          doc.addImage(signature, 'PNG', imgX, imgY, imgSize, imgSize)
        } catch (error) {
          console.error('Failed to add signature image, falling back to text', error)
          doc.setFontSize(9)
          doc.setFont("helvetica", "italic")
          doc.setTextColor(0, 128, 0)
          doc.text("[Signature image failed to load]", boxX + 5, boxY + boxHeight / 2 + 3)
          doc.setFont("helvetica", "normal")
        }
      } else {
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(0, 128, 0)
        const sigText = signature || "-"
        doc.text(sigText, boxX + 5, boxY + boxHeight / 2 + 3)
        doc.setFont("helvetica", "normal")
      }
      y += boxHeight + 15
    }

  } else if (sub.formType === "cintasign-shorthaul") {
    // ----- CINTASIGN SHORTHAUL: render fleet and breakdown tables -----
    const data = sub.data as any;

    // Fleet entries table
    if (Array.isArray(data.fleetEntries) && data.fleetEntries.length > 0) {
      if (y > pageHeight - 70) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 100, 54);
      doc.text("Fleet Details", 14, y);
      y += 5;

      const fleetHeaders = ["Fleet No", "Operator", "Shift", "Compartment", "Loads", "Est Tons", "Open", "Close", "Worked", "Loads/hr", "Tons/hr"];
      const fleetRows = data.fleetEntries.map((entry: any) => {
        return [
          entry.fleetNo !== undefined ? String(entry.fleetNo) : '',
          entry.operator !== undefined ? String(entry.operator) : '',
          entry.shift !== undefined ? String(entry.shift) : '',
          entry.compartment !== undefined ? String(entry.compartment) : '',
          entry.noOfLoads !== undefined ? String(entry.noOfLoads) : '',
          entry.estTons !== undefined ? String(entry.estTons) : '',
          entry.hoursOpen !== undefined ? String(entry.hoursOpen) : '',
          entry.hoursClose !== undefined ? String(entry.hoursClose) : '',
          entry.hoursWorked !== undefined ? String(entry.hoursWorked) : '',
          entry.loadsPerHour !== undefined ? String(entry.loadsPerHour) : '',
          entry.tonsPerHour !== undefined ? String(entry.tonsPerHour) : '',
        ];
      });

      (doc as any).autoTable({
        startY: y,
        head: [fleetHeaders],
        body: fleetRows,
        theme: 'grid',
        headStyles: { fillColor: [34, 100, 54], textColor: 255, fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 2 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 15;
    }

    // Breakdown entries table
    if (Array.isArray(data.breakdownEntries) && data.breakdownEntries.length > 0) {
      if (y > pageHeight - 70) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 100, 54);
      doc.text("Breakdown Hours & Details", 14, y);
      y += 5;

      const breakdownHeaders = ["Machine ID", "Operator", "Stop", "Start", "Details"];
      const breakdownRows = data.breakdownEntries.map((entry: any) => {
        return [
          entry.machineId !== undefined ? String(entry.machineId) : '',
          entry.operator !== undefined ? String(entry.operator) : '',
          entry.stop !== undefined ? String(entry.stop) : '',
          entry.start !== undefined ? String(entry.start) : '',
          entry.details !== undefined ? String(entry.details) : '',
        ];
      });

      (doc as any).autoTable({
        startY: y,
        head: [breakdownHeaders],
        body: breakdownRows,
        theme: 'grid',
        headStyles: { fillColor: [34, 100, 54], textColor: 255, fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 2 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 15;
    }

  } else if ((sub.formType as string) === "cintasign-harvesting") {
    // ----- CINTASIGN HARVESTING: render harvesting fleet and breakdown tables -----
    const data = sub.data as any;

    // Harvesting fleet entries table
    if (Array.isArray(data.fleetEntries) && data.fleetEntries.length > 0) {
      if (y > pageHeight - 70) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 100, 54);
      doc.text("Harvesting Fleet Details", 14, y);
      y += 5;

      const fleetHeaders = ["Fleet No", "Operator", "Shift", "Compartment", "Tree Volume", "Trees Debarked", "Total Tons", "Open", "Close", "Worked", "Tons/hr", "Trees/hr"];
      const fleetRows = data.fleetEntries.map((entry: any) => {
        return [
          entry.fleetNo !== undefined ? String(entry.fleetNo) : '',
          entry.operator !== undefined ? String(entry.operator) : '',
          entry.shift !== undefined ? String(entry.shift) : '',
          entry.compartment !== undefined ? String(entry.compartment) : '',
          entry.treeVolume !== undefined ? String(entry.treeVolume) : '',
          entry.treesDebarked !== undefined ? String(entry.treesDebarked) : '',
          entry.totalTons !== undefined ? String(entry.totalTons) : '',
          entry.hoursOpen !== undefined ? String(entry.hoursOpen) : '',
          entry.hoursClose !== undefined ? String(entry.hoursClose) : '',
          entry.hoursWorked !== undefined ? String(entry.hoursWorked) : '',
          entry.tonsPerHour !== undefined ? String(entry.tonsPerHour) : '',
          entry.treesPerHour !== undefined ? String(entry.treesPerHour) : '',
        ];
      });

      (doc as any).autoTable({
        startY: y,
        head: [fleetHeaders],
        body: fleetRows,
        theme: 'grid',
        headStyles: { fillColor: [34, 100, 54], textColor: 255, fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 2 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 15;
    }

    // Breakdown entries table
    if (Array.isArray(data.breakdownEntries) && data.breakdownEntries.length > 0) {
      if (y > pageHeight - 70) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 100, 54);
      doc.text("Breakdown Hours & Details", 14, y);
      y += 5;

      const breakdownHeaders = ["Machine ID", "Operator", "Stop", "Start", "Details"];
      const breakdownRows = data.breakdownEntries.map((entry: any) => {
        return [
          entry.machineId !== undefined ? String(entry.machineId) : '',
          entry.operator !== undefined ? String(entry.operator) : '',
          entry.stop !== undefined ? String(entry.stop) : '',
          entry.start !== undefined ? String(entry.start) : '',
          entry.details !== undefined ? String(entry.details) : '',
        ];
      });

      (doc as any).autoTable({
        startY: y,
        head: [breakdownHeaders],
        body: breakdownRows,
        theme: 'grid',
        headStyles: { fillColor: [34, 100, 54], textColor: 255, fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 2 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 15;
    }

  } else if ((sub.formType as string) === "cintasign-loading") {
    // ----- CINTASIGN LOADING: render loading supervisor and entries table -----
    const data = sub.data as any;

    // Top-level fields (Operator, Fleet No, Shift)
    if (y > pageHeight - 70) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 100, 54);
    doc.text("Loading Supervisor & Fleet", 14, y);
    y += 5;

    (doc as any).autoTable({
      startY: y,
      body: [
        ["Operator:", data.operator || ''],
        ["Fleet No:", data.fleetNo || ''],
        ["Shift:", data.shift || ''],
      ],
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 15;

    // Loading entries table
    if (Array.isArray(data.entries) && data.entries.length > 0) {
      if (y > pageHeight - 70) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 100, 54);
      doc.text("Loading Details", 14, y);
      y += 5;

      const entryHeaders = ["Delivery Note No", "Comp No", "Transport Company", "Long Haul Reg", "Driver Name"];
      const entryRows = data.entries.map((entry: any) => {
        return [
          entry.deliveryNoteNo !== undefined ? String(entry.deliveryNoteNo) : '',
          entry.compNo !== undefined ? String(entry.compNo) : '',
          entry.transportCompany !== undefined ? String(entry.transportCompany) : '',
          entry.longHaulReg !== undefined ? String(entry.longHaulReg) : '',
          entry.driverName !== undefined ? String(entry.driverName) : '',
        ];
      });

      (doc as any).autoTable({
        startY: y,
        head: [entryHeaders],
        body: entryRows,
        theme: 'grid',
        headStyles: { fillColor: [34, 100, 54], textColor: 255, fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 2 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 15;
    }

    } else if ((sub.formType as string) === "lowbed-stepdeck-trailer") {
    // ----- LOWBED STEPDECK TRAILER: grouped sections with icons (like excavator-harvester) -----
    if (!hasItems(sub.data)) {
      console.warn("No items found for lowbed-stepdeck-trailer");
    } else {
      const data = sub.data; // now narrowed to WithItems

      // Collect all unique icon filenames needed for this form
      const iconFilenames: string[] = [];
      for (const section of lowbedStepdeckSections) {
        for (const item of section.items) {
          const compositeKey = `${section.title}||${item}`;
          const iconFile = lowbedStepdeckItemIconMap[compositeKey] || FALLBACK_ICON;
          iconFilenames.push(iconFile);
        }
      }
      const uniqueIconFiles = Array.from(new Set(iconFilenames));
      const iconBase64Map = await preloadIcons(uniqueIconFiles);

      for (const section of lowbedStepdeckSections) {
        const sectionItems = section.items.filter((item: string): boolean => 
          item in data.items
        )
        if (sectionItems.length === 0) continue

        if (y > pageHeight - 70) {
          doc.addPage()
          y = 20
        }

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(34, 100, 54)
        doc.text(section.title, 14, y)
        y += 5

        const splitIndex = Math.floor(sectionItems.length / 2)
        const firstHalf: string[] = sectionItems.slice(0, splitIndex)
        const secondHalf: string[] = sectionItems.slice(splitIndex)

        // Build table rows: all items in order (with empty middle column for icons)
        const tableRows: any[] = []

        firstHalf.forEach((item: string): void => {
          tableRows.push([
            item,
            '',
            statusLabel(data.items[item] as CheckStatus)
          ])
        })

        secondHalf.forEach((item: string): void => {
          tableRows.push([
            item,
            '',
            statusLabel(data.items[item] as CheckStatus)
          ])
        })

        ;(doc as any).autoTable({
          startY: y,
          head: [['Inspection Item', '', 'Status']],
          body: tableRows,
          theme: 'grid',
          headStyles: {
            fillColor: [34, 100, 54],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8,
          },
          styles: {
            fontSize: 8,
            cellPadding: 4,
            lineColor: [200, 200, 200],
            lineWidth: 0.2,
          },
          columnStyles: {
            0: { cellWidth: 110, fontStyle: 'bold' },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 30, halign: 'center' }
          },
          margin: { left: 20, right: 20 },
          didParseCell: (data: Record<string, any>): void => {
            if (data.section === 'body') {
              data.cell.minHeight = 20;
            }
            if (data.section === 'body' && data.column.index === 2) {
              const val = data.row.raw[2] as string
              if (val === 'Defect') {
                data.cell.styles.textColor = [220, 50, 50]
                data.cell.styles.fontStyle = 'bold'
              } else if (val === 'OK') {
                data.cell.styles.textColor = [34, 139, 34]
              } else if (val === 'N/A') {
                data.cell.styles.textColor = [100, 100, 100]
              }
            }
            if (data.section === 'body' && data.column.index === 1) {
              data.cell.styles.lineWidth = 0;
            }
          },
          didDrawCell: (cellData: any): void => {
            if (cellData.section === 'body' && cellData.column.index === 1) {
              const item = cellData.row.raw[0] as string;
              const compositeKey = `${section.title}||${item}`;
              const iconFile = lowbedStepdeckItemIconMap[compositeKey] || FALLBACK_ICON;
              const base64 = iconBase64Map.get(iconFile);
              if (!base64) return;

              try {
                const cellWidth = cellData.cell.width;
                const cellHeight = cellData.cell.height;
                const maxImgSize = Math.min(cellWidth, cellHeight) - 4;
                const imgSize = Math.min(25, maxImgSize);
                const x = cellData.cell.x + (cellWidth - imgSize) / 2;
                const y = cellData.cell.y + (cellHeight - imgSize) / 2;
                doc.addImage(base64, 'PNG', x, y, imgSize, imgSize);
              } catch (e) {
                console.error(`Failed to draw icon for ${item}`, e);
              }
            }
          }
        })

        y = (doc as any).lastAutoTable.finalY + 15;
      }
    }

    // ----- Defect Details for lowbed-stepdeck -----
    if (hasDefectDetails(sub.data) && sub.data.defectDetails) {
      y += 5;
      if (y > pageHeight - 50) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(10)
      doc.setTextColor(220, 50, 50)
      doc.text("Defect Details:", 14, y)
      y += 7
      doc.setFontSize(8)
      doc.setTextColor(60)
      const lines: string[] = doc.splitTextToSize(sub.data.defectDetails, pageWidth - 28)
      doc.text(lines, 14, y)
      y += lines.length * 5 + 10
    }

    // ----- Signature for lowbed-stepdeck -----
    if (hasSignature(sub.data) && sub.data.signature) {
      if (y > pageHeight - 70) {
        doc.addPage()
        y = 20
      }

      const boxX = 14
      const boxY = y - 5
      const boxWidth = 100
      const boxHeight = 30

      doc.setFillColor(250, 250, 250)
      doc.rect(boxX, boxY, boxWidth, boxHeight, 'F')
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.5)
      doc.rect(boxX, boxY, boxWidth, boxHeight, 'S')

      doc.setFontSize(9)
      doc.setTextColor(0, 128, 0)
      doc.setFont('helvetica', 'bold')
      doc.text("Signature", boxX, boxY - 4)
      doc.setFont('helvetica', 'normal')

      const signature = sub.data.signature
      if (signature && typeof signature === 'string' && signature.startsWith('data:image')) {
        try {
          const imgSize = Math.min(boxHeight - 8, boxWidth - 8)
          const imgX = boxX + (boxWidth - imgSize) / 2
          const imgY = boxY + (boxHeight - imgSize) / 2
          doc.addImage(signature, 'PNG', imgX, imgY, imgSize, imgSize)
        } catch (error) {
          console.error('Failed to add signature image, falling back to text', error)
          doc.setFontSize(9)
          doc.setFont("helvetica", "italic")
          doc.setTextColor(0, 128, 0)
          doc.text("[Signature image failed to load]", boxX + 5, boxY + boxHeight / 2 + 3)
          doc.setFont("helvetica", "normal")
        }
      } else {
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(0, 128, 0)
        const sigText = signature || "-"
        doc.text(sigText, boxX + 5, boxY + boxHeight / 2 + 3)
        doc.setFont("helvetica", "normal")
      }
      y += boxHeight + 15
    }

  } else if (sub.formType === "vehicle-job-card") {
    // ----- VEHICLE JOB CARD: professional layout matching the provided PDF -----
    const data = sub.data as any;

    // Extract fields with sensible defaults (match web form field names)
    const driverName = data.driverName || data.driversName || '';
    const jobCardNumber = data.jobCardNumber || data.documentNo || '';
    const machineVehicle = data.machineVehicle || data.machine || data.vehicle || '';
    const registrationNumber = data.machineRegNumber || data.registrationNumber || data.regNo || '';
    const hourMeterKM = data.hourMeterKmReading || data.hourMeterKM || data.hourMeter || data.kmReading || '';
    const date = data.date ? new Date(data.date).toLocaleDateString('en-ZA') : '';
    const categoryOfWork = data.categoryOfWork || '';

    const descriptionOfWork = data.descriptionOfWork || data.workPerformed || '';
    const testPerformed = data.testPerformedAndResult || data.testPerformed || '';
    const jobCompletedSafe = data.jobCompletedAndSafe || '';

    const mechanicsName = data.mechanicsName || '';
    const operatorsName = data.operatorsName || data.operatorName || '';
    const mechanicsSignature = data.mechanicSignature || data.signature || '';
    const operatorsSignature = data.operatorSignature || '';

    // ------------------------------------------------------------------------
    // Table 1: Basic job information (2 columns)
    // ------------------------------------------------------------------------
    if (y > pageHeight - 40) { doc.addPage(); y = 20; }
    (doc as any).autoTable({
      startY: y,
      head: [['Job Information', '']],
      body: [
        ['Drivers name:', driverName],
        ['Job card number:', jobCardNumber],
        ['Machine / vehicle:', machineVehicle],
        ['Machine / registration number:', registrationNumber],
        ['Hour meter / KM reading:', hourMeterKM],
        ['Date:', date],
        ['Category of work:', categoryOfWork],
      ],
      theme: 'grid',
      headStyles: { fillColor: [34, 100, 54], textColor: 255, fontSize: 9, halign: 'left' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 'auto' } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 5;

    // ------------------------------------------------------------------------
    // Table 2: Work performed (3 columns)
    // ------------------------------------------------------------------------
    if (y > pageHeight - 40) { doc.addPage(); y = 20; }
    (doc as any).autoTable({
      startY: y,
      head: [['Work Performed', '', '']],
      body: [[
        `Description:\n${descriptionOfWork}`,
        `Test performed and result:\n${testPerformed}`,
        `Job completed and safe to use:\n${jobCompletedSafe}`
      ]],
      theme: 'grid',
      headStyles: { fillColor: [34, 100, 54], textColor: 255, fontSize: 9, halign: 'left' },
      styles: { fontSize: 8, cellPadding: 4, minCellHeight: 20 },
      columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' } },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 5;

    // ------------------------------------------------------------------------
    // Table 3: Mechanic and operator names & signatures (4 columns)
    // ------------------------------------------------------------------------
    if (y > pageHeight - 40) { doc.addPage(); y = 20; }
    (doc as any).autoTable({
      startY: y,
      head: [['Mechanic', '', 'Operator', '']],
      body: [
        ['Name:', mechanicsName, 'Name:', operatorsName],
        ['Signature:', '', 'Signature:', '']
      ],
      theme: 'grid',
      headStyles: { fillColor: [34, 100, 54], textColor: 255, fontSize: 9, halign: 'left' },
      styles: { fontSize: 8, cellPadding: 4, minCellHeight: 20 },
      columnStyles: {
        0: { cellWidth: 30, fontStyle: 'bold' },
        1: { cellWidth: 60 },
        2: { cellWidth: 30, fontStyle: 'bold' },
        3: { cellWidth: 60 }
      },
      margin: { left: 14, right: 14 },
      didDrawCell: (cellData: any) => {
        if (cellData.section === 'body' && cellData.row.index === 1 && cellData.column.index === 1) {
          if (mechanicsSignature && mechanicsSignature.startsWith('data:image')) {
            try {
              const imgSize = Math.min(cellData.cell.height - 4, cellData.cell.width - 4, 25);
              const x = cellData.cell.x + (cellData.cell.width - imgSize) / 2;
              const y = cellData.cell.y + (cellData.cell.height - imgSize) / 2;
              doc.addImage(mechanicsSignature, 'PNG', x, y, imgSize, imgSize);
            } catch (e) { console.error('Failed to draw mechanic signature', e); }
          } else if (mechanicsSignature) {
            doc.setFontSize(7);
            doc.setTextColor(0,128,0);
            doc.text(mechanicsSignature, cellData.cell.x + 2, cellData.cell.y + cellData.cell.height/2);
          }
        }
        if (cellData.section === 'body' && cellData.row.index === 1 && cellData.column.index === 3) {
          if (operatorsSignature && operatorsSignature.startsWith('data:image')) {
            try {
              const imgSize = Math.min(cellData.cell.height - 4, cellData.cell.width - 4, 25);
              const x = cellData.cell.x + (cellData.cell.width - imgSize) / 2;
              const y = cellData.cell.y + (cellData.cell.height - imgSize) / 2;
              doc.addImage(operatorsSignature, 'PNG', x, y, imgSize, imgSize);
            } catch (e) { console.error('Failed to draw operator signature', e); }
          } else if (operatorsSignature) {
            doc.setFontSize(7);
            doc.setTextColor(0,128,0);
            doc.text(operatorsSignature, cellData.cell.x + 2, cellData.cell.y + cellData.cell.height/2);
          }
        }
      }
    });
    y = (doc as any).lastAutoTable.finalY + 5;

    // ----- Footer text (uncontrolled copy warning) -----
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      "Printed copies are for reference only and are not controlled. It is the responsibility of users of this document to ensure that they are using the recent version.",
      14, pageHeight - 20, { align: 'left', maxWidth: pageWidth - 28 }
    );

  } else {
    // ----- ALL OTHER FORMS: either with icons (3 columns) or without (2 columns) -----
    const iconMapForForm = getIconMapForForm(sub.formType);
    const hasIcons = iconMapForForm !== null;

    if (!hasItems(sub.data)) {
      console.warn("No inspection items found");
    } else {
      const data = sub.data; // now narrowed to WithItems
      const items = Object.keys(data.items).sort();
      
      // Preload icons only if needed
      let iconBase64Map: Map<string, string> = new Map();
      if (hasIcons) {
        // For each item, get the icon filename (use fallback if missing)
        const iconFilenames = items.map(item => {
          const iconFile = iconMapForForm?.[item];
          return iconFile || FALLBACK_ICON;
        });
        const unique = Array.from(new Set(iconFilenames));
        await Promise.all(unique.map(async (f) => {
          const base64 = await getImageBase64(f);
          if (base64) iconBase64Map.set(f, base64);
        }));
      }

      // Prepare table configuration
      let head: string[][];
      let body: any[][];
      let columnStyles: any;
      let didDrawCell: ((cellData: any) => void) | undefined;

      if (hasIcons) {
        // Three columns: item, (icon column), status
        head = [['Inspection Item', '', 'Status']];
        body = items.map(item => [
          item,
          '',
          statusLabel(data.items[item] as CheckStatus)
        ]);
        columnStyles = {
          0: { cellWidth: 110, fontStyle: 'bold' },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' }
        };
        didDrawCell = (cellData: any): void => {
          if (cellData.section === 'body' && cellData.column.index === 1) {
            const item = cellData.row.raw[0] as string;
            const iconFile = iconMapForForm?.[item] || FALLBACK_ICON;
            // Try to get base64 for the intended icon; if missing, try fallback
            let base64 = iconBase64Map.get(iconFile);
            if (!base64 && iconFile !== FALLBACK_ICON) {
              base64 = iconBase64Map.get(FALLBACK_ICON);
            }
            if (!base64) return; // still nothing – cannot draw

            try {
              const cellWidth = cellData.cell.width;
              const cellHeight = cellData.cell.height;
              const maxImgSize = Math.min(cellWidth, cellHeight) - 4;
              const imgSize = Math.min(25, maxImgSize);
              const x = cellData.cell.x + (cellWidth - imgSize) / 2;
              const y = cellData.cell.y + (cellHeight - imgSize) / 2;
              doc.addImage(base64, 'PNG', x, y, imgSize, imgSize);
            } catch (e) {
              console.error(`Failed to draw icon for ${item}`, e);
            }
          }
        };
      } else {
        // Two columns: item, status (no icon column)
        head = [['Inspection Item', 'Status']];
        body = items.map(item => [
          item,
          statusLabel(data.items[item] as CheckStatus)
        ]);
        columnStyles = {
          0: { cellWidth: 140, fontStyle: 'bold' },
          1: { cellWidth: 30, halign: 'center' }
        };
        didDrawCell = undefined; // no icons to draw
      }

      (doc as any).autoTable({
        startY: y,
        head: head,
        body: body,
        theme: 'grid',
        headStyles: {
          fillColor: [34, 100, 54],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
        },
        styles: {
          fontSize: 8,
          cellPadding: 4,
          lineColor: [200, 200, 200],
          lineWidth: 0.2,
        },
        columnStyles: columnStyles,
        margin: { left: 20, right: 20 },
        didParseCell: (data: Record<string, any>): void => {
          if (data.section === 'body') {
            data.cell.minHeight = 20;
          }
          if (data.section === 'body' && data.column.index === (hasIcons ? 2 : 1)) {
            const val = data.row.raw[hasIcons ? 2 : 1] as string;
            if (val === 'Defect') {
              data.cell.styles.textColor = [220, 50, 50];
              data.cell.styles.fontStyle = 'bold';
            } else if (val === 'OK') {
              data.cell.styles.textColor = [34, 139, 34];
            } else if (val === 'N/A') {
              data.cell.styles.textColor = [100, 100, 100];
            }
          }
        },
        didDrawCell: didDrawCell
      });
      y = (doc as any).lastAutoTable.finalY + 15;
    }

    // ----- Defect Details (inside a box with proper spacing) -----
    if (hasDefectDetails(sub.data) && sub.data.defectDetails) {
      y += 5;
      if (y > pageHeight - 70) { // leave room for box and signature
        doc.addPage()
        y = 20
      }

      // Prepare text
      doc.setFontSize(8);
      const textLines = doc.splitTextToSize(sub.data.defectDetails, pageWidth - 48); // 14+10 margin left + 10 right = 24, so width = pageWidth-48
      const lineHeight = 5;
      const textHeight = textLines.length * lineHeight;
      const titleHeight = 7;
      const padding = 8;
      const boxWidth = pageWidth - 28; // 14 left + 14 right
      const boxHeight = titleHeight + textHeight + padding * 2;

      const boxX = 14;
      const boxY = y - 3; // small gap above

      // Draw box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(250, 250, 250);
      doc.rect(boxX, boxY, boxWidth, boxHeight, 'FD'); // filled and stroked

      // Title
      doc.setFontSize(10);
      doc.setTextColor(220, 50, 50);
      doc.text("Defect Details:", boxX + padding, boxY + padding + 3);

      // Details text
      doc.setFontSize(8);
      doc.setTextColor(60);
      doc.text(textLines, boxX + padding, boxY + padding + titleHeight + 3);

      // Update y position – add extra space after the box (20mm to match spacing above)
      const gapAfterDefect = 20;
      y = boxY + boxHeight + gapAfterDefect;
    }

    // ----- Signature -----
    if (hasSignature(sub.data) && sub.data.signature) {
      if (y > pageHeight - 70) {
        doc.addPage()
        y = 20
      }

      const boxX = 14
      const boxY = y - 5
      const boxWidth = 100
      const boxHeight = 30

      doc.setFillColor(250, 250, 250)
      doc.rect(boxX, boxY, boxWidth, boxHeight, 'F')
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.5)
      doc.rect(boxX, boxY, boxWidth, boxHeight, 'S')

      doc.setFontSize(9)
      doc.setTextColor(0, 128, 0)
      doc.setFont('helvetica', 'bold')
      doc.text("Signature", boxX, boxY - 4)
      doc.setFont('helvetica', 'normal')

      const signature = sub.data.signature
      if (signature && typeof signature === 'string' && signature.startsWith('data:image')) {
        try {
          const imgSize = Math.min(boxHeight - 8, boxWidth - 8)
          const imgX = boxX + (boxWidth - imgSize) / 2
          const imgY = boxY + (boxHeight - imgSize) / 2
          doc.addImage(signature, 'PNG', imgX, imgY, imgSize, imgSize)
        } catch (error) {
          console.error('Failed to add signature image, falling back to text', error)
          doc.setFontSize(9)
          doc.setFont("helvetica", "italic")
          doc.setTextColor(0, 128, 0)
          doc.text("[Signature image failed to load]", boxX + 5, boxY + boxHeight / 2 + 3)
          doc.setFont("helvetica", "normal")
        }
      } else {
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(0, 128, 0)
        const sigText = signature || "-"
        doc.text(sigText, boxX + 5, boxY + boxHeight / 2 + 3)
        doc.setFont("helvetica", "normal")
      }
      y += boxHeight + 15
    }
  }

  // ----- Footer with dynamic brand name -----
  const pageCount: number = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text(
      `${brandName} - HSE Management System | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    )
  }

  const filename: string = `${brand}-${sub.formType}-${sub.submittedBy.replace(/\s/g, "_")}-${sub.id.slice(0, 8)}.pdf`
  if (asBuffer) {
    return Buffer.from(doc.output('arraybuffer'))
  }
  doc.save(filename)
}

// ============================================================================
// DOWNLOAD HELPER
// ============================================================================
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}