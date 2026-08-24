import React, { useState } from 'react';
import { ShieldCheck, ImageIcon, Video, CheckCircle, Package } from 'lucide-react';

const CATEGORIES = ["All", "Kitchenware", "Home Interior", "Electrical Appliances", "Fashion"];

export const AdminDashboard = ({ products, setProducts, toast, orders = [], onUpdateOrderStatus }: any) => {
  const [tab, setTab] = useState("newPost");
  
  // New Post State
  const [poster, setPoster] = useState("Sister Reemah (Founder & Chief Import Buyer)");
  const [multiPics, setMultiPics] = useState<string[]>([]);
  const [videoDemo, setVideoDemo] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [postCategory, setPostCategory] = useState(CATEGORIES[1]);
  const [postCaption, setPostCaption] = useState("");

  // Simple Product Upload State
  const [singlePic, setSinglePic] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState(CATEGORIES[1]);
  const [prodStock, setProdStock] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOldPrice, setProdOldPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");

  // Order Management State
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  const filteredOrders = orders.filter((o: any) => {
    const matchSearch = o.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const handleMultiPic = (e: any) => {
    const files = Array.from(e.target.files);
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setMultiPics(prev => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideo = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setVideoDemo(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishPost = async () => {
    if (!postTitle || !postPrice || (!multiPics.length && !videoDemo)) {
      toast("Please provide title, price, and at least one image or video.");
      return;
    }
    const newId = "p_" + Date.now();
    const newProd = {
      id: newId,
      title: postTitle,
      category: postCategory,
      price: Number(postPrice),
      oldPrice: Number(postPrice) * 1.2,
      desc: postCaption,
      stock: 50,
      mediaUrl: multiPics.length > 0 ? multiPics[0] : "",
      videoUrl: videoDemo,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    
    setProducts((prev: any) => [newProd, ...prev]);
    toast("Published Post to Feed & Store!");
    setTab("products");
    
    setPostTitle(""); setPostPrice(""); setMultiPics([]); setVideoDemo(""); setPostCaption("");
  };

  const handleSimpleUpload = () => {
    if (!prodName || !prodPrice || !singlePic) {
      toast("Please provide name, price, and picture.");
      return;
    }
    const newProd = {
      id: "p_" + Date.now(),
      title: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      oldPrice: prodOldPrice ? Number(prodOldPrice) : undefined,
      desc: prodDesc,
      stock: Number(prodStock) || 10,
      mediaUrl: singlePic,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    setProducts((prev: any) => [newProd, ...prev]);
    toast("Product added successfully!");
    setTab("products");
    
    setProdName(""); setProdPrice(""); setSinglePic(""); setProdOldPrice(""); setProdDesc(""); setProdStock("");
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-4xl mx-auto fade-in bg-[#f4f2ef]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#D4A017]" />
          <h2 className="text-2xl font-display font-semibold text-[#4A1C6B]">Admin Dashboard</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button onClick={() => setTab("newPost")} className={`px-5 py-2 rounded-xl text-sm font-semibold ${tab === "newPost" ? "bg-[#4A1C6B] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}>New Product Post</button>
        <button onClick={() => setTab("simpleAdd")} className={`px-5 py-2 rounded-xl text-sm font-semibold ${tab === "simpleAdd" ? "bg-[#4A1C6B] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}>Simple Add</button>
        <button onClick={() => setTab("orders")} className={`px-5 py-2 rounded-xl text-sm font-semibold ${tab === "orders" ? "bg-[#4A1C6B] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}>Orders (${orders.length})</button>
        <button onClick={() => setTab("products")} className={`px-5 py-2 rounded-xl text-sm font-semibold ${tab === "products" ? "bg-[#4A1C6B] text-white shadow-md" : "text-gray-500 hover:bg-gray-100"}`}>Products (${products.length})</button>
      </div>

      {tab === "newPost" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Author / Poster</label>
            <select value={poster} onChange={e => setPoster(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017] bg-gray-50">
              <option value="Sister Reemah (Founder & Chief Import Buyer)">Sister Reemah (Founder & Chief Import Buyer)</option>
              <option value="Reemah Admin Team">Reemah Admin Team</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#4A1C6B] uppercase">UPLOAD MULTIPLE PICTURES</label>
              <label className="border-2 border-dashed border-[#D4A017]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#D4A017]/10 transition bg-gray-50">
                <ImageIcon className="w-8 h-8 text-[#D4A017] mb-3" />
                <span className="text-sm font-semibold text-[#4A1C6B]">Click to select multiple photos</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG</span>
                <input type="file" multiple accept="image/*" onChange={handleMultiPic} className="hidden" />
              </label>
              {multiPics.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {multiPics.map((src, idx) => (
                    <img key={idx} src={src} alt="Upload preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#4A1C6B] uppercase">OR UPLOAD VIDEO DEMO</label>
              <label className="border-2 border-dashed border-[#D4A017]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#D4A017]/10 transition bg-gray-50">
                <Video className="w-8 h-8 text-[#D4A017] mb-3" />
                <span className="text-sm font-semibold text-[#4A1C6B]">Click to upload MP4</span>
                <span className="text-xs text-gray-400 mt-1">Video demo</span>
                <input type="file" accept="video/mp4,video/*" onChange={handleVideo} className="hidden" />
              </label>
              {videoDemo && (
                <div className="mt-2 text-xs font-semibold text-[#D4A017] flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Video Selected
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Product Title / Name *</label>
              <input type="text" value={postTitle} onChange={e => setPostTitle(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017]" placeholder="e.g. Luxury Velvet Sofa" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Price (₦) *</label>
              <input type="number" value={postPrice} onChange={e => setPostPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017]" placeholder="e.g. 150000" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Category</label>
            <select value={postCategory} onChange={e => setPostCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017]">
              {CATEGORIES.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Caption & Details</label>
            <textarea value={postCaption} onChange={e => setPostCaption(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017]" placeholder="Tell your customers about this product..."></textarea>
          </div>

          <button onClick={handlePublishPost} className="w-full bg-[#D4A017] text-[#4A1C6B] font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition">
            Publish Post
          </button>
        </div>
      )}

      {tab === "simpleAdd" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h3 className="font-display font-semibold text-lg text-[#4A1C6B] border-b border-gray-200 pb-3">Alternative Product Upload</h3>
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#4A1C6B] uppercase">Single Photo Upload</label>
            <input type="file" accept="image/*" onChange={(e: any) => {
              const file = e.target.files[0];
              if(file) {
                const reader = new FileReader();
                reader.onload = ev => { if(ev.target?.result) setSinglePic(ev.target.result as string); };
                reader.readAsDataURL(file);
              }
            }} className="w-full text-sm" />
            {singlePic && <img src={singlePic} className="w-20 h-20 object-cover rounded-xl mt-2 border border-gray-200" alt="preview" />}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Product Name</label>
            <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Category</label>
              <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]">
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Stock Count</label>
              <input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" placeholder="e.g. 10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Price (₦)</label>
              <input type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Old Price (₦) [Optional]</label>
              <input type="number" value={prodOldPrice} onChange={e => setProdOldPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" />
            </div>
          </div>

          <button onClick={handleSimpleUpload} className="w-full bg-[#D4A017] text-[#4A1C6B] font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition mt-4">
            Publish product
          </button>
        </div>
      )}

      {tab === "orders" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-display font-semibold text-lg text-[#4A1C6B]">Order Management</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search Name or ID..." 
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#D4A017]"
              />
              <select 
                value={orderStatusFilter} 
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#D4A017] bg-gray-50"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase bg-gray-50">
                  <th className="p-3 rounded-tl-lg">Order ID / Date</th>
                  <th className="p-3">Customer Info</th>
                  <th className="p-3">Products Ordered</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No orders found</td></tr>
                ) : (
                  filteredOrders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-mono font-bold text-[#4A1C6B]">{o.id}</div>
                        <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#4A1C6B]">{o.customerName}</div>
                        <div className="text-xs text-gray-500">{o.customerPhone}</div>
                      </td>
                      <td className="p-3">
                        {o.items?.map((item: any, i: number) => (
                          <div key={i} className="text-xs text-[#4A1C6B] flex items-center gap-1 mb-1">
                            <span className="font-bold">{item.qty}x</span> <span className="truncate max-w-[150px]">{item.title}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3 font-bold text-[#D4A017]">₦{o.totalAmount?.toLocaleString()}</td>
                      <td className="p-3">
                        <select value={o.status} onChange={e => onUpdateOrderStatus(o.id, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-[#D4A017] bg-white text-[#4A1C6B]">
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-lg text-[#4A1C6B]">Inventory ({products.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2 relative">
                {p.oldPrice > p.price && <span className="absolute top-4 left-4 bg-[#D4A017] text-[#4A1C6B] text-[10px] font-bold px-2 py-0.5 rounded-full z-10">SALE</span>}
                <img src={p.mediaUrl} alt={p.title} className="w-full h-24 object-cover rounded-lg bg-gray-100" />
                <div>
                  <div className="text-xs font-bold text-[#4A1C6B] truncate">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.category}</div>
                  <div className="text-xs font-semibold text-[#D4A017] mt-1">₦{p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
