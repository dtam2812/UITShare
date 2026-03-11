import React, { useState, useEffect } from "react";
import Admin from "./pages/Admin/Admin.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";

function App() {
  const [view, setView] = useState("faq");
  useEffect(() => {window.scrollTo(0, 0);}, [view]);

  if (view === "contact") {
    return <Contact />;
  }

  if (view === "faq") {
    return <FAQ onNavigate={setView} />;
  }

  return <Admin />;
}

export default App;
