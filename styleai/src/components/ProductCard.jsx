function ProductCard({ product, onClick, onAddToCart }) {
  const getTagColor = (tag) => {
    const colors = {
      'Bestseller': 'bg-[#ccff00] text-black',
      'New': 'bg-[#b90afc] text-white',
      'Trending': 'bg-[#bb0058] text-white',
      'Hot': 'bg-[#ff5733] text-white',
      'Cozy': 'bg-[#d4c4b0] text-black',
      'Classic': 'bg-black text-white',
      'Streetwear': 'bg-[#ccff00] text-black',
      'Luxury': 'bg-[#8b7355] text-white',
      'Feminine': 'bg-[#ffb1c3] text-black',
      'Elegant': 'bg-[#1b1b1b] text-white',
      'Trendy': 'bg-[#bb0058] text-white',
      'Sport': 'bg-[#506600] text-white'
    };
    return colors[tag] || 'bg-gray-200 text-black';
  };

  const getColorValue = (colorName) => {
    const colors = {
      'white': '#FFFFFF',
      'black': '#000000',
      'beige': '#D4C4B0',
      'navy': '#000080',
      'grey': '#808080',
      'gray': '#808080',
      'cream': '#F5F0E8',
      'tan': '#D2B48C',
      'brown': '#8B4513',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'blue': '#3498db',
      'burgundy': '#800020',
      'camel': '#C19A6B',
      'champagne': '#F7E7CE',
      'emerald': '#50C878',
      'olive': '#808000',
      'khaki': '#C3B091',
      'pink': '#FFC0CB'
    };
    return colors[colorName.toLowerCase()] || '#ddd';
  };

  return (
    <div className="group border-4 border-black neo-shadow hover:neo-shadow-lg transition-all duration-300 hover:-translate-y-2 bg-white">
      {/* Product Image */}
      <div 
        className="relative aspect-[3/4] overflow-hidden border-b-4 border-black cursor-pointer"
        onClick={() => onClick(product.image)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
        />
        
        {/* Tag Badge */}
        <div className={`absolute top-3 left-3 ${getTagColor(product.tag)} px-3 py-1 text-xs font-black uppercase border-2 border-black rotate-3`}>
          {product.tag}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white font-black text-sm md:text-lg uppercase">QUICK VIEW</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-4">
        <p className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-bold text-sm md:text-base uppercase leading-tight mb-2">
          {product.name}
        </h3>
        
        {/* Colors */}
        <div className="flex gap-1 mb-3">
          {product.colors.slice(0, 3).map((color, i) => (
            <div 
              key={i}
              className="w-4 h-4 rounded-full border-2 border-black"
              style={{ backgroundColor: getColorValue(color) }}
              title={color}
            ></div>
          ))}
        </div>

        {/* Price and Favorite */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-black text-lg md:text-xl">{product.price}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="material-symbols-outlined text-xl md:text-2xl hover:text-[#bb0058] transition-colors"
          >
            favorite_border
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-[#ccff00] text-black font-black text-xs md:text-sm uppercase py-2 md:py-3 border-2 border-black hover:bg-black hover:text-[#ccff00] transition-all neo-shadow hover:translate-y-[-2px] active:translate-y-[1px]"
        >
          🛒 ADD TO CART
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
