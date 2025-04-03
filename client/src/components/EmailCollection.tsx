import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const emailFormSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, { message: 'Email must be at least 5 characters long' })
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

interface EmailCollectionProps {
  onSubmit: (email: string) => void;
}

const EmailCollection = ({ onSubmit }: EmailCollectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: ''
    }
  });

  const handleSubmit = async (data: EmailFormValues) => {
    setIsSubmitting(true);
    try {
      // Here you could validate the email with an API call if desired
      onSubmit(data.email);
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
        See Your Complete Results
      </h2>
      
      <p className="text-gray-600 mb-6 text-center">
        Please enter your email to view your dog's complete breed analysis report and personalized care recommendations.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your.email@example.com" 
                    {...field} 
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-2 font-semibold text-white transition duration-200 ease-in-out transform hover:scale-105"
          >
            {isSubmitting ? 'Submitting...' : 'View Full Report'}
          </Button>
        </form>
      </Form>
      
      <p className="mt-4 text-xs text-gray-500 text-center">
        We respect your privacy. Your email will be used only to send your analysis report and related updates.
      </p>
    </div>
  );
};

export default EmailCollection;