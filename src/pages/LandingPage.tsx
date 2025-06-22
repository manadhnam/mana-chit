import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Users from 'lucide-react/dist/esm/icons/users';
import Shield from 'lucide-react/dist/esm/icons/shield';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Star from 'lucide-react/dist/esm/icons/star';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import PiggyBank from 'lucide-react/dist/esm/icons/piggy-bank';
import Award from 'lucide-react/dist/esm/icons/award';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

const LandingPage = () => {
  const features = [
    {
      icon: PiggyBank,
      title: 'Smart Chit Groups',
      description: 'Join or create chit groups with flexible terms and transparent processes.'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Bank-grade security with full regulatory compliance and member protection.'
    },
    {
      icon: TrendingUp,
      title: 'Better Returns',
      description: 'Earn higher returns compared to traditional savings accounts.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with like-minded savers in your local community.'
    },
    {
      icon: CreditCard,
      title: 'Easy Loans',
      description: 'Access quick loans based on your contribution history.'
    },
    {
      icon: Award,
      title: 'Rewards Program',
      description: 'Earn rewards for referrals and consistent participation.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      content: 'SmartChit helped me save ₹50,000 in just 6 months. The digital platform makes everything so convenient!',
      rating: 5
    },
    {
      name: 'Raj Kumar',
      role: 'Business Owner',
      content: 'I got a quick loan for my business expansion. The process was smooth and transparent.',
      rating: 5
    },
    {
      name: 'Sneha Gupta',
      role: 'Teacher',
      content: 'The community aspect is amazing. I\'ve made great connections while saving for my goals.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Members' },
    { number: '₹50Cr+', label: 'Total Savings' },
    { number: '500+', label: 'Active Groups' },
    { number: '99.8%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-primary-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">SmartChit</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                The Smart Way to
                <span className="text-primary-600"> Save & Invest</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join digital chit groups, save systematically, and achieve your financial goals with our secure and transparent platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                >
                  Start Saving Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors inline-flex items-center justify-center"
                >
                  Demo Login
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quick Demo</h3>
                  <p className="text-gray-600 dark:text-gray-400">See how easy it is to get started</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Join a chit group</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Make monthly contributions</span>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Grab when you need funds</span>
                  </div>
                </div>
                
                <Link
                  to="/login"
                  className="w-full mt-6 bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                >
                  Try Demo (Mobile: 9876543210, OTP: 123456)
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SmartChit?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of savings with our innovative digital chit fund platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How SmartChit Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple steps to start your savings journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Register & Join',
                description: 'Create your account and join a chit group that matches your savings goal'
              },
              {
                step: '2',
                title: 'Contribute Monthly',
                description: 'Make your monthly contributions on time and track your progress'
              },
              {
                step: '3',
                title: 'Grab & Grow',
                description: 'Grab the amount when you need it or let it grow until maturity'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories from real people who achieved their financial goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map(_ => (
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Your Savings Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of smart savers who are already building their financial future with SmartChit
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors inline-flex items-center text-lg font-semibold"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <CreditCard className="h-8 w-8 text-primary-400 mr-3" />
                <span className="text-2xl font-bold">SmartChit</span>
              </div>
              <p className="text-gray-400 mb-4">
                The smart way to save, invest and grow your money with digital chit funds.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How it Works</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary-400 mr-3" />
                  <span className="text-gray-400">+91 9876543210</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary-400 mr-3" />
                  <span className="text-gray-400">support@smartchit.com</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-400 mr-3 mt-1" />
                  <span className="text-gray-400">123 Business District, Hyderabad, Telangana 500001</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 SmartChit. All rights reserved. | Regulated by RBI | NBFC License No. 12345
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;