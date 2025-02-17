const StarIcon = ({ size = 24, color = "white" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 
      This path creates a four-pointed star with curved edges.
      You can adjust the control points in the C (cubic-bezier) commands
      to get the exact shape you desire.
    */}
    <path d="
      M12,0
      C 15,0 24,4 24,12
      C 24,20 15,24 12,24
      C 9,24 0,20 0,12
      C 0,4 9,0 12,0
      Z
    " />
  </svg>
);

export default StarIcon;
