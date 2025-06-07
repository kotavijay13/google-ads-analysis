
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== WEBHOOK REQUEST RECEIVED ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Supabase URL available:', !!supabaseUrl)
    console.log('Service Role Key available:', !!supabaseKey)
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('=== PROCESSING REQUEST BODY ===')
    
    const requestBody = await req.text()
    console.log('Raw request body length:', requestBody.length)
    console.log('Raw request body:', requestBody)
    
    let parsedBody
    try {
      parsedBody = JSON.parse(requestBody)
      console.log('Parsed body:', JSON.stringify(parsedBody, null, 2))
    } catch (error) {
      console.error('Error parsing JSON:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', received: requestBody }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { formId, formData, websiteUrl } = parsedBody
    
    console.log('=== EXTRACTED DATA ===')
    console.log('Form ID:', formId)
    console.log('Form Data:', JSON.stringify(formData, null, 2))
    console.log('Website URL:', websiteUrl)

    if (!formId) {
      console.error('Missing formId in request')
      return new Response(
        JSON.stringify({ error: 'Missing formId', received: parsedBody }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!formData) {
      console.error('Missing formData in request')
      return new Response(
        JSON.stringify({ error: 'Missing formData', received: parsedBody }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find the connected form configuration
    console.log('=== LOOKING UP CONNECTED FORM ===')
    console.log('Searching for form_id:', formId)
    
    const { data: connectedForm, error: formError } = await supabase
      .from('connected_forms')
      .select('*')
      .eq('form_id', formId)
      .maybeSingle()

    console.log('Connected form query result:', { data: connectedForm, error: formError })

    if (formError) {
      console.error('Database error when looking up form:', formError)
      return new Response(
        JSON.stringify({ error: 'Database error', details: formError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!connectedForm) {
      console.error('No connected form found for form_id:', formId)
      
      // Let's also check what forms are available
      const { data: allForms, error: allFormsError } = await supabase
        .from('connected_forms')
        .select('form_id, form_name')
      
      console.log('Available connected forms:', allForms, 'Error:', allFormsError)
      
      return new Response(
        JSON.stringify({ 
          error: 'Form not found', 
          requestedFormId: formId,
          availableForms: allForms || []
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('=== FOUND CONNECTED FORM ===')
    console.log('Connected form:', JSON.stringify(connectedForm, null, 2))

    // Map form data according to field mappings
    const fieldMappings = connectedForm.field_mappings as Array<{
      websiteField: string;
      leadField: string;
    }>
    
    console.log('=== FIELD MAPPINGS ===')
    console.log('Field mappings:', JSON.stringify(fieldMappings, null, 2))
    
    const leadData: any = {
      user_id: connectedForm.user_id,
      form_id: formId,
      source: 'website_form',
      raw_data: formData,
      status: 'New'
    }

    console.log('=== APPLYING FIELD MAPPINGS ===')
    // Apply field mappings
    fieldMappings.forEach(mapping => {
      if (mapping.leadField && mapping.leadField !== 'none' && formData[mapping.websiteField]) {
        leadData[mapping.leadField] = formData[mapping.websiteField]
        console.log(`Mapped ${mapping.websiteField} -> ${mapping.leadField}: ${formData[mapping.websiteField]}`)
      }
    })

    console.log('=== FINAL LEAD DATA ===')
    console.log('Lead data to insert:', JSON.stringify(leadData, null, 2))

    // Insert the lead
    console.log('=== INSERTING LEAD ===')
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()

    if (leadError) {
      console.error('Error saving lead:', leadError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save lead', 
          details: leadError.message,
          leadData: leadData
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('=== SUCCESS ===')
    console.log('Lead saved successfully:', JSON.stringify(lead, null, 2))

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadId: lead.id,
        message: 'Lead captured successfully',
        leadData: lead
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('=== UNEXPECTED ERROR ===')
    console.error('Error processing form submission:', error)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
