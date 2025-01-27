import Layout from "../components/Layout/Layout";
import Confetti from "react-confetti";

function GiftAnimation() {
  const { innerWidth: width, innerHeight: height } = window;

  return (
    <Layout>
      <Confetti width={width} height={height} numberOfPieces={400}/>
    </Layout>
  );
}

export default GiftAnimation;
