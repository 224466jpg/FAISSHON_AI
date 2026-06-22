export const features = [
  {
    title: 'AI Outfit Analysis',
    text: 'Get a score, color notes, fit feedback, and practical improvement tips from one photo.',
  },
  {
    title: 'Color Matching',
    text: 'Understand whether your palette feels balanced, bold, warm, cool, or occasion ready.',
  },
  {
    title: 'Occasion Styling',
    text: 'Tune the same wardrobe for college, interviews, dates, parties, and formal moments.',
  },
  {
    title: 'Wardrobe Suggestions',
    text: 'Save looks and discover pairings that make existing pieces feel fresh again.',
  },
];

export const sampleAnalysis = {
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
};

export const recommendationGroups = [
  {
    mood: 'Casual',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    looks: ['White tee, straight denim, beige overshirt', 'Ribbed tank, linen pants, tan sandals'],
  },
  {
    mood: 'Formal',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    looks: ['Cream blouse, tailored trousers, gold hoops', 'Black blazer, satin cami, pointed flats'],
  },
  {
    mood: 'Party',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80',
    looks: ['Slip dress, cropped jacket, metallic bag', 'Wide-leg pants, shimmer top, block heels'],
  },
  {
    mood: 'College',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
    looks: ['Oversized shirt, mom jeans, clean sneakers', 'Pastel cardigan, pleated skirt, tote bag'],
  },
  {
    mood: 'Date',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80',
    looks: ['Soft pink top, dark denim, delicate necklace', 'Black midi dress, beige trench, mini bag'],
  },
  {
    mood: 'Interview',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    looks: ['Navy blazer, white shirt, slim trousers', 'Monochrome co-ord, low bun, minimal jewelry'],
  },
];

export const wardrobeItems = [
  {
    name: 'Campus Neutral',
    tag: 'Saved Look',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80',
    score: 88,
  },
  {
    name: 'Soft Formal',
    tag: 'Interview',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    score: 92,
  },
  {
    name: 'Evening Satin',
    tag: 'Party',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    score: 90,
  },
];

export const styleTips = [
  'Pick one hero piece and keep the rest quieter.',
  'Repeat one color twice to make an outfit feel styled.',
  'Balance loose pieces with one structured or fitted item.',
  'Use accessories to move a basic outfit from casual to intentional.',
  'For photos, avoid cluttered backgrounds and use natural light.',
  'Match shoe formality to the occasion before changing the whole outfit.',
];

export const dashboardStats = [
  { label: 'Total outfits analyzed', value: '24' },
  { label: 'Saved looks', value: '11' },
  { label: 'Best style score', value: '94' },
  { label: 'Recent recommendations', value: '18' },
];
