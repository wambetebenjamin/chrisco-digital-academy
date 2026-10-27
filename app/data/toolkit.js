/*
 * AI Creator Toolkit catalogue.
 *
 * Video, image and writing prompt templates are adapted from the English
 * locale of OpenCreator (formerly KrillinAI), used under the Apache License
 * 2.0 — see NOTICE.md for attribution and the upstream URL. No source code
 * from that project is included; only prompt text and writing structures.
 * Starter prompts are original to CHRISCO Digital Academy.
 *
 * Cards are plain data so the same catalogue feeds the /toolkit page and
 * its tests. Bracketed [tokens] and {tokens} are meant to be replaced by
 * the learner before pasting into a free AI tool.
 */
export const toolkitFilters = [
  {
    "id": "all",
    "label": "All prompts",
    "icon": "grid"
  },
  {
    "id": "video",
    "label": "Video prompts",
    "icon": "video"
  },
  {
    "id": "image",
    "label": "Image prompts",
    "icon": "palette"
  },
  {
    "id": "writing",
    "label": "Writing frameworks",
    "icon": "pen"
  },
  {
    "id": "starter",
    "label": "Starter prompts",
    "icon": "bulb"
  }
]

export const toolkitPrompts = [
  {
    "id": "video-drone-orbit-subject",
    "type": "video",
    "title": "Drone Orbit Around Subject",
    "description": "Orbit a subject at constant radius, height, and speed to create continuous horizon rotation and parallax.",
    "track": "Video",
    "course": "AI Video Storytelling",
    "prompt": "A smooth constant-speed circular drone flight around the [subject] — [8]-meter radius, [4]-meter altitude, traveling screen-[right] (clockwise seen from above), covering roughly a [200]-degree arc across the shot. The horizon rotates continuously behind the subject; no altitude change, no radius drift, no zoom, no speed ramps.",
    "tip": "Replace [subject] with your product, person or landmark. Works in any AI video tool that accepts camera-direction prompts.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "video-dolly-zoom-space-warp",
    "type": "video",
    "title": "Dolly Zoom Space Warp",
    "description": "Synchronize a forward dolly with a wider field of view while keeping the subject size fixed and stretching background depth.",
    "track": "Video",
    "course": "AI Video Storytelling",
    "prompt": "The camera physically dollies forward from [6] meters to [2.5] meters while the lens simultaneously zooms out from [18] to [84] degrees field of view, in one continuous, perfectly synchronized ramp. The subject's head size stays EXACTLY constant in frame the entire time; the background behind them visibly stretches, elongates and recedes into depth, [the repeating background elements] pulling away. Constant lens height, no pan, no tilt, no handheld drift; the two motions start and end together.",
    "tip": "The classic vertigo effect. Fill in the two distances, field-of-view angles and the repeating background elements.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "video-fixed-point-pan-right-reveal",
    "type": "video",
    "title": "Fixed-Point Pan-Right Reveal",
    "description": "Rotate right from a fixed camera position and settle on the revealed subject without translating the camera.",
    "track": "Video",
    "course": "AI Video Storytelling",
    "prompt": "Rotate the camera horizontally from left to right from one fixed point, like a standing head-turn, starting on [composition A] and sweeping across [the environment]; no sideways travel, no dolly, no truck, no arc, no slide, no zoom, no tilt. Speed: smooth constant rotation, decelerating gently at the end. Framing: keep the horizon level while new space enters from the right side of the frame only through rotation; [the landing subject] stays beyond the right edge until the rotation brings them in. End: settle on a clear final composition on [the landing subject] and hold.",
    "tip": "Describe composition A (where the shot starts), the environment it crosses, and the landing subject revealed at the end.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "video-vertical-crane-reveal",
    "type": "video",
    "title": "Vertical Crane Reveal",
    "description": "Upload a low-angle first frame, then raise the camera smoothly with a continuous downward tilt to reveal the scale of the environment.",
    "track": "Video",
    "course": "YouTube Automation",
    "prompt": "A smooth jib rise from 1.2 meters to 9 meters altitude over the shot, with a gentle continuous downward tilt that keeps the [subject] anchored in the lower third of frame as the world opens above and around them. No lateral orbit, no truck, no zoom, no speed ramps; one continuous vertical reveal easing into a high hold.",
    "tip": "Perfect for vertical 9:16 intros. Swap in your [subject] and keep it anchored in the lower third.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "video-rack-focus-foreground-background",
    "type": "video",
    "title": "Rack Focus Between Foreground and Background",
    "description": "Lock the composition and shift focus once from a distant anchor to a near subject.",
    "track": "Video",
    "course": "AI Video Storytelling",
    "prompt": "The camera hard-locked on a tripod with no pan, no tilt, no push, no drift; the only optical change is FOCUS. Hold sharp on [plane A — the far anchor]; then rack once to [plane B — the near subject]; then follow focus on the subject if they move toward the lens. Speed: the rack is slow, smooth and continuous with no hunting and no overshoot; the follow focus tracks without breathing. Framing: the composition never changes; exactly one plane is sharp at any moment, the other melts into clean bokeh; the subject grows in frame only by physically approaching the lens. End: settle sharp on [the final subject framing], the far plane dissolved to soft bokeh behind.",
    "tip": "Name plane A (the distant anchor) and plane B (the near subject) so the tool knows where focus begins and ends.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "video-aerial-pullback-rise-reveal",
    "type": "video",
    "title": "Aerial Pullback and Rise Reveal",
    "description": "Fly backward and upward along the subject axis to reveal the full vehicle or environment in one continuous move.",
    "track": "Video",
    "course": "YouTube Automation",
    "prompt": "The camera starts [2.5] meters ahead of the subject at [3] meters altitude and flies backward and upward along the axis in one continuous accelerating move, reaching about [40] meters distance and [25] meters altitude by the end. [subject] stays centered, then the whole [craft / scene] centers itself in frame as it shrinks; the horizon line rises steadily through the frame. No orbit, no zoom, no speed reversals.",
    "tip": "A grand reveal for locations and vehicles. Adjust the four bracket numbers to control how far the camera travels.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "video-luxury-jewelry-unboxing",
    "type": "video",
    "title": "Luxury Jewelry Unboxing Ad",
    "description": "Create a vertical luxury jewelry commercial with unboxing, gemstone macro details, styling, and a final product display.",
    "track": "Marketing",
    "course": "Social Media Marketing",
    "prompt": "Created a 30-second cinematic luxury jewelry advertisement video in a warm and elegant style.\nThe video opens with a beautifully decorated bedroom, soft morning sunlight, and a premium jewelry gift box placed on a wooden table.\nA woman gently picks up the elegant box, creating a delicate and emotional unboxing moment.\nThe camera moves into cinematic close-up shots of her face and hands as she reveals the jewelry.\nA sparkling blue gemstone pendant is shown in detailed macro shots with soft golden lighting.\nShe wears the necklace gracefully, highlighting its elegant design and luxurious shine.\nThe scene continues with a peaceful morning moment near the window, holding a cup in warm sunlight.\nClose-up shots capture the pendant sparkling naturally against her skin with realistic shadows and reflections.\nThe video ends with a premium jewelry box displaying the complete matching jewelry set.\nSoft cinematic lighting, warm golden tones, luxury commercial aesthetic, smooth camera movements, shallow depth of field, photorealistic details, 9:16 vertical format.",
    "tip": "Swap jewelry for any product and rewrite the gemstone details. This structure sells phones, cosmetics and crafts too.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "video-khachapuri-overhead-cooking",
    "type": "video",
    "title": "Overhead Khachapuri Cooking",
    "description": "Generate a 10-second horizontal overhead cooking sequence with continuous food states. Source preview; output and rights unverified.",
    "track": "Marketing",
    "course": "Content Creation Mastery",
    "prompt": "Create a 10-second 16:9 photorealistic khachapuri cooking video exactly in sequence, static 90° top-down camera, matte-black table, same male hands in black gloves, hard cuts only, no magic or skipped steps: 0.0-0.7 ingredients symmetrically arranged, hands take dough -> 0.7-1.5 roll dough into an oval -> 1.5-2.2 roll long edges inward -> 2.2-2.8 pinch both ends into a boat -> 2.8-3.6 evenly fill with grated cheese -> 3.6-4.2 place raw khachapuri on black baking tray -> 4.2-5.0 visibly slide the raw khachapuri into the oven -> 5.0-5.8 fast realistic timelapse inside oven: dough rises and turns golden, cheese melts and bubbles -> 5.8-6.5 hands remove baked khachapuri -> 6.5-7.3 crack one egg directly into the center -> 7.3-8.0 return to oven, short timelapse: egg white sets slightly while yolk stays runny -> 8.0-8.6 remove finished khachapuri and place on black table -> 8.6-9.2 add butter cubes beside yolk, butter starts melting -> 9.2-10.0 hands exit, hero shot of golden khachapuri with melted cheese, glossy runny yolk and melting butter. Every next shot must continue from the exact food state of the previous shot; fast precise realistic hand movements, no camera movement, no levitation, teleportation, instant cooking, disappearing or duplicated ingredients.",
    "tip": "A timed, shot-by-shot food template. Replace the dish and timings with your own recipe — keep the hard-cut sequence.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "image-boutique-ecommerce-product-flatlay-grid",
    "type": "image",
    "title": "Boutique E-commerce Product Flatlay Grid",
    "description": "Arrange fashion and lifestyle products in a polished e-commerce flat-lay grid.",
    "track": "Business",
    "course": "Print on Demand",
    "prompt": "[Brand / product information]\n- Brand name: {brandName}\n- Collection name: {collection}\n- Typical product price: {backpackPrice}\n\n[Image quality, presentation, and composition]\n- Style: Minimal, refined lookbook photography for a Japanese fashion/lifestyle brand's e-commerce website.\n- Composition: Neatly flat-lay or arrange clothing items such as bags, coats, and shoes on hardwood or concrete flooring in a naturally lit studio.\n- Typography (for GPT-image / Nano Banana Pro): Subtly place {brandName}, {collection}, and the price {backpackPrice} in a corner of the canvas using very thin lettering.\n- Lighting/color: Soft, overcast-like natural light, low contrast, and a calm earth-tone palette of beige, olive, charcoal, and off-white.\n\n[Strict layout and output requirements]\n- Output the finished design itself, filling the entire canvas. Backgrounds and scenes within the design, including walls, spaces, and shadows, may follow the instructions above.\n- Prohibited: photos of framed posters, posters mounted on walls, mockups placed on tables or paper, perspective distortion or cast shadows along paper edges.\n- Output the finished flat 2D design itself, filling the entire canvas. The scene elements described above, including walls, rooms, and shadows, are allowed. Absolutely no poster mockups: no frames, no photographs mounted on walls or placed on tables, and no perspective distortion or cast shadows around the artwork edges.\n- Aspect ratio: \"--ar 1:1\" or \"--ar 4:3\"",
    "tip": "Fill {brandName}, {collection} and {backpackPrice}, then list the actual products to arrange. Great for lookbooks and catalogues.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "image-duotone-studio-commercial-portrait",
    "type": "image",
    "title": "Duotone Studio Commercial Portrait",
    "description": "Light a premium studio portrait with vivid magenta and electric-blue tones.",
    "track": "Design",
    "course": "Personal Branding: Visibility Is Currency",
    "prompt": "Create an ultra-realistic close-up studio portrait of an adult man with a confident, thoughtful expression, photographed from the chest upward in a premium modern editorial style.\n\nGive him thick, neatly styled short black hair with natural volume on top and clean tapered sides. Add a well-groomed full beard and mustache with sharp but natural edges. He is wearing transparent rectangular eyeglasses with subtle reflections from the studio lights.\n\nDress him in a fitted black turtleneck sweater layered underneath a sophisticated black tailored blazer with structured lapels. Keep the outfit completely minimal and monochrome with no visible jewelry or unnecessary accessories.\n\nPose him facing slightly away from the camera, with his head gently tilted upward and his eyes looking toward the upper-right side of the frame, creating a calm, intelligent, aspirational mood.\n\nUse dramatic dual-tone studio lighting: vivid magenta/purple rim light illuminating the left side of his hair and face, and vibrant electric-blue/cyan light illuminating the right side. Keep soft neutral frontal lighting on the face so the skin remains realistic, detailed, and properly exposed.\n\nCreate a blurred futuristic studio background with a rich gradient transitioning from deep purple and magenta on the left to electric blue on the right. Add a glowing diagonal neon-magenta light bar in the lower-left background for extra visual depth.\n\nEmphasize realistic skin texture, detailed beard hairs, sharp eyes, natural eyeglass reflections, crisp fabric texture, cinematic contrast, shallow depth of field, smooth colorful bokeh, premium personal-branding photography, high-end corporate editorial aesthetic, ultra-photorealistic, 85mm portrait lens look, f/1.8, 8K detail, vertical 4:5 composition.",
    "tip": "Rewrite the face, clothing and two lighting colours to match the person you are creating a brand portrait for.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "image-faithful-vintage-portrait-restoration",
    "type": "image",
    "title": "Faithful Vintage Portrait Restoration",
    "description": "Upload one portrait photo to restore detail while preserving identity and background. Source preview; output and rights unverified.",
    "track": "Design",
    "course": "Freelancing",
    "prompt": "Enhance the portrait while strictly preserving the subject's identity with accurate facial geometry. Do not change their expression or face shape. Only allow subtle feature cleanup without altering who they are. Keep the exact same background from the reference image. No replacements, no changes, no new objects, no layout shifts. The environment must look identical. The image must be recreated as if it was shot on a Sony A1, using an 85mm f1.4 lens, at f1.6, ISO 100, 1/200 shutter speed",
    "tip": "Use with an uploaded old photo. Photo restoration is a paid freelance service — this prompt is your quality standard.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "image-four-city-minimal-travel-poster-series",
    "type": "image",
    "title": "Four-City Minimal Travel Poster Series",
    "description": "Create a coordinated series of four minimalist destination posters.",
    "track": "Design",
    "course": "Content Creation Mastery",
    "prompt": "Minimalist flat travel poster illustration series of iconic destinations around the world, clean vector art style, Scandinavian color palette, soft pastel tones, calm atmospheric scenery, Hallstatt Austria lakeside village with alpine mountains and reflections, Bergen Norway colorful harbor houses with fjord background, Kyoto Japan traditional riverside town with cherry blossoms and pagoda, Santorini Greece white architecture with blue domes overlooking the sea, ultra clean composition, geometric landscape shapes, smooth gradients, elegant typography with destination names, modern tourism poster aesthetic, serene travel mood, crisp vector lines, cinematic wide-angle scenery, peaceful skies with stylized clouds, highly detailed environment art, contemporary flat illustration, premium editorial travel design, balanced composition, minimal shadows, dreamy vacation atmosphere, soft morning lighting, high-end Airbnb poster vibe, Behance trending style, 4k, ultra detailed",
    "tip": "Replace the four cities with Ugandan destinations — Jinja, Buikwe, Kampala, Murchison Falls — for a local poster series.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "image-exploded-food-infographic",
    "type": "image",
    "title": "Exploded Food Infographic",
    "description": "Stack the ingredients of a dish in a photorealistic exploded-view infographic.",
    "track": "Marketing",
    "course": "Content Creation Mastery",
    "prompt": "Create a hyper-realistic exploded vertical infographic composition of tacos.\n\nTop → Bottom structure:\nFresh Lettuce (crisp green texture with natural folds)\n→ Tomato & Salsa Layer (juicy diced tomatoes and salsa mix)\n→ Melted Cheese (smooth cheddar texture)\n→ Grilled Meat Filling (juicy seasoned meat detail)\n→ Taco Shell Base (crispy golden shell texture)\nPerfect vertical alignment, rustic background, soft studio lighting, realistic shadows beneath each floating element.\n\nAdd clean infographic text labels with thin pointer lines using these exact labels:\n“Lettuce”\n“Salsa”\n“Cheese”\n“Meat”\n“Shell”\nUltra-detailed food textures, premium commercial aesthetic, 8K.",
    "tip": "Replace tacos with any layered product (rolex, burger, kitenge fashion) and edit the five labels to match.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "image-felt-country-miniature-world",
    "type": "image",
    "title": "Felt Country Miniature World",
    "description": "Build a handcrafted felt miniature celebrating the landmarks of a chosen country.",
    "track": "Design",
    "course": "Print on Demand",
    "prompt": "Country: [INSERT COUNTRY NAME]\n\nA miniature felt diorama made of fluffy yarn, wool, and needlework, designed as a single cohesive small world (not a collage), reflecting the real landscape, culture, and daily life of the country.\n\nStructure:\n- Select 4–7 naturally integrated elements (landscape, architecture, transport, street life, culture)\n- Everything must flow together as one environment\n\nForeground:\nEveryday life — small shops, cafes, markets, people interacting, local clothing, street details, subtle movement, warm human presence\n\nMidground:\nConnecting flow — streets, bridges, rivers, paths, transport, cultural spaces that guide the eye naturally from front to back\n\nBackground:\nOne strong identity anchor — landmark, skyline, mountain, or symbolic landscape clearly representing the country (keep it clean, not overcrowded)\n\nStyle:\nHandmade wool felt, yarn, needle-felt textures, visible fibers, soft edges, miniature craftsmanship, premium diorama realism\n\nLighting:\nWarm golden hour or bright noon, soft shadows, clear visibility, gentle glow enhancing depth\n\nColor:\nSoft but saturated palette reflecting the country’s natural tones (greens, sky blues, architectural hues, cultural accents), warm and balanced\n\nComposition:\nVertical frame, balanced or centered perspective, slight top-down or immersive angle, clear foreground–midground–background depth\n\nMood:\nWarm, emotional, calm, refined — like a handcrafted fairy-tale version of real life (not childish)\n\nRules:\n- No logos or text overlays\n- No collage-style composition\n- No random symbolic clutter\n- Keep it realistic but stylized as a handmade miniature world\n\nQuality:\n16K, ultra-detailed, hyper-realistic miniature textures, cinematic depth, sharp focus\n\noutput_goal:\nA single, cohesive felt diorama world that instantly conveys the identity and atmosphere of the chosen country through integrated landscape, culture, and daily life",
    "tip": "Set the country to Uganda and name local landmarks — the Nile, boda-bodas, matatus — for distinctive printable art.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "writing-insight",
    "type": "writing",
    "title": "Deep Insight",
    "description": "Clear points of view for industry observations and trend analysis",
    "track": "Writing",
    "course": "Copywriting",
    "prompt": "Write a [format — blog post, LinkedIn article, newsletter or thread] about [your topic] for [your target audience].\n\nFollow this structure: Core judgment → Context and problem → Layered argument → Actionable advice.\n\nWriting rules: Open with a clearly defined problem and state the conclusion before developing the argument. Use two to four well-structured section headings, grounding each point in facts, data, and examples from the sources. Avoid vague claims and close with actionable observations or recommendations.\n\nKeep it between [word count] words and finish with one clear call to action.",
    "structure": [
      "Core judgment",
      "Context and problem",
      "Layered argument",
      "Actionable advice"
    ],
    "tip": "Fill the three brackets first, then paste into ChatGPT, Gemini or Claude. Re-run with the same structure to compare versions.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "writing-news-analysis",
    "type": "writing",
    "title": "News Analysis",
    "description": "Explain what happened, then assess its impact and significance",
    "track": "Writing",
    "course": "Ghostwriting",
    "prompt": "Write a [format — blog post, LinkedIn article, newsletter or thread] about [your topic] for [your target audience].\n\nFollow this structure: What happened → Essential context → Who is affected → Signals to watch.\n\nWriting rules: Use as little space as possible to establish what happened, then explain why it matters, who it affects, and what to watch next. Clearly separate sourced facts from the author's judgment, avoid overstating conclusions, and never invent unsupported data.\n\nKeep it between [word count] words and finish with one clear call to action.",
    "structure": [
      "What happened",
      "Essential context",
      "Who is affected",
      "Signals to watch"
    ],
    "tip": "Fill the three brackets first, then paste into ChatGPT, Gemini or Claude. Re-run with the same structure to compare versions.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "writing-story",
    "type": "writing",
    "title": "Narrative Storytelling",
    "description": "Lead with a person or scene and build a strong reading rhythm",
    "track": "Writing",
    "course": "Content Creation Mastery",
    "prompt": "Write a [format — blog post, LinkedIn article, newsletter or thread] about [your topic] for [your target audience].\n\nFollow this structure: Person or scene → Rising conflict → Key turn → Thematic callback.\n\nWriting rules: Open with a specific person, scene, or conflict, then carry the central idea through the story's progression. Keep paragraphs concise and rhythmic, use headings at meaningful turns, and never invent details absent from the sources. Close by returning to the opening and leave the reader with a lingering thought.\n\nKeep it between [word count] words and finish with one clear call to action.",
    "structure": [
      "Person or scene",
      "Rising conflict",
      "Key turn",
      "Thematic callback"
    ],
    "tip": "Fill the three brackets first, then paste into ChatGPT, Gemini or Claude. Re-run with the same structure to compare versions.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "writing-tutorial",
    "type": "writing",
    "title": "Practical Tutorial",
    "description": "Clear steps for methods, workflows, and hands-on guides",
    "track": "Writing",
    "course": "Copywriting",
    "prompt": "Write a [format — blog post, LinkedIn article, newsletter or thread] about [your topic] for [your target audience].\n\nFollow this structure: Problem and outcome → Action steps → Cautions → Completion check.\n\nWriting rules: Start by explaining the reader's problem and the outcome they can achieve, then proceed through executable steps. For each step, state its purpose, action, and cautions, using checklists where useful. End with a completion checklist or a clear next action.\n\nKeep it between [word count] words and finish with one clear call to action.",
    "structure": [
      "Problem and outcome",
      "Action steps",
      "Cautions",
      "Completion check"
    ],
    "tip": "Fill the three brackets first, then paste into ChatGPT, Gemini or Claude. Re-run with the same structure to compare versions.",
    "source": "Adapted from OpenCreator, formerly KrillinAI (Apache License 2.0)",
    "sourceUrl": "https://github.com/cporter202/open-creator",
    "license": "Apache-2.0"
  },
  {
    "id": "starter-social-caption",
    "title": "Scroll-stopping social media caption",
    "description": "A complete caption with hook, value and call to action for any post.",
    "track": "Marketing",
    "course": "Social Media Marketing",
    "prompt": "You are a social media marketer in Uganda. Write 3 Instagram/Facebook captions for a post about [what the post shows]. The audience is [who you want to reach]. Each caption must have: a scroll-stopping first line, 2-3 short value lines, and one clear call to action. Add 5 relevant hashtags and suggest the best time of day to post. Keep the tone [friendly / bold / professional].",
    "tip": "Generate three versions, then mix the strongest hook with the strongest call to action.",
    "type": "starter",
    "source": "CHRISCO original prompt",
    "sourceUrl": null,
    "license": null
  },
  {
    "id": "starter-youtube-thumbnail",
    "title": "YouTube title and thumbnail ideas",
    "description": "Five click-worthy titles plus thumbnail text and layout direction.",
    "track": "Video",
    "course": "YouTube Automation",
    "prompt": "My YouTube video is about [video topic] and it helps [target viewer] get [specific result]. Give me 5 titles under 60 characters that create curiosity without clickbait. For each title, suggest thumbnail text of 4 words or fewer, the background emotion/expression to show, and one high-contrast colour pair. End with the single strongest title-and-thumbnail combination.",
    "tip": "Pair this with the toolkit's video camera prompts when you generate B-roll for the same video.",
    "type": "starter",
    "source": "CHRISCO original prompt",
    "sourceUrl": null,
    "license": null
  },
  {
    "id": "starter-logo-brief",
    "title": "Logo and brand design brief",
    "description": "Turn a vague business idea into a precise brief for Canva or an image generator.",
    "track": "Design",
    "course": "Print on Demand",
    "prompt": "I run [business name], which sells [product or service] to [ideal customer]. Design a logo concept brief containing: 3 words for the brand personality, a simple symbol that represents [core benefit], a font style (modern serif, clean sans-serif or handwritten), a 3-colour palette with hex codes, and one clear rule for how the logo must and must not be used. Explain each choice in one sentence.",
    "tip": "Paste the brief into Canva's design request or any AI image tool, then ask for 3 variations to compare.",
    "type": "starter",
    "source": "CHRISCO original prompt",
    "sourceUrl": null,
    "license": null
  },
  {
    "id": "starter-photo-cleanup",
    "title": "Photo cleanup and restoration brief",
    "description": "Remove objects and restore detail while keeping the subject's identity unchanged.",
    "track": "Design",
    "course": "AI Literacy for Work & Productivity",
    "prompt": "Edit the uploaded photo with these rules: keep the subject's face, identity and expression exactly the same; remove [object to remove] from the [left/right/background] area; repair the background behind it so the lighting and texture look natural; restore sharpness and natural colour. Do not add new objects, people, text or watermarks, and do not change the composition.",
    "tip": "This is the same safe-editing discipline professional tools use — identity first, cleanup second, no inventions.",
    "type": "starter",
    "source": "CHRISCO original prompt",
    "sourceUrl": null,
    "license": null
  },
  {
    "id": "starter-whatsapp-broadcast",
    "title": "WhatsApp broadcast that sells without spamming",
    "description": "A polite promotional message built for East African group and status marketing.",
    "track": "Business",
    "course": "Sales & Marketing Full Course",
    "prompt": "Write a WhatsApp broadcast message promoting [product or service] at [price, currency and validity]. Audience: [who they are and what problem they have]. Use under 90 words, open with the customer's problem, show one benefit, include one simple next step (reply with a word or tap a link), and end politely. No emojis in the first line, no ALL CAPS, and give an easy way to opt out.",
    "tip": "Always send test messages to yourself first and respect the opt-out line — trust is the real product.",
    "type": "starter",
    "source": "CHRISCO original prompt",
    "sourceUrl": null,
    "license": null
  },
  {
    "id": "starter-content-repurposing",
    "title": "One idea, five pieces of content",
    "description": "Turn a single lesson or product into a week of posts across formats.",
    "track": "Writing",
    "course": "Content Creation Mastery",
    "prompt": "I have one core idea: [state the idea, lesson or product benefit]. Turn it into 5 pieces of content: an educational carousel post, a short personal story, a question that sparks comments, a 30-second Reel script with on-screen text, and a direct sales post. For each, give the format, the hook line and the call to action, and suggest which day of a 5-day week to publish it.",
    "tip": "Plan all five in one sitting, then schedule — consistency beats scrambling for daily ideas.",
    "type": "starter",
    "source": "CHRISCO original prompt",
    "sourceUrl": null,
    "license": null
  }
]

export const advancedTools = [
  {
    "id": "opencreator",
    "name": "OpenCreator",
    "formerly": "formerly KrillinAI",
    "tagline": "Open-source AI workspace for video, voice and translation",
    "url": "https://github.com/cporter202/open-creator",
    "upstreamUrl": "https://github.com/krillinai/OpenCreator",
    "license": "Apache License 2.0",
    "cost": "Free software; you pay for the AI model APIs you choose",
    "requirements": [
      "Desktop install on Windows, macOS or Linux — it runs locally, not in a browser tab",
      "A ChatGPT sign-in or an AI provider API key for generation and dubbing",
      "Disk space for video rendering with ffmpeg and yt-dlp managed by the app"
    ],
    "does": [
      "Download and translate videos with subtitles and dubbing across 120+ languages",
      "Generate images, videos and voiceovers from prompts and templates",
      "Write articles and short-video scripts with reusable writing templates"
    ],
    "bestFor": "Video and marketing students ready to run real client workflows after the handbook courses."
  },
  {
    "id": "image-blaster",
    "name": "image-blaster",
    "formerly": null,
    "tagline": "Turn one image into an explorable 3D world with sound",
    "url": "https://github.com/neilsonnn/image-blaster",
    "upstreamUrl": null,
    "license": "MIT License",
    "cost": "Free software; World Labs, FAL and ElevenLabs API usage is billed separately",
    "requirements": [
      "Claude Code installed on your computer plus confidence using the terminal",
      "Paid API keys for World Labs (3D environments) and FAL (3D meshes)",
      "A modern laptop for viewing the generated Three.js scenes"
    ],
    "does": [
      "Generate 3D models (.glb/.obj) of objects from a single image",
      "Build explorable Gaussian-splat environments and physics-based sound effects",
      "Preview everything in a bundled React 3D viewer you can embed elsewhere"
    ],
    "bestFor": "Advanced design and coding students exploring 3D, game assets and immersive portfolios."
  }
]
