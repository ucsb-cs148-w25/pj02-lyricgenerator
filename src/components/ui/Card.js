import React from "react";

const Card = ({ children }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
    return <div style={{ padding: "10px" }}>{children}</div>;
};
  

export { Card, CardContent };
