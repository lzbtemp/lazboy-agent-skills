/**
 * La-Z-Boy Base Component
 * =======================
 * Starting point for any React component in a La-Z-Boy project.
 * All brand colors, fonts, and spacing are pre-applied via CSS custom properties.
 *
 * Usage: Copy this file and replace the example UI with your component content.
 * Never hardcode brand colors or fonts — always use the CSS variables below.
 */

import React from "react";

// ── Brand CSS variables (inject once at app root or in your global CSS) ──────
const brandStyles = `
  :root {
    --color-primary:      #1B3A6B;
    --color-accent:       #C0392B;
    --color-green:        #8FAF8A;
    --color-bg:           #FAF8F5;
    --color-text:         #2C2C2C;
    --color-text-light:   rgba(44, 44, 44, 0.6);
    --color-white:        #FFFFFF;

    --font-stack:         'Helvetica Neue', Helvetica, Arial, sans-serif;
    --font-size-h1:       clamp(32px, 5vw, 48px);
    --font-size-h2:       clamp(24px, 4vw, 32px);
    --font-size-h3:       20px;
    --font-size-body:     15px;
    --font-size-caption:  12px;
    --font-weight-bold:   700;
    --font-weight-semi:   600;
    --font-weight-body:   400;

    --radius-sm:          4px;
    --radius-md:          8px;
    --radius-lg:          16px;
    --radius-full:        9999px;

    --spacing-xs:  4px;
    --spacing-sm:  8px;
    --spacing-md:  16px;
    --spacing-lg:  24px;
    --spacing-xl:  32px;
    --spacing-2xl: 48px;
  }

  * { box-sizing: border-box; }

  body {
    font-family:      var(--font-stack);
    font-size:        var(--font-size-body);
    color:            var(--color-text);
    background-color: var(--color-bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
  }

  h1 { font-size: var(--font-size-h1); font-weight: var(--font-weight-bold); color: var(--color-primary); }
  h2 { font-size: var(--font-size-h2); font-weight: var(--font-weight-bold); color: var(--color-primary); }
  h3 { font-size: var(--font-size-h3); font-weight: var(--font-weight-semi); color: var(--color-text); }
`;

// ── Reusable brand-styled sub-components ─────────────────────────────────────
export const BrandButton = ({ children, variant = "primary", onClick }) => {
  const styles = {
    primary: {
      backgroundColor: "var(--color-accent)",
      color: "var(--color-white)",
    },
    secondary: {
      backgroundColor: "transparent",
      color: "var(--color-primary)",
      border: "2px solid var(--color-primary)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-accent)",
      border: "none",
      textDecoration: "underline",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        fontFamily: "var(--font-stack)",
        fontSize: "var(--font-size-body)",
        fontWeight: "var(--font-weight-semi)",
        padding: "var(--spacing-sm) var(--spacing-lg)",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        border: styles[variant].border || "none",
        transition: "opacity 0.15s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
};

export const BrandCard = ({ title, children }) => (
  <div
    style={{
      backgroundColor: "var(--color-white)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--spacing-xl)",
      boxShadow: "0 2px 12px rgba(27, 58, 107, 0.08)",
    }}
  >
    {title && (
      <h3 style={{ marginTop: 0, marginBottom: "var(--spacing-md)" }}>{title}</h3>
    )}
    {children}
  </div>
);

export const BrandBadge = ({ label, color = "primary" }) => {
  const colors = {
    primary: { bg: "var(--color-primary)", text: "var(--color-white)" },
    accent:  { bg: "var(--color-accent)",  text: "var(--color-white)" },
    green:   { bg: "var(--color-green)",   text: "var(--color-text)"  },
  };
  return (
    <span
      style={{
        backgroundColor: colors[color].bg,
        color: colors[color].text,
        fontFamily: "var(--font-stack)",
        fontSize: "var(--font-size-caption)",
        fontWeight: "var(--font-weight-semi)",
        padding: "2px var(--spacing-sm)",
        borderRadius: "var(--radius-full)",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
};

// ── BrandFooter — Comfort Blue bar with copyright + social icons ─────────────
export const BrandFooter = ({ compact = false }: { compact?: boolean }) => {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        backgroundColor: "var(--color-primary)",
        padding: compact ? "var(--spacing-md) var(--spacing-lg)" : "var(--spacing-xl) var(--spacing-lg)",
        fontFamily: "var(--font-stack)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "var(--font-size-caption)", margin: 0 }}>
          &copy; {year} La-Z-Boy Incorporated. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "var(--spacing-md)", alignItems: "center" }}>
          {/* Inline SVG social icons — see SKILL.md §1 for full paths */}
          <a href="https://www.facebook.com/lazboy" aria-label="Facebook" style={{ color: "rgba(255,255,255,0.5)" }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com/lazboy" aria-label="Instagram" style={{ color: "rgba(255,255,255,0.5)" }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://www.pinterest.com/lazboy" aria-label="Pinterest" style={{ color: "rgba(255,255,255,0.5)" }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

// ── AppShell — Full-height layout with optional header and brand footer ──────
export const AppShell = ({
  children,
  header,
  compactFooter = false,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  compactFooter?: boolean;
}) => (
  <>
    <style>{brandStyles}</style>
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {header}
      <main style={{ flex: 1 }}>{children}</main>
      <BrandFooter compact={compactFooter} />
    </div>
  </>
);

// ── Example component (replace with your own) ─────────────────────────────────
export default function LaZBoyBaseComponent() {
  return (
    <>
      <style>{brandStyles}</style>
      <div style={{ padding: "var(--spacing-2xl)", maxWidth: "800px", margin: "0 auto" }}>
        <h1>La-Z-Boy Component</h1>
        <p style={{ color: "var(--color-text-light)", marginBottom: "var(--spacing-xl)" }}>
          Replace this content with your component. Brand variables are pre-applied.
        </p>

        <BrandCard title="Example Card">
          <p>Card content goes here. Body text uses Charcoal on Warm White.</p>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-md)" }}>
            <BrandBadge label="Active" color="green" />
            <BrandBadge label="Featured" color="primary" />
          </div>
        </BrandCard>

        <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-xl)" }}>
          <BrandButton variant="primary">Primary CTA</BrandButton>
          <BrandButton variant="secondary">Secondary</BrandButton>
          <BrandButton variant="ghost">Learn more</BrandButton>
        </div>
      </div>
    </>
  );
}
