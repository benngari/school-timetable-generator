let counter = 1;

export const uid = (prefix = 'id') =>
  `${prefix}_${counter++}_${Math.random().toString(36).slice(2, 6)}`;
