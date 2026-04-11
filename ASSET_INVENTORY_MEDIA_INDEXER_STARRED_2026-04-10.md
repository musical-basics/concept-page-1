# DreamPlay Media Indexer — Starred Images Pull

Source
- UI: https://dreamplay-media-indexer.vercel.app/
- API: `GET /api/v1/assets?starred=true&mediaType=image&limit=1000`

Result
- Starred image assets found: 13
- Downloaded into: `public/assets/dreamplay/media-indexer-starred/`

Highest-value starred assets for immediate shop/fidelity use
1. `Piano-Bench-Frontal-Bundle.png`
   - Wide studio product/bundle shot on white
   - Strong fit for bundle page, shop promos, accessory sections

2. `Piano-Front-2.jpg`
   - Clean front product shot
   - Strong fit for hero/product modules

3. `DreamPlay-piano-with-Midi-app-copy.png`
   - Piano + app/learning ecosystem visual
   - Strong fit for features/education/app sections

4. `dreamplay-hero-2-4.jpg`
   - Lifestyle image with adult + child at piano
   - Strong fit for homepage/editorial storytelling

5. `Gold-DS-6.0-full.png`
   - Premium gold product hero
   - Strong fit for premium spotlight/editorial modules

Downloaded assets
- `SMALLER-PICTURE-FOR-YOUTUBE.jpg`
- `1775476351436_0_2767616665182916.jpg`
- `DS-6.jpg`
- `DS-6.0---DreamPlay-Black-white-background.jpg`
- `1775208361276_0_3714669420931421.jpg`
- `Piano-Front-2.jpg`
- `Piano-Bench-Frontal-Bundle.png`
- `Screenshot-2026-03-01-at-12.01.06-AM.jpg`
- `DreamPlay-piano-with-Midi-app-copy.png`
- `dreamplay-hero-2-4.jpg`
- `Gold-DS-6.png`
- `Gold-DS-6.0-full.png`
- `Gold-DS-6.jpg`

Notes
- The current starred set is heavily weighted toward product/marketing imagery, which is useful for replacing placeholder commerce visuals fast.
- `starredFor` came back empty (`[]`) on the pulled assets, so these appear to be globally starred rather than campaign-specific stars.
- Next useful pass would be filtering for high-quality finals and/or DS-model-specific images once we decide which page gets real-asset replacement first.
