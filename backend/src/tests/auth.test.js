const request = require('supertest');
const app = require('../app');

describe('Autenticación', () => {

  describe('POST /api/auth/login', () => {

    test('login exitoso con credenciales correctas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'superadmin', password: 'Admin1234!' });

      expect(res.status).toBe(200);
      expect(res.body.usuario).toBeDefined();
      expect(res.body.usuario.username).toBe('superadmin');
      expect(res.body.usuario.rol).toBe('SuperAdmin');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    test('login fallido con password incorrecta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'superadmin', password: 'incorrecta' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    test('login fallido con usuario inexistente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'noexiste', password: 'Admin1234!' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    test('login fallido sin campos', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
    });

    test('no devuelve password_hash en la respuesta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'superadmin', password: 'Admin1234!' });

      expect(JSON.stringify(res.body)).not.toContain('password_hash');
      expect(JSON.stringify(res.body)).not.toContain('password');
    });

    test('JWT va en cookie HttpOnly, no en el body', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'superadmin', password: 'Admin1234!' });

      expect(res.body.token).toBeUndefined();
      const cookie = res.headers['set-cookie']?.[0] || '';
      expect(cookie).toContain('HttpOnly');
    });

  });

});