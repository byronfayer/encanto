import { useState, useEffect, useCallback } from "react";
import { api, getToken, setToken } from "../lib/api";
import "../admin.css";

const currency = (n) =>
  Number(n).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login">
      <form onSubmit={submit} className="adm-login-form">
        <h1>Encanto</h1>
        <p>Panel de administración</p>
        {error && <div className="adm-error">{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  );
}

function ProductForm({ product, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
    image_url: product?.image_url || "",
    sizes: product?.sizes || "",
    colors: product?.colors || "",
    status: product?.status || "disponible",
    active: product?.active ?? true,
    featured: product?.featured ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price), category_id: form.category_id ? Number(form.category_id) : null };
      if (product) await api.updateProduct(product.id, payload);
      else await api.createProduct(payload);
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-modal-overlay" onClick={onCancel}>
      <form className="adm-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{product ? "Editar producto" : "Nuevo producto"}</h2>
        {error && <div className="adm-error">{error}</div>}
        <label>Nombre <input value={form.name} onChange={(e) => set("name", e.target.value)} required /></label>
        <label>Descripción <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} /></label>
        <div className="adm-row">
          <label>Precio <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required min="0" /></label>
          <label>Categoría
            <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
              <option value="">Sin categoría</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <label>URL de imagen <input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." /></label>
        {form.image_url && <img src={form.image_url} alt="Preview" className="adm-img-preview" />}
        <div className="adm-row">
          <label>Talles <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="S,M,L,XL" /></label>
          <label>Colores <input value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Rojo,Negro" /></label>
        </div>
        <div className="adm-row">
          <label>Estado
            <select value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="disponible">Disponible</option>
              <option value="agotado">Agotado</option>
            </select>
          </label>
          <label className="adm-check"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} /> Activo</label>
          <label className="adm-check"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Destacado</label>
        </div>
        <div className="adm-modal-actions">
          <button type="button" className="adm-btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn-primary" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([api.adminProducts(), api.categories()]);
      setProducts(prods);
      setCategories(cats);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await api.deleteProduct(id);
    load();
  };

  const saved = () => { setShowForm(false); setEditing(null); load(); };

  if (loading) return <p className="adm-loading">Cargando...</p>;

  return (
    <div>
      <div className="adm-toolbar">
        <h2>Productos ({products.length})</h2>
        <button className="adm-btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>+ Nuevo producto</button>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Talles</th><th>Estado</th><th>Activo</th><th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={!p.active ? "adm-row-inactive" : ""}>
                <td><img src={p.image_url || "https://via.placeholder.com/60x75"} alt="" className="adm-thumb" /></td>
                <td><strong>{p.name}</strong>{p.featured && <span className="adm-badge-feat">★</span>}</td>
                <td>{p.category_name || "—"}</td>
                <td>{currency(p.price)}</td>
                <td className="adm-small">{p.sizes || "—"}</td>
                <td><span className={`adm-status ${p.status}`}>{p.status}</span></td>
                <td>{p.active ? "Sí" : "No"}</td>
                <td className="adm-actions">
                  <button onClick={() => { setEditing(p); setShowForm(true); }}>Editar</button>
                  <button className="adm-danger" onClick={() => remove(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <ProductForm product={editing} categories={categories} onSave={saved} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await api.categories()); } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await api.createCategory({ name: newName.trim() });
    setNewName("");
    load();
  };

  const save = async (id) => {
    if (!editName.trim()) return;
    await api.updateCategory(id, { name: editName.trim() });
    setEditId(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await api.deleteCategory(id);
    load();
  };

  if (loading) return <p className="adm-loading">Cargando...</p>;

  return (
    <div>
      <h2>Categorías ({categories.length})</h2>
      <form onSubmit={add} className="adm-inline-form">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nueva categoría..." />
        <button type="submit" className="adm-btn-primary">Agregar</button>
      </form>
      <ul className="adm-cat-list">
        {categories.map((c) => (
          <li key={c.id}>
            {editId === c.id ? (
              <div className="adm-inline-form">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && save(c.id)} />
                <button className="adm-btn-primary" onClick={() => save(c.id)}>Guardar</button>
                <button className="adm-btn-ghost" onClick={() => setEditId(null)}>Cancelar</button>
              </div>
            ) : (
              <>
                <span className="adm-cat-name">{c.name}</span>
                <span className="adm-cat-slug">{c.slug}</span>
                <div className="adm-actions">
                  <button onClick={() => { setEditId(c.id); setEditName(c.name); }}>Editar</button>
                  <button className="adm-danger" onClick={() => remove(c.id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsTab() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.settings().then(setForm).catch(() => {});
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveSettings(form);
      setMsg("Guardado");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg(err.message);
    }
    setSaving(false);
  };

  if (!form) return <p className="adm-loading">Cargando...</p>;

  return (
    <form onSubmit={save}>
      <h2>Configuración del sitio</h2>
      {msg && <div className="adm-success">{msg}</div>}
      <label>Nombre de marca <input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} /></label>
      <label>Tagline <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></label>
      <label>WhatsApp (con código de país) <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5493511234567" /></label>
      <label>Instagram handle <input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@encanto.indumentaria" /></label>
      <label>Instagram URL <input value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} /></label>
      <label>Ubicación <input value={form.location} onChange={(e) => set("location", e.target.value)} /></label>
      <label>Horarios <input value={form.hours} onChange={(e) => set("hours", e.target.value)} /></label>
      <button type="submit" className="adm-btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</button>
    </form>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState("products");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!getToken()) { setChecking(false); return; }
    api.me().then(() => { setAuthed(true); setChecking(false); }).catch(() => { setToken(null); setAuthed(false); setChecking(false); });
  }, []);

  const logout = () => { setToken(null); setAuthed(false); };

  if (checking) return null;
  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;

  return (
    <div className="adm">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <h1>Encanto</h1>
          <span>Admin</span>
        </div>
        <nav>
          <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Productos</button>
          <button className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>Categorías</button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Configuración</button>
        </nav>
        <div className="adm-sidebar-bottom">
          <a href="/" className="adm-btn-ghost">← Volver al sitio</a>
          <button className="adm-btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="adm-main">
        {tab === "products" && <ProductsTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
