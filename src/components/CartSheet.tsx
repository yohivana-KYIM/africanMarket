import { useMemo } from 'react';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';

const CartSheet = ({ children }: { children: React.ReactNode }) => {
  const { items, subtotal, increment, decrement, removeItem, totalQuantity, clear } = useCart();

  const delivery = useMemo(() => (subtotal >= 50000 || subtotal === 0 ? 0 : 2000), [subtotal]);
  const total = subtotal + delivery;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-[92vw] max-w-[720px] sm:w-[88vw] md:w-[560px] lg:w-[640px]">
        <SheetHeader>
          <SheetTitle>Mon Panier ({totalQuantity})</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4 overflow-y-auto max-h-[60vh] pr-1 sm:pr-2">
          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-12">Votre panier est vide.</div>
          )}

          {items.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start border-b pb-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
              <div className="flex-1 w-full">
                <div className="font-medium text-foreground line-clamp-2">{item.name}</div>
                <div className="text-sm text-muted-foreground">{formatPrice(item.price)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => decrement(item.id)}>-</Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => increment(item.id)}>+</Button>
                </div>
              </div>                                                                                                                                                                                                                                                                                                                                                                                              
              <div className="flex sm:flex-col items-end sm:items-end gap-2 w-full sm:w-auto justify-between">
                <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>Retirer</Button>
              </div>
            </div>
          ))}
        </div>                                             

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Livraison</span>
            <span>{delivery === 0 ? 'Gratuite' : formatPrice(delivery)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <SheetFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={clear} disabled={items.length === 0}>Vider</Button>
          <SheetClose asChild>
            <Button asChild disabled={items.length === 0} className="flex-1 bg-primary hover:bg-primary-dark">
              <Link to="/checkout">voir le details de commande</Link>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;


