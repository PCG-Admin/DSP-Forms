import type { Submission, CheckStatus } from "@/lib/types"
import { getBrand } from '@/lib/brand';
import type { Brand } from '@/lib/brand';

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
  "Air Tank Drain": "air-fuel-leaks.png",
  "Oil/Fluid/Air Levels": "oil-fluid-air-level.png",
  "Fuel, Air and Oil leaks": "fuel-leaks.png",
  "Differentials": "differentials.png"
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
      // These forms have no icons
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
      const imageBuffer = fs.readFileSync(imagePath);
      return `data:image/png;base64,${imageBuffer.toString('base64')}`;
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
      return "Motorised Equipment/Vehicle Job Card"
    case "daily-attachment-checklist":
      return "Daily Attachment Checklist"
    case "daily-machine-checklist":
      return "Daily Machine Checklist"
    case "dezzi-timber-truck":
      return "Dezzi Timber Truck Pre-Shift Checklist"
    case "diesel-cart-trailer":
      return "Diesel Cart Trailer Inspection Checklist"
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
  cintasign: 'cintasign-logo.jpg', // .jpg for Cintasign
};

async function getBrandLogoBase64(brand: Brand): Promise<string> {
  const filename = brandLogoFile[brand];
  try {
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const logoPath = path.join(process.cwd(), 'public', 'images', filename);
      const logoBuffer = fs.readFileSync(logoPath);
      const mime = filename.endsWith('.png') ? 'png' : 'jpeg';
      return `data:image/${mime};base64,${logoBuffer.toString('base64')}`;
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
// CSV EXPORTS (updated to include brand name)
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
      sub.data.defectDetails || "",
      sub.data.signature || "",
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
  if (sub.data.items) {
    for (const [item, status] of Object.entries(sub.data.items)) {
      rows.push([item, statusLabel(status as CheckStatus)])
    }
  }
  rows.push([])
  if (sub.data.defectDetails) {
    rows.push(["Defect Details", sub.data.defectDetails])
  }
  rows.push(["Signature", sub.data.signature || "-"])
  const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n")
  const filename = `${brand}-${sub.formType}-${sub.submittedBy.replace(/\s/g, "_")}-${sub.id.slice(0, 8)}.csv`
  downloadFile(csv, filename, "text/csv;charset=utf-8;")
}

// ============================================================================
// PDF EXPORT – now using submission's brand
// ============================================================================
export async function exportSubmissionToPDF(sub: Submission): Promise<void> {
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

  // ----- Status Badge -----
  doc.setFontSize(9)
  if (sub.hasDefects) {
    doc.setTextColor(220, 50, 50)
    doc.text("DEFECTS FOUND", pageWidth - 14, yOffset + 18, { align: "right" })
  } else {
    doc.setTextColor(34, 139, 34)
    doc.text("CLEAN", pageWidth - 14, yOffset + 18, { align: "right" })
  }

  // ----- Form Fields Table -----
  const fieldRows: string[][] = []
  fieldRows.push(["Submitted By", sub.submittedBy])
  const formattedDate = new Date(sub.submittedAt).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  fieldRows.push(["Date", formattedDate])
  for (const [key, value] of Object.entries(sub.data)) {
    if (
      key === "items" ||
      key === "hasDefects" ||
      key === "defectDetails" ||
      key === "signature" ||
      key === "date"
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

  // ==========================================================================
  // INSPECTION ITEMS – HANDLE BY FORM TYPE
  // ==========================================================================
  let y = (doc as any).lastAutoTable?.finalY ?? yOffset + 33
  y += 10

  // Preload icons helper
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
    for (const section of sections) {
      const sectionItems = section.items.filter((item: string): boolean => 
        sub.data.items !== undefined && item in sub.data.items
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
          statusLabel(sub.data.items?.[item] as CheckStatus)
        ])
      })

      secondHalf.forEach((item: string): void => {
        tableRows.push([
          item,
          '',
          statusLabel(sub.data.items?.[item] as CheckStatus)
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
  } else {
    // ----- ALL OTHER FORMS: PER‑ITEM ICON TABLE -----
    const iconMapForForm = getIconMapForForm(sub.formType);
    if (!sub.data.items) {
      console.warn("No inspection items found");
    } else {
      const items = Object.keys(sub.data.items).sort();
      
      // Collect all icon filenames needed
      const iconFilenames = items
        .map(item => iconMapForForm?.[item])
        .filter(f => f) as string[];
      
      const iconBase64Map = await preloadIcons(iconFilenames);

      const tableRows: any[] = items.map(item => [
        item,
        '',
        statusLabel(sub.data.items[item] as CheckStatus)
      ]);

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
          if (data.section === 'body' && data.column.index === 1) {
            const item = data.row.raw[0] as string;
            const iconFile = iconMapForForm?.[item];
            if (!iconFile) return;
            const base64 = iconBase64Map.get(iconFile);
            if (!base64) return;

            try {
              const cellWidth = data.cell.width;
              const cellHeight = data.cell.height;
              const maxImgSize = Math.min(cellWidth, cellHeight) - 4;
              const imgSize = Math.min(25, maxImgSize);
              const x = data.cell.x + (cellWidth - imgSize) / 2;
              const y = data.cell.y + (cellHeight - imgSize) / 2;
              doc.addImage(base64, 'PNG', x, y, imgSize, imgSize);
            } catch (e) {
              console.error(`Failed to draw icon for ${item}`, e);
            }
          }
        }
      });
      y = (doc as any).lastAutoTable.finalY + 15;
    }
  }

  // ----- Defect Details -----
  if (sub.data.defectDetails) {
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
    const lines: string[] = doc.splitTextToSize(sub.data.defectDetails as string, pageWidth - 28)
    doc.text(lines, 14, y)
    y += lines.length * 5 + 10
  }

  // ----- Signature (professional green label) -----
  if (y > pageHeight - 70) {
    doc.addPage()
    y = 20
  }

  // Draw a light gray box with border
  const boxX = 14
  const boxY = y - 5
  const boxWidth = 100
  const boxHeight = 30

  doc.setFillColor(250, 250, 250) // almost white
  doc.rect(boxX, boxY, boxWidth, boxHeight, 'F')
  doc.setDrawColor(180, 180, 180)
  doc.setLineWidth(0.5)
  doc.rect(boxX, boxY, boxWidth, boxHeight, 'S')

  // Green label above the box
  doc.setFontSize(9)
  doc.setTextColor(0, 128, 0) // green
  doc.setFont('helvetica', 'bold')
  doc.text("Signature", boxX, boxY - 4)
  doc.setFont('helvetica', 'normal')

  // Signature content (if image, keep original; if text, use green)
  const signature = sub.data.signature
  if (signature && typeof signature === 'string' && signature.startsWith('data:image')) {
    try {
      // Image signature – fit inside box with padding
      const imgSize = Math.min(boxHeight - 8, boxWidth - 8)
      const imgX = boxX + (boxWidth - imgSize) / 2
      const imgY = boxY + (boxHeight - imgSize) / 2
      doc.addImage(signature, 'PNG', imgX, imgY, imgSize, imgSize)
    } catch (error) {
      console.error('Failed to add signature image, falling back to text', error)
      doc.setFontSize(9)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(0, 128, 0) // green
      doc.text("[Signature image failed to load]", boxX + 5, boxY + boxHeight / 2 + 3)
      doc.setFont("helvetica", "normal")
    }
  } else {
    // Text signature – draw in green
    doc.setFontSize(9)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(0, 128, 0) // green
    const sigText = (signature as string) || "-"
    doc.text(sigText, boxX + 5, boxY + boxHeight / 2 + 3)
    doc.setFont("helvetica", "normal")
  }

  // Reset text color for subsequent content
  doc.setTextColor(60, 60, 60)

  y += boxHeight + 15
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