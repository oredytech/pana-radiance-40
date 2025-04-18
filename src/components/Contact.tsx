
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  subject: z.string().min(5, {
    message: "Le sujet doit contenir au moins 5 caractères.",
  }),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
  }),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais."
      });
      form.reset();
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-pana-purple">Contactez-nous</h2>
        <p className="text-gray-600">
          Pour toute question, suggestion ou pour prendre contact avec notre équipe, n'hésitez pas à nous écrire via ce formulaire ou à utiliser les coordonnées ci-dessous.
        </p>
        
        <div className="space-y-6 mt-8">
          <div className="flex items-center gap-4">
            <div className="bg-pana-red/10 p-3 rounded-full">
              <Mail className="text-pana-red h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <a href="mailto:contact@panaradio.com" className="text-gray-600 hover:text-pana-red transition-colors">
                contact@panaradio.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-pana-red/10 p-3 rounded-full">
              <Phone className="text-pana-red h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">Téléphone</p>
              <a href="tel:+221000000000" className="text-gray-600 hover:text-pana-red transition-colors">
                +221 00 000 00 00
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-pana-red/10 p-3 rounded-full">
              <MapPin className="text-pana-red h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">Adresse</p>
              <address className="text-gray-600 not-italic">
                PANA Radio<br />
                Dakar, Sénégal
              </address>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-semibold text-xl mb-3">Nos horaires</h3>
          <p className="text-gray-600">
            Lundi - Vendredi: 8h00 - 18h00<br />
            Samedi: 9h00 - 16h00<br />
            Dimanche: Fermé
          </p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Envoyez-nous un message</h3>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Votre email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sujet</FormLabel>
                <FormControl>
                  <Input placeholder="Sujet de votre message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Votre message" 
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-pana-red hover:bg-pana-purple transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Envoi en cours...</span>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Contact;
