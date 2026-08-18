/**
 * Borsa El Mafroshat - Legacy Entry Compatibility
 */
if (typeof BORSSA_PRODUCTS === 'undefined') {
  const scriptProducts = document.createElement('script');
  scriptProducts.src = 'js/products.js';
  document.head.appendChild(scriptProducts);

  const scriptBorssa = document.createElement('script');
  scriptBorssa.src = 'js/borssa.js';
  document.head.appendChild(scriptBorssa);
}
