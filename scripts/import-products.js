const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to download image from URL
async function downloadImage(url, filename) {
  if (!url) return null;
  
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
      } else {
        console.warn(`Failed to download image: ${url} - Status: ${response.statusCode}`);
        resolve(null);
      }
    }).on('error', (err) => {
      console.warn(`Error downloading image: ${url} - ${err.message}`);
      resolve(null);
    });
  });
}

// Function to upload image to Supabase Storage
async function uploadImageToSupabase(imageBuffer, filename) {
  if (!imageBuffer) return null;
  
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename);
    
    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

// Function to process and upload images
async function processProductImages(productId, imageUrls) {
  const uploadedImages = [];
  
  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];
    if (!imageUrl) continue;
    
    console.log(`Processing image ${i + 1} for product ${productId}: ${imageUrl}`);
    
    try {
      // Download image
      const imageBuffer = await downloadImage(imageUrl, `${productId}_${i + 1}.jpg`);
      
      if (imageBuffer) {
        // Upload to Supabase
        const filename = `${productId}_${i + 1}.jpg`;
        const publicUrl = await uploadImageToSupabase(imageBuffer, filename);
        
        if (publicUrl) {
          uploadedImages.push(publicUrl);
          console.log(`✓ Uploaded image ${i + 1} for ${productId}`);
        }
      }
    } catch (error) {
      console.error(`Error processing image ${i + 1} for ${productId}:`, error);
    }
  }
  
  return uploadedImages;
}

// Function to create multilingual content
function createMultilingualContent(text, productId) {
  if (!text) return null;
  
  // For now, we'll use the same text for all languages
  // In production, you might want to translate these
  return {
    sk: text,
    en: text,
    de: text,
    fr: text
  };
}

// Function to insert product into database
async function insertProduct(productData) {
  try {
    console.log(`Inserting product: ${productData.name}`);
    
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();
    
    if (error) {
      console.error('Database insert error:', error);
      return null;
    }
    
    console.log(`✓ Successfully inserted product: ${productData.name}`);
    return data[0];
  } catch (error) {
    console.error('Insert error:', error);
    return null;
  }
}

// Main function to process CSV and import products
async function importProducts() {
  const csvFilePath = '/Users/nkovalcin/desktop/projects/faborino/faborino-docs/182_product_faborino.csv';
  
  if (!fs.existsSync(csvFilePath)) {
    console.error('CSV file not found:', csvFilePath);
    return;
  }
  
  console.log('Starting product import...');
  console.log('Reading CSV file:', csvFilePath);
  
  const products = [];
  
  // Read CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      products.push(row);
    })
    .on('end', async () => {
      console.log(`Found ${products.length} products in CSV`);
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(`\nProcessing product ${i + 1}/${products.length}: ${product.name}`);
        
        try {
          // Extract image URLs
          const imageUrls = [
            product.image_1,
            product.image_2,
            product.image_3,
            product.image_4,
            product.image_5
          ].filter(Boolean);
          
          // Process and upload images
          const uploadedImages = await processProductImages(product.product_id, imageUrls);
          
          // Parse specifications JSON
          let specifications = null;
          if (product.specifications_json) {
            try {
              specifications = JSON.parse(product.specifications_json);
            } catch (e) {
              console.warn('Failed to parse specifications JSON:', product.specifications_json);
            }
          }
          
          // Create product data for database
          const productData = {
            id: product.product_id,
            name: createMultilingualContent(product.name, product.product_id),
            description: createMultilingualContent(product.description, product.product_id),
            price: parseFloat(product.price) || 0,
            original_price: parseFloat(product.original_price) || null,
            currency: product.currency || 'EUR',
            sku: product.sku,
            category: product.category,
            subcategory: product.subcategory,
            age_min: parseInt(product.age_min) || 0,
            age_max: parseInt(product.age_max) || 999,
            materials: product.materials,
            dimensions: {
              length: parseFloat(product.dimensions_length) || null,
              width: parseFloat(product.dimensions_width) || null,
              height: parseFloat(product.dimensions_height) || null
            },
            weight: parseFloat(product.weight) || null,
            safety_certifications: product.safety_certifications,
            assembly_required: product.assembly_required === 'Yes',
            care_instructions: product.care_instructions,
            stock_status: product.stock_status,
            inventory_quantity: product.stock_status === 'In Stock' ? 10 : 0,
            shipping_cost_eu: parseFloat(product.shipping_cost_eu) || 0,
            shipping_time: product.shipping_time,
            product_url: product.product_url,
            specifications: specifications,
            images: uploadedImages,
            slug: product.product_id.toLowerCase().replace(/_/g, '-'),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Insert product into database
          await insertProduct(productData);
          
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`Error processing product ${product.name}:`, error);
        }
      }
      
      console.log('\n✅ Product import completed!');
    });
}

// Run the import
importProducts().catch(console.error);