# Image assets

## Social preview

`og-image.jpg` — 1200 × 630 px, JPG, ~98 KB.
Every page references `https://mueezurrehman.com/assets/img/og-image.jpg`.
Replace it whenever the name, role or tagline changes (keep the 1200 × 630 size).

## Portrait

- `mueezur-rehman.jpg` — 1000 × 1777 (hero plate + about id-card)
- `mueezur-rehman-sm.jpg` — 480 × 853 (small screens / `srcset`)
- `photo.png` — unused duplicate of the portrait, safe to delete

## Project cards on the homepage

`work_img/<project>_preview.png` — 1600 × 1000 (16:10), light UI screenshots.

| File | Card | Status |
|---|---|---|
| `alwholesale_main_home_frontpage.png` | Al Wholesale | real screenshot |
| `canadatrado_preview.png` | Canadatrado | **placeholder** |
| `leadgenpro_preview.png` | LeadGenPro | **placeholder** |
| `smart-school_preview.png` | Smart School | **placeholder** |
| `all-cars-365_preview.png` | All Cars 365 | **placeholder** |
| `eco-choice_preview.png` | Eco Choice Group | **placeholder** |

To swap a placeholder, overwrite the file with a real screenshot (same 16:10 ratio,
1600 × 1000 or larger, browser chrome cropped off). Keep the filename, or update the
`<img src>` in `index.html` if you change it.

## Case study pages (`work/*.html`)

`work_img/alwholesale_*.png` — real Al Wholesale screenshots used in the hero cover and
gallery. The `_originals/` folder keeps the uncropped versions.

The other five case studies still use gradient covers and text-only gallery frames —
drop screenshots in `work_img/` and wire them up the same way.

## Testimonial avatars

Real client photos, cropped square to 240 × 240 and shown at 44 px in a circle:

- `avatars/muzaffar-shaikh.jpg` — Muzaffar Suleman Shaikh, CEO, Eco Choice Group
- `avatars/zakir-hussain.jpg` — Zakir Hussain, Founder, DataLeadGen
- `avatars/jay-israni.jpg` — Jay Israni, Co-founder, LeadUniversal
- `avatars/shahrukh-baig.jpg` — Shahrukh Baig, Co-founder, TheITFrnd
- `avatars/mohammed-ismile.jpg` — Mohammed Ismile, Founder, Mahira Tax Solution
- Canadatrado uses a "CT" monogram — add `avatars/canatrado.jpg` and swap the
  `<span class="avatar">CT</span>` for an `<img>` once the owner's photo is available.

## Still missing

- A real logo: `logo.svg` (or a transparent PNG, 512 × 512). Once it exists it can
  replace the CSS "M" monogram in the nav/footer and the inline SVG favicon.
- A second portrait (3:4, min 800 × 1067) for the About section, so the hero and the
  id-card do not show the same photo.
