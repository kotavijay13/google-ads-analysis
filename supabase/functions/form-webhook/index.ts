
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { formId, formData, websiteUrl } = await req.json()
    
    console.log('Received form submission:', { formId, formData, websiteUrl })

    // Find the connected form configuration
    const { data: connectedForm, error: formError } = await supabase
      .from('connected_forms')
      .select('*')
      .eq('form_id', formId)
      .single()

    if (formError || !connectedForm) {
      console.error('Form not found:', formError)
      return new Response(
        JSON.stringify({ error: 'Form not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Map form data according to field mappings
    const fieldMappings = connectedForm.field_mappings as Array<{
      websiteField: string;
      leadField: string;
    }>
    
    const leadData: any = {
      user_id: connectedForm.user_id,
      form_id: formId,
      source: 'website_form',
      raw_data: formData
    }

    // Apply field mappings
    fieldMappings.forEach(mapping => {
      if (mapping.leadField && mapping.leadField !== 'none' && formData[mapping.websiteField]) {
        leadData[mapping.leadField] = formData[mapping.websiteField]
      }
    })

    // Insert the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()

    if (leadError) {
      console.error('Error saving lead:', leadError)
      return new Response(
        JSON.stringify({ error: 'Failed to save lead' }),
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
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
