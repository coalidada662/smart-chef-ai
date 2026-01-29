
export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  difficulty: 'آسان' | 'متوسط' | 'سخت';
  time: string;
}

export interface SuggestionResponse {
  recipes: Recipe[];
}
