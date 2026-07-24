import { createCrudByIdRoutes } from '@/lib/crud';

const fields = ['slug', 'title', 'short_desc', 'full_desc', 'cover_image', 'category', 'target_client', 'steps', 'pricing', 'status', 'sort_order'];
const { GET, PUT, DELETE } = createCrudByIdRoutes('services', fields);
export { GET, PUT, DELETE };
