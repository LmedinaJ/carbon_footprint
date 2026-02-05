export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: "select" | "number" | "radio";
  options?: QuestionOption[];
  unit?: string;
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  questions: Question[];
}

export interface EmissionFactorMultiply {
  type: "multiply";
  factor: number;
  annualize: number;
}

export interface EmissionFactorLookup {
  type: "lookup";
  values: Record<string, number>;
}

export type EmissionFactor = EmissionFactorMultiply | EmissionFactorLookup;

export type SurveyAnswers = Record<string, string>;

export interface CalculationResult {
  total: number;
  categories: Record<string, number>;
}

export interface SubmissionRecord {
  id: string;
  session_id: string;
  total_co2_kg: number;
  created_at: string;
}

export interface CategoryBreakdown {
  category: string;
  co2_kg: number;
}

export interface ComparisonData {
  user: Record<string, number>;
  userTotal: number;
  allUsersAvg: Record<string, number>;
  allUsersAvgTotal: number;
  referenceAverages: {
    world: number;
    continents: Record<string, number>;
    countries: Record<string, { co2_per_capita: number; continent: string }>;
  };
}
