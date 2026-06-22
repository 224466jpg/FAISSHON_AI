export async function analyzeOutfitWithAI({ imageUrl = '' } = {}) {
  // Placeholder service: connect Groq, OpenAI, or a computer-vision API here later.
  return {
    outfitScore: 85,
    colorMatch: 'Good',
    occasion: 'Casual / College',
    fitSuggestion: 'Balanced relaxed fit. Add one structured layer for a sharper silhouette.',
    tips: [
      'Add a neutral jacket',
      'Use white sneakers',
      'Avoid too many bright colors',
    ],
    recommendations: [
      'Beige blazer with black jeans',
      'White shirt with denim jacket',
      'Pastel top with wide-leg pants',
    ],
    imageUrl,
  };
}

export function getOccasionRecommendations() {
  return [
    {
      occasion: 'Casual',
      ideas: ['Beige overshirt with white tee', 'Straight denim with clean sneakers'],
    },
    {
      occasion: 'Formal',
      ideas: ['Black blazer with cream blouse', 'Tailored trousers with pointed flats'],
    },
    {
      occasion: 'Party',
      ideas: ['Satin top with wide-leg pants', 'Slip dress with metallic accessories'],
    },
    {
      occasion: 'College',
      ideas: ['Oversized shirt with mom jeans', 'Pastel cardigan with tote bag'],
    },
    {
      occasion: 'Date',
      ideas: ['Soft pink top with dark denim', 'Black midi dress with beige trench'],
    },
    {
      occasion: 'Interview',
      ideas: ['Navy blazer with white shirt', 'Monochrome co-ord with minimal jewelry'],
    },
  ];
}
