// Central registry for all interactive components
// Add new interactive posts here as they are created

import MagicOrbBlog from './boj-32129/component';
import MLOneOneBlog from './ml-1-1/component';
import NetworkFundamentalsBlog from './network-1/component';
import MagicSquareBlog from './boj-1307/component';
import MLOneTwoBlog from './ml-1-2/component';
import LAOneOneBlog from './la-1-1/component';
import MLTwoOneBlog from './ml-2-1/component';
import LAOneTwoBlog from './la-1-2/component';
import EndlessBlog from './boj-1055/component';
import LAOneThreeBlog from './la-1-3/component';
import BitsAndIntegersBlog from './ca-1-1/component';
import OSIntroductionBlog from './os-1-1/component';
import TransformerArchitectureBlog from './llm-interpretability-1-1/component';

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
  'ml-2-1': MLTwoOneBlog,
  'la-1-2': LAOneTwoBlog,
  'boj-1055': EndlessBlog,
  'la-1-3': LAOneThreeBlog,
  'ca-1-1': BitsAndIntegersBlog,
  'os-1-1': OSIntroductionBlog,
  'llm-interpretability-1-1': TransformerArchitectureBlog,
};
