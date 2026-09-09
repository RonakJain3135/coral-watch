import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting coral health analysis...');

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      throw new Error('No file provided');
    }

    console.log('File received, sending to Hugging Face API...');

    // Create new FormData for the external API
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    const response = await fetch('https://coraldetection.onrender.com/predict', {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      console.error('Hugging Face API error:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Analysis complete, returning results');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-coral-health function:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
