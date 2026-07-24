import { createCrudRoutes } from '@/lib/crud';

const fields = ['slug', 'title', 'short_desc', 'full_desc', 'cover_image', 'program', 'duration', 'format', 'target_audience', 'price', 'status', 'sort_order'];
const { GET, POST } = createCrudRoutes('formations', fields);
export { GET, POST };
