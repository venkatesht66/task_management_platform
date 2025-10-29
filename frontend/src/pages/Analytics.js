import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { StatusPie, TrendLine, UserBar } from "../components/Charts";
import Loader from "../components/Loader";

export default function Analytics(){
  const { token } = useAuth();
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [userPerf, setUserPerf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const ov = await api("/analytics/overview", { method: "GET", token });
        const tr = await api("/analytics/trends", { method: "GET", token });
        setOverview(ov?.data || ov);
        setTrends(tr?.data || tr);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [token]);

  if (loading) return <div className="card"><Loader/></div>;

  return (
    <div>
      <div className="card">
        <h2>Analytics Overview</h2>
        {overview ? (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div><h4>By Status</h4><StatusPie data={overview.byStatus || []} /></div>
            <div><h4>By Priority</h4><StatusPie data={overview.byPriority || []} /></div>
          </div>
        ) : <p>No overview</p>}
      </div>

      <div className="card">
        <h2>Trends</h2>
        <TrendLine data={trends} />
      </div>

      {userPerf && <div className="card"><h3>User Performance</h3><UserBar data={userPerf} /></div>}
    </div>
  );
}