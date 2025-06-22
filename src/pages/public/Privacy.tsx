import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <div className="text-gray-600 mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and contact information</li>
              <li>Date of birth and gender</li>
              <li>Bank account and payment details</li>
              <li>Government-issued identification</li>
              <li>Address and location information</li>
            </ul>

            <h3 className="font-medium text-gray-900 mb-2">Usage Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and preferences</li>
              <li>Transaction history</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>To provide and maintain our services</li>
            <li>To process transactions and manage accounts</li>
            <li>To communicate with you about our services</li>
            <li>To improve our platform and user experience</li>
            <li>To comply with legal obligations</li>
            <li>To prevent fraud and ensure security</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
          <p className="text-gray-600 mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Service providers and business partners</li>
            <li>Financial institutions and payment processors</li>
            <li>Legal authorities when required by law</li>
            <li>Other members of your chit group (limited information)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organizational measures to protect your
            personal information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
          <p className="text-gray-600 mb-4">
            We use cookies and similar tracking technologies to improve your experience
            on our platform. You can control cookie preferences through your browser
            settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
          <p className="text-gray-600 mb-4">
            Our services are not intended for individuals under 18 years of age. We do
            not knowingly collect personal information from children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to Privacy Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this privacy policy from time to time. We will notify you of
            any changes by posting the new policy on this page and updating the
            effective date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@manachit.com
            <br />
            Phone: +1 (800) 123-4567
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy; 