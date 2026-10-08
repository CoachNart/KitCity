# KitCity

KitCity is now hosted in a proper Next.js + React + Three.js application.

## Source fidelity

The original supplied HTML game remains the gameplay and presentation source of truth. The migration separates:

- page shell and metadata
- global game CSS
- the existing Three.js game engine
- npm-managed Three.js dependency
- Next.js build/runtime

No gameplay systems, missions, city data, controls, UI copy, progression rules, or visual styling were intentionally redesigned during the migration.
