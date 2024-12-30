import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-pana-purple">Contactez-nous</h2>
        <p className="text-gray-600">
          Pour toute question ou suggestion, n'hésitez pas à nous contacter.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="text-pana-red" />
            <span>contact@panaradio.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-pana-red" />
            <span>+221 00 000 00 00</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-pana-red" />
            <span>Dakar, Sénégal</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input placeholder="Nom" required />
        <Input type="email" placeholder="Email" required />
        <Input placeholder="Sujet" required />
        <Textarea placeholder="Message" className="h-32" required />
        <Button type="submit" className="w-full bg-pana-red hover:bg-pana-purple">
          Envoyer
        </Button>
      </form>
    </div>
  );
};

export default Contact;