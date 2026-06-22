import Analysis from '../models/Analysis.js';

export async function getStats(req, res, next) {
  try {
    const stats = await Analysis.aggregate([
      {
        $facet: {
          totalAnalyses: [{ $count: 'count' }],
          averageScore: [{ $group: { _id: null, avg: { $avg: '$score' } } }],
          statusDistribution: [
            { $group: { _id: '$status', count: { $count: {} } } },
            { $sort: { count: -1 } }
          ],
          topVibes: [
            { $group: { _id: '$vibe', count: { $count: {} } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ],
          recentAnalyses: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                score: 1,
                status: 1,
                vibe: 1,
                createdAt: 1
              }
            }
          ],
          topScores: [
            { $sort: { score: -1 } },
            { $limit: 10 },
            {
              $project: {
                score: 1,
                status: 1,
                vibe: 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ]);

    const result = stats[0];

    res.json({
      success: true,
      data: {
        totalAnalyses: result.totalAnalyses[0]?.count || 0,
        averageScore: Math.round(result.averageScore[0]?.avg || 0),
        statusDistribution: result.statusDistribution,
        topVibes: result.topVibes,
        recentAnalyses: result.recentAnalyses,
        topScores: result.topScores,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Stats Controller Error:', error);
    
    // If DB not connected, return mock data
    if (error.name === 'MongooseError' || error.name === 'MongoServerError') {
      return res.json({
        success: true,
        data: {
          totalAnalyses: 0,
          averageScore: 0,
          statusDistribution: [],
          topVibes: [],
          recentAnalyses: [],
          topScores: [],
          lastUpdated: new Date().toISOString(),
          message: 'Database not connected'
        }
      });
    }
    
    next(error);
  }
}
