import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  CreditCard, 
  Users, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  PiggyBank,
  Award,
  Clock,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronRight,
  BarChart,
  Smartphone,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Wallet } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PhoneCall } from 'lucide-react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const features = [
    {
      icon: PiggyBank,
      title: 'Smart Chit Groups',
      description: 'Join or create chit groups with flexible terms and transparent processes. Choose from various schemes tailored to your financial goals.',
      benefits: [
        'Multiple scheme options',
        'Flexible payment terms',
        'Transparent bidding process',
        'Real-time group status'
      ]
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Bank-grade security with full regulatory compliance and member protection. Your investments are safe with us.',
      benefits: [
        'Government regulated',
        'Bank-grade encryption',
        'Secure transactions',
        'Regular audits'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Better Returns',
      description: 'Earn higher returns compared to traditional savings accounts. Get the best value for your investments.',
      benefits: [
        'Competitive interest rates',
        'Early bid benefits',
        'Bonus rewards',
        'Referral benefits'
      ]
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with like-minded savers in your local community. Build lasting financial relationships.',
      benefits: [
        'Local group meetings',
        'Community events',
        'Network building',
        'Shared growth'
      ]
    },
    {
      icon: CreditCard,
      title: 'Easy Loans',
      description: 'Access quick loans based on your contribution history. Get funds when you need them most.',
      benefits: [
        'Quick approval',
        'Flexible repayment',
        'No hidden charges',
        'Competitive rates'
      ]
    },
    {
      icon: Award,
      title: 'Rewards Program',
      description: 'Earn rewards for referrals and consistent participation. Get more benefits as you grow with us.',
      benefits: [
        'Referral bonuses',
        'Loyalty points',
        'Special discounts',
        'Premium membership'
      ]
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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const navLinks = [
    { name: 'Features', href: '#features', isExternal: false },
    { name: 'How It Works', href: '#how-it-works', isExternal: false },
    { name: 'Benefits', href: '#benefits', isExternal: false },
    { name: 'About', href: '#about', isExternal: false },
    { name: 'Contact', href: '#contact', isExternal: false },
    { name: 'Blog', href: '/blog', isExternal: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const benefits = [
    {
      icon: Shield,
      title: 'Financial Security',
      description: 'Your investments are protected by government regulations and insurance coverage',
      points: [
        'Government regulated operations',
        'Mandatory insurance coverage',
        'Secure payment gateways',
        'Regular compliance audits'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Growth Opportunities',
      description: 'Multiple avenues for financial growth and wealth creation',
      points: [
        'Higher returns than savings',
        'Investment diversification',
        'Compound growth benefits',
        'Flexible investment options'
      ]
    },
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Save time with our digital-first approach to chit fund management',
      points: [
        'Online registration process',
        'Digital payment options',
        'Mobile app access',
        'Automated notifications'
      ]
    },
    {
      icon: Users,
      title: 'Community Benefits',
      description: 'Be part of a growing community of smart investors',
      points: [
        'Networking opportunities',
        'Knowledge sharing',
        'Community support',
        'Group activities'
      ]
    }
  ];

  const aboutContent = {
    mission: {
      title: 'Our Mission',
      description: 'To provide secure and accessible financial solutions through transparent chit fund management, helping our members achieve their financial goals while maintaining the highest standards of trust and compliance.',
      points: [
        'Empower financial growth',
        'Ensure transparency',
        'Build trust',
        'Foster community'
      ]
    },
    values: {
      title: 'Our Values',
      items: [
        {
          title: 'Transparency',
          description: 'We believe in complete transparency in all our operations and communications.'
        },
        {
          title: 'Integrity',
          description: 'We maintain the highest standards of integrity in all our dealings.'
        },
        {
          title: 'Innovation',
          description: 'We continuously innovate to provide better services to our members.'
        },
        {
          title: 'Community',
          description: 'We foster a strong community of financially responsible individuals.'
        }
      ]
    },
    achievements: [
      { number: '50K+', label: 'Active Members' },
      { number: '₹500Cr+', label: 'Total Fund Value' },
      { number: '98%', label: 'Customer Satisfaction' },
      { number: '10+', label: 'Years of Trust' }
    ]
  };

  const contactInfo = {
    phone: {
      primary: '+91 98765 43210',
      secondary: '+91 98765 43211',
      hours: '24/7 Support Available'
    },
    email: {
      support: 'support@manachit.com',
      info: 'info@manachit.com',
      response: 'Response within 24 hours'
    },
    address: {
      main: '123 Main Street',
      area: 'Financial District',
      city: 'Hyderabad',
      state: 'Telangana - 500032',
      country: 'India'
    },
    social: [
      { name: 'Facebook', url: '#', icon: 'facebook' },
      { name: 'Twitter', url: '#', icon: 'twitter' },
      { name: 'LinkedIn', url: '#', icon: 'linkedin' },
      { name: 'Instagram', url: '#', icon: 'instagram' }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Mana Chit - Modern Chit Fund Management | Secure & Trusted Investment</title>
        <meta name="description" content="Join Mana Chit's trusted chit fund schemes. We offer secure, regulated, and flexible investment options with high returns. Start your financial journey today!" />
        <meta name="keywords" content="chit fund, investment, savings, financial planning, secure investment, Telangana chit funds, regulated chit funds" />
      </Helmet>

    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
        <header className="fixed w-full top-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center space-x-2">
                <PiggyBank className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Mana Chit</span>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-8">
                {navLinks.map(link => (
              <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/eligibility">Get Started</Link>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
              <nav className="flex flex-col space-y-4 p-4">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/auth/login">Login</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/eligibility">Get Started</Link>
                  </Button>
                </div>
              </nav>
        </div>
          )}
      </header>

      {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Modern Chit Fund Management
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Transform your financial future with our secure and innovative chit fund solutions. 
                Join thousands of satisfied members in building wealth together.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="hover:scale-105 transition"
                  asChild
                >
                  <Link to="/eligibility">Check Eligibility</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-primary-600 transition"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Learn More
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-semibold mb-2">Government Regulated</h3>
                  <p className="text-white/90">Fully compliant with all legal requirements</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <Users className="w-12 h-12 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-semibold mb-2">50K+ Members</h3>
                  <p className="text-white/90">Growing community of smart investors</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <BarChart className="w-12 h-12 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-semibold mb-2">High Returns</h3>
                  <p className="text-white/90">Better returns than traditional savings</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Why Choose Mana Chit?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the perfect blend of traditional chit funds and modern technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Secure & Regulated',
                  description: 'Bank-grade security with full regulatory compliance. Your investments are protected.',
                  features: [
                    'Government approved operations',
                    'Secure payment gateways',
                    'Regular audits',
                    'Data encryption'
                  ]
                },
                {
                  icon: Smartphone,
                  title: 'Digital First',
                  description: 'Manage your chit funds easily through our modern digital platform.',
                  features: [
                    'Mobile app access',
                    'Online payments',
                    'Digital documentation',
                    'Real-time updates'
                  ]
                },
                {
                  icon: TrendingUp,
                  title: 'High Returns',
                  description: 'Maximize your savings with competitive returns and flexible schemes.',
                  features: [
                    'Multiple scheme options',
                    'Competitive interest rates',
                    'Flexible payment terms',
                    'Early withdrawal options'
                  ]
                },
                {
                  icon: Users,
                  title: 'Community Trust',
                  description: 'Join a growing community of satisfied members building wealth together.',
                  features: [
                    '50,000+ active members',
                    'Transparent operations',
                    'Community support',
                    'Success stories'
                  ]
                },
                {
                  icon: Globe,
                  title: 'Accessibility',
                  description: 'Access your investments anytime, anywhere with our digital platform.',
                  features: [
                    '24/7 account access',
                    'Multi-device support',
                    'Seamless experience',
                    'Quick support'
                  ]
                },
                {
                  icon: Award,
                  title: 'Expert Management',
                  description: 'Professional team with years of experience in chit fund management.',
                  features: [
                    'Experienced team',
                    'Professional support',
                    'Transparent process',
                    'Regular updates'
                  ]
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                How Mana Chit Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Simple steps to start your investment journey with us
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: 'Register & Verify',
                  description: 'Create your account and complete the verification process with your KYC documents.',
                  icon: Users
                },
                {
                  step: 2,
                  title: 'Choose Your Scheme',
                  description: 'Select from our various chit fund schemes based on your financial goals.',
                  icon: CreditCard
                },
                {
                  step: 3,
                  title: 'Make Payments',
                  description: 'Pay your monthly installments securely through our digital platform.',
                  icon: PiggyBank
                },
                {
                  step: 4,
                  title: 'Grow Your Wealth',
                  description: 'Participate in auctions, win bids, or earn dividends from your investment.',
                  icon: TrendingUp
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                    <item.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-center">
                    <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-semibold mb-4 mx-auto">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-20 left-full w-full transform -translate-x-1/2">
                      <div className="border-t-2 border-dashed border-primary-200 dark:border-primary-800 w-full" />
                      <ChevronRight className="absolute top-1/2 right-0 transform -translate-y-1/2 text-primary-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Button size="lg" className="hover:scale-105 transition" asChild>
                <Link to="/auth/register">Start Your Journey</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Benefits of Choosing Mana Chit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the advantages of our modern chit fund management system
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Higher Returns',
                  description: 'Earn better returns compared to traditional savings accounts and fixed deposits.',
                  benefits: [
                    'Competitive interest rates',
                    'Dividend sharing',
                    'Bonus rewards',
                    'Early bid benefits'
                  ],
                  icon: TrendingUp
                },
                {
                  title: 'Flexible Terms',
                  description: 'Choose from various schemes that suit your financial capacity and goals.',
                  benefits: [
                    'Multiple tenure options',
                    'Customizable payments',
                    'Easy transfers',
                    'Emergency withdrawal'
                  ],
                  icon: CreditCard
                },
                {
                  title: 'Digital Convenience',
                  description: 'Manage your chit funds easily through our user-friendly digital platform.',
                  benefits: [
                    'Online transactions',
                    'Mobile app access',
                    'Automated reminders',
                    'Digital documentation'
                  ],
                  icon: Smartphone
                },
                {
                  title: 'Complete Security',
                  description: 'Your investments are protected by multiple layers of security and compliance.',
                  benefits: [
                    'Government regulated',
                    'Secure payments',
                    'Data encryption',
                    'Regular audits'
                  ],
                  icon: Shield
                },
                {
                  title: 'Expert Support',
                  description: 'Get assistance from our experienced team whenever you need it.',
                  benefits: [
                    '24/7 support',
                    'Financial advice',
                    'Dedicated manager',
                    'Regular updates'
                  ],
                  icon: Users
                },
                {
                  title: 'Community Benefits',
                  description: 'Be part of a growing community and enjoy exclusive member benefits.',
                  benefits: [
                    'Member rewards',
                    'Referral bonuses',
                    'Special events',
                    'Networking opportunities'
                  ],
                  icon: Star
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <benefit.icon className="w-12 h-12 text-primary-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {benefit.description}
                  </p>
                  <ul className="space-y-2">
                    {benefit.benefits.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Button 
                size="lg" 
                variant="default"
                className="hover:scale-105 transition"
                asChild
              >
                <Link to="/eligibility">Check Your Eligibility</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                About Mana Chit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Building trust through transparency and innovation since 2020
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  At Mana Chit, we're committed to revolutionizing traditional chit funds through technology 
                  while maintaining the trust and security that our members expect. Our mission is to make 
                  financial growth accessible to everyone through transparent, secure, and innovative chit fund management.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: '50K+', label: 'Active Members' },
                    { number: '₹100Cr+', label: 'Total Disbursed' },
                    { number: '100+', label: 'Active Groups' },
                    { number: '4.8/5', label: 'User Rating' }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-primary-600">{stat.number}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Why Choose Us</h3>
                {[
                  {
                    title: 'Government Regulated',
                    description: 'Fully compliant with all regulatory requirements and government guidelines.'
                  },
                  {
                    title: 'Digital First Approach',
                    description: 'Modern platform with mobile apps and digital documentation for convenience.'
                  },
                  {
                    title: 'Experienced Team',
                    description: 'Backed by professionals with decades of experience in financial services.'
                  },
                  {
                    title: 'Customer Centric',
                    description: '24/7 support and dedicated relationship managers for all members.'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We're here to help you with any questions about our chit fund schemes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Information</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Phone, label: 'Call Us', value: '+91 98765 43210', subtext: '24/7 Support Available' },
                      { icon: Mail, label: 'Email Us', value: 'support@manachit.com', subtext: 'Response within 24 hours' },
                      { icon: MapPin, label: 'Visit Us', value: '123 Main Street, Financial District', subtext: 'Hyderabad, Telangana - 500032' }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                          <item.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                          <div className="text-gray-600 dark:text-gray-300">{item.value}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.subtext}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Office Hours</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send us a Message</h3>
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" className="h-32" />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </motion.div>
                  </div>
                </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={fadeIn}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Financial Journey?</h2>
              <p className="mb-8 text-white/90">Join thousands of satisfied members in our trusted chit fund schemes</p>
              <Button asChild size="lg" variant="secondary" className="hover:scale-105 transition">
                <Link to="/eligibility">Check Your Eligibility Now</Link>
              </Button>
            </motion.div>
        </div>
      </section>

        {/* Learn More Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Welcome to Mana Chit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Mana Chit is a leading chit fund management company that combines traditional chit fund
                benefits with modern technology and management practices. We offer:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Multiple chit fund schemes to suit your needs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Fully digital and transparent operations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Government regulated and compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Professional customer support</span>
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link to="/eligibility" onClick={() => setIsDialogOpen(false)}>
                    Check Your Eligibility
                  </Link>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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

      {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
                <Link to="/" className="flex items-center space-x-2 mb-6">
                  <PiggyBank className="h-8 w-8 text-primary-400" />
                  <span className="text-2xl font-bold">Mana Chit</span>
                </Link>
                <p className="text-gray-400 mb-6">
                  Transforming traditional chit funds with modern technology and trust.
              </p>
              <div className="flex space-x-4">
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                    <a
                      key={social}
                      href={`#${social}`}
                      className="text-gray-400 hover:text-white transition"
                    >
                      <span className="sr-only">{social}</span>
                      {/* Add social icons here */}
                    </a>
                  ))}
              </div>
            </div>
            
            <div>
                <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition"
                        onClick={(e) => handleNavClick(e, link.href)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div>
                <h4 className="text-lg font-semibold mb-6">Legal</h4>
                <ul className="space-y-4">
                  {[
                    { name: 'Privacy Policy', href: '#' },
                    { name: 'Terms of Service', href: '#' },
                    { name: 'Cookie Policy', href: '#' },
                    { name: 'Disclaimer', href: '#' }
                  ].map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div>
                <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
                <p className="text-gray-400 mb-4">
                  Subscribe to our newsletter for updates and insights.
                </p>
                <form className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button className="w-full">Subscribe</Button>
                </form>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} Mana Chit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default LandingPage;