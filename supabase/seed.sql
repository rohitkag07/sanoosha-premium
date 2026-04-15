-- Seed Rudraksha products (prices in paise)
insert into public.products (name, slug, description, price, compare_price, category, images, in_stock, featured) values

('Nepal Origin 1 Mukhi Rudraksha', '1-mukhi-rudraksha',
 'Supreme consciousness · Liberation · Divine Power. The rarest of all Rudraksha, directly linked to Lord Shiva. Hand-picked from Nepal, lab certified, and ritually energised.',
 2100000, 3000000, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/Gemini_Generated_Image_w7sdvuw7sdvuw7sd-600x600.png'],
 true, true),

('Nepal Origin 2 Mukhi Rudraksha', '2-mukhi-rudraksha',
 'Harmony · Relationships · Emotional balance. Represents the union of Shiva and Shakti. Brings harmony to relationships and emotional wellbeing.',
 1600000, 2400000, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_26_f2dcd5ce-8865-4601-a04b-6be99e40c69b-600x600.webp'],
 true, true),

('Nepal Origin 3 Mukhi Rudraksha', '3-mukhi-rudraksha',
 'Confidence · Self-Power · Agni energy. Ruled by Agni (fire), this bead instils confidence and inner strength.',
 699900, 1499900, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_4_aa2b33b1-261c-4143-aa6e-e44c4d0159cd-600x600.webp'],
 true, true),

('Nepal Origin 4 Mukhi Rudraksha', '4-mukhi-rudraksha',
 'Knowledge · Wisdom · Creative intelligence. Blessed by Brahma, the creator. Enhances memory, knowledge, and creative intelligence.',
 479900, 879900, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_5_c47c2ab4-a22e-40e6-8e7a-580a0b740b37-600x600.webp'],
 true, false),

('Nepal Origin 5 Mukhi Rudraksha', '5-mukhi-rudraksha',
 'Health · Peace · Spiritual awakening. The most common and powerful Rudraksha, ruled by Lord Shiva himself. Promotes health, peace, and spiritual growth.',
 219900, 439900, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_6-600x600.webp'],
 true, true),

('Nepal Origin 6 Mukhi Rudraksha', '6-mukhi-rudraksha',
 'Will power · Focus · Mental strength. Blessed by Kartikeya, the god of war. Builds will power, focus, and mental resilience.',
 599900, 899900, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_7-600x600.webp'],
 true, false),

('Nepal Origin 7 Mukhi Rudraksha', '7-mukhi-rudraksha',
 'Luck · Prosperity · Financial growth. Blessed by Mahalakshmi, the goddess of wealth. Attracts luck, prosperity, and financial abundance.',
 0, null, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/7MukhiBead-600x600.webp'],
 true, false),

('Nepal Origin 8 Mukhi Rudraksha', '8-mukhi-rudraksha',
 'Remove obstacles · Success · New beginnings. Blessed by Lord Ganesha. Removes all obstacles and opens the path to success.',
 0, null, 'rudraksha',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_9-600x600.webp'],
 true, false);

-- Seed Crystal Bracelets
insert into public.products (name, slug, description, price, compare_price, category, images, in_stock, featured) values

('Rudraksha Charm Bracelet', 'rudraksha-charm-bracelet',
 'Authentic Rudraksha beads strung together in a stylish bracelet. Combines spiritual energy with everyday wearability. Pre-energised with Vedic mantras.',
 149900, 209900, 'crystal',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/DEF4C7C7-E0F3-4EA6-8656-F2009E742EA4-600x600.png'],
 true, true),

('Black Obsidian Bracelet', 'black-obsidian-bracelet',
 'Natural Black Obsidian crystal bracelet for protection and grounding. Shields against negativity and promotes emotional healing.',
 89900, 129900, 'crystal',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-03-at-10.30.16-600x600.jpeg'],
 true, true),

('Clear Quartz Crystal Bracelet', 'clear-quartz-bracelet',
 'Master healer crystal bracelet. Amplifies energy and intention, promotes clarity of thought and spiritual connection.',
 64900, null, 'crystal',
 ARRAY['https://sanoosha.com/wp-content/uploads/2025/11/11-600x600.jpg'],
 true, false),

('Seven Chakra Bracelet', 'seven-chakra-bracelet',
 'Balance all seven chakras with this beautiful bracelet featuring 7 different natural healing crystals. Perfect for daily wear and meditation.',
 64900, null, 'crystal',
 ARRAY['https://sanoosha.com/wp-content/uploads/2026/03/1_9-600x600.webp'],
 true, true);
