/**The response for the /list of products */
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  image: string;
  stl: string;
  price: number;
  filamentType: string;
  color: string;
  size?: string;
  version?: string;
}
