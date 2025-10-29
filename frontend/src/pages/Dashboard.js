import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { StatusPie, TrendLine } from "../components/Charts";
import Loader from "../components/Loader";

export default function Dashboard(){
  const { token } = useAuth();
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async ()=>{
      try {
        const ov = await api("/analytics/overview", { method: "GET", token });
        const tr = await api("/analytics/trends", { method: "GET", token });
        setOverview(ov?.data || ov);
        setTrends(tr?.data || tr);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    })();
  }, [token]);

  if (loading) return <div className="card"><Loader/></div>;

  return (
    <div>
      <div className="card">
        <h2>Overview</h2>
        {overview ? (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div>
              <h4>Status distribution</h4>
              <StatusPie data={overview.byStatus || overview.status || []} />
            </div>
            <div>
              <h4>Priority distribution</h4>
              <StatusPie data={overview.byPriority || overview.priority || []} />
            </div>
          </div>
        ) : <p>No overview data</p>}
      </div>

      <div className="card">
        <h2>Trends</h2>
        <TrendLine data={trends || []} />
      </div>
    </div>
  );
}