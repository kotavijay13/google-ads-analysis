
import { RequestBody } from './types.ts';

export const parseRequestBody = async (req: Request): Promise<RequestBody> => {
  try {
    const contentType = req.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    let requestBody: any;
    
    if (contentType && contentType.includes('application/json')) {
      requestBody = await req.json();
    } else {
      // Try to read as text first
      const bodyText = await req.text();
      console.log('Raw body text:', bodyText);
      
      if (bodyText) {
        try {
          requestBody = JSON.parse(bodyText);
        } catch (parseError) {
          console.error('Failed to parse body as JSON:', parseError);
          throw new Error('Invalid JSON format');
        }
      } else {
        throw new Error('Empty request body');
      }
    }
    
    console.log('Parsed request body:', requestBody);
    return requestBody;
  } catch (error) {
    console.error('Error parsing request body:', error);
    throw new Error(`Request parsing failed: ${error.message}`);
  }
};

export const validateRequestBody = (requestBody: any): void => {
  const { urls } = requestBody;
  
  if (!urls || !Array.isArray(urls)) {
    console.error('Invalid urls parameter:', urls);
    throw new Error('URLs array is required');
  }
};
