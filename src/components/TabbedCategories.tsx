"use client";

import { useState } from "react";

const tabs = [
  {
    id: "headphones",
    label: "Headphones",
    products: [
      { name: "Studio Monitor Pro", price: "$249", seed: "tabh1" },
      { name: "Wireless Elite", price: "$189", seed: "tabh2" },
      { name: "Gaming Headset X", price: "$159", seed: "tabh3" },
      { name: "Classic Over-Ear", price: "$119", seed: "tabh4" },
    ],
  },
  {
    id: "earphones",
    label: "Earphones",
    products: [
      { name: "Pro Buds ANC", price: "$129", seed: "tabe1" },
      { name: "Sport Fit", price: "$89", seed: "tabe2" },
      { name: "Studio In-Ear", price: "$199", seed: "tabe3" },
      { name: "Wired Classic", price: "$49", seed: "tabe4" },
    ],
  },
  {
    id: "speakers",
    label: "Speakers",
    products: [
      { name: "Bookshelf Duo", price: "$349", seed: "tabs1" },
      { name: "Portable Boom", price: "$99", seed: "tabs2" },
      { name: "Soundbar Ultra", price: "$449", seed: "tabs3" },
      { name: "Subwoofer Pro", price: "$279", seed: "tabs4" },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    products: [
      { name: "Premium Cable", price: "$29", seed: "taba1" },
      { name: "Headphone Stand", price: "$59", seed: "taba2" },
      { name: "Carry Case", price: "$49", seed: "taba3" },
      { name: "DAC Dongle", price: "$79", seed: "taba4" },
    ],
  },
];

export default function TabbedCategories() {
  const [activeTab, setActiveTab] = useState("headphones");

  return (
    <section className="tabbed-section">
      <div className="container">
        <h2 className="section-heading">Shop by Category</h2>
        <div className="tab-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-panel${activeTab === tab.id ? " active" : ""}`}
            id={`tab-${tab.id}`}
          >
            <div className="tab-grid">
              {tab.products.map((prod) => (
                <div className="tab-product" key={prod.seed}>
                  <div className="tab-product-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${prod.seed}/400/400`}
                      alt="Product"
                    />
                  </div>
                  <div className="tab-product-info">
                    <h4>{prod.name}</h4>
                    <p className="price">{prod.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
