import { createCrudByIdRoutes } from '@/lib/crud';

const fields = ['slug', 'title', 'short_desc', 'full_desc', 'cover_image', 'program', 'duration', 'format', 'target_audience', 'price', 'status', 'sort_order'];
const { GET, PUT, DELETE } = createCrudByIdRoutes('formations', fields);
export { GET, PUT, DELETE };
