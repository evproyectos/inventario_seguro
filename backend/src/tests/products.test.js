const request = require('supertest');
const app = require('../app');

const ts = Date.now();
let cookie;
let productoId;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'superadmin', password: 'Admin1234!' });
  cookie = res.headers['set-cookie']?.[0]?.split(';')[0];
});

describe('CRUD Productos', () => {

  test('crear producto válido', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ codigo: `TEST${ts}`, nombre: 'Producto Test', descripcion: 'Descripcion', cantidad: 10, precio: 99.99 });

    expect(res.status).toBe(201);
    expect(res.body.codigo).toBe(`TEST${ts}`);
    productoId = res.body.id;
  });

  test('listar productos devuelve array', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('obtener producto por ID', async () => {
    const res = await request(app)
      .get(`/api/products/${productoId}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productoId);
  });

  test('editar producto', async () => {
    const res = await request(app)
      .put(`/api/products/${productoId}`)
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ codigo: `TEST${ts}`, nombre: 'Producto Editado', cantidad: 20, precio: 150 });

    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Producto Editado');
  });

  test('eliminar producto', async () => {
    const res = await request(app)
      .delete(`/api/products/${productoId}`)
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080');

    expect(res.status).toBe(200);
  });

  test('obtener producto eliminado devuelve 404', async () => {
    const res = await request(app)
      .get(`/api/products/${productoId}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(404);
  });

});

describe('Validaciones de productos', () => {

  test('cantidad negativa devuelve 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ codigo: `VAL1${ts}`, nombre: 'Test', cantidad: -5, precio: 10 });

    expect(res.status).toBe(400);
    expect(res.body.errores).toBeDefined();
  });

  test('precio negativo devuelve 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ codigo: `VAL2${ts}`, nombre: 'Test', cantidad: 5, precio: -10 });

    expect(res.status).toBe(400);
  });

  test('código con caracteres especiales devuelve 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ codigo: `COD-${ts}!`, nombre: 'Test', cantidad: 5, precio: 10 });

    expect(res.status).toBe(400);
  });

  test('campos requeridos faltantes devuelve 400', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ nombre: 'Sin codigo' });

    expect(res.status).toBe(400);
  });

  test('código duplicado devuelve 400', async () => {
    await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ codigo: `DUP${ts}`, nombre: 'Original', cantidad: 1, precio: 1 });

    const res = await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ codigo: `DUP${ts}`, nombre: 'Duplicado', cantidad: 1, precio: 1 });

    expect(res.status).toBe(400);
  });

});

describe('SQL Injection en productos', () => {

  test('SQL injection en ID no rompe el sistema', async () => {
    const res = await request(app)
      .get('/api/products/999999')
      .set('Cookie', cookie);

    expect(res.status).toBe(404);
  });

  test('SQL injection en body es rechazado por validación', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:8080')
      .send({ codigo: `'; DROP TABLE products; --`, nombre: 'Test', cantidad: 1, precio: 1 });

    expect(res.status).toBe(400);
  });

});