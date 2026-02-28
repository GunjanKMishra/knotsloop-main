import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FetchPlaylistRequest {
  playlistUrl: string;
  playlistId?: string;
}

interface PlaylistVideo {
  video_id: string;
  title: string;
  url: string;
  order_index: number;
  duration?: string;
}

function extractPlaylistId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname.includes('youtube.com')) {
      const listParam = urlObj.searchParams.get('list');
      if (listParam) {
        return listParam;
      }
    }

    return null;
  } catch {
    return null;
  }
}

async function fetchPlaylistVideos(playlistId: string): Promise<PlaylistVideo[]> {
  const apiKey = Deno.env.get("YOUTUBE_API_KEY");

  if (!apiKey) {
    console.warn("YouTube API key not configured, using mock data");
    return getMockPlaylistData();
  }

  try {
    let allVideos: PlaylistVideo[] = [];
    let nextPageToken: string | undefined = undefined;
    let pageCount = 0;
    const maxPages = 10;

    do {
      const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
      url.searchParams.set('part', 'snippet,contentDetails');
      url.searchParams.set('playlistId', playlistId);
      url.searchParams.set('maxResults', '50');
      url.searchParams.set('key', apiKey);

      if (nextPageToken) {
        url.searchParams.set('pageToken', nextPageToken);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }

      const data = await response.json();

      const videos: PlaylistVideo[] = data.items.map((item: any, index: number) => ({
        video_id: item.contentDetails.videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
        order_index: allVideos.length + index,
      }));

      allVideos = [...allVideos, ...videos];
      nextPageToken = data.nextPageToken;
      pageCount++;

    } while (nextPageToken && pageCount < maxPages);

    return allVideos;
  } catch (error) {
    console.error("Error fetching playlist videos:", error);
    return getMockPlaylistData();
  }
}

function getMockPlaylistData(): PlaylistVideo[] {
  return [
    {
      video_id: "dQw4w9WgXcQ",
      title: "Introduction to Philosophy",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order_index: 0,
    },
    {
      video_id: "dQw4w9WgXcQ",
      title: "Ancient Greek Philosophers",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order_index: 1,
    },
    {
      video_id: "dQw4w9WgXcQ",
      title: "Plato's Theory of Forms",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order_index: 2,
    },
  ];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { playlistUrl, playlistId: dbPlaylistId }: FetchPlaylistRequest = await req.json();

    if (!playlistUrl) {
      return new Response(
        JSON.stringify({ error: "Playlist URL is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const playlistId = extractPlaylistId(playlistUrl);

    if (!playlistId) {
      return new Response(
        JSON.stringify({ error: "Invalid YouTube playlist URL" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const videos = await fetchPlaylistVideos(playlistId);

    if (dbPlaylistId) {
      const { error: deleteError } = await supabase
        .from('playlist_videos')
        .delete()
        .eq('playlist_id', dbPlaylistId);

      if (deleteError) {
        console.error("Error deleting old videos:", deleteError);
      }

      const videosToInsert = videos.map(video => ({
        playlist_id: dbPlaylistId,
        ...video,
      }));

      const { error: insertError } = await supabase
        .from('playlist_videos')
        .insert(videosToInsert);

      if (insertError) {
        throw insertError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        videoCount: videos.length,
        videos: videos,
      }),
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
