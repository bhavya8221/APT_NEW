import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Card, Typography } from "antd";
import { Url } from "@/utils/constants/host";
import "./CardComponent.scss";

// New Button
import { Button } from "@/components/ui/Button";

// React icon fix (TS-safe)
import { FaFileDownload as FaFileDownloadIconRaw } from "react-icons/fa";
const FaFileDownload = FaFileDownloadIconRaw as React.FC<
  React.SVGProps<SVGSVGElement>
>;

interface ProposalCardProps {
  data: {
    id: number;
    title: string;
    file_name: string;
    file_type: string;
    proposal_type: string;
  };
}

export default function CardComponent({ data }: ProposalCardProps) {
  const [docSource, setDocSource] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const userStatus = localStorage.getItem("UserStatus");

  useEffect(() => {
    const src = `${Url}${data?.file_type}/${data?.file_name}`;
    setDocSource(src);
  }, [data]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = docSource;
    link.download = data.file_name;
    link.click();
  };

  const generateRouteSlug = (title: string) => {
    const map: Record<string, string> = {
      "Coaching Agreement Template": "coaching-agreement",
      "Speaking Agreement Template": "speaking-agreement",
      "Speaker Agreement Template": "speaker-agreement",
      "Leadership Workshop Agreement Template": "leadership-workshop-proposal",
    };

    return map[title] || "proposal";
  };

  const handleOpenEditor = () => {
    localStorage.removeItem("Calculation");
    navigate(`/create/${generateRouteSlug(data.title)}/${data.id}`);
  };

  const handleViewTemplate = () => {
    if (userStatus === "ACTIVATE TRIAL") {
      setOpenModal(true);
    } else {
      navigate("/viewproposal", { state: { data } });
    }
  };

  return (
    <>
      <Card
        className="apt-card"
        hoverable
        cover={
          <img
            src="https://www.adobe.com/dc-shared/assets/images/frictionless/og-images/og-word-to-pdf.jpg"
            className="apt-card-image"
            alt="Template"
          />
        }
      >
        {/* FIX: Use h5 instead of Typography.Title when using innerHTML */}
        <h5
          className="apt-card-title"
          dangerouslySetInnerHTML={{ __html: data.title }}
        />

        {/* CONDITIONS FOR BUTTONS */}
        {data.proposal_type === "EDITABLE" ? (
          userStatus === "ACTIVATE TRIAL" ? (
            <Button variant="outline" onClick={() => setOpenModal(true)}>
              Edit Template
            </Button>
          ) : (
            <Button variant="default" onClick={handleOpenEditor}>
              Edit Template
            </Button>
          )
        ) : (
          <Button variant="secondary">
            <div className="apt-view-row">
              <span onClick={handleViewTemplate}>View Template</span>

              {userStatus === "ACTIVATE" && (
                <span
                  onClick={() => handleDownload()}
                  className="apt-download-icon"
                >
                  <FaFileDownload width={18} height={18} />
                </span>
              )}
            </div>
          </Button>
        )}
      </Card>

      {/* MODAL */}
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        centered
      >
        <Typography.Title level={4}>Subscription Required</Typography.Title>

        <Typography.Paragraph>
          You need to subscribe to access this feature.
        </Typography.Paragraph>

        <div className="apt-modal-actions">
          <Button onClick={() => setOpenModal(false)} variant="outline">
            Close
          </Button>

          <Link
            to="https://www.sendowl.com/s/digital/automated-pricing-tool-by-lafleur-leadership-books/"
            className="apt-subscribe-link"
          >
            <Button variant="default">Subscribe to create an account</Button>
          </Link>
        </div>
      </Modal>
    </>
  );
}
