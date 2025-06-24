import { EligibilityCheck } from '../components/EligibilityCheck';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export const EligibilityPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Check Your Eligibility</h1>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied members in our trusted chit fund schemes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <span className="text-2xl font-bold text-primary">98%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Customer Satisfaction Rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <span className="text-2xl font-bold text-primary">50K+</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Active Members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <span className="text-2xl font-bold text-primary">₹500Cr+</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Total Fund Value</p>
            </CardContent>
          </Card>
        </div>

        <EligibilityCheck />

        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold text-center">Why Choose Our Chit Funds?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Secure & Regulated</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our chit funds are fully regulated and comply with all government guidelines, ensuring your investments are safe and secure.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flexible Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Choose from a wide range of chit values and durations that best suit your financial goals and capabilities.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transparent Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All our operations are completely transparent with regular updates and easy-to-understand terms.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our team of financial experts is always available to guide you through your chit fund journey.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-2">
                  ★★★★★
                  <span className="ml-2 font-medium">Excellent Service</span>
                </div>
                <p className="text-gray-600">"The process was smooth and the staff was very helpful. I'm very satisfied with my investment."</p>
                <p className="mt-2 text-sm text-gray-500">- Rajesh Kumar</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-2">
                  ★★★★★
                  <span className="ml-2 font-medium">Great Experience</span>
                </div>
                <p className="text-gray-600">"Very professional team and transparent process. Highly recommended!"</p>
                <p className="mt-2 text-sm text-gray-500">- Priya Sharma</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}; 