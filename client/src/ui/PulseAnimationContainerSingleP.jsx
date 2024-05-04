import { useSpring, animated } from "@react-spring/web";
import "./PulseAnimationContainerSingleP.scss";

const PulseAnimationContainerSingleP = () => {
  const rightSprings = useSpring({
    from: { x: "0%", opacity: 0.5 },
    to: { x: "20%", opacity: 1 },
    loop: true,
    config: { duration: 1000 },
  });

  const leftSprings = useSpring({
    from: { opacity: 0.5 },
    to: { opacity: 1 },
    loop: true,
    config: { duration: 1000 },
  });

  return (
    <>
      <div className="animatedContainerSingleP">
        <div className="animatedSection">
          <animated.div
            style={{
              height: 250,
              marginTop: 50,
              background: "rgba(245, 245, 245, 0.5)",
              borderRadius: 8,
              ...rightSprings,
            }}
          />
          <animated.div
            style={{
              height: 400,
              marginTop: 20,
              background: "rgba(245, 245, 245, 0.5)",
              borderRadius: 8,
              ...rightSprings,
            }}
          />
        </div>
        <div className="animatedSection">
          <animated.div
            style={{
              height: "80vh",
              marginTop: 50,
              background: "rgba(245, 245, 245, 0.5)",
              borderRadius: 8,
              ...leftSprings,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PulseAnimationContainerSingleP;
