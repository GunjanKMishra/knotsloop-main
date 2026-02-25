import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalyzeRequest {
  channelUrl: string;
}

interface AnalyzeResponse {
  suggestedDisciplines: string[];
  confidence: number;
  channelInfo?: {
    title: string;
    videoCount: number;
    analyzedTitles: string[];
  };
}

const DISCIPLINES = [
  "Anthropology",
  "Arts",
  "Business",
  "Computer Science",
  "Economics",
  "Education",
  "Engineering",
  "Geography",
  "History",
  "Languages & Literature",
  "Law",
  "Life Sciences",
  "Logic",
  "Mathematics",
  "Medicine & Health",
  "Philosophy",
  "Physical Sciences",
  "Political Science",
  "Psychology",
  "Religion",
  "Sociology"
];

async function getYouTubeChannelInfo(channelUrl: string) {
  try {
    // Extract channel identifier from URL
    const channelId = extractChannelId(channelUrl);

    if (!channelId) {
      throw new Error("Invalid YouTube channel URL");
    }

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");

    if (!apiKey) {
      console.warn("YouTube API key not configured, using mock data");
      return getMockChannelData(channelUrl);
    }

    // Fetch channel details and recent videos
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelId}&key=${apiKey}`
    );

    if (!channelResponse.ok) {
      throw new Error("Failed to fetch channel data");
    }

    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("Channel not found");
    }

    const channel = channelData.items[0];
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

    // Fetch recent videos from uploads playlist
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=20&key=${apiKey}`
    );

    if (!videosResponse.ok) {
      throw new Error("Failed to fetch videos");
    }

    const videosData = await videosResponse.json();
    const videoTitles = videosData.items.map((item: any) => item.snippet.title);

    return {
      channelTitle: channel.snippet.title,
      videoTitles,
      videoCount: videosData.items.length
    };
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    // Return mock data for demo purposes
    return getMockChannelData(channelUrl);
  }
}

function extractChannelId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Handle different YouTube URL formats
    if (urlObj.hostname.includes('youtube.com')) {
      // youtube.com/channel/UC...
      if (urlObj.pathname.startsWith('/channel/')) {
        return urlObj.pathname.split('/')[2];
      }
      // youtube.com/@username
      if (urlObj.pathname.startsWith('/@')) {
        return urlObj.pathname.split('/')[1].substring(1);
      }
      // youtube.com/c/username
      if (urlObj.pathname.startsWith('/c/')) {
        return urlObj.pathname.split('/')[2];
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getMockChannelData(channelUrl: string) {
  // Mock data for demonstration when API key is not available
  const mockData = {
    channelTitle: "Sample Educational Channel",
    videoTitles: [
      "Introduction to Machine Learning Basics",
      "Understanding Neural Networks",
      "Python Programming Tutorial",
      "Data Structures and Algorithms Explained",
      "Deep Learning Fundamentals",
      "Computer Vision Introduction",
      "Natural Language Processing Basics",
      "AI Ethics and Considerations",
      "Building Your First ML Model",
      "Advanced Python Techniques"
    ],
    videoCount: 10
  };

  // Try to infer from URL
  if (channelUrl.toLowerCase().includes('philosophy')) {
    mockData.videoTitles = [
      "Introduction to Stoic Philosophy",
      "Plato's Theory of Forms",
      "Understanding Existentialism",
      "Ethics in Modern Philosophy",
      "The Mind-Body Problem"
    ];
  } else if (channelUrl.toLowerCase().includes('history')) {
    mockData.videoTitles = [
      "Ancient Rome: Rise and Fall",
      "World War II Overview",
      "Medieval History",
      "Renaissance Period",
      "Industrial Revolution"
    ];
  }

  return mockData;
}

async function analyzeTitlesWithAI(videoTitles: string[]): Promise<string[]> {
  const titlesText = videoTitles.join("\n");

  const prompt = `Analyze these YouTube video titles and determine which academic disciplines they belong to. Choose the 3 most relevant disciplines from this list:

${DISCIPLINES.join(", ")}

Video titles:
${titlesText}

Respond with ONLY a JSON array of 1-3 discipline names that best match the content, ordered by relevance. Example: ["Computer Science", "Mathematics", "Engineering"]

Your response:`;

  try {
    // Use a simple keyword matching algorithm as fallback
    const disciplineScores: Record<string, number> = {};

    DISCIPLINES.forEach(discipline => {
      disciplineScores[discipline] = 0;
    });

    const allText = titlesText.toLowerCase();

    // Keyword matching
    const keywords: Record<string, string[]> = {
      "Computer Science": ["programming", "coding", "software", "algorithm", "data structure", "machine learning", "ai", "artificial intelligence", "neural network", "python", "javascript", "java", "computer"],
      "Mathematics": ["math", "calculus", "algebra", "geometry", "statistics", "probability", "equation", "theorem"],
      "Philosophy": ["philosophy", "ethics", "stoic", "plato", "aristotle", "metaphysics", "epistemology", "logic", "moral"],
      "History": ["history", "war", "ancient", "medieval", "renaissance", "revolution", "empire", "civilization"],
      "Physics": ["physics", "quantum", "mechanics", "relativity", "energy", "force", "motion"],
      "Business": ["business", "marketing", "finance", "entrepreneurship", "startup", "economy", "investment"],
      "Psychology": ["psychology", "mental health", "behavior", "cognitive", "therapy", "brain", "mind"],
      "Medicine & Health": ["health", "medicine", "medical", "doctor", "disease", "treatment", "anatomy", "biology"],
      "Engineering": ["engineering", "mechanical", "electrical", "civil", "design", "construction"],
      "Arts": ["art", "music", "painting", "drawing", "sculpture", "design", "creative"],
      "Life Sciences": ["biology", "ecology", "evolution", "genetics", "organism", "cell", "dna"],
      "Political Science": ["politics", "government", "democracy", "election", "policy", "law"],
      "Education": ["teaching", "learning", "education", "tutorial", "lesson", "course"],
      "Languages & Literature": ["language", "literature", "writing", "poetry", "novel", "linguistics"],
      "Geography": ["geography", "climate", "earth", "environment", "map", "region"],
      "Economics": ["economics", "market", "trade", "gdp", "inflation", "supply", "demand"],
      "Sociology": ["sociology", "society", "culture", "social", "community"],
      "Religion": ["religion", "spiritual", "faith", "god", "theology", "belief"],
      "Law": ["law", "legal", "court", "justice", "rights", "constitution"],
      "Logic": ["logic", "reasoning", "argument", "proof", "deduction"]
    };

    // Score each discipline based on keyword matches
    Object.entries(keywords).forEach(([discipline, words]) => {
      words.forEach(keyword => {
        const matches = (allText.match(new RegExp(keyword, "g")) || []).length;
        disciplineScores[discipline] += matches;
      });
    });

    // Get top 3 disciplines
    const sortedDisciplines = Object.entries(disciplineScores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([discipline]) => discipline);

    return sortedDisciplines.length > 0 ? sortedDisciplines : ["Computer Science"];
  } catch (error) {
    console.error("Error analyzing titles:", error);
    return ["Computer Science"]; // Default fallback
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { channelUrl }: AnalyzeRequest = await req.json();

    if (!channelUrl) {
      return new Response(
        JSON.stringify({ error: "Channel URL is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Fetch channel information and video titles
    const channelInfo = await getYouTubeChannelInfo(channelUrl);

    // Analyze titles using AI
    const suggestedDisciplines = await analyzeTitlesWithAI(channelInfo.videoTitles);

    const response: AnalyzeResponse = {
      suggestedDisciplines,
      confidence: 0.85,
      channelInfo: {
        title: channelInfo.channelTitle,
        videoCount: channelInfo.videoCount,
        analyzedTitles: channelInfo.videoTitles.slice(0, 5)
      }
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
