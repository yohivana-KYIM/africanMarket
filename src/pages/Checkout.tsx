import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';

const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const [isPaying, setIsPaying] = useState(false);
  const [phone, setPhone] = useState('');
  const delivery = useMemo(() => (subtotal >= 50000 || subtotal === 0 ? 0 : 2000), [subtotal]);
  const total = subtotal + delivery;

  const handlePay = async () => {
    const normalized = phone.replace(/\s|-/g, '');
    if (!/^\+?\d{8,15}$/.test(normalized)) {
      alert('Merci de saisir un numéro de téléphone valide.');
      return;
    }
    setIsPaying(true);

    const orderLines = items.map(it => `- ${it.name} x${it.quantity} = ${new Intl.NumberFormat('fr-FR').format(it.price * it.quantity)} FCFA`).join('%0A');
    const message = encodeURI(
      `Bonjour AFRICA MARKET 🛍️💰,%0A` +
      `Je souhaite commander:%0A${orderLines}%0A` +
      `Sous-total: ${new Intl.NumberFormat('fr-FR').format(subtotal)} FCFA%0A` +
      `Livraison: ${delivery === 0 ? 'Gratuite' : new Intl.NumberFormat('fr-FR').format(delivery) + ' FCFA'}%0A` +
      `Total: ${new Intl.NumberFormat('fr-FR').format(total)} FCFA%0A` +
      `Mon téléphone: ${normalized}`
    );

    const whatsappNumber = '237671178991';
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');

    await new Promise(r => setTimeout(r, 400));
    clear();
    setIsPaying(false);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Paiement</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          {items.length === 0 && (
            <div className="p-6 border rounded-lg text-center text-muted-foreground">Votre panier est vide.</div>
          )}
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">Qté: {item.quantity}</div>
              </div>
              <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </section>

        <aside className="p-6 border rounded-xl h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Résumé</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Votre numéro de téléphone</label>
            <Input
              placeholder="Ex: +237 6xx xx xx xx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Livraison</span><span>{delivery === 0 ? 'Gratuite' : formatPrice(delivery)}</span></div>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <Button onClick={handlePay} disabled={items.length === 0 || isPaying || phone.trim() === ''} className="w-full mt-6 bg-primary hover:bg-primary-dark">
            {isPaying ? 'Envoi WhatsApp...' : 'commander'}
          </Button>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;


