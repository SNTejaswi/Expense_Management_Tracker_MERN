import React from 'react'; // ✅ matches default export
import Footer from './Footer'; // ✅ matches default export

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Main content grows to push footer down */}
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;


