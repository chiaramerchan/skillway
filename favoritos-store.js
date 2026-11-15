// Guardados en este navegador, compartidos entre las páginas de la app.
window.skillwaySaved = {
  read(type) {
    try { return new Set(JSON.parse(localStorage.getItem(`skillway-${type}`) || '[]')); }
    catch { return new Set(); }
  },
  write(type, values) {
    try { localStorage.setItem(`skillway-${type}`, JSON.stringify([...values])); } catch {}
  }
};
