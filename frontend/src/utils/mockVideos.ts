import type { Video } from "./types";

export const MOCK_VIDEOS: Video[] = [
  // Trending
  { id: "mock-1",  title: "Demo Trending 1",  description: "Vídeo de demostración", thumbnailUrl: "/dog.png",              category: "Trending",        durationSec: 215, views: 12500 },
  { id: "mock-2",  title: "Demo Trending 2",  description: "Vídeo de demostración", thumbnailUrl: "/protube-logo.png",     category: "Trending",        durationSec: 301, views: 8800  },
  { id: "mock-3",  title: "Demo Trending 3",  description: "Vídeo de demostración", thumbnailUrl: "/dog.png",              category: "Trending",        durationSec: 162, views: 5300  },
  { id: "mock-4",  title: "Demo Trending 4",  description: "Vídeo de demostración", thumbnailUrl: "/protube-logo.png",     category: "Trending",        durationSec: 432, views: 2300  },
  { id: "mock-13", title: "Demo Trending 5",  description: "Vídeo de demostración extra", thumbnailUrl: "/dog.png",          category: "Trending",        durationSec: 205, views: 9800  },
  { id: "mock-14", title: "Demo Trending 6",  description: "Vídeo de demostración extra", thumbnailUrl: "/protube-logo.png", category: "Trending",        durationSec: 275, views: 7600  },
  { id: "mock-15", title: "Demo Trending 7",  description: "Vídeo de demostración extra", thumbnailUrl: "/dog.png",          category: "Trending",        durationSec: 189, views: 4300  },
  { id: "mock-16", title: "Demo Trending 8",  description: "Vídeo de demostración extra", thumbnailUrl: "/protube-logo.png", category: "Trending",        durationSec: 349, views: 2900  },

  // Recently Added
  { id: "mock-5",  title: "Novedad 1",        description: "Vídeo reciente",         thumbnailUrl: "/protube-logo.png",     category: "Recently Added",  durationSec: 120, views: 150   },
  { id: "mock-6",  title: "Novedad 2",        description: "Vídeo reciente",         thumbnailUrl: "/dog.png",              category: "Recently Added",  durationSec: 240, views: 220   },
  { id: "mock-7",  title: "Novedad 3",        description: "Vídeo reciente",         thumbnailUrl: "/protube-logo.png",     category: "Recently Added",  durationSec: 190, views: 90    },
  { id: "mock-8",  title: "Novedad 4",        description: "Vídeo reciente",         thumbnailUrl: "/dog.png",              category: "Recently Added",  durationSec: 310, views: 410   },
  { id: "mock-17", title: "Novedad 5",        description: "Vídeo reciente extra",   thumbnailUrl: "/protube-logo.png", category: "Recently Added",  durationSec: 135, views: 80    },
  { id: "mock-18", title: "Novedad 6",        description: "Vídeo reciente extra",   thumbnailUrl: "/dog.png",          category: "Recently Added",  durationSec: 220, views: 170   },
  { id: "mock-19", title: "Novedad 7",        description: "Vídeo reciente extra",   thumbnailUrl: "/protube-logo.png", category: "Recently Added",  durationSec: 200, views: 60    },
  { id: "mock-20", title: "Novedad 8",        description: "Vídeo reciente extra",   thumbnailUrl: "/dog.png",          category: "Recently Added",  durationSec: 305, views: 230   },

  // Recommended
  { id: "mock-9",  title: "Recomendado 1",    description: "Para ti",                thumbnailUrl: "/dog.png",              category: "Recommended",     durationSec: 260, views: 1200  },
  { id: "mock-10", title: "Recomendado 2",    description: "Para ti",                thumbnailUrl: "/protube-logo.png",     category: "Recommended",     durationSec: 95,  views: 980   },
  { id: "mock-11", title: "Recomendado 3",    description: "Para ti",                thumbnailUrl: "/dog.png",              category: "Recommended",     durationSec: 400, views: 2100  },
  { id: "mock-12", title: "Recomendado 4",    description: "Para ti",                thumbnailUrl: "/protube-logo.png",     category: "Recommended",     durationSec: 330, views: 3100  },
  { id: "mock-21", title: "Recomendado 5",    description: "Sugerido para ti",       thumbnailUrl: "/dog.png",          category: "Recommended",     durationSec: 245, views: 1400  },
  { id: "mock-22", title: "Recomendado 6",    description: "Sugerido para ti",       thumbnailUrl: "/protube-logo.png", category: "Recommended",     durationSec: 110, views: 950   },
  { id: "mock-23", title: "Recomendado 7",    description: "Sugerido para ti",       thumbnailUrl: "/dog.png",          category: "Recommended",     durationSec: 375, views: 2250  },
  { id: "mock-24", title: "Recomendado 8",    description: "Sugerido para ti",       thumbnailUrl: "/protube-logo.png", category: "Recommended",     durationSec: 299, views: 3200  },
];
