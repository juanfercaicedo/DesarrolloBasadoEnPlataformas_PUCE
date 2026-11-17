const assert = require('node:assert/strict');
const path = require('node:path');
const { after, test } = require('node:test');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const testDatabaseUrl = process.env.DATABASE_URL;
const testDatabase = testDatabaseUrl ? new URL(testDatabaseUrl) : null;
const testDatabaseName = testDatabase?.pathname.slice(1) || '';
const isLocalTestDatabase = testDatabase
  && ['localhost', '127.0.0.1', '::1'].includes(testDatabase.hostname)
  && testDatabaseName.endsWith('_test');

if (process.env.NODE_ENV !== 'test' || !isLocalTestDatabase) {
  throw new Error('API tests require NODE_ENV=test and a local DATABASE_URL whose database name ends in _test.');
}

const request = require('supertest');
const app = require('../src/app');
const database = require('../src/config/databaseSingleton');

after(async () => {
  await database.client.$disconnect();
});

test('health endpoint confirms database availability', async () => {
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('product API validates inputs and performs isolated CRUD', async () => {
  const suffix = `${Date.now()}-${process.pid}`;
  const product = {
    nombre: `CI producto ${suffix}`,
    categoria: 'Pruebas automatizadas',
    pvp: 12.34
  };

  const invalidCreate = await request(app)
    .post('/api/productos')
    .send({ nombre: '', categoria: 'Pruebas', pvp: -1 });
  assert.equal(invalidCreate.status, 400);

  const create = await request(app).post('/api/productos').send(product);
  assert.equal(create.status, 201);
  assert.equal(create.body.status, 'success');
  assert.equal(create.body.data.nombre, product.nombre);
  const { id } = create.body.data;

  try {
    const list = await request(app).get('/api/productos');
    assert.equal(list.status, 200);
    assert.ok(list.body.data.some((entry) => entry.id === id));

    const read = await request(app).get(`/api/productos/${id}`);
    assert.equal(read.status, 200);
    assert.equal(read.body.data.id, id);

    const missing = await request(app).get('/api/productos/999999999');
    assert.equal(missing.status, 404);

    const update = await request(app)
      .put(`/api/productos/${id}`)
      .send({ ...product, nombre: `${product.nombre} actualizado`, pvp: 20 });
    assert.equal(update.status, 200);
    assert.equal(update.body.data.pvp, 20);

    const remove = await request(app).delete(`/api/productos/${id}`);
    assert.equal(remove.status, 200);

    const afterDelete = await request(app).get(`/api/productos/${id}`);
    assert.equal(afterDelete.status, 404);
  } finally {
    await database.client.producto.deleteMany({ where: { id } });
  }
});

test('transaction endpoint validates pagination', async () => {
  const invalid = await request(app).get('/api/transacciones?page=0');
  assert.equal(invalid.status, 400);

  const valid = await request(app).get('/api/transacciones?page=1');
  assert.equal(valid.status, 200);
  assert.equal(valid.body.page, 1);
  assert.equal(valid.body.perPage, 100);
  assert.ok(Array.isArray(valid.body.data));
});

test('unknown paths return the documented JSON 404', async () => {
  const response = await request(app).get('/not-a-route');

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    status: 'error',
    message: 'Ruta no encontrada.'
  });
});

test('security headers are present and unlisted origins are rejected', async () => {
  const response = await request(app)
    .get('/health')
    .set('Origin', 'https://untrusted.example');

  assert.equal(response.status, 403);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['access-control-allow-origin'], undefined);
});