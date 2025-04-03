import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DNATestModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionId?: number;
}

// Form validation schema
const dnaTestFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number with country code." }),
  postalCode: z.string().min(5, { message: "Please enter a valid PIN code." })
});

type DNATestFormValues = z.infer<typeof dnaTestFormSchema>;

const DNATestModal = ({ isOpen, onClose, predictionId }: DNATestModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<DNATestFormValues>({
    resolver: zodResolver(dnaTestFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      postalCode: ""
    }
  });

  const dnaTestMutation = useMutation({
    mutationFn: async (data: DNATestFormValues & { predictionId?: number }) => {
      // Create payload with all required fields from the backend
      const payload = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        postalCode: data.postalCode,
        predictionId: predictionId || 1, // Fallback to ID 1 if no prediction ID is provided
        // Use empty strings for required fields that we're not collecting
        address: "",
        city: "",
        state: "",
        kitType: "standard",
        status: "ordered",
        orderedAt: new Date().toISOString()
      };
      
      return apiRequest<{ id: number, message: string }>("/api/dna-tests", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your DNA test kit request has been received!",
      });
    },
    onError: (error) => {
      console.error("Error submitting DNA test request:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: DNATestFormValues) => {
    dnaTestMutation.mutate({
      ...data,
      predictionId
    });
  };

  const resetForm = () => {
    form.reset();
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Order DNA Test Kit</h3>
          <button
            type="button"
            onClick={resetForm}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName"
                  {...form.register("fullName")}
                  placeholder="Enter your full name"
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="you@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number with Country Code</Label>
                <Input 
                  id="phoneNumber"
                  type="tel"
                  {...form.register("phoneNumber")}
                  placeholder="+91 9876543210"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">PIN Code</Label>
                <Input 
                  id="postalCode"
                  {...form.register("postalCode")}
                  placeholder="Your PIN code"
                />
                {form.formState.errors.postalCode && (
                  <p className="text-sm text-red-500">{form.formState.errors.postalCode.message}</p>
                )}
              </div>
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={dnaTestMutation.isPending}
                >
                  {dnaTestMutation.isPending ? "Submitting..." : "Request DNA Test Kit"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thank You for Your Request!</h3>
              <p className="text-gray-600 mb-4">
                We've received your DNA test order request. Our representative will contact you soon via email and phone to provide further details and guide you through the next steps.
              </p>
              <p className="text-gray-600 mb-4">
                For any urgent queries, feel free to reach out to our support team.
              </p>
              <p className="text-gray-600 mb-6">
                We look forward to helping you discover more about your dog!
              </p>
              <Button onClick={resetForm} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DNATestModal;