import { EmissionFactor } from "@/lib/types";

/**
 * Emission Factors for Carbon Footprint Calculator
 * All values produce kg CO2e (CO2 equivalent) per year
 *
 * SOURCES:
 *
 * TRANSPORTATION:
 * - Vehicle emissions: DEFRA 2023 GHG Conversion Factors
 *   https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023
 * - Average car: 0.21 kg CO2e/km (medium petrol car)
 * - Diesel car: 0.17 kg CO2e/km + higher NOx (we add adjustment)
 * - Hybrid: ~40% reduction vs petrol (ICCT 2021)
 * - Electric: ~70% reduction vs petrol (depends on grid, using Thailand grid)
 * - Motorbike: 0.10-0.11 kg CO2e/km (DEFRA 2023)
 * - Flights: DEFRA 2023 aviation factors with radiative forcing
 *   Short-haul (<3h): ~255 kg CO2e per round trip
 *   Long-haul (>3h): ~1100 kg CO2e per round trip
 * - Public transport: DEFRA 2023 bus/rail factors
 *
 * HOME ENERGY:
 * - Thailand electricity grid: 0.5 kg CO2e/kWh (EGAT/TGO 2023)
 *   https://www.tgo.or.th
 * - Thailand electricity price: ~4 Baht/kWh average
 *   Formula: Baht/4 = kg CO2e per month (user-provided approximation)
 * - LPG cylinder (15kg): 44.1 kg CO2e per cylinder
 *   Source: IPCC 2006 Guidelines (2.98 kg CO2e per kg LPG × 15kg = 44.7 ≈ 44.1)
 *
 * FOOD & DIET:
 * - Diet emissions: Our World in Data / Poore & Nemecek (2018) Science
 *   https://ourworldindata.org/food-choice-vs-eating-local
 * - Vegan: ~1.5 tonnes CO2e/year food-related
 * - High meat: ~3.3 tonnes CO2e/year food-related
 * - Local food impact: Weber & Matthews (2008) - transport is ~11% of food emissions
 * - Food waste: FAO estimates ~1.3 billion tonnes food wasted globally
 *   Average household food waste: ~100-200 kg CO2e/year
 *
 * WASTE & CONSUMPTION:
 * - Recycling impact: EPA WARM Model
 *   https://www.epa.gov/warm
 * - Composting: EPA - diverts ~200 kg CO2e/year from landfill methane
 * - Clothing: WRAP UK - average garment = 25 kg CO2e to produce
 * - Electronics: Circular Economy research - smartphone ~70kg CO2e, laptop ~300kg CO2e
 */

export const emissionFactors: Record<string, EmissionFactor> = {
  // --- TRANSPORTATION ---
  // Base km factor for vehicles (adjusted by vehicle type)
  transport_car_km: {
    type: "multiply",
    factor: 0.21, // kg CO2e/km for average petrol car (DEFRA 2023)
    annualize: 52, // 52 weeks/year
  },
  // Vehicle type adjustments (annual CO2e difference vs baseline petrol car)
  transport_vehicle_type: {
    type: "lookup",
    values: {
      gasoline_car: 0,        // Baseline: 0.21 kg CO2e/km
      diesel_car: 200,        // Slightly higher lifecycle emissions
      hybrid_car: -800,       // ~40% reduction = saves ~800 kg CO2e/year
      electric_car: -1500,    // ~70% reduction Thailand grid = saves ~1500 kg CO2e/year
      gasoline_motorbike: -600,  // ~0.11 kg CO2e/km = ~50% less than car
      electric_motorbike: -900,  // Very low emissions on Thailand grid
      public_transport: -999999, // Zeroes out personal km (counted separately)
      train: -999999,            // Zeroes out personal km (counted separately)
    },
  },
  // Flight emissions (DEFRA 2023 with radiative forcing multiplier)
  transport_flights_short: {
    type: "multiply",
    factor: 255, // kg CO2e per short-haul round trip (<3h, ~1500km)
    annualize: 1,
  },
  transport_flights_long: {
    type: "multiply",
    factor: 1100, // kg CO2e per long-haul round trip (>3h, ~8000km avg)
    annualize: 1,
  },
  // Public transport usage (annual kg CO2e based on frequency)
  transport_public: {
    type: "lookup",
    values: {
      never: 0,
      occasional: 340,  // 1-2 days/week × 52 weeks × ~6.5 kg/day
      regular: 680,     // 3-5 days/week × 52 weeks × ~6.5 kg/day
      daily: 910,       // 5+ days/week × 52 weeks × ~3.5 kg/day (more efficient)
    },
  },

  // --- HOME ENERGY ---
  // Electricity: User formula - Baht/4 = kg CO2e per month
  // Based on: ~4 Baht/kWh × ~0.5 kg CO2e/kWh ≈ Baht/4 simplified
  energy_electricity: {
    type: "multiply",
    factor: 0.25, // Baht → kg CO2e (Baht/4 = Baht × 0.25)
    annualize: 12, // 12 months/year
  },
  // LPG cylinder: 15kg LPG = 44.1 kg CO2e (IPCC emission factor)
  energy_lpg: {
    type: "multiply",
    factor: 44.1, // kg CO2e per 15kg LPG cylinder
    annualize: 12, // 12 months/year
  },

  // --- FOOD & DIET ---
  // Annual food-related CO2e by diet type (Poore & Nemecek 2018)
  food_diet: {
    type: "lookup",
    values: {
      vegan: 600,        // ~1.5t total, ~600kg direct food emissions
      vegetarian: 1200,  // Dairy adds significant emissions
      pescatarian: 1400, // Fish has moderate emissions
      low_meat: 1800,    // Meat 1-2x/week
      medium_meat: 2500, // Meat 3-5x/week
      high_meat: 3300,   // Daily meat consumption
    },
  },
  // Local/seasonal food impact (transport ~11% of food emissions)
  food_local: {
    type: "lookup",
    values: {
      rarely: 400,     // High food miles
      sometimes: 250,  // Mixed sourcing
      often: 120,      // Mostly local
      always: 50,      // Very low transport emissions
    },
  },
  // Food waste emissions (methane from landfill decomposition)
  food_waste: {
    type: "lookup",
    values: {
      none: 50,    // Minimal waste
      little: 150, // <1kg/week
      some: 350,   // 1-3kg/week
      lot: 600,    // >3kg/week
    },
  },

  // --- WASTE & CONSUMPTION ---
  // Recycling impact (EPA WARM model estimates)
  waste_recycling: {
    type: "lookup",
    values: {
      none: 700,       // All waste to landfill
      some: 450,       // Partial recycling
      most: 200,       // Good recycling habits
      everything: 50,  // Maximum diversion
    },
  },
  // Composting (prevents methane from organic waste in landfill)
  waste_composting: {
    type: "lookup",
    values: {
      no: 200,  // Organic waste to landfill → methane
      yes: 0,   // Composting prevents methane emissions
    },
  },
  // Clothing purchases (WRAP UK: ~25 kg CO2e per garment average)
  waste_shopping: {
    type: "lookup",
    values: {
      rarely: 100,   // Few items/year
      monthly: 400,  // ~12-16 items/year
      weekly: 1000,  // 50+ items/year (fast fashion)
    },
  },
  // Electronics (lifecycle emissions: smartphone ~70kg, laptop ~300kg)
  waste_electronics: {
    type: "lookup",
    values: {
      rarely: 100,       // Replace every 3+ years
      occasionally: 300, // Replace every 1-2 years
      frequently: 700,   // Multiple devices/year
    },
  },
};
