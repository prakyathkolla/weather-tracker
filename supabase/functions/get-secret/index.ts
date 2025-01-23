import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Ensure the request is a POST request
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Parse the request body
    const { name } = await req.json()
    
    if (!name) {
      throw new Error('Secret name is required')
    }

    // Get the secret value
    const value = Deno.env.get(name)
    console.log(`Attempting to fetch secret: ${name}`)

    if (!value) {
      console.error(`Secret ${name} not found`)
      throw new Error(`Secret ${name} not found`)
    }

    console.log(`Successfully retrieved secret: ${name}`)
    
    // Return the secret value
    return new Response(
      JSON.stringify({ [name]: value }),
      { 
        headers: corsHeaders,
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in get-secret function:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error occurred while fetching secret'
      }),
      { 
        headers: corsHeaders,
        status: 400
      }
    )
  }
})