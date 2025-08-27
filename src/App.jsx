import { useState } from "react";
import { isSignedIn, signIn, signOut ,initClient,onSignInStatusChange} from "./google";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Monthlyview from "./pages/Monthlyview";
import { useEffect } from "react";

export default function App() {
   const [authed, setAuthed] = useState(isSignedIn());
    const [open, setOpen] = useState(false);


  useEffect(() => {
    let unsubscribe = () => {};
    (async () => {
      try {
        await initClient();              // load GIS + init token client
        setAuthed(isSignedIn());         // restore from localStorage if valid
        unsubscribe = onSignInStatusChange(setAuthed);
      } finally {
        // setLoading(false);
      }
    })();
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (e) {
      console.error(e);
      alert("Sign-in failed");
    }
  };


  // useEffect(() => {
  //   initClient().then(() => {
  //     let status=isSignedIn()
  //     console.log("stattus : "+status);
      
  //     setAuthed(status);
  //   });
  // }, []);

  // const handleSignIn = async () => {
  //   try {
  //     await signIn();
  //     setAuthed(true);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to sign in");
  //   }
  // };

  // if (!authed) {
  //   return (
  //     <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
  //       <div style={{ padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
  //         <h2>Finance Dashboard</h2>
  //         <p>Sign in with Google to continue.</p>
  //         <button onClick={handleSignIn}>Sign in with Google</button>
  //       </div>
  //     </div>
  //   );
  // }

   if (!authed) {
    return (
      <div className="app">
  <div className="card">
    <h3>Finance Dashboard</h3>
    <p className="stat">Sign in to continue</p>
    <button className="btn" onClick={handleSignIn}>
      Sign in with Google
    </button>
  </div>
</div>
    );
  }


  return (
    <BrowserRouter>
       <div className="app">
      {/* Top bar for desktop + hamburger for mobile */}
      <header className="topbar">
        <h3 className="logo">Dashboard</h3>
        <button className="hamburger md:hidden" onClick={() => setOpen(true)}>
          ☰
        </button>
        <nav className="nav desktop-only">
          <Link to="/overview">Overview</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/Monthlyview">Monthlyview</Link>
          <button
            className="btn secondary"
            onClick={() => { signOut(); setAuthed(false); }}
          >
            Sign out
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
        <nav className="nav">
          <Link to="/overview" onClick={() => setOpen(false)}>Overview</Link>
          <Link to="/transactions" onClick={() => setOpen(false)}>Transactions</Link>
          {/* <Link to="/categories" onClick={() => setOpen(false)}>Categories</Link> */}
          <button
            className="btn secondary"
            onClick={() => { signOut(); setAuthed(false); setOpen(false); }}
          >
            Sign out
          </button>
        </nav>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/overview" />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/Monthlyview" element={<Monthlyview />} />
        </Routes>
      </main>
    </div>
    </BrowserRouter>
  );
}
