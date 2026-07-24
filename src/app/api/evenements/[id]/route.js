import { createCrudByIdRoutes } from '@/lib/crud';

const fields = ['slug', 'title', 'short_desc', 'full_desc', 'cover_image', 'gallery', 'event_date', 'location', 'video_replay', 'status', 'sort_order'];
const { GET, PUT, DELETE } = createCrudByIdRoutes('events', fields);
export { GET, PUT, DELETE };
