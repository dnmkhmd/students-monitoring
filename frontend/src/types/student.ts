export interface Student {
  id: number;
  iin: string | null;
  category: string | null;
  bin: string | null;
  released: string | null;
  document: string | null;
  continued_edu: string | null;
  enterprise_spec: string | null;
  enterprise_non_spec: string | null;
  op: string | null;
  full_name: string | null;
  position: string | null;
  grant_contract: string | null;
  city_region: string | null;
}

// Для формы все поля обязательные и не могут быть null
export interface StudentFormData {
  iin: string;
  category: string;
  bin: string;
  released: string;
  document: string;
  continued_edu: string;
  enterprise_spec: string;
  enterprise_non_spec: string;
  op: string;
  full_name: string;
  position: string;
  grant_contract: string;
  city_region: string;
}

// Тип для обновления - все поля опциональные
export interface StudentUpdateData {
  iin?: string;
  category?: string;
  bin?: string;
  released?: string;
  document?: string;
  continued_edu?: string;
  enterprise_spec?: string;
  enterprise_non_spec?: string;
  op?: string;
  full_name?: string;
  position?: string;
  grant_contract?: string;
  city_region?: string;
}