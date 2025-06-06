
export interface WebsiteForm {
  id: string;
  name: string;
  url: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

export interface FieldMapping {
  websiteField: string;
  leadField: string;
}

export const leadFormFields = [
  'name',
  'firstName',
  'lastName', 
  'email',
  'phone',
  'company',
  'message',
  'source',
  'campaign'
];
