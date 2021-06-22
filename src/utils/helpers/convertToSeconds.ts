export const convertToSeconds = (
  days?: string | number,
  hours?: string | number,
  minutes?: string | number,
  seconds?: string | number,
) => (
  (days ? +days : 1) * 86400
  + (hours ? +hours : 0) * 3600
  + (minutes ? +minutes : 0) * 60
  + (seconds ? +seconds : 0)
);
