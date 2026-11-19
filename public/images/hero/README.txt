Hero background artwork (optional).

To use the exact background graphic from the Evne theme you purchased, copy these two files
from your licensed theme package / demo import (wp-content/uploads/2025/03/) into this folder
and rename them:

  group.png    ->  hero-pattern.png         (dim background pattern)
  group_1.png  ->  hero-pattern-lines.png   (bright line version)

Then rebuild (npm run build). The hero detects them automatically and shows the same
cursor effect (lines turn red around the pointer). Without these files a generated
SVG pattern with the same effect is used.
