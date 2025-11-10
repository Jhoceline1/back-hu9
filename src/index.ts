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

/* -------------------- CONFIGURACIÓN DE CORS -------------------- */
const STABLE_FRONT =
  process.env.FRONTEND_URL || 'https://front-hu9.vercel.app/';

const allowedOrigins = [
  'http://localhost:3000',
  STABLE_FRONT,
  /\.vercel\.app$/, // permite todos los subdominios *.vercel.app
];

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // permitir peticiones sin origen (por ejemplo SSR o Postman)
    if (!origin) return callback(null, true);

    const ok = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin
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

app.use(cors(corsOptions));
/* --------------------------------------------------------------- */

app.use(express.json());

/* ------------------------- RUTAS ------------------------- */
app.use('/api/controlC/google', googleRouter);
app.use('/api/controlC/ubicacion', ubicacionRouter);
app.use('/api/controlC/auth', authRouter);
app.use('/api/controlC/registro', registrarDatosRouter);
app.use('/api/controlC/modificar-datos', modificarDatosRouter);
app.use('/api/controlC/sugerencias', nominatimRouter);
/* ---------------------------------------------------------- */

/* ---------------------- EXPORTACIÓN ---------------------- */
// ✅ Siempre exporta app al final, fuera de cualquier condicional
export default app;

/* ---------------------- MODO LOCAL ------------------------ */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Servidor local en puerto ${PORT}`));
}
