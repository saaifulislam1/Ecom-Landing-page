"use client";

import { useEffect, useState } from "react";
import { getPublicMarketingSettings } from "@/lib/api";
import { initMetaPixel } from "@/lib/metaPixel";

export function MetaPixelClient() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    getPublicMarketingSettings().then((settings) => {
      if (settings?.isPixelEnabled && settings.metaPixelId) {
        initMetaPixel(settings.metaPixelId);
      }
      setLoaded(true);
    });
  }, [loaded]);

  return null;
}
