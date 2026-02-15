import { useState, useRef, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhotograph,
  HiOutlineShoppingBag,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineTrendingUp,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineEye,
} from "react-icons/hi";
import type { Product } from "../types";
import { useProducts } from "../hooks/useProducts";
import { formatPrice } from "../data/products";
import { categoriesConfig } from "../data/categories";

type Tab = "overview" | "products" | "add" | "edit";

const MAX_IMAGES = 8;

const emptyForm = {
  name: "",
  category: categoriesConfig[0].label,
  categorySlug: categoriesConfig[0].slug,
  subcategory: categoriesConfig[0].subcategories[0]?.label || "",
  subcategorySlug: categoriesConfig[0].subcategories[0]?.slug || "",
  price: 0,
  oldPrice: 0,
  discount: 0,
  images: [] as string[],
  description: "",
  featured: true,
};

const Admin: FC = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults, fetchProducts } = useProducts();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

  const totalProducts = products.length;
  const totalValue = products.reduce((s, p) => s + p.price, 0);
  const totalCategories = new Set(products.map((p) => p.categorySlug)).size;
  const featuredCount = products.filter((p) => p.featured).length;

  const filteredProducts = (filterCat === "all"
    ? products
    : products.filter((p) => p.categorySlug === filterCat)
  ).slice().reverse();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images par produit`, { style: { borderRadius: "0", fontSize: "12px" } });
      e.target.value = "";
      return;
    }

    files.slice(0, remaining).forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `"${file.name}" trop volumineuse (${(file.size / 1024 / 1024).toFixed(1)} MB). Max : 5 MB`,
          { style: { borderRadius: "0", fontSize: "12px" } }
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({
          ...prev,
          images: prev.images.length < MAX_IMAGES ? [...prev.images, ev.target?.result as string] : prev.images,
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const setMainImage = (index: number) => {
    if (index === 0) return;
    setForm((prev) => {
      const newImages = [...prev.images];
      const [selected] = newImages.splice(index, 1);
      newImages.unshift(selected);
      return { ...prev, images: newImages };
    });
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    if (form.images.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images par produit`, { style: { borderRadius: "0", fontSize: "12px" } });
      return;
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
    setImageUrl("");
  };

  const handleCategoryChange = (catSlug: string) => {
    const cat = categoriesConfig.find((c) => c.slug === catSlug);
    if (cat) {
      const firstSub = cat.subcategories[0];
      setForm((prev) => ({
        ...prev,
        category: cat.label,
        categorySlug: cat.slug,
        subcategory: firstSub?.label || "",
        subcategorySlug: firstSub?.slug || "",
      }));
    }
  };

  const handleSubcategoryChange = (subSlug: string) => {
    const cat = categoriesConfig.find((c) => c.slug === form.categorySlug);
    const sub = cat?.subcategories.find((s) => s.slug === subSlug);
    if (sub) {
      setForm((prev) => ({
        ...prev,
        subcategory: sub.label,
        subcategorySlug: sub.slug,
      }));
    }
  };

  const currentCatConfig = categoriesConfig.find((c) => c.slug === form.categorySlug);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || form.images.length === 0 || form.price <= 0) return;

    const productData = {
      ...form,
      image: form.images[0],
      oldPrice: form.oldPrice || null,
      discount: form.discount || null,
    };

    setSubmitting(true);
    try {
      if (editId !== null) {
        await updateProduct(editId, productData);
        setEditId(null);
        toast.success("Produit modifié avec succès", { style: { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" } });
      } else {
        await addProduct(productData);
        toast.success("Produit ajouté avec succès", { style: { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" } });
      }
      setForm(emptyForm);
      setActiveTab("products");
      fetchProducts();
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : "";
      const msg = errMsg.includes("413")
        ? "Images trop volumineuses pour le serveur. Réduisez la taille."
        : errMsg || "Erreur lors de l'opération";
      toast.error(msg, { style: { borderRadius: "0", fontSize: "12px" } });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (product: Product) => {
    setForm({
      name: product.name,
      category: product.category,
      categorySlug: product.categorySlug,
      subcategory: product.subcategory,
      subcategorySlug: product.subcategorySlug,
      price: product.price,
      oldPrice: product.oldPrice || 0,
      discount: product.discount || 0,
      images: product.images.length > 0 ? [...product.images] : product.image ? [product.image] : [],
      description: product.description,
      featured: product.featured,
    });
    setEditId(product.id);
    setActiveTab("edit");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Produit supprimé", { style: { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" } });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression", { style: { borderRadius: "0", fontSize: "12px" } });
    }
    setDeleteConfirm(null);
  };

  const stats = [
    { label: "Total Produits", value: totalProducts, icon: HiOutlineShoppingBag, color: "bg-[#19110b]" },
    { label: "Valeur Catalogue", value: formatPrice(totalValue), icon: HiOutlineCurrencyDollar, color: "bg-[#6b4c3b]" },
    { label: "Catégories", value: totalCategories, icon: HiOutlineTag, color: "bg-[#c5a467]" },
    { label: "En Vedette", value: featuredCount, icon: HiOutlineTrendingUp, color: "bg-[#19110b]" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f5f3]">
      <SEO
        title="Administration"
        description="Tableau de bord d'administration Africa Market."
        noindex
      />
      {/* ═══ TOP BAR ═══ */}
      <div className="bg-[#19110b] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <HiOutlineArrowLeft size={18} />
                <span className="hidden sm:block text-[11px] tracking-[0.1em] uppercase">Retour au site</span>
              </button>
              <div className="w-px h-6 bg-white/20 hidden sm:block" />
              <span
                className="text-[13px] sm:text-[15px] font-medium tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Dashboard
              </span>
            </div>
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-white/60 hover:text-white transition-colors"
            >
              <HiOutlineRefresh size={15} />
              <span className="hidden sm:block">Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ TAB NAV ═══ */}
      <div className="bg-white border-b border-[#e8e8e8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex gap-0 overflow-x-auto">
            {([
              { key: "overview", label: "Vue d'ensemble" },
              { key: "products", label: "Produits" },
              { key: "add", label: "Ajouter" },
            ] as { key: Tab; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setEditId(null); setForm(emptyForm); }}
                className={`relative px-4 sm:px-6 py-3.5 text-[10px] sm:text-[11px] tracking-[0.15em] uppercase font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key || (tab.key === "add" && activeTab === "edit")
                    ? "text-[#19110b]"
                    : "text-[#757575] hover:text-[#19110b]"
                }`}
              >
                {tab.key === "add" && activeTab === "edit" ? "Modifier" : tab.label}
                {(activeTab === tab.key || (tab.key === "add" && activeTab === "edit")) && (
                  <motion.span
                    layoutId="admin-tab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#19110b]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white p-4 sm:p-6 border border-[#e8e8e8]"
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.color} text-white flex items-center justify-center mb-3 sm:mb-4`}>
                    <stat.icon size={18} />
                  </div>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-1">
                    {stat.label}
                  </p>
                  <p className="text-[18px] sm:text-[22px] text-[#19110b] font-medium tracking-tight">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-[11px] tracking-[0.15em] uppercase text-[#19110b] font-medium mb-4 sm:mb-5">
                Répartition par catégorie
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {categoriesConfig.map((cat) => {
                  const count = products.filter((p) => p.categorySlug === cat.slug).length;
                  const pct = totalProducts > 0 ? (count / totalProducts) * 100 : 0;
                  return (
                    <div key={cat.slug}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] sm:text-[13px] text-[#19110b] font-light">{cat.label}</span>
                        <span className="text-[11px] sm:text-[12px] text-[#757575]">{count} produits</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#f0f0f0] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-[#19110b]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h3 className="text-[11px] tracking-[0.15em] uppercase text-[#19110b] font-medium">
                  Derniers produits
                </h3>
                <button
                  onClick={() => setActiveTab("products")}
                  className="text-[10px] tracking-[0.1em] uppercase text-[#757575] hover:text-[#19110b] transition-colors underline underline-offset-4"
                >
                  Voir tout
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.slice(-4).reverse().map((product) => (
                  <div key={product.id} className="group">
                    <div className="aspect-[3/4] bg-[#f6f5f3] overflow-hidden mb-2 sm:mb-3">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] tracking-[0.1em] uppercase text-[#757575] mb-0.5">{product.category}</p>
                    <p className="text-[12px] sm:text-[13px] text-[#19110b] truncate">{product.name}</p>
                    <p className="text-[12px] sm:text-[13px] text-[#19110b] font-medium">{formatPrice(product.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterCat("all")}
                  className={`text-[10px] sm:text-[11px] tracking-[0.1em] uppercase px-3 sm:px-4 py-2 border transition-colors whitespace-nowrap ${
                    filterCat === "all"
                      ? "bg-[#19110b] text-white border-[#19110b]"
                      : "bg-white text-[#757575] border-[#e8e8e8] hover:border-[#19110b]"
                  }`}
                >
                  Tous ({products.length})
                </button>
                {categoriesConfig.map((cat) => {
                  const count = products.filter((p) => p.categorySlug === cat.slug).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setFilterCat(cat.slug)}
                      className={`text-[10px] sm:text-[11px] tracking-[0.1em] uppercase px-3 sm:px-4 py-2 border transition-colors whitespace-nowrap ${
                        filterCat === cat.slug
                          ? "bg-[#19110b] text-white border-[#19110b]"
                          : "bg-white text-[#757575] border-[#e8e8e8] hover:border-[#19110b]"
                      }`}
                    >
                      {cat.label} ({count})
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => { setActiveTab("add"); setEditId(null); setForm(emptyForm); }}
                className="flex items-center gap-2 bg-[#19110b] text-white text-[10px] sm:text-[11px] tracking-[0.15em] uppercase px-4 sm:px-5 py-2.5 hover:bg-[#6b4c3b] transition-colors whitespace-nowrap"
              >
                <HiOutlinePlus size={15} /> Ajouter un produit
              </button>
            </div>

            <div className="bg-white border border-[#e8e8e8] overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e8e8e8]">
                      <th className="text-left text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium px-5 py-3">Produit</th>
                      <th className="text-left text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium px-5 py-3">Photos</th>
                      <th className="text-left text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium px-5 py-3">Catégorie</th>
                      <th className="text-left text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium px-5 py-3">Sous-cat.</th>
                      <th className="text-left text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium px-5 py-3">Prix</th>
                      <th className="text-left text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium px-5 py-3">Promo</th>
                      <th className="text-right text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-[#f0f0f0] hover:bg-[#faf9f7] transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-14 bg-[#f6f5f3] overflow-hidden shrink-0 group/img">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              {product.images.length > 1 && (
                                <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-[#19110b]/80 text-white px-1 py-px leading-tight">
                                  +{product.images.length - 1}
                                </span>
                              )}
                              {/* Popup preview on hover */}
                              {product.images.length > 1 && (
                                <div className="hidden group-hover/img:flex absolute left-14 top-0 z-50 bg-white border border-[#e8e8e8] shadow-lg p-2 gap-1.5">
                                  {product.images.map((img, idx) => (
                                    <div key={idx} className={`w-14 h-[72px] overflow-hidden shrink-0 ${idx === 0 ? "ring-2 ring-[#c5a467]" : "ring-1 ring-[#e8e8e8]"}`}>
                                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] text-[#19110b] font-normal truncate">{product.name}</p>
                              <p className="text-[11px] text-[#757575] font-light truncate">{product.description.slice(0, 50)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            {(product.images.length > 0 ? product.images : [product.image]).slice(0, 4).map((img, idx) => (
                              <div key={idx} className={`w-8 h-10 overflow-hidden shrink-0 ${idx === 0 ? "ring-1 ring-[#c5a467]" : "ring-1 ring-[#e8e8e8]"}`}>
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {product.images.length > 4 && (
                              <span className="text-[10px] text-[#757575] ml-0.5">+{product.images.length - 4}</span>
                            )}
                            {product.images.length <= 1 && (
                              <span className="text-[9px] text-[#c0c0c0] ml-1">1 photo</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[11px] tracking-[0.1em] uppercase text-[#757575]">{product.category}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[11px] text-[#757575]">{product.subcategory}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[13px] text-[#19110b] font-medium">{formatPrice(product.price)}</span>
                        </td>
                        <td className="px-5 py-3">
                          {product.discount ? (
                            <span className="text-[11px] bg-[#19110b] text-white px-2 py-0.5">-{product.discount}%</span>
                          ) : (
                            <span className="text-[11px] text-[#c0c0c0]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewProduct(product)}
                              className="p-2 text-[#757575] hover:text-[#c5a467] hover:bg-[#f0f0f0] transition-colors"
                              title="Voir"
                            >
                              <HiOutlineEye size={15} />
                            </button>
                            <button
                              onClick={() => startEdit(product)}
                              className="p-2 text-[#757575] hover:text-[#19110b] hover:bg-[#f0f0f0] transition-colors"
                              title="Modifier"
                            >
                              <HiOutlinePencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 text-[#757575] hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Supprimer"
                            >
                              <HiOutlineTrash size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-[#f0f0f0]">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-4">
                    <div className="relative w-16 h-20 bg-[#f6f5f3] overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {product.images.length > 1 && (
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-[#19110b]/80 text-white px-1 py-px leading-tight">
                          {product.images.length} photos
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#19110b] font-medium truncate">{product.name}</p>
                      <p className="text-[10px] tracking-[0.1em] uppercase text-[#757575] mb-0.5">{product.category}</p>
                      <p className="text-[10px] text-[#757575] mb-1">{product.subcategory}</p>
                      <p className="text-[12px] text-[#19110b] font-medium">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button onClick={() => setViewProduct(product)} className="p-2 text-[#757575] hover:text-[#c5a467]">
                        <HiOutlineEye size={16} />
                      </button>
                      <button onClick={() => startEdit(product)} className="p-2 text-[#757575] hover:text-[#19110b]">
                        <HiOutlinePencil size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirm(product.id)} className="p-2 text-[#757575] hover:text-red-600">
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-[13px] text-[#757575] font-light">Aucun produit dans cette catégorie.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ADD / EDIT TAB */}
        {(activeTab === "add" || activeTab === "edit") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="max-w-[800px]">
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-[#19110b] font-medium mb-6 sm:mb-8">
                {editId !== null ? "Modifier le produit" : "Ajouter un nouveau produit"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Image upload */}
                <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium">
                      Photos du produit ({form.images.length}/{MAX_IMAGES})
                    </p>
                    {form.images.length > 1 && (
                      <p className="text-[9px] text-[#757575] font-light">
                        Cliquez pour definir comme principale
                      </p>
                    )}
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                    {form.images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setMainImage(index)}
                        className={`relative aspect-[3/4] bg-[#f6f5f3] overflow-hidden cursor-pointer group ${
                          index === 0 ? "ring-2 ring-[#c5a467]" : "ring-1 ring-[#e8e8e8] hover:ring-[#19110b]"
                        }`}
                      >
                        <img src={img} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                          <span className="absolute top-1.5 left-1.5 text-[8px] tracking-[0.1em] uppercase bg-[#c5a467] text-white px-1.5 py-0.5">
                            Principale
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          className="absolute top-1.5 right-1.5 w-5 h-5 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiOutlineX size={10} />
                        </button>
                      </div>
                    ))}
                    {form.images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[3/4] border-2 border-dashed border-[#e0e0e0] flex flex-col items-center justify-center gap-1.5 hover:border-[#19110b] transition-colors"
                      >
                        <HiOutlinePlus size={20} className="text-[#c0c0c0]" />
                        <span className="text-[9px] tracking-[0.1em] uppercase text-[#757575]">Ajouter</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* URL input */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <p className="text-[11px] text-[#757575] font-light mb-1.5">Ou ajouter via URL :</p>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
                        placeholder="https://..."
                        className="w-full border-b border-[#e8e8e8] py-2 text-[13px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addImageUrl}
                      disabled={!imageUrl.trim()}
                      className="text-[10px] tracking-[0.1em] uppercase text-[#19110b] border border-[#19110b] px-3 py-2 hover:bg-[#19110b] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-[1px]"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium mb-4 sm:mb-5">
                    Détails du produit
                  </p>
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">Nom du produit *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Ex: Sac Bandoulière Wax Luxe"
                        className="w-full border-b border-[#e8e8e8] py-2.5 text-[14px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors placeholder:text-[#d0d0d0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        placeholder="Description du produit..."
                        className="w-full border border-[#e8e8e8] p-3 text-[13px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors placeholder:text-[#d0d0d0] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">Catégorie *</label>
                        <select
                          value={form.categorySlug}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full border-b border-[#e8e8e8] py-2.5 text-[14px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors cursor-pointer appearance-none"
                        >
                          {categoriesConfig.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">Sous-catégorie</label>
                        {currentCatConfig && currentCatConfig.subcategories.length > 0 ? (
                          <select
                            value={form.subcategorySlug}
                            onChange={(e) => handleSubcategoryChange(e.target.value)}
                            className="w-full border-b border-[#e8e8e8] py-2.5 text-[14px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors cursor-pointer appearance-none"
                          >
                            {currentCatConfig.subcategories.map((sub) => (
                              <option key={sub.slug} value={sub.slug}>{sub.label}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="py-2.5 text-[13px] text-[#c0c0c0] font-light">
                            Aucune sous-catégorie
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium mb-4 sm:mb-5">
                    Tarification (FCFA)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">Prix actuel *</label>
                      <input
                        type="number"
                        value={form.price || ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        required
                        min={0}
                        placeholder="79 500"
                        className="w-full border-b border-[#e8e8e8] py-2.5 text-[14px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors placeholder:text-[#d0d0d0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">Ancien prix</label>
                      <input
                        type="number"
                        value={form.oldPrice || ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, oldPrice: Number(e.target.value) }))}
                        min={0}
                        placeholder="89 500"
                        className="w-full border-b border-[#e8e8e8] py-2.5 text-[14px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors placeholder:text-[#d0d0d0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">Réduction %</label>
                      <input
                        type="number"
                        value={form.discount || ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, discount: Number(e.target.value) }))}
                        min={0}
                        max={100}
                        placeholder="15"
                        className="w-full border-b border-[#e8e8e8] py-2.5 text-[14px] text-[#19110b] font-light bg-transparent outline-none focus:border-[#19110b] transition-colors placeholder:text-[#d0d0d0]"
                      />
                    </div>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="bg-white border border-[#e8e8e8] p-4 sm:p-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 accent-[#19110b]"
                    />
                    <span className="text-[12px] sm:text-[13px] text-[#19110b]">Mettre en vedette sur la page d'accueil</span>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#19110b] text-white text-[11px] tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-[#6b4c3b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {submitting
                      ? (editId !== null ? "Modification..." : "Ajout en cours...")
                      : (editId !== null ? "Enregistrer les modifications" : "Ajouter le produit")
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("products"); setEditId(null); setForm(emptyForm); }}
                    className="text-[11px] tracking-[0.15em] uppercase text-[#757575] hover:text-[#19110b] px-8 py-3.5 border border-[#e8e8e8] hover:border-[#19110b] transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>

      {/* ═══ DELETE CONFIRM MODAL ═══ */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white p-6 sm:p-8 max-w-sm w-full text-center"
          >
            <p className="text-[14px] sm:text-[15px] text-[#19110b] font-light mb-2">Supprimer ce produit ?</p>
            <p className="text-[12px] text-[#757575] font-light mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-red-600 text-white text-[11px] tracking-[0.1em] uppercase px-6 py-2.5 hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="border border-[#e8e8e8] text-[11px] tracking-[0.1em] uppercase text-[#757575] px-6 py-2.5 hover:border-[#19110b] hover:text-[#19110b] transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ VIEW PRODUCT MODAL ═══ */}
      {viewProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewProduct(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white max-w-[700px] w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e8e8e8] px-5 sm:px-6 py-3 flex items-center justify-between z-10">
              <h3
                className="text-[14px] sm:text-[16px] text-[#19110b] font-light tracking-wide truncate pr-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {viewProduct.name}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { startEdit(viewProduct); setViewProduct(null); }}
                  className="text-[10px] tracking-[0.1em] uppercase text-[#19110b] border border-[#19110b] px-3 py-1.5 hover:bg-[#19110b] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <HiOutlinePencil size={12} /> Modifier
                </button>
                <button
                  onClick={() => setViewProduct(null)}
                  className="p-1.5 text-[#757575] hover:text-[#19110b] transition-colors"
                >
                  <HiOutlineX size={18} />
                </button>
              </div>
            </div>

            {/* Images */}
            <div className="p-5 sm:p-6">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575] font-medium mb-3">
                Photos ({viewProduct.images.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
                {(viewProduct.images.length > 0 ? viewProduct.images : viewProduct.image ? [viewProduct.image] : []).map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-[3/4] bg-[#f6f5f3] overflow-hidden ${
                      idx === 0 ? "ring-2 ring-[#c5a467]" : "ring-1 ring-[#e8e8e8]"
                    }`}
                  >
                    <img src={img} alt={`${viewProduct.name} - ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 text-[8px] tracking-[0.1em] uppercase bg-[#c5a467] text-white px-1.5 py-0.5">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-3 border-t border-[#e8e8e8] pt-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">Catégorie</p>
                    <p className="text-[13px] text-[#19110b]">{viewProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">Sous-catégorie</p>
                    <p className="text-[13px] text-[#19110b]">{viewProduct.subcategory || "—"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">Prix</p>
                    <p className="text-[14px] text-[#19110b] font-medium">{formatPrice(viewProduct.price)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">Ancien prix</p>
                    <p className="text-[13px] text-[#757575]">{viewProduct.oldPrice ? formatPrice(viewProduct.oldPrice) : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">Réduction</p>
                    <p className="text-[13px] text-[#19110b]">{viewProduct.discount ? `-${viewProduct.discount}%` : "—"}</p>
                  </div>
                </div>
                {viewProduct.description && (
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">Description</p>
                    <p className="text-[13px] text-[#757575] font-light leading-relaxed">{viewProduct.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-[9px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">En vedette</p>
                  <p className="text-[13px] text-[#19110b]">{viewProduct.featured ? "Oui" : "Non"}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-[#e8e8e8]">
                <button
                  onClick={() => { startEdit(viewProduct); setViewProduct(null); }}
                  className="flex-1 bg-[#19110b] text-white text-[10px] tracking-[0.15em] uppercase py-3 flex items-center justify-center gap-2 hover:bg-[#2a1f14] transition-colors"
                >
                  <HiOutlinePencil size={14} /> Modifier
                </button>
                <button
                  onClick={() => navigate(`/product/${viewProduct.id}`)}
                  className="flex-1 border border-[#19110b] text-[#19110b] text-[10px] tracking-[0.15em] uppercase py-3 flex items-center justify-center gap-2 hover:bg-[#19110b] hover:text-white transition-colors"
                >
                  <HiOutlineEye size={14} /> Voir sur le site
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;