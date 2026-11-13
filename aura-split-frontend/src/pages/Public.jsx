import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, fmt, token } from "../api";
import LandingDesktop from "./LandingDesktop";
import LandingMobile from "../mobile/LandingMobile";

export { LandingDesktop };

// Responsive landing that serves Desktop on screens >= 768px and Mobile on < 768px
export function Landing() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <LandingMobile /> : <LandingDesktop />;
}

export function Auth({ mode }) {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" }), [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = async () => { try { await api.auth(mode, f); nav("/app"); } catch (e) { setErr(e.message); } };
  const up = mode === "signup";
  return (<div className="wrap" style={{ maxWidth: 440 }}><div className="card col">
    <Link to="/" className="logo">Aura <b>Split</b></Link>
    <h2>{up ? "Create your account" : "Welcome back"}</h2>
    {up && <input placeholder="Full name" value={f.name} onChange={set("name")} />}
    <input placeholder="Email" value={f.email} onChange={set("email")} />
    <input type="password" placeholder="Password (min 8 characters)" value={f.password} onChange={set("password")} />
    {err && <p className="owe">{err}</p>}
    <button className="btn dark" onClick={go}>{up ? "Create account" : "Log in"}</button>
    <p className="mut center">{up ? <>Have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/signup">Sign up</Link></>}</p>
  </div></div>);
}

export function Invite() {
  const { t } = useParams(), nav = useNavigate();
  const [d, setD] = useState(null), [me, setMe] = useState(true);
  useEffect(() => { api.invite(t).then(setD); }, []);
  if (!d) return <p className="wrap mut">Loading…</p>;
  const go = async () => { if (!token()) return nav("/signup"); if (me) await api.claim(t); nav("/app"); };
  return (<div className="wrap" style={{ maxWidth: 440 }}><div className="card col">
    <span className="pill">Group invitation</span>
    <h2>Join {d.group}</h2>
    <p className="mut">Are you {d.name}? Your share so far: <b>{fmt(d.amountPaise)}</b></p>
    <label className="card row"><input type="radio" style={{ width: "auto" }} checked={me} onChange={() => setMe(true)} /><span><b>Yes, I am {d.name}</b><br /><span className="mut">Link to my account and claim my existing splits.</span></span></label>
    <label className="card row"><input type="radio" style={{ width: "auto" }} checked={!me} onChange={() => setMe(false)} /><span><b>Join as someone else</b><br /><span className="mut">Create a new member for me.</span></span></label>
    <button className="btn dark" onClick={go}>Continue</button>
  </div></div>);
}
