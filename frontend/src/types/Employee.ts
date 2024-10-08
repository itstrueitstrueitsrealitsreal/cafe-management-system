export interface Employee {
  id?: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  cafeId?: string;
  cafe?: {
    id: string;
    name: string;
    description?: string;
    location?: string;
  };
}
