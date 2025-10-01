import React from "react";
import ShopDet from '../components/ShopDet';

import "../Style/Shop.css"; // optional styling file

function Shop() {

  return (
    <div className="shop-container">
      <h2>🛍️ متجر المنتجات</h2>
      <ShopDet nbrOfView="*"/>
    </div>
  );
}

export default Shop;
