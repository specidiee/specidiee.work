// Central registry for all interactive components
// Add new interactive posts here as they are created

import MagicOrbBlog from './boj-32129/component';
import MLOneOneBlog from './ml-1-1/component';
import NetworkFundamentalsBlog from './network-1/component';

// Component mapping for dynamic imports
export const interactiveComponents: Record<string, any> = {
  'boj-32129': MagicOrbBlog,
  // Add new components here following the pattern:
  // 'slug': ComponentName,
  'ml-1-1': MLOneOneBlog,
  'network-1': NetworkFundamentalsBlog,
};
