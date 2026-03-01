export const SORT = {
  NEWEST:     'newest',
  PRICE_HIGH: 'price-high',
  PRICE_LOW:  'price-low',
  VIEWS:      'views',
};

export const SORT_OPTIONS = [
  { value: SORT.NEWEST,     label: 'Newest' },
  { value: SORT.PRICE_HIGH, label: 'Price: High' },
  { value: SORT.PRICE_LOW,  label: 'Price: Low' },
  { value: SORT.VIEWS,      label: 'Trending' },
];

export const DEFAULT_SORT = SORT.NEWEST;
