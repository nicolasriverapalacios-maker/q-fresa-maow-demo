const toggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); }
toggle.addEventListener('click', () => { const open = navigation.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
const cards = [...document.querySelectorAll('[data-category]')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'todo' && card.dataset.category !== button.dataset.filter; });
  document.querySelector('#filter-status').textContent = `${cards.filter(card => !card.hidden).length} categorías visibles`;
}));
document.body.classList.add('loaded');

const orderSection = document.querySelector('#pedido');
const orderForm = document.querySelector('#order-form');
const orderPreview = document.querySelector('#order-preview');
const orderStatus = document.querySelector('#order-status');
const orderItems = [['fresas', 'Fresas con crema'], ['bebidas', 'Bebidas'], ['antojos', 'Antojos']];
function selectedItems() {
  return orderItems.map(([key, label]) => {
    const quantity = Number(orderForm.elements[key].value);
    return { label, quantity: Number.isInteger(quantity) && quantity >= 0 && quantity <= 99 ? quantity : -1 };
  });
}
function updateOrderPreview() {
  const lines = selectedItems().filter(item => item.quantity > 0).map(item => `${item.quantity} × ${item.label}`);
  orderPreview.textContent = lines.length ? lines.join('\n') : 'Aún no has elegido productos.';
  orderStatus.textContent = '';
}
orderForm.addEventListener('input', updateOrderPreview);
orderForm.addEventListener('submit', event => {
  event.preventDefault();
  const items = selectedItems();
  if (items.some(item => item.quantity < 0)) { orderStatus.textContent = 'Revisa las cantidades: usa números enteros de 0 a 99.'; return; }
  const lines = items.filter(item => item.quantity > 0).map(item => `${item.quantity} × ${item.label}`);
  if (!lines.length) { orderStatus.textContent = 'Elige al menos un producto para preparar tu pedido.'; return; }
  const phone = orderSection.dataset.whatsapp;
  if (!/^\d{10,15}$/.test(phone)) { orderStatus.textContent = 'Esta demo aún no envía pedidos: falta conectar el WhatsApp de pedidos del negocio.'; return; }
  const details = orderForm.elements.details.value.trim();
  const message = `Hola, Q Fresa Maow. Quiero consultar este pedido:\n${lines.join('\n')}${details ? `\nDetalles: ${details}` : ''}\n¿Me confirman disponibilidad y total?`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  orderStatus.textContent = 'Se abrió WhatsApp con tu pedido listo para enviar. Revisa el mensaje antes de enviarlo.';
});
