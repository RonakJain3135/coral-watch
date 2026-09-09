import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting debris detection...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('File received:', file.name, file.type);
    
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log('Calling Gradio API endpoint...');
    
    // Step 1: Call the predict endpoint to get event_id
    const callResponse = await fetch('https://degree-checker-01-pccoe-debris-detection.hf.space/call/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [dataUrl]
      }),
    });

    if (!callResponse.ok) {
      const errorText = await callResponse.text();
      console.error('Gradio call error:', callResponse.status, callResponse.statusText, errorText);
      throw new Error(`API call failed: ${callResponse.statusText}`);
    }

    const callData = await callResponse.json();
    const eventId = callData.event_id;
    
    if (!eventId) {
      throw new Error('No event_id returned from API');
    }

    console.log('Got event_id:', eventId, 'Now polling for results...');

    // Step 2: Poll the status endpoint for results
    const statusUrl = `https://degree-checker-01-pccoe-debris-detection.hf.space/call/predict/${eventId}`;
    
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between polls
      
      const statusResponse = await fetch(statusUrl);
      
      if (!statusResponse.ok) {
        console.error('Status poll error:', statusResponse.status);
        attempts++;
        continue;
      }

      const reader = statusResponse.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No response body');
      }

      let result = null;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.msg === 'process_completed') {
                result = data.output;
                break;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
        
        if (result) break;
      }
      
      if (result) {
        console.log('Detection complete!');
        return new Response(JSON.stringify({ data: result }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      attempts++;
    }

    throw new Error('Timeout waiting for results');

  } catch (error) {
    console.error('Error in detect-debris function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
