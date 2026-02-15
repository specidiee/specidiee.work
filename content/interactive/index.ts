// Central registry for all interactive components
// Add new interactive posts here as they are created

import MagicOrbBlog from './boj-32129/component';
import MLOneOneBlog from './ml-1-1/component';
import NetworkFundamentalsBlog from './network-1/component';
import MagicSquareBlog from './boj-1307/component';
import MLOneTwoBlog from './ml-1-2/component';
import LAOneOneBlog from './la-1-1/component';

// Component mapping for dynamic imports
export const interactiveComponents: Record<string, any> = {
  'boj-32129': MagicOrbBlog,
  // Add new components here following the pattern:
  // 'slug': ComponentName,
  'ml-1-1': MLOneOneBlog,
  'network-1': NetworkFundamentalsBlog,
  'boj-1307': MagicSquareBlog,
  'ml-1-2': MLOneTwoBlog,
  'la-1-1': LAOneOneBlog,
};
