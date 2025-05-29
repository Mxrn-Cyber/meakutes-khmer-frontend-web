const tripsData = [
  {
    id: 1,
    name: "Angkor Wat Temple Complex",
    province: "Siem Reap",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d0cbe2?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 1205,
    duration: "3-5 hours",
    access: "Public",
    accessibility: "Easy",
    bestTime: "Nov-Mar",
    description:
      "Explore the iconic Angkor Wat, a UNESCO World Heritage site and one of the largest religious monuments.",
  },
  {
    id: 2,
    name: "Otres Beach Paradise",
    province: "Preah Sihanouk",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 892,
    duration: "Full day",
    access: "Public",
    accessibility: "Easy",
    bestTime: "Dec-Apr",
    description:
      "Relax on pristine beaches with crystal waters and vibrant nightlife in Sihanoukville.",
  },
  {
    id: 3,
    name: "Royal Palace & Silver Pagoda",
    province: "Phnom Penh",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 1456,
    duration: "2-3 hours",
    access: "Entry Fee",
    accessibility: "Easy",
    bestTime: "Nov-Mar",
    description:
      "Discover Cambodia’s royal history at the stunning Royal Palace and Silver Pagoda.",
  },
  {
    id: 4,
    name: "Bamboo Train Adventure",
    province: "Battambang",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 678,
    duration: "2 hours",
    access: "Local Guide",
    accessibility: "Moderate",
    bestTime: "Nov-Apr",
    description:
      "Ride the unique bamboo train through scenic countryside and rice fields.",
  },
  {
    id: 5,
    name: "Pepper Farm & River Views",
    province: "Kampot",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 543,
    duration: "Half day",
    access: "Free",
    accessibility: "Easy",
    bestTime: "Dec-Apr",
    description:
      "Tour famous pepper plantations and enjoy scenic views along the Kampot River.",
  },
  {
    id: 6,
    name: "Crab Market & Coastal Views",
    province: "Kep",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    rating: 4.2,
    reviews: 321,
    duration: "Half day",
    access: "Public",
    accessibility: "Easy",
    bestTime: "Nov-Apr",
    description:
      "Savor fresh seafood at Kep Crab Market with stunning coastal views.",
  },
  {
    id: 7,
    name: "Elephant Sanctuary Visit",
    province: "Mondulkiri",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 234,
    duration: "Full day",
    access: "Entry Fee",
    accessibility: "Moderate",
    bestTime: "Nov-Apr",
    description:
      "Visit ethical elephant sanctuaries in the lush forests of Mondulkiri.",
  },
  {
    id: 8,
    name: "Yeak Laom Crater Lake",
    province: "Ratanakiri",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 187,
    duration: "2-3 hours",
    access: "Entry Fee",
    accessibility: "Moderate",
    bestTime: "Oct-Mar",
    description:
      "Swim in the volcanic crater lake surrounded by pristine jungle.",
  },
  {
    id: 9,
    name: "Tatai Waterfall Nature",
    province: "Koh Kong",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 298,
    duration: "Full day",
    access: "Local Guide",
    accessibility: "Challenging",
    bestTime: "Nov-May",
    description: "Explore waterfalls and nature in the Cardamom Mountains.",
  },
  {
    id: 10,
    name: "Mekong Dolphin Watching",
    province: "Kratie",
    image:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 412,
    duration: "3-4 hours",
    access: "Boat Tour",
    accessibility: "Easy",
    bestTime: "Dec-Apr",
    description: "Spot rare Irrawaddy dolphins along the Mekong River.",
  },
  {
    id: 11,
    name: "Kirirom National Park",
    province: "Kampong Speu",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    rating: 4.1,
    reviews: 156,
    duration: "Full day",
    access: "Entry Fee",
    accessibility: "Moderate",
    bestTime: "Nov-Mar",
    description:
      "Hike through pine forests and waterfalls in Kirirom National Park.",
  },
  {
    id: 12,
    name: "Sambor Prei Kuk Temples",
    province: "Kampong Thom",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d0cbe2?w=400&h=300&fit=crop",
    rating: 4.0,
    reviews: 89,
    duration: "2-3 hours",
    access: "Entry Fee",
    accessibility: "Easy",
    bestTime: "Nov-Mar",
    description:
      "Visit the pre-Angkorian UNESCO World Heritage temple complex.",
  },
  // Additional 88 entries to reach 100
  {
    id: 13,
    name: "Phnom Kulen Waterfall",
    province: "Siem Reap",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 450,
    duration: "Full day",
    access: "Entry Fee",
    accessibility: "Moderate",
    bestTime: "Nov-Apr",
    description: "Hike to the sacred Phnom Kulen waterfall and ancient ruins.",
  },
  {
    id: 14,
    name: "Koh Rong Island Escape",
    province: "Preah Sihanouk",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 780,
    duration: "Full day",
    access: "Boat Tour",
    accessibility: "Easy",
    bestTime: "Dec-Apr",
    description:
      "Relax on the pristine beaches of Koh Rong with clear turquoise waters.",
  },
  {
    id: 15,
    name: "Tuol Sleng Genocide Museum",
    province: "Phnom Penh",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 920,
    duration: "2-3 hours",
    access: "Entry Fee",
    accessibility: "Easy",
    bestTime: "Nov-Mar",
    description:
      "Learn about Cambodia’s history at the sobering Tuol Sleng Museum.",
  },
  {
    id: 16,
    name: "Battambang Bat Caves",
    province: "Battambang",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    rating: 4.2,
    reviews: 340,
    duration: "2 hours",
    access: "Local Guide",
    accessibility: "Moderate",
    bestTime: "Nov-Apr",
    description:
      "Witness thousands of bats flying out at sunset from Phnom Sampeau caves.",
  },
  {
    id: 17,
    name: "Bokor National Park",
    province: "Kampot",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 510,
    duration: "Full day",
    access: "Entry Fee",
    accessibility: "Moderate",
    bestTime: "Dec-Apr",
    description:
      "Explore the misty hills and abandoned French colonial buildings in Bokor.",
  },
  {
    id: 18,
    name: "Kep National Park Trails",
    province: "Kep",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    rating: 4.1,
    reviews: 290,
    duration: "3-4 hours",
    access: "Free",
    accessibility: "Moderate",
    bestTime: "Nov-Apr",
    description:
      "Hike through lush trails with scenic views in Kep National Park.",
  },
  {
    id: 19,
    name: "Mondulkiri Coffee Plantations",
    province: "Mondulkiri",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop",
    rating: 4.4,
    reviews: 180,
    duration: "Half day",
    access: "Free",
    accessibility: "Easy",
    bestTime: "Nov-Apr",
    description: "Tour coffee plantations and taste local brews in Mondulkiri.",
  },
  {
    id: 20,
    name: "Ratanakiri Waterfalls",
    province: "Ratanakiri",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    rating: 4.3,
    reviews: 210,
    duration: "3-4 hours",
    access: "Entry Fee",
    accessibility: "Moderate",
    bestTime: "Oct-Mar",
    description:
      "Visit stunning waterfalls surrounded by Ratanakiri’s lush jungle.",
  },
  // Continue with similar entries up to 100
  ...Array.from({ length: 80 }, (_, i) => ({
    id: 21 + i,
    name: `Destination ${21 + i}`,
    province: [
      "Siem Reap",
      "Phnom Penh",
      "Battambang",
      "Kampot",
      "Kep",
      "Mondulkiri",
      "Ratanakiri",
      "Koh Kong",
      "Kratie",
      "Kampong Speu",
      "Kampong Thom",
    ][i % 11],
    image: `https://images.unsplash.com/photo-${
      [
        "1539650116574-75c0c6d0cbe2",
        "1506905925346-21bda4d32df4",
        "1558618666-fcd25c85cd64",
        "1578662996442-48f60103fc96",
        "1571019613454-1cb2f99b2d8b",
        "1559827260-dc66d52bef19",
        "1516026672322-bc52d61a55d5",
        "1441974231531-c6227db76b6e",
        "1544551763-46a013bb70d5",
        "1544551763-77ef2d0cfc6c",
        "1441974231531-c6227db76b6e",
      ][i % 11]
    }?w=400&h=300&fit=crop`,
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    reviews: Math.floor(Math.random() * 1000) + 50,
    duration: ["2 hours", "3-4 hours", "Half day", "Full day"][i % 4],
    access: ["Public", "Entry Fee", "Local Guide", "Boat Tour", "Free"][i % 5],
    accessibility: ["Easy", "Moderate", "Challenging"][i % 3],
    bestTime: ["Nov-Mar", "Dec-Apr", "Oct-Mar", "Nov-Apr", "Nov-May"][i % 5],
    description: `Discover a unique ${
      [
        "temple",
        "beach",
        "museum",
        "village",
        "waterfall",
        "market",
        "park",
        "sanctuary",
        "plantation",
        "lake",
      ][i % 10]
    } experience in Cambodia’s ${
      [
        "Siem Reap",
        "Phnom Penh",
        "Battambang",
        "Kampot",
        "Kep",
        "Mondulkiri",
        "Ratanakiri",
        "Koh Kong",
        "Kratie",
        "Kampong Speu",
        "Kampong Thom",
      ][i % 11]
    }.`,
  })),
];

export default tripsData;
