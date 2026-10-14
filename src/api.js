import axios from 'axios';
import { API_URL } from './config.js';

const http = axios.create({ baseURL: API_URL.replace(/\/+$/, ''), timeout: 90000 });

const BAD_API =
  'Frontend backend se connect nahi ho paya. src/config.js mein API_URL (https://AAPKA-BACKEND.vercel.app/api) sahi likhein, phir dobara deploy karein.';

const msg = (e) =>
  e.response?.data?.error ||
  (e.code === 'ECONNABORTED' ? 'Request timed out' : 'Server se connect nahi ho paya. Backend chal raha hai?');

// Backend ka asli JSON aaya ya koi aur cheez (jaise index.html)? Check karke hi aage bhejo.
async function call(request, isValid) {
  try {
    const { data } = await request();
    if (!isValid(data)) throw new Error(BAD_API);
    return data;
  } catch (e) {
    if (e.message === BAD_API) throw e;
    throw new Error(msg(e));
  }
}

export const runAudit = (url) => call(() => http.post('/audits', { url }), (d) => d && typeof d === 'object' && d.id);
export const getAudit = (id) => call(() => http.get(`/audits/${id}`), (d) => d && typeof d === 'object' && d.checks);
export const listAudits = () => call(() => http.get('/audits'), Array.isArray);
export const deleteAudit = (id) => call(() => http.delete(`/audits/${id}`), (d) => d && typeof d === 'object');
