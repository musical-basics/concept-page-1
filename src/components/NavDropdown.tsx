"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";

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

/**
 * Nav dropdown matching Concept theme behavior:
 *  - Menu always rendered in DOM (CSS exit animations).
 *  - Enter/exit: opacity 300ms cubic-bezier(0.4, 0.22, 0.28, 1).
 *  - Staggered item entrance: each item slides from translateX(20%)
 *    with incremental delay (0.3s, 0.4s, 0.5s …).
 *  - Arrow rotates on open.
 *  - 80ms leave-delay for sloppy cursor tolerance.
 */
export default function NavDropdown({
  label,
  items,
  children,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    leaveTimer.current = setTimeout(() => {
      setIsOpen(false);
    }, 80);
  }, []);

  return (
    <div
      className={`nav-dropdown${isOpen ? " is-active" : ""}`}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <a href="#" className="nav-link">
        {children || label}
        <span className={`nav-arrow${isOpen ? " flipped" : ""}`}>
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>

      {/* Always in DOM so exit transition can play */}
      <div className={`nav-dropdown-menu${isOpen ? " is-open" : ""}`}>
        <ul className="nav-dropdown-list">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="nav-dropdown-item"
              style={{ transitionDelay: isOpen ? `${0.3 + idx * 0.1}s` : "0s" }}
            >
              <a href={item.href} className="nav-dropdown-link">
                {item.text}
                {item.isExternal && (
                  <span className="external-link-icon">
                    <svg viewBox="0 0 24 24" width="12" height="12">
                      <path
                        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
