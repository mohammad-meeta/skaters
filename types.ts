
export enum Category {
  OTHERS = 'OTHERS',
  SITTING = 'SITTING',
  JUMPING = 'JUMPING',
  WHEELING = 'WHEELING',
  SPINNING = 'SPINNING',
  FOOTWORK = 'FOOTWORK'
}

export enum Level {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E'
}

export interface Trick {
  id: string;
  name: string;
  level: Level;
  category: Category;
  maxCones?: number; // Added: Optional initially, filled by logic
}

export interface UserLog {
  trickId: string;
  cones: number;
  maxConesPossible: number;
  videoProofUrl?: string; // Simulated URL
  date: string;
  isMastered: boolean; // True if max cones achieved
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  requiredBadgeLevel: Level;
  cost: number; // Cost in points
  image: string;
}

export interface UserState {
  logs: Record<string, UserLog>;
  totalScore: number;
  pointsPerLevel: Record<Level, number>;
  redeemedItems: string[];
  userName: string;
  tricks: Trick[]; // Added: Store tricks in state
}
