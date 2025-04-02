import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
const Contact = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1000);
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 px-0">
        <h3 className="text-xl font-semibold mb-4">Envoyez-nous un message</h3>
        
        <div className="space-y-4">
          <div>
            <Input name="name" placeholder="Votre nom" value={formData.name} onChange={handleChange} required className="border-gray-300 focus:border-pana-purple" />
          </div>
          
          <div>
            <Input name="email" type="email" placeholder="Votre email" value={formData.email} onChange={handleChange} required className="border-gray-300 focus:border-pana-purple" />
          </div>
          
          <div>
            <Input name="subject" placeholder="Sujet" value={formData.subject} onChange={handleChange} required className="border-gray-300 focus:border-pana-purple" />
          </div>
          
          <div>
            <Textarea name="message" placeholder="Votre message" value={formData.message} onChange={handleChange} className="h-32 border-gray-300 focus:border-pana-purple" required />
          </div>
        </div>
        
        <Button type="submit" className="w-full bg-pana-red hover:bg-pana-purple transition-colors" disabled={isSubmitting}>
          {isSubmitting ? <>
              <span className="animate-pulse">Envoi en cours...</span>
            </> : <>
              <Send className="h-4 w-4 mr-2" />
              Envoyer le message
            </>}
        </Button>
      </form>
    </div>;
};
export default Contact;