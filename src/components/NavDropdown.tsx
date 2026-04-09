"use client";

import { useState, type ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

interface DropdownItem {
  text: string;
  href: string;
  isExternal?: boolean;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  children?: ReactNode;
}

export default function NavDropdown({ label, items, children }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="nav-dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a href="#" className="nav-link">
        {children || label}
        <span className="nav-arrow">
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </a>
      {isOpen && (
        <ScrollReveal scrollReveal="slideDown" scrollRevealDelay="0.1">
          <ul className="nav-dropdown-menu">
            {items.map((item, idx) => (
              <li key={idx} className="nav-dropdown-item">
                <a href={item.href} className="nav-dropdown-link">
                  {item.text}
                  {item.isExternal && (
                    <span className="external-link-icon">
                      <svg viewBox="0 0 24 24" width="12" height="12">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      )}
    </div>
  );
}
