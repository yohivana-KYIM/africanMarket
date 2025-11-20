import { useState } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant AFRICA MARKET 🤖 Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "";
      
      const input = inputMessage.toLowerCase();
      
      if (input.includes('mot de passe') || input.includes('password') || input.includes('connexion')) {
        botResponse = "🔐 Pour réinitialiser votre mot de passe, cliquez ici: [Réinitialiser mot de passe]. Vous recevrez un email avec les instructions.";
      } else if (input.includes('prix') || input.includes('coût') || input.includes('fcfa')) {
        botResponse = "💰 Nos prix sont en FCFA. Nous acceptons les paiements mobile money, cartes bancaires et virement. Des réductions sont disponibles !";
      } else if (input.includes('livraison') || input.includes('expédition')) {
        botResponse = "🚚 Livraison gratuite à partir de 50,000 FCFA ! Délai: 2-5 jours en ville, 5-10 jours hors ville. Suivi en temps réel disponible.";
      } else if (input.includes('contact') || input.includes('téléphone')) {
        botResponse = "📞 Contactez-nous au +237 6 51 71 15 45 ou par email: contact@africamarket.com. Support disponible 8h-20h.";
      } else if (input.includes('produit') || input.includes('article')) {
        botResponse = "🛍️ Nous avons plus de 1000 produits ! Électronique, mode, beauté, sport... Utilisez nos filtres pour trouver ce que vous cherchez.";
      } else if (input.includes('retour') || input.includes('remboursement')) {
        botResponse = "↩️ Retours gratuits sous 30 jours ! Produit défectueux ? Remboursement complet. Contactez le support pour initier un retour.";
      } else {
        const responses = [
          "Merci pour votre question ! Pouvez-vous être plus précis ? Je peux vous aider avec: commandes, livraisons, prix, produits, mot de passe...",
          "Je suis là pour vous aider ! 😊 Dites-moi ce que vous recherchez ou tapez 'menu' pour voir toutes les options.",
          "Excellente question ! Pour une aide personnalisée, contactez notre équipe au +237 6 51 71 15 45 ou continuez à me poser vos questions ici."
        ];
        botResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickActions = [
    "💰 Voir les prix",
    "🚚 Info livraison", 
    "🔐 Mot de passe oublié",
    "📞 Nous contacter"
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 bg-primary hover:bg-primary-dark shadow-warm animate-glow"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] shadow-2xl border-2 border-primary/20">
          <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Assistant AFRICA MARKET</div>
                  <div className="text-sm text-primary-foreground/80 flex items-center gap-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    En ligne
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-light/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-[400px] p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    <div className="text-sm">{message.text}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground text-center">
                    Actions rapides:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action}
                        size="sm"
                        variant="outline"
                        className="text-xs h-8"
                        onClick={() => setInputMessage(action)}
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-primary hover:bg-primary-dark"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;