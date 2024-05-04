import React, { useContext } from "react";
import "./agentsPage.scss";
import { Link, useLoaderData } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PulseAnimationContainerCard from "../../ui/PulseAnimationContainerCard";
import AgentProfile from "../../components/agentProfile/AgentProfile";
import Footer from "../../components/footer/Footer";

const AgentsPage = () => {
  const { data } = useLoaderData();
  const { currentUser } = useContext(AuthContext);

  if (!data) return <PulseAnimationContainerCard />;

  return (
    <div className="agentsPage">
      <h1>List of agents from all over Poland</h1>
      <div className="details">
        <div className="wrapper">
          {data?.agents.map((agent) => (
            <Link
              to={
                currentUser?.id === agent.id
                  ? "/profile"
                  : `/userProfile/${agent.id}`
              }
              className="agent"
              key={agent.id}
            >
              <AgentProfile agent={agent} />
            </Link>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AgentsPage;
