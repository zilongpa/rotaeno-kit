export function calculateSongRating(
  difficulty: number,
  achievementRate: number
): number {
  let rating: number;

  if (achievementRate >= 1008000 && achievementRate <= 1010000) {
    rating = difficulty + 3.4 + (achievementRate - 1008000) / 1000;
  } else if (achievementRate >= 1004000 && achievementRate < 1008000) {
    rating = difficulty + 2.4 + (achievementRate - 1004000) / 4000;
  } else if (achievementRate >= 1000000 && achievementRate < 1004000) {
    rating = difficulty + 2.0 + (achievementRate - 1000000) / 10000;
  } else if (achievementRate >= 980000 && achievementRate < 1000000) {
    rating = difficulty + 1.0 + (achievementRate - 980000) / 20000;
  } else if (achievementRate >= 950000 && achievementRate < 980000) {
    rating = difficulty + (achievementRate - 950000) / 30000;
  } else if (achievementRate >= 900000 && achievementRate < 950000) {
    rating = difficulty - 1.0 + (achievementRate - 900000) / 50000;
  } else if (achievementRate >= 500000 && achievementRate < 900000) {
    rating = difficulty - 5.0 + (achievementRate - 500000) / 100000;
  } else {
    rating = difficulty - 9999;
  }

  // If the player fails, ensure the rating doesn't exceed 6.0
  if (achievementRate < 900000) {
    rating = Math.min(6.0, rating);
  }

  // Round to four decimal places
  return Math.round(rating * 10000) / 10000;
}
