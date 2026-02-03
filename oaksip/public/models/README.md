# 3D Models for OAKSIP Training Module

This folder contains GLB model files for realistic 3D weapon rendering.

## Included Models

The following models are included and ready to use:

| File Name | Weapon Type | Source | License |
|-----------|-------------|--------|---------|
| `howitzer.glb` | Dhanush, Bofors, ATAGS | Kenney Blaster Kit | CC0 |
| `k9-vajra.glb` | K9 Vajra SPH | Kenney Blaster Kit | CC0 |
| `pinaka.glb` | Pinaka MBRL | Kenney Blaster Kit | CC0 |
| `ak47.glb` | AK-47 | OpenGameArt CC0 Flat Guns East | CC0 |
| `m416.glb` | M416/HK416 | OpenGameArt CC0 Flat Guns East | CC0 |
| `scar.glb` | SCAR-L | OpenGameArt CC0 Flat Guns East | CC0 |
| `glock.glb` | Glock-17 | Microsoft MixedRealityToolkit | MIT |
| `insas.glb` | INSAS | OpenGameArt CC0 Flat Guns East | CC0 |
| `pkm.glb` | PKM | OpenGameArt CC0 Flat Guns East | CC0 |

## Attribution

### Kenney Blaster Kit (CC0)
- Source: https://kenney.nl/assets/blaster-kit
- Author: Kenney (kenney.nl)
- License: CC0 1.0 Universal (Public Domain)
- Used for: Artillery placeholder models (howitzer, k9-vajra, pinaka)

### OpenGameArt CC0 Flat Guns East
- Source: https://opengameart.org/content/cc0-flat-guns-east
- Author: rubberduck (OpenGameArt)
- License: CC0 (Public Domain)
- Used for: AK-47, M416, SCAR, INSAS, PKM models

### Microsoft MixedRealityToolkit
- Source: https://github.com/microsoft/MixedRealityToolkit
- Author: Microsoft
- License: MIT License
- Used for: Glock pistol model

## Replacing with Realistic Models

To replace placeholder models with more realistic versions:

1. **Download from Sketchfab** (recommended):
   - Visit: https://sketchfab.com/search?features=downloadable&type=models
   - Search for the weapon type (e.g., "M777 howitzer", "K9 thunder")
   - Filter by: Free, Downloadable, CC license
   - Download as GLB format

2. **Rename and replace**:
   - Rename downloaded file to match the expected name (e.g., `howitzer.glb`)
   - Place in this folder, replacing the existing file

## Model Requirements

- **Format**: GLB (GLTF Binary)
- **File Size**: Under 5MB recommended for optimal loading
- **License**: CC0, CC-BY, or CC-BY-NC preferred

## Fallback Behavior

If a GLB model fails to load, the app automatically falls back to detailed primitive-based 3D models rendered with Three.js geometries.

## Technical Notes

- Models are loaded using `@react-three/drei`'s `useGLTF` hook
- X-ray mode and recoil animations work with GLB models
- Models are cached by the browser after first load
