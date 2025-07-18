-- Insert sample products for testing
INSERT INTO products (
  id,
  name,
  description,
  slug,
  price,
  compare_price,
  sku,
  inventory_quantity,
  weight,
  dimensions,
  age_min,
  age_max,
  material,
  safety_certifications,
  images,
  category_id,
  subcategory,
  assembly_required,
  care_instructions,
  shipping_cost_eu,
  shipping_time,
  specifications
) VALUES

-- Pikler Triangle (First Steps category)
(
  '11111111-1111-1111-1111-111111111111',
  '{"sk": "Pikler Trojuholník", "en": "Pikler Triangle", "de": "Pikler Dreieck", "fr": "Triangle Pikler"}',
  '{"sk": "Klasický lezecký trojuholník podľa Montessori princípov. Podporuje prirodzený motorický vývoj detí od 10 mesiacov.", "en": "Classic climbing triangle following Montessori principles. Supports natural motor development of children from 10 months.", "de": "Klassisches Kletterdreieck nach Montessori-Prinzipien. Unterstützt die natürliche motorische Entwicklung von Kindern ab 10 Monaten.", "fr": "Triangle d\'escalade classique selon les principes Montessori. Soutient le développement moteur naturel des enfants à partir de 10 mois."}',
  'pikler-triangle',
  189.99,
  219.99,
  'PK-TRI-001',
  15,
  8.5,
  '{"length": 82, "width": 70, "height": 75}',
  10,
  60,
  'Bukové drevo',
  ARRAY['CE', 'EN-71', 'TÜV'],
  ARRAY['/images/placeholder-product.jpg', '/images/placeholder-product.jpg', '/images/placeholder-product.jpg'],
  '11111111-1111-1111-1111-111111111111',
  'climbing-triangles',
  true,
  'Utrite vlhkou handričkou, vyhýbajte sa chemickým čistiacim prostriedkom',
  4.99,
  '2-4 pracovné dni',
  '{"max_weight": 60, "adjustable_height": true, "foldable": true}'
),

-- Balance Board (Brave Explorers category)
(
  '22222222-2222-2222-2222-222222222222',
  '{"sk": "Balančná Doska", "en": "Balance Board", "de": "Balance Board", "fr": "Planche d\'équilibre"}',
  '{"sk": "Wobble board pre rozvoj rovnováhy a koordinácie. Ideálne pre aktívne deti od 18 mesiacov.", "en": "Wobble board for balance and coordination development. Perfect for active children from 18 months.", "de": "Wobble Board für die Entwicklung von Gleichgewicht und Koordination. Ideal für aktive Kinder ab 18 Monaten.", "fr": "Planche d\'équilibre pour le développement de l\'équilibre et de la coordination. Parfait pour les enfants actifs à partir de 18 mois."}',
  'balance-board',
  79.99,
  89.99,
  'BB-001',
  25,
  3.2,
  '{"length": 80, "width": 30, "height": 15}',
  18,
  72,
  'Bukové drevo s protišmykovým povrchom',
  ARRAY['CE', 'EN-71'],
  ARRAY['/images/placeholder-product.jpg', '/images/placeholder-product.jpg'],
  '22222222-2222-2222-2222-222222222222',
  'balance-boards',
  false,
  'Pravidelne kontrolujte opotrebenie, čistite suchou handričkou',
  3.99,
  '1-3 pracovné dni',
  '{"max_weight": 100, "curved_bottom": true, "non_slip_surface": true}'
),

-- Learning Tower (Confident Climbers category)
(
  '33333333-3333-3333-3333-333333333333',
  '{"sk": "Učiaca Veža", "en": "Learning Tower", "de": "Lernturm", "fr": "Tour d\'apprentissage"}',
  '{"sk": "Montessori veža pre nezávislé učenie v kuchyni. Bezpečná platforma pre deti od 12 mesiacov.", "en": "Montessori tower for independent learning in the kitchen. Safe platform for children from 12 months.", "de": "Montessori-Turm für selbstständiges Lernen in der Küche. Sichere Plattform für Kinder ab 12 Monaten.", "fr": "Tour Montessori pour l\'apprentissage indépendant dans la cuisine. Plateforme sûre pour les enfants à partir de 12 mois."}',
  'learning-tower',
  159.99,
  179.99,
  'LT-001',
  12,
  12.5,
  '{"length": 40, "width": 40, "height": 90}',
  12,
  60,
  'Borovicové drevo',
  ARRAY['CE', 'EN-71', 'FSC'],
  ARRAY['/images/placeholder-product.jpg', '/images/placeholder-product.jpg', '/images/placeholder-product.jpg'],
  '33333333-3333-3333-3333-333333333333',
  'learning-towers',
  true,
  'Pravidelne kontrolujte utiahnutie skrutiek, čistite vlhkou handričkou',
  5.99,
  '3-5 pracovných dní',
  '{"adjustable_platform": true, "safety_rail": true, "max_weight": 50}'
),

-- Climbing Frame (Confident Climbers category)
(
  '44444444-4444-4444-4444-444444444444',
  '{"sk": "Lezecká Konštrukcia", "en": "Climbing Frame", "de": "Klettergerüst", "fr": "Structure d\'escalade"}',
  '{"sk": "Kompletná lezecká konštrukcia pre domáce použitie. Rozvíja silu, koordináciu a odvahu.", "en": "Complete climbing structure for home use. Develops strength, coordination and courage.", "de": "Komplette Kletterstruktur für den Hausgebrauch. Entwickelt Kraft, Koordination und Mut.", "fr": "Structure d\'escalade complète pour usage domestique. Développe la force, la coordination et le courage."}',
  'climbing-frame',
  299.99,
  349.99,
  'CF-001',
  8,
  18.0,
  '{"length": 120, "width": 60, "height": 100}',
  24,
  84,
  'Bukové a borovicové drevo',
  ARRAY['CE', 'EN-71', 'TÜV', 'FSC'],
  ARRAY['/images/placeholder-product.jpg', '/images/placeholder-product.jpg', '/images/placeholder-product.jpg', '/images/placeholder-product.jpg'],
  '33333333-3333-3333-3333-333333333333',
  'complete-climbing-sets',
  true,
  'Pravidelne kontrolujte všetky spojenia, ošetrite olejom 2x ročne',
  9.99,
  '5-7 pracovných dní',
  '{"modular_design": true, "max_weight": 80, "indoor_outdoor": true}'
),

-- Children's Chair (Creative Spaces category)
(
  '55555555-5555-5555-5555-555555555555',
  '{"sk": "Detská Stolička", "en": "Children\'s Chair", "de": "Kinderstuhl", "fr": "Chaise pour enfants"}',
  '{"sk": "Ergonomická detská stolička v štýle Montessori. Podporuje správne držanie tela a nezávislé sedenie.", "en": "Ergonomic children\'s chair in Montessori style. Supports proper posture and independent sitting.", "de": "Ergonomischer Kinderstuhl im Montessori-Stil. Unterstützt die richtige Körperhaltung und selbstständiges Sitzen.", "fr": "Chaise ergonomique pour enfants de style Montessori. Favorise une bonne posture et une assise indépendante."}',
  'childrens-chair',
  49.99,
  59.99,
  'CC-001',
  30,
  2.8,
  '{"length": 28, "width": 28, "height": 48}',
  12,
  72,
  'Bukové drevo',
  ARRAY['CE', 'EN-71'],
  ARRAY['/images/placeholder-product.jpg', '/images/placeholder-product.jpg'],
  '44444444-4444-4444-4444-444444444444',
  'childrens-furniture',
  false,
  'Čistite vlhkou handričkou, pravidelne kontrolujte stabilitu',
  2.99,
  '1-2 pracovné dni',
  '{"stackable": true, "rounded_edges": true, "lightweight": true}'
),

-- Growth Set (Growing Together category)
(
  '66666666-6666-6666-6666-666666666666',
  '{"sk": "Rastúci Set", "en": "Growing Set", "de": "Wachstumsset", "fr": "Ensemble évolutif"}',
  '{"sk": "Modulárny set ktorý rastie s vaším dieťaťom. Obsahuje rôzne komponenty pre vekové kategórie 6-60 mesiacov.", "en": "Modular set that grows with your child. Contains various components for age groups 6-60 months.", "de": "Modulares Set, das mit Ihrem Kind mitwächst. Enthält verschiedene Komponenten für Altersgruppen von 6-60 Monaten.", "fr": "Ensemble modulaire qui grandit avec votre enfant. Contient divers composants pour les groupes d\'âge de 6 à 60 mois."}',
  'growth-set',
  399.99,
  459.99,
  'GS-001',
  5,
  25.0,
  '{"length": 150, "width": 80, "height": 120}',
  6,
  60,
  'Bukové drevo s prírodnými olejmi',
  ARRAY['CE', 'EN-71', 'TÜV', 'FSC'],
  ARRAY['/images/placeholder-product.jpg', '/images/placeholder-product.jpg', '/images/placeholder-product.jpg', '/images/placeholder-product.jpg'],
  '55555555-5555-5555-5555-555555555555',
  'modular-sets',
  true,
  'Pravidelná údržba podľa priložených pokynov, kontrola spojení každé 3 mesiace',
  12.99,
  '7-10 pracovných dní',
  '{"expandable": true, "age_adaptable": true, "max_weight": 100, "components": 8}'
);

-- Update inventory counts
UPDATE products SET inventory_quantity = 
  CASE 
    WHEN price < 100 THEN 20 + (RANDOM() * 30)::INTEGER
    WHEN price < 200 THEN 10 + (RANDOM() * 20)::INTEGER
    ELSE 5 + (RANDOM() * 10)::INTEGER
  END
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666'
);