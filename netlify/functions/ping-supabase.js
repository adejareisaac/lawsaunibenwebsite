// Ping function to keep Supabase project active
// Runs every 3 days via Netlify scheduled trigger

exports.handler = async (event) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Missing Supabase environment variables',
        }),
      };
    }

    // Query any table (using information_schema as a safe fallback)
    // If you have a specific table, replace the query
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/information_schema.tables?limit=1`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status}`);
    }

    const data = await response.json();

    console.log('Supabase ping successful', {
      timestamp: new Date().toISOString(),
      status: response.status,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Supabase database pinged successfully',
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Supabase ping failed:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to ping Supabase',
        message: error.message,
      }),
    };
  }
};
