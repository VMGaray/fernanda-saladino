"use client";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  // Escuchar evento para abrir/cerrar el carrito desde el header
  useEffect(() => {
    const handleToggleCart = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggleCart', handleToggleCart);
    return () => window.removeEventListener('toggleCart', handleToggleCart);
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    setShowCheckout(true);
  };

  const handleSendOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Por favor completa tu nombre y teléfono");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("orders").insert({
      user_id: user?.id ?? null,
      customer_name: customerName,
      customer_phone: customerPhone,
      status: "pendiente",
      total: getTotalPrice(),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
      })),
    });

    // Crear mensaje para WhatsApp
    let message = `🛍️ *NUEVO PEDIDO - Fernanda Saladino*\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📱 *Teléfono:* ${customerPhone}\n\n`;
    message += `📦 *PRODUCTOS:*\n`;
    message += `━━━━━━━━━━━━━━━━\n\n`;

    cart.forEach((item) => {
      message += `▪️ *${item.name}*\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio unit: $${item.price.toLocaleString('es-AR')}\n`;
      message += `   Subtotal: $${(item.price * item.quantity).toLocaleString('es-AR')}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL: $${getTotalPrice().toLocaleString('es-AR')}*\n\n`;
    message += `_Pedido generado desde el e-commerce_`;

    const whatsappUrl = `https://wa.me/5491151818438?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');

    // Mostrar confirmación
    setOrderSent(true);

    // Limpiar carrito después de 2 segundos
    setTimeout(() => {
      clearCart();
      setShowCheckout(false);
      setOrderSent(false);
      setCustomerName("");
      setCustomerPhone("");
      setIsOpen(false);
    }, 3000);
  };

  return (
    <>
      {/* Panel lateral del carrito */}
      <div
        className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => !showCheckout && setIsOpen(false)}
        />

        {/* Panel del carrito - DESLIZA DESDE LA DERECHA */}
        <div
          className={`absolute right-0 top-0 h-full w-[90%] sm:w-[450px] bg-brand-dark border-l border-brand-accent/20 shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {!showCheckout ? (
            // Vista del carrito
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-brand-accent/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-light tracking-[0.3em] uppercase">
                    Tu Carrito
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-brand-silver hover:text-brand-accent transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-[9px] tracking-widest uppercase text-brand-silver/60 mt-2">
                  {getTotalItems()} {getTotalItems() === 1 ? "producto" : "productos"}
                </p>
              </div>

              {/* Productos */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-brand-silver tracking-widest uppercase text-xs">
                      Tu carrito está vacío
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-brand-accent/10 pb-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover border border-brand-accent/20"
                      />
                      <div className="flex-1">
                        <h3 className="text-xs tracking-wider uppercase mb-1">{item.name}</h3>
                        <p className="text-brand-accent text-sm">
                          ${item.price.toLocaleString('es-AR')}
                        </p>

                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 border border-brand-accent/30 hover:bg-brand-accent hover:text-brand-black transition-colors flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 border border-brand-accent/30 hover:bg-brand-accent hover:text-brand-black transition-colors flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer con total y checkout */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-accent/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm tracking-widest uppercase">Total</span>
                    <span className="text-2xl font-light text-brand-accent">
                      ${getTotalPrice().toLocaleString('es-AR')}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-brand-accent text-brand-black py-4 tracking-[0.3em] uppercase text-xs font-bold hover:bg-white transition-all"
                  >
                    Finalizar Pedido
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full border border-red-500/50 text-red-500 py-3 tracking-widest uppercase text-xs hover:bg-red-500/10 transition-all"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Vista de checkout
            <div className="flex flex-col h-full p-6">
              {orderSent ? (
                // Confirmación de pedido
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-light tracking-[0.3em] uppercase text-brand-accent">
                    ¡Pedido Enviado!
                  </h3>
                  <p className="text-sm tracking-wide text-brand-silver max-w-xs leading-relaxed">
                    Tu pedido fue enviado por WhatsApp. Fernanda se comunicará contigo pronto para coordinar el pago y la entrega.
                  </p>
                  <div className="text-[9px] tracking-widest uppercase text-brand-silver/60">
                    Redirigiendo...
                  </div>
                </div>
              ) : (
                // Formulario de datos del cliente
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light tracking-[0.3em] uppercase">
                      Tus Datos
                    </h2>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="text-brand-silver hover:text-brand-accent transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-silver block mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-black border-b border-brand-accent/50 p-3 outline-none focus:border-brand-accent transition-colors text-brand-light"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-silver block mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-black border-b border-brand-accent/50 p-3 outline-none focus:border-brand-accent transition-colors text-brand-light"
                        placeholder="Tu número de teléfono"
                      />
                    </div>

                    <div className="bg-brand-black/50 border border-brand-accent/10 p-4 mt-6">
                      <p className="text-[9px] tracking-wide text-brand-silver/80 leading-relaxed">
                        📱 Al confirmar, se abrirá WhatsApp con tu pedido. Fernanda se comunicará contigo para coordinar el pago y la entrega.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSendOrder}
                    className="w-full bg-brand-accent text-brand-black py-4 tracking-[0.3em] uppercase text-xs font-bold hover:bg-white transition-all mt-6"
                  >
                    Enviar Pedido por WhatsApp
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
