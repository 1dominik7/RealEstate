import { useSpring, animated } from "@react-spring/web";


const PulseAnimationPrice = () => {
  const rightSprings = useSpring({
    from: { x: "0%", opacity: 0.5 },
    to: { x: "20%", opacity: 1 },
    loop: true,
    config: { duration: 1000 },
  });

  return (
    <>
      <div className="animatedContainer">
        <div className="animatedSection">
          <animated.div
            style={{
              height: 50,
              width: 50,
              marginTop: 50,
              background: "rgba(245, 245, 245, 0.5)",
              borderRadius: 8,
              ...rightSprings,
            }}
          />
        </div>
      </div>
    </>
  );
};


export default PulseAnimationPrice;
