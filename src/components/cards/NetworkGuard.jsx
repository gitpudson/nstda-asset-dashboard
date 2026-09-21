import { useEffect, useState } from "react";
import { checkNetworkAccess } from "../../services/networkService";


export default function NetworkGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [currentIP, setCurrentIP] = useState("");

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const result = await checkNetworkAccess();

        setAllowed(result.allowed);
        setCurrentIP(result.ip || "");
      } catch (error) {
        console.error("Network verification failed:", error);
        setAllowed(false);
      } finally {
        // setLoading(false);
      }
    };

    verifyAccess();
  }, []);

  // ระหว่างตรวจสอบ IP
  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         height: "100vh",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         fontSize: "18px",
  //       }}
  //     >
  //       กำลังตรวจสอบเครือข่าย...        
   
  //     </div>
  //   );
  // }

  //Maintainance mode
  if (loading) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "100px auto",
          textAlign: "center",
          padding: "24px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <h2>🚫 ไม่สามารถเข้าใช้งานได้</h2>

        <p>
          ระบบอยู่ระหว่างปรับปรุงข้อมูล
        </p>

        <p>
          ขออภัยในความไม่สะดวก
        </p>

      </div>
    );
  }

  // ไม่อนุญาตให้เข้าใช้งาน
  if (!allowed) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "100px auto",
          textAlign: "center",
          padding: "24px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <h2>🚫 ไม่สามารถเข้าใช้งานได้</h2>

        <p>
          ระบบนี้อนุญาตเฉพาะผู้ใช้งานภายในเครือข่ายองค์กรเท่านั้น
        </p>

        {currentIP && (
          <p>
            Public IP ปัจจุบัน:
            <strong> {currentIP}</strong>
          </p>
        )}

        <p>
          หากคุณเชื่อมต่อผ่านเครือข่ายองค์กรอยู่แล้ว
          กรุณาติดต่อผู้ดูแลระบบ
        </p>
      </div>
    );
  }

  // อนุญาตให้เข้าระบบ
  return <>{children}</>;
}