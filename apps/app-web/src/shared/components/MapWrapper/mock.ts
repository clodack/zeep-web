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
  getBaseData(2, [47.203756304851666, 38.88939874047082]),
  getBaseData(2, [47.20502484107826, 38.94641120398264]),
]

