import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import registrarDatosRouter from './modules/controlC/HU1/registrarDatos/routes';
import googleRouter from './modules/controlC/HU3/google/routes';
import ubicacionRouter from './modules/controlC/HU3/ubicacion/routes';
import authRouter from './modules/controlC/HU4/auth/auth.routes';
import modificarDatosRouter from './modules/controlC/HU5/modificarDatos/routes';
import nominatimRouter from './modules/controlC/HU5/sugerencias/routes';

const app = express();

/* ------------------------- C O R S   A R R E G L A D O ------------------------- */
// ⚠️ IMPORTANTE: agrega tu dominio estable del FRONT en Vercel aquí
const STABLE_FRONT =
  process.env.FRONTEND_URL || 'https://front-hu9-1pne.vercel.app';

const allowedOrigins = [
  'http://localhost:3000',
  STABLE_FRONT,
  /\.vercel\.app$/, // permite todos tus previews *.vercel.app
];

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Permitir requests sin 'Origin' (SSR, server-to-server, curl)
    if (!origin) return callback(null, true);

    const ok = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin,
    );

    return ok
      ? callback(null, true)
      : callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// ⛔️ Reemplaza la línea antigua:
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// ✅ Por estas dos:
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
/* ------------------------------------------------------------------------------ */

app.use(express.json());

// Rutas (OJO: el prefijo correcto es /api/controlC/...)
app.use('/api/controlC/google', googleRouter);
app.use('/api/controlC/ubicacion', ubicacionRouter);
app.use('/api/controlC/auth', authRouter);
app.use('/api/controlC/registro', registrarDatosRouter);
app.use('/api/controlC/modificar-datos', modificarDatosRouter);
app.use('/api/controlC/sugerencias', nominatimRouter);

/* ----------------------------- E J E C U C I Ó N ------------------------------ */
/**
 * En Vercel (serverless) NO se debe llamar app.listen.
 * Exportamos app para que lo use el handler de Vercel (api/index.ts).
 * En local sí levantamos el puerto.
 */
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

if (process.env.VERCEL) {
  // Vercel: exporta app (NO app.listen)
  export default app;
} else {
  // Local / otros PaaS persistentes:
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}
