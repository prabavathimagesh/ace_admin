'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    router.push("/admin/organisers");
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f2f2f2",
      padding: 20
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        padding: "30px",
        width: "100%",
        maxWidth: "380px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Login</h2>

        <label>Email</label>
        <input
          type="email"
          onChange={(e)=>setEmail(e.target.value)}
          style={{ width:"100%", padding:"12px", margin:"6px 0 16px" }}
        />

        <label>Password</label>
        <input
          type="password"
          onChange={(e)=>setPass(e.target.value)}
          style={{ width:"100%", padding:"12px", marginTop:6 }}
        />

        <button
          type="submit"
          style={{
            width:"100%",
            padding:"12px",
            marginTop:"20px",
            background:"#111",
            color:"#fff",
            border:"none",
            borderRadius:"6px",
            fontSize:16,
            cursor:"pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
