import React from "react";

const Dialog = ({ children }) => {
  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "5px", background: "#fff" }}>
      {children}
    </div>
  );
};

const DialogContent = ({ children }) => {
    return <div style={{ padding: "10px" }}>{children}</div>;
};

export { Dialog, DialogContent };