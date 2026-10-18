export type UnitSystem = 'imperial' | 'metric';

export interface CalculatorMeta {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: CalculatorCategory;
  description: string;
  shortDescription: string;
  iconName: string;
  keywords: string[];
  formulaSummary: string;
  formulaSteps: string[];
  exampleInputs: Record<string, string | number>;
  exampleOutput: string;
  tips: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
}

export type CalculatorCategory =
  | 'Room & Measurement'
  | 'Paint, Flooring & Wall Materials'
  | 'Lighting & Electrical Planning'
  | 'Decor & Furniture'
  | 'Construction & Finishing';

export interface CategoryInfo {
  name: CalculatorCategory;
  description: string;
  icon: string;
}
