export const EVENT_CATEGORIES = [
  "Music",
  "Tech",
  "Workshop",
  "Business",
  "Sports",
  "Food",
  "Art",
  "Education",
  "Health",
  "Networking",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
