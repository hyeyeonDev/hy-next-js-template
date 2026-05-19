export type DigitalMapLocationType = "project" | "test";

export interface DigitalMapLocation {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  lat: number;
  lng: number;
  type: DigitalMapLocationType;
}
