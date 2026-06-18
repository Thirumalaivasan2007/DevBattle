import User from '../models/User';
import ContestStanding from '../models/ContestStanding';
import RatingHistory from '../models/RatingHistory';
import RankingCache from '../models/RankingCache';

// Standard Elo calculation constants
const K_FACTOR = 32;

/**
 * Expected score calculation based on Elo
 * Returns probability of user A winning against user B
 */
function getExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Simplified Elo Rating Update for Contests
 * 
 * In a real contest platform like Codeforces, the rating algorithm is complex 
 * (accounting for performance delta, number of previous contests, etc.).
 * Here we use an Elo approximation where each user competes against the "average" 
 * rating of the contest, modified by their actual rank vs expected rank.
 */
export const calculateContestRatings = async (contestId: string) => {
  // 1. Fetch all standings for the contest
  const standings = await ContestStanding.find({ contestId, isVirtual: false })
    .populate('userId', 'rating highestRating')
    .sort({ rank: 1 });

  if (standings.length <= 1) {
    console.log('Not enough participants to update ratings.');
    return;
  }

  // 2. Calculate average rating of the contest
  let totalRating = 0;
  standings.forEach(s => {
    totalRating += (s.userId as any).rating || 1000;
  });
  const avgRating = totalRating / standings.length;

  const totalParticipants = standings.length;
  
  // 3. Process each standing
  for (const standing of standings) {
    const user = standing.userId as any;
    const oldRating = user.rating || 1000;
    
    // Expected rank (1 = best, totalParticipants = worst)
    // If you are much higher than avg, expected rank is near 1
    const expectedWinProb = getExpectedScore(oldRating, avgRating);
    const expectedRank = totalParticipants - (expectedWinProb * totalParticipants) + 0.5;

    // Actual rank
    const actualRank = standing.rank;

    // Rank delta: if actual rank is better (lower number) than expected, delta is positive
    const rankDelta = expectedRank - actualRank;

    // Map rank delta to rating change
    let ratingChange = Math.round(rankDelta * (K_FACTOR / (totalParticipants / 2)));

    // Cap changes
    if (ratingChange > 150) ratingChange = 150;
    if (ratingChange < -100) ratingChange = -100;
    
    // Beginner protection
    if (oldRating + ratingChange < 0) {
      ratingChange = -oldRating; 
    }

    const newRating = oldRating + ratingChange;

    // 4. Update the standing document with rating changes
    standing.oldRating = oldRating;
    standing.newRating = newRating;
    standing.ratingChange = ratingChange;
    await standing.save();

    // 5. Update User Profile
    user.rating = newRating;
    if (newRating > (user.highestRating || 0)) {
      user.highestRating = newRating;
    }
    await user.save();

    // 6. Record in RatingHistory
    await RatingHistory.create({
      userId: user._id,
      rating: newRating,
      change: ratingChange,
      contestId: contestId
    });

    // 7. Update Global Ranking Cache
    await RankingCache.findOneAndUpdate(
      { userId: user._id },
      { rating: newRating },
      { upsert: true }
    );
  }

  console.log(`Rating updates applied for contest ${contestId}`);
};
