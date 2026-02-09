import { emissionFactors } from "@/config/emission-factors";
import { surveyCategories } from "@/config/survey-questions";
import { CalculationResult, SurveyAnswers } from "@/lib/types";

export function calculateFootprint(answers: SurveyAnswers): CalculationResult {
  const categories: Record<string, number> = {};

  // Initialize categories
  for (const cat of surveyCategories) {
    categories[cat.id] = 0;
  }

  // Calculate CO2 for each answer
  for (const [questionId, answerValue] of Object.entries(answers)) {
    const factor = emissionFactors[questionId];
    if (!factor) continue;

    // Derive category from question ID prefix (e.g. "transport_car_km" -> "transport")
    const categoryId = questionId.split("_")[0];
    if (!(categoryId in categories)) continue;

    let co2 = 0;

    if (factor.type === "multiply") {
      const numericValue = parseFloat(answerValue);
      if (!isNaN(numericValue)) {
        co2 = numericValue * factor.factor * factor.annualize;
      }
    } else if (factor.type === "lookup") {
      co2 = factor.values[answerValue] ?? 0;
    }

    categories[categoryId] += co2;
  }

  // Handle special case: if vehicle type is public transport or train, zero out km contribution
  const vehicleType = answers["transport_vehicle_type"];
  if (vehicleType === "public_transport" || vehicleType === "train") {
    // Remove the car_km contribution and the large negative penalty
    const carKmFactor = emissionFactors["transport_car_km"];
    if (carKmFactor && carKmFactor.type === "multiply") {
      const km = parseFloat(answers["transport_car_km"] || "0");
      if (!isNaN(km)) {
        categories["transport"] -= km * carKmFactor.factor * carKmFactor.annualize;
      }
    }
    // Remove the -999999 from lookup
    categories["transport"] -= -999999;
  }

  // Ensure no negative values per category
  for (const cat of Object.keys(categories)) {
    categories[cat] = Math.max(0, Math.round(categories[cat]));
  }

  const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

  return { total, categories };
}
