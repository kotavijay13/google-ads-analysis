
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Webhook triggered, processing request...')
    
    const requestBody = await req.text()
    console.log('Raw request body:', requestBody)
    
    let parsedBody
    try {
      parsedBody = JSON.parse(requestBody)
    } catch (error) {
      console.error('Error parsing JSON:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { formId, formData, websiteUrl } = parsedBody
    
    console.log('Received form submission:', { formId, formData, websiteUrl })

    if (!formId) {
      console.error('Missing formId in request')
      return new Response(
        JSON.stringify({ error: 'Missing formId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!formData) {
      console.error('Missing formData in request')
      return new Response(
        JSON.stringify({ error: 'Missing formData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find the connected form configuration
    console.log('Looking for connected form with ID:', formId)
    const { data: connectedForm, error: formError } = await supabase
      .from('connected_forms')
      .select('*')
      .eq('form_id', formId)
      .single()

    if (formError || !connectedForm) {
      console.error('Form not found:', formError)
      return new Response(
        JSON.stringify({ error: 'Form not found', details: formError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Found connected form:', connectedForm)

    // Map form data according to field mappings
    const fieldMappings = connectedForm.field_mappings as Array<{
      websiteField: string;
      leadField: string;
    }>
    
    console.log('Field mappings:', fieldMappings)
    
    const leadData: any = {
      user_id: connectedForm.user_id,
      form_id: formId,
      source: 'website_form',
      raw_data: formData,
      status: 'New'
    }

    // Apply field mappings
    fieldMappings.forEach(mapping => {
      if (mapping.leadField && mapping.leadField !== 'none' && formData[mapping.websiteField]) {
        leadData[mapping.leadField] = formData[mapping.websiteField]
        console.log(`Mapped ${mapping.websiteField} -> ${mapping.leadField}: ${formData[mapping.websiteField]}`)
      }
    })

    console.log('Final lead data to insert:', leadData)

    // Insert the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()

    if (leadError) {
      console.error('Error saving lead:', leadError)
      return new Response(
        JSON.stringify({ error: 'Failed to save lead', details: leadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Lead saved successfully:', lead)

    return new Response(
      JSON.stringify({ success: true, leadId: lead.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing form submission:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
