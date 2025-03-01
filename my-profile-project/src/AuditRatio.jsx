export function AuditRatio(props) {
    const totalUp = formatBytes(props.Data.totalUp, 2);
    const totalDown = formatBytes(props.Data.totalDown, 2);
    const { widthUp, widthDown } = getWidth(
      props.Data.totalUp,
      props.Data.totalDown
    );
  
    return (
      <div className="AuditRatio-container graph">
        <p>Audit Ratio</p>
        <div className="Audit-container">
          <div className="bar-container">
            <svg width="80%" height="70">
              <rect
                x="0"
                y="10"
                width={`${widthDown}%`}
                height="20"
                fill="#55bace"
              ></rect>
              <text x={`${widthDown / 2}%`} y="25" fill="white" textAnchor="middle" dominantBaseline="middle">
                Received: {totalDown}
              </text>
  
              <rect
                x="0"
                y="40"
                width={`${widthUp}%`}
                height="20"
                fill="#6c79b8"
              ></rect>
              <text x={`${widthUp / 2}%`}  y="55" fill="white"  textAnchor="middle" dominantBaseline="middle">
                Done: {totalUp}
              </text>
            </svg>
          </div>
          <div>
            <div className="Ratio-Container">
              <p style={{ fontSize: "12px" }}>Ratio</p>
              <p style={{ fontSize: "25px" }}>
                {props.Data.auditRatio.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export function formatBytes(bytes, precision) {
    let units = ["B", "kB", "MB"];
  
    if (bytes === 0) return "0 B";
  
    let exponent = Math.floor(Math.log(bytes) / Math.log(1000));
    let value = (bytes / Math.pow(1000, exponent)).toFixed(precision);
  
    return `${value} ${units[exponent]}`;
  }
  
  function getWidth(totalUp, totalDown) {
      const maxValue = Math.max(totalUp, totalDown); // Get the maximum value
    
      // Calculate the widths based on the values as a percentage of the SVG width
      const maxWidthPercentage = 100; // Maximum width as a percentage of the SVG width
      const widthUp = maxValue === 0 ? 0 : (totalUp / maxValue) * maxWidthPercentage;
      const widthDown = maxValue === 0 ? 0 : (totalDown / maxValue) * maxWidthPercentage;
    
      return { widthUp, widthDown };
    }