import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using Mana Chit, you agree to be bound by these Terms and Conditions.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-600 mb-4">
            Mana Chit provides a platform for managing chit funds, including group formation,
            payment processing, and auction management. Our services are subject to change
            without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Provide accurate and complete information during registration</li>
            <li>Maintain the security of your account credentials</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Make timely payments as per the chit group schedule</li>
            <li>Participate in group activities and meetings as required</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
          <p className="text-gray-600 mb-4">
            All payments must be made through the approved payment methods. Late payments
            may incur penalties as per the group's rules. Refunds are subject to the
            group's policies and applicable laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
          <p className="text-gray-600 mb-4">
            We collect and process personal data in accordance with our Privacy Policy.
            By using our services, you consent to such processing and warrant that all
            data provided by you is accurate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
          <p className="text-gray-600 mb-4">
            All content, features, and functionality of Mana Chit are owned by us and
            are protected by international copyright, trademark, and other intellectual
            property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            Mana Chit shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of or inability
            to use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify these terms at any time. We will notify users
            of any material changes via email or through the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
          <p className="text-gray-600 mb-4">
            For any questions regarding these Terms and Conditions, please contact us at:
            <br />
            Email: legal@manachit.com
            <br />
            Phone: +1 (800) 123-4567
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms; 