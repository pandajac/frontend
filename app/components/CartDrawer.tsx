'use client'

import { useCart } from '@/app/providers/CartProvider'
import { ShoppingBag, X, ShoppingCart, Minus, Plus, Trash2, MessageSquare } from 'lucide-react'

export function CartDrawer() {
  const { 
    cart, 
    isOpen, 
    totalItems, 
    totalPrice, 
    removeFromCart, 
    updateQuantity,
    closeCart 
  } = useCart()

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    let message = "⬛ *NUEVA COTIZACIÓN PANDAJAC*\n\nMe interesa adquirir las siguientes piezas en liquidación:\n\n"
    
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.descripcion} \n  └ Ref: ${item.referencia || 'N/A'} - ${formatMoney(item.costo_unidad * item.quantity)}\n\n`
    })
    
    message += `*Total Estimado:* ${formatMoney(totalPrice)}\n\n`
    message += "¿Podemos coordinar la entrega?"

    const phoneNumber = "1234567890"
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank')
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-gray-50 border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-black text-black flex items-center gap-3 tracking-wide">
            <ShoppingBag className="w-6 h-6 text-black" /> TU COTIZACIÓN
          </h2>
          <button 
            onClick={closeCart}
            className="text-gray-400 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Items */}
        <div className="flex-grow p-6 overflow-y-auto no-scrollbar space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-medium text-gray-500">No hay repuestos seleccionados</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-white p-4 border border-gray-200 rounded-xl fade-in shadow-sm">
                <div className="flex-grow">
                  <p className="text-xs font-bold text-black leading-tight mb-1 uppercase">{item.descripcion}</p>
                  <p className="text-[10px] text-gray-500 font-mono font-medium">REF: {item.referencia || 'N/A'}</p>
                  <p className="text-sm font-black text-black mt-2">{formatMoney(item.costo_unidad)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black bg-white border border-gray-200 rounded shadow-sm transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-8 text-center text-black">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-black bg-white border border-gray-200 rounded shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-[10px] text-gray-400 hover:text-black uppercase tracking-wider flex items-center gap-1 font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-medium">Subtotal Estimado:</span>
            <span className="text-3xl font-black text-black">{formatMoney(totalPrice)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="w-full bg-black text-white font-bold py-4 px-4 rounded-xl hover:bg-gray-800 transition-colors duration-200 flex justify-center items-center gap-2 shadow-md"
          >
            <MessageSquare className="w-6 h-6" /> Solicitar por WhatsApp
          </button>
          <p className="text-xs text-center text-gray-500 mt-4 font-medium leading-relaxed">
            *Precios de liquidación sujetos a disponibilidad física en almacén. <br />El pedido no incluye envío.
          </p>
        </div>
      </div>
    </>
  )
}