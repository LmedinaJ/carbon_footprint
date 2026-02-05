import { EmissionFactor } from "@/lib/types";

// Sources: EPA, DEFRA 2023 conversion factors, Our World in Data
// All values produce kg CO2 per year
export const emissionFactors: Record<string, EmissionFactor> = {
  // --- Transport ---
  transport_car_km: {
    type: "multiply",
    factor: 0.21, // ~0.21 kg CO2/km for average car
    annualize: 52, // 52 weeks/year
  },
  transport_car_type: {
    type: "lookup",
    values: {
      none: -999999, // Will zero out car_km contribution
      gasoline: 0, // Baseline (already in car_km factor)
      diesel: 200, // Slightly higher overall
      hybrid: -800, // Saves ~800 kg/year vs gasoline
      electric: -1500, // Saves ~1500 kg/year vs gasoline
    },
  },
  transport_flights_short: {
    type: "multiply",
    factor: 255, // ~255 kg CO2 per short-haul round trip
    annualize: 1,
  },
  transport_flights_long: {
    type: "multiply",
    factor: 1100, // ~1100 kg CO2 per long-haul round trip
    annualize: 1,
  },
  transport_public: {
    type: "lookup",
    values: {
      never: 0,
      occasional: 340,
      regular: 680,
      daily: 910,
    },
  },

  // --- Energy ---
  energy_electricity: {
    type: "multiply",
    factor: 0.4, // ~0.4 kg CO2/kWh (global average)
    annualize: 12, // 12 months/year
  },
  energy_gas: {
    type: "multiply",
    factor: 2.0, // ~2.0 kg CO2/m³ natural gas
    annualize: 12,
  },
  energy_heating: {
    type: "lookup",
    values: {
      electric: 500,
      gas: 1200,
      oil: 2500,
      heat_pump: 300,
      wood: 200,
      district: 600,
    },
  },
  energy_renewable: {
    type: "lookup",
    values: {
      no: 0,
      partial: -400, // Reduces electricity footprint
      yes: -800,
    },
  },

  // --- Food ---
  food_diet: {
    type: "lookup",
    values: {
      vegan: 600,
      vegetarian: 1200,
      pescatarian: 1400,
      low_meat: 1800,
      medium_meat: 2500,
      high_meat: 3300,
    },
  },
  food_local: {
    type: "lookup",
    values: {
      rarely: 400,
      sometimes: 250,
      often: 120,
      always: 50,
    },
  },
  food_waste: {
    type: "lookup",
    values: {
      none: 50,
      little: 150,
      some: 350,
      lot: 600,
    },
  },

  // --- Waste & Consumption ---
  waste_recycling: {
    type: "lookup",
    values: {
      none: 700,
      some: 450,
      most: 200,
      everything: 50,
    },
  },
  waste_composting: {
    type: "lookup",
    values: {
      no: 200,
      yes: 0,
    },
  },
  waste_shopping: {
    type: "lookup",
    values: {
      rarely: 100,
      monthly: 400,
      weekly: 1000,
    },
  },
  waste_electronics: {
    type: "lookup",
    values: {
      rarely: 100,
      occasionally: 300,
      frequently: 700,
    },
  },
};
