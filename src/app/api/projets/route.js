import { createCrudRoutes } from '@/lib/crud';

const fields = ['slug', 'title', 'short_desc', 'full_desc', 'cover_image', 'gallery', 'sector', 'client', 'date', 'methodology', 'results', 'testimonial', 'status', 'sort_order'];
const { GET, POST } = createCrudRoutes('projects', fields);
export { GET, POST };
