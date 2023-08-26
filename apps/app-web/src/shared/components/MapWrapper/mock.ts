export type Geometry = {
  type: string;
  coordinates: [number, number];
}

export type Item = {
  type: string;
  id: number;
  geometry: Geometry;
}

function getBaseData(id: number, coordinates: [number, number]): Item {
  return {
    type: 'Feature',
    id,
    geometry: {
      type: 'Point',
      coordinates,
    },
  }
}

export const MOCK_ITEMS = [
  getBaseData(0, [47.216259855619036, 38.928857487462636]),
  getBaseData(1, [47.21219698879442, 38.92677430297772]),
]

