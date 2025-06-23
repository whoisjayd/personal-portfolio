"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Github, Linkedin } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";

const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must not exceed 50 characters." })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, hyphens, and apostrophes." }),
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must not exceed 100 characters." }),
  subject: z.string()
    .min(3, { message: "Subject must be at least 3 characters." })
    .max(100, { message: "Subject must not exceed 100 characters." }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(500, { message: "Message must not exceed 500 characters." }),
});

type FormData = z.infer<typeof formSchema>;

interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export function ContactApp() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onChange", // Provide real-time validation feedback
  });

  // Memoize watched values to prevent unnecessary re-renders
  const messageValue = form.watch("message");
  const messageLength = useMemo(() => messageValue?.length || 0, [messageValue]);

  // Validate email configuration on mount
  useEffect(() => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setConfigError("Missing environment variables");
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Email service is not configured. Please use alternative contact methods.",
      });
      return;
    }

    if (serviceId === "YOUR_SERVICE_ID" || templateId === "YOUR_TEMPLATE_ID" || publicKey === "YOUR_PUBLIC_KEY") {
      setConfigError("Default placeholder values detected");
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Email service uses placeholder values. Please contact me via social media.",
      });
      return;
    }

    setEmailConfig({ serviceId, templateId, publicKey });
  }, [toast]);

  // Memoize submit handler to prevent recreating on every render
  const onSubmit = useCallback(async (values: FormData) => {
    if (!emailConfig) {
      toast({
        variant: "destructive",
        title: "Unable to Send",
        description: "Email service is not configured. Please try another contact method.",
      });
      return;
    }

    setIsSubmitting(true);

    // Sanitize input data
    const templateParams = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      title: values.subject.trim(),
      to_name: "Jaydeep Solanki",
      message: values.message.trim(),
      reply_to: values.email.trim().toLowerCase(),
    };

    try {
      const response = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

      if (response.status === 200) {
        toast({
          title: "Message Sent Successfully! ✨",
          description: "Thank you for reaching out. I'll get back to you soon!",
        });
        form.reset();
      } else {
        throw new Error(`EmailJS returned status: ${response.status}`);
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      
      // More specific error handling
      const errorMessage = error instanceof Error 
        ? error.message.includes('network') 
          ? "Network error. Please check your connection and try again."
          : "Failed to send message. Please try again later."
        : "An unexpected error occurred. Please try again.";

      toast({
        variant: "destructive",
        title: "Error Sending Message",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [emailConfig, toast, form]);

  const isFormDisabled = isSubmitting || !emailConfig;

  return (
    <motion.div
      className="max-w-3xl mx-auto w-full"
      aria-labelledby="contact-heading"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.header variants={itemVariants} className="mb-12 text-center">
        <h1
          id="contact-heading"
          className="text-4xl sm:text-5xl font-extrabold text-primary mb-4"
        >
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Have a question, idea, or project? Let's connect and bring your vision to life!
        </p>
      </motion.header>

      {/* Form Section */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        disabled={isFormDisabled}
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Email *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        disabled={isFormDisabled}
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Subject *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What would you like to discuss?"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      disabled={isFormDisabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Message *
                    </FormLabel>
                    <span 
                      className={`text-xs transition-colors ${
                        messageLength > 450 ? 'text-destructive' : 'text-muted-foreground'
                      }`}
                      aria-live="polite"
                    >
                      {messageLength}/500
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Tell me about your project, idea, or question. I'd love to hear from you!"
                      className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px]"
                      rows={6}
                      disabled={isFormDisabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-base font-medium transition-all duration-200 hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isFormDisabled}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Form>
      </motion.div>

      {/* Alternative Contact Methods */}
      <motion.div variants={itemVariants} className="mt-8 text-center">
        <p className="text-base text-muted-foreground mb-6">
          {configError ? "Email service unavailable? " : "Prefer social media? "}
          Connect with me on:
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="https://github.com/whoisjayd"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 group"
            aria-label="Visit my GitHub profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/solanki-jaydeep"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 group"
            aria-label="Visit my LinkedIn profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            LinkedIn
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
