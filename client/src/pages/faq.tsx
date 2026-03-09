import { useAuth } from "@/store/use-auth";
import { useFaqs, useCreateFaq, useQuestions, useCreateQuestion } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MessageCircleQuestion, Plus, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export function FAQPage() {
  const { role, user } = useAuth();
  const { data: faqs } = useFaqs();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const mockFaqs = [
    { id: 1, question: "Comment demander une attestation de travail ?", answer: "Allez dans la section 'Demandes & Congés', cliquez sur 'Nouvelle Demande', sélectionnez 'Document' et choisissez l'attestation de travail." },
    { id: 2, question: "Quel est le délai de remboursement des frais de mission ?", answer: "Les frais sont généralement remboursés dans un délai de 15 jours ouvrables après la validation du rapport de mission." },
    { id: 3, question: "Comment réinitialiser mon mot de passe intranet ?", answer: "Veuillez contacter le support IT au poste 4000 ou créer un ticket via le portail Helpdesk global." },
  ];

  const displayFaqs = faqs?.length ? faqs : mockFaqs;
  const filteredFaqs = displayFaqs.filter(f => f.question.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500 pt-4">
      <div className="text-center space-y-4">
        <div className="mx-auto h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
          <MessageCircleQuestion className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Comment pouvons-nous aider ?</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trouvez rapidement des réponses aux questions les plus fréquentes concernant les ressources humaines et les procédures internes.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mt-8 shadow-xl shadow-primary/5 rounded-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          className="w-full pl-12 h-14 rounded-2xl text-lg border-slate-200 focus-visible:ring-primary/20 bg-white"
          placeholder="Rechercher une question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {(role === 'admin' || role === 'hr') && (
        <div className="flex justify-end max-w-2xl mx-auto">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5">
                <Plus className="h-4 w-4 mr-2" /> Ajouter une FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <AddFaqForm onSuccess={() => setIsAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="max-w-2xl mx-auto pt-6">
        {filteredFaqs.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">Aucun résultat trouvé pour "{search}"</div>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`} className="bg-white border rounded-xl px-6 enterprise-shadow">
                <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-primary hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

function AddFaqForm({ onSuccess }: { onSuccess: () => void }) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const { mutate, isPending } = useCreateFaq();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ question: q, answer: a }, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Nouvelle Question FAQ</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Question</label>
          <Input required value={q} onChange={e => setQ(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Réponse</label>
          <Textarea required value={a} onChange={e => setA(e.target.value)} className="rounded-xl min-h-[100px]" />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onSuccess}>Annuler</Button>
        <Button type="submit" disabled={isPending} className="bg-primary">Enregistrer</Button>
      </DialogFooter>
    </form>
  );
}
