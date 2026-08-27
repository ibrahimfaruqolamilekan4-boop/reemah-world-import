import React, { useState } from 'react';
import { ShieldCheck, ImageIcon, Video, CheckCircle, Package, X, Loader2, Trash2 } from 'lucide-react';
import { uploadMediaToCloudinary } from '../utils/cloudinary';

const CATEGORIES = ["All", "Kitchenware", "Home Interior", "Electrical Appliances", "Fashion"];

export const AdminDashboard = ({ products, setProducts, setPosts, toast, orders = [], onUpdateOrderStatus }: any) => {
  const [tab, setTab] = useState("newPost");
  
  // New Post State
  const [poster, setPoster] = useState("Sister Reemah (Founder & Chief Import Buyer)");
  const [multiPics, setMultiPics] = useState<string[]>([]);
  const [videoDemo, setVideoDemo] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [postCategory, setPostCategory] = useState(CATEGORIES[1]);
  const [postCaption, setPostCaption] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  // Simple Product Upload State
  const [singlePic, setSinglePic] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState(CATEGORIES[1]);
  const [prodStock, setProdStock] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOldPrice, setProdOldPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [isUploadingSingle, setIsUploadingSingle] = useState(false);

  // Order Management State
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  const filteredOrders = orders.filter((o: any) => {
    const matchSearch = o.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const handleMultiPic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    setIsUploadingMedia(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          setUploadProgressText(`Uploading image ${i + 1} of ${files.length}...`);
          const result = await uploadMediaToCloudinary(file, (pct) => {
            setUploadProgressText(`Uploading image ${i + 1}/${files.length} (${pct}%)...`);
          });
          if (result.url) {
            setMultiPics(prev => [...prev, result.url]);
            successCount++;
          }
        } catch (err: any) {
          console.error("Cloudinary image upload error", err);
          toast(`Image ${i + 1} upload failed: ${err.message || 'Error'}`);
        }
      }
    }

    setIsUploadingMedia(false);
    setUploadProgressText("");
    if (successCount > 0) {
      toast(`Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}!`);
    }
    // reset input
    e.target.value = "";
  };

  const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast("Please select a valid MP4/video file.");
      return;
    }

    setIsUploadingMedia(true);
    setUploadProgressText("Preparing video upload...");

    try {
      toast("Uploading video demo to Cloudinary...");
      const result = await uploadMediaToCloudinary(file, (pct) => {
        setUploadProgressText(`Uploading video: ${pct}%...`);
      });
      if (result.url) {
        setVideoDemo(result.url);
        toast("Video uploaded successfully!");
      }
    } catch (err: any) {
      console.error("Cloudinary video upload error", err);
      toast("Video upload failed: " + (err.message || "Network Error"));
    } finally {
      setIsUploadingMedia(false);
      setUploadProgressText("");
      e.target.value = "";
    }
  };

  const removeImage = (idxToRemove: number) => {
    setMultiPics(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const removeVideo = () => {
    setVideoDemo("");
  };

  const handlePublishPost = async () => {
    if (!postTitle.trim() || !postPrice || (!multiPics.length && !videoDemo)) {
      toast("Please provide a title, price, and at least one image or video.");
      return;
    }

    const newId = "p_" + Date.now();
    const primaryImage = multiPics.length > 0 ? multiPics[0] : "";
    const extraImages = multiPics.length > 1 ? multiPics.slice(1) : [];

    const newProd = {
      id: newId,
      name: postTitle.trim(),
      title: postTitle.trim(),
      category: postCategory,
      price: Number(postPrice),
      oldPrice: Number(postPrice) * 1.2,
      desc: postCaption.trim(),
      description: postCaption.trim(),
      stock: 50,
      img: primaryImage,
      mediaUrl: primaryImage || videoDemo,
      images: multiPics,
      additionalImages: extraImages,
      videoUrl: videoDemo || undefined,
      rating: 5.0,
      ratingAverage: 5.0,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    const adminId = poster.includes("Reemah") ? "admin-reemah" : "admin-fatima";
    const newPost = {
      id: "post_" + Date.now(),
      productId: newId,
      caption: `✨ New Arrival! ${postTitle.trim()}\n\n${postCaption.trim()}\n\nPrice: ₦${Number(postPrice).toLocaleString()}`,
      likes: 0,
      likedByMe: false,
      comments: [],
      createdAt: Date.now(),
      images: multiPics,
      videoUrl: videoDemo || undefined,
      adminId: adminId
    };

    try {
      const p1 = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (!p1.ok) {
        console.warn('Product save response not 200:', await p1.text());
      }

      const p2 = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (!p2.ok) {
        console.warn('Post save response not 200:', await p2.text());
      }
      
      setProducts((prev: any) => [newProd, ...prev]);
      if (typeof setPosts === 'function') {
        setPosts((prev: any) => [newPost, ...prev]);
      }

      // Update local storage backup
      try {
        const storedProds = JSON.parse(localStorage.getItem('reemah_products') || '[]');
        localStorage.setItem('reemah_products', JSON.stringify([newProd, ...storedProds]));
        const storedPosts = JSON.parse(localStorage.getItem('reemah_posts') || '[]');
        localStorage.setItem('reemah_posts', JSON.stringify([newPost, ...storedPosts]));
      } catch (e) {}

      toast("Published Post to Feed & Store!");
      setTab("products");
      setPostTitle("");
      setPostPrice("");
      setMultiPics([]);
      setVideoDemo("");
      setPostCaption("");
    } catch (e: any) {
      console.error("Publish error:", e);
      toast("Error publishing: " + (e?.message || "Unknown error"));
    }
  };

  const handleSimpleUpload = async () => {
    if (!prodName.trim() || !prodPrice || !singlePic) {
      toast("Please provide name, price, and picture.");
      return;
    }
    const newProd = {
      id: "p_" + Date.now(),
      name: prodName.trim(),
      title: prodName.trim(),
      category: prodCategory,
      price: Number(prodPrice),
      oldPrice: prodOldPrice ? Number(prodOldPrice) : undefined,
      desc: prodDesc.trim(),
      description: prodDesc.trim(),
      stock: Number(prodStock) || 10,
      img: singlePic,
      mediaUrl: singlePic,
      images: [singlePic],
      additionalImages: [],
      rating: 5.0,
      ratingAverage: 5.0,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (!res.ok) throw new Error('Failed to save to database');
      
      setProducts((prev: any) => [newProd, ...prev]);
      try {
        const storedProds = JSON.parse(localStorage.getItem('reemah_products') || '[]');
        localStorage.setItem('reemah_products', JSON.stringify([newProd, ...storedProds]));
      } catch (e) {}

      toast("Product added successfully!");
      setTab("products");
      setProdName("");
      setProdPrice("");
      setSinglePic("");
      setProdOldPrice("");
      setProdDesc("");
      setProdStock("");
    } catch (e: any) {
      toast("Error: " + (e?.message || "Failed"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#4A1C6B]">Admin Control Hub</h2>
          <p className="text-xs sm:text-sm text-gray-500">Manage imports, live community feed, and customer shipments</p>
        </div>
        <span className="flex items-center gap-1 text-xs bg-[#D4A017]/20 text-[#4A1C6B] font-bold px-3 py-1.5 rounded-full border border-[#D4A017]/30">
          <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
          Verified Admin
        </span>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button 
          onClick={() => setTab("newPost")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
            tab === "newPost" ? "bg-[#4A1C6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          ✍️ New Feed Post & Arrival
        </button>
        <button 
          onClick={() => setTab("simpleUpload")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
            tab === "simpleUpload" ? "bg-[#4A1C6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📦 Simple Product Upload
        </button>
        <button 
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
            tab === "orders" ? "bg-[#4A1C6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📋 Customer Orders ({orders.length})
        </button>
        <button 
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
            tab === "products" ? "bg-[#4A1C6B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📊 Inventory ({products.length})
        </button>
      </div>

      {tab === "newPost" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h3 className="font-display font-semibold text-lg text-[#4A1C6B]">Create Community Arrival Post</h3>

          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Post As Admin Persona</label>
            <select 
              value={poster} 
              onChange={e => setPoster(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017] bg-gray-50"
            >
              <option>Sister Reemah (Founder & Chief Import Buyer)</option>
              <option>Sister Fatima (Logistics & Wholesale Director)</option>
            </select>
          </div>

          {/* Media Upload Area */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#4A1C6B] uppercase">Upload Photos (Select Multiple)</label>
                {multiPics.length > 0 && (
                  <span className="text-xs text-[#D4A017] font-bold">{multiPics.length} photo{multiPics.length > 1 ? 's' : ''} uploaded</span>
                )}
              </div>
              <label className="border-2 border-dashed border-[#D4A017]/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#D4A017]/10 transition bg-gray-50">
                <ImageIcon className="w-8 h-8 text-[#D4A017] mb-2" />
                <span className="text-sm font-semibold text-[#4A1C6B]">Click to select pictures</span>
                <span className="text-xs text-gray-400 mt-1">Multi-image carousel support</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleMultiPic} 
                  disabled={isUploadingMedia}
                  className="hidden" 
                />
              </label>

              {/* Thumbnails preview with remove button */}
              {multiPics.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {multiPics.map((src, idx) => (
                    <div key={idx} className="relative group w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow-md hover:bg-red-700 transition"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#4A1C6B] uppercase">Upload Video Demonstration</label>
                {videoDemo && (
                  <span className="text-xs text-[#D4A017] font-bold">1 video uploaded</span>
                )}
              </div>
              <label className="border-2 border-dashed border-[#D4A017]/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#D4A017]/10 transition bg-gray-50">
                <Video className="w-8 h-8 text-[#D4A017] mb-2" />
                <span className="text-sm font-semibold text-[#4A1C6B]">Click to upload MP4 / Video</span>
                <span className="text-xs text-gray-400 mt-1">HD Video Player support</span>
                <input 
                  type="file" 
                  accept="video/mp4,video/*" 
                  onChange={handleVideo} 
                  disabled={isUploadingMedia}
                  className="hidden" 
                />
              </label>

              {videoDemo && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video flex items-center justify-center">
                  <video src={videoDemo} controls className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition"
                    title="Remove video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upload progress banner */}
          {isUploadingMedia && (
            <div className="bg-[#FAF5FF] border border-[#D4A017]/40 rounded-xl p-3 flex items-center gap-3 text-[#4A1C6B] text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-[#D4A017]" />
              <span className="font-medium">{uploadProgressText || 'Uploading media to Cloudinary...'}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Product Title / Name *</label>
              <input 
                type="text" 
                value={postTitle} 
                onChange={e => setPostTitle(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017]" 
                placeholder="e.g. Luxury 12-Piece Turkish Granite Cookware Set" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Price (₦) *</label>
              <input 
                type="number" 
                value={postPrice} 
                onChange={e => setPostPrice(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017]" 
                placeholder="e.g. 150000" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Import Category</label>
            <select 
              value={postCategory} 
              onChange={e => setPostCategory(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D4A017] bg-gray-50"
            >
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-2 uppercase">Arrival Notes / Caption Description</label>
            <textarea 
              rows={4} 
              value={postCaption} 
              onChange={e => setPostCaption(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#D4A017]" 
              placeholder="Describe the imported product, quality, origin details, and dispatch timeframe..." 
            />
          </div>

          <button 
            onClick={handlePublishPost} 
            disabled={isUploadingMedia}
            className="w-full bg-[#D4A017] text-[#4A1C6B] font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUploadingMedia ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Uploading media in progress...
              </>
            ) : (
              <>
                🚀 Publish Arrival to Feed & Store
              </>
            )}
          </button>
        </div>
      )}

      {tab === "simpleUpload" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-lg text-[#4A1C6B]">Quick Catalog Upload</h3>
          
          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Upload Product Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    setIsUploadingSingle(true);
                    toast("Uploading image to Cloudinary...");
                    const res = await uploadMediaToCloudinary(file);
                    if (res.url) {
                      setSinglePic(res.url);
                      toast("Image uploaded successfully!");
                    }
                  } catch (err: any) {
                    toast("Image upload failed: " + (err.message || 'Error'));
                  } finally {
                    setIsUploadingSingle(false);
                  }
                }
              }} 
              className="w-full text-sm" 
            />
            {isUploadingSingle && (
              <div className="flex items-center gap-2 text-xs text-[#4A1C6B] mt-2 font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-[#D4A017]" /> Uploading to Cloudinary...
              </div>
            )}
            {singlePic && (
              <img src={singlePic} className="w-20 h-20 object-cover rounded-xl mt-2 border border-gray-200" alt="preview" />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Product Name</label>
            <input 
              type="text" 
              value={prodName} 
              onChange={e => setProdName(e.target.value)} 
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" 
              placeholder="e.g. Marble Luxury Table Clock"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Category</label>
              <select 
                value={prodCategory} 
                onChange={e => setProdCategory(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
              >
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Stock Count</label>
              <input 
                type="number" 
                value={prodStock} 
                onChange={e => setProdStock(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" 
                placeholder="e.g. 10" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Price (₦)</label>
              <input 
                type="number" 
                value={prodPrice} 
                onChange={e => setProdPrice(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Old Price (₦) [Optional]</label>
              <input 
                type="number" 
                value={prodOldPrice} 
                onChange={e => setProdOldPrice(e.target.value)} 
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1C6B] mb-1 uppercase">Description</label>
            <textarea 
              rows={3}
              value={prodDesc}
              onChange={e => setProdDesc(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A017]"
              placeholder="Product description and specifications..."
            />
          </div>

          <button 
            onClick={handleSimpleUpload} 
            disabled={isUploadingSingle}
            className="w-full bg-[#D4A017] text-[#4A1C6B] font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition mt-4 disabled:opacity-50"
          >
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
                            <span className="font-bold">{item.qty || item.quantity || 1}x</span> <span className="truncate max-w-[150px]">{item.title || item.name}</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3 font-bold text-[#D4A017]">₦{o.totalAmount?.toLocaleString()}</td>
                      <td className="p-3">
                        <select 
                          value={o.status} 
                          onChange={e => onUpdateOrderStatus(o.id, e.target.value)} 
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-[#D4A017] bg-white text-[#4A1C6B]"
                        >
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
              <div key={p.id} className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2 relative bg-white shadow-xs">
                {p.oldPrice > p.price && (
                  <span className="absolute top-4 left-4 bg-[#D4A017] text-[#4A1C6B] text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    SALE
                  </span>
                )}
                <img 
                  src={p.img || p.mediaUrl} 
                  alt={p.name || p.title} 
                  className="w-full h-28 object-cover rounded-lg bg-gray-100" 
                />
                <div>
                  <div className="text-xs font-bold text-[#4A1C6B] truncate">{p.name || p.title}</div>
                  <div className="text-xs text-gray-500">{p.category}</div>
                  <div className="text-xs font-semibold text-[#D4A017] mt-1">₦{p.price?.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
