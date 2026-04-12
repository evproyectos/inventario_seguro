let ngrokUrl = null;

const obtenerUrlNgrok = async () => {
  try {
    const res = await fetch('http://ngrok:4040/api/tunnels');
    const data = await res.json();
    const tunnel = data.tunnels?.find(t => t.proto === 'https');
    if (tunnel) {
      ngrokUrl = tunnel.public_url;
      console.log('URL ngrok detectada:', ngrokUrl);
    }
  } catch {
    ngrokUrl = null;
  }
};

setInterval(obtenerUrlNgrok, 10000);
obtenerUrlNgrok();

const rutasExcluidas = ['/auth/login'];

const verificarOrigen = (req, res, next) => {
  const metodosEscritura = ['POST', 'PUT', 'DELETE', 'PATCH'];

  if (!metodosEscritura.includes(req.method)) {
    return next();
  }

  if (rutasExcluidas.some(ruta => req.path.endsWith(ruta))) {
    return next();
  }

  const origin = req.headers['origin'] || req.headers['referer'];

  const origenesPermitidos = [
    'http://localhost:8080',
    'http://localhost',
    ngrokUrl,
  ].filter(Boolean);

  if (!origin) {
    return res.status(403).json({ error: 'Origen no permitido.' });
  }

  const permitido = origenesPermitidos.some(o => origin.startsWith(o));

  if (!permitido) {
    return res.status(403).json({ error: 'Origen no permitido.' });
  }

  next();
};

module.exports = { verificarOrigen };