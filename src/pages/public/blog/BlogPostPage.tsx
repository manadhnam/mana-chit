import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NotFound from '@/pages/NotFound';

// Mock data - in a real app, you'd fetch this based on the slug
const blogPosts = [
  {
    slug: 'understanding-chit-funds',
    title: 'Understanding Chit Funds: A Beginner\'s Guide',
    content: `
      <p>Chit funds are a unique financial instrument that combines saving and borrowing. They have been a cornerstone of community financing in India for centuries. Here's a deep dive into how they work.</p>
      <h3 class="text-2xl font-bold my-4">What is a Chit Fund?</h3>
      <p>A chit fund is a rotating savings and credit association (ROSCA). A group of people (members) agree to contribute a fixed amount of money for a fixed period. Each month, the collected amount (the pot) is auctioned off to the member who is willing to take a discounted amount. The discount is then distributed as a dividend to all members.</p>
      <h3 class="text-2xl font-bold my-4">Key Terminology</h3>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Foreman:</strong> The person or entity that organizes and manages the chit fund.</li>
        <li><strong>Pot:</strong> The total amount of money collected from all members in a given month.</li>
        <li><strong>Auction:</strong> The process where members bid to win the pot for that month.</li>
        <li><strong>Dividend:</strong> The profit earned from the auction, which is distributed among all members.</li>
      </ul>
      <h3 class="text-2xl font-bold my-4">Is it Safe?</h3>
      <p>When you invest with a registered company like Mana Chit, your investment is secure. We are regulated by the government and adhere to strict compliance standards to protect our members' interests.</p>
    `,
    author: 'Mana Chit Team',
    date: '2024-07-28',
    category: 'Finance 101',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
  },
  // Add other blog posts here...
];

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Mana Chit Blog</title>
        <meta name="description" content={`Read our article on ${post.title}.`} />
      </Helmet>
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back to Blog Button */}
            <div className="mb-8">
              <Button asChild variant="outline">
                <Link to="/blog" className="inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
            
            {/* Post Header */}
            <div className="text-center mb-8">
              <p className="text-primary-600 dark:text-primary-400 font-semibold">{post.category}</p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white my-4">{post.title}</h1>
              <div className="text-gray-500 dark:text-gray-400">
                <span>By {post.author}</span> | <span>{post.date}</span>
              </div>
            </div>

            {/* Post Image */}
            <img src={post.imageUrl} alt={post.title} className="w-full h-96 object-cover rounded-xl shadow-lg mb-8" />

            {/* Post Content */}
            <article 
              className="prose dark:prose-invert lg:prose-xl max-w-none mx-auto text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage; 