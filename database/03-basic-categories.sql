-- Step 3: Insert basic categories
INSERT INTO categories (id, name, description, slug, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 
   '{"sk": "Prvé kroky", "en": "First Steps", "de": "Erste Schritte", "fr": "Premiers pas"}',
   '{"sk": "Perfektné pre bábätká a batoľatá", "en": "Perfect for babies and toddlers", "de": "Perfekt für Babys und Kleinkinder", "fr": "Parfait pour les bébés et les tout-petits"}',
   'first-steps', 1),
  ('22222222-2222-2222-2222-222222222222',
   '{"sk": "Odvážni prieskumníci", "en": "Brave Explorers", "de": "Mutige Entdecker", "fr": "Explorateurs courageux"}',
   '{"sk": "Pre batoľatá pripravené liezť a objavovať", "en": "For toddlers ready to climb and explore", "de": "Für Kleinkinder, die bereit sind zu klettern und zu erforschen", "fr": "Pour les tout-petits prêts à grimper et explorer"}',
   'brave-explorers', 2),
  ('33333333-3333-3333-3333-333333333333',
   '{"sk": "Sebavedomí lezci", "en": "Confident Climbers", "de": "Selbstbewusste Kletterer", "fr": "Grimpeurs confiants"}',
   '{"sk": "Pokročilé lezecké vybavenie", "en": "Advanced climbing equipment", "de": "Fortgeschrittene Kletterausrüstung", "fr": "Équipement escalade avancé"}',
   'confident-climbers', 3),
  ('44444444-4444-4444-4444-444444444444',
   '{"sk": "Kreatívne priestory", "en": "Creative Spaces", "de": "Kreative Räume", "fr": "Espaces créatifs"}',
   '{"sk": "Nábytok a doplnky pre tvorivú hru", "en": "Furniture and accessories for creative play", "de": "Möbel und Zubehör für kreatives Spiel", "fr": "Meubles et accessoires pour le jeu créatif"}',
   'creative-spaces', 4),
  ('55555555-5555-5555-5555-555555555555',
   '{"sk": "Spoločný rast", "en": "Growing Together", "de": "Gemeinsam wachsen", "fr": "Grandir ensemble"}',
   '{"sk": "Modulárne sady rastúce s dieťaťom", "en": "Modular sets that grow with your child", "de": "Modulare Sets, die mit Ihrem Kind mitwachsen", "fr": "Ensembles modulaires qui grandissent avec votre enfant"}',
   'growing-together', 5);