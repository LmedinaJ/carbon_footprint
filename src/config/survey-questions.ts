import { Category } from "@/lib/types";

export interface StudentInfo {
  name: string;
  email: string;
}

export const surveyCategories: Category[] = [
  {
    id: "transport",
    title: "Transportation",
    icon: "🚗",
    description: "How you get around day to day",
    questions: [
      {
        id: "transport_car_km",
        text: "How many kilometers do you drive per week?",
        type: "number",
        unit: "km/week",
        placeholder: "0",
        min: 0,
        max: 5000,
      },
      {
        id: "transport_vehicle_type",
        text: "What type of vehicle do you primarily use?",
        type: "select",
        options: [
          { label: "Gasoline car", value: "gasoline_car" },
          { label: "Diesel car", value: "diesel_car" },
          { label: "Hybrid car", value: "hybrid_car" },
          { label: "Electric car", value: "electric_car" },
          { label: "Gasoline motorbike", value: "gasoline_motorbike" },
          { label: "Electric motorbike", value: "electric_motorbike" },
          { label: "Public transportation", value: "public_transport" },
          { label: "Train", value: "train" },
        ],
      },
      {
        id: "transport_flights_short",
        text: "How many short-haul flights (<3h) do you take per year?",
        type: "number",
        unit: "flights/year",
        placeholder: "0",
        min: 0,
        max: 200,
      },
      {
        id: "transport_flights_long",
        text: "How many long-haul flights (>3h) do you take per year?",
        type: "number",
        unit: "flights/year",
        placeholder: "0",
        min: 0,
        max: 100,
      },
      {
        id: "transport_public",
        text: "How often do you use public transport?",
        type: "select",
        options: [
          { label: "Never", value: "never" },
          { label: "Occasionally (1-2 days/week)", value: "occasional" },
          { label: "Regularly (3-5 days/week)", value: "regular" },
          { label: "Daily", value: "daily" },
        ],
      },
    ],
  },
  {
    id: "energy",
    title: "Home Energy",
    icon: "⚡",
    description: "Your household energy consumption",
    questions: [
      {
        id: "energy_electricity",
        text: "How much electricity does your household use per month?",
        type: "number",
        unit: "Baht/month",
        placeholder: "0",
        helpText: "Enter your electricity bill in Baht. Formula: Baht/4 = kg CO2e per month.",
        min: 0,
        max: 50000,
      },
      {
        id: "energy_lpg",
        text: "How many LP gas cylinders does your household use per month?",
        type: "number",
        unit: "cylinders/month",
        placeholder: "0",
        helpText: "Standard 15kg cylinder",
        min: 0,
        max: 10,
      },
    ],
  },
  {
    id: "food",
    title: "Food & Diet",
    icon: "🍽️",
    description: "Your eating habits and food choices",
    questions: [
      {
        id: "food_diet",
        text: "How would you describe your diet?",
        type: "select",
        options: [
          { label: "Vegan", value: "vegan" },
          { label: "Vegetarian", value: "vegetarian" },
          { label: "Pescatarian", value: "pescatarian" },
          { label: "Low meat (1-2 times/week)", value: "low_meat" },
          { label: "Medium meat (3-5 times/week)", value: "medium_meat" },
          { label: "High meat (daily)", value: "high_meat" },
        ],
      },
      {
        id: "food_local",
        text: "How often do you buy local/seasonal food?",
        type: "select",
        options: [
          { label: "Rarely", value: "rarely" },
          { label: "Sometimes", value: "sometimes" },
          { label: "Often", value: "often" },
          { label: "Always", value: "always" },
        ],
      },
      {
        id: "food_waste",
        text: "How much food do you throw away per week?",
        type: "select",
        options: [
          { label: "None", value: "none" },
          { label: "A little", value: "little" },
          { label: "Some", value: "some" },
          { label: "A lot", value: "lot" },
        ],
      },
    ],
  },
  {
    id: "waste",
    title: "Waste & Consumption",
    icon: "♻️",
    description: "Your waste habits and purchasing patterns",
    questions: [
      {
        id: "waste_recycling",
        text: "How much of your waste do you recycle?",
        type: "select",
        options: [
          { label: "None", value: "none" },
          { label: "Some", value: "some" },
          { label: "Most", value: "most" },
          { label: "Everything", value: "everything" },
        ],
      },
      {
        id: "waste_composting",
        text: "Do you compost organic waste?",
        type: "radio",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      {
        id: "waste_shopping",
        text: "How often do you buy new clothing?",
        type: "select",
        options: [
          { label: "Rarely", value: "rarely" },
          { label: "Monthly", value: "monthly" },
          { label: "Weekly", value: "weekly" },
        ],
      },
      {
        id: "waste_electronics",
        text: "How often do you buy new electronics/gadgets?",
        type: "select",
        options: [
          { label: "Rarely", value: "rarely" },
          { label: "Occasionally", value: "occasionally" },
          { label: "Frequently", value: "frequently" },
        ],
      },
    ],
  },
];
