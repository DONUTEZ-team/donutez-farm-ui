enum AcceptedImageTypes {
  'image/jpeg' = '.jpg',
  'image/png' = '.png',
}

export const formatImageType = (type: string) => (
  AcceptedImageTypes[type as keyof typeof AcceptedImageTypes]
);
