# NOTICE

CHRISCO Digital Academy includes adapted open-source content. This file lists
the upstream projects, their licenses, and exactly what was used. No source
code from any project below is shipped in this website.

## OpenCreator (formerly KrillinAI)

- Website: https://github.com/krillinai/OpenCreator
- Mirror reviewed: https://github.com/cporter202/open-creator
- License: Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0)
- Copyright: the OpenCreator / KrillinAI contributors

**What is used:** the English-locale text of selected video-generation,
image-generation and writing prompt templates from the project's `template/`
and `packages/writing-templates/` data directories. The prompts are adapted
for CHRISCO students (curated, regrouped under academy tracks, and paired with
learning tips) and are stored as plain data in `app/data/toolkit.js`, served
from the `/toolkit` page. Each adapted card links back to the source
repository and is labelled "Apache-2.0".

**What is not used:** none of the application source code, build system,
daemon, desktop shell, generated media, example videos, images or brand assets
are copied or redistributed.

## image-blaster

- Website: https://github.com/neilsonnn/image-blaster
- License: MIT License
- Copyright: Neilson N. and contributors

**What is used:** nothing is copied. The project is referenced from the
"Advanced open-source creator tools" section of `/toolkit` as an optional
external learning tool, with a factual description of its requirements
(Claude Code plus paid World Labs / FAL API keys).

## CHRISCO-original content

The "Starter prompts" cards in `app/data/toolkit.js` were written specifically
for CHRISCO Digital Academy and carry no third-party license.

---

Licenses permit use, modification and redistribution with attribution. If any
upstream template is removed or re-licensed, the corresponding entry in
`app/data/toolkit.js` can be deleted without affecting the rest of the site.
