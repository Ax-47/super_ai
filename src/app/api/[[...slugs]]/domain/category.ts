
export interface Category {
  category_id: string;     // uuid
  category_name: string;
  created_at: Date;
  updated_at: Date;
}
export type CreateCategory = Pick<Category, 'category_name'>;

export type UpdateCategory = Omit<Category, 'created_at'>;
