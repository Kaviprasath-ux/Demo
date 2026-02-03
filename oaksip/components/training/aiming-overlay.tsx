"use client";

import { useTrainingStore } from "@/lib/training-store";

export function AimingOverlay() {
  const { getGunSystemInfo, aimingMode } = useTrainingStore();
  const gunSystem = getGunSystemInfo();

  if (!aimingMode) return null;

  const category = gunSystem?.category || "assault-rifle";
  const isArtillery = category === "towed";
  const isPistol = category === "pistol";

  // Artillery uses different aiming UI (fire direction center)
  if (isArtillery) {
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Artillery aiming reticle */}
        <div className="relative">
          {/* Outer circle */}
          <div className="w-48 h-48 border-2 border-green-500/50 rounded-full flex items-center justify-center">
            {/* Inner circle */}
            <div className="w-24 h-24 border border-green-500/70 rounded-full flex items-center justify-center">
              {/* Center dot */}
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>

          {/* Crosshairs */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-green-500/50 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-green-500/50 -translate-x-1/2" />

          {/* Range markers */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-green-500 text-xs font-mono">
            ELEV: 45°
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-green-500 text-xs font-mono">
            RNG: 15km
          </div>
          <div className="absolute top-1/2 -left-16 -translate-y-1/2 text-green-500 text-xs font-mono">
            AZ: 270°
          </div>
        </div>
      </div>
    );
  }

  // Small arms iron sights / red dot
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {isPistol ? (
        // Pistol sights - simple notch and post
        <div className="relative">
          {/* Rear sight notch */}
          <div className="flex items-end gap-4">
            <div className="w-2 h-6 bg-black/80 rounded-t" />
            <div className="w-8 h-1" /> {/* Gap */}
            <div className="w-2 h-6 bg-black/80 rounded-t" />
          </div>
          {/* Front sight post */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <div className="w-1.5 h-5 bg-black/80 rounded-t">
              {/* Front sight dot */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        // Rifle/MG red dot sight
        <div className="relative">
          {/* Sight housing */}
          <div className="w-32 h-32 border-4 border-black/60 rounded-lg flex items-center justify-center bg-black/20">
            {/* Red dot */}
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]" />
          </div>

          {/* Crosshair lines (subtle) */}
          <div className="absolute top-1/2 left-0 w-6 h-px bg-red-500/30 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-6 h-px bg-red-500/30 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 h-6 w-px bg-red-500/30 -translate-x-1/2" />
          <div className="absolute left-1/2 bottom-0 h-6 w-px bg-red-500/30 -translate-x-1/2" />
        </div>
      )}

      {/* Aim instructions */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/70 text-xs bg-black/50 px-3 py-1 rounded">
        Click FIRE to shoot • Drag to aim
      </div>
    </div>
  );
}

// Compact crosshair for non-aiming mode
export function SimpleCrosshair() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="relative w-8 h-8">
        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/50 -translate-y-1/2" />
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/50 -translate-x-1/2" />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
