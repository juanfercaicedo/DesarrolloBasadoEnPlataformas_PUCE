const productForm = document.querySelector('#product-form');
const productRows = document.querySelector('#product-rows');
const searchInput = document.querySelector('#search-products');
const summaryCount = document.querySelector('#summary-count');
const summaryLabel = document.querySelector('#summary-label');
const resultCount = document.querySelector('#result-count');
const pageTitle = document.querySelector('#page-title');
const pageEyebrow = document.querySelector('#page-eyebrow');
const pageDescription = document.querySelector('#page-description');
const formTitle = document.querySelector('#form-title');
const formDescription = document.querySelector('#form-description');
const formIndex = document.querySelector('#form-index');
const submitButton = document.querySelector('#submit-button');
const cancelEditButton = document.querySelector('#cancel-edit');
const refreshButton = document.querySelector('#refresh-products');
const transactionRows = document.querySelector('#transaction-rows');
const transactionsRange = document.querySelector('#transactions-range');
const pageIndicator = document.querySelector('#page-indicator');
const previousPageButton = document.querySelector('#previous-page');
const nextPageButton = document.querySelector('#next-page');
const refreshTransactionsButton = document.querySelector('#refresh-transactions');
const productsView = document.querySelector('#products-view');
const transactionsView = document.querySelector('#transactions-view');
const viewTabs = document.querySelectorAll('.view-tab');
const toast = document.querySelector('#toast');
const priceFormatter = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD'
});

let products = [];
let editingId = null;
let toastTimer;
let activeView = 'products';
let transactionPage = 1;
let transactionTotal = 0;
let transactionTotalPages = 0;
let transactionLoading = false;
const API_BASE_URL = 'http://localhost:5051';

const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo completar la solicitud.');
  }

  return result;
};

const showToast = (message, isError = false) => {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle('is-error', isError);
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
};

const createCell = (content, className = '') => {
  const cell = document.createElement('td');
  if (className) cell.className = className;
  cell.textContent = content;
  return cell;
};

const makeActionButton = (label, className, onClick) => {
  const button = document.createElement('button');
  button.className = `row-action ${className}`.trim();
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
};

const renderProducts = () => {
  const query = searchInput.value.trim().toLocaleLowerCase('es');
  const visibleProducts = products.filter((product) => (
    `${product.nombre} ${product.categoria} ${product.id}`.toLocaleLowerCase('es').includes(query)
  ));

  productRows.replaceChildren();
  if (activeView === 'products') {
    summaryCount.textContent = String(products.length);
  }
  resultCount.textContent = query
    ? `${visibleProducts.length} de ${products.length} productos`
    : `${products.length} productos`;

  if (visibleProducts.length === 0) {
    const row = document.createElement('tr');
    const message = document.createElement('td');
    message.className = 'table-message';
    message.colSpan = 4;
    message.textContent = products.length === 0
      ? 'Aún no hay productos registrados.'
      : 'No se encontraron productos.';
    row.append(message);
    productRows.append(row);
    return;
  }

  visibleProducts.forEach((product) => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const name = document.createElement('span');
    const id = document.createElement('span');
    name.className = 'product-name';
    name.textContent = product.nombre;
    id.className = 'product-id';
    id.textContent = `ID ${product.id}`;
    nameCell.append(name, id);
    row.append(nameCell);
    row.append(createCell(product.categoria));
    row.append(createCell(priceFormatter.format(Number(product.pvp)), 'price-cell'));

    const actionsCell = document.createElement('td');
    const actions = document.createElement('div');
    actions.className = 'action-group';
    actions.append(
      makeActionButton('Editar', 'edit', () => beginEdit(product)),
      makeActionButton('Eliminar', 'delete', () => removeProduct(product))
    );
    actionsCell.append(actions);
    row.append(actionsCell);
    productRows.append(row);
  });
};

const loadProducts = async () => {
  refreshButton.disabled = true;
  try {
    const result = await request('/api/productos');
    products = result.data;
    renderProducts();
  } catch (error) {
    productRows.replaceChildren();
    const row = document.createElement('tr');
    const message = document.createElement('td');
    message.className = 'table-message';
    message.colSpan = 4;
    message.textContent = 'No se pudieron cargar los productos.';
    row.append(message);
    productRows.append(row);
    summaryCount.textContent = '—';
    resultCount.textContent = 'Error de conexión';
    showToast(error.message, true);
  } finally {
    refreshButton.disabled = false;
  }
};

const renderTransactions = (transactions) => {
  transactionRows.replaceChildren();

  if (transactions.length === 0) {
    const row = document.createElement('tr');
    const message = document.createElement('td');
    message.className = 'table-message';
    message.colSpan = 6;
    message.textContent = 'No hay transacciones para mostrar.';
    row.append(message);
    transactionRows.append(row);
    return;
  }

  transactions.forEach((transaction) => {
    const row = document.createElement('tr');
    row.append(createCell(String(transaction.id), 'transaction-id'));
    row.append(createCell(transaction.producto || '—', 'transaction-product'));
    row.append(createCell(transaction.categoria || '—'));
    row.append(createCell(priceFormatter.format(Number(transaction.monto)), 'price-cell'));

    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    const transactionStatus = String(transaction.estado || 'Sin estado');
    status.className = 'status-chip';
    if (transactionStatus.startsWith('Aprobada')) status.classList.add('status-approved');
    else if (transactionStatus.startsWith('Rechazada')) status.classList.add('status-rejected');
    else status.classList.add('status-held');
    status.textContent = transactionStatus;
    statusCell.append(status);
    row.append(statusCell);

    const createdAt = new Date(transaction.creado_en);
    const formattedDate = Number.isNaN(createdAt.getTime())
      ? '—'
      : new Intl.DateTimeFormat('es-EC', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(createdAt);
    row.append(createCell(formattedDate, 'transaction-date'));
    transactionRows.append(row);
  });
};

const loadTransactions = async (page = transactionPage) => {
  if (transactionLoading) return;
  transactionLoading = true;
  previousPageButton.disabled = true;
  nextPageButton.disabled = true;
  refreshTransactionsButton.disabled = true;
  transactionsRange.textContent = 'Cargando transacciones...';

  try {
    const result = await request(`/api/transacciones?page=${page}`);
    if (!Array.isArray(result.data) || !Number.isInteger(result.page)
        || !Number.isInteger(result.totalPages)) {
      throw new Error('Reinicia el servidor para cargar la versión paginada de transacciones.');
    }

    transactionPage = result.page;
    transactionTotal = result.total;
    transactionTotalPages = result.totalPages;
    renderTransactions(result.data);
    if (activeView === 'transactions') {
      summaryCount.textContent = String(transactionTotal);
      summaryLabel.textContent = 'transacciones';
    }
    transactionsRange.textContent = transactionTotal === 0
      ? '0 transacciones'
      : `${(transactionPage - 1) * result.perPage + 1}-${Math.min(transactionPage * result.perPage, transactionTotal)} de ${transactionTotal}`;
    pageIndicator.textContent = `Página ${transactionPage} de ${transactionTotalPages}`;
  } catch (error) {
    transactionRows.replaceChildren();
    const row = document.createElement('tr');
    const message = document.createElement('td');
    message.className = 'table-message';
    message.colSpan = 6;
    message.textContent = 'No se pudieron cargar las transacciones.';
    row.append(message);
    transactionRows.append(row);
    transactionsRange.textContent = 'Error de conexión';
    pageIndicator.textContent = 'Página —';
    showToast(error.message, true);
  } finally {
    transactionLoading = false;
    previousPageButton.disabled = transactionPage <= 1;
    nextPageButton.disabled = transactionPage >= transactionTotalPages;
    refreshTransactionsButton.disabled = false;
  }
};

const setActiveView = (view) => {
  activeView = view;
  const isTransactions = view === 'transactions';
  productsView.classList.toggle('is-hidden', isTransactions);
  transactionsView.classList.toggle('is-hidden', !isTransactions);
  viewTabs.forEach((tab) => {
    const selected = tab.dataset.view === view;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-pressed', String(selected));
  });

  pageEyebrow.textContent = isTransactions ? 'ACTIVIDAD' : 'CATÁLOGO';
  pageTitle.textContent = isTransactions ? 'Transacciones' : 'Productos';
  pageDescription.textContent = isTransactions
    ? 'Consulta el historial en páginas de 100 registros.'
    : 'Administra los productos de tu tienda.';

  if (isTransactions) {
    summaryLabel.textContent = 'transacciones';
    loadTransactions(1);
  } else {
    summaryLabel.textContent = 'productos';
    summaryCount.textContent = String(products.length);
  }
};

const resetForm = () => {
  editingId = null;
  productForm.reset();
  formTitle.textContent = 'Añadir producto';
  formDescription.textContent = 'Completa los datos del nuevo producto.';
  formIndex.textContent = '01';
  submitButton.textContent = 'Guardar producto';
  cancelEditButton.classList.add('is-hidden');
};

const beginEdit = (product) => {
  editingId = product.id;
  productForm.elements.nombre.value = product.nombre;
  productForm.elements.categoria.value = product.categoria;
  productForm.elements.pvp.value = Number(product.pvp).toFixed(2);
  formTitle.textContent = 'Editar producto';
  formDescription.textContent = `Actualiza los datos del producto #${product.id}.`;
  formIndex.textContent = '02';
  submitButton.textContent = 'Guardar cambios';
  cancelEditButton.classList.remove('is-hidden');
  document.querySelector('#nombre').focus();
};

const removeProduct = async (product) => {
  if (!window.confirm(`¿Eliminar “${product.nombre}” del catálogo?`)) return;

  try {
    await request(`/api/productos/${product.id}`, { method: 'DELETE' });
    if (editingId === product.id) resetForm();
    showToast('Producto eliminado.');
    await loadProducts();
  } catch (error) {
    showToast(error.message, true);
  }
};

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!productForm.reportValidity()) return;

  const payload = {
    nombre: productForm.elements.nombre.value.trim(),
    categoria: productForm.elements.categoria.value.trim(),
    pvp: Number(productForm.elements.pvp.value)
  };
  const isEditing = editingId !== null;
  const url = isEditing ? `/api/productos/${editingId}` : '/api/productos';

  submitButton.disabled = true;
  try {
    await request(url, {
      method: isEditing ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
    resetForm();
    showToast(isEditing ? 'Producto actualizado.' : 'Producto añadido.');
    await loadProducts();
  } catch (error) {
    showToast(error.message, true);
  } finally {
    submitButton.disabled = false;
  }
});

cancelEditButton.addEventListener('click', resetForm);
refreshButton.addEventListener('click', loadProducts);
searchInput.addEventListener('input', renderProducts);
viewTabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveView(tab.dataset.view));
});
previousPageButton.addEventListener('click', () => loadTransactions(transactionPage - 1));
nextPageButton.addEventListener('click', () => loadTransactions(transactionPage + 1));
refreshTransactionsButton.addEventListener('click', () => loadTransactions(transactionPage));

loadProducts();