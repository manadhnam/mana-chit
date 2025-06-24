import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const EligibilityCheck = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    income: '',
    employment: 'salaried',
    mobile: '',
  });

  const [result, setResult] = useState<{
    isEligible: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic eligibility criteria
    const age = parseInt(formData.age);
    const income = parseInt(formData.income);
    
    const isEligible = age >= 21 && age <= 58 && income >= 15000;
    
    setResult({
      isEligible,
      message: isEligible 
        ? "Congratulations! You are eligible to apply for our chit funds. Our representative will contact you soon."
        : "We're sorry, but you don't meet the eligibility criteria at this time. Please contact our support for more information."
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Check Your Eligibility</CardTitle>
        <CardDescription>
          Fill in your details to check if you're eligible for our chit fund schemes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="Enter your age"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Monthly Income (₹)</Label>
            <Input
              id="income"
              type="number"
              required
              value={formData.income}
              onChange={(e) => setFormData({ ...formData, income: e.target.value })}
              placeholder="Enter your monthly income"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employment">Employment Type</Label>
            <Select
              value={formData.employment}
              onValueChange={(value) => setFormData({ ...formData, employment: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salaried">Salaried</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
                <SelectItem value="business">Business Owner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="Enter your mobile number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
            />
          </div>

          <Button type="submit" className="w-full">Check Eligibility</Button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${result.isEligible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <p className="text-sm font-medium">{result.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 