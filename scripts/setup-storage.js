const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase storage...');
    
    // Create bucket for product images
    const { data: bucket, error: bucketError } = await supabase.storage
      .createBucket('product-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
    
    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✓ Bucket "product-images" already exists');
      } else {
        console.error('Error creating bucket:', bucketError);
        return false;
      }
    } else {
      console.log('✓ Created bucket "product-images"');
    }
    
    // Test bucket access
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    console.log('✓ Available buckets:', buckets.map(b => b.name));
    
    return true;
  } catch (error) {
    console.error('Storage setup error:', error);
    return false;
  }
}

// Run the setup
setupStorage().then(success => {
  if (success) {
    console.log('\n✅ Storage setup completed successfully!');
    console.log('You can now run the product import script.');
  } else {
    console.log('\n❌ Storage setup failed!');
    process.exit(1);
  }
}).catch(console.error);