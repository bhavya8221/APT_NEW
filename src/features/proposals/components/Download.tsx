import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Typography, Spin } from "antd";
import { Url } from "@/utils/constants/host";
import { Button } from "@/components/ui/Button";
import { FaFileDownload as FaFileDownloadRaw } from "react-icons/fa";
import "./Download.scss";

// Cast icon (your project rule)
const FaFileDownload = FaFileDownloadRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;

const { Title } = Typography;

interface ProposalData {
  id: number;
  title: string;
  file_name: string;
  file_type: string;
  proposal_type?: string;
}

const Download: React.FC = () => {
  const location = useLocation();
  const state = location.state as { data?: ProposalData };

  const data = state?.data;

  const [loading, setLoading] = useState(true);
  const [docSource, setDocSource] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginTokenApt")
      : null;

  const userStatus =
    typeof window !== "undefined" ? localStorage.getItem("UserStatus") : null;

  // If page accessed directly without router state → redirect user
  if (!data) {
    return <Navigate to="/proposals" replace />;
  }

  useEffect(() => {
    const fileUrl = `${Url}${data.file_type}/${data.file_name}`;

    // simulate slight load time
    setTimeout(() => {
      setDocSource(fileUrl);
      setLoading(false);
    }, 800);
  }, [data]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = docSource;
    link.download = data.file_name;
    link.click();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (!token) {
    return (
      <div className="unauthenticated">
        <Title>Please sign in to continue.</Title>
      </div>
    );
  }

  return (
    <div className="DownloadPage">
      <div className="download-header">
        <Title level={3}>{data.title}</Title>

        {userStatus === "ACTIVATE" && (
          <Button variant="default" onClick={handleDownload}>
            Download Proposal <FaFileDownload width={18} height={18} />
          </Button>
        )}
      </div>

      {/* VIEWER ------------------------------------------------------------ */}
      <div className="viewer-section">
        {loading ? (
          <div className="loading-block">
            <Spin size="large" />
            <p>Loading document…</p>
          </div>
        ) : (
          <iframe
            src={`https://docs.google.com/viewer?url=${docSource}&embedded=true`}
            title="proposal-file"
            width="100%"
            height="650"
            onLoad={() => setLoading(false)}
            className="proposal-iframe"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Download;
