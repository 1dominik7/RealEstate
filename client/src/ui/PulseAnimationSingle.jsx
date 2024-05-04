import { useSpring, animated } from "@react-spring/web";
import './PulseAnimationSingle.scss'

const PulseAnimationSingle = () => {
  const rightSprings = useSpring({
    from: { x: "0%", opacity: 0.5 },
    to: { x: "25%", opacity: 1 },
    loop: true,
    config: { duration: 1000 },
  });

  return (
    <>
      <div className="animatedContainerSingle">
        <div className="animatedSection">
          <animated.div
            style={{
              height: 200,
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


export default PulseAnimationSingle;
