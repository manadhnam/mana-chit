import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';

// Mock data for blog posts - this would typically come from a CMS or API
const blogPosts = [
  {
    slug: 'understanding-chit-funds',
    title: 'Understanding Chit Funds: A Beginner\'s Guide',
    description: 'Learn the basics of how chit funds work and why they are a popular savings instrument in India.',
    author: 'Mana Chit Team',
    date: '2024-07-28',
    category: 'Finance 101',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
  },
  {
    slug: 'benefits-of-digital-chit-funds',
    title: 'Top 5 Benefits of Digital Chit Funds',
    description: 'Discover the advantages of managing your chit funds online with platforms like Mana Chit.',
    author: 'Sania Khan',
    date: '2024-07-25',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
  },
  {
    slug: 'maximizing-your-returns',
    title: 'Strategies for Maximizing Your Returns with Chit Funds',
    description: 'Expert tips on how to make the most of your investment and get the best possible returns.',
    author: 'Arjun Reddy',
    date: '2024-07-20',
    category: 'Investment Tips',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
  },
];

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Blog - Mana Chit</title>
        <meta name="description" content="Read the latest articles and insights on chit funds, financial planning, and investment strategies from the Mana Chit team." />
      </Helmet>
      <div className="bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-primary-600 text-white py-20">
          <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mana Chit Blog</h1>
            <p className="text-xl text-white/90">
              Your source for financial wisdom and investment insights.
            </p>
          </motion.div>
        </section>

        {/* Blog Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{post.category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex-grow">{post.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{post.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <Button asChild className="mt-6 w-full">
                      <Link to={`/blog/${post.slug}`}>Read More</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage; 